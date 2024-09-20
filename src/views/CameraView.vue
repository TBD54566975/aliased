<template>
  <div class="flex flex-col h-full">
    <!-- Top Header with space for the mobile status bar (time, battery, etc.) -->
    <div class="bg-[#fcec03] p-4 flex items-center justify-between pt-24">
      <p class="text-4xl">Scan</p>
    </div>
    
    <!-- QR Code Scanner -->
    <qrcode-stream @detect="onDetect" @init="onInit"></qrcode-stream>

    <p v-if="qrCodeData" class="mt-4">QR Code Data: {{ qrCodeData }}</p>
  </div>
</template>
  
<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';

  // Initialize Vue Router for programmatic navigation
  const router = useRouter();

  const qrCodeData = ref<string | null>(null);
  
  // Handle QR code decoding
  const onDetect = (detectedCodes: any[]) => {
    const qrCode = detectedCodes[0].rawValue;
    qrCodeData.value = qrCode;
    console.log('QR Code decoded:', qrCode);
  
    // Handle the decoded data (e.g., navigate using the decoded URL)
    if (qrCode.startsWith('web5://connect')) {
      const urlParams = new URLSearchParams(qrCode.split('?')[1]);
      const requestUri = urlParams.get('request_uri');
      const encryptionKey = urlParams.get('encryption_key');
  
      if (requestUri) {
        // Trigger the web5 connect request handling page
        router.push({
          name: 'web5-connect-request',
          query: { request_uri: requestUri, encryption_key: encryptionKey }
        });
      }
    }
  };
  
  // Handle QR code stream initialization
  const onInit = (promise: Promise<void>) => {
    promise
      .then(() => console.log('QR code scanner initialized successfully.'))
      .catch((error) => console.log(`Error initializing QR code scanner: ${error}`));
  };
</script>
  
<style scoped>
</style>
  