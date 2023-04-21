// export { default as tagsViewModule } from './tagsViewModule'
// export { default as user } from './user'
const files = require.context('.', true, /\.module.js$/);
let modules = {};

files.keys().forEach((key) => {
  let temp = modules[key.replace(/(\.\/|\.module.js)/g, '')];
  if (!temp) {
    temp = {};
  }
  modules[key.replace(/(\.\/|\.module.js)/g, '')] = Object.assign(
    temp,
    files(key).default
  );
});

export default modules;
