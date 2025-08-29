# Implementação do Socket.IO - SoundShare Frontend

Este documento explica como usar as novas funcionalidades de socket implementadas no frontend do SoundShare.

## 🚀 Funcionalidades Implementadas

### 1. **Controle de Status da Sala**
- ✅ Sala fica online automaticamente quando o dono entra
- ✅ Botão para ativar/desativar sala (apenas dono)
- ✅ Sala fica offline quando o dono sai

### 2. **Sincronização em Tempo Real**
- ✅ Usuários recebem status atual da sala ao entrar
- ✅ Contador de usuários atualizado automaticamente
- ✅ Playlist sincronizada entre todos os usuários
- ✅ Música atual e tempo sincronizados

### 3. **Sistema de Permissões**
- ✅ **Dono**: Controle total da sala
- ✅ **Moderador**: Pode controlar reprodução e playlist
- ✅ **Usuário**: Apenas ouve e adiciona músicas

### 4. **Controles de Moderação**
- ✅ Expulsar usuários
- ✅ Adicionar/remover moderadores
- ✅ Controle de reprodução (play/pause, próximo/anterior)
- ✅ Gerenciamento de playlist

## 📁 Arquivos Atualizados

### `useSocketStore` (`src/contexts/PlayerContext/useSocketStore/index.ts`)
- Implementa todos os eventos do socket conforme documentação
- Gerencia conexão e desconexão
- Configura listeners para todos os eventos

### `useRoomStore` (`src/contexts/PlayerContext/useRoomStore/index.ts`)
- Gerencia estado da sala (online/offline)
- Controla permissões (dono, moderador, usuário)
- Atualiza contadores de usuários

### `usePlayerStore` (`src/contexts/PlayerContext/usePlayerStore/index.ts`)
- Controles de reprodução com verificação de permissões
- Sincronização de tempo
- Navegação entre músicas

### `usePlaylistStore` (`src/contexts/PlayerContext/usePlaylistStore/index.ts`)
- Gerenciamento de playlist com permissões
- Adicionar/remover músicas
- Navegação controlada

## 🎯 Como Usar

### 1. **Conectar à Sala**
```typescript
import { useSocketStore } from '../contexts/PlayerContext/useSocketStore';

const { connect } = useSocketStore();

// Conectar à sala
connect(roomId, {
  name: user.name,
  email: user.email,
  image: user.image,
  role: user.role,
  owner: roomOwnerId,
  moderators: roomModerators
});
```

### 2. **Verificar Permissões**
```typescript
import { useRoomStore } from '../contexts/PlayerContext/useRoomStore';

const { isHost, isModerator, canModerate } = useRoomStore();

// Mostrar controles apenas para quem pode moderar
{canModerate && (
  <button onClick={handlePlayPause}>
    {isPlaying ? 'Pausar' : 'Tocar'}
  </button>
)}
```

### 3. **Controles de Reprodução**
```typescript
import { useSocketStore } from '../contexts/PlayerContext/useSocketStore';

const { playPause, nextTrack, previousTrack, jumpToTrack } = useSocketStore();

// Só funciona se o usuário tiver permissão
playPause(true);        // Tocar
playPause(false);       // Pausar
nextTrack();            // Próxima música
previousTrack();        // Música anterior
jumpToTrack(2);         // Pular para música específica
```

### 4. **Gerenciar Playlist**
```typescript
import { usePlaylistStore } from '../contexts/PlayerContext/usePlaylistStore';

const { addTrack, removeTrack } = usePlaylistStore();

// Adicionar música (qualquer usuário)
addTrack(roomId, track);

// Remover música (apenas dono/moderador)
removeTrack(trackId);
```

### 5. **Moderação de Usuários**
```typescript
import { useSocketStore } from '../contexts/PlayerContext/useSocketStore';

const { kickUser, toggleModerator } = useSocketStore();

// Expulsar usuário (apenas dono/moderador)
kickUser(userId, 'Motivo da expulsão');

// Adicionar/remover moderador (apenas dono)
toggleModerator(userId, true);   // Adicionar
toggleModerator(userId, false);  // Remover
```

### 6. **Controle de Status da Sala**
```typescript
import { useSocketStore } from '../contexts/PlayerContext/useSocketStore';

const { toggleRoomStatus } = useSocketStore();

// Ativar/desativar sala (apenas dono)
toggleRoomStatus(true);   // Ativar
toggleRoomStatus(false);  // Desativar
```

## 🎮 Componente de Exemplo

O componente `RoomControls` demonstra todas as funcionalidades:

```typescript
import { RoomControls } from '../components/RoomControls';

// Usar no componente da sala
<RoomControls roomId={roomId} />
```

## 📡 Eventos do Socket

### **Eventos de Entrada/Saída**
- `joinRoom` → `roomJoined`
- `leaveRoom`

### **Eventos de Status**
- `toggleRoomStatus` → `roomOffline`

### **Eventos de Playlist**
- `addTrack` → `trackAdded`
- `removeTrack` → `trackRemoved`

### **Eventos de Reprodução**
- `playPause` → `playbackStateChanged`
- `playTrack` → `trackChanged`
- `syncTrack` → `timeSync`
- `nextTrack` → `trackChanged`
- `previousTrack` → `trackChanged`
- `jumpToTrack` → `trackChanged`

### **Eventos de Moderação**
- `kickUser` → `kicked` / `userKicked`
- `toggleModerator` → `moderatorUpdated`

### **Eventos de Atualização**
- `updateRoom`
- `userJoined`
- `userLeft`

### **Eventos de Erro**
- `permissionDenied`
- `playlistEmpty`
- `invalidTrackIndex`

## 🔒 Sistema de Permissões

### **Dono da Sala**
- ✅ Ativar/desativar sala
- ✅ Gerenciar moderadores
- ✅ Controle total de reprodução
- ✅ Gerenciar playlist
- ✅ Expulsar usuários

### **Moderador**
- ✅ Controlar reprodução
- ✅ Gerenciar playlist
- ✅ Expulsar usuários
- ❌ Ativar/desativar sala
- ❌ Gerenciar outros moderadores

### **Usuário**
- ✅ Adicionar músicas à playlist
- ✅ Ouvir música
- ❌ Controlar reprodução
- ❌ Gerenciar playlist
- ❌ Expulsar usuários

## 🚨 Tratamento de Erros

### **Permissão Negada**
```typescript
socket.on('permissionDenied', ({ action, message }) => {
  console.log(`Permissão negada para ${action}: ${message}`);
  // Mostrar mensagem de erro na UI
});
```

### **Sala Offline**
```typescript
socket.on('roomOffline', ({ message }) => {
  console.log(`Sala offline: ${message}`);
  // Redirecionar usuários para fora da sala
});
```

### **Usuário Expulso**
```typescript
socket.on('kicked', ({ reason, roomId }) => {
  console.log(`Expulso: ${reason}`);
  // Mostrar mensagem e sair da sala
});
```

## 🔄 Manutenção de Conexão

### **Ping Automático**
```typescript
// Ping a cada 30 segundos para manter conexão ativa
useEffect(() => {
  const interval = setInterval(() => {
    ping();
  }, 30000);

  return () => clearInterval(interval);
}, [ping]);
```

## 📱 Responsividade

O componente `RoomControls` é totalmente responsivo e se adapta a diferentes tamanhos de tela:

- **Desktop**: Layout horizontal com todos os controles visíveis
- **Tablet**: Layout adaptado com controles organizados
- **Mobile**: Layout vertical com controles empilhados

## 🎨 Estilização

Os estilos usam `styled-components` com:
- Design moderno e limpo
- Cores consistentes com o tema
- Animações suaves
- Estados visuais claros (ativo/inativo, online/offline)
- Ícones intuitivos para cada ação

## 🚀 Próximos Passos

1. **Integrar com componentes existentes**
2. **Adicionar notificações toast para eventos**
3. **Implementar histórico de ações**
4. **Adicionar logs de moderação**
5. **Implementar sistema de backup de playlist**

## 📞 Suporte

Para dúvidas ou problemas com a implementação:
1. Verificar console do navegador para erros
2. Confirmar se o backend está rodando na porta correta
3. Verificar se as permissões estão sendo definidas corretamente
4. Testar com diferentes tipos de usuário (dono, moderador, usuário)
