import { useIndexedDb } from 'hooks'
import { useCallback } from 'react'
import { dataDbVersion, SESSION_ITEM_NAME } from './../config/config'
import { StoreName, authDbVersion, DB_AUTH_STORE, DB_AUTH_NAME, DB_DATA_STORE } from 'config'
import { AuthItemType } from 'types'
import { IndexedDbType } from 'utilits/temporaryAnyType'
import bcrypt from 'bcryptjs'
import { getDbName } from 'utilits'

export const useAuth = () => {
  const { add, get, initDB } = useIndexedDb()

  const initAuthDb = useCallback(() => initDB(DB_AUTH_NAME, authDbVersion, DB_AUTH_STORE), [initDB])

  const signIn = useCallback(
    async function (authDb: IndexedDbType, payload: AuthItemType): Promise<IndexedDbType> {
      const hashedPassword = await bcrypt.hash(payload.password, 12)
      if (authDb) {
        return add(authDb, [StoreName.AUTH], { ...payload, password: hashedPassword }).then(res =>
          initDB(res.dbName, dataDbVersion, DB_DATA_STORE)
        )
        // console.log('signIn')
        // const db = await add(authDb, [StoreName.AUTH], { ...payload, password: hashedPassword }).then(async(res) => {
        //   const init = await initDB(res.dbName, dataDbVersion, DB_DATA_STORE).then(async (res) => {
        //     return res
        //   })
        //   return await init.then((res: TEMPORARY_ANY) => res)
        // })

        // const resAuthDb = await add(authDb, [StoreName.AUTH], {
        //   ...payload,
        //   password: hashedPassword
        // })
        // const resDb = await initDB(resAuthDb.dbName, dataDbVersion, DB_DATA_STORE)
        // console.log('signIn, resDb: ', resDb)
        // return resDb
      }
    },
    [add, initDB]
  )

  const logIn = useCallback(
    async function (
      authDb: IndexedDbType,
      loginData: Omit<AuthItemType, 'dbName'>
    ): Promise<IndexedDbType> {
      if (authDb) {
        const searchedUser = {
          key: 'user_key',
          value: loginData?.user || ''
        }
        const user = await get<AuthItemType, StoreName.AUTH>(authDb, [StoreName.AUTH], searchedUser)
        const isMatch = await bcrypt.compare(loginData.password, user[0].password)
        if (isMatch) {
          return initDB(user[0].dbName, dataDbVersion, DB_DATA_STORE)
        } else {
          throw Error
        }
      }
    },
    [get, initDB]
  )

  const sessionUpdate = useCallback(
    function (sessionData?: { dbName: string }) {
      if (sessionData?.dbName) {
        return initDB(sessionData?.dbName, dataDbVersion, DB_DATA_STORE)
      } else {
        throw Error
      }
    },
    [initDB]
  )

  const logout = useCallback(async function () {
    const promise = new Promise((res: (v: boolean) => void) => {
      setTimeout(() => {
        sessionStorage.removeItem('userName')
        res(true)
      }, 1000)
    })
    return promise
  }, [])

  const sessionInit = useCallback(async function () {
    const promise = new Promise((res: (v: { dbName: string }) => void, rej) => {
      const sessionData = getDbName(sessionStorage.getItem(SESSION_ITEM_NAME))
      setTimeout(
        () => (sessionData.length ? res({ dbName: sessionData }) : rej('sessionInit error')),
        1000
      )
    })
    return promise
  }, [])

  return { signIn, logIn, initAuthDb, sessionUpdate, logout, sessionInit }
}
