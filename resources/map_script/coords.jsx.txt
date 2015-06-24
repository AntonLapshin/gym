function main() {
	app.preferences.rulerUnits = Units.PIXELS;
	var obj = app.activeDocument;
	var layers = obj.artLayers;
	var positions = [];
	for( var i = 0; i<layers.length; i++) {
		var layer = layers[i];
		if(!layer.visible) continue;
		var x = layer.bounds[0];
		var y = layer.bounds[1];
		var n = layer.name;
		var str = "\t<image url='" + n + "' x='" + x + "' y='" + y + "' />";
		positions.push(str);
	}
	var textfield = layers.add();
	textfield.kind = LayerKind.TEXT;
	textfield.textItem.contents = positions.join("\r");
}
main();