import React, {Component} from 'react'
import '../App.css'
import { MdArrowUpward, MdArrowDownward } from "react-icons/md";
import { Container, Row, Col, Button, Form, FormGroup, Label, FormText, Input, Badge, UncontrolledPopover, PopoverBody } from 'reactstrap';
import Question from '../Question';
import { data } from 'jquery';


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

export default class QuestionPage extends Component{
    state={
        id: this.props.match.params.id,
        question: null,
    }

    componentDidMount(){
        firebase.firestore().collection("questions").doc(this.state.id).get().then(doc => {
            let data = doc.data()
            let q = new Question(data.title, JSON.parse(data.auth), data.timestamp, doc.id, data.usersUpvoted.length - data.usersDownvoted.length, data.tags, data.img_url, data.username);
            firebase.firestore().collection("questions").doc(this.state.id).collection("replies").onSnapshot(querySnapshot => {
                querySnapshot.docs.forEach(doc => {
                    q.addAnswer(doc.data().title, JSON.parse(doc.data().author), JSON.parse(doc.data().author).displayName, doc.data().timestamp, doc.id, doc.data().author.uid)
                })
                this.setState({question: q});
            })
        })
    }

    render(){
        return (

            <React.Fragment>
    
              <div className="containerthread">
    
                <Container>
                  <div style={dark} className="questionBox">
                    <Row>
                      <Col xs="1" className="updown">
                        <button style={dark} onClick={() => this.upvote()} className="voteButton"><MdArrowUpward /></button>
                        <Votes num={upvotes} actualNumber={item.getUpvotes()} listvalue={i} />
                        <button style={dark} onClick={() => this.downvote()} className="voteButton"><MdArrowDownward /></button>
                      </Col>
                      <Col xs="11">
                        <div style={dark}>
                          {user}
                          <Button color="light" className="seeFull" onClick={() => this.setState({ focus: -1 })} >Exit</Button>
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
    
                        }>reply</span>
                        {deletedata}
                        {this.renderReply(item)}
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

    upvote() {
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
            })

            this.setState({ update: 0 })
        } else {
            var provider = new firebase.auth.GoogleAuthProvider();

            firebase.auth().signInWithPopup(provider).catch((error) => {
            console.error('Error Code ' + error.code + ': ' + error.message)
            });
        }
    }
}