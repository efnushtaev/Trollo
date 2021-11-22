import React, { FC, useState, useEffect } from 'react'
import { TEMPORARY_ANY } from 'utilits/temporaryAnyType'
import { Button } from '../Button'
import { InputWrapper } from '../InputWrapper/InputWrapper'

import './styles.modules.scss'

type TitleSwitchFieldPropType = {
  defaultTitle: string
  onAddClick: TEMPORARY_ANY
  isError: boolean
  onInputChange: TEMPORARY_ANY
  inputValue: string
  isShowInput?: boolean
  onCloseInput?: TEMPORARY_ANY
  type: 'input' | 'textarea'
  label: string
}
export const TitleSwitchField: FC<TitleSwitchFieldPropType> = ({
  defaultTitle,
  onAddClick,
  isError,
  onInputChange,
  inputValue,
  isShowInput = true,
  onCloseInput,
  type,
  label
}) => {
  const [title, setTitle] = useState('')

  useEffect(() => {
    if (defaultTitle) {
      setTitle(defaultTitle)
    }
  }, [defaultTitle])

  return (
    <div className="titleSwitchField_container">
      {isShowInput ? (
        <div className="titleSwitchField_inputContainer">
          <InputWrapper
            id="boardName"
            label={label}
            onAddClick={onAddClick}
            onInputChange={onInputChange}
            inputValue={inputValue}
            onBlur={onCloseInput}
            isError={isError}
            helperText="Необходимо назвать доску"
            type={type}
          />
        </div>
      ) : (
        <div className="titleSwitchField_titleContainer">
          <Button onClick={onCloseInput} label={title} size="m" block/>
        </div>
      )}
    </div>
  )
}
