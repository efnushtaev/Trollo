import { StoreConfigType } from 'types'

export const authDbVersion = 1
export const dataDbVersion = 1
export const DB_AUTH_NAME = 'dbAuth'
export const SESSION_ITEM_NAME = 'userName'

export enum StoreName {
  BOARD = 'board',
  AUTH = 'auth'
}

export const DB_DATA_STORE: StoreConfigType[] = [
  {
    storeName: StoreName.BOARD,
    keyPath: 'id',
    index: [
      {
        name: 'id_key',
        keyPath: 'id'
      }
    ]
  }
]

export const DB_AUTH_STORE: StoreConfigType[] = [
  {
    storeName: StoreName.AUTH,
    keyPath: 'user',
    index: [
      {
        name: 'user_key',
        keyPath: 'user'
      }
    ]
  }
]
