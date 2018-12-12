import React, { Component } from 'react';
import './style.css';
import PropTypes from 'prop-types';

export default class Tab extends Component{
  static propTypes={
    children:PropTypes.any.isRequired,
    name:PropTypes.string.isRequired,
  }
  constructor(){
    super()
  }
  render(){
    return (
      <p className="content">
       {this.props.children}
      </p>
    )
  }
}

