/**
 * Event Bus para comunicação entre componentes
 * Permite comunicação desacoplada entre stores e componentes
 */
class EventBus {
  private static instance: EventBus;
  private listeners: Map<string, Function[]> = new Map();

  private constructor() {}

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Emite um evento para todos os listeners
   */
  emit(event: string, data?: any): void {
    const eventListeners = this.listeners.get(event) || [];
    eventListeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error(`Erro ao executar listener do evento ${event}:`, error);
      }
    });
  }

  /**
   * Adiciona um listener para um evento
   */
  on(event: string, listener: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }

  /**
   * Remove um listener específico
   */
  off(event: string, listener: Function): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(listener);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  /**
   * Remove todos os listeners de um evento
   */
  removeAllListeners(event: string): void {
    this.listeners.delete(event);
  }

  /**
   * Remove todos os listeners
   */
  clear(): void {
    this.listeners.clear();
  }
}

export const eventBus = EventBus.getInstance();

// Eventos padronizados
export const EVENTS = {
  // Player events
  PLAYER_PLAY: 'player:play',
  PLAYER_PAUSE: 'player:pause',
  PLAYER_SEEK: 'player:seek',
  PLAYER_TIME_UPDATE: 'player:timeUpdate',
  PLAYER_DURATION_CHANGE: 'player:durationChange',
  
  // Playlist events
  PLAYLIST_ADD: 'playlist:add',
  PLAYLIST_REMOVE: 'playlist:remove',
  PLAYLIST_CLEAR: 'playlist:clear',
  PLAYLIST_UPDATE: 'playlist:update',
  
  // Room events
  ROOM_JOIN: 'room:join',
  ROOM_LEAVE: 'room:leave',
  ROOM_UPDATE: 'room:update',
  
  // Sync events
  SYNC_START: 'sync:start',
  SYNC_STOP: 'sync:stop',
  SYNC_TIME_UPDATE: 'sync:timeUpdate',
  
  // Track events
  TRACK_CHANGE: 'track:change',
  TRACK_LOAD: 'track:load',
  TRACK_UNLOAD: 'track:unload',
} as const;

export type EventType = typeof EVENTS[keyof typeof EVENTS];
