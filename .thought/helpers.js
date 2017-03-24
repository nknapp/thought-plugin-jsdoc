var files = require('customize/helpers-io').files

module.exports = {
  'thought-plugin-config': function (options) {
    // Load from current working directory (makes it easier to extract this functionality
    // into its only plugin
    var plugin = require(process.cwd())
    return require('customize')()
      .registerEngine('handlebars', docEngine)
      .load(plugin)
      .buildConfig()
      .then((config) => {
        return options.fn(config)
      })
  }
}

/**
 * This engine converts the configuration into a format that may be passed used in the handlebars template
 * for documentation
 */
var docEngine = {
  defaultConfig: {},
  defaultWatched: [],
  preprocessConfig: function (config) {
    return {
      templates: files(config.templates),
      partials: files(config.partials),
      preprocessor: config.preprocessor,
      helpers: config.helpers
    }
  },

  run: function (config) {
    return config
  }
}
