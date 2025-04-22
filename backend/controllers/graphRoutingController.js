/**
 * Graph Routing Controller
 * 
 * This controller uses the graph-based routing system to find optimal paths
 * and distribute traffic across the Kachi Dham road network.
 */

const { RoadGraph, createKachiDhamNetwork } = require('../utils/graphRouting');
const { nodes, edges } = require('../data/kachiDhamNetwork');
const Route = require('../models/Route');
const TimeSlot = require('../models/TimeSlot');

// Create and initialize the road network
let roadNetwork = null;

/**
 * Initialize the road network graph
 */
const initializeRoadNetwork = () => {
  if (!roadNetwork) {
    roadNetwork = createKachiDhamNetwork(nodes, edges);
    console.log('Road network initialized with', roadNetwork.nodes.size, 'nodes and', roadNetwork.edges.size, 'edges');
  }
  return roadNetwork;
};

// Initialize the network when the controller is loaded
initializeRoadNetwork();

/**
 * Find the optimal path between two locations
 */
const findOptimalPath = async (req, res) => {
  try {
    const { startId, endId, considerTraffic } = req.body;
    
    if (!startId || !endId) {
      return res.status(400).json({ message: 'Start and end locations are required' });
    }
    
    // Initialize network if not already done
    const network = initializeRoadNetwork();
    
    // Find the shortest path
    const path = network.findShortestPath(startId, endId);
    
    if (!path.found) {
      return res.status(404).json({ message: 'No path found between the specified locations' });
    }
    
    res.json({
      path: path.path,
      distance: path.distance,
      travelTime: path.travelTime,
      edges: path.edges.map(edge => ({
        from: edge.from,
        to: edge.to,
        distance: edge.distance,
        travelTime: edge.travelTime,
        currentLoad: edge.currentLoad,
        capacity: edge.capacity
      }))
    });
  } catch (error) {
    console.error('Find optimal path error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Find alternative paths between two locations
 */
const findAlternativePaths = async (req, res) => {
  try {
    const { startId, endId, numPaths } = req.body;
    
    if (!startId || !endId) {
      return res.status(400).json({ message: 'Start and end locations are required' });
    }
    
    // Initialize network if not already done
    const network = initializeRoadNetwork();
    
    // Find alternative paths
    const paths = network.findAlternativePaths(startId, endId, numPaths || 3);
    
    if (paths.length === 0) {
      return res.status(404).json({ message: 'No paths found between the specified locations' });
    }
    
    res.json({
      count: paths.length,
      paths: paths.map(path => ({
        path: path.path,
        distance: path.distance,
        travelTime: path.travelTime,
        edges: path.edges.map(edge => ({
          from: edge.from,
          to: edge.to,
          distance: edge.distance,
          travelTime: edge.travelTime
        }))
      }))
    });
  } catch (error) {
    console.error('Find alternative paths error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Distribute traffic across multiple paths
 */
const distributeTraffic = async (req, res) => {
  try {
    const { startId, endId, totalVehicles, numPaths } = req.body;
    
    if (!startId || !endId || !totalVehicles) {
      return res.status(400).json({ 
        message: 'Start location, end location, and total vehicles are required' 
      });
    }
    
    // Initialize network if not already done
    const network = initializeRoadNetwork();
    
    // Distribute traffic
    const distribution = network.distributeTraffic(
      startId, 
      endId, 
      totalVehicles, 
      numPaths || 3
    );
    
    if (!distribution.success) {
      return res.status(404).json({ message: distribution.message });
    }
    
    res.json(distribution);
  } catch (error) {
    console.error('Distribute traffic error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update traffic load on a specific edge
 */
const updateEdgeTraffic = async (req, res) => {
  try {
    const { fromId, toId, load } = req.body;
    
    if (!fromId || !toId || load === undefined) {
      return res.status(400).json({ message: 'From node, to node, and load are required' });
    }
    
    // Initialize network if not already done
    const network = initializeRoadNetwork();
    
    // Update edge load
    network.updateEdgeLoad(fromId, toId, load);
    
    // Get the updated edge
    const edgeId = `${fromId}-${toId}`;
    const edge = network.edges.get(edgeId);
    
    if (!edge) {
      return res.status(404).json({ message: 'Edge not found' });
    }
    
    res.json({
      edge: {
        from: edge.from,
        to: edge.to,
        distance: edge.distance,
        travelTime: edge.travelTime,
        currentTravelTime: edge.currentTravelTime,
        currentLoad: edge.currentLoad,
        capacity: edge.capacity,
        loadPercentage: (edge.currentLoad / edge.capacity) * 100
      }
    });
  } catch (error) {
    console.error('Update edge traffic error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get all nodes in the network
 */
const getAllNodes = async (req, res) => {
  try {
    // Initialize network if not already done
    const network = initializeRoadNetwork();
    
    // Convert nodes map to array
    const nodeArray = Array.from(network.nodes.entries()).map(([id, node]) => ({
      id,
      name: node.name,
      type: node.type,
      latitude: node.latitude,
      longitude: node.longitude,
      isTemple: node.isTemple,
      connections: Array.from(node.connections)
    }));
    
    res.json({
      count: nodeArray.length,
      nodes: nodeArray
    });
  } catch (error) {
    console.error('Get all nodes error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get all edges in the network
 */
const getAllEdges = async (req, res) => {
  try {
    // Initialize network if not already done
    const network = initializeRoadNetwork();
    
    // Convert edges map to array
    const edgeArray = Array.from(network.edges.entries()).map(([id, edge]) => ({
      id,
      from: edge.from,
      to: edge.to,
      distance: edge.distance,
      travelTime: edge.travelTime,
      currentTravelTime: edge.currentTravelTime,
      capacity: edge.capacity,
      currentLoad: edge.currentLoad,
      speedLimit: edge.speedLimit,
      roadType: edge.roadType
    }));
    
    res.json({
      count: edgeArray.length,
      edges: edgeArray
    });
  } catch (error) {
    console.error('Get all edges error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Generate optimal pass with route based on graph
 */
const generateOptimalPass = async (req, res) => {
  try {
    const { userId, startId, endId, visitingTemple, timeSlotId } = req.body;
    
    if (!userId || !startId || !endId || !timeSlotId) {
      return res.status(400).json({ 
        message: 'User ID, start location, end location, and time slot are required' 
      });
    }
    
    // Initialize network if not already done
    const network = initializeRoadNetwork();
    
    // Find nodes by ID
    const startNode = network.nodes.get(startId);
    const endNode = network.nodes.get(endId);
    
    if (!startNode || !endNode) {
      return res.status(404).json({ message: 'Start or end location not found' });
    }
    
    // Find time slot
    const timeSlot = await TimeSlot.findById(timeSlotId);
    if (!timeSlot) {
      return res.status(404).json({ message: 'Time slot not found' });
    }
    
    // Find optimal path
    let path;
    if (visitingTemple) {
      // If visiting temple, find path to nearest temple entrance
      const templeNodes = Array.from(network.nodes.values())
        .filter(node => node.isTemple)
        .map(node => node.id);
      
      if (templeNodes.length === 0) {
        return res.status(404).json({ message: 'No temple entrances found in the network' });
      }
      
      // Find paths to all temple entrances
      const templePaths = [];
      for (const templeId of templeNodes) {
        const tempPath = network.findShortestPath(startId, templeId);
        if (tempPath.found) {
          templePaths.push(tempPath);
        }
      }
      
      if (templePaths.length === 0) {
        return res.status(404).json({ message: 'No path found to any temple entrance' });
      }
      
      // Sort by travel time and pick the shortest
      templePaths.sort((a, b) => a.travelTime - b.travelTime);
      path = templePaths[0];
    } else {
      // If not visiting temple, find direct path
      path = network.findShortestPath(startId, endId);
    }
    
    if (!path.found) {
      return res.status(404).json({ message: 'No path found between the specified locations' });
    }
    
    // Find or create a route in the database that matches this path
    let route = await Route.findOne({
      startPoint: startNode.name,
      endPoint: endNode.name,
      isTempleRoute: visitingTemple
    });
    
    if (!route) {
      // Create a new route if one doesn't exist
      route = new Route({
        name: `${startNode.name} to ${endNode.name}${visitingTemple ? ' (Temple)' : ''}`,
        description: `Route from ${startNode.name} to ${endNode.name}${visitingTemple ? ' via Temple' : ''}`,
        startPoint: startNode.name,
        endPoint: endNode.name,
        waypoints: path.path.slice(1, -1).map(nodeId => {
          const node = network.nodes.get(nodeId);
          return {
            name: node.name,
            latitude: node.latitude,
            longitude: node.longitude
          };
        }),
        distance: path.distance,
        estimatedTime: path.travelTime,
        maxCapacity: 500,
        isTempleRoute: visitingTemple,
        trafficLevel: 'low',
        status: 'open'
      });
      
      await route.save();
    }
    
    // Now we can generate the pass using the route ID
    // This would be handled by the pass controller, but we return the necessary data
    res.json({
      userId,
      startLocation: startNode.name,
      destination: endNode.name,
      visitingTemple,
      timeSlot: timeSlot._id,
      route: route._id,
      path: {
        nodes: path.path,
        distance: path.distance,
        travelTime: path.travelTime
      }
    });
  } catch (error) {
    console.error('Generate optimal pass error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  findOptimalPath,
  findAlternativePaths,
  distributeTraffic,
  updateEdgeTraffic,
  getAllNodes,
  getAllEdges,
  generateOptimalPass
};
