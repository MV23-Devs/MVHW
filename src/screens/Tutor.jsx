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
import { get as _get, times } from "lodash";
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
            timesS: ["12:00", "02:30", "03:30", "04:30", "05:30", "06:30"],
            timesE: ["01:00", "03:30", "04:30", "05:30", "06:30", "07:30"],
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);


    }



    render() {
        return (
            <React.Fragment>
                {/* //title */}
                <div id="titleArea2">



                    <h1 id="title">MVHW</h1>

                    <Link to="/" >Home</Link>

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
                    <div className="meetingForm">
                        <Label style={{ color: "white" }} for="select">Select the subject of the meeting</Label>



                        <br />
                        
                        <Form onSubmit={this.handleSubmit}>
                            <Input type="select" name="select" style={{outline:"none"}} id="tags" value={this.state.value} onChange={this.handleChange}>
                                {this.createClassItems()}
                            </Input>
                            <br/>
                            <br/>
                            <p> Please select availability</p>
                            {this.giveTimes()}

                        </Form>

                        <Input type="submit" value="Submit" className="newBtn" style={{ margin: "auto" }} />


                    </div>
                    <div className="meetingForm">
                        <h1>Meetings</h1>
                    </div>
                </React.Fragment>

            )
        }


    }


    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        alert('An essay was submitted: ' + this.state.value);
        event.preventDefault();
    }

    giveTimes() {
        let list;

        let listList = [];
        for (let i = 0; i < this.state.timesS.length; i++) {
            let tempStr = this.state.timesS[i] + " - " + this.state.timesE[i];
            list = <React.Fragment>
                <div className="fixDiv">

                    <Input type='checkbox' name='check' />

                    <Label for='check'>{tempStr.toString()}</Label>
                </div>
            </React.Fragment>;
            listList.push(list)

        }
        return listList;
    }
    createClassItems() {
        let items = [];
        for (let i = 0; i < (classes.length); i++) {
            items.push(<option key={i}>{classes[i]}</option>);
        }
        return items;
    }
}