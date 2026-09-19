import CryptoJS from "crypto-js";
import { env } from "../../../config/env.service.js";

export const Encrypt_Data = (data) => {
    return CryptoJS.AES.encrypt(
        data,
        env.encryption_key
    ).toString();
};

export const Decrypt_Data = (data) => {
    return CryptoJS.AES.decrypt(
        data,
        env.encryption_key
    ).toString(CryptoJS.enc.Utf8);
};