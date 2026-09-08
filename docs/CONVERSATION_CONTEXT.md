# Conversation Context

## Purpose

Dokumen ini khusus untuk menjaga **context percakapan** antara user dan AI.

Fokusnya bukan hanya "topik apa yang sedang dibahas", tetapi apa yang perlu diketahui AI agar percakapan dapat dilanjutkan secara natural tanpa user harus mengulang penjelasan dari awal.

## What Conversation Context Means

Context percakapan dapat mencakup:

- apa yang sedang dibicarakan
- apa yang sudah dipahami bersama
- maksud user di balik percakapan
- kondisi atau situasi yang memengaruhi pembicaraan
- istilah, nama, atau referensi yang sudah memiliki makna dalam percakapan
- keputusan yang sudah dibuat
- alasan di balik keputusan
- hal yang sudah terjadi sebelumnya dan masih relevan
- hal yang sedang berjalan
- hal yang belum selesai
- arah atau langkah berikutnya
- hal yang sengaja tidak ingin diulang atau dibahas kembali

## Conversation Is Not the Same as Raw Transcript

Memory.Nrul tidak harus menyimpan seluruh percakapan kata demi kata.

Yang dipertahankan adalah **context yang membuat AI tetap memahami percakapan**.

Contoh:

`RAW CONVERSATION → RELEVANT CONTEXT → MEMORY`

Dengan pendekatan ini, memory dapat tetap berguna tanpa menjadi arsip mentah seluruh chat.

## Context Across Conversations

Context dapat digunakan untuk menjaga kesinambungan ketika user berpindah:

- chat
- sesi
- model GPT
- aplikasi atau workspace AI

Namun repository ini tidak otomatis memberikan AI akses ke seluruh riwayat ChatGPT. AI hanya dapat menggunakan context yang benar-benar tersedia melalui memory/storage yang diberikan kepadanya.

## Private Conversation Context

Sebagian context percakapan dapat bersifat private atau sensitif.

Context tersebut **tetap dapat dipertahankan**, tetapi tidak boleh dimasukkan mentah ke repository publik.

Gunakan pemisahan:

`PUBLIC MEMORY → context yang aman untuk diketahui`  
`PRIVATE MEMORY → context sensitif/private`  
`AI SESSION → hanya context yang memang diizinkan untuk diakses`

Detail mekanismenya mengikuti `docs/PRIVATE_CONTEXT_BOUNDARY.md`.

## How AI Should Reconstruct Context

Saat memulai percakapan dari memory:

1. Baca context yang relevan.
2. Identifikasi apa yang sudah dipahami bersama.
3. Identifikasi keadaan terakhir.
4. Pisahkan fakta, keputusan, asumsi, dan hal yang masih belum pasti.
5. Periksa apakah ada private context yang tersedia dan memang diizinkan untuk digunakan.
6. Jangan mengarang context yang tidak tersedia.
7. Jika state teknis diperlukan, verifikasi repository atau sumber aktual.
8. Lanjutkan percakapan dari titik terakhir yang valid.

## Context Priority

Prioritas context:

1. Context yang tersedia dan relevan pada sesi saat ini.
2. Private context yang secara eksplisit tersedia/diizinkan.
3. Public Memory.Nrul yang relevan.
4. Repository/source of truth untuk state teknis.
5. Jangan menggunakan asumsi lama jika bertentangan dengan keadaan terbaru.

## Privacy Rule

Jangan mempublikasikan raw private conversation, relationship-sensitive details, credential, secret, atau data sensitif hanya agar AI dapat memahami context.

Jika context sensitif diperlukan untuk continuity, simpan di private storage yang sesuai dan berikan akses hanya ketika diperlukan.

## Core Principle

**Context harus dipertahankan, tetapi tidak semua context harus dipublikasikan.**

Tujuan akhirnya:

`USER TELAH MENJELASKAN → CONTEXT TERSIMPAN → AI DAPAT MEMAHAMI → USER TIDAK PERLU MENGULANG DARI NOL`
