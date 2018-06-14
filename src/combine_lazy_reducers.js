import { combineReducers } from 'redux'

/**
 * @summary Combine reducers
 * @locus Anywhere
 * @export
 * @param {Object} reducers
 * @param {Object} [initialState={}]
 * @return {Function}
 */
export const combineLazyReducers = (reducers, initialState = {}) => {
  const reducersCopy = { ...reducers }
  let reducerKeys = Object.keys(reducersCopy)
  Object.keys(initialState)
    .filter(k => reducerKeys.indexOf(k) === -1)
    .forEach(k => { reducersCopy[k] = (state = null) => state })
  return combineReducers(reducersCopy)
}
