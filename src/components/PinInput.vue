<template>
  <div class="flex space-x-2 justify-center">
    <!-- Display each entered digit in a styled box -->
    <div
      v-for="(digit, index) in pinLength"
      :key="index"
      class="w-12 h-12 text-center text-2xl border border-gray-300 rounded flex items-center justify-center"
    >
      <!-- Display the actual digit or asterisk (*) based on the mask prop, or nothing if no digit is entered -->
      {{ mask ? (pin[index] ? '●' : '') : (pin[index] || '') }}
    </div>

    <!-- Hidden input to capture the entire pin -->
    <input
      type="text"
      inputmode="numeric"
      maxlength="1"
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
import { ref, onMounted, onBeforeUnmount, nextTick, watch, defineExpose } from 'vue';

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
  const newPinString = newPin.join('');
  emit('update:pin', newPinString); // Emit the updated pin
});

// Reference to the hidden input
const hiddenInput = ref<HTMLInputElement | null>(null);
const submitButton = ref<HTMLElement | null>(null); // Reference to the Submit button

// Focus the hidden input box for capturing numeric input
const focusHiddenInput = () => {
  nextTick(() => {
    hiddenInput.value?.focus();
  });
};

// Handle the input and update the pin array
const handleInput = (event: Event) => {
  const hiddenInputElement = event.target as HTMLInputElement;
  const value = hiddenInputElement.value.replace(/\D/g, ''); // Only keep digits

  // Only add the new digit if there is space left in the pin array
  if (value && pin.value.length < props.length) {
    // Add the new digit to the pin array
    // NOTE: notice the use of the spread operator to create a new array to trigger reactivity
    pin.value = [...pin.value, value];

    hiddenInputElement.value = ''; // Clear the input field to allow for the next digit
  }
  focusHiddenInput(); // Refocus the input after each input
};

// Handle backspace to remove digits from the pin array
const handleBackspace = (event: KeyboardEvent) => {
  if (event.key === 'Backspace') {
    // NOTE: notice the use of the spread operator to create a new array to trigger reactivity
    const newPin = [...pin.value];
    newPin.pop(); // Remove the last digit entered
    pin.value = newPin; // Remove the last digit entered
    focusHiddenInput(); // Refocus input for further keypresses
  }
};

// Reset the pin array
const resetPin = () => {
  pin.value = []; // Clear all entered digits
  emit('update:pin', ''); // Emit an empty pin to the parent
  focusHiddenInput(); // Refocus the hidden input for new entry
};

// Handle global click events to refocus the hidden input unless the Submit button is clicked
const handleGlobalClick = (event: MouseEvent) => {
  if (submitButton.value && submitButton.value.contains(event.target as Node)) {
    // Do not refocus if the Submit button is clicked
    return;
  }

  // Otherwise, refocus the hidden input
  focusHiddenInput();
};

// Expose the resetPin method to the parent component
defineExpose({
  resetPin
});

// Add global click listener on mount and remove it on unmount
onMounted(() => {
  document.addEventListener('click', handleGlobalClick);
  focusHiddenInput(); // Ensure the hidden input is focused on component mount
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleGlobalClick);
});
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
