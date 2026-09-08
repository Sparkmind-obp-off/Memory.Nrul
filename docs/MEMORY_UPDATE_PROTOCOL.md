# Memory Update Protocol

## Purpose

Dokumen ini menentukan **kapan dan bagaimana context percakapan dimasukkan ke Memory.Nrul**.

Memory bukan tempat menyalin semua chat. Memory adalah continuity layer yang menjaga hal-hal penting agar AI berikutnya tetap memahami keadaan dan arah percakapan.

## When to Update Memory

Update memory jika percakapan menghasilkan perubahan yang material, misalnya:

- pemahaman baru yang akan memengaruhi percakapan berikutnya
- keputusan baru
- perubahan tujuan atau arah
- perubahan kondisi yang relevan
- pekerjaan yang selesai
- pekerjaan yang dibatalkan
- pending item baru
- next action baru
- perubahan terhadap project state
- perubahan terhadap batasan atau preferensi yang memang perlu dipertahankan

Tidak perlu membuat memory baru untuk setiap percakapan kecil.

## What to Capture

Untuk context percakapan, prioritaskan:

- `Context`
- `Intent`
- `Shared Understanding`
- `Situation`
- `Decision`
- `Reason`
- `Current State`
- `History Relevant to Continuity`
- `Pending`
- `Next`
- `Constraints`

## What Not to Capture Publicly

Jangan memasukkan ke repository publik:

- raw transcript percakapan pribadi
- detail hubungan atau kehidupan pribadi yang sensitif
- data yang dapat mengidentifikasi atau merugikan seseorang
- password, token, API key, credential, atau secret
- informasi kesehatan, finansial, hukum, atau data sensitif lainnya

Jika detail tersebut diperlukan agar continuity tetap utuh, simpan pada **private memory/storage** dan jangan dipindahkan ke public GitHub hanya demi memudahkan AI.

## Safe Abstraction

Jika sebuah context penting tetapi sensitif, gunakan abstraksi di public memory.

Contoh pola:

`Public: ada konteks personal yang memengaruhi keputusan dan perlu dirujuk secara hati-hati.`

`Private: detail lengkap mengenai konteks tersebut.`

Dengan demikian AI mengetahui bahwa ada context yang relevan tanpa public repository membocorkan isi sensitifnya.

## Update Workflow

`CONVERSATION → IDENTIFY MATERIAL CHANGE → CLASSIFY PRIVACY → UPDATE APPROPRIATE MEMORY → VERIFY → CHECKPOINT`

## AI Reading Workflow

`READ RELEVANT MEMORY → CHECK PRIVATE CONTEXT AVAILABILITY → VERIFY CURRENT STATE → RECONSTRUCT CONTEXT → CONTINUE`

## Important Limitation

Memory.Nrul tidak membuat seluruh riwayat ChatGPT otomatis tersedia bagi model AI lain.

Agar private context dapat digunakan, platform atau storage yang menyimpannya harus menyediakan akses yang sah, atau user harus memberikan context tersebut ke AI.

Jangan mengatasi keterbatasan akses dengan mempublikasikan data private.

## Core Principle

**Yang disimpan bukan semua kata. Yang disimpan adalah context yang membuat percakapan tetap nyambung.**
