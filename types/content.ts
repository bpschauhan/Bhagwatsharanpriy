export type MeaningLayer = {
  title: string;
  body: string;
};

export type ShlokaContent = {
  sanskrit: string;
  transliteration: string;
  layers: MeaningLayer[];
};
