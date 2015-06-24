//#target photoshop

if (app.documents.length > 0)
{
    var myDocument = app.activeDocument;
    var originalRulerUnits = app.preferences.rulerUnits;
    app.preferences.rulerUnits = Units.POINTS;

    var docName = myDocument.name;
    var basename, docPath;
    if (docName.indexOf(".") != -1)
    {
        basename = docName.match(/(.*)\.[^\.]+$/)[1]
    }
    else
    {
        basename = docName
    }

    try
    {
        docPath = myDocument.path
    }
    catch (e)
    {
        docPath = "~/Desktop"
    }

    var webOptions = new ExportOptionsSaveForWeb();
    webOptions.format = SaveDocumentType.PNG;
    webOptions.PNG8 = false;
    webOptions.transparency = true;
    webOptions.includeProfile = false;
    webOptions.optimized = true;

    var theCopy = myDocument.duplicate("copy", false);
    var layers = [];
    setLayers(theCopy, layers);

    var file = new File(docPath + '/info.txt');
    file.open("w");

    var level = null;

    for (var i = 0; i < layers.length; i++)
    {
        var layer = layers[i];
        //var theLayerSet = item[0];
        //var theBitmapLayer = item[1][0];

        var newLevel = parseInt(layer.parent.name);
        if (level != newLevel)
        {
            if (level != null)
            {
                file.writeln('  ]');
                file.writeln('},');
            }
            file.writeln('{');
            file.writeln('  level: ' + newLevel + ',');
            file.writeln('  muscles: [');
            level = newLevel;
        }

        var xText = layer.bounds[0].toString();
        var yText = layer.bounds[1].toString();

        var x = parseInt(xText.substr(0, xText.length - 3));
        var y = parseInt(yText.substr(0, yText.length - 3));

        var id = layer.name;

        layer.visible = true;
        var parent = layer.parent;
        while (parent != theCopy)
        {
            parent.visible = true;
            parent = parent.parent;
        }

        theCopy.activeLayer = layer;
        hideOtherLayers();
        theCopy.trim();

        var pngFile = new File(docPath + "/" + level + "_" + id + ".png");
        theCopy.exportDocument(pngFile, ExportType.SAVEFORWEB, webOptions);

        writeInfo(file, id, x, y);
        theCopy.activeHistoryState = theCopy.historyStates[0];
    }

    file.writeln('  ]');
    file.writeln('}');
    file.close()

    theCopy.close(SaveOptions.DONOTSAVECHANGES);
    app.preferences.rulerUnits = originalRulerUnits;
}

function writeInfo(file, id, x, y)
{
    file.write('       { id: ' + id + ', x: ' + x + ', y: ' + y + ' },\r\n');
}

function hideOtherLayers()
{
    var idShw = charIDToTypeID("Shw ");
    var desc2 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var list1 = new ActionList();
    var ref1 = new ActionReference();
    var idLyr = charIDToTypeID("Lyr ");
    var idOrdn = charIDToTypeID("Ordn");
    var idTrgt = charIDToTypeID("Trgt");
    ref1.putEnumerated(idLyr, idOrdn, idTrgt);
    list1.putReference(ref1);
    desc2.putList(idnull, list1);
    var idTglO = charIDToTypeID("TglO");
    desc2.putBoolean(idTglO, true);
    executeAction(idShw, desc2, DialogModes.NO);
}

function setLayers(parent, layers)
{
    for (var i = parent.layers.length - 1; i >= 0; i--)
    {
        var layer = parent.layers[i];
        if (layer.typename == "ArtLayer")
        {
            layers.push(layer);
        }
        else setLayers(layer, layers);
    }
}
