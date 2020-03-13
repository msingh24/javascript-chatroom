class Chatroom {
    constructor(room, username){
        this.room = room;
        this.username = username;
        this.chats = db.collection('chats');
        this.unsub;
    }
    async addchat(message){
        // format a chat object
        const now = new Date();
        const chat = {
            message: message,
            username: this.username,
            room: this.room,
            created_at: firebase.firestore.Timestamp.fromDate(now)
        };
        // save the chat document
        const response = await this.chats.add(chat);
        return response;
    }
    
    getChats(callback){
       this.unsub = this.chats
        // room is equal to the room selected
         .where('room', '==', this.room)
        //  orders by the created time
         .orderBy('created_at')
         .onSnapshot(snapshot => {
             snapshot.docChanges().forEach(change => {
                 if(change.type === 'added'){
                    //  update the ui
                    callback(change.doc.data());
                 }
             });
         });
    }
    updateName(username){
        this.username = username;
        localStorage.setItem('username', username);
    }

    updateRoom(room){
        this.room = room;
        console.log('room updated');
        if(this.unsub){
           this.unsub(); 
        }
    }
}




