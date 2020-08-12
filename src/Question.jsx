import Answer from './Answer.jsx'
import firebase from './firebase.js';


export default class Question {
    constructor(questionText, user, time, id, upvotes = 0, tags = null, img_url = "", name) {
        this.questionText = questionText
        this.img_url = img_url;
        this.isReplying = false;
        this.isReplyingInner = false;
        this.user = user
        this.name = name
        this.id = id
        this.upvotes = upvotes;
        this.answers = [];
        // this.usersUpvoted = usersUpvoted;
        this.answersRaw = 0;
        let len = 100;
        this.tags = tags;
        this.isClicked = false;
        this.time = time

        // firebase.firestore()
        //     .collection('questions')
        //     .doc(id).collection('replies')
        //     .get().then((doc) => {
        //         len = doc.docs.length
        //     }).then(() => {

        //         for (let i = 0; i < len; i++) {
        //             let aTitle;
        //             let aUser;
        //             let aId;
        //             let aUp;
        //             let aTime;
        //             firebase.firestore()
        //                 .collection('questions')
        //                 .doc(id).collection('replies')
        //                 .get().then((doc) => {
        //                     if (doc.docs[0] !== undefined) {
        //                         aTitle = (doc.docs[0].data().title)
        //                         aUser = "pls fix"
        //                         aId = (doc.docs[0].data().author)
        //                         aUp = (doc.docs[0].data().aUp)
        //                         aUser = JSON.parse(aId).displayName
        //                         aTime = "?"
        //                     }
        //                 }).then(() => {
        //                     this.answers.push(new Answer(aTitle, aUser, aTime, aId, aUp, null))
        //                 })

        //             //console.log(this.answers[this.answers.length - 1])




        //             //answerText, user, time, id, upvotes=0, tags=null



        //         }
        //     })

        
        // firebase.firestore().collection("questions").doc(this.id).collection("replies").get().then(querySnapshot => {
        //     querySnapshot.docs.forEach(doc => {
        //         this.answers.push(new Answer(doc.data().title, JSON.parse(doc.data().author), doc.data().timestamp, doc.id, doc.data().upvotes))
        //     })
        // })




    }

    hasUpvoted(uid){
        return uid in this.usersUpvoted ? true : false;
    }

    getImgUrl() {
        return this.img_url
    }

    getId() {
        return this.id
    }

    addAnswer(answerText, user, time, id,) {
        let answer = new Answer(answerText, user, time, id)
        this.answers.push(answer)
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
        return this.name;
    }
    getUser() {
        return this.user
    }
    getTags() {
        return this.tags
    }
    click() {
        this.isClicked = !this.isClicked;
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
        let topAns = new Answer("There are no answers to this question yet", "bot", "bot", this.getTime(), 0, null)

        if (this.answers.length === 0) {
            return topAns
        }
        else {
            let topVoted = this.answers[0].getUpvotes();
            let topAnswer = this.answers[0];
            for (let i = 0; i < this.answers.length; i++) {
                if (this.answers[i].getUpvotes() > topVoted) {
                    topAnswer = i;
                    console.log("topAns: " + topAnswer)
                    topVoted = this.answers[i].getUpvotes()
                }



            }
            //console.log(this.answers[0])
            return this.answers[0]
        }
    }
    getAllAnswers() {
        return this.answers;
    }
}