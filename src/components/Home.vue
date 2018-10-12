<template>
  <div id="app">
    <div style="background-color: #fff; height: 100vh;">
        <header class="header">
            <div class="brand-box">
                <span class="brand"><h1 style="margin-top: 0; padding-top: 20px;">MapAnyPlace</h1></span>
            </div>
            
            <div class="text-box">
                <h1 class="heading-primary">
                    <span class="heading-primary-main">A custom card design application</span>
                    <span class="heading-primary-sub">With Mapbox</span>
                </h1>
                <router-link to="/map" class="btn btn-white btn-animated">Get started</router-link>
            </div>
        </header>
    </div>
    <div style="position: relative; z-index: 9999; background-color: #fff;">
      
    </div>
    <div style="background-color: #fff; height: 100vh;"></div>

    <div style="position: relative;">
      <parallax :fixed="true" style="min-height: 100vh">
        <img src="../assets/amsterdam.jpg">
      </parallax>
    </div>

    <div style="background-color: #fff; height: 100vh;"></div>
    <footer>
        <parallax class="footer" style="height: 50vh;">
            <h1>Footer</h1>
        </parallax>
    </footer>
  </div>
</template>

<script src="../assets-bundler/javascripts/home.js"></script>
<style src="../assets-bundler/styles/home.scss"></style>