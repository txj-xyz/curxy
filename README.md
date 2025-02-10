# curxy

#### _cursor_ + _proxy_ = **curxy**

[![JSR](https://jsr.io/badges/@ryoppippi/curxy)](https://jsr.io/@ryoppippi/curxy)
[![JSR](https://jsr.io/badges/@ryoppippi/curxy/score)](https://jsr.io/@ryoppippi/curxy)

Ollama 在 Cursor 中使用的代理工作器

## 这是什么？

Curxy 是一个 代理服务器（proxy worker），用于在 Cursor 编辑器中使用 Ollama。
它的主要功能是将 Cursor 编辑器的请求转发到本地的 Ollama 服务器，并返回响应。

## 为什么需要这个？

当在 Cursor 编辑器 中运行 LLM 预测 时，编辑器会将数据发送到 官方 Cursor 服务器，然后再由该服务器转发给 Ollama。
问题是，即使在 Cursor 配置中将 API 端点设置为 localhost，Cursor 服务器 无法直接与本地 Ollama 通信。
因此，我们需要一个 代理服务器（proxy worker），用于将 Cursor 服务器的请求正确地转发到本地的 Ollama 服务器。

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


   完整的api调用URL应该像这样：
   ```sh
   https://trycloudflare.com/v1/chat/completions
   基于你本地环境和调整也可能是：
   https://trycloudflare.com/v1
   ```
   Windows运行
   ```bash
   PS F:\curxy-main> deno run -A jsr:@ryoppippi/curxy
   Listening on http://127.0.0.1:55300/
   o Starting cloudflared tunnel to http://127.0.0.1:55300 
   Server running at: https://trycloudflare.com/v1 ( https://trycloudflare.com/v1 )
    enter  https://trycloudflare.com/v1 ( https://trycloudflare.com/v1 ​) into Override OpenAl Base URL section in cursor settings
   ```
   使用 API KEY 测试链接返回模型
   ```bash
   curl -X GET "https://affair-powers-craig-national.trycloudflare.com/v1/tags" -H "Authorization: Bearer sk-proj-fwexxxxx"
   ```
   
   您可以获取由 cloudflare 托管的公共 URL.

4. 将 curxy 提供的 URL 及其后附加的 /v1 输入到光标编辑器配置的  _“覆盖 OpenAl 基本 URL”_  部分
   **提醒：_cursor_ 不支持的模型你加了也用不了

   ![image](https://github.com/user-attachments/assets/085705e1-ecca-48a9-b005-bd33f77bc642)

4. 将您想要的模型名称添加到光标编辑器配置的“模型名称”部分，

   ![image](https://github.com/user-attachments/assets/4dbfd8d6-add2-4ecd-8466-a0540a1aca5c)


5. （可选）：此外，如果您出于安全原因想要限制对此代理服务器的访问，则可以将 OPENAI_API_KEY 设置为环境变量，这将根据密钥启用访问限制。

6. **祝你好运!**

您还可以通过以下方式查看帮助信息 `deno run -A jsr:@ryoppippi/curxy --help`

## Related

[Japanese Article](https://zenn.dev/ryoppippi/articles/02c618452a1c9f)

## License

MIT
