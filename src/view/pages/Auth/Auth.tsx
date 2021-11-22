import { SESSION_ITEM_NAME } from 'config'
import { AppContext } from 'context'
import { useAuth } from 'hooks'
import React, { FC, useContext, useState } from 'react'
import { Redirect } from 'react-router'
import { AuthItemType } from 'types'
import { getDbName, TEMPORARY_ANY } from 'utilits'
import { Button } from 'view/components/Button'
import { MainLayout } from 'view/layouts'

import './styles.modules.scss'

type AuthPropTypes = {}

export const Auth: FC<AuthPropTypes> = () => {
  const { logIn, signIn } = useAuth()
  const { isAuth, history, authDb, setDataDb, setAuth, isLoading } = useContext(AppContext)
  const [userForm, setUserForm] = useState<Omit<AuthItemType, 'dbName'>>()

  const handleSignIn = () => {
    if (setDataDb && setAuth) {
      const payload: AuthItemType = {
        user: userForm?.user || '',
        password: userForm?.password || '',
        dbName: getDbName(userForm?.user)
      }
      signIn(authDb, payload)
        .then(res => {
          sessionStorage.setItem(SESSION_ITEM_NAME, payload.user)
          setUserForm(undefined)
          setDataDb(res)
          console.log('handleSignIn')
          setAuth(true)
          history.push(`/`)
        })
        .catch(err => console.error('signInErr: ', err))
    }
  }

  const handleLogIn = async () => {
    if (userForm && setDataDb && setAuth) {
      logIn(authDb, userForm)
        .then(res => {
          sessionStorage.setItem(SESSION_ITEM_NAME, userForm.user)
          setUserForm(undefined)
          console.log('handleLogIn')
          setDataDb(res)
          setAuth(true)
          history.push(`/`)
        })
        .catch(err => console.error('signInErr: ', err))
    }
  }

  function handleUserChange(e: TEMPORARY_ANY) {
    console.log(e.currentTarget.value)
    setUserForm({ password: userForm?.password || '', user: e.currentTarget.value })
  }

  function handlePasswordChange(e: TEMPORARY_ANY) {
    console.log(e.currentTarget.value)
    setUserForm({ user: userForm?.user || '', password: e.currentTarget.value })
  }

  if (isAuth) {
    return <Redirect to="/" />
  }

  return (
    <MainLayout loading={!!isLoading}>
      <div className="container auth_container">
        <div className="row">
          <div className="input-field col s6 offset-s3">
            <input type="text" id="login" onChange={handleUserChange} value={userForm?.user || ''} />
            <label htmlFor="login">Логин</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s6 offset-s3">
            <input type="password" id="password" onChange={handlePasswordChange} value={userForm?.password || ''} />
            <label htmlFor="password">Пароль</label>
          </div>
        </div>
        <div className="row">
          <div className="auth_buttons col s6 offset-s3">
            <Button onClick={() => handleSignIn()} label="Добавить" size="m"/>
            <Button onClick={() => handleLogIn()} label="Войти" size="m"/>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
