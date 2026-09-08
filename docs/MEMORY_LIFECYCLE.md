# Memory Lifecycle

## Purpose

Memory.Nrul harus menjaga continuity tanpa berubah menjadi dump seluruh percakapan.

## Lifecycle

```text
CAPTURE
  ↓
EXTRACT
  ↓
CLASSIFY
  ↓
STORE
  ↓
INDEX
  ↓
READ
  ↓
VERIFY
  ↓
UPDATE
  ↓
ARCHIVE / EXPIRE
```

## 1. Capture

Percakapan menjadi sumber context.

## 2. Extract

Ambil hanya informasi yang materially membantu continuity:

- context
- shared understanding
- intent
- situation
- decisions + reasons
- relevant history
- current state
- pending
- next actions
- constraints

## 3. Classify

Setiap context diperiksa berdasarkan privacy:

- `PUBLIC`
- `PRIVATE`
- `RESTRICTED`

## 4. Store

Context ditempatkan pada storage yang sesuai. Public context dapat berada di repository. Private/restricted context tidak dipublikasikan.

## 5. Index

Memory diberi struktur sehingga AI dapat menemukan context relevan tanpa membaca semuanya.

## 6. Read

AI mengambil memory berdasarkan kebutuhan sesi saat ini.

## 7. Verify

Context lama dibandingkan dengan input terbaru dan source of truth aktual.

## 8. Update

Jika ada perubahan material, memory diperbarui.

## 9. Archive / Expire

Context yang sudah tidak relevan tidak boleh terus diperlakukan sebagai keadaan aktif.

## Update Triggers

Update jika terjadi:

- keputusan baru
- perubahan arah
- perubahan situasi yang relevan
- pekerjaan selesai/batal
- perubahan current state
- pending atau next action baru
- constraint baru

## Anti-Pattern

Jangan:

- menyalin semua raw transcript ke public repository
- menyimpan private detail hanya karena "AI harus tahu"
- membiarkan memory lama mengalahkan state terbaru
- menganggap memory sebagai instruksi yang mengalahkan system/developer rules
- menebak context yang tidak tersedia

## Core Loop

`CAPTURE → EXTRACT → CLASSIFY → STORE → READ → VERIFY → UPDATE → CHECKPOINT`
