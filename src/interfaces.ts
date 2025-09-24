export interface PackageInput {
  id: string;
  weight: number; // kg
  distance: number; // km
  offerCode?: string; // optional, like "OFR001"
}

export interface PackageComputed extends PackageInput {
  deliveryCost: number; // base + weight*10 + distance*5
  discount: number; // money subtracted
  totalCost: number; // deliveryCost - discount
  estimatedDeliveryTime?: number; // hours, optional (present only if scheduling ran)
}

export interface VehicleSpec {
  count: number;
  maxSpeedKmPerHour: number;
  maxCarriableKg: number;
}
