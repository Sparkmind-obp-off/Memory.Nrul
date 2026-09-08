# Memory.Nrul Architecture

## Purpose

Memory.Nrul adalah **general AI conversation continuity layer** untuk mempertahankan context yang relevan antara user dan AI lintas chat, sesi, aplikasi, dan model.

Arsitektur ini memisahkan **continuity**, **privacy**, dan **source of truth** agar AI dapat melanjutkan percakapan tanpa mempublikasikan context sensitif.

## High-Level Architecture

```text
                         ┌──────────────────────┐
                         │      USER / AI        │
                         │     CONVERSATION      │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ CONTEXT EXTRACTION   │
                         │ - intent             │
                         │ - understanding      │
                         │ - situation          │
                         │ - decisions          │
                         │ - state              │
                         │ - pending / next     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ PRIVACY CLASSIFIER   │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
          ┌──────────────────┐             ┌──────────────────┐
          │  PUBLIC MEMORY   │             │  PRIVATE MEMORY  │
          │ safe context     │             │ sensitive detail │
          │ schema/decisions │             │ private history  │
          └────────┬─────────┘             └────────┬─────────┘
                   │                                │
                   └──────────────┬─────────────────┘
                                  ▼
                       ┌──────────────────────┐
                       │   AUTHORIZED AI      │
                       │   CONTEXT MERGER     │
                       └──────────┬───────────┘
                                  │
                                  ▼
                       ┌──────────────────────┐
                       │  RECONSTRUCT CONTEXT │
                       │  + VERIFY CURRENT    │
                       │       STATE          │
                       └──────────┬───────────┘
                                  │
                                  ▼
                       ┌──────────────────────┐
                       │      CONTINUE        │
                       │      EXECUTE         │
                       │      CHECKPOINT      │
                       └──────────────────────┘
```

## Core Components

### 1. Conversation Context

Menangkap context yang membuat percakapan tetap nyambung, bukan raw transcript semata.

### 2. Public Memory

Tempat untuk schema, prinsip, safe context, keputusan non-sensitive, project index, dan handoff yang aman dipublikasikan.

### 3. Private Memory

Tempat untuk context sensitif yang dibutuhkan continuity tetapi tidak layak dimasukkan ke repository publik.

### 4. Context Merger

Menggabungkan hanya memory yang memang tersedia dan diizinkan untuk AI yang sedang digunakan.

### 5. Source-of-Truth Verification

Memory menjelaskan context dan history. Repository/source aktual memverifikasi keadaan teknis terbaru.

## Context Object

Representasi logical minimum:

```text
MemoryRecord {
  context
  intent
  shared_understanding
  situation
  decisions[]
  reasons[]
  relevant_history[]
  current_state
  completed[]
  rejected_or_not_done[]
  pending[]
  next_actions[]
  constraints[]
  privacy_class
  source
  last_verified
}
```

Field dapat disesuaikan sesuai kebutuhan. Tidak semua percakapan membutuhkan seluruh field.

## Privacy Classes

```text
PUBLIC
  ↓
SAFE CONTEXT

PRIVATE
  ↓
SENSITIVE CONTEXT

RESTRICTED
  ↓
SECRET / CREDENTIAL / DATA YANG TIDAK BOLEH DIEKSPOS
```

`PRIVATE` dan `RESTRICTED` tidak boleh dipindahkan ke repository publik hanya untuk mempermudah akses AI.

## Read Flow

Saat AI memulai sesi baru:

1. Baca memory yang relevan.
2. Tentukan context apa yang tersedia.
3. Ambil private context hanya jika aksesnya sah/diizinkan.
4. Rekonstruksi shared understanding.
5. Pisahkan fakta, keputusan, asumsi, dan ketidakpastian.
6. Verifikasi current state terhadap source of truth bila diperlukan.
7. Lanjutkan dari titik terakhir yang valid.

## Write Flow

Setelah percakapan menghasilkan perubahan material:

1. Identifikasi perubahan.
2. Ekstrak context yang perlu dipertahankan.
3. Klasifikasikan privacy.
4. Tulis ke public atau private memory yang sesuai.
5. Verifikasi hasil.
6. Buat session checkpoint bila diperlukan.

## Cross-AI Continuity

Memory.Nrul dapat menjadi format continuity yang dapat dibaca oleh AI berbeda, tetapi repository tidak secara otomatis memberikan akses ke seluruh riwayat percakapan.

Model AI berikutnya hanya dapat memahami context yang benar-benar diberikan melalui storage, connector, memory system, atau input user yang tersedia.

## Non-Goals

Memory.Nrul tidak bertujuan untuk:

- menjadi pengganti database aplikasi
- menggantikan source code repository
- menyimpan semua raw transcript secara publik
- memaksa AI mengabaikan system/developer instructions
- memberikan akses otomatis ke private context

## Operating Loop

`READ MEMORY → CLASSIFY ACCESS → VERIFY STATE → RECONSTRUCT → CONTINUE → EXECUTE → CHECKPOINT`

## Design Principle

**Preserve context, respect privacy, verify reality, continue naturally.**
