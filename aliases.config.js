const path = require('path')
const fs = require('fs')
const prettier = require('prettier')

const aliases = {
  '@': '.',
  '@src': 'src',
  '@api': 'src/api',
  '@libs': 'src/libs',
  '@router': 'src/router',
  '@views': 'src/views',
  '@layouts': 'src/layouts',
  '@components': 'src/components',
  '@assets': 'src/assets',
  '@utils': 'src/utils',
  '@store': 'src/store',
  '@mixins': 'src/mixins',
  '@icons': 'src/assets/icons'
}

module.exports = {
  webpack: {},
  jest: {},
  jsconfig: {}
}

for (const alias in aliases) {
  const aliasTo = aliases[alias]
  module.exports.webpack[alias] = resolveSrc(aliasTo)
  const aliasHasExtension = /\.\w+$/.test(aliasTo)
  module.exports.jest[`^${alias}$`] = aliasHasExtension
    ? `<rootDir>/${aliasTo}`
    : `<rootDir>/${aliasTo}/index.js`
  module.exports.jest[`^${alias}/(.*)$`] = `<rootDir>/${aliasTo}/$1`
  module.exports.jsconfig[alias + '/*'] = [aliasTo + '/*']
  module.exports.jsconfig[alias] = aliasTo.includes('/index.')
    ? [aliasTo]
    : [
        aliasTo + '/index.js',
        aliasTo + '/index.json',
        aliasTo + '/index.vue',
        aliasTo + '/index.scss',
        aliasTo + '/index.css'
      ]
}

const jsconfigTemplate = require('./jsconfig.template') || {}
const jsconfigPath = path.resolve(__dirname, 'jsconfig.json')

fs.writeFile(
  jsconfigPath,
  prettier.format(
    JSON.stringify({
      ...jsconfigTemplate,
      compilerOptions: {
        ...(jsconfigTemplate.compilerOptions || {}),
        paths: module.exports.jsconfig
      }
    }),
    {
      ...require('./.prettierrc'),
      parser: 'json'
    }
  ),
  error => {
    if (error) {
      throw error
    }
  }
)

function resolveSrc(_path) {
  return path.resolve(__dirname, _path)
}
