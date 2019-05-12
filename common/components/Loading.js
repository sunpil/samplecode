import React from 'react';
import { css } from 'react-emotion';
import { ClipLoader } from 'react-spinners';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
    position: absolute;
    height: 200px;
    width: 400px;
    margin: -100px 0 0 -200px;
    top: 50%;
    left: 50%;
`;

export default class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    }
  }
  render() {
    return (
      <div className='sweet-loading'>
        <ClipLoader
          className={override}
          sizeUnit={"px"}
          size={190}
          color={'#123abc'}
          loading={this.state.loading}
        />
      </div>
    )
  }
}
