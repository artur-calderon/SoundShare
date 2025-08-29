import styled from 'styled-components';

export const RoomControlsContainer = styled.div`
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
  border: 1px solid #e9ecef;

  .room-controls {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .room-status, .playback-controls, .playlist-controls, .user-management, .permissions-info {
    background: white;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  }

  h3 {
    margin: 0 0 16px 0;
    color: #212529;
    font-size: 18px;
    font-weight: 600;
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }

  .status-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    
    &.online {
      background: #28a745;
    }
    
    &.offline {
      background: #dc3545;
    }
  }

  .user-count {
    margin-bottom: 16px;
    font-size: 16px;
    color: #6c757d;
  }

  .toggle-status-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    
    &.online {
      background: #28a745;
      color: white;
      
      &:hover {
        background: #218838;
      }
    }
    
    &.offline {
      background: #dc3545;
      color: white;
      
      &:hover {
        background: #c82333;
      }
    }
  }

  .control-buttons {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .control-btn {
    padding: 10px 16px;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    background: white;
    color: #495057;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover:not(:disabled) {
      background: #f8f9fa;
      border-color: #adb5bd;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .playlist {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .playlist-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #ffffff;
    border-radius: 6px;
    border: 1px solid #e9ecef;
    transition: all 0.2s;
    
    &:hover {
      background: #f8f9fa;
      border-color: #dee2e6;
    }
  }

  .track-info {
    flex: 1;
    font-size: 14px;
    color: #212529;
    
    &.current {
      font-weight: 600;
      color: #007bff;
    }
  }

  .track-actions {
    display: flex;
    gap: 8px;
  }

  .action-btn {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
    
    &.jump {
      background: #007bff;
      color: white;
      
      &:hover:not(:disabled) {
        background: #0056b3;
      }
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background: #6c757d;
        color: #ffffff;
      }
    }
    
    &.remove {
      background: #dc3545;
      color: white;
      
      &:hover {
        background: #c82333;
      }
    }
  }

  .users-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .user-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #ffffff;
    border-radius: 6px;
    border: 1px solid #e9ecef;
    transition: all 0.2s;
    
    &:hover {
      background: #f8f9fa;
      border-color: #dee2e6;
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }

  .user-name {
    font-weight: 500;
    color: #212529;
    font-size: 14px;
  }

  .user-role {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    
    &.owner {
      background: #ffc107;
      color: #212529;
    }
    
    &.moderator {
      background: #17a2b8;
      color: white;
    }
    
    &.user {
      background: #6c757d;
      color: white;
    }
  }

  .moderation-actions {
    display: flex;
    gap: 8px;
  }

  .mod-btn, .kick-btn {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
    
    &.add {
      background: #28a745;
      color: white;
      
      &:hover {
        background: #218838;
      }
    }
    
    &.remove {
      background: #ffc107;
      color: #212529;
      
      &:hover {
        background: #e0a800;
      }
    }
  }

  .kick-btn {
    background: #dc3545;
    color: white;
    
    &:hover {
      background: #c82333;
    }
  }

  .permissions {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .permission {
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    
    &.active {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    
    &.inactive {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
  }

  @media (max-width: 768px) {
    .room-controls {
      gap: 16px;
    }
    
    .control-buttons {
      flex-direction: column;
    }
    
    .playlist-item, .user-item {
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;
    }
    
    .track-actions, .moderation-actions {
      width: 100%;
      justify-content: space-between;
    }
  }
`;
