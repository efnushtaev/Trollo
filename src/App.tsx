import React, { FC, useEffect, useState } from 'react'
import { useHistory, Router } from 'react-router-dom'

import { AppContext } from 'context'
import { useAuth, useRoutes, useToast } from 'hooks'
import { IndexedDbType } from 'utilits/temporaryAnyType'
import { BoardItemType } from 'types'

export const App: FC = () => {
  const { sessionUpdate, initAuthDb, sessionInit } = useAuth()
  const routes = useRoutes()
  const history = useHistory()
  const messageToast = useToast()

  const [dataDb, setDataDb] = useState<IndexedDbType>()
  const [authDb, setAuthDb] = useState<IndexedDbType>()
  const [isLoading, setLoading] = useState(false)
  const [isAuth, setAuth] = useState<boolean>(false)
  const [boards, setBoards] = useState<BoardItemType[]>()

  // App initialization
  useEffect(() => {
    setLoading(true)
    initAuthDb()
      .then(res => setAuthDb(res))
      .catch(err => messageToast(err))

    // Session refresh
    sessionInit()
      .then(res => {
        sessionUpdate(res)
          .then(res => {
            setDataDb(res)
            setAuth(true)
            setLoading(false)
          })
          .catch(err => {
            setLoading(false)
            messageToast(err)
          })
      })
      .catch(err => {
        setLoading(false)
        messageToast(err)
      })
  }, [initAuthDb, sessionUpdate, messageToast, history, sessionInit])

  return (
    <AppContext.Provider
      value={{
        boards: boards,
        isAuth: isAuth,
        authDb: authDb,
        dataDb: dataDb,
        history: history,
        isLoading: isLoading,
        setBoards: setBoards,
        setAuth: setAuth,
        setDataDb: setDataDb
      }}>
      <div className="app">
        <Router history={history}>{routes}</Router>
      </div>
    </AppContext.Provider>
  )
}
