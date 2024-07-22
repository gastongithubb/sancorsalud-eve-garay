'use client'
import React, { useState, useEffect, useRef } from 'react';
import { initializeSocket, getSocket } from '@/lib/websocket';
import { Socket } from 'socket.io-client';

interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: string;
}

const HealthForum: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('Anónimo');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Conectando...');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const setupSocket = async () => {
      try {
        console.log('Setting up socket...');
        const socket = await getSocket();
        socketRef.current = socket;

        socket.on('connect', () => {
          console.log('Connected to server');
          setIsConnected(true);
          setConnectionStatus('Conectado');
          setError(null);
        });

        socket.on('disconnect', (reason) => {
          console.log('Disconnected from server:', reason);
          setIsConnected(false);
          setConnectionStatus(`Desconectado: ${reason}`);
        });

        socket.on('connect_error', (error: Error) => {
          console.error('Connection error:', error);
          setConnectionStatus(`Error de conexión`);
          setError(`Error de conexión: ${error.message}`);
        });

        socket.on('reconnect', (attemptNumber: number) => {
          console.log('Reconnected to server after', attemptNumber, 'attempts');
          setConnectionStatus('Reconectado');
          setError(null);
        });

        socket.on('chat message', (msg: Message) => {
          setMessages((prevMessages) => [...prevMessages, msg]);
        });

        setIsConnected(socket.connected);
      } catch (error) {
        console.error('Error setting up socket:', error);
        setConnectionStatus(`Error al configurar el socket`);
        setError(`Error al configurar el socket: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    setupSocket();

    return () => {
      if (socketRef.current) {
        console.log('Cleaning up socket connection...');
        socketRef.current.off('connect');
        socketRef.current.off('disconnect');
        socketRef.current.off('chat message');
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && isConnected) {
      const message = {
        user: username,
        content: newMessage,
        timestamp: new Date().toISOString(),
      };

      try {
        const socket = await getSocket();
        socket.emit('chat message', message);
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-sky-700">Foro de Salud y Bienestar</h1>
      <div className="mb-4 flex items-center">
        <label className="mr-2 text-gray-700">Usuario:</label>
        <select
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 border rounded bg-white text-gray-700"
        >
          <option value="Anónimo">Anónimo</option>
        </select>
      </div>
      <div className="bg-gray-50 p-4 h-96 overflow-y-auto mb-4 rounded-lg border border-gray-200">
        {messages.map((msg, index) => (
          <div key={msg.id || index} className="mb-3 p-2 bg-white rounded shadow">
            <span className={`font-bold ${msg.user === 'Evelin Garay' ? 'text-teal-600' : 'text-blue-600'}`}>
              {msg.user}:
            </span>
            <span className="ml-2 text-gray-700">{msg.content}</span>
            <span className="text-xs text-gray-500 ml-2 float-right">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          type="submit"
          className={`p-2 rounded-r text-white transition-colors duration-200 ${
            isConnected ? 'bg-teal-500 hover:bg-teal-600' : 'bg-gray-400'
          }`}
          disabled={!isConnected}
        >
          Enviar
        </button>
      </form>
      <p className="mt-2 text-sm text-gray-600">
        Estado: <span className={isConnected ? 'text-green-500' : 'text-red-500'}>{connectionStatus}</span>
      </p>
      {error && (
        <p className="mt-2 text-sm text-red-500">
          Error: {error}
        </p>
      )}
    </div>
  );
};

export default HealthForum;