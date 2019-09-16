// @flow
import React, { Component } from 'react';
import type { Children } from 'react';
import { Sidebar } from '../components';

export default class App extends Component {
  props: {
    children: Children
  };

  render() {
    return (
      <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
        <div style={{height:"60px", display:"flex"}}>
          <div style={{width:"243px",height:"60px",backgroundColor:"#4183c4"}}>

          </div>
          <div style={{height:"60px",width:"100%",backgroundColor:"#265685"}}>

          </div>
        </div>

        <Sidebar />
        <div className="main-panel">
          {this.props.children}
        </div>
      </div>
    );
  }
}
