import React, {
    Component,
} from 'react';
import '../App.css';
import {
    Button, Form, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import { ProfilePictureDropdown } from "./Home.jsx"

import {
    Link
} from 'react-router-dom'
import firebase from '../firebase.js';
import Meeting from './Meeting.jsx'

const classes = ["None", "English", "Biology"];

const db = firebase.firestore();

const SuccessDialog = (props) => {
    
    const {
        onChange,
        show
    } = props

    const toggle = () => {
        onChange(!show);
    }

    return (
        <div>
            <Modal isOpen={show} toggle={toggle}>
                <ModalHeader toggle={toggle}>Success!</ModalHeader>
                <ModalBody>
                    Your email has successfully been sent to the AVID tutors! Be sure to frequently check your emails, because they will be responding soon!
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={toggle}>OK! I will check my email!</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default class Tutor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            requesting: false,
            subject: null,
            dialogShow: false,
            meetingsListSaved: [],
            classChosen: "",
            checkboxesSelected: [],




            times: ["12:00 - 1:00", "02:30 - 3:30", "03:30 - 4:30", "04:30 - 5:30", "05:30 - 6:30", "06:30 - 7:30"],

            errormessage: '',
            user: {
                auth: null,
                name: 'Anonymous',
            },


        }

        this.handleClassChange = this.handleClassChange.bind(this);
        this.submitHandler = this.submitHandler.bind(this);



        let checkedStart = []
        for (let i = 0; i < this.state.times.length; i++) {
            checkedStart.push(false)
        }
        this.state.checkboxesSelected = checkedStart;



    }


    componentDidMount() {


        this.setState({ user: this.props.user });




        // console.log("this.props.user " + this.props.user.auth)







        console.log('adding meetings')
        //working ish v
        // let tempErrTest = db.collection('meetings').doc('JnnvTgp4CNohTT5sI3uD').get().then(doc =>{
        //     console.log(doc.data().time)
        // })

        //temporary local meeting list
        let meetingsListReal = [];
        //the meeting list of th edaabase
        if (this.state.user.auth) {
            firebase.firestore().collection('users').doc(this.state.user.auth.uid).collection('meetings').onSnapshot((querySnapshot) => {
                querySnapshot.docs.forEach((snap) => {

                    // console.log(snap.data())
                    let d = snap.data()
                    // console.log('data from meetingslist')
                    // console.log(d.time);
                    let m = new Meeting(d.uidOfRequest, d.time, d.day, d.tutorChosen, d.subject)
                    meetingsListReal.push(m)
                    //console.log(meetingsListReal)


                })
                this.setState({ meetingsListSaved: meetingsListReal })

            })
            console.log("this.state.user.auth is not null")
        }
    }
    componentDidUpdate() {
        // this.setState({ user: this.props.user });


        //temporary local meeting list
        let meetingsListReal = [];
        if (!this.state.user.auth && this.props.user.auth) {
            this.setState({user: this.props.user});
            firebase.firestore().collection('users').doc(this.props.user.auth.uid).collection('meetings').onSnapshot((querySnapshot) => {
                querySnapshot.docs.forEach((snap) => {

                    let d = snap.data()
                    // console.log(d.time);
                    let m = new Meeting(d.uidOfRequest, d.time, d.day, d.tutorChosen, d.subject)
                    meetingsListReal.push(m)
                    //console.log(meetingsListReal)
    
                })
                this.setState({ meetingsListSaved: meetingsListReal })
                console.log("meetingListSaved = " + this.state.meetingsListSaved)

            })
            // console.log("this.state.user.auth is not null")
        }
        else {
            // this.setState()
            console.log("update didnt auth user")
        }
    }



    render() {
        if (!this.state.requesting) {
            return (
                <React.Fragment>
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


                        <Button id="requestHelp" onClick={this.updateRequesting}>Request meeting</Button >
                        <div className="meetingForm">
                            <h1 className="specialTitle">Meetings</h1>
                            <hr className="whiteBar" />

                            {
                            }
                            {
                                this.state.meetingsListSaved.map(meeting => {

                                    return (
                                        <React.Fragment>
                                            <div className="questionBox">
                                                <h4>{"Meeting at " + meeting.getTime()}</h4>
                                                <h6>{"for " + meeting.getSubject()}</h6>
                                            </div>

                                        </React.Fragment>
                                    )
                                })
                            }
                        </div>
                    </div>
                </React.Fragment>

            )

        }
        else {
            return (
                <React.Fragment>
                    <SuccessDialog show={this.state.dialogShow} onChange = { (show) => {this.setState({dialogShow: show})}}></SuccessDialog>
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

                        {/* {
                        this.state.user.auth !== null ?
                            <ProfilePictureDropdown signout={this.signoutwithGoogle}><img src={this.state.user.auth.photoURL} alt={this.state.user.name} id="logOut" /></ProfilePictureDropdown>
                            :
                            <Button color='light' id="logIn" onClick={this.signinwithGoogle}>Sign In</Button>
                    } */}
                    </div>
                    <div id="general">
                        <div className="meetingForm">
                            <h1 className="specialTitle">Request Meeting</h1>
                            <hr className="whiteBar" />
                            <Label style={{ color: "white" }} for="select">Select the subject of the meeting</Label>



                            <br />

                            <Form onSubmit={this.handleSubmit}>
                                <Input type="select" name="select" style={{ outline: "none" }} id="tags" value={this.state.classChosen} onChange={this.handleClassChange}>
                                    {this.createClassItems()}
                                </Input>
                                <br />
                                <br />
                                <p> Please select availability</p>
                                {this.giveTimes()}

                            </Form>

                            <Input type="submit" value="Submit" className="newBtn" style={{ margin: "auto" }} onClick={this.submitHandler} />


                        </div>




                        <div className="meetingForm">
                            <h1 className="specialTitle">Meetings</h1>
                            <hr className="whiteBar" />

                            {
                            }
                            {
                                this.state.meetingsListSaved.map(meeting => {

                                    return (
                                        <React.Fragment>
                                            <div className="questionBox">
                                                <h4>{"Meeting at " + meeting.getTime()}</h4>
                                                <h6>{"for " + meeting.getSubject()}</h6>
                                            </div>

                                        </React.Fragment>
                                    )
                                })
                            }
                        </div>
                    </div>
                </React.Fragment>
            )
        }
    }

    updateRequesting = () => {
        this.setState({ requesting: !this.state.requesting })
    }


    requestMeeting() {
        if (!this.state.requesting) {
            // console.log("requesting help")
            return (
                <React.Fragment>

                    <Button id="requestHelp" onClick={this.setState({ requesting: true })}>Request meeting</Button >
                </React.Fragment>

            )

        }


    }


    handleClassChange(event) {
        this.setState({ classChosen: event.target.value });

    }

    handleCheckChange(event, val) {
        let currentState = this.state.checkboxesSelected
        currentState[val] = event.target.checked 
        console.log(val);
        this.setState({ checkboxesSelected: currentState })
    }


    giveTimes() {
        let list;

        let listList = [];
        for (let i = 0; i < this.state.times.length; i++) {
            let tempStr = this.state.times[i];
            list = <React.Fragment key={i}>
                <div className="fixDiv">

                    <Input type='checkbox' name='check' value={this.state.checkboxesSelected[i]} onChange={(e) => {this.handleCheckChange(e, i)}} />

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
    //stolen from Home.jsx
    submitHandler = (event) => {
        event.preventDefault();
        // let val = event.target["text"].value;
        // let t = event.target["select"].value;
        // DO NOT DELETE BELOW -----------------------------
        // if (val === "") {
        //     let err = <FormText color="danger">You must fill in all fields</FormText>;
        //     this.setState({ errormessage: err });
        // } 

        //     let date = (new Date()).toString();
        //     let name = "";
        //     if (anonymous === true) {
        //         name = "Anonymous";
        //     } else {
        //         name = this.state.user.name;
        //     }

        // }
        //--------------------------------------

        this.setState({dialogShow:true})
        let timesArr = []
        for (let i = 0; i < this.state.checkboxesSelected.length; i++) {
            if (this.state.checkboxesSelected[i]) {
                timesArr.push(this.state.times[i])
            }

        }
        console.log("checkboxes selected currently", this.state.checkboxesSelected)
        //sending an email
        this.sendEmail('template_Zxp8BP9K', {
            from_name: this.state.user.name, 
            to_name: "AVID Tutors", 
            from_email: this.state.user.auth.email,
            message_html: `I'm struggling with ${this.state.classChosen}, and am available to have a tutoring session during the times of ${timesArr}`
        })
        console.log(this.state.timesChecked)

        //adding to database
        //temporary code befor ethe user stuff gets fixed dont delete
        //replace specific id with user id later
        db.collection('users').doc(this.state.user.auth.uid).collection('meetings').add({
            uidOfRequest: this.state.user.auth.uid, //user who requested it
            time: timesArr, //time of day of meeting
            day: null, //day chosen
            tutorChosen: false, //wthich tutor they chose null if none ye
            subject: this.state.classChosen //the subject they chose



        })
        //test




        // [0].doc('time').data


        //                      |
        //for updating the page v
        this.setState({ update: 0 });
        // event.target["text"].value = "";
        // console.log("tried to submit")
    }

    sendEmail(templateID, variables) {
        window.emailjs.send(
            'gmail', templateID,
            variables
        ).then(res => {
            // console.log('Email successfully sent!')
        })
            // Handle errors here however you like, or use a React error boundary
            .catch(err => console.error('Oh well, you failed. Here some thoughts on the error that occured:', err))
    }


    
    



}