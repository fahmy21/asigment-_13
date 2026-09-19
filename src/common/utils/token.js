import jwt from "jsonwebtoken";
import { env } from "../../../config/env.service.js";

export const Generate_Token = (payload, host, role) => {

    let signature = "";
    let refreshSignature = "";

    switch (role) {
        case 0:
            signature = env.jwt_key_user;
            refreshSignature = env.user_refresh_token;
            break;

        case 1:
            signature = env.jwt_key_admin;
            refreshSignature = env.admin_refresh_token;
            break;

        default:
            break;
    }

    const access_token = jwt.sign(payload, signature, {
        expiresIn: "30m",
        issuer: host,
        audience: [role]
    });

    const refresh_token = jwt.sign(payload, refreshSignature, {
        expiresIn: "1y",
        issuer: host,
        audience: [role]
    });

    return {
        access_token,
        refresh_token
    };
};

export const generateAccessToken = (refreshToken, host) => {


    const decoded = jwt.decode(refreshToken);

    let accessSignature = "";
    let refreshSignature = "";

    switch (decoded.aud[0]) {

        case 0:
            accessSignature = env.jwt_key_user;
            refreshSignature = env.user_refresh_token;
            break;

        case 1:
            accessSignature = env.jwt_key_admin;
            refreshSignature = env.admin_refresh_token;
            break;

        default:
            throw new Error("Invalid Role");
    }


    jwt.verify(refreshToken, refreshSignature);

    const payload = {
        User_Id: decoded.User_Id
    };

    const accessToken = jwt.sign(payload, accessSignature, {
        expiresIn: "30m",
        issuer: host,
        audience: [decoded.aud[0]]
    });

    return accessToken;
};