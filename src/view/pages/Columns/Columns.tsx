import React, { FC, useState, useEffect, useContext, useMemo } from 'react'
import { Redirect } from 'react-router'
import { useLocation } from 'react-router-dom'

import { StoreName } from 'config'
import { AppContext } from 'context'
import { useIndexedDb, useToast } from 'hooks'
import { BoardItemType, ColumnItemType } from 'types'
import { idGenerator, ItemsOrderControll } from 'utilits'

import { MainLayout } from 'view/layouts/MainLayout'
import { IndexedDbType } from 'utilits/temporaryAnyType'
import { Column } from 'view/components/Column'
import { AddItemTail } from 'view/components/AddItemTail'

import './styles.modules.scss'

export const Columns: FC = () => {
  const { dataDb, boards, setBoards, isAuth } = useContext(AppContext)
  const { put, getAllLoadingMarks } = useIndexedDb()
  const location = useLocation()
  const messageToast = useToast()

  const [newColumnTitle, setNewColumnTitle] = useState('')
  const [currentBoard, setCurrentBoard] = useState<BoardItemType>()
  const [isAddColumnMode, setAddColumnMode] = useState(false)

  const orderControll = new ItemsOrderControll()

  useEffect(() => {
    if (boards) {
      const boardId = location.pathname.split('/')[2]
      const currentBoard = boards.filter(board => board.id === boardId)
      setCurrentBoard(currentBoard[0])
    }
  }, [boards, location.pathname])

  function handleAddColumn(db: IndexedDbType, board: BoardItemType) {
    if (setBoards && boards) {
      const { id, columns } = board
      const newColumns: ColumnItemType = {
        id: idGenerator(),
        boardId: id,
        title: newColumnTitle,
        order: columns.length !== 0 ? columns.length + 1 : 1,
        tasks: []
      }
      const newBoard: BoardItemType = {
        ...board,
        columns: [...columns, newColumns]
      }
      put<BoardItemType, typeof StoreName.BOARD>(db, [StoreName.BOARD], newBoard, id)
        .then(res => {
          setNewColumnTitle('')
          setAddColumnMode(false)
          setBoards(boards?.map(board => (board.id === res.id ? res : board)))
        })
        .catch(err => {
          messageToast(err)
        })
    }
  }

  const columnsList = useMemo(
    () =>
      currentBoard &&
      orderControll
        .sort<ColumnItemType>(currentBoard.columns)
        .map((column: ColumnItemType) => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={column.tasks}
            order={column.order}
            currentBoard={currentBoard}
            updateCurrentBoard={setCurrentBoard}
          />
        )),
    [currentBoard, orderControll]
  )

  if (!isAuth) {
    return <Redirect to="/auth" />
  }

  // TODO добавлять новую колонку в конец
  // TODO сверстать заглушку для отстутствия колонок в отдельный компонент
  return (
    <MainLayout title={currentBoard?.title} loading={!!getAllLoadingMarks.length}>
      <div className="columns_container">
        {/* {!currentBoard?.columns?.length && (
            <div className="">
              <EmptyListTail />
            </div>
          )} */}
        <div className="columns_columnContainer">
          {columnsList}
          <div className="columns_addItemTail_container">
            <AddItemTail
              addMode={!!currentBoard && isAddColumnMode}
              setAddMode={setAddColumnMode}
              itemName={newColumnTitle}
              setItemName={setNewColumnTitle}
              inputError={false}
              onAddClick={() => handleAddColumn(dataDb, currentBoard!)}
              title="Добавить колонку"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
