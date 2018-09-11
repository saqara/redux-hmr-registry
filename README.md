# ReduxHMRRegistry

Enable code splitting for redux

## Installation
[NPM](https://www.npmjs.com/):
```
$ npm install --save redux-hmr-registry
```

[Yarn](https://yarnpkg.com/lang/en/):
```
yarn add redux-hmr-registry
```

## Import
In ES6:
`import { MiddlewareRegistry, ReducerRegistry, combineLazyReducers } from 'redux-hmr-registry'`

## Use with redux
Here an example to create store and enabling code splitting with redux:
```js
import { applyMiddleware, compose, createStore } from 'redux'
import { MiddlewareRegistry, ReducerRegistry, combineLazyReducers } from 'redux-hmr-registry'

const reducers = {
  hello: (state = 'Hello World!') => state
}

const middlewareRegistry = new MiddlewareRegistry({
  middlewares: {
    myMiddleware: store => next => action => {
      /* ... */
    }
  }
})

const middlewares = [middlewareRegistry.createMiddleware()]

const store = createStore(
  combineLazyReducers(reducers),
  compose(applyMiddleware(...middlewares))
)

const reducerRegistry = new ReducerRegistry({
  reducers,
  registerListener: (dynamicReducers) => {
    store.replaceReducer(combineLazyReducers(dynamicReducers, store.getState()))
  }
})
```

Later in your code:
```js
// For register to a new middleware
middlewareRegistry.register('dynamicMiddleware', dynamicMiddleware)
// For register to a new reducer
reducerRegistry.register('dynamicMiddleware', dynamicMiddleware)
```

## API
#### `combineLazyReducers` (Function)
Combines `reducers` and returns a new reducer that must be passed to redux.

> If you use [`connected-react-router`](https://github.com/supasate/connected-react-router) you can pass reducer create by `combineLazyReducers` to `connectRouter(history)` ex: `connectRouter(history)(combineLazyReducers(reducers))`

__Arguments__:
  - `reducers` (Object): an object when each property is a reducer function
  - [`initialState`] (Object): usefull if you need to set initial state of reducer that not exist or has been removed.

#### `MiddlewareRegistry` (ES6 Class)
Enable code splitting for redux middlewares

__Constructor__:
  - [`options={}`] (Object):
    - [`middlewares={}`] (Object): a key/value object where key is name of middleware and value the middleware itself

__Methods__:
  - __createMiddleware__: returns a middleware to use with redux
  - __register(name, middleware)__: adds `name` middleware
    - `name` (String): middleware name
    - `middleware` (Function): redux middleware
  - __unregister(name)__: removes `name` middleware
    - `name` (String): middleware name

#### `ReducerRegistry` (ES6 Class)
Enable code splitting for redux reducers

__Constructor__:
  - [`options={}`] (Object):
    - [`reducers={}`] (Object): a key/value object where key is name of reducer and value the reducer itself
    - [`registerListener`] (Function): function called when register or unregister a reducer. Usefull to call `store.replaceReducer(/*...*/)` to dynamically replace redux reducer.

__Methods__:
  - __register(name, reducer)__: adds `name` reducer
    - `name` (String): reducer name
    - `reducer` (Function): redux reducer
  - __setRegisterListener(listener)__: set listener call on register and unregister
    - `listener` (Function): a function that takes registered reducers in first argument
  - __unregister(name)__: removes `name` reducer
    - `name` (String): reducer name
