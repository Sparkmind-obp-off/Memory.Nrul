import type { MemoryRecord } from '../types'
export type PrivacyPolicy={authenticated:boolean;allowPrivate:boolean;externalProvider:boolean}
export function filterByPrivacy(items:MemoryRecord[],policy:PrivacyPolicy){return items.filter(m=>{if(m.privacyClass==='RESTRICTED')return !policy.externalProvider&&policy.authenticated;if(m.privacyClass==='PRIVATE')return policy.authenticated&&(!policy.externalProvider||policy.allowPrivate);return true})}
export function assertExternalPrivacy(items:MemoryRecord[]){if(items.some(m=>m.privacyClass==='RESTRICTED'))throw new Error('Privacy boundary violation');return items}
