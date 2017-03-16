/*!
 * thought-plugin-jsdoc <https://github.com/nknapp/thought-plugin-jsdoc>
 *
 * Copyright (c) 2017 Nils Knappmeier.
 * Released under the MIT license.
 */

/* eslint-env mocha */

const thoughtPluginJsdoc = require('../')
const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

describe('thought-plugin-jsdoc:', function () {
  it("should be executed", function () {
    expect(thoughtPluginJsdoc()).to.equal('thoughtPluginJsdoc')
  })
})
