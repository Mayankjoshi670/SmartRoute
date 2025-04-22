/**
 * Kachi Dham Road Network Data
 * 
 * This file contains a simulated road network for the Kachi Dham area.
 * It includes nodes (intersections, landmarks) and edges (road segments).
 */

// Nodes represent intersections, landmarks, or decision points
const nodes = [
  // City entry points
  { id: 'city_center', name: 'City Center', type: 'entry', latitude: 30.7333, longitude: 79.0667 },
  { id: 'north_gate', name: 'Northern Gate', type: 'entry', latitude: 30.7400, longitude: 79.0600 },
  { id: 'south_colony', name: 'South Colony', type: 'entry', latitude: 30.7200, longitude: 79.0650 },
  { id: 'east_entrance', name: 'Eastern Entrance', type: 'entry', latitude: 30.7350, longitude: 79.0750 },
  { id: 'west_junction', name: 'Western Junction', type: 'entry', latitude: 30.7300, longitude: 79.0600 },
  
  // Major intersections
  { id: 'market_square', name: 'Market Square', type: 'intersection', latitude: 30.7350, longitude: 79.0670 },
  { id: 'river_crossing', name: 'River Crossing', type: 'intersection', latitude: 30.7360, longitude: 79.0690 },
  { id: 'hill_view', name: 'Hill View Junction', type: 'intersection', latitude: 30.7400, longitude: 79.0700 },
  { id: 'forest_path', name: 'Forest Path Junction', type: 'intersection', latitude: 30.7380, longitude: 79.0720 },
  { id: 'lake_view', name: 'Lake View Junction', type: 'intersection', latitude: 30.7200, longitude: 79.0650 },
  { id: 'old_bridge', name: 'Old Bridge Junction', type: 'intersection', latitude: 30.7250, longitude: 79.0670 },
  
  // Destinations
  { id: 'temple_main', name: 'Kachi Dham Temple Main Entrance', type: 'destination', latitude: 30.7370, longitude: 79.0710, isTemple: true },
  { id: 'temple_east', name: 'Kachi Dham Temple East Gate', type: 'destination', latitude: 30.7375, longitude: 79.0730, isTemple: true },
  { id: 'temple_west', name: 'Kachi Dham Temple West Gate', type: 'destination', latitude: 30.7365, longitude: 79.0700, isTemple: true },
  { id: 'industrial_area', name: 'Industrial Area', type: 'destination', latitude: 30.7250, longitude: 79.0600, isTemple: false },
  { id: 'bus_terminal', name: 'Bus Terminal', type: 'destination', latitude: 30.7320, longitude: 79.0680, isTemple: false }
];

// Edges represent road segments connecting nodes
const edges = [
  // City Center routes
  { from: 'city_center', to: 'market_square', distance: 1.2, travelTime: 10, capacity: 500, speedLimit: 40, roadType: 'main' },
  { from: 'city_center', to: 'west_junction', distance: 0.8, travelTime: 7, capacity: 600, speedLimit: 50, roadType: 'main' },
  
  // Northern routes
  { from: 'north_gate', to: 'hill_view', distance: 1.5, travelTime: 12, capacity: 400, speedLimit: 40, roadType: 'main' },
  { from: 'hill_view', to: 'forest_path', distance: 1.0, travelTime: 8, capacity: 350, speedLimit: 35, roadType: 'secondary' },
  
  // Southern routes
  { from: 'south_colony', to: 'lake_view', distance: 0.9, travelTime: 7, capacity: 450, speedLimit: 45, roadType: 'main' },
  { from: 'lake_view', to: 'old_bridge', distance: 1.1, travelTime: 9, capacity: 400, speedLimit: 40, roadType: 'secondary' },
  
  // Eastern routes
  { from: 'east_entrance', to: 'forest_path', distance: 1.3, travelTime: 11, capacity: 350, speedLimit: 35, roadType: 'secondary' },
  
  // Western routes
  { from: 'west_junction', to: 'industrial_area', distance: 1.4, travelTime: 12, capacity: 600, speedLimit: 50, roadType: 'main' },
  
  // Internal connections
  { from: 'market_square', to: 'river_crossing', distance: 0.6, travelTime: 5, capacity: 450, speedLimit: 40, roadType: 'main' },
  { from: 'river_crossing', to: 'temple_west', distance: 0.5, travelTime: 6, capacity: 300, speedLimit: 30, roadType: 'temple' },
  { from: 'hill_view', to: 'temple_north', distance: 0.7, travelTime: 7, capacity: 250, speedLimit: 25, roadType: 'temple' },
  { from: 'forest_path', to: 'temple_east', distance: 0.4, travelTime: 5, capacity: 250, speedLimit: 25, roadType: 'temple' },
  { from: 'old_bridge', to: 'market_square', distance: 1.0, travelTime: 9, capacity: 400, speedLimit: 35, roadType: 'secondary' },
  
  // Temple interconnections
  { from: 'temple_main', to: 'temple_east', distance: 0.3, travelTime: 4, capacity: 200, speedLimit: 20, roadType: 'temple' },
  { from: 'temple_main', to: 'temple_west', distance: 0.3, travelTime: 4, capacity: 200, speedLimit: 20, roadType: 'temple' },
  
  // Additional connections
  { from: 'market_square', to: 'bus_terminal', distance: 0.5, travelTime: 5, capacity: 500, speedLimit: 40, roadType: 'main' },
  { from: 'west_junction', to: 'market_square', distance: 0.9, travelTime: 8, capacity: 450, speedLimit: 40, roadType: 'main' },
  { from: 'river_crossing', to: 'hill_view', distance: 0.8, travelTime: 7, capacity: 350, speedLimit: 35, roadType: 'secondary' },
  { from: 'forest_path', to: 'river_crossing', distance: 0.7, travelTime: 6, capacity: 300, speedLimit: 30, roadType: 'secondary' }
];

module.exports = {
  nodes,
  edges
};
