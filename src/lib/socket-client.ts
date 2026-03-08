'use client'

import { io } from 'socket.io-client'

export const socket = io({
    path: '/api/socket/io',
    addTrailingSlash: false,
    transports: ['polling', 'websocket'],
    reconnection: true,
})
