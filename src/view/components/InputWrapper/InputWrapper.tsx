import React, { FC, useRef, useEffect } from 'react'
import { TEMPORARY_ANY } from 'utilits/temporaryAnyType'
import { Button } from '../Button'

import './styles.modules.scss'

type InputWrapperTypeProp = {
  id: string
  label: string
  onAddClick: TEMPORARY_ANY
  onClearClick?: TEMPORARY_ANY
  onInputChange: TEMPORARY_ANY
  inputValue: string
  onBlur?: TEMPORARY_ANY
  isError?: boolean
  helperText?: string
  type: 'input' | 'textarea'
}

export const InputWrapper: FC<InputWrapperTypeProp> = ({
  onAddClick,
  onClearClick,
  onInputChange,
  inputValue,
  label,
  isError,
  helperText,
  id,
  type
}) => {
  const input: TEMPORARY_ANY = useRef(null)

  useEffect(() => {
    if (input) input.current.focus()
  }, [input])

  function handleInputChange(e: TEMPORARY_ANY) {
    e.preventDefault()
    e.stopPropagation()
    onInputChange(e.currentTarget.value)
  }

  function handleAddClick(e: TEMPORARY_ANY) {
    e.preventDefault()
    e.stopPropagation()
    onAddClick(e)
  }

  function getField(type: 'input' | 'textarea') {
    switch (type) {
      case 'input':
        return (
          <input
            data-error={isError}
            id={id}
            className={`inputWrapper_input ${isError ? 'invalid' : ''}`}
            onChange={handleInputChange}
            value={inputValue}
            type="text"
            ref={input}
          />
        )
      case 'textarea':
        return (
          <textarea
            data-error={isError}
            id={id}
            className={`materialize-textarea inputWrapper_input ${isError ? 'invalid' : ''}`}
            onChange={handleInputChange}
            value={inputValue}
            ref={input}></textarea>
        )
      default:
        break
    }
    return
  }

  return (
    <div className="inputWrapper_container">
      <div className="inputWrapper_inputFieldContainer">
        <div className="input-field inputWrapper_inputContainer">
          {getField(type)}
          <label htmlFor={id}>{label}</label>
          <div style={{ height: '18px' }}>
            {isError && <span className="helper-text">{helperText}</span>}
          </div>
        </div>
        <div onClick={handleAddClick} className="inputWrapper_iconContainer">
          {/* <span
            style={{
              fontSize: '12px',
              fontWeight: 500,
              height: '24px',
              padding: '4px 8px'
            }}
            className="grey-text text-darken-1 grey lighten-3">
            ГОТОВО
          </span> */}
          <Button label="ГОТОВО" onClick={(e) => handleAddClick(e)} type="success" />
        </div>
        {onClearClick && (
          <div className="inputWrapper_iconContainer">
            <i
              className="small material-icons teal-text text-lighten-1"
              data-tooltip="Очистить"
              onClick={() => onClearClick('')}>
              clear
            </i>
          </div>
        )}
      </div>
    </div>
  )
}
