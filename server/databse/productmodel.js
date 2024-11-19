const mongoose=require('mongoose');

const productschema=mongoose.Schema({
    name:{
        type:String,
    },
    image:{
        type:String,
    },
    category:{
        type:String,
    },
    type:{
        type:String,
    },
    stock:{
        type:Number,
    },
    old_price:{
        type:Number,
    },
    new_price:{
        type:Number,
    },
    discount:{
        type:Number,
    },
    description:{
        type:String,
    },
    moredetails:{
        type:String,
    },
    seller:[{
       type:mongoose.Schema.Types.ObjectId,
        ref:"admin"
    }],
},{timestamps:true})

const productmodel=new mongoose.model("products",productschema);

module.exports=productmodel;