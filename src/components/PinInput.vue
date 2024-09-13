<!-- PinInput.vue -->
<template>
    <div class="flex space-x-2 justify-center">
      <input
        v-for="(digit, index) in pinLength"
        :key="index"
        type="text"
        maxlength="1"
        inputmode="numeric"
        pattern="[0-9]*"
        class="w-12 h-12 text-center text-2xl border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        v-model="pin[index]"
        @input="focusNext(index)"
        @keydown.backspace="focusPrevious(index)"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, nextTick, watch } from 'vue';
  
  // Props to configure pin length
  const props = defineProps({
    length: {
      type: Number,
      default: 6, // Default to 6 digits, but configurable between 6-8
      validator: (value) => value >= 6 && value <= 8,
    },
  });
  
  // Array to store pin digits
  const pin = ref(Array(props.length).fill(''));
  
  // Emit the full PIN as a string
  const emit = defineEmits(['update:pin']);
  watch(pin, (newPin) => {
    emit('update:pin', newPin.join(''));
  });
  
  // Total number of input fields based on the provided length
  const pinLength = Array.from({ length: props.length });
  
  // Automatically focus the next input after entering a digit
  const focusNext = (index) => {
    if (index < props.length - 1 && pin.value[index] !== '') {
      nextTick(() => {
        document.querySelectorAll('input')[index + 1].focus();
      });
    }
  };
  
  // Move focus back on backspace if the current input is empty
  const focusPrevious = (index) => {
    if (index > 0 && pin.value[index] === '') {
      nextTick(() => {
        document.querySelectorAll('input')[index - 1].focus();
      });
    }
  };
  </script>
  
  <style scoped>
  /* Tailwind classes are already used for styling the inputs */
  </style>
  