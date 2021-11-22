import { BoardItemType } from 'types'
import { createContext } from 'react'
import { TEMPORARY_ANY, IndexedDbType } from 'utilits/temporaryAnyType'

export const AppContext = createContext<{
  isLoading?: boolean
  isAuth?: boolean
  setAuth?: (v: boolean) => void
  authDb?: IndexedDbType
  dataDb?: IndexedDbType
  setDataDb?: (v: IndexedDbType) => void
  history?: TEMPORARY_ANY
  boards?: BoardItemType[]
  setBoards?: (v: BoardItemType[]) => void
}>({})
