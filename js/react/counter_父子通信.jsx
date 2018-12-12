import React, { Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import './style.css';

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
       count: props.start | 0,
    };
    this.renderTime=0
 }
 emit(fname,args){
    if(typeof this.props[fname] =="function"){
        this.props[fname](...args)
    }
 }
 asc(){
    this.setState({
      count:this.state.count+1
    })
    this.emit("asc")
  }
  desc(){
    this.setState({
      count:this.state.count-1
    })
    this.emit("desc")
  }
  shouldComponentUpdate(nextProps,nextState){
    if(nextState.count!=this.state.count){
      return true
    }
    return false
  }
  render() {
     this.renderTime++
   return (
        <div>
          <button  onClick={()=>this.desc()}>-</button>
          <span>{this.state.count}</span>
          <button  onClick={()=>this.asc()}>+</button>
        </div>
    )
  }
}

class UseCounter extends Component {
  constructor() {
    super();
    this.state={
      allCount:0
    }
  }
  asc(){
    this.setState({
      allCount:this.state.allCount+1
    })
  }
  desc(){
    this.setState({
      allCount:this.state.allCount-1
    })
  }
  render(){
    return (
      <div>
        <p>sum:{this.state.allCount}</p>
        <Counter start={5}  asc={()=>this.asc()} desc={()=>this.desc()}/>
        <Counter start={6}  asc={()=>this.asc()} desc={()=>this.desc()}/>
      </div>
    )
  }
}

render(<UseCounter />, document.getElementById('root'));

//https://stackblitz.com/edit/react-csn7wd
