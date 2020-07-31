import Answer from './Answer.jsx'

export default class Question {
    constructor(questionText, user, time, id, upvotes=0, tags=null){
        this.questionText = questionText
        this.isReplying = false;
        this.isReplyingInner = false;
        this.user = user
        this.id = id
        this.upvotes = upvotes;
        this.answers = [new Answer("no answers to this question yet", "bot"), new Answer("test test", "yeet")]
        this.tags = tags;
        this.isClicked = false;
        this.time = time
    }

    getId() {
        return this.id
    }

    addAnswer(answerText, user){
        let answer = new Answer(answerText, user)
        this.answers.push(answer)
        this.answers.append(answer)
    }
    upvote(){
        this.upvotes+=1;
    }
    downvote(){
        this.upvotes-=1;
    }
    getUpvotes(){
        return this.upvotes
    }
    getText(){
        return this.questionText
    }
    getUser(){
        return this.user
    }
    getTags(){
        return this.tags
    }
    click(){
        this.isClicked = (this.isClicked === true ? false : true)
    }
    reply(){
        this.isReplying = (this.isReplying === true ? false : true)
    }
    getReplying() {
        return this.isReplying
    }
    replyInner(){
        this.isReplyingInner = (this.isReplyingInner === true ? false : true)
    }
    getReplyingInner() {
        return this.isReplyingInner
    }

    getClicked() {
        return this.isClicked
    }
    getTime(){
        return this.time
    }
    getFirstAnswer() {
        return this.answers[0]
    }
}