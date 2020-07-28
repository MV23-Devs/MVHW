export default class Answer {
    constructor(answerText, user){
        this.answerText = answerText
        this.user = user
        this.upvotes = 0
    }
    upvote(){
        this.upvotes+=1
    }
    downvote(){
        this.upvotes-=1
    }
    getUpvotes(){
        return this.upvotes
    }
    getText(){
        return this.answerText
    }
    getUser(){
        return this.user
    }
}