# Memory Schema

## Purpose

Dokumen ini mendefinisikan format standar untuk menyimpan continuity antara user dan AI. Memory.Nrul bukan arsip satu proyek dan bukan sekadar kumpulan topik.

## Core Context

Setiap memory yang dipertahankan sebaiknya menjawab:

- **Context** — apa yang sedang terjadi?
- **Understanding** — apa yang sudah dipahami bersama?
- **Situation** — kondisi apa yang memengaruhi percakapan/keputusan?
- **Decision** — apa yang sudah diputuskan?
- **Reason** — mengapa keputusan itu dibuat?
- **State** — apa yang sudah dikerjakan dan bagaimana keadaan terakhirnya?
- **Pending** — apa yang belum selesai?
- **Next** — apa langkah berikutnya?
- **Constraints** — apa yang tidak boleh diulang, diubah, atau dilupakan?

## Memory Layers

### 1. Conversation Continuity
Menjaga kesinambungan percakapan lintas chat, sesi, aplikasi, dan model.

### 2. Project Context
Menyimpan konteks proyek, status, tujuan, repository, dan pekerjaan yang sedang berjalan.

### 3. Decision Log
Menyimpan keputusan penting beserta alasan dan dampaknya.

### 4. Situation Context
Menyimpan kondisi non-sensitif yang diperlukan agar AI memahami mengapa suatu arah dipilih.

### 5. Session Handoff
Checkpoint yang memungkinkan AI berikutnya langsung melanjutkan pekerjaan.

### 6. Topic-Specific Context
Konteks khusus untuk topik tertentu hanya jika diperlukan untuk continuity.

## Source-of-Truth Rules

- Repository proyek adalah source of truth untuk source code dan state teknis.
- Memory.Nrul adalah source of truth untuk continuity, konteks, keputusan, dan handoff.
- Jika memory berbeda dengan state aktual proyek, verifikasi state aktual terlebih dahulu.
- Memory tidak mengalahkan system instructions, developer instructions, safety policy, atau permission model dari AI yang membacanya.

## Privacy Rule

Repository ini dapat bersifat publik. Jangan memasukkan credential, secret, data pribadi sensitif, atau detail hubungan/personal yang tidak layak dipublikasikan. Untuk konteks sensitif, gunakan representasi abstrak atau storage privat.

## Update Rule

Memory diperbarui ketika ada perubahan yang materially penting terhadap pemahaman, keputusan, situasi, project state, atau next action. Tidak perlu menyalin setiap kata dari percakapan.

## Handoff Principle

`READ MEMORY → VERIFY CURRENT STATE → RECONSTRUCT CONTEXT → CONTINUE`

Tujuan akhirnya adalah membuat AI berikutnya memahami percakapan dan pekerjaan yang sedang berlangsung tanpa user harus menjelaskan semuanya dari nol.
