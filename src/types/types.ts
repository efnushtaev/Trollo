import { IndexedDbType } from 'utilits/temporaryAnyType'
import { SearchParamsType } from './../hooks/useIndexedDb'

declare module 'react-router-dom'

export type TaskItemType = {
  id: string // key
  columnId: string //поиск
  title: string
  message: string
}

export type ColumnItemType = {
  id: string // key
  order: number
  boardId: string // поиск
  title: string
  tasks: TaskItemType[]
}

export type BoardItemType = {
  id: string // key
  title: string
  columns: ColumnItemType[]
}

export type AuthItemType = {
  user: string
  password: string
  dbName: string
}

//TODO: поменять типы после того как хук useIndexedDb помнняю на сервис IndexedDb
export type IDBControllsType = {
  add: <P, S>(db: IndexedDbType, storeName: S[], payload: P) => Promise<P>
  put: <P, S>(db: IndexedDbType, storeName: S[], payload: P, key: string) => Promise<P>
  remove: <T, S>(db: IndexedDbType, storeName: S[], itemId: string) => Promise<T>
  get: <T, S>(db: IndexedDbType, storeName: S[], searchParams: SearchParamsType) => Promise<T[]>
  getAll: <T, S>(db: IndexedDbType, storeName: S[]) => Promise<T[]>
}

export type StoreConfigType = {
  storeName: string
  keyPath: string
  index?: { // поисковой индекс
    name: string // название индекса
    keyPath: string // поле по которому ищет
    options?: {
      unique: boolean
    }
  }[]
}


