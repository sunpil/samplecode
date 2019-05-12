import React from 'react'

export default class PagingTable extends React.Component {
    constructor(props) {
        super(props);

        this.pageData = {
          size : "",
          page : ""
        }
    }

    sizeChange = (e) => {
      this.pageData.size = e.target.value;
      this.pageData.page = 0;
      this.props.pagingFunction(this.pageData);
    }
  
    pageChange = (k) => {
      if(k==-1)return;
      this.pageData.size = this.refs._size.value;
      this.pageData.page = k;
      this.props.pagingFunction(this.pageData);
    }

    render() {
        let pageBtnListCount = 5;
        let totalPage = Number(this.props.totalPage) || 0;
        let currentPage = Number(this.props.currentPage)+1 || 0;
        let startPageNum = 0;
        let endPageNum = 0;

        if(totalPage != 0 && currentPage != 0){
          startPageNum = currentPage - Math.floor((pageBtnListCount/2));
          endPageNum = currentPage + Math.floor((pageBtnListCount/2));

          if(startPageNum <= 0){
            startPageNum = 1;
            endPageNum = pageBtnListCount;
          }
          if(endPageNum >= totalPage){
            endPageNum = totalPage;
            startPageNum = endPageNum - pageBtnListCount + 1;
            if(startPageNum <= 0)startPageNum = 1;
          }
        }

        return (          
          <div className="row" style={{ height: 35}}>
            <div className="col-md-4" style={{ textAlign: "left" }}>
              <select className="form-control" ref="_size" onChange={this.sizeChange} style={{width:65}}>
                <option value="10" selected={this.props.listSize=="10"?"":false}>10</option>
                <option value="15" selected={this.props.listSize=="15"?true:false}>15</option>
                <option value="20" selected={this.props.listSize=="20"?true:false}>20</option>
              </select>
            </div>
            <div className="col-md-8" style={{ textAlign: "right"}}>
                <ul className="pagination pagination-sm" style={{marginTop:0}}>
                    <li className={currentPage == 1 ? 'disabled arrow' : 'arrow'}>
                        <a className="pagingBox" onClick={currentPage == 1?()=>{return;}:() => this.pageChange(0)}><i className="fa fa-angle-left" /></a>
                    </li>
                    {
                      Array.from({ length: Number(pageBtnListCount) }, (v, k) => {
                        if(startPageNum + k <= endPageNum){
                          return <li key={startPageNum + k} className={startPageNum + k == currentPage? "active" : ""}>
                              <a className="pagingBox" onClick={() => this.pageChange(startPageNum + k - 1)}>{startPageNum + k}</a>
                          </li>
                        }
                      })
                    }
                    <li className={currentPage === totalPage ? "disabled arrow" : "arrow"}>
                        <a className="pagingBox" onClick={ totalPage == currentPage ? () => { return; }:() => this.pageChange(totalPage-1)}><i className="fa fa-angle-right" /></a>
                    </li>
                </ul>
            </div>
          </div>
        )
    }
}
