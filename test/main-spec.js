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

  const basePath = 'test/fixtures/scenarios'
  fs.readdirSync(basePath).forEach(function (scenario) {

    const scenarioDir = `${basePath}/${scenario}`

    it('scenario ' + scenarioDir, function () {
      // Run the engine
      return thought
        .merge({ handlebars: { data: {'package': {'main': `${scenarioDir}/input*.js`}}}})
        .run()
        .then(result => {
          const expected = fs.readFileSync(`${scenarioDir}/expected.md`, {encoding: 'utf-8'})
          expect(result.handlebars['index.md']).to.equal(expected)
        })
    })
  })
})
