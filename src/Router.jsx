import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Switch,
} from 'react-router-dom'
import Profile from './screens/Profile.jsx'
import Home from './screens/Home.jsx'

import firebase from './firebase.js';
const db = firebase.firestore();

function getAllPosts() {
    let allPosts = []
    db.collection('questions').get().then((querySnapshot) => {
        querySnapshot.docs.forEach(post => {
            allPosts.push(post.id)
        });
    }).then(() => {
        console.log(allPosts);
    })
}

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

            </Switch>
        </Router>

    )
}

export default AppRouter;