import React, { useEffect, useState } from 'react';
import { FaCartPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
  const navigate = useNavigate();
  const [name, setName] = useState();

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    setName(storedName);
  }, []);

  const cartLength = useSelector((state) => state.cart.cartLength);

  return (
    <div className="h-auto p-4 sm:p-6 md:p-10 flex flex-col sm:flex-row justify-between items-center bg-gray-800 text-white shadow-lg">
    
      <div className="flex flex-col sm:flex-row justify-between items-center w-full sm:w-auto gap-6 sm:gap-10">
      
        <Link to="/home">
          <h1 className="cursor-pointer font-bold text-3xl sm:text-4xl md:text-5xl text-orange-400 hover:text-white transition-colors">
            DuJASHOP
          </h1>
        </Link>

        
        <Link to="/adminlogin">
          <h1 className="font-semibold text-lg sm:text-xl text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md transition-all duration-200">
            Seller
          </h1>
        </Link>
      </div>

      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-12 mt-4 sm:mt-0 w-full sm:w-auto">
      
        <Link to="/profile">
          <h1 className="text-lg font-semibold px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-all duration-200">
            {name || 'Profile'}
          </h1>
        </Link>

        
        <Link to="/home" className="font-semibold text-lg sm:text-xl cursor-pointer hover:text-orange-400 transition-all duration-200">
          Home
        </Link>

        
        <Link to="/orders" className="font-semibold text-lg sm:text-xl cursor-pointer hover:text-orange-400 transition-all duration-200">
          Orders
        </Link>

        
        <Link to="/cart" className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 transition-all duration-200">
          <FaCartPlus className="text-white" />
          <span className="ml-2 text-sm sm:text-base">{cartLength}</span>
          <p className="ml-2">Cart</p>
        </Link>
      </div>
    </div>
  );
};

export default Header;

