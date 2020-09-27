import React, { Component } from 'react';
import '../App.css';
import { MdArrowUpward, MdArrowDownward } from "react-icons/md";
import { Container, Row, Col, Button, Form, FormGroup, Label, FormText, Input, Badge, UncontrolledPopover, PopoverBody } from 'reactstrap';
import firebase from '../firebase.js';
import {
  Link,
} from 'react-router-dom'
import {translate} from "../util.js"

const db = firebase.firestore();

const dark = {
  backgroundColor: '#222',
  color: '#fff',
  line: {
    backgroundColor: '#fff',
  }
};

export const Reply = (props) => {
  const {questionItem, errorMessage, submitHandler} = props;
  if (questionItem.getReplying() === true) {
    return (
      <React.Fragment>
        <br />
        <br />
        <Form onSubmit={(e) => {submitHandler(e, questionItem) }}>
          <FormGroup>
            <Input type="textarea" name="text" id="text"/>
            {errorMessage}
          </FormGroup>
          <Button color="light" block>Post Reply</Button>
        </Form>
      </React.Fragment>
    )
  }else{
    return null;
  }
}

/**
 * 
 * @param {*} props 
 */
export const Votes = (props) => {
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

export const deleteA = (item, answer) => {
  db.collection("questions").doc(item.getId()).collection("replies").doc(answer.getId()).delete().then(() => {
    console.log("deleted reply with id: " + answer.getId())
    item.removeAnswer(item.getId());
  }).catch((error) => {
    console.error("Error removing document: ", error);
  });
}

export const deleteQ = (item) => {
  let replies = [];

  //deletes all replies too???!!!

  db.collection("questions").doc(item.getId()).collection("replies").get().then(querySnapshot => {
    querySnapshot.docs.forEach(doc => {
      replies.push(doc.id);
    })
    return replies;
  }).then(replies => {
    replies.forEach(id => {
      db.collection("questions").doc(item.getId()).collection("replies").doc(id).delete().then(doc => {
        console.log("Successfully deleted reply with id: ", id);
      })
    })
  }).then(() => {
    db.collection("questions").doc(item.getId()).delete().then(() => {
      firebase.firestore().collection("users").doc(this.props.user.auth.uid).collection("posts").get().then(querySnapshot => {
        querySnapshot.docs.forEach(doc => {
          replies.push(doc.id);
        })
        return replies;
      }).then(replies => {
        replies.forEach(id => {
          firebase.firestore().collection("users").doc(this.props.user.auth.uid).collection("posts").doc(id).delete().then(doc => {
            console.log("Successfully deleted post in user section with id: ", id);
          })
        })
      }).catch((error) => {
        console.error("Error removing document: ", error);
      })
    }).catch((error) => {
      console.error("Error removing document: ", error);
    })
  });
}

// Function that Renders User Info
export class RenderUser extends Component {
  state = {
    isTutor: false,
    username: "",
  }
  componentDidMount() {
    if (this.props.uid) {
      firebase.firestore().collection("users").doc(this.props.uid).get().then(doc => {
        if (doc.data().isTutor === true) {
          this.setState({ isTutor: true })
        }
        this.setState({ username: doc.data().name })
        if (this.props.currentUser) {
          if(this.props.currentUser.auth) {
            if (this.props.currentUser.auth.uid === this.props.uid) {
              this.setState({ username: <Badge color='secondary'>you</Badge> })
            }
          }
        }
      })
    }
  }
  render() {
    return (
      <React.Fragment>
        <span>{this.state.username}</span>
        <span> </span>
        {
          this.state.isTutor === true ?

            <Badge color="success">AVID TUTOR</Badge>
            :
            null
        }
      </React.Fragment>
    )
  }
}

export default class Feed extends Component {

  state = {
    update: 0,
    d: new Date(),
    focus: -1,
    notification: '',
  }

  render() {

    if (this.state.focus !== -1) {
      let i = this.state.focus;
      let item = this.props.filteredQuestions[i];
      let user = <RenderUser uid={item.getUser().uid} currentUser={this.props.user}></RenderUser>


      let color = '';
      switch (item.getTags()) {
        case 'Trig H':
          color = 'info';
          break;
        case 'Statistics':
          color = 'warning';
          break;
        default:
          color = 'secondary';
          break;
      }
      let tag = <Badge style={{marginLeft: "5px"}} color={color}>{item.getTags()}</Badge>;
      if (item.getTags() === "None") {
        tag = null;
      }

      let upvotes = item.getUpvotes() + "";

      if (item.getUpvotes() >= 1000) {
        upvotes = ((item.getUpvotes() / 1000)).toFixed(1) + "k";
      }

      let answers = null;
      if (item.getAllAnswers().length > 0) {
        answers = (
          <ul className="feed-list">
            {
              item.getAllAnswers().map((answer, i) => {
                let auser = <RenderUser uid={answer.getUser().uid} currentUser={this.props.user}></RenderUser>

                let deletedata = null;
                if (this.props.user.auth) {

                  if (answer.getUser().uid === this.props.user.auth.uid) {
                    deletedata = (
                      <span>
                        <span> | </span>
                        <span className="links" onClick={() => this.deleteA(item, answer)}>{translate(this.props.language, "delete")}</span>
                      </span>
                    );
                  }

                }

                return (
                  <li key={"answer" + i} id="answerBox" style={dark}>

                    <Row>
                      <Col xs="1" className="updown">
                        <button style={dark} onClick={() => answer.upvote()} className="voteButton"><MdArrowUpward /></button>
                        <Votes num={upvotes} actualNumber={answer.getUpvotes()} listvalue={this.actualNumber} />
                        <button style={dark} onClick={() => answer.downvote()} className="voteButton"><MdArrowDownward /></button>
                      </Col>
                      <Col>
                        {auser}
                        <h5>Answer: {answer.getText()}</h5>
                        {/* {respondable} */}
                        <span className="links">{translate(this.props.language, "reply")}</span>
                        {deletedata}
                      </Col>
                    </Row>

                  </li>
                );
              })
            }
          </ul>
        )
      }

      let deletedata = null;
      if (this.props.user.auth !== null) {
        if (this.props.user.auth.uid === item.getUser().uid) {
          deletedata = (
            <span>
              <span> | </span>
              <span className="links" onClick={() => this.deleteQ(item)}>{translate(this.props.language, "delete")}</span>
            </span>
          );
        }
      }

      return (

        <React.Fragment>

          <div className="containerthread">

            <Container>
              <div style={dark} className="questionBox">
                <Row>
                  <Col xs="1" className="updown">
                    <button style={dark} onClick={() => this.upvote(i)} className="voteButton"><MdArrowUpward /></button>
                    <Votes num={upvotes} actualNumber={item.getUpvotes()} listvalue={i} />
                    <button style={dark} onClick={() => this.downvote(i)} className="voteButton"><MdArrowDownward /></button>
                  </Col>
                  <Col xs="11">
                    <div style={dark}>
                      {user}
                      <Button color="light" className="seeFull" onClick={() => this.setState({ focus: -1 })} >Exit</Button>
                      <Button color="light" className="timeStamp">{item.getTime()}</Button>
                      <h4>Question: {item.getText()}  {tag}</h4>
                      {
                        item.getImgUrl() !== "" ?
                          <img src={item.getImgUrl()} alt={item.getImgUrl()} className="post-img" />
                          :
                          null
                      }
                    </div>
                    <hr style={dark.line} />
                    <span className="links" onClick={

                      this.openReply.bind(this, item)

                    }>{translate(this.props.language, "reply")}</span>
                    {deletedata}
                    <Reply questionItem={item} submitHandler={this.submitHandler} errorMessage={this.state.errormessage}/>
                  </Col>
                </Row>
                <ul className="feed-list">
                  {
                    item.getAllAnswers().map((answer, i) => {
                      user = <RenderUser uid={answer.getUser().uid} currentUser={this.props.user}></RenderUser>
                      return (
                        //--------------------------------------------------------------------------------
                        //ANSWERS
                        <li key={"answer" + i} id="answerBox" style={dark}>

                          <Row>
                            <Col xs="1" className="updown">
                              <button style={dark} onClick={() => answer.upvote()} className="voteButton"><MdArrowUpward /></button>
                              <Votes num={upvotes} actualNumber={answer.getUpvotes()} listvalue={this.actualNumber} />
                              <button style={dark} onClick={() => answer.downvote()} className="voteButton"><MdArrowDownward /></button>
                            </Col>
                            <Col>
                              {user}
                              <h5>Answer: {answer.getText()}</h5>
                              {/* {respondable} */}
                              <p className="links">reply</p>
                            </Col>
                          </Row>

                        </li>
                      );
                    })
                  }
                </ul>
                {answers}
              </div>
            </Container>


          </div>

        </React.Fragment >
      )
    }
    return (
      <React.Fragment>
        <ul className="feed-list">
          <Container>
            {
              this.props.filteredQuestions.map(
                (item, i) => {
                  let user = <RenderUser uid={item.getUser().uid} currentUser={this.props.user}></RenderUser>
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
                  if (this.props.user.auth !== null) {
                    if (this.props.user.auth.uid === item.getUser().uid) {
                      deletedata = (
                        <span>
                          <span> | </span>
                          <span className="links" onClick={() => this.deleteQ(item)}>{translate(this.props.language, "delete")}</span>
                        </span>
                      );
                    }
                  }

                  return (
                    <li key={i} style={dark} className="questionBox">
                      <Row>
                        <Col xs="1" className="updown">
                          <button style={dark} onClick={() => this.upvote(i)} className="voteButton"><MdArrowUpward /></button>
                          <Votes num={upvotes} actualNumber={item.getUpvotes()} listvalue={i} />
                          <button style={dark} onClick={() => this.downvote(i)} className="voteButton"><MdArrowDownward /></button>
                        </Col>
                        <Col xs="11">
                          <div style={dark} onClick={
                            this.callBoth.bind(this, item)

                          }>
                            {user}
                            <h6 className="date-time">Posted on {item.getTimeStamp()}</h6>
                            <Link to={`question/${item.getId()}`}><Button color="light" className="seeFull">{translate(this.props.language, "seeFullThread")}</Button></Link>
                            <h4>Question: {item.getText()}  {tag}</h4>
                            {
                              item.getImgUrl() !== "" ?
                                <img src={item.getImgUrl()} alt={item.getImgUrl()} className="post-img" />
                                :
                                null
                            }
                            {this.renderAnswer(item)}
                          </div>
                          <hr style={dark.line} />
                          <span className="links" onClick={

                            this.openReply.bind(this, item)

                          }>{translate(this.props.language, "reply")}</span>
                          {deletedata}


                          <Reply questionItem={item} submitHandler={this.submitHandler} errorMessage={this.state.errormessage}/>
                        </Col>
                      </Row>
                    </li>

                  );
                }
              )
            }
          </Container>
        </ul>
      </React.Fragment >
    )
  }

  upvoteAnswer(i, a) {
    if (this.props.user.auth !== null) {
      let tempUsersUpvoted = []
      let tempUsersDownvoted = []
      let answerObject = this.props.filteredQuestions[i].getAllAnswers()[a];
      let up = answerObject.getUpvotes();
      db.collection("questions").doc(this.props.filteredQuestions[i].getId()).collection("replies")
        .doc(answerObject.getId()).get().then(doc => {
          tempUsersUpvoted = doc.data().usersUpvoted;
          tempUsersDownvoted = doc.data().usersDownvoted;
          if (tempUsersUpvoted.indexOf(this.props.user.auth.uid) === -1) {
            this.props.filteredQuestions[i].upvote();
            tempUsersUpvoted.push(this.props.user.auth.uid);
            if (tempUsersDownvoted.indexOf(this.props.user.auth.uid) > -1) {
              tempUsersDownvoted = tempUsersDownvoted.filter(item => (item !== this.props.user.auth.uid ? true : false))
            }
            db.collection("questions").doc(this.props.filteredQuestions[i].getId()).collection("replies").doc(answerObject.getId()).update({
              upvotes: up + 1,
              usersUpvoted: tempUsersUpvoted,
              usersDownvoted: tempUsersDownvoted,
            })
          } else {
            console.log("You already upvoted!")
          }
        })

      this.setState({ update: 0 })
    } else {
      var provider = new firebase.auth.GoogleAuthProvider();

      firebase.auth().signInWithPopup(provider).catch((error) => {
        console.error('Error Code ' + error.code + ': ' + error.message)
      });
    }
  }


  upvote(i) {
    if (this.props.user.auth !== null) {
      let tempUsersUpvoted = []
      let tempUsersDownvoted = []
      let up = this.props.filteredQuestions[i].getUpvotes();
      db.collection("questions").doc(this.props.filteredQuestions[i].getId()).get().then(doc => {
        tempUsersUpvoted = doc.data().usersUpvoted;
        tempUsersDownvoted = doc.data().usersDownvoted;
        if (tempUsersUpvoted.indexOf(this.props.user.auth.uid) === -1) {
          this.props.filteredQuestions[i].upvote();
          tempUsersUpvoted.push(this.props.user.auth.uid);
          if (tempUsersDownvoted.indexOf(this.props.user.auth.uid) > -1) {
            tempUsersDownvoted = tempUsersDownvoted.filter(item => (item !== this.props.user.auth.uid ? true : false))
          }
          db.collection("questions").doc(this.props.filteredQuestions[i].getId()).update({
            upvotes: up + 1,
            usersUpvoted: tempUsersUpvoted,
            usersDownvoted: tempUsersDownvoted,
          })
        } else {
          console.log("You already upvoted!")
        }
        this.setState({ update: 0 })
      })
    } else {
      var provider = new firebase.auth.GoogleAuthProvider();

      firebase.auth().signInWithPopup(provider).catch((error) => {
        console.error('Error Code ' + error.code + ': ' + error.message)
      });
    }
  }

  downvote(i) {
    if (this.props.user.auth !== null) {
      let tempUsersUpvoted = []
      let tempUsersDownvoted = []
      let up = this.props.filteredQuestions[i].getUpvotes();
      //this.props.filteredQuestions[i].downvote();
      db.collection("questions").doc(this.props.filteredQuestions[i].getId()).get().then(doc => {
        tempUsersUpvoted = doc.data().usersUpvoted;
        tempUsersDownvoted = doc.data().usersDownvoted;
        if (tempUsersDownvoted.indexOf(this.props.user.auth.uid) === -1) {
          this.props.filteredQuestions[i].downvote();
          tempUsersDownvoted.push(this.props.user.auth.uid);
          if (tempUsersUpvoted.indexOf(this.props.user.auth.uid) > -1) {
            tempUsersUpvoted = tempUsersUpvoted.filter(item => (item !== this.props.user.auth.uid ? true : false))
          }
          db.collection("questions").doc(this.props.filteredQuestions[i].getId()).update({
            upvotes: up - 1,
            usersUpvoted: tempUsersUpvoted,
            usersDownvoted: tempUsersDownvoted,
          })
        } else {
          console.log("You already downvoted!")
        }
        this.setState({ update: 0 })
      })
    } else {
      var provider = new firebase.auth.GoogleAuthProvider();

      firebase.auth().signInWithPopup(provider).catch((error) => {
        console.error('Error Code ' + error.code + ': ' + error.message)
      });
    }
  }

  isIn = (item, array) => {
    for (let elem in array) {
      if (item === elem) {
        return true;
      }
      return false;
    }
  }

  deleteQ = (item) => {
    this.setState({ focus: -1 });
    deleteQ(item);
  }

  deleteA = (item, answer) => {
    deleteA(item, answer);
    this.setState({update: 0});
  }


  changeFocus(elem) {
    this.setState({ focus: elem });

  }
  getFocus(elem) {
    return this.state.focus;
  }


  openReply(item1) {
    item1.reply();
    this.setState({ update: 1 })
  }
  openInnerReply(item1) {
    item1.replyInner();
    //item1.click();

    this.setState({ update: 1 })
  }

  renderInnerReply(item1) {
    if (item1.getReplyingInner() === true) {
      return (
        <React.Fragment>
          <Form onSubmit={this.submitHandler}>
            <FormGroup>
              <Label for="text">Text:</Label>
              <Input type="textarea" name="text" id="text"/>
              {this.state.errormessage}
              <br />
              <Label for="tags"><Badge color="info">Optional</Badge> Tag:</Label>
            </FormGroup>
            <Button color={this.state.theme === 1 ? 'light' : 'dark'} block>Submit</Button>
          </Form>
        </React.Fragment>
      )
    }
  }


  callBoth(item1) {
    item1.click();
    //this.renderAnswer(item1);
    this.setState({ update: 0 })
  }
  submitHandler = (event, item) => {
    event.preventDefault();
    let val = event.target["text"].value;

    if (val === "") {
      let err = <FormText color="danger">You cannot post nothing!</FormText>;
      this.setState({ errormessage: err });
    } else if (this.props.user.auth === null) {
      let err = <FormText color="danger">You have to sign in to post something</FormText>;
      this.setState({ errormessage: err });
    } else {
      this.setState({ errormessage: '' });


      // used Reply Database code

      if (this.props.user.auth !== null) {
        firebase.firestore().collection('questions').doc(item.getId()).collection('replies').add({
          title: event.target["text"].value,
          author: JSON.stringify(this.props.user.auth),
          upvotes: 0,
          downvotes: 0,
          timestamp: item.getTime(),
        }).then(doc => {

          item.addAnswer(val, JSON.stringify(this.props.user.auth), item.getTime(), doc.id);
        })
      }


      // this.setState({ update: 0 });
      this.openReply(item)
      event.target["text"].value = "";
    }
  }

  renderAnswer(item1) {
    let user = <RenderUser uid={item1.getFirstAnswer().getUid()} currentUser={this.props.user}></RenderUser>;

    // Save this code for later use when implementing replying to replies

    // let respondable = (
    //   <Form onSubmit={this.submitHandler}>
    //     <FormGroup>
    //       <Label for="text">Text:</Label>
    //       <Input type="textarea" name="text" id="text"/>
    //       {this.state.errormessage}
    //     </FormGroup>
    //     <Button color={this.props.theme === 1 ? 'light' : 'dark'} block>Submit</Button>
    //   </Form>
    // );

    if (item1.getFirstAnswer().getUsername() === "bot") {
      user = <h6>User: <Badge color="secondary">bot</Badge></h6>;
      // respondable = null;
    }
    if (item1.getClicked() === true) {
      return (
        <React.Fragment>
          <div id="answerBox" style={dark}>
            {user}
            <h5>Answer: {item1.getFirstAnswer().getText()}</h5>
            {/* {respondable} */}
            <p className="links" onClick={

              this.openInnerReply.bind(this, item1)

            }>reply</p>
            {this.renderInnerReply(item1)}
          </div>
        </React.Fragment>
      )
    }

  }
}
