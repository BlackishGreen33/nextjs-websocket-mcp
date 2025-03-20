import toolSchemas from '@/common/schemas/toolSchemas';

const send_message_to_server = async (args: unknown) => {
  const { content } = toolSchemas.toolInputs.send_message_to_server.parse(args);
  return {
    content: [{ type: 'text', text: String(content) }],
  };
};

export default send_message_to_server;
