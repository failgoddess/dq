
// import { getAsyncInjectors } from './utils/asyncInjectors'

import Dashboard from './containers/Dashboard'
import Display from './containers/Display'

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err) // eslint-disable-line no-console
}

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default)
}

export default function createRoutes (store) {
  // const { injectReducer, injectSagas } = getAsyncInjectors(store)

  return [
    {
      path: '/share/dashboard',
      component: Dashboard
    },
    {
      path: '/share/display',
      component: Display
    },
    {
      path: '*',
      name: 'notfound',
      getComponent (nextState, cb) {
        import('../app/containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading)
      }
    }
  ]
}
