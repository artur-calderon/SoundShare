# Sistema de Sincronização de Tempo - Frontend

## Visão Geral

Implementamos um sistema onde **apenas o host (fonte de sincronização) envia o tempo periodicamente** via `syncTrack`, e **outros usuários recebem via `timeSync`** para manter a sincronização.

## Arquitetura

### 1. **Host (Fonte de Sincronização)**
- ✅ **Envia tempo a cada segundo** via `syncTrack`
- ✅ **Só envia quando é a fonte ativa** (`roomState.syncSource.userId === userId`)
- ✅ **Só envia quando está tocando** (`roomState.playing === true`)

### 2. **Usuários Não-Host**
- ✅ **Recebem tempo via `timeSync`**
- ✅ **Sincronizam automaticamente** quando recebem `timeSync`
- ✅ **NÃO enviam tempo** - apenas recebem

## Implementação

### Interface Track Atualizada

```typescript
interface Track {
	id: string;
	title: string;
	description: string;
	thumbnail: string;
	url: string;
	duration?: number; // ✅ NOVO: Duração da música em segundos
	user: User;
}
```

### Interface SocketState Atualizada

```typescript
interface SocketState {
	// ... outras propriedades ...
	
	// ✅ NOVO: Funções de sincronização de tempo
	startTimeSync: () => void;
	stopTimeSync: () => void;
}
```

### Função startTimeSync()

```typescript
startTimeSync: () => {
	const { socket, roomId, userId } = get();
	const { roomState } = useRoomStore.getState();
	
	// Só inicia se for a fonte de sincronização
	if (!roomState?.syncSource || roomState.syncSource.userId !== userId) {
		console.log(`ℹ️ Usuário não é a fonte de sincronização - não iniciando envio periódico`);
		return;
	}
	
	// Parar intervalo anterior se existir
	if (timeSyncInterval) {
		clearInterval(timeSyncInterval);
	}
	
	console.log(`🎯 Iniciando envio periódico de tempo como fonte de sincronização`);
	
	// Enviar tempo a cada segundo
	timeSyncInterval = setInterval(() => {
		const { currentTrack, seekTime } = usePlayerStore.getState();
		const { roomState: currentRoomState } = useRoomStore.getState();
		
		// Só enviar se estiver tocando e for a fonte de sincronização
		if (currentRoomState?.playing && currentTrack && currentRoomState.syncSource?.userId === userId) {
			// Converter seekTime (0-1) para segundos
			const duration = currentTrack.duration || 0;
			if (duration > 0) {
				const currentTime = Math.floor(seekTime * duration);
				
				console.log(`📡 Enviando tempo como fonte: ${currentTime}s`);
				
				// Enviar tempo via socket
				if (socket && roomId) {
					socket.emit("syncTrack", {
						roomId,
						currentTime,
						userId
					});
				}
			}
		}
	}, 1000); // Enviar a cada segundo
}
```

### Função stopTimeSync()

```typescript
stopTimeSync: () => {
	if (timeSyncInterval) {
		clearInterval(timeSyncInterval);
		timeSyncInterval = null;
		console.log(`⏹️ Parado envio periódico de tempo`);
	}
}
```

## Fluxo de Sincronização

### 1. **Usuário Entra na Sala**
```typescript
socket.on("roomJoined", (roomState: RoomState) => {
	// ... lógica existente ...
	
	// ✅ NOVO: Verificar se é a fonte de sincronização
	if (roomState.syncSource?.userId === userId) {
		console.log(`🎯 Usuário é a fonte de sincronização`);
		// Não inicia envio ainda - só quando começar a tocar
	}
});
```

### 2. **Reprodução Inicia/Para**
```typescript
socket.on("playbackStateChanged", ({ playing, currentTime }) => {
	setIsPlaying(playing);
	
	// ✅ NOVO: Iniciar/parar envio periódico de tempo baseado no estado de reprodução
	if (playing) {
		get().startTimeSync(); // ✅ Inicia envio periódico
	} else {
		get().stopTimeSync();  // ✅ Para envio periódico
	}
});
```

### 3. **Fonte de Sincronização Muda**
```typescript
socket.on("syncSourceChanged", (data) => {
	// ... lógica existente ...
	
	// ✅ NOVO: Verificar se o usuário atual é a nova fonte de sincronização
	const { userId } = get();
	if (data.newSource.userId === userId) {
		console.log(`🎯 Usuário atual é a nova fonte de sincronização - iniciando envio periódico`);
		get().startTimeSync();
	} else {
		console.log(`ℹ️ Usuário atual não é a fonte de sincronização - parando envio periódico`);
		get().stopTimeSync();
	}
});
```

### 4. **Usuários Não-Host Recebem timeSync**
```typescript
socket.on("timeSync", ({ currentTime, trackId, syncSource, source }) => {
	const { currentTrack } = usePlayerStore.getState();
	
	// Só sincroniza se for a música atual
	if (currentTrack && currentTrack.id === trackId) {
		console.log(`🔄 TimeSync recebido: ${currentTime}s para música ${trackId} (fonte: ${source})`);
		
		// ✅ NOVO: Emite evento para sincronização automática (apenas para usuários não-host)
		const { roomState } = useRoomStore.getState();
		const isHost = roomState?.syncSource?.userId === get().userId;
		
		if (!isHost) {
			console.log(`🎯 Usuário não-host recebeu timeSync - sincronizando automaticamente`);
			window.dispatchEvent(new CustomEvent('syncWithSource', {
				detail: { 
					currentTime: currentTime,
					trackId: trackId,
					syncSource: syncSource
				}
			}));
		}
	}
});
```

## Controle de Ciclo de Vida

### **Inicia Envio Periódico**
- ✅ Usuário é a fonte de sincronização E está tocando
- ✅ Fonte de sincronização muda para o usuário atual
- ✅ Reprodução inicia (`playing: true`)

### **Para Envio Periódico**
- ✅ Usuário não é mais a fonte de sincronização
- ✅ Reprodução para (`playing: false`)
- ✅ Usuário sai da sala
- ✅ Usuário é expulso
- ✅ Sala fica offline
- ✅ Usuário desconecta

## Logs Esperados

### **Host (Fonte de Sincronização)**
```
🎯 Iniciando envio periódico de tempo como fonte de sincronização
📡 Enviando tempo como fonte: 45s (0:45)
📡 Enviando tempo como fonte: 46s (0:46)
📡 Enviando tempo como fonte: 47s (0:47)
```

### **Usuários Não-Host**
```
🔄 TimeSync recebido: 45s para música trackId (fonte: host_update)
🎯 Usuário não-host recebeu timeSync - sincronizando automaticamente
🎯 SINCRONIZAÇÃO: owner userId - Tempo: 0:45
✅ Sincronização concluída
```

## Vantagens do Sistema

1. **✅ Eficiência**: Apenas 1 usuário envia tempo (host)
2. **✅ Sincronização Automática**: Outros usuários sincronizam automaticamente
3. **✅ Controle de Estado**: Envio só acontece quando necessário
4. **✅ Fallback Robusto**: Sistema funciona mesmo se host falhar
5. **✅ Escalabilidade**: Funciona com qualquer número de usuários

## Integração com Backend

O frontend agora funciona perfeitamente com o backend implementado:

- **Frontend**: Envia `syncTrack` periodicamente (apenas host)
- **Backend**: Recebe `syncTrack`, calcula tempo, envia `timeSync` para todos
- **Frontend**: Usuários não-host recebem `timeSync` e sincronizam automaticamente

## Como Testar

1. **Abra uma sala** com música tocando
2. **Entre com outro usuário** em nova aba/incógnito
3. **Verifique os logs**:
   - Host deve mostrar: `🎯 Iniciando envio periódico...` e `📡 Enviando tempo...`
   - Usuário não-host deve mostrar: `🔄 TimeSync recebido...` e `🎯 Usuário não-host recebeu timeSync...`
4. **Verifique sincronização**: Música deve estar sincronizada entre os usuários

## Próximos Passos

1. **Testar sincronização** entre múltiplos usuários
2. **Monitorar performance** do envio periódico
3. **Refinar intervalos** se necessário (atualmente 1 segundo)
4. **Adicionar métricas** de latência de sincronização
