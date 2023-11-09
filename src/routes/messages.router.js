import MyRouter from "./router";
import messagesController from "../controllers/messagesController";

export default class MessagesRouter extends MyRouter{
    init(){
        
        this.get('/', ['PUBLIC'], messagesController.getMessages);
        this.post('/', ['USER', 'USER_PREMIUM'], messagesController.addMessage)
    }
}