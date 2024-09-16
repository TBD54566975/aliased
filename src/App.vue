<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import Onboarding from './components/Onboarding.vue';

// Initialize Vue Router for programmatic navigation
const router = useRouter();

// State to track whether the user has completed onboarding
const isOnboarded = ref(false);

onMounted(() => {
  // check what page to show initially based on onboarding status
  // TODO: instead of using `isFirstLaunch`, just check if there is already an existing profile
  const onboardingComplete = localStorage.getItem('isFirstLaunch') === 'false';
  isOnboarded.value = onboardingComplete;
});

// Listen for completion of onboarding from the OnboardingFlow component
const completeOnboarding = () => {
  localStorage.setItem('isFirstLaunch', 'false');
  isOnboarded.value = true;
  router.replace('/'); // To always land in the profiles page after onboarding, in case we clear profiles from another page.
};


</script>

<template>
  <!-- Optionally, handle the initial onboarding flow here or in a separate page -->
  <Onboarding v-if="!isOnboarded" @onboarding-complete="completeOnboarding" />

  <!-- Show RouterView only after onboarding is complete -->
  <RouterView v-else />

  <header>
    <!-- Wrapper that contains navigation and other content, conditionally displayed -->
    <div class="wrapper">

      <!-- Conditional rendering for the navigation based on onboarding completion -->
      <nav v-if="isOnboarded">
        <RouterLink to="/">Profiles</RouterLink>
        <RouterLink to="/apps">Apps</RouterLink>
      </nav>
    </div>
  </header>
</template>
