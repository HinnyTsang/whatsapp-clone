import { Server, Socket } from 'socket.io';

const io = require('socket.io')(5000);

interface MessageInterface {
  recipientIds: Array<string>;
  text: string;
}

io.on('connection', (socket: Socket): void => {
  const id = socket.handshake.query.id;

  console.log(id);
  try {
    if (id) socket.join(id);
  } catch {
    console.log('error');
  }

  socket.on(
    'send-message',
    ({ recipientIds, text }: MessageInterface) => {
      console.log('recipients is ', recipientIds);

      recipientIds.forEach((recipientId: string) => {
        const newRecipients = recipientIds.filter(
          (r: any) => r !== recipientId
        );

        if (typeof id === 'string') newRecipients.push(id);

        console.log('boardcast to ', recipientId);
        io.to(recipientId).emit('receive-message', {
          recipientIds: newRecipients,
          sender: id,
          text,
        });
      });
    }
  );
});

// io.listen(5000);
