import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Auth } from 'view/pages/Auth/Auth'

import { Boards } from 'view/pages/Boards'
import { Columns } from 'view/pages/Columns'

export const useRoutes = () => {
  return (
    <Switch>
      <Route path="/" exact component={Boards} />
      <Route path="/board/:id" exact component={Columns} />
      <Route path="/auth" exact component={Auth} />
    </Switch>
  )
}
