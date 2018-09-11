/**
 * @summary Manage reducer in your redux store
 * @class
 * @export
 */
export class ReducerRegistry {
  /**
   * @summary Creates an instance of ReducerRegistry.
   * @locus Anywhere
   * @constructor
   * @param {Object} [options={}]
   * @param {Object} [options.reducers={}]
   * @param {Function} [options.registerListener]
   */
  constructor ({ reducers = {}, registerListener } = {}) {
    this._emitChange = registerListener
    this._reducers = { ...reducers }
  }

  /**
   * @summary Returns reducers
   * @locus Anywhere
   * @instance
   * @memberof ReducerRegistry
   * @property reducers
   * @readonly
   */
  get reducers () {
    return { ...this._reducers }
  }

  /**
   * @summary Register on a new reducer
   * @locus Anywhere
   * @instance
   * @memberof ReducerRegistry
   * @method register
   * @param {String} name
   * @param {Function} reducer
   */
  register (name, reducer) {
    this._reducers[name] = reducer
    if (this._emitChange) { this._emitChange(this.reducers) }
  }

  /**
   * @summary Sets listener on register
   * @locus Anywhere
   * @instance
   * @memberof ReducerRegistry
   * @method setRegisterListener
   * @param {Function} listener
   */
  setRegisterListener (listener) {
    this._emitChange = listener
  }

  unregister (name) {
    delete this._reducers[name]
    if (this._emitChange) { this._emitChange(this.reducers) }
  }
}
