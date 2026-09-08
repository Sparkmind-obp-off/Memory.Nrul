# Session Handoff

## Purpose

Checkpoint singkat agar AI berikutnya dapat melanjutkan dari titik terakhir tanpa memulai ulang konteks.

## Current Direction

Memory.Nrul sedang dibangun sebagai **general AI continuity layer**, bukan sebagai memory khusus TemplateKit atau satu topik tertentu.

## What Must Be Preserved

- konteks percakapan yang relevan
- pemahaman bersama
- kondisi/situasi yang memengaruhi arah
- keputusan dan alasan
- project state
- pekerjaan yang telah dilakukan
- hal yang sengaja tidak dilakukan
- pending items
- next actions

## Current Repository State

Dokumen continuity utama yang sudah tersedia:

- `docs/CONVERSATION_CONTINUITY.md`
- `docs/MEMORY_SCHEMA.md`
- `docs/PROJECT_CONTEXT.md`
- `docs/DECISIONS.md`
- `docs/SESSION_HANDOFF.md`

## Important Constraint

Repository dapat bersifat publik. Jangan memasukkan detail personal atau relationship-sensitive secara mentah. Continuity sensitif harus memiliki privacy boundary yang jelas.

## Next

Bangun struktur memory berikutnya berdasarkan kebutuhan nyata, lalu gunakan checkpoint ini untuk menjaga continuity antar sesi.

## Operating Loop

`READ → VERIFY → CONTINUE → EXECUTE → CHECKPOINT`
