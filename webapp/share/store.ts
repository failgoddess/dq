/**
 * Create the store with asynchronously loaded reducers
 */

import { createStore, applyMiddleware, compose, Store, Middleware, ReducersMapObject } from 'redux'
import { fromJS } from 'immutable'
import { routerMiddleware } from 'react-router-redux'
import createSagaMiddleware, { Task, SagaIterator } from 'redux-saga'
import createReducer from './reducers'

const sagaMiddleware = createSagaMiddleware()

export interface IStore<T> extends Store<T> {
  runSaga?: (saga: (...args: any[]) => SagaIterator, ...args: any[]) => Task
  // asyncReducers?: ReducersMapObject,
  injectedReducers?: ReducersMapObject,
  injectedSagas?: ReducersMapObject
}

declare interface IWindow extends Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose
}
declare const window: IWindow

export default function configureStore<T> (initialState: object = {}, history): IStore<T> {
  // Create the store with two middlewares
  // 1. sagaMiddleware: Makes redux-sagas work
  // 2. routerMiddleware: Syncs the location/URL path to the state
  const middlewares = [
    sagaMiddleware,
    routerMiddleware(history)
  ]

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      : compose
  /* eslint-enable */

  const store: IStore<T> = createStore(
    createReducer(),
    fromJS(initialState),
    composeEnhancers(applyMiddleware(...middlewares))
  )

  // Extensions
  store.runSaga = sagaMiddleware.run
  // store.asyncReducers = {} // Async reducer registry
  store.injectedReducers = {} // Reducer registry
  store.injectedSagas = {} // Saga registry

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(createReducer(store.injectedReducers))
      // import('./reducers').then((reducerModule) => {
      //   const createReducers = reducerModule.default
      //   const nextReducers = createReducers(store.asyncReducers)

      //   store.replaceReducer(nextReducers)
      // })
    })
  }

  return store
}
