
/**
 * Checks validity of object
 * returning its value or an alternative
 */

// eslint-disable-next-line eqeqeq
const ifElse = (obj, or) => (obj == undefined) ? or : obj;

module.exports = ifElse