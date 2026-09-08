# Memory.Nrul

**Memory.Nrul** adalah general **AI conversation continuity layer**.

Tujuannya sederhana: ketika user berpindah chat, sesi, aplikasi, atau model AI, konteks penting tidak harus dijelaskan ulang dari nol.

Memory.Nrul bukan sekadar arsip topik dan bukan memory untuk satu proyek saja. Ia menjaga hal-hal yang membuat percakapan tetap nyambung:

- context percakapan
- shared understanding
- intent dan tujuan
- situation yang relevan
- keputusan dan alasan
- history yang masih relevan
- current state
- pekerjaan yang sudah dilakukan
- pending items
- next actions
- constraints

## Cara Kerja

```text
CONVERSATION
     ↓
EXTRACT RELEVANT CONTEXT
     ↓
CLASSIFY PRIVACY
     ↓
PUBLIC MEMORY + PRIVATE MEMORY
     ↓
AI SESSION
     ↓
READ → VERIFY → CONTINUE
```

### Public Memory

Repository ini dapat menyimpan struktur memory, prinsip continuity, konteks yang aman dipublikasikan, keputusan non-sensitive, dan aturan pemrosesan memory.

### Private Memory

Context yang sensitif atau pribadi tetap dapat dipertahankan, tetapi tidak dipublikasikan mentah ke GitHub. Private context hanya digunakan oleh AI ketika storage/platform menyediakan akses yang sah atau user memberikannya secara eksplisit.

**Privacy bukan berarti context dibuang. Privacy berarti context disimpan melalui jalur yang tepat.**

## Dokumen Utama

- `docs/CONVERSATION_CONTINUITY.md` — prinsip continuity lintas chat/sesi/model.
- `docs/CONVERSATION_CONTEXT.md` — definisi dan cara merekonstruksi context percakapan.
- `docs/MEMORY_SCHEMA.md` — struktur context yang perlu dipertahankan.
- `docs/MEMORY_UPDATE_PROTOCOL.md` — kapan dan bagaimana memory diperbarui.
- `docs/PRIVATE_CONTEXT_BOUNDARY.md` — batas public vs private context.
- `docs/PROJECT_CONTEXT.md` — index konteks proyek yang relevan.
- `docs/DECISIONS.md` — keputusan dan alasan agar tidak mengulang hal yang sudah diputuskan.
- `docs/SESSION_HANDOFF.md` — checkpoint untuk melanjutkan sesi berikutnya.

## Source of Truth

Memory.Nrul adalah source of truth untuk **continuity, context, decisions, dan handoff**.

Repository proyek masing-masing tetap menjadi source of truth untuk **source code dan technical state**.

Jika memory berbeda dengan keadaan aktual, verifikasi keadaan aktual terlebih dahulu.

## Privacy & Security

Jangan menyimpan di repository publik:

- raw private conversation
- detail relationship atau kehidupan pribadi yang sensitif
- password, token, API key, credential, atau secret
- data kesehatan, finansial, hukum, atau data sensitif lainnya

Jika context sensitif dibutuhkan untuk continuity, simpan di private storage yang sesuai.

## Operating Loop

`READ MEMORY → VERIFY CURRENT STATE → RECONSTRUCT CONTEXT → CONTINUE → EXECUTE → CHECKPOINT`

## Core Principle

> **Yang disimpan bukan semua kata. Yang disimpan adalah context yang membuat AI tetap memahami apa yang sedang terjadi.**

Memory.Nrul tidak membuat seluruh riwayat ChatGPT otomatis tersedia bagi model lain. Akses tetap bergantung pada memory/storage yang benar-benar tersedia dan permission yang diberikan.
