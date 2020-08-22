import React, {
    Component,
    useState
} from 'react';
import '../App.css';
import {
    Card, CardImg, CardBody, Button, Form, FormGroup, Label, Input, FormText, Badge, Spinner, Modal, ModalHeader, ModalBody, ModalFooter, Dropdown, DropdownToggle, DropdownMenu, DropdownItem
  } from 'reactstrap';
import {
    Link
} from 'react-router-dom'
import { get as _get, times } from "lodash";

import firebase from '../firebase.js';
import { storage } from '../firebase.js';


const theme1 = {
    header: {
        backgroundColor: '#222',
        color: '#fff',
    },
    body: {
        backgroundColor: '#333',
    },
    footer: {
        backgroundColor: '#222',
        color: '#ccc',
    },
    line: {
        backgroundColor: '#fff',
    },
    link: {
        color: '#fff',
    }
};

const ProfilePictureDropdown = (props) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);
  
    return (
      <Dropdown isOpen={dropdownOpen} toggle={toggle} id="socialDrop">
        <DropdownToggle
          tag="span"
          data-toggle="dropdown"
          aria-expanded={dropdownOpen}
        >
          {props.children}
        </DropdownToggle>
        <DropdownMenu id="ProfileMenu">
          <Link to="/profile"><DropdownItem >Profile</DropdownItem></Link>
          <DropdownItem onClick={props.signout}>Sign Out</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }


const dark = {
    backgroundColor: '#222',
    color: '#fff',
    line: {
        backgroundColor: '#fff',
    }
};
const classes = ["None", "English", "Biology"];



export default class Tutor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            requesting: false,
            subject: null,
            timesChecked: [],




            timesS: ["12:00", "02:30", "03:30", "04:30", "05:30", "06:30"],
            timesE: ["01:00", "03:30", "04:30", "05:30", "06:30", "07:30"],
            errormessage: '',
            user: {
                auth: null,
                name: 'Anonymous',
              },


        }

        this.handleChange = this.handleChange.bind(this);
        this.submitHandler = this.submitHandler.bind(this);

        let checkedStart = []
        for (let i = 0; i < this.state.timesE.length; i++) {
            checkedStart.push(false)
        }
        this.setState({ timesChecked: checkedStart });


    }



    render() {
        return (
            <React.Fragment>
                {/* //title */}
                <div id="titleArea2">



                    <h1 id="title">MVHW</h1>

                    <Link to="/" >Home</Link>

                    {
                        this.state.user.auth !== null ?
                            <ProfilePictureDropdown signout={this.signoutwithGoogle}><img src={this.state.user.auth.photoURL} alt={this.state.user.name} id="logOut" /></ProfilePictureDropdown>
                            :
                            <Button color='light' id="logIn" onClick={this.signinwithGoogle}>Sign In</Button>
                    }
                </div>
                <div id="general">
                    {
                        this.requestMeeting()
                    }
                </div>
            </React.Fragment>
        )
    }

   


    handleChange(event, itemToChange) {
        this.setState({ itemToChange: event.target.value });
    }

    //stolen from Home.jsx
    submitHandler = (event) => {
        event.preventDefault();
        let val = event.target["text"].value;
        let t = event.target["select"].value;
        let anonymous = this.state.anonymousPost
        if (val === "") {
            let err = <FormText color="danger">You cannot post nothing!</FormText>;
            this.setState({ errormessage: err });
        } else if (this.state.user.auth === null) {
            let err = <FormText color="danger">You have to sign in to request something</FormText>;
            this.setState({ errormessage: err });
        } else {
            this.setState({ errormessage: '' });

            let date = (new Date()).toString();
            let name = "";
            if (anonymous === true) {
                name = "Anonymous";
            } else {
                name = this.state.user.name;
            }
            if (this.handleImageUpload() !== null) {
                this.handleImageUpload()
                    .then(url => {
                        this.fileinputref.current.value = null
                        this.forceUpdate()
                        this.setState({ url });
                        //console.log(this.fileinputref)
                        firebase.firestore()
                            .collection('questions')
                            .add({
                                title: val,
                                img_url: this.state.url,
                                username: name,
                                auth: JSON.stringify(this.state.user.auth),
                                usersUpvoted: [],
                                usersDownvoted: [],
                                timestamp: date,
                                tags: t,
                            }).then((docRef) => {
                                firebase.firestore()
                                    .collection('users').doc(this.state.user.auth.uid).collection("posts")
                                    .add({
                                        title: val,
                                        img_url: this.state.url,
                                        timestamp: date,
                                        tags: t,
                                        original: docRef.id,
                                    }).then((docRef) => {
                                        firebase.database().ref('audit log').push(date + ": created a new post");
                                        this.setState({ image: null });
                                    });
                                firebase.database().ref('audit log').push(date + ": created a new post");
                                this.setState({ image: null });
                            });
                    });
            } else {
                firebase.firestore()
                    .collection('questions')
                    .add({
                        title: val,
                        img_url: this.state.url,
                        username: name,
                        auth: JSON.stringify(this.state.user.auth),
                        usersUpvoted: [],
                        usersDownvoted: [],
                        timestamp: date,
                        tags: t,
                    }).then((docRef) => {
                        firebase.firestore()
                            .collection('users').doc(this.state.user.auth.uid).collection("posts")
                            .add({
                                title: val,
                                img_url: this.state.url,
                                timestamp: date,
                                tags: t,
                                original: docRef.id,
                            }).then((docRef) => {
                                firebase.database().ref('audit log').push(date + ": created a new post");
                                this.setState({ image: null });
                            });
                        firebase.database().ref('audit log').push(date + ": created a new post");
                    });
            }
        }

        this.setState({ update: 0 });
        event.target["text"].value = "";
    }


    
}