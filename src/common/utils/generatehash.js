import bcrypt from "bcrypt"
import { env } from "../../../config/env.service.js"

export const Hash_Data = async (data) => {
    let bcrypt_data = await bcrypt.hash(data, + env.salt)
    return bcrypt_data
}
export const Compare_Data = async (plaintext, cyphertext) => {
    let is_valid = await bcrypt.compare(plaintext, cyphertext)
    return is_valid
} 