const express = require('express');
const router = express.Router();
const {
  findOptimalPath,
  findAlternativePaths,
  distributeTraffic,
  updateEdgeTraffic,
  getAllNodes,
  getAllEdges,
  generateOptimalPass
} = require('../controllers/graphRoutingController');
const { auth, admin } = require('../middleware/auth');

// Get all nodes in the network
router.get('/nodes', getAllNodes);

// Get all edges in the network
router.get('/edges', getAllEdges);

// Find optimal path between two locations
router.post('/path', findOptimalPath);

// Find alternative paths between two locations
router.post('/alternatives', findAlternativePaths);

// Distribute traffic across multiple paths
router.post('/distribute', auth, admin, distributeTraffic);

// Update traffic load on a specific edge (admin only)
router.post('/update-traffic', auth, admin, updateEdgeTraffic);

// Generate optimal pass with route based on graph
router.post('/generate-pass', auth, generateOptimalPass);

module.exports = router;
