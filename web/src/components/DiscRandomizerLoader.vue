<script setup>
import { computed, ref, useId } from 'vue'

const props = defineProps({
  size: { type: [Number, String], default: 280 },
  autoStart: { type: Boolean, default: true },
  // Durations are in milliseconds.
  introDuration: { type: Number, default: 7000 },
  spinDuration: { type: Number, default: 3800 },
  transformDuration: { type: Number, default: 2200 },
})

// Instance-specific SVG IDs allow several loaders on the same page (and SSR).
const id = `disc-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
const run = ref(0)
const running = ref(props.autoStart)
const pieces = [
  { angle: 0, color: '#60baff' },
  { angle: 90, color: '#ff617f' },
  { angle: 180, color: '#63e6a0' },
  { angle: 270, color: '#ffdc62' },
]

const style = computed(() => ({
  '--size': typeof props.size === 'number' ? `${props.size}px` : props.size,
  '--intro': `${Math.max(0, props.introDuration)}ms`,
  '--spin': `${Math.max(1, props.spinDuration)}ms`,
  '--swap': `${Math.max(1, props.transformDuration)}ms`,
  '--play': running.value ? 'running' : 'paused',
}))

// autoStart selects the initial state. start() resumes; replay() starts over.
function start() { running.value = true }
function replay() {
  run.value += 1
  running.value = true
}
defineExpose({ start, replay })
</script>

<template>
  <div
    :key="run"
    class="disc-loader"
    :style="style"
    role="status"
    aria-label="Randomizing game. Please wait."
  >
    <div class="disc-shadow" aria-hidden="true" />
    <div class="disc-plane" aria-hidden="true">
      <svg class="disc-spin" viewBox="0 0 240 240" focusable="false">
        <defs>
          <!-- An exact quarter of an annulus: the hole is truly transparent. -->
          <clipPath :id="`${id}-wedge`" clipPathUnits="userSpaceOnUse">
            <path d="M120 30 A90 90 0 0 1 210 120 L136 120 A16 16 0 0 0 120 104 Z" />
          </clipPath>
          <radialGradient :id="`${id}-metal`">
            <stop offset="0" stop-color="#061839" stop-opacity=".75" />
            <stop offset=".18" stop-color="#e6f8ff" stop-opacity=".92" />
            <stop offset=".23" stop-color="#142641" stop-opacity=".65" />
            <stop offset=".29" stop-color="#effaff" stop-opacity=".55" />
            <stop offset=".34" stop-color="#effaff" stop-opacity=".05" />
            <stop offset=".72" stop-color="#fff" stop-opacity=".22" />
            <stop offset=".94" stop-color="#0a244f" stop-opacity=".34" />
            <stop offset=".98" stop-color="#e9fbff" stop-opacity=".8" />
            <stop offset="1" stop-color="#153259" stop-opacity=".85" />
          </radialGradient>
          <linearGradient :id="`${id}-sheen`" x1="0" y1=".15" x2="1" y2=".85">
            <stop offset="0" stop-color="#fff" stop-opacity="0" />
            <stop offset=".22" stop-color="#b0fcff" stop-opacity=".2" />
            <stop offset=".36" stop-color="#fff" stop-opacity=".8" />
            <stop offset=".43" stop-color="#b3acff" stop-opacity=".2" />
            <stop offset=".5" stop-color="#fff" stop-opacity="0" />
            <stop offset=".64" stop-color="#ffb3ed" stop-opacity=".35" />
            <stop offset=".71" stop-color="#f9ffce" stop-opacity=".65" />
            <stop offset=".8" stop-color="#b0fcff" stop-opacity=".16" />
            <stop offset="1" stop-color="#fff" stop-opacity="0" />
          </linearGradient>
          <g :id="`${id}-surface`">
            <circle cx="120" cy="120" r="90" fill="currentColor" />
            <circle cx="120" cy="120" r="90" :fill="`url(#${id}-metal)`" />
            <circle cx="120" cy="120" r="90" :fill="`url(#${id}-sheen)`" />
            <!-- Fine concentric grooves and a metallic hub. -->
            <g fill="none" stroke="#eefaff">
              <circle cx="120" cy="120" r="89" stroke-width=".8" opacity=".8" />
              <circle cx="120" cy="120" r="85" stroke-width=".35" opacity=".5" />
              <circle v-for="r in [36, 42, 48, 54, 60, 66, 72, 78, 82]" :key="r"
                cx="120" cy="120" :r="r" stroke-width=".25" opacity=".22" />
              <circle cx="120" cy="120" r="26" stroke-width="1" opacity=".65" />
              <circle cx="120" cy="120" r="22" stroke-width=".5" opacity=".75" />
              <circle cx="120" cy="120" r="16.8" stroke-width="1.4" opacity=".85" />
            </g>
            <path d="M51 86 A77 77 0 0 1 100 46" fill="none"
              stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".75" />
          </g>
        </defs>

        <g v-for="(piece, index) in pieces" :key="piece.angle"
          :transform="`rotate(${piece.angle} 120 120)`"
          :style="{ '--stagger': (index - 1) * 0.07 }">
          <g :class="index === 0 ? 'disc-kept' : 'disc-out'" color="#60baff">
            <g :clip-path="`url(#${id}-wedge)`">
              <!-- Counter-rotate the finish so blue wedges form one seamless disc. -->
              <use :href="`#${id}-surface`" :transform="`rotate(${-piece.angle} 120 120)`" />
            </g>
          </g>
          <g v-if="index !== 0" class="disc-in" :color="piece.color">
            <g :clip-path="`url(#${id}-wedge)`">
              <use :href="`#${id}-surface`" :transform="`rotate(${-piece.angle} 120 120)`" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.disc-loader {
  position: relative;
  display: inline-block;
  width: var(--size);
  max-width: 100%;
  aspect-ratio: 1;
  isolation: isolate;
  overflow: hidden;
  overflow: clip;
  vertical-align: middle;
  perspective: 800px;
}

.disc-shadow {
  position: absolute;
  left: 20%;
  right: 20%;
  bottom: 15%;
  height: 12%;
  border-radius: 50%;
  background: radial-gradient(ellipse, #15325a55, #15325a00 70%);
  filter: blur(6px);
}

.disc-plane {
  position: absolute;
  inset: 0;
  transform: rotateX(38deg) rotateY(-12deg) rotateZ(-16deg);
  /* A narrow offset shadow gives the outer rim a little physical thickness. */
  filter: drop-shadow(0 2px 0 #30476e) drop-shadow(0 9px 7px #10294b33);
}

.disc-spin {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
  animation: disc-spin var(--spin) linear infinite;
  animation-play-state: var(--play);
}

.disc-out,
.disc-in {
  transform-box: view-box;
  transform-origin: 120px 120px;
  animation-fill-mode: both;
  animation-play-state: var(--play);
}

.disc-out {
  animation-name: disc-depart;
  animation-duration: calc(var(--swap) * .39);
  animation-delay: calc(var(--intro) + var(--swap) * var(--stagger));
  animation-timing-function: cubic-bezier(.45, 0, .7, .5);
}

.disc-in {
  animation-name: disc-arrive;
  animation-duration: calc(var(--swap) * .52);
  animation-delay: calc(var(--intro) + var(--swap) * (.34 + var(--stagger)));
  animation-timing-function: cubic-bezier(.16, .8, .25, 1);
}

@keyframes disc-spin {
  to { transform: rotate(360deg); }
}

@keyframes disc-depart {
  0% { transform: translate(0, 0) rotate(0); opacity: 1; }
  28% { transform: translate(7px, -7px) rotate(3deg); opacity: 1; }
  85% { opacity: 1; }
  100% { transform: translate(320px, -320px) rotate(28deg); opacity: 0; }
}

@keyframes disc-arrive {
  0% { transform: translate(320px, -320px) rotate(-24deg); opacity: 0; }
  12% { opacity: 1; }
  70% { transform: translate(-3px, 3px) rotate(1deg); opacity: 1; }
  86% { transform: translate(1px, -1px) rotate(-.4deg); opacity: 1; }
  100% { transform: translate(0, 0) rotate(0); opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .disc-spin, .disc-out, .disc-in { animation: none; }
  .disc-out { opacity: 0; }
  .disc-in { opacity: 1; }
}
</style>
