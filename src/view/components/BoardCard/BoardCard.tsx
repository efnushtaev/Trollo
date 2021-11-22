import React, { FC, useState, useEffect, useContext } from 'react'
import { AppContext } from 'context'
import { IndexedDbType, TEMPORARY_ANY } from 'utilits/temporaryAnyType'
import { NavLink } from 'react-router-dom'
import { BoardItemType } from 'types'
import { InputWrapper } from '../InputWrapper/InputWrapper'

import './styles.modules.scss'

type BoardCardPropTypes = {
  id: BoardItemType['id']
  title: BoardItemType['title']
  onRemoveItem: (v: BoardItemType[], i: BoardItemType['id']) => void
  onUpdateItem: (v: BoardItemType[], i: BoardItemType['id'], t: string) => void
}

export const BoardCard: FC<BoardCardPropTypes> = ({ id, title, onRemoveItem, onUpdateItem }) => {
  const { dataDb } = useContext(AppContext)
  const [isEditMode, setIsEditMode] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [inputError, setInputError] = useState(false)

  useEffect(() => {
    if (isEditMode) {
      setInputError(false)
      setNewTitle(title)
    }
  }, [isEditMode, setNewTitle, title])

  function handleEditModeChange(e: TEMPORARY_ANY) {
    e.preventDefault()
    e.stopPropagation()
    setIsEditMode(prevState => !prevState)
  }

  function handleRemoveCard(e: TEMPORARY_ANY, db: IndexedDbType, id: BoardItemType['id']) {
    e.preventDefault()
    e.stopPropagation()
    onRemoveItem(db, id)
  }

  function handleUpdateTitle(db: IndexedDbType, id: BoardItemType['id'], newTitle: string) {
    if (newTitle.length) {
      onUpdateItem(db, id, newTitle)
      setIsEditMode(prevState => !prevState)
    } else setInputError(true)
  }

  // Prevent navLink false clicking
  function handleNavLinkClick(e: TEMPORARY_ANY, isDisable: boolean) {
    if (isDisable) e.preventDefault()
  }

  return (
    <div className="card grey lighten-5 hoverable boardCard_container">
      <NavLink to={`board/${id}`}>
        <div className="boardCard_cardContainer" onClick={e => handleNavLinkClick(e, isEditMode)}>
          <div className="card-content boardCard_inputContainer">
            {isEditMode ? (
              <InputWrapper
                id="newBoardName"
                label="Название"
                onAddClick={() => handleUpdateTitle(dataDb, id, newTitle)}
                onInputChange={setNewTitle}
                inputValue={newTitle}
                onBlur={() => setIsEditMode(false)}
                isError={inputError}
                helperText="Необходимо назвать доску"
                type="input"
              />
            ) : (
              <div className="boardCard_titleContainer">
                <h6 className="grey-text text-darken-2 boardCard_title">{title}</h6>
              </div>
            )}
          </div>
        </div>
        {/* TODO вынести стили из компонент. Добавить hover  */}
        <div className="card-action p0">
          <div className="boardCard_cardFooter">
            <div onClick={event => handleEditModeChange(event)}>
              <i
                className={`small material-icons amber-text text-darken-2 boardCard_icon ${isEditMode ? 'boardCard_icon--active' : ''}`}
                >
                create
              </i>
            </div>
            <div onClick={event => handleRemoveCard(event, dataDb, id)}>
              <i className="small material-icons amber-text text-darken-2" data-tooltip="Удалить">
                delete_forever
              </i>
            </div>
          </div>
        </div>
      </NavLink>
    </div>
  )
}
