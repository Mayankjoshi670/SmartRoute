/**
 * Graph-based Routing System
 * 
 * This module implements a graph data structure for road networks
 * and provides algorithms for path finding and traffic optimization.
 */

class RoadGraph {
  constructor() {
    this.nodes = new Map(); // Map of node ID to node object
    this.edges = new Map(); // Map of edge ID to edge object
  }

  /**
   * Add a node to the graph
   * @param {String} id - Unique identifier for the node
   * @param {Object} data - Node data (name, coordinates, etc.)
   */
  addNode(id, data = {}) {
    this.nodes.set(id, {
      id,
      connections: new Set(),
      ...data
    });
    return this;
  }

  /**
   * Add an edge between two nodes
   * @param {String} fromId - Source node ID
   * @param {String} toId - Target node ID
   * @param {Object} data - Edge data (distance, capacity, etc.)
   */
  addEdge(fromId, toId, data = {}) {
    const edgeId = `${fromId}-${toId}`;
    
    // Ensure both nodes exist
    if (!this.nodes.has(fromId) || !this.nodes.has(toId)) {
      throw new Error(`Cannot create edge between non-existent nodes: ${fromId}, ${toId}`);
    }
    
    // Create the edge
    this.edges.set(edgeId, {
      id: edgeId,
      from: fromId,
      to: toId,
      distance: data.distance || 1,
      travelTime: data.travelTime || data.distance || 1,
      capacity: data.capacity || 100,
      currentLoad: data.currentLoad || 0,
      speedLimit: data.speedLimit || 50,
      ...data
    });
    
    // Update node connections
    this.nodes.get(fromId).connections.add(toId);
    
    // If bidirectional, add reverse edge
    if (data.bidirectional) {
      const reverseEdgeId = `${toId}-${fromId}`;
      this.edges.set(reverseEdgeId, {
        id: reverseEdgeId,
        from: toId,
        to: fromId,
        distance: data.distance || 1,
        travelTime: data.travelTime || data.distance || 1,
        capacity: data.capacity || 100,
        currentLoad: data.currentLoad || 0,
        speedLimit: data.speedLimit || 50,
        ...data
      });
      this.nodes.get(toId).connections.add(fromId);
    }
    
    return this;
  }

  /**
   * Update traffic load on an edge
   * @param {String} fromId - Source node ID
   * @param {String} toId - Target node ID
   * @param {Number} load - New traffic load
   */
  updateEdgeLoad(fromId, toId, load) {
    const edgeId = `${fromId}-${toId}`;
    if (!this.edges.has(edgeId)) {
      throw new Error(`Edge does not exist: ${edgeId}`);
    }
    
    const edge = this.edges.get(edgeId);
    edge.currentLoad = load;
    
    // Update travel time based on load
    // Simple model: travel time increases linearly with load
    const loadFactor = load / edge.capacity;
    edge.currentTravelTime = edge.travelTime * (1 + loadFactor);
    
    return this;
  }

  /**
   * Find shortest path using Dijkstra's algorithm
   * @param {String} startId - Start node ID
   * @param {String} endId - End node ID
   * @param {Function} weightFn - Function to calculate edge weight
   * @returns {Object} Path information
   */
  findShortestPath(startId, endId, weightFn = null) {
    // Default weight function uses travel time
    const getWeight = weightFn || ((edge) => edge.currentTravelTime || edge.travelTime);
    
    // Check if nodes exist
    if (!this.nodes.has(startId) || !this.nodes.has(endId)) {
      throw new Error(`Start or end node does not exist: ${startId}, ${endId}`);
    }
    
    // Initialize data structures
    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set();
    
    // Set initial distances
    for (const nodeId of this.nodes.keys()) {
      distances.set(nodeId, nodeId === startId ? 0 : Infinity);
      unvisited.add(nodeId);
    }
    
    // Main algorithm loop
    while (unvisited.size > 0) {
      // Find node with minimum distance
      let current = null;
      let minDistance = Infinity;
      
      for (const nodeId of unvisited) {
        const distance = distances.get(nodeId);
        if (distance < minDistance) {
          minDistance = distance;
          current = nodeId;
        }
      }
      
      // If we can't find a node or we've reached the end, break
      if (current === null || current === endId) break;
      
      // Remove current from unvisited
      unvisited.delete(current);
      
      // Check all neighbors
      const currentNode = this.nodes.get(current);
      for (const neighborId of currentNode.connections) {
        // Skip if already visited
        if (!unvisited.has(neighborId)) continue;
        
        const edgeId = `${current}-${neighborId}`;
        const edge = this.edges.get(edgeId);
        
        // Calculate new distance
        const weight = getWeight(edge);
        const newDistance = distances.get(current) + weight;
        
        // Update if better path found
        if (newDistance < distances.get(neighborId)) {
          distances.set(neighborId, newDistance);
          previous.set(neighborId, current);
        }
      }
    }
    
    // Reconstruct path
    const path = [];
    let current = endId;
    
    // If no path found
    if (previous.get(endId) === undefined) {
      return {
        found: false,
        distance: Infinity,
        path: []
      };
    }
    
    // Build path
    while (current !== startId) {
      path.unshift(current);
      current = previous.get(current);
    }
    path.unshift(startId);
    
    // Calculate total distance and travel time
    let totalDistance = 0;
    let totalTravelTime = 0;
    let edges = [];
    
    for (let i = 0; i < path.length - 1; i++) {
      const edgeId = `${path[i]}-${path[i+1]}`;
      const edge = this.edges.get(edgeId);
      totalDistance += edge.distance;
      totalTravelTime += edge.currentTravelTime || edge.travelTime;
      edges.push(edge);
    }
    
    return {
      found: true,
      path,
      edges,
      distance: totalDistance,
      travelTime: totalTravelTime
    };
  }

  /**
   * Find k alternative paths between two nodes
   * @param {String} startId - Start node ID
   * @param {String} endId - End node ID
   * @param {Number} k - Number of alternative paths to find
   * @returns {Array} Array of path objects
   */
  findAlternativePaths(startId, endId, k = 3) {
    const paths = [];
    
    // Find the initial shortest path
    const initialPath = this.findShortestPath(startId, endId);
    if (!initialPath.found) return paths;
    
    paths.push(initialPath);
    
    // Create a copy of the graph for modifications
    const tempGraph = new RoadGraph();
    
    // Copy all nodes and edges
    for (const [nodeId, node] of this.nodes.entries()) {
      tempGraph.addNode(nodeId, { ...node });
    }
    
    for (const [edgeId, edge] of this.edges.entries()) {
      if (!tempGraph.edges.has(edgeId)) {
        tempGraph.addEdge(edge.from, edge.to, { 
          ...edge,
          bidirectional: false 
        });
      }
    }
    
    // Find k-1 more paths
    for (let i = 1; i < k; i++) {
      // Get the previous path
      const prevPath = paths[i-1];
      
      // Try removing each edge in the previous path
      for (let j = 0; j < prevPath.path.length - 1; j++) {
        const fromId = prevPath.path[j];
        const toId = prevPath.path[j+1];
        const edgeId = `${fromId}-${toId}`;
        
        // Temporarily remove the edge
        const edge = tempGraph.edges.get(edgeId);
        tempGraph.edges.delete(edgeId);
        
        // Find a new path
        const newPath = tempGraph.findShortestPath(startId, endId);
        
        // Restore the edge
        tempGraph.addEdge(fromId, toId, edge);
        
        // If a valid path was found and it's different from existing paths
        if (newPath.found && !pathExists(paths, newPath.path)) {
          paths.push(newPath);
          break;
        }
      }
      
      // If we couldn't find a new path, break
      if (paths.length <= i) break;
    }
    
    return paths;
  }

  /**
   * Distribute traffic across multiple paths to minimize congestion
   * @param {String} startId - Start node ID
   * @param {String} endId - End node ID
   * @param {Number} totalVehicles - Total number of vehicles to distribute
   * @param {Number} numPaths - Number of paths to consider
   * @returns {Object} Traffic distribution plan
   */
  distributeTraffic(startId, endId, totalVehicles, numPaths = 3) {
    // Find alternative paths
    const paths = this.findAlternativePaths(startId, endId, numPaths);
    
    if (paths.length === 0) {
      return {
        success: false,
        message: 'No paths found'
      };
    }
    
    // Calculate initial distribution based on travel time
    const distribution = [];
    let totalWeight = 0;
    
    for (const path of paths) {
      // Inverse of travel time as weight (faster paths get more traffic)
      const weight = 1 / path.travelTime;
      totalWeight += weight;
      
      distribution.push({
        path: path.path,
        edges: path.edges,
        travelTime: path.travelTime,
        distance: path.distance,
        weight,
        vehicleCount: 0
      });
    }
    
    // Distribute vehicles based on weights
    for (const route of distribution) {
      route.vehicleCount = Math.floor(totalVehicles * (route.weight / totalWeight));
    }
    
    // Assign any remaining vehicles to the fastest route
    const remainingVehicles = totalVehicles - distribution.reduce((sum, route) => sum + route.vehicleCount, 0);
    if (remainingVehicles > 0) {
      distribution[0].vehicleCount += remainingVehicles;
    }
    
    return {
      success: true,
      totalVehicles,
      distribution
    };
  }
}

/**
 * Check if a path already exists in an array of paths
 * @param {Array} existingPaths - Array of path objects
 * @param {Array} newPath - New path to check
 * @returns {Boolean} True if the path exists
 */
function pathExists(existingPaths, newPath) {
  const pathStr = newPath.join('-');
  
  for (const existing of existingPaths) {
    if (existing.path.join('-') === pathStr) {
      return true;
    }
  }
  
  return false;
}

/**
 * Create a road network for Kachi Dham from a set of nodes and edges
 * @param {Array} nodes - Array of node objects
 * @param {Array} edges - Array of edge objects
 * @returns {RoadGraph} Road network graph
 */
function createKachiDhamNetwork(nodes, edges) {
  const graph = new RoadGraph();
  
  // Add all nodes
  for (const node of nodes) {
    graph.addNode(node.id, node);
  }
  
  // Add all edges
  for (const edge of edges) {
    graph.addEdge(edge.from, edge.to, {
      ...edge,
      bidirectional: edge.bidirectional !== false
    });
  }
  
  return graph;
}

module.exports = {
  RoadGraph,
  createKachiDhamNetwork
};
