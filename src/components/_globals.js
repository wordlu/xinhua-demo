// Globally register all base components for convenience, because they
// will be used very frequently. Components are registered using the
// PascalCased version of their file name.

import Vue from 'vue';

// import Authentication from './authorize';
// import TableRowDeleteConfirm from './TableRowDeleteConfirm';
// import TableDropdown from './TableDropdown';
// import SelectCheckBox from './selectCheckBox';
// import ProgressMask from './ProgressMask';

// 使用横杠命名法注册公共组件
function switchPascalCased2slash(name) {
  return name.replace(/[A-Z]/g, function(match, pos) {
    let result = match.toLowerCase();
    if (pos !== 0) {
      result = `-${result}`;
    }
    return result;
  });
}

// https://webpack.js.org/guides/dependency-management/#require-context
const requireComponent = require.context(
  // Look for files in the current directory
  '.',
  // Do not look in subdirectories
  true,
  // Only include "_base-" prefixed .vue files
  /^\.\/Base[\w]+\/index\.[\w]+/
);
// For each matching file name...
requireComponent.keys().forEach((fileName) => {
  // Get the component config
  const componentConfig = requireComponent(fileName);
  // Get the PascalCase version of the component name
  const componentName = (componentConfig.default || componentConfig)['name'];
  // Globally register the component
  Vue.component(
    switchPascalCased2slash(componentName),
    componentConfig.default || componentConfig
  );
});

// Vue.component('authorize', Authentication.Authorize);
// Vue.component('table-row-delete-confirm', TableRowDeleteConfirm);
// Vue.component('tableDropdown', TableDropdown);
// Vue.component('selectCheckBox', SelectCheckBox);
// Vue.component('ProgressMask', ProgressMask);
