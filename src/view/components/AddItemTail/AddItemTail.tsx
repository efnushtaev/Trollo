import { StoreName } from 'config'
import React, { FC } from 'react'
import { IndexedDbType } from 'utilits'
import { TitleSwitchField } from '../TitleSwitchField'
import './styles.modules.scss'

type AddItemTailPropType = {
  addMode: boolean
  setAddMode: (v: boolean) => void
  itemName: string
  setItemName: (v: string) => void
  inputError: boolean
  onAddClick: (db: IndexedDbType, storeName: StoreName.BOARD[]) => void
  title: string
}

export const AddItemTail: FC<AddItemTailPropType> = ({
  addMode,
  setAddMode,
  itemName,
  setItemName,
  inputError,
  onAddClick,
  title
}) => {
  return addMode ? (
    <div className="grey lighten-5 addItemTail_newItemAdding_container">
      <i
        onClick={() => setAddMode(false)}
        className="tiny material-icons grey-text text-darken-2 center-align addItemTail_newItemAdding_iconClose"
        >
        close
      </i>
      <TitleSwitchField
        defaultTitle={itemName}
        onInputChange={setItemName}
        onAddClick={onAddClick}
        isError={inputError}
        inputValue={itemName}
        isShowInput={true}
        type="input"
        label="Название"
      />
    </div>
  ) : (
    <div className={'addItemTail_container'} onClick={() => setAddMode(true)}>
      <div className="valign-wrapper grey darken-6 addItemTail_titleContainer">
        <h5 className="grey-text text-lighten-3 center-align addItemTail_title">{title}</h5>
      </div>
      <div className="grey lighten-5 addItemTail_addIconContainer">
        <i
          className="medium material-icons grey-text text-lighten-1 center-align"
          >
          add
        </i>
      </div>
    </div>
  )
}
