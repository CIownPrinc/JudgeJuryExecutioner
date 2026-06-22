import { crossExamQuestions } from '../game/content.js';

function evidenceLean(card) {
  return card.apparentLean === 'guilty' ? 'Incriminates' : 'Exonerates';
}

function evidenceTruth(card) {
  return card.trueLean === 'guilty' ? 'Incriminates' : 'Exonerates';
}

export function renderEvidenceCard(card, options = {}, weights = {}) {
  const truthTag = options.revealTruth ? `<span>Truth: ${evidenceTruth(card)}</span>` : '';
  const crossExamControls = options.canExamine && !card.examined && card.kind === 'testimony'
    ? `<div class="questions">${crossExamQuestions.map((question) => (
      `<button class="tiny" data-action="examine" data-card-id="${card.id}" data-question="${question}">${question}</button>`
    )).join('')}</div>`
    : '';
  const weightControls = options.canWeight
    ? `<div class="weights">${['dismiss', 'light', 'heavy'].map((weight) => (
      `<button class="${weights[card.id] === weight ? 'selected ' : ''}tiny" data-action="weight" data-card-id="${card.id}" data-weight="${weight}">${weight}</button>`
    )).join('')}</div>`
    : '';

  return `
    <article class="card">
      <div class="cardTop">
        <span>${card.title}</span>
        <em>${card.cost} time</em>
      </div>
      <h3>${evidenceLean(card)}</h3>
      <p>${card.text}</p>
      <div class="meta">
        <span>${card.kind}</span>
        <span>${card.examined ? `Reliability ${card.reliability}%` : 'Untested'}</span>
        ${truthTag}
      </div>
      ${crossExamControls}
      ${weightControls}
    </article>
  `;
}

export function renderEvidenceList(cards, options = {}, weights = {}) {
  if (!cards.length) {
    return '<div class="panel empty">No evidence revealed yet. The deck waits.</div>';
  }

  return `<div class="cards">${cards.map((card) => renderEvidenceCard(card, options, weights)).join('')}</div>`;
}
