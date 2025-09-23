import { PackageComputed, PackageInput, VehicleSpec } from "../interfaces";
import { fmtMoney, fmtTime } from '../utils';

export function formatOutput(pkgs: PackageComputed[]) {
  return pkgs.map(p => {
    const parts = [p.id, fmtMoney(p.discount), fmtMoney(p.totalCost)];
    if (p.estimatedDeliveryTime !== undefined) parts.push(fmtTime(p.estimatedDeliveryTime));
    return parts.join(' ');
  }).join('\n');
}