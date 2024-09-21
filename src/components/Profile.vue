<template>
  <div class="flex flex-col h-screen">
    <!-- Top Header with space for the mobile status bar (time, battery, etc.) -->
    <div class="bg-[#fcec03] p-4 flex items-center justify-between pt-24">
      <p class="text-4xl">{{ profileModel.profileName }}</p>
    </div>
  
    <div class="m-4">
      <div class="flex flex-col justify-center">

        <div class="p-4 bg-gray-200 rounded-lg shadow-xl">
          <div class="mb-4">
            <div class="text-gray-500 text-sm">Profile Name</div>
            <div class="text-lg font-semibold break-all">{{ profileModel.profileName}}</div>
          </div>
          <div class="mb-4">
            <div class="text-gray-500 text-sm">DID</div>
            <div class="text-lg font-semibold break-all">{{ profileModel.did}}</div>
          </div>
          <div class="mb-4">
            <div class="text-gray-500 text-sm">DWN</div>
            <div class="text-lg font-semibold break-all">{{ profileModel.dwnEndpoint }}</div>
          </div>
        </div>

        <div class="my-2"></div>

        <!-- Disable the button unless both inputs are filled -->
        <button
          @click="onDelete"
          class="my-2 w-full bg-red-500 text-black p-2 rounded-full active:bg-red-600 disabled:opacity-50"
        >
          Delete
        </button>

        <button @click="onClose" class="my-2 w-full bg-gray-500 text-white p-2 rounded-full active:bg-gray-600">Close</button>
      </div>
    </div>

  </div>
</template>
  
<script setup lang="ts">
  import { ProfileManager, type ProfileModel } from '../ProfileManager';
  
  // Define props with TypeScript
  interface Props {
    profileModel: ProfileModel;
  }
  const props = defineProps<Props>();

  // Emit event to notify parent component
  const emit = defineEmits(['closed', 'deleted']);

  const onDelete = async () => {
    // Delete this profile
    await ProfileManager.singleton().deleteProfile(props.profileModel.did);
    console.log(`Deleted profile: ${props.profileModel.profileName}`);
    
    emit('deleted');
  };


  const onClose = () => {
    emit('closed');
  };

</script>
