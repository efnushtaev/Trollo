import React, { FC } from 'react'

import './styles.modules.scss'

export const EmptyListTail: FC<{}> = () => {
  return (
    <div className="emptyListTail_container">
      <div className="valign-wrapper emptyListTail_headerContainer">
        <h5 className="grey-text text-darken-2 center-align m0">Создайте свою первую доску</h5>
        <i
          className="small material-icons grey-text text-darken-2 center-align"
          >
          arrow_forward
        </i>
      </div>
    </div>
  )
}
