import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Userlogin = () => {
  const navigate = useNavigate();
  const [useremail, setuseremail] = useState("");
  const [userpassword, setuserpassword] = useState("");

  const handleuserlogin = () => {
    const data = { email: useremail, password: userpassword };
    axios.post("http://localhost:8080/api/userlogin", data)
      .then((res) => {
        console.log(res);
        setuseremail('');
        setuserpassword('');
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
          const role=res.data.role
          localStorage.setItem("token", token);
          localStorage.setItem("name",res.data.user);
          localStorage.setItem('role',role);
          alert("Login success...");
          navigate("/home");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className='flex justify-center items-center mt-10 px-4'>
        <div className='w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-white p-6 rounded-xl shadow-lg'>
          <h2 className='text-2xl font-semibold text-center mb-4'>User Login</h2>
          <div className='flex flex-col mb-4'>
            <label htmlFor="email" className='text-lg mb-2'>Email:</label>
            <input
              id="email"
              type="email"
              className='p-3 border-2 rounded-xl border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500'
              value={useremail}
              required
              placeholder='Enter your email'
              onChange={(e) => setuseremail(e.target.value)}
            />
          </div>

          <div className='flex flex-col mb-6'>
            <label htmlFor="password" className='text-lg mb-2'>Password:</label>
            <input
              id="password"
              type="password"
              className='p-3 border-2 rounded-xl border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500'
              value={userpassword}
              required
              placeholder='Enter your password'
              onChange={(e) => setuserpassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleuserlogin}
            className='w-full bg-slate-700 text-white px-6 py-3 rounded-xl hover:bg-slate-900 transition duration-200'
          >
            LOGIN
          </button>

          <div className='flex justify-center items-center mt-4'>
            <p className='text-sm'>Don't have an account?</p>
            <Link to={"/usersignup"}>
              <h3 className='text-blue-700 cursor-pointer ml-2'>Signup</h3>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Userlogin;
