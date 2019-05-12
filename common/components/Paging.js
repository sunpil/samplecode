import React from 'react';
import '../css/Paging.css'

export default class Paging extends React.Component {

    constructor(props) {
        super(props);
        const { resultSize, pageSize, totalItemSize } = props;
        const pager = this.getPager(resultSize, 1, pageSize, totalItemSize);
        this.state = {
            pager: pager,
            getPager: this.getPager
        }
    }

    static getDerivedStateFromProps(props, state) {
        let page = 1;
        if (props.pageStart != 0) {
            page = state.pager.currentPage;
        }
        state.pager = state.getPager(props.resultSize, page, props.pageSize, props.totalItemSize)
        return state;
    }

    setPage = (page, search) => {
        let pager = this.state.pager;
        const resultSize = this.props.resultSize;
        const totalItemSize = this.props.totalItemSize;

        const pageSize = this.props.pageSize;

        if (page < 1 || page > pager.totalPages) {
            return;
        }

        pager = this.getPager(resultSize, page, pageSize, totalItemSize);

        search(page);
        this.setState({ pager: pager });
    }

    getPager = (resultSize, currentPage, pageSize, totalItemSize) => {
        currentPage = currentPage || 1;
        pageSize = pageSize || 10;

        let totalPages = Math.ceil(resultSize / pageSize);
        let startPage, endPage;
        if (totalPages <= 10) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        let pages = [...Array(endPage + 1 - startPage).keys()].map(
            i => startPage + i
        );

        return {
            totalItemSize: totalItemSize,
            resultSize: resultSize,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            pages: pages
        }
    }

    render() {
        const { pager } = this.state;
        const { search, displayOnly} = this.props;

        if (!pager.pages || pager.pages.lenght <= 1) {
            return null;
        }

        return (
            <div className="row paginationWrapper">
                { (displayOnly === 'pagination') ? null :
                    <div className="col-md-4 detailsPagination" style={{ marginTop: "22px" }}>총 페이지: {pager.totalPages}, 노출결과: {pager.resultSize}건, 검색결과: {pager.totalItemSize}건</div>
                }
                { (displayOnly === 'details') ? null :
                <div className="col-md-8" style={{ textAlign: "right" }}>
                    <ul className="pagination pagination-sm">
                        <li className={pager.currentPage === 1 ? 'disabled arrow' : 'arrow'}>
                            <a className="pagingBox" onClick={() => this.setPage(1, search)}>«</a>
                        </li>
                        <li className={pager.currentPage === 1 ? 'disabled arrow' : 'arrow'}>
                            <a className="pagingBox" onClick={() => this.setPage(pager.currentPage - 1, search)}><i className="fa fa-angle-left" /></a>
                        </li>
                        {
                            pager.pages.map((page, i) => {
                                return (
                                    <li key={i} className={pager.currentPage === page ? "active" : ""}>
                                        <a className="pagingBox" onClick={() => this.setPage(page, search)}>{page}</a>
                                    </li>
                                )
                            })
                        }
                        <li className={pager.currentPage === pager.totalPages ? "disabled arrow" : "arrow"}>
                            <a className="pagingBox" onClick={() => this.setPage(pager.currentPage + 1, search)}><i className="fa fa-angle-right" /></a>
                        </li>
                        <li className={pager.currentPage === pager.totalPages ? "disabled arrow" : "arrow"}>
                            <a className="pagingBox" onClick={() => this.setPage(pager.totalPages, search)}>»</a>
                        </li>
                    </ul>
                </div>
                }
            </div>
        )
    }
}
