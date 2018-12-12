import React,{Component} from 'react';
import ReactDom from 'react-dom';
import  './style.css';

export default class Tab extends Component{
	constructor() {
		super();

	}

	render(){
		return <div className='test'  id={this.props.name}>
			{this.props.name}</div>
	}
}
