<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { cameraOutline, cubeOutline, idCardOutline } from 'ionicons/icons';
import { RouterLink, RouterView } from 'vue-router';
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted, nextTick, computed } from 'vue';
import { App } from '@capacitor/app';
import { IdentityAgentManager } from './IdentityAgentManager';
import Onboarding from './components/Onboarding.vue';
import Relaunching from './components/Relaunching.vue';

// Initialize Vue Router for programmatic navigation
const router = useRouter();
const route = useRoute();

// State to track whether the app has been initialized
// NOTE: There are two possible paths to initialize the app:
// 1. Onboarding flow for first-time users
// 2. Relaunching flow for returning users
const sessionInitializationCompleted = ref(false);
const hasExistingProfile = ref(false);
const pendingDeepLink = ref<string | undefined>(undefined);

// Determine if the current route is a modal route (e.g. /web5-connect-request)
const isModalRoute = computed(() => route.name === 'web5-connect-request');

// Function to determine if the tab is active
const isActiveTab = (tabRouteName: string) => route.name === tabRouteName;

onMounted(async () => {
  console.log('Window object:', Object.keys(window));
  console.log('Global object:', typeof globalThis !== 'undefined' ? Object.keys(globalThis) : 'Not available');
  console.log('Process object:', typeof process !== 'undefined' ? Object.keys(process) : 'Not available');
  console.log('Process.env:', typeof process !== 'undefined' && process.env ? Object.keys(process.env) : 'Not available');
  console.log('import.meta:', typeof import.meta !== 'undefined' ? Object.keys(import.meta) : 'Not available');
  console.log('import.meta.env:', typeof import.meta !== 'undefined' && import.meta.env ? Object.keys(import.meta.env) : 'Not available');

  hasExistingProfile.value = !await (await IdentityAgentManager.singleton()).isFirstLaunch();

  configureDeepLinkHook();
});

const configureDeepLinkHook = () => {
  App.addListener('appUrlOpen', (data: any) => {
    console.log(`Handling deep link of URL: ${data.url}...`);
    const url = data.url; // Get the full URL
    
    if (!sessionInitializationCompleted.value) {
      console.log('User onboarding not completed yet or app PIN not given yet. Storing the deep link for later...');
      pendingDeepLink.value = data.url;
      return;
    }

    // else continue with the deep link handling
    handleDeepLink(url);
  });
};

const handleDeepLink = (url: string) => {
  if (url.startsWith('web5://connect')) {
    console.log('Handling Web5 connect deep link...');
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
};

// Method to be called after the onboarding or relaunching flows are completed.
const onSessionInitialized = async () => {
  sessionInitializationCompleted.value = true;
  if (pendingDeepLink.value === undefined) {
    router.replace('/'); // Always land in the profiles page after initialization.
  } else {
    console.log('Resuming handling of pending deep link:', pendingDeepLink.value);
    handleDeepLink(pendingDeepLink.value!);
    pendingDeepLink.value = undefined;
  }
};
</script>

<template>
  <!-- Handle the onboarding or relaunching flows -->
  <Onboarding v-if="!sessionInitializationCompleted && !hasExistingProfile" @onboarding-complete="onSessionInitialized" />
  <Relaunching v-else-if="!sessionInitializationCompleted" @initialization-complete="onSessionInitialized" />

  <!-- Show main content after initialization is complete -->
  <div v-if="sessionInitializationCompleted" class="flex flex-col h-screen">

    <!-- Main content rendered in the default RouterView -->
    <div class="flex-grow overflow-y-auto">
      <RouterView />
    </div>

    <!-- Navigation bar fixed at the bottom -->
    <header v-if="!isModalRoute" class="bg-gray-100 p-4">
      <div class="flex justify-around text-sm">
        <!-- Profiles Tab -->
        <RouterLink to="/" :class="[isActiveTab('profiles') ? 'text-black' : 'text-gray-400']">
          <div class="flex flex-col items-center">
            <ion-icon :icon="idCardOutline" size="large" />
            <p>Profiles</p>
          </div>
        </RouterLink>

        <!-- Apps Tab -->
        <RouterLink to="/apps" :class="[isActiveTab('apps') ? 'text-black' : 'text-gray-400']">
          <div class="flex flex-col items-center">
            <ion-icon :icon="cubeOutline" size="large" />
            <p>Apps</p>
          </div>
        </RouterLink>

        <!-- Camera Tab -->
        <RouterLink to="/camera" :class="[isActiveTab('camera') ? 'text-black' : 'text-gray-400']">
          <div class="flex flex-col items-center">
            <ion-icon :icon="cameraOutline" size="large" />
            <p>Camera</p>
          </div>
        </RouterLink>
      </div>
    </header>
  </div>

</template>
