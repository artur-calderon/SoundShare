# Exemplo de Controles de Navegação - Frontend

Este arquivo mostra como implementar os controles de navegação da playlist no frontend React.

## Componente de Controles de Reprodução

```tsx
import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRandom } from 'react-icons/fa';
import SoundShareSocket from './SoundShareSocket';

interface PlayerControlsProps {
  socket: SoundShareSocket;
  isPlaying: boolean;
  currentTrack: any;
  playlist: any[];
  canModerate: boolean;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  socket,
  isPlaying,
  currentTrack,
  playlist,
  canModerate
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Função para tocar/pausar
  const handlePlayPause = () => {
    if (canModerate) {
      socket.playPause(!isPlaying);
    }
  };

  // Função para próxima música
  const handleNextTrack = () => {
    if (canModerate && playlist.length > 0) {
      socket.nextTrack();
    }
  };

  // Função para música anterior
  const handlePreviousTrack = () => {
    if (canModerate && playlist.length > 0) {
      socket.previousTrack();
    }
  };

  // Função para pular para música específica
  const handleJumpToTrack = (trackIndex: number) => {
    if (canModerate && playlist.length > 0) {
      socket.jumpToTrack(trackIndex);
    }
  };

  // Função para pular para música aleatória
  const handleRandomTrack = () => {
    if (canModerate && playlist.length > 0) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      socket.jumpToTrack(randomIndex);
    }
  };

  return (
    <div className="player-controls">
      {/* Controles principais */}
      <div className="main-controls">
        <button
          onClick={handlePreviousTrack}
          disabled={!canModerate || playlist.length === 0}
          className="control-btn"
          title="Música anterior"
        >
          <FaStepBackward />
        </button>

        <button
          onClick={handlePlayPause}
          disabled={!canModerate}
          className="control-btn play-btn"
          title={isPlaying ? 'Pausar' : 'Tocar'}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>

        <button
          onClick={handleNextTrack}
          disabled={!canModerate || playlist.length === 0}
          className="control-btn"
          title="Próxima música"
        >
          <FaStepForward />
        </button>

        <button
          onClick={handleRandomTrack}
          disabled={!canModerate || playlist.length === 0}
          className="control-btn"
          title="Música aleatória"
        >
          <FaRandom />
        </button>
      </div>

      {/* Informações da música atual */}
      {currentTrack && (
        <div className="track-info">
          <h3>{currentTrack.title}</h3>
          <p>{currentTrack.description}</p>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <span className="time-display">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      )}

      {/* Lista de músicas com navegação direta */}
      {playlist.length > 0 && (
        <div className="playlist-navigation">
          <h4>Playlist</h4>
          <div className="playlist-items">
            {playlist.map((track, index) => (
              <div
                key={track.id}
                className={`playlist-item ${currentTrack?.id === track.id ? 'active' : ''}`}
                onClick={() => handleJumpToTrack(index)}
              >
                <span className="track-number">{index + 1}</span>
                <img src={track.thumbnail} alt={track.title} className="track-thumbnail" />
                <div className="track-details">
                  <span className="track-title">{track.title}</span>
                  <span className="track-artist">{track.user.name}</span>
                </div>
                {canModerate && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJumpToTrack(index);
                    }}
                    className="jump-btn"
                    title="Pular para esta música"
                  >
                    <FaStepForward />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Função para formatar tempo
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default PlayerControls;
```

## Estilos CSS

```css
.player-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: #1a1a1a;
  border-radius: 12px;
  color: white;
}

.main-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.control-btn {
  background: #333;
  border: none;
  color: white;
  padding: 12px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
}

.control-btn:hover:not(:disabled) {
  background: #555;
  transform: scale(1.1);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.play-btn {
  background: #1db954;
  width: 60px;
  height: 60px;
}

.play-btn:hover:not(:disabled) {
  background: #1ed760;
}

.track-info {
  text-align: center;
}

.track-info h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
}

.track-info p {
  margin: 0 0 15px 0;
  opacity: 0.8;
  font-size: 14px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #333;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: #1db954;
  transition: width 0.3s ease;
}

.time-display {
  font-size: 12px;
  opacity: 0.7;
}

.playlist-navigation {
  margin-top: 20px;
}

.playlist-navigation h4 {
  margin: 0 0 15px 0;
  font-size: 16px;
}

.playlist-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 300px;
  overflow-y: auto;
}

.playlist-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: #333;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.playlist-item:hover {
  background: #444;
}

.playlist-item.active {
  background: #1db954;
  color: white;
}

.track-number {
  font-weight: bold;
  min-width: 20px;
}

.track-thumbnail {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
}

.track-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.track-title {
  font-weight: 500;
  font-size: 14px;
}

.track-artist {
  font-size: 12px;
  opacity: 0.8;
}

.jump-btn {
  background: transparent;
  border: 1px solid #666;
  color: #666;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.jump-btn:hover {
  border-color: #1db954;
  color: #1db954;
}

/* Scrollbar personalizada */
.playlist-items::-webkit-scrollbar {
  width: 6px;
}

.playlist-items::-webkit-scrollbar-track {
  background: #333;
  border-radius: 3px;
}

.playlist-items::-webkit-scrollbar-thumb {
  background: #666;
  border-radius: 3px;
}

.playlist-items::-webkit-scrollbar-thumb:hover {
  background: #888;
}
```

## Uso no Componente Principal

```tsx
import React, { useEffect, useState } from 'react';
import SoundShareSocket from './SoundShareSocket';
import PlayerControls from './PlayerControls';

const Room: React.FC = () => {
  const [socket, setSocket] = useState<SoundShareSocket | null>(null);
  const [roomState, setRoomState] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [canModerate, setCanModerate] = useState(false);

  useEffect(() => {
    // Inicializar socket
    const roomId = 'sua-room-id';
    const userId = 'seu-user-id';
    const userData = {
      name: 'Seu Nome',
      email: 'seu@email.com',
      image: 'sua-imagem.jpg',
      role: 'user'
    };

    const newSocket = new SoundShareSocket(roomId, userId, userData);
    setSocket(newSocket);

    // Configurar listeners
    newSocket.socket.on('roomJoined', (state) => {
      setRoomState(state);
      setCanModerate(state.canModerate);
      setPlaylist(state.playlist || []);
      setCurrentTrack(state.currentTrack);
      setIsPlaying(state.playing);
    });

    newSocket.socket.on('trackChanged', ({ track, playing, currentTime, direction }) => {
      setCurrentTrack(track);
      setIsPlaying(playing);
      console.log(`Música alterada: ${direction} - ${track.title}`);
    });

    newSocket.socket.on('playbackStateChanged', ({ playing, currentTime }) => {
      setIsPlaying(playing);
    });

    newSocket.socket.on('trackAdded', ({ track, playlist }) => {
      setPlaylist(playlist);
    });

    newSocket.socket.on('trackRemoved', ({ trackId, playlist }) => {
      setPlaylist(playlist);
    });

    // Eventos de erro
    newSocket.socket.on('permissionDenied', ({ action, message }) => {
      alert(`Permissão negada: ${message}`);
    });

    newSocket.socket.on('playlistEmpty', ({ message }) => {
      alert(message);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  if (!socket || !roomState) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="room">
      <h1>Sala: {roomState.name}</h1>
      <p>Usuários online: {roomState.listeners}</p>
      
      <PlayerControls
        socket={socket}
        isPlaying={isPlaying}
        currentTrack={currentTrack}
        playlist={playlist}
        canModerate={canModerate}
      />
    </div>
  );
};

export default Room;
```

## Funcionalidades Implementadas

✅ **Controles de Reprodução**: Play/Pause, Próxima, Anterior
✅ **Navegação Direta**: Pular para música específica da playlist
✅ **Música Aleatória**: Seleção aleatória da playlist
✅ **Verificação de Permissões**: Apenas dono/moderadores podem controlar
✅ **Interface Responsiva**: Controles visuais intuitivos
✅ **Lista de Músicas**: Navegação clicável na playlist
✅ **Feedback Visual**: Música atual destacada
✅ **Tratamento de Erros**: Mensagens para ações negadas
✅ **Sincronização**: Estado atualizado em tempo real

## Como Usar

1. **Instalar dependências**: `npm install react-icons`
2. **Copiar componentes**: PlayerControls e estilos CSS
3. **Integrar no projeto**: Usar no componente da sala
4. **Configurar socket**: Conectar com o backend
5. **Testar funcionalidades**: Verificar permissões e controles

Os controles estão prontos para uso e fornecem uma experiência completa de navegação na playlist! 🎵
