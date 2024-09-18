<template>
    <div class="m-4 relative h-screen overflow-hidden">
      <div class="h-full flex flex-col justify-center items-center">
        <p class="my-2 text-4xl">Enter app PIN</p>
        <p class="my-2">{{ instruction }}</p>
  
        <!-- PinInput Component -->
        <PinInput
          class="my-4"
          ref="pinInput"
          v-model:pin="enteredPin"
          :length="6"
          :mask="true"
        />
  
        <!-- Submit Button -->
        <button
          class="my-2 w-full bg-[#fcec03] text-black p-2 rounded-full active:bg-yellow-300 disabled:opacity-50"
          :disabled="currentPinLength < 6"
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
  import { IdentityAgentManager } from '@/IdentityAgentManager';
  import { nextTick } from 'vue';
import { computed } from 'vue';

  // Ref to the PinInput component declared in the template to access PinInput's public methods
  const pinInput = ref();
  
  // Reactive variables to store the entered PIN and show an error message if needed
  const enteredPin = ref('');
  const instruction = ref('Please enter the app PIN to access Aliased.');

  const currentPinLength = computed(() => enteredPin.value.length);

  // Emit event to notify parent component
  const emit = defineEmits(['initialization-complete']);
  
  const pinChanged = (pin: string) => {
    enteredPin.value = pin;
  };

  // Call this method when the user submits the PIN
  const submitPin = async () => {
    try {
      const identityAgentManager = await IdentityAgentManager.singleton();
      await identityAgentManager.initialize(enteredPin.value);
      emit('initialization-complete');
    } catch {
      instruction.value = 'Invalid PIN. Please try again.';
      enteredPin.value = '';
      pinInput.value?.resetPin();
      return;
    }
  };

  </script>
  