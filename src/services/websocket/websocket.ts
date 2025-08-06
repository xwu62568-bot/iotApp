import { ENV } from '../../config/environments';
import { WebSocketMessage, WebSocketConfig, WebSocketState } from '../../types/api';
import { DeviceEvent } from '../../types/device';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private messageQueue: WebSocketMessage[] = [];
  private listeners: Map<string, ((data: any) => void)[]> = new Map();
  private state: WebSocketState = {
    connected: false,
    connecting: false,
    error: null,
    lastMessage: null,
  };

  constructor(private config: WebSocketConfig) {}

  // 连接WebSocket
  async connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.state.connecting = true;
    this.state.error = null;

    try {
      this.ws = new WebSocket(this.config.url, this.config.protocols);
      this.setupEventHandlers();
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  // 设置事件处理器
  private setupEventHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.state.connected = true;
      this.state.connecting = false;
      this.reconnectAttempts = 0;
      this.flushMessageQueue();
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      this.state.connected = false;
      this.state.connecting = false;
      
      if (!event.wasClean) {
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.handleError(error as unknown as Error);
    };
  }

  // 处理接收到的消息
  private handleMessage(message: WebSocketMessage): void {
    this.state.lastMessage = message;
    
    // 触发对应类型的监听器
    const listeners = this.listeners.get(message.type);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(message.data);
        } catch (error) {
          console.error('Error in WebSocket listener:', error);
        }
      });
    }

    // 处理特殊消息类型
    switch (message.type) {
      case 'device_status_update':
        this.handleDeviceStatusUpdate(message.data);
        break;
      case 'device_event':
        this.handleDeviceEvent(message.data);
        break;
      case 'scene_execution':
        this.handleSceneExecution(message.data);
        break;
      case 'error':
        this.handleError(new Error(message.data.message));
        break;
    }
  }

  // 处理设备状态更新
  private handleDeviceStatusUpdate(data: any): void {
    // 这里可以触发设备状态更新的全局事件
    this.emit('deviceStatusUpdate', data);
  }

  // 处理设备事件
  private handleDeviceEvent(data: DeviceEvent): void {
    // 这里可以触发设备事件的全局事件
    this.emit('deviceEvent', data);
  }

  // 处理场景执行
  private handleSceneExecution(data: any): void {
    // 这里可以触发场景执行的全局事件
    this.emit('sceneExecution', data);
  }

  // 发送消息
  send(type: string, data: any): void {
    const message: WebSocketMessage = {
      type,
      data,
      timestamp: new Date().toISOString(),
      id: this.generateMessageId(),
    };

    if (this.state.connected && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      this.messageQueue.push(message);
    }
  }

  // 发送设备控制命令
  sendDeviceCommand(deviceId: string, command: string, parameters?: any): void {
    this.send('device_command', {
      deviceId,
      command,
      parameters,
      timestamp: new Date().toISOString(),
    });
  }

  // 发送场景执行命令
  sendSceneCommand(sceneId: string, action: 'start' | 'stop' | 'pause'): void {
    this.send('scene_command', {
      sceneId,
      action,
      timestamp: new Date().toISOString(),
    });
  }

  // 订阅设备状态
  subscribeToDevice(deviceId: string): void {
    this.send('subscribe_device', { deviceId });
  }

  // 取消订阅设备状态
  unsubscribeFromDevice(deviceId: string): void {
    this.send('unsubscribe_device', { deviceId });
  }

  // 添加消息监听器
  on(type: string, callback: (data: any) => void): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)!.push(callback);
  }

  // 移除消息监听器
  off(type: string, callback: (data: any) => void): void {
    const listeners = this.listeners.get(type);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  // 触发事件
  private emit(type: string, data: any): void {
    const listeners = this.listeners.get(type);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }

  // 处理错误
  private handleError(error: Error): void {
    this.state.error = error.message;
    this.state.connecting = false;
    console.error('WebSocket error:', error);
  }

  // 安排重连
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Scheduling reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.reconnectInterval * this.reconnectAttempts);
  }

  // 刷新消息队列
  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message && this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(message));
      }
    }
  }

  // 生成消息ID
  private generateMessageId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // 获取连接状态
  getState(): WebSocketState {
    return { ...this.state };
  }

  // 断开连接
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }

    this.state.connected = false;
    this.state.connecting = false;
    this.reconnectAttempts = 0;
  }

  // 清理资源
  destroy(): void {
    this.disconnect();
    this.listeners.clear();
    this.messageQueue = [];
  }
}

// 创建WebSocket服务实例
export const websocketService = new WebSocketService({
  url: ENV.websocketUrl,
  reconnectInterval: 3000,
  maxReconnectAttempts: 5,
});

export default websocketService; 