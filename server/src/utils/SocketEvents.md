# Documentação dos Eventos do Socket.IO - SoundShare

Este documento descreve todos os eventos disponíveis para sincronização em tempo real entre o frontend e o backend.

## Eventos de Entrada e Saída

### `joinRoom`
**Emitido pelo cliente:** Entrar em uma sala
```typescript
socket.emit('joinRoom', {
  roomId: string,
  userId: string,
  userData: {
    name: string,
    email: string,
    image: string,
    role: string,
    owner?: string,        // ID do dono da sala
    moderators?: string[]  // IDs dos moderadores
  }
});
```

**Recebido pelo cliente:** Confirmação de entrada na sala
```typescript
socket.on('roomJoined', (roomState) => {
  // roomState contém:
  // - online: boolean (status da sala)
  // - playing: boolean (se está tocando)
  // - currentTime: number (tempo atual da música)
  // - listeners: number (quantidade de usuários)
  // - playlist: Track[] (lista de músicas)
  // - currentTrack: Track | null (música atual)
  // - users: RoomUser[] (usuários na sala)
  // - currentUserRole: 'owner' | 'moderator' | 'user'
  // - canModerate: boolean (pode moderar)
});
```

### `leaveRoom`
**Emitido pelo cliente:** Sair da sala
```typescript
socket.emit('leaveRoom', {
  roomId: string,
  userId: string
});
```

## Controle de Status da Sala

### `toggleRoomStatus`
**Emitido pelo cliente:** Ativar/Desativar sala (apenas dono)
```typescript
socket.emit('toggleRoomStatus', {
  roomId: string,
  userId: string,
  online: boolean
});
```

**Recebido pelo cliente:** Sala foi desativada
```typescript
socket.on('roomOffline', ({ message }) => {
  // message: string - motivo da desativação
});
```

## Gerenciamento de Playlist

### `addTrack`
**Emitido pelo cliente:** Adicionar música à playlist
```typescript
socket.emit('addTrack', {
  roomId: string,
  track: Track,
  userId: string
});
```

**Recebido pelo cliente:** Música adicionada
```typescript
socket.on('trackAdded', ({ track, playlist }) => {
  // track: Track - música adicionada
  // playlist: Track[] - playlist atualizada
});
```

### `removeTrack`
**Emitido pelo cliente:** Remover música da playlist (dono/moderadores)
```typescript
socket.emit('removeTrack', {
  roomId: string,
  trackId: string,
  userId: string
});
```

**Recebido pelo cliente:** Música removida
```typescript
socket.on('trackRemoved', ({ trackId, playlist }) => {
  // trackId: string - ID da música removida
  // playlist: Track[] - playlist atualizada
});
```

## Controle de Reprodução

### `playPause`
**Emitido pelo cliente:** Play/Pause (dono/moderadores)
```typescript
socket.emit('playPause', {
  roomId: string,
  userId: string,
  playing: boolean
});
```

**Recebido pelo cliente:** Estado de reprodução alterado
```typescript
socket.on('playbackStateChanged', ({ playing, currentTime }) => {
  // playing: boolean - novo estado
  // currentTime: number - tempo atual
});
```

### `playTrack`
**Emitido pelo cliente:** Definir música atual (dono/moderadores)
```typescript
socket.emit('playTrack', {
  roomId: string,
  track: Track,
  userId: string
});
```

**Recebido pelo cliente:** Música alterada
```typescript
socket.on('trackChanged', ({ track, playing, currentTime }) => {
  // track: Track - nova música
  // playing: boolean - estado de reprodução
  // currentTime: number - tempo (sempre 0 para nova música)
});
```

### `syncTrack`
**Emitido pelo cliente:** Sincronizar tempo de reprodução (dono/moderadores)
```typescript
socket.emit('syncTrack', {
  roomId: string,
  currentTime: number,
  userId: string
});
```

**Recebido pelo cliente:** Sincronização de tempo
```typescript
socket.on('timeSync', ({ currentTime }) => {
  // currentTime: number - tempo sincronizado
});
```

### `nextTrack`
**Emitido pelo cliente:** Próxima música (dono/moderadores)
```typescript
socket.emit('nextTrack', {
  roomId: string,
  userId: string
});
```

**Recebido pelo cliente:** Música alterada
```typescript
socket.on('trackChanged', ({ track, playing, currentTime, direction, previousTrack }) => {
  // track: Track - nova música
  // playing: boolean - estado de reprodução
  // currentTime: number - tempo (sempre 0 para nova música)
  // direction: 'next' - indica que foi para próxima
  // previousTrack: Track - música anterior
});
```

### `previousTrack`
**Emitido pelo cliente:** Música anterior (dono/moderadores)
```typescript
socket.emit('previousTrack', {
  roomId: string,
  userId: string
});
```

**Recebido pelo cliente:** Música alterada
```typescript
socket.on('trackChanged', ({ track, playing, currentTime, direction, previousTrack }) => {
  // track: Track - nova música
  // playing: boolean - estado de reprodução
  // currentTime: number - tempo (sempre 0 para nova música)
  // direction: 'previous' - indica que foi para anterior
  // previousTrack: Track - música anterior
});
```

### `jumpToTrack`
**Emitido pelo cliente:** Pular para música específica da playlist (dono/moderadores)
```typescript
socket.emit('jumpToTrack', {
  roomId: string,
  userId: string,
  trackIndex: number  // Índice da música na playlist (0, 1, 2...)
});
```

**Recebido pelo cliente:** Música alterada
```typescript
socket.on('trackChanged', ({ track, playing, currentTime, direction, trackIndex, previousTrack }) => {
  // track: Track - nova música
  // playing: boolean - estado de reprodução
  // currentTime: number - tempo (sempre 0 para nova música)
  // direction: 'jump' - indica que foi um pulo direto
  // trackIndex: number - índice da música na playlist
  // previousTrack: Track - música anterior
});
```

## Moderação e Controle de Usuários

### `kickUser`
**Emitido pelo cliente:** Expulsar usuário (dono/moderadores)
```typescript
socket.emit('kickUser', {
  roomId: string,
  targetUserId: string,
  userId: string,
  reason?: string
});
```

**Recebido pelo usuário expulso:**
```typescript
socket.on('kicked', ({ reason, roomId }) => {
  // reason: string - motivo da expulsão
  // roomId: string - ID da sala
});
```

**Recebido pelos outros usuários:**
```typescript
socket.on('userKicked', ({ userId, reason, listeners }) => {
  // userId: string - ID do usuário expulso
  // reason: string - motivo da expulsão
  // listeners: number - novo total de usuários
});
```

### `toggleModerator`
**Emitido pelo cliente:** Adicionar/Remover moderador (apenas dono)
```typescript
socket.emit('toggleModerator', {
  roomId: string,
  targetUserId: string,
  userId: string,
  isModerator: boolean
});
```

**Recebido pelo cliente:** Moderador atualizado
```typescript
socket.on('moderatorUpdated', ({ userId, isModerator, moderators }) => {
  // userId: string - ID do usuário
  // isModerator: boolean - se foi promovido ou removido
  // moderators: string[] - lista atualizada de moderadores
});
```

## Eventos de Atualização Geral

### `updateRoom`
**Recebido pelo cliente:** Estado atualizado da sala
```typescript
socket.on('updateRoom', (roomState) => {
  // Estado completo da sala
});
```

### `userJoined`
**Recebido pelo cliente:** Usuário entrou na sala
```typescript
socket.on('userJoined', ({ user, listeners, online }) => {
  // user: RoomUser - dados do usuário
  // listeners: number - total de usuários
  // online: boolean - status da sala
});
```

### `userLeft`
**Recebido pelo cliente:** Usuário saiu da sala
```typescript
socket.on('userLeft', ({ userId, listeners }) => {
  // userId: string - ID do usuário que saiu
  // listeners: number - novo total de usuários
});
```

## Eventos de Erro e Permissão

### `permissionDenied`
**Recebido pelo cliente:** Usuário não tem permissão para ação
```typescript
socket.on('permissionDenied', ({ action, message }) => {
  // action: string - ação que foi negada
  // message: string - mensagem explicativa
});
```

### `playlistEmpty`
**Recebido pelo cliente:** Playlist está vazia
```typescript
socket.on('playlistEmpty', ({ message }) => {
  // message: string - mensagem explicativa
});
```

### `invalidTrackIndex`
**Recebido pelo cliente:** Índice de música inválido
```typescript
socket.on('invalidTrackIndex', ({ message }) => {
  // message: string - mensagem explicativa
});
```

## Manutenção de Conexão

### `ping`
**Emitido pelo cliente:** Manter conexão ativa
```typescript
socket.emit('ping');
```

**Recebido pelo cliente:** Resposta do ping
```typescript
socket.on('pong', () => {
  // Conexão ativa
});
```

## Estruturas de Dados

### `Track`
```typescript
interface Track {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  user: User;
}
```

### `RoomUser`
```typescript
interface RoomUser {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  socketId: string;
  joinedAt: Date;
}
```

### `User`
```typescript
interface User {
  id: string;
  accessToken: string;
  name: string;
  email: string;
  image: string;
  role: string;
}
```

## Exemplo de Implementação no Frontend

```typescript
import { io, Socket } from 'socket.io-client';

class SoundShareSocket {
  private socket: Socket;
  private roomId: string;
  private userId: string;

  constructor(roomId: string, userId: string, userData: any) {
    this.roomId = roomId;
    this.userId = userId;
    this.socket = io('http://localhost:3000');
    
    this.setupEventListeners();
    this.joinRoom(userData);
  }

  private setupEventListeners() {
    // Entrar na sala
    this.socket.on('roomJoined', (roomState) => {
      console.log('Entrou na sala:', roomState);
      // Atualizar UI com estado da sala
    });

    // Atualizações da sala
    this.socket.on('updateRoom', (roomState) => {
      console.log('Sala atualizada:', roomState);
      // Atualizar UI
    });

    // Usuário entrou
    this.socket.on('userJoined', ({ user, listeners }) => {
      console.log(`${user.name} entrou na sala. Total: ${listeners}`);
      // Atualizar contador de usuários
    });

    // Usuário saiu
    this.socket.on('userLeft', ({ userId, listeners }) => {
      console.log(`Usuário saiu. Total: ${listeners}`);
      // Atualizar contador de usuários
    });

    // Música adicionada
    this.socket.on('trackAdded', ({ track, playlist }) => {
      console.log(`Música "${track.title}" adicionada`);
      // Atualizar playlist na UI
    });

    // Música removida
    this.socket.on('trackRemoved', ({ trackId, playlist }) => {
      console.log(`Música removida: ${trackId}`);
      // Atualizar playlist na UI
    });

    // Música alterada
    this.socket.on('trackChanged', ({ track, playing, currentTime }) => {
      console.log(`Nova música: ${track.title}`);
      // Atualizar player
    });

    // Estado de reprodução
    this.socket.on('playbackStateChanged', ({ playing, currentTime }) => {
      console.log(`Reprodução: ${playing ? 'play' : 'pause'}`);
      // Atualizar controles de reprodução
    });

    // Sincronização de tempo
    this.socket.on('timeSync', ({ currentTime }) => {
      console.log(`Tempo sincronizado: ${currentTime}`);
      // Sincronizar player
    });

    // Sala offline
    this.socket.on('roomOffline', ({ message }) => {
      console.log(`Sala offline: ${message}`);
      // Mostrar mensagem e redirecionar
    });

    // Usuário expulso
    this.socket.on('kicked', ({ reason, roomId }) => {
      console.log(`Expulso: ${reason}`);
      // Mostrar mensagem e sair da sala
    });

    // Moderador atualizado
    this.socket.on('moderatorUpdated', ({ userId, isModerator }) => {
      console.log(`Moderador ${isModerator ? 'adicionado' : 'removido'}: ${userId}`);
      // Atualizar permissões na UI
    });

    // Eventos de erro e permissão
    this.socket.on('permissionDenied', ({ action, message }) => {
      console.log(`Permissão negada para ${action}: ${message}`);
      // Mostrar mensagem de erro na UI
    });

    this.socket.on('playlistEmpty', ({ message }) => {
      console.log(`Playlist vazia: ${message}`);
      // Mostrar mensagem na UI
    });

    this.socket.on('invalidTrackIndex', ({ message }) => {
      console.log(`Índice inválido: ${message}`);
      // Mostrar mensagem de erro na UI
    });
  }

  public joinRoom(userData: any) {
    this.socket.emit('joinRoom', {
      roomId: this.roomId,
      userId: this.userId,
      userData
    });
  }

  public addTrack(track: any) {
    this.socket.emit('addTrack', {
      roomId: this.roomId,
      track,
      userId: this.userId
    });
  }

  public removeTrack(trackId: string) {
    this.socket.emit('removeTrack', {
      roomId: this.roomId,
      trackId,
      userId: this.userId
    });
  }

  public playPause(playing: boolean) {
    this.socket.emit('playPause', {
      roomId: this.roomId,
      userId: this.userId,
      playing
    });
  }

  public playTrack(track: any) {
    this.socket.emit('playTrack', {
      roomId: this.roomId,
      track,
      userId: this.userId
    });
  }

  public syncTime(currentTime: number) {
    this.socket.emit('syncTrack', {
      roomId: this.roomId,
      currentTime,
      userId: this.userId
    });
  }

  public nextTrack() {
    this.socket.emit('nextTrack', {
      roomId: this.roomId,
      userId: this.userId
    });
  }

  public previousTrack() {
    this.socket.emit('previousTrack', {
      roomId: this.roomId,
      userId: this.userId
    });
  }

  public jumpToTrack(trackIndex: number) {
    this.socket.emit('jumpToTrack', {
      roomId: this.roomId,
      userId: this.userId,
      trackIndex
    });
  }

  public kickUser(targetUserId: string, reason?: string) {
    this.socket.emit('kickUser', {
      roomId: this.roomId,
      targetUserId,
      userId: this.userId,
      reason
    });
  }

  public toggleModerator(targetUserId: string, isModerator: boolean) {
    this.socket.emit('toggleModerator', {
      roomId: this.roomId,
      targetUserId,
      userId: this.userId,
      isModerator
    });
  }

  public toggleRoomStatus(online: boolean) {
    this.socket.emit('toggleRoomStatus', {
      roomId: this.roomId,
      userId: this.userId,
      online
    });
  }

  public leaveRoom() {
    this.socket.emit('leaveRoom', {
      roomId: this.roomId,
      userId: this.userId
    });
  }

  public disconnect() {
    this.socket.disconnect();
  }
}

export default SoundShareSocket;
```

## Notas Importantes

1. **Permissões**: Apenas o dono da sala pode ativar/desativar a sala e gerenciar moderadores
2. **Moderação**: Dono e moderadores podem controlar reprodução, playlist e expulsar usuários
3. **Sincronização**: O tempo de reprodução é sincronizado apenas por quem tem permissão
4. **Estado da Sala**: A sala fica offline automaticamente quando o dono sai ou é desconectado
5. **Contadores**: Os contadores de usuários são atualizados automaticamente
6. **Desconexão**: Usuários são removidos automaticamente em caso de desconexão
