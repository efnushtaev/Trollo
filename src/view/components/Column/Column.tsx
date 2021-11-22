import { StoreName } from 'config'
import { AppContext } from 'context'
import { useIndexedDb, useToast } from 'hooks'
import React, { FC, useContext, useMemo, useState } from 'react'
import { BoardItemType, ColumnItemType, TaskItemType } from 'types'
import { idGenerator, IndexedDbType, ItemsOrderControll } from 'utilits'
import { TitleSwitchField } from 'view/components/TitleSwitchField/TitleSwitchField'
import { Task } from '../Task'
import './styles.modules.scss'

type ColumnPropType = Pick<ColumnItemType, 'id' | 'title' | 'tasks' | 'order'> & {
  updateCurrentBoard: (v: BoardItemType) => void
  currentBoard: BoardItemType
}

export const Column: FC<ColumnPropType> = ({
  title,
  id,
  tasks,
  order,
  currentBoard,
  updateCurrentBoard
}) => {
  const { put } = useIndexedDb()
  const { dataDb, boards, setBoards } = useContext(AppContext)
  const messageToast = useToast()

  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [isEditMode, setEditMode] = useState('')

  const orderControll = new ItemsOrderControll()

  function handleEditMode(id: ColumnItemType['id']) {
    setEditMode(prevState => (prevState === id ? prevState : id))
  }

  function handleRemoveColumn(
    db: IndexedDbType,
    itemId: ColumnItemType['id'],
    data: BoardItemType
  ) {
    if (setBoards && boards) {
      const { id, columns } = data
      if (columns) {
        const newColumns = orderControll.sort<ColumnItemType>(
          columns.filter(column => column.id !== itemId)
        )
        const newData: BoardItemType = {
          ...data,
          columns: newColumns
        }
        put<BoardItemType, typeof StoreName.BOARD>(db, [StoreName.BOARD], { ...newData }, id)
          .then(res => {
            const newBoard = {
              ...res,
              columns: orderControll.reorder<ColumnItemType>(res.columns)
            }
            setBoards(boards?.map(board => (board.id === newBoard.id ? newBoard : board)))
          })
          .catch(err => {
            messageToast(err)
          })
      }
    }
  }

  function handleAddTask(db: IndexedDbType, board: BoardItemType, columnId: ColumnItemType['id']) {
    if (setBoards && boards) {
      const { id, columns } = board
      const newTask: TaskItemType = {
        id: idGenerator(),
        columnId: columnId,
        title: newTaskTitle,
        message: ''
      }
      const newBoard: BoardItemType = {
        ...board,
        columns: columns.map(column =>
          column.id === columnId ? { ...column, tasks: [...column.tasks, newTask] } : column
        )
      }
      put<BoardItemType, typeof StoreName.BOARD>(db, [StoreName.BOARD], { ...newBoard }, id)
        .then(res => {
          setNewTaskTitle('')
          setBoards(boards?.map(board => (board.id === res.id ? res : board)))
          setEditMode('')
        })
        .catch(err => {
          messageToast(err)
        })
    }
  }

  function handleColumnOrderChange(data: BoardItemType, currentOrder: number, mode: 'up' | 'down') {
    const { columns, id } = data
    const newData = {
      ...data,
      columns:
        mode === 'up'
          ? orderControll.up<ColumnItemType>(currentOrder, columns)
          : orderControll.down<ColumnItemType>(currentOrder, columns)
    }
    put<BoardItemType, typeof StoreName.BOARD>(dataDb, [StoreName.BOARD], { ...newData }, id).then(
      res => {
        updateCurrentBoard(res)
      }
    )
  }

  const tasksList = useMemo(
    () =>
      tasks.map(task => (
        <Task
          key={task.id}
          id={task.id}
          title={task.title}
          columnId={id}
          message={task.message}
          currentBoard={currentBoard}
          updateCurrentBoard={updateCurrentBoard}
        />
      )),
    [id, currentBoard, tasks, updateCurrentBoard]
  )

  return (
    <div className="column_container">
      <div className="card grey lighten-5 column_card hoverable column_scrollContainer">
        <div className="column_buttonGroup_buttons">
          <i
            onClick={() => handleColumnOrderChange(currentBoard, order, 'up')}
            className="tiny material-icons grey-text text-darken-2 ">
            arrow_backward
          </i>
          <p className="column_title grey-text text-darken-1">{title}</p>
          <i
            onClick={() => handleColumnOrderChange(currentBoard, order, 'down')}
            className="tiny material-icons grey-text text-darken-2 tooltipped">
            arrow_forward
          </i>
        </div>
        {tasksList.length ? <div className="column_taskList">{tasksList}</div> : null}
        <div
          className={`column_buttonGroup ${isEditMode === id ? 'column_buttonGroup--active' : ''}`}>
          {isEditMode === id && (
            <div className="column_iconClose">
              <i
                onClick={() => setEditMode('')}
                className="tiny material-icons grey-text text-darken-2 ">
                close
              </i>
            </div>
          )}
          <TitleSwitchField
            defaultTitle={'ДОБАВЬТЕ НОВУЮ ТАСКУ'}
            onAddClick={() => handleAddTask(dataDb, currentBoard, id)}
            onInputChange={setNewTaskTitle}
            isError={false}
            inputValue={newTaskTitle}
            isShowInput={isEditMode === id}
            onCloseInput={() => handleEditMode(id)}
            type="textarea"
            label="Новая таска"
          />
        </div>
        <div className="column_footer card-action">
          <div onClick={() => handleRemoveColumn(dataDb, id, currentBoard)}>
            <i className="small material-icons amber-text text-darken-2" data-tooltip="Удалить">
              delete_forever
            </i>
          </div>
        </div>
      </div>
    </div>
  )
}
