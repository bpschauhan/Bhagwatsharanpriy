import type { ConceptProfile, KnowledgeEdge, KnowledgeNode } from "@/types/knowledge";

export const knowledgeNodes: KnowledgeNode[] = [
  {
    id: "wisdom-root",
    slug: "wisdom",
    title: "Wisdom",
    subtitle: "The living map",
    summary: "A calm center for seeing how texts, practices, philosophies, and concepts illuminate one another.",
    nodeType: "TRADITION",
    x: 50,
    y: 50,
    tags: ["overview"],
  },
  {
    id: "vedas",
    slug: "vedas",
    title: "Vedas",
    summary: "The foundational Sanskrit corpus that nourishes later scripture, ritual, philosophy, and contemplation.",
    nodeType: "SCRIPTURE",
    parentId: "wisdom-root",
    x: 22,
    y: 28,
    tags: ["source"],
  },
  {
    id: "upanishads",
    slug: "upanishads",
    title: "Upanishads",
    summary: "Philosophical teachings concerned with self, reality, liberation, and direct understanding.",
    nodeType: "SCRIPTURE",
    parentId: "wisdom-root",
    x: 50,
    y: 18,
    tags: ["self-knowledge"],
  },
  {
    id: "bhagavad-gita",
    slug: "bhagavad-gita",
    title: "Bhagavad Gita",
    summary: "A dialogue that integrates dharma, action, devotion, meditation, and self-knowledge.",
    nodeType: "BOOK",
    parentId: "wisdom-root",
    x: 73,
    y: 35,
    href: "/books/bhagavad-gita",
    tags: ["study path"],
  },
  {
    id: "yoga",
    slug: "yoga",
    title: "Yoga",
    summary: "Disciplines of attention, embodiment, inner steadiness, and liberation.",
    nodeType: "PRACTICE",
    parentId: "wisdom-root",
    x: 72,
    y: 65,
    tags: ["practice"],
  },
  {
    id: "vedanta",
    slug: "vedanta",
    title: "Vedanta",
    summary: "A family of philosophical traditions centered on the Upanishads, Brahman, Atma, and liberation.",
    nodeType: "PHILOSOPHY_SCHOOL",
    parentId: "wisdom-root",
    x: 48,
    y: 78,
    tags: ["philosophy"],
  },
  {
    id: "sankhya",
    slug: "sankhya",
    title: "Sankhya",
    summary: "A philosophical analysis of consciousness, nature, qualities, and discriminative insight.",
    nodeType: "PHILOSOPHY_SCHOOL",
    parentId: "wisdom-root",
    x: 25,
    y: 70,
    tags: ["philosophy"],
  },
  {
    id: "tantra",
    slug: "tantra",
    title: "Tantra",
    summary: "Diverse traditions that work with mantra, ritual, embodiment, energy, and sacred presence.",
    nodeType: "TRADITION",
    parentId: "wisdom-root",
    x: 16,
    y: 50,
    tags: ["tradition"],
  },
  {
    id: "darshanas",
    slug: "darshanas",
    title: "Darshanas",
    summary: "Classical philosophical viewpoints, each offering a disciplined way of seeing reality.",
    nodeType: "PHILOSOPHY_SCHOOL",
    parentId: "wisdom-root",
    x: 86,
    y: 50,
    tags: ["systems"],
  },
  {
    id: "concepts",
    slug: "concepts",
    title: "Concepts",
    summary: "Key ideas that connect scriptures and practices across the learning map.",
    nodeType: "CONCEPT",
    parentId: "wisdom-root",
    x: 50,
    y: 50,
    href: "/concepts",
    tags: ["index"],
  },
  {
    id: "rigveda",
    slug: "rigveda",
    title: "Rigveda",
    summary: "A Veda of hymns, praise, invocation, and poetic insight.",
    nodeType: "SCRIPTURE",
    parentId: "vedas",
    x: 8,
    y: 18,
  },
  {
    id: "yajurveda",
    slug: "yajurveda",
    title: "Yajurveda",
    summary: "A Veda associated with sacrificial formulas, ritual order, and sacred action.",
    nodeType: "SCRIPTURE",
    parentId: "vedas",
    x: 28,
    y: 12,
  },
  {
    id: "samaveda",
    slug: "samaveda",
    title: "Samaveda",
    summary: "A Veda of chant and melodic recitation, closely tied to liturgical singing.",
    nodeType: "SCRIPTURE",
    parentId: "vedas",
    x: 11,
    y: 34,
  },
  {
    id: "atharvaveda",
    slug: "atharvaveda",
    title: "Atharvaveda",
    summary: "A Veda with hymns, rites, healing concerns, and reflections on daily life.",
    nodeType: "SCRIPTURE",
    parentId: "vedas",
    x: 33,
    y: 34,
  },
  {
    id: "isha-upanishad",
    slug: "isha-upanishad",
    title: "Isha Upanishad",
    summary: "A concise Upanishad exploring renunciation, action, and seeing the divine in all.",
    nodeType: "SCRIPTURE",
    parentId: "upanishads",
    x: 39,
    y: 7,
  },
  {
    id: "katha-upanishad",
    slug: "katha-upanishad",
    title: "Katha Upanishad",
    summary: "A dialogue with Yama on death, the self, and the path of wisdom.",
    nodeType: "SCRIPTURE",
    parentId: "upanishads",
    x: 58,
    y: 6,
  },
  {
    id: "chandogya-upanishad",
    slug: "chandogya-upanishad",
    title: "Chandogya Upanishad",
    summary: "A major Upanishad containing teachings such as tat tvam asi.",
    nodeType: "SCRIPTURE",
    parentId: "upanishads",
    x: 68,
    y: 17,
  },
  {
    id: "brihadaranyaka-upanishad",
    slug: "brihadaranyaka-upanishad",
    title: "Brihadaranyaka Upanishad",
    summary: "A profound Upanishad with expansive inquiry into self, reality, and liberation.",
    nodeType: "SCRIPTURE",
    parentId: "upanishads",
    x: 33,
    y: 19,
  },
  {
    id: "yoga-sutras",
    slug: "yoga-sutras",
    title: "Yoga Sutras",
    summary: "A concise system of yogic psychology, practice, concentration, and liberation.",
    nodeType: "SCRIPTURE",
    parentId: "yoga",
    x: 87,
    y: 71,
  },
  {
    id: "karma",
    slug: "karma",
    title: "Karma",
    summary: "Action, consequence, and the ethical texture of cause and effect.",
    nodeType: "CONCEPT",
    parentId: "concepts",
    x: 64,
    y: 47,
    href: "/concepts/karma",
  },
  {
    id: "dharma",
    slug: "dharma",
    title: "Dharma",
    summary: "Right action, responsibility, order, and truth in context.",
    nodeType: "CONCEPT",
    parentId: "concepts",
    x: 58,
    y: 36,
    href: "/concepts/dharma",
  },
  {
    id: "atma",
    slug: "atma",
    title: "Atma",
    summary: "The self or witnessing principle explored in Vedanta and the Gita.",
    nodeType: "CONCEPT",
    parentId: "concepts",
    x: 50,
    y: 63,
    href: "/concepts/atma",
  },
  {
    id: "samatva",
    slug: "samatva",
    title: "Samatva",
    summary: "Equanimity: steadiness in success, failure, pleasure, and pain.",
    nodeType: "CONCEPT",
    parentId: "concepts",
    x: 72,
    y: 55,
    href: "/concepts/samatva",
  },
  {
    id: "bhakti",
    slug: "bhakti",
    title: "Bhakti",
    summary: "Devotion, loving orientation, and surrender toward the sacred.",
    nodeType: "CONCEPT",
    parentId: "concepts",
    x: 80,
    y: 40,
    href: "/concepts/bhakti",
  },
  {
    id: "jnana",
    slug: "jnana",
    title: "Jnana",
    summary: "Knowledge or insight that clarifies the nature of self and reality.",
    nodeType: "CONCEPT",
    parentId: "concepts",
    x: 43,
    y: 64,
    href: "/concepts/jnana",
  },
  {
    id: "moksha",
    slug: "moksha",
    title: "Moksha",
    summary: "Liberation from bondage, ignorance, and misidentification.",
    nodeType: "CONCEPT",
    parentId: "concepts",
    x: 36,
    y: 76,
    href: "/concepts/moksha",
  },
  {
    id: "prakriti",
    slug: "prakriti",
    title: "Prakriti",
    summary: "Nature, materiality, and the changing field of experience in Sankhya language.",
    nodeType: "CONCEPT",
    parentId: "concepts",
    x: 20,
    y: 82,
    href: "/concepts/prakriti",
  },
  {
    id: "purusha",
    slug: "purusha",
    title: "Purusha",
    summary: "Consciousness or witnessing principle in Sankhya and Yoga contexts.",
    nodeType: "CONCEPT",
    parentId: "concepts",
    x: 15,
    y: 66,
    href: "/concepts/purusha",
  },
  {
    id: "advaita",
    slug: "advaita-vedanta",
    title: "Advaita Vedanta",
    summary: "A non-dual Vedanta tradition emphasizing the identity of Atma and Brahman.",
    nodeType: "PHILOSOPHY_SCHOOL",
    parentId: "vedanta",
    x: 45,
    y: 92,
  },
  {
    id: "vishishtadvaita",
    slug: "vishishtadvaita",
    title: "Vishishtadvaita",
    summary: "A qualified non-dual Vedanta tradition with devotional and theological emphasis.",
    nodeType: "PHILOSOPHY_SCHOOL",
    parentId: "vedanta",
    x: 58,
    y: 90,
  },
  {
    id: "nyaya",
    slug: "nyaya",
    title: "Nyaya",
    summary: "A classical school focused on logic, knowledge, reasoning, and valid means of knowing.",
    nodeType: "PHILOSOPHY_SCHOOL",
    parentId: "darshanas",
    x: 94,
    y: 38,
  },
  {
    id: "mimamsa",
    slug: "mimamsa",
    title: "Mimamsa",
    summary: "A school centered on Vedic interpretation, ritual action, and dharma.",
    nodeType: "PHILOSOPHY_SCHOOL",
    parentId: "darshanas",
    x: 96,
    y: 60,
  },
];

export const knowledgeEdges: KnowledgeEdge[] = [
  edge("wisdom-root", "vedas", "BELONGS_TO", "foundation", "Vedas are foundational to the wider map.", true, 5),
  edge("wisdom-root", "upanishads", "BELONGS_TO", "inner inquiry", "Upanishads carry contemplative inquiry into self and reality.", true, 5),
  edge("wisdom-root", "bhagavad-gita", "BELONGS_TO", "dialogue", "The Gita integrates several paths into a teaching dialogue.", true, 5),
  edge("wisdom-root", "yoga", "BELONGS_TO", "practice", "Yoga offers practices for attention and liberation.", true, 4),
  edge("wisdom-root", "vedanta", "BELONGS_TO", "philosophy", "Vedanta develops Upanishadic insight into philosophical schools.", true, 4),
  edge("wisdom-root", "sankhya", "BELONGS_TO", "analysis", "Sankhya gives analytical language for consciousness and nature.", true, 4),
  edge("wisdom-root", "tantra", "RELATED_TO", "embodied sacredness", "Tantra connects practice, ritual, embodiment, and sacred presence.", true, 3),
  edge("wisdom-root", "darshanas", "BELONGS_TO", "viewpoints", "Darshanas are disciplined ways of seeing.", true, 4),
  edge("vedas", "rigveda", "BELONGS_TO", "branch", "Rigveda is one of the four Vedas.", true, 4),
  edge("vedas", "yajurveda", "BELONGS_TO", "branch", "Yajurveda is one of the four Vedas.", true, 4),
  edge("vedas", "samaveda", "BELONGS_TO", "branch", "Samaveda is one of the four Vedas.", true, 4),
  edge("vedas", "atharvaveda", "BELONGS_TO", "branch", "Atharvaveda is one of the four Vedas.", true, 4),
  edge("vedas", "upanishads", "DERIVED_FROM", "later inquiry", "Many Upanishads are associated with Vedic lineages.", false, 4),
  edge("upanishads", "isha-upanishad", "BELONGS_TO", "major text", "Isha is studied as a principal Upanishad.", true, 3),
  edge("upanishads", "katha-upanishad", "BELONGS_TO", "major text", "Katha is studied as a principal Upanishad.", true, 3),
  edge("upanishads", "chandogya-upanishad", "BELONGS_TO", "major text", "Chandogya is one of the major Upanishads.", true, 3),
  edge("upanishads", "brihadaranyaka-upanishad", "BELONGS_TO", "major text", "Brihadaranyaka is one of the major Upanishads.", true, 3),
  edge("upanishads", "vedanta", "INFLUENCED", "basis", "Vedanta takes the Upanishads as a primary textual basis.", false, 5),
  edge("bhagavad-gita", "karma", "EXPLAINS", "action", "The Gita gives a central teaching on karma and Karma Yoga.", true, 5),
  edge("bhagavad-gita", "dharma", "EXPLAINS", "duty", "The Gita's opening crisis is a crisis of dharma.", true, 5),
  edge("bhagavad-gita", "atma", "EXPLAINS", "self", "The Gita teaches the self beyond bodily change.", true, 4),
  edge("bhagavad-gita", "samatva", "EXPLAINS", "equanimity", "The Gita defines yoga as equanimity in 2.48.", true, 5),
  edge("bhagavad-gita", "bhakti", "EXPLAINS", "devotion", "The Gita develops devotion as a path of relationship and surrender.", true, 4),
  edge("yoga", "yoga-sutras", "BELONGS_TO", "system", "The Yoga Sutras systematize yogic practice and psychology.", true, 4),
  edge("yoga", "samatva", "RELATED_TO", "steadiness", "Yogic practice trains steadiness and attention.", true, 3),
  edge("yoga-sutras", "purusha", "EXPLAINS", "witness", "The Yoga Sutras share Sankhya-influenced language around purusha.", false, 3),
  edge("sankhya", "prakriti", "EXPLAINS", "nature", "Sankhya analyzes prakriti as the field of nature.", true, 5),
  edge("sankhya", "purusha", "EXPLAINS", "consciousness", "Sankhya distinguishes purusha from prakriti.", true, 5),
  edge("sankhya", "yoga", "INFLUENCED", "shared language", "Yoga shares important categories with Sankhya.", true, 3),
  edge("vedanta", "atma", "EXPLAINS", "self", "Vedanta deeply examines Atma and Brahman.", true, 5),
  edge("vedanta", "jnana", "EXPLAINS", "knowledge", "Jnana is central to many Vedanta paths.", true, 4),
  edge("vedanta", "moksha", "EXPLAINS", "liberation", "Vedanta orients inquiry toward liberation.", true, 5),
  edge("vedanta", "advaita", "BELONGS_TO", "school", "Advaita is a Vedanta school.", true, 3),
  edge("vedanta", "vishishtadvaita", "BELONGS_TO", "school", "Vishishtadvaita is a Vedanta school.", true, 3),
  edge("darshanas", "nyaya", "BELONGS_TO", "school", "Nyaya is one of the classical systems.", true, 3),
  edge("darshanas", "mimamsa", "BELONGS_TO", "school", "Mimamsa is one of the classical systems.", true, 3),
  edge("mimamsa", "dharma", "EXPLAINS", "interpretation", "Mimamsa contributes important ways of thinking about dharma.", true, 3),
  edge("karma", "dharma", "RELATED_TO", "action in context", "Karma becomes meaningful when action is understood through dharma.", true, 4),
  edge("karma", "samatva", "RELATED_TO", "inner posture", "Karma Yoga asks for action with equanimity.", true, 4),
  edge("atma", "moksha", "RELATED_TO", "liberation", "Self-knowledge is linked to liberation in Vedanta contexts.", true, 4),
  edge("jnana", "moksha", "RELATED_TO", "liberating insight", "Knowledge is treated as liberating insight in several traditions.", true, 4),
];

export const conceptProfiles: ConceptProfile[] = [
  {
    slug: "karma",
    title: "Karma",
    category: "Action and consequence",
    summary: "Karma means action and the moral-psychological continuity of action, intention, and consequence.",
    explanation:
      "In the Bhagavad Gita study path, karma is best approached first as responsibility for action. Interpretive traditions then explore how intention, attachment, duty, and consequence shape the inner life.",
    relatedConceptSlugs: ["dharma", "samatva", "moksha"],
    relatedBooks: [
      {
        title: "Bhagavad Gita",
        href: "/books/bhagavad-gita",
        note: "The Gita gives one of the clearest practical teachings on action without attachment.",
      },
    ],
    relatedVerses: [
      {
        label: "Bhagavad Gita 2.47",
        href: "/books/bhagavad-gita/chapters/2/verses/47",
        note: "Responsibility belongs to action, not ownership over every result.",
      },
      {
        label: "Bhagavad Gita 2.48",
        href: "/books/bhagavad-gita/chapters/2/verses/48",
        note: "Act from yoga, remaining even in success and failure.",
      },
    ],
    relatedPhilosophies: [
      {
        title: "Karma Yoga",
        note: "A discipline of sincere action with reduced attachment to outcome.",
      },
      {
        title: "Mimamsa",
        note: "A classical school with deep concern for action, duty, and Vedic interpretation.",
      },
    ],
    parallels: [
      {
        title: "Habit formation",
        note: "Repeated action shapes tendencies. This is a helpful psychological parallel, not a replacement for the traditional idea of karma.",
      },
    ],
    graphFocusNodeId: "karma",
  },
  {
    slug: "dharma",
    title: "Dharma",
    category: "Ethics and order",
    summary: "Dharma refers to rightness, responsibility, sustaining order, and wise conduct in context.",
    explanation:
      "Dharma is not just a rule. It asks what action is true, responsible, and appropriate to a specific person, role, moment, and moral field.",
    relatedConceptSlugs: ["karma", "samatva"],
    relatedBooks: [
      {
        title: "Bhagavad Gita",
        href: "/books/bhagavad-gita",
        note: "The Gita begins as Arjuna faces a crisis of dharma.",
      },
    ],
    relatedVerses: [
      {
        label: "Bhagavad Gita 1.1",
        href: "/books/bhagavad-gita/chapters/1/verses/1",
        note: "The battlefield is introduced as dharmakshetra, a field of dharma.",
      },
    ],
    relatedPhilosophies: [
      {
        title: "Mimamsa",
        note: "Mimamsa offers detailed approaches to duty, action, and scriptural interpretation.",
      },
    ],
    parallels: [
      {
        title: "Role ethics",
        note: "Modern ethics also studies how responsibility changes with role and context. This is only a parallel for learning.",
      },
    ],
    graphFocusNodeId: "dharma",
  },
  {
    slug: "atma",
    title: "Atma",
    category: "Self-knowledge",
    summary: "Atma points toward the self or witnessing principle explored in the Gita and Vedanta.",
    explanation:
      "The Gita introduces self-inquiry by asking learners to distinguish changing bodily experience from the deeper continuity of the knower.",
    relatedConceptSlugs: ["jnana", "moksha", "purusha"],
    relatedBooks: [
      {
        title: "Bhagavad Gita",
        href: "/books/bhagavad-gita",
        note: "Chapter 2 begins the Gita's teaching on self and embodied change.",
      },
    ],
    relatedVerses: [
      {
        label: "Bhagavad Gita 2.13",
        href: "/books/bhagavad-gita/chapters/2/verses/13",
        note: "A central verse on continuity through bodily change.",
      },
    ],
    relatedPhilosophies: [
      {
        title: "Vedanta",
        note: "Vedanta develops self-knowledge through Upanishadic inquiry.",
      },
    ],
    parallels: [
      {
        title: "Continuity of identity",
        note: "Psychology notices identity continuity across life stages. This is a reflective parallel, not proof of metaphysics.",
      },
    ],
    graphFocusNodeId: "atma",
  },
  {
    slug: "samatva",
    title: "Samatva",
    category: "Mind training",
    summary: "Samatva is equanimity: balanced presence across success, failure, pleasure, and pain.",
    explanation:
      "Samatva is not emotional dullness. It is a trained steadiness that lets action become clearer because the mind is less ruled by outcome.",
    relatedConceptSlugs: ["karma", "dharma"],
    relatedBooks: [
      {
        title: "Bhagavad Gita",
        href: "/books/bhagavad-gita",
        note: "The Gita explicitly calls equanimity yoga in 2.48.",
      },
    ],
    relatedVerses: [
      {
        label: "Bhagavad Gita 2.48",
        href: "/books/bhagavad-gita/chapters/2/verses/48",
        note: "Defines yoga as evenness in success and failure.",
      },
      {
        label: "Bhagavad Gita 2.14",
        href: "/books/bhagavad-gita/chapters/2/verses/14",
        note: "Teaches forbearance toward temporary experiences.",
      },
    ],
    relatedPhilosophies: [
      {
        title: "Yoga",
        note: "Yogic practice trains attention, steadiness, and response rather than reactivity.",
      },
    ],
    parallels: [
      {
        title: "Emotion regulation",
        note: "The pause between stimulus and response is a useful modern parallel, not a total explanation of samatva.",
      },
    ],
    graphFocusNodeId: "samatva",
  },
  {
    slug: "bhakti",
    title: "Bhakti",
    category: "Devotion",
    summary: "Bhakti is a loving orientation toward the sacred, often expressed through surrender, remembrance, and service.",
    explanation:
      "Bhakti should not be reduced to emotion alone. In many traditions it becomes a disciplined relationship of trust, love, humility, and offering.",
    relatedConceptSlugs: ["karma", "moksha"],
    relatedBooks: [
      {
        title: "Bhagavad Gita",
        href: "/books/bhagavad-gita",
        note: "The Gita develops devotion as one of its major paths.",
      },
    ],
    relatedVerses: [],
    relatedPhilosophies: [
      {
        title: "Vishishtadvaita",
        note: "A Vedanta school with a strong devotional orientation.",
      },
    ],
    parallels: [
      {
        title: "Attachment and trust",
        note: "Modern psychology can discuss trust and attachment, but bhakti remains a spiritual category in this context.",
      },
    ],
    graphFocusNodeId: "bhakti",
  },
  {
    slug: "jnana",
    title: "Jnana",
    category: "Knowledge",
    summary: "Jnana is liberating insight, not merely information.",
    explanation:
      "Jnana points to a kind of understanding that changes identity, action, and perception. It is central in many Vedanta-oriented readings.",
    relatedConceptSlugs: ["atma", "moksha"],
    relatedBooks: [
      {
        title: "Upanishads",
        href: "/explore",
        note: "The Upanishads are a major source for self-knowledge inquiry.",
      },
    ],
    relatedVerses: [
      {
        label: "Bhagavad Gita 2.13",
        href: "/books/bhagavad-gita/chapters/2/verses/13",
        note: "A beginner doorway into inquiry about the self.",
      },
    ],
    relatedPhilosophies: [
      {
        title: "Vedanta",
        note: "Vedanta places deep emphasis on knowledge of self and reality.",
      },
    ],
    parallels: [
      {
        title: "Insight learning",
        note: "A psychological parallel is the difference between memorized data and insight that reorganizes perception.",
      },
    ],
    graphFocusNodeId: "jnana",
  },
  {
    slug: "moksha",
    title: "Moksha",
    category: "Liberation",
    summary: "Moksha means liberation from bondage, ignorance, and misidentification.",
    explanation:
      "Different traditions explain moksha differently. The graph treats those explanations as connected interpretations rather than one flattened answer.",
    relatedConceptSlugs: ["atma", "jnana", "bhakti"],
    relatedBooks: [
      {
        title: "Bhagavad Gita",
        href: "/books/bhagavad-gita",
        note: "The Gita integrates action, knowledge, devotion, and meditation toward liberation.",
      },
    ],
    relatedVerses: [],
    relatedPhilosophies: [
      {
        title: "Vedanta",
        note: "Vedanta traditions often place moksha at the center of inquiry.",
      },
      {
        title: "Yoga",
        note: "Yoga traditions describe liberation through disciplined practice and insight.",
      },
    ],
    parallels: [
      {
        title: "Freedom from compulsion",
        note: "Psychological freedom from compulsive patterns can be a learning parallel, not a full equivalent.",
      },
    ],
    graphFocusNodeId: "moksha",
  },
  {
    slug: "prakriti",
    title: "Prakriti",
    category: "Nature",
    summary: "Prakriti refers to nature, materiality, and the changing field of experience in Sankhya language.",
    explanation:
      "Sankhya uses prakriti to analyze the changing field of mind, matter, and qualities. It is understood alongside purusha.",
    relatedConceptSlugs: ["purusha"],
    relatedBooks: [
      {
        title: "Explore Sankhya",
        href: "/explore",
        note: "The graph connects prakriti to Sankhya and Yoga language.",
      },
    ],
    relatedVerses: [],
    relatedPhilosophies: [
      {
        title: "Sankhya",
        note: "Sankhya distinguishes prakriti from purusha.",
      },
    ],
    parallels: [
      {
        title: "Field of experience",
        note: "As a study aid, prakriti can be compared to the observable field of changing experience.",
      },
    ],
    graphFocusNodeId: "prakriti",
  },
  {
    slug: "purusha",
    title: "Purusha",
    category: "Consciousness",
    summary: "Purusha points to consciousness or the witnessing principle in Sankhya and Yoga contexts.",
    explanation:
      "Purusha is studied in relationship to prakriti. The learner should keep this as philosophical vocabulary, not as a casual synonym for personality.",
    relatedConceptSlugs: ["prakriti", "atma"],
    relatedBooks: [
      {
        title: "Yoga Sutras",
        href: "/explore",
        note: "Yoga uses related language when discussing seer and seen.",
      },
    ],
    relatedVerses: [],
    relatedPhilosophies: [
      {
        title: "Sankhya",
        note: "Purusha is central to Sankhya's distinction between consciousness and nature.",
      },
      {
        title: "Yoga",
        note: "Yoga inherits and adapts important Sankhya categories.",
      },
    ],
    parallels: [
      {
        title: "Witnessing awareness",
        note: "Meditation language sometimes uses witnessing as a practical pointer; this remains only an aid to understanding.",
      },
    ],
    graphFocusNodeId: "purusha",
  },
];

function edge(
  source: string,
  target: string,
  relationshipType: KnowledgeEdge["relationshipType"],
  label: string,
  summary: string,
  bidirectional: boolean,
  weight: number,
): KnowledgeEdge {
  return {
    id: `${source}-${relationshipType.toLowerCase()}-${target}`,
    source,
    target,
    relationshipType,
    label,
    summary,
    bidirectional,
    weight,
  };
}

export function getKnowledgeNode(id: string) {
  return knowledgeNodes.find((node) => node.id === id);
}

export function getConceptProfile(slug: string) {
  return conceptProfiles.find((concept) => concept.slug === slug);
}

export function getRelatedEdges(nodeId: string) {
  return knowledgeEdges.filter((edge) => edge.source === nodeId || edge.target === nodeId);
}

export function getNeighborNodeIds(nodeId: string) {
  return Array.from(
    new Set(
      getRelatedEdges(nodeId).flatMap((edge) => [edge.source, edge.target]).filter((id) => id !== nodeId),
    ),
  );
}
