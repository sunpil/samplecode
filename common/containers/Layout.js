import React from 'react'
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'

import Header from './Header'
import Navigation from './Navigation'
import Ribbon from '../../../components/ribbon/Ribbon'
import Footer from './Footer'

import WidgetGrid from '../../../components/widgets/WidgetGrid'

class Layout extends React.Component {
  render() {
    const {login} = this.props.auth;

    if(!login) {
      return <Redirect to="/login"/>;
    }

    return (
      <div>
        <Header />
        <Navigation />
        <div id="main" role="main">
          {/*<Ribbon />*/}
          <div id="content" className="container-mod">
            <WidgetGrid>
              {this.props.children}
            </WidgetGrid>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default connect(state => ({
  auth: state.auth
}))(Layout);
