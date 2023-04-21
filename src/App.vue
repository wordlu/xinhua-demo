<script>
import appConfig from '@src/app.config'
import DevicePixelRatio from '@utils/rem.js'
export default {
  page: {
    // All subcomponent titles will be injected into this template.
    titleTemplate(title) {
      title = typeof title === 'function' ? title(this.$store) : title
      return title ? `${title} | ${appConfig.title}` : appConfig.title
    }
  },
  created() {
    new DevicePixelRatio().init()
  }
}
</script>

<template>
  <div id="app">
    <!--
    Even when routes use the same component, treat them
    as distinct and create the component again.
    -->
    <RouterView />
  </div>
</template>

<!-- This should generally be the only global CSS in the app. -->
<style lang="scss">
// Allow element/type selectors, because this is global CSS.
// stylelint-disable selector-max-type, selector-class-pattern

// Normalize default styles across browsers,
// https://necolas.github.io/normalize.css/
@import '~normalize.css/normalize.css';
// Style loading bar between pages.
// https://github.com/rstacruz/nprogress
@import '~nprogress/nprogress.css';
@import '@assets/scss/index.scss';

body,
html {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
#app {
  // @extend %typography-small;
  height: 100%;
  // font-family: $system-default-font-family;
}

// ===
// Base element styles
// ===

a {
  text-decoration: none;
}

// ===
// Vendor
// ===

#nprogress .bar {
  // background: $color-main;
}
</style>
<style lang="scss" scoped>
::v-deep .el-select__tags,
::v-deep .el-cascader__tags {
  flex-wrap: unset;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
