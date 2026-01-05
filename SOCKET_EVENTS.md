# Socket.IO Event Documentation

## Room Structure

The application uses specific room names to target broadcasts efficiently.

| Room Name | Scope | Description |
| :--- | :--- | :--- |
| `user:{userId}` | **User Private** | Dedicated room for a specific user. Used for personal notifications (mentions, invites). |
| `workspace:{repoId}` | **Workspace Global** | Broadcasts events relevant to the entire workspace (e.g., new channel creation). |
| `workspace:{repoId}:channel:{channelId}` | **Channel Specific** | Broadcasts events within a specific channel (messages, reactions, join/leave). |

---

## Client-Side Listeners (Server → Client Events)

The client should set up listeners for the following events.

### 1. Workspace Level Events
*Scope: Broadcast to `workspace:{repoId}`*

#### `new_channel`
Fired when a new channel is created.
```json
{
  "workspaceId": "60d5f9...",
  "channel": {
    "channel_id": "65e...",
    "name": "general",
    "createdAt": "..."
  }
}
```

#### `channel_updated`
Fired when a channel is renamed.
```json
{
  "workspaceId": "60d5f9...",
  "channel": {
    "channel_id": "65e...",
    "name": "new-name"
  }
}
```

#### `channel_deleted`
Fired when a channel is deleted.
```json
{
  "workspaceId": "60d5f9...",
  "channelId": "65e..."
}
```

---

### 2. Channel Level Events
*Scope: Broadcast to `workspace:{repoId}:channel:{channelId}`*

#### `message_received`
Fired when a new message is posted.
```json
{
  "message": {
    "_id": "msg_123",
    "content": "Hello world",
    "senderId": { "_id": "...", "username": "...", "avatarUrl": "..." },
    "channelId": "65e...",
    "createdAt": "..."
  }
}
```

#### `message_deleted`
Fired when a message is deleted.
```json
{
  "messageId": "msg_123"
}
```

#### `reaction_update`
Fired when a user adds or toggles a reaction.
```json
{
  "messageId": "msg_123",
  "reactions": [
    {
      "emoji": "👍",
      "users": ["user_1", "user_2"]
    }
  ]
}
```

#### `user_joined_channel`
Fired when a user joins the channel.
```json
{
  "channelId": "65e...",
  "userId": "user_123",
  "user": {
    "_id": "user_123",
    "username": "octocat",
    "avatarUrl": "..."
  }
}
```

#### `user_left_channel`
Fired when a user leaves the channel.
```json
{
  "channelId": "65e...",
  "userId": "user_123",
  "user": {
    "_id": "user_123",
    "username": "octocat"
  }
}
```

---

### 3. User Level Events
*Scope: Broadcast to `user:{userId}`*

#### `new_notification`
Fired for direct alerts (mentions, workspace invites, role updates).
```json
{
  "_id": "notif_123",
  "message": "User X mentioned you in #general",
  "isRead": false,
  "type": "message",
  "createdAt": "..."
}
```

---

## Server-Side Listeners (Client → Server Events)

The client should emit these events to manage room subscriptions.

### `joinWorkspace`
Join a workspace room to receive channel list updates.
```javascript
socket.emit("joinWorkspace", { workspaceId: "60d5f9..." });
```

### `joinChannel`
Join a specific channel room to receive messages and typing events.
```javascript
socket.emit("joinChannel", { 
  workspaceId: "60d5f9...", 
  channelId: "65e..." 
});
```

### `leaveChannel`
Leave a channel room (stop receiving messages).
```javascript
socket.emit("leaveChannel", { 
  workspaceId: "60d5f9...", 
  channelId: "65e..." 
});
```

### `leaveWorkspace`
Leave a workspace room.
```javascript
socket.emit("leaveWorkspace", "60d5f9...");
```
