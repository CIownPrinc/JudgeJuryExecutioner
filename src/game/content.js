export const defendants = [
  { name: 'Mara Vale', occupation: 'night registrar', pronoun: 'she' },
  { name: 'Jonas Bell', occupation: 'dock clerk', pronoun: 'he' },
  { name: 'Eli Ward', occupation: 'apothecary', pronoun: 'they' },
  { name: 'Nadia Cross', occupation: 'rail inspector', pronoun: 'she' },
  { name: 'Silas Pike', occupation: 'debt collector', pronoun: 'he' },
  { name: 'Iona Flint', occupation: 'printer', pronoun: 'she' },
  { name: 'Victor Lark', occupation: 'court musician', pronoun: 'he' },
  { name: 'Petra Noon', occupation: 'quarry forewoman', pronoun: 'she' },
];

export const charges = [
  { name: 'arson', object: 'a locked tax archive', venue: 'the rain-soaked civic quarter' },
  { name: 'embezzlement', object: 'relief-fund coin ledgers', venue: 'the Ministry Annex' },
  { name: 'sabotage', object: 'a courthouse elevator brake', venue: 'Old Hall Station' },
  { name: 'poisoning', object: 'a magistrate’s supper wine', venue: 'The Gilded Spoon' },
  { name: 'smuggling', object: 'sealed medical rations', venue: 'Pier Seventeen' },
  { name: 'forgery', object: 'a pardon bearing the High Seal', venue: 'the Clerk’s Vault' },
];

export const evidenceTitles = {
  testimony: ['Witness Statement', 'Guard Testimony', 'Neighbor Deposition'],
  forensics: ['Lab Note', 'Residue Report', 'Clockwork Analysis'],
  paperwork: ['Stamped Ledger', 'Permit Trail', 'Transfer Record'],
  alibi: ['Alibi Claim', 'Timeline Sketch', 'Transit Stub'],
  character: ['Character Witness', 'Prior Conduct', 'Reputation Note'],
};

export const contradictionNotes = [
  'Cross-examination exposes a changed hour in the second telling.',
  'The official stamp is real, but it was used after the office closed.',
  'The central claim survives scrutiny; the theatrical details collapse.',
  'The paper smells faintly of lamp oil, not archive dust.',
  'The testimony mentions a door that was sealed that evening.',
];

export const crossExamQuestions = [
  'Press the timeline',
  'Challenge the motive',
  'Inspect the document trail',
];
