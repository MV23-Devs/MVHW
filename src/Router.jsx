import React, { Component } from 'react'
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'
import Profile from './screens/Profile.jsx'
import Home from './screens/Home.jsx'
import { post } from 'jquery'

import firebase from './firebase.js';
const db = firebase.firestore();



export default class AppRouter extends Component {
    constructor(props) {
        super(props);
        this.getAllPosts.bind(this);
        this.allPosts = [];
        
    }
    render() {
        this.getAllPosts();
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


    getAllPosts() {
        db.collection('questions').get().then((querySnapshot) => {
            // console.log(querySnapshot.docs);
            querySnapshot.docs.forEach(post => {
            this.allPosts.push(post.id)
            });
        })

        console.log(this.allPosts[0]);

        
       
    }
}