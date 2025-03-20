import { Server as McpServer } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import next from 'next';
import {
  createServer,
  IncomingMessage,
  Server,
  ServerResponse,
} from 'node:http';
import { Socket } from 'node:net';
import { parse } from 'node:url';

import TOOL_DEFINITIONS from './common/constants/tool-definitions';
import { WebSocketServerTransport } from './common/libs/websocket-server-transport';
import toolHandlers from './common/utils/toolHandlers';

const nextApp = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = nextApp.getRequestHandler();

const mcpServer = new McpServer(
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

mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
  console.log('Tools requested by client');
  console.log('Returning tools:', JSON.stringify(TOOL_DEFINITIONS, null, 2));
  return { tools: TOOL_DEFINITIONS };
});

mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const handler = toolHandlers[name as keyof typeof toolHandlers];
    if (!handler) {
      throw new Error(`Unknown tool: ${name}`);
    }

    return await handler(args);
  } catch (error) {
    console.error(`Error executing tool ${name}:`, error);
    throw error;
  }
});

nextApp.prepare().then(() => {
  const server: Server = createServer(
    (req: IncomingMessage, res: ServerResponse) => {
      handle(req, res, parse(req.url || '', true));
    }
  );

  server.on(
    'upgrade',
    async (req: IncomingMessage, socket: Socket, head: Buffer) => {
      const { pathname } = parse(req.url || '/', true);

      if (pathname === '/_next/webpack-hmr') {
        nextApp.getUpgradeHandler()(req, socket, head);
      }

      if (pathname === '/api/ws') {
        const transport = new WebSocketServerTransport(req, socket, head);
        await mcpServer.connect(transport);
      }
    }
  );

  server.listen(3000);
  console.log('Server listening on port 3000');
});
