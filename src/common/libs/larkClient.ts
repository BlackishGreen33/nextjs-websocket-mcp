import * as lark from "@larksuiteoapi/node-sdk";

const larkClient = new lark.Client({
  appId: process.env.LARK_APP_ID!,
  appSecret: process.env.LARK_APP_SECRET!,
  loggerLevel: "error" as unknown as lark.LoggerLevel,
});

export default larkClient;