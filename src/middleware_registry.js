import { compose } from 'redux'

/**
 * @class MiddlewareRegistry
 * @export
 */
export class MiddlewareRegistry {
  /**
   * @constructor
   * @param {Object} [options={}]
   * @param {Object} [options.middlewares={}]
   */
  constructor ({ middlewares = {} } = {}) {
    this._middlewares = middlewares
  }

  /**
   * @summary Returns new middleware to pass to redux
   * @locus Anywhere
   * @instance
   * @memberof MiddlewareRegistry
   * @method createMiddleware
   * @return {Function}
   */
  createMiddleware () {
    return store => next => action => {
      const chain = Object
        .keys(this._middlewares)
        .map(name => this._middlewares[name](store))
      return compose(...chain)(next)(action)
    }
  }

  /**
   * @summary Register a new middleware
   * @locus Anywhere
   * @instance
   * @memberof MiddlewareRegistry
   * @method register
   * @param {String} name
   * @param {Function} middleware
   */
  register (name, middleware) {
    this._middlewares[name] = middleware
  }

  /**
   * @summary Unregister a middleware
   * @locus Anywhere
   * @instance
   * @memberof MiddlewareRegistry
   * @method unregister
   * @param {String} name
   */
  unregister (name) {
    delete this._middlewares[name]
  }
}
