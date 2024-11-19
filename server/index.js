const express=require("express");
require('dotenv').config();
const usermodel=require('./databse/usermodel.js');
const adminmodel=require('./databse/adminmodel.js');
const productmodel=require('./databse/productmodel.js');
const ordermodel=require('./databse/ordermodel.js');
const cookieparser=require("cookie-parser");
const bcrypt=require("bcrypt");
const jwt=require('jsonwebtoken');
const cors=require('cors');
const multer=require('multer')
const path=require('path');



const app=express();

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads');
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname + "_" + Date.now() + (Math.random()*5) + path.extname(file.originalname))
    }
})

const upload =multer({
    storage:storage
});

app.use(express.json());
app.use(cookieparser());
app.use(express.static('uploads'))
app.use(cors({
    origin:"http://localhost:5173",
}));
app.use(express.urlencoded({extended:false}));
const port=process.env.PORT 


/* middlewares*/

const adminauth=async(req,res,next)=>{
    try {
        if(!req.headers.token){
            return res.status(403).send({message:"token missing"});
        }

        const token=req.headers.token;
    const dass=jwt.verify(token,process.env.API_SECRET_KEY)



    if(!dass){
        return res.send({message:'something went wrong'});
    }
    const data=await adminmodel.findOne({email:dass.email})

    if(data){
        next();
    }
    else{
        return res.send({message:"something went wrong at auth"});
    }
        
        
    } catch (error) {
   return res.status(500).send({message:"unauthorised user"})
        
    }
}




const userauth=async(req,res,next)=>{
    try {
        if(!req.headers.token){
            return res.status(403).send({message:"token missing"});
        }
        

        const token=req.headers.token;
        const dass=jwt.verify(token,process.env.API_SECRET_KEY)


        if(!dass){
            return res.send({message:'something went wrong'});
        }
        const data=await usermodel.findOne({email:dass.email})
        if(data){
            next();
        }
        else{
            return res.send({message:"something went wrong at auth"});
        }
        
    } catch (error) {
        return res.status(500).send({message:"unauthorised user"})
    }
}

/* middlewares */

app.post('/api/adminsignup',async(req,res)=>{
    const {name,email,password,mobile}=req.body;
    const decode=await adminmodel.findOne({email:email})
    if(decode){
       return res.json({message:'admin already exist'}) ;
    }
  if(!name || !email || !password || !mobile){
    return res.send({message:"please fill the details" , success:false});
    }
    else{
        bcrypt.genSalt(10,function(err,salt){
            bcrypt.hash(password,salt,async function(err,hash) {
                const admindata=await adminmodel.create({
                    name,
                    email,
                    password:hash,
                    mobile
                })
                if(admindata){
                  return res.send({message:'admin created',status:200});
                }
                
            })
        })
    }
  
})


app.post('/api/userlogin',async(req,res)=>{
    const {email,password}=req.body;
    const pass=await usermodel.findOne({email:email})
    if(!email || !password){
        return res.send({message:"please enter email and password"})
    }
    if(pass){
        bcrypt.compare(password,pass.password,(err,result)=>{
            if(result){
            const token=jwt.sign({email,password},process.env.API_SECRET_KEY,{expiresIn:"1h"});
             res.send({message:"login successfull",token:token,user:pass.name,role:pass.role});
            }
           if(!result){
            return res.send({message:"incorrect credentials"});
           }
        })
    }
    else{
        res.send({message:"invalid credentials"});
    }
})

app.post('/api/usersignup',async(req,res)=>{
    const {name,email,password,mobile}=req.body;
    const decode=await usermodel.findOne({email:email})
    if(decode){
       return res.json({message:'user already exist'}) ;
    }
  if(!name || !email || !password || !mobile){
    return res.send({message:"please fill the details" , success:false});
    }
    else{
        bcrypt.genSalt(10,function(err,salt){
            bcrypt.hash(password,salt,async function(err,hash) {
                const userdata=await usermodel.create({
                    name,
                    email,
                    password:hash,
                    mobile
                })
                if(userdata){
                  return res.send({message:'user created',status:200});
                }
                
            })
        })
    }
  
})


app.post('/api/adminlogin',async(req,res)=>{
    console.log(req.body)
    const {email,password}=req.body;
    const pass=await adminmodel.findOne({email:email})
    console.log(pass)
    if(!email || !password){
        return res.send({message:"please enter email and password"})
    }
    if(pass){
        bcrypt.compare(password,pass.password,(err,result)=>{
            if(result){
            const token=jwt.sign({email,password},process.env.API_SECRET_KEY,{expiresIn:"1h"});
             res.send({message:"login successfull",token:token,seller:pass._id,role:pass.role});
            }
           if(!result){
            return res.send({message:"incorrect credentials"});
           }
        })
    }
    else{
        res.send({message:"invalid credentials"});
    }

})




app.post("/api/addproducts",adminauth,upload.single("image"),async(req,res)=>{
    const {name,type,category,discount,description,moredetails,old_price,new_price,stock,sellerid}=req.body;
    const image=req.file.filename;
    if(!name || !description || !image || !stock){
        return res.send({message:"please fill all the details hgvag"})
    }
    else{
        const product=await productmodel.create({
            image,
            name,
            type,
            category,
            description,
            discount,
            moredetails,
            old_price,
            new_price,
            stock,
        })
        await product.seller.push(sellerid);
        product.save();
        const admin=await adminmodel.findOne({_id:sellerid})
        await admin.products.push(product._id);
        admin.save();
        if(product){
            return res.send({message:"product created successfully"});
        }
        else{
            return res.send({message:'something went wrong while creating'});
        }
    }
})

app.post("/api/showproducts",adminauth,async(req,res)=>{
    const {sellerid}=req.body;
    const product=await productmodel.find({seller:[sellerid]});
    if(!product){
        return res.send('no data found');
    }
    else{
        return res.send({message:"data found",products:product,status:200});
    }

})

app.post("/api/updateproducts",adminauth,async(req,res)=>{
    let newdata={}

    if(req.file){
        newdata['image']=req.file.filename;
    }
    
    if(req.body.name){
        newdata['name']=req.body.name;
    }
    
    if(req.body.type){
        newdata['type']=req.body.type;
    }
    if(req.body.category){
        newdata['category']=req.body.category;
    }
    if(req.body.discount){
        newdata['discount']=req.body.discount;
    }
    if(req.body.moredetails){
        newdata['moredetails']=req.body.moredetails;
    }
    
    if(req.body.description){
        newdata['description']=req.body.description;
    }
    
    if(req.body.old_price){
        newdata['old_price']=req.body.old_price;
    }

    if(req.body.new_price){
        newdata['new_price']=req.body.new_price;
    }

    if(req.body.stock){
        newdata['stock']=req.body.stock;
    }


    let doc=await productmodel.findByIdAndUpdate(req.body.id,newdata,{new:true});
    if(doc){
       return res.send("success");

    }
    else{
        return res.send("not updated");
    }

    
})
app.get("/api/editproducts/:id",adminauth,async(req,res)=>{
    const product=await productmodel.findOne({_id:req.params.id})
    if(product){
        return res.send({message:'data',product:product});
    }
})

app.post("/api/deleteproducts",adminauth,async(req,res)=>{
    const deleteid=req.body;
    const products=await productmodel.deleteMany({_id:{$in : deleteid}});
    if(products){
        res.send({message:"deleted"});
    }
    else{
        res.send({message:'not deleted'})
    }
})

app.get("/api/allproducts",userauth,async(req,res)=>{
    const products=await productmodel.find();
    if(products){
        return res.send({message:'products fetched',products:products})
    }
    else{
        return res.send({message:"something went wrong while fetching"})
    }
})

app.post("/api/getproductdetails",userauth,async(req,res)=>{
    const id=req.body.id;
    const data=await productmodel.find({_id:id})
    if(data){
        return res.send({data:data,message:"fetched"})
    }
    else{
        return res.send("failed");
    }
})

app.post("/api/cartproducts",userauth, async (req, res) => {
    try {
        const token = req.body.token;
        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }

        const decodedToken = jwt.verify(token, process.env.API_SECRET_KEY);
        const user = await usermodel.findOne({ email: decodedToken.email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!req.body.productids || !Array.isArray(req.body.productids) || req.body.productids.length === 0) {
            return res.status(400).json({ message: "No product IDs provided" });
        }

        const products = await productmodel.find({ '_id': { $in: req.body.productids } });
        const validProductIds = products.map(product => product._id.toString());
        const invalidProductIds = req.body.productids.filter(productid => !validProductIds.includes(productid));

        if (invalidProductIds.length > 0) {
            return res.status(400).json({
                message: `The following product IDs are invalid or not found: ${invalidProductIds.join(', ')}`
            });
        }

        const existingProductIds = user.shoppingcart || [];
        const newProductIds = req.body.productids.filter(productid => !existingProductIds.includes(productid));

        if (newProductIds.length === 0) {
            return res.status(200).json({ message: "No new products to add. They are already in the cart." });
        }

        user.shoppingcart.push(...newProductIds);
        await user.save();

        return res.status(200).json({
            message: `${newProductIds.length} products successfully added to the cart.`,
            addedProductIds: newProductIds
        });
    } catch (err) {
        console.error("Error adding products to cart:", err);
        return res.status(500).json({ message: "Failed to add products to cart.", error: err.message });
    }
});


app.post('/api/cartdetails',userauth,async(req,res)=>{
    const token = req.body.token;
        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }

        const decodedToken = jwt.verify(token, process.env.API_SECRET_KEY);
        const user = await usermodel.findOne({ email: decodedToken.email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if(user){
          return res.send({message:"cart details fetched",cart:user.shoppingcart})
        }
        else{
            return res.send({message:'something went wrong at cart'})
        }

})

app.post("/api/finaldetails",userauth,async (req, res) => {
    const token = req.body.token;
  
    if (!token) {
      return res.send({ message: "Token is required" });
    }
  
    try {
      const decodedToken = jwt.verify(token, process.env.API_SECRET_KEY);
    
      const user = await usermodel.findOne({ email: decodedToken.email });
      
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
  
      
      const productDetails = [];
  
      
      for (const item of user.shoppingcart) {
        const product = await productmodel.findById(item)
  
        if (product) {
          productDetails.push({
            productId: product._id,
            name: product.name,
            image: product.image,
            category: product.category,
            type: product.type,
            stock: product.stock,
            old_price: product.old_price,
            new_price: product.new_price,
            discount: product.discount,
            description: product.description,
          });
        }
      }
  

      return res.send({
        message: "Shopping cart details fetched successfully",
        products: productDetails
      });
  
    } catch (error) {
      console.error('Error fetching final details:', error);
    
      if (!res.headersSent) {
        return res.status(500).send({ message: 'Something went wrong', error: error.message });
      }
    }
  })

app.post('/api/deletecartitem',userauth,async(req,res)=>{
    const token = req.body.token;
    const id=req.body.id
    if (!token) {
        return res.status(400).json({ message: "Token is required" });
    }

    const decodedToken = jwt.verify(token, process.env.API_SECRET_KEY);
    const user = await usermodel.findOne({ email: decodedToken.email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if(user){
        const updatedUser = await usermodel.findByIdAndUpdate(
            user._id,
            { $pull: { shoppingcart: id } },
            { new: true } 
        )
        if(updatedUser){
            return res.send({message:"deleted product in cart",updatedUser})
        }
        else{
            return res.send({message:"product is not available"})
        }
    }
});
app.post('/api/add-address', userauth, async (req, res) => {
    const token=req.headers.token;
    const decodedToken = jwt.verify(token, process.env.API_SECRET_KEY);
    
      

    const { street, city, state, district, mandel, postalCode, phoneNumber } = req.body;

    try {
        if (!street || !city || !state || !district || !mandel || !postalCode || !phoneNumber) {
            return res.status(400).json({ message: 'All address fields are required' });
        }

        const user = await usermodel.findOne({ email: decodedToken.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newAddress = {
            street,
            city,
            state,
            district,
            mandel,
            postalCode,
            phoneNumber
        };

        user.addressdetails.push(newAddress);
        await user.save();

        return res.status(200).json({
            message: 'New address added successfully',
            updatedUser: user
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/orders', userauth, async (req, res) => {
    try {
      const { token, data: orderData, address, amount, paymentMethod, paymentStatus } = req.body;
  
      if (!orderData || !address || !paymentMethod) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      const decodedToken = jwt.verify(token, process.env.API_SECRET_KEY);
      const user = await usermodel.findOne({ email: decodedToken.email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const products = [];  
  
      for (const item of orderData) {
        const product = await productmodel.findById(item.productId);  
        if (!product) {
          return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({ message: `Not enough stock for product ${product.name}` });
        }
  
        const productTotal = item.quantity * product.new_price;
  
        product.stock -= item.quantity;
        await product.save();
  
        products.push({
          productId: product._id,
          productName: product.name,
          quantity: item.quantity,
          pricePerProduct: product.new_price,
          totalPrice: productTotal,
          sellerId: product.seller,  
        });
      }

      const order = new ordermodel({
        user: user._id,
        userName: user.name,
        products: products,
        totalAmount: amount,
        orderStatus: 'pending',
        shippingAddress: address,
        paymentMethod: paymentMethod,
        paymentStatus: paymentStatus || 'pending',
      });
  

      await order.save();
  
      res.status(201).json({ message: "Order placed successfully", order });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong", error: error.message });
    }
  });
  
  


app.post("/api/deleteaddress", userauth, async (req, res) => {
    const token = req.headers.token;  
    const index = req.body.index; 

    if (!token) {
        return res.status(400).send({ message: "Token is required" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.API_SECRET_KEY);
        const user = await usermodel.findOne({ email: decodedToken.email });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        if (!user.addressdetails || user.addressdetails.length === 0) {
            return res.status(400).send({ message: "No address details found for the user" });
        }
        if (index < 0 || index >= user.addressdetails.length) {
            return res.status(400).send({ message: "Invalid address index" });
        }

        user.addressdetails.splice(index, 1);
        await user.save();

        return res.status(200).send({ message: "Address deleted successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Something went wrong", error: error.message });
    }
});

app.get("/api/userdetails",userauth,async(req,res)=>{
    const token=req.headers.token;

    if (!token) {
        return res.status(400).send({ message: "Token is required" });
    }
    const decodedToken = jwt.verify(token, process.env.API_SECRET_KEY);
    const user = await usermodel.findOne({ email: decodedToken.email });
    if (!user) {
        return res.status(404).send({ message: "User not found" });
    }else{
        return res.status(200).send({message:"fetched",data:user})
    }


})


app.get('/api/orders', userauth, async (req, res) => {
    const token = req.headers.token;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }
  
    try {
      const decodedToken = jwt.verify(token, process.env.API_SECRET_KEY);
      const user = await usermodel.findOne({ email: decodedToken.email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const orders = await ordermodel.find({ user: user._id })
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "No orders found" });
      }
  
      return res.status(200).json({ orders: orders });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong", error });
    }
  });
  
  


  app.get('/api/admin/orders', adminauth, async (req, res) => {

    const token=req.headers.token;
    try {
        const dass=jwt.verify(token,process.env.API_SECRET_KEY)
        const data=await adminmodel.findOne({email:dass.email})
        const sellerid=data._id;
        const orders=await ordermodel.find();
        const filteredOrders = orders.filter(order =>
            order.products.some(product => product.sellerId.toString() === sellerid.toString())
          );
          return res.status(200).json({ orders: filteredOrders });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong", error });
    }
});

app.post('/api/admin/orders/:orderId/status', adminauth, async (req, res) => {
    const { orderId } = req.params;  
    const { orderStatus } = req.body;
    

    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

    if (!validStatuses.includes(orderStatus)) {
        return res.status(400).send({ message: "Invalid order status" });
    }

    try {
        const order = await ordermodel.findById(orderId);

        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }
        order.orderStatus = orderStatus;
        await order.save();

        return res.status(200).send({ message: "Order status updated successfully", order });
    } catch (error) {
        console.error('Error updating order status:', error);
        return res.status(500).send({ message: "Failed to update order status", error: error.message });
    }
});

app.listen(port,()=>{
    console.log(`port is running at ${port}`);
})