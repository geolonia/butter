const jsYaml = require("js-yaml");

/**
 * noop walker to traverse and transform values.
 * @param {string} key
 * @param {any} value
 * @param {object} parent
 * @returns value
 */
const defaultWalker = (key, value, parent) => value;

/**
 * Plugable YAML -> JSON Transpiler
 */
class Transpiler {
  /**
   *
   * @param {string} yaml YAML format data
   * @param {function} walk
   */
  constructor(yaml, walk = defaultWalker) {
    this._json = null;
    this._object = null;
    this._yaml = yaml;
    this._walk = walk;
  }

  /**
   *
   * @returns {object} parsed YAML object
   */
  parse() {
    this._object = jsYaml.load(this._yaml);
    return this._object;
  }

  /**
   * traverse object recursively and apply waker function.
   * @param {void | object}
   * @returns
   */
  traverse(target = this._object) {
    for (var key in target) {
      if (target.hasOwnProperty(key)) {
        const value = this._walk(key, target[key], target);
        if (typeof value === "object") {
          return this.traverse(value);
        }
      }
    }
    return target;
  }

  /**
   * Return JSON format Data
   * @returns {string} Return JSON format Data
   */
  generate() {
    this._json = JSON.stringify(this._object, null, 2);
    return this._json;
  }

  toJSON() {
    return this._json;
  }

  transpile(format = "JSON") {
    this.parse();
    this.traverse();
    this.generate();
    if (format.toUpperCase() === "JSON") {
      return this.toJSON();
    } else {
      throw new Error(`Unrecognized format ${format}`);
    }
  }
}

module.exports.Transpiler = Transpiler;
globalThis.Transpiler = Transpiler;
