import { DOMAINS, MEMORY_STATUSES, MEMORY_TYPES, PRIVACY_CLASSES, type MemoryRecord } from '../types'
const text=(v:unknown,max=20000)=>typeof v==='string'?v.trim().slice(0,max):''
const list=(v:unknown)=>Array.isArray(v)?v.slice(0,100).map(x=>text(x,200)).filter(Boolean):[]
const object=(v:unknown)=>v&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:{}
export function buildMemory(body:any, existing?:MemoryRecord):MemoryRecord|null {
 const createdAt=existing?.createdAt||new Date().toISOString(), updatedAt=new Date().toISOString()
 const memoryType=body.memoryType??body.memory_type??existing?.memoryType??'fact', privacyClass=body.privacyClass??body.privacy??existing?.privacyClass??'PUBLIC', status=body.status??existing?.status??'active'
 const m:MemoryRecord={id:existing?.id||text(body.id,100)||`mem-${crypto.randomUUID()}`,title:text(body.title??existing?.title,300),domain:text(body.domain??existing?.domain,100),memoryType,summary:text(body.summary??existing?.summary,4000),content:text(body.content??existing?.content??body.summary,20000),privacyClass,status,confidence:Number(body.confidence??existing?.confidence??1),source:text(body.source??existing?.source,500)||undefined,tags:list(body.tags??existing?.tags),entities:list(body.entities??existing?.entities),metadata:object(body.metadata??existing?.metadata),validFrom:text(body.validFrom??existing?.validFrom,50)||undefined,validUntil:text(body.validUntil??existing?.validUntil,50)||undefined,supersedesId:text(body.supersedesId??existing?.supersedesId,100)||undefined,createdAt,updatedAt,lastVerified:text(body.lastVerified??existing?.lastVerified,50)||undefined}
 if(!m.title||!m.domain||!m.summary||!DOMAINS.includes(m.domain as any)||!MEMORY_TYPES.includes(m.memoryType as any)||!PRIVACY_CLASSES.includes(m.privacyClass as any)||!MEMORY_STATUSES.includes(m.status as any)||!Number.isFinite(m.confidence)||m.confidence<0||m.confidence>1)return null
 return m
}
