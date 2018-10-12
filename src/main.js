// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'vue-style-loader'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import FullscreenExit from 'vue-material-design-icons/FullscreenExit.vue'
import 'vue-material-design-icons/styles.css'
import VueRouter from 'vue-router'
import Home from './components/Home'
import Map from './components/Map'
import DragDrop from './components/Dragdrop'
import VueColor from 'vue-color'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueSelectImage from 'vue-select-image'
require('vue-select-image/dist/vue-select-image.css')

Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.component('fullscreenExit-icon', FullscreenExit)
Vue.use(VueRouter)
Vue.use(BootstrapVue)
Vue.use(VueSelectImage)


const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Home },
    { path: '/map', component: Map },
		{ path: '/drag', component: DragDrop }
  ]
})

var Chrome = VueColor.Chrome;
Vue.component('colorpicker', {
  components: {
    'chrome-picker': Chrome,
  },
  template: `
    <div class="input-group color-picker" ref="colorpicker">
    <b-input-group>
        <b-input-group-prepend>
          <b-btn id="btnPicker" @click="togglePicker()"></b-btn>
        </b-input-group-prepend>
        <b-form-input type="text" v-model="colorValue" @focus="showPicker()" @input="updateFromInput"></b-form-input>
        <chrome-picker :value="colors" @input="updateFromPicker" v-if="displayPicker" />
    </b-input-group>
    </div>`,
  props: ['color'],
  data() {
		return {
			colors: {
				hex: '#000000',
			},
			colorValue: '',
			displayPicker: false,
		}
	},
	mounted() {
    this.setColor(this.color || '#000000');
    document.getElementById('btnPicker').style.backgroundColor = this.colorValue;
	},
	methods: {
		setColor(color) {
			this.updateColors(color);
			this.colorValue = color;
		},
		updateColors(color) {
			if(color.slice(0, 1) == '#') {
				this.colors = {
					hex: color
				};
			}
			else if(color.slice(0, 4) == 'rgba') {
				var rgba = color.replace(/^rgba?\(|\s+|\)$/g,'').split(','),
					hex = '#' + ((1 << 24) + (parseInt(rgba[0]) << 16) + (parseInt(rgba[1]) << 8) + parseInt(rgba[2])).toString(16).slice(1);
				this.colors = {
					hex: hex,
					a: rgba[3],
				}
			}
		},
		showPicker() {
			document.addEventListener('click', this.documentClick);
			this.displayPicker = true;
		},
		hidePicker() {
			document.removeEventListener('click', this.documentClick);
			this.displayPicker = false;
		},
		togglePicker() {
			this.displayPicker ? this.hidePicker() : this.showPicker();
		},
		updateFromInput() {
      this.updateColors(this.colorValue);
      document.getElementById('btnPicker').style.backgroundColor = this.colorValue;
		},
		updateFromPicker(color) {
			this.colors = color;
			if(color.rgba.a == 1) {
				this.colorValue = color.hex;
			}
			else {
				this.colorValue = 'rgba(' + color.rgba.r + ', ' + color.rgba.g + ', ' + color.rgba.b + ', ' + color.rgba.a + ')';
			}
		},
		documentClick(e) {
			var el = this.$refs.colorpicker,
				target = e.target;
			if(el !== target && !el.contains(target)) {
				this.hidePicker()
			}
		}
	},
	watch: {
		colorValue(val) {
			if(val) {
				this.updateColors(val);
        this.$emit('input', val);
			}
    }
	},
})

window.mainView = new Vue({
  router,
	template: '<router-view></router-view>'
}).$mount('#app')