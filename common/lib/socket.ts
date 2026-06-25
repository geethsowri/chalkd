// Socket.io client imports
import { io, Socket } from "socket.io-client";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
// note: polish 17828389065407
