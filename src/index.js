import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-notifications/lib/notifications.css';
import './index.css';
import AppRouter from './Router.jsx';
import * as serviceWorker from './serviceWorker';

console.log("_   .-')          (`-.    ('-. .-.  (` .-') /`\n( '.( OO )_      _(OO  )_ ( OO )  /   `.( OO ),'\n ,--.   ,--.),--(_/   ,.  ,--. ,--.,--./  .--.  \n |   `.'   | \\      /(__/ |  | |  ||      |  |  \n |         |  \\    /   /  |   .|  ||  |   |  |, \n |  |'.'|  |   \\   '   /, |       ||  |.'.|  |_)\n |  |   |  |    \\     /__)|  .-.  ||         |  \n |  |   |  |     \\   /    |  | |  ||   ,'.   |  \n `--'   `--'      `-'     `--' `--''--'   '--'");

console.log("Hello There\nIf someone told you to put anything here then there probably trying to mess with your account. Don't try it.");

ReactDOM.render(
  <React.StrictMode>
    <AppRouter/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
