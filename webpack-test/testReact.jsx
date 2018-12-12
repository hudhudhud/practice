import React from 'react';
import ReactDOM from 'react-dom';

class TestReact extends React.Component{
    constructor(props){
        super(props);
        this.state={
            val:"hello"
        }
        this.change=this.change.bind(this)
    }
    change(e){
        this.setState({val:e.target.value})
    }
    render(){
        return (
        <div>
            this is a react div
            <img src={require('./img/2.png')}/>
            <input  type="text" value={this.state.val} onChange={this.change} />
            <p>input is : {this.state.val}</p>
        </div>)
        //注：return(必须在一行上，否则会报错
    }
}
ReactDOM.render(<TestReact/>,document.getElementById('react'))
