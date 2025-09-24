import { PackageInput } from '../../interfaces'
import { roundMoney } from '../../utils';

type OfferRule = {
  code: string;
  percent: number; // discount percent
  minWeight: number;
  maxWeight: number;
  minDistance: number;
  maxDistance: number;
};

const RULES: OfferRule[] = [ //from problem pdf
  { code: 'OFR001', percent: 10, minWeight: 70, maxWeight: 200, minDistance: 0, maxDistance: 200 },
  { code: 'OFR002', percent: 7, minWeight: 100, maxWeight: 250, minDistance: 50, maxDistance: 150 },
  { code: 'OFR003', percent: 5, minWeight: 10, maxWeight: 150, minDistance: 50, maxDistance: 250 }
];

export function getOfferRule(code?: string) {
  if (!code) return undefined;
  return RULES.find(r => r.code === code.toUpperCase());
}

export function calculateDiscount(pkg: PackageInput, deliveryCost: number): number {
  const rule = getOfferRule(pkg.offerCode);
  if (!rule) return 0;

  const eligible = pkg.weight >= rule.minWeight && pkg.weight <= rule.maxWeight && pkg.distance >= rule.minDistance && pkg.distance <= rule.maxDistance;
  if (!eligible) return 0;

  return roundMoney((deliveryCost * rule.percent) / 100);
}
