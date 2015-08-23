//#target photoshop

if (app.documents.length > 0) {
    var myDocument = app.activeDocument;
    var originalRulerUnits = app.preferences.rulerUnits;
    app.preferences.rulerUnits = Units.POINTS;

    var docName = myDocument.name;
    var basename, docPath;
    if (docName.indexOf(".") != -1) {
        basename = docName.match(/(.*)\.[^\.]+$/)[1]
    }
    else {
        basename = docName
    }

    try {
        docPath = myDocument.path + '/output';
    }
    catch (e) {
        docPath = "~/Desktop"
    }

    var webOptions = new ExportOptionsSaveForWeb();
    webOptions.format = SaveDocumentType.PNG;
    webOptions.PNG8 = false;
    webOptions.transparency = true;
    webOptions.includeProfile = false;
    webOptions.optimized = true;

    var theCopy = myDocument.duplicate("copy", false);
    //var items = collectSpecialLayersB(theCopy);
    //var theBoundsArray = [];

    var outputFolder = new Folder(docPath);
    if (!outputFolder.exists)
        outputFolder.create();
    var file = new File(docPath + '/info.txt');
    file.open("w");
    file.writeln('[');
    //var level = null;

    var levels = getLevels(theCopy);
    for (var i = 0; i < levels.length; i++) {
        var handler = function (type) {
            for (var j = 0; j < level[type].length; j++) {
                var layer = level[type][j];
                if (layer.name == "image" || layer.name == "shorts") {

                    var name = layer.name == "image" ? type : layer.name;

                    layer.visible = true;
                    var theParent = layer.parent;
                    while (theParent != theCopy) {
                        theParent.visible = true;
                        theParent = theParent.parent;
                    }

                    theCopy.activeLayer = layer;
                    hideOtherLayers();
                    //theCopy.trim();

                    var theFile = new File(docPath + "/" + level._id + "_" + name + ".png");
                    theCopy.exportDocument(theFile, ExportType.SAVEFORWEB, webOptions);
                    theCopy.activeHistoryState = theCopy.historyStates[0];
                }
                else {
                    theCopy.activeLayer = layer;
                    var thePath = theCopy.pathItems[theCopy.pathItems.length - 1];
                    var thePathArray = collectPathInfo(theCopy, thePath);
                    file.writeln('      { _id: ' + layer.name + ", map: '" + thePathArray + "' },");
                    var thePathMirrorArray = collectPathInfo(theCopy, thePath, true);
                    file.writeln('      { _id: ' + layer.name + ", map: '" + thePathMirrorArray + "' },");
                }
            }
        };

        var level = levels[i];
        file.writeln('  {');
        file.writeln('    _id: ' + level._id + ',');
        file.writeln('    front: [');

        handler("front");

        //file.writeln('    ],');
        //file.writeln('    back: [');

        //handler("back");

        file.writeln('    ]');
        file.writeln('  },');
    }

    file.writeln(']');
    file.close();

    theCopy.close(SaveOptions.DONOTSAVECHANGES);
    app.preferences.rulerUnits = originalRulerUnits;
}

function collectPathInfo(myDocument, thePath, mirror) {
    var originalRulerUnits = app.preferences.rulerUnits;
    app.preferences.rulerUnits = Units.POINTS;
    var theArray = [];
    for (var i = 0; i < thePath.subPathItems.length; i++) {
        theArray[i] = [];
        for (var j = 0; j < thePath.subPathItems[i].pathPoints.length; j++) {
            var theAnchor = thePath.subPathItems[i].pathPoints[j].anchor;
            var x = theAnchor.toString().split(',')[0];
            var y = theAnchor.toString().split(',')[1];
            var value;
            if (mirror)
                value = "" + (201 + (201 - Math.round(x))) + "," + Math.round(y);
            else
                value = "" + Math.round(x) + "," + Math.round(y);
            theArray[i][j] = value;
        }
    }

    app.preferences.rulerUnits = originalRulerUnits;
    return theArray
}

function writePref(file, id, x, y, maps) {
    file.write(
        '       { id: ' + id + ', x: ' + x + ', y: ' + y +
        ", map1: '" + maps[0] + "'" +
        (maps[1] != undefined ? ", map2: '" + maps[1] + "'" : '') +
        ' },\r\n');
}

function hideOtherLayers() {
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

function getLevels(parent) {
    var levels = [];
    for (var i = parent.layers.length - 1; i >= 0; i--) {
        var o = {};
        var level = parent.layers[i];
        o._id = level.name;

        for (var j = 0; j < level.layers.length; j++) {
            var type = level.layers[j];
            o[type.name] = [];

            for (var k = 0; k < type.layers.length; k++) {
                var layer = type.layers[k];
                o[type.name].push(layer);
            }
        }
        levels.push(o);
    }
    return levels;
}

function collectSpecialLayersB(parent, items) {
    if (!items) {
        items = [];
    }
    for (var i = parent.layers.length - 1; i >= 0; i--) {
        var layer = parent.layers[i];
        if (layer.typename == "ArtLayer") {
            if (layer.name == "image") {
                items[items.length - 1][1].push(layer);
            }
            else if (layer.name == "map") {
                items[items.length - 1][2].push(layer);
            }
        }
        else {
            if (layer.name[0] == "m") {
                items.push([layer, [], []]);
            }
            allLayers = collectSpecialLayersB(layer, items);
        }
    }
    return items
}
