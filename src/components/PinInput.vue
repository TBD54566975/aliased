<template>
  <div class="flex space-x-2 justify-center">
    <!-- Display each entered digit in a styled box -->
    <div
      v-for="(digit, index) in pinLength"
      :key="index"
      class="w-12 h-12 text-center text-2xl border border-gray-300 rounded flex items-center justify-center"
    >
      <!-- Display the actual digit or asterisk (*) based on the mask prop, or nothing if no digit is entered -->
      {{ mask ? (pin[index] ? '*' : '') : (pin[index] || '') }}
    </div>
    <!-- Hidden input to capture the entire pin -->
    <input
      type="text"
      inputmode="numeric"
      maxlength="8"
      pattern="[0-9]*"
      class="sr-only"
      ref="hiddenInput"
      @input="handleInput"
      @focus="focusHiddenInput"
      @keydown.backspace="handleBackspace"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';

// Define props with TypeScript
interface Props {
  length: number;
  mask?: boolean; // Optional mask prop, defaults to true
}

// Props to configure pin length and masking
const props = defineProps<Props>();

// Set default values (since we cannot use 'default' in TypeScript props)
const pinLength = Array.from({ length: Math.min(Math.max(props.length ?? 6, 6), 8) }); // Default to length 6 if not provided
const mask = props.mask !== undefined ? props.mask : true; // Default to true for masking

// Array to store the pin digits
const pin = ref(Array(pinLength.length).fill(''));

// Reference to the hidden input
const hiddenInput = ref<HTMLInputElement | null>(null);

// Focus the hidden input box for capturing numeric input
const focusHiddenInput = () => {
  nextTick(() => {
    hiddenInput.value?.focus();
  });
};

// Handle the input and update the pin array
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value.replace(/\D/g, ''); // Only keep digits
  pin.value = value.split('').slice(0, props.length); // Update the pin array with the digits entered
  target.value = pin.value.join(''); // Sync the input value with the pin digits
};

// Handle backspace to remove digits from the pin array
const handleBackspace = (event: KeyboardEvent) => {
  if (event.key === 'Backspace') {
    pin.value.pop();
  }
};

// Ensure the hidden input is always focused to capture numeric input
focusHiddenInput();
</script>

<style scoped>
.sr-only {
  @apply absolute w-px h-px p-0 m-0 overflow-hidden whitespace-nowrap border-0;
  clip: rect(0, 0, 0, 0);
}
</style>
