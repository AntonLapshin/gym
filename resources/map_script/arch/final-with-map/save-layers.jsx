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
    var items = collectSpecialLayersB(theCopy);
    var theBoundsArray = [];

    var file = new File(docPath + '/info.txt');
    file.open("w");

    var level = null;

    for (var i = 0; i < items.length; i++)
    {
        var item = items[i];
        var theLayerSet = item[0];
        var theBitmapLayer = item[1][0];

        var newLevel = parseInt(theBitmapLayer.parent.parent.name);
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

        var xText = theBitmapLayer.bounds[0].toString();
        var yText = theBitmapLayer.bounds[1].toString();

        var x = parseInt(xText.substr(0, xText.length - 3));
        var y = parseInt(yText.substr(0, yText.length - 3));

        var id = theBitmapLayer.parent.name;

        theBitmapLayer.visible = true;
        var theParent = theBitmapLayer.parent;
        while (theParent != theCopy)
        {
            theParent.visible = true;
            theParent = theParent.parent
        }

        theCopy.activeLayer = theBitmapLayer;
        hideOtherLayers();
        theCopy.trim();

        var theFile = new File(docPath + "/" + level + "_" + id + ".png");
        theCopy.exportDocument(theFile, ExportType.SAVEFORWEB, webOptions);

        var maps = [];

        for (var p = 0; p < item[2].length; p++)
        {
            var pathLayer = item[2][p];

            theCopy.activeLayer = pathLayer;
            var thePath = theCopy.pathItems[theCopy.pathItems.length - 1];
            var thePathArray = collectPathInfo(theCopy, thePath);

//            for (var e = 0; e < thePathArray.length; e++)
//            {
//                for (var t = 0; t < thePathArray[e].length; t++)
//                {
//                    thePathArray[e][t] = Math.round(parseInt(thePathArray[e][t].toString()));
//                    //thePathArray[e] = thePathArray[e].split('.')[0];
//                }
//            }

            maps.push(thePathArray);
        }
        writePref(file, id, x, y, maps);
        theCopy.activeHistoryState = theCopy.historyStates[0];
    }

    file.writeln('  ]');
    file.writeln('}');
    file.close()

    theCopy.close(SaveOptions.DONOTSAVECHANGES);
    app.preferences.rulerUnits = originalRulerUnits;
}

function collectPathInfo(myDocument, thePath)
{
    var originalRulerUnits = app.preferences.rulerUnits;
    app.preferences.rulerUnits = Units.POINTS;
    var theArray = [];
    for (var i = 0; i < thePath.subPathItems.length; i++)
    {
        theArray[i] = [];
        for (var j = 0; j < thePath.subPathItems[i].pathPoints.length; j++)
        {
//            var theAnchor = thePath.subPathItems[i].pathPoints[j].anchor;
//            theArray[i][j] = [theAnchor];
//            var theAnchor = thePath.subPathItems[i].pathPoints[j].x + ',' + thePath.subPathItems[i].pathPoints[j].x;
//            theArray[i][j] = [theAnchor];

            var theAnchor = thePath.subPathItems[i].pathPoints[j].anchor;
            var x = theAnchor.toString().split(',')[0];
            var y = theAnchor.toString().split(',')[1];
            var value = "" + Math.round(x) + "," + Math.round(y);
            theArray[i][j] = value;
        }
    }

    app.preferences.rulerUnits = originalRulerUnits;
    return theArray
}

function writePref(file, id, x, y, maps)
{
    file.write(
        '       { id: ' + id + ', x: ' + x + ', y: ' + y +
            ", map1: '" + maps[0] + "'" +
            (maps[1] != undefined ? ", map2: '" + maps[1] + "'" : '') +
            ' },\r\n');
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

function collectSpecialLayersB(parent, items)
{
    if (!items)
    {
        items = [];
    }
    for (var i = parent.layers.length - 1; i >= 0; i--)
    {
        var layer = parent.layers[i];
        if (layer.typename == "ArtLayer")
        {
            if (layer.name == "image")
            {
                items[items.length - 1][1].push(layer);
            }
            else if (layer.name == "map")
            {
                items[items.length - 1][2].push(layer);
            }
        }
        else
        {
            if (layer.name[0] == "m")
            {
                items.push([layer, [], []]);
            }
            allLayers = collectSpecialLayersB(layer, items);
        }
    }
    return items
}
