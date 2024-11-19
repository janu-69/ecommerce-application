import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Adminlogin = () => {
  const navigate = useNavigate();
  const [adminemail, setadminemail] = useState("");
  const [adminpassword, setadminpassword] = useState("");

  const handleadminlogin = () => {
    const data = { email: adminemail, password: adminpassword };
    axios.post("http://localhost:8080/api/adminlogin", data)
      .then((res) => {
        console.log(res);
        setadminemail('');
        setadminpassword('');
        if (res.data.message === "please enter email and password") {
          alert("Please enter email and password");
        }
        if (res.data.message === "invalid credentials") {
          alert("Invalid credentials");
        }
        if (res.data.message === "incorrect credentials") {
          alert("Something went wrong");
        }
        if (res.data.message === "login successfull") {
          const token = res.data.token;
          const seller = res.data.seller;
          const role=res.data.role;
          localStorage.setItem("token", token);
          localStorage.setItem("sellerid", seller);
          localStorage.setItem("role", role);
          alert("Login successful...");
          navigate("/addproducts");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className='w-full flex justify-center items-center mt-10'>
        <div className='w-full max-w-lg p-6 flex justify-center items-center'>
          <div className='h-auto w-full max-w-md border-2 border-black rounded-2xl flex flex-col justify-center items-center text-lg p-4'>
            <h2 className='text-2xl font-bold mb-6 text-center'>Admin Login</h2>
            
            <div className='flex flex-col p-2 mb-4'>
              <label htmlFor='email' className='text-sm sm:text-base'>Email :</label>
              <input
                id='email'
                className='mt-2 p-3 border-2 rounded-xl border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400'
                type='email'
                value={adminemail}
                required
                placeholder='Enter your email'
                onChange={(e) => setadminemail(e.target.value)}
              />
            </div>

            <div className='flex flex-col p-2 mb-6'>
              <label htmlFor='password' className='text-sm sm:text-base'>Password :</label>
              <input
                id='password'
                className='mt-2 p-3 border-2 rounded-xl border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400'
                type='password'
                value={adminpassword}
                required
                placeholder='Enter your password'
                onChange={(e) => setadminpassword(e.target.value)}
              />
            </div>

            <button
              onClick={handleadminlogin}
              className='bg-slate-700 px-8 py-2 rounded-xl text-white mt-4 hover:bg-slate-900 transition-colors duration-300 w-full sm:w-auto'
            >
              LOGIN
            </button>

            <div className='flex gap-2 mt-4 justify-center'>
              <p className='text-sm sm:text-base'>Don't have an account?</p>
              <Link to={"/adminsignup"}>
                <h3 className='text-blue-700 cursor-pointer text-sm sm:text-base'>Signup</h3>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Adminlogin;
