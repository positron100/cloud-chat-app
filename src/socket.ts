
import { io, Socket } from 'socket.io-client';
import { saveRoomHistory } from './services/roomHistoryService';

// Use the production server URL
const SERVER_URL = 'https://code-editor-f145.onrender.com';

// Store code for each room (for local reference)
const roomCodeStore: Record<string, string> = {};

// Track users in each room
const roomUsersStore: Record<string, string[]> = {};

// Global socket instance
let socket: Socket | null = null;

/**
 * Initialize socket connection
 */
export const initSocket = (): Socket => {
  if (!socket) {
    socket = io(SERVER_URL, {
      transports: ['websocket'],
      timeout: 10000,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    
    socket.on('connect', () => {
      // Socket connected
      console.log('Socket connected');
    });
    
    socket.on('connect_error', (err) => {
      // Connection error
      console.error('Connection error:', err);
    });
    
    socket.on('disconnect', () => {
      // Disconnected
      console.log('Socket disconnected');
    });
  }
  
  return socket;
};

// Store room code
export const updateRoomCode = (roomId: string, code: string) => {
  if (roomId) {
    roomCodeStore[roomId] = code;
  }
};

// Track user joining a room
export const trackUserJoinRoom = (roomId: string, username: string) => {
  if (!roomUsersStore[roomId]) {
    roomUsersStore[roomId] = [];
  }
  
  if (!roomUsersStore[roomId].includes(username)) {
    roomUsersStore[roomId].push(username);
  }
};

// Track user leaving a room and save code if it's the last user
export const trackUserLeaveRoom = async (roomId: string, username: string) => {
  if (!roomUsersStore[roomId]) {
    return;
  }
  
  roomUsersStore[roomId] = roomUsersStore[roomId].filter(user => user !== username);
  
  // If this was the last user, save the code to database
  if (roomUsersStore[roomId].length === 0) {
    const latestCode = roomCodeStore[roomId] || '';
    console.log(`Last user left room ${roomId}. Saving code history...`);
    
    try {
      await saveRoomHistory(roomId, latestCode);
      console.log(`Successfully saved code history for room ${roomId}`);
    } catch (error) {
      console.error(`Failed to save code history for room ${roomId}:`, error);
    }
  }
};

// Clear room code when leaving
export const clearRoomCode = (roomId: string) => {
  if (roomId && roomCodeStore[roomId]) {
    delete roomCodeStore[roomId];
    return true;
  }
  return false;
};

// Get stored room code
export const getRoomCode = (roomId: string): string => {
  return roomCodeStore[roomId] || '';
};

// Get current socket instance
export const getSocket = (): Socket | null => socket;

// Disconnect socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
