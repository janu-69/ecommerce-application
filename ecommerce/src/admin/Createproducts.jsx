import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { animateScroll as scroll } from 'react-scroll';
import Showproducts from './Showproducts';

const Createproducts = () => {
  const refresh = () => {
    window.location.reload();
  };

  const navigate = useNavigate();
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

  const handleproducts = async (e) => {
    e.preventDefault();
    const headers = {
      token: localStorage.getItem('token'),
    };
    const sellername = localStorage.getItem('sellername');
    const sellerid = localStorage.getItem('sellerid');
    if (file && productname && producttype && productdescription && productold_price && productnew_price && productstock) {
      let formdata = new FormData();
      formdata.append('image', file);
      formdata.append('name', productname);
      formdata.append('type', producttype);
      formdata.append('category', productcategory);
      formdata.append('discount', productdiscount);
      formdata.append('description', productdescription);
      formdata.append('more_details', productmoredetails);
      formdata.append('old_price', productold_price);
      formdata.append('new_price', productnew_price);
      formdata.append('stock', productstock);
      formdata.append('sellerid', sellerid);

      await axios
        .post('http://localhost:8080/api/addproducts', formdata, { headers })
        .then((res) => {
          setproductname('');
          setproducttype('');
          setproductcategory('');
          setproductdiscount('');
          setproductdescription('');
          setproductmoredetails('');
          setproductold_price('');
          setproductnew_price('');
          setproductstock('');

          if (res.data.message === 'product created successfully') {
            alert('Product added successfully');
            refresh();
          } else {
            alert('Something went wrong...');
          }
          if (res.data.message === 'please fill all the details') {
            alert('Please fill all the details...');
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert('Please fill all the product details');
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/adminlogin');
    } else {
      navigate('/addproducts');
    }
  }, []);

  const handleoutput = () => {
    localStorage.clear();
    navigate('/adminlogin');
  };

  return (
    <>
      <div className="w-full flex flex-col justify-between items-center">
        <div className="w-full border-b-2 border-zinc-200 p-4 sm:p-6 md:p-8 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Admin Panel</h1>
          <div className="flex gap-5 mt-4 md:mt-0 justify-center items-center">
            <h1
              className="text-lg sm:text-xl md:text-2xl font-bold cursor-pointer"
              onClick={() => scroll.scrollMore(950, { delay: 100 })}
            >
              Products
            </h1>
           <Link to={"/admin/orders"}> <h1 className="text-lg sm:text-xl md:text-2xl font-bold cursor-pointer">Orders</h1></Link>
            <button
              className="bg-red-400 rounded-md px-6 py-2 sm:px-8 sm:py-3"
              onClick={handleoutput}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="w-full sm:w-10/12 md:w-8/12 lg:w-1/2 xl:w-1/3 2xl:w-1/4 p-4 sm:p-6 md:p-8 border-2 border-zinc-200 rounded-lg shadow-lg mt-6">
          <form className="space-y-4">
            <div className="flex flex-col">
              <label>Choose Image</label>
              <input
                type="file"
                required
                className="px-3 py-2 mt-2 border-2 border-zinc-800 rounded-lg"
                onChange={(e) => setfile(e.target.files[0])}
              />
            </div>

            <div className="flex flex-col">
              <label>Enter Product Name</label>
              <input
                type="text"
                required
                placeholder="Enter the product name"
                value={productname}
                className="px-3 py-2 mt-2 border-2 border-zinc-800 rounded-lg"
                onChange={(e) => setproductname(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label>Enter Product Type</label>
              <input
                type="text"
                required
                placeholder="Enter the product type"
                value={producttype}
                className="px-3 py-2 mt-2 border-2 border-zinc-800 rounded-lg"
                onChange={(e) => setproducttype(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label>Enter Product Category</label>
              <input
                type="text"
                required
                placeholder="Enter the product category"
                value={productcategory}
                className="px-3 py-2 mt-2 border-2 border-zinc-800 rounded-lg"
                onChange={(e) => setproductcategory(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label>Enter Product Description</label>
              <textarea
                rows="3"
                required
                value={productdescription}
                placeholder="Enter description"
                className="px-3 py-2 mt-2 border-2 border-zinc-800 rounded-lg"
                onChange={(e) => setproductdescription(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label>Enter Product More Details</label>
              <textarea
                rows="3"
                required
                value={productmoredetails}
                placeholder="Enter more details"
                className="px-3 py-2 mt-2 border-2 border-zinc-800 rounded-lg"
                onChange={(e) => setproductmoredetails(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label>Enter Product Old Price</label>
              <input
                type="number"
                required
                placeholder="Enter the old price"
                value={productold_price}
                className="px-3 py-2 mt-2 border-2 border-zinc-800 rounded-lg"
                onChange={(e) => setproductold_price(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label>Enter Product New Price</label>
              <input
                type="number"
                required
                placeholder="Enter the new price"
                value={productnew_price}
                className="px-3 py-2 mt-2 border-2 border-zinc-800 rounded-lg"
                onChange={(e) => setproductnew_price(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label>Enter Product Discount</label>
              <input
                type="number"
                required
                placeholder="Enter the product discount"
                value={productdiscount}
                className="px-3 py-2 mt-2 border-2 border-zinc-800 rounded-lg"
                onChange={(e) => setproductdiscount(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label>Enter Product Stock</label>
              <input
                type="number"
                required
                placeholder="Enter the product stock"
                value={productstock}
                className="px-3 py-2 mt-2 border-2 border-zinc-800 rounded-lg"
                onChange={(e) => setproductstock(e.target.value)}
              />
            </div>

            <div className="flex justify-center items-center mt-6">
              <button
                type="button"
                className="bg-red-400 rounded-lg px-16 py-2 sm:px-20 sm:py-3"
                onClick={handleproducts}
              >
                Add Product
              </button>
            </div>
          </form>
        </div>

        <div className="w-full mt-6">
          <Showproducts />
        </div>
      </div>
    </>
  );
};

export default Createproducts;
