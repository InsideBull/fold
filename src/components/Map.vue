<template>
  <v-app id="inspire">
    <v-toolbar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      color="#5ac4bb"
      dark
      app
      fixed
    >
      <v-toolbar-title>
        <span><router-link to="/">MapAnyPlace</router-link></span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="#5ac4bb" @click="showForm()">
        <span>Sign in</span>
      </v-btn>
      <v-dialog v-model="dialog" width="500">
        <v-card class="sign" light>
          <v-card-title
            class="title"
          >
            Sign in
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field label="Email" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="Password" type="password" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm12>
                  <v-select
                    :items="['0-17', '18-29', '30-54', '54+']"
                    label="Age"
                    required
                  ></v-select>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" flat @click.native="dialog = false">Cancel</v-btn>
            <v-btn color="#5ac4bb" flat @click.native="dialog = false">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-navigation-drawer
      :clipped="$vuetify.breakpoint.lgAndUp"
      v-model="drawer"
      fixed
      app
    >
      <v-list dense>
            <v-expansion-panel>
                <v-expansion-panel-content>
                <div slot="header" class="item">Location</div>
                <v-card>
                   <v-container grid-list-md>
                      <v-flex xs12 sm12>
                        <div id="geocoder" class="geocoder"></div>
                      </v-flex>
                   </v-container>
                </v-card>
                </v-expansion-panel-content>
                <v-expansion-panel-content>
                <div slot="header" class="item">Style</div>
                <v-card>
                   <v-container grid-list-md>
                      <v-layout>

                        <v-flex xs6 sm6>
                          <v-tooltip top>
                            <v-avatar
                              class="rotating"
                              :size="100"
                              color="grey lighten-4"
                              slot="activator"
                              @click="streetStyle()"
                            >
                              <img src="../assets/street.png" alt="street">
                            </v-avatar>
                            <span>Street</span>
                          </v-tooltip>
                        </v-flex>

                        <v-flex xs6 sm6>
                          <v-tooltip top>
                            <v-avatar
                              class="rotating"
                              :size="100"
                              color="grey lighten-4"
                              slot="activator"
                              @click="nightStyle()"
                            >
                              <img src="../assets/night.png" alt="night">
                            </v-avatar>
                            <span>Night</span>
                          </v-tooltip>
                        </v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs6 sm6>
                          <v-tooltip top>
                            <v-avatar
                              class="rotating"
                              :size="100"
                              color="grey lighten-4"
                              slot="activator"
                              @click="darkStyle()"
                            >
                              <img src="../assets/dark.png" alt="dark">
                            </v-avatar>
                            <span>Dark</span>
                          </v-tooltip>
                        </v-flex>

                        <v-flex xs6 sm6>
                          <v-tooltip top>
                            <v-avatar
                              class="rotating"
                              :size="100"
                              color="grey lighten-4"
                              slot="activator"
                              @click="basicStyle()"
                            >
                              <img src="../assets/basic.png" alt="basic">
                            </v-avatar>
                            <span>Basic</span>
                          </v-tooltip>
                        </v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs6 sm6>
                          <v-tooltip top>
                            <v-avatar
                              class="rotating"
                              :size="100"
                              color="grey lighten-4"
                              slot="activator"
                              @click="brightStyle()"
                            >
                              <img src="../assets/bright.png" alt="bright" id="bright">
                            </v-avatar>
                            <span>Bright</span>
                          </v-tooltip>
                        </v-flex>
                        <v-flex xs6 sm6>
                          <v-tooltip top>
                            <v-avatar
                              class="rotating"
                              :size="100"
                              color="grey lighten-4"
                              slot="activator"
                              @click="satelliteStyle()"
                            >
                              <img src="../assets/satellite.png" alt="satellite">
                            </v-avatar>
                            <span>Satellite</span>
                          </v-tooltip>
                        </v-flex>
                      </v-layout>
                   </v-container>
                </v-card>
                </v-expansion-panel-content>
                <v-expansion-panel-content>
                <div slot="header" class="item">Size</div>
                <v-card>
                   <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs12>
                          <v-text-field label="Height" v-model="height"></v-text-field>
                        </v-flex>  
                        <v-flex xs12>  
                          <v-text-field label="Width" v-model="width"></v-text-field>
                        </v-flex>
                        <v-btn light color="primary" @click="retour()">Apply</v-btn>
                      </v-layout>
                      <v-flex style="margin-top: 40px;">
                        <v-slider
                          v-model="slider"
                          label="Zoom"
                          max="20"
                          @change="slideZoom()"
                        ></v-slider>
                        <div class="text-xs-center">
                          <v-chip label outline color="#5ac4bb">{{slider}}</v-chip>
                        </div>
                      </v-flex>
                   </v-container>
                </v-card>
                </v-expansion-panel-content>
                <v-expansion-panel-content>
                  <div slot="header" class="item">Markers</div>
                  <v-card>
                    <v-card-text>
                        <v-container grid-list-md>
                          <v-layout wrap>
                            <v-flex xs12>
                              <v-text-field label="Name" required id="markerName"></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                              <v-text-field label="Popup" required id="popupmsg"></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                              <input type="file"
                                      ref="file"
                                      id="file"
                                      @change="onImageFileChange($event.target.files)"
                              >
                            </v-flex>
                          </v-layout>
                        </v-container>
                        <v-container grid-list-md>
                          <v-flex xs12>
                    
                              <!-- <colorpicker :color="defaultColor" v-model="defaultColor"/>   -->
                          </v-flex>
                          <!-- <v-flex xs12>
                              <v-btn light color="white" id="pin"></v-btn>
                              <v-btn light color="white" id="flagPin"><v-icon></v-icon></v-btn>
                              <v-btn light color="white" id="simplePin"><v-icon></v-icon></v-btn>
                              <v-btn light color="white"><v-icon></v-icon></v-btn>
                          </v-flex> -->
                        </v-container>
                      <v-container grid-list-md v-if="testMarkerListeToggle == true">
                          <v-flex xs12 sm12>
                            <v-text-field label="Longitude" id="markerLong"></v-text-field><br>
                            <v-text-field label="Latitude" id="markerLat"></v-text-field><br>
                            <div id="markerGeocoder" class="markerGeocoder" style="display: none"></div>
                            <v-btn light color="primary" @click="coordinatesAddMarker()">Apply</v-btn>
                          </v-flex>
                      </v-container>
                      <v-container grid-list-md v-else>
                        <v-flex xs12 sm12>
                          <div id="markerGeocoder" class="markerGeocoder"></div>
                        </v-flex>
                      </v-container>
                      <v-container grid-list-md>
                        <v-btn light color="primary" @click="allMarker()">All markers</v-btn><br><br>
                        <span class="" v-if="testMarkerListeToggle == true"><a href="#" @click="markerFormFalse()">A partir d'une recherche</a></span>
                        <span class="" v-else><a href="#" @click="markerFormTrue()">A partir des coordonnées</a></span>
                      </v-container>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
            </v-expansion-panel>
            <v-btn @click="print()">Print</v-btn>
     <img :src="image"> 
    <spin v-show="spinner"></spin>
      </v-list>
    </v-navigation-drawer>
  
    <v-navigation-drawer
      :clipped="$vuetify.breakpoint.lgAndUp"
      v-model="drawer"
      fixed
      app
      class="navigation"
      v-show="markerDrawer == false"
    >
      <v-toolbar
        :clipped-left="$vuetify.breakpoint.lgAndUp"
        light
        app
        fixed
      >
        <v-toolbar-title>
          <span>Markers</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
          <v-icon class="arrow" @click="markerDrawer = true">arrow_back</v-icon>
      </v-toolbar>
      <v-list dense id="liste"></v-list> 
    </v-navigation-drawer>
    <v-content>
      <v-container fluid fill-height justify-center>
        <v-flex>
          <v-card :height="hauteur" :width="longueur" style="margin: 0 auto">
            <v-flex xs12 sm12>
              <v-card :height="hauteur" :width="longueur" style="margin: 0 auto" id="map">
              </v-card>
            </v-flex>
          </v-card>
        </v-flex>
      </v-container>
    </v-content>
    <v-footer height="auto" light class="pa-3">
       <v-flex row wrap class="text-xs-center d-flex align-center">
              <v-tooltip top>
                <v-btn  fab
                        slot="activator"
                        light
                        fixed
                        bottom
                        left
                        v-model="drawer"
                        @click.stop="drawer = !drawer"
                        class="btnTooltip full"
                        id="btnToolFull"
                        @click="rideau()"
                >
                  <v-icon v-if="drawer" class="icon-full" id="icon-full">fullscreen</v-icon>
                  <v-icon id="icon-full_exit" v-else>fullscreen_exit</v-icon>
                </v-btn>
                <span v-if="drawer">Fullscreen</span>
                <span v-else>Exit fullscreen</span>
              </v-tooltip>
      </v-flex>
      <v-spacer></v-spacer>    
      <span id="visible" style="visibility: hidden">{{defaultColor}}</span> 
      <div id="copy">&copy; {{ fullYear }}</div>
    </v-footer>
  </v-app>
</template>

<script src="../assets-bundler/javascripts/map.js"></script>
<style src="../assets-bundler/styles/map.scss"></style>