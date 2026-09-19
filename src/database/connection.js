
import mongoose from "mongoose"

export const Database_Connection = () => {

    mongoose.connect("mongodb://localhost:27017/sara7aAppC46")
        .then(() => {
            console.log("database connected");
        })
        .catch((err) => {
            console.log("database connection error", err);
        })

}