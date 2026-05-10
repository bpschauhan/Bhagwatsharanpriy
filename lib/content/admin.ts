import type { AdminMetric, AdminSource, AuditEntry, ReviewQueueItem, RevisionEntry } from "@/types/admin";

export const adminMetrics: AdminMetric[] = [
  {
    label: "Pending review",
    value: "18",
    detail: "Verses, meanings, and relationship edits awaiting scholarly review.",
    status: "REVIEW",
  },
  {
    label: "Verified items",
    value: "142",
    detail: "Content units with source review and confidence notes.",
    status: "VERIFIED",
  },
  {
    label: "Disputed items",
    value: "3",
    detail: "Claims needing source clarification or interpretation separation.",
    status: "DISPUTED",
  },
  {
    label: "Drafts",
    value: "27",
    detail: "Contributor drafts not yet submitted to reviewers.",
    status: "DRAFT",
  },
];

export const reviewQueue: ReviewQueueItem[] = [
  {
    id: "verse-bg-2-47",
    entityType: "VERSE",
    title: "Bhagavad Gita 2.47",
    summary: "Verify Sanskrit, transliteration, word-by-word meaning, and Karma Yoga interpretation labels.",
    status: "REVIEW",
    confidenceLevel: 82,
    sourceCount: 3,
    updatedAt: "2026-05-10",
    href: "/admin/verses",
  },
  {
    id: "concept-karma",
    entityType: "CONCEPT",
    title: "Karma",
    summary: "Review practical explanation and ensure modern parallels are not presented as proof.",
    status: "REVIEW",
    confidenceLevel: 76,
    sourceCount: 2,
    updatedAt: "2026-05-09",
    href: "/admin/concepts",
  },
  {
    id: "source-shlokam",
    entityType: "SOURCE",
    title: "Shlokam.org verse reference",
    summary: "Confirm citation metadata and credibility notes for Sanskrit verification.",
    status: "DRAFT",
    confidenceLevel: 64,
    sourceCount: 1,
    updatedAt: "2026-05-08",
    href: "/admin/sources",
  },
];

export const revisions: RevisionEntry[] = [
  {
    id: "rev-7",
    version: 7,
    title: "Separated scientific parallel from philosophical meaning",
    author: "Reviewer",
    changeNote: "Moved psychology language into SCIENTIFIC_PARALLEL layer and added caution note.",
    createdAt: "2026-05-10 02:20",
  },
  {
    id: "rev-6",
    version: 6,
    title: "Added source citation",
    author: "Editor",
    changeNote: "Linked verse reference and added source locator.",
    createdAt: "2026-05-09 22:10",
  },
  {
    id: "rev-5",
    version: 5,
    title: "Initial contributor draft",
    author: "Contributor",
    changeNote: "Created layered meaning draft for review.",
    createdAt: "2026-05-09 18:32",
  },
];

export const auditEntries: AuditEntry[] = [
  {
    id: "audit-1",
    actor: "Reviewer",
    action: "SUBMITTED_FOR_REVIEW",
    entity: "Bhagavad Gita 2.47",
    message: "Submitted verse package with source and interpretation notes.",
    createdAt: "2026-05-10 02:38",
  },
  {
    id: "audit-2",
    actor: "Editor",
    action: "REVISION_CREATED",
    entity: "Karma",
    message: "Updated concept explanation and relationship summary.",
    createdAt: "2026-05-10 01:16",
  },
  {
    id: "audit-3",
    actor: "Reviewer",
    action: "DISPUTED",
    entity: "Modern analysis note",
    message: "Flagged a science claim that needs softer language and source support.",
    createdAt: "2026-05-09 21:04",
  },
];

export const adminSources: AdminSource[] = [
  {
    id: "source-scripture",
    title: "Bhagavad Gita",
    author: "Traditional Sanskrit recension",
    sourceType: "SCRIPTURE",
    citation: "Bhagavad Gita, traditional Sanskrit recension.",
    credibilityScore: 95,
    status: "VERIFIED",
  },
  {
    id: "source-commentary",
    title: "Traditional Karma Yoga orientation",
    author: "Editorial summary",
    sourceType: "COMMENTARY",
    citation: "Internal study note summarizing broad Karma Yoga readings.",
    credibilityScore: 72,
    status: "REVIEW",
  },
  {
    id: "source-modern",
    title: "Emotion regulation parallel",
    sourceType: "MODERN_ANALYSIS",
    citation: "Used only as a cautious parallel, not as proof of scripture.",
    credibilityScore: 61,
    status: "REVIEW",
  },
];
