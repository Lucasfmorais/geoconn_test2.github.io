/**
 * Elementos que compõem o pop-up.
 */
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');


/**
 * Cria uma sobreposição para ancorar o pop-up no mapa.
 */
var overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
element: container,
autoPan: true,
autoPanAnimation: {
	duration: 250
}
}));


/**
 * Manipulador de cliques para ocultar o pop-up.
 * @return {boolean} Não siga o href.
 */
closer.onclick = function() {
overlay.setPosition(undefined);
closer.blur();
return false;
};

var map = new ol.Map({
	layers: [google, lyr_EsriSatellite_1],
	overlays: [overlay],
	target: 'map',
	
	controls: ol.control.defaults({
		attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
			collapsible: true,
		})
	}),
	view: new ol.View({
		center: ol.proj.fromLonLat([-51.7257015,-17.8869303]),
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

map.on('singleclick', function(evt) {
	var coordinate = evt.coordinate;
	var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
		coordinate, 'EPSG:3857', 'EPSG:4326'));

	content.innerHTML = '<p>Coordenada do ponto:</p><code>' + hdms +
		'</code>';
	overlay.setPosition(coordinate);
  });

  var vector = new ol.layer.Vector({
	source: new ol.source.Vector({
	  url: './layers/test2.geojson',
	  style: style_bairrosjti_3,
	  format: new ol.format.GeoJSON()
	  
	})
  });
  map.addLayer(vector);