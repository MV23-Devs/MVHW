import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Switch,
} from 'react-router-dom'
import Profile from './screens/Profile.jsx'
import Home from './screens/Home.jsx'
import Teacher from './screens/Teacher.jsx'
import Tutor from './screens/Tutor.jsx'


const AppRouter = () => {
    return (
        <Router>
            <Switch>
                <Route exact path='/'>
                    <Home />
                </Route>
                <Route path='/profile'>
                    <Profile />
                </Route>
                <Route path='/teacher-sign-in'>
                    <Teacher />
                </Route>
                <Route path='/tutoring'>
                    <Tutor />
                </Route>
            </Switch>
        </Router>

    )
}

export default AppRouter;