import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {RecoilRoot} from 'recoil';

ReactDOM.render(
    <RecoilRoot>
         <App />
    </RecoilRoot>
   
    , document.getElementById('root'));

serviceWorker.unregister();