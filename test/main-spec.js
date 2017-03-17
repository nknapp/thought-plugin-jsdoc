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

  it('the plugin though throw a meaningful error, if no file could be found by the glob', function () {
    // ... because then the main-property of package.json is probably wrong
    return expect(
      thought
        .merge(packageJsonMain('a-non-existing-file.js'))
        .run()
    ).to.be.rejectedWith(`Could not find file(s) "a-non-existing-file.js" to extract jsdoc-comments from.`)
  })

  // Computed test-cases for different scenarios, see path below
  const basePath = 'test/fixtures/scenarios'
  fs.readdirSync(basePath).forEach(function (scenario) {
    const scenarioDir = `${basePath}/${scenario}`
    it('scenario ' + scenarioDir, function () {
      // Run the engine

      return thought
        .merge(packageJsonMain(`${scenarioDir}/input*.js`))
        .run()
        .then(result => {
          const expected = fs.readFileSync(`${scenarioDir}/expected.md`, {encoding: 'utf-8'})
          expect(result.handlebars['index.md']).to.equal(expected)
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
  return {handlebars: {data: {'package': {'main': file}}}}
}
