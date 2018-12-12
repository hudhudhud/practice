<!DOCTYPE html>
<html ng-app="app">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>JS Bin</title>
  <script src="https://fb.me/react-15.1.0.js"></script>
  <script src="https://fb.me/react-dom-15.1.0.js"></script>
</head>
<body>
  <div id="app"></div>
</body>
</html>
<script type="text/javascript">
var TodoApp = React.createClass({
  getInitialState(){
    return {
      todos: [{
        content: 'learn react',for (var i = Things.length - 1; i >= 0; i--) {
          Things[i]
        }
        done: false,
      }]
    }
  },
  addTodo(e) {
    if (e.key === 'Enter') {
      this.state.todos.push({
        content: e.target.value,
        done: false
      })
      this.setState({})
      e.target.value = ''
    }
  },
  toggleDone(index) {
    this.state.todos[index].done = !this.state.todos[index].done
    
    this.setState({
      todos: this.state.todos
    })
  },
  toggleSelectAll(e) {
    if (this.isAllDone()) {
      this.state.todos.forEach(it => it.done = false)
    } else {
      this.state.todos.forEach(it => it.done = true)
    }
    this.setState({})
  },
  isAllDone(){
    return this.state.todos.every(it => it.done)
  },
  clearAllDone(){
    this.setState({
      todos: this.state.todos.filter(it => !it.done)
    })
  },
  isAnyDone(){
    return this.state.todos.some(it => it.done)
  },
  render(){
    return (
      <section>
        <div>
          <input onClick={this.toggleSelectAll} type="checkbox" checked={this.state.todos.every(it => it.done)} />
          <input type="text" onKeyUp={this.addTodo} />
        </div>
        <ul>
          {
            this.state.todos.map((it,i) => {
              return (
                <li>
                  <input checked={it.done} onClick={() => {
                    this.toggleDone(i)
                  }} type="checkbox" />
                  {it.content}
                </li>
              )
            })
          }
        </ul>
        <div>
          <span>{this.state.todos.filter(it => !it.done).length} items left</span>
          
          {
            this.isAnyDone() ? <button onClick={this.clearAllDone}>Clear All Done</button> : null
          }
        </div>
      </section>
    )
  }
})
 
var Counter = React.createClass({
  getInitialState(){
    return {
      count: this.props.start
    }
  },
  dec(){
    this.setState({
      count: this.state.count - 1
    })
  },
  inc(){
    this.setState({
      count: this.state.count + 1
    })
  },
  getClassNames(){
    return classnames({a:true,b:true})
  },
  render(){
    // classnames = require('classnames')
    //classnames({a:true,b:true,c:false} ,['foo','bar'], 'zs','ls')
   return (
     <div className={this.getClassNames()}>
       <label for="xx">aa</label>
       <button onClick={this.dec}> - </button>
       <span>{this.state.count}</span>
       <button onClick={this.inc}>+</button>
     </div>
   )
  }
})

// ReactDOM.render(<TodoApp/>, document.getElementById('app'))

ReactDOM.render(
<div>
  <Counter start={5}/>
  <Counter start={6}/>
  <Counter start={7}/>
  <Counter start={8}/>
  <Counter start={9}/>
  <TodoApp/>
</div>)

document.getElementById('app'))
</script>