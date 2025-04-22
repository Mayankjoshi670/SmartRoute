const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const passRoutes = require('./passRoutes');
const routeRoutes = require('./routeRoutes');
const timeSlotRoutes = require('./timeSlotRoutes');
const trafficRoutes = require('./trafficRoutes');
const graphRoutes = require('./graphRoutes');

// Mount routes
router.use('/users', userRoutes);
//  user route just login , create account  , register 
router.use('/passes', passRoutes);
//  admin can create new routes or path 
router.use('/routes', routeRoutes);
//  get all routes , get routes by id 
router.use('/timeslots', timeSlotRoutes);
//  asign time slot to user in which time he can come to this place
router.use('/traffic', trafficRoutes);
//  gives the optmial path , real time traffic over view  , and traffic status 
router.use('/graph', graphRoutes);
//  adjust the weight based on traffic , distance ,  and the traffic congession 

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

module.exports = router;
