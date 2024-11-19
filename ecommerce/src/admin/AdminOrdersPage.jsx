import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState({});

  useEffect(() => {
    axios.get('http://localhost:8080/api/admin/orders', {
      headers: { token: localStorage.getItem('token') },
    })
      .then((res) => {
        console.log(res);
        setOrders(res.data.orders);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response.data.message === "unauthorised user") {
          alert("Token expired");
          navigate("/adminlogin");
        }
        console.error('Error fetching orders:', err);
        setLoading(false);
      });
  }, []);

  const handleOrderStatusChange = (orderId, newStatus) => {
    setSelectedStatus((prevStatus) => ({
      ...prevStatus,
      [orderId]: newStatus,
    }));
  };

  const handleSubmitStatusUpdate = (orderId) => {
    const newStatus = selectedStatus[orderId];

    if (!newStatus) {
      alert('Please select a status.');
      return;
    }

    setStatusUpdateLoading(true);

    axios.post(`http://localhost:8080/api/admin/orders/${orderId}/status`, { orderStatus: newStatus }, {
      headers: { token: localStorage.getItem('token') },
    })
      .then((res) => {
        if (res.data.message === "Order status updated successfully") {
          const updatedOrders = orders.map((order) =>
            order._id === orderId ? { ...order, orderStatus: newStatus } : order
          );
          setOrders(updatedOrders);
          alert('Order status updated successfully');
        }
        setStatusUpdateLoading(false);
      })
      .catch((err) => {
        console.error('Error updating order status:', err);
        setStatusUpdateLoading(false);
      });
  };

  if (loading) {
    return <div className="text-center py-6">Loading...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="w-full flex justify-around items-center">
        <h1 className="text-2xl font-bold m-8">Admin Orders</h1>
        <Link to={'/addproducts'}>
          <h1 className="text-2xl font-bold m-8">Back</h1>
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order._id} className="border border-gray-300 rounded-lg p-4 shadow-lg space-y-4">
              <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
              <div className="space-y-2">
                <p><strong>User Name:</strong> {order.userName}</p>
                <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
                <p><strong>Order Status:</strong> {order.orderStatus}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Products:</h3>
                {order.products.map((product, index) => (
                  <div key={index} className="flex justify-between text-gray-800">
                    <div className="flex-1">
                      <span><strong>Product Name:</strong> {product.productName}</span><br />
                    </div>
                    <span>{product.quantity} x ${product.pricePerProduct}</span>
                    <span>Total: ${product.totalPrice}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Shipping Address:</h3>
                {order.shippingAddress ? (
                  <div>
                    <p><strong>Street:</strong> {order.shippingAddress.street}</p>
                    <p><strong>City:</strong> {order.shippingAddress.city}</p>
                    <p><strong>State:</strong> {order.shippingAddress.state}</p>
                    <p><strong>District:</strong> {order.shippingAddress.district}</p>
                    <p><strong>Postal Code:</strong> {order.shippingAddress.postalCode}</p>
                    <p><strong>Phone Number:</strong> {order.shippingAddress.phoneNumber}</p>
                  </div>
                ) : (
                  <p>No shipping address available</p>
                )}
              </div>

              <div className="space-y-2">
                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
              </div>

              <div className="mt-4">
                <label htmlFor="orderStatus" className="block font-semibold mb-2">
                  Update Order Status:
                </label>
                <select
                  id="orderStatus"
                  value={selectedStatus[order._id] || order.orderStatus}
                  onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                  className="block w-full border-gray-300 rounded-lg p-2"
                  disabled={statusUpdateLoading}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={() => handleSubmitStatusUpdate(order._id)}
                  className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none"
                  disabled={statusUpdateLoading}
                >
                  {statusUpdateLoading ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
