import { env } from "../../../config/env.service.js";
import { Bad_Request_Exception, Not_Found_Exception } from "../../common/response/response.error.js";
import Message_Model from "../../database/model/message.model.js"
import User_Model from "../../database/model/user.model.js"

export const sendMessage = async (data, file) => {
    const { receiverId, content } = data;

    const existedUser = await User_Model.findById(receiverId);

    if (!existedUser) {
        throw new Not_Found_Exception({
            message: "User not found"
        });
    }
    const image = ''
    if (file) {
        image = `${env.server_URL}/uploads/${file.filename}`
    }
    const addedMessage = await Message_Model.insertOne({
        receiverId,
        content,
        image
    });

    if (!addedMessage) {
        throw new Bad_Request_Exception({
            message: "Something went wrong"
        });
    }

    return addedMessage;
};
//////////////////////////////////////////////////////////////////////////////////////////////

export const getAllMessages = async (userId) => {
    let messagesData = await Message_Model.find({ receiverId: userId })
    if (messagesData.length > 0) {
        return messagesData
    } else {
        throw new Bad_Request_Exception({ message: "no messages found" })
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////

export const deleteMessage = async (userId, messageId) => {
    let deletedMessage = await Message_Model.deleteOne({ _id: messageId, receiverId: userId })
    if (!deletedMessage) {
        throw new Bad_Request_Exception({ message: "message not found or you are not the owner" })
    }
    return { message: "message deleted successfully" }
}