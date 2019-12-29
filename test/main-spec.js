/*!
 * thought-plugin-jsdoc <https://github.com/nknapp/thought-plugin-jsdoc>
 *
 * Copyright (c) 2017 Nils Knappmeier.
 * Released under the MIT license.
 */

/* eslint-env mocha */

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-as-promised'))
const expect = chai.expect
const fs = require('fs')
const jsdoc2md = require('jsdoc-to-markdown')

const thought = require('customize')()
  .registerEngine('handlebars', require('customize-engine-handlebars'))
  .load(require('../'))
  .merge({
    handlebars: {
      templates: 'test/fixtures/templates'
    }
  })

describe('thought-plugin-jsdoc:', function () {
  it('the config should have a jsdoc-helper', function () {
    return thought.buildConfig().then(config => {
      expect(config.handlebars.helpers.jsdoc).to.be.ok()
    })
  })

  describe('should throw a meaningful error', function () {
    const render = jsdoc2md.render

    afterEach(function () {
      // Restore original render function (may be changed in tests to throw errors)
      jsdoc2md.render = render
    })

    it('the plugin should throw a meaningful error, if no file could be found by the glob', function () {
      // ... because then the main-property of package.json is probably wrong
      return expect(
        thought
          .merge(packageJsonMain('a-non-existing-file.js'))
          .run()
      ).to.be.rejectedWith('These files do not exist: a-non-existing-file.js')
    })

    it('the plugin should mention that an error has occured during jsdoc creation', function () {
      jsdoc2md.render = function (args) {
        return Promise.reject(new Error('Some test-error'))
      }
      // The "javascript-file.js" does not exist and it does not have to, because in the line above, we have modified
      // the render function to always throw an error
      return expect(
        thought
          .merge(packageJsonMain('javascript-file.js'))
          .run()
      ).to.be.rejectedWith('Error while rendering jsdoc for "javascript-file.js": Some test-error')
    })
  })

  describe('test-scenario:', function () {
    // Computed test-cases for different scenarios, see path below
    const basePath = 'test/fixtures/scenarios'
    fs.readdirSync(basePath).forEach(function (scenario) {
      const scenarioDir = `${basePath}/${scenario}`
      it(scenarioDir, function () {
        // Run the engine

        return thought
          .merge(packageJsonMain(`${scenarioDir}/input*.js`))
          .run()
          .then(result => {
            const expected = fs.readFileSync(`${scenarioDir}/expected.md`, { encoding: 'utf-8' })
            fs.writeFileSync(`${scenarioDir}/actual.md`, result.handlebars['index.md'])
            expect(result.handlebars['index.md']).to.equal(expected)
          })
      })
    })
  })
})

/**
 * Return a mergeable configuration that contains a specific file as the
 * "main"-files from the package.json
 * @param file the main-file
 * @returns {{handlebars: {data: {package: {main: string}}}}}
 */
function packageJsonMain (file) {
  return { handlebars: { data: { package: { main: file } } } }
}
