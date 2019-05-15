var map = new ol.Map({
	layers: [google, lyr_EsriSatellite_1],
	target: 'map',
	
	controls: ol.control.defaults({
		attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
			collapsible: true,
		})
	}),
	view: new ol.View({
		center: [-5758082.04,-2024314.37],
		zoom: 15
	})
});

var swipe = document.getElementById('swipe');
lyr_EsriSatellite_1.on('precompose', function(event) {
	var ctx = event.context;
	var width = ctx.canvas.width * (swipe.value / 100);
	ctx.save();
	ctx.beginPath();
	ctx.rect(width, 0, ctx.canvas.width - width, ctx.canvas.height);
	ctx.clip();
});
lyr_EsriSatellite_1.on('postcompose', function(event) {
	var ctx = event.context;
	ctx.restore();
});
swipe.addEventListener('input', function() {
	map.render();
}, true);

var vector = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: './layers/test2.geojson',
    format: new ol.format.GeoJSON()
  })
});
map.addLayer(vector);

