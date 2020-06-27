import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Index from './pages'
import Client from './pages/Client'
import Load from './pages/Load'

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path='/' exact component={Index}></Route>
      <Route path="/clientes" exact component={Client}></Route>
      <Route path="/cargas" exact component={Load}></Route>
    </Switch>
  )
}

export default Routes
