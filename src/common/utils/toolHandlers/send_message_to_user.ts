import larkClient from '@/common/libs/larkClient';
import toolSchemas from '@/common/schemas/toolSchema';

const send_message_to_user = async (args: unknown) => {
  const { content } = toolSchemas.toolInputs.send_message_to_user.parse(args);
  try {
    const messageContent = JSON.stringify({ text: content });
    console.error('Sending message content:', messageContent);

    const result = await larkClient.im.message.create({
      params: {
        receive_id_type: 'user_id',
      },
      data: {
        receive_id: process.env.LARK_USER_ID!,
        msg_type: 'text',
        content: messageContent,
      },
    });

    console.error('Received response:', JSON.stringify(result, null, 2));

    if (!result) {
      return {
        content: [
          {
            type: 'text' as const,
            text: 'Failed to send message to Lark',
          },
        ],
      };
    }

    if (result.code !== 0) {
      return {
        content: [
          {
            type: 'text' as const,
            text: `Failed to send message: ${result.msg || 'Unknown error'}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: `Message sent successfully! Message ID: ${result.data?.message_id || 'unknown'}`,
        },
      ],
    };
  } catch (error) {
    console.error('Error sending Lark message:', error);
    return {
      content: [
        {
          type: 'text' as const,
          text: `Error sending message: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      ],
    };
  }
};

export default send_message_to_user;
