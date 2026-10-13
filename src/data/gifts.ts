export interface GiftItem {
  id: number;
  name: string;
  note: string;
}

export const gifts: GiftItem[] = [
  {
    id: 1,
    name: 'Neck pillow',
    note: 'For long travel days.',
  },
  {
    id: 2,
    name: 'Claude Max subscription',
    note: 'Powers most of what I build here.',
  },
];
