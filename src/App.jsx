import React, { Component } from 'react';
import './App.css';
import Feed from "./screens/Feed.jsx";
import NavBar from './components/NavBar.jsx'
import Question from './Question';
import { Button, Form, FormGroup, Label, Input, FormText, Badge } from 'reactstrap';

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
  }
};

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      d: new Date(),
      questions: [
        new Question("What is the answer to life?", "Joe", (new Date()).getTime()),
        new Question("How many planets are in the solar system?", "Pluto", (new Date()).getTime()),
        new Question("What color is green?", "Hello", (new Date()).getTime()),
      ],
      filteredQuestions: [
        new Question("What is the answer to life?", "Joe", (new Date()).getTime()),
        new Question("How many planets are in the solar system?", "Pluto", (new Date()).getTime()),
        new Question("What color is green?", "Hello", (new Date()).getTime()),
      ],
      currentQuestion: [
        new Question("hmmmmmmmmmmm", "hi", new Date().getTime())
      ],
      theme: 1,
      styles: { ...theme2, ...theme1 },
      width: 0,
      height: 0,
      errormessage: '',
      text: "",
      tags: [],
      seeingFull: false
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  changeTheme = () => {
    this.setState({
      styles: this.state.theme === 1 ? { ...theme2 } : { ...theme1 },
      theme: this.state.theme === 1 ? 2 : 1,
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
      let q = new Question(val, "You", (new Date()).getTime());
      this.state.questions.push(q);
      this.state.filteredQuestions.push(q);
      this.setState({ text: '' });
      event.target["text"].value = "";
    }
  }

  changeHandler = (event) => {
    let val = event.target.value;
    this.setState({ text: val });
  }

  render() {
    if (!this.state.seeingFull) {
      return (
        <React.Fragment>
          <div style={{ height: this.state.height, backgroundColor: this.state.styles.body.backgroundColor }}>
            <div id="titleArea" style={this.state.styles.header}>
              <h1 id="title">MVHW</h1>
              <NavBar
                questions={this.state.questions}
                updateFilter={this.updateFilter}
              />

              <Button color={this.state.theme === 1 ? 'light' : 'dark'} id="logIn">Connect to your Gmail Account</Button>
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
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, laborum necessitatibus. Consequatur doloribus dolorem, nostrum minus voluptatem doloremque porro eligendi architecto possimus! Alias maxime quod laborum voluptates porro, voluptate eligendi.</p>
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

    else {
      return (
        <React.Fragment>
          <div id="main" style={this.state.styles.body}>
            <div id="titleArea" style={this.state.styles.header}>
              <h1 id="title">Homework Hub</h1>
              <NavBar
                questions={this.state.questions}
                updateFilter={this.updateFilter}
              />

              <Button color={this.state.theme === 1 ? 'light' : 'dark'} id="logIn">Connect to your Google Account</Button>
            </div>

            <div id="sidePanel" style={this.state.styles.footer}>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, laborum necessitatibus. Consequatur doloribus dolorem, nostrum minus voluptatem doloremque porro eligendi architecto possimus! Alias maxime quod laborum voluptates porro, voluptate eligendi.</p>
              <Button theme={this.state.theme} color={this.state.theme === 1 ? 'light' : 'dark'} block onClick={this.changeTheme}>Switch to {this.state.theme === 1 ? 'light' : 'dark'} theme</Button>
            </div>

            <div id="fullQuestion">
              <Feed theme={this.state.theme} filteredQuestions={this.state.currentQuestion} />
            </div>


            {/* <footer className="footer" style={this.state.styles.footer} >
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium impedit, minus autem sint exercitationem voluptatum facere aut quisquam ipsum reprehenderit. Dolore corrupti provident cum mollitia fuga necessitatibus excepturi non impedit.</p>
            
          </footer> */}
          </div>

        </React.Fragment>
      );
    }
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