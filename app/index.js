import React from 'react'
import ReactDOM from 'react-dom'
import { Main } from './main'

const root = document.createElement('div')
document.body.appendChild(root)

const rootInstance = ReactDOM.render(<Main />, root)

if (module.hot) {
  require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
    getRootInstances() {
      // Help React Hot Loader figure out the root component instances on the page:
      return [rootInstance]
    },
  })
}
