import React, { FC, ReactElement, useEffect, useContext } from 'react'
import { StoreName } from 'config'
import { AppContext } from 'context'
import { useAuth, useIndexedDb } from 'hooks'
import { NavLink } from 'react-router-dom'
import { IndexedDbType } from 'utilits/temporaryAnyType'
import { Blanket } from 'view/components/Blanket/Blanket'

import './styles.modules.scss'

type MainLayoutType = {
  loading?: boolean
  children?: ReactElement<string, string>
  title?: string
  onBackClick?: () => void
}

export const MainLayout: FC<MainLayoutType> = ({ children, title, loading }) => {
  const { getAll, } = useIndexedDb()
  const { logout } = useAuth()
  const { dataDb, setAuth, setBoards, isLoading } = useContext(AppContext)

  useEffect(() => {
    console.log('MainLayout, dataDb: ', dataDb)
    if (dataDb && setBoards) {
      console.log('MainLayout, dataDb:', dataDb)
      getAll<IndexedDbType, StoreName.BOARD>(dataDb, [StoreName.BOARD])
      .then(res => {
          console.log('setBoards, res:', res)
          setBoards(res)
        })
        .catch(err => console.error('getAllErr', err))
    }
  }, [getAll, dataDb, setBoards])

  function handleLogOut() {
    if (setAuth) {
      console.log('MainLayout--handleLogOut')
      logout().then(res => setAuth(!res))
    }
  }

  return (
    <>
      <Blanket isLoading={loading || !!isLoading} />
      <div className="mainLayout_container">
        <div>
          <div className="row valign-wrapper amber darken-3 mainLayout_navigation">
            <div className="col s5 mainLayout_navHome">
              <NavLink to="/">
                <i className="material-icons white-text">apps</i>
              </NavLink>
              <p className="mainLayout_boardColumn white-text">{title}</p>
            </div>
            <div className="col s2 mainLayout_navLogo">
              <h5 className="center-align white-text mainLayout_logo">Trollo</h5>
            </div>
            <div className="col s5 mainLayout_navLogout" onClick={handleLogOut}>
              <NavLink to="/auth">
                <i className="material-icons white-text">exit_to_app</i>
                <h6 className="white-text mainLayout_logoutTitle">Выйти</h6>
              </NavLink>
            </div>
          </div>
          <div className="mainLayout_childrenContainer">{children}</div>
        </div>
        <div className="mainLayout_footerContainer">
          <h6 className="center-align grey-text text-darken-1">
            Trello-Clone {`<efnushtaev@gmail.com>`}
          </h6>
        </div>
      </div>
    </>
  )
}
