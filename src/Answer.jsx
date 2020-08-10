export default class Answer {
    constructor(questionText, user, time, id, upvotes = 0) {
        this.answerText = questionText
        this.user = user
        this.id = id
        this.upvotes = upvotes;
    }
    upvote() {
        this.upvotes += 1
    }
    downvote() {
        this.upvotes -= 1
    }
    getUpvotes() {
        return this.upvotes
    }
    getText() {
        return this.answerText
    }
    //getUsername() {
    //     return this.username;
    // }
    getUser() {
        return this.user
    }
}