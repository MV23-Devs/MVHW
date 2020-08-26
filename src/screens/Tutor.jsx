import React, {
    Component,
    useState
} from 'react';
import '../App.css';
import {
    Button, Form, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import {
    Link
} from 'react-router-dom'
import { get as _get, times } from "lodash";
import firebase from '../firebase.js';
import Meeting from './Meeting.jsx'
import { MdAddAlert } from 'react-icons/md';
import { preProcessFile } from 'typescript';


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
            timesChecked: [],
            dialogShow: false,
            meetingsListSaved: [],
            classChosen: "",




            timesS: ["12:00", "02:30", "03:30", "04:30", "05:30", "06:30"],
            timesE: ["01:00", "03:30", "04:30", "05:30", "06:30", "07:30"],
            errormessage: '',
            user: {
                auth: null,
                name: 'Anonymous',
            },


        }

        this.handleClassChange = this.handleClassChange.bind(this);
        this.submitHandler = this.submitHandler.bind(this);



        
        
    

    }
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
          if (user) {
            this.setState({ user: { auth: user, name: user.displayName } })
            //console.log(this.state.user.auth)
          } else {
            this.setState({ user: { auth: user, name: 'Anonymous' } })
          }
        });
        console.log('adding meetings')
        //working ish v
        // let tempErrTest = db.collection('meetings').doc('JnnvTgp4CNohTT5sI3uD').get().then(doc =>{
        //     console.log(doc.data().time)
        // })

        //temporary local meeting list
        let meetingsListReal = [];
        let meetingsList = [];
        //the meeting list of th edaabase

        firebase.firestore().collection('users').doc('lfF9GotiqsgSrqdESwxkKM6xRSF2').collection('meetings').onSnapshot((querySnapshot) => {
            querySnapshot.docs.forEach((snap) => {

                // console.log(snap.data())
                let d = snap.data()
                console.log('data from meetingslist')
                console.log(d.time);
                let m = new Meeting(d.uidOfRequest, d.time, d.day, d.tutorChosen, d.subject)
                meetingsListReal.push(m)
                //console.log(meetingsListReal)


            })
            console.log("meeting list real ========= " + meetingsListReal)
            this.setState({ meetingsListSaved: meetingsListReal })
        })

        let checkedStart = []
        for (let i = 0; i < this.state.timesE.length; i++) {
            checkedStart.push(false)
        }
        this.setState({ timesChecked: checkedStart });

    }


        



    render() {
        return (
            <React.Fragment>
                <SuccessDialog show={this.state.dialogShow} onChange={(show) => this.state.dialogShow = show} ></SuccessDialog>
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
                            this.state.meetingsListSaved.map((meeting, i) => {

                                return (
                                    <React.Fragment key={i}>
                                        <div className="questionBox">
                                            <h4>"Meeting at  + {meeting.getTime()}</h4>
                                            <h6>for +  {meeting.getSubject()}</h6>
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
                        <h1 className="specialTitle">Request Meeting</h1>
                        <hr className="whiteBar" />
                        <Label style={{ color: "white" }} for="select">Select the subject of the meeting</Label>



                        <br />

                        <Form onSubmit={this.handleSubmit}>
                            <Input type="select" name="select" style={{ outline: "none" }} id="tags" value={this.state.classChosen} onChange={this.handleChange}>
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
                        {console.log('test')}
                        {this.renderMeetings()}



                    </div>
                </React.Fragment>

            )
        }


    }


    handleClassChange(event) {
        this.setState({ classChosen: event.target.value });

    }

    handleCheckChange(event, itemToChange, val) {
        // let currentState = this.state.itemToChange
        // let newArr = [];
        // for (let i = 0; i < currentState.length; i++) {

        // }

        // this.setState({ itemToChange: event.target.value });
    }


    giveTimes() {
        let list;

        let listList = [];
        for (let i = 0; i < this.state.timesS.length; i++) {
            let tempStr = this.state.timesS[i] + " - " + this.state.timesE[i];
            list = <React.Fragment key={i}>
                <div className="fixDiv">

                    <Input type='checkbox' name='check' value={this.state.timesChecked} onChange={this.handleCheckChange("timesChecked", i)} />

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
        //sending an email
        this.sendEmail('template_Zxp8BP9K', {
            from_name: this.state.user.name, 
            to_name: "AVID Tutors", 
            from_email: this.state.user.auth.email,
            message_html: `I'm struggling with ${this.state.classChosen}, and am available to have a tutoring session from blank to blank.`
        })
        console.log(this.state.timesChecked)

        //adding to database
        //temporary code befor ethe user stuff gets fixed dont delete
        //replace specific id with user id later
        db.collection('users').doc('lfF9GotiqsgSrqdESwxkKM6xRSF2').collection('meetings').add({
            uidOfRequest: null, //user who requested it
            time: 8, //time of day of meeting
            day: null, //day chosen
            tutorChosen: null, //wthich tutor they chose null if none ye
            subject: null //the subject they chose



        })
        //test




        // [0].doc('time').data


        //                      |
        //for updating the page v
        this.setState({ update: 0 });
        // event.target["text"].value = "";
        console.log("tried to submit")
    }

    sendEmail (templateID, variables) {
        window.emailjs.send(
            'gmail', templateID,
            variables
            ).then(res => {
              console.log('Email successfully sent!')
            })
            // Handle errors here however you like, or use a React error boundary
            .catch(err => console.error('Oh well, you failed. Here some thoughts on the error that occured:', err))
    }

    
    getMeetings = async () => {
        console.log('adding meetings')
        //working ish v
        // let tempErrTest = db.collection('meetings').doc('JnnvTgp4CNohTT5sI3uD').get().then(doc =>{
        //     console.log(doc.data().time)
        // })

        //temporary local meeting list
        let meetingsListReal = [];
        let meetingsList = [];
        //the meeting list of th edaabase

        await firebase.firestore().collection('users').doc('lfF9GotiqsgSrqdESwxkKM6xRSF2').collection('meetings').onSnapshot((querySnapshot) => {
            querySnapshot.docs.forEach((snap) => {

                // console.log(snap.data())
                let d = snap.data()
                console.log('data from meetingslist')
                console.log(d.time);
                let m = new Meeting(d.uidOfRequest, d.time, d.day, d.tutorChosen, d.subject)
                meetingsListReal.push(m)
                //console.log(meetingsListReal)


            })
            console.log("meeting list real ========= " + meetingsListReal)
            return meetingsListReal
        })


        // //copying over code 
        // meetingsList.forEach((snap) => {

        //     // console.log(snap.data())
        //     let d = snap.data()
        //     console.log('data from meetingslist')
        //     console.log(d.time);
        //     let m = new Meeting(d.uidOfRequest, d.time, d.day, d.tutorChosen, d.subject)
        //     meetingsListReal.push(m)
        //     //console.log(meetingsListReal)


        // })
    }
    async renderMeetings() {

        let mLR = await this.getMeetings();
        console.log('length0 = ' + mLR.length);
        console.log();

        let t = this.renderMeetings2(mLR);

        return t;
    }
    renderMeetings2(meetingsListReal) {
        let mLR = meetingsListReal
        let list;
        let listList = [];
        console.log('length = ' + mLR.length)
        console.log(mLR)
        for (let i = 0; i < mLR.length; i++) {
            list = (
                <React.Fragment>
                    <div className="questionBox">
                        <h4>Meeting at  + {mLR[i].getTime()}</h4>
                        <h2>for +  {mLR[i].getSubject()}</h2>
                    </div>

                </React.Fragment>
            );


            listList.push(list)
        }

        console.log('listlist' + listList)


        return listList

    }



}