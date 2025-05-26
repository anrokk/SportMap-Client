<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
import L, { type Map as LeafletMap, type Polyline as LeafletPolyline, type LatLngExpression, type LatLngBounds, map } from 'leaflet';

const props = defineProps<{
    tracks: Array<Array<[number, number]>>
}>();

const mapContainerRef = ref<HTMLElement | null>(null); 
const leafletMap = ref<LeafletMap | null>(null); 
const trackPolylines = ref<LeafletPolyline[]>([]); 

const initializeMap = () => {
    if (mapContainerRef.value && !leafletMap.value){
        const mapInstance: LeafletMap = L.map(mapContainerRef.value, { }).setView([59.4370, 24.7536], 10); //tallinn

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
        }).addTo(mapInstance);

        leafletMap.value = mapInstance;
        drawTracksOnMap();
    } else if (mapContainerRef.value && leafletMap.value){
        drawTracksOnMap();
    }
};

onMounted(() => {
    nextTick(() => {
        initializeMap();
    });
});

watch(() => props.tracks,
    () => {
        if (leafletMap.value) {
            drawTracksOnMap();
        } else {
            nextTick(() => {
                initializeMap();
            });
        }
    },
    { deep: true, immediate: false }
);

const drawTracksOnMap = () => {
    const currentMapInstance = leafletMap.value;
    if (!currentMapInstance) {
        console.warn("Map instance not available for drawing tracks.");
        return;
    }
    console.log("Drawing tracks. Current tracks prop:", JSON.parse(JSON.stringify(props.tracks)));

    trackPolylines.value.forEach(polyline => {
        if (currentMapInstance.hasLayer(polyline as LeafletPolyline)) {
            currentMapInstance.removeLayer(polyline as LeafletPolyline);
        }
    });
    trackPolylines.value = [];

    if (props.tracks && props.tracks.length > 0) {
        const allTrackLatLngsForBounds: L.LatLng[] = [];

        props.tracks.forEach((trackCoordinates, trackIndex) => {
            if (trackCoordinates && trackCoordinates.length > 1) {
                const latLngExpressions: LatLngExpression[] = trackCoordinates.map(coord => L.latLng(coord[0], coord[1]));
                
                let polyline: LeafletPolyline = L.polyline(latLngExpressions, {
                    color: getRandomColor(trackIndex),
                    weight: 3,
                    opacity: 0.7,
                });
                
                polyline = polyline.addTo(currentMapInstance as L.Map);
                trackPolylines.value.push(polyline);

                latLngExpressions.forEach(ll => {
                    if (ll instanceof L.LatLng) {
                        allTrackLatLngsForBounds.push(ll);
                    } else if (Array.isArray(ll) && ll.length === 2) {
                        allTrackLatLngsForBounds.push(L.latLng(ll[0], ll[1]));
                    }
                });
            }
        });

        if (trackPolylines.value.length > 0 && allTrackLatLngsForBounds.length > 0) {
            const bounds: LatLngBounds = L.latLngBounds(allTrackLatLngsForBounds);
            if (bounds.isValid()) {
                const paddedBounds: LatLngBounds = bounds.pad(0.1);
                currentMapInstance.fitBounds(paddedBounds);
            } else if (allTrackLatLngsForBounds.length === 1) {
                currentMapInstance.setView(allTrackLatLngsForBounds[0], currentMapInstance.getZoom() > 13 ? currentMapInstance.getZoom() : 13);
            }
        } else if (trackPolylines.value.length === 0) {
            currentMapInstance.setView([59.4370, 24.7536], 10);
        }
    } else {
        currentMapInstance.setView([59.4370, 24.7536], 10);
    }
};

const getRandomColor = (index?: number) => {
    const colors = ['blue', 'red', 'green', 'purple', 'orange', 'teal', 'maroon', 'navy', 'lime', 'fuchsia'];
    if (index !== undefined) {
        return colors[index % colors.length]; 
    }
    return colors[Math.floor(Math.random() * colors.length)];
};

onUnmounted(() => {
    if (leafletMap.value) {
        console.log("Removing map instance.");
        leafletMap.value.remove();
        leafletMap.value = null;
    }
});

</script>

<template>
  <div ref="mapContainerRef" id="map-display-container" style="height: 100%; width: 100%;">
    </div>
</template>

<style scoped>
#map-display-container {
  background-color: #e0e0e0; 
}
</style>
