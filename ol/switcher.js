(function (root, factory) {
  if(typeof define === "function" && define.amd) {
    define(["openlayers"], factory);
  } else if(typeof module === "object" && module.exports) {
    module.exports = factory(require("openlayers"));
  } else {
    root.LayerSwitcher = factory(root.ol);
  }
}(this, function(ol) {
    /**
     * OpenLayers v3/v4 Layer Switcher Control.
     * See [the examples](./examples) for usage.
     * @constructor
     * @extends {ol.control.Control}
     * @param {Object} opt_options Control options, extends olx.control.ControlOptions adding:
     *                              **`tipLabel`** `String` - the button tooltip.
     */
    ol.control.LayerSwitcher = function(opt_options) {

        var options = opt_options || {};

        var tipLabel = options.tipLabel ?
          options.tipLabel : 'Legend';

        this.mapListeners = [];

        this.hiddenClassName = 'ol-unselectable ol-control layer-switcher';
        if (ol.control.LayerSwitcher.isTouchDevice_()) {
            this.hiddenClassName += ' touch';
        }
        this.shownClassName = 'shown';

        var element = document.createElement('div');
        element.className = this.hiddenClassName;

        var button = document.createElement('button');
        button.setAttribute('title', tipLabel);
        element.appendChild(button);

        this.panel = document.createElement('div');
        this.panel.className = 'panel';
        element.appendChild(this.panel);
        ol.control.LayerSwitcher.enableTouchScroll_(this.panel);

        var this_ = this;

        button.onmouseover = function(e) {
            this_.showPanel();
        };

        button.onclick = function(e) {
            e = e || window.event;
            this_.showPanel();
            e.preventDefault();
        };

        this_.panel.onmouseout = function(e) {
            e = e || window.event;
            if (!this_.panel.contains(e.toElement || e.relatedTarget)) {
                this_.hidePanel();
            }
        };

        ol.control.Control.call(this, {
            element: element,
            target: options.target
        });

    };

    ol.inherits(ol.control.LayerSwitcher, ol.control.Control);

    /**
     * Mostrar o painel da camada.
     */
    ol.control.LayerSwitcher.prototype.showPanel = function() {
        if (!this.element.classList.contains(this.shownClassName)) {
            this.element.classList.add(this.shownClassName);
            this.renderPanel();
        }
    };

    /**
     * Oculta o painel da camada.
     */
    ol.control.LayerSwitcher.prototype.hidePanel = function() {
        if (this.element.classList.contains(this.shownClassName)) {
            this.element.classList.remove(this.shownClassName);
        }
    };

    /**
     * Re-desenha o painel da camada para representar o estado atual das camadas
     */
    ol.control.LayerSwitcher.prototype.renderPanel = function() {

        this.ensureTopVisibleBaseLayerShown_();

        while(this.panel.firstChild) {
            this.panel.removeChild(this.panel.firstChild);
        }

        var ul = document.createElement('ul');
        this.panel.appendChild(ul);
        this.renderLayers_(this.getMap(), ul);

    };

    /**
     * Define a instância do mapa ao qual o controle está associado.
     * @param {ol.Map} map The map instance.
     */
    ol.control.LayerSwitcher.prototype.setMap = function(map) {
        // Limpar ouvintes associados ao mapa anterior
        for (var i = 0, key; i < this.mapListeners.length; i++) {
            ol.Observable.unByKey(this.mapListeners[i]);
        }
        this.mapListeners.length = 0;
        // Conecte os ouvintes etc. e armazene a referência para o novo mapa
        ol.control.Control.prototype.setMap.call(this, map);
        if (map) {
            var this_ = this;
            this.mapListeners.push(map.on('pointerdown', function() {
                this_.hidePanel();
            }));
            this.renderPanel();
        }
    };

    /**
     * Certifica de que somente a 
     * camada de base mais alta esteja visível se mais de uma estiver visível.
     * @private
     */
    ol.control.LayerSwitcher.prototype.ensureTopVisibleBaseLayerShown_ = function() {
        var lastVisibleBaseLyr;
        ol.control.LayerSwitcher.forEachRecursive(this.getMap(), function(l, idx, a) {
            if (l.get('type') === 'base' && l.getVisible()) {
                lastVisibleBaseLyr = l;
            }
        });
        if (lastVisibleBaseLyr) this.setVisible_(lastVisibleBaseLyr, true);
    };

    /**
    * Alterna o estado visível de uma camada. 
    * Cuida de esconder outras camadas no mesmo grupo exclusivo se a camada 
    * estiver ativada.
     * @private
     * @param {ol.layer.Base} The layer whos visibility will be toggled.
     */
    ol.control.LayerSwitcher.prototype.setVisible_ = function(lyr, visible) {
        var map = this.getMap();
        lyr.setVisible(visible);
        if (visible && lyr.get('type') === 'base') {
            // Ocultar todas as outras camadas de base, independentemente do agrupamento
            ol.control.LayerSwitcher.forEachRecursive(map, function(l, idx, a) {
                if (l != lyr && l.get('type') === 'base') {
                    l.setVisible(false);
                }
            });
        }
    };

    /**
     * Renderiza todas as camadas que são filhos de um grupo.
     * @private
     * @param {ol.layer.Base} lyr Layer to be rendered (should have a title property).
     * @param {Number} idx Position in parent group list.
     */
    ol.control.LayerSwitcher.prototype.renderLayer_ = function(lyr, idx) {

        var this_ = this;

        var li = document.createElement('li');

        var lyrTitle = lyr.get('title');
        var lyrId = ol.control.LayerSwitcher.uuid();

        var label = document.createElement('label');

        if (lyr.getLayers && !lyr.get('combine')) {

            li.className = 'group';
            label.innerHTML = lyrTitle;
            li.appendChild(label);
            var ul = document.createElement('ul');
            li.appendChild(ul);

            this.renderLayers_(lyr, ul);

        } else {

            li.className = 'layer';
            var input = document.createElement('input');
            if (lyr.get('type') === 'base') {
                input.type = 'radio';
                input.name = 'base';
            } else {
                input.type = 'checkbox';
            }
            input.id = lyrId;
            input.checked = lyr.get('visible');
            input.onchange = function(e) {
                this_.setVisible_(lyr, e.target.checked);
            };
            li.appendChild(input);

            label.htmlFor = lyrId;
            label.innerHTML = lyrTitle;

            var rsl = this.getMap().getView().getResolution();
            if (rsl > lyr.getMaxResolution() || rsl < lyr.getMinResolution()){
                label.className += ' disabled';
            }

            li.appendChild(label);

        }

        return li;

    };

    /**
     * Render all layers that are children of a group.
     * @private
     * @param {ol.layer.Group} lyr Group layer whos children will be rendered.
     * @param {Element} elm DOM element that children will be appended to.
     */
    ol.control.LayerSwitcher.prototype.renderLayers_ = function(lyr, elm) {
        var lyrs = lyr.getLayers().getArray().slice().reverse();
        for (var i = 0, l; i < lyrs.length; i++) {
            l = lyrs[i];
            if (l.get('title')) {
                elm.appendChild(this.renderLayer_(l, i));
            }
        }
    };

    /**
     * **Static** Call the supplied function for each layer in the passed layer group
     * recursing nested groups.
     * @param {ol.layer.Group} lyr The layer group to start iterating from.
     * @param {Function} fn Callback which will be called for each `ol.layer.Base`
     * found under `lyr`. The signature for `fn` is the same as `ol.Collection#forEach`
     */
    ol.control.LayerSwitcher.forEachRecursive = function(lyr, fn) {
        lyr.getLayers().forEach(function(lyr, idx, a) {
            fn(lyr, idx, a);
            if (lyr.getLayers) {
                ol.control.LayerSwitcher.forEachRecursive(lyr, fn);
            }
        });
    };

    /**
     * Generate a UUID
     * @returns {String} UUID
     *
     * Adapted from http://stackoverflow.com/a/2117523/526860
     */
    ol.control.LayerSwitcher.uuid = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

    /**
    * @private
    * @desc Apply workaround to enable scrolling of overflowing content within an
    * element. Adapted from https://gist.github.com/chrismbarr/4107472
    */
    ol.control.LayerSwitcher.enableTouchScroll_ = function(elm) {
       if(ol.control.LayerSwitcher.isTouchDevice_()){
           var scrollStartPos = 0;
           elm.addEventListener("touchstart", function(event) {
               scrollStartPos = this.scrollTop + event.touches[0].pageY;
           }, false);
           elm.addEventListener("touchmove", function(event) {
               this.scrollTop = scrollStartPos - event.touches[0].pageY;
           }, false);
       }
    };

    /**
     * @private
     * @desc Determine if the current browser supports touch events. Adapted from
     * https://gist.github.com/chrismbarr/4107472
     */
    ol.control.LayerSwitcher.isTouchDevice_ = function() {
        try {
            document.createEvent("TouchEvent");
            return true;
        } catch(e) {
            return false;
        }
    };
    var LayerSwitcher = ol.control.LayerSwitcher;
    return LayerSwitcher;
}));