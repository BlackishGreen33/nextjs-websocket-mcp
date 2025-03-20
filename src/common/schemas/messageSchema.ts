import { z } from 'zod';

export const messagesSchema = z.object({
  messages: z.string(),
});
