import type { LearningPathContent } from "@/types/learning";

export const learningPaths: LearningPathContent[] = [
  {
    slug: "beginner-gita-study",
    title: "Beginner Gita Study",
    summary: "A quiet first path through confusion, self-inquiry, action, and equanimity.",
    kind: "BEGINNER",
    difficulty: "BEGINNER",
    tradition: "Sanatana Dharma",
    guidanceNote: "Move slowly. The aim is clarity and continuity, not completion speed.",
    steps: [
      {
        kind: "SCRIPTURE_READING",
        title: "Begin with the field of dharma",
        summary: "Read Bhagavad Gita 1.1 as the opening frame: a moral field, not only a battlefield.",
        href: "/books/bhagavad-gita/chapters/1/verses/1",
        verseLabel: "Bhagavad Gita 1.1",
        contemplationPrompt: "Where does attachment shape the way a question is asked?",
      },
      {
        kind: "SCRIPTURE_READING",
        title: "Let the crisis become honest",
        summary: "Read Bhagavad Gita 1.21 and notice how direct seeing can intensify moral seriousness.",
        href: "/books/bhagavad-gita/chapters/1/verses/21",
        verseLabel: "Bhagavad Gita 1.21",
      },
      {
        kind: "CONCEPT_STUDY",
        title: "Study dharma",
        summary: "Open the concept before trying to solve Arjuna's conflict too quickly.",
        href: "/concepts/dharma",
        conceptSlug: "dharma",
      },
      {
        kind: "SCRIPTURE_READING",
        title: "Study continuity through change",
        summary: "Read Bhagavad Gita 2.13 with commentary comparison enabled.",
        href: "/books/bhagavad-gita/chapters/2/verses/13",
        verseLabel: "Bhagavad Gita 2.13",
        contemplationPrompt: "What changes, and what do you call the knower of change?",
      },
    ],
  },
  {
    slug: "karma-yoga-foundations",
    title: "Karma Yoga Foundations",
    summary: "A path for learning action without inner bargaining with the result.",
    kind: "KARMA_YOGA",
    difficulty: "BEGINNER",
    tradition: "Sanatana Dharma",
    guidanceNote: "This path should feel like refinement of action, not productivity training.",
    steps: [
      {
        kind: "CONCEPT_STUDY",
        title: "Clarify karma",
        summary: "Begin with action, responsibility, intention, and consequence.",
        href: "/concepts/karma",
        conceptSlug: "karma",
      },
      {
        kind: "SCRIPTURE_READING",
        title: "Read the seed verse",
        summary: "Bhagavad Gita 2.47 separates responsibility for action from ownership of outcome.",
        href: "/books/bhagavad-gita/chapters/2/verses/47",
        verseLabel: "Bhagavad Gita 2.47",
        contemplationPrompt: "What result are you asking to carry your sense of self?",
      },
      {
        kind: "SCRIPTURE_READING",
        title: "Practice equanimity",
        summary: "Bhagavad Gita 2.48 defines yoga here as sameness in success and failure.",
        href: "/books/bhagavad-gita/chapters/2/verses/48",
        verseLabel: "Bhagavad Gita 2.48",
        practiceNote: "Review one action today by asking what it taught before judging whether it pleased you.",
      },
      {
        kind: "CROSS_REFERENCE",
        title: "Compare action without bondage",
        summary: "Study the Isha Upanishad parallel as a relationship, not as a merged interpretation.",
        href: "/books/bhagavad-gita/chapters/2/verses/47#cross-scripture",
      },
    ],
  },
  {
    slug: "peace-through-steadiness",
    title: "Peace Through Steadiness",
    summary: "A gentle path for fear, anxiety, and emotional weather, rooted in Gita vocabulary.",
    kind: "PEACE_GUIDANCE",
    difficulty: "BEGINNER",
    tradition: "Sanatana Dharma",
    guidanceNote: "This is contemplative guidance, not medical or psychological treatment.",
    steps: [
      {
        kind: "SCRIPTURE_READING",
        title: "Name changing experience",
        summary: "Bhagavad Gita 2.14 teaches that pleasure and pain come and go.",
        href: "/books/bhagavad-gita/chapters/2/verses/14",
        verseLabel: "Bhagavad Gita 2.14",
        practiceNote: "Name one sensation as temporary before responding to it.",
      },
      {
        kind: "CONCEPT_STUDY",
        title: "Study samatva",
        summary: "Equanimity is steadiness, not emotional numbness.",
        href: "/concepts/samatva",
        conceptSlug: "samatva",
      },
      {
        kind: "SCRIPTURE_READING",
        title: "Return to evenness",
        summary: "Bhagavad Gita 2.48 gives a compact definition of yoga as evenness.",
        href: "/books/bhagavad-gita/chapters/2/verses/48",
        verseLabel: "Bhagavad Gita 2.48",
      },
    ],
  },
];

export function getLearningPath(slug: string) {
  return learningPaths.find((path) => path.slug === slug);
}
