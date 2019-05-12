import React from 'react'

class LegendWrapper extends React.Component {
    render() {
        return (
            <div className="legendWrapper">
                <ul>
                    {this.props.legend.map((item,i) => (
                        <li key={i}>
                            <span style={{background: this.props.color[i]}}></span>{item}
                        </li>
                     ))}
                </ul>
            </div>
        )
    }
}

export default LegendWrapper;

