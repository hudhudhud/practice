import React from 'react';
import ReactDom from 'react-dom';
import Tabs from './Tabs.jsx';
import Tab from './Tab.jsx';



ReactDom.render( < Tabs >
  < Tab name = "normal" > < /Tab> < Tab name = "account" > < /Tab> < Tab name = "import" > < /Tab> < Tab name = "install" > < /Tab> < /Tabs>, document.getElementById('app'))

// https://stackblitz.com/edit/react-thfssu?file=index.js