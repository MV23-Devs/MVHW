import React, { Component } from 'react'
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
        this.state = {
            user: {
                auth: null,
                name: 'Anonymous',
            },
            language: "en",
        }
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {

            if (user) {
                firebase.firestore().collection("users").doc(user.uid).get().then(doc => {
                    this.setState({ user: { auth: user, name: user.displayName, data: doc.data() } })
                })
            } else {
                this.setState({ user: { auth: user, name: 'Anonymous' } })
            }
        })
    }
    
    languageChangeHandler = () => {
        this.setState({language: this.state.language === "en" ? "es" : "en"});
    }

    render() {

            this.getAllPosts();
            return (
                <Router>
                    <Switch>
                        <Route exact path='/'><Home language={this.state.language} languageChangeHandler={this.languageChangeHandler}/></Route>
                        <Route path='/profile'><Profile language={this.state.language}/></Route>
                        <Route path="/question/:id" component={QuestionPage} />
                        <Route path="/teacher-dashboard" component={Teacher} />
                        <Route path="/tutoring"><Tutor user={this.state.user} /></Route>
                    </Switch>
                </Router>
            )
        
        
    }


    getAllPosts() {
        firebase.firestore().collection('questions').get().then((querySnapshot) => {
            querySnapshot.docs.forEach(post => {
                this.allPosts.push(post.id)
            });
        })
    }
}
