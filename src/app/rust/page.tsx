'use client';

import * as React from 'react';

import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { client, main, RustClientTransport } from '@/common/libs/rustClient';

const HomePage: React.FC = () => {
  const [messages, setMessages] = React.useState<string[]>([]);
  const [newMessage, setNewMessage] = React.useState('');
  const [connectionStatus, setConnectionStatus] = React.useState<
    '连接成功' | '连接失败' | '连接中'
  >('连接中');
  const tpRef = React.useRef<RustClientTransport | null>(null);

  React.useEffect(() => {
    const transport = new RustClientTransport();
    tpRef.current = transport;

    transport.onerror = () => {
      setConnectionStatus('连接失败');
    };

    transport.onclose = () => {
      setConnectionStatus('连接失败');
    };

    transport.onmessage = (msg) => {
      setMessages((prevMessages) => [...prevMessages, JSON.stringify(msg)]);
    };

    const connect = async () => {
      await client.connect(transport);
      setConnectionStatus('连接成功');

      client.onerror = () => {
        setConnectionStatus('连接失败');
      };

      client.onclose = () => {
        setConnectionStatus('连接失败');
      };
    };

    connect();

    return () => {
      if (tpRef.current) {
        tpRef.current.close();
      }
    };
  }, []);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    main(newMessage);

    setNewMessage('');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="mx-4 flex h-[80vh] w-full max-w-2xl flex-col rounded-xl border border-gray-200 bg-white shadow-lg">
        <div
          className={`rounded-t-xl px-6 py-3 text-sm font-medium ${
            connectionStatus === '连接成功'
              ? 'border-b border-green-100 bg-green-50 text-green-700'
              : connectionStatus === '连接失败'
                ? 'border-b border-red-100 bg-red-50 text-red-700'
                : 'border-b border-yellow-100 bg-yellow-50 text-yellow-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                connectionStatus === '连接成功'
                  ? 'bg-green-500'
                  : connectionStatus === '连接失败'
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
              }`}
            ></div>
            当前状态: {connectionStatus}
          </div>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md"
            >
              <p className="font-medium text-gray-800">{message}</p>
            </div>
          ))}
        </div>
        <form
          onSubmit={sendMessage}
          className="rounded-b-xl border-t border-gray-100 bg-white p-6"
        >
          <div className="flex gap-3">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="h-12 flex-1"
              placeholder="输入你要传送的消息..."
            />
            <Button
              type="submit"
              variant={
                connectionStatus === '连接成功' ? 'default' : 'secondary'
              }
              disabled={connectionStatus !== '连接成功'}
              className="h-12"
            >
              发送
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default HomePage;
