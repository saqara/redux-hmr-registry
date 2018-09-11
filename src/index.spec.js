import { applyMiddleware, createStore } from 'redux'

import { MiddlewareRegistry, ReducerRegistry, combineLazyReducers } from '.'

describe('', () => {
  const dummyReducer = (state = 'dummy') => state
  const MIDDLEWARE_CALL = 'MIDDLEWARE_CALL'
  const MIDDLEWARE_CLEAR_ALL = 'MIDDLEWARE_CLEAR_ALL'
  const middlewareCall = name => ({ name, type: MIDDLEWARE_CALL })
  const middlewareClearAll = () => ({ type: MIDDLEWARE_CLEAR_ALL })
  const middlewareReducer = (state = {}, action = {}) => {
    switch (action.type) {
      case MIDDLEWARE_CALL: return {
        ...state,
        [action.name]: state[action.name] ? state[action.name] + 1 : 1
      }
      case MIDDLEWARE_CLEAR_ALL: return {}
      default:
    }
    return state
  }
  const createMiddleware = name => store => next => action => {
    if (action.type !== MIDDLEWARE_CALL) {
      store.dispatch(middlewareCall(name))
    }
    return next(action)
  }
  const reducers = { dummy: dummyReducer, middlewares: middlewareReducer }
  const middlewareRegistry = new MiddlewareRegistry({
    middlewares: {
      initialMiddleware: createMiddleware('initialMiddleware')
    }
  })
  const store = createStore(
    combineLazyReducers(reducers),
    applyMiddleware(
      createMiddleware('otherMiddleware'),
      middlewareRegistry.createMiddleware()
    )
  )
  const reducerRegistry = new ReducerRegistry({
    reducers,
    registerListener: (reducers) => {
      const state = store.getState()
      const reducerNames = Object.keys(reducers)
      const intialState = Object.keys(state).reduce((acc, name) => {
        if (!reducerNames.includes(name)) {
          delete acc[name]
        }
        return acc
      }, state)
      store.replaceReducer(combineLazyReducers(reducers, intialState))
    }
  })

  it('shoud create store with static reducers', () => {
    expect(store.getState()).toEqual({ dummy: 'dummy', middlewares: {} })
  })

  it('should register to notification dynamic reducer', () => {
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
    expect(store.getState()).toEqual({
      dummy: 'dummy',
      middlewares: {},
      [notificationReducerName]: []
    })
    store.dispatch(notificationAdd('Hello'))
    expect(store.getState()).toEqual({
      dummy: 'dummy',
      middlewares: {
        initialMiddleware: 1,
        otherMiddleware: 1
      },
      [notificationReducerName]: [{ name: 'Hello', id: 1 }]
    })
    store.dispatch(notificationRemove())
    expect(store.getState()).toEqual({
      dummy: 'dummy',
      middlewares: {
        initialMiddleware: 2,
        otherMiddleware: 2
      },
      [notificationReducerName]: []
    })
    store.dispatch(middlewareClearAll())
  })

  it('should unregister notification reducer', () => {
    reducerRegistry.unregister('notifications')
    expect(store.getState()).toEqual({
      dummy: 'dummy',
      middlewares: {}
    })
  })

  it('should register dynamic middleware', () => {
    const middlewareName = 'dynamicMiddleware'
    const dynamicMiddleware = createMiddleware(middlewareName)
    middlewareRegistry.register(middlewareName, dynamicMiddleware)
    store.dispatch({ type: 'ACTION' })
    expect(store.getState()).toEqual({
      dummy: 'dummy',
      middlewares: {
        dynamicMiddleware: 1,
        initialMiddleware: 1,
        otherMiddleware: 1
      }
    })
    store.dispatch(middlewareClearAll())
  })

  it('should unregister dynamic and initial middleware', () => {
    middlewareRegistry.unregister('dynamicMiddleware')
    middlewareRegistry.unregister('initialMiddleware')
    store.dispatch({ type: 'ACTION' })
    expect(store.getState()).toEqual({
      dummy: 'dummy',
      middlewares: { otherMiddleware: 1 }
    })
  })
})
