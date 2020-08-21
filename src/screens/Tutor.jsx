import React, {
    Component,
    useState
} from 'react';
import '../App.css';
import { Row, Col, Form, FormGroup, Label, Input, Badge, UncontrolledPopover, PopoverBody, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import {
    Link
} from 'react-router-dom'
import firebase from '../firebase.js';
import { get as _get } from "lodash";
import Question from '../Question';

// the start of cleaning up the firestore pull from database
// const db = firebase.firestore()

const Votes = (props) => {
    let id = "vote-num-" + props.listvalue;
    return (
        <div>
            <h5 id={id} className="upvotes-num">{props.num}</h5>
            <UncontrolledPopover trigger="legacy" placement="bottom" target={id}>
                <PopoverBody>
                    {props.actualNumber}
                </PopoverBody>
            </UncontrolledPopover>
        </div>
    );
}



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
            times: [["12:00", "1:00"]["2:30", "3:30"]]
        }


    }



    render() {
        return (
            <React.Fragment>
                {/* //title */}
                <div id="titleArea2">



                    <h1 id="title">MVHW</h1>

                    <Link to="/" style={{ display: "inline-block" }}>Home</Link>

                    {/* {
                        this.state.user.auth !== null ?
                            <ProfilePictureDropdown signout={this.signoutwithGoogle}><img src={this.state.user.auth.photoURL} alt={this.state.user.name} id="logOut" /></ProfilePictureDropdown>
                            :
                            <Button color='light' id="logIn" onClick={this.signinwithGoogle}>Sign In</Button>
                    } */}
                </div>
                <div id="general">
                    {
                        this.requestMeeting()
                    }
                </div>
            </React.Fragment>
        )
    }

    requestMeeting() {
        if (!this.state.requesting) {
            console.log("requesting help")
            return (
                <React.Fragment>

                    <Button id="requestHelp" onClick={this.setState({ requesting: true })}>Request meeting</Button >
                </React.Fragment>

            )

        }
        else {
            return (

                <React.Fragment>
                    <div id="meetingForm">
                        <Label style={{ color: "white" }} for="select">Select the subject of the meeting</Label>

                        <Input type="select" name="select" id="tags" onChange={this.filterClass}>
                            {this.createClassItems()}
                        </Input>


                        <Form>

                        </Form>
                    </div>
                </React.Fragment>

            )
        }


    }
    createClassItems() {
        let items = [];
        for (let i = 0; i < (classes.length); i++) {
            items.push(<option key={i}>{classes[i]}</option>);
        }
        return items;
    }

}