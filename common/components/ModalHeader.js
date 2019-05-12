import React from 'react'

export default class ModalHeader extends React.Component {
    render() {
        return (
            <h4>
                <div className="display-flex-row">
                    <div>
                        {this.props.iconType == 'mi' ?
                            <i className="material-icons" style={{paddingTop:3}}>
                                {this.props.icon}
                            </i>
                        : <i className={this.props.icon} />}
                    </div>
                    <div style={{paddingLeft:5}}>{this.props.title}</div>
                    <div style={{paddingTop:5, marginLeft:"auto"}}>
                    {
                        this.props.onClickFunc ?
                        <i className="material-icons" data-dismiss="modal" aria-hidden="true" style={{cursor:"pointer"}} onClick={this.props.onClickFunc}>cancel</i>
                        : <i className="material-icons" data-dismiss="modal" aria-hidden="true" style={{cursor:"pointer"}}>cancel</i>
                    }
                        
                    </div>
                </div>
            </h4>
        )
    }
}