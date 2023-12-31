import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './style.css';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';

function Home() {
  
  const [showStartMapping, setShowStartMapping] = useState(true); // Add this state variable
  const [showCodeBlock, setShowCodeBlock] = useState(false); // Step 1: Create a state variable for visibility

    // Step 2: Define a function to toggle the visibility of the code block
    const toggleCodeBlockVisibility = () => {
      setShowCodeBlock((prev) => !prev); // Toggle the state
    };
  
  const [message, setMessage] = useState('');
  const [mapVisible, setMapVisible] = useState('initial');
  const [displayMap, setDisplayMap] = useState('map');
  const [submitted, setSubmitted] = useState(false);

  const [selectedMap, setSelectedMap] = useState('safest');

  const [startMarker, setStartMarker] = useState(null);
  const [endMarker, setEndMarker] = useState(null);
  const [safestPathMapHtml, setSafestPathMapHtml] = useState('');
  const [shortestPathMapHtml, setShortestPathMapHtml] = useState('');
  const [safestPathWeight, setSafestPathWeight] = useState(0);
  const [shortestPathWeight, setShortestPathWeight] = useState(0);
  const [shortestPathGMaps, setShortestPathGMaps] = useState('');
  const [safestPathGMaps, setSafestPathGMaps] = useState('');

  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);

  const [loading, setLoading] = useState(false);


  // Create a ref for the startLocation input field
  const startLocationInputRef = useRef(null);
  

  useEffect(() => {
    axios
      .get('https://thesis-backend-41ta.onrender.com/')
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  useEffect(() => {
    const map = L.map('map').setView([10.706512, 122.581742], 14);

    const mapboxToken = 'sk.eyJ1Ijoiam5ibGxkIiwiYSI6ImNsbmg2amx6MzFibDQycnFwdnpiZHd6eGUifQ.zpQQzIAwESP9M_HVwQ02Vw'; // Replace with your Mapbox access token
     
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);
  
    
    // Move zoom control to upper right corner
    map.zoomControl.remove();
    L.control.zoom({ position: 'topright' }).addTo(map);

    const blueIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const redIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const startMarker = L.marker([10.706512, 122.581742], { draggable: true, icon: blueIcon }).addTo(map);
    const endMarker = L.marker([10.706512, 122.582742], { draggable: true, icon: redIcon }).addTo(map);

    setStartMarker(startMarker);
    setEndMarker(endMarker);

    window.setCurrentLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          var latlng = new L.LatLng(position.coords.latitude, position.coords.longitude);
          startMarker.setLatLng(latlng);
        });
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    };

    
  }, []);

  const submitLocations = async () => {
    if (startMarker && endMarker) {
    setLoading(true); // Set loading to true when submitting

    const startLatLng = startMarker.getLatLng();
    const endLatLng = endMarker.getLatLng();

    const startLat = startLatLng.lat;
    const startLng = startLatLng.lng;
    const endLat = endLatLng.lat;
    const endLng = endLatLng.lng;

    try {
      const response = await axios.post('https://thesis-backend-41ta.onrender.com/find_path', {
        start_lat: startLat,
        start_lon: startLng,
        end_lat: endLat,
        end_lon: endLng,
      });

      const {
        safest_path_map_html,
        shortest_path_map_html,
        safest_path_weight,
        shortest_path_weight,
        google_maps_url_shortest,
        google_maps_url_safest,
      } = response.data;

      setSafestPathMapHtml(safest_path_map_html);
      setShortestPathMapHtml(shortest_path_map_html);
      setSafestPathWeight(safest_path_weight);
      setShortestPathWeight(shortest_path_weight);
      setShortestPathGMaps(google_maps_url_shortest);
      setSafestPathGMaps(google_maps_url_safest);
      
      setSelectedMap('safest');
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting locations:', error);
    } finally{
      setLoading(false); // Set loading to false regardless of success or failure
    }
  }
};

  const handleClickSafest = () => {
    setSelectedMap('shortest');
  };

  const handleClickShortest = () => {
    setSelectedMap('safest');
  };

  const searchLocations = async (inputId, inputValue) => {
    const accessToken = 'sk.eyJ1Ijoiam5ibGxkIiwiYSI6ImNsbmg2amx6MzFibDQycnFwdnpiZHd6eGUifQ.zpQQzIAwESP9M_HVwQ02Vw'; // Replace with your Mapbox access token
    const geocoderUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(inputValue)}.json?access_token=${accessToken}`;

    try {
      const response = await axios.get(geocoderUrl);
      const suggestions = response.data.features.map((feature) => feature.place_name);

      if (inputId === 'startLocation') {
        setStartSuggestions(suggestions);
      } else if (inputId === 'endLocation') {
        setEndSuggestions(suggestions);
      }
    } catch (error) {
      console.error('Error searching for locations:', error);
    }
  };

  const geocodeLocation = async (location, markerType) => {
    const accessToken = 'sk.eyJ1Ijoiam5ibGxkIiwiYSI6ImNsbmg2amx6MzFibDQycnFwdnpiZHd6eGUifQ.zpQQzIAwESP9M_HVwQ02Vw'; // Replace with your Mapbox access token
    const geocoderUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${accessToken}`;

    try {
      const response = await axios.get(geocoderUrl);
      const coordinates = response.data.features[0].geometry.coordinates;

      const latLng = new L.LatLng(coordinates[1], coordinates[0]);

      if (markerType === 'startMarker') {
        startMarker.setLatLng(latLng);
      } else if (markerType === 'endMarker') {
        endMarker.setLatLng(latLng);
      }
    } catch (error) {
      console.error(`Error geocoding ${markerType}:`, error);
    }
  };

  const handleSuggestionClick = (suggestion, inputId) => {
    if (inputId === 'startLocation') {
      setStartLocation(suggestion);
      setStartSuggestions([]);
      geocodeLocation(suggestion, 'startMarker');
    } else if (inputId === 'endLocation') {
      setEndLocation(suggestion);
      setEndSuggestions([]);
      geocodeLocation(suggestion, 'endMarker');
    }
  };
  const handleSubmit = () => {
    submitLocations();
  };

  const handleCurrentLocation = () => {
    setCurrentLocation();
    // Set the value of the startLocation input to "My Location"
    setStartLocation("My Location");
    // Update the state variable startLocation
    startLocationInputRef.current.value = "My Location";
  };
  
  // Define a function to handle the "Start Mapping" button click
  const handleStartMappingClick = () => {
    setShowStartMapping(false); // Set the state to hide the "Start Mapping" section
  };

  return (
    <>
      <div className='position-relative '>
        {showStartMapping ? ( // Render the "Start Mapping" section conditionally
          <div data-aos="fade-right" data-aos-delay="100" className="desc d-lg-flex d-md-flex d-sm-flex flex-column gap-2 col-lg-4 col-md-5 col-sm-6 col-12 d-none text-start rounded" style={{ backgroundColor: 'white', position: 'absolute', top: '10px', left: '10px', zIndex: 9999, fontSize: '16px' }}>
           
           <div className='p-3' >
            <div className=''>
              <h4 className='' >
                  Safe Route Recommendation
              </h4>
            </div>

            <div>
              <p style={{fontWeight: '300', fontSize: '14px'}}>
                SafetyPin is a route finding application that offers users credible safety route recommendations based on police data,
                enhancing users' security and guiding them away from crime-prone areas.
              </p>
            </div>

            <div className='d-flex gap-2'>
              <button className='btn btn-primary desc' style={{fontWeight: '300', fontSize: '14px'}} onClick={handleStartMappingClick}>
                Start Mapping
              </button>

              <button className='btn btn-outline-primary desc' style={{fontWeight: '300', fontSize: '14px' }} onClick={handleStartMappingClick}>
                Learn more
              </button>

            </div>
            </div>

          </div>
        ) : (
      <div className=" desc d-lg-flex d-md-flex d-sm-flex d-none flex-column gap-2 col-lg-4 col-md-5 col-sm-6 col-12" style={{ borderRadius: '10px', backgroundColor: 'white', position: 'absolute', top: '10px', left: '10px', zIndex: 999, fontSize: '16px'}}>
        <div className='p-3'>

        <div className="  " >
          <div className='d-flex justify-content-between align-items-center '>
          <p className='desc p-0 my-3' style={{fontWeight: '500', fontSize: '14px'}}>SEARCH PLACES</p>
          <p onClick={handleCurrentLocation} className='desc p-0 m-0 btn btn-outline-primary p-2' style={{fontWeight: '300', fontSize: '14px'}}><i className='bi-send'></i> &nbsp;Find me</p>
          </div>
          
          
          <div className='position-relative '>

          <div className='d-flex gap-2 justify-content-center align-items-center'>
            <div className='h-100 d-flex  justify-content-center align-items-center '>
            <p className='rounded-circle px-1 perfect-circle m-0  d-flex  justify-content-center align-items-center bg-primary text-light'>A</p>
            </div>
            <input
            type="text"
            id="startLocation"
            placeholder="Start location..."
            value={startLocation}
            onChange={(e) => {
              setStartLocation(e.target.value);
              searchLocations('startLocation', e.target.value);
            }}
            style={{width: '100%', outline: 'none', border: '1px solid gray', fontWeight: '300', fontSize: '14px'}}
            className=' rounded-5 px-3 py-1'
            ref={startLocationInputRef}
          />

          </div>
          {startSuggestions.length > 0 && (
            <div className="suggestions position-absolute bg-white w-100 shadow p-2 mt-1" style={{zIndex: '999'}}>
              {startSuggestions.map((suggestion, index) => (
                <p className='text-start' key={index} onClick={() => handleSuggestionClick(suggestion, 'startLocation')}>
                  {suggestion}
                </p>
              ))}
            </div>
          )}
          </div>

          <div className=' text-start px-2' >
          <i className='text-start bi-arrow-down'></i>
          </div>

          <div className='position-relative mb-3'>
          <div className='d-flex gap-2 justify-content-center align-items-center '>
          <div className='h-100 d-flex  justify-content-center align-items-center '>
            <p className='rounded-circle px-1 perfect-circle m-0  d-flex  justify-content-center align-items-center bg-primary text-light'>B</p>
            </div>

            <input
            type="text"
            id="endLocation"
            placeholder="Destination..."
            value={endLocation}
            onChange={(e) => {
              setEndLocation(e.target.value);
              searchLocations('endLocation', e.target.value); 
            }}
            style={{width: '100%', outline: 'none', border: '1px solid gray', fontWeight: '300', fontSize: '14px'}}
            className=' rounded-5 px-3 py-1'
  
          />

            </div>
            {endSuggestions.length > 0 && (
            <div className="suggestions position-absolute bg-white w-100 shadow p-2 mt-1">
              {endSuggestions.map((suggestion, index) => (
                <p className='text-start' key={index} onClick={() => handleSuggestionClick(suggestion, 'endLocation')}>
                  {suggestion}
                </p>
              ))}
            </div>
          )}
          </div>
                
         

        </div>

        <div className='d-flex gap-2 justify-content-end align-items-center'>
          <button className="btn btn-primary  d-flex gap-1" onClick={handleSubmit}>
           <i className='desc bi-arrow-right-circle text-light m-0'></i> <p className='m-0' style={{fontWeight: '300', fontSize: '14px'}}>  See Directions </p>
          </button>
          </div>

          </div>

        {submitted && (
          <>
            <div className='d-flex flex-column  gap-2 p-3 rounded-bottom ' style={{marginTop: '-40px'}}>
              <div>
              <p className='p-0 my-2 ' style={{fontWeight: '500', fontSize: '14px'}}>ROUTES</p>
              </div>
            <div className="p-2 rounded  text-start  bg-light " onClick={handleClickShortest} style={{cursor: 'pointer'}}>
              <p className='m-0 text-start' style={{fontWeight: '300', fontSize: '14px'}}>
                Route type: <b> Safest </b> 
              </p>
              <p className='m-0 p-0' style={{fontWeight: '300', fontSize: '14px'}}>Risk Index: <i className='btn btn-primary px-3 py-1' style={{fontWeight: '300', fontSize: '14px'}}> {safestPathWeight} </i> </p>
              <a href={safestPathGMaps} target='_blank' className='text-decoration-none' style={{fontWeight: '300', fontSize: '14px'}}> <i className='bi-google'></i> Open Google Maps</a>
            </div>

              <div className="p-2 rounded  text-start  bg-light" onClick={handleClickSafest} style={{cursor: 'pointer'}}>
              <p className='m-0 text-start' style={{fontWeight: '300', fontSize: '14px'}}>
                Route type: <b> Shortest </b> 
                </p>
                <p className='m-0 p-0' style={{fontWeight: '300', fontSize: '14px'}}>Risk Index: <i className='btn btn-primary px-3 py-1' style={{fontWeight: '300', fontSize: '14px'}}> {shortestPathWeight} </i> </p>
                <a href={shortestPathGMaps} target='_blank' className='text-decoration-none' style={{fontWeight: '300', fontSize: '14px'}}>  <i className='bi-google'></i> Open Google Maps </a>
 
              </div>


            </div>
          </>
        )}

      </div>
      )}

{showStartMapping ? ( 
          <div data-aos="fade-in" data-aos-delay="100" className="desc d-flex flex-column gap-2 d-lg-none d-md-none d-sm-none text-start" style={{ backgroundColor: 'white', position: 'absolute', top: '0', left: '0', zIndex: 9999, fontSize: '16px' }}>
           <div className='p-3'>
            
            <div className=''>
              <h4 className=''>
                  Safe Route Recommendation
              </h4>
            </div>

            <div>
              <p style={{fontWeight: '300', fontSize: '14px'}}>
                SafetyPin is a route finding application that offers users credible safety route recommendations based on police data,
                enhancing users' security and guiding them away from crime-prone areas.
              </p>
            </div>

            <div className='d-flex gap-2'>
              <button className=' desc btn btn-primary' style={{ fontWeight: '300', fontSize: '14px' }} onClick={handleStartMappingClick}>
                Start Mapping
              </button>

              <button className=' desc btn btn-outline-primary' style={{ fontWeight: '300', fontSize: '14px' }} onClick={handleStartMappingClick}>
                Learn more
              </button>

            </div>
          </div>
          </div>

        ) : (
        <div className='d-lg-none d-md-none d-sm-none'>        
        <button className=' desc bi-list btn btn-primary ' style={{ borderRadius: ' 10px', position: 'absolute', top: '10px', left: '10px', zIndex: 999, fontSize: '16px'}} onClick={toggleCodeBlockVisibility}>
        &nbsp; Routes 
        </button>

        {showCodeBlock && (

      <div className="desc d-flex flex-column gap-2 col-md-4 col-sm-5 col-12" style={{ borderRadius: '-0', backgroundColor: 'white', position: 'absolute', top: '0', left: '0', zIndex: 9999, fontSize: '16px'}}>
        <div className='p-2'>

<div className="  " >
  <div className='d-flex justify-content-between '>
          <p className='desc p-0 my-3' style={{fontWeight: '500', fontSize: '14px'}}>SEARCH PLACES</p>
          <p onClick={handleCurrentLocation} className='desc btn btn-outline-primary p-2' style={{fontWeight: '300', fontSize: '14px'}}><i className='bi-send p-0 m-0'></i> &nbsp;Find me</p>
  </div>
  
  <div className='position-relative '>

  <div className='d-flex gap-2 justify-content-center align-items-center'>
    <div className='h-100 d-flex  justify-content-center align-items-center '>
    <p className='rounded-circle px-1 perfect-circle m-0  d-flex  justify-content-center align-items-center bg-primary text-light'>A</p>
    </div>
    <input
    type="text"
    id="startLocation"
    placeholder="Start location..."
    value={startLocation}
    onChange={(e) => {
      setStartLocation(e.target.value);
      searchLocations('startLocation', e.target.value);
    }}
    style={{width: '100%', outline: 'none', border: '1px solid gray', fontWeight: '300', fontSize: '14px'}}
    className=' rounded-5 px-3 py-1'
    ref={startLocationInputRef}
  />

  </div>
  {startSuggestions.length > 0 && (
    <div className="suggestions position-absolute bg-white w-100 shadow p-2 mt-1" style={{zIndex: '999'}}>
      {startSuggestions.map((suggestion, index) => (
        <p className='text-start' key={index} onClick={() => handleSuggestionClick(suggestion, 'startLocation')}>
          {suggestion}
        </p>
      ))}
    </div>
  )}
  </div>

  <div className=' text-start px-2' >
  <i className='text-start bi-arrow-down'></i>
  </div>

  <div className='position-relative mb-3'>
  <div className='d-flex gap-2 justify-content-center align-items-center '>
  <div className='h-100 d-flex  justify-content-center align-items-center '>
    <p className='rounded-circle px-1 perfect-circle m-0  d-flex  justify-content-center align-items-center bg-primary text-light'>B</p>
    </div>

    <input
    type="text"
    id="endLocation"
    placeholder="Destination..."
    value={endLocation}
    onChange={(e) => {
      setEndLocation(e.target.value);
      searchLocations('endLocation', e.target.value); 
    }}
    style={{width: '100%', outline: 'none', border: '1px solid gray', fontWeight: '300', fontSize: '14px'}}
    className=' rounded-5 px-3 py-1'

  />

    </div>
    {endSuggestions.length > 0 && (
    <div className="suggestions position-absolute bg-white w-100 shadow p-2 mt-1">
      {endSuggestions.map((suggestion, index) => (
        <p className='text-start' key={index} onClick={() => handleSuggestionClick(suggestion, 'endLocation')}>
          {suggestion}
        </p>
      ))}
    </div>
  )}
  </div>
        
 

</div>

<div className='d-flex gap-2 justify-content-end align-items-center'>

<button className="btn btn-outline-primary  d-flex gap-1" onClick={toggleCodeBlockVisibility}>
   <i className='bi-arrow-left m-0 '></i> <p className='m-0 desc' style={{fontWeight: '300', fontSize: '14px'}}>  Back </p>
  </button>

  <button className="btn btn-primary  d-flex gap-1" onClick={handleSubmit}>
   <i className='bi-arrow-right-circle text-light m-0'></i> <p className='m-0 desc' style={{fontWeight: '300', fontSize: '14px'}}>  See Directions </p>
  </button>
  </div>

  </div>


      </div>
            )}

      </div>

      )}
          {submitted && (
          <>
            <div className='d-flex flex-column d-lg-none d-md-none d-sm-none gap-2 p-3 rounded-bottom position-absolute w-100' style={{ zIndex: '999', backgroundColor: 'white' , bottom: '0', }}>

            <div>
              <p className='p-0 my-2 ' style={{fontWeight: '500', fontSize: '14px'}}>ROUTES</p>
              </div>
            <div className="p-2 rounded  text-start  bg-light " onClick={handleClickShortest} style={{cursor: 'pointer'}}>
              <p className='m-0 text-start' style={{fontWeight: '300', fontSize: '14px'}}>
                Route type: <b> Safest </b> 
              </p>
              <p className='m-0 p-0' style={{fontWeight: '300', fontSize: '14px'}}>Risk Index: <i className='btn btn-primary px-3 py-1' style={{fontWeight: '300', fontSize: '14px'}}> {safestPathWeight} </i> </p>
              <a href={safestPathGMaps} target='_blank' className='text-decoration-none' style={{fontWeight: '300', fontSize: '14px'}}> <i className='bi-google'></i> Open Google Maps</a>
            </div>

              <div className="p-2 rounded  text-start  bg-light" onClick={handleClickSafest} style={{cursor: 'pointer'}}>
              <p className='m-0 text-start' style={{fontWeight: '300', fontSize: '14px'}}>
                Route type: <b> Shortest </b> 
                </p>
                <p className='m-0 p-0' style={{fontWeight: '300', fontSize: '14px'}}>Risk Index: <i className='btn btn-primary px-3 py-1' style={{fontWeight: '300', fontSize: '14px'}}> {shortestPathWeight} </i> </p>
                <a href={shortestPathGMaps} target='_blank' className='text-decoration-none' style={{fontWeight: '300', fontSize: '14px'}}>  <i className='bi-google'></i> Open Google Maps </a>
 
              </div>
            </div>
          </>
        )}



      <div className=' w-100 m-0 vh-100'>
        {!submitted && (
          <div id="map" style={{ display: 'block', width: '100%', height: '100%', position: 'relative' }}></div>
        )}
        <div id="safestPathMap" style={{ display: selectedMap === 'safest' ? 'block' : 'none' }} dangerouslySetInnerHTML={{ __html: safestPathMapHtml }}></div>
        <div id="shortestPathMap" style={{ display: selectedMap === 'shortest' ? 'block' : 'none' }} dangerouslySetInnerHTML={{ __html: shortestPathMapHtml }}></div>
      </div>
      </div>





{/** LOADING SCHEME AFTER PRESSING SEE DIRECTIONS */}
{loading && (
  <div className="loading-overlay">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
    <div>
      <p className='mt-2'> Generating routes...</p>
    </div>
  </div>
)}




  

    </>
  );
}

export default Home;
