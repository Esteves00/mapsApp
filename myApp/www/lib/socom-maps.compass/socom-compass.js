var layer;
var divcompass;
// ############################
// Compass
// ############################
L.Control.Compass = L.Control.extend({
	includes: L.Mixin.Events,
	options: {
		position: 'topright',
		title: 'Compass',

	},

	onAdd: function (map) {
		this.map = map;
		var container = L.DomUtil.create('div', 'leaflet-control-bsl');
		this._container = container;
		divcompass = this._container;
		return this._container;
	},
	startWatch: function () {

		// Update compass every 3 seconds
		var options = {
			frequency: 10
		};

		divcompass.style.display = 'compact';
		watchID = navigator.compass.watchHeading(this.onSuccess,
			this.onError, options);
	},

	// fonction appele lors du succes d'appel de la boussole
	onSuccess: function (heading) {
		//element.innerHTML = 'Heading: ' + heading.magneticHeading;
		//	this.rotateCompassImage(heading);

		var magneticHeading = 360 - heading.magneticHeading;
		var rotation = "rotate(" + magneticHeading + "deg)";

		divcompass.style.webkitTransform = rotation;
	},

	//fonction appele lors du l'echec d'appel de la boussole
	onError: function (compassError) {
		alert('Compass error: ' + compassError.code);
	},
	setLayer: function (_layer) {
		if (layer) {
			L.DomEvent.removeListener(layer, 'load', function () {
					layer = _layer;
					L.DomEvent.addListener(layer, 'load', this.startWatch, this);
				}
			);
		} else {
			layer = _layer;
			L.DomEvent.addListener(layer, 'load', this.startWatch, this);
		}

	}

});
L.control.compass = function (map) {
	return new L.Control.Compass(map);

};
