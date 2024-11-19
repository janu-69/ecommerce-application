const mongoose=require("mongoose");

const adminschema=mongoose.Schema({
    name:{
        type:String,
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

        role:{
            type:String,
            enum:["admin","user"],
            default:"admin"
        },
        products:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"products"
            }
        ]
},{timestamps:true})

const adminmodel=new mongoose.model("admin",adminschema);

module.exports=adminmodel;