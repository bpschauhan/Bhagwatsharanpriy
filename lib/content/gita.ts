import type { BookContent, ChapterContent, ConceptContent, SourceContent, VerseContent } from "@/types/gita";

const concepts: ConceptContent[] = [
  {
    slug: "dharma",
    name: "Dharma",
    category: "Ethics",
    description: "Right action, responsibility, and alignment with truth in a specific context.",
  },
  {
    slug: "atma",
    name: "Atma",
    category: "Self-knowledge",
    description: "The witnessing self discussed in the Gita as deeper than bodily change.",
  },
  {
    slug: "karma-yoga",
    name: "Karma Yoga",
    category: "Practice",
    description: "A discipline of sincere action without dependence on personal reward.",
  },
  {
    slug: "samatva",
    name: "Samatva",
    category: "Mind training",
    description: "Equanimity: steadiness across success, failure, pleasure, and pain.",
  },
  {
    slug: "titiksha",
    name: "Titiksha",
    category: "Practice",
    description: "Forbearance toward changing sensations and circumstances.",
  },
  {
    slug: "arjuna-vishada",
    name: "Arjuna Vishada",
    category: "Human condition",
    description: "Arjuna's crisis as the doorway into inquiry, humility, and learning.",
  },
];

const sources: SourceContent[] = [
  {
    slug: "bhagavad-gita-scripture",
    title: "Bhagavad Gita",
    sourceType: "SCRIPTURE",
    citation: "Bhagavad Gita, traditional Sanskrit recension.",
  },
  {
    slug: "shlokam-gita-reference",
    title: "Shlokam.org Bhagavad Gita Verse Reference",
    sourceType: "REFERENCE",
    citation: "Public verse reference for Sanskrit, transliteration, and word meanings.",
    url: "https://shlokam.org/gita/",
  },
  {
    slug: "bhagavadgita-com-reference",
    title: "BhagavadGita.com Verse Reference",
    sourceType: "REFERENCE",
    citation: "Public verse reference consulted for Sanskrit and transliteration comparison.",
    url: "https://www.bhagavadgita.com/",
  },
  {
    slug: "shankara-gita-bhashya",
    title: "Bhagavad Gita Bhashya",
    author: "Adi Shankaracharya",
    sourceType: "COMMENTARY",
    citation: "Traditional Advaita Vedanta commentary attributed to Adi Shankaracharya.",
    language: "Sanskrit",
    historicalDate: "c. 8th century CE",
    provenanceNote: "Used as a tradition label and citation anchor; summaries should be verified against a chosen edition before publication.",
  },
  {
    slug: "ramanuja-gita-bhashya",
    title: "Gita Bhashya",
    author: "Ramanujacharya",
    sourceType: "COMMENTARY",
    citation: "Traditional Vishishtadvaita Vedanta commentary attributed to Ramanujacharya.",
    language: "Sanskrit",
    historicalDate: "c. 11th-12th century CE",
    provenanceNote: "Used as a tradition label and citation anchor; summaries should be verified against a chosen edition before publication.",
  },
  {
    slug: "madhva-gita-tatparya",
    title: "Bhagavad Gita Tatparya",
    author: "Madhvacharya",
    sourceType: "COMMENTARY",
    citation: "Traditional Dvaita Vedanta interpretive work attributed to Madhvacharya.",
    language: "Sanskrit",
    historicalDate: "c. 13th century CE",
    provenanceNote: "Used as a tradition label and citation anchor; summaries should be verified against a chosen edition before publication.",
  },
  {
    slug: "upanishads-cross-reference",
    title: "Principal Upanishads",
    sourceType: "SCRIPTURE",
    citation: "Canonical Upanishadic passages used for cross-scripture study.",
    provenanceNote: "Cross-references require exact recension and translator metadata before final verification.",
  },
  {
    slug: "yoga-sutras-cross-reference",
    title: "Yoga Sutras of Patanjali",
    sourceType: "SCRIPTURE",
    citation: "Classical Yoga Sutra references used for practical and philosophical parallels.",
    provenanceNote: "Cross-references require exact sutra, edition, and translator metadata before final verification.",
  },
];

const chapters: ChapterContent[] = [
  {
    number: 1,
    slug: "arjuna-vishada-yoga",
    title: "Arjuna Vishada Yoga",
    summary: "The battlefield becomes a mirror for moral confusion, grief, and the need for deeper wisdom.",
    overview:
      "Chapter 1 does not begin with abstract philosophy. It begins with a human being overwhelmed by conflict. Arjuna sees teachers, relatives, and friends on both sides and becomes unable to act with clarity. This prepares the ground for the Gita's teaching: wisdom begins when we stop pretending confusion is certainty.",
    verses: [
      {
        number: 1,
        slug: "dharmakshetre-kurukshetre",
        sanskrit:
          "धृतराष्ट्र उवाच ।\nधर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः ।\nमामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ॥ १-१॥",
        transliteration:
          "dhṛtarāṣṭra uvāca\ndharmakṣetre kurukṣetre samavetā yuyutsavaḥ\nmāmakāḥ pāṇḍavāścaiva kimakurvata sañjaya",
        wordByWord:
          "dhṛtarāṣṭra uvāca: Dhritarashtra said; dharmakṣetre: in the field of dharma; kurukṣetre: in Kurukshetra; samavetāḥ: assembled; yuyutsavaḥ: wishing to fight; māmakāḥ: my people; pāṇḍavāḥ: the sons of Pandu; ca eva: and also; kim akurvata: what did they do; sañjaya: O Sanjaya.",
        practicalApplication:
          "Before judging a situation, notice the lens through which you are asking the question. Dhritarashtra's 'my people' already reveals attachment.",
        philosophyInsight:
          "The verse frames the battlefield as both historical setting and moral field. This is an interpretive reading, not a claim that the verse only has one meaning.",
        conceptSlugs: ["dharma", "arjuna-vishada"],
        sourceSlugs: ["bhagavad-gita-scripture", "shlokam-gita-reference"],
        meaningLayers: [
          {
            type: "SIMPLE",
            title: "What is happening?",
            body: "Dhritarashtra asks Sanjaya what happened when the two sides gathered at Kurukshetra, ready for battle.",
          },
          {
            type: "BEGINNER",
            title: "Why this opening matters",
            body: "The Gita opens with a question shaped by attachment. Dhritarashtra separates 'mine' from 'the Pandavas', showing how partiality can cloud perception.",
          },
          {
            type: "PHILOSOPHICAL",
            title: "The field as a moral space",
            body: "Kurukshetra is called dharmakṣetra, a field of dharma. A reader may interpret this as a reminder that external conflict often reveals an inner ethical field.",
          },
        ],
        commentaries: [
          {
            author: "Bhagwatsharanpriy Study Note",
            tradition: "Learning guide",
            title: "Attachment appears before the teaching begins",
            body: "The verse is not yet giving instruction; it is exposing the condition that makes instruction necessary. The questioner is anxious, invested, and divided.",
            interpretationNote: "This is a pedagogical interpretation for learners, not scripture text.",
          },
        ],
      },
      {
        number: 21,
        slug: "senayor-ubhayor-madhye",
        sanskrit: "अर्जुन उवाच ।\nसेनयोरुभयोर्मध्ये रथं स्थापय मेऽच्युत ॥ १-२१॥",
        transliteration: "arjuna uvāca\nsenayorubhayormadhye rathaṃ sthāpaya me'cyuta",
        wordByWord:
          "arjuna uvāca: Arjuna said; senayoḥ: of the armies; ubhayoḥ: of both; madhye: in the middle; ratham: chariot; sthāpaya: place; me: my; acyuta: O Achyuta.",
        practicalApplication:
          "When a difficult choice feels abstract, look directly at the real people, duties, and consequences involved.",
        philosophyInsight:
          "Arjuna asks to see clearly before acting. In the Gita's narrative arc, clear seeing first intensifies pain, then opens the need for wisdom.",
        conceptSlugs: ["dharma", "arjuna-vishada"],
        sourceSlugs: ["bhagavad-gita-scripture", "shlokam-gita-reference"],
        meaningLayers: [
          {
            type: "SIMPLE",
            title: "Arjuna asks to see",
            body: "Arjuna asks Krishna to place the chariot between the two armies.",
          },
          {
            type: "PRACTICAL",
            title: "Do not avoid the full picture",
            body: "The verse can be practiced as a principle of honest attention: move closer to reality before making a serious decision.",
          },
          {
            type: "DEEP",
            title: "The chariot becomes a classroom",
            body: "The center of the battlefield becomes the center of inquiry. The place of conflict becomes the place where teaching can begin.",
          },
        ],
        commentaries: [
          {
            author: "Bhagwatsharanpriy Study Note",
            tradition: "Learning guide",
            title: "Courage before clarity",
            body: "Arjuna's request appears strategic, but it becomes existential. Seeing the field clearly reveals that the problem is not only military; it is moral and spiritual.",
            interpretationNote: "This note distinguishes narrative development from literal translation.",
          },
        ],
      },
    ],
  },
  {
    number: 2,
    slug: "sankhya-yoga",
    title: "Sankhya Yoga",
    summary: "Krishna begins teaching the nature of the self, disciplined action, equanimity, and wise understanding.",
    overview:
      "Chapter 2 is the Gita in seed form. It addresses grief, the changing body, sense experience, steady action, and the inner poise called yoga. For beginners, it is best read slowly: each verse adds a layer to the question of how to live wisely.",
    verses: [
      {
        number: 13,
        slug: "dehinosmin-yatha-dehe",
        sanskrit:
          "देहिनोऽस्मिन्यथा देहे कौमारं यौवनं जरा ।\nतथा देहान्तरप्राप्तिर्धीरस्तत्र न मुह्यति ॥ २-१३॥",
        transliteration:
          "dehino'sminyathā dehe kaumāraṃ yauvanaṃ jarā\ntathā dehāntaraprāptir dhīrastatra na muhyati",
        wordByWord:
          "dehinaḥ: of the embodied; asmin: in this; yathā: just as; dehe: in the body; kaumāram: childhood; yauvanam: youth; jarā: old age; tathā: so also; dehāntara-prāptiḥ: attainment of another body; dhīraḥ: the steady one; tatra: there; na muhyati: is not deluded.",
        practicalApplication:
          "Observe change without immediately confusing change with loss of identity. This can soften fear and make reflection possible.",
        philosophyInsight:
          "The verse teaches continuity through bodily change. Traditions interpret this continuity through the doctrine of the self; the app labels that as philosophical interpretation.",
        conceptSlugs: ["atma", "samatva"],
        sourceSlugs: ["bhagavad-gita-scripture", "shlokam-gita-reference", "bhagavadgita-com-reference"],
        meaningLayers: [
          {
            type: "SIMPLE",
            title: "The basic point",
            body: "The embodied person passes through childhood, youth, and old age. The wise do not become confused by this change.",
          },
          {
            type: "BEGINNER",
            title: "A gentle way to understand it",
            body: "You have already lived through many versions of your body and life. The verse asks you to notice the continuity that remains present through change.",
          },
          {
            type: "PHILOSOPHICAL",
            title: "Self and body",
            body: "Within the Gita's worldview, the self is not reduced to the body. This is a metaphysical teaching, not a scientific measurement.",
          },
          {
            type: "SCIENTIFIC_PARALLEL",
            title: "A careful parallel",
            body: "Modern psychology also notices continuity of identity across changing life stages. This is only a parallel for reflection, not proof of the Gita's metaphysics.",
          },
        ],
        commentaries: [
          {
            author: "Bhagwatsharanpriy Study Note",
            tradition: "Learning guide",
            title: "Change is not the whole truth",
            body: "This verse invites the learner to hold two facts together: the body changes, and experience still has a thread of continuity. The Gita uses that insight to begin a deeper inquiry into the self.",
            interpretationNote: "This is interpretive explanation, not a literal translation.",
            layerType: "PRACTICAL",
            layers: [
              {
                type: "TEXTUAL",
                title: "What the verse contrasts",
                body: "The surface contrast is between bodily change and the steady one who is not bewildered by that change.",
              },
              {
                type: "PRACTICAL",
                title: "How a learner can sit with it",
                body: "The verse may be contemplated by noticing that identity, memory, and witness-language all point beyond one passing bodily state.",
              },
            ],
          },
          {
            author: "Adi Shankaracharya",
            tradition: "Vedanta",
            school: "Advaita Vedanta",
            title: "A doorway into atma-vichara",
            body: "Vedantic readers often treat this verse as an early doorway into inquiry about the witnessing self. The verse is studied carefully because it shifts attention from events to the knower of events.",
            interpretationNote: "This is a concise study summary of an Advaita-oriented reading, not a replacement for the Sanskrit bhashya.",
            sourceSlug: "shankara-gita-bhashya",
            layerType: "PHILOSOPHICAL",
            language: "Sanskrit",
            historicalPeriod: "c. 8th century CE",
            sourceLocator: "Bhagavad Gita 2.13",
            attributionNote: "Attribute the school and author clearly; do not merge this with other Vedanta readings.",
            layers: [
              {
                type: "PHILOSOPHICAL",
                title: "Continuity and witness",
                body: "The Advaita-oriented emphasis is on the self as distinct from changing bodily states, preparing inquiry into the witness.",
              },
              {
                type: "COMPARATIVE",
                title: "Where this differs",
                body: "This should be kept separate from qualified non-dual or dualist readings that preserve different relations between self, Lord, and embodiment.",
              },
            ],
          },
          {
            author: "Ramanujacharya",
            tradition: "Vedanta",
            school: "Vishishtadvaita Vedanta",
            title: "Embodied self in relation to the Supreme",
            body: "A Vishishtadvaita-oriented reading can preserve the continuity of the self while interpreting the self as dependent on and inseparable from the Supreme reality.",
            interpretationNote: "This is a tradition-aware summary for comparison, pending source verification against a selected edition.",
            sourceSlug: "ramanuja-gita-bhashya",
            layerType: "PHILOSOPHICAL",
            language: "Sanskrit",
            historicalPeriod: "c. 11th-12th century CE",
            sourceLocator: "Bhagavad Gita 2.13",
            layers: [
              {
                type: "PHILOSOPHICAL",
                title: "Continuity without isolation",
                body: "The self's continuity is not treated as absolute independence; the interpretive frame remains relational and theistic.",
              },
            ],
          },
          {
            author: "Madhvacharya",
            tradition: "Vedanta",
            school: "Dvaita Vedanta",
            title: "Real distinction and persistence of the self",
            body: "A Dvaita-oriented comparison can read the verse as supporting the enduring reality of the individual self while maintaining real difference between self and God.",
            interpretationNote: "This is a comparative study label, not a full translation of Madhva's commentary.",
            sourceSlug: "madhva-gita-tatparya",
            layerType: "COMPARATIVE",
            language: "Sanskrit",
            historicalPeriod: "c. 13th century CE",
            sourceLocator: "Bhagavad Gita 2.13",
            layers: [
              {
                type: "COMPARATIVE",
                title: "A difference-preserving reading",
                body: "The enduring self is not collapsed into identity with the Supreme; philosophical difference remains part of the interpretation.",
              },
            ],
          },
        ],
        relationships: [
          {
            targetLabel: "Katha Upanishad 2.18",
            targetTextTitle: "Katha Upanishad",
            targetLocator: "2.18",
            relationshipType: "PHILOSOPHICALLY_SIMILAR",
            label: "self beyond bodily death",
            explanation:
              "Both passages are studied for teachings that distinguish the self from bodily birth and death. The connection is philosophical, not a claim that the verses are identical.",
            philosophicalContext: "Useful for Vedanta study, especially when comparing how schools explain the self.",
            tradition: "Sanatana Dharma",
            school: "Vedanta",
            confidenceLevel: 70,
            sourceSlug: "upanishads-cross-reference",
          },
        ],
      },
      {
        number: 14,
        slug: "matrasparsas-tu-kaunteya",
        sanskrit:
          "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः ।\nआगमापायिनोऽनित्या स्तांस्तितिक्षस्व भारत ॥ २-१४॥",
        transliteration:
          "mātrāsparśāstu kaunteya śītoṣṇasukhaduḥkhadāḥ\nāgamāpāyino'nityā stāṃstitikṣasva bhārata",
        wordByWord:
          "mātrāsparśāḥ: contacts of senses; tu: indeed; kaunteya: O son of Kunti; śītoṣṇa-sukha-duḥkha-dāḥ: giving cold, heat, pleasure, and pain; āgamāpāyinaḥ: coming and going; anityāḥ: impermanent; tān: them; titikṣasva: endure; bhārata: O descendant of Bharata.",
        practicalApplication:
          "When discomfort arises, name it as a passing experience before reacting. This creates a small space for wise action.",
        philosophyInsight:
          "The verse does not deny pleasure or pain. It places them in the category of changing experience and asks for steadiness toward them.",
        conceptSlugs: ["titiksha", "samatva"],
        sourceSlugs: ["bhagavad-gita-scripture", "shlokam-gita-reference", "bhagavadgita-com-reference"],
        meaningLayers: [
          {
            type: "SIMPLE",
            title: "Experiences come and go",
            body: "Heat, cold, pleasure, and pain arise through contact with the senses. They are temporary, so Krishna asks Arjuna to endure them.",
          },
          {
            type: "PRACTICAL",
            title: "Training the pause",
            body: "Titiksha is not numbness. It is the ability to stay present long enough that discomfort does not command your whole mind.",
          },
          {
            type: "SCIENTIFIC_PARALLEL",
            title: "A careful parallel",
            body: "Emotion regulation research also values the pause between stimulus and response. This is a practical parallel, not a claim that the verse is a psychology textbook.",
          },
        ],
        commentaries: [
          {
            author: "Bhagwatsharanpriy Study Note",
            tradition: "Learning guide",
            title: "Endurance without hardness",
            body: "The verse can be misunderstood as suppressing feeling. A gentler reading is that changing experiences should be felt clearly without becoming the ruler of action.",
            interpretationNote: "This is a practical interpretation for study.",
          },
        ],
      },
      {
        number: 47,
        slug: "karmanyevadhikaraste",
        sanskrit:
          "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥ २-४७॥",
        transliteration:
          "karmaṇyevādhikāraste mā phaleṣu kadācana\nmā karmaphalaheturbhūrmā te saṅgo'stvakarmaṇi",
        wordByWord:
          "karmaṇi: in action; eva: only; adhikāraḥ: right or sphere of responsibility; te: your; mā: not; phaleṣu: in the fruits; kadācana: ever; mā: do not; karmaphalahetuḥ: cause of the fruits of action; bhūḥ: be; mā: do not; te: your; saṅgaḥ: attachment; astu: let there be; akarmaṇi: in inaction.",
        practicalApplication:
          "Give full attention to the action you can honestly perform. Release the demand that reality must obey your preferred result.",
        philosophyInsight:
          "This verse is a core seed of Karma Yoga. It separates responsibility for action from possession of outcome.",
        conceptSlugs: ["karma-yoga", "dharma", "samatva"],
        sourceSlugs: ["bhagavad-gita-scripture", "shlokam-gita-reference", "bhagavadgita-com-reference"],
        meaningLayers: [
          {
            type: "SIMPLE",
            title: "Your work is yours",
            body: "You have responsibility for action, but not ownership over every result that follows from it.",
          },
          {
            type: "BEGINNER",
            title: "Not a call to indifference",
            body: "The verse does not say results do not matter. It says attachment to results should not become the motive that controls the mind.",
          },
          {
            type: "PRACTICAL",
            title: "A practice sentence",
            body: "Before beginning work, say: I will act with care; I will learn from the result; I do not need the result to define me.",
          },
          {
            type: "DEEP",
            title: "Action without inner bargaining",
            body: "Karma Yoga trains action that is sincere, skillful, and less entangled in egoic bargaining with the future.",
          },
        ],
        commentaries: [
          {
            author: "Bhagwatsharanpriy Study Note",
            tradition: "Learning guide",
            title: "Freedom inside effort",
            body: "The verse protects effort from two distortions: obsession with reward and escape into inaction. Both keep the mind bound to the result.",
            interpretationNote: "This is an explanatory interpretation, not scripture text.",
            layerType: "PRACTICAL",
          },
          {
            author: "Traditional Orientation",
            tradition: "Karma Yoga",
            title: "The discipline of offering action",
            body: "Traditional Karma Yoga readings often understand this as action offered beyond personal reward. The emphasis is not laziness but purified motivation.",
            interpretationNote: "This is a broad traditional orientation and should not be treated as a single authoritative commentary.",
            layerType: "PHILOSOPHICAL",
            layers: [
              {
                type: "PRACTICAL",
                title: "What is trained",
                body: "The inner training is to act with care while loosening the demand that the outcome confirm the ego.",
              },
              {
                type: "COMPARATIVE",
                title: "Common misunderstanding",
                body: "This is not fatalism. The verse rejects both reward-obsession and attachment to inaction.",
              },
            ],
          },
        ],
        relationships: [
          {
            targetLabel: "Isha Upanishad 2",
            targetTextTitle: "Isha Upanishad",
            targetLocator: "2",
            relationshipType: "PRACTICAL_PARALLEL",
            label: "action without bondage",
            explanation:
              "Both passages are often studied around the question of how action can be performed without deepening bondage. The relationship is practical and interpretive.",
            philosophicalContext: "Useful for comparing renunciation, action, and inner freedom.",
            tradition: "Sanatana Dharma",
            school: "Vedanta",
            confidenceLevel: 68,
            sourceSlug: "upanishads-cross-reference",
          },
        ],
      },
      {
        number: 48,
        slug: "yogasthah-kuru-karmani",
        sanskrit:
          "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय ।\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ॥ २-४८॥",
        transliteration:
          "yogasthaḥ kuru karmāṇi saṅgaṃ tyaktvā dhanañjaya\nsiddhyasiddhyoḥ samo bhūtvā samatvaṃ yoga ucyate",
        wordByWord:
          "yogasthaḥ: established in yoga; kuru: perform; karmāṇi: actions; saṅgam: attachment; tyaktvā: abandoning; dhanañjaya: O Dhananjaya; siddhy-asiddhyoḥ: in success and failure; samaḥ: balanced; bhūtvā: becoming; samatvam: equanimity; yogaḥ: yoga; ucyate: is called.",
        practicalApplication:
          "After doing your best, practice meeting both success and failure as information, not as the final measure of your worth.",
        philosophyInsight:
          "The verse defines yoga here as samatva, evenness of mind. This is one important definition within the Gita's wider teaching.",
        conceptSlugs: ["karma-yoga", "samatva"],
        sourceSlugs: ["bhagavad-gita-scripture", "shlokam-gita-reference", "bhagavadgita-com-reference"],
        meaningLayers: [
          {
            type: "SIMPLE",
            title: "Yoga as steadiness",
            body: "Krishna asks Arjuna to act while remaining balanced in success and failure. This evenness is called yoga.",
          },
          {
            type: "PHILOSOPHICAL",
            title: "A definition of yoga",
            body: "Here, yoga is not primarily posture or technique. It is a stable inner relationship to action and outcome.",
          },
          {
            type: "PRACTICAL",
            title: "Success and failure practice",
            body: "When a result arrives, ask first: What does this teach? This keeps the mind in learning before pride or despair takes over.",
          },
        ],
        commentaries: [
          {
            author: "Bhagwatsharanpriy Study Note",
            tradition: "Learning guide",
            title: "Equanimity is not passivity",
            body: "Equanimity does not make action weak. It makes action cleaner because the mind is less thrown around by praise, blame, winning, and losing.",
            interpretationNote: "This is a practical interpretation for learners.",
            layerType: "PRACTICAL",
          },
        ],
        relationships: [
          {
            targetLabel: "Yoga Sutras 1.12",
            targetTextTitle: "Yoga Sutras",
            targetLocator: "1.12",
            relationshipType: "PRACTICAL_PARALLEL",
            label: "steadiness through disciplined practice",
            explanation:
              "The Gita's equanimity in action can be studied beside Yoga Sutra language around practice and dispassion. The connection is practical, not textual quotation.",
            philosophicalContext: "Helpful for learners comparing Gita yoga with classical Yoga discipline.",
            tradition: "Sanatana Dharma",
            school: "Yoga",
            confidenceLevel: 62,
            sourceSlug: "yoga-sutras-cross-reference",
          },
        ],
      },
    ],
  },
];

export const bhagavadGita: BookContent = {
  slug: "bhagavad-gita",
  title: "Bhagavad Gita",
  subtitle: "A guided study of wisdom, action, self-knowledge, and devotion",
  tradition: "Sanatana Dharma",
  difficulty: "BEGINNER",
  summary:
    "A sacred dialogue between Krishna and Arjuna on the battlefield of Kurukshetra, exploring duty, self-knowledge, disciplined action, devotion, and liberation.",
  beginnerSummary:
    "Begin with the Gita as a conversation about confusion and clarity. Arjuna is overwhelmed, and Krishna teaches him how to see himself, his duty, and reality more deeply.",
  tags: ["Dharma", "Karma Yoga", "Self-knowledge", "Equanimity", "Devotion"],
  concepts,
  sources,
  chapters,
};

export const books = [bhagavadGita] as const;

export function getBookBySlug(slug: string) {
  return books.find((book) => book.slug === slug);
}

export function getChapterByNumber(bookSlug: string, chapterNumber: number) {
  const book = getBookBySlug(bookSlug);
  return book?.chapters.find((chapter) => chapter.number === chapterNumber);
}

export function getVerseByNumber(bookSlug: string, chapterNumber: number, verseNumber: number) {
  const chapter = getChapterByNumber(bookSlug, chapterNumber);
  return chapter?.verses.find((verse) => verse.number === verseNumber);
}

export function getVersePosition(bookSlug: string, chapterNumber: number, verseNumber: number) {
  const book = getBookBySlug(bookSlug);
  const chapter = getChapterByNumber(bookSlug, chapterNumber);

  if (!book || !chapter) {
    return undefined;
  }

  const chapterIndex = book.chapters.findIndex((item) => item.number === chapterNumber);
  const verseIndex = chapter.verses.findIndex((item) => item.number === verseNumber);

  if (chapterIndex < 0 || verseIndex < 0) {
    return undefined;
  }

  const flatVerses = book.chapters.flatMap((item) =>
    item.verses.map((verse) => ({
      chapter: item,
      verse,
      href: `/books/${book.slug}/chapters/${item.number}/verses/${verse.number}`,
    })),
  );
  const flatIndex = flatVerses.findIndex(
    (item) => item.chapter.number === chapterNumber && item.verse.number === verseNumber,
  );

  return {
    chapterIndex,
    verseIndex,
    chapterVerseCount: chapter.verses.length,
    chapterProgress: ((verseIndex + 1) / chapter.verses.length) * 100,
    totalVerseCount: flatVerses.length,
    totalProgress: ((flatIndex + 1) / flatVerses.length) * 100,
    previous: flatVerses[flatIndex - 1],
    next: flatVerses[flatIndex + 1],
  };
}

export function getConceptsForVerse(book: BookContent, verse: VerseContent) {
  return verse.conceptSlugs
    .map((slug) => book.concepts.find((concept) => concept.slug === slug))
    .filter((concept): concept is ConceptContent => Boolean(concept));
}

export function getSourcesForVerse(book: BookContent, verse: VerseContent) {
  return verse.sourceSlugs
    .map((slug) => book.sources.find((source) => source.slug === slug))
    .filter((source): source is SourceContent => Boolean(source));
}
