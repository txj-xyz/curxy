# curxy

#### _cursor_ + _proxy_ = **curxy**

[![JSR](https://jsr.io/badges/@ryoppippi/curxy)](https://jsr.io/@ryoppippi/curxy)
[![JSR](https://jsr.io/badges/@ryoppippi/curxy/score)](https://jsr.io/@ryoppippi/curxy)

Ollama 在 Cursor 中使用的代理工作器

## 这是什么？

这是一个 代理工作器，用于在 Cursor 编辑器中使用 Ollama。它是一个简单的服务器，用于将请求转发到 Ollama 服务器并返回响应。

## 为什么需要这个？

在 Cursor 编辑器中使用 LLM 预测时，编辑器会将数据发送到 官方 Cursor 服务器，然后再由 Cursor 服务器转发到 Ollama 服务器。
因此，即使在 Cursor 编辑器的配置中将 API 端点 设置为 localhost，Cursor 服务器本身也无法直接与本地服务器通信。
为了实现本地调用，我们需要一个代理工作器，将数据从 Cursor 服务器转发到 Ollama 服务器。

## 要求

- deno   安装去这里 https://docs.deno.com/runtime/getting_started/installation/
- ollama server  安装去这里  https://ollama.com/

## 怎么使用

1. 启动 Ollama 服务器

2. 启动 Curxy

   ```sh
   deno run -A jsr:@ryoppippi/curxy
   ```

   参考下图
   ```sh
   OLLAMA HOST 设置为 0.0.0.0:11434
   OPENAI API KEY 在环境变量中全局设置一个配合使用
   在Cursor使用需要外网访问记得路由器上打开本机的 IP + 11434端口转发
   ```
   ![24fbfd919e00efd40cf9367bd8590c9](https://github.com/user-attachments/assets/71d5764c-5cfb-41b0-a161-e6e587577a16)


   ```bash
   OPENAI_API_KEY=your_openai_api_key deno run -A jsr:@ryoppippi/curxy

   Listening on http://127.0.0.1:62192/
   ◐ Starting cloudflared tunnel to http://127.0.0.1:62192                                                                                                                                                                                                                                                           5:39:59 PM
   Server running at: https://remaining-chen-composition-dressed.trycloudflare.com
   ```

   You can get the public URL hosted by cloudflare.

4. Enter the URL provided by `curxy` with /v1 appended to it into the "Override
   OpenAl Base URL" section of the cursor editor configuration.

![cursor](https://github.com/user-attachments/assets/83a54310-0728-49d8-8c3f-b31e0d8e3e1b)

4. Add model names you want to "Model Names" section of the cursor editor
   configuration.

![Screenshot 2024-08-22 at 23 42 33](https://github.com/user-attachments/assets/c24fed7c-c61e-46a0-b735-ccf594a96363)

5. (Optional): Additionally, if you want to restrict access to this Proxy Server
   for security reasons, you can set the OPENAI_API_KEY as an environment
   variable, which will enable access restrictions based on the key.

6. **Enjoy!**

Also, you can see help message by `deno run -A jsr:@ryoppippi/curxy --help`

## Related

[Japanese Article](https://zenn.dev/ryoppippi/articles/02c618452a1c9f)

## License

MIT
