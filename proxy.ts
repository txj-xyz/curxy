import { Hono } from "@hono/hono";
import { bearerAuth } from "@hono/hono/bearer-auth";
import { assert, is } from "@core/unknownutil";
import { parseURL } from "ufo";
import { chooseEndpoint, convertToCustomEndpoint } from "./util.ts";

export function createApp(
  {
    openAIEndpoint,
    ollamaEndpoint,
    OPENAI_API_KEY,
  }: {
    openAIEndpoint: string;
    ollamaEndpoint: string;
    OPENAI_API_KEY: string | undefined;
  },
) {
  const app = new Hono();

  // Apply bearer authentication, but skip it for OPTIONS requests // 应用bearer认证，但跳过OPTIONS请求 
  app.use((c, next) => {
    if (c.req.method !== "OPTIONS") {
      if (is.String(OPENAI_API_KEY)) {
        return bearerAuth({ token: OPENAI_API_KEY })(c, next);
      }
    }
    // If the method is OPTIONS, skip the bearerAuth // 如果方法是OPTIONS，跳过bearerAuth   
    return next();
  });

  // Handle POST requests // 处理POST请求   
  app.post("*", async (c) => {
    const json = await c.req.raw.clone().json();
    const { model } = json;

    // Validate the request payload // 验证请求负载     
    assert(json, is.ObjectOf({ model: is.String }));

    const endpoint = chooseEndpoint({
      model,
      ollamaEndpoint,
      openAIEndpoint,
    });

    const url = convertToCustomEndpoint(c.req.url, parseURL(endpoint));
    const req = new Request(url, c.req.raw);
    req.headers.set("Host", ollamaEndpoint);
    return fetch(req);
  });

  // Handle GET requests  // 处理GET请求     
  app.get("*", (c) => {
    const url = convertToCustomEndpoint(c.req.url, parseURL(ollamaEndpoint));
    const req = new Request(url, c.req.raw);
    req.headers.set("Host", ollamaEndpoint);
    return fetch(req);
  });

  // Handle OPTIONS requests // 处理OPTIONS请求     
  app.options("*", (c) => {
    c.header("Allow", "OPTIONS, GET, POST");
    c.header("Access-Control-Allow-Origin", "*");
    c.header("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
    c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return c.body(null, 204);
  });

  return app;
}
