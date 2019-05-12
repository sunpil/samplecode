import React from 'react'
import UiValidate from '../../../components/forms/validation/UiValidate';
import { smallBox } from '../../../components/utils/actions/MessageActions';
import ModalHeader from '../../common/components/ModalHeader'

 class PasswordChange extends React.Component {
    static defaultProps = {
        user_id: '',
        admin: false,
        unlocked: false,
        flag: true
    }
    componentDidMount() {
        $(`#${this.props.id}`).on('hide.bs.modal', () => {
            this.props.doTogglePasswordModal(false)
        })
    }
    componentDidUpdate() {
        if (!this.props.flag)
            this.props.doTogglePasswordModal(true)
    }
    onSubmit = (e) => {
        e.preventDefault()
        const passwordRequest = {
            user_id: this.refs._id.value,
            prevPassword: this.props.admin ? "" : this.refs._pwd.value,
            newPassword: this.refs._new_pwd.value,
            newPassword_confirm: this.refs.new_pwd_confirm.value,
            admin: this.props.admin,
            unlocked: this.props.unlocked

        }
        if (passwordRequest.newPassword === passwordRequest.newPassword_confirm)
            this.props.changePassword(passwordRequest)
        else
            smallBox({
                title: "입력된 비밀번호와 확인이 일치하지 않습니다.",
                color: "#C90000",
                iconSmall: "fa fa-thumbs-down bounce animated",
                timeout: 4000
            })
    }
    render() {
        return (
            <div className="modal fade" id={this.props.id} role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <ModalHeader iconType="mi" icon="vpn_key" title={this.props.header} />
                        </div>
                        <div className="modal-body">
                            {
                                this.props.flag ?
                                    <UiValidate options={options}>
                                        <form className="smart-form" ref="_frm" onSubmit={this.onSubmit}>
                                            <section>
                                                <label className="label">사용자 ID :</label>
                                            </section>
                                            <section >
                                                <input className="form-control" ref="_id" name="user_id" value={this.props.user_id===null?"":this.props.user_id} disabled />
                                            </section>{
                                                !this.props.admin ?
                                                    <section>
                                                        <label className="label">현재 비밀번호 :</label>
                                                    </section>
                                                    : null
                                            }
                                            {
                                                !this.props.admin ?
                                                    <section >
                                                        <input type="password" ref="_pwd" name="pwd" maxLength="20" className="form-control" />
                                                    </section> : null
                                            }
                                            <section>
                                                <label className="label">새 비밀번호 : </label>
                                            </section>
                                            <section >
                                                <input type="password" ref="_new_pwd" name="new_pwd" maxLength="20" className="form-control" />
                                            </section>
                                            <section>
                                                <label className="label">새 비밀번호 확인 :</label>
                                            </section>
                                            <section >
                                                <input type="password" ref="new_pwd_confirm" maxLength="20" name="new_pwd_confirm" className="form-control" />
                                            </section>
                                            <section>
                                                <div style={{width:"100%", textAlign:"right"}}>
                                                    <button type="submit" className="btn btn-xcon btn-xcon-blue btn-xcon-shadow">변경</button>
                                                </div>
                                            </section>
                                        </form>
                                    </UiValidate> : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const options = {
    rules: {
        pwd: {
            required: true,
            minlength: 8,
            maxlength: 20
        },
        new_pwd: {
            required: true,
            minlength: 8,
            maxlength: 20
        },
        new_pwd_confirm: {
            required: true,
            minlength: 8,
            maxlength: 20
        }
    }
}

export default PasswordChange