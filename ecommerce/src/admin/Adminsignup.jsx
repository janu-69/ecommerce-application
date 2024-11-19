import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Adminsignup = () => {
  const [adminusername, setadminusername] = useState("");
  const [adminemail, setadminemail] = useState("");
  const [adminpassword, setadminpassword] = useState("");
  const [adminnumber, setadminnumber] = useState("");

  const handlesignup = () => {
    const data = { name: adminusername, email: adminemail, password: adminpassword, mobile: adminnumber };
    axios.post("http://localhost:8080/api/adminsignup", data)
      .then((res) => {
        console.log(res);
        setadminemail("");
        setadminpassword("");
        setadminnumber("");
        setadminusername("");
        if (res.data.message === "please fill the details") {
          alert("Please fill all the details...");
        }
        if (res.data.message === "admin already exist") {
          alert('admin already exists. Please try with another email...');
        }
        if (res.data.message === "admin created") {
          alert('admin created successfully...');
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  return (
    <>
      <div className='w-full flex justify-center items-center mt-10'>
        <div className='w-full sm:w-11/12 md:w-8/12 lg:w-6/12 xl:w-5/12 p-4'>
          <div className='h-auto w-full max-w-md border-2 border-black rounded-2xl flex flex-col justify-center items-center text-lg p-6'>
            <h2 className='text-2xl font-bold mb-6 text-center'>Admin Signup</h2>

            <div className='flex flex-col p-2 mb-4'>
              <label htmlFor='name' className='text-sm sm:text-base'>Name :</label>
              <input
                id='name'
                className='mt-2 p-3 border-2 rounded-xl border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400'
                type='text'
                required
                value={adminusername}
                placeholder='Enter your name'
                onChange={(e) => setadminusername(e.target.value)}
              />
            </div>

            <div className='flex flex-col p-2 mb-4'>
              <label htmlFor='email' className='text-sm sm:text-base'>Email :</label>
              <input
                id='email'
                className='mt-2 p-3 border-2 rounded-xl border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400'
                type='email'
                required
                value={adminemail}
                placeholder='Enter your email'
                onChange={(e) => setadminemail(e.target.value)}
              />
            </div>

            <div className='flex flex-col p-2 mb-4'>
              <label htmlFor='password' className='text-sm sm:text-base'>Password :</label>
              <input
                id='password'
                className='mt-2 p-3 border-2 rounded-xl border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400'
                type='password'
                required
                value={adminpassword}
                placeholder='Enter your password'
                onChange={(e) => setadminpassword(e.target.value)}
              />
            </div>

            <div className='flex flex-col p-2 mb-6'>
              <label htmlFor='mobile' className='text-sm sm:text-base'>Mobile :</label>
              <input
                id='mobile'
                className='mt-2 p-3 border-2 rounded-xl border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400'
                type='number'
                required
                value={adminnumber}
                placeholder='Enter your mobile number'
                onChange={(e) => setadminnumber(e.target.value)}
              />
            </div>

            <button
              onClick={handlesignup}
              className='bg-slate-700 px-8 py-2 rounded-xl text-white mt-4 hover:bg-slate-900 transition-colors duration-300 w-full sm:w-auto'
            >
              Signup
            </button>

            <div className='flex gap-2 mt-4 justify-center'>
              <p className='text-sm sm:text-base'>Already have an account?</p>
              <Link to={"/adminlogin"}>
                <h3 className='text-blue-700 cursor-pointer text-sm sm:text-base'>Login</h3>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Adminsignup;
