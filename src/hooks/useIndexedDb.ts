import { useState, useCallback, useMemo } from 'react'
import { StoreConfigType } from 'types'
import { TEMPORARY_ANY, IndexedDbType } from 'utilits/temporaryAnyType'

export type SearchParamsType = {
  key: string
  value: string
}

export enum LoadingMarks {
  INIT_DB = 'initDB',
  ADD = 'add',
  REMOVE = 'remove',
  PUT = 'put',
  GET = 'get',
  GET_ALL = 'getAll'
}

//TODO: поменять хук useIndexedDb на класс IndexedDb
//TODO: оформить ошибки и загрузки ф в формате
export const useIndexedDb = () => {
  const [loading, setLoading] = useState<Array<LoadingMarks>>([])
  function _changeLoadingMark(mark: LoadingMarks, remove: boolean = false) {
    if (remove) {
      setLoading(prevState => [...prevState.filter(item => item !== mark)])
    } else setLoading(prevState => [...prevState, mark])
  }

  const getLoadingMark = useCallback(
    (mark: LoadingMarks) => loading.find(item => item === mark),
    [loading]
  )

  const getAllLoadingMarks = useMemo(() => loading, [loading])

  const initDB = useCallback(
    async <P extends StoreConfigType>(
      dbName: string,
      version: number,
      storeProps: P[]
    ): Promise<IndexedDbType> => {
      return new Promise(function (resolve, reject) {
        console.log('initDB')
        let _dbReq = indexedDB.open(dbName, version)
        let db
        _dbReq.onupgradeneeded = (event: TEMPORARY_ANY) => {
          db = event.target.result
          for (let i = 0; i < storeProps.length; i++) {
            let store = event.target.result.createObjectStore(storeProps[i].storeName, {
              keyPath: storeProps[i].keyPath
            })
            if (storeProps[i].index) {
              for (let y = 0; y < storeProps[i].index!.length; y++) {
                if (
                  storeProps[i].index &&
                  !store.indexNames.contains(storeProps[i].index![y].name)
                ) {
                  store.createIndex(
                    storeProps[i].index![y].name,
                    storeProps[i].index![y].keyPath,
                    storeProps[i].index![y].options
                  )
                }
              }
            }
          }
        }

        _changeLoadingMark(LoadingMarks.INIT_DB)
        _dbReq.onsuccess = (event: TEMPORARY_ANY) => {
          db = event.target.result
          console.log('INIT, db_success: ', db)
          resolve(db)
          _changeLoadingMark(LoadingMarks.INIT_DB, true)
        }
        
        _dbReq.onerror = (event: TEMPORARY_ANY) => {
          console.log('INIT, db_error: ')
          reject('error initialization database ' + (event.target as TEMPORARY_ANY).errorCode)
          _changeLoadingMark(LoadingMarks.INIT_DB, true)
        }
      })
    },
    []
  )

  const add = useCallback(
    async <P, S>(db: IndexedDbType, storeName: S[], payload: P): Promise<P> => {
      return new Promise(function (resolve, reject) {
        let tx = db.transaction(storeName, 'readwrite')
        let store = tx.objectStore(storeName)
        store.add({ ...payload })
        _changeLoadingMark(LoadingMarks.ADD)
        tx.oncomplete = () => {
          resolve({ ...payload })
          setTimeout(() => _changeLoadingMark(LoadingMarks.ADD, true), 1000)
        }
        tx.onerror = (event: TEMPORARY_ANY) => {
          reject('error adding item ' + event.target.errorCode)
          _changeLoadingMark(LoadingMarks.ADD, true)
        }
      })
    },
    []
  )

  const put = useCallback(
    async <P, S>(db: IndexedDbType, storeName: S[], payload: P, key: string): Promise<P> => {
      return new Promise(function (resolve, reject) {
        let tx = db.transaction(storeName, 'readwrite')
        let store = tx.objectStore(storeName)
        store.put({ ...payload, id: key })
        _changeLoadingMark(LoadingMarks.PUT)
        tx.oncomplete = () => {
          resolve({ ...payload })
          _changeLoadingMark(LoadingMarks.PUT, true)
        }
        tx.onerror = (event: TEMPORARY_ANY) => {
          reject('error updating item' + event.target.errorCode)
          _changeLoadingMark(LoadingMarks.PUT, true)
        }
      })
    },
    []
  )

  const get = useCallback(
    async <T, S>(
      db: IndexedDbType,
      storeName: S[],
      searchParams: SearchParamsType
    ): Promise<T[]> => {
      const { key, value } = searchParams
      return new Promise(function (resolve, reject) {
        let tx = db.transaction(storeName, 'readonly')
        let store = tx.objectStore(storeName)
        let req = store.index(key).getAll(value)
        _changeLoadingMark(LoadingMarks.GET)
        req.onsuccess = () => {
          resolve(req.result)
          _changeLoadingMark(LoadingMarks.GET, true)
        }
        req.onerror = (event: TEMPORARY_ANY) => {
          reject('error getting item' + event.target.errorCode)
          _changeLoadingMark(LoadingMarks.GET, true)
        }
      })
    },
    []
  )

  // TODO improve and fix all types
  const getAll = useCallback(async <T, S>(db: IndexedDbType, storeName: S[]): Promise<T[]> => {
    return new Promise(function (resolve, reject) {
      let tx = db.transaction(storeName, 'readonly')
      let store = tx.objectStore(storeName)
      let req = store.openCursor()
      let allItems: TEMPORARY_ANY = []
      _changeLoadingMark(LoadingMarks.GET_ALL)
      req.onsuccess = (event: TEMPORARY_ANY) => {
        // Результатом req.onsuccess в запросах openCursor является
        // IDBCursor
        let cursor = event.target.result
        if (cursor != null) {
          // Если курсор не нулевой, мы получили элемент.
          allItems.push(cursor.value)
          cursor.continue()
        } else {
          // Если у нас нулевой курсор, это означает, что мы получили
          // все данные, поэтому отображаем заметки, которые мы получили.
          resolve(allItems)
          _changeLoadingMark(LoadingMarks.GET_ALL, true)
        }
      }
      req.onerror = (event: TEMPORARY_ANY) => {
        reject('error in cursor request ' + event.target.errorCode)
        _changeLoadingMark(LoadingMarks.GET_ALL, true)
      }
    })
  }, [])

  const remove = useCallback(
    async <T, S>(db: IndexedDbType, storeName: S[], itemId: string): Promise<T> => {
      return new Promise(function (resolve) {
        const tx = db.transaction(storeName, 'readwrite')
        tx.onerror = function (event: TEMPORARY_ANY) {
          alert('error removing ' + event.target.errorCode)
        }
        const store = tx.objectStore(storeName)
        const req = store.getKey(itemId)
        _changeLoadingMark(LoadingMarks.REMOVE)
        req.onsuccess = () => {
          const deltedItemId = req.result
          let deleteRequest = store.delete(deltedItemId)
          deleteRequest.onsuccess = () => {
            resolve(deltedItemId)
            _changeLoadingMark(LoadingMarks.REMOVE, true)
          }
        }
      })
    },
    []
  )

  return { getLoadingMark, getAllLoadingMarks, initDB, add, getAll, remove, get, put }
}
