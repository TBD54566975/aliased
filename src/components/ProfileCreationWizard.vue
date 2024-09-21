<template>
    <div class="m-4 relative h-screen overflow-hidden">
  
        <!-- TODO: MUST refactor, this is mostly a copy from Onboarding.vue -->
        <div>
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
  
            <!-- Disable the button unless both inputs are filled -->
            <button
              @click="onCreate"
              :disabled="!canProceedToPinCreation"
              class="my-2 w-full bg-[#fcec03] text-black p-2 rounded-full active:bg-yellow-300 disabled:opacity-50"
            >
              Create
            </button>
  
            <button @click="onCancel" class="my-2 w-full bg-gray-500 text-white p-2 rounded-full active:bg-gray-600">Cancel</button>
          </div>
        </div>

      </div>
  </template>
  
  <script setup lang="ts">
  import { ProfileManager } from '../ProfileManager';
  import { ref, computed } from 'vue';
  import { IdentityAgentManager } from '@/IdentityAgentManager';
  
  // Used for displaying debug info
  const debugInfo = ref('');
  
  // Step 2 inputs
  const profileName = ref('');
  const dwnEndpoint = ref('https://dwn.tbddev.org/beta');
  // Computed property to check if both profileName and dwnEndpoint are filled
  const canProceedToPinCreation = computed(() => profileName.value.trim() !== '' && dwnEndpoint.value.trim() !== '');
  
  // Emit event to notify parent component
  const emit = defineEmits(['canceled', 'created']);
  
  // Move to the next step
  const onCreate = async () => {
    try {
      const identityAgentManager = await IdentityAgentManager.singleton();
  
      console.log(`Creating profile: ${profileName.value}...`);
      await ProfileManager.singleton().createProfile({
        profileName: profileName.value,
        dwnEndpoint: dwnEndpoint.value
      });
      
      emit('created');

    } catch (error) {
      const errorMessage = 'Error creating profile: ' + error;
      console.log(errorMessage);
      debugInfo.value = errorMessage;
    }
  };
  
  // Move to the previous step
  const onCancel = () => {
    emit('canceled');
  };
  
  </script>
  