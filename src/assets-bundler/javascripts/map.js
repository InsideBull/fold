/*Map*/
import Spin from '../../components/Spin.vue'
import template from '../../assets/pin.png';

export default {
    components: {
        Spin
    },
    data() {
        return {
            height: '400px',
            width: '800px',
            dialog: false,
            drawer: null,
            markerDrawer: null,
            hauteur: '400px',
            longueur: '800px',
            slider: 12,
            map: null,
            testMarkerListeToggle: false,
            pincolor: '008000',
            defaultColor: "#ff0000",
            geojson: {
                type: "FeatureCollection",
                features: [],
            },
            accessToken: 'pk.eyJ1IjoiYXJhZGltaXNvbiIsImEiOiJjamwzY2F5bGExdTAyM3ZvZGw0YWM4MXMzIn0.x-OlbsTxKnwonoGNOlgMYw',
            image: '',
            spinner: false
        }
    },
    computed: {
        fullYear() {
            return new Date().getFullYear()
        }
    },
    mounted() {
        this.clearLog();
        this.initMap();
        //this.load()
        //this.loadMarkersLayer();
        //printToPdf()
        this.compteID()
        this.listAllMarker();
        this.geojson = this.jsonToGeojson();
    },
    methods: {
        /** Attach zoom control to slider */
        slideZoom() {
            this.map.setZoom(this.slider);
        },
        /** Show search with location on the markers menu */
        markerFormTrue() {
            return this.testMarkerListeToggle = true;
        },
        /** Show search with coordinates on the markers menu */
        markerFormFalse() {
            return this.testMarkerListeToggle = false;
        },
        /** Set map height */
        setHeight() {
            return this.hauteur = this.height;
        },
        /** Set map width */
        setWidth() {
            return this.longueur = this.width;
        },
        /**
         * Resize the map canvas
         * @method setSize
         * @return {height, width, redefinir}
         */
        setSize() {
            var heightMap = this.setHeight();
            var widthMap = this.setWidth();
            var redefinirDimensionMap = this.setResize(heightMap, widthMap);
            return {
                heightMap, widthMap, redefinirDimensionMap
            }
        },
        setResize(height, width) {
            var mapCanvas = document.getElementsByClassName('mapboxgl-canvas')[0];
            var heightCanvas = mapCanvas.style.height = height;
            var widthCanvas = mapCanvas.style.width = width;
            return {
                heightCanvas, widthCanvas
            }
        },
        /**
         * Update the map after resize
         * @method retour
         * @return {Promise}
         */
        retour() {
            return new Promise((resolve, reject) => {
                if (this.setSize()) {
                    setTimeout( () => {
                        resolve(this.map.resize())
                    }, 250)
                }
                else {
                    reject('error')
                }
            })
        },
        /**
         * Menu toggle
         * @method rideau
         * @return {void}
         */
        rideau() {
            if (window.matchMedia("(max-width: 1300px)").matches) {
                
            }
            else {
                if (this.drawer) {
                    document.getElementById('btnToolFull').style.marginLeft = '300px';
                }
                else {
                    document.getElementById('btnToolFull').style.marginLeft = '0px';
                    this.markerDrawer = true;
                }
            }
        },
        /**
         * Initialize the map
         * @method initMap
         * @return {void}
         */
        initMap() {

            /** Mapbox access token */
            mapboxgl.accessToken = this.accessToken
            /** Draw map */
            this.map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/aradimison/cjm8vrk716bnn2rjlv9xba3h1',
                center: [2.321, 48.859],
                zoom: 12,
                pitch: 0,
                bearing: 360,
                interactive: true,
            });   
            
            this.clearLog();
            this.jsonToGeojson().features.forEach(marker => {
                // When a click event occurs on a feature in the markers layer, open a popup at the
                // location of the feature, with description HTML from its properties
                this.map.on('click', marker.properties.name, e => {
                    // Ensure that if the map is zoomed out such that multiple
                    // copies of the feature are visible, the popup appears
                    // over the copy being pointed to
                    while (Math.abs(e.lngLat.lng - marker.geometry.coordinates[0]) > 180) {
                        marker.geometry.coordinates[0] += e.lngLat.lng > marker.geometry.coordinates[0] ? 360 : -360;
                    }
                    new mapboxgl.Popup()
                        .setLngLat(marker.geometry.coordinates)
                        .setHTML(marker.properties.popup)
                        .addTo(this.map);
                })

                // Change the cursor to a pointer when the mouse is over the markers layer
                this.map.on('mouseenter', marker.properties.name, () => {
                    this.map.getCanvas().style.cursor = 'pointer';
                });

                // Change it back to a pointer when it leaves.
                this.map.on('mouseleave', marker.properties.name, () => {
                    this.map.getCanvas().style.cursor = '';
                });


                var sary = 'data:image/png;base64,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';
                this.mapLayer(marker, sary, 2000);

            });

            /** Full screen control */
            this.map.addControl(new mapboxgl.FullscreenControl());

            /** Create a geocoder for location */
            const geocoder = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                placeholder: 'Search a location'
            });
            document.getElementById('geocoder').appendChild(geocoder.onAdd(this.map))

            /** On geocoder result */
            geocoder.on('result', ev => {
                
            })

            /** create a marker geocoder control */
            var markerGeocoder = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                placeholder: 'Search a location to mark'
            });
            document.getElementById('markerGeocoder').appendChild(markerGeocoder.onAdd(this.map))

            this.map.on('load', updateGeocoderProximity);
            this.map.on('moveend', updateGeocoderProximity);

            /** Marker geocoder on result */
            markerGeocoder.on('result', ev => {

                var customPopup = '<img src="'+this.image+'" height="80px" width="120px"><br>'+document.getElementById('popupmsg').value+'<p>Hello<p/>';
                var idMarker = this.compteID() + 1;

                var marker = {
                    //popup: document.getElementById('popupmsg').value,
                    idMarker: idMarker.toString(),
                    popup: customPopup,
                    name: document.getElementById('markerName').value,
                    emp: ev.result.geometry.coordinates,
                    image: this.imageToBase64(this.defaultColor),
                    upload: this.image
                }

                this.storeMarker(marker);
                //this.loadMarkersLayer();
                this.addMarker(marker, template);
                this.clearMarkerList();
                this.listAllMarker();

            });

            /** User location control */
            this.map.addControl(new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true
            }));

            var base = this;
            function updateGeocoderProximity() {
                if (base.map.getZoom() > 9) {
                    var center = base.map.getCenter().wrap();
                    markerGeocoder.setProximity({ longitude: center.lng, latitude: center.lat });
                } else {
                    markerGeocoder.setProximity(null);
                }
            }

        },

        /**
         * Set map marker layer
         * 
         * @param {Array} marker - Marker propreties   
         * @param {String} icon - URL of icon image for the marker
         * @param {Number} time - Time for time out to load map style
         * @method mapLayer 
         */
        mapLayer(marker, icon, time) {
            console.log(marker.properties.numero)
            this.map.loadImage(icon, (error, image) => {
                if (error) {
                    throw error;
                }
                this.map.addImage(marker.properties.name, image);

                setTimeout(() => {
                    this.map.addLayer({
                        'id': marker.properties.name,
                        'type': 'symbol',
                        'source': {
                            'type': 'geojson',
                            'data': {
                                'type': 'FeatureCollection',
                                'features': [{
                                    'type': 'Feature',
                                    'geometry': {
                                        'type': 'Point',
                                        'coordinates': marker.geometry.coordinates
                                    },
                                    "properties": {
                                        "icon": marker.properties.name,
                                        //"icon": "marker"
                                    }
                                }]
                            }
                        },
                        'layout': {
                            "icon-image": "{icon}",
                            "icon-size": 0.8,
                            "icon-allow-overlap": true,
                            "icon-ignore-placement": true,
                            "text-field": marker.properties.numero,
                            "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                            "text-size": 20,
                            "text-offset": [-0.1, -0.2],
                            "text-anchor": "center"
                        },
                        "paint": {
                            "text-color": "#fff"
                        },
                    });
                }, time)
            });
        },

        /**
         * Add marker to map using layer
         * @param {Array} marker - Marker data properties 
         * @param {String} icon - URL for icon image
         * @method addMarker
         */
        addMarker(marker, icon) {
            this.map.loadImage(icon, (error, image) => {
                if (error) {
                    throw error;
                }
                this.map.addImage(marker.name, image);
                this.map.addLayer({
                    'id': marker.name,
                    'type': 'symbol',
                    'source': {
                        'type': 'geojson',
                        'data': {
                            'type': 'FeatureCollection',
                            'features': [{
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': marker.emp
                                }
                            }]
                        }
                    },
                    'layout': {
                        'icon-image': marker.name,
                        'icon-size': 0.8,
                        "icon-allow-overlap": true,
                        "icon-ignore-placement": true,
                        "text-field": marker.idMarker,
                        "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                        "text-size": 25,
                        "text-offset": [0, -0.2]
                    },
                    "paint": {
                        "text-color": "#fff"
                    },
                });
            });
            this.map.on('click', marker.name, e => {
                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to
                while (Math.abs(e.lngLat.lng - marker.emp[0]) > 180) {
                    marker.emp[0] += e.lngLat.lng > marker.emp[0] ? 360 : -360;
                }
                new mapboxgl.Popup()
                    .setLngLat(marker.emp)
                    .setHTML(marker.popup)
                    .addTo(this.map);
            })
        },

        /**
         * Mark a map with the coordinates
         * @method markerLongLat
         * @return {void}
         */
        markerLongLat() {
            var img = this.imageToBase64(this.defaultColor);

            var lat = document.getElementById('markerLat').value;
            var lng = document.getElementById('markerLong').value;
            var idMarker = (this.compteID() + 1).toString();
            var marker = {
                idMarker: idMarker,
                popup: document.getElementById('popupmsg').value,
                emp: ([parseFloat(lng), parseFloat(lat)]),
                image: img
            }

            /** create a DOM element for the marker */
            const element = document.createElement('div');
            element.className = 'marker';
            element.style.background = img;

            this.storeMarker(marker)

            /** Create a popup to marker */
            const popup = new mapboxgl.Popup({ offset: 25 })
                .setHTML('<img src="'+this.image+'" height="80px" width="120px"><br>'+document.getElementById('popupmsg').value+"<p>Hello<p/>");

            /** create a marker */
            new mapboxgl.Marker(element)
                .setLngLat([document.getElementById('markerLong').value, document.getElementById('markerLat').value])
                .setPopup(popup)
                .addTo(this.map);

            //Fly to the coordinates
            this.map.flyTo({
                center: [
                    document.getElementById('markerLong').value,
                    document.getElementById('markerLat').value
                ]
            });
        },

        /**
         * Mark a map with the coordinates
         * @method coordinatesAddMarker
         * @return {void}
         */
        coordinatesAddMarker() {
            var customPopup = '<img src="' + this.image + '" height="80px" width="120px"><br>' + document.getElementById('popupmsg').value + '<p>Hello<p/>';
            var idMarker = this.compteID() + 1;
            var lat = document.getElementById('markerLat').value;
            var lng = document.getElementById('markerLong').value;

            var marker = {
                idMarker: idMarker.toString(),
                popup: customPopup,
                name: document.getElementById('markerName').value,
                emp: ([parseFloat(lng), parseFloat(lat)]),
                image: this.imageToBase64(this.defaultColor),
                upload: this.image
            }

            this.storeMarker(marker);
            this.addMarker(marker, template);
            this.clearMarkerList();
            this.listAllMarker();

            //Fly to the coordinates
            this.map.flyTo({
                center: [
                    document.getElementById('markerLong').value,
                    document.getElementById('markerLat').value
                ]
            });
        },

        /** Change map style to dark */
        darkStyle() {
            this.map.setStyle('mapbox://styles/mapbox/dark-v9');
            this.load();
        },
        /** Change map style to bright */
        brightStyle() {
            this.map.setStyle('mapbox://styles/mapbox/bright-v9');
            this.load();
        },
        /** Change map style to night */
        nightStyle() {
            this.map.setStyle('mapbox://styles/aradimison/cjm8vrk716bnn2rjlv9xba3h1');
            this.load();
        },
        /** Change map style to basic */
        basicStyle() {
            this.map.setStyle('mapbox://styles/mapbox/basic-v9');
            this.load();
        },
        /** Change map style to street */
        streetStyle() {
            this.map.setStyle('mapbox://styles/mapbox/streets-v9');
            this.load();
        },
        /** Change map style to satellite */
        satelliteStyle() {
            this.map.setStyle('mapbox://styles/mapbox/satellite-v9');
            this.load();
        },

        /**
         * convert image to base64
         * @method imageToBase64
         * @param {string} pincolor - the color of image
         * @return {String} the base64 for image
         */
        imageToBase64(pincolor) {
            var svg = '<svg version="1.1" class="pinlogo" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 52 52" style="enable-background:new 0 0 52 52;" xml:space="preserve"> <path class="mark" fill="' + pincolor + '" d="M38.853,5.324L38.853,5.324c-7.098-7.098-18.607-7.098-25.706,0h0C6.751,11.72,6.031,23.763,11.459,31L26,52l14.541-21C45.969,23.763,45.249,11.72,38.853,5.324z M26.177,24c-3.314,0-6-2.686-6-6 s2.686-6,6-6s6,2.686,6,6S29.491,24,26.177,24z"/></svg>';
            var encoded = window.btoa(svg);
            var style = "url(data:image/svg+xml;base64," + encoded + ")";
            return style;
        },
        /**
         * convert image to base64
         * @method base64
         * @param {string} pincolor - A hexadecimal color 
         * @return {string}
         */
        base64(pincolor) {
            var svg = '<svg version="1.1" class="pinlogo" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 52 52" style="enable-background:new 0 0 52 52;" xml:space="preserve"> <path class="mark" fill="' + pincolor + '" d="M38.853,5.324L38.853,5.324c-7.098-7.098-18.607-7.098-25.706,0h0C6.751,11.72,6.031,23.763,11.459,31L26,52l14.541-21C45.969,23.763,45.249,11.72,38.853,5.324z M26.177,24c-3.314,0-6-2.686-6-6 s2.686-6,6-6s6,2.686,6,6S29.491,24,26.177,24z"/></svg>';
            var encoded = window.btoa(svg);
            var style = "data:image/svg+xml;base64," + encoded + "";
            return style;
        },

        /**
         * Store the marker to localstorage and geojson data
         * @method storeMarker
         * @param {string} marker - A marker object
         * @return {void}
         */
        storeMarker(marker) {
            this.clearLog()
            localStorage.setItem(document.getElementById('markerName').value, JSON.stringify(marker));
            var geojson = {
                type: "FeatureCollection",
                features: [],
            }
            geojson.features.push({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": marker.emp
                },
                "properties": {
                    "id": document.getElementById('markerName').value,
                    "numero": marker.idMarker,
                    "name": document.getElementById('markerName').value,
                    "popup": marker.popup,
                    "image": marker.image
                }
            });
        },

        /**
         * Show sign in form
         * @method showForm
         * @return {boolean}
         */
        showForm() {
            return this.dialog = true
        },

        /**
         * Show marker toggle
         * @method allMarker
         */
        allMarker() {
            this.markerDrawer = false;
            this.clearLog()
            this.clearMarkerList()
            this.listAllMarker();
        },

        /**
         * Clear current list of markers
         * @method clearMarkerList
         */
        clearMarkerList() {
            var elem = document.getElementById("ulMarker");
            elem.parentNode.removeChild(elem)
        },
        

        /**
         * Convert json to geojson
         * @method jsonToGeojson
         * @return {Array}
         */
        jsonToGeojson() {
            var geojson = {
                type: "FeatureCollection",
                features: [],
            }
            this.clearLog()
            var keys = Object.keys(localStorage);
            keys.forEach(function (key) {
                var markers = localStorage.getItem(key);
                markers = JSON.parse(markers);

                geojson.features.push({
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": markers.emp
                    },
                    "properties": {
                        "id": markers.popup,
                        "numero": markers.idMarker,
                        "name": markers.name,
                        "popup": markers.popup,
                        "image": markers.image
                    }
                });
            });
            return geojson;
        },

        /**
         * Load markers on map with mapboxgl.Marker
         * @method loadMarkersLayer
         * @return {void}
         */
        loadMarkersLayer() {
            this.clearLog()
            this.jsonToGeojson().features.forEach(marker => {
                /** create a DOM element for the marker */
                var el = document.createElement('div');
                el.className = 'marker';
                el.style.backgroundImage = marker.properties.image;

                /** create a popup for the marker */
                const popup = new mapboxgl.Popup({ offset: 25 })
                    .setHTML(marker.properties.popup);

                /** add marker to map */
                new mapboxgl.Marker(el)
                    .setLngLat(marker.geometry.coordinates)
                    .setPopup(popup)
                    .addTo(this.map);
            });
        },

        /**
         * Load markers on map with layer
         * @method load
         * @return {void}
         */
        load() {
            this.clearLog()
            this.jsonToGeojson().features.forEach(marker => {
                this.mapLayer(marker, template, 1000);
            });
        },

        /**
         * List of all markers
         * @method listAllMarker
         * @return {void}
         */
        listAllMarker() {
            var ul = document.createElement('ul');
            ul.id = 'ulMarker';
            document.getElementById('liste').appendChild(ul);
            this.jsonToGeojson().features.forEach(marker => {
                var li = document.createElement('li');
                li.id = 'listeMarker';
                li.className = marker.properties.name;
                ul.appendChild(li);
                li.innerHTML += '<span>'+marker.properties.numero+'-&nbsp;</span><span class="markerTitle" >' + marker.properties.name + '</span>&nbsp;<v-btn class="btn btn-primary" id="btnDelMarker"></v-btn>';
                
                /** Remove marker in localStorage and in the map layer */
                li.childNodes[3].addEventListener('click', () => {
                    localStorage.removeItem(marker.properties.name);
                    this.map.removeLayer(marker.properties.name);
                    localStorage.removeItem('loglevel:webpack-dev-server');
                    this.clearMarkerList()
                    this.listAllMarker()
                });

                /** Fly to marker location */
                li.addEventListener('click', e => {
                    this.testMarkerListeToggle = true;
                    /*document.getElementById('markerLat').value = marker.geometry.coordinates[1];
                    document.getElementById('markerLong').value = marker.geometry.coordinates[0];*/
                    //document.getElementById('markerName').value = marker.properties.name;
                    //document.getElementById('popupmsg').value = marker.properties.popup;

                    this.map.flyTo({
                        center: [
                            marker.geometry.coordinates[0],
                            marker.geometry.coordinates[1]
                        ]
                    });
                });
            })
        },

        /**
         * Print map to PDF 
         * 
         * @method print
         */
        print() {
            var printPdf = require('mapbox-print-pdf');
            this.spinner = true;
            var template = `
                <div data-scale-height="margin-top" id="footer" class="footer">
                <sapn>Hello</span>
                </div>
            `
            var elementClonedCb = (elem) => {
                elem.removeAttribute("id");
            }

            printPdf.build()
                .format("a2")
                .footer({
                    html: template,
                    baseline: { format: "a4", orientation: "p" }
                }, elementClonedCb)
                .scale({ maxWidthPercent: 10, unit: "metric" })
                .print(this.map, mapboxgl)
                .then((pdf) => {
                    pdf.save("map.pdf");
                    this.spinner = false;
                });
        },

        /**
         * Update localstorage data
         * @param {String} value localStorage key
         * @param {Number} longitude 
         * @param {Number} latitude
         * @method updateStorage 
         */
        updateStorage(value, longitude, latitude) {
            var request = localStorage.getItem(value);
            if(request != null){
                var data = JSON.parse(request);
                data.emp[0] = longitude;
                data.emp[1] = latitude;
                localStorage.setItem(value, JSON.stringify(data))
                console.log('Data exist', data);
            }
            else{
                console.log('Data inexist')
            }
        },

        /**
         * @method clearLog - Remove loglevel:webpack-dev-server to localstorage
         */
        clearLog() {
            localStorage.removeItem('loglevel:webpack-dev-server');
        },
       
        onSelectImage(dataImages){
            /*for(var i = 0; i < this.dataImages.length; i++){
                console.log(this.dataImages[i].src);
            }*/
            console.log(dataImages.src)
        },

        /**
         * Recupere URL of uploaded image
         * @param {String} file - Image selected
         * @method onImageFileChange
         * @returns {String} - image url to base64 
         */
        onImageFileChange(file) {
            var files = file[0];
            console.log(files.size)
            if (files.size > 500000) {
                console.log('Fichier lourd',files.size)
            }
            else {
                var fr = new FileReader();
                fr.onload = () => {
                    this.image = fr.result;
                }
                fr.readAsDataURL(files);
            }
        },

        /**
         * Count number of key in localstorage to calculate number of marker
         * @method compteID
         * @return {Number} - Number of key
         */
        compteID(){
            var keys = Object.keys(localStorage);
            if(keys[0] == "loglevel:webpack-dev-server"){
                return 0;
            }
            else{
                return keys.length;
            }
        },
    },
    props: {
        source: String,
        // Use "value" to enable using v-model
        value: Object,
    }
}