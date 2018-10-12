<template>
<div class="v-spinner" v-show="loading">
    <div class="v-scale v-scale1" v-bind:style="[spinnerStyle,spinnerDelay1]">
    </div><div class="v-scale v-scale2" v-bind:style="[spinnerStyle,spinnerDelay2]">
    </div><div class="v-scale v-scale3" v-bind:style="[spinnerStyle,spinnerDelay3]">
    </div><div class="v-scale v-scale4" v-bind:style="[spinnerStyle,spinnerDelay4]">
    </div><div class="v-scale v-scale5" v-bind:style="[spinnerStyle,spinnerDelay5]">
    </div>
  </div>
</template>

<script src="../assets-bundler/javascripts/spin.js"></script>
<style src="../assets-bundler/styles/spin.scss"></style>