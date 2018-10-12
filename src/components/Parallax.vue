<template>
  <div v-bind:class="[sectionClass]" ref="block" v-bind:style="{ height: sectionHeight + 'vh' }">
    <div
      v-bind:class="[parallax ? parallaxClass : '', fixed ? fixedClass : '', containerClass]"
      ref="parallax"
      >
      <slot></slot>
    </div>
  </div>
</template>

<script src="../assets-bundler/javascripts/parallax.js"></script>
<style src="../assets-bundler/styles/parallax.scss" lang="scss"></style>