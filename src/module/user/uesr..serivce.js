import { env } from "../../../config/env.service.js"
import { conflict_Exaception, Not_Found_Exception } from "../../common/response/response.error.js"
import { Compare_Data, Hash_Data } from "../../common/utils/generatehash.js"
import User_Model from "../../database/model/user.model.js"
//////////////////////////////////////////////////////////////////////////////////////////////

export const getUserData = async (userId) => {

    let userData = await User_Model.findById(userId)

    if (!userData) {
        Not_Found_Exception({
            message: "user not found"
        })
    }

    return userData
}
//////////////////////////////////////////////////////////////////////////////////////////////
export const updateUserData = async (userId, data, file) => {

    let { name, password, uniqueAccName, newPassword } = data;

    const userData = await User_Model.findById(userId);

    if (!userData) {
        Not_Found_Exception({ message: "User not found" });
    }

    if (uniqueAccName) {
        const existUniqueAccName = await User_Model.findOne({
            uniqueAccName,
            _id: { $ne: userId }
        });

        if (existUniqueAccName) {
            conflict_Exaception({ message: "user already exist" });
        }
    }
    let updateData = {};
    let imageField = ""
    if (file) {
        imageField = `${env.server_URL}/${file.path}`;
        updateData.profilePicture = imageField;
    }

    

    if (name) {
        updateData.name = name;
    }

    if (uniqueAccName) {
        updateData.uniqueAccName = uniqueAccName;
    }

    if (password && newPassword) {

        const comparedPassword = Compare_Data(password, userData.password);

        if (!comparedPassword) {
            Bad_Request_Exception({ message: "Current password is incorrect" });
        }

        updateData.password = Hash_Data(newPassword);
    }

    const updatedUser = await User_Model.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
    );

    return updatedUser;
};

//////////////////////////////////////////////////////////////////////////////////////////////

export const grtUserDataByUname=async(params)=>{
    let {Unique_Acc_Name}=params
     let userData = await User_Model.findById(Unique_Acc_Name)

    if (!userData) {
        Not_Found_Exception({
            message: "user not found"
        })
    }

    return userData
}