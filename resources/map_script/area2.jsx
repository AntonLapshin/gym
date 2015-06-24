// saves clipped pngs of certain layers and the vector path info of certain other layers;
// 2011, use it at your own risk;
#target photoshop
var myDocument = app.activeDocument;
// thanks to xbytor;
var docName = myDocument.name;
var basename = docName.match(/(.*)\.[^\.]+$/)[1];
try {var docPath = myDocument.path}
catch (e) {var docPath = "~/Desktop"};
// png options;
var webOptions = new ExportOptionsSaveForWeb();
webOptions.format = SaveDocumentType.PNG;
webOptions.PNG8 = false;
webOptions.transparency = true;
webOptions.includeProfile = false;
webOptions.optimized = true;
// duplicate image;
var theCopy = myDocument.duplicate ("copy", false);
// get the layers;
var theLayers = collectSpecialLayersB(theCopy);
// operate on the bitmap layers;
for (var m = 0; m < theLayers.length; m++) {
     var theArray = theLayers[m];
     if (theArray.length > 1) {
          var theLayerSet = theArray[0];
          var theBitmapLayer = theArray[1];
          theBitmapLayer.visible = true;
          var theParent = theBitmapLayer.parent;
          while (theParent != theCopy) {
               theParent.visible = true;
               theParent = theParent.parent
               };
          theCopy.activeLayer = theBitmapLayer;
          hideOtherLayers();
          theCopy.trim();
// save png;
          var theFile = new File(docPath+"/"+basename+"_"+theLayerSet.name+"_"+theBitmapLayer.name+".png");
          theCopy.exportDocument(theFile, ExportType.SAVEFORWEB, webOptions);
// save path-info;
          try {
               var pathLayer = theArray[2];
// get the path info;
               theCopy.activeLayer = pathLayer;
               var thePath = theCopy.pathItems[theCopy.pathItems.length - 1];
               var theArray = collectPathInfo (theCopy, thePath);
               writePref(theArray, docPath+"/"+basename+"_"+theLayerSet.name.replace(" ", "-")+"_"+pathLayer.name+"_path.txt");
               }     
          catch (e) {};
          };
     theCopy.activeHistoryState = theCopy.historyStates[0];
     };
// close the opy;
theCopy.close(SaveOptions.DONOTSAVECHANGES);
////////////////////////////////////
////////////////////////////////////
////////////////////////////////////
////// function to collect path-info as text //////
function collectPathInfo (myDocument, thePath) {
var originalRulerUnits = app.preferences.rulerUnits;
app.preferences.rulerUnits = Units.POINTS;
var theArray = [];
for (var b = 0; b < thePath.subPathItems.length; b++) {
     theArray[b] = [];
     for (var c = 0; c < thePath.subPathItems[b].pathPoints.length; c++) {
          var pointsNumber = thePath.subPathItems[b].pathPoints.length;
          var theAnchor = thePath.subPathItems[b].pathPoints[c].anchor;
//          var theLeft = thePath.subPathItems[b].pathPoints[c].leftDirection;
//          var theRight = thePath.subPathItems[b].pathPoints[c].rightDirection;
//          var theKind = thePath.subPathItems[b].pathPoints[c].kind;
//          theArray[b][c] = [theAnchor, theLeft, theRight, theKind];
          theArray[b][c] = [theAnchor];
          };
//     var theClose = thePath.subPathItems[b].closed;
//     theArray = theArray.concat(String(theClose))
     };
app.preferences.rulerUnits = originalRulerUnits;
return theArray
};
////// function to write a preference-file storing a text //////
function writePref (theText, thePath) {
  try {
    var thePrefFile = new File(thePath);
    thePrefFile.open("w");
    for (var m = 0; m < theText.length; m ++) {
      thePrefFile.write(theText[m])
      };
    thePrefFile.close()
    }
  catch (e) {};
  };
////// hide other layers //////
function hideOtherLayers () {
// =======================================================
var idShw = charIDToTypeID( "Shw " );
    var desc2 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var list1 = new ActionList();
            var ref1 = new ActionReference();
            var idLyr = charIDToTypeID( "Lyr " );
            var idOrdn = charIDToTypeID( "Ordn" );
            var idTrgt = charIDToTypeID( "Trgt" );
            ref1.putEnumerated( idLyr, idOrdn, idTrgt );
        list1.putReference( ref1 );
    desc2.putList( idnull, list1 );
    var idTglO = charIDToTypeID( "TglO" );
    desc2.putBoolean( idTglO, true );
executeAction( idShw, desc2, DialogModes.NO );
};
////// function to collect special layers //////
function collectSpecialLayersB (theParent, allLayers) {
     if (!allLayers) {var allLayers = new Array};
     for (var m = theParent.layers.length - 1; m >= 0;m--) {
          var theLayer = theParent.layers[m];
// apply the function to layersets;
          if (theLayer.typename == "ArtLayer") {
// get the bitmap-layers;
               if (theLayer.name.slice(0,6) == "Bitmap" && theLayer.parent.name == "Image" && theLayer.parent.parent.name.slice(0,6) == "Object") {
                    allLayers[allLayers.length - 1].push(theLayer);
                    };
// get the form-layers;
               if (theLayer.name.slice(0,4) == "Form" && theLayer.parent.name == "Bounding Shape" && theLayer.parent.parent.name.slice(0,6) == "Object") {
                    allLayers[allLayers.length - 1].push(theLayer);
                    };
               }
// process layersets;
          else {
               if (theLayer.name.slice(0,6) == "Object") {
                    allLayers.push([theLayer]);
                    };
               allLayers = collectSpecialLayersB(theLayer, allLayers)
               }
          };
     return allLayers
     };