import React from 'react'


export default class Page404 extends React.Component {
  render() {
    return (
      <div id="content">
        {/* row */}
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div className="row">
              <div className="col-sm-12">
                <div className="text-center error-box">
                  <h1 className="error-text-2 bounceInDown animated"> Error 404 <span className="particle particle--c"/><span
                    className="particle particle--a"/><span className="particle particle--b"/></h1>

                  <h2 className="font-xl"><strong><i className="fa fa-fw fa-warning fa-lg text-warning"/>페이지를 찾을 수 없습니다.</strong></h2>
                  <br/>

                  <p className="lead">
                    요청된 페이지를 찾을 수 없으니 관리자에게 문의하세요.
                  </p>

                </div>
              </div>
            </div>
          </div>
          {/* end row */}
        </div>
      </div>
    )
  }
}