import React from 'react'

export default class EditButton extends React.Component {
    render() {
        return (
            <span className="pull-right">
                <button className='btn btn-xcon btn-xcon-grey delete-btn'
                    onClick={this.props.backPage}>
                    취소&nbsp;&nbsp;<i className="material-icons">cancel</i>
                </button>
                <button style={{ marginLeft: "5px" }} className='btn btn-xcon btn-xcon-blue update-btn' onClick={this.props.onSubmit}>
                    수정&nbsp;&nbsp;<i className="material-icons">check</i>
                </button>
            </span>
        )
    }
}