import React, { useEffect, useState } from 'react';
import Header from "../headcomponents/Header.jsx";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCartLength } from '../store/cartreducer.js';

const Home = () => {
  const [reload, setReload] = useState(false);
  const [data, setData] = useState([]);
  const [cartData, setCartData] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartLength = useSelector((state) => state.cart.cartLength);
  const [loading, setLoading] = useState(false);

  const refresh = () => {
    window.location.reload();
  };

  useEffect(() => {
    const headers = {
      token: localStorage.getItem("token")
    };
    axios.get("http://localhost:8080/api/allproducts", { headers })
      .then((res) => {
        setData(res.data.products);
        if (res.data.message === "something went wrong while fetching") {
          refresh();
        }
      })
      .catch((err) => {
        if(err.response.data.message==="unauthorised user"){
          alert("token expired");
          navigate("/userlogin");
        }
      });
  }, []);

  const handlePass = (item) => {
    setLoading(true);

    let isPresent = cartData.some(i => i === item._id);

    if (isPresent) {
      alert('Item already in cart');
      setLoading(false);
    } else {
      const updatedCartData = [...cartData, item._id];
      setCartData(updatedCartData);

      const headers = {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('token')
      };

      const meta = {
        productids: updatedCartData,
        token: localStorage.getItem('token')
      };

      axios.post("http://localhost:8080/api/cartproducts", meta, { headers })
        .then((res) => {
          console.log(res);
          setLoading(false);
          if (res.data.message === "No new products to add. They are already in the cart.") {
            alert("Product is already added");
          }
          if(res.data.message==="1 products successfully added to the cart."){
            alert("product is added to cart....")
          }
        })
        .catch((err) => {
          console.log(err)
          setLoading(false);
          console.error('API Error:', err);
        });
    }
  };

  const handleImg = (item) => {
    navigate(`/product/${item._id}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/userlogin");
  };

  const headers = {
    token: localStorage.getItem('token')
  };
  axios.post("http://localhost:8080/api/cartdetails", { token: localStorage.getItem('token') }, { headers })
    .then((res) => {
      const cartLength = res.data.cart.length;
      dispatch(setCartLength(cartLength));
    })
    .catch((err) => {
      console.log(err);
    });

  return (
    <>
      <Header />
      <div className="w-full p-4">
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-center text-2xl sm:text-3xl font-semibold'>All Products</h1>
          <button
            onClick={handleLogout}
            className='bg-red-700 rounded-md text-white font-semibold px-5 py-1'
          >
            Logout
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map((item) => (
            <div key={item._id} className="border-2 border-zinc-400 p-4 rounded-lg flex flex-col items-center">
              <div className="flex justify-center items-center mb-4">
                <img
                  className="h-56 w-72 object-contain cursor-pointer transition-transform duration-300 transform hover:scale-105"
                  onClick={() => handleImg(item)}
                  src={`http://localhost:8080/${item.image}`}
                  alt={item.name}
                />
              </div>
              <h1 className='mt-2 text-lg sm:text-xl font-semibold text-center'>{item.name}</h1>
              <h1 className='mt-1 text-sm sm:text-base text-center'>{item.category}</h1>
              <div className='flex gap-3 mt-2 justify-center'>
                <p className='line-through text-sm sm:text-base'>${item.old_price}</p>
                <p className='text-green-800 text-sm sm:text-base font-semibold'>${item.new_price}</p>
              </div>
              <div className='w-full flex justify-center items-center mt-4'>
                <button
                  id='addtocart'
                  className='px-5 bg-green-700 hover:bg-green-900 text-white rounded-lg py-2 transition duration-200'
                  onClick={() => handlePass(item)}
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
