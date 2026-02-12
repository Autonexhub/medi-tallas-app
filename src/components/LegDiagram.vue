<script setup lang="ts">
const props = defineProps<{
  activePoint: string | null
  mediaType: 'AD' | 'AG' | 'AT'
}>()

function isActive(point: string) {
  return props.activePoint === point
}
</script>

<template>
  <div class="leg-diagram">
    <svg class="o-product-size-table__graphic" viewBox="0 30 223 340">
      <path id="leg" d="M140.8 40.3c-.2 4.4-.5 10.5-.8 17.3-.3 5.8-.6 12.2-.9 18.5l-.1 1.8c-.8 15.3-1.6 30-2.4 36.4s-2.1 14.4-3.4 22.5l-.3 1.9c-.1.6-.2 1.3-.3 1.9-1.1 7.1-2.2 13.9-3 19.5 0 .4-.1 1.5-.1 3.1s-.1 3.7-.2 5.9v.8c-.1 2.4-.3 4.8-.8 7.2-1.6 6.6-5 14.4-6.5 17.8l-.6 1.4c-1.6 3.9-3.2 13.9-4.5 23.9l-.2 1.3c-1.1 8.7-1.9 17.3-2.2 21.4-.3 3.6-.9 9.6-1.5 15.5l-.1.9-.1.8v.4l-.1.8c-.8 7.4-1.6 14.1-1.6 14.7-.2 1.1-3 17.2-.6 30.3 1.6 8.5 7.7 21.7 11.7 25.6 4.8 4.8 10.3 8.1 18.5 11.2 1.9.7 4.3 1.5 6.7 2.1l.7.2c2.4.4 4.8 1.1 7.1 2.1 1.5.5 3.1.7 4.7.5.7-.1 1.3.1 1.9.4.5.2.8.5 1.1 1 .1.5.5 1.1 0 1.7-.9.8-2.1 1.3-3.3 1.5-2.6.7-5.3.7-7.9.2-1.7-.4-3.4-.7-5.1-.6-1.3.1-4.2.5-6 .7-.7.1-1.2.2-1.3.2-3.5 0-7-.6-10.2-1.9l-.6-.2-.7-.3-.5-.2c-4.9-2-10.1-3-15.4-2.9-4.6.1-9.1 1-13.5 2.5-1.6.6-3.3 1-5 1.2-2.5.2-5-.3-7.3-1.4-1.8-.8-3.1-2.2-3.9-4-1.1-3.5.2-9.4 2.1-13.3 2.2-4.4 3.7-9.8 3.7-20.1 0-4.6-2.4-20.5-4.9-37.4l-.2-1.2-.1-.6-.5-3.2-.3-2.2c-2.6-16.9-5-33.3-5-38.8 0-11.5 4.7-29.6 6-34.6.4-1.5 1-3.4 1.6-5.3 1.5-4.7 3.1-10 3.5-13.6.4-3.2-.2-10-1.1-16.8l-.2-1.1c-.5-3.7-1.1-7.4-1.6-10.5-1.5-8.7-7.8-86.1-8.9-106.6" style="fill:none;stroke:#48586a"></path>

      <!-- lG -->
      <g v-if="mediaType !== 'AD'" class="o-product-size-table__measurement-point--lG" :class="{ 'is-active': isActive('length') }">
        <text transform="translate(22.58 77.31)">lG</text>
        <path class="lG" d="m52.9 48.6 9.2 9.8-6.3-.7v298.1h-6.4v-298c-2.6.3-5.7.7-5.7.7l9.2-9.9z"></path>
      </g>

      <!-- lD -->
      <g v-if="mediaType === 'AD'" class="o-product-size-table__measurement-point--lD" :class="{ 'is-active': isActive('length') }">
        <text transform="translate(22.58 214.74)">lD</text>
        <path d="m52.9 190.3 9.2 9.8-6.3-.7v156.5h-6.4V199.5c-2.6.3-5.7.7-5.7.7l9.2-9.9z"></path>
      </g>

      <!-- cG -->
      <g v-if="mediaType !== 'AD'" class="o-product-size-table__measurement-point--cG" :class="{ 'is-active': isActive('cG') }">
        <text transform="translate(177.65 75.19)">cG</text>
        <path d="m75.8 56.1.6 6.7c-.7.2-1.4.3-2 .5 5 1.3 15.6 2.8 25.7 3.3v-.5l-.1-.6c-.3-2.6-.6-5.4-.6-5.5l10.3 10.1-10.3 10.1s.3-2.3.5-4.8v-1l.1-1h-1c-15.8-.8-30.1-3.7-30.6-6.5V66.6c0-.1 0 0 0 0v-6.8c.2-1.4 2.9-2.7 7.4-3.7zm66.2.7c4 1 7 2.4 7.1 3.7v7.1c-.6 3-16.7 5.5-34.3 5.9h-2.2l2.4-3.4-3.2-3.3c12-.1 25.3-1.2 31.5-2.8-.4-.1-1-.3-1.5-.4l.2-6.8z"></path>
      </g>

      <!-- cF -->
      <g v-if="mediaType !== 'AD'" class="o-product-size-table__measurement-point--cF" :class="{ 'is-active': isActive('cF') }">
        <text transform="translate(179.25 121.7)">cF</text>
        <path d="m79.5 103 .5 6.4c-.7.2-1.9.7-2.5.8 4.9 1.3 13.1 2.3 22.3 2.8l-.1-.9-.1-.6c-.2-1.9-.4-3.8-.5-4.6v-.5l10.1 9.9-10 10s.3-2.6.5-5.3v-.6l.1-.9c-15.4-.7-27.6-3.2-28.1-5.9V107c.1-1.6 3.4-3 7.8-4zm60.2.8c3.9 1 6.3 2.1 6.4 3.4v7c-.6 3.1-15.8 5.5-34 5.7l2.4-3.4-3.2-3.3c11.8-.1 22.9-1 29-2.6l-1.1-.2.5-6.6z"></path>
      </g>

      <!-- cE -->
      <g v-if="mediaType !== 'AD'" class="o-product-size-table__measurement-point--cE" :class="{ 'is-active': isActive('cE') }">
        <text transform="translate(179.04 191.47)">cE</text>
        <path d="m86.6 172.8.1 3-.6 3.5c-.9.2-1.5.6-2.2.9l.3.1c5 1.4 10.1 2.2 15.3 2.4 0-.4-.1-.8-.1-1.1l-.1-.6c-.2-2.4-.5-4.6-.5-4.6l9.8 9.6-9.7 9.7c0-.4.4-3.8.7-6.5-12.1-.6-19.9-2.9-20.3-5.6V177c0-1.5 2.9-3.1 7.3-4.2zm44.6.6c3.6 1 6.2 2.2 6.3 3.6v6.8c-.5 3-12 5.5-26.6 5.7l3.1-3.3-3.7-3.1c9.5-.1 17.7-1.2 22.6-2.7-.6-.2-2.2-.4-2.9-.6l1.2-6.4z"></path>
      </g>

      <!-- cD -->
      <g class="o-product-size-table__measurement-point--cD" :class="{ 'is-active': isActive('cD') }">
        <text transform="translate(176.9 212.62)">cD</text>
        <path d="m82.5 191-2.1 7.6c-.8.2-2.2.7-2.8 1 2.7 1.2 11.2 3.4 17.6 4.2 0-.3 0-.5-.1-.8l-.1-.9c-.2-1.7-.4-3.3-.4-3.9v-.2l9.3 9.1-9.3 9.2s.2-2.2.5-4.5v-.6c0-.5.1-.9.1-1.4-8.4-1-21-4.4-21.3-6.9l.5-6.5v-.1c.2-1.3 5.4-4.4 8.1-5.3zm42 3.3c3.5 1 5.8 2.6 5.8 4.1v6.4c-.2 2.1-8.6 4-16.9 4.9l-.8.1-.8.1c-2.4.2-4.8.4-6.9.4l2.7-3.1-3.1-3c6.4-.1 19.3-1.2 22.6-2.7h-.1c-.9-.4-3.7-1.2-4.6-1.4l.5-2.3 1.6-3.5z"></path>
      </g>

      <!-- cC -->
      <g class="o-product-size-table__measurement-point--cC" :class="{ 'is-active': isActive('cC') }">
        <text transform="translate(178.35 237.28)">cC</text>
        <path d="m76.7 216.2-.9 6.9c-.8.3-2.1.6-2.8.9 2.5 1.1 10.1 3.1 16.3 4.1-.3-2.7-.6-5.8-.6-5.8l9.6 9.4-9.6 9.5v-.1c.1-.6.4-4 .7-6.7-8.4-1.3-19.4-4.7-19.7-7.1v-6.6c.2-1.4 4.2-3.5 7-4.5zm42.5 2.4c3.6 1 5.8 2.5 5.9 4v6.6c-.3 2.4-9.7 4.4-18.7 5.3l-.8.1c-2 .2-4 .3-5.9.4l2.8-3.2-3.2-3.1c2.5 0 5.8-.2 9.1-.5l1-.1c5.3-.5 10.4-1.3 12.4-2.1-.7-.3-2.5-.8-3.4-1.1l.8-6.3z"></path>
      </g>

      <!-- cB1 -->
      <g class="o-product-size-table__measurement-point--cB1" :class="{ 'is-active': isActive('cB1') }">
        <text transform="translate(170.95 272.52)">cB1</text>
        <path d="m78.3 254.7.8 5.8c-.7.2-1.4.5-2.1.8 4.3 1.5 8.7 2.6 13.3 3.1-.2-2.6-.6-5.6-.6-5.6l9.2 9-9.1 9.1s.3-2.5.5-5l.1-.5c0-.3 0-.6.1-.9-7.4-1-16.2-3.7-16.4-6v-6.3c-.1-1.3 1.5-2.5 4.2-3.5zm37.1 1.3c3.4 1 5.6 2.3 5.6 3.8v6.3c-.3 2.8-11.4 4.6-21.1 4.8l2.6-3.1-3.1-2.9c6.3-.1 15.2-.6 18.4-2-.7-.3-2.4-.8-3.3-1l.9-5.9z"></path>
      </g>

      <!-- cB -->
      <g class="o-product-size-table__measurement-point--cB" :class="{ 'is-active': isActive('cB') }">
        <text transform="translate(178.07 313.15)">cB</text>
        <path d="m85.7 305.1.6 5.4c-.7.2-1.3.5-2 .8 2.5 1 5.1 1.7 7.8 2v-.5l-.1-.8c-.2-2.1-.5-4.1-.5-4.1l8.7 8.5-8.7 8.6c0-.3.3-2.4.5-4.5v-.5l.1-.9c-5.7-.8-10.5-2.5-10.7-4.6v-6c.1-1.4 1.8-2.5 4.3-3.4zm26.4-.4c3.2.9 5.8 2.3 5.8 3.7v6c-.3 2.7-7.5 4.8-16.7 5l2.5-2.9-2.9-2.8c5.9-.1 11.1-1 14.2-2.4-.5-.3-1-.5-1.5-.6l-1.4-6z"></path>
      </g>

      <!-- cY -->
      <g class="o-product-size-table__measurement-point--cY" :class="{ 'is-active': isActive('cY') }">
        <text transform="translate(178.07 333)">cY</text>
        <path d="m99.8 334.3 11.9 2.6-2.6 11.8-.1-.1-.1-.2c-.3-.6-1-2.1-1.8-3.6l-.2-.5-.4-.8c-12.7 7.9-25.5 12.3-27.2 10.2l-.1-.1-2.9-4.9c-.6-1.1 1.8-4.4 4-6.2-.1 1.1-.1 2.2.1 3.3.2.9.6 1.8 1 2.7-.4.3-.7.7-1 1.1l-.1.2c3-.3 17.2-6.3 23.2-10.8-1.6-2-3.7-4.6-3.7-4.6v-.1zm22.7-13.5 3.1 5.1c1.1 2.5-4 8-11.7 12.8l.7-3.8-3.9-.9c5-3.1 9-6.5 10.9-9.2l-1.8.3-2.5-4.9c1.8-.4 4.4-.6 5.2.6z"></path>
      </g>

      <!-- cA -->
      <g class="o-product-size-table__measurement-point--cA" :class="{ 'is-active': isActive('cA') }">
        <text transform="translate(178.05 355.68)">cA</text>
        <path d="m152 350.6 3.9 9.3c-1.2-1-2.6-1.9-4-2.6-2.5 8-12.2 3.1-12.3-2.2l3.7-.4.9-.2-2.1-.6-.2-.1c-.6-.2-.6-.2.1-.2l10-3zm-6.3 4.3c.1 2.1-.1 3.2.7 1.6l.1-.2.5-1c-.5-.1-.9-.2-1.3-.4zm9-14.6c2 1.2 3.2 2-.1 10.8l-1.3-3.3-3.8 1.8c.5-1.6.9-3.2 1.3-4.8v-.1l-5.2-1.5c3.9-6.2 8.6-3.2 9.1-2.9zm-3.4.7c-.3 1.8-.3 2.6-.5 3.7v.1l.2.1c.5-.6 1.2-1.9 1.7-2.5l.1-.1c.1-.2-1.5-1.4-1.5-1.3z"></path>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.leg-diagram {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.leg-diagram svg {
  width: 100%;
  max-width: 223px;
  height: auto;
}

/* Estilos base del SVG de medi */
.o-product-size-table__graphic text {
  font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  font-weight: 600;
  fill: #48586a;
}

.o-product-size-table__graphic path {
  fill: #c5ced4;
  transition: fill 0.2s ease;
}

.o-product-size-table__graphic #leg {
  fill: none;
  stroke: #48586a;
}

/* Estado activo */
.o-product-size-table__graphic g.is-active text {
  fill: #E10074;
}

.o-product-size-table__graphic g.is-active path {
  fill: #E10074;
}
</style>
