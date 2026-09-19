import Joi from "joi"

export const signupSchema = Joi.object({
        name: Joi.string().required().min(3).max(30).pattern(/^[A-Za-z\s]+$/),
        email: Joi.string().required().email(),
        password: Joi.string().min(6).required().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        Unique_Acc_Name: Joi.string().required(),
        phone: Joi.optional()
    })
    export const loginSchema = Joi.object({
    
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
      
    })