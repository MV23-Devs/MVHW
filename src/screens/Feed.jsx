import React, { Component } from 'react';
import '../App.css';
import { MdArrowUpward, MdArrowDownward } from "react-icons/md";
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, Badge } from 'reactstrap';
import firebase from '../firebase.js';

const db = firebase.firestore();

const dark = {
  backgroundColor: '#222',
  color: '#fff',
  line: {
    backgroundColor: '#fff',
  }
};

const light = {
  backgroundColor: '#fff',
  color: '#111',
  line: {
    backgroundColor: '#222',
  }
};

export default class Feed extends Component {

  state = {
    update: 0,
    d: new Date(),
    focus: 0
  }

  componentDidUpdate() {
  }

  render() {
    return (
      <React.Fragment>
        <ul className="feed-list">
          <Container>
            {
              this.props.filteredQuestions.map(
                (item, i) => {
                  return (
                    <li key={i} style={this.props.theme === 1 ? dark : light} className="questionBox">
                      <Row>
                        <Col xs="1">
                          <button style={this.props.theme === 1 ? dark : light} onClick={() => this.upvote(i)} className="voteButton"><MdArrowUpward /></button>
                          <h5 id="middleText">{this.props.filteredQuestions[i].getUpvotes()} </h5>
                          <button style={this.props.theme === 1 ? dark : light} onClick={() => this.downvote(i)} className="voteButton"><MdArrowDownward /></button>
                        </Col>
                        <Col xs="11">
                          <div style={this.props.theme === 1 ? dark : light} onClick={
                            this.callBoth.bind(this, item)

                          }>
                            <h5>User: {item.getUser()}</h5>
                            <Button color={this.props.theme === 1 ? 'light' : 'dark'} className="seeFull" onClick={this.changeFocus.bind(this, item.getId())} >See full Thread</Button>
                            <h4>Question: {item.getText()}</h4>
                            {this.renderAnswer(item)}
                          </div>
                          <hr style={this.props.theme === 1 ? dark.line : light.line} />
                          <span className="links" onClick={

                            this.openReply.bind(this, item)

                          }>reply</span>
                          <span> | </span>
                          <span className="links" onClick={() => this.deleteQ(item)}>delete</span>

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
      </React.Fragment>
    )
  }

  upvote(i) {
    this.props.filteredQuestions[i].upvote();
    this.setState({ update: 0 })
  }

  downvote(i) {
    this.props.filteredQuestions[i].downvote();
    this.setState({ update: 0 })
  }

  deleteQ = (item) => {
    db.collection("questions").doc(item.getId()).delete().then(function () {
      console.log("Document successfully deleted!");
    }).catch(function (error) {
      console.error("Error removing document: ", error);
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
          <textarea name="Anything" id="replyBox" cols="30" rows="10" placeholder="type to reply"></textarea>
        </React.Fragment>
      )
    }
  }
  renderInnerReply(item1) {
    item1.click();
    if (item1.getReplyingInner() === true) {
      return (
        <React.Fragment>
          <textarea name="Anything" id="replyBox" cols="30" rows="10" placeholder="type to reply"></textarea>
        </React.Fragment>
      )
    }
  }


  callBoth(item1) {
    item1.click();
    console.log(item1.getClicked())
    //this.renderAnswer(item1);
    this.setState({ update: 0 })
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
          <div id="answerBox" style={this.props.theme === 1 ? dark : light}>
            {user}
            <h5>Answer: {item1.getFirstAnswer().getText()}</h5>
            {respondable}
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
