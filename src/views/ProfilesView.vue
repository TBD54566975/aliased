<template>

  <Profile v-if="mode === Mode.Profile" :profile-model="selectedProfile!" @closed="onProfileClosed" @deleted="onProfileDeleted(selectedProfile)"/>
  <ProfileCreationWizard v-else-if="mode === Mode.ProfileCreation" @canceled="mode = Mode.ProfileList" @created="onProfileCreated" />

  <div v-else class="flex flex-col h-screen">
    <!-- Top Header with space for the mobile status bar (time, battery, etc.) -->
    <div class="bg-[#fcec03] p-4 flex items-center justify-between pt-24">
      <p class="text-4xl">Profiles</p>
    </div>

    <!-- Profile List -->
    <div class="flex flex-col flex-grow p-4 space-y-4 overflow-y-auto">
      <!-- Dynamically loaded profile items -->
      <div v-for="profile in profiles" :key="profile.did" class="flex items-center p-4 bg-white rounded-lg shadow" @click="onProfileClicked(profile)">
        <div class="flex-shrink-0">
          <!-- Icon Placeholder -->
          <div class="bg-gray-200 h-12 w-12 rounded-full flex items-center justify-center">
            <span class="text-2xl">#</span>
          </div>
        </div>

        <div class="flex-grow ml-4">
          <p class="text-lg font-medium">{{ profile.profileName }}</p>
          <p class="text-sm text-gray-500">DWN: {{ profile.dwnEndpoint }}</p>
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
import { ProfileManager, type ProfileModel } from '@/ProfileManager';
import Profile from '../components/Profile.vue';
import ProfileCreationWizard from '../components/ProfileCreationWizard.vue';
import { on } from 'events';

enum Mode {
  Profile,
  ProfileList,
  ProfileCreation,
}

const mode = ref<Mode>(Mode.ProfileList);

// Reactive variable to store profiles
const selectedProfile = ref<ProfileModel | undefined>(undefined);
const profiles = ref<ProfileModel[]>([]);

// Fetch profiles when component is mounted
const fetchProfiles = async () => {
  const profileManager = ProfileManager.singleton();
  const profileArray = await profileManager.getProfiles();
  console.log('Fetched profile count:', profileArray.length);

  profiles.value = profileArray;
};

// Create a new profile (you can modify this to show a form)
const createProfile = async () => {
  // Activate the ProfileCreationWizard component
  mode.value = Mode.ProfileCreation;
};

// Fetch profiles on component mount
onMounted(() => {
  fetchProfiles();
});

const onProfileCreated = () => {
  // Refresh the profile list by fetching the profiles again
  mode.value = Mode.ProfileList;
  fetchProfiles();
};

const onProfileClicked = (profile: ProfileModel) => {
  selectedProfile.value = profile;
  mode.value = Mode.Profile;
};

const onProfileClosed = () => {
  selectedProfile.value = undefined;
  mode.value = Mode.ProfileList;
};

const onProfileDeleted = (profile: ProfileModel) => {
  // Refresh the profile list by fetching the profiles again
  fetchProfiles();

  onProfileClosed();
};

</script>

<style scoped>
ion-icon {
  color: grey;
}
</style>
