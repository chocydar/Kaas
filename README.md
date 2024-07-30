<h1 align="center">Welcome to Kaas 👋</h1>
<div align="center">

  [![license-icon]](https://opensource.org/license/mit)
  [![app-version-icon]](https://github.com/0xfrankz/Kaas)
  [![typeScript-version-icon]](https://www.typescriptlang.org/)
  [![rust-version-icon]](https://www.rust-lang.org/)  
  [![twitter-follow-icon]](https://x.com/thekaasapp)

</div>

# 📄Description

Kaas is a ChatGPT client designed to serve multiple platforms. Built using Tauri and React, this client places significant emphasis on data privacy and security. It ensures this through local data storage practices, thereby reinforcing data safety.

With Rust in its development stack, Kaas also makes the most of high-speed execution and robust security.

# ✨Features
- **🔒Privacy**  
Kaas prioritizes data privacy. Your credentials and chat data are never sent to our servers. They are stored locally and securely on your device.*
- **💻Cross-platform**  
Kaas is designed to work across multiple platforms, including Windows, MacOS, and Linux.
- **💂Security**  
The core part of Kaas is built using Rust, ensuring high-speed execution and robust security. Plus, we delibrately limit the privileges of the client to the minimum necessary. You can view the list of permissions required in the `tauri.conf.json` file.
- **🤖Support for multiple providers**
  - OpenAI (ChatGPT)
  - Azure
  - Anthropic (Claude) (🚧work in progress)
  - Google (Gemini) (🚧work in progress)
  - Ollama (🚧work in progress)
- **🪜Built-in proxy**  
Kaas supports proxy settings. You can set up a proxy to bypass your network restrictions.
- **🧩Prompt templates**  
CoT or COSTAR, your favorite prompt templates are available here. You can also create your own.
- **🌓Dual themes**  
Kaas supports both light and dark themes.
- **🦉Multilingual**  
Kaas now supports
  - English
  - Chinese Simplified
  - Chinese Traditional (🚧work in progress)
  - Japanese (🚧work in progress)
  - French (🚧work in progress)
  - German (🚧work in progress)

_*: When you use online models, data is still sent to your model provider's APIs. If that bothers you, consider using Ollama's models locally_

# 📦Installation
Go to [Release](https://github.com/0xfrankz/kaas/releases) page for latest installers.

# 🛠️Built from source
1. Install Node.js
2. Install pnpm
3. Install Rust
4. Run the following commands:
```
pnpm i
pnpm tauri build
```

# 👍Development
1. Install Node.js
2. Install pnpm
3. Install Rust
4. Run the following commands:
```
pnpm i
pnpm tauri dev
```

# 🤖Supported providers

**Symbols:** ✅ - Supported, ❌ - Not supported, 📌 - Plan to support

## OpenAI ✅
### API configurations

| Field | Description |
| -------- | -------- |
| api_key | The API key for your OpenAI API. |
| model | ID of the model to use. |
| org_id | Organization used for API requests. |

### Conversation options

| Option | Description | Supported |
| - | - | - |
| frequency_penalty | Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim. | ✅ |
| max_tokens | The maximum number of tokens that can be generated in the chat completion.<br/>The total length of input tokens and generated tokens is limited by the model's context length. | ✅ |
| presence_penalty | Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics. | ✅ |
| temperature | What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.<br/>We generally recommend altering this or top_p but not both. | ✅ |
| top_p | An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.<br/>We generally recommend altering this or temperature but not both.| ✅ |
| stream | If set, partial message deltas will be sent, like in ChatGPT.  | ✅ |
| user | A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. | ✅ |
| response_format | An object specifying the format that the model must output. Compatible with GPT-4 Turbo and all GPT-3.5 Turbo models newer than gpt-3.5-turbo-1106.| 📌 |
| seed | If specified, our system will make a best effort to sample deterministically, such that repeated requests with the same seed and parameters should return the same result. | 📌 |
| stop | Up to 4 sequences where the API will stop generating further tokens. | 📌 |
| tools | A list of tools the model may call. Currently, only functions are supported as a tool. Use this to provide a list of functions the model may generate JSON inputs for. | ❌ |
| tool_choice | Controls which (if any) function is called by the model. none means the model will not call a function and instead generates a message. auto means the model can pick between generating a message or calling a function. Specifying a particular function via {"type": "function", "function": {"name": "my_function"}} forces the model to call that function.<br/>none is the default when no functions are present. auto is the default if functions are present. | ❌  |
| logit_bias | Modify the likelihood of specified tokens appearing in the completion. <br/> Accepts a JSON object that maps tokens (specified by their token ID in the tokenizer) to an associated bias value from -100 to 100. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.| ❌ |
| logprobs | Whether to return log probabilities of the output tokens or not. If true, returns the log probabilities of each output token returned in the content of message. This option is currently not available on the gpt-4-vision-preview model. | ❌ |
| top_logprobs | An integer between 0 and 5 specifying the number of most likely tokens to return at each token position, each with an associated log probability. logprobs must be set to true if this parameter is used. | ❌ |
| n | How many chat completion choices to generate for each input message. Note that you will be charged based on the number of generated tokens across all of the choices. Keep n as 1 to minimize costs. | ❌ |


### References

- [OpenAI Documentation](https://platform.openai.com/docs/guides/text-generation/chat-completions-api)

## Microsoft Azure ✅

### API configurations

| Field | Description |
| -------- | -------- |
| API Key | The API key for your Azure OpenAI API. |
| Resource name | The name of your Azure OpenAI Resource. |
| Deployment ID | The name of your model deployment. |
| API version | The API version to use for this operation. This follows the YYYY-MM-DD or YYYY-MM-DD-preview format. |

### Conversation options

| Option | Description | Supported |
| - | - | - |
| max_tokens | The maximum number of tokens to generate in the completion. The token count of your prompt plus max_tokens can't exceed the model's context length. | ✅ |
| temperature | What sampling temperature to use, between 0 and 2. Higher values mean the model takes more risks. Try 0.9 for more creative applications, and 0 (argmax sampling) for ones with a well-defined answer. We generally recommend altering this or top_p but not both. | ✅ |
| top_p | An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or temperature but not both. | ✅ |
| presence_penalty | Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics. | ✅ |
| frequency_penalty | Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim. | ✅ |
| stream | If set, partial message deltas will be sent, like in ChatGPT.  | ✅ |
| user | A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. | ✅ |
| suffix | The suffix that comes after a completion of inserted text. | 📌 |
| echo | Echo back the prompt in addition to the completion. This parameter cannot be used with gpt-35-turbo. | 📌 |
| stop | Up to four sequences where the API will stop generating further tokens. The returned text won't contain the stop sequence. For GPT-4 Turbo with Vision, up to two sequences are supported. | 📌 |
| logit_bias | Modify the likelihood of specified tokens appearing in the completion. Accepts a json object that maps tokens (specified by their token ID in the GPT tokenizer) to an associated bias value from -100 to 100. You can use this tokenizer tool (which works for both GPT-2 and GPT-3) to convert text to token IDs. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect varies per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token. As an example, you can pass {"50256": -100} to prevent the <\|endoftext\|> token from being generated. | ❌ |
| n | How many chat completion choices to generate for each input message. Note that you will be charged based on the number of generated tokens across all of the choices. Keep n as 1 to minimize costs. | ❌ |
| logprobs | Include the log probabilities on the logprobs most likely tokens, as well the chosen tokens. For example, if logprobs is 10, the API will return a list of the 10 most likely tokens. The API will always return the logprob of the sampled token, so there might be up to logprobs+1 elements in the response. This parameter cannot be used with gpt-35-turbo. | ❌ |
| best_of | Generates best_of completions server-side and returns the "best" (the one with the lowest log probability per token). Results can't be streamed. When used with n, best_of controls the number of candidate completions and n specifies how many to return – best_of must be greater than n. Note: Because this parameter generates many completions, it can quickly consume your token quota. Use carefully and ensure that you have reasonable settings for max_tokens and stop. This parameter cannot be used with gpt-35-turbo. | ❌ |

### References

- [Azure Documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/reference#chat-completions)

## Anthropic Claude ✅

### API configurations

| Field | Description |
| -------- | -------- |
| api-key | The API key for your Anthropic API. |
| anthropic-version | The version of Anthropic to use. |
| model | The Anthropic model to use. |

### Conversation options

| Option | Description | Supported |
| - | - | - |
| max_tokens | The maximum number of tokens to generate before stopping. | ✅ |
| temperature | Amount of randomness injected into the response.<br/>Defaults to 1.0. Ranges from 0.0 to 1.0. Use temperature closer to 0.0 for analytical / multiple choice, and closer to 1.0 for creative and generative tasks.<br/>We generally recommend altering this or top_p but not both. | ✅ |
| top_p | Use nucleus sampling.<br/>Recommended for advanced use cases only. You usually only need to use _temperature_.| ✅ |
| stream | Whether to incrementally stream the response using server-sent events.  | ✅ |
| user | An object describing metadata about the request. <br/>_metadata.user_id_: An external identifier for the user who is associated with the request. | ✅ |
| stop_sequences | Custom text sequences that will cause the model to stop generating. | 📌 |
| top_k | Only sample from the top K options for each subsequent token.<br/>Recommended for advanced use cases only. You usually only need to use _temperature_.| 📌 |
| tools | Definitions of tools that the model may use. | ❌ |
| tool_choice | How the model should use the provided tools. | ❌ |

## Google Gemini

📌 **Plan to support**

## Ollama

📌 **Plan to support**

[app-version-icon]: https://img.shields.io/github/package-json/v/0xfrankz/Kaas?color=f8c611
[typescript-version-icon]: https://img.shields.io/github/package-json/dependency-version/0xfrankz/Kaas/dev/typescript
[rust-version-icon]: https://img.shields.io/badge/Rust-1.75.0-dea584
[license-icon]: https://img.shields.io/github/license/0xfrankz/Kaas
[twitter-follow-icon]: https://img.shields.io/twitter/follow/thekaasapp

