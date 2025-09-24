# package-delivery-service

##  steps to instal the project

1. install and run/open git bash(or any terminal)
2. navigate the project folder location and run below commands
3. cd package-delivery-service
4. npm install

# run the project using ts-node (dev)
npx ts-node src/index.ts sample_input.txt
# or to build+run
npm run build
node dist/index.js sample_input.txt

# Example input in( `sample_input.txt`)

100 5
PKG1 50 30 OFR001
PKG2 75 125 OFR002
PKG3 175 100 OFR003
PKG4 110 60 OFR002
PKG5 155 95 NA
2 70 200

# Example output(printed to stdout)
PKG1 0.00 750.00 3.98
PKG2 0.00 1475.00 1.78
PKG3 0.00 2350.00 1.42
PKG4 105.00 1395.00 0.85
PKG5 0.00 2125.00 4.19

# README — Problem summary & approach (step-by-step)

Problem in short Calculate 
(1) delivery cost for each package (with one optional offer code if applicable) 
 (2) estimated delivery times for each package given a fleet of vehicles (count, max speed, and max load per vehicle). The scheduler should pack as many packages as possible in each trip, prefer heavier shipments when counts tie

# High level approach (step-by-step)

1. Parsing input — support either a file path argument or stdin. The parser reads the base delivery cost and the listed packages (id, weight, distance, offer code). 
2. If vehicle information is present (numberOfVehicles, maxSpeed, maxCarriableWeight), the scheduler runs; otherwise we only print cost results.

3. Cost calculation — for each package:

deliveryCost = baseDeliveryCost + weight * 10 + distance * 5

4. Determine the offer (if any) and whether package satisfies offer criteria. Offers are encoded as rules and the engine is extensible: you can add more rules into src/offers.ts(scalable)

--discount = deliveryCost * offerPercent (if eligible)

--totalCost = deliveryCost - discount

5. Scheduling & delivery-time estimation — only executed if vehicle data is present.

--I have model vehicles each with a nextAvailableTime (initially 0). Vehicles are identical (same speed & max load) per problem statement.

6. While there are undelivered packages:
Pick the vehicle that becomes available the earliest.

7. From remaining packages selecting the best shipment: 
the subset with the maximum number of packages that fits into the vehicle capacity.
 If multiple subsets have the same number of packages, prefer the subset with the larger total weight.
  If still tied, prefer the subset whose maximum distance is smaller (i.e., shipment that will complete sooner).

8. Assign estimatedDeliveryTime for each package in the shipment as vehicleStartTime + package.distance / speed.

9. Update the vehicle's availability to vehicleStartTime + 2 * (maxDistanceInShipment / speed) (vehicle must go and return).

Implementation detail: to find the best shipment I attempt an exact combinatorial search when the number of remaining packages is small (<= 15) so that I could maximize package count; 

can improve this solution with better algo
10. Output — prints each package record (in the original input order) as:

PKG_ID <discount> <total_cost> [estimated_delivery_time-if-vehicles-provided]

