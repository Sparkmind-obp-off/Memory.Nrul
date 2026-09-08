export type AIMessage={role:'system'|'user'|'assistant';content:string}
export interface AIProvider{name:string;model:string;chat(messages:AIMessage[]):Promise<string>}
