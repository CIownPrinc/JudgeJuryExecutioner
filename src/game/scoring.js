const weightValue = {
  dismiss: 0,
  light: 0.55,
  heavy: 1,
};

export function playerGuiltScore(cards, weights) {
  let total = 0;
  let weightTotal = 0;

  cards.forEach((card) => {
    const credibility = card.examined ? card.reliability / 100 : 0.62;
    const weightedCredibility = (weightValue[weights[card.id] ?? 'light'] ?? 0.55) * credibility;
    weightTotal += weightedCredibility;
    total += (card.trueLean === 'guilty' ? 1 : -1) * weightedCredibility;
  });

  return Math.max(0, Math.min(1, 0.5 + total / Math.max(3.2, weightTotal * 2.2)));
}

export function gutSignal(score) {
  if (score > 0.72) return { label: 'Strongly Guilty', tone: 'danger' };
  if (score > 0.58) return { label: 'Leans Guilty', tone: 'warm' };
  if (score < 0.28) return { label: 'Strongly Innocent', tone: 'safe' };
  if (score < 0.42) return { label: 'Leans Innocent', tone: 'cool' };
  return { label: 'Unsteady', tone: 'neutral' };
}

export function scoreCase({ verdict, sentence, actualGuilty, truth, playerScore }) {
  const correct = verdict === 'mistrial' ? null : (verdict === 'guilty') === actualGuilty;
  const confidenceGap = Math.round(Math.abs(truth - playerScore) * 100);

  let authority = verdict === 'mistrial' ? -4 : correct ? 10 : -12;
  let integrity = verdict === 'mistrial' ? -2 : correct ? 8 : -16;

  if (sentence === 'imprisonment') authority += correct ? 4 : -6;
  if (sentence === 'execution') {
    authority += correct ? 10 : -18;
    integrity += correct ? -2 : -22;
  }
  if (sentence === 'leniency') {
    authority -= 2;
    integrity += correct ? 5 : -5;
  }

  const headline = verdict === 'mistrial'
    ? 'The docket is sealed as a mistrial.'
    : correct
      ? 'Your ruling survives the night.'
      : 'A cold error enters the record.';

  const explanation = verdict === 'mistrial'
    ? 'You avoided a wrongful mark, but the Ministry dislikes hesitation.'
    : correct
      ? `The hidden truth ${actualGuilty ? 'supported guilt' : 'favored acquittal'}. Your calibration gap was ${confidenceGap} points.`
      : `The hidden truth ${actualGuilty ? 'pointed to guilt' : 'pointed away from guilt'}. Your confidence carried you past the evidence.`;

  return { correct, confidenceGap, authority, integrity, headline, explanation };
}
