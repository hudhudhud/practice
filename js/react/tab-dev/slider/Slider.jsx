import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.css';
import PropTypes from 'prop-types';

export default class Slider extends Component {
  static propTypes={
      max:PropTypes.number,
      min:PropTypes.number,
      step:PropTypes.number,
      activeColor:PropTypes.string,
      bgColor:PropTypes.string,
  }
  static defaultProps={
      max:100,
      min:0,
      step:1,
      activeColor:"blue",
      bgColor:"gray",
  }
  constructor(props){
    super(props);
    this.state = {
      value: props.value,
    };
    this.change=this.change.bind(this)
  }
  change(e){
    this.setState({value:e.target.value})
    if(typeof this.props.onChange=="function"){
      this.props.onChange(e.target.value)//不要获取this.state.value,因为是异步获取，取到的还是前一个值
    }
  }
  render() {
    var percent=(this.state.value-this.props.min)/(this.props.max-this.props.min)*100
    return (
      <div className="slider" >
          <input type="range" style={{'backgroundImage':`linear-gradient(to right,${this.props.activeColor} ${percent}%,${this.props.activeColor},${this.props.bgColor} 0)`}}  
          onInput={this.change} 
          defaultValue={this.state.value} 
          max={this.props.max} 
          min={this.props.min}  
          step={this.props.step}/ >
      </div>
    );
  }
}


