export const wisdomBranches = ["Vedas", "Gita", "Upanishads", "Yoga", "Tantra", "Darshanas"] as const;

export type WisdomBranch = (typeof wisdomBranches)[number];
