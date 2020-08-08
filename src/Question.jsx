import Answer from './Answer.jsx'
import firebase from './firebase.js';


export default class Question {
    constructor(questionText, user, time, id, upvotes = 0, tags = null, img_url = "") {
        this.questionText = questionText
        this.img_url = img_url;
        this.isReplying = false;
        this.isReplyingInner = false;
        this.user = user
        this.id = id
        this.upvotes = upvotes;
        this.answers = [];

        this.answersRaw = 0;
        let len = 100;

        firebase.firestore()
            .collection('questions')
            .doc(id).collection('replies')
            .get().then((doc) => {
                len = doc.docs.length
            }

            ).then(() => {

                console.log("len " + len)

            }
            )


        for (let i = 0; i < len; i++) {
            let aTitle;
            firebase.firestore()
                .collection('questions')
                .doc(id).collection('replies')
                .get().then((doc) => {
                    if (doc.docs[0] !== undefined) {
                        console.log(doc.docs[0].data().title)
                    }
                })

            let aUser;
            firebase.firestore()
                .collection('questions')
                .doc(id).collection('replies')
                .get().then((doc) => {
                    if (doc.docs[0] !== undefined) {
                        aUser = (doc.docs[0].data().uid)
                    }
                })

            let aUp;
            firebase.firestore()
                .collection('questions')
                .doc(id).collection('replies')
                .get().then((doc) => {
                    if (doc.docs[0] !== undefined) {
                        aUser = (doc.docs[0].data().upvotes)
                    }
                })

                
            this.answers.push(new Answer(aTitle, aUser, "unkown time", aUp, null))


        }

        //answerText, user, time, id, upvotes=0, tags=null


        this.tags = tags;
        this.isClicked = false;
        this.time = time



        firebase.firestore()
            .collection('questions')
            .doc(id).collection('replies')
            .get().then((doc) => {
                if (doc.docs[0] !== undefined) {
                    console.log(doc.docs[0].data().title)
                }
            })

        // firebase.firestore().collection('questions').doc(id).collection('replies').get().then((doc) => {
        //     console.log(doc.docs[0].data())

        // })

        // for (let i = 0; i < this.answersRaw.length; i++) {
        //     let a = firebase.firestore()
        //         .collection('questions')
        //         .doc(id).collection('replies').get().then((doc) => {
        //             if (doc.docs[0] !== undefined) {
        //                 console.log(doc.docs[i].data().title)
        //             }
        //         }
        //         )
        //     let b = firebase.firestore()
        //         .collection('questions')
        //         .doc(id).collection('replies').get().then((doc) => {
        //             if (doc.docs[0] !== undefined) {
        //                 console.log(doc.docs[i].data().author)
        //             }
        //         }
        //         )
        //     let c = firebase.firestore()
        //         .collection('questions')
        //         .doc(id).collection('replies').get().then((doc) => {
        //             if (doc.docs[0] !== undefined) {
        //                 console.log(doc.docs[i].data().time)
        //             }
        //         }
        //         )
        //     let d = firebase.firestore()
        //         .collection('questions')
        //         .doc(id).collection('replies').get().then((doc) => {
        //             if (doc.docs[0] !== undefined) {
        //                 console.log(doc.docs[i].data().upvotes)
        //             }
        //         }
        //         )
        // }
    }

    getImgUrl() {
        return this.img_url
    }

    getId() {
        return this.id
    }

    addAnswer(answerText, user) {
        let answer = new Answer(answerText, user)
        this.answers.push(answer)
        this.answers.append(answer)
    }
    upvote() {
        this.upvotes += 1;
    }
    downvote() {
        this.upvotes -= 1;
    }
    getUpvotes() {
        return this.upvotes
    }
    getText() {
        return this.questionText
    }
    getUsername() {
        return this.user.displayName;
    }
    getUser() {
        return this.user
    }
    getTags() {
        return this.tags
    }
    click() {
        this.isClicked = (this.isClicked === true ? false : true)
    }
    reply() {
        this.isReplying = (this.isReplying === true ? false : true)
    }
    getReplying() {
        return this.isReplying
    }
    replyInner() {
        this.isReplyingInner = (this.isReplyingInner === true ? false : true)
    }
    getReplyingInner() {
        return this.isReplyingInner
    }

    getClicked() {
        return this.isClicked
    }
    getTime() {
        return this.time
    }
    getFirstAnswer() {
        //answer contructor
        //answerText, user, time, id, upvotes=0, tags=null
        let topAns = new Answer("There are no answers to this question yet", "bot", this.getTime(), 0, null)

        if (this.answers.length === 0) {
            return topAns
        }
        else {
            let topVoted = this.answers[0].getUpvotes();
            let topAnswer = this.answers[0];
            for (let i = 0; i < this.answers.length; i++) {
                if (this.answers[i].getUpvotes() > topVoted) {
                    topAnswer = this.answers[i];
                    topVoted = this.answers[i].getUpvotes()
                }
            }

            return topAnswer;
        }
    }
    getAllAnswers() {
        return this.answers;
    }
}