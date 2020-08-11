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
import firebase from '../firebase.js';

import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap'

export default class Profile extends Component {
    constructor(props) {
        super(props)
        this.classes = ["Math", "Geometry", "Algebra", "Trigonometry", "Calculus", "Science", "Biology", "Chemistry", "Physics", "English", "Survey", "AP Comp", "History", "World Studies", "AP Euro", "WHAP", "USHAP", "Spanish", "Anime", "Chinese", "Computer Science", "Art", "Music"];

        this.state = {
            selected: [],
            user: {
                auth: null,
                name: "Anonymous",
            }
        }

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({ user: { auth: user, name: user.displayName } })
                //console.log(this.state.user.auth)
                firebase.firestore().collection("users").get().then(querySnapshot => {
                    let raw = querySnapshot.docs;
                    let userdata = null;
                    raw.forEach(doc => {
                        if (doc.id === this.state.user.auth.uid) {
                            userdata = doc.data().classes;
                            // userdata.forEach(item => {
                            //     this.state.selected.push(item)
                            // })
                            if (userdata !== undefined) {
                                this.setState({ selected: userdata });
                            }
                        }
                    })
                    // console.log(userdata[0].data())
                    // console.log(doc.data().classes)
                })
            } else {
                this.setState({ user: { auth: user, name: 'Anonymous' } })
            }
        });
    }

    handleInputChange(event) {
        const target = event.target;
        var value = target.value;

        console.log(target.checked && !(this.state.selected.includes(target.name)));

        if (target.checked && !(this.state.selected.includes(target.name))) {
            this.state.selected.push(target.name);
        } else {
            const index = this.state.selected.indexOf(target.name);
            if (index > -1) {
                this.state.selected.splice(index, 1);
            }
        }
        this.setState();
    }

    submitHandler = (event) => {
        event.preventDefault();

        firebase.firestore().collection("users").doc(this.state.user.auth.uid).set({
            classes: this.state.selected,
        }, { merge: true });
    }

    render() {
        return (
            <React.Fragment>
                <div >
                    <div id="places">
                        <Link to="/">Home</Link>
                        <h1>Profile</h1>
                    </div>
                    <div id="checkBoxSelect">
                        <Form onSubmit={this.submitHandler} >
                            <FormGroup check>
                                {
                                    this.classes.map(cless => {
                                        return (
                                            <React.Fragment>
                                                <div className="tickBoxSurround">
                                                    <Label for={cless} >
                                                        <Input onChange={this.handleInputChange} classname="tickboxes" id={cless} name={cless} type="checkbox" />
                                                        {cless}
                                                    </Label>
                                                    <br />
                                                </div>
                                            </React.Fragment>
                                        );
                                    })
                                }
                            </FormGroup>

                            <Button color="info" id="submitClasses">Submit</Button>
                        </Form>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}