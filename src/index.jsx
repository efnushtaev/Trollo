import React from 'react'
import ReactDOM from 'react-dom'
import './fonts.scss'
import './index.scss'
import './main.scss'
import * as serviceWorker from './serviceWorker'
// import store from './redux/store-redux'
import {BrowserRouter} from 'react-router-dom'
import 'materialize-css'

import {App} from './App'

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
)

serviceWorker.unregister()
