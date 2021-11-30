import React, { FC, useState, useEffect, useContext, useMemo, useCallback } from 'react'
import { useIndexedDb, useToast } from 'hooks'
import { idGenerator } from 'utilits'
import { BoardItemType } from 'types'
import { AppContext } from 'context'
import { BoardCard } from 'view/components/BoardCard'
import { MainLayout } from 'view/layouts/MainLayout'
import { IndexedDbType } from 'utilits/temporaryAnyType'
import { StoreName } from 'config'
import { AddItemTail } from 'view/components/AddItemTail'

import './styles.modules.scss'
import { Redirect } from 'react-router'
import { EmptyListTail } from 'view/components/EmptyListTail'

// TODO: порядок импортов поменять ( основные, либы, компоненты )

export const Boards: FC = () => {
  const { add, put, remove, getAllLoadingMarks } = useIndexedDb()
  const { dataDb, boards, setBoards, isAuth } = useContext(AppContext)
  const messageToast = useToast()

  const [isAddBoardMode, setAddBoardMode] = useState(false)
  const [newBoardTitle, setNewBoardTitle] = useState('')
  const [inputError, setInputError] = useState(false)

  useEffect(() => {
    isAddBoardMode && setInputError(false)
  }, [isAddBoardMode])

  function handleAddBoard(db: IndexedDbType, storeName: StoreName.BOARD[]) {
    console.log('handleAddBoard')
    if (newBoardTitle.length) {
      console.log('newBoardTitle.length:', newBoardTitle.length)
      console.log('newBoardTitle.length, boards:', boards)
      if (setBoards && boards) {
        console.log('boards:', boards)
        const newBoard: BoardItemType = {
          id: idGenerator(),
          title: newBoardTitle,
          columns: []
        }
        add(db, storeName, newBoard)
        .then(res => {
          console.log('res:', res)
          setNewBoardTitle('')
          setAddBoardMode(false)
          if (boards) {
            console.log('boards:', boards)
            setBoards([...boards, res])
          } else setBoards([res])
        })
        .catch(err => {
          messageToast(err)
        })
      } else {
        messageToast('boards are empty')
      }
    } else {
      console.log('setInputError')
      setInputError(true)}
  }

  const handleRemoveBoard = useCallback(
    (data: BoardItemType[]) => {
      return function (db: IndexedDbType, id: BoardItemType['id']) {
        if (setBoards) {
          remove<BoardItemType['id'], typeof StoreName.BOARD>(db, [StoreName.BOARD], id)
            .then(res => {
              if (data) {
                setBoards([...data.filter(item => item.id !== res)])
              }
            })
            .catch(err => {
              messageToast(err)
            })
        }
      }
    },
    [messageToast, remove, setBoards]
  )

  const handleUpdateItem = useCallback(
    (data: BoardItemType[]) => {
      return function (db: IndexedDbType, key: string, value: string) {
        if (setBoards) {
          const currentBoard = data!.find(board => board.id === key)
          if (currentBoard) {
            const newData = { ...currentBoard, title: value }
            put(db, [StoreName.BOARD], newData, key)
              .then(res => {
                if (data) {
                  setBoards(data.map(item => (item.id === res.id ? res : item)))
                }
              })
              .catch(err => {
                messageToast(err)
              })
          }
        }
      }
    },
    [put, messageToast, setBoards]
  )

  const boardsList = useMemo(
    () =>
      boards?.map(board => (
        <div className="col s12 m6 l4" key={board.id}>
          <BoardCard
            id={board.id}
            title={board.title}
            onRemoveItem={handleRemoveBoard(boards)}
            onUpdateItem={handleUpdateItem(boards)}
          />
        </div>
      )),
    [boards, handleRemoveBoard, handleUpdateItem]
  )

  if (!isAuth) {
    return <Redirect to="/auth" />
  }

  //TODO: добавить рефы к инпутам
  return (
    <MainLayout loading={!!getAllLoadingMarks.length}>
      <div className="container">
        <div className="row m0 ">
          {boardsList}
          {!boards?.length && (
            <div className="col s12 m6 l4">
              <EmptyListTail />
            </div>
          )}
          <div className="col s12 m6 l4">
            <AddItemTail
              addMode={isAddBoardMode}
              setAddMode={setAddBoardMode}
              itemName={newBoardTitle}
              setItemName={setNewBoardTitle}
              inputError={inputError}
              onAddClick={() => handleAddBoard(dataDb, [StoreName.BOARD])}
              title="Добавить доску"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
