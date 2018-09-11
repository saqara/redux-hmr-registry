import { MiddlewareRegistry } from '.'

describe('MiddlewareRegistry', () => {
  const action = { type: 'ACTION' }
  const dispatch = jest.fn()
  const store = { dispatch }
  let listeners = {}
  const createMiddleware = (name) => {
    const listener = jest.fn()
    listeners[name] = listener
    return store => next => action => {
      listener(action)
      return next(action)
    }
  }

  describe('empty registry', () => {
    const emptyRegistry = new MiddlewareRegistry()
    const middlewareName = 'dynamicMiddleware'
    let registryMiddleware

    it('should create an empty registry', () => {
      expect(emptyRegistry._middlewares).toEqual({})
    })

    it('should create middleware', () => {
      registryMiddleware = emptyRegistry.createMiddleware()
      expect(typeof registryMiddleware).toBe('function')
    })

    it('should call dispatch one time', () => {
      registryMiddleware(store)(store.dispatch)(action)
      expect(dispatch.mock.calls.length).toBe(1)
      expect(dispatch.mock.calls[0][0]).toEqual(action)
      dispatch.mockClear()
    })

    it('should register dynamic middleware', () => {
      const dynamicMiddleware = createMiddleware(middlewareName)
      emptyRegistry.register(middlewareName, dynamicMiddleware)
      expect(emptyRegistry._middlewares).toEqual({ dynamicMiddleware })
      registryMiddleware(store)(store.dispatch)(action)
      expect(dispatch.mock.calls.length).toBe(1)
      expect(dispatch.mock.calls[0][0]).toEqual(action)
      expect(listeners[middlewareName].mock.calls.length).toBe(1)
      expect(listeners[middlewareName].mock.calls[0][0]).toEqual(action)
      dispatch.mockClear()
      listeners[middlewareName].mockClear()
    })

    it('should unregister dynamic middleware', () => {
      emptyRegistry.unregister(middlewareName)
      expect(emptyRegistry._middlewares).toEqual({})
      registryMiddleware(store)(store.dispatch)(action)
      expect(dispatch.mock.calls.length).toBe(1)
      expect(dispatch.mock.calls[0][0]).toEqual(action)
      expect(listeners[middlewareName].mock.calls.length).toBe(0)
      dispatch.mockClear()
      delete listeners[middlewareName]
    })
  })

  describe('registry with initial middlewares', () => {
    const dummyMiddlewareName = 'dummyMiddleware'
    const dummyMiddleware = createMiddleware(dummyMiddlewareName)
    const registry = new MiddlewareRegistry({
      middlewares: { dummyMiddleware }
    })
    const middlewares = [
      { name: 'middleware1', middleware: createMiddleware('middleware1') },
      { name: 'middleware2', middleware: createMiddleware('middleware2') },
      { name: 'middleware3', middleware: createMiddleware('middleware3') },
      { name: 'middleware4', middleware: createMiddleware('middleware4') }
    ]
    let registryMiddleware

    it('should create registry with initial middleware', () => {
      expect(registry._middlewares).toEqual({ dummyMiddleware })
    })

    it('shoudl create rgistry middleware', () => {
      registryMiddleware = registry.createMiddleware()
      expect(typeof registryMiddleware).toBe('function')
      registryMiddleware(store)(store.dispatch)(action)
      expect(dispatch.mock.calls.length).toBe(1)
      expect(dispatch.mock.calls[0][0]).toEqual(action)
      expect(listeners[dummyMiddlewareName].mock.calls.length).toBe(1)
      expect(listeners[dummyMiddlewareName].mock.calls[0][0]).toEqual(action)
      dispatch.mockClear()
      listeners[dummyMiddlewareName].mockClear()
    })

    it('should register dynamic middlewares', () => {
      middlewares.forEach(({ name, middleware }) => {
        registry.register(name, middleware)
      })
      registryMiddleware(store)(store.dispatch)(action)
      expect(dispatch.mock.calls.length).toBe(1)
      expect(dispatch.mock.calls[0][0]).toEqual(action)
      expect(listeners[dummyMiddlewareName].mock.calls.length).toBe(1)
      expect(listeners[dummyMiddlewareName].mock.calls[0][0]).toEqual(action)
      middlewares.forEach(({ name }) => {
        expect(listeners[name].mock.calls.length).toBe(1)
        expect(listeners[name].mock.calls[0][0]).toEqual(action)
        listeners[name].mockClear()
      })
      dispatch.mockClear()
      listeners[dummyMiddlewareName].mockClear()
    })

    it('should unregister dynamic middleware', () => {
      middlewares.forEach(({ name }) => {
        registry.unregister(name)
      })
      registryMiddleware(store)(store.dispatch)(action)
      expect(dispatch.mock.calls.length).toBe(1)
      expect(dispatch.mock.calls[0][0]).toEqual(action)
      expect(listeners[dummyMiddlewareName].mock.calls.length).toBe(1)
      expect(listeners[dummyMiddlewareName].mock.calls[0][0]).toEqual(action)
      middlewares.forEach(({ name }) => {
        expect(listeners[name].mock.calls.length).toBe(0)
        delete listeners[name]
      })
      dispatch.mockClear()
      listeners[dummyMiddlewareName].mockClear()
    })
  })
})
