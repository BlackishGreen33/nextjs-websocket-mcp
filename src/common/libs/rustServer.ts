import { Server as McpServer } from '@modelcontextprotocol/sdk/server/index.js';
import { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import { JSONRPCMessage } from '@modelcontextprotocol/sdk/types.js';

export const mcpServer = new McpServer(
  {
    name: 'example-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// TODO: 给 mcpServer 注册 callRustAPI tools

class RustServerTransport implements Transport {
  start(): Promise<void> {
    return new Promise((resolve) => {
      console.log(
        '🚀 ~ RustServerTransport ~ returnnewPromise ~ resolve:',
        resolve
      );
      window.addEventListener('client', (e) => {
        console.log(
          '🚀 ~ RustServerTransport ~ window.addEventListener ~ e:',
          e
        );
        this.onmessage?.((e as any).detail);
      });
      resolve();
    });
  }
  send(message: JSONRPCMessage): Promise<void> {
    return new Promise((resolve) => {
      const event = new CustomEvent('server', { detail: message });
      window.dispatchEvent(event);
      resolve();
    });
  }
  close(): Promise<void> {
    return Promise.resolve();
  }
  onclose?: (() => void) | undefined;
  onerror?: ((error: Error) => void) | undefined;
  onmessage?: ((message: JSONRPCMessage) => void) | undefined;
  sessionId?: string | undefined;
}

const transport = new RustServerTransport();

export async function init() {
  await mcpServer.connect(transport);
}
