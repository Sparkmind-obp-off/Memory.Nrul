# Situation Context

## Purpose

Dokumen ini mendefinisikan cara menyimpan **situasi yang memengaruhi pemahaman dan keputusan** tanpa harus menyimpan raw conversation.

Situation context menjawab pertanyaan: **"Kondisi apa yang sedang berlaku sehingga AI perlu memahami percakapan dengan cara tertentu?"**

## What to Preserve

Situation dapat mencakup:

- kondisi proyek
- kondisi pekerjaan atau proses yang sedang berjalan
- perubahan keadaan yang materially memengaruhi keputusan
- dependency atau constraint yang sedang aktif
- konteks waktu yang relevan
- kondisi komunikasi yang perlu dipahami AI
- faktor lain yang relevan untuk continuity

## What Not to Publish

Jangan memasukkan detail personal/sensitif secara mentah ke repository publik.

Jika situasi personal diperlukan untuk continuity, gunakan abstraksi yang aman, misalnya:

```text
Ada konteks personal yang sedang memengaruhi keputusan.
Detail lengkap berada di private memory dan hanya digunakan jika tersedia serta diizinkan.
```

## Situation Record

```text
SituationRecord {
  situation
  impact_on_context
  impact_on_decision
  active_from
  last_verified
  privacy_class
  source
}
```

## Lifecycle

```text
IDENTIFY → CLASSIFY PRIVACY → STORE APPROPRIATELY → VERIFY → EXPIRE/UPDATE
```

Situation yang sudah tidak relevan harus diperbarui atau ditandai tidak aktif agar AI tidak membawa kondisi lama ke percakapan baru.

## AI Rule

AI tidak boleh menganggap setiap situation sebagai fakta permanen. Situation harus dibaca sebagai **state yang memiliki waktu dan relevansi**, lalu diverifikasi bila berpengaruh terhadap keputusan saat ini.

## Core Principle

**Pertahankan kondisi yang membuat context masuk akal, tetapi jangan mengekspos detail yang tidak perlu.**
