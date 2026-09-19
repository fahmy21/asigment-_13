import { env } from "../../../config/env.service.js"

export const ErrorResponse = ({
   status = 400,
   message = "Something went wrong",
   extra = undefined
} = {}) => {

   throw new Error(message, {
      cause: { status, extra }
   })
}
/////////////////////////////////////////////
export const Bad_Request_Exception = ({
   message = "Bad request",
   extra = undefined
} = {}) => {

   return ErrorResponse({
      status: 400,
      message: message,
      extra: extra
   })

}
/////////////////////////////////////////////////////////////////
export const Not_Found_Exception = ({
   message = "Not Found Error",
   extra = undefined
} = {}) => {

   return ErrorResponse({
      status: 404,
      message: message,
      extra: extra
   })

}
/////////////////////////////////////////////////////////////////
export const conflict_Exaception = ({
   message = "conflict Error",
   extra = undefined
} = {}) => {

   return ErrorResponse({
      status: 409,
      message: message,
      extra: extra
   })

}
/////////////////////////////////////////////////////////////////
export const UnAuthorized_Exaception = ({
   message = "UnAuthorized Error",
   extra = undefined
} = {}) => {

   return ErrorResponse({
      status: 401,
      message: message,
      extra: extra
   })

}
/////////////////////////////////////////////////////////////////
export const Forbidden_Exaception = ({
   message = "Forbidden Error",
   extra = undefined
} = {}) => {

   return ErrorResponse({
      status: 403,
      message: message,
      extra: extra
   })

}
/////////////////////////////////////////////////////////////////

export const globle_handlin_erorr = (err, req, res, next) => {

   const status = err.cause ? err.cause.status : 500


   const mood = env.mood == "dev"

   const deafultMessage = "something went wrong"

   const displayErrorMessage = err.message || deafultMessage

   res.status(status).json({
      stack: mood ? err.stack : null,
      message: mood ? displayErrorMessage : deafultMessage,
      extra: mood ? err.cause : null
   })
}