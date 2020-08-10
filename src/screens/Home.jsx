import React, { 
  Component, 
  useState 
} from 'react';
import {
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation,
  withRouter
} from 'react-router-dom'
import '../App.css';
import Feed from "./Feed.jsx";
import FullThread from "./fullThread.jsx";
import Question from '../Question';
import {
  Card, CardImg, CardBody, Button, Form, FormGroup, Label, Input, FormText, Badge, Spinner, Modal, ModalHeader, ModalBody, ModalFooter, Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import firebase from '../firebase.js';
import { storage } from '../firebase.js';
// import { get as _get } from "lodash";
import jacob from "../img/jacob.jpg";
import saarang from "../img/saarang.jpg";
import jason from "../img/jason.jpg";
import atli from "../img/atli-sucks.jpg";

const db = firebase.firestore();

// dark theme
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

const SocialDropdown = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(prevState => !prevState);

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle color="light" caret>
        Social
        </DropdownToggle>
      <DropdownMenu>
        <DropdownItem><a href={props.github}>Github</a></DropdownItem>
        <DropdownItem><a href={props.instagram}>Instagram</a></DropdownItem>
        <DropdownItem><a href={props.gmail}>Mail</a></DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

const AboutModal = (props) => {
  const {
    className,
  } = props;

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <div>
      <Button color="light" block onClick={toggle}>Who?</Button>
      <Modal returnFocusAfterClose={false} isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Us</ModalHeader>
        <ModalBody>
          <div className="cardcontainer">
            <Card className="card">
              <CardImg top width="100%" src={jason} alt="Jason Zhang" />
              <CardBody>
                <h3 className="aboutname">Jason Zhang</h3>
                <SocialDropdown github="https://github.com/minisounds" instagram="https://www.instagram.com/jason.zhang848/?hl=en" gmail="https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&source=mailto&to=jzscuba@gmail.com"></SocialDropdown>
              </CardBody>
            </Card>
            <Card className="card">
              <CardImg top width="100%" src={jacob} alt="Jacob Ismael" />
              <CardBody>
                <h3 className="aboutname">Jacob Ismael</h3>
                <SocialDropdown github="https://github.com/jacobismael" instagram="https://www.instagram.com/jacobismael16/?hl=en" gmail="https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&source=mailto&to=jacob.ismael@gmail.com"></SocialDropdown>
              </CardBody>
            </Card>
            <Card className="card">
              <CardImg top width="100%" src={saarang} alt="Saarang Bondalapati" />
              <CardBody>
                <h3 className="aboutname">Saarang Bondalapati</h3>
                <SocialDropdown github="https://github.com/saarangbond" instagram="https://www.instagram.com/saarang.bond.05/?hl=en" gmail="https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&source=mailto&to=saarang.bondalapati@gmail.com"></SocialDropdown>
              </CardBody>
            </Card>
            <Card className="card">
              <CardImg top width="100%" src={atli} alt="Atli Arnarsson" />
              <CardBody>
                <h3 className="aboutname">Atli Arnarsson</h3>
                <SocialDropdown github="https://github.com/atli-a" instagram="" gmail="https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&source=mailto&to=atli.arnarsson@gmail.com"></SocialDropdown>
              </CardBody>
            </Card>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Close</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

class Home extends Component{
  constructor(props) {
    super(props);

    this.state = {
      d: new Date(),
      questions: [],
      filteredQuestions: [],
      currentQuestion: [],
      width: 0,
      height: 0,
      errormessage: '',
      seeingFull: false,
      loading_data: true,
      loaded: 0,
      update: 0,
      image: null,
      url: "",
      progress: 0,
      user: {
        auth: null,
        name: 'Anonymous',
      },
      filterBy: "Popularity"
    };


    this.fileinputref = React.createRef()
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
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


    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);

    // db.collection("questions")
    //   .get()
    //   .then(querySnapshot => {
    //     return querySnapshot.docs.map(doc => new Question(doc.data().title, JSON.parse(doc.data().auth), doc.data().timestamp, doc.id, doc.data().upvotes, doc.data().tags));
    //   })
    //   });

    db.collection("questions")
      .onSnapshot((querySnapshot) => {
        let docs = this.state.questions;
        querySnapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            let doc = change.doc;
            docs.push(new Question(doc.data().title, JSON.parse(doc.data().auth), doc.data().timestamp, doc.id, doc.data().upvotes, doc.data().tags, doc.data().img_url));
            db.collection("questions").doc(doc.id).collection("replies").get().then(querySnapshot => {
              querySnapshot.docs.forEach(doc => {
                // console.log(doc.data());
              })
            })
          } else if (change.type === 'removed') {
            let doc = change.doc;
            for (var i = 0; i < docs.length; i++) {
              if (docs[i].getId() === doc.id) {
                docs.splice(i, 1);
              }
            }
          }
        })
        this.setState({ questions: docs, filteredQuestions: docs, loading_data: false })
        if (this.state.filterBy === "Popularity") {
          this.orderByPopularity()
        }
      })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  signinwithGoogle = () => {
    let provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then((result) => {
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;

      if(result.additionalUserInfo.isNewUser){
        this.props.history.push('/profile')
      }
      //console.log(this.props, history)
      
      //console.log(`the goog token is: ${token}`);
      //console.log(`auth user is: ${JSON.stringify(user.stsTokenManager, null, 4)}`);
      // return response.json(); // parses JSON response into native JavaScript objects

    }).catch((error) => {
      console.error('Error Code ' + error.code + ': ' + error.message)
    });
  }


  signoutwithGoogle() {
    firebase.auth().signOut().then(() => {
      this.setState({ update: 0 });
    }).catch((error) => {
      // An error happened.
    });
  }

  handleFileInput = e => {
    e.preventDefault();
    if (e.target.files[0] !== null) {
      const image = e.target.files[0];
      //console.log(image);
      this.setState(() => ({ image }));
    }
    else {
      this.setState({ image: null })
    }
  };

  handleImageUpload = () => {
    if (this.state.image !== null) {
      const { image } = this.state;
      const uploadTask = storage.ref(`images/${image.name}`).put(image);
      return (
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
      )
    }
    return null;
  };

  submitHandler = (event) => {
    event.preventDefault();
    let val = event.target["text"].value;
    let t = event.target["select"].value;
    if (val === "") {
      let err = <FormText color="danger">You cannot post nothing!</FormText>;
      this.setState({ errormessage: err });
    } else if (this.state.user.auth === null) {
      let err = <FormText color="danger">You have to sign in to post something</FormText>;
      this.setState({ errormessage: err });
    } else {
      this.setState({ errormessage: '' });

      let date = (new Date()).toString();

      if (this.handleImageUpload() !== null) {
        this.handleImageUpload()
          .then(url => {
            this.fileinputref.current.value = null
            this.forceUpdate()
            this.setState({ url });
            //console.log(this.fileinputref)
            firebase.firestore()
              .collection('questions')
              .add({
                title: val,
                img_url: this.state.url,
                username: this.state.user.name,
                auth: JSON.stringify(this.state.user.auth),
                upvotes: 0,
                downvotes: 0,
                timestamp: date,
                tags: t,
              }).then((docRef) => {
                firebase.database().ref('audit log').push(date + ": created a new post");
              });
          });
      } else {
        firebase.firestore()
          .collection('questions')
          .add({
            title: val,
            img_url: this.state.url,
            username: this.state.user.name,
            auth: JSON.stringify(this.state.user.auth),
            upvotes: 0,
            downvotes: 0,
            timestamp: date,
            tags: t,
          }).then((docRef) => {
            firebase.database().ref('audit log').push(date + ": created a new post");
          });
      }

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

      this.setState({ update: 0 });
      event.target["text"].value = "";
    }
  }

  changeHandler = (event) => {
    let val = event.target.value;
    this.setState({ text: val });
  }

  handleSearch = (e) => {
    let value = e.target.value
    if (value === "") {
      this.setState({ filteredQuestions: this.state.questions })
    } else {
      this.setState({ filteredQuestions: this.state.questions.filter(item => item.getText().toLowerCase().includes(value.toLowerCase())) })
    }
  }

  render() {
    let feed = <Feed theme={theme1} user={this.state.user} filteredQuestions={this.state.filteredQuestions} />;

    if (this.state.loading_data) {
      feed = <Spinner className="loader" style={{ width: '5rem', height: '5rem' }} color="warning" />;

    }

    let solo = <FullThread theme={theme1} user={this.state.user} filteredQuestions={this.state.filteredQuestions} />;
    if (this.state.loading_data) {
      solo = <Spinner className="loader" style={{ width: '5rem', height: '5rem' }} color="warning" />;
    }
    return (
      <React.Fragment>
        

        <div className="height"></div>

        <div id="titleArea" style={theme1.header}>
          <h1 id="title">MVHW</h1>
          <input type="search" name="Search" id="searchBar" placeholder="Search" onChange={this.handleSearch} />
          {
            this.state.user.auth !== null ?
              <img src={this.state.user.auth.photoURL} alt={this.state.user.name} id="logOut" onClick={this.signoutwithGoogle} />
              :
              <Button color='light' id="logIn" onClick={this.signinwithGoogle}>Sign In</Button>
          }
        </div>

        <br />
        <br />
        <br />
        <br />

        <section className="sidePanel">
          <div className="sbox">
            <Button color="light" block onClick={this.filterQuestionsBy}>Current Filter: {this.state.filterBy}</Button>
          </div>
          <div className="sbox">
            <p>Create a Post:</p>
            <hr style={theme1.line} />
            <Form onSubmit={this.submitHandler}>
              <FormGroup>
                <Label for="text">Text:</Label>
                <Input type="textarea" name="text" id="text" onChange={this.changeHandler} />
                {this.state.errormessage}
                <br />
                <input type="file" id="uploadFile" ref={this.fileinputref} onChange={this.handleFileInput} />
                <br />
                <br />
                <Label for="tags"><Badge color="info">Optional</Badge> Tag:</Label>
                <Input type="select" name="select" id="tags">
                  <option>None</option>
                  <option>Math</option>
                  <option>Geometry</option>
                  <option>Algebra</option>
                  <option>Trigonometry</option>
                  <option>Calculus</option>
                  <option>Science</option>
                  <option>Biology</option>
                  <option>Chemistry</option>
                  <option>Physics</option>
                  <option>English</option>
                  <option>Survey</option>
                  <option>AP Comp</option>
                  <option>History</option>
                  <option>World Studies</option>
                  <option>AP Euro</option>
                  <option>WHAP</option>
                  <option>USHAP</option>
                  <option>Spanish</option>
                  <option>Anime</option>
                  <option>Chinese</option>
                  <option>Computer Science</option>
                  <option>Art</option>
                  <option>Music</option>
                </Input>
              </FormGroup>
              <Button color="light" block>Submit</Button>
            </Form>
          </div>

          <div className="sbox" id="last">
            <a href="https://github.com/MV23-Devs/MVHW" className='link-dark'>Github</a>
            <br />
            <a href="https://www.instagram.com/mvhs.2023/?hl=en" className='link-dark'>Instagram</a>
            <br />
            <br />
            <h6 className="copyright">Copyright (c) 2020 Mountain View 2023 Developers</h6>
            <AboutModal></AboutModal>
          </div>
        </section>


        <div className="feed">
          {feed}
        </div>

      </React.Fragment>
    );
  }

  filterQuestionsBy = () => {
    //console.log("filterBy");
    let temp = ((this.state.filterBy === "Popularity") ? "None" : "Popularity");
    //this.setState({filterBy: temp});
    this.state.filterBy = temp;
    //console.log(this.state.filterBy === "popularity");
    if (this.state.filterBy === "Popularity") {
      //console.log("popular")
      this.orderByPopularity();
    } else if (this.state.filterBy === "None") {
      //console.log("none")
    }
    //console.log(this.state.filteredQuestions);
    this.setState({ update: 0 });
  }

  orderByPopularity = () => {
    //console.log("orderBy");
    //console.log(this.state.filteredQuestions);
    let tempArray = this.state.filteredQuestions;
    for (let i = 0; i < tempArray.length; i++) {
      for (let j = 0; j < tempArray.length - i - 1; j++) {
        if (tempArray[j].getUpvotes() < tempArray[j + 1].getUpvotes()) {
          let temp1 = tempArray[j];
          tempArray[j] = tempArray[j + 1];
          tempArray[j + 1] = temp1;
        }
      }
    }
    this.setState({ filteredQuestions: tempArray });
    //console.log(this.state.filteredQuestions);
  }

  sortQs() {

  }

  updateFilter = (filteredQuestions) => {
    //console.log(filteredQuestions);
    this.setState(
      { filteredQuestions }
    )
  }

  // getFooterColor = () => {
  //   this.setState({
  //     styles: this.state.theme === 1 ? { ...dark } : { ...light }
  //   });
  //   console.log(theme1.footer.backgroundColor);
  //   return theme1.footer.backgroundColor;
  // }
}
export default withRouter(Home)