import React from 'react'

export default class CustomComponentLoader extends React.Component {
  constructor(props) {
    super(props);
   
    this.load = this.load.bind(this);
    this.state = {
      component : null
    }
    this.load(props);
  }

  componentWillReceiveProps(nextProps) {
    this.load(nextProps)
  }
  
  load(props) {
    const {path} = props
    if (path) {
      import(`_root/${path}`).then((module) => {
        this.setState({component : module.default})
      })
    } else {
      this.setState({component : null})
    }
  }
  render() {
    const {component} = this.state;
    if (component)
      return React.createElement(component, this.props)
    else
      return null
  }
}