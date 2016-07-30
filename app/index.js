import React from 'react'
import ReactDOM from 'react-dom'
import Router from './components/router'
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import * as reducers from './reducers'

const logger = createLogger({
  collapsed: true,
  duration: true,
})

const root = document.createElement('div')
document.body.appendChild(root)

const initialState = {
  lang: window.localStorage.getItem('lang') || 'en',
}

const store = createStore(
  combineReducers(reducers),
  initialState,
  applyMiddleware(thunk, logger)
)

const rootInstance = ReactDOM.render(
  <Provider store={store}>
    <Router />
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
