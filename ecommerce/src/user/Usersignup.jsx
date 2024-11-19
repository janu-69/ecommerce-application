import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Usersignup = () => {
    const [username, setusername] = useState("");
    const [useremail, setuseremail] = useState("");
    const [userpassword, setuserpassword] = useState("");
    const [usernumber, setusernumber] = useState("");

    const handlesignup = () => {
        const data = { name: username, email: useremail, password: userpassword, mobile: usernumber };
        axios.post("http://localhost:8080/api/usersignup", data)
            .then((res) => {
                console.log(res);
                setuseremail("");
                setuserpassword("");
                setusernumber("");
                setusername("");
                if (res.data.message === "please fill the details") {
                    alert("Please fill all the details...");
                }
                if (res.data.message === "user already exist") {
                    alert('user already exists, please try with another email...');
                }
                if (res.data.message === "user created") {
                    alert('user created successfully...');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <>
            <div className='w-full flex justify-center items-center mt-10'>
            
                <div className='w-10/12 sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/3 bg-white p-6 rounded-xl shadow-lg'>
                    <h2 className='text-2xl font-semibold text-center mb-4'>User Signup</h2>

                
                    <div className='flex flex-col mb-4'>
                        <label htmlFor="name" className='text-lg mb-2'>Name:</label>
                        <input
                            id="name"
                            type="text"
                            className='p-3 border-2 rounded-xl border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500'
                            value={username}
                            required
                            placeholder='Enter your name'
                            onChange={(e) => setusername(e.target.value)}
                        />
                    </div>

                
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

            
                    <div className='flex flex-col mb-4'>
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

                    
                    <div className='flex flex-col mb-6'>
                        <label htmlFor="mobile" className='text-lg mb-2'>Mobile:</label>
                        <input
                            id="mobile"
                            type="number"
                            className='p-3 border-2 rounded-xl border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500'
                            value={usernumber}
                            required
                            placeholder='Enter your mobile number'
                            onChange={(e) => setusernumber(e.target.value)}
                        />
                    </div>

                
                    <button
                        onClick={handlesignup}
                        className='w-full bg-slate-700 text-white px-6 py-3 rounded-xl hover:bg-slate-900 transition duration-200'
                    >
                        Signup
                    </button>

                    
                    <div className='flex justify-center items-center mt-4'>
                        <p className='text-sm'>Already have an account?</p>
                        <Link to={"/userlogin"}>
                            <h3 className='text-blue-700 cursor-pointer ml-2'>Login</h3>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Usersignup;
