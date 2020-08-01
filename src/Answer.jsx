export default class Answer {
    constructor(answerText, username, user){
        this.answerText = answerText
        this.username = username;
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
    getUsername() {
        return this.username;
    }
    getUser(){
        return this.user
    }
}