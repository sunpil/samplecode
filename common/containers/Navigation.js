/**
 * Created by griga on 11/24/15.
 */

import React from 'react'

import NavMenu from './NavMenu'

import LoginInfo from './LoginInfo'

export default class Navigation extends React.Component {
  render() {
    return (
      <aside id="left-panel">
        <LoginInfo />
        <nav>
          <NavMenu
              openedSign={'<i class="fa fa-minus-square"></i>'}
              closedSign={'<i class="fa fa-plus-square"></i>'}
          />
        </nav>
      </aside>
    )
  }
}
