export type VoiceTurn={role:'user'|'assistant';text:string}
export type VoiceAudio={mimeType:string;audioBase64:string}
export interface SpeechToTextProvider{name:string;transcribe(audio:Blob):Promise<string>}
export interface TextToSpeechProvider{name:string;model?:string;synthesize(text:string):Promise<VoiceAudio>}
export type VoiceProvider={stt?:SpeechToTextProvider;tts?:TextToSpeechProvider}
