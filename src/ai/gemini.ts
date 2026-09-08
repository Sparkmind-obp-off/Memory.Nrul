import type { AIMessage,AIProvider } from './provider'
export class GeminiProvider implements AIProvider{name='gemini';constructor(private apiKey:string,public model='gemini-2.5-flash'){}async chat(_messages:AIMessage[]):Promise<string>{throw new Error('Gemini provider is not configured in this deployment')}}
