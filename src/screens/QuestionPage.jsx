import React, {Component} from 'react'
import '../App.css'
import { MdArrowUpward, MdArrowDownward } from "react-icons/md";
import { Container, Row, Col, Button, Badge, FormText} from 'reactstrap';
import Question from '../Question';
import {Votes, RenderUser, deleteQ, Reply} from './Feed.jsx';
import {
  Link,
} from 'react-router-dom'
//import { data } from 'jquery';

import firebase from '../firebase.js';

const dark = {
    backgroundColor: '#222',
    color: '#fff',
    line: {
      backgroundColor: '#fff',
    }
};


export default class QuestionPage extends Component{
    state={
      id: this.props.match.params.id,
      question: null,
      user: null,
      errorMessage: null,
    }

    componentDidMount(){
      firebase.auth().onAuthStateChanged(user => {
          console.log(user);
          this.setState({user});
      });
      firebase.firestore().collection("questions").doc(this.state.id).onSnapshot(doc => {
        let data = doc.data();
        let q = new Question(data.title, JSON.parse(data.auth), data.timestamp, doc.id, data.usersUpvoted.length - data.usersDownvoted.length, data.tags, data.img_url, data.username);
        firebase.firestore().collection("questions").doc(this.state.id).collection("replies").onSnapshot(querySnapshot => {
          querySnapshot.docs.forEach(doc => {
            q.addAnswer(doc.data().title, JSON.parse(doc.data().author), JSON.parse(doc.data().author).displayName, doc.data().timestamp, doc.id, doc.data().author.uid)
          })
          this.setState({question: q});
        })
      })
    }

    getUpvoteString(upvotes){
        if (upvotes >= 1000) {
            upvotes = ((upvotes / 1000)).toFixed(1) + "k";
        }
        return upvotes;
    }

    render(){
        let item = this.state.question;
        if(!item){
            return null;
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
        let deletedata = null;
            if (this.state.user !== null) {
            if (this.state.user.uid === item.getUser().uid) {
                deletedata = (
                <span>
                  <p className="links" style={{display:"inline-block"}} onClick={this.openInnerReply.bind(this, item)}>reply</p>
                    <span> | </span>
                    <span className="links" onClick={() => deleteQ(item)}>delete</span>
                </span>
                );
            }
        }
        let answers = null;
        if (item.getAllAnswers().length > 0) {
            answers = (
            <ul className="feed-list">
              {
                item.getAllAnswers().map((answer, i) => {
                  let auser = <RenderUser uid={answer.getUser().uid} currentUser={this.props.user}></RenderUser>

                  let deletedata = null;
                  if (this.state.user) {
                    if (answer.getUser().uid === this.state.user.uid) {
                      deletedata = (
                        <span>
                            <span> | </span>
                            <span className="links" onClick={() => this.deleteA(item, answer)}>delete</span>
                        </span>
                      );
                    }
                  }
                  
                  return (
                  <li key={"answer" + i} id="answerBox" style={dark}>
                      <Row>
                        <Col xs="1" className="updown">
                            <button style={dark} onClick={() => answer.upvote()} className="voteButton"><MdArrowUpward /></button>
                            <Votes num={this.getUpvoteString(answer.getUpvotes())} actualNumber={answer.getUpvotes()} listvalue={this.actualNumber} />
                            <button style={dark} onClick={() => answer.downvote()} className="voteButton"><MdArrowDownward /></button>
                        </Col>
                        <Col>
                            {auser}
                            <h5>Answer: {answer.getText()}</h5>
                            {/* {respondable} */}
                            <span className="links">reply</span>
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
        return (
            <React.Fragment>
    
              <div className="containerthread">

                <Container>
                  <div style={dark} className="questionBox">
                    <Row>
                      <Col xs="1" className="updown">
                        <button style={dark} onClick={() => this.upvote(true)} className="voteButton"><MdArrowUpward /></button>
                        <Votes num={this.getUpvoteString(item.getUpvotes())} actualNumber={item.getUpvotes()} />
                        <button style={dark} onClick={() => this.upvote(false)} className="voteButton"><MdArrowDownward /></button>
                      </Col>
                      <Col xs="11">
                        <div style={dark}>

                          {//<Button color="light" className="seeFull" onClick={() => this.setState({ focus: -1 })} >Exit</Button>
                          }
                          <Link to="/"><Button color="light" className="seeFull">Exit</Button></Link>
                          <h4>Question: {item.getText()}  {tag}</h4>
                          {
                            item.getImgUrl() !== "" ?
                              <img src={item.getImgUrl()} alt={item.getImgUrl()} className="post-img" />
                              :
                              null
                          }
                        </div>
                        <hr style={dark.line} />
                        {
                            /*
                            <span className="links" onClick={

                                this.openReply.bind(this, item)

                            }>reply</span>
                            */
                        }
                        {deletedata}
                        <Reply questionItem={item} submitHandler={this.submitHandler} errorMessage={this.state.errorMessage}/>
                      </Col>
                    </Row>
                    <ul className="feed-list">
                      {/*
                        item.getAllAnswers().map((answer, i) => {
                          user = <RenderUser uid={answer.getUser().uid} currentUser={this.props.user}></RenderUser> 
                          return (
                            //--------------------------------------------------------------------------------
                            //ANSWERS
                            <li key={"answer" + i} id="answerBox" style={dark}>
    
                              <Row>
                                <Col xs="1" className="updown">
                                  <button style={dark} onClick={() => answer.upvote()} className="voteButton"><MdArrowUpward /></button>
                                  <Votes num={this.getUpvoteString(answer.getUpvotes())} actualNumber={answer.getUpvotes()} listvalue={this.actualNumber} />
                                  <button style={dark} onClick={() => answer.downvote()} className="voteButton"><MdArrowDownward /></button>
                                </Col>
                                <Col>
                                  {user}
                                  <h5>Answer: {answer.getText()}</h5>
                                  <p className="links">reply</p>
                                </Col>
                              </Row>
    
                            </li>
                          );
                        })
                      */}
                    </ul>
                    {answers}
                  </div>
                </Container>
    
    
              </div>
    
            </React.Fragment >
          )
    }

    submitHandler = (event, item) => {
      event.preventDefault();
      let val = event.target["text"].value;
      if (val === "") {
        let err = <FormText color="danger">You cannot post nothing!</FormText>;
        this.setState({ errorMessage: err });
      } else if (this.state.user === null) {
        let err = <FormText color="danger">You have to sign in to post something</FormText>;
        this.setState({ errorMessage: err });
      } else {
        this.setState({ errorMessage: '' });
        // used Reply Database code
        if (this.state.user !== null) {
          firebase.firestore().collection('questions').doc(item.getId()).collection('replies').add({
            title: event.target["text"].value,
            author: JSON.stringify(this.state.user),
            upvotes: 0,
            downvotes: 0,
            timestamp: item.getTime(),
          }).then(doc => {
  
            item.addAnswer(val, JSON.stringify(this.state.user), item.getTime(), doc.id);
          })
        }
        // this.setState({ update: 0 });
        this.openReply(item)
        event.target["text"].value = "";
      }
    }

    upvote(isUpvote) {
      if (this.state.user !== null) {
        firebase.firestore().collection("questions").doc(this.state.question.getId()).get().then(doc => {
          let addTo = isUpvote ? doc.data().usersUpvoted : doc.data().usersDownvoted;
          let removeFrom = isUpvote ? doc.data().usersDownvoted : doc.data().usersUpvoted;
          if (addTo.indexOf(this.state.user.uid) === -1) {

            addTo.push(this.state.user.uid);
            if (removeFrom.indexOf(this.state.user.uid) > -1) {
              removeFrom = removeFrom.filter(item => (item !== this.state.user.uid ? true : false))
            }
            firebase.firestore().collection("questions").doc(this.state.question.getId()).update({
              usersUpvoted: isUpvote ? addTo : removeFrom,
              usersDownvoted: isUpvote ? removeFrom : addTo,
            })
          } else {
            console.log("You already upvoted!")
          }
          this.setState({ update: 0 });
        })
      } else {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).catch((error) => {
          console.error('Error Code ' + error.code + ': ' + error.message)
        });
      }
    }
    
    openReply(questionItem) {
      questionItem.reply();
      this.setState({ update: 1 })
    }
    openInnerReply(item1) {
      item1.replyInner();
      //item1.click();
  
      this.setState({ update: 1 })
    }
}