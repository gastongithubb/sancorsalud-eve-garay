import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
let socketInitializationPromise: Promise<Socket> | null = null;

export const initializeSocket = async (): Promise<Socket> => {
  if (socketInitializationPromise) {
    return socketInitializationPromise;
  }

  socketInitializationPromise = new Promise<Socket>((resolve, reject) => {
    console.log('Initializing socket connection...');
    
    socket = io({
      path: '/api/socket',
      addTrailingSlash: false,
      transports: ['polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    socket.on('connect', () => {
      console.log('Connected to server');
      resolve(socket as Socket);
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('Reconnected to server after', attemptNumber, 'attempts');
    });

    socket.on('reconnect_error', (error) => {
      console.error('Reconnection error:', error);
    });

    socket.on('reconnect_failed', () => {
      console.error('Failed to reconnect to server');
      reject(new Error('Failed to reconnect to server'));
    });

    // Add a timeout to reject the promise if connection takes too long
    setTimeout(() => {
      if (socket && !socket.connected) {
        console.error('Socket connection timed out');
        reject(new Error('Socket connection timed out'));
      }
    }, 10000);
  });

  return socketInitializationPromise;
};

export const getSocket = async (): Promise<Socket> => {
  if (socket && socket.connected) {
    return socket;
  }
  return initializeSocket();
};