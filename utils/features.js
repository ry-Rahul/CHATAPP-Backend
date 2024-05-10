import mongoose from "mongoose"


const connectDb = (uri)=>{
    mongoose.connect(uri,{
        dbName: "HirequotientChat",
    }).then((data)=>{
        console.log(`Connected to the database ${data.connection.host}`);
    }).catch((err)=>{
        console.log("Error connecting to the database", err);
    });

}

export default connectDb;