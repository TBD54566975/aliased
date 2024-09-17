<template>
  <div class="flex flex-col h-screen p-4 pt-24">
    <!-- Header: Title -->
    <div class="mb-6">
      <p class="text-2xl">Choose the profile you’d like to connect to {{ serviceName }}</p>
      <p class="text-sm text-gray-500 mt-3">You’ll be able to use the profile you select below in {{ serviceName }}.</p>
    </div>

    <!-- List of Profiles -->
    <div class="space-y-4 flex-grow">
      <div 
        v-for="profile in profiles" 
        :key="profile.did"
        :class="{
          'bg-[#fcec03]': profile.did === selectedProfile,
          'bg-white': profile.did !== selectedProfile
        }"
        class="flex items-center p-4 rounded-lg shadow cursor-pointer"
        @click="selectProfile(profile)"
      >
        <div class="flex-shrink-0">
          <!-- Profile Icon Placeholder -->
          <div class="bg-gray-200 h-12 w-12 rounded-full flex items-center justify-center">
            <span class="text-2xl">👤</span>
          </div>
        </div>
        <div class="flex-grow ml-4">
          <p class="text-lg font-medium">{{ profile.profileName }} - 
            <span class="text-sm text-gray-500">{{ profile.dwnEndpoint }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Permissions Request -->
    <div class="mt-8">
      <p class="text-2xl">Permissions requested</p>
      <p class="text-sm text-gray-500 mt-3">Make sure you trust {{ serviceName }}. {{ serviceName }} will be able to:</p>

      <!-- List of permissions (for now, just placeholders) -->
      <ul class="list-disc pl-6">
        <li>Access your basic profile information</li>
        <li>Connect to the {{ serviceName }} service</li>
      </ul>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-between mt-8">
      <button @click="cancel" class="bg-gray-200 text-black py-3 px-6 rounded-full">Cancel</button>
      <button 
        @click="confirmConnection"
        :disabled="!selectedProfile"
        class="bg-[#fcec03] text-black py-3 px-6 rounded-full disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ProfileManager, type Profile } from '../ProfileManager';

// Reactive data
const profiles = ref<Profile[]>([]);
const selectedProfile = ref<string | null>(null);
const serviceName = ref('Fllw'); // This could be dynamic based on the deep link

// Vue Router for navigation
const router = useRouter();

// Fetch profiles from the ProfileManager when the component is mounted
onMounted(() => {
  const profileManager = ProfileManager.singleton();
  profiles.value = profileManager.getProfiles();
});

// Function to select a profile
const selectProfile = (profile: Profile) => {
  selectedProfile.value = profile.did;
};

// Function to cancel the connection
const cancel = () => {
  console.log('Web5 connect request cancelled');
  router.go(-1); // Go back to the previous route
};

// Function to confirm connection
const confirmConnection = () => {
  if (selectedProfile.value) {
    console.log('Profile connected:', selectedProfile.value);
    // Trigger the actual connection logic here (e.g., connect the profile to the service)
    router.push('/'); // Redirect to the profiles page or any other page
  }
};
</script>

<style scoped>
</style>
