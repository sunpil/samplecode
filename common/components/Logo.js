import React from 'react'
import defaultLogo from '../../../../assets/img/xcon.png'
import sunjinLogo from '../../../../assets/img/vendor/sunjin.png'

const logos = {
    default: defaultLogo,
    sunjin: sunjinLogo
}

export default class Logo extends React.Component {    
    render() {
        let logoStyle = {
            ...this.props.style,
            height: "25px",
            paddingLeft: "5px",
            width: "90px",
            paddingTop: "7px"
        }
        return <img src={logos[this.props.type]} style={logoStyle} />
    }
}