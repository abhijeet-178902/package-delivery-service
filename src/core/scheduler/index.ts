import { PackageComputed } from '../../interfaces';
import { truncateTime } from '../../utils';

type Vehicle = { id: number; nextAvailableAt: number };

/**
  packages with estimatedDeliveryTime (hours) by simulating vehicles.
   always pick the vehicle that becomes available the earliest.
  For that vehicle we try to select the best shipment:
    1) maximize number of packages
    2) if tie, prefer heavier total weight
    3) if tie, prefer shipment with smaller max distance
 
  The selection does an exact search for up to 15 remaining packages;

  can improve this solution with better algo
 */
export function scheduleDeliveries(packages: PackageComputed[], vehicleCount: number, maxLoadKg: number, maxSpeedKmPerHour: number) {
  if (vehicleCount <= 0) return;

  const vehicles: Vehicle[] = Array.from({ length: vehicleCount }, (_, i) => ({ id: i + 1, nextAvailableAt: 0 }));
  const remaining = packages.slice(); // shallow copy of references

  function chooseBestShipmentIndices(): number[] {
    const n = remaining.length;
    if (n === 0) return [];

    // If any single package exceeds capacity
    const tooHeavy = remaining.find(p => p.weight > maxLoadKg);
    if (tooHeavy) {
      throw new Error(`Package ${tooHeavy.id} weight ${tooHeavy.weight} exceeds vehicle capacity ${maxLoadKg}`);
    }

   
    if (n <= 15) {
      let bestIndices: number[] = [];
      let bestWeight = -1;
      let bestMaxDist = Infinity;

      // Try sizes from n down to 1 so I find the maximum count quickly.
      for (let size = n; size >= 1; size--) {
        let found = false;

        const comb = (start: number, chosen: number[]) => {
          if (chosen.length === size) {
            const totalW = chosen.reduce((s, idx) => s + remaining[idx].weight, 0);
            if (totalW <= maxLoadKg) {
              found = true;
              const maxD = Math.max(...chosen.map(i => remaining[i].distance));
              if (chosen.length > bestIndices.length || (chosen.length === bestIndices.length && (totalW > bestWeight || (totalW === bestWeight && maxD < bestMaxDist)))) {
                bestIndices = chosen.slice();
                bestWeight = totalW;
                bestMaxDist = maxD;
              }
            }
            return;
          }
          for (let i = start; i < n; i++) {
            chosen.push(i);
            comb(i + 1, chosen);
            chosen.pop();
          }
        };

        comb(0, []);
        if (found) return bestIndices;
      }

      return bestIndices;
    }

    // heaviest-first packing
    const order = remaining.map((_, i) => i).sort((a, b) => remaining[b].weight - remaining[a].weight);
    const pick: number[] = [];
    let sumW = 0;
    for (const idx of order) {
      if (sumW + remaining[idx].weight <= maxLoadKg) {
        pick.push(idx);
        sumW += remaining[idx].weight;
      }
    }
    return pick;
  }

  while (remaining.length > 0) {
    vehicles.sort((a, b) => a.nextAvailableAt - b.nextAvailableAt);
    const vehicle = vehicles[0];
    const start = vehicle.nextAvailableAt;

    const chosenIdx = chooseBestShipmentIndices();
    if (chosenIdx.length === 0) break; // defensive

    // Compute trip's max distance to calculate round-trip time
    const chosenPackages = chosenIdx.map(i => remaining[i]);
    const maxDistance = Math.max(...chosenPackages.map(p => p.distance));

    // Annotate ETAs (start + distance/speed). We truncate to 2 decimals.
    for (const pkg of chosenPackages) {
      pkg.estimatedDeliveryTime = truncateTime(start + pkg.distance / maxSpeedKmPerHour);
    }

    // Vehicle returns after 2 * (maxDistance / speed)
    vehicle.nextAvailableAt = truncateTime(start + 2 * (maxDistance / maxSpeedKmPerHour));

    // Remove delivered packages from remaining (in descending index order to avoid shift)
    const sortedDesc = chosenIdx.sort((a, b) => b - a);
    for (const i of sortedDesc) remaining.splice(i, 1);
  }
}
