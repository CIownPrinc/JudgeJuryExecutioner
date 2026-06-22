import { charges, contradictionNotes, defendants, evidenceTitles } from './content.js';
import { Rng } from './random.js';

const evidenceKinds = ['testimony', 'forensics', 'paperwork', 'alibi', 'character', 'testimony', 'paperwork', 'alibi'];

function opposingLean(lean) {
  return lean === 'guilty' ? 'innocent' : 'guilty';
}

function buildEvidenceText(kind, lean, reliable, defendant, charge, rng) {
  const unreliableTell = reliable
    ? ''
    : rng.pick(['The phrasing is oddly rehearsed. ', 'A clerk’s correction mark is missing. ', 'The timing feels too neat. ']);
  const supportsGuilt = lean === 'guilty';
  const firstName = defendant.name.split(' ')[0];

  const textByKind = {
    testimony: supportsGuilt
      ? `A witness places ${defendant.name} near ${charge.object} shortly before the alarm.`
      : `A witness insists ${defendant.name} was arguing across town when the alarm sounded.`,
    forensics: supportsGuilt
      ? `Traces on ${firstName}'s coat match residue from ${charge.venue}.`
      : `Material found at the scene does not match ${firstName}'s tools or clothing.`,
    paperwork: supportsGuilt
      ? `A signed form gives ${defendant.name} access to ${charge.object}.`
      : 'A registry entry suggests someone else had custody of the relevant keys.',
    alibi: supportsGuilt
      ? `${defendant.name}'s timeline has a narrow unaccounted gap exactly when it matters.`
      : `A ticket punch supports ${defendant.name}'s claim of being elsewhere.`,
    character: supportsGuilt
      ? 'Two prior complaints describe a motive for revenge against the office.'
      : 'Colleagues describe cautious habits and no clear motive.',
  };

  return `${unreliableTell}${textByKind[kind]}`;
}

export function generateCase(seed) {
  const rng = new Rng(seed);
  const defendant = rng.pick(defendants);
  const charge = rng.pick(charges);
  const truth = Math.round((0.25 + rng.next() * 0.5) * 100) / 100;
  const guilty = truth >= 0.5;

  const deck = rng.shuffle(evidenceKinds).map((kind, index) => {
    const reliable = rng.chance(0.66);
    const trueLean = rng.chance(guilty ? 0.68 : 0.32) ? 'guilty' : 'innocent';
    const apparentLean = reliable ? trueLean : opposingLean(trueLean);

    return {
      id: `${kind}-${index}-${rng.int(100, 999)}`,
      kind,
      title: rng.pick(evidenceTitles[kind]),
      text: buildEvidenceText(kind, apparentLean, reliable, defendant, charge, rng),
      apparentLean,
      trueLean,
      reliability: reliable ? rng.int(70, 95) : rng.int(20, 48),
      cost: rng.chance(0.72) ? 1 : 2,
      revealed: false,
      examined: false,
      contradiction: reliable ? '' : rng.pick(contradictionNotes),
    };
  });

  return {
    defendant,
    charge,
    truth,
    guilty,
    maxCourtTime: 6,
    courtTime: 6,
    deck,
    revealed: [],
    summary: `${defendant.name}, ${defendant.occupation}, stands accused of ${charge.name} involving ${charge.object} in ${charge.venue}. The docket is thin, the press is impatient, and the court clock is already running.`,
  };
}
