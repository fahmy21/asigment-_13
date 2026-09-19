import jwt from "jsonwebtoken";
import { env } from "../../../config/env.service.js";

export const auth = (req, res, next) => {

    let { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({
            message: "Authorization header is missing"
        });
    }

    let token = authorization.split(" ")[1];

    let decodedData = jwt.decode(token);

    if (!decodedData) {
        return res.status(401).json({
            message: "Invalid Token"
        });
    }

    let signature = "";

    switch (decodedData.aud[0]) {
        case 0:
            signature = env.jwt_key_user;
            break;

        case 1:
            signature = env.jwt_key_admin;
            break;

        default:
            return res.status(401).json({
                message: "Invalid Audience"
            });
    }

    let decoded = jwt.verify(token, signature);

    req.user = decoded.User_Id;
    req.decoded=decoded
    req.token=token

    next();
}
