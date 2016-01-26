import React from 'react'
import ReactDOM from 'react-dom'
import {Main} from './main'

let root = document.createElement('div')
document.body.appendChild(root)

let rootInstance = ReactDOM.render(<Main />, root);

if (module.hot) {
  require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
    getRootInstances: function () {
      // Help React Hot Loader figure out the root component instances on the page:
      return [rootInstance];
    }
  });
}
