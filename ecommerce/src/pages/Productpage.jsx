import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../headcomponents/Header';
import { useDispatch, useSelector } from 'react-redux';
import { setCartLength } from '../store/cartreducer.js';

const Productpage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [singleproduct, setsingleproduct] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const data = { id };
        const headers = { token: localStorage.getItem('token') };
        const res = await axios.post('http://localhost:8080/api/getproductdetails', data, { headers });
        console.log(res);
        if (res.data.message === 'failed') {
          alert('Something went wrong');
          navigate('/home');
        } else {
          setsingleproduct(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        if(err.response.data.message==="unauthorised user"){
          alert("token expired")
          navigate("/userlogin")
      }
        alert('Failed to fetch product details');
      }
    };

    fetchProductDetails();
  }, [id, navigate]);

  const handleAddToCart = async (product) => {
    try {
      const headers = { 'Content-Type': 'application/json', token: localStorage.getItem('token') };
      const res = await axios.post(
        'http://localhost:8080/api/cartproducts',
        { productids: [product._id], token: localStorage.getItem('token') },
        { headers }
      );
      console.log(res);

      if (res.data.message === 'No new products to add. They are already in the cart.') {
        alert('Product is already added to cart.');
      } else {
        alert('Product added to cart!');
        dispatch(setCartLength(res.data.cart.length));
      }
    } catch (err) {
      console.log(err)
      if(err.response.data.message==="unauthorised user"){
        alert("token expired")
        navigate("/userlogin")
    }
    }
  };


  const handleBuyNow = async (product) => {
    try {
      
      const headers = { 'Content-Type': 'application/json', token: localStorage.getItem('token') };
      const res = await axios.post('http://localhost:8080/api/cartproducts',{ productids: [product._id], token: localStorage.getItem('token') },{ headers });
      console.log(res);

      if (res.data.message === 'No new products to add. They are already in the cart.') {
        alert('Product is already added to cart.');
        navigate("/cart")
      } else {
        alert('Product added to cart!');
        navigate('/cart')
        dispatch(setCartLength(res.data.cart.length));
      }
    } catch (err) {
      console.error('Error adding product to cart:', err);
    }
  };

  return (
    <>
      <Header />
      <div className="w-full h-auto bg-gray-50 py-12">
        {singleproduct.map((item) => (
          <div key={item._id} className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg p-6 md:flex items-center space-x-8">
              <div className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0">
                <img
                  src={`http://localhost:8080/${item.image}`}
                  alt={item.name}
                  className="rounded-lg shadow-md w-full h-auto object-cover"
                />
              </div>
              <div className="w-full md:w-1/2">
                <h1 className="text-3xl font-semibold text-gray-800 mb-2">{item.name}</h1>
                <p className="text-xl text-gray-600 mb-4">{item.category}</p>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-lg font-semibold text-orange-500">{item.new_price}</span>
                  <span className="text-sm line-through text-gray-500">{item.old_price}</span>
                </div>

                <p className="text-lg text-gray-700 mb-4">
                  <span className="font-semibold">Discount:</span> {item.discount}%
                </p>

                <div className="mb-4">
                  <p className="text-lg font-semibold text-red-500">
                    Hurry! Only {item.stock} left.
                  </p>
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => handleBuyNow(item)}
                    className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white py-2 px-6 rounded-lg focus:outline-none"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg focus:outline-none"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Productpage;
