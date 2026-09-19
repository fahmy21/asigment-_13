import { Bad_Request_Exception, conflict_Exaception, Not_Found_Exception } from "../../common/response/response.error.js"
import User_Model from "../../database/model/user.model.js"
import { Compare_Data, Hash_Data } from "../../common/utils/generatehash.js"
import { Generate_Token, generateAccessToken } from "../../common/utils/token.js"
import { sendemail } from "../../common/utils/sendemail.js"
import { Encrypt_Data } from "../../common/utils/encryption.js"
import { createRevokeToken, get, redis_delete, set } from "../../database/redis.serivce.js"
import { hash } from "bcrypt"
import { auth } from "../../common/middleware/auth.js"
import { OAuth2Client } from "google-auth-library";

//////////////////////////////////////////////////////////////////////////////////////////////

export const signupMail = async (body) => {
    const client = new OAuth2Client();

    const ticket = await client.verifyIdToken({
        idToken: body.idToken,
        audience: process.env.google_clint_id
    });

    const payload = ticket.getPayload()
    console.log(payload);

    if (!payload.email_verified) {
        throw new Bad_Request_Exception({ message: "email not verified" })
    }
    let { email, name } = payload
    let addUser = await User_Model.findOne({ email })
    if (addUser) {
        throw new conflict_Exaception({ message: "email already exist" })
    }
    else {
        let addUser = await User_Model.insertOne({
            provider: "google",
            name,
            email,
            isVerified: true
        });
        if(addUser){
            return({message:"user added successfully"})
        }
        else{
            return({message:"something went wrong"})
        }
    }
};

//////////////////////////////////////////////////////////////////////////////////////////////

export const signup = async (data) => {
    let { name, email, password, Unique_Acc_Name, phone } = data

    let existuser = await User_Model.findOne({ email })
    if (existuser) {
        conflict_Exaception({ message: "user already exsist" })
    }
    let encryptedpassword = await Hash_Data(password)
    const otp = Math.floor(100000 + Math.random() * 900000)
    const encryptedPhone = Encrypt_Data(phone);
    let addedUser = await User_Model.insertOne({
        name,
        email,
        password: encryptedpassword,
        phone: encryptedPhone,
        Unique_Acc_Name
    });

    console.log(`otp:${addedUser._id}`);
    let hash_otp = await Hash_Data(otp.toString())
    await set({
        key: `otp:${addedUser._id}`,
        value: hash_otp,
        ttl: 60 * 5
    })
    await sendemail({
        to: email,
        subject: "verify your account",
        html: `<h1>verify /${Unique_Acc_Name} verify your account , your otp is /${otp} <h1>`
    })
    return addedUser
}
//////////////////////////////////////////////////////////////////////////////////////////////

export const login = async (data, host) => {
    let { email, password } = data
    let User_Data = await User_Model.findOne({ email })
    if (!User_Data) {
        Not_Found_Exception({ message: "Email is not found" })
    }
    let Valid_Password = await Compare_Data(password, User_Data.password)
    if (!Valid_Password) {
        Bad_Request_Exception({ message: "Invalid password" })
    }
    let { access_token, refresh_token } = Generate_Token({ User_Id: User_Data._id }, host, User_Data.role)
    return { User_Data, access_token, refresh_token }
}
//////////////////////////////////////////////////////////////////////////////////////////////
export const verifyAccount = async (data) => {
    const { email, otp } = data;

    const userData = await User_Model.findOne({ email });


    if (userData.isVerified) {
        conflict_Exaception({ message: "user already verified" });
    }
    let hash_otp = await get(`otp:${userData._id}`)

    let match_otp = Compare_Data(otp, hash_otp)

    if (match_otp) {

        userData.isVerified = true;

        await userData.save();
        await redis_delete(`otp:${userData._id}`)
        return userData;
    }
    else {
        Bad_Request_Exception({ message: "invalid otp" })
    }
};
//////////////////////////////////////////////////////////////////////////////////////////////
export const logout = async (req) => {
    let redid_key = createRevokeToken({ userId: req.user, token: req.token })

    await set({
        key: redid_key,
        value: 1,
        ttl: req.decoded.iat + 30 * 60
    })
    return ({ message: "logout is succfuly" })
}
//////////////////////////////////////////////////////////////////////////////////////////////


export const getAccessToken = async (authorization, host) => {

    let accessToken = await generateAccessToken(
        authorization,
        host
    )

    return accessToken

}




/*
| الحالة                    | Status       | تستخدمها عندما                                       |
| ------------------------- | ------------ | ---------------------------------------------------- |
| `Bad_Request_Exception`   | **400**      | البيانات المرسلة غير صحيحة أو ناقصة                  |
| `UnAuthorized_Exaception` | **401**      | المستخدم غير مسجل دخول أو Token خطأ                  |
| `Forbidden_Exaception`    | **403**      | المستخدم مسجل دخول لكن ليس لديه صلاحية               |
| `Not_Found_Exception`     | **404**      | البيانات المطلوبة غير موجودة                         |
| `conflict_Exaception`     | **409**      | البيانات موجودة بالفعل (Email/Username...)           |
| `ErrorResponse`           | أي Status    | الدالة الأساسية التي ترمي الـ Error                  |
| `globle_handlin_erorr`    | يعالج الجميع | Middleware في آخر `app.js` يرسل الـ Response النهائي |
*/