import React, { Component } from 'react';
import './App.css';
import Feed from "./screens/Feed.jsx";
import NavBar from './components/NavBar.jsx'
import Question from './Question';
import { Button, Form, FormGroup, Label, Input, FormText, Badge } from 'reactstrap';

import firebase from './firebase.js';


const db = firebase.firestore();


console.log("_   .-')          (`-.    ('-. .-.  (`\ .-') /\`\n( '.( OO )_      _(OO  )_ ( OO )  /   `.( OO ),\'\n ,--.   ,--.),--(_/   ,.  \,--. ,--.,--./  .--.  \n |   `.'   | \\   \   /(__/ |  | |  ||      |  |  \n |         |  \\   \ /   /  |   .|  ||  |   |  |, \n |  |'.'|  |   \\   '   /, |       ||  |.'.|  |_)\n |  |   |  |    \\     /__)|  .-.  ||         |  \n |  |   |  |     \\   /    |  | |  ||   ,'.   |  \n \`--'   \`--'      \`-'     \`--' \`--''--'   '--'");


// dark theme
const theme1 = {
  header: {
    backgroundColor: '#222',
    color: '#fff',
    borderBottomColor: '#ccc',
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

// light theme
const theme2 = {
  header: {
    backgroundColor: '#fff',
    color: '#000',
    borderBottomColor: '#333',
  },
  body: {
    backgroundColor: '#ccc',
  },
  footer: {
    backgroundColor: '#fff',
    color: '#333'
  },
  line: {
    backgroundColor: '#222',
  },
  link: {
    color: '#000',
  }
};

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      d: new Date(),
      // questions: [
      //   new Question('test', "test", 0, 0)
      // ],
      questions: [],
      filteredQuestions: [],
      currentQuestion: [],
      theme: 1,
      styles: { ...theme2, ...theme1 },
      width: 0,
      height: 0,
      errormessage: '',
      text: "",
      tags: [],
      seeingFull: false,
    };

    // this.feed = [];
    // this.ffeed = [];

    // db.collection("questions").get().then((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //       let raw = doc.data();
    //       let q = new Question(raw.title, raw.author, raw.timestamp, doc.id);
    //       this.feed.push(q);
    //       this.ffeed.push(q);
    //     });
    //   })
    //   .catch((error) => {
    //     console.error("Error getting database data: ", error);
    //   });


    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {

    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);

    db.collection("questions")
    .get()
    .then(querySnapshot => {
      return querySnapshot.docs.map(doc => new Question(doc.data().title, doc.data().author, doc.data().timestamp, doc.id));
    }).then((data) => {
      console.log(data);
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  changeTheme = () => {
    this.setState({
      theme: this.state.theme === 1 ? 2 : 1,
      styles: this.state.theme === 1 ? { ...theme2 } : { ...theme1 },
    });
  };

  submitHandler = (event) => {
    event.preventDefault();
    let val = this.state.text;
    if (val === "") {
      let err = <FormText color="danger">You cannot post nothing!</FormText>;
      this.setState({ errormessage: err });
    } else {
      this.setState({ errormessage: '' });

      let date = (new Date()).toString();
      var id = null;

      firebase.firestore().collection('questions').add({
        title: this.state.text,
        author: 'devs',
        upvotes: 0,
        downvotes: 0,
        timestamp: date,
      }).then(function (docRef) {
        firebase.database().ref('audit log').push(date + ": created a new post");
        id = docRef.id;
      });

      let q = new Question(val, "You", (new Date()).getTime(), id);
      this.state.questions.push(q);
      this.state.filteredQuestions.push(q);

      // Unused Reply Database code
      /* 

      firebase.firestore().collection('questions').doc(q.getText()).collection('replies').add({
          title: this.state.text,
          author: 'devs',
          upvotes: 0,
          downvotes: 0,
          timestamp: q.getTime(),
        });

      */

      this.setState({ text: '' });
      event.target["text"].value = "";
    }
  }

  changeHandler = (event) => {
    let val = event.target.value;
    this.setState({ text: val });
  }

  render() {
    return (
      <React.Fragment>
        <div style={{ height: this.state.height, backgroundColor: this.state.styles.body.backgroundColor }}>
          <div id="titleArea" style={this.state.styles.header}>
            <h1 id="title">MVHW</h1>
            <NavBar
              questions={this.state.questions}
              updateFilter={this.updateFilter}
            />

            <Button color={this.state.theme === 1 ? 'light' : 'dark'} id="logIn">Sign In</Button>
          </div>

          <section className="sidePanel">



            <div className="sbox" style={this.state.styles.footer}>
              <p>Create a Post:</p>
              <hr style={this.state.theme === 1 ? theme1.line : theme2.line} />
              <Form onSubmit={this.submitHandler}>
                <FormGroup>
                  <Label for="text">Text:</Label>
                  <Input type="textarea" name="text" id="text" onChange={this.changeHandler} />
                  {this.state.errormessage}
                  <br />
                  <Label for="tags"><Badge color="info">Optional</Badge> Tag:</Label>
                  <Input type="select" name="select" id="tags">
                    <option>Math</option>
                    <option>Science</option>
                    <option>English</option>
                    <option>History</option>
                    <option>Computer Science</option>
                  </Input>
                </FormGroup>
                <Button color={this.state.theme === 1 ? 'light' : 'dark'} block>Submit</Button>
              </Form>
            </div>

            <div className="sbox" style={this.state.styles.footer}>
              <a href="https://github.com/MV23-Devs/MVHW" className={this.state.theme === 1 ? 'link-dark' : 'link-light'}>Github</a>
              <br />
              <a href="https://www.instagram.com/mvhs.2023/?hl=en" className={this.state.theme === 1 ? 'link-dark' : 'link-light'}>Instagram</a>
              <br />
              <br />
              <h6 className="copyright">Copyright (c) 2020 Mountain View 2023 Developers</h6>
              <hr style={this.state.theme === 1 ? theme1.line : theme2.line} />
              <Button theme={this.state.theme} color={this.state.theme === 1 ? 'light' : 'dark'} block onClick={this.changeTheme}>Switch to {this.state.theme === 1 ? 'light' : 'dark'} theme</Button>
            </div>
          </section>

          <div id="field">
            <Feed theme={this.state.theme} filteredQuestions={this.state.filteredQuestions} />
          </div>


          {/* <footer className="footer" style={this.state.styles.footer} >
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium impedit, minus autem sint exercitationem voluptatum facere aut quisquam ipsum reprehenderit. Dolore corrupti provident cum mollitia fuga necessitatibus excepturi non impedit.</p>

          </footer> */}
        </div>

      </React.Fragment>
    );
  }

  sortQs() {

  }

  updateFilter = (filteredQuestions) => {
    this.setState(
      { filteredQuestions }
    )
  }

  // getFooterColor = () => {
  //   this.setState({
  //     styles: this.state.theme === 1 ? { ...dark } : { ...light }
  //   });
  //   console.log(this.state.styles.footer.backgroundColor);
  //   return this.state.styles.footer.backgroundColor;
  // }
}