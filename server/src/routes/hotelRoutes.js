const express = require('express');
const router = express.Router();
const {
  searchLocation,
  searchHotels,
  searchTripadvisorHotelsByCity,
} = require('../controllers/hotelController');

// 1. Search Location to get geoId
// GET /api/hotels/searchLocation?query=Pune
router.get('/searchLocation', searchLocation);

// 2. Search Hotels with geoId, checkIn, checkOut
// GET /api/hotels/searchHotels?geoId=297654&checkIn=2026-11-01&checkOut=2026-11-05
router.get('/searchHotels', searchHotels);

// 3. Combined flow: City -> geoId -> Hotels
// GET /api/hotels/tripadvisor?city=Pune&checkIn=2026-11-01&checkOut=2026-11-05
router.get('/tripadvisor', searchTripadvisorHotelsByCity);

module.exports = router;
