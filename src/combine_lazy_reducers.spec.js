import { createStore } from 'redux'

import { combineLazyReducers } from '.'

describe('combineLazyReducers', () => {
  const dummyReducer = (state = 'dummy') => state
  const staticReducers = { dummy: dummyReducer }
  const lazyReducer = combineLazyReducers(staticReducers)

  it('should combine reducers', () => {
    expect(typeof lazyReducer).toBe('function')
    expect(lazyReducer()).toEqual({ dummy: 'dummy' })
  })

  it('should return correct initial state after creating store', () => {
    const store = createStore(lazyReducer)
    expect(store.getState()).toEqual({ dummy: 'dummy' })
  })
})
