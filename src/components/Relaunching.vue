<template>
    <div class="m-4 relative h-screen overflow-hidden">
      <div class="h-full flex flex-col justify-center items-center">
        <p class="my-2 text-4xl">Enter app PIN</p>
        <p class="my-2">Please enter the app PIN to access Aliased.</p>
  
        <!-- PinInput Component -->
        <PinInput
          class="my-4"
          v-model:pin="enteredPin"
          :length="6"
          :mask="true"
        />
  
        <!-- Message for invalid PIN -->
        <p v-if="pinError" class="text-red-500">Invalid PIN. Please try again.</p>
  
        <!-- Submit Button -->
        <button
          class="my-2 w-full bg-[#fcec03] text-black p-2 rounded-full active:bg-yellow-300 disabled:opacity-50"
          :disabled="enteredPin.length < 6"
          @click="submitPin"
        >
          Submit
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import PinInput from './PinInput.vue';
  
  // Reactive variables to store the entered PIN and show an error message if needed
  const enteredPin = ref('');
  const pinError = ref(false);
  
  // Emit event to notify parent component
  const emit = defineEmits(['initialization-complete']);
  
  // Call this method when the user submits the PIN
  const submitPin = () => {
    console.log('Validating PIN...')
    // TODO: remove hardcode that always completes the relaunching initialization
    emit('initialization-complete');
  };

  </script>
  