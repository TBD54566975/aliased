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
      class="invisible-input"
      ref="hiddenInput"
      @input="handleInput"
      @focus="focusHiddenInput"
      @keydown.backspace="handleBackspace"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, defineExpose } from 'vue';

// Define props with TypeScript
interface Props {
  length: number;
  mask?: boolean; // Optional mask prop, defaults to true
  pin: string;    // Custom prop for capturing the PIN value
}

// Props to configure pin length, masking, and two-way binding with "pin"
const props = defineProps<Props>();

// Set default values
const pinLength = Array.from({ length: Math.min(Math.max(props.length ?? 6, 6), 8) });
const mask = props.mask !== undefined ? props.mask : true;

// Array to store the pin digits, initialized with the value of the pin prop
const pin = ref<string[]>(Array.from(props.pin));

// Emit the updated value back to the parent via "update:pin"
const emit = defineEmits<{
  (e: 'update:pin', value: string): void;
}>();

// Watch the pin array and emit the joined value when updated
watch(pin, (newPin) => {
  const newPingString = newPin.join('');
  emit('update:pin', newPingString); // Emit the updated pin
});

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

// Reset the pin array
const resetPin = () => {
  hiddenInput.value!.value = '';
  pin.value = Array(props.length).fill(''); // Clear all entered digits
  focusHiddenInput(); // Refocus the hidden input for new entry
};

// Expose the resetPin method to the parent component
defineExpose({
  resetPin
});

// Ensure the hidden input is always focused to capture numeric input
focusHiddenInput();
</script>

<style scoped>
.invisible-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
  pointer-events: none; /* Prevent any interaction with the hidden input */
  opacity: 0; /* Ensure complete invisibility */
}
</style>
