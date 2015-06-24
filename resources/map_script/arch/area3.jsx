#target photoshop

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
    var theLayers = collectSpecialLayersB(theCopy);
    var theBoundsArray = [];
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
    for (var i = 0; i < thePath.subPathItems.length; i++)
    {
        theArray[i] = [];
        for (var j = 0; j < thePath.subPathItems[i].pathPoints.length; j++)
        {
            //var pointsNumber = thePath.subPathItems[i].pathPoints.length;
            var theAnchor = thePath.subPathItems[i].pathPoints[j].anchor;
            theArray[i][j] = [theAnchor];
        }
    }

    app.preferences.rulerUnits = originalRulerUnits;
    return theArray
}

function writePref(theText, thePath)
{
    try
    {
        var thePrefFile = new File(thePath);
        thePrefFile.open("w");
        for (var i = 0; i < theText.length; i++)
        {
            thePrefFile.write(theText[i])
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

function collectSpecialLayersB(theParent, allLayers)
{
    if (!allLayers) { allLayers = []; }
    for (var i = theParent.layers.length - 1; i >= 0; i--)
    {
        var theLayer = theParent.layers[i];
        if (theLayer.typename == "ArtLayer")
        {
            if (theLayer.name == "image")
            {
                allLayers[allLayers.length - 1][1].push(theLayer);
            }
            else if (theLayer.name == "map")
            {
//                if (allLayers[allLayers.length - 1][2] != undefined)
//                {
//                    allLayers[allLayers.length - 1][3].push(theLayer);
//                }
//                else
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
