import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'; // Import the Link component from 'react-router-dom'
import './App.css'

// npm install aos [animate onscroll]
import AOS from 'aos' 
import 'aos/dist/aos.css'


function NavBar() {

  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  const [isVisible, setIsVisible] = useState(false); // State to control visibility

  const handleButtonClick = () => {
      setIsVisible(!isVisible); // Toggle the visibility
  };

  const [isVisible2, setIsVisible2] = useState(false); // State to control visibility

  const handleButtonClick2 = () => {
      setIsVisible2(!isVisible2); // Toggle the visibility
  };


  return (
    <>
    <div className='w-100 d-flex shadow justify-content-between align-items-center px-1 ' style={{height: '80px', backgroundColor: 'white', zIndex: '99999'}}>

        <div className=' d-flex '>
        <img src="logo.png" alt="" style={{width: '150px'}} data-aos="fade-right" />
        </div>

        <div className='d-lg-flex d-none h-100 justify-content-center align-items-center gap-4 px-2' style={{fontSize: '16px'}}>

        <div className='' data-aos="fade-down" data-aos-delay="100" >
        <Link to='/' style={{textDecoration: 'none', color: 'black', fontWeight: '300', fontSize: '14px'}}>Route</Link>
        </div>

        <div data-aos="fade-down" data-aos-delay="200">
        <Link to='heatmap' style={{textDecoration: 'none', color: 'black', fontWeight: '300', fontSize: '14px'}} >Heatmap</Link>
        </div>

        <div data-aos="fade-down" data-aos-delay="400">
        <Link to='about' style={{textDecoration: 'none', color: 'black', fontWeight: '300', fontSize: '14px'}} >About</Link>
        </div>


        <div  className='d-flex gap-2' >

        <div data-aos="fade-down" data-aos-delay="600">
          <Link to='/login'  className='btn btn-outline-primary' style={{textDecoration: 'none', fontWeight: '300', fontSize: '14px'}} >Admin</Link>
        </div>

        </div>
        </div>

        {/** Mid Screen View  */}
        <div className='d-lg-none d-md-flex d-none gap-2 justify-content-center align-items-center px-2'>
        <div data-aos="fade-down" data-aos-delay="100">
          <Link to='/login' className='btn btn-primary ' style={{textDecoration: 'none', color: 'white', fontWeight: '300', fontSize: '14px'}} >Admin</Link>
        </div>


        <div data-aos="fade-down" data-aos-delay="300" className='' onClick={handleButtonClick}>
          <p  className='btn btn-outline-primary m-0' style={{textDecoration: 'none', fontSize: '16px'}} ><i className='bi-list'></i></p>
        </div>

        </div>

            {/** Small Screen View  */}
            <div className='d-lg-none d-md-none d-flex gap-2  justify-content-center align-items-center px-2'>

        <div onClick={handleButtonClick2} data-aos="fade-down" data-aos-delay="100">
          <p  className='btn btn-outline-primary m-0' style={{textDecoration: 'none', fontSize: '14px'}} ><i className='bi-list'></i></p>
        </div>

        </div>

    </div>

    {isVisible && ( 
    <div className='position-fixed w-25 d-flex justify-content-center align-items-center p-2' style={{zIndex: '99999', right: '0'}} >
        <div className='d-flex bg-light w-100 d-flex justify-content-center text-center align-items-center rounded p-3'>
        <div className='d-flex flex-column gap-3 ' style={{fontSize: '16px'}}>
        <div className='' >
        <Link to='/' style={{textDecoration: 'none', color: 'black', fontWeight: '300', fontSize: '14px'}}>Route</Link>
        </div>

        <div>
        <Link to='heatmap' style={{textDecoration: 'none', color: 'black', fontWeight: '300', fontSize: '14px'}} >Heatmap</Link>
        </div>

        <div>
        <Link to='about' style={{textDecoration: 'none', color: 'black', fontWeight: '300', fontSize: '14px'}} >About</Link>
        </div>

        </div>

        </div>
    </div>
    )}

{isVisible2 && ( 
    <div className='w-100 d-flex justify-content-center align-items-center' style={{zIndex: '99999'}}>
        <div className='d-flex bg-light w-100 d-flex justify-content-center text-center align-items-center p-3'>
        <div className='d-flex flex-column gap-3 ' style={{fontSize: '14px'}}>
          
        <div className='' >
        <Link to='/' style={{textDecoration: 'none', color: 'black', fontWeight: '300', fontSize: '14px'}}>Route</Link>
        </div>

        <div>
        <Link to='heatmap' style={{textDecoration: 'none', color: 'black', fontWeight: '300', fontSize: '14px'}} >Heatmap</Link>
        </div>

        <div>
        <Link to='about' style={{textDecoration: 'none', color: 'black', fontWeight: '300', fontSize: '14px'}} >About</Link>
        </div>


        <div className='d-flex  gap-2'>

        <div>
          <Link to='/login'  className='btn btn-outline-primary' style={{textDecoration: 'none', fontSize: '14px'}} >Admin</Link>
        </div>
        </div>
        </div>

        </div>
    </div>
    )}
    </>
  )
}

export default NavBar