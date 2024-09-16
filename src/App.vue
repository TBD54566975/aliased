<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { cubeOutline, idCardOutline } from 'ionicons/icons';
import { ProfileManager } from './ProfileManager';
import { RouterLink, RouterView } from 'vue-router'
import { useRouter } from 'vue-router';
import { ref, onMounted, nextTick } from 'vue';
import Onboarding from './components/Onboarding.vue';
import Relaunching from './components/Relaunching.vue';

// Initialize Vue Router for programmatic navigation
const router = useRouter();

// State to track whether the app has been initialized
// NOTE: There are two possible paths to initialize the app:
// 1. Onboarding flow for first-time users
// 2. Relaunching flow for returning users
const initializationCompleted = ref(false);
const hasExistingProfile = ref(false);

onMounted(() => {
  hasExistingProfile.value = ProfileManager.singleton().getProfiles().length > 0;
});

const showProfilesPage = async () => {
  initializationCompleted.value = true;
  router.replace('/'); // Always land in the profiles page after initialization.
};


</script>

<template>
  <Onboarding v-if="!hasExistingProfile" @onboarding-complete="showProfilesPage" />

  <Relaunching v-if="!initializationCompleted" @initialization-complete="showProfilesPage" />

  <!-- Show RouterView only after initialization is complete -->
  <div v-if="initializationCompleted" class="flex flex-col h-screen">

    <!-- Main content with RouterView -->
    <div class="flex-grow overflow-y-auto">
      <RouterView />
    </div>

    <!-- Navigation bar fixed at the bottom -->
    <header class="bg-gray-100 p-2">
      <!-- Wrapper that contains navigation and other content -->
      <div class="flex justify-around">
        <!-- Profiles Tab -->
        <RouterLink to="/" class="text-black text-lg">
          <div class="flex flex-col items-center">
            <ion-icon :icon="idCardOutline" size="large"></ion-icon>
            <p class="text-black text-sm">Profiles</p>
          </div>
        </RouterLink>

        <!-- Apps Tab -->
        <RouterLink to="/apps" class="text-black text-lg">
          <div class="flex flex-col items-center">
            <ion-icon :icon="cubeOutline" size="large"></ion-icon>
            <p class="text-gray-400 text-sm">Apps</p>
          </div>
        </RouterLink>
      </div>
    </header>
  </div>
</template>
