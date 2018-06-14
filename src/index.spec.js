import { createStore } from 'redux'

import { ReducerRegistry, combineLazyReducers } from '.'

describe('Redux HMR registry tests', () => {
  const dummyReducer = (state = 'dummy', action) => state
  // Reducers known at application's startup
  const staticReducers = { dummy: dummyReducer }
  const store = createStore(combineLazyReducers(staticReducers))
  const reducerRegistry = new ReducerRegistry({
    reducers: staticReducers,
    registerListener: (reducers) => {
      store.replaceReducer(combineLazyReducers(reducers, store.getState()))
    }
  })

  it('creates a store with a static reducer', () => {
    expect(store.getState()).toEqual({ dummy: 'dummy' })
  })

  it('adds a dynamic reducer', () => {
    const notificationReducerName = 'notifications'
    const createActionName = name => `${notificationReducerName}/${name}`
    let notificationId = 0
    const NOTIFICATION_ADD = createActionName('NOTIFICATION_ADD')
    const NOTIFICATION_REMOVE = createActionName('NOTIFICATION_REMOVE')
    const dynamicReducer = (state = [], action = {}) => {
      switch (action.type) {
        case NOTIFICATION_ADD:
          return [...state, { name: action.payload, id: notificationId + 1 }]
        case NOTIFICATION_REMOVE: return state.slice(1)
      }
      return state
    }
    const notificationAdd = payload => ({ payload, type: NOTIFICATION_ADD })
    const notificationRemove = () => ({ type: NOTIFICATION_REMOVE })
    reducerRegistry.register(notificationReducerName, dynamicReducer)
    expect(store.getState()).toEqual({ dummy: 'dummy', [notificationReducerName]: [] })
    store.dispatch(notificationAdd('Hello'))
    expect(store.getState()).toEqual(
      { dummy: 'dummy', [notificationReducerName]: [{ name: 'Hello', id: 1 }] }
    )
    store.dispatch(notificationRemove())
    expect(store.getState()).toEqual(
      { dummy: 'dummy', [notificationReducerName]: [] }
    )
  })
})
