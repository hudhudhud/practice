import React, { Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import './style.css';

class TodoApp extends React.Component {
  constructor() {
    super()
    this.state = {
      todos: [
        {content:'a', done:true},
        {content:'b', done:false},
        {content:'c', done:true}
      ]
    }
  }
  
  todoStateChange(index, targetState) {
    var todos = this.state.todos
    todos[index].done = targetState
    this.setState({
      todos: todos
    })
  }
  
  addTodo(todo) {
    var todos = this.state.todos.concat(todo)
    this.setState({
      todos: todos
    })
  }
  
  deleteTodo(index) {
    var todos = this.state.todos.splice(index, 1)
    this.setState({
      todos,
    })
  }
  
  render(){
    return (
      <section className="todo-app">
        <AddTodo onAdd={(todo) => this.addTodo(todo)}/>
        <TodoList
          deleteTodo={idx => this.deleteTodo(idx)}
          onStateChange={(index,newState) => this.todoStateChange(index,newState)}
          todos={this.state.todos}/>
        <Rest count={this.state.todos.filter(it => !it.done).length}/>
      </section>
    )
  }
}

class AddTodo extends React.Component {
  handleKeyUp(e) {
    if (e.key === 'Enter') {
      this.props.onAdd({
        content: this.input.value,
        done: false
      })
      this.input.value = ''
    }
  }
  
  render(){
    return <input ref={el => this.input = el} type="text" onKeyUp={(e) => this.handleKeyUp(e)}/>
  }
}

function Rest({count}) {
  return <div>{count} items(s) left</div>
}

class TodoList extends React.Component {
  render(){
    return (
      <ul>
        {
          this.props.todos.map((todo, index) => {
            return <TodoItem
              key={index}
              onStateChange={(index,state) => this.props.onStateChange(index,state)}
              deleteTodo={idx => this.props.deleteTodo(idx)}
              todo={todo}
              index={index}/>
          })
        }
      </ul>
    )
  }
}


class TodoItem extends React.Component {
  toggleDone(e) {
    this.props.onStateChange(this.props.index, e.target.checked)
  }
  deleteMe() {
    this.props.deleteTodo(this.props.index)
  }
  render() {
    return (
      <li>
        <input
          onChange={(e) => this.toggleDone(e)}
          type="checkbox"
          checked={this.props.todo.done}
        />
        <span>{this.props.todo.content}</span>
        <button onClick={() => this.deleteMe()}>x</button>
      </li>
    )
  }
}

ReactDOM.render((
  <TodoApp/>
), document.getElementById('app'))

</script>
</html>