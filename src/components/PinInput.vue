<template>
  <div class="flex space-x-2 justify-center">
    <!-- Use "text" with inputmode="numeric" for iPhone -->
    <!-- Triggers the numeric keypad on iPhone -->
    <input
      v-for="(digit, index) in pinLength"
      :key="index"
      type="text"
      maxlength="1"
      inputmode="numeric"
      pattern="[0-9]*"
      class="w-12 h-12 text-center text-2xl border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
      v-model="pin[index]"
      @input="handleInput($event, index)"
      @keydown.backspace="focusPrevious(index)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';

// Define props with TypeScript
interface Props {
  length: number;
}

// Props to configure pin length
const props = defineProps<Props>();

// Ensure the length is between 6 and 8
const pinLength = Array.from({ length: Math.min(Math.max(props.length, 6), 8) });

// Array to store pin digits
const pin = ref(Array(props.length).fill(''));

// Emit the full PIN as a string to the parent
const emit = defineEmits<{
  (e: 'update:pin', pin: string): void;
}>();

watch(pin, (newPin) => {
  emit('update:pin', newPin.join(''));
});

// Handle input and ensure it's a number
const handleInput = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement;
  const value = target.value.replace(/\D/g, ''); // Remove non-digit characters
  pin.value[index] = value ? value[0] : ''; // Keep only the first digit

  if (pin.value[index] !== '') {
    focusNext(index); // Focus the next input if a valid number is entered
  }
};

// Focus the next input after entering a digit
const focusNext = (index: number) => {
  if (index < props.length - 1 && pin.value[index] !== '') {
    nextTick(() => {
      const inputs = document.querySelectorAll<HTMLInputElement>('input');
      inputs[index + 1]?.focus();
    });
  }
};

// Focus previous input on backspace
const focusPrevious = (index: number) => {
  if (index > 0 && pin.value[index] === '') {
    nextTick(() => {
      const inputs = document.querySelectorAll<HTMLInputElement>('input');
      inputs[index - 1]?.focus();
    });
  }
};
</script>

<style scoped>
/* Add basic Tailwind styles */
input {
  width: 3rem;
  height: 3rem;
  font-size: 1.5rem;
  text-align: center;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  box-sizing: border-box;
}
</style>
