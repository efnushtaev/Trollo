import { StoreName } from 'config'
import { AppContext } from 'context'
import { useIndexedDb, useToast } from 'hooks'
import React, { FC, useContext } from 'react'
import { BoardItemType, ColumnItemType, TaskItemType } from 'types'
import { IndexedDbType } from 'utilits'
import { Button } from '../Button'

import './styles.modules.scss'

type TaskPropType = Pick<TaskItemType, 'title' | 'message' | 'id'> & {
  columnId: ColumnItemType['id']
  currentBoard: BoardItemType
  updateCurrentBoard: (v: BoardItemType) => void
}

export const Task: FC<TaskPropType> = ({
  id,
  title,
  message,
  columnId,
  currentBoard,
  updateCurrentBoard
}) => {
  const { dataDb } = useContext(AppContext)
  const { put } = useIndexedDb()
  const messageToast = useToast()

  function handleRemoveTask(
    db: IndexedDbType,
    data: BoardItemType,
    columnId: ColumnItemType['id'],
    taskId: TaskItemType['id']
  ) {
    const { id, columns } = data
    if (columns) {
      const newColumns = columns.map(column =>
        column.id === columnId
          ? { ...column, tasks: [...column.tasks.filter(task => task.id !== taskId)] }
          : column
      )
      const newData: BoardItemType = {
        ...data,
        columns: newColumns
      }
      put<BoardItemType, typeof StoreName.BOARD>(db, [StoreName.BOARD], { ...newData }, id)
        .then(res => {
          updateCurrentBoard({
            ...res,
            columns: newColumns
          })
        })
        .catch(err => {
          messageToast(err)
        })
    }
  }

  return (
    <div className="task_container">
      <p className="task_title">{title}</p>
      {/* <p>{message}</p> */}
      <div className="right-align task_removeButton">
        <Button
          label="УДАЛИТЬ"
          onClick={() => handleRemoveTask(dataDb, currentBoard, columnId, id)}
          type="warning"
        />
      </div>
    </div>
  )
}
