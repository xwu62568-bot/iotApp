export type DeviceType = 
  | 'light'
  | 'switch'
  | 'sensor'
  | 'camera'
  | 'thermostat'
  | 'lock'
  | 'speaker'
  | 'fan'
  | 'curtain'
  | 'other';

export type DeviceStatus = 'online' | 'offline' | 'error' | 'maintenance';

export type DeviceConnectionType = 'wifi' | 'bluetooth' | 'zigbee' | 'z-wave' | 'ethernet';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  model: string;
  manufacturer: string;
  status: DeviceStatus;
  connectionType: DeviceConnectionType;
  ipAddress?: string;
  macAddress?: string;
  firmwareVersion: string;
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
  roomId?: string;
  roomName?: string;
  capabilities: DeviceCapability[];
  properties: DeviceProperties;
  settings: DeviceSettings;
  metadata: DeviceMetadata;
}

export interface DeviceCapability {
  name: string;
  type: 'read' | 'write' | 'both';
  unit?: string;
  range?: {
    min: number;
    max: number;
    step?: number;
  };
  options?: string[];
}

export interface DeviceProperties {
  power?: boolean;
  brightness?: number;
  color?: {
    r: number;
    g: number;
    b: number;
  };
  temperature?: number;
  humidity?: number;
  motion?: boolean;
  contact?: boolean;
  battery?: number;
  signal?: number;
  [key: string]: any;
}

export interface DeviceSettings {
  autoOff?: boolean;
  autoOffDelay?: number;
  brightnessLimit?: number;
  temperatureLimit?: number;
  notifications?: boolean;
  [key: string]: any;
}

export interface DeviceMetadata {
  icon?: string;
  image?: string;
  description?: string;
  tags?: string[];
  location?: {
    latitude?: number;
    longitude?: number;
    address?: string;
  };
}

export interface DeviceState {
  devices: Device[];
  loading: boolean;
  error: string | null;
  selectedDevice: Device | null;
}

export interface DeviceAction {
  deviceId: string;
  action: string;
  parameters?: Record<string, any>;
}

export interface DeviceEvent {
  deviceId: string;
  eventType: string;
  timestamp: string;
  data: any;
} 