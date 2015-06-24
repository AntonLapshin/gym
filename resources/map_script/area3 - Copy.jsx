// saves clipped pngs of certain layers and the vector path info of certain other layers;
// bitmap layers have to be named �Bitmap� + number, and reside in �Image� in �Object� + number;
// vector layers have to be named �Form� + number, and reside in �Bounding Shape� in �Object� + number;
// 2011, use it at your own risk;
#target photoshop

if (app.documents.length > 0)
{
    var myDocument = app.activeDocument;
    var originalRulerUnits = app.preferences.rulerUnits;
    app.preferences.rulerUnits = Units.POINTS;

    var docName = myDocument.name;
    if (docName.indexOf(".") != -1)
    {
        var basename = docName.match(/(.*)\.[^\.]+$/)[1]
    }
    else
    {
        var basename = docName
    }
    try
    {
        var docPath = myDocument.path
    }
    catch (e)
    {
        var docPath = "~/Desktop"
    }
    var webOptions = new ExportOptionsSaveForWeb();
    webOptions.format = SaveDocumentType.PNG;
    webOptions.PNG8 = false;
    webOptions.transparency = true;
    webOptions.includeProfile = false;
    webOptions.optimized = true;

    var theCopy = myDocument.duplicate("copy", false);
    var theLayers = collectSpecialLayersB(theCopy);
    var theBoundsArray = new Array;
    for (var m = 0; m < theLayers.length; m++)
    {
        var theArray = theLayers[m];
        for (var n = 0; n < theArray[1].length; n++)
        {
            var theLayerSet = theArray[0];
            var theBitmapLayer = theArray[1][n];
            var theNumber = theBitmapLayer.name.slice(7, theBitmapLayer.name.length);
            theBoundsArray.push([theBitmapLayer.name, theBitmapLayer.bounds]);
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

            var theFile = new File(docPath + "/" + basename + "_" + theLayerSet.name + "_" + theBitmapLayer.name + ".png");
            theCopy.exportDocument(theFile, ExportType.SAVEFORWEB, webOptions);
// check for a form-layer with the corresponding number;
            for (var p = 0; p < theArray[2].length; p++)
            {
                try
                {
                    var pathLayer = theArray[2][p];
                    var thisNumber = pathLayer.name.slice(5, pathLayer.name.length);
                    if (Number(theNumber) == Number(thisNumber))
                    {
// get the path info;
                        theCopy.activeLayer = pathLayer;
                        var thePath = theCopy.pathItems[theCopy.pathItems.length - 1];
                        var thePathArray = collectPathInfo(theCopy, thePath);
// save path-info;
                        writePref(thePathArray,
                            docPath + "/" + basename + "_" + theLayerSet.name.replace(" ", "-") + "_" + pathLayer.name + ".txt");
                    }
                }
                catch (e)
                {
                }
            }
            theCopy.activeHistoryState = theCopy.historyStates[0];
        }
    }
    alert(theBoundsArray.join("\n\n"));
    theCopy.close(SaveOptions.DONOTSAVECHANGES);
    app.preferences.rulerUnits = originalRulerUnits;
}

////// function to collect path-info as text //////
function collectPathInfo(myDocument, thePath)
{
    var originalRulerUnits = app.preferences.rulerUnits;
    app.preferences.rulerUnits = Units.POINTS;
    var theArray = [];
    for (var b = 0; b < thePath.subPathItems.length; b++)
    {
        theArray[b] = [];
        for (var c = 0; c < thePath.subPathItems[b].pathPoints.length; c++)
        {
            var pointsNumber = thePath.subPathItems[b].pathPoints.length;
            var theAnchor = thePath.subPathItems[b].pathPoints[c].anchor;
//          var theLeft = thePath.subPathItems[b].pathPoints[c].leftDirection;
//          var theRight = thePath.subPathItems[b].pathPoints[c].rightDirection;
//          var theKind = thePath.subPathItems[b].pathPoints[c].kind;
//          theArray[b][c] = [theAnchor, theLeft, theRight, theKind];
            theArray[b][c] = [theAnchor];
        }
//     var theClose = thePath.subPathItems[b].closed;
//     theArray = theArray.concat(String(theClose))
    }

    app.preferences.rulerUnits = originalRulerUnits;
    return theArray
}

////// function to write a preference-file storing a text //////
function writePref(theText, thePath)
{
    try
    {
        var thePrefFile = new File(thePath);
        thePrefFile.open("w");
        for (var m = 0; m < theText.length; m++)
        {
            thePrefFile.write(theText[m])
        }
        thePrefFile.close()
    }
    catch (e)
    {
    }
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

function collectSpecialLayersB(theParent, layers)
{
    var allLayers = layers;
    if (!allLayers) {var allLayers = new Array}
    for (var m = theParent.layers.length - 1; m >= 0; m--)
    {
        var theLayer = theParent.layers[m];
        if (theLayer.typename == "ArtLayer")
        {
            if (theLayer.name == "image")
            {
                allLayers[allLayers.length - 1][1].push(theLayer);
            }
            else if (theLayer.name == "map")
            {
                allLayers[allLayers.length - 1][2].push(theLayer);
            }
        }
        else
        {
//            if (theLayer.name.match(new RegExp('^_' + '[0-9]{1,3}', 'i')))
//            {
                allLayers.push([theLayer, [], []]);
//            }
            allLayers = collectSpecialLayersB(theLayer, allLayers)
        }
    }
    return allLayers
}
