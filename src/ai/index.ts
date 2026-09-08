import type { Bindings } from '../types'
import type { AIProvider } from './provider'
import { GroqProvider } from './groq'
export function createAIProvider(env:Bindings):AIProvider|null{return env.GROQ_API_KEY?new GroqProvider(env.GROQ_API_KEY,env.GROQ_MODEL||'llama-3.3-70b-versatile'):null}
export type { AIProvider,AIMessage } from './provider'
