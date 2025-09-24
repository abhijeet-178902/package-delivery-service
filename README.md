# package-delivery-service

# prequesite
1. node latest version should be installed,  
2. Install git bash  to clone the repo or run npm related commands
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

# Example input in ( `sample_input.txt`)

100 5
PKG1 50 30 OFR001
PKG2 75 125 OFR002
PKG3 175 100 OFR003
PKG4 110 60 OFR002
PKG5 155 95 NA
2 70 200

# Example output (printed to stdout)
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
1. Read the input
The program expects a file path. First line has the base delivery cost and number of packages. Then it reads each package (id, weight, distance, offer code).
If the input also includes vehicle info (number of vehicles, max speed, max load), we also run the scheduling part. Otherwise, we just calculate the delivery costs.

2. Figure out costs
For each package, the cost formula is:

deliveryCost = baseDeliveryCost + weight * 10 + distance * 5


3. Then I check if the package qualifies for any discount offer. If yes,I  apply:

discount = deliveryCost * offerPercent
totalCost = deliveryCost - discount


4. Scheduling deliveries (only if vehicles are provided)
I treat every vehicle as identical. Each starts free at time 0 and has two limits: max speed and max load.

--The idea:

Always pick the vehicle that’s available the earliest.

From the undelivered packages, pick the best possible shipment that fits the load:

First, maximize the number of packages.

If there’s a tie, choose the heavier set.

If still tied, choose the one with the smaller max distance (so it finishes sooner).

5. Once a shipment is chosen:

Each package gets an estimatedDeliveryTime = startTime + distance / speed.

The vehicle’s next free time is updated to startTime + 2 * (farthestDistance / speed) (because it has to come back).

6. Under the hood:

If there are not too many packages left (≤15), I actually try every possible subset so we truly get the “best” one.

If there are more, I fall back to a greedy “heaviest-first” approach for performance.

This works well but could definitely be optimized further with smarter algorithms.

6. Print results
Finally, we print the output in the same order as input:

PKG_ID <discount> <total_cost> [estimated_time_if_any]


note: Times are shown with two decimals.