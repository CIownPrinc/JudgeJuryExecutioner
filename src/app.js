import { generateCase } from './game/caseGenerator.js';
import { gutSignal, playerGuiltScore, scoreCase } from './game/scoring.js';
import { renderEvidenceList } from './ui/templates.js';

const phases = ['intake', 'investigation', 'deliberation', 'sentencing', 'results'];

const state = {
  phase: 'intake',
  caseFile: generateCase(),
  weights: {},
  verdict: null,
  sentence: null,
};

function drawEvidence() {
  const nextCard = state.caseFile.deck.find((card) => !card.revealed);
  if (!nextCard || state.caseFile.courtTime < nextCard.cost) return;

  nextCard.revealed = true;
  state.caseFile.courtTime -= nextCard.cost;
  state.caseFile.revealed.push({ ...nextCard });
}

function examineEvidence(cardId, question) {
  const card = state.caseFile.revealed.find((candidate) => candidate.id === cardId);
  if (!card || card.examined || state.caseFile.courtTime < 1) return;

  state.caseFile.courtTime -= 1;
  card.examined = true;
  card.text += card.contradiction
    ? ` ${card.contradiction}`
    : ` The ${question.toLowerCase()} confirms the central claim.`;
}

function chooseVerdict(verdict) {
  state.verdict = verdict;
  state.phase = verdict === 'guilty' ? 'sentencing' : 'results';
}

function chooseSentence(sentence) {
  state.sentence = sentence;
  state.phase = 'results';
}

function startNewCase() {
  state.phase = 'intake';
  state.caseFile = generateCase();
  state.weights = {};
  state.verdict = null;
  state.sentence = null;
}

function renderPhaseContent(score, signal) {
  const { caseFile } = state;

  if (state.phase === 'intake') {
    return `
      <section class="panel hero">
        <h2>The docket opens.</h2>
        <p>Read the charge, then spend Court Time to reveal evidence. Stop before the clock forces your hand.</p>
        <button data-action="phase" data-phase="investigation">Begin Investigation</button>
      </section>
    `;
  }

  if (state.phase === 'investigation') {
    const canDraw = caseFile.deck.some((card) => !card.revealed) && caseFile.courtTime > 0;
    return `
      <section class="grid">
        <div class="panel">
          <h2>Investigation</h2>
          <p>Reveal cards, then cross-examine suspicious witness evidence. Every extra question costs time.</p>
          <div class="actions">
            <button data-action="draw" ${canDraw ? '' : 'disabled'}>Draw Evidence</button>
            <button class="secondary" data-action="phase" data-phase="deliberation" ${caseFile.revealed.length ? '' : 'disabled'}>Close Investigation</button>
          </div>
        </div>
        ${renderEvidenceList(caseFile.revealed, { canExamine: true })}
      </section>
    `;
  }

  if (state.phase === 'deliberation') {
    return `
      <section class="grid">
        <div class="panel sticky">
          <h2>Deliberation</h2>
          <p>Assign weight. Cross-examined cards reveal more reliable reads.</p>
          <div class="gauge ${signal.tone}">
            <span style="width: ${score * 100}%"></span>
            <b>${signal.label}</b>
          </div>
          <div class="verdicts">
            <button data-action="verdict" data-verdict="guilty">Guilty</button>
            <button class="secondary" data-action="verdict" data-verdict="not_guilty">Not Guilty</button>
            <button class="ghost" data-action="verdict" data-verdict="mistrial">Mistrial</button>
          </div>
        </div>
        ${renderEvidenceList(caseFile.revealed, { canWeight: true }, state.weights)}
      </section>
    `;
  }

  if (state.phase === 'sentencing') {
    return `
      <section class="panel hero">
        <h2>The verdict is guilty. Choose the consequence.</h2>
        <p>Harsh sentences amplify both glory and error. Leniency is safer, unless the court just released a danger.</p>
        <div class="sentences">
          <button data-action="sentence" data-sentence="leniency">Leniency</button>
          <button data-action="sentence" data-sentence="imprisonment">Imprisonment</button>
          <button class="dangerBtn" data-action="sentence" data-sentence="execution">Execution</button>
        </div>
      </section>
    `;
  }

  const result = scoreCase({
    verdict: state.verdict,
    sentence: state.sentence,
    actualGuilty: caseFile.guilty,
    truth: caseFile.truth,
    playerScore: score,
  });

  return `
    <section class="panel results">
      <p class="eyebrow">Truth partially revealed</p>
      <h2>${result.headline}</h2>
      <p>${result.explanation}</p>
      <div class="scorecards">
        <div><span>Authority</span><strong>${result.authority > 0 ? '+' : ''}${result.authority}</strong></div>
        <div><span>Integrity</span><strong>${result.integrity > 0 ? '+' : ''}${result.integrity}</strong></div>
        <div><span>Actual truth</span><strong>${caseFile.guilty ? 'Guilty' : 'Not Guilty'}</strong></div>
      </div>
      <details>
        <summary>Review the evidence file</summary>
        ${renderEvidenceList(caseFile.revealed, { revealTruth: true })}
      </details>
      <button data-action="new-case">Play Another Case</button>
    </section>
  `;
}

function render() {
  const { caseFile } = state;
  const score = playerGuiltScore(caseFile.revealed, state.weights);
  const signal = gutSignal(score);

  document.querySelector('#root').innerHTML = `
    <main class="app">
      <header class="masthead">
        <div>
          <p class="eyebrow">GAVEL · Vertical Slice v0.1</p>
          <h1>Judge, Jury, Executioner</h1>
        </div>
        <div class="seal">⚖</div>
      </header>

      <section class="casefile">
        <div>
          <p class="eyebrow">Case File</p>
          <h2>${caseFile.defendant.name}</h2>
          <p>${caseFile.summary}</p>
        </div>
        <div class="time">
          <span>Court Time</span>
          <strong>${caseFile.courtTime}</strong>
          <small>/ ${caseFile.maxCourtTime}</small>
        </div>
      </section>

      <nav class="steps" aria-label="Case phases">
        ${phases.map((phase) => `<span class="${state.phase === phase ? 'active' : ''}">${phase}</span>`).join('')}
      </nav>

      ${renderPhaseContent(score, signal)}
    </main>
  `;
}

function handleClick(event) {
  const target = event.target.closest('button');
  if (!target) return;

  const { action } = target.dataset;
  if (action === 'phase') state.phase = target.dataset.phase;
  if (action === 'draw') drawEvidence();
  if (action === 'examine') examineEvidence(target.dataset.cardId, target.dataset.question);
  if (action === 'weight') state.weights[target.dataset.cardId] = target.dataset.weight;
  if (action === 'verdict') chooseVerdict(target.dataset.verdict);
  if (action === 'sentence') chooseSentence(target.dataset.sentence);
  if (action === 'new-case') startNewCase();

  render();
}

export function boot() {
  document.addEventListener('click', handleClick);
  render();
}
