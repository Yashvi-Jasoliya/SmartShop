export const initSocket = (io) => {
    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            socket.join(userId);
        }
    });
};
export const sendNotification = (io, userId, notification) => {
    io.to(userId).emit('notification', notification);
};
