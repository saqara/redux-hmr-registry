import { ReducerRegistry } from '.'

describe('ReducerRegistry', () => {
  const dynamicReducer = (state = 'dynamicReducer') => state

  describe('empty registry', () => {
    const emptyRegistry = new ReducerRegistry()
    const emptyRegistryListener = jest.fn()

    it('should create an empty registry', () => {
      expect(emptyRegistry.reducers).toEqual({})
    })

    it('should register dynamic reducer', () => {
      emptyRegistry.register('dynamicReducer', dynamicReducer)
      expect(emptyRegistry.reducers).toEqual({ dynamicReducer })
    })

    it('should unregister dynamic reducer', () => {
      emptyRegistry.unregister('dynamicReducer')
      expect(emptyRegistry.reducers).toEqual({})
    })

    it('should set register listener', () => {
      emptyRegistry.setRegisterListener(emptyRegistryListener)
      expect(typeof emptyRegistry._emitChange).toBe('function')
      expect(emptyRegistry._emitChange).toEqual(emptyRegistryListener)
    })

    it('should call register listener on register', () => {
      emptyRegistry.register('dynamicReducer', dynamicReducer)
      expect(emptyRegistryListener.mock.calls.length).toBe(1)
      emptyRegistryListener.mockClear()
    })

    it('should call register listener on unregister', () => {
      emptyRegistry.unregister('dynamicReducer')
      expect(emptyRegistryListener.mock.calls.length).toBe(1)
      emptyRegistryListener.mockClear()
    })
  })

  describe('registry with initial reducers', () => {
    const dummyReducer = (state = 'dummy') => state
    const registryListener = jest.fn()
    const registry = new ReducerRegistry({
      reducers: { dummy: dummyReducer },
      registerListener: registryListener
    })

    it('should create registry with initial reducers and a listener', () => {
      expect(registry.reducers).toEqual({ dummy: dummyReducer })
      expect(typeof registry._emitChange).toBe('function')
      expect(registry._emitChange).toEqual(registryListener)
    })

    it('should register dynamic reducer', () => {
      registry.register('dynamicReducer', dynamicReducer)
      expect(registry.reducers).toEqual({
        dummy: dummyReducer,
        dynamicReducer
      })
      expect(registryListener.mock.calls.length).toBe(1)
      registryListener.mockClear()
    })

    it('should unregister dynamic reducer', () => {
      registry.unregister('dynamicReducer')
      expect(registry.reducers).toEqual({ dummy: dummyReducer })
      expect(registryListener.mock.calls.length).toBe(1)
      registryListener.mockClear()
    })
  })
})
