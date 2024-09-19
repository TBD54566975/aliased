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
        :key="profile.profileName"
        :class="{
          'bg-[#fcec03]': profile.profileName === selectedProfileName,
          'bg-white': profile.profileName !== selectedProfileName
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
          <p class="text-lg font-medium">{{ profile.profileName }}</p>
          <p class="text-sm text-gray-500">{{ profile.dwnEndpoint }}</p>
        </div>
      </div>
    </div>

    <!-- Permissions Request -->
    <div class="mt-8">
      <p class="text-2xl">Permissions requested</p>
      <p class="text-sm text-gray-500 mt-3">Make sure you trust {{ serviceName }}. {{ serviceName }} will be able to:</p>

      <!-- Dynamically Render Permissions -->
      <ul class="list-disc pl-6">
        <li v-for="(request, index) in decryptedConnectionRequest?.permissionRequests" :key="index">
          <p class="font-semibold">{{ request.protocolDefinition.protocol }}</p>
          <p>{{ request.permissionScopes.map(scope => `${scope.method} ${scope.interface}`).join(', ') }}</p>
        </li>
      </ul>
    </div>

    <!-- Action Buttons (each button takes half the width) -->
    <div class="flex mt-8 space-x-4">
      <button 
        @click="cancel" 
        class="bg-gray-200 text-black py-3 px-6 rounded-full w-1/2"
      >
        Cancel
      </button>
      <button 
        @click="confirmConnection"
        :disabled="!selectedProfileName"
        class="bg-[#fcec03] text-black py-3 px-6 rounded-full w-1/2 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Web5ConnectAuthRequest } from "@web5/agent";
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ProfileManager, type Profile } from '../ProfileManager';
import { Oidc } from "@web5/agent";
import { CryptoUtils } from "@web5/crypto";
import { IdentityAgentManager } from "../IdentityAgentManager";


const route = useRoute();

// Reactive data
const profiles = ref<Profile[]>([]);
const selectedProfileName = ref<string | null>(null);
const serviceName = ref('Fllw'); // This could be dynamic based on the deep link

// Example decryptedConnectionRequest, this will be passed to the component dynamically
const decryptedConnectionRequest = ref<Web5ConnectAuthRequest>();

// Vue Router for navigation
const router = useRouter();

// Fetch profiles from the ProfileManager when the component is mounted
onMounted(async () => {
  const requestUri = route.query.request_uri as string;
  const encryptionKey = route.query.encryption_key as string;
  console.log('request_uri:', requestUri);
  console.log('encryption_key:', encryptionKey);

  const profileManager = ProfileManager.singleton();
  profiles.value = await profileManager.getProfiles();

  decryptedConnectionRequest.value = await Oidc.getAuthRequest(requestUri, encryptionKey);
});

// Function to select a profile
const selectProfile = (profile: Profile) => {
  selectedProfileName.value = profile.profileName;
};

// Function to cancel the connection
const cancel = () => {
  console.log('Web5 connect request cancelled.');
  router.go(-1); // Go back to the previous route
};


const confirmConnection = async () => {
  console.log('Confirming connection with selected profile:', selectedProfileName.value);
  const selectedDid = profiles.value.find((profile) => profile.profileName === selectedProfileName.value)!.did;

  const identityAgentManager = await IdentityAgentManager.singleton();
  const identityAgent = identityAgentManager.agent;

  console.log('Creating connect PIN...')
  const pin = CryptoUtils.randomPin({ length: 4 });
  console.log('One-time connect PIN created:', pin);

  console.log('Creating grants and submitting auth response...')
  await Oidc.submitAuthResponse(
    selectedDid,
    decryptedConnectionRequest.value!,
    pin,
    identityAgent
  );
  console.log('Auth response submitted successfully.');
};

</script>

<style scoped>
</style>
