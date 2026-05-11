-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "MeaningLayerType" AS ENUM ('SIMPLE', 'BEGINNER', 'DEEP', 'PRACTICAL', 'PHILOSOPHICAL', 'SCIENTIFIC_PARALLEL');

-- CreateEnum
CREATE TYPE "CommentaryLayerType" AS ENUM ('TEXTUAL', 'PHILOLOGICAL', 'PHILOSOPHICAL', 'DEVOTIONAL', 'PRACTICAL', 'HISTORICAL', 'COMPARATIVE');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('SCRIPTURE', 'COMMENTARY', 'TRANSLATION', 'REFERENCE', 'SCHOLARLY', 'HISTORICAL', 'MODERN_ANALYSIS');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EDITOR', 'REVIEWER', 'CONTRIBUTOR');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('DRAFT', 'REVIEW', 'VERIFIED', 'DISPUTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ContentEntityType" AS ENUM ('BOOK', 'CHAPTER', 'VERSE', 'MEANING_LAYER', 'CONCEPT', 'COMMENTARY', 'SOURCE', 'KNOWLEDGE_NODE', 'KNOWLEDGE_EDGE', 'RELATED_CONCEPT', 'COMMENTARY_LAYER', 'CITATION', 'CANONICAL_REFERENCE', 'SCRIPTURE_RELATIONSHIP', 'CONCEPT_DEFINITION', 'CONCEPT_TRADITION_VIEW', 'CONCEPT_MISCONCEPTION', 'CONCEPT_PRACTICE', 'CONCEPT_EVOLUTION', 'CONCEPT_SEMANTIC_NEIGHBOR', 'LEARNING_PATH', 'LEARNING_PATH_STEP');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATED', 'UPDATED', 'SUBMITTED_FOR_REVIEW', 'APPROVED', 'DISPUTED', 'ARCHIVED', 'REVISION_CREATED', 'ROLLBACK_REQUESTED');

-- CreateEnum
CREATE TYPE "KnowledgeNodeType" AS ENUM ('TRADITION', 'SCRIPTURE', 'BOOK', 'CHAPTER', 'CONCEPT', 'PHILOSOPHY_SCHOOL', 'PRACTICE', 'COMMENTARY');

-- CreateEnum
CREATE TYPE "KnowledgeRelationshipType" AS ENUM ('BELONGS_TO', 'INFLUENCED', 'RELATED_TO', 'EXPLAINS', 'COMMENTARY_ON', 'DERIVED_FROM', 'EXPANDS_UPON', 'REFERENCES', 'PHILOSOPHICALLY_SIMILAR', 'PHILOSOPHICALLY_OPPOSED', 'PRACTICAL_PARALLEL', 'CONTEXTUALIZES');

-- CreateEnum
CREATE TYPE "ScriptureRelationshipType" AS ENUM ('EXPANDS_UPON', 'REFERENCES', 'PHILOSOPHICALLY_SIMILAR', 'PHILOSOPHICALLY_OPPOSED', 'DERIVED_FROM', 'COMMENTARY_ON', 'PRACTICAL_PARALLEL', 'CONTEXTUALIZES');

-- CreateEnum
CREATE TYPE "CitationRole" AS ENUM ('PRIMARY_TEXT', 'TRANSLATION', 'COMMENTARY', 'CROSS_REFERENCE', 'SCHOLARLY_SUPPORT', 'HISTORICAL_CONTEXT', 'REVIEW_NOTE');

-- CreateEnum
CREATE TYPE "LearningPathKind" AS ENUM ('BEGINNER', 'KARMA_YOGA', 'BHAKTI', 'MEDITATION', 'VEDANTA', 'PEACE_GUIDANCE', 'DHARMA');

-- CreateEnum
CREATE TYPE "LearningStepKind" AS ENUM ('SCRIPTURE_READING', 'CONCEPT_STUDY', 'COMMENTARY_COMPARISON', 'PRACTICE_REFLECTION', 'CROSS_REFERENCE', 'REVIEW_PAUSE');

-- CreateTable
CREATE TABLE "WisdomText" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tradition" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WisdomText_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "wisdomTextId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shloka" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "sanskrit" TEXT NOT NULL,
    "transliteration" TEXT NOT NULL,
    "wordMeaning" TEXT NOT NULL,
    "essence" TEXT NOT NULL,
    "reflection" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shloka_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "tradition" TEXT NOT NULL,
    "difficulty" "DifficultyLevel" NOT NULL DEFAULT 'BEGINNER',
    "summary" TEXT NOT NULL,
    "beginnerSummary" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'DRAFT',
    "confidenceLevel" INTEGER NOT NULL DEFAULT 0,
    "interpretationLabel" TEXT,
    "reviewNotes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'DRAFT',
    "confidenceLevel" INTEGER NOT NULL DEFAULT 0,
    "interpretationLabel" TEXT,
    "reviewNotes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verse" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "sanskrit" TEXT NOT NULL,
    "transliteration" TEXT NOT NULL,
    "wordByWord" TEXT NOT NULL,
    "practicalApplication" TEXT NOT NULL,
    "philosophyInsight" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'DRAFT',
    "confidenceLevel" INTEGER NOT NULL DEFAULT 0,
    "interpretationLabel" TEXT,
    "reviewNotes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Verse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeaningLayer" (
    "id" TEXT NOT NULL,
    "verseId" TEXT NOT NULL,
    "type" "MeaningLayerType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'DRAFT',
    "confidenceLevel" INTEGER NOT NULL DEFAULT 0,
    "interpretationLabel" TEXT,
    "reviewNotes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MeaningLayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Concept" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'DRAFT',
    "confidenceLevel" INTEGER NOT NULL DEFAULT 0,
    "interpretationLabel" TEXT,
    "reviewNotes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Concept_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerseConcept" (
    "verseId" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "relevance" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "VerseConcept_pkey" PRIMARY KEY ("verseId","conceptId")
);

-- CreateTable
CREATE TABLE "Commentary" (
    "id" TEXT NOT NULL,
    "verseId" TEXT NOT NULL,
    "sourceId" TEXT,
    "traditionId" TEXT,
    "schoolId" TEXT,
    "author" TEXT NOT NULL,
    "tradition" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "interpretationNote" TEXT NOT NULL,
    "layerType" "CommentaryLayerType" NOT NULL DEFAULT 'PHILOSOPHICAL',
    "language" TEXT,
    "historicalPeriod" TEXT,
    "sourceLocator" TEXT,
    "attributionNote" TEXT,
    "order" INTEGER NOT NULL,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'DRAFT',
    "confidenceLevel" INTEGER NOT NULL DEFAULT 0,
    "interpretationLabel" TEXT,
    "reviewNotes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Commentary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentaryLayer" (
    "id" TEXT NOT NULL,
    "commentaryId" TEXT NOT NULL,
    "type" "CommentaryLayerType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'DRAFT',
    "confidenceLevel" INTEGER NOT NULL DEFAULT 0,
    "interpretationLabel" TEXT,
    "reviewNotes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommentaryLayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "translator" TEXT,
    "publisher" TEXT,
    "url" TEXT,
    "sourceType" "SourceType" NOT NULL,
    "citation" TEXT NOT NULL,
    "publication" TEXT,
    "language" TEXT,
    "edition" TEXT,
    "historicalDate" TEXT,
    "provenanceNote" TEXT,
    "notes" TEXT,
    "credibilitySummary" TEXT,
    "credibilityScore" INTEGER NOT NULL DEFAULT 0,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'DRAFT',
    "confidenceLevel" INTEGER NOT NULL DEFAULT 0,
    "reviewNotes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerseSource" (
    "verseId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "locator" TEXT NOT NULL,
    "note" TEXT,

    CONSTRAINT "VerseSource_pkey" PRIMARY KEY ("verseId","sourceId")
);

-- CreateTable
CREATE TABLE "Tradition" (
    "id" TEXT NOT NULL,
    "parentId" TEXT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "scopeNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tradition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhilosophySchool" (
    "id" TEXT NOT NULL,
    "traditionId" TEXT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "coreClaim" TEXT,
    "cautionNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhilosophySchool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeNode" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "summary" TEXT NOT NULL,
    "nodeType" "KnowledgeNodeType" NOT NULL,
    "traditionId" TEXT,
    "schoolId" TEXT,
    "conceptId" TEXT,
    "bookId" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'DRAFT',
    "confidenceLevel" INTEGER NOT NULL DEFAULT 0,
    "interpretationLabel" TEXT,
    "reviewNotes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeEdge" (
    "id" TEXT NOT NULL,
    "sourceNodeId" TEXT NOT NULL,
    "targetNodeId" TEXT NOT NULL,
    "relationshipType" "KnowledgeRelationshipType" NOT NULL,
    "label" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "explanation" TEXT,
    "traditionId" TEXT,
    "schoolId" TEXT,
    "bidirectional" BOOLEAN NOT NULL DEFAULT false,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'DRAFT',
    "confidenceLevel" INTEGER NOT NULL DEFAULT 0,
    "interpretationLabel" TEXT,
    "reviewNotes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeEdge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelatedConcept" (
    "id" TEXT NOT NULL,
    "fromConceptId" TEXT NOT NULL,
    "toConceptId" TEXT NOT NULL,
    "relationshipType" "KnowledgeRelationshipType" NOT NULL,
    "label" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "explanation" TEXT,
    "traditionId" TEXT,
    "schoolId" TEXT,
    "bidirectional" BOOLEAN NOT NULL DEFAULT true,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'DRAFT',
    "confidenceLevel" INTEGER NOT NULL DEFAULT 0,
    "interpretationLabel" TEXT,
    "reviewNotes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RelatedConcept_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CanonicalReference" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "textTitle" TEXT NOT NULL,
    "bookId" TEXT,
    "traditionId" TEXT,
    "sourceId" TEXT,
    "sectionLabel" TEXT,
    "chapterNumber" INTEGER,
    "verseNumber" INTEGER,
    "locator" TEXT,
    "excerpt" TEXT,
    "note" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'DRAFT',
    "confidenceLevel" INTEGER NOT NULL DEFAULT 0,
    "reviewNotes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CanonicalReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScriptureRelationship" (
    "id" TEXT NOT NULL,
    "verseId" TEXT NOT NULL,
    "targetReferenceId" TEXT NOT NULL,
    "relationshipType" "ScriptureRelationshipType" NOT NULL,
    "label" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "philosophicalContext" TEXT,
    "sourceNotes" TEXT,
    "traditionId" TEXT,
    "schoolId" TEXT,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'DRAFT',
    "confidenceLevel" INTEGER NOT NULL DEFAULT 0,
    "interpretationLabel" TEXT,
    "reviewNotes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScriptureRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Citation" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT,
    "entityType" "ContentEntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "role" "CitationRole" NOT NULL,
    "locator" TEXT,
    "quotedText" TEXT,
    "contextNote" TEXT,
    "provenanceNote" TEXT,
    "verseId" TEXT,
    "commentaryId" TEXT,
    "commentaryLayerId" TEXT,
    "canonicalReferenceId" TEXT,
    "scriptureRelationshipId" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'DRAFT',
    "confidenceLevel" INTEGER NOT NULL DEFAULT 0,
    "reviewNotes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Citation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConceptDefinition" (
    "id" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "traditionId" TEXT,
    "schoolId" TEXT,
    "title" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "sourceLabel" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'DRAFT',
    "confidenceLevel" INTEGER NOT NULL DEFAULT 0,
    "interpretationLabel" TEXT,
    "reviewNotes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConceptDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConceptTraditionView" (
    "id" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "traditionId" TEXT,
    "schoolId" TEXT,
    "title" TEXT NOT NULL,
    "positionSummary" TEXT NOT NULL,
    "nuance" TEXT NOT NULL,
    "differsFrom" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'DRAFT',
    "confidenceLevel" INTEGER NOT NULL DEFAULT 0,
    "interpretationLabel" TEXT,
    "reviewNotes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConceptTraditionView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConceptMisconception" (
    "id" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "correction" TEXT NOT NULL,
    "whyItMatters" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'DRAFT',
    "confidenceLevel" INTEGER NOT NULL DEFAULT 0,
    "reviewNotes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConceptMisconception_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConceptPractice" (
    "id" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "caution" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'DRAFT',
    "confidenceLevel" INTEGER NOT NULL DEFAULT 0,
    "reviewNotes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConceptPractice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConceptEvolution" (
    "id" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'DRAFT',
    "confidenceLevel" INTEGER NOT NULL DEFAULT 0,
    "reviewNotes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConceptEvolution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConceptSemanticNeighbor" (
    "id" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "relatedConceptId" TEXT,
    "label" TEXT NOT NULL,
    "relationshipType" "KnowledgeRelationshipType" NOT NULL,
    "explanation" TEXT NOT NULL,
    "caution" TEXT,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'DRAFT',
    "confidenceLevel" INTEGER NOT NULL DEFAULT 0,
    "reviewNotes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConceptSemanticNeighbor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningPath" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "kind" "LearningPathKind" NOT NULL,
    "difficulty" "DifficultyLevel" NOT NULL DEFAULT 'BEGINNER',
    "traditionId" TEXT,
    "schoolId" TEXT,
    "guidanceNote" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'DRAFT',
    "confidenceLevel" INTEGER NOT NULL DEFAULT 0,
    "reviewNotes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningPath_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningPathStep" (
    "id" TEXT NOT NULL,
    "learningPathId" TEXT NOT NULL,
    "kind" "LearningStepKind" NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "contemplationPrompt" TEXT,
    "practiceNote" TEXT,
    "order" INTEGER NOT NULL,
    "verseId" TEXT,
    "conceptId" TEXT,
    "scriptureRelationshipId" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'DRAFT',
    "confidenceLevel" INTEGER NOT NULL DEFAULT 0,
    "reviewNotes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningPathStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLearningProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "learningPathId" TEXT NOT NULL,
    "currentStepId" TEXT,
    "completedStepIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "reflectionNote" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLearningProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "name" TEXT,
    "image" TEXT,
    "passwordHash" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CONTRIBUTOR',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "Revision" (
    "id" TEXT NOT NULL,
    "entityType" "ContentEntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "snapshot" JSONB NOT NULL,
    "changeNote" TEXT,
    "authorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Revision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentReview" (
    "id" TEXT NOT NULL,
    "entityType" "ContentEntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "status" "VerificationStatus" NOT NULL DEFAULT 'REVIEW',
    "confidenceLevel" INTEGER NOT NULL DEFAULT 0,
    "reviewerId" TEXT,
    "sourceNotes" TEXT,
    "truthNotes" TEXT,
    "decisionNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" "AuditAction" NOT NULL,
    "entityType" "ContentEntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WisdomText_slug_key" ON "WisdomText"("slug");

-- CreateIndex
CREATE INDEX "Lesson_wisdomTextId_order_idx" ON "Lesson"("wisdomTextId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_wisdomTextId_slug_key" ON "Lesson"("wisdomTextId", "slug");

-- CreateIndex
CREATE INDEX "Shloka_lessonId_order_idx" ON "Shloka"("lessonId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Book_slug_key" ON "Book"("slug");

-- CreateIndex
CREATE INDEX "Book_status_difficulty_idx" ON "Book"("status", "difficulty");

-- CreateIndex
CREATE INDEX "Book_verificationStatus_confidenceLevel_idx" ON "Book"("verificationStatus", "confidenceLevel");

-- CreateIndex
CREATE INDEX "Book_tradition_idx" ON "Book"("tradition");

-- CreateIndex
CREATE INDEX "Chapter_bookId_number_idx" ON "Chapter"("bookId", "number");

-- CreateIndex
CREATE INDEX "Chapter_verificationStatus_idx" ON "Chapter"("verificationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_bookId_number_key" ON "Chapter"("bookId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_bookId_slug_key" ON "Chapter"("bookId", "slug");

-- CreateIndex
CREATE INDEX "Verse_chapterId_number_idx" ON "Verse"("chapterId", "number");

-- CreateIndex
CREATE INDEX "Verse_status_idx" ON "Verse"("status");

-- CreateIndex
CREATE INDEX "Verse_verificationStatus_confidenceLevel_idx" ON "Verse"("verificationStatus", "confidenceLevel");

-- CreateIndex
CREATE UNIQUE INDEX "Verse_chapterId_number_key" ON "Verse"("chapterId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Verse_chapterId_slug_key" ON "Verse"("chapterId", "slug");

-- CreateIndex
CREATE INDEX "MeaningLayer_verseId_order_idx" ON "MeaningLayer"("verseId", "order");

-- CreateIndex
CREATE INDEX "MeaningLayer_type_idx" ON "MeaningLayer"("type");

-- CreateIndex
CREATE INDEX "MeaningLayer_verificationStatus_idx" ON "MeaningLayer"("verificationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "MeaningLayer_verseId_type_key" ON "MeaningLayer"("verseId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Concept_slug_key" ON "Concept"("slug");

-- CreateIndex
CREATE INDEX "Concept_category_idx" ON "Concept"("category");

-- CreateIndex
CREATE INDEX "Concept_verificationStatus_confidenceLevel_idx" ON "Concept"("verificationStatus", "confidenceLevel");

-- CreateIndex
CREATE INDEX "VerseConcept_conceptId_idx" ON "VerseConcept"("conceptId");

-- CreateIndex
CREATE INDEX "VerseConcept_verseId_order_idx" ON "VerseConcept"("verseId", "order");

-- CreateIndex
CREATE INDEX "Commentary_verseId_order_idx" ON "Commentary"("verseId", "order");

-- CreateIndex
CREATE INDEX "Commentary_sourceId_idx" ON "Commentary"("sourceId");

-- CreateIndex
CREATE INDEX "Commentary_traditionId_idx" ON "Commentary"("traditionId");

-- CreateIndex
CREATE INDEX "Commentary_schoolId_idx" ON "Commentary"("schoolId");

-- CreateIndex
CREATE INDEX "Commentary_tradition_idx" ON "Commentary"("tradition");

-- CreateIndex
CREATE INDEX "Commentary_verificationStatus_idx" ON "Commentary"("verificationStatus");

-- CreateIndex
CREATE INDEX "CommentaryLayer_commentaryId_order_idx" ON "CommentaryLayer"("commentaryId", "order");

-- CreateIndex
CREATE INDEX "CommentaryLayer_type_idx" ON "CommentaryLayer"("type");

-- CreateIndex
CREATE INDEX "CommentaryLayer_verificationStatus_idx" ON "CommentaryLayer"("verificationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "CommentaryLayer_commentaryId_type_order_key" ON "CommentaryLayer"("commentaryId", "type", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Source_slug_key" ON "Source"("slug");

-- CreateIndex
CREATE INDEX "Source_sourceType_idx" ON "Source"("sourceType");

-- CreateIndex
CREATE INDEX "Source_verificationStatus_credibilityScore_idx" ON "Source"("verificationStatus", "credibilityScore");

-- CreateIndex
CREATE INDEX "VerseSource_sourceId_idx" ON "VerseSource"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Tradition_slug_key" ON "Tradition"("slug");

-- CreateIndex
CREATE INDEX "Tradition_parentId_idx" ON "Tradition"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "PhilosophySchool_slug_key" ON "PhilosophySchool"("slug");

-- CreateIndex
CREATE INDEX "PhilosophySchool_traditionId_idx" ON "PhilosophySchool"("traditionId");

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeNode_slug_key" ON "KnowledgeNode"("slug");

-- CreateIndex
CREATE INDEX "KnowledgeNode_nodeType_idx" ON "KnowledgeNode"("nodeType");

-- CreateIndex
CREATE INDEX "KnowledgeNode_traditionId_idx" ON "KnowledgeNode"("traditionId");

-- CreateIndex
CREATE INDEX "KnowledgeNode_schoolId_idx" ON "KnowledgeNode"("schoolId");

-- CreateIndex
CREATE INDEX "KnowledgeNode_conceptId_idx" ON "KnowledgeNode"("conceptId");

-- CreateIndex
CREATE INDEX "KnowledgeNode_bookId_idx" ON "KnowledgeNode"("bookId");

-- CreateIndex
CREATE INDEX "KnowledgeNode_verificationStatus_idx" ON "KnowledgeNode"("verificationStatus");

-- CreateIndex
CREATE INDEX "KnowledgeEdge_targetNodeId_idx" ON "KnowledgeEdge"("targetNodeId");

-- CreateIndex
CREATE INDEX "KnowledgeEdge_relationshipType_idx" ON "KnowledgeEdge"("relationshipType");

-- CreateIndex
CREATE INDEX "KnowledgeEdge_traditionId_idx" ON "KnowledgeEdge"("traditionId");

-- CreateIndex
CREATE INDEX "KnowledgeEdge_schoolId_idx" ON "KnowledgeEdge"("schoolId");

-- CreateIndex
CREATE INDEX "KnowledgeEdge_sourceNodeId_weight_idx" ON "KnowledgeEdge"("sourceNodeId", "weight");

-- CreateIndex
CREATE INDEX "KnowledgeEdge_verificationStatus_idx" ON "KnowledgeEdge"("verificationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeEdge_sourceNodeId_targetNodeId_relationshipType_key" ON "KnowledgeEdge"("sourceNodeId", "targetNodeId", "relationshipType");

-- CreateIndex
CREATE INDEX "RelatedConcept_toConceptId_idx" ON "RelatedConcept"("toConceptId");

-- CreateIndex
CREATE INDEX "RelatedConcept_relationshipType_idx" ON "RelatedConcept"("relationshipType");

-- CreateIndex
CREATE INDEX "RelatedConcept_traditionId_idx" ON "RelatedConcept"("traditionId");

-- CreateIndex
CREATE INDEX "RelatedConcept_schoolId_idx" ON "RelatedConcept"("schoolId");

-- CreateIndex
CREATE INDEX "RelatedConcept_verificationStatus_idx" ON "RelatedConcept"("verificationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "RelatedConcept_fromConceptId_toConceptId_relationshipType_key" ON "RelatedConcept"("fromConceptId", "toConceptId", "relationshipType");

-- CreateIndex
CREATE UNIQUE INDEX "CanonicalReference_slug_key" ON "CanonicalReference"("slug");

-- CreateIndex
CREATE INDEX "CanonicalReference_textTitle_idx" ON "CanonicalReference"("textTitle");

-- CreateIndex
CREATE INDEX "CanonicalReference_bookId_idx" ON "CanonicalReference"("bookId");

-- CreateIndex
CREATE INDEX "CanonicalReference_traditionId_idx" ON "CanonicalReference"("traditionId");

-- CreateIndex
CREATE INDEX "CanonicalReference_sourceId_idx" ON "CanonicalReference"("sourceId");

-- CreateIndex
CREATE INDEX "CanonicalReference_verificationStatus_idx" ON "CanonicalReference"("verificationStatus");

-- CreateIndex
CREATE INDEX "ScriptureRelationship_targetReferenceId_idx" ON "ScriptureRelationship"("targetReferenceId");

-- CreateIndex
CREATE INDEX "ScriptureRelationship_relationshipType_idx" ON "ScriptureRelationship"("relationshipType");

-- CreateIndex
CREATE INDEX "ScriptureRelationship_traditionId_idx" ON "ScriptureRelationship"("traditionId");

-- CreateIndex
CREATE INDEX "ScriptureRelationship_schoolId_idx" ON "ScriptureRelationship"("schoolId");

-- CreateIndex
CREATE INDEX "ScriptureRelationship_verificationStatus_idx" ON "ScriptureRelationship"("verificationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "ScriptureRelationship_verseId_targetReferenceId_relationshi_key" ON "ScriptureRelationship"("verseId", "targetReferenceId", "relationshipType");

-- CreateIndex
CREATE INDEX "Citation_entityType_entityId_idx" ON "Citation"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "Citation_sourceId_idx" ON "Citation"("sourceId");

-- CreateIndex
CREATE INDEX "Citation_role_idx" ON "Citation"("role");

-- CreateIndex
CREATE INDEX "Citation_verseId_idx" ON "Citation"("verseId");

-- CreateIndex
CREATE INDEX "Citation_commentaryId_idx" ON "Citation"("commentaryId");

-- CreateIndex
CREATE INDEX "Citation_commentaryLayerId_idx" ON "Citation"("commentaryLayerId");

-- CreateIndex
CREATE INDEX "Citation_canonicalReferenceId_idx" ON "Citation"("canonicalReferenceId");

-- CreateIndex
CREATE INDEX "Citation_scriptureRelationshipId_idx" ON "Citation"("scriptureRelationshipId");

-- CreateIndex
CREATE INDEX "Citation_verificationStatus_idx" ON "Citation"("verificationStatus");

-- CreateIndex
CREATE INDEX "ConceptDefinition_conceptId_order_idx" ON "ConceptDefinition"("conceptId", "order");

-- CreateIndex
CREATE INDEX "ConceptDefinition_traditionId_idx" ON "ConceptDefinition"("traditionId");

-- CreateIndex
CREATE INDEX "ConceptDefinition_schoolId_idx" ON "ConceptDefinition"("schoolId");

-- CreateIndex
CREATE INDEX "ConceptDefinition_verificationStatus_idx" ON "ConceptDefinition"("verificationStatus");

-- CreateIndex
CREATE INDEX "ConceptTraditionView_conceptId_order_idx" ON "ConceptTraditionView"("conceptId", "order");

-- CreateIndex
CREATE INDEX "ConceptTraditionView_traditionId_idx" ON "ConceptTraditionView"("traditionId");

-- CreateIndex
CREATE INDEX "ConceptTraditionView_schoolId_idx" ON "ConceptTraditionView"("schoolId");

-- CreateIndex
CREATE INDEX "ConceptTraditionView_verificationStatus_idx" ON "ConceptTraditionView"("verificationStatus");

-- CreateIndex
CREATE INDEX "ConceptMisconception_conceptId_order_idx" ON "ConceptMisconception"("conceptId", "order");

-- CreateIndex
CREATE INDEX "ConceptMisconception_verificationStatus_idx" ON "ConceptMisconception"("verificationStatus");

-- CreateIndex
CREATE INDEX "ConceptPractice_conceptId_order_idx" ON "ConceptPractice"("conceptId", "order");

-- CreateIndex
CREATE INDEX "ConceptPractice_verificationStatus_idx" ON "ConceptPractice"("verificationStatus");

-- CreateIndex
CREATE INDEX "ConceptEvolution_conceptId_order_idx" ON "ConceptEvolution"("conceptId", "order");

-- CreateIndex
CREATE INDEX "ConceptEvolution_verificationStatus_idx" ON "ConceptEvolution"("verificationStatus");

-- CreateIndex
CREATE INDEX "ConceptSemanticNeighbor_conceptId_weight_idx" ON "ConceptSemanticNeighbor"("conceptId", "weight");

-- CreateIndex
CREATE INDEX "ConceptSemanticNeighbor_relatedConceptId_idx" ON "ConceptSemanticNeighbor"("relatedConceptId");

-- CreateIndex
CREATE INDEX "ConceptSemanticNeighbor_relationshipType_idx" ON "ConceptSemanticNeighbor"("relationshipType");

-- CreateIndex
CREATE INDEX "ConceptSemanticNeighbor_verificationStatus_idx" ON "ConceptSemanticNeighbor"("verificationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "LearningPath_slug_key" ON "LearningPath"("slug");

-- CreateIndex
CREATE INDEX "LearningPath_kind_difficulty_idx" ON "LearningPath"("kind", "difficulty");

-- CreateIndex
CREATE INDEX "LearningPath_traditionId_idx" ON "LearningPath"("traditionId");

-- CreateIndex
CREATE INDEX "LearningPath_schoolId_idx" ON "LearningPath"("schoolId");

-- CreateIndex
CREATE INDEX "LearningPath_status_idx" ON "LearningPath"("status");

-- CreateIndex
CREATE INDEX "LearningPath_verificationStatus_idx" ON "LearningPath"("verificationStatus");

-- CreateIndex
CREATE INDEX "LearningPathStep_kind_idx" ON "LearningPathStep"("kind");

-- CreateIndex
CREATE INDEX "LearningPathStep_verseId_idx" ON "LearningPathStep"("verseId");

-- CreateIndex
CREATE INDEX "LearningPathStep_conceptId_idx" ON "LearningPathStep"("conceptId");

-- CreateIndex
CREATE INDEX "LearningPathStep_scriptureRelationshipId_idx" ON "LearningPathStep"("scriptureRelationshipId");

-- CreateIndex
CREATE INDEX "LearningPathStep_verificationStatus_idx" ON "LearningPathStep"("verificationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "LearningPathStep_learningPathId_order_key" ON "LearningPathStep"("learningPathId", "order");

-- CreateIndex
CREATE INDEX "UserLearningProgress_learningPathId_idx" ON "UserLearningProgress"("learningPathId");

-- CreateIndex
CREATE INDEX "UserLearningProgress_currentStepId_idx" ON "UserLearningProgress"("currentStepId");

-- CreateIndex
CREATE UNIQUE INDEX "UserLearningProgress_userId_learningPathId_key" ON "UserLearningProgress"("userId", "learningPathId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_active_idx" ON "User"("role", "active");

-- CreateIndex
CREATE INDEX "User_email_active_idx" ON "User"("email", "active");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Revision_entityType_entityId_createdAt_idx" ON "Revision"("entityType", "entityId", "createdAt");

-- CreateIndex
CREATE INDEX "Revision_authorId_idx" ON "Revision"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Revision_entityType_entityId_version_key" ON "Revision"("entityType", "entityId", "version");

-- CreateIndex
CREATE INDEX "ContentReview_entityType_entityId_idx" ON "ContentReview"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "ContentReview_status_confidenceLevel_idx" ON "ContentReview"("status", "confidenceLevel");

-- CreateIndex
CREATE INDEX "ContentReview_reviewerId_idx" ON "ContentReview"("reviewerId");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_createdAt_idx" ON "AuditLog"("entityType", "entityId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_createdAt_idx" ON "AuditLog"("actorId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_wisdomTextId_fkey" FOREIGN KEY ("wisdomTextId") REFERENCES "WisdomText"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shloka" ADD CONSTRAINT "Shloka_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verse" ADD CONSTRAINT "Verse_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeaningLayer" ADD CONSTRAINT "MeaningLayer_verseId_fkey" FOREIGN KEY ("verseId") REFERENCES "Verse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerseConcept" ADD CONSTRAINT "VerseConcept_verseId_fkey" FOREIGN KEY ("verseId") REFERENCES "Verse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerseConcept" ADD CONSTRAINT "VerseConcept_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commentary" ADD CONSTRAINT "Commentary_verseId_fkey" FOREIGN KEY ("verseId") REFERENCES "Verse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commentary" ADD CONSTRAINT "Commentary_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commentary" ADD CONSTRAINT "Commentary_traditionId_fkey" FOREIGN KEY ("traditionId") REFERENCES "Tradition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commentary" ADD CONSTRAINT "Commentary_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "PhilosophySchool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentaryLayer" ADD CONSTRAINT "CommentaryLayer_commentaryId_fkey" FOREIGN KEY ("commentaryId") REFERENCES "Commentary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerseSource" ADD CONSTRAINT "VerseSource_verseId_fkey" FOREIGN KEY ("verseId") REFERENCES "Verse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerseSource" ADD CONSTRAINT "VerseSource_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tradition" ADD CONSTRAINT "Tradition_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Tradition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhilosophySchool" ADD CONSTRAINT "PhilosophySchool_traditionId_fkey" FOREIGN KEY ("traditionId") REFERENCES "Tradition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeNode" ADD CONSTRAINT "KnowledgeNode_traditionId_fkey" FOREIGN KEY ("traditionId") REFERENCES "Tradition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeNode" ADD CONSTRAINT "KnowledgeNode_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "PhilosophySchool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeNode" ADD CONSTRAINT "KnowledgeNode_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeNode" ADD CONSTRAINT "KnowledgeNode_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeEdge" ADD CONSTRAINT "KnowledgeEdge_sourceNodeId_fkey" FOREIGN KEY ("sourceNodeId") REFERENCES "KnowledgeNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeEdge" ADD CONSTRAINT "KnowledgeEdge_targetNodeId_fkey" FOREIGN KEY ("targetNodeId") REFERENCES "KnowledgeNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeEdge" ADD CONSTRAINT "KnowledgeEdge_traditionId_fkey" FOREIGN KEY ("traditionId") REFERENCES "Tradition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeEdge" ADD CONSTRAINT "KnowledgeEdge_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "PhilosophySchool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelatedConcept" ADD CONSTRAINT "RelatedConcept_fromConceptId_fkey" FOREIGN KEY ("fromConceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelatedConcept" ADD CONSTRAINT "RelatedConcept_toConceptId_fkey" FOREIGN KEY ("toConceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelatedConcept" ADD CONSTRAINT "RelatedConcept_traditionId_fkey" FOREIGN KEY ("traditionId") REFERENCES "Tradition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelatedConcept" ADD CONSTRAINT "RelatedConcept_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "PhilosophySchool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanonicalReference" ADD CONSTRAINT "CanonicalReference_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanonicalReference" ADD CONSTRAINT "CanonicalReference_traditionId_fkey" FOREIGN KEY ("traditionId") REFERENCES "Tradition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanonicalReference" ADD CONSTRAINT "CanonicalReference_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScriptureRelationship" ADD CONSTRAINT "ScriptureRelationship_verseId_fkey" FOREIGN KEY ("verseId") REFERENCES "Verse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScriptureRelationship" ADD CONSTRAINT "ScriptureRelationship_targetReferenceId_fkey" FOREIGN KEY ("targetReferenceId") REFERENCES "CanonicalReference"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScriptureRelationship" ADD CONSTRAINT "ScriptureRelationship_traditionId_fkey" FOREIGN KEY ("traditionId") REFERENCES "Tradition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScriptureRelationship" ADD CONSTRAINT "ScriptureRelationship_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "PhilosophySchool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citation" ADD CONSTRAINT "Citation_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citation" ADD CONSTRAINT "Citation_verseId_fkey" FOREIGN KEY ("verseId") REFERENCES "Verse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citation" ADD CONSTRAINT "Citation_commentaryId_fkey" FOREIGN KEY ("commentaryId") REFERENCES "Commentary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citation" ADD CONSTRAINT "Citation_commentaryLayerId_fkey" FOREIGN KEY ("commentaryLayerId") REFERENCES "CommentaryLayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citation" ADD CONSTRAINT "Citation_canonicalReferenceId_fkey" FOREIGN KEY ("canonicalReferenceId") REFERENCES "CanonicalReference"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citation" ADD CONSTRAINT "Citation_scriptureRelationshipId_fkey" FOREIGN KEY ("scriptureRelationshipId") REFERENCES "ScriptureRelationship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptDefinition" ADD CONSTRAINT "ConceptDefinition_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptDefinition" ADD CONSTRAINT "ConceptDefinition_traditionId_fkey" FOREIGN KEY ("traditionId") REFERENCES "Tradition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptDefinition" ADD CONSTRAINT "ConceptDefinition_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "PhilosophySchool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptTraditionView" ADD CONSTRAINT "ConceptTraditionView_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptTraditionView" ADD CONSTRAINT "ConceptTraditionView_traditionId_fkey" FOREIGN KEY ("traditionId") REFERENCES "Tradition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptTraditionView" ADD CONSTRAINT "ConceptTraditionView_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "PhilosophySchool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptMisconception" ADD CONSTRAINT "ConceptMisconception_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptPractice" ADD CONSTRAINT "ConceptPractice_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptEvolution" ADD CONSTRAINT "ConceptEvolution_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptSemanticNeighbor" ADD CONSTRAINT "ConceptSemanticNeighbor_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptSemanticNeighbor" ADD CONSTRAINT "ConceptSemanticNeighbor_relatedConceptId_fkey" FOREIGN KEY ("relatedConceptId") REFERENCES "Concept"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningPath" ADD CONSTRAINT "LearningPath_traditionId_fkey" FOREIGN KEY ("traditionId") REFERENCES "Tradition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningPath" ADD CONSTRAINT "LearningPath_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "PhilosophySchool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningPathStep" ADD CONSTRAINT "LearningPathStep_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "LearningPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningPathStep" ADD CONSTRAINT "LearningPathStep_verseId_fkey" FOREIGN KEY ("verseId") REFERENCES "Verse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningPathStep" ADD CONSTRAINT "LearningPathStep_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningPathStep" ADD CONSTRAINT "LearningPathStep_scriptureRelationshipId_fkey" FOREIGN KEY ("scriptureRelationshipId") REFERENCES "ScriptureRelationship"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLearningProgress" ADD CONSTRAINT "UserLearningProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLearningProgress" ADD CONSTRAINT "UserLearningProgress_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "LearningPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLearningProgress" ADD CONSTRAINT "UserLearningProgress_currentStepId_fkey" FOREIGN KEY ("currentStepId") REFERENCES "LearningPathStep"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revision" ADD CONSTRAINT "Revision_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentReview" ADD CONSTRAINT "ContentReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
