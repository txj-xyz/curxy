import { getRandomPort } from "get-port-please";
import { startTunnel } from "untun";
import { cli } from "cleye";
import terminalLink from "terminal-link";
import { bold, green, italic } from "yoctocolors";

import json from "./deno.json" with { type: "json" };
import { validateURL } from "./util.ts";
import { createApp } from "./proxy.ts";
import { ensure, is } from "@core/unknownutil";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") ; // 获取OpenAI API密钥 

const argv = cli({
  name: json.name.split("/").at(-1) as string,
  version: json.version,

  flags: {
    endpoint: {
      type: validateURL,
      alias: "e",
      default: "http://localhost:11434",
      description: "The endpoint to Ollama server.", // 指定Ollama服务器的端点  
    },

    openaiEndpoint: {
      type: validateURL,
      alias: "o",
      default: "https://api.openai.com",
      description: "The endpoint to OpenAI server.", // 指定OpenAI服务器的端点  
    },

    port: {
      type: Number,
      alias: "p",
      default: await getRandomPort(),
      description: "The port to run the server on. Default is random", // 指定服务器运行的端口，默认是随机端口    
    },

    hostname: {
      type: String,
      default: "127.0.0.1",
      description: "The hostname to run the server on.", // 指定服务器运行的主机名    
    },

    cloudflared: {
      type: Boolean,
      default: true,
      description: "Use cloudflared to tunnel the server", // 使用Cloudflare Tunnel进行服务器隧道     
    },
  },

  help: {
    description: "A proxy An proxy worker for using ollama in cursor", // 一个代理代理工作器，用于在Cursor中使用Ollama      

    examples: [
      "curxy",

      "",

      "curxy --endpoint http://localhost:11434 --openai-endpoint https://api.openai.com --port 8800", // 使用指定的Ollama服务器端点和OpenAI服务器端点，并指定服务器运行的端口为8800     

      "",

      "OPENAI_API_KEY=sk-123456 curxy --port 8800", // 设置OpenAI API密钥为sk-123456，并指定服务器运行的端口为8800      
    ],
  },
});

const { flags } = argv;

if (import.meta.main) {
  const app = createApp({
    openAIEndpoint: flags.openaiEndpoint,
    ollamaEndpoint: flags.endpoint,
    OPENAI_API_KEY,
  });

  await Promise.all([
    Deno.serve({ port: flags.port, hostname: flags.hostname }, app.fetch),
    flags.cloudflared &&
    startTunnel({ port: flags.port, hostname: flags.hostname })
      .then(async (tunnel) => ensure(await tunnel?.getURL(), is.String))
      .then((url) =>
        console.log(
          `Server running at: ${bold(terminalLink(url, url))}\n`,
          green(
            `enter ${bold(terminalLink(`${url}/v1`, `${url}/v1`))} into ${
              italic(`Override OpenAl Base URL`)  // 在Cursor设置中进入`Override OpenAl Base URL`部分 
            } section in cursor settings`,
          ),
        )
      ),
  ]);
}
