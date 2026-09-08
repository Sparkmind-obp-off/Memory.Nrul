# Relationship Context Model

## Purpose

Dokumen ini mendefinisikan model generic untuk menyimpan context hubungan/interaksi secara terstruktur agar AI dapat memahami continuity tanpa membutuhkan raw transcript.

Dokumen ini **tidak menyimpan detail hubungan pribadi tertentu**. Detail sensitif harus berada di private memory.

## Position in Memory.Nrul

```text
Memory.Nrul
    ↓
Personal Context
    ↓
Relationship Context
    ↓
People / Interactions / Events / Decisions / Situation
```

## Relationship Record

```text
RelationshipRecord {
  person_ref
  relationship_type
  shared_understanding
  relevant_history[]
  important_events[]
  current_situation
  decisions[]
  boundaries[]
  open_context[]
  next_actions[]
  privacy_class
  source
  confidence
  last_verified
  lifecycle_status
}
```

## Person Reference

`person_ref` sebaiknya menggunakan identifier internal atau alias ketika detail identitas tidak perlu dipublikasikan.

```text
person_ref: PRIVATE_PERSON_001
```

Public memory dapat mengetahui bahwa sebuah relationship context ada tanpa mengetahui identitas/detail sensitifnya.

## Interaction History

Simpan hanya history yang masih membantu memahami keadaan sekarang.

Contoh kategori:

- meaningful interaction
- change in relationship state
- important conversation outcome
- agreed boundary
- unresolved context

Tidak perlu menyimpan setiap interaksi sebagai raw transcript.

## Current Situation

Situation harus dianggap sebagai state yang dapat berubah, bukan fakta permanen.

```text
current_situation {
  summary
  impact
  active_from
  last_verified
}
```

## Decision & Boundary

Relationship context dapat menyimpan keputusan atau batas yang perlu dihormati dalam percakapan berikutnya.

AI tidak boleh mengubah decision/boundary lama hanya berdasarkan asumsi. Jika ada perubahan, gunakan input terbaru atau sumber yang lebih kuat.

## Privacy Routing

```text
RELATIONSHIP CONTEXT
        ↓
CLASSIFY
   ├── PUBLIC → safe abstraction only
   ├── PRIVATE → private memory
   └── RESTRICTED → protected storage
```

Sensitive relationship details must never be published to a public GitHub repository merely to make continuity easier.

## Retrieval Rule

Saat user membahas relationship topic:

1. Deteksi relationship context yang relevan.
2. Ambil public context yang aman.
3. Ambil private context hanya jika tersedia dan diizinkan.
4. Reconstruct current situation.
5. Pisahkan fakta, keputusan, asumsi, dan ketidakpastian.
6. Jangan mengarang detail yang tidak tersedia.
7. Gunakan context terbaru bila terjadi konflik.

## Core Principle

**AI perlu memahami hubungan sebagai context yang berkembang, bukan sebagai kumpulan chat mentah.**
