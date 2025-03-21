import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import { JSONRPCMessage } from '@modelcontextprotocol/sdk/types.js';

import { init } from './rustServer';

init();

export const client = new Client(
  {
    name: 'example-client',
    version: '1.0.0',
  },
  {
    capabilities: {
      prompts: {},
      resources: {},
      tools: {},
    },
  }
);

export class RustClientTransport implements Transport {
  start(): Promise<void> {
    return new Promise((resolve) => {
      window.addEventListener('server', (e) => {
        this.onmessage?.((e as any).detail);
      });
      resolve();
    });
  }
  send(message: JSONRPCMessage): Promise<void> {
    return new Promise((resolve) => {
      const event = new CustomEvent('client', { detail: message });
      window.dispatchEvent(event);
      console.log(
        '🚀 ~ RustClientTransport ~ returnnewPromise ~ event:',
        event
      );

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

export async function main(userInstruction: string) {
  const toolsResult = await client.listTools();
  const tools = toolsResult.tools.map((tool) => {
    return {
      name: tool.name,
      description: tool.description,
      input_schema: tool.inputSchema,
    };
  });

  console.log('🚀 ~ connect ~ tools:', tools);

  const result = await client.callTool({
    name: 'add',
    arguments: {
      a: 1,
      b: 2,
    },
  });
  console.log('🚀 ~ connect ~ result:', result);
}
