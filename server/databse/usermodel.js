const mongoose=require("mongoose");

mongoose.connect(process.env.MONGO_URI)
.then((res)=>{
    console.log("mongodb is connected");
})
.catch((err)=>{
    console.log(err);
})

const userschema=mongoose.Schema({
    name:{
        type:String,
        require:[true,'provide name']
    },
    email:{
        type:String,
        require:[true,'provide email'],
        unique:true
    },
    password:{
        type:String,
        require:[true,'provide password']
    },
    mobile:{
        type:Number,
        default:null
    },
    addressdetails: [
        {
          street: { type: String, required: true },
          city: { type: String, required: true },
          state: { type: String, required: true },
          district: { type: String, required: true },
          mandel: { type: String, required: true },
          postalCode: { type: String, required: true },
          phoneNumber:{type:Number,required:true}
        },
      ],
        shoppingcart:[
            {
                type:mongoose.Schema.ObjectId,
                ref:"products"
            }
        ],
        orderhistory:[
            {
                type:mongoose.Schema.ObjectId,
                ref:"orders"
            }
        ],
        role:{
            type:String,
            enum:["admin","user"],
            default:"user"
        },
        status:{
            type:String,
            enum:['active','suspended'],
            default:'active'
        }
        
},{timestamps:true})

const usermodel=new mongoose.model("user",userschema);

module.exports=usermodel;