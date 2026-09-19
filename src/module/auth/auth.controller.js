import { Router } from "express";
import { getAccessToken, login, logout, signup, signupMail, verifyAccount } from "./auth.serivce.js";
import { Success_Response } from "../../common/response/scucess.response.js";
import { generateAccessToken } from "../../common/utils/token.js";
import { validation } from "../../common/middleware/validation.js";
import { loginSchema, signupSchema } from "./auth.validation.js";
import { auth } from "../../common/middleware/auth.js";
const router = Router();

router.post("/signup", validation(signupSchema), async (req, res) => {
    let Add_User = await signup(req.body)
    Success_Response({ res, message: "User added successfully", status: 201, data: Add_User })
})

//////////////////////////////////////////////////////////////////////////////////////////////
router.post("/signup/gmail",async (req, res) => {
    console.log(req.body);
    const data = await signupMail(req.body)
    Success_Response({ res, message: "User added successfully", status: 201, data })
})
//////////////////////////////////////////////////////////////////////////////////////////////
router.post("/login", validation(loginSchema), async (req, res) => {
    let LoginUser = await login(req.body, req.get("host"))
    Success_Response({ res, message: "User is login successfully", status: 200, data: LoginUser })
})
//////////////////////////////////////////////////////////////////////////////////////////////

router.get("/get_AccessToken", async (req, res) => {
    let data = await getAccessToken(req.headers.authorization, req.get("host"))
    Success_Response({ res, message: "new access token generate", data })
})
//////////////////////////////////////////////////////////////////////////////////////////////

router.post("/verify-account", async (req, res) => {
    let userData = await verifyAccount(req.body);

    Success_Response({
        res,
        message: "user verified successfully",
        data: userData
    });
});
//////////////////////////////////////////////////////////////////////////////////////////////
router.post("/logout", auth, async (req, res) => {
    let data = await logout(req)
    Success_Response({
        res,
        message: "user verified successfully",
        data
    });
})
//////////////////////////////////////////////////////////////////////////////////////////////


export default router