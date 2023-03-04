// const express = require("express");
// const app = express();
// const port = 3000;

// // Mapbox API access token
// const accessToken = "<your Mapbox access token>";

// // Example vehicle details
// const vehicleDetails = {
//   maxWeight: 1000, // in kg
//   maxVolume: 10, // in m^3
//   maxDistance: 50000, // in meters
// };

// // Example order data
// const orders = [
//   {
//     id: "1",
//     weight: 100, // in kg
//     volume: 1, // in m^3
//     pickupLocation: [-73.9857, 40.7484], // longitude, latitude
//     dropLocation: [-74.0059, 40.7128], // longitude, latitude
//   },
//   {
//     id: "2",
//     weight: 200,
//     volume: 2,
//     pickupLocation: [-73.9814, 40.7486],
//     dropLocation: [-74.0027, 40.7394],
//   },
//   {
//     id: "3",
//     weight: 300,
//     volume: 3,
//     pickupLocation: [-73.9973, 40.7505],
//     dropLocation: [-73.9811, 40.7749],
//   },
// ];

// // Route to optimize the order dispatch
// app.post("/optimize-route", async (req, res) => {
//   try {
//     // Create a list of nodes from the orders
//     const nodes = [];
//     const orderDetails = {};
//     let nodeId = 0;
//     orders.forEach((order) => {
//       const pickupNode = {
//         id: `P${nodeId}`,
//         order,
//         type: "pickup",
//       };
//       nodeId += 1;

//       const dropNode = {
//         id: `D${nodeId}`,
//         order,
//         type: "drop",
//       };
//       nodeId += 1;

//       nodes.push(pickupNode, dropNode);
//       orderDetails[order.id] = {
//         weight: order.weight,
//         volume: order.volume,
//       };
//     });

//     // Initialize the Mapbox client
//     const mapboxClient = require("@mapbox/mapbox-sdk/services/directions");
//     const directionsService = mapboxClient({ accessToken });

//     // Initialize the current solution
//     const startNode = nodes[0];
//     let currentSolution = {
//       nodes: [startNode],
//       orders: [],
//       weight: 0,
//       volume: 0,
//       distance: 0,
//     };
//     let solutions = [];

//     // Remove the start node from the nodes list
//     let remainingNodes = nodes.filter((node) => node !== startNode);

//     // Repeat until all nodes have been visited or maximum distance reached
//     while (
//       remainingNodes.length > 0 &&
//       currentSolution.distance <= vehicleDetails.maxDistance
//     ) {
//       // Find the nearest unvisited node to the current node
//       const nearestNode = findNearestNode(
//         currentSolution.nodes[currentSolution.nodes.length - 1],
//         remainingNodes,
//         directionsService
//       );

//       // Calculate the weight and volume of the new order if the nearest node is a pickup node
//       let newOrderWeight = 0;
//       let newOrderVolume = 0;
//       if (nearestNode.type === "pickup") {
//         newOrderWeight = orderDetails[nearestNode.order.id].weight;
//         newOrderVolume = orderDetails[nearestNode.order.id].volume;
//       }

//       // Check if the new order can be added to the vehicle without exceeding its capacity
//       if (
//         currentSolution.weight + newOrderWeight <= vehicleDetails.maxWeight &&
//         currentSolution.volume + newOrderVolume <= vehicleDetails.maxVolume
//       ) {
//         // Add the new order to the current solution
//         currentSolution.nodes.push(nearestNode);
//         if (nearestNode.type === "pickup") {
//           currentSolution.orders.push(nearestNode.order.id);
//           currentSolution.weight += newOrderWeight;
//           currentSolution.volume += newOrderVolume;
//         }
//         // Remove the new node from the remaining nodes list
//         remainingNodes = remainingNodes.filter((node) => node !== nearestNode);
//       } else {
//         // Save the current solution as a possible solution
//         solutions.push(currentSolution);

//         // Start a new solution from the current node
//         currentSolution = {
//           nodes: [currentSolution.nodes[currentSolution.nodes.length - 1]],
//           orders: [],
//           weight: 0,
//           volume: 0,
//           distance: 0,
//         };
//       }

//       // Calculate the distance of the current solution
//       currentSolution.distance = await calculateDistance(
//         currentSolution.nodes,
//         directionsService
//       );
//     }

//     // Save the last solution as a possible solution
//     solutions.push(currentSolution);

//     // Find the solution with the shortest distance
//     const bestSolution = findBestSolution(solutions);

//     // Return the optimized order dispatch as a JSON response
//     res.json(bestSolution.orders);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal server error");
//   }
// });

// // Function to find the nearest unvisited node to a given node
// function findNearestNode(node, nodes, directionsService) {
//   let nearestNode = null;
//   let minDistance = Infinity;

//   nodes.forEach((candidateNode) => {
//     const distance = calculateDistance(
//       [node, candidateNode],
//       directionsService
//     );
//     if (distance < minDistance) {
//       minDistance = distance;
//       nearestNode = candidateNode;
//     }
//   });

//   return nearestNode;
// }

// // Function to calculate the total distance of a list of nodes
// async function calculateDistance(nodes, directionsService) {
//   if (nodes.length < 2) {
//     return 0;
//   }

//   const waypoints = nodes.map((node) => {
//     return {
//       coordinates: node.order ? node.order.pickupLocation : node,
//     };
//   });

//   const response = await directionsService
//     .getDirections({
//       waypoints,
//       profile: "driving",
//       geometries: "polyline",
//       steps: false,
//     })
//     .send();

//   return response.body.routes[0].distance;
// }

// // Function to find the solution with the shortest distance
// function findBestSolution(solutions) {
//   let bestSolution = solutions[0];
//   let minDistance = solutions[0].distance;

//   solutions.forEach((solution) => {
//     if (solution.distance < minDistance) {
//       minDistance = solution.distance;
//       bestSolution = solution;
//     }
//   });

//   return bestSolution;
// }

// // Start the server
// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });