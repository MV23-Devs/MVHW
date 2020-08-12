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
import { isThrowStatement } from 'typescript';

export default class Profile extends Component {
    constructor(props) {
        super(props)
        this.classes = ["Math", "Geometry", "Algebra", "Trigonometry", "Calculus", "Science", "Biology", "Chemistry", "Physics", "English", "Survey", "AP Comp", "History", "World Studies", "AP Euro", "WHAP", "USHAP", "Spanish", "Anime", "Chinese", "Computer Science", "Art", "Music"];
        this.state = {
            selected: [],
            user: {
                auth: null,
                name: "Anonymous",
            },
            userClasses: [],
        }
        this.handleInputChange = this.handleInputChange.bind(this);


    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({ user: { auth: user, name: user.displayName } })
                //console.log("user auth = " + this.state.user.auth)
                firebase.firestore().collection("users").doc(user.uid).get().then(doc => {
                    this.setState({ userClasses: doc.data().classes });
                })
            } else {
                this.setState({ user: { auth: user, name: 'Anonymous' } })
            }
        });

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
            console.log("pushed elem", this.state.selected)
            target.value = true;
        } else {
            const index = this.state.selected.indexOf(target.name);
            if (index > -1) {
                this.state.selected.splice(index, 1);
                console.log("remove elem", this.state.selected)
            }
            target.value = false;
        }

        this.setState({ update: 1 });
        this.submitHandler(event);
    }

    submitHandler = (event) => {
        event.preventDefault();

        firebase.firestore().collection("users").doc(this.state.user.auth.uid).update({
            classes: this.state.selected,
        });
        firebase.firestore().collection("users").doc(this.state.user.auth.uid).get().then(doc => {
            this.setState({ userClasses: doc.data().classes });
        })
        this.setState({ update: 0 });
    }

    render() {
        console.log(this.state.user)
        return (
            <React.Fragment>
                <div >
                    <div id="checkBoxSelect">
                        <Link to="/">Home</Link>
                        <h1 className="pf-title">Profile</h1>
                        {
                            // this.state.user.auth.photoURL ?
                            // <img src={this.state.user.auth.photoURL} alt="pfp"/>
                            // :
                            // null
                        }
                        <hr className="line"/>
                        {
                            this.state.userClasses ?
                                <div id="checkBoxTitle">
                                    <h1 className="classSelect">Select Classes: <span className="badge"> {this.state.selected.length}</span></h1>
                                    <br />
                                </div>
                                :
                                null
                        }
                        <Form className="checkform" onSubmit={this.submitHandler} >
                            <FormGroup check>
                                {
                                    this.classes.map(cless => {
                                        return (
                                            <React.Fragment>
                                                <div className="tickBoxSurround">
                                                    <Label for={cless} >
                                                        {
                                                            this.state.userClasses ?
                                                                <Input onChange={this.handleInputChange} className="tickboxes" id={cless} name={cless} type="checkbox" checked={this.state.userClasses.indexOf(cless) > -1} />
                                                                :
                                                                <Input onChange={this.handleInputChange} className="tickboxes" id={cless} name={cless} type="checkbox" />
                                                        }
                                                        {cless}
                                                    </Label>
                                                    <br />
                                                </div>
                                            </React.Fragment>
                                        );
                                    })
                                }
                            </FormGroup>

                            {/* <Button color="info" id="submitClasses">Save Classes</Button> */}
                        </Form>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}