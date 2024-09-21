<template>
  <div class="flex flex-col h-full">
    <!-- Top Header with space for the mobile status bar (time, battery, etc.) -->
    <div class="bg-[#fcec03] p-4 flex items-center justify-between pt-24">
      <p class="text-4xl">Apps</p>
    </div>

    <!-- Profile List -->
    <div class="flex flex-col flex-grow p-4 space-y-4 overflow-y-auto">
      <!-- Dynamically loaded profile items -->
      <div v-for="app in appModels" :key="app.protocolUri" class="flex items-center p-4 bg-white rounded-lg shadow">
        <div class="flex-shrink-0">
          <!-- Icon Placeholder -->
          <div class="bg-gray-200 h-12 w-12 rounded-full flex items-center justify-center">
            <span class="text-2xl">#</span>
          </div>
        </div>
        <div class="flex-grow ml-4">
          <!-- TODO: Replace with app name when it's available -->
          <p class="text-lg font-medium break-all">{{ app.protocolUri }}</p>
          <p class="text-sm text-gray-500">Using profile: {{ app.profileName }}</p>
        </div>

        <!-- Disable for now for future extension -->
        <div v-if="false">
          <!-- Right Arrow Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ProfileManager, type AppModel } from '@/ProfileManager';
import { ref, onMounted } from 'vue';

  // Reactive variable to store apps
  const appModels = ref<AppModel[]>([]);

  // Fetch profiles when component is mounted
  const fetchApps = async () => {
    const profileManager = ProfileManager.singleton();
    const apps = await profileManager.getApps();
    console.log('Fetched profile count:', apps.length);

    appModels.value = apps;
  };

  // Fetch profiles on component mount
  onMounted(() => {
    fetchApps();
  });
</script>