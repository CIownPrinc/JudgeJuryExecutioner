/** Deterministic linear-congruential RNG for replayable case generation. */
export class Rng {
  #seed;

  constructor(seed = Math.floor(Math.random() * 2 ** 31)) {
    this.#seed = seed || 1;
  }

  next() {
    this.#seed = (this.#seed * 48271) % 0x7fffffff;
    return this.#seed / 0x7fffffff;
  }

  int(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  pick(items) {
    return items[this.int(0, items.length - 1)];
  }

  chance(probability) {
    return this.next() < probability;
  }

  shuffle(items) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = this.int(0, index);
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
  }
}
