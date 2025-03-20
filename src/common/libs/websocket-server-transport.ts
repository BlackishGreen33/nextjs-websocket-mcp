'use server';

import { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import {
  JSONRPCMessage,
  JSONRPCMessageSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { IncomingMessage } from 'node:http';
import { Socket } from 'node:net';
import { WebSocket, WebSocketServer } from 'ws';

// const SUBPROTOCOL = 'mcp';

/**
 * 服务端 WebSocket 传输层
 */
export class WebSocketServerTransport implements Transport {
  private _wss?: WebSocketServer;
  private _client?: WebSocket;

  onclose?: () => void;
  onerror?: (error: Error) => void;
  onmessage?: (message: JSONRPCMessage) => void;

  private _isClosing = false;

  constructor(
    private readonly req: IncomingMessage,
    private readonly socket: Socket,
    private readonly head: Buffer
  ) {}

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._wss = new WebSocketServer({ noServer: true });

      this._wss.on('error', (error) => {
        reject(error);
        this.onerror?.(error);
      });

      this._wss.on('listening', () => resolve());

      this._wss.on('connection', (ws) => {
        if (this._isClosing) {
          ws.close();
          return;
        }

        this._client = ws;
        console.log('New client connected');

        ws.on('error', (error) => {
          this.onerror?.(error);
        });

        ws.on('message', (data) => {
          try {
            const message = JSONRPCMessageSchema.parse(
              JSON.parse(data.toString())
            );
            this.onmessage?.(message);
          } catch (error) {
            this.onerror?.(error as Error);
          }
        });

        ws.on('close', () => {
          this.onclose?.();
        });
      });

      this._wss.handleUpgrade(this.req, this.socket, this.head, (ws) => {
        this._wss?.emit('connection', ws, this.req);
      });
    });
  }

  async close(): Promise<void> {
    this._isClosing = true;
    this._client?.close();
    await new Promise((resolve) => {
      this._wss?.close(resolve);
      this._wss = undefined;
    });
    this._isClosing = false;
    console.log('Client disconnected');
  }

  send(message: JSONRPCMessage): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this._client) {
        reject(new Error('No active connections'));
        return;
      }
      const messageString = JSON.stringify(message);
      if (this._client.readyState === WebSocket.OPEN) {
        this._client.send(messageString);
        console.log(`Message received: ${messageString}`);
      }
      resolve();
    });
  }
}
