const WebSocket = require('ws');
const http = require('http');
const { v4: uuidv4 } = require('uuid');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Nueva conexión WebSocket establecida');

  ws.on('message', (message) => {
    console.log('Mensaje recibido:', message.toString());
    
    try {
      const parsedMessage = JSON.parse(message);
      const broadcastMessage = JSON.stringify({
        id: uuidv4(),
        ...parsedMessage
      });

      console.log('Transmitiendo mensaje:', broadcastMessage);

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(broadcastMessage);
        }
      });
    } catch (error) {
      console.error('Error al procesar el mensaje:', error);
    }
  });

  ws.on('close', () => {
    console.log('Conexión WebSocket cerrada');
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Servidor WebSocket iniciado en el puerto ${PORT}`);
});