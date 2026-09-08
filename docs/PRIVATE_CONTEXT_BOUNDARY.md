# Private Context Boundary

## Purpose

Dokumen ini menetapkan batas antara continuity yang aman dipublikasikan dan konteks yang harus tetap privat.

## Public Memory May Contain

- struktur memory dan schema
- prinsip continuity
- project context yang memang aman dipublikasikan
- keputusan teknis/non-sensitive
- status dan handoff yang tidak mengandung data pribadi
- aturan bagaimana AI membaca dan memverifikasi memory

## Private Memory Must Not Be Stored Here

Jangan menyimpan secara mentah:

- detail hubungan atau kehidupan pribadi yang sensitif
- isi percakapan pribadi yang dapat mengidentifikasi atau merugikan seseorang
- alamat, nomor telepon, credential, token, password, secret, atau data akun
- informasi kesehatan, finansial, hukum, atau data sensitif lainnya
- screenshot/chat export pribadi yang tidak diperlukan untuk tujuan continuity

## Important Principle

**Privacy bukan berarti context dibuang.**

Konteks yang dibutuhkan untuk continuity dapat tetap dipertahankan di storage privat yang sesuai, sementara repository publik ini hanya menyimpan struktur, pointer konseptual, dan aturan untuk menggunakannya.

## AI Access Model

Memory.Nrul tidak membuat seluruh riwayat ChatGPT otomatis dapat dibaca AI.

AI hanya dapat menggunakan private context jika platform/storage yang bersangkutan memberikan akses atau jika user memasok konteks tersebut secara eksplisit.

Karena itu:

`PUBLIC MEMORY → SAFE CONTEXT`

`PRIVATE MEMORY → SENSITIVE CONTEXT`

`AI SESSION → MERGE ONLY WHAT THE AI IS AUTHORIZED TO ACCESS`

## Rule

Jangan mengatasi keterbatasan akses dengan mempublikasikan konteks sensitif ke GitHub.
