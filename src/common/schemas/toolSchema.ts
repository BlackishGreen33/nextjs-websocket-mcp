import { z } from 'zod';

const toolSchemas = {
  toolInputs: {
    send_message_to_user: z.object({
      content: z.string(),
    }),
    add: z.object({
      a: z.number(),
      b: z.number(),
    }),
  },
};

export default toolSchemas;
