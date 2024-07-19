import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
let socketInitializationPromise: Promise<Socket> | null = null;

export const initializeSocket = async (): Promise<Socket> => {
  if (socketInitializationPromise) {
    return socketInitializationPromise;
  }

  socketInitializationPromise = new Promise<Socket>((resolve, reject) => {
    fetch('/api/socket')
      .then(() => {
        socket = io();

        socket.on('connect', () => {
          console.log('Connected to server');
          resolve(socket as Socket);
        });

        socket.on('disconnect', () => {
          console.log('Disconnected from server');
        });

        socket.on('connect_error', (error) => {
          console.error('Connection error:', error);
          reject(error);
        });
      })
      .catch(reject);
  });

  return socketInitializationPromise;
};

export const getSocket = async (): Promise<Socket> => {
  if (socket) {
    return socket;
  }
  return initializeSocket();
};