/**
 * Created by griga on 11/17/15.
 */

import React from 'react'

import FullScreen from '../../../components/common/FullScreen'
import ToggleMenu from '../../../components/common/ToggleMenu'
import { logout } from '../../auth/AuthActions';
import { changeAdminMode } from '../../../components/navigation/NavigationActions'
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import UserDownloadPopup from '../../download/container/UserDownloadPopup'
import PasswordChange from '../../common/components/PasswordChange'
import { changePassword, togglePasswordModal } from '../../account/AccountActions';
import { getConsoleConfig } from '../../common/ConfigurationAction'
import Logo from '../components/Logo'

class Header extends React.Component {

  logout = () => {
    const { doLogout, history } = this.props;
    doLogout(
        () => { history.replace('/login') }
    );
  }
  componentDidMount(){
    this.props.doGetConsoleConfig()
  }

  adminMode = () => {
    const { doChangeAdminMode, history } = this.props;
    doChangeAdminMode(true, () => {
      history.replace('/admin-setup/environment-setup')
    });
  }

  userMode = () => {
    const { doChangeAdminMode, history } = this.props;
    doChangeAdminMode(false, () => {
      history.replace('/audit/summary')
    });
  }

  downloadModalShow = () => {
    $("#userDownloadModal").appendTo('body').modal('show');
  }
  changePasswordShow = () => {
    $("#userChangePassword").appendTo('body').modal('show');
  }
  changePassword = (request) => {
    this.props.doChangePassword(request, () => {
      $("#userChangePassword").modal('hide');
    })
  }
  render() {
    const { navigation, config } = this.props;
    const logoType = config.console.logoType ? config.console.logoType : 'default'

    return <header id="header">
      <ToggleMenu className="btn-toggle"  /* collapse menu button */ />
      <div id="logo-group">
        <span id="logo">
          <Logo type={logoType} className="logo"/>
        </span>
      </div>
      <div className="baseline">
        {/* <span>A</span> */}Admin Console
      </div>
      <div className="pull-right"  /*pulled right: nav area*/ >
        <UserDownloadPopup />
        <PasswordChange
            id="userChangePassword"
            user_id={this.props.auth.user_id}
            header="사용자 비밀번호 변경"
            changePassword={this.changePassword}
            flag={this.props.passwordModalFlag}
            doTogglePasswordModal={this.props.doTogglePasswordModal}
        />



        {/* #MOBILE */}
        {/*  Top menu profile link : this shows only when top menu is active */}
        <ul id="mobile-profile-img" className="header-dropdown-list hidden-xs padding-5">
          <li className="">
            <a className="dropdown-toggle no-margin userdropdown" data-toggle="dropdown">
              <img src="assets/img/avatars/sunny.png" alt="John Doe" className="online" />
            </a>
            <ul className="dropdown-menu pull-right">
              <li>
                <a className="padding-10 padding-top-0 padding-bottom-0"><i
                    className="fa fa-cog" /> Setting</a>
              </li>
              <li className="divider" />
              <li>
                <a href="#/views/profile"
                   className="padding-10 padding-top-0 padding-bottom-0"> <i className="fa fa-user" />
                  <u>P</u>rofile</a>
              </li>
              <li className="divider" />
              <li>
                <a className="padding-10 padding-top-0 padding-bottom-0"
                   data-action="toggleShortcut"><i className="fa fa-arrow-down" /> <u>S</u>hortcut</a>
              </li>
              <li className="divider" />
              <li>
                <a className="padding-10 padding-top-0 padding-bottom-0"
                   data-action="launchFullscreen"><i className="fa fa-arrows-alt" /> Full
                  <u>S</u>creen</a>
              </li>
              <li className="divider" />
              <li>
                <a onClick={this.logout} className="padding-10 padding-top-5 padding-bottom-5"
                   data-action="userLogout"><i
                    className="fa fa-sign-out fa-lg" /> <strong><u>L</u>ogout</strong></a>
              </li>
            </ul>
          </li>
        </ul>

        {/* logout button */}
        <div id="logout" className="pull-right">
          <span>
            <button onClick={navigation.adminMode === true ? this.userMode : this.logout} title="Sign Out"
                    data-logout-msg="You can improve your security further after logging out by closing this opened browser">
              <i className="fa fa-power-off" />
            </button>
          </span>
        </div>

        <FullScreen className=" pull-right" />
        <div id="contextMenu" className="btn-header transparent pull-right">
          <span className="dropdown"> <button className="dropdown-toggle tool" data-toggle="dropdown"><i className="fa fa-gear" /></button>
            <ul className="dropdown-menu dropdown-menu-right">
              <li>
                <a onClick={this.changePasswordShow} >비밀번호 변경</a>
              </li>
              <li>
                <a onClick={this.downloadModalShow}>사용자 다운로드</a>
              </li>
              <li>
                <a onClick={this.adminMode}>관리자 모드</a>
              </li>
            </ul>
          </span>
        </div>
      </div>
      {/* end pulled right: nav area */}
    </header>
  }
}

export default connect((state) => ({
  auth: state.auth,
  navigation: state.navigation,
  passwordModalFlag: state.account.passwordModal,
  config: state.config
}), (dispatch) => ({
  doLogout(callback) {
    dispatch(logout(callback))
  },
  doChangeAdminMode(mode, callback) {
    dispatch(changeAdminMode(mode, callback))
  },
  doChangePassword(request, callback) {
    dispatch(changePassword(request, callback))
  },
  doTogglePasswordModal(active){
    dispatch(togglePasswordModal(active))
  },
  doGetConsoleConfig(){
    dispatch(getConsoleConfig())
  }
}))(withRouter(Header));
