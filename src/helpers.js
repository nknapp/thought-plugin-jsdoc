const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const glob = Promise.promisify(require('glob'))
const dox = require('dox')
const doxme = require('doxme')

module.exports = {
  /**
   * Use dox and doxme to create markdown from jsdoc-comments. This only works for javascript-files
   *
   * Intended usage
   *
   * ```hbs
   * {{#each (jsdoc globPattern)}}
   * # {{filename}}
   *
   * {{jsdoc}}
   * {{/each}}
   * ```
   *
   * @param {string} globPattern a glob-pattern to find the files
   * @param {string} headerPrefix a string such as '##' that is use as prefix for lines starting with '#' to reduced the header-size
   * @return {{filename: string, jsdoc: string}[]} a jsdoc-string for each resolved file
   */
  jsdoc: function (globPattern, headerPrefix, options, customize) {
    return glob(globPattern)
      .then(files => {
        if (files.length === 0) {
          throw new Error(`Could not find file(s) "${globPattern}" to extract jsdoc-comments from.`)
        }
        return Promise.all(
          files.map((file) => {
            return fs.readFileAsync(file, {encoding: 'utf-8'})
              .then(contents => {
                const parsed = dox.parseComments(contents).filter((comment) => !comment.isPrivate)
                const markdown = doxme(parsed).replace(/^(#+)/gm, `${headerPrefix}$1`)
                return {
                  multipleFiles: files.length > 1,
                  file,
                  markdown,
                  parsed
                }
              })
          })
        )
      })
  }
}
