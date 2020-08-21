export default class Meeting {
    constructor(questionText, user, username, time, id, uid) {
        this.answerText = questionText
        this.user = user;
        this.username = username;
        this.time = time;
        this.id = id;
        this.uid = uid;
    }
    getUpvotes() {
        return this.upvotes
    }
    getText() {
        return this.answerText
    }
    getUsername() {
        return this.username;
    }
    getUser() {
        return this.user
    }
    getId() {
        return this.id
    }
    getUid() {
        return this.uid
    }
}