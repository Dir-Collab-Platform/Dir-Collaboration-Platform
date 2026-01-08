import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            methods: ["GET", "POST"],
        }
    });


    // Auth middleware
    io.use((socket, next) => {
        // checking token
        const token = socket.handshake.auth?.token || socket.handshake.headers.token;

        if (!token) {
            return next(new Error("Authentication error: No token provided"));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (error) {
            next(new Error("Authentication error: Invalid token"));
        }
    })

    // Handle connection
    io.on("connection", (socket) => {
        const userId = socket.user.id;
        console.log("User connected: ", `${socket.user.githubUsername} (${userId})`);

        // joining private user room - for any notifications
        socket.join(`user:${userId}`);

        // Automatic joining via handshake query parameters
        const { workspaceId, channelId } = socket.handshake.query;
        if (workspaceId) {
            socket.join(`workspace:${workspaceId}`);
            console.log(`User ${userId} auto-joined workspace ${workspaceId}`);

            if (channelId) {
                const channelRoom = `workspace:${workspaceId}:channel:${channelId}`;
                socket.join(channelRoom);
                console.log(`User ${userId} auto-joined channel ${channelRoom}`);
            }
        }

        // joining the workspace room - the parent room of the channel rooms
        socket.on("joinWorkspace", (data) => {
            // Check if data is an object or just a string
            const workspaceId = typeof data === 'object' ? data.workspaceId : data;

            if (!workspaceId) {
                console.error("JoinWorkspace Error: No ID provided");
                return;
            }
            socket.join(`workspace:${workspaceId}`);
            console.log(`User ${userId} joined workspace ${workspaceId}`);
        });

        // joining the channel room - the child room of the workspace room, listening for specific chat messages
        socket.on("joinChannel", ({ workspaceId, channelId }) => {
            const channelRoom = `workspace:${workspaceId}:channel:${channelId}`;
            socket.join(channelRoom);
            console.log(`User ${userId} joined channel ${channelRoom}`);
        });

        // leaving the channel room - the child room of the workspace room, listening for specific chat messages
        socket.on("leaveChannel", ({ workspaceId, channelId }) => {
            const channelRoom = `workspace:${workspaceId}:channel:${channelId}`;
            socket.leave(channelRoom);
            console.log(`User ${userId} left channel ${channelRoom}`);
        });

        // leaving the workspace room - the parent room of the channel rooms
        socket.on("leaveWorkspace", (workspaceId) => {
            socket.leave(`workspace: ${workspaceId}`);
            console.log(`User ${userId} left workspace ${workspaceId}`);
        });

        socket.on("disconnect", () => {
            console.log(`User ${socket.user.githubUsername} disconnected`);
        })
    });

    return io;
}


// helper function
export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
}