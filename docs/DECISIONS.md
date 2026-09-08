# Decision Log

Dokumen ini mencatat keputusan yang sudah dibuat agar AI berikutnya tidak mengusulkan ulang hal yang sudah diputuskan tanpa alasan baru.

## Decision Record Format

```text
## [YYYY-MM-DD] Decision title

- Decision:
- Context:
- Reason:
- Alternatives rejected:
- Impact:
- Status:
```

## Current Principles

### Memory.Nrul is a General Continuity Layer

- **Decision:** Memory.Nrul bukan memory khusus satu project.
- **Context:** User membutuhkan kesinambungan konteks antara percakapan dan AI yang berbeda.
- **Impact:** Struktur memory harus mencakup conversation context, shared understanding, situation, decisions, project state, history yang relevan, pending items, dan handoff.

### Project Repositories Remain Technical Source of Truth

- **Decision:** Memory.Nrul tidak menggantikan repository proyek.
- **Impact:** AI harus memeriksa state repository aktual sebelum melanjutkan implementasi.

### Privacy Boundary

- **Decision:** Detail personal/sensitif tidak disimpan mentah di repository publik.
- **Impact:** Konteks sensitif harus diringkas secara aman atau disimpan di tempat privat.
