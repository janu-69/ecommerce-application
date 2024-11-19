import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const Editproducts = () => {
  const [id, setid] = useState();
  const [file, setfile] = useState();
  const [productname, setproductname] = useState('');
  const [producttype, setproducttype] = useState('');
  const [productcategory, setproductcategory] = useState('');
  const [productdiscount, setproductdiscount] = useState('');
  const [productdescription, setproductdescription] = useState('');
  const [productold_price, setproductold_price] = useState('');
  const [productnew_price, setproductnew_price] = useState('');
  const [productstock, setproductstock] = useState('');
  const [productmoredetails, setproductmoredetails] = useState('');
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const headers = {
      token: localStorage.getItem('token'),
    };
    const num = params.id;
    setid(num);

    axios
      .get(`http://localhost:8080/api/editproducts/${num}`, { headers })
      .then((res) => {
        console.log(res.data.product);
        if (res.data.message === 'something went wrong at auth') {
          alert('Something went wrong');
          navigate('/adminlogin');
        }
        if (res.data.message === 'token missing') {
          alert('Token missing. Please login again...');
          navigate('/adminlogin');
        }
        
        const product = res.data.product;
        setproductname(product.name);
        setproducttype(product.type);
        setproductcategory(product.category);
        setproductdiscount(product.discount);
        setproductdescription(product.description);
        setproductmoredetails(product.more_details);
        setproductold_price(product.olp_price);
        setproductnew_price(product.new_price);
        setproductstock(product.stock);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [params.id, navigate]);

  const handleupdateproduct = (e) => {
    e.preventDefault();
    const data = {
      id: id,
      image: file,
      name: productname,
      type: producttype,
      category: productcategory,
      discount: productdiscount,
      description: productdescription,
      olp_price: productold_price,
      new_price: productnew_price,
      stock: productstock,
      moredetails: productmoredetails,
    };
    const headers = {
      token: localStorage.getItem('token'),
    };

    axios
      .post('http://localhost:8080/api/updateproducts', data, { headers })
      .then((res) => {
        console.log(res);
        if (res.data.message === 'something went wrong at auth') {
          alert('Something went wrong');
          navigate('/adminlogin');
        }
        if (res.data === 'success') {
          alert('Product updated successfully...');
          navigate('/addproducts');
        } else {
          alert('Product not updated...');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className='w-full h-full flex flex-col md:flex-row'>
        
        <div className='h-full w-full md:w-1/3 border-2 border-zinc-200 p-6 flex flex-col justify-between'>
          <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold mt-5'>Admin Panel</h1>
          <h2 className='text-xl md:text-2xl font-bold mt-4'>Edit Product</h2>
          <Link to='/addproducts'>
            <h2 className='text-xl font-bold mt-4 cursor-pointer'>Back</h2>
          </Link>
        </div>

        
        <div className='h-full w-full md:w-2/3 p-6'>
          <form className='space-y-6' onSubmit={handleupdateproduct}>
            
            <div className='flex flex-col'>
              <label className='font-semibold'>Choose Image</label>
              <input
                type='file'
                className='mt-2 px-3 py-2 border-2 border-zinc-800 rounded-lg'
                onChange={(e) => setfile(e.target.files[0])}
              />
            </div>

          
            <div className='flex flex-col'>
              <label className='font-semibold'>Product Name</label>
              <input
                type='text'
                placeholder='Enter the product name'
                value={productname}
                className='mt-2 px-3 py-2 border-2 border-zinc-800 rounded-lg'
                onChange={(e) => setproductname(e.target.value)}
              />
            </div>

          
            <div className='flex flex-col'>
              <label className='font-semibold'>Product Type</label>
              <input
                type='text'
                placeholder='Enter the product type'
                value={producttype}
                className='mt-2 px-3 py-2 border-2 border-zinc-800 rounded-lg'
                onChange={(e) => setproducttype(e.target.value)}
              />
            </div>

            
            <div className='flex flex-col'>
              <label className='font-semibold'>Product Category</label>
              <input
                type='text'
                placeholder='Enter the product category'
                value={productcategory}
                className='mt-2 px-3 py-2 border-2 border-zinc-800 rounded-lg'
                onChange={(e) => setproductcategory(e.target.value)}
              />
            </div>

            
            <div className='flex flex-col'>
              <label className='font-semibold'>Product Description</label>
              <textarea
                rows={3}
                placeholder='Enter description'
                value={productdescription}
                className='mt-2 px-3 py-2 border-2 border-zinc-800 rounded-lg'
                onChange={(e) => setproductdescription(e.target.value)}
              />
            </div>

          
            <div className='flex flex-col'>
              <label className='font-semibold'>Product More Details</label>
              <textarea
                rows={3}
                value={productmoredetails}
                placeholder='Enter more details'
                className='mt-2 px-3 py-2 border-2 border-zinc-800 rounded-lg'
                onChange={(e) => setproductmoredetails(e.target.value)}
              />
            </div>

            
            <div className='flex flex-col'>
              <label className='font-semibold'>Old Price</label>
              <input
                type='number'
                placeholder='Enter the old price'
                value={productold_price}
                className='mt-2 px-3 py-2 border-2 border-zinc-800 rounded-lg'
                onChange={(e) => setproductold_price(e.target.value)}
              />
            </div>

            
            <div className='flex flex-col'>
              <label className='font-semibold'>New Price</label>
              <input
                type='number'
                placeholder='Enter the new price'
                value={productnew_price}
                className='mt-2 px-3 py-2 border-2 border-zinc-800 rounded-lg'
                onChange={(e) => setproductnew_price(e.target.value)}
              />
            </div>

        
            <div className='flex flex-col'>
              <label className='font-semibold'>Discount</label>
              <input
                type='number'
                placeholder='Enter the product discount'
                value={productdiscount}
                className='mt-2 px-3 py-2 border-2 border-zinc-800 rounded-lg'
                onChange={(e) => setproductdiscount(e.target.value)}
              />
            </div>

          
            <div className='flex flex-col'>
              <label className='font-semibold'>Stock</label>
              <input
                type='number'
                placeholder='Enter the product stock'
                value={productstock}
                className='mt-2 px-3 py-2 border-2 border-zinc-800 rounded-lg'
                onChange={(e) => setproductstock(e.target.value)}
              />
            </div>

          
            <div className='flex justify-center items-center mt-4'>
              <button
                type='submit'
                className='bg-red-400 text-white rounded-lg px-16 py-2 hover:bg-red-500 transition duration-300'
              >
                Update Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Editproducts;
