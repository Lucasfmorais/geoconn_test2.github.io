var map = new ol.Map({
    target: 'map',
    layers: layersList,
    view: new ol.View({
      center: ol.proj.fromLonLat([-51.7257015,-17.8869303]),
      zoom: 15
    })
  });

var vector = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: './layers/test2.geojson',
    format: new ol.format.GeoJSON()
  })
});
map.addLayer(vector);

