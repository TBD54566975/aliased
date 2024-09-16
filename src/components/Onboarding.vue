<template>
  <div class="m-4 relative h-screen overflow-hidden">
    <div :key="currentStep" class="absolute inset-0 w-full h-full">
      <!-- Step 1 -->
      <div v-if="currentStep === 1">
        <div class="h-screen flex flex-col justify-center">
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

          <div class="my-2"></div>

          <!-- Profile Name Input -->
          <!-- p-1 is to handle border cropping in iOS/safari when input is selected -->
          <div class="w-full max-w-lg mb-6 p-1">
            <label for="profile-name" class="block mb-2 font-semibold">Name your profile:</label>
            <input
              id="profile-name"
              type="text"
              class="w-full p-2 border border-gray-300 rounded"
              v-model="profileName"
              placeholder="Enter profile name"
            />
          </div>

          <!-- DWN Endpoint Input -->
          <div class="w-full max-w-lg mb-6 p-1">
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
            class="my-4" v-model:pin="pin" :length="6" :mask="false"/>

          <!-- Next button is disabled until pin is obtained -->
          <button
            class="my-2 w-full bg-[#fcec03] text-black p-2 rounded-full active:bg-yellow-300 disabled:opacity-50"
            :disabled="pin.length < 6"
            @click="nextStep"
          >
            Finish
          </button>
          <button @click="previousStep" class="my-2 w-full bg-gray-500 text-white p-2 rounded-full active:bg-gray-600">Previous</button>
        </div>
      </div>

      <!-- Step 4 -->
      <div v-if="currentStep === 4">
        <div class="h-screen flex flex-col justify-center items-center">
          <p class="my-2 text-4xl">Creating your profile...</p>
          <p class="my-2">Your PIN: {{ pin }}</p>

          <img src="@/assets/spinner.gif" alt="Loading..." class="h-8 w-8" />

          <button @click="completeOnboarding" class="my-2 w-full bg-[#fcec03] text-black p-2 rounded-full active:bg-yellow-300">Done</button>
          <button @click="previousStep" class="my-2 w-full bg-gray-500 text-white p-2 rounded-full active:bg-gray-600">Previous</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PinInput from './PinInput.vue'; // Import the PinInput component

// Track the current step in the onboarding flow
const currentStep = ref(1);

// Inputs for Step 2
const profileName = ref('');
const dwnEndpoint = ref('https://dwn.tbddev.org/beta');

// Pin value for Step 3
const pin = ref('');

// Emit event to notify parent component
const emit = defineEmits(['onboarding-complete']);

// Move to the next step
const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++;
  }

  // If the user is on the last step, create the profile using the info gathered in previous steps
  if (currentStep.value === 4) {
    console.log('Creating profile...');
    console.log('Profile Name:', profileName.value);
    console.log('DWN Endpoint:', dwnEndpoint.value);
    
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
