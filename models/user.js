
import mongoose from "mongoose";
import { hash } from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    onlineStatus: {
        type: String,
        enum: ['AVAILABLE', 'BUSY'],
        default: 'AVAILABLE',
      },
  },
  {
    timestamps: true,
  }
);


userSchema.pre("save",async function(next){
  // if password is not modified then don't hash it again and again 
  if(!this.isModified("password")){
    return next();
  }
  this.password= await hash(this.password, 10);
})

const User = mongoose.model("User", userSchema);
export default User;
