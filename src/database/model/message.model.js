import mongoose, { Types } from "mongoose";

const messageschema = new mongoose.Schema({
    content:{
        type:String,
        require:true
    },
    images:{
        type:String
    },
   receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
}
})
const Message_Model = mongoose.model("message", messageschema)
export default Message_Model