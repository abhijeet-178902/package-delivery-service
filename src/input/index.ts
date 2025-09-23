import { PackageInput, VehicleSpec } from "../interfaces";

export function parseInput(text: string): { base: number; packages: PackageInput[]; vehicles?: VehicleSpec } {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) throw new Error('Empty input');

  const first = lines[0].split(/\s+/);
  if (first.length < 2) throw new Error('First line must provide base_delivery_cost and number_of_packages');

  const base = Number(first[0]);
  const num = Number(first[1]);
  if (isNaN(base) || isNaN(num)) throw new Error('Invalid numbers on first line');

  const pkgs: PackageInput[] = [];
  for (let i = 0; i < num; i++) {
    const tokens = lines[1 + i].split(/\s+/);
    if (tokens.length < 3) throw new Error(`Malformed package line: ${lines[1 + i]}`);
    const id = tokens[0];
    const weight = Number(tokens[1]);
    const distance = Number(tokens[2]);
    const rawOffer = tokens[3] || 'NA';
    const offerCode = rawOffer.toUpperCase() === 'NA' ? undefined : rawOffer;
    pkgs.push({ id, weight, distance, offerCode });
  }

  let vehicles: VehicleSpec | undefined = undefined;
  const vehicleLine = lines[1 + num];
  if (vehicleLine) {
    const t = vehicleLine.split(/\s+/).map(x => x.trim()).filter(Boolean);
    if (t.length >= 3) {
      const count = Number(t[0]);
      const speed = Number(t[1]);
      const maxLoad = Number(t[2]);
      if (!isNaN(count) && !isNaN(speed) && !isNaN(maxLoad)) vehicles = { count, maxSpeedKmPerHour: speed, maxCarriableKg: maxLoad } as VehicleSpec;
    }
  }

  return { base, packages: pkgs, vehicles };
}
