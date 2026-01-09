
import mongoose from 'mongoose';
import { createNotification } from './src/services/notification.service.js';
import { initSocket } from './src/sockets/socket.js';
import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
    const server = http.createServer();
    initSocket(server);

    const userId = process.argv[2];
    if (!userId) {
        console.error("Please provide a userId as an argument");
        process.exit(1);
    }

    console.log(`Testing notification for user ${userId}`);

    try {
        await mongoose.connect(process.env.MONGO_URI);
        const notification = await createNotification({
            userId,
            message: "Test Live Notification " + new Date().toLocaleTimeString(),
            type: "message",
            repoId: new mongoose.Types.ObjectId(), // Passing ObjectId instead of string just in case
            targetType: "message",
            targetId: new mongoose.Types.ObjectId()
        });
        console.log("Notification created and emitted successfully:", notification._id);
    } catch (err) {
        console.error("Error:", err);
    } finally {
        process.exit(0);
    }
}

run();
