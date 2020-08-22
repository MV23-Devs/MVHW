export default class Meeting {
    constructor(uidOfRequest, username, time, day, tutorChosen, subject) {
        
        this.uidOfRequest = uidOfRequest
        this.username = username;
        this.time = time;
        this.uid = uid;
        this.tutorChosen = tutorChosen;
        this.subject = subject
        this.day = day
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