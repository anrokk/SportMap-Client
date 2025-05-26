<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import L, { Map as LeafletMap, Polyline as LeafletPolyline, type LatLngExpression, type LatLngBounds } from 'leaflet';

const props = defineProps<{
    tracks: Array<Array<[number, number]>>
}>();

const mapContainerRef = ref<HTMLElement | null>(null); 
const leafletMap = ref<LeafletMap | null>(null); 
const trackPolylines = ref<LeafletPolyline[]>([]); 

onMounted(() => {
    if (mapContainerRef.value && !leafletMap.value) { 
        const mapInstance: LeafletMap = L.map(mapContainerRef.value).setView([59.4370, 24.7536], 10); // Tallinn

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
        }).addTo(mapInstance); 

        drawTracksOnMap(); 
    }
});

watch(() => props.tracks, 
    () => {
        drawTracksOnMap();
    },
    { deep: true } 
);

const drawTracksOnMap = () => {
    const currentMapInstance = leafletMap.value;
    if (!currentMapInstance) return;

    trackPolylines.value.forEach(polyline => {
        currentMapInstance.removeLayer(polyline);
    });
    trackPolylines.value = [];

    if (props.tracks && props.tracks.length > 0){
        const allTrackLatLngs: L.LatLng[] = [];

        props.tracks.forEach(trackCoordinates => {
            if (trackCoordinates && trackCoordinates.length > 1){
                const latLngExpressions: LatLngExpression[] = trackCoordinates.map(coord => L.latLng(coord[0], coord[1]));

                const polyline: LeafletPolyline = L.polyline(latLngExpressions, {
                    color: getRandomColor(),
                    weight: 3,
                    opacity: 0.7,
                });

                polyline.addTo(currentMapInstance);
                trackPolylines.value.push(polyline);

                latLngExpressions.forEach(ll => allTrackLatLngs.push(ll as L.LatLng));
            }
        });

        if (trackPolylines.value.length > 0 && allTrackLatLngs.length > 0){
            const bounds: LatLngBounds = L.latLngBounds(allTrackLatLngs);
            if (bounds.isValid()){
                const paddedBounds: LatLngBounds = bounds.pad(0.1);
                currentMapInstance.fitBounds(paddedBounds);
            } else if (allTrackLatLngs.length === 1){
                currentMapInstance.setView(allTrackLatLngs[0], currentMapInstance.getZoom() > 13 ? currentMapInstance.getZoom() : 13);
            }
        } else if (trackPolylines.value.length === 0){
            currentMapInstance.setView([59.4370, 24.7536], 10); // back to default (Tallinn)
        }
    } else {
        currentMapInstance.setView([59.4370, 24.7536], 10); // back to default (tallinn)
    }
};

const getRandomColor = () => {
    const colors = ['blue', 'red', 'green', 'purple', 'orange', 'teal', 'maroon', 'navy'];
    return colors[Math.floor(Math.random() * colors.length)];
}

onUnmounted(() => {
    if (leafletMap.value){
        leafletMap.value.remove();
        leafletMap.value = null;
    }
})

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
