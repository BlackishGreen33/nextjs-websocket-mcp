const TOOL_DEFINITIONS = [
  {
    name: 'send_message_to_user',
    description: 'Send a message to the user on Lark',
    inputSchema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          description: 'Content of the message',
        },
      },
      required: ['content'],
    },
  },
  {
    name: 'add',
    description: 'Add two numbers',
    inputSchema: {
      type: 'object',
      properties: {
        a: {
          type: 'number',
          description: 'First number',
        },
        b: {
          type: 'number',
          description: 'Second number',
        },
      },
      required: ['a', 'b'],
    }
  }
];

export default TOOL_DEFINITIONS;
