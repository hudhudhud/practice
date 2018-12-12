import React, { Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import './style.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: 'React',
      todos:[{
        name:"study",
        done:false,
      },
      {
        name:"study1",
        done:false,
      }]
    };
  }
  keyup(e){
    if(e.key=="Enter"){
      this.state.todos.push({name:e.target.value,done:false})
      this.setState({})
      e.target.value=""
    }
  }
  toggleDone(i){
      this.state.todos[i].done=!this.state.todos[i].done
      this.setState({})
  }
  toggleAll(){
    var res=this.state.todos.every(it=>it.done)
    if(res){
       this.state.todos.map(it=>it.done=false)
    }else{
      this.state.todos.map(it=>it.done=true)
    }
    this.setState({})
  }
  isAnyDone(){
    return this.state.todos.some(it=>it.done)
  }
  clearComp(){
    //标准的修改要这么改
     this.setState({
       todos:this.state.todos.filter(item=>!item.done)
     })
  }
  render() {
    return (
      // classnames = require('classnames')
      //classnames({a:true,b:true,c:false} ,['foo','bar'], 'zs','ls')
      <section className={["a","b"].join(" ")}>
       <label htmlFor="123">123</label>
        <div>
         <input type="checkbox"  checked={this.state.todos.every(it=>it.done)} onClick={this.toggleAll.bind(this)}/>
         <input type="text"  onKeyUp={this.keyup.bind(this)} />
        </div>
        <ul>
           {
             this.state.todos.map((item,i)=>{
             return  (
                  <li>
                      <input type="checkbox" onClick={()=>this.toggleDone(i)} checked={item.done}/>
                      {item.name}
                  </li>
               ) 
             })
           }
        </ul>
        <div>
           <span>{this.state.todos.filter(it=>!it.done).length} left</span>
          {
              this.state.todos.some(it=>it.done)?<button onClick={this.clearComp.bind(this)}>clear completed1</button>:""
          }
          <button style={{display:this.isAnyDone.bind(this)()?"block":"none"}} onClick={this.clearComp.bind(this)} >clear completed2</button>
        </div>
       </section>
    );
  }
}

render(<App />, document.getElementById('root'));


https://stackblitz.com/edit/react-5pkodn?file=index.js