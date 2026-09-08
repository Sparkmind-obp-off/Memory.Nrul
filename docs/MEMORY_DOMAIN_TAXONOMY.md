# Memory Domain Taxonomy

## Purpose

Memory.Nrul bukan aplikasi memory untuk satu jenis topik saja. Ia membutuhkan taxonomy agar context dari berbagai area dapat dipisahkan, dicari, dan digabung kembali sesuai kebutuhan sesi.

## Recommended Domain Model

```text
MEMORY.NRUL
│
├── Conversation Context
├── Personal Context
├── Relationship Context
├── Project Context
├── Decision Context
├── Situation Context
├── History / Timeline
├── Preferences / Constraints
├── Tasks / Pending
└── Session Handoff
```

## Personal Context

Mencakup context tentang user yang materially memengaruhi continuity, misalnya pola kerja, tujuan, preferensi, kondisi yang relevan, atau cara user ingin AI memahami dirinya.

Detail sensitif tidak otomatis menjadi public memory.

## Relationship Context

Mencakup context tentang hubungan/interaksi dengan orang lain ketika context tersebut memang diperlukan untuk memahami percakapan.

Relationship context dapat memiliki subdomain:

```text
Relationship
├── People / Entities
├── Interaction History
├── Shared Understanding
├── Important Events
├── Decisions / Boundaries
├── Current Situation
└── Open / Pending Context
```

Nama atau detail orang tertentu harus mengikuti privacy classification. Jangan mempublikasikan detail hubungan sensitif hanya untuk membuat AI lebih mudah memahami context.

## Topic Context

Topic bukan domain utama memory. Topic adalah label/routing signal yang membantu memilih context yang relevan.

Contoh:

```text
Topic: relationship
Topic: project
Topic: business
Topic: family
Topic: work
Topic: personal-growth
```

Satu memory record dapat memiliki beberapa topic.

## Context Graph

Memory sebaiknya dipahami sebagai hubungan antar-context, bukan sekadar folder:

```text
USER
  ↓
PERSONAL CONTEXT
  ↓
SITUATION
  ↓
RELATIONSHIP / PROJECT / TOPIC
  ↓
DECISIONS
  ↓
CURRENT STATE
  ↓
PENDING / NEXT
```

## App Category Recommendation

Jika Memory.Nrul nantinya diwujudkan sebagai aplikasi, kategori yang paling tepat adalah:

**AI Memory & Context Continuity Platform**

Subkategori yang relevan:

- Personal AI Memory
- Conversation Continuity
- Context Management
- Relationship Context Management
- Personal Knowledge / Context Graph

Ini lebih tepat daripada menganggapnya sekadar CRUD app, notes app, atau fullstack app generik.

## Technical Shape

Secara implementasi, Memory.Nrul tetap dapat berupa full-stack web app/API karena membutuhkan storage, authentication/authorization, search, privacy routing, dan context retrieval.

Namun **full-stack adalah bentuk teknisnya, bukan kategori produknya**.

```text
PRODUCT CATEGORY
AI Memory & Context Continuity

        ↓
DOMAIN MODEL
Personal / Relationship / Project / Conversation Context

        ↓
TECHNICAL FORM
Full-stack Web App + API + Storage + Retrieval
```

## Core Principle

**Domain menentukan apa yang diingat; architecture menentukan bagaimana memory disimpan dan diambil.**
