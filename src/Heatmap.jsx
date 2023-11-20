import React, { useEffect, useState } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './style.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';

function HeatMap() {
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [district, setDistrict] = useState('');
    const [category, setCategory] = useState('');
    const [mapHtml, setMapHtml] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    // State to control visibility
    const [initialContentVisible, setInitialContentVisible] = useState(true);

    const handleButtonClick2 = () => {
      setInitialContentVisible(!initialContentVisible);
    };

    const [isVisible, setIsVisible] = useState(false); // State to control visibility

    const handleButtonClick = () => {
        setIsVisible(!isVisible); // Toggle the visibility
    };


    const [isVisibleMobile, setIsVisibleMobile] = useState(true);

    const handleStartFiltering = () => {
      // Toggle visibility when the button is clicked
      setIsVisibleMobile(!isVisibleMobile);
    };
  

    useEffect(() => {
      const map = L.map('map').setView([10.706512, 122.581742], 12);

      const mapboxToken = 'sk.eyJ1Ijoiam5ibGxkIiwiYSI6ImNsbmg2amx6MzFibDQycnFwdnpiZHd6eGUifQ.zpQQzIAwESP9M_HVwQ02Vw'; // Replace with your Mapbox access token
       
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
      }).addTo(map);
    
      
      // Move zoom control to upper right corner
      map.zoomControl.remove();
      L.control.zoom({ position: 'topright' }).addTo(map);
  
    
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const data = {
            day: day,
            month: month,
            year: year,
            district: district,
            category: category
        };

        console.log(data)
        
        try {
            const response = await axios.post('https://thesis-backend-41ta.onrender.com/heatmap', data);
            console.log(response.data);
            setMapHtml(response.data.html);
            setSubmitted(true);
        } catch (error) {
            console.error('Error:', error);
        }
        
    };
    


    return (
        <>
      <div className='position-relative'>
        <div className='w-100 m-0 vh-100'>
          {!submitted && (
            <div id="map" style={{ display: 'block', width: '100%', height: '100%', position: 'relative' }}></div>
          )}
          <div dangerouslySetInnerHTML={{ __html: mapHtml }} />
        </div>

    {initialContentVisible ? (
        <div className="d-lg-flex shadow border rounded d-md-flex py-4 px-4 d-sm-flex d-none flex-column gap-2 col-lg-3 col-md-4 col-sm-5 col-12" style={{  backgroundColor: 'white', position: 'absolute', top: '10px', left: '10px', zIndex: 999, fontSize: '14px'}}>  
            <div className=' text-start'>
            <h4 className=''>
                <b>
                  Crime Pattern Analysis

                </b>
              </h4>
                <p>
                Please use the dropdowns to select your preferences and visualize credible crime data in heatmaps for Iloilo City. This data is sourced from the local police, ensuring reliability and accuracy. Your selections will help generate visual representations of crime patterns, providing valuable insights into the city's safety and security.

                </p>
                <div className='d-flex gap-2'>
                <button className='btn btn-primary' onClick={handleButtonClick2}>Start filtering</button>
                <button className='btn btn-outline-primary'>Learn more</button>

                </div>
            </div>
        </div>
    ) : (
      <div className="d-lg-flex shadow border rounded d-md-flex py-4 px-3 d-sm-flex d-none flex-column gap-2 col-lg-3 col-md-4 col-sm-5 col-12" style={{  backgroundColor: 'white', position: 'absolute', top: '10px', left: '10px', zIndex: 999, fontSize: '14px'}}>

       <form onSubmit={handleSubmit} className=' text-start d-flex flex-column'>
       <p className='p-0 fw-bold '>MAIN FILTER</p>
            <div className=' gap-2 d-flex'>
               <select className='rounded-5 px-3 py-1' value={day} onChange={e => setDay(e.target.value)} 
                style={{width: '100%', outline: 'none', border: '1px solid gray'}}
                >
                   <option value="" disabled selected>Select a Day</option>
                   <option value="">All Day</option>
                   <option value="Monday">Monday</option>
                   <option value="Tuesday">Tuesday</option>
                   <option value="Wednesday">Wednesday</option>
                   <option value="Thursday">Thursday</option>
                   <option value="Friday">Friday</option>
                   <option value="Saturday">Saturday</option>
                   <option value="Sunday">Sunday</option>
               </select>
           </div>

            <div className=' gap-2 d-flex mt-2'>
               <select className='rounded-5 px-3 py-1' value={month} onChange={e => setMonth(e.target.value)} 
                style={{width: '100%', outline: 'none', border: '1px solid gray'}}
                >
                    <option value="" disabled selected>Select a Month</option>
                   <option value="">All Months</option>
                   <option value="January">January</option>
                   <option value="February">February</option>
                   <option value="March">March</option>
                   <option value="April">April</option>
                   <option value="May">May</option>
                   <option value="June">June</option>
                   <option value="July">July</option>
                   <option value="August">August</option>
                   <option value="September">September</option>
                   <option value="October">October</option>
                   <option value="November">November</option>
                   <option value="December">December</option>
               </select>
           </div>
           
           <div className=' gap-2 d-flex mt-2'>
               <select className='rounded-5 px-3 py-1' value={year} onChange={e => setYear(e.target.value)} 
                style={{width: '100%', outline: 'none', border: '1px solid gray'}}
                >
                    <option value="" disabled selected>Select a Year</option>
                   <option value="">All Year</option>
                   <option value="2018">2018</option>
                   <option value="2019">2019</option>
                   <option value="2020">2020</option>
                   <option value="2021">2021</option>
                   <option value="2022">2022</option>
                   <option value="2023">2023</option>
               </select>
           </div>


           <div className=' gap-2 d-flex mt-2'>
               <select className='rounded-5 px-3 py-1' value={district} onChange={e => setDistrict(e.target.value)} 
                style={{width: '100%', outline: 'none', border: '1px solid gray'}}
                >
                    <option value="" disabled selected>Select a District</option>
                   <option value="">All Districts</option>
                   <option value="Arevalo">Arevalo</option>
                   <option value="Mandurriao">Mandurriao</option>
                   <option value="Jaro">Jaro</option>
                   <option value="Molo">Molo</option>
                   <option value="City Proper">City Proper</option>
                   <option value="Lapaz">Lapaz</option>
                   {/* Add more options as needed */}
               </select>
           </div>


           <div className=' gap-2 d-flex mt-2'>
               <select className='rounded-5 px-3 py-1' value={category} onChange={e => setCategory(e.target.value)} 
                style={{width: '100%', outline: 'none',  border: '1px solid gray'}}
                >
                    <option value="" disabled selected>Select a Category</option>
                   <option value="">All Categories</option>
                   <option value="Crimes Against Personal Liberty And Security">Crimes Against Personal Liberty And Security</option>
                   <option value="Crimes Against Persons">Crimes Against Persons</option>
                   <option value="Crimes Against Property">Crimes Against Property</option>
                   <option value="Final Provisions">Final Provisions</option>
                   <option value="Crimes Against Honor">Crimes Against Honor</option>
                   <option value="Crimes Committed By Public Officers">Crimes Committed By Public Officers</option>
                   <option value="Quasi-Offenses">Quasi-Offenses</option>
                   <option value="Crimes Against National Security & The Law Of The Nations">Crimes Against National Security & The Law Of The Nations</option>
                   <option value="Crimes Against Public Order">Crimes Against Public Order</option>
                   <option value="Crimes Against The Civil Status Of Persons">Crimes Against The Civil Status Of Persons</option>
                   <option value="Crimes Against Popular Representation">Crimes Against Popular Representation</option>
                   <option value="Crimes Against Public Interest">Crimes Against Public Interest</option>
                   <option value="Presedential Decree">Presedential Decree</option>
                   <option value="Crimes Against The Fundamental Laws Of The State">Crimes Against The Fundamental Laws Of The State</option>
                   <option value="Crimes Against Chastity">Crimes Against Chastity</option>
                   <option value="Crimes Against Public Morals">Crimes Against Public Morals</option>
               </select>
           </div>


           <div className='px-3 d-flex justify-content-end mt-2'>
           <input style={{fontSize: '14px'}} className='btn btn-primary px-3 py-1' type="submit" value="Apply Filters" />
           </div>
       </form>

     </div>
        )}




{isVisibleMobile && (
        <div className="d-lg-none  d-md-none py-4 px-4 d-sm-none d-flex flex-column gap-2 col-lg-3 col-md-4 col-sm-5 col-12" style={{ backgroundColor: 'white', position: 'absolute', top: '0', left: '0', zIndex: 9999, fontSize: '14px' }}>
          <div className='text-start'>
            <h4>
              <b>
                Crime Pattern Analysis
              </b>
            </h4>
            <p>
              Please use the dropdowns to select your preferences and visualize credible crime data in heatmaps for Iloilo City. This data is sourced from the local police, ensuring reliability and accuracy. Your selections will help generate visual representations of crime patterns, providing valuable insights into the city's safety and security.
            </p>
            <div className='d-flex gap-2'>
              <button className='btn btn-primary' onClick={handleStartFiltering}>Start filtering</button>
              <button className='btn btn-outline-primary'>Learn more</button>
            </div>
          </div>
        </div>
      )}


    <button
        className="bi-stack btn btn-primary d-lg-none d-md-none d-sm-none d-block "
        style={{
            borderRadius: '10px',
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 999,
            fontSize: '14px',
        }}
        onClick={handleButtonClick} // Add an onClick handler to toggle visibility
    >
       &nbsp; Heatmap 
    </button>

    {isVisible && ( // Conditionally render the second form based on isVisible state

      <div className="d-lg-none  d-md-none py-4 px-3 d-sm-none d-flex flex-column gap-2 col-3 col-md-4 col-sm-5 col-12" style={{  backgroundColor: 'white', position: 'absolute', top: '0', left: '0', zIndex: 999, fontSize: '14px'}}>
   <form onSubmit={handleSubmit} className=' text-start d-flex flex-column'>
       <p className='p-0 fw-bold '>MAIN FILTER</p>
            <div className=' gap-2 d-flex'>
               <select className='rounded-5 px-3 py-1' value={day} onChange={e => setDay(e.target.value)} 
                style={{width: '100%', outline: 'none',  border: '1px solid gray'}}
                >
                   <option value="" disabled selected>Select a Day</option>
                   <option value="">All Day</option>
                   <option value="Monday">Monday</option>
                   <option value="Tuesday">Tuesday</option>
                   <option value="Wednesday">Wednesday</option>
                   <option value="Thursday">Thursday</option>
                   <option value="Friday">Friday</option>
                   <option value="Saturday">Saturday</option>
                   <option value="Sunday">Sunday</option>
               </select>
           </div>

            <div className=' gap-2 d-flex mt-2'>
               <select className='rounded-5 px-3 py-1' value={month} onChange={e => setMonth(e.target.value)} 
                style={{width: '100%', outline: 'none', border: '1px solid gray'}}
                >
                    <option value="" disabled selected>Select a Month</option>
                   <option value="">All Months</option>
                   <option value="January">January</option>
                   <option value="February">February</option>
                   <option value="March">March</option>
                   <option value="April">April</option>
                   <option value="May">May</option>
                   <option value="June">June</option>
                   <option value="July">July</option>
                   <option value="August">August</option>
                   <option value="September">September</option>
                   <option value="October">October</option>
                   <option value="November">November</option>
                   <option value="December">December</option>
               </select>
           </div>
           
           <div className=' gap-2 d-flex mt-2'>
               <select className='rounded-5 px-3 py-1' value={year} onChange={e => setYear(e.target.value)} 
                style={{width: '100%', outline: 'none',  border: '1px solid gray'}}
                >
                    <option value="" disabled selected>Select a Year</option>
                   <option value="">All Year</option>
                   <option value="2018">2018</option>
                   <option value="2019">2019</option>
                   <option value="2020">2020</option>
                   <option value="2021">2021</option>
                   <option value="2022">2022</option>
                   <option value="2023">2023</option>
               </select>
           </div>


           <div className=' gap-2 d-flex mt-2'>
               <select className='rounded-5 px-3 py-1' value={district} onChange={e => setDistrict(e.target.value)} 
                style={{width: '100%', outline: 'none', border: '1px solid gray'}}
                >
                    <option value="" disabled selected>Select a District</option>
                   <option value="">All Districts</option>
                   <option value="Arevalo">Arevalo</option>
                   <option value="Mandurriao">Mandurriao</option>
                   <option value="Jaro">Jaro</option>
                   <option value="Molo">Molo</option>
                   <option value="City Proper">City Proper</option>
                   <option value="Lapaz">Lapaz</option>
                   {/* Add more options as needed */}
               </select>
           </div>


           <div className=' gap-2 d-flex mt-2'>
               <select className='rounded-5 px-3 py-1' value={category} onChange={e => setCategory(e.target.value)} 
                style={{width: '100%', outline: 'none',  border: '1px solid gray'}}
                >
                    <option value="" disabled selected>Select a Category</option>
                   <option value="">All Categories</option>
                   <option value="Crimes Against Personal Liberty And Security">Crimes Against Personal Liberty And Security</option>
                   <option value="Crimes Against Persons">Crimes Against Persons</option>
                   <option value="Crimes Against Property">Crimes Against Property</option>
                   <option value="Final Provisions">Final Provisions</option>
                   <option value="Crimes Against Honor">Crimes Against Honor</option>
                   <option value="Crimes Committed By Public Officers">Crimes Committed By Public Officers</option>
                   <option value="Quasi-Offenses">Quasi-Offenses</option>
                   <option value="Crimes Against National Security & The Law Of The Nations">Crimes Against National Security & The Law Of The Nations</option>
                   <option value="Crimes Against Public Order">Crimes Against Public Order</option>
                   <option value="Crimes Against The Civil Status Of Persons">Crimes Against The Civil Status Of Persons</option>
                   <option value="Crimes Against Popular Representation">Crimes Against Popular Representation</option>
                   <option value="Crimes Against Public Interest">Crimes Against Public Interest</option>
                   <option value="Presedential Decree">Presedential Decree</option>
                   <option value="Crimes Against The Fundamental Laws Of The State">Crimes Against The Fundamental Laws Of The State</option>
                   <option value="Crimes Against Chastity">Crimes Against Chastity</option>
                   <option value="Crimes Against Public Morals">Crimes Against Public Morals</option>
               </select>
           </div>


           <div className='px-3 d-flex justify-content-end mt-2 gap-2'>
           <button className="btn btn-outline-primary  d-flex gap-1" onClick={handleButtonClick}>
   <i className='bi-arrow-left m-0'></i> <p className='m-0' style={{fontSize: '16px'}}>  Back </p>
  </button>

           <input style={{fontSize: '16px'}} className='btn btn-primary px-3 py-1' type="submit" value="Apply Filters" />
           </div>
       </form>
      </div>
    )}

      </div>

        </>
        
    );
}

export default HeatMap;
