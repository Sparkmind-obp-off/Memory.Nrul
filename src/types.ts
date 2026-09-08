export const DOMAINS = ['Conversation','Personal','Relationship','Project','Decision','Situation','History','Timeline','Preferences','Constraints','Tasks','Pending','Session Handoff','System'] as const
export const MEMORY_TYPES = ['fact','preference','decision','constraint','goal','event','state','task','relationship','instruction','summary','handoff'] as const
export const PRIVACY_CLASSES = ['PUBLIC','PRIVATE','RESTRICTED'] as const
export const MEMORY_STATUSES = ['active','archived','superseded','expired'] as const
export const LINK_RELATIONS = ['supports','contradicts','supersedes','depends_on','related_to','derived_from','caused_by'] as const

export type PrivacyClass = typeof PRIVACY_CLASSES[number]
export type MemoryStatus = typeof MEMORY_STATUSES[number]
export type MemoryType = typeof MEMORY_TYPES[number]
export type MemoryRecord = {
  id: string; title: string; domain: string; memoryType: MemoryType; summary: string; content: string
  privacyClass: PrivacyClass; status: MemoryStatus; confidence: number; source?: string
  tags: string[]; entities: string[]; metadata: Record<string, unknown>; validFrom?: string; validUntil?: string
  supersedesId?: string; createdAt: string; updatedAt: string; lastVerified?: string
}
export type MemoryLink = { sourceId: string; targetId: string; relation: string }
export type Checkpoint = {
  id: string; sessionId?: string; summary: string; currentState?: string; completed: string[]; pending: string[]
  nextActions: string[]; decisions: string[]; constraints: string[]; createdAt: string
}
export type ContextPackage = {
  version: string; generatedAt: string; query: string; context: MemoryRecord[]; decisions: MemoryRecord[]
  constraints: MemoryRecord[]; currentState: Record<string, unknown>; pending: MemoryRecord[]; nextActions: string[]
  history: MemoryRecord[]; checkpoint: Checkpoint | null; privacy: { externalProvider: boolean; privateIncluded: boolean; restrictedBlocked: true }
}
export type Bindings = {
  DB?: D1Database; ASSETS?: Fetcher; MEMORY_ADMIN_KEY?: string; MEMORY_SESSION_SECRET?: string
  GROQ_API_KEY?: string; GROQ_MODEL?: string; ENVIRONMENT?: string
}
