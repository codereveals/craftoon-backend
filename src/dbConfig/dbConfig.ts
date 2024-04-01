import mongoose from "mongoose";

export async function connection() {
    try {
        mongoose.connect(process.env.MONGO_URL!)
        const connection = mongoose.connection;
        connection.on("connected", () => {
            console.log("mongodb connected!");
        })
        connection.on("error", (err) => {
            console.log("connection error", err);
            process.exit();

        })

    } catch (error) {
        console.log("something went wrong in db");
        console.log(error);


    }
}