import React from 'react'
import ReactDOM from 'react-dom'
import Main from './components/main'
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import * as reducers from './reducers'
import storage from './lib/sync-storage'
import { createHistory, useQueries } from 'history'
const history = useQueries(createHistory)()

const logger = createLogger({
  collapsed: true,
  duration: true,
})

const root = document.createElement('div')
document.body.appendChild(root)

const currentLocation = history.getCurrentLocation()

const initialState = {
  lang: storage.getItem('lang') || 'en',
  location: {
    query: decodeURIComponent(currentLocation.pathname.replace('/', '')),
    id: currentLocation.query.id,
    tag: currentLocation.query.tag,
  },
}

const store = createStore(
  combineReducers(reducers),
  initialState,
  applyMiddleware(thunk, logger)
)

const rootInstance = ReactDOM.render(
  <Provider store={store}>
    <Main />
  </Provider>,
  root
)

if (module.hot) {
  require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
    getRootInstances() {
      // Help React Hot Loader figure out the root component instances on the page:
      return [rootInstance]
    },
  })
}
