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

var lyr_geoconn2 = new ol.layer.Tile({   
	'title': 'geoconn2',
	'type': 'base',
	'opacity': 1.000000,
	source: new ol.source.XYZ({
		attributions: '<a href=""></a>',
		url: 'https://storage.googleapis.com/land_test/Test_landSAt/{z}/{x}/{y}.jpg'
	})
});

var lyr_geconn1 = new ol.layer.Tile({
	'title': 'geconn1',
	'type': 'base',
	'opacity': 1.000000,
	source: new ol.source.XYZ({
		url: 'https://storage.googleapis.com/wgs_test/Test_wgs_qgis/{z}/{x}/{y}.jpg'
	})
});

var lyr_geoconn3 = new ol.layer.Tile({
	'title': 'geoconn3',
	'type': 'base',
	'opacity': 1.000000,
	source: new ol.source.XYZ({
		url: 'https://storage.googleapis.com/wgs_test/Test_wgs_qgis2/{z}/{x}/{y}.jpg'
	})
});

var lyr_EsriSatellite = new ol.layer.Tile({
	'title': 'Esri Satellite',
	'type': 'base',
	'opacity': 1.000000,
	source: new ol.source.XYZ({
		url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
	})
});

var format_bairrosjti_3 = new ol.format.GeoJSON();

var features_bairrosjti_3 = format_bairrosjti_3.readFeatures(json_bairrosjti_3, 
{dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});

var jsonSource_bairrosjti_3 = new ol.source.Vector({attributions: '<a href=""></a>'});

jsonSource_bairrosjti_3.addFeatures(features_bairrosjti_3);

var lyr_bairrosjti_3 = new ol.layer.Vector({
	declutter: true,
	source:jsonSource_bairrosjti_3, 
	style: style_bairrosjti_3,
});

/* --------------configura do menu lateral ----------------*/

/* lyr_bairrosjti_3.setVisible(true); */

var layersList = [google,
];