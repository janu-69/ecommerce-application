import React, { useEffect, useState } from 'react';
import Header from '../headcomponents/Header';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    const headers = {
      token: localStorage.getItem("token"),
    };

    axios.get('http://localhost:8080/api/orders', { headers })
      .then((res) => {
        console.log(res);
        setOrders(res.data.orders);  // Set orders with sellerId populated
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data.message === "unauthorised user") {
          alert("Token expired");
          navigate('/userlogin');
        }
      });
  }, []);

  return (
    <>
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center text-lg text-gray-600">No orders found.</div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white shadow-lg rounded-lg p-6">
                <div className="flex justify-between mb-4">
                  <div className="text-lg font-semibold text-gray-800">Order ID: {order._id}</div>
                  <div className="text-lg text-green-600">{order.orderStatus}</div>
                </div>

                <div className="mb-4">
                  <div className="font-semibold text-lg">
                    Total Amount: ${order.totalAmount.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="font-semibold text-lg">Payment Information:</div>
                  <div className="text-sm text-gray-600">
                    Payment Method: {order.paymentMethod}
                  </div>
                  <div className="text-sm text-gray-600">
                    Payment Status: {order.paymentStatus}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="font-semibold text-lg">Products:</div>
                  <ul className="space-y-2">
                    {order.products.map((product, index) => (
                      <li key={index} className="flex justify-between">
                        <span className="text-sm">
                          {product.productName} - {product.quantity} x ${product.pricePerProduct.toFixed(2)}
                        </span>
                        <span className="text-sm font-semibold text-gray-800">
                          ${(product.quantity * product.pricePerProduct).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="font-semibold text-lg">Shipping Address:</div>
                  <div className="text-sm text-gray-700">
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                    <p>{order.shippingAddress.district}, {order.shippingAddress.postalCode}</p>
                    <p>Phone: {order.shippingAddress.phoneNumber}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OrdersPage;
