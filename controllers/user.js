import User from "../models/user.js";

// create a new user and save it in cookie and database
const newUser = async (req, res) => {

    const {name, password, email} = req.body;
    console.log(name, password, email);

    // await User.create({
    //     name:"rahul", 
    //     password:"1234",
    //     email: "abc@gmail.com", 
    // })
 
    res.status(201).json({
        message: "user created",
    }); 

};
const login = (req, res) => {
  res.send("login route");
};

export { login, newUser };
