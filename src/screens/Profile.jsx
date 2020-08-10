import React, { Component } from 'react';
import '../App.css';
import NavBar from '../components/NavBar.jsx'
import {
    Switch,
    Route,
    Link,
    Redirect,
    useHistory,
    useLocation,
    withRouter
  } from 'react-router-dom'

export default class Profile extends Component{
    state={}

    render(){
        return (
            <React.Fragment>
                <p>Hello</p>
                <Link to="/">Home</Link>
            </React.Fragment>
        )
    }
}