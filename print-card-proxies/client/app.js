import React from 'react';
import ReactDOM from 'react-dom';
import './style.scss';

import ProxyList from './proxy'

const App = (props) => (
    <ProxyList />
);

ReactDOM.render((
    <App/>
), document.getElementById('app'));
