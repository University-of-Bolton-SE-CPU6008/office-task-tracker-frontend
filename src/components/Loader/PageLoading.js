import React, {Component} from 'react';
import {Modal} from "reactstrap";
import './loader.scss'
import SyncLoader from "react-spinners/SyncLoader";
import { CircularProgressbar } from 'react-circular-progressbar';

class PageLoading extends Component {

  render() {
    return (
      <Modal
        isOpen={this.props.loading}
        centered={true}
        contentClassName={"ModelLoader"}
        modalClassName={"ModalClass"}
      >
        {/*<HashLoader*/}
        {/*  size={80}*/}
        {/*  color={'white'}*/}
        {/*/>*/}
        <div style={{ width: 140, height: 140 }}>
        <CircularProgressbar value={this.props.loadingPercent} text={`${this.props.loadingPercent}%`} />
        </div>
        <div style={{display:'flex',marginTop:30,alignItems:'center'}}>
          <text className={"Text"}>Uploading</text>
          <SyncLoader color={'white'} size={8}/>
        </div>

      </Modal>
    );
  }
}

export default PageLoading;
