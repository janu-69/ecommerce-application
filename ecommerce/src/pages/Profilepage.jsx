import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../headcomponents/Header';
import { useNavigate } from 'react-router-dom';

const Profilepage = () => {
    const navigate=useNavigate();
    const [det, setDet] = useState(null);  
    const [addresses, setAddresses] = useState([]); 
    const [einput, setEinput] = useState(false); 
    
   
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [district, setDistrict] = useState('');
    const [mandel, setMandel] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState(false); 

    const name = localStorage.getItem('name'); 


    useEffect(() => {
        const headers = {
            token: localStorage.getItem('token')  
        };
        axios
            .get('http://localhost:8080/api/userdetails', { headers })
            .then((res) => {
                console.log(res); 
                if (res.data.data) {
                    setDet(res.data.data);
                    setAddresses(res.data.data.addressdetails || []);
                }
            })
            .catch((err) => {
                if(err.response.data.message==="unauthorised user"){
                    alert("token expired")
                    navigate("/userlogin")
                }
            });
    }, []);

    const handleAddAddress = () => {
        if (loading) return;  
        setLoading(true);

        if (!street || !city || !state || !district || !mandel || !postalCode || !phoneNumber) {
            alert('Please fill all the fields');
            setLoading(false);
            return;
        }

        const newAddress = { street, city, state, district, mandel, postalCode, phoneNumber };

        const headers = {
            token: localStorage.getItem('token')
        };

        axios
            .post('http://localhost:8080/api/add-address', newAddress, { headers })
            .then((res) => {
                console.log('Address added successfully', res.data);
                setEinput(false);  
                resetForm();  
                setLoading(false);  
                setAddresses([...addresses, newAddress]);  
                setError(null); 
            })
            .catch((err) => {
                console.log('Error adding address:', err);
                if(err.response.data.message==="unauthorised user"){
                    alert("token expired")
                    navigate("/userlogin")
                }
                setError('Failed to add address. Please try again later.');
                setLoading(false);  
            });
    };

    const resetForm = () => {
        setStreet('');
        setCity('');
        setState('');
        setDistrict('');
        setMandel('');
        setPostalCode('');
        setPhoneNumber('');
    };



    const handledeleteaddress=(address,index)=>{
        const data={
            index:index
        }
        const headers={
            token:localStorage.getItem("token")
        }
      axios.post('http://localhost:8080/api/deleteaddress',data,{headers})
      .then((res)=>{
        console.log(res)
        if(res.data.message==="Address deleted successfully"){
            alert("address deleted successfully...")
            window.location.reload();
        }

      })
      .catch((err)=>{
        console.log(err)
        if(err.response.data.message==="unauthorised user"){
            alert("token expired")
            navigate("/userlogin")
        }
      })
    }
    return (
        <>
        <Header/>
        <div className="w-full p-6 flex justify-center items-center flex-col">
            <h1 className="text-2xl font-bold text-center mb-6">{name}'s Profile Details</h1>
            
            {error && <div className="text-red-500 mt-4">{error}</div>}
            
            {det ? (
                <div className="w-10/12">
                    <div className="mb-4">
                        <h3 className="font-semibold">Name:</h3>
                        <p>{det.name || 'No name available'}</p>
                    </div>

                    <div className="mb-4">
                        <h3 className="font-semibold">Email:</h3>
                        <p>{det.email || 'No email available'}</p>
                    </div>

                    <div className="mb-4">
                        <h3 className="font-semibold">Mobile:</h3>
                        <p>{det.mobile || 'No mobile available'}</p>
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between">
                            <h3 className="font-semibold">Address: </h3>
                            <button 
                                className="bg-green-700 px-4 py-1 rounded-lg"
                                onClick={() => setEinput(!einput)} 
                            >
                                Add Address
                            </button>
                        </div>

                        {addresses.length > 0 ? (
                            addresses.map((address, index) => (
                                <div key={index} className="mt-4 border-2 border-zinc-800 p-5 max-sm:overflow-hidden rounded-lg">
                                    <p><strong>Street:</strong> {address.street || 'Not provided'}</p>
                                    <p><strong>City:</strong> {address.city || 'Not provided'}</p>
                                    <p><strong>State:</strong> {address.state || 'Not provided'}</p>
                                    <p><strong>District:</strong> {address.district || 'Not provided'}</p>
                                    <p><strong>Mandel:</strong> {address.mandel || 'Not provided'}</p>
                                    <p><strong>Postal Code:</strong> {address.postalCode || 'Not provided'}</p>
                                    <p><strong>Phone:</strong> {address.phoneNumber || 'Not provided'}</p>
                                    <div className='w-full flex justify-end items-end'><button onClick={(e)=>handledeleteaddress(address,index)} className='bg-red-600 px-5 py-1 rounded-md'>Delete</button></div>
                                </div>
                            ))
                        ) : (
                            <p>No address provided.</p>
                        )}
                    </div>

            
                    {einput && (
                        <div className="mt-6">
                            <h3 className="font-semibold mb-4">Add New Address</h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    name="street"
                                    value={street}
                                    onChange={(e) => setStreet(e.target.value)}
                                    placeholder="Street"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                                <input
                                    type="text"
                                    name="city"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="City"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                                <input
                                    type="text"
                                    name="state"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    placeholder="State"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                                <input
                                    type="text"
                                    name="district"
                                    value={district}
                                    onChange={(e) => setDistrict(e.target.value)}
                                    placeholder="District"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                                <input
                                    type="text"
                                    name="mandel"
                                    value={mandel}
                                    onChange={(e) => setMandel(e.target.value)}
                                    placeholder="Mandel"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                    placeholder="Postal Code"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="Phone Number"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                                <button
                                    type="button"
                                    className="bg-blue-500 text-white px-6 py-2 rounded-md w-full"
                                    onClick={handleAddAddress} 
                                    disabled={loading} 
                                >
                                    {loading ? 'Saving...' : 'Save Address'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
        </>
    );
};

export default Profilepage;
