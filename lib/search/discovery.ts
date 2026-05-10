export type DiscoveryItem = {
  slug: string;
  title: string;
  summary: string;
  conceptSlugs: string[];
  verseHrefs: string[];
  philosophySlugs: string[];
};

export const lifeTopics: DiscoveryItem[] = [
  {
    slug: "anxiety",
    title: "Anxiety",
    summary: "For moments when the mind is racing ahead of reality.",
    conceptSlugs: ["samatva", "atma"],
    verseHrefs: ["/books/bhagavad-gita/chapters/2/verses/14", "/books/bhagavad-gita/chapters/2/verses/48"],
    philosophySlugs: ["yoga", "vedanta"],
  },
  {
    slug: "discipline",
    title: "Discipline",
    summary: "For building steadiness without harshness.",
    conceptSlugs: ["karma", "samatva"],
    verseHrefs: ["/books/bhagavad-gita/chapters/2/verses/47"],
    philosophySlugs: ["yoga"],
  },
  {
    slug: "anger",
    title: "Anger",
    summary: "For creating space before reaction takes over.",
    conceptSlugs: ["samatva", "dharma"],
    verseHrefs: ["/books/bhagavad-gita/chapters/2/verses/14"],
    philosophySlugs: ["yoga"],
  },
  {
    slug: "focus",
    title: "Focus",
    summary: "For returning attention to the action in front of you.",
    conceptSlugs: ["karma", "samatva"],
    verseHrefs: ["/books/bhagavad-gita/chapters/2/verses/47", "/books/bhagavad-gita/chapters/2/verses/48"],
    philosophySlugs: ["yoga"],
  },
  {
    slug: "purpose",
    title: "Purpose",
    summary: "For clarifying responsibility, role, and direction.",
    conceptSlugs: ["dharma", "karma"],
    verseHrefs: ["/books/bhagavad-gita/chapters/1/verses/1", "/books/bhagavad-gita/chapters/1/verses/21"],
    philosophySlugs: ["mimamsa", "vedanta"],
  },
  {
    slug: "detachment",
    title: "Detachment",
    summary: "For acting sincerely without being owned by the result.",
    conceptSlugs: ["karma", "samatva", "moksha"],
    verseHrefs: ["/books/bhagavad-gita/chapters/2/verses/47"],
    philosophySlugs: ["vedanta", "yoga"],
  },
  {
    slug: "meditation",
    title: "Meditation",
    summary: "For training attention, witnessing, and inner quiet.",
    conceptSlugs: ["purusha", "samatva", "atma"],
    verseHrefs: ["/books/bhagavad-gita/chapters/2/verses/13"],
    philosophySlugs: ["yoga", "sankhya"],
  },
  {
    slug: "relationships",
    title: "Relationships",
    summary: "For practicing responsibility, devotion, patience, and truthful care.",
    conceptSlugs: ["dharma", "bhakti"],
    verseHrefs: ["/books/bhagavad-gita/chapters/1/verses/21"],
    philosophySlugs: ["bhakti", "vedanta"],
  },
  {
    slug: "fear",
    title: "Fear",
    summary: "For meeting change with deeper understanding.",
    conceptSlugs: ["atma", "samatva"],
    verseHrefs: ["/books/bhagavad-gita/chapters/2/verses/13", "/books/bhagavad-gita/chapters/2/verses/14"],
    philosophySlugs: ["vedanta"],
  },
  {
    slug: "peace",
    title: "Peace",
    summary: "For cultivating evenness, clarity, and gentle strength.",
    conceptSlugs: ["samatva", "moksha"],
    verseHrefs: ["/books/bhagavad-gita/chapters/2/verses/48"],
    philosophySlugs: ["yoga", "vedanta"],
  },
];

export const emotionalStates: DiscoveryItem[] = [
  {
    slug: "confused",
    title: "Confused",
    summary: "Start where Arjuna starts: honest uncertainty before deeper clarity.",
    conceptSlugs: ["dharma", "karma"],
    verseHrefs: ["/books/bhagavad-gita/chapters/1/verses/21"],
    philosophySlugs: ["bhagavad-gita"],
  },
  {
    slug: "anxious",
    title: "Anxious",
    summary: "Study impermanence, steadiness, and the pause before reaction.",
    conceptSlugs: ["samatva", "titiksha"],
    verseHrefs: ["/books/bhagavad-gita/chapters/2/verses/14"],
    philosophySlugs: ["yoga"],
  },
  {
    slug: "angry",
    title: "Angry",
    summary: "Return to discernment before the mind becomes the servant of heat.",
    conceptSlugs: ["samatva", "dharma"],
    verseHrefs: ["/books/bhagavad-gita/chapters/2/verses/14"],
    philosophySlugs: ["yoga"],
  },
  {
    slug: "distracted",
    title: "Distracted",
    summary: "Let action become the anchor instead of scattered future outcomes.",
    conceptSlugs: ["karma", "samatva"],
    verseHrefs: ["/books/bhagavad-gita/chapters/2/verses/47"],
    philosophySlugs: ["yoga"],
  },
  {
    slug: "seeking-purpose",
    title: "Seeking purpose",
    summary: "Explore dharma as responsible action in a real context.",
    conceptSlugs: ["dharma", "karma"],
    verseHrefs: ["/books/bhagavad-gita/chapters/1/verses/1"],
    philosophySlugs: ["mimamsa"],
  },
  {
    slug: "grieving",
    title: "Grieving",
    summary: "Approach change gently through teachings on self, impermanence, and steadiness.",
    conceptSlugs: ["atma", "samatva"],
    verseHrefs: ["/books/bhagavad-gita/chapters/2/verses/13"],
    philosophySlugs: ["vedanta"],
  },
];

export const learningPaths = [
  {
    title: "Action without attachment",
    summary: "Karma, Dharma, and Samatva through Gita 2.47 and 2.48.",
    href: "/search?q=karma",
  },
  {
    title: "Self and change",
    summary: "Atma, Vedanta, and the teaching of embodied change.",
    href: "/search?q=atma",
  },
  {
    title: "Steady mind",
    summary: "Samatva, Yoga, and practical equanimity.",
    href: "/search?q=samatva",
  },
];
