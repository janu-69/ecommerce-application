const mongoose=require('mongoose');

const subcategoryschema=mongoose.Schema({
    name:{
        type:String,
    },
    image:{
        type:String,
    },
    category:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"category"
        }
    ]
},{timestamps:true})


const subcategorymodel=new mongoose.model("subcategory",subcategoryschema);

module.exports=subcategorymodel