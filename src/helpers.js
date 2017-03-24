const jsdoc2md = require('jsdoc-to-markdown')

/**
 * Uses `jsdoc-to-markdown` to render jsdoc for files matching a given glob pattern
 * @param {string} globPattern a glob-pattern to identify the files to generate docs from
 * @returns {string} the generated API reference as markdown
 * @api public
 */
function jsdoc (globPattern) {
  return jsdoc2md.render({files: globPattern})
}

module.exports = {
  jsdoc
}
