<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
    tracks: Array<Array<[number, number]>>
}>();

const mapContainer = ref<HTMLDivElement | null>(null);

onMounted(() => {
    if (mapContainer.value){
        mapContainer.value.innerHTML = '<p style=\"padding: 20px; text-align: center; color: #777;\">Map will be displayed here.</p>';
    }
});

watch(() => props.tracks, (newTracks) => {
    if (mapContainer.value && newTracks && newTracks.length > 0 && newTracks[0].length > 0){
        mapContainer.value.innerHTML = `<p style=\"padding: 20px; text-align: center; color: #333;\">Received track data with ${newTracks[0].length} points. Map drawing to be implemented.</p>`;
    } else if (mapContainer.value){
        mapContainer.value.innerHTML = '<p style=\"padding: 20px; text-align: center; color: #777;\">Map will be displayed here. No track data received or track is empty.</p>';
    }
}, { deep: true });
</script>

<template>
    <div ref="mapContainer" id="map-display-container" style="height: 100%; width: 100%; background-color: #e0e0e0;">
    </div>
</template>

<style scoped>
#map-display-container {
  min-height: 400px;
}
</style>
