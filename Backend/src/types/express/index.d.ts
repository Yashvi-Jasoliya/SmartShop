// server/types/express.ts
import { Request } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { Server as IOServer } from 'socket.io';
// import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
    io?: IOServer;
    user?: { id: string };
}
    }}