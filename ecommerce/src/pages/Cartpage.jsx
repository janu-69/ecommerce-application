import React, { useEffect, useState } from 'react';
import Header from '../headcomponents/Header';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setCartLength } from '../store/cartreducer.js';
import { Link, useNavigate } from 'react-router-dom';

const Cartpage = () => {
  const dispatch = useDispatch();
  const setcartLength = useSelector((state) => state.cart.cartLength);
  const navigate = useNavigate();

  console.log(localStorage);

  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartQuantities, setCartQuantities] = useState([]);
  const [address, setAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending');

  const cartLength = cartQuantities.length;
  dispatch(setCartLength(cartLength));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = { token };
      const data = { token };

      axios.post('http://localhost:8080/api/finaldetails', data, { headers })
        .then((res) => {
          if (res.data.products) {
            setDetails(res.data.products);
            const initialQuantities = res.data.products.map((product) => ({
              productId: product.productId,
              quantity: 1,
            }));
            setCartQuantities(initialQuantities);
          }
        })
        .catch((err) => {
          console.error('Error fetching cart details:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log('Token not found!');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const headers = { token: localStorage.getItem('token') };

    axios.get('http://localhost:8080/api/userdetails', { headers })
      .then((res) => {
        setAddress(res.data.data.addressdetails || []);
      })
      .catch((err) => {
        console.log(err);
        if(err.response.data.message==="unauthorised user"){
          alert("token expred")
           navigate("/userlogin");
        }
      });
  }, []);

  const handleQuantityChange = (productId, operation) => {
    setCartQuantities((prevQuantities) => {
      return prevQuantities.map((item) => {
        if (item.productId === productId) {
          let newQuantity = operation === 'increase' ? item.quantity + 1 : item.quantity - 1;
          newQuantity = newQuantity < 1 ? 1 : newQuantity;
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const handledeletecartitem = (product) => {
    const headers = { token: localStorage.getItem('token') };
    const data = { token: localStorage.getItem('token'), id: product.productId };

    axios.post('http://localhost:8080/api/deletecartitem', data, { headers })
      .then((res) => {
        if (res.data.message === 'deleted product in cart') {
          alert('Product removed from cart');
          setDetails(details.filter((item) => item.productId !== product.productId));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const calculatePriceDetails = () => {
    let totalPrice = 0;
    let totalDiscount = 0;

    details.forEach((product) => {
      const cartProduct = cartQuantities.find((item) => item.productId === product.productId);
      const quantity = cartProduct ? cartProduct.quantity : 1;
      totalDiscount += (product.discount * quantity); 
      totalPrice += product.new_price * quantity;
    });

    return { totalPrice, totalDiscount };
  };

  const { totalPrice, totalDiscount } = calculatePriceDetails();
  const finalAmount = totalPrice - totalDiscount;

  const handleproductorder = () => {
    if (!selectedAddress) {
      alert('Please select an address...');
      return;
    }
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    const data = {
      amount: finalAmount,
      data: cartQuantities,
      token: localStorage.getItem('token'),
      address: selectedAddress,
      paymentMethod,
      paymentStatus,
    };

    axios.post('http://localhost:8080/api/orders', data, { headers: { token: localStorage.getItem('token') } })
      .then((res) => {
        if (res.data.message === 'Order placed successfully') {
          alert('Order placed successfully');
          navigate("/orders")
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Header />
      <div className="w-full px-4 md:px-8 lg:px-16">
        <h1 className="font-bold text-2xl text-center py-5">Shopping Cart</h1>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : details.length === 0 ? (
          <p className="text-center font-bold text-lg">Your cart is empty.</p>
        ) : (
          details.map((product) => {
            const cartProduct = cartQuantities.find((item) => item.productId === product.productId);
            const quantity = cartProduct ? cartProduct.quantity : 1;

            return (
              <div key={product.productId} className="flex flex-col sm:flex-row mb-4 gap-4">
                <div className="product-image flex justify-center w-full sm:w-1/3">
                  <img className="h-54 w-64 object-cover" src={`http://localhost:8080/${product.image}`} alt={product.name} />
                </div>
                <div className="flex flex-col justify-between w-full sm:w-2/3 space-y-3">
                  <div>
                    <h2 className="text-lg">{product.name}</h2>
                    <p>{product.category}</p>
                    <button
                      onClick={() => handledeletecartitem(product)}
                      className="bg-red-500 text-white px-5 py-1 rounded-md mt-3 sm:mt-5"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="flex items-center justify-start sm:justify-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(product.productId, 'decrease')}
                      className="bg-green-500 rounded-md px-5 py-1"
                    >
                      -
                    </button>
                    <span>Quantity: {quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(product.productId, 'increase')}
                      className="bg-green-500 px-5 py-1 rounded-md"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-semibold text-lg">Total Price: ${product.new_price * quantity}</p>
                </div>
              </div>
            );
          })
        )}

        <div className="mt-6">
          <h2 className="font-bold text-xl md:text-2xl text-right">Price Details</h2>
          <div className="flex flex-col gap-4 mt-4 sm:mt-5">
            <div className="flex justify-between items-center text-sm sm:text-base">
              <p>Price ({cartLength} items)</p>
              <p className="font-semibold">${totalPrice.toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center text-sm sm:text-base">
              <p>Discount</p>
              <p className="text-red-500">- ${totalDiscount.toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center text-sm sm:text-base">
              <p>Delivery charges</p>
              <div className="flex gap-3">
                <p className="line-through text-gray-500">40</p>
                <p className="text-green-700">Free</p>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center text-lg font-semibold mt-5 sm:mt-7">
            <p>Total Amount</p>
            <p>${finalAmount.toFixed(2)}</p>
          </div>

          <div className="mt-6">
            <div className='w-full flex justify-around'><h2 className="font-bold text-xl">Select Delivery Address</h2><Link to={"/profile"}><button className='bg-green-600 px-5 py-1 rounded-lg'>Add Address</button></Link></div>
            <div className="space-y-4 mt-3">
              {address.length === 0 ? (
                <p className="text-center text-red-500">No addresses available. Please add one.</p>
              ) : (
                address.map((addr) => (
                  <div key={addr._id} className="flex items-center space-x-3 p-4 border rounded-md hover:bg-gray-100">
                    <input
                      type="radio"
                      id={addr._id}
                      name="address"
                      value={addr._id}
                      checked={selectedAddress && selectedAddress._id === addr._id}
                      onChange={() => setSelectedAddress(addr)}
                      className="h-5 w-5"
                    />
                    <label htmlFor={addr._id} className="cursor-pointer">
                      {addr.street}, {addr.city}, {addr.state}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="font-bold text-xl">Select Payment Method</h2>
            <div className="space-y-4 mt-3">
              <div>
                <input
                  type="radio"
                  id="credit_card"
                  name="paymentMethod"
                  value="credit_card"
                  checked={paymentMethod === 'credit_card'}
                  onChange={() => setPaymentMethod('credit_card')}
                  className="h-5 w-5"
                />
                <label htmlFor="credit_card" className="cursor-pointer">Credit Card</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="paypal"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={() => setPaymentMethod('paypal')}
                  className="h-5 w-5"
                />
                <label htmlFor="paypal" className="cursor-pointer">PayPal</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="h-5 w-5 "
                />
                <label htmlFor="cod" className="cursor-pointer">Cash on Delivery</label>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleproductorder}
              className="bg-blue-500 text-white py-2 px-4 w-full rounded-md">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cartpage;
