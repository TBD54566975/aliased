<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { cubeOutline, idCardOutline } from 'ionicons/icons';
import { ProfileManager } from './ProfileManager';
import { RouterLink, RouterView } from 'vue-router';
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted, nextTick, computed } from 'vue';
import { App } from '@capacitor/app';
import Onboarding from './components/Onboarding.vue';
import Relaunching from './components/Relaunching.vue';

// Initialize Vue Router for programmatic navigation
const router = useRouter();
const route = useRoute();

// State to track whether the app has been initialized
// NOTE: There are two possible paths to initialize the app:
// 1. Onboarding flow for first-time users
// 2. Relaunching flow for returning users
const initializationCompleted = ref(false);
const hasExistingProfile = ref(false);

// Determine if the current route is a modal route (e.g. /web5-connect-request)
const isModalRoute = computed(() => route.name === 'web5-connect-request');

onMounted(() => {
  hasExistingProfile.value = ProfileManager.singleton().getProfiles().length > 0;

  configureDeepLinkHook();
});

const configureDeepLinkHook = () => {
  App.addListener('appUrlOpen', (data: any) => {
    const url = data.url; // Get the full URL
    console.log('App opened with URL:', url);

    // Parse the deep link URL (web5://connect?request_uri=...)
    if (url.startsWith('web5://connect')) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const requestUri = urlParams.get('request_uri');
      const encryptionKey = urlParams.get('encryption_key');

      if (requestUri) {
        console.log('Deep link request URI:', requestUri);
        
        // Trigger the web5 connect request handling page
        router.push({
          name: 'web5-connect-request', // The route for handling the connection
          query: { request_uri: requestUri, encryption_key: encryptionKey }
        });
      }
    }
  });
};

const showProfilesPage = async () => {
  initializationCompleted.value = true;
  router.replace('/'); // Always land in the profiles page after initialization.
};
</script>

<template>
  <!-- Handle the onboarding or relaunching flows -->
  <Onboarding v-if="!hasExistingProfile" @onboarding-complete="showProfilesPage" />
  <Relaunching v-if="!initializationCompleted" @initialization-complete="showProfilesPage" />

  <!-- Show main content after initialization is complete -->
  <div v-if="initializationCompleted" class="flex flex-col h-screen">

    <!-- Main content rendered in the default RouterView -->
    <div class="flex-grow overflow-y-auto">
      <RouterView />
    </div>

    <!-- Navigation bar fixed at the bottom -->
    <header v-if="!isModalRoute" class="bg-gray-100 p-4">
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

