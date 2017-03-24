/**
 * A function with no tags
 */
function noTags () {

}

/**
 * This is a short summary.
 *
 * This is a detailed explanation of what the function does. In this case
 * this is just multiplying two numbers. This text must be a little longer,
 * which is why I am just writing some more words.
 *
 * @example
 * multiply(3,4) // == 12
 * multiply(4,5) // == 20
 *
 * @param {number} param1 A paramater
 * @param {array<object<string>> | string} param2 Another paramater with a longer description that
 *   may as well span multiple lines. It's that long. Really. If you don't believe, just read this,
 *   and maybe you will see the truth.
 * @return {array<string>} a return value
 *
 *
 * @api public
 */
function multiply (param1, param2) {

}

/**
 * @public
 */
function publicTag () {

}

/**
 * @access public
 * @return something
 */
function accessPublic () {
  return privateFunction()
}

/**
 * This text should not appear in the jsdocs
 * @private
 */
function privateFunction () {

}

/**
 * @module moduleName
 * @public
 */
module.export = {
  accessPublic, multiply, noTags, publicTag
}
