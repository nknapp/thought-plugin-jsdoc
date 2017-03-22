const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const glob = Promise.promisify(require('glob'))
const dox = require('dox')

module.exports = {
  /**
   * Use dox and doxme to create markdown from public jsdoc-comments. This only works for javascript-files
   *
   * The
   *
   * Intended use
   *
   * ```hbs
   * {{dox globPattern}}
   * {{#each .}}
   * # {{filename}}
   *
   * {{/each}}
   * {{/dox}}
   *
   * ```
   *
   * @param {string} globPattern a glob-pattern to find the files
   * @param {object} options
   * @param {function} options.fn function for rendering the parsed dox-comments
   * @return {{filename: string, jsdoc: string}[]} a jsdoc-string for each resolved file
   */
  dox: function (globPattern, options) {
    return glob(globPattern)
      .then(files => {
        if (files.length === 0) {
          throw new Error(`Could not find file(s) "${globPattern}" to extract jsdoc-comments from.`)
        }

        const promises = files.map((file) => {
          return fs.readFileAsync(file, {encoding: 'utf-8'})
            .then(contents => {
              return {
                comments: normalize(dox.parseComments(contents, {raw: true})),
                file: file
              }
            })
        })
        // pass comment-objects into the block-function and return the result
        return Promise.all(promises).then((files) => options.fn({
          files,
          singleFile: files.length === 1
        }))
      })
  },

  /**
   * Call the helper block for each item an concatenate the results
   * using the separator
   * @param {object} array the input items for the block
   * @param {string} separator the separator between the blocks
   * @param {object} options handlebars-options parameter
   */
  doxEachSeparated: function (array, separator, options) {
    return `${array.map(item => options.fn(item)).join(separator)}`
  },

  /**
   * Remove newline-characters from the string
   * @param string
   */
  doxSingleLine: function (string) {
    return string.replace(/\n/g, ' ')
  }
}

/**
 * Normalize a dox-comment to make it easier to write a template
 *
 * Inspiration taken from https://github.com/tmcw-up-for-adoption/doxme/blob/master/index.js
 *
 * @param {object[]} comments the parsed dox-comment objects
 */
function normalize (comments) {
  return comments.map(function (c) {
    const tags = groupBy(c.tags, (tag) => tag.type)

    const name =
      // Use an alias-tag as name
      firstTags(tags, ['alias', 'function', 'func', 'method']) ||
      // or the module name
      firstTags(tags, ['module'], (tag) => tag.string.replace('/', '.')) ||
      // or the name of the function/method ...
      (c.ctx && c.ctx.name)

    // Those tags are parsed by dox for visibility
    const visibility =
      firstTag(tags, ['public', 'private', 'protected', 'api'], tag => tag.visibility) ||
      // @access is jsdoc-standard, but not parsed as visibilty by dox
      firstTag(tags, ['access'], tag => tag.string)

    const params = tags['param'] || []

    return {
      name,
      signature: `(${params.map(p => p.name).join(', ')})`,
      examples: tags['example'],
      returns: firstTag(tags, ['returns', 'return']),
      params: tags['param'],
      description: c.description,
      public: visibility === 'public',
      protected: visibility === 'protected',
      private: visibility === 'private',
      visibility
    }
  })
}

/**
 * Group an array of objects by a key
 * @param {array} array the array
 * @param {function} keyFn the function computing the key for each element
 */
function groupBy (array, keyFn) {
  var result = {}
  array.forEach((item) => {
    var key = keyFn(item)
    if (result[key] === undefined) {
      result[key] = []
    }
    result[key].push(item)
  })
  return result
}

/**
 * Get all instances of the first tag-type that matches any of the given types.
 * Precendence is the order of the types.
 * @param {object<Tag>} tagsByType
 * @param {string[]} types
 * @param {function} transform a function that transforms the found value
 */
function firstTags (tags, types, transform = (a => a)) {
  var type = types.find((type) => tags[type])
  if (type) {
    return tags[type].map(transform)
  }
  return undefined
}

/**
 * Get the first instance of the first tag-type that matches any of the given types.
 * Precendence is the order of the types.
 * @param {object<Tag>} tagsByType
 * @param {string[]} types the requested tag types
 * @param transform a function that transforms the found value
 */
function firstTag (tags, types, transform = (a => a)) {
  const selectedTags = firstTags(tags, types, transform)
  return selectedTags && selectedTags[0]
}
