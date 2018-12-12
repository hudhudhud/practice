import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
  constructor() {
    super();
    var ary=[
        {name:"a",done:false},
        {name:"b",done:true}
      ]
    this.state = {
      todos:ary,
      checkAll:ary.every(it=>it.done)
    };
  }
  inputChange(todo){
      this.state.todos.push(todo)
      this.setState({
        todos:this.state.todos
      })
  }
  toggleDone(i,state){
      this.state.todos[i].done=state
      this.setState({
        todos:this.state.todos,
        checkAll:this.state.todos.every(it=>it.done)
      })
  }
  changed(){
    var done=this.checkAll.checked//e.target.checked
    var newtodos=this.state.todos.map(item=>{item.done=done;return item})
    this.setState({todos:newtodos,checkAll:done}
    )
  }
  render() {
    return (
      <div>
        <input type="checkbox"  checked={this.state.checkAll}
        ref={it=>this.checkAll=it}
        onChange={this.changed.bind(this)}/>
        <Add inputChange={(obj)=>this.inputChange(obj)}/>
        <TodoList todos={this.state.todos} toggleDone={(index,state)=>this.toggleDone(index,state)}/>
        <Rest rest={this.state.todos.filter(it=>!it.done).length}/>
      </div>
    );
  }
}

class Add extends Component {
  constructor() {
    super();
  }
  change(e){
    if(e.key==="Enter"){
      this.props.inputChange({
        name:this.input.value,
        done:false,
      })
      this.input.value=""
    }
  }
  render(){
    return (
      <input type="text" ref={(el)=>this.input=el} onKeyUp={(e)=>this.change(e)} />
    )
  }
}
class TodoList extends Component{
  constructor(){
    super();
  }
  toggleDone(i,state){
      this.props.toggleDone(i,state)
  }
  render(){
    return (
      <div>
      {
        this.props.todos.map((item,i)=>{
            return (
              <TodoItem key={i} todo={item} index={i} toggleDone={(index,state)=>this.toggleDone(index,state)}/>
            )
        })
      }
      </div>
    )
  }
}
class TodoItem extends Component{
  constructor(){
    super();
  }
  toggleDone(){
      this.props.toggleDone(this.props.index,this.checbox.checked)
  }
  render(){
    return (
      <div>
        <input type="checkbox" checked={this.props.todo.done}  onChange={()=>this.toggleDone()} ref={(el)=>this.checbox=el}/>
        <span>{this.props.todo.name}</span>
      </div>
    )
  }
}

class Rest extends Component{
  constructor(){
    super()
  }
  render(){
    return (
       <p>{this.props.rest} items left</p>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));


//https://stackblitz.com/edit/react-gdze1l