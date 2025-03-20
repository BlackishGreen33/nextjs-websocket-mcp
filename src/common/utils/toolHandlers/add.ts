import toolSchemas from '@/common/schemas/toolSchemas';

const add = async (args: unknown) => {
  const { a, b } = toolSchemas.toolInputs.add.parse(args);
  return {
    content: [{ type: 'text', text: String(a + b) }],
  };
};

export default add;
