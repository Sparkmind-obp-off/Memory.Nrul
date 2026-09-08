# Context Reconstruction

## Purpose

Dokumen ini mendefinisikan bagaimana AI berikutnya mengubah memory menjadi pemahaman percakapan yang dapat langsung digunakan.

## Goal

AI harus dapat menjawab empat hal sebelum melanjutkan:

1. **Apa yang sedang terjadi?**
2. **Apa yang sudah dipahami bersama?**
3. **Apa yang sudah diputuskan dan mengapa?**
4. **Dari titik mana percakapan/pekerjaan harus dilanjutkan?**

## Reconstruction Pipeline

```text
MEMORY SOURCES
      ↓
RELEVANCE FILTER
      ↓
ACCESS / PRIVACY CHECK
      ↓
CONTEXT MERGE
      ↓
FACT / DECISION / ASSUMPTION SEPARATION
      ↓
CURRENT STATE CHECK
      ↓
CONTINUITY CONTEXT
      ↓
RESPOND / EXECUTE
```

## Source Order

Gunakan urutan berikut:

1. Context yang diberikan langsung pada sesi saat ini.
2. Private context yang tersedia dan memang diizinkan.
3. Public Memory.Nrul yang relevan.
4. Source of truth aktual untuk state teknis.
5. Jangan mengisi kekosongan dengan tebakan.

## Context Categories

### FACT
Hal yang diketahui dari sumber yang tersedia.

### SHARED UNDERSTANDING
Hal yang sudah dipahami bersama dalam percakapan.

### DECISION
Hal yang sudah diputuskan user/AI beserta alasan jika relevan.

### SITUATION
Kondisi yang memengaruhi arah percakapan.

### ASSUMPTION
Hal yang belum pasti dan tidak boleh diperlakukan sebagai fakta.

### CURRENT STATE
Keadaan terakhir yang telah diverifikasi.

### PENDING
Hal yang belum selesai.

### NEXT
Langkah berikutnya yang paling relevan.

## Privacy Handling

AI harus mengetahui **bahwa sebuah context mungkin ada** tanpa otomatis mengetahui detailnya.

```text
PUBLIC CONTEXT
    ↓
SAFE TO USE

PRIVATE CONTEXT
    ↓
USE ONLY IF AUTHORIZED

RESTRICTED CONTEXT
    ↓
DO NOT EXPOSE / DO NOT GUESS
```

Jangan pernah menebak isi private context yang tidak tersedia.

## Conflict Resolution

Jika memory lama bertentangan dengan context terbaru:

```text
CURRENT VERIFIED STATE
        >
CURRENT USER INPUT
        >
RECENT RELEVANT MEMORY
        >
OLDER MEMORY
        >
ASSUMPTION
```

Untuk state teknis, source of truth aktual repository/system harus diverifikasi.

## Continuity Output

Sebelum menjawab atau mengeksekusi, AI secara internal harus memiliki representasi minimum:

```text
Current context:
Shared understanding:
Relevant situation:
Decisions:
Current state:
Pending:
Next:
Constraints:
Privacy/access notes:
```

Tidak semua field harus ditampilkan kepada user. Ini adalah internal reconstruction structure.

## Core Principle

**AI tidak perlu mengingat semua kata untuk memahami semuanya yang relevan. AI perlu mempertahankan context yang membuat percakapan dapat dilanjutkan dengan benar.**
