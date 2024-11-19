import React, { Children } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Adminsignup from './admin/Adminsignup'
import Adminlogin from './admin/Adminlogin'
import Createproducts from './admin/Createproducts'
import Editproducts from './admin/Editproducts'
import Home from './user/Home'
import Productpage from './pages/Productpage'
import Usersignup from './user/Usersignup'
import Userlogin from './user/Userlogin'
import Cartpage from './pages/Cartpage'
import Profilepage from './pages/Profilepage'
import OrdersPage from './pages/OrdersPage'
import AdminOrdersPage from './admin/AdminOrdersPage'
import NotFoundPage from './pages/NotFoundPage'

const App = () => {
  const Privatelement=({children})=>{
    const user=localStorage.getItem("role");
    if(user==="admin"){
      return <>{children}</>
    }
    else{
      return (
        <div className='h-screen w-full flex justify-center items-center text-[7vw] font-bold'>UNAUTHORIZED ACCESS</div>
      )
    }

  }

  const Publicelement=({children})=>{
    const user=localStorage.getItem('role');
    if(user==="user"){
      return <>{children}</>
    }
    else{
      return(
        <div className='h-screen w-full flex justify-center items-center text-[7vw] font-bold'>UNAUTHORIZED ACCESS</div>
      )
    }
  }
  return (
  <>
 <BrowserRouter>

 <Routes>
  <Route path='/home' element={<Home/>}></Route>

  <Route path='/adminsignup' element={<Adminsignup/>}></Route>
  <Route path='/adminlogin' element={<Adminlogin/>}></Route>
  <Route path='/addproducts' element={<Privatelement><Createproducts/></Privatelement>}></Route>
  <Route path='/editproducts/:id' element={<Privatelement><Editproducts/></Privatelement>}></Route>
  <Route path='/admin/orders' element={<Privatelement><AdminOrdersPage/></Privatelement>}></Route>

  <Route path='/product/:id' element={<Publicelement><Productpage/></Publicelement>}></Route>

  <Route path='/usersignup' element={<Usersignup/>}></Route>
  <Route path='/userlogin' element={<Userlogin/>}></Route> 
  <Route path='/profile' element={<Publicelement><Profilepage/></Publicelement>}></Route>
  <Route path='/cart' element={<Publicelement><Cartpage/></Publicelement>}></Route>
  <Route path='/orders' element={<Publicelement><OrdersPage/></Publicelement>}></Route>
  <Route path='*' element={<NotFoundPage/>}></Route>
  
  
  </Routes>

 </BrowserRouter>

  </>
  )
}

export default App