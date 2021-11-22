import React, {FC, useEffect, useState, useRef} from 'react'

import {ColumnItemType} from 'types'
import { TEMPORARY_ANY } from 'utilits/temporaryAnyType'

type ModalType = {
  children: TEMPORARY_ANY
  columnId: ColumnItemType['id']
  onTaskAdd: (columnId: ModalType['columnId']) => void
  isDisable: boolean
  modalClose: boolean
}

export const Modal: FC<ModalType> = ({children, columnId, onTaskAdd, isDisable, modalClose}) => {
  const [modal, setModal] = useState<TEMPORARY_ANY>()

  const options = useRef({
    onOpenStart: () => {
      console.log('Open Start')
    },
    onOpenEnd: () => {
      console.log('Open End')
    },
    onCloseStart: () => {
      console.log('Close Start')
    },
    onCloseEnd: () => {
      console.log('Close End')
    },
    inDuration: 250,
    outDuration: 250,
    opacity: 0.5,
    dismissible: false,
    startingTop: '4%',
    endingTop: '10%'
  })

  useEffect(() => {
    window.M.Modal.init(modal, options)
  }, [modal])

  useEffect(() => {
    if (modalClose && window.M.Modal.init(modal, options)) {
      window.M.Modal.init(modal, options).close()
    }
  }, [options, modal, modalClose])

  return (
    <div>
      <div ref={modal => setModal(modal)} id="modal1" className="modal">
          <button className="modal-close waves-effect waves-red btn-flat right">X</button>
        <div className="modal-content">
          <span>{columnId}</span>
          {children}{' '}
          <button
            disabled={!isDisable}
            className="waves-effect waves-light btn"
            onClick={() => onTaskAdd(columnId)}>
            Добавить
          </button>
        </div>
      </div>
    </div>
  )
}
