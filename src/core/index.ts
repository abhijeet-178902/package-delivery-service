import { PackageInput, PackageComputed, VehicleSpec } from '../interfaces';
import { calculateDiscount } from '../core/offers';
import { scheduleDeliveries } from '../core/scheduler';
import { roundMoney } from '../utils';

export function compute(base: number, pkgsIn: PackageInput[], vehicles?: VehicleSpec) {
  const pkgs: PackageComputed[] = pkgsIn.map(p => ({ ...p, deliveryCost: 0, discount: 0, totalCost: 0 }));

  // Step 1: compute delivery cost & discount
  for (const p of pkgs) {
    const delivery = base + p.weight * 10 + p.distance * 5;
    const discount = calculateDiscount(p, delivery);
    p.deliveryCost = roundMoney(delivery);
    p.discount = roundMoney(discount);
    p.totalCost = roundMoney(delivery - discount);
  }

  // Step 2: schedule if vehicles provided
  if (vehicles) {
    scheduleDeliveries(pkgs, vehicles.count, vehicles.maxCarriableKg, vehicles.maxSpeedKmPerHour);
  }

  return pkgs;
}
