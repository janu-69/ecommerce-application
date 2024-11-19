import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Showproducts = () => {
  const navigate = useNavigate();

  const [data, setdata] = useState([]);
  const [deletedata, setdeletedata] = useState([]);

  const token = localStorage.getItem("token");
  const sellerid = localStorage.getItem("sellerid");

  const refresh = () => {
    window.location.reload();
  };

  useEffect(() => {
    const data = { sellerid };
    const headers = { token };

    axios.post("http://localhost:8080/api/showproducts", data, { headers })
      .then((res) => {
        setdata(res.data.products);
      })
      .catch((error) => {
        console.log(error.response.data.message);
        if(error.response.data.message==="unauthorised user"){
          alert('token expired');
          navigate('/adminlogin');
        }
      });
  }, []);

  const handledeleteproduct = () => {
    const headers = { token };
    axios.post("http://localhost:8080/api/deleteproducts", deletedata, { headers })
      .then((res) => {
        if (res.data.message === "deleted") {
          alert("Product deleted successfully...");
          refresh();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div>
        <div className='flex justify-between items-center mt-10 mx-5'>
          <h1 className='text-center text-2xl md:text-4xl font-bold'>PRODUCTS</h1>
          <button
            className='px-8 py-2 bg-red-400 rounded-lg cursor-pointer'
            onClick={handledeleteproduct}
          >
            Delete
          </button>
        </div>

        <div className='w-full flex flex-wrap justify-center mt-8'>
          {
            data.map((item) => (
              <div key={item._id} className='w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 bg-blue-200 m-4 p-4 rounded-lg shadow-md'>
            
                <div className='flex justify-center mb-4'>
                  <img 
                    className='h-48 w-auto object-cover'
                    src={`http://localhost:8080/${item.image}`} 
                    alt={item.name} 
                  />
                </div>

            
                <div className='flex flex-col text-center'>
                  <span className='font-semibold'>{item.name}</span>
                  <span className='text-sm text-gray-700'>Category: {item.category}</span>
                  <span className='text-sm text-gray-700'>Hurry only: {item.stock} left</span>

                  <div className='flex justify-center items-center mt-3'>
                    <p className='text-lg font-semibold text-red-500 line-through'>
                      {item.old_price}
                    </p>
                    <span className='ml-2 text-lg font-bold text-green-500'>{item.new_price}</span>
                  </div>
                </div>

                <div className='flex justify-between items-center mt-4'>
                  <button
                    className='bg-green-400 text-white px-4 py-2 rounded-lg cursor-pointer'
                    onClick={() => navigate(`/editproducts/${item._id}`)}
                  >
                    Edit
                  </button>

                  <input
                    type='checkbox'
                    onChange={(e) => {
                      if (e.target.checked) {
                        setdeletedata([...deletedata, item._id]);
                      } else {
                        setdeletedata(deletedata.filter(id => id !== item._id));
                      }
                    }}
                  />
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </>
  );
}

export default Showproducts;
