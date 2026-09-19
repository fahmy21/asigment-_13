import { Router } from "express";
import { Success_Response } from "../../common/response/scucess.response.js";
import { getUserData, grtUserDataByUname, updateUserData } from "./uesr..serivce.js";
import { auth } from "../../common/middleware/auth.js";
import { upload } from "../../common/middleware/multer.js";

const router = Router()
//////////////////////////////////////////////////////////////////////////////////////////////

router.get("/get-user-data", auth, async (req, res) => {

    let userData = await getUserData(req.user)

    Success_Response({
        res,
        message: "user data",
        data: userData
    })
})
//////////////////////////////////////////////////////////////////////////////////////////////\

router.put('/update-user-profile', auth, upload().single("coverImage"), async (req, res) => {
    console.log(req.file);
    
    let updatedUser = await updateUserData(req.user, req.body,req.file)
    Success_Response({ res, message: "Update User", data: updatedUser })
})
//////////////////////////////////////////////////////////////////////////////////////////////
router.get("/get_user_data_by_Uname/:Unique_Acc_Name",async(req,res)=>{
    let data=await grtUserDataByUname(req.params)
    Success_Response({ res, message: "Update User", data })

})
//////////////////////////////////////////////////////////////////////////////////////////////
export default router 