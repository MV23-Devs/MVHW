import React, { Component } from 'react';
import '../App.css';
import { Row, Col, Form, FormGroup, Label, Input, Badge, UncontrolledPopover, PopoverBody } from 'reactstrap';
import {
    Link
} from 'react-router-dom'
import firebase from '../firebase.js';
import { get as _get } from "lodash";
import Question from '../Question';


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

const dark = {
    backgroundColor: '#222',
    color: '#fff',
    line: {
        backgroundColor: '#fff',
    }
};

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
            posts: [],
        }
        this.handleInputChange = this.handleInputChange.bind(this);


    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({ user: { auth: user, name: user.displayName } })
                firebase.firestore().collection("users").doc(user.uid).get().then(doc => {
                    this.setState({ userClasses: doc.data().classes });
                })
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


                firebase.firestore().collection("users").doc(this.state.user.auth.uid).collection("posts")
                    .onSnapshot((querySnapshot) => {
                        let docs = this.state.posts;
                        querySnapshot.docChanges().forEach(change => {
                            if (change.type === 'added') {
                                let doc = change.doc;
                                let id = doc.data().original;

                                firebase.firestore().collection("questions").doc(id).get().then(doc => {
                                    let raw = doc.data();
                                    let ups, downs, votes = 0;
                                    if (raw) {
                                        if (doc.data().usersUpvoted.length > 0 && doc.data().usersDownvoted.length > 0) {
                                            ups = doc.data().usersUpvoted.length
                                            downs = doc.data().usersDownvoted.length
                                            votes = ups - downs;
                                        } else if (doc.data().usersUpvoted.length > 0) {
                                            ups = doc.data().usersUpvoted.length
                                            votes = ups;
                                        } else if (doc.data().usersDownvoted.length > 0) {
                                            downs = doc.data().usersDownvoted.length
                                            votes = 0 - downs;
                                        }
                                        docs.push(new Question(raw.title, JSON.parse(raw.auth), raw.timestamp, doc.id, votes, raw.tags, raw.img_url, raw.username));
                                        this.setState({ posts: docs })
                                    }
                                })
                            } else if (change.type === 'removed') {
                                let doc = change.doc;
                                for (var i = 0; i < docs.length; i++) {
                                    if (docs[i].getId() === doc.id) {
                                        docs.splice(i, 1);
                                    }
                                }
                                this.setState({ posts: docs })
                            }
                        })
                    })

            } else {
                this.setState({ user: { auth: user, name: 'Anonymous' } })
            }
        });
    }

    componentWillUnmount() {

    }

    handleInputChange(event) {
        const target = event.target;

        if (target.checked && !(this.state.selected.includes(target.name))) {
            this.state.selected.push(target.name);
            target.value = true;
        } else {
            const index = this.state.selected.indexOf(target.name);
            if (index > -1) {
                this.state.selected.splice(index, 1);
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

    deleteQ = (item) => {

        this.setState({ focus: -1 });
        let replies = [];

        firebase.firestore().collection("questions").doc(item.getId()).collection("replies").get().then(querySnapshot => {
            querySnapshot.docs.forEach(doc => {
                replies.push(doc.id);
            })
            return replies;
        }).then(replies => {
            replies.forEach(id => {
                firebase.firestore().collection("questions").doc(item.getId()).collection("replies").doc(id).delete().then(doc => {
                    console.log("Successfully deleted reply with id: ", id);
                })
            })
        }).then(() => {
            firebase.firestore().collection("users").doc(this.state.user.auth.uid).collection("posts").get().then(querySnapshot => {
                querySnapshot.docs.forEach(doc => {
                    replies.push(doc.id);
                })
                return replies;
            }).then(replies => {
                replies.forEach(id => {
                    firebase.firestore().collection("users").doc(this.state.user.auth.uid).collection("posts").doc(id).delete().then(doc => {
                        console.log("Successfully deleted reply with id: ", id);
                    })
                })
            }).catch((error) => {
                console.error("Error removing document: ", error);
            })
        });
    }

    render() {
        return (
            <React.Fragment>
                <div >
                    <div id="places">
                        <Link to="/">Home</Link>
                        <h1>Profile</h1>
                    </div>
                    <center>
                        <img src={_get(this.state.user.auth, "photoURL", "https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png")} alt="pfp" className="pfp" />
                    </center>
                    <div id="checkBoxSelect">
                        {
                            this.state.userClasses ?
                                <div id="checkBoxTitle">
                                    <h1 className="pf-title">Select Classes: <span className="badge"> {0 + this.state.selected.length + 0}</span></h1>
                                    <br />
                                </div>
                                :
                                null

                        }
                        <Form onSubmit={this.submitHandler} >
                            <FormGroup check>
                                {
                                    //console.log(this.state.userClasses)
                                }
                                {
                                    this.classes.map((cless, key) => {
                                        return (
                                            <div key={key} className="tickBoxSurround">
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
                                        );
                                    })
                                }
                            </FormGroup>

                            {/* <Button color="info" id="submitClasses">Save Classes</Button> */}
                        </Form>
                    </div>
                    <div id="checkBoxSelect">

                        <div className="posts">
                            <h1 className="pf-title">Your Posts:</h1>
                            <ul className="list-posts">

                                {

                                    this.state.posts.map((item, i) => {
                                        let user = <h5>User: <Badge color="secondary">you</Badge></h5>;

                                        let color = '';
                                        switch (item.getTags()) {
                                            case 'Math':
                                                color = 'info';
                                                break;
                                            case 'Science':
                                                color = 'warning';
                                                break;
                                            case 'English':
                                                color = 'danger';
                                                break;
                                            case 'History':
                                                color = 'success';
                                                break;
                                            case 'Computer Science':
                                                color = 'primary';
                                                break;

                                            default:
                                                color = 'secondary';
                                                break;
                                        }
                                        let tag = <Badge color={color}>{item.getTags()}</Badge>;
                                        if (item.getTags() === "None") {
                                            tag = null;
                                        }

                                        let upvotes = item.getUpvotes() + "";

                                        if (item.getUpvotes() >= 1000) {
                                            upvotes = ((item.getUpvotes() / 1000)).toFixed(1) + "k";
                                        }

                                        let deletedata = null;
                                        if (this.state.user.auth) {
                                            if (this.state.user.auth.uid === item.getUser().uid) {
                                                deletedata = (
                                                    <span className="links" onClick={() => this.deleteQ(item)}>delete</span>
                                                );
                                            }
                                        }

                                        return (
                                            <li key={i} style={dark} className="pf-questionBox">
                                                <Row>
                                                    <Col xs="1" className="updown">
                                                        <Votes num={upvotes} actualNumber={item.getUpvotes()} listvalue={i} />
                                                    </Col>
                                                    <Col xs="11">
                                                        <div style={dark}>
                                                            {user}
                                                            <h4>Question: {item.getText()}  {tag}</h4>
                                                            {
                                                                item.getImgUrl() !== "" ?
                                                                    <img src={item.getImgUrl()} alt={item.getImgUrl()} className="post-img" />
                                                                    :
                                                                    null
                                                            }
                                                        </div>
                                                        <hr style={dark.line} />
                                                        {deletedata}
                                                    </Col>
                                                </Row>
                                            </li>

                                        );
                                    })
                                }
                            </ul>
                        </div>
                    </div>

                </div>
            </React.Fragment>
        )
    }
}