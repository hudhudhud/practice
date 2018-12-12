import React,{Component} from 'react';
import ReactDom from 'react-dom';
import  './style.css';

export default class Tabs extends Component{
	constructor() {
		super();
		this.state={
			currentShowing:0,
			marginLeft:20
		}
	}

	show(e,index){
		this.setState({
				currentShowing:index,
				marginLeft:-index*500 +20
		})
	}



	render(){
		return <section>
			<ul className='pages'>
				{
					this.props.children.map((child,index)=>{
						return <li key={index} className={this.state.currentShowing == index ? 'active':''} onClick={(e)=>this.show(e,index)} >{child.props.name}</li>
					})
				}
			</ul>
			<div className='main' style={{marginLeft:this.state.marginLeft}} >{this.props.children}</div>
		</section>
	}
}
