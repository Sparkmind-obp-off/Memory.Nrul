import type { Bindings } from '../types'
import type { Context } from 'hono'
export function configuredSecret(env:Bindings){return env.MEMORY_SESSION_SECRET||env.MEMORY_ADMIN_KEY||''}
export function isAuthenticated(c:Context<{Bindings:Bindings}>){const secret=configuredSecret(c.env);if(!secret)return false;const auth=c.req.header('Authorization');if(auth===`Bearer ${secret}`)return true;const cookie=c.req.header('Cookie')||'';return cookie.split(';').some(v=>v.trim().startsWith('memory_session=')&&v.trim().slice(15)===secret)}
export function requireAuth(c:Context<{Bindings:Bindings}>){return isAuthenticated(c)?null:c.json({error:'Authorization required'},401)}
export function sessionCookie(secret:string,maxAge=28800){return `memory_session=${encodeURIComponent(secret)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`}
