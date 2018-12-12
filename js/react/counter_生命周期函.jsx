import React, { Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import './style.css';

//修改组件上的属性，但不rend组件，只在必要的更新才修改
class Counter extends Component {
  constructor() {
    super();
    this.state = {
       count: 0,
    };
    this.renderTime=0
    this.iscomponentWillUnmount=0
 }
 asc(){
    this.setState({
      count:this.state.count+1
    })
  }
  desc(){
    this.setState({
      count:this.state.count-1
    })
  }
  shouldComponentUpdate(nextProps,nextState){ //只在需要的时候才render组件，提高性能
    if(nextState.count!=this.state.count){
      return true
    }
    return false
  }
  componentWillUnmount(){  //组件在页面中去掉时调用
    console.log("iscomponentWillUnmount")
  }
  render() {
     this.renderTime++
   return (
        <div>
          <span>renderTime:{this.renderTime}</span>
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
    this.state = {
       n:5,
    }
  }
  render(){
    return (
      <div>
       <Counter start={this.state.n} />
        {this.state.n>0.5?<Counter start={5} />:null}
       <p onClick={()=>this.setState({n:Math.random()})}>click me ,i will change the Counter property start={this.state.n} ,but not render it</p>
      </div>
    )
  }
}

render(<UseCounter />, document.getElementById('root'));


//https://stackblitz.com/edit/react-swaun9