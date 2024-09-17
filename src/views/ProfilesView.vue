<template>
  <div class="flex flex-col h-screen">
    <!-- Top Header with space for the mobile status bar (time, battery, etc.) -->
    <div class="bg-[#fcec03] p-4 flex items-center justify-between pt-24">
      <p class="text-4xl">Profiles</p>
    </div>

    <!-- Profile List -->
    <div class="flex flex-col flex-grow p-4 space-y-4 overflow-y-auto">
      <!-- Dynamically loaded profile items -->
      <div v-for="profile in profiles" :key="profile.did" class="flex items-center p-4 bg-white rounded-lg shadow">
        <div class="flex-shrink-0">
          <!-- Icon Placeholder -->
          <div class="bg-gray-200 h-12 w-12 rounded-full flex items-center justify-center">
            <span class="text-2xl">#</span>
          </div>
        </div>
        <div class="flex-grow ml-4">
          <p class="text-lg font-medium">{{ profile.profileName }} - 
            <span class="text-sm text-gray-500">{{ profile.dwnEndpoint }}</span>
          </p>
        </div>
        <div>
          <!-- Right Arrow Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <button
        class="my-2 w-full bg-[#fcec03] text-black p-2 rounded-full active:bg-yellow-300 disabled:opacity-50"
        @click="createProfile"
      >
        Create a new profile
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ProfileManager, type Profile } from '@/ProfileManager';
import { useRouter } from 'vue-router';

const router = useRouter();

// Reactive variable to store profiles
const profiles = ref<Profile[]>([]);

// Fetch profiles when component is mounted
const fetchProfiles = () => {
  const profileManager = ProfileManager.singleton();
  profiles.value = profileManager.getProfiles();
};

// Create a new profile (you can modify this to show a form)
const createProfile = async () => {
  // temporary trigger web5 connect request handler
  router.push({
    path: '/web5-connect-request'
  });
};

// Fetch profiles on component mount
onMounted(() => {
  fetchProfiles();
});
</script>

<style scoped>
ion-icon {
  color: grey;
}
</style>
