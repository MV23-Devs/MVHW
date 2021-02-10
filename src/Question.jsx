import Answer from './screens/Answer.jsx'

//code

export default class Question {
    constructor(doc) {
        console.log("doc", doc)
        console.log("data", doc.data())
        //questionText, user, time, id, upvotes = 0, tags = null, img_url = "", name
        this.questionText = doc.data().title
        this.user = JSON.parse(doc.data().auth)
        this.date = new Date(doc.data().time);
        this.time = doc.data().time
        this.id = doc.id;
        this.upvotes = doc.data().usersUpvoted.length - doc.data().usersDownvoted.length;
        this.tags = doc.data().tags;
        this.img_url = doc.data().img_url;
        this.name = doc.data().username

        this.isReplying = false;
        this.isReplyingInner = false;
        this.answers = [];
        this.answersRaw = 0;
        this.isClicked = false;
        
    }

    hasUpvoted(uid) {
        return uid in this.usersUpvoted ? true : false;
    }

    getImgUrl() {
        return this.img_url
    }

    getId() {
        return this.id
    }

    addAnswer(answerText, user, username, time, id, uid) {
        let answer = new Answer(answerText, user, username, time, id, uid)
        this.answers.push(answer)
    }
    removeAnswer(id) {
        for (let i = 0; i < this.answers.length; i++) {
            if (this.answers[i].getId() === id) {
                this.answers.splice(i, 1);
            }
        }
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
        return this.isReplyingInner;
    }

    getClicked() {
        return this.isClicked;
    }
    getDate() {
        return this.date;
    }
    getTimeMilliseconds(){
        return this.time;
    }
    getTimeStamp() {
        return "" + (this.date.getMonth() + 1) + "/" + this.date.getDate() + "/" + this.date.getFullYear();

    }
    getFirstAnswer() {
        let topAns = new Answer("There are no answers to this question yet", "bot", "bot", this.getDate(), 0, null)

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
            return this.answers[0]
        }
    }
    getAllAnswers() {
        return this.answers;
    }
}