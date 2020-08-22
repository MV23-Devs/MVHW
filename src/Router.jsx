import React, {Component} from 'react'
import {
    BrowserRouter as Router,
    Route,
    Switch,
} from 'react-router-dom'
import Profile from './screens/Profile.jsx'
import Home from './screens/Home.jsx'
import Teacher from './screens/Teacher.jsx'
import Tutor from './screens/Tutor.jsx'
import QuestionPage from './screens/QuestionPage.jsx'
import firebase from './firebase.js';
//import { post } from 'jquery'

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
                    <Route exact path='/' component={Home}/>
                    <Route path='/profile' component={Profile}/>
                    <Route path="/question/:id" component={QuestionPage}/>
                    <Route path="/teacher-sign-in" component={Teacher}/>
                    <Route path="/tutoring" component={Tutor}/>
                </Switch>
            </Router>
        )
    }

    getAllPosts() {
        firebase.firestore().collection('questions').get().then((querySnapshot) => {
            // console.log(querySnapshot.docs);
            querySnapshot.docs.forEach(post => {
            this.allPosts.push(post.id)
            });
        })

        console.log(this.allPosts[0]);

    }
}
