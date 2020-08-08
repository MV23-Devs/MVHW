export default class Answer {
    constructor(answerText, user, time, id, upvotes=0, tags=null){
        this.answerText = answerText
        //this.username = username;
        this.user = user
        this.upvotes = upvotes;
        this.isReplying = false;
        this.isReplyingInner = false;
        this.id = id;
        this.answers = [];
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
    //getUsername() {
    //     return this.username;
    // }
    getUser(){
        return this.user
    }
}