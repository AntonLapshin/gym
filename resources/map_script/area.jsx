var myDocument = app.activeDocument;
// insert the correct name in this line;
var theLayer = myDocument.layers.getByName("aaa");
myDocument.activeLayer = theLayer;
var thePath = myDocument.pathItems[myDocument.pathItems.length - 1];
var theArray = collectPathInfo (myDocument, thePath);
alert (theArray.join("\n"));
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
var theLeft = thePath.subPathItems[b].pathPoints[c].leftDirection;
var theRight = thePath.subPathItems[b].pathPoints[c].rightDirection;
var theKind = thePath.subPathItems[b].pathPoints[c].kind;
theArray[b][c] = [theAnchor, theLeft, theRight, theKind];
};
var theClose = thePath.subPathItems[b].closed;
theArray = theArray.concat(String(theClose))
};
app.preferences.rulerUnits = originalRulerUnits;
return theArray
};