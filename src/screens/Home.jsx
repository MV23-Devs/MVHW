import React, {
  Component,
  useState
} from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom'
import {translate} from "../util.js"
import '../App.css';
import Feed from "./Feed.jsx";
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

//const classes = require("../classes.json").classes;

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
        {
          props.linkedin !== null ?
          <DropdownItem><a href={props.linkedin}>Linkedin</a></DropdownItem>
          :
          null
        }
        <DropdownItem><a href={props.instagram}>Instagram</a></DropdownItem>
        <DropdownItem><a href={props.gmail}>Mail</a></DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export const ProfilePictureDropdown = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(prevState => !prevState);

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle} id="socialDrop">
      <DropdownToggle
        tag="span"
        data-toggle="dropdown"
        aria-expanded={dropdownOpen}
      >
        {props.children}
      </DropdownToggle>
      <DropdownMenu id="ProfileMenu">
        <Link to="/profile"><DropdownItem >Profile</DropdownItem></Link>
        <DropdownItem onClick={props.signout}>Sign Out</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}


const AboutModal = (props) => {
  const {
    className,
    language
  } = props;

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <div>
      <Button color="light" block onClick={toggle}>{translate(language, "who")}</Button>
      <Modal returnFocusAfterClose={false} isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Us</ModalHeader>
        <ModalBody>
          <div className="cardcontainer">
            <Card className="card">
              <CardImg top width="100%" src={jason} alt="Jason Zhang" />
              <CardBody>
                <h3 className="aboutname">Jason Zhang</h3>
                <SocialDropdown github="https://github.com/minisounds" linkedin={null} instagram="https://www.instagram.com/jason.zhang848/?hl=en" gmail="https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&source=mailto&to=jzscuba@gmail.com"></SocialDropdown>
              </CardBody>
            </Card>
            <Card className="card">
              <CardImg top width="100%" src={jacob} alt="Jacob Ismael" />
              <CardBody>
                <h3 className="aboutname">Jacob Ismael</h3>
                <SocialDropdown github="https://github.com/jacobismael" linkedin="https://www.linkedin.com/in/jacob-ismael-9b2b431b0/" instagram="https://www.instagram.com/jacobismael16/?hl=en" gmail="https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&source=mailto&to=jacob.ismael@gmail.com"></SocialDropdown>
              </CardBody>
            </Card>
            <Card className="card">
              <CardImg top width="100%" src={saarang} alt="Saarang Bondalapati" />
              <CardBody>
                <h3 className="aboutname">Saarang Bondalapati</h3>
                <SocialDropdown github="https://github.com/saarangbond" linkedin="https://www.linkedin.com/in/saarang-bondalapati-77b1371b6/" instagram="https://www.instagram.com/saarang.bond.05/?hl=en" gmail="https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&source=mailto&to=saarang.bondalapati@gmail.com"></SocialDropdown>
              </CardBody>
            </Card>
            <Card className="card">
              <CardImg top width="100%" src={atli} alt="Atli Arnarsson" />
              <CardBody>
                <h3 className="aboutname">Atli Arnarsson</h3>
                <SocialDropdown github="https://github.com/atli-a" linkedin={null} instagram="" gmail="https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&source=mailto&to=atli.arnarsson@gmail.com"></SocialDropdown>
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

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      d: new Date(),
      questions: [],
      filteredQuestions: [],
      width: 0,
      height: 0,
      errormessage: '',
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
      filterBy: "popularity",
      anonymousPost: false,
    };


    this.fileinputref = React.createRef()
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }


  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user: { auth: user, name: user.displayName } })
      } else {
        this.setState({ user: { auth: user, name: 'Anonymous' } })
      }
    });


    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);

    db.collection("questions")
      .onSnapshot((querySnapshot) => {
        let docs = this.state.questions;
        querySnapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            let doc = change.doc;

            let ups = doc.data().usersUpvoted.length
            let downs = doc.data().usersDownvoted.length
            let votes = ups - downs;
            
            let q = new Question(doc.data().title, JSON.parse(doc.data().auth), doc.data().timestamp, doc.id, votes, doc.data().tags, doc.data().img_url, doc.data().username);
            docs.push(q);
            db.collection("questions").doc(doc.id).collection("replies").onSnapshot(querySnapshot => {
              querySnapshot.docs.forEach(doc => {
                q.addAnswer(doc.data().title, JSON.parse(doc.data().author), JSON.parse(doc.data().author).displayName, doc.data().timestamp, doc.id, doc.data().author.uid)
              })
            })
          } else if (change.type === 'removed') {
            let doc = change.doc;
            for (var i = 0; i < docs.length; i++) {
              if (docs[i].getId() === doc.id) {
                docs.splice(i, 1);
              }
            }
          } else if (change.type === 'modified'){
            let doc = change.doc;
            let votes = doc.data().usersUpvoted.length - doc.data().usersDownvoted.length;
            for (let i = 0; i < docs.length; i++){
              if (docs[i].getId() === doc.id) {
                docs.splice(i, 1, new Question(doc.data().title, JSON.parse(doc.data().auth), doc.data().timestamp, doc.id, votes, doc.data().tags, doc.data().img_url, doc.data().username));
              }
            }
          }
        })
        this.setState({ questions: docs, filteredQuestions: docs, loading_data: false })
        if (this.state.filterBy === "popularity") {
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

    provider.setCustomParameters({
      'hd': 'mvla.net'
    });

    firebase.auth().signInWithPopup(provider).then((result) => {
      //var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;

      if (user.email.substring(user.email.indexOf('@') + 1) !== "mvla.net") {
        firebase.auth().currentUser.delete()
        return null;
      }

      if (result.additionalUserInfo.isNewUser) {
        firebase.firestore()
          .collection('users')
          .doc(user.uid).set({
            name: user.displayName,
            email: user.email,
            isTutor: false
          }).then((docRef) => {
            firebase.database().ref('audit log').push(new Date().toString() + ": new user joined: " + user);
            this.props.history.push('/profile');
          });
      }
    }).catch((error) => {
      console.error('Error Code: ' + error.code + ': ' + error.message)
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
      this.setState(() => ({ image }));
      this.readURL(e.target);
    }
    else {
      this.setState({ image: null })
    }
  };

  createClassItems() {
    let items = [];
    let classes = translate(this.props.language, "classes");
    for (let i = 0; i < (classes.length); i++) {
      items.push(<option key={i}>{classes[i]}</option>);
    }
    return items;
  }

  handleAnonymousInput = (event) => {
    let target = event.target;
    this.setState({ anonymousPost: target.checked })
  }

  handleImageUpload = () => {
    if (this.state.image !== null) {
      const { image } = this.state;
      storage.ref(`images/${image.name}`).put(image);
      return (
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
      )
    }
    return null;
  };
  readURL = (input) => {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        document.getElementById("previewImage").src = e.target.result;
      }

      reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
  }

  submitHandler = (event) => {
    event.preventDefault();
    let val = event.target["text"].value;
    let t = event.target["select"].value;
    let anonymous = this.state.anonymousPost
    if (val === "") {
      let err = <FormText color="danger">You cannot post nothing!</FormText>;
      this.setState({ errormessage: err });
    } else if (this.state.user.auth === null) {
      let err = <FormText color="danger">You have to sign in to post something</FormText>;
      this.setState({ errormessage: err });
    } else {
      this.setState({ errormessage: '' });

      let date = (new Date()).toString();
      let name = "";
      if (anonymous === true) {
        name = "Anonymous";
      } else {
        name = this.state.user.name;
      }
      if (this.handleImageUpload() !== null) {
        this.handleImageUpload()
          .then(url => {
            this.fileinputref.current.value = null
            this.forceUpdate()
            this.setState({ url });
            firebase.firestore()
              .collection('questions')
              .add({
                title: val,
                img_url: this.state.url,
                username: name,
                auth: JSON.stringify(this.state.user.auth),
                usersUpvoted: [],
                usersDownvoted: [],
                timestamp: date,
                tags: t,
              }).then((docRef) => {
                firebase.firestore()
                  .collection('users').doc(this.state.user.auth.uid).collection("posts")
                  .add({
                    title: val,
                    img_url: this.state.url,
                    timestamp: date,
                    tags: t,
                    original: docRef.id,
                  }).then((docRef) => {
                    firebase.database().ref('audit log').push(date + ": created a new post");
                    this.setState({ image: null });
                  });
                firebase.database().ref('audit log').push(date + ": created a new post");
                this.setState({ image: null });
              });
          });
      } else {
        firebase.firestore()
          .collection('questions')
          .add({
            title: val,
            img_url: this.state.url,
            username: name,
            auth: JSON.stringify(this.state.user.auth),
            usersUpvoted: [],
            usersDownvoted: [],
            timestamp: date,
            tags: t,
          }).then((docRef) => {
            firebase.firestore()
              .collection('users').doc(this.state.user.auth.uid).collection("posts")
              .add({
                title: val,
                img_url: this.state.url,
                timestamp: date,
                tags: t,
                original: docRef.id,
              }).then((docRef) => {
                firebase.database().ref('audit log').push(date + ": created a new post");
                this.setState({ image: null });
              });
            firebase.database().ref('audit log').push(date + ": created a new post");
          });
      }

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

  changeLanguage = () => {
    this.props.languageChangeHandler();
  }

  render() {

    return (
      <React.Fragment>

        <div className="height"></div>

        <div id="titleArea" style={theme1.header}>
          <h1 id="title">MVHW</h1>
          <input type="search" name="Search" id="searchBar" placeholder="Search" onChange={this.handleSearch} />
          {/* <Button id="tutorButton" className="newBtn" style={{marginRight: "10px"}}href="/tutoring" >{translate(this.props.language, "tutoring")}</Button> */}
          <Button color="light" onClick={this.filterQuestionsBy}>{translate(this.props.language, "currentFilter")} {translate(this.props.language, this.state.filterBy)}</Button>
            <Label for="text" style={{marginLeft: "10px"}}>{translate(this.props.language, "classFilter")}:</Label>
            <Input type="select" name="select" id="tags" style={{width: "unset", display: "unset", marginLeft: "10px"}}onChange={this.filterClass}>
              {this.createClassItems()}
            </Input>
          {
            this.state.user.auth !== null ?
              <ProfilePictureDropdown signout={this.signoutwithGoogle}><img src={this.state.user.auth.photoURL} alt={this.state.user.name} id="logOut" /></ProfilePictureDropdown>
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
            <Button id="languageButton" className="newBtn" onClick={this.changeLanguage} >{translate(this.props.language, "language")}</Button>
            <Button color="light" style={{marginLeft: "10px"}} onClick={() => window.open("https://tinyurl.com/y5rhw7gw", '_blank')}>{translate(this.props.language, "feedback")}</Button>
          </div>
          <div className="sbox">
            <p>{translate(this.props.language, "createPost")}</p>
            <hr style={theme1.line} />
            <Form onSubmit={this.submitHandler}>
              <FormGroup>
                <Label for="text">{translate(this.props.language, "text")}</Label>
                <Input type="textarea" name="text" id="text" onChange={this.changeHandler} />
                {this.state.errormessage}
                <br />
                <input type="file" id="uploadFile" ref={this.fileinputref} onChange={this.handleFileInput} />
                <br />
                {

                  this.state.image !== null ?
                    <img id="previewImage" alt={this.state.image} width="100px" />
                    :
                    null
                }
                <br />
                <Label for="tags"><Badge color="danger">{translate(this.props.language, "tag")}</Badge></Label>
                <Input type="select" name="select" id="tags">
                  {this.createClassItems()}
                </Input>
                <br />
                <Label id="anonymousBoxLabel" for="anonymousBox">{translate(this.props.language, "anonymous")}</Label>
                <span id="spacer1"></span>
                <input type="checkbox" id="anonymousBox" name="anonymousBox" onChange={this.handleAnonymousInput} />
              </FormGroup>
              <Button color="light" block>{translate(this.props.language, "submitButton")}</Button>
            </Form>
          </div>

          <div className="sbox" id="last">
            <a href="https://github.com/MV23-Devs/MVHW" className='link-dark'>Github</a>
            <br />
            <a href="https://www.instagram.com/mvhs.2023/?hl=en" className='link-dark'>Instagram</a>
            <br />
            <h6 className="copyright">Copyright (c) 2020 Mountain View 2023 Developers</h6>
            <AboutModal language={this.props.language}/>
          </div>
        </section>


        <div className="feed">
          {
            console.log(this.state.user)
          }
          {
            this.state.loading_data ?
              <Spinner className="loader" style={{ width: '5rem', height: '5rem' }} color="warning" />
              :
              <Feed language={this.props.language} theme={theme1} user={this.state.user} filteredQuestions={this.state.filteredQuestions} />
          }
        </div>

      </React.Fragment>
    );
  }

  filterQuestionsBy = () => {
    let temp = (this.state.filterBy === "popularity") ? "none" : "popularity"
    if(temp === "popularity") {
      this.orderByPopularity();
    } else if (temp === "none") {
      //nothing
    }
    this.setState({ filterBy: temp });
    this.setState({ update: 0 });
  }

  orderByPopularity = () => {
    this.setState({ filteredQuestions: this.state.filteredQuestions.sort((a,b) => b.getUpvotes() - a.getUpvotes())});
  }

  updateFilter = (filteredQuestions) => {
    this.setState({ filteredQuestions })
  }

  filterClass = (e) => {
    e.preventDefault();
    let cless = e.target.value;
    let filtered = [];
    if (cless !== "None") {
      for (let i = 0; i < this.state.questions.length; i++) {
        if (this.state.questions[i].getTags() === cless) {
          filtered.push(this.state.questions[i]);
        }
      }
      this.setState({ filteredQuestions: filtered })
    } else {
      this.setState({ filteredQuestions: this.state.questions })
    }
  }
}
export default withRouter(Home)