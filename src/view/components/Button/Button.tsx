import React, { FC } from 'react'
import { TEMPORARY_ANY } from 'utilits'
import './styles.modules.scss'

type ButtonPropsType = {
  onClick: (e: TEMPORARY_ANY) => void
  label: string
  type?: 'warning' | 'success'
  size?: 'm' | 's'
  block?: boolean
}

export const Button: FC<ButtonPropsType> = ({ label, onClick, type, size= 's', block }) => {
  function getClass(type: ButtonPropsType['type']) {
    switch (type) {
      case 'warning':
        return 'red-text text-darken-1'
      case 'success':
        return 'green-text text-darken-1'
      default:
        return 'grey-text text-darken-1'
    }
  }

  function getSize(size: ButtonPropsType['size']) {
    switch(size) {
      case 'm' :
        return 'button_size_m'
      case 's' :
        return 'button_size_s'
        default :
        return 'button_size_s'
    }
  }

  return (
    <span onClick={onClick} className={`button_main ${getClass(type)} ${getSize(size)} ${block ? 'button_block' : ''}`}>
      {label}
    </span>
  )
}
