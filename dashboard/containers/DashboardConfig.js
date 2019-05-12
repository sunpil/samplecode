import React from 'react'

import JarvisWidget from '../../../components/widgets/JarvisWidget';
import { dashboardList, deleteDashboard, allGroupList, updateDashboardGroup } from '../DashboardActions';
import { connect } from 'react-redux';
import '../css/style.css';
import {NavLink as Link} from 'react-router-dom'
import ChartWrapper from "../../../hsuxd/components/ChartWrapper";

class DashboardConfig extends React.Component {

  constructor() {
    super();
  }

  componentDidMount() {
    this.props.doDashboardList();
    this.props.doAllGroupList();
  }

  editDash = (dash_id) => {
    this.props.history.push("/dashboard?id="+dash_id+"&mode=edit");
  }

  deleteDash = (dash_id) => {
    let check = confirm('정말로 삭제하시겠습니까?');
    if (!check) return;
    this.props.doDeleteDashboard(dash_id);
  }

  changeGroup = (dash_id, e) => {
    this.props.doUpdateDashboardGroup(dash_id, e.target.value);
  }

  render() {
    return (
      <React.Fragment>
          <div className="defaultPage">
            <header className="traceHeader dashboard-top-toolbar">
              <div>
                <h2>대시보드 관리</h2>
                <h4>통계 시각화를 통해 생성한 차트 등을 한곳에 모아 사용자 대시보드를 구성합니다.</h4>
              </div>
              <div className="headerAction">
                <Link to="/dashboard?mode=add" className="btn btn-xcon btn-xcon-blue">
                  대시보드 생성 <i className="material-icons">add_circle_outline</i>
                </Link>
              </div>
            </header>
            <main className="dashboard-main">
              <ChartWrapper type="chart" title="대시보드 목록">
                <table className="table table-bordered">
                  <thead>
                  <tr>
                    <th style={{width:"20%",textAlign:"center"}}>대시보드 명</th>
                    <th style={{width:"40%",textAlign:"center"}}>대시보드 설명</th>
                    <th style={{width:"20%",textAlign:"center"}}>그룹 권한 설정</th>
                    <th style={{width:"20%",textAlign:"center"}}>제어</th>
                  </tr>
                  </thead>
                  {this.props.dash.dashboardList != [] && this.props.dash.dashboardList.map(
                      (item, idx) => {
                        return (
                            <tbody key={idx}>
                            <tr>
                              <td style={{verticalAlign: "middle"}}>{item.dash_name}</td>
                              <td style={{verticalAlign: "middle"}}>{item.description}</td>
                              <td style={{verticalAlign: "middle", textAlign:"center"}}>
                                <select style={{width: "165px"}} defaultValue={item.group_id} onChange={(e)=>{this.changeGroup(item.dash_id,e)}}>
                                  <option value="null">{this.props.words.NDEF}</option>
                                  {
                                    this.props.dash.allGroupList.length > 0 &&
                                    this.props.dash.allGroupList.map((group, idx2) => {
                                      return <option key={idx2} value={group.group_id}
                                                    selected={group.group_id==item.group_id ? true : false}>
                                        {group.group_name}</option>
                                    })
                                  }
                                </select>
                              </td>
                              <td style={{verticalAlign: "middle", textAlign:"center"}}>
                                <span>
                                  <button className='btn btn-xcon btn-xcon-blue update-btn'
                                            onClick={() => this.editDash(item.dash_id)}>
                                      수정&nbsp;&nbsp;<i className="material-icons">play_circle_filled</i>
                                    </button>
                                  <button style={{marginLeft: "5px"}} className='btn btn-xcon btn-xcon-grey delete-btn'
                                          onClick={() => this.deleteDash(item.dash_id)}>
                                    삭제&nbsp;&nbsp;<i className="material-icons">delete</i>
                                  </button>
                                </span>
                              </td>
                            </tr>
                            </tbody>
                          )
                      })}
                </table>
              </ChartWrapper>
            </main>
          </div>
        </React.Fragment>
    )
  }
}

export default connect((state) => ({
  dash: state.dash,
  words:state.auth.words
}), (dispatch) => ({
  doDashboardList() { dispatch(dashboardList()) },
  doDeleteDashboard(dash_id) { dispatch(deleteDashboard(dash_id)) },
  doAllGroupList() { dispatch(allGroupList()) },
  doUpdateDashboardGroup(dash_id, group_id) { dispatch(updateDashboardGroup(dash_id, group_id)) }
}))(DashboardConfig);
