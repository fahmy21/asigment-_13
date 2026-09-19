import { Router } from "express";
import { deleteMessage, getAllMessages, sendMessage } from "./message.serivce.js";
import { Success_Response } from "../../common/response/scucess.response.js"
import { auth } from "../../common/middleware/auth.js";
import { upload } from "../../common/middleware/multer.js";
const router = Router()

//////////////////////////////////////////////////////////////////////////////////////////////
router.post("/send_message",upload().single("Image"), async (req, ers) => {
    let data = await sendMessage(req.body,req.file)
    Success_Response({ res, message: "Send Message", status: 201, data })
})
//////////////////////////////////////////////////////////////////////////////////////////////
router.get('/get-all-messages', auth, async (req, res) => {
    let messagesData = await getAllMessages(req.user)
    Success_Response({ res, message: "messages retrieved", data: messagesData })
})
//////////////////////////////////////////////////////////////////////////////////////////////

router.delete('/delete-message/:messageId', auth, async (req, res) => {
    let data = await deleteMessage(req.user, req.params.messageId)
    Success_Response({ res, message: "message deleted", data })
})
//////////////////////////////////////////////////////////////////////////////////////////////


export default router