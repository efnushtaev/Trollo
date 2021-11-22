import React, { FC } from 'react'

import './styles.modules.scss'

type BlanketPropTypes = {
  isLoading: boolean
}

export const Blanket: FC<BlanketPropTypes> = ({ isLoading }) => {
  return isLoading ? (
    <div className="blanket_container">
      <div className="preloader-wrapper active">
        <div className="spinner-layer spinner-only-blue">
          <div className="circle-clipper left">
            <div className="circle"></div>
          </div>
          <div className="gap-patch">
            <div className="circle"></div>
          </div>
          <div className="circle-clipper right">
            <div className="circle"></div>
          </div>
        </div>
      </div>
    </div>
  ) : null
}
