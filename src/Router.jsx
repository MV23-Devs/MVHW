import React, {Component} from 'react'
import {
    BrowserRouter as Router,
    Route, 
    Switch, 
    Link
} from 'react-router-dom'
import Profile from './screens/Profile.jsx'
import Home from './screens/Home.jsx'


export default class AppRouter extends Component{
    render(){
        return (
            <Router>
                <div id="navbar" name="navbar">
                    <nav>
                        <Link to="/">Home</Link>
                        <Link to="/profile">Profile</Link>
                    </nav>
                </div>
                <Switch>
                    <Route path='/'>
                        <Home/>
                    </Route>
                    <Route path='/profile'>
                        <Profile/>
                    </Route>
                </Switch>
            </Router>
        )
    }
}