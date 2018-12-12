import React, { Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import './style.css';

class Tab extends Component{
  constructor(){
    super()
  }
  render(){
    return (
      <div style={{border:"1px solid red"}}>
       {this.props.children[0]}
      </div>
    )
  }
}

class Tabs extends Component {
  constructor() {
    super();
    this.tabStyle={"display":'inline-block',margin:"10px",border:"1px solid blue"}
    this.currentStyle={...this.tabStyle,border:"1px solid red"}
    this.state = {
      currentTab: 0,
    }
  }
  setStyle(obj){
    this.setState({
       currentStyle:{...obj}
    })
  }
  getContent(i){
    this.setState({
      currentTab:i
    })
    this.forceUpdate()
  }
  render() {
    return (
      <div style={{border:"2px solid pink"}}>
         <ul >
            {this.props.children.map((item,i)=>{
                return (
                  <li style={this.state.currentTab==i?this.currentStyle:this.tabStyle} onClick={()=>this.getContent(i)}>{item.props.name}</li>
                )
            })}
         </ul>
         <p>{this.props.children[this.state.currentTab]}</p>
      </div>
    );
  }
}

render(<Tabs>
 <Tab name="a">
 1
 </Tab>
 <Tab name="b">
 2
 </Tab>
 <Tab name="c">
 3
 </Tab>
</Tabs>, document.getElementById('root'));

//https://stackblitz.com/edit/react-nvaaok