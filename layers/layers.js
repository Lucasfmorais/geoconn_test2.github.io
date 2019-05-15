var google = new ol.layer.Tile({
	'title': 'Google Satellite',
	'type': 'base',
	'opacity': 1.00000,
	source: new ol.source.XYZ({
	attributions:  new ol.Attribution({
	html: 'Mapas de base:<a href="https://www.google.com/intl/pt_US/help/terms_maps/">Google</a>&nbsp;e &nbsp;<a href="https://www.esri.com/en-us/legal/terms/services">Esri</a>'
	}),
		url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
	})
});
var lyr_geoconn2_2 = new ol.layer.Tile({   
	'title': 'geoconn2',
	'type': 'base',
	'opacity': 1.000000,
	source: new ol.source.XYZ({
		attributions: '<a href=""></a>',
		url: 'https://storage.googleapis.com/land_test/Test_landSAt/{z}/{x}/{y}.jpg'
	})
});
var lyr_geconn1_1 = new ol.layer.Tile({
	'title': 'geconn1',
	'type': 'base',
	'opacity': 1.000000,
	source: new ol.source.XYZ({
		url: 'https://storage.googleapis.com/wgs_test/Test_wgs_qgis/{z}/{x}/{y}.jpg'
	})
});
var lyr_geoconn3_3 = new ol.layer.Tile({
	'title': 'geoconn3',
	'type': 'base',
	'opacity': 1.000000,
	source: new ol.source.XYZ({
		url: 'https://storage.googleapis.com/wgs_test/Test_wgs_qgis2/{z}/{x}/{y}.jpg'
	})
});
var lyr_EsriSatellite_1 = new ol.layer.Tile({
	'title': 'Esri Satellite',
	'type': 'base',
	'opacity': 1.000000,
	source: new ol.source.XYZ({
		url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
	})
});