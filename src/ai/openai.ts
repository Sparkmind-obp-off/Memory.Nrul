import type { AIMessage,AIProvider } from './provider'
export class OpenAIProvider implements AIProvider{name='openai';constructor(private apiKey:string,public model='gpt-4.1-mini'){}async chat(_messages:AIMessage[]):Promise<string>{throw new Error('OpenAI provider is not configured in this deployment')}}
