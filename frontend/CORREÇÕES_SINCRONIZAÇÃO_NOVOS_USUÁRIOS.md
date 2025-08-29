# Correções de Sincronização para Novos Usuários

## Problema Identificado

Novos usuários entravam na sala mas:
- A música não dava play automaticamente
- Não iniciava sincronizado com o usuário centro
- O sistema de fonte de sincronização estava muito restritivo

## Logs do Problema

```
index.ts:198 Entrou na sala: {roomId: 'Evv6GpZ47jqZaXc9REgq', online: false, playing: false, currentTime: 0, listeners: 2, …}
index.ts:215 🎵 updateRoom: Definindo primeira música da playlist como atual
index.ts:242 Estado da sala atualizado: {roomId: 'Evv6GpZ47jqZaXc9REgq', online: false, playing: false, currentTime: 0, listeners: 2, …}
```

## Correções Implementadas

### 1. Evento `roomJoined` - Sincronização Automática

**Arquivo**: `src/contexts/PlayerContext/useSocketStore/index.ts`

**Problema**: O sistema só sincronizava se a fonte de sincronização estivesse ativa
**Solução**: Sempre sincroniza se houver tempo, independente da fonte estar ativa

```typescript
// ✅ CORREÇÃO: Sempre sincroniza se houver tempo, independente da fonte estar ativa
if (roomState.currentTime && roomState.currentTime > 0) {
    console.log(`🔄 Sincronizando com fonte: ${roomState.syncSource.userRole} ${roomState.syncSource.userId} - Tempo: ${Math.floor(roomState.currentTime / 60)}:${(roomState.currentTime % 60).toString().padStart(2, '0')}`);
    
    // ✅ Emite evento para sincronização inicial
    window.dispatchEvent(new CustomEvent('syncWithSource', {
        detail: { 
            currentTime: roomState.currentTime,
            trackId: roomState.currentTrack.id,
            syncSource: roomState.syncSource
        }
    }));
}
```

### 2. Evento `updateRoom` - Sincronização Contínua

**Arquivo**: `src/contexts/PlayerContext/useSocketStore/index.ts`

**Problema**: Não sincronizava tempo via updateRoom
**Solução**: Emite evento de sincronização se houver fonte ativa

```typescript
// ✅ CORREÇÃO: Emite evento para sincronização se houver fonte ativa
if (roomState.syncSource?.isActive) {
    window.dispatchEvent(new CustomEvent('syncWithSource', {
        detail: { 
            currentTime: roomState.currentTime,
            trackId: roomState.currentTrack.id,
            syncSource: roomState.syncSource
        }
    }));
}
```

### 3. Evento `trackChanged` - Sincronização de Novas Músicas

**Arquivo**: `src/contexts/PlayerContext/useSocketStore/index.ts`

**Problema**: Não sincronizava tempo ao mudar música
**Solução**: Emite evento para sincronização imediata

```typescript
// ✅ CORREÇÃO: Emite evento para sincronização imediata
if (currentTime && currentTime > 0) {
    console.log(`🔄 Sincronizando tempo para nova música: ${Math.floor(currentTime / 60)}:${(currentTime % 60).toString().padStart(2, '0')}`);
    
    window.dispatchEvent(new CustomEvent('syncWithSource', {
        detail: { 
            currentTime: currentTime,
            trackId: track.id,
            syncSource: null // Nova música não tem fonte específica ainda
        }
    }));
}
```

### 4. VideoPlayer - Sincronização Visual

**Arquivo**: `src/components/VideoPlayer/index.tsx`

**Problema**: Só sincronizava se a fonte estivesse ativa
**Solução**: Sempre sincroniza visual se houver tempo

```typescript
// ✅ CORREÇÃO: Sempre atualiza visual se houver tempo, independente da fonte
if (roomState.currentTime > 0) {
    console.log(`🔄 Atualizando estado visual: ${Math.floor(roomState.currentTime / 60)}:${(roomState.currentTime % 60).toString().padStart(2, '0')}`);
    
    // Atualiza apenas o estado local (sem interferir no player)
    setPlayed(seekPercentage);
}
```

### 5. Listener `syncWithSource` - Sincronização Universal

**Arquivo**: `src/components/VideoPlayer/index.tsx`

**Problema**: Só funcionava com fonte específica
**Solução**: Funciona com ou sem fonte específica

```typescript
// Listener para sincronização com fonte ativa
const handleSyncWithSource = (event: CustomEvent) => {
    const { currentTime, trackId, syncSource } = event.detail;
    
    if (playerRef.current && currentTime > 0) {
        const sourceInfo = syncSource ? `${syncSource.userRole} ${syncSource.userId}` : 'sem fonte específica';
        console.log(`🎯 SINCRONIZAÇÃO: ${sourceInfo} - Tempo: ${Math.floor(currentTime / 60)}:${(currentTime % 60).toString().padStart(2, '0')}`);
        
        // ✅ FORÇA seek no player com o tempo atual
        playerRef.current.seekTo(currentTime);
        
        // Atualiza estado local
        const duration = playerRef.current.getDuration();
        if (duration > 0) {
            const seekPercentage = currentTime / duration;
            setPlayed(seekPercentage);
        }
        
        // Sincroniza via socket se for moderador
        if (canModerate) {
            syncTrack(currentTime);
        }
        
        console.log(`✅ Sincronização concluída`);
    }
};
```

### 6. Componentes de UI - Sincronização de Estado

**Arquivos**: 
- `src/pages/Room/components/Playlist/index.tsx`
- `src/components/SearchMusic/index.tsx`

**Problema**: Não definiam música atual automaticamente
**Solução**: Define primeira música da playlist se não houver música atual

```typescript
// ✅ CORREÇÃO: Se não há música atual mas há playlist, define a primeira
if (roomState && !roomState.currentTrack && roomState.playlist && roomState.playlist.length > 0) {
    const { setTrack } = usePlayerStore.getState();
    setTrack(roomState.playlist[0]);
}
```

## Resultado Esperado

Após essas correções:

1. ✅ **Novos usuários entram sincronizados**: A música atual é definida automaticamente
2. ✅ **Reprodução automática**: Se há música tocando, o player inicia automaticamente
3. ✅ **Sincronização de tempo**: O tempo é sincronizado independente da fonte estar ativa
4. ✅ **Estado visual consistente**: A barra de progresso reflete o tempo atual
5. ✅ **Fallback robusto**: Funciona mesmo sem fonte de sincronização específica

## Como Testar

1. Abra uma sala com música tocando
2. Entre com outro usuário em uma nova aba/incógnito
3. Verifique se:
   - A música atual é carregada automaticamente
   - O player inicia no tempo correto
   - A barra de progresso está sincronizada
   - Os logs mostram sincronização bem-sucedida

## Logs Esperados

```
🎯 Estado ao entrar na sala: {playing: true, currentTrack: "Nome da Música", syncSource: "userId", playlistLength: 2, currentTime: 45}
🎵 Música tocando com fonte de sincronização: Nome da Música
🔄 Sincronizando com fonte: owner userId - Tempo: 0:45
🎯 SINCRONIZAÇÃO: owner userId - Tempo: 0:45
✅ Sincronização concluída
```
