<template>
  <h1 class="mr3-logo select-none">
    <span class="mr3-red">MR3</span> <span class="mr3-lemon">Randomizer</span>
  </h1>
</template>

<style scoped>
.mr3-logo {
  position: relative;
  display: inline-block;

  margin: 0;

  font-family: "Titan One", system-ui, sans-serif;
  font-size: clamp(3rem, 8vw, 7rem);
  font-weight: 400;

  letter-spacing: -0.02em;
  line-height: 0.9;

  color: transparent;
  -webkit-text-fill-color: transparent;

  /*
   * Small cream outline
   */
  -webkit-text-stroke: 2px #fff2c2;

  /*
   * Gives it a little more game-logo energy.
   */
  transform: skew(-3deg);

  /*
   * Dark offset shadow.
   */
  filter: drop-shadow(3px 4px 0 #47192d)
    drop-shadow(0 2px 1px rgba(0, 0, 0, 0.35));
}

/*
 * Thick dark outer border.
 *
 * This is a duplicate copy of the text sitting behind
 * the gradient text.
 */
.mr3-logo::before {
  content: attr(data-text);

  position: absolute;
  inset: 0;

  z-index: -1;

  color: transparent;
  -webkit-text-fill-color: transparent;

  -webkit-text-stroke: 8px #3a1729;

  transform: translateY(3px);
}

.mr3-red {
  /*
   * Main MR3-ish warm gradient
   */
  background: linear-gradient(
    180deg,
    #fff07a 0%,
    #ffc13a 26%,
    #ff8b32 52%,
    #f2553d 76%,
    #d83343 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
}

.mr3-lemon {
  background: linear-gradient(
    180deg,
    #d9f52b 0%,
    #bfe51e 27%,
    #d9df26 48%,
    #f1d33d 68%,
    #ffd95a 84%,
    #ffe987 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
}
</style>
