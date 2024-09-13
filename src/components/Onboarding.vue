<template>
  <div class="m-4 relative h-screen overflow-hidden">
    <div :key="currentStep" class="absolute inset-0 w-full h-full">
      <!-- Step 1 -->
      <div v-if="currentStep === 1">
        <div class="h-screen flex flex-col justify-center items-center">
          <p class="my-6 text-4xl">Welcome to Aliased</p>
          <p class="my-2">Take control of your online identity and personal data.</p>
          <p class="my-2">Sign into apps with an identity you own and control.</p>
          <button
            class="my-2 w-full bg-[#fcec03] text-black p-2 rounded-full active:bg-yellow-300"
            @click="nextStep">Create a new wallet</button>
        </div>
      </div>

      <!-- Step 2 -->
      <div v-if="currentStep === 2">
        <div class="h-screen flex flex-col justify-center">
          <p class="my-2 text-4xl">Create Profile</p>
          <p class="my-2">A profile is a version of yourself online. When you connect to an app, you'll pick which profile to connect. Like email addresses, profiles are separate and not connected to one another.</p>
          <p class="my-2">You can always create, delete, and edit profiles later.</p>

          <!-- Profile Name Input -->
          <div class="w-full max-w-lg mb-6">
            <label for="profile-name" class="block mb-2 font-semibold">Name your profile:</label>
            <input
              id="profile-name"
              ref="profileNameInput"
              type="text"
              class="w-full p-2 border border-gray-300 rounded"
              v-model="profileName"
              placeholder="Enter profile name"
            />
          </div>

          <!-- DWN Endpoint Input -->
          <div class="w-full max-w-lg mb-6">
            <label for="dwn-endpoint" class="block mb-2 font-semibold">DWN endpoint:</label>
            <input
              id="dwn-endpoint"
              type="text"
              class="w-full p-2 border border-gray-300 rounded"
              v-model="dwnEndpoint"
            />
          </div>

          <button @click="nextStep" class="my-2 w-full bg-[#fcec03] text-black p-2 rounded-full active:bg-yellow-300">Next</button>
          <button @click="previousStep" class="my-2 w-full bg-gray-500 text-white p-2 rounded-full active:bg-gray-600">Previous</button>
        </div>
      </div>

      <!-- Step 3 -->
      <div v-if="currentStep === 3">
        <div class="h-screen flex flex-col justify-center items-center">
          <p class="my-2 text-4xl">Lastly, let's create your app PIN.</p>
          <p class="my-2">You will use this PIN to login when you launch Aliased next time.</p>

          <!-- PinInput Component -->
          <PinInput
            class="my-4" :length="6" :mask="false"/>

          <button @click="completeOnboarding" class="my-2 w-full bg-[#fcec03] text-black p-2 rounded-full active:bg-yellow-300">Finish</button>
          <button @click="previousStep" class="my-2 w-full bg-gray-500 text-white p-2 rounded-full active:bg-gray-600">Previous</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang=ts>
import { ref, watch, nextTick } from 'vue';
import PinInput from './PinInput.vue'; // Import the PinInput component

// Track the current step in the onboarding flow
const currentStep = ref(1);

// Inputs for Step 2
const profileName = ref('');
const dwnEndpoint = ref('https://dwn.tbddev.org/beta');

// Pin value for Step 3
const pin = ref('');

// Reference to the profile name input element
const profileNameInput = ref<HTMLInputElement>();

// Watch the currentStep value and focus on the profile input when step 2 is shown
watch(currentStep, async (newStep) => {
  if (newStep === 2) {
    await nextTick(); // Needed this line to ensure DOM is fully updated before attempting to focus on profile name input
    profileNameInput.value?.focus();
  }
});

// Capture the entered PIN in Step 3
const pinEntered = (newPin: string) => {
  pin.value = newPin;
};

// Emit event to notify parent component
const emit = defineEmits(['onboarding-complete']);

// Move to the next step
const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++;
  }
};

// Move to the previous step
const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

// Complete the onboarding process
const completeOnboarding = () => {
  emit('onboarding-complete');
};
</script>

