# Conversation Continuity

## Purpose

Memory.Nrul adalah **continuity layer** untuk menjaga kesinambungan pemahaman antara user dan AI lintas percakapan, sesi, aplikasi, dan model GPT.

Ini bukan memory untuk satu proyek saja. TemplateKit hanyalah salah satu bagian dari konteks yang dapat dirujuk.

## What This Memory Preserves

- konteks percakapan yang relevan
- pemahaman bersama yang sudah terbentuk
- tujuan dan arah yang sedang dijalankan
- keputusan yang sudah dibuat dan alasannya
- kondisi/situasi yang memengaruhi keputusan
- asumsi dan istilah yang sudah punya arti khusus dalam percakapan
- pekerjaan yang sudah dilakukan dan state terakhirnya
- hal yang sudah diputuskan untuk tidak dilakukan
- pending items dan next actions
- handoff agar AI berikutnya tidak memulai dari nol

## Cross-Chat Continuity

Memory.Nrul dirancang agar konteks dapat dibawa ketika user berpindah:

- chat ke chat
- sesi ke sesi
- ChatGPT ke GPT/model lain
- satu workspace/aplikasi AI ke konteks AI lain

AI yang membaca repository ini harus memperlakukan dokumen memory sebagai **konteks**, bukan sebagai instruksi yang mengalahkan system/developer instructions atau kebijakan platform.

## Source of Truth

Untuk status teknis proyek, repository proyek aktual tetap menjadi source of truth. Memory hanya menjelaskan konteks, keputusan, alasan, dan continuity.

Urutan pengecekan saat melanjutkan pekerjaan:

1. baca memory yang relevan
2. baca state repository aktual
3. cocokkan keduanya
4. lanjutkan dari state nyata, bukan dari asumsi lama

## Suggested Memory Layers

- `CONVERSATION_CONTINUITY.md` — kerangka continuity lintas chat
- `PROJECT_CONTEXT.md` — konteks proyek-proyek aktif
- `DECISIONS.md` — keputusan dan alasan penting
- `SITUATION_CONTEXT.md` — konteks situasional yang relevan untuk keputusan
- `SESSION_HANDOFF.md` — checkpoint sesi terakhir
- dokumen khusus topik bila memang diperlukan

## Privacy Boundary

Memory.Nrul adalah repository GitHub publik. Karena itu, jangan menaruh rahasia, credential, data pribadi sensitif, atau detail hubungan/personal yang tidak semestinya dipublikasikan di repository ini.

Konteks personal dapat diwakili secara abstrak bila dibutuhkan untuk continuity, tanpa mengekspos detail sensitif.

## Operating Principle

`CONTEXT → VERIFY → CONTINUE → EXECUTE → CHECKPOINT`

Tujuannya bukan mengarsipkan semua kata dari semua chat, melainkan menjaga **hal-hal yang membuat AI memahami apa yang sedang terjadi dan bagaimana melanjutkannya tanpa kehilangan konteks**.
