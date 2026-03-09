import { Vehicle, AppConfig, DEFAULT_CONFIG } from './recicladora-types';

const STORAGE_KEYS = {
    vehicles: 'recicladora_salvados',
    config: 'recicladora_config',
};

export function getVehicles(): Vehicle[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.vehicles);
    return data ? JSON.parse(data) : [];
}

export function saveVehicles(vehicles: Vehicle[]): void {
    localStorage.setItem(STORAGE_KEYS.vehicles, JSON.stringify(vehicles));
}

export function getVehicleById(id: string): Vehicle | undefined {
    return getVehicles().find(v => v.id === id);
}

export function addVehicle(vehicle: Vehicle): void {
    const vehicles = getVehicles();
    vehicles.push(vehicle);
    saveVehicles(vehicles);
}

export function updateVehicle(id: string, updates: Partial<Vehicle>): void {
    const vehicles = getVehicles();
    const index = vehicles.findIndex(v => v.id === id);
    if (index !== -1) {
        vehicles[index] = { ...vehicles[index], ...updates, updatedAt: new Date().toISOString() };
        saveVehicles(vehicles);
    }
}

export function deleteVehicle(id: string): void {
    const vehicles = getVehicles().filter(v => v.id !== id);
    saveVehicles(vehicles);
}

export function getConfig(): AppConfig {
    if (typeof window === 'undefined') return DEFAULT_CONFIG;
    const data = localStorage.getItem(STORAGE_KEYS.config);
    return data ? { ...DEFAULT_CONFIG, ...JSON.parse(data) } : DEFAULT_CONFIG;
}

export function saveConfig(config: AppConfig): void {
    localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(config));
}
