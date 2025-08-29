# Correção: currentTime sendo 0 ao entrar na sala

## Problema Identificado

Ao entrar na sala, o backend está enviando `currentTime: 0` mesmo quando há uma fonte de sincronização ativa:

```javascript
{
  roomId: 'Evv6GpZ47jqZaXc9REgq', 
  online: true, 
  playing: false, 
  currentTime: 0,  // ❌ PROBLEMA: Sempre 0
  listeners: 2,
  syncSource: {
    userId: 'zFrO2zkoKKTc9REgq', 
    userRole: 'DFSSq8q4Q82xlnWB28qV', 
    lastSyncTime: 0, 
    isActive: true,  // ✅ Fonte ativa
    lastActivity: '2025-08-29T03:42:01.770Z'
  },
  trackStartTime: null,
  lastSyncTime: 0
}
```

## Causas do Problema

1. **Backend não calcula tempo atual**: O `currentTime` não está sendo calculado corretamente
2. **Fonte de sincronização inativa**: Mesmo com `isActive: true`, o tempo não é sincronizado
3. **Estado inconsistente**: `playing: false` mas há fonte de sincronização ativa

## Soluções Implementadas

### 1. Detecção de Fonte Ativa com Tempo Zero

**Arquivo**: `src/contexts/PlayerContext/useSocketStore/index.ts`

**Problema**: Fonte ativa mas `currentTime` é 0
**Solução**: Detecta e tenta sincronizar com fallback

```typescript
// ✅ CORREÇÃO: Se há fonte de sincronização ativa mas currentTime é 0, tenta sincronizar
if (roomState.syncSource?.isActive && roomState.currentTime === 0) {
    console.log(`⚠️ Fonte ativa mas currentTime é 0 - tentando sincronizar com fallback`);
    
    // Tenta sincronizar com tempo estimado baseado no lastSyncTime
    if (roomState.syncSource.lastSyncTime > 0) {
        const estimatedTime = roomState.syncSource.lastSyncTime;
        console.log(`🔄 Usando tempo estimado da fonte: ${estimatedTime}s`);
        
        window.dispatchEvent(new CustomEvent('syncWithSource', {
            detail: { 
                currentTime: estimatedTime,
                trackId: firstTrack.id,
                syncSource: roomState.syncSource
            }
        }));
    }
}
```

### 2. Solicitação de Tempo Atual via Socket

**Arquivo**: `src/contexts/PlayerContext/useSocketStore/index.ts`

**Problema**: Não há como obter tempo atual da fonte
**Solução**: Solicita tempo atual via socket

```typescript
// ✅ CORREÇÃO: Se há fonte de sincronização ativa mas currentTime é 0, solicita tempo atual
if (roomState.syncSource?.isActive) {
    if (roomState.currentTime > 0) {
        // Sincroniza normalmente
        console.log(`🔄 Sincronizando com fonte: ${roomState.syncSource.userRole} ${roomState.syncSource.userId} - Tempo: ${Math.floor(roomState.currentTime / 60)}:${(roomState.currentTime % 60).toString().padStart(2, '0')}`);
        
        window.dispatchEvent(new CustomEvent('syncWithSource', {
            detail: { 
                currentTime: roomState.currentTime,
                trackId: firstTrack.id,
                syncSource: roomState.syncSource
            }
        }));
    } else {
        console.log(`⚠️ Fonte ativa mas currentTime é 0 - solicitando tempo atual via socket`);
        // Solicita tempo atual da fonte de sincronização
        const { socket } = get();
        if (socket) {
            socket.emit("requestCurrentTime", {
                roomId: roomState.roomId,
                userId: roomState.syncSource.userId
            });
        }
    }
}
```

### 3. Listener para Resposta de Tempo Atual

**Arquivo**: `src/contexts/PlayerContext/useSocketStore/index.ts`

**Problema**: Não há como receber tempo atual da fonte
**Solução**: Listener para resposta de tempo atual

```typescript
// ✅ NOVA IMPLEMENTAÇÃO: Recebe tempo atual da fonte de sincronização
socket.on("currentTimeResponse", ({ currentTime, trackId, syncSource }) => {
    console.log(`🕐 Tempo atual recebido da fonte: ${currentTime}s para música ${trackId}`);
    
    if (currentTime > 0) {
        // Emite evento para sincronização com o tempo atual
        window.dispatchEvent(new CustomEvent('syncWithSource', {
            detail: { 
                currentTime: currentTime,
                trackId: trackId,
                syncSource: syncSource
            }
        }));
    }
});
```

### 4. Fallback com Tempo Estimado

**Arquivo**: `src/contexts/PlayerContext/useSocketStore/index.ts`

**Problema**: Sem tempo atual, não há sincronização
**Solução**: Usa `lastSyncTime` como fallback

```typescript
// ✅ CORREÇÃO: Se há fonte de sincronização ativa mas currentTime é 0, tenta sincronizar
if (roomState.syncSource?.isActive && roomState.currentTime === 0 && roomState.playlist.length > 0) {
    console.log(`⚠️ updateRoom: Fonte ativa mas currentTime é 0 - tentando sincronizar com fallback`);
    
    // Tenta sincronizar com tempo estimado baseado no lastSyncTime
    if (roomState.syncSource.lastSyncTime > 0) {
        const estimatedTime = roomState.syncSource.lastSyncTime;
        const firstTrack = roomState.playlist[0];
        console.log(`🔄 Usando tempo estimado da fonte: ${estimatedTime}s`);
        
        window.dispatchEvent(new CustomEvent('syncWithSource', {
            detail: { 
                currentTime: estimatedTime,
                trackId: firstTrack.id,
                syncSource: roomState.syncSource
            }
        }));
    }
}
```

## Implementação no Backend

Para que essas correções funcionem completamente, o backend precisa implementar:

### 1. Evento `requestCurrentTime`

```typescript
// No backend
socket.on("requestCurrentTime", ({ roomId, userId }) => {
    const room = rooms[roomId];
    if (room && room.syncSource?.userId === userId) {
        // Calcula tempo atual baseado no trackStartTime
        const currentTime = calculateCurrentTime(room);
        
        // Envia resposta com tempo atual
        socket.emit("currentTimeResponse", {
            currentTime: currentTime,
            trackId: room.currentTrack?.id,
            syncSource: room.syncSource
        });
    }
});
```

### 2. Cálculo Correto do `currentTime`

```typescript
// No backend - função calculateCurrentTime
function calculateCurrentTime(room: RoomState): number {
    if (!room.playing || !room.trackStartTime || !room.currentTrack) {
        return room.currentTime;
    }
    
    const now = new Date();
    const elapsedSeconds = Math.floor((now.getTime() - room.trackStartTime.getTime()) / 1000);
    const calculatedTime = room.lastSyncTime + elapsedSeconds;
    
    return calculatedTime;
}
```

### 3. Atualização do `currentTime` no `roomJoined`

```typescript
// No backend - evento joinRoom
if (room.playing && room.currentTrack && room.trackStartTime) {
    // Calcula tempo atual real
    room.currentTime = calculateCurrentTime(room);
    console.log(`🎯 Usuário entrando: música tocando, tempo calculado: ${room.currentTime}s`);
}
```

## Resultado Esperado

Após essas correções:

1. ✅ **Tempo calculado corretamente**: Backend calcula `currentTime` real
2. ✅ **Sincronização automática**: Novos usuários entram sincronizados
3. ✅ **Fallback robusto**: Funciona mesmo se backend falhar
4. ✅ **Solicitação de tempo**: Pode solicitar tempo atual da fonte

## Como Testar

1. Abra uma sala com música tocando
2. Entre com outro usuário em nova aba/incógnito
3. Verifique se:
   - O `currentTime` não é mais 0
   - A música sincroniza automaticamente
   - Os logs mostram sincronização bem-sucedida

## Logs Esperados

```
🎯 Estado ao entrar na sala: {playing: true, currentTrack: "Nome da Música", syncSource: "userId", playlistLength: 2, currentTime: 45}
🎵 Música tocando com fonte de sincronização: Nome da Música
🔄 Sincronizando com fonte: owner userId - Tempo: 0:45
🎯 SINCRONIZAÇÃO: owner userId - Tempo: 0:45
✅ Sincronização concluída
```

## Próximos Passos

1. **Implementar no backend**: Evento `requestCurrentTime` e cálculo correto do `currentTime`
2. **Testar sincronização**: Verificar se novos usuários entram sincronizados
3. **Monitorar logs**: Acompanhar se as correções estão funcionando
4. **Refinar fallbacks**: Ajustar estratégias de sincronização conforme necessário
