import React, { Component } from 'react';
import '../App.css';
import { MdArrowUpward, MdArrowDownward } from "react-icons/md";
import { Container, Row, Col, Button, Form, FormGroup, Label, FormText, Input, Badge, UncontrolledPopover, PopoverBody } from 'reactstrap';
import firebase from '../firebase.js';

const db = firebase.firestore();

const dark = {
  backgroundColor: '#222',
  color: '#fff',
  line: {
    backgroundColor: '#fff',
  }
};

/**
 * 
 * @param {*} props 
 */
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
      let user = <h5>User: {item.getUsername()}</h5>;
      if (item.getUsername() === 'devs') {
        user = <h6>User: <Badge color="dark">devs</Badge></h6>;
      } if (this.props.user.auth !== null) {
        if (item.getUser().uid === this.props.user.auth.uid) {
          user = <h6>User: <Badge color="secondary">you</Badge></h6>;
        }
      }

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
      if (this.props.user.name === item.getUsername()) {
        deletedata = (
          <span>
            <span> | </span>
            <span className="links" onClick={() => this.deleteQ(item)}>delete</span>
          </span>
        );
      }

      return (
        <React.Fragment>
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
                    <h4>Question: {item.getText()}  {tag}</h4>
                    {
                      item.getImgUrl() !== "" ?
                        <img src={item.getImgUrl()} alt="aa" width="100%" />
                        :
                        null
                    }
                  </div>
                  <hr style={dark.line} />
                  <span className="links" onClick={

                    this.openReply.bind(this, item)

                  }>reply</span>
                  {deletedata}
                  {this.renderReply(item)}
                </Col>
              </Row>
            </div>
          </Container>

          <ul className="feed-list">
            {
              item.getAllAnswers().map(answer => {
                
              })
            }
          </ul>

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
                  let user = <h5>User: {item.getUsername()}</h5>;
                  if (item.getUsername() === 'devs') {
                    user = <h6>User: <Badge color="dark">devs</Badge></h6>;
                  } if (this.props.user.auth !== null) {
                    if (item.getUser().uid === this.props.user.auth.uid) {
                      user = <h6>User: <Badge color="secondary">you</Badge></h6>;
                    }
                  }

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
                  if (this.props.user.name === item.getUsername()) {
                    deletedata = (
                      <span>
                        <span> | </span>
                        <span className="links" onClick={() => this.deleteQ(item)}>delete</span>
                      </span>
                    );
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
                            <Button color="light" className="seeFull" onClick={this.changeFocus.bind(this, i)} >See full Thread</Button>
                            <h4>Question: {item.getText()}  {tag}</h4>
                            {
                              item.getImgUrl() !== "" ?
                                <img src={item.getImgUrl()} alt="aa" width="100%" />
                                :
                                null
                            }
                            {this.renderAnswer(item)}
                          </div>
                          <hr style={dark.line} />
                          <span className="links" onClick={

                            this.openReply.bind(this, item)

                          }>reply</span>
                          {deletedata}
                          {this.renderReply(item)}
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

  upvote(i) {
    if (this.props.user.auth !== null) {
      let up = this.props.filteredQuestions[i].getUpvotes();
      this.props.filteredQuestions[i].upvote();
      db.collection("questions").doc(this.props.filteredQuestions[i].getId()).update({
        upvotes: up + 1,
      })
      this.setState({ update: 0 })
    } else {
      var provider = new firebase.auth.GoogleAuthProvider();

      firebase.auth().signInWithPopup(provider).catch((error) => {
        console.error('Error Code ' + error.code + ': ' + error.message)
      });
    }
  }

  downvote(i) {
    if (this.props.user.auth !== null) {
      let up = this.props.filteredQuestions[i].getUpvotes();
      this.props.filteredQuestions[i].downvote();
      db.collection("questions").doc(this.props.filteredQuestions[i].getId()).update({
        upvotes: up - 1,
      })
      this.setState({ update: 0 })
    } else {
      var provider = new firebase.auth.GoogleAuthProvider();

      firebase.auth().signInWithPopup(provider).catch((error) => {
        console.error('Error Code ' + error.code + ': ' + error.message)
      });
    }
  }

  deleteQ = (item) => {

    let replies = [];

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
        console.log("Document successfully deleted!");
        this.setState({ notification: 'successfully deleted post. Reload page to view changes and dismiss this notification' });
      }).catch(function (error) {
        console.error("Error removing document: ", error);
        this.setState({ notification: 'failed to deleted post. Try again in few seconds' });
      })
    });
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

  renderReply(item1) {
    if (item1.getReplying() === true) {
      return (
        <React.Fragment>
          <br />
          <br />
          <Form onSubmit={(e) => { this.submitHandler(e, item1) }}>
            <FormGroup>
              <Input type="textarea" name="text" id="text" onChange={this.changeHandler} />
              {this.state.errormessage}
            </FormGroup>
            <Button color="light" block>Post Reply</Button>
          </Form>
        </React.Fragment>

      )
    }
  }
  renderInnerReply(item1) {
    if (item1.getReplyingInner() === true) {
      return (
        <React.Fragment>
          <Form onSubmit={this.submitHandler}>
            <FormGroup>
              <Label for="text">Text:</Label>
              <Input type="textarea" name="text" id="text" onChange={this.changeHandler} />
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
        });
      }

      // this.setState({ update: 0 });
      event.target["text"].value = "";
    }
  }

  renderAnswer(item1) {
    let user = <h6>User: {item1.getFirstAnswer().getUser()}</h6>;
    let respondable = (
      <Form onSubmit={this.submitHandler}>
        <FormGroup>
          <Label for="text">Text:</Label>
          <Input type="textarea" name="text" id="text" onChange={this.changeHandler} />
          {this.state.errormessage}
        </FormGroup>
        <Button color={this.props.theme === 1 ? 'light' : 'dark'} block>Submit</Button>
      </Form>
    );
    if (item1.getFirstAnswer().getUser() === "bot") {
      user = <h6>User: <Badge color="secondary">bot</Badge></h6>;
      respondable = null;
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
