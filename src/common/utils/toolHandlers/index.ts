import add from './add';
import send_message_to_server from './send_message_to_server';
import send_message_to_user from './send_message_to_user';

const toolHandlers = {
  send_message_to_user,
  send_message_to_server,
  add,
};

export default toolHandlers;
