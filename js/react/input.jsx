<!DOCTYPE html>
<html>
<head>
  <title></title>
</head>
<script src="https://fb.me/react-15.1.0.js"></script>
<script src="https://fb.me/react-dom-15.1.0.js"></script>
  
<body>
  <div id="app"></div>
</body>
<script type="text/javascript">


//给初始值仍然需要可以编辑，react坑
var SuperInput=React.createClass({
  getInitialState(){
    return {
      value:"123"
    }
  },
  input(e){
    this.setState({
      value:e.target.value
    })
  },
  render(){
   return (<input type="text" onInput={this.input} value={this.state.value}/>)
  }
})

ReactDOM.render(<SuperInput/>,document.getElementById("app"))
</script>
</html>