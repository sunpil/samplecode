import React from 'react'

import {connect} from 'react-redux';

class LoginInfo extends React.Component {

  render() {
    return (

      <div className="login-info">
          <div className="img-wrapper">
              <img src="assets/img/avatars/user.png" srcSet="assets/img/avatars/user@2x.png 2x, assets/img/avatars/user@3x.png 3x" className="me"/>
          </div>
          <span>{ this.props.user_name }({ this.props.user_id })</span>
      </div>
    )
  }
}

const mapStateToProps = (state)=>(state.auth)

export default connect(mapStateToProps)(LoginInfo)