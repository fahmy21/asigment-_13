import Joi from "joi"
import { Bad_Request_Exception } from "../response/response.error.js";

export const validation = (Schema) => {
    return (req, res, next) => {
        let { value, error } = Schema.validate(req.body, {
            abortEarly: false
        });

        console.log(value, error);
        
        //////////////////////////////////////////////////////////////////////////////
        if (error) {
            Bad_Request_Exception({ message: "Validation error", extra: error })
        }
        //////////////////////////////////////////////////////////////////////////////

        next()
    }
}










