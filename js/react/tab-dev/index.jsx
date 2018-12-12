import React, { Component } from 'react';
import ReactDom from 'react-dom';
import Tabs from './tab/Tabs.jsx';
import Tab from './tab/Tab.jsx';
import Pagination from './pager/Pagination.jsx';
import Cascader from './cascader/Cascader.jsx';
import Slider from './slider/Slider.jsx'


function changePage(currentPage,pageNum){
  console.log(currentPage,pageNum)
}


const options = [{
  value: 'zhejiang',
  label: 'Zhejiang',
  children: [{
    value: 'hangzhou',
    label: 'Hangzhou',
    children: [{
      value: 'xihu',
      label: 'West Lake',
    }],
  }],
}, {
  value: 'jiangsu',
  label: 'Jiangsu',
  children: [{
    value: 'nanjing',
    label: 'Nanjing',
    children: [{
      value: 'zhonghuamen',
      label: 'Zhong Hua Men',
    }],
  }],
}];


function changeCasca(value) {
  console.log(value);
}

function onChangeSlider(value){
  console.log(value)
}

ReactDom.render(
<div>
<Cascader options={options} onChange={changeCasca} placeholder="Please select" />
  <Tabs>
 <Tab name="Tab1">
  content of Tab1
 </Tab>
 <Tab name="Tab2">
  content of Tab2
 </Tab>
 <Tab name="Tab3">
  content of Tab3
 </Tab>
</Tabs>
<Pagination defalutPage={6} total={150} pageSize={10} onChange={changePage} />
<Slider  value="30" max={200} activeColor="blue" bgColor="white" onChange={onChangeSlider}/>,
</div>
, document.getElementById('root'));

