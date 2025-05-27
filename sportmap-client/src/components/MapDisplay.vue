<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
import L, {
    type Map as LeafletMap,
    type Polyline as LeafletPolyline,
    type LatLngExpression,
    type LatLngBounds,
    type FeatureGroup
} from 'leaflet';

const props = defineProps<{
    tracks: Array<Array<[number, number]>>;
}>();

const mapContainerRef = ref<HTMLElement | null>(null);
const leafletMap = ref<LeafletMap | null>(null);
const tracksLayerGroup = ref<FeatureGroup | null>(null);

const defaultTrackColor = 'blue';

const initializeMap = () => {
    if (mapContainerRef.value && !leafletMap.value){
        const mapInstance: LeafletMap = L.map(mapContainerRef.value).setView([59.4370, 24.7536], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(mapInstance);

        leafletMap.value = mapInstance;
        tracksLayerGroup.value = L.featureGroup().addTo(mapInstance);

        if (props.tracks && props.tracks.length > 0){
            drawTracksOnMap();
        }
    }
};

onMounted(() => {
    nextTick(() => {
        initializeMap();
    });
});

watch(() => props.tracks, () => {
     if (leafletMap.value && tracksLayerGroup.value) {
        drawTracksOnMap();
    } else {
        nextTick(() => {
            initializeMap();
        });
    }
}, { deep: true }
);

const drawTracksOnMap = () => {
    const currentMap = leafletMap.value;
    const layerGroup = tracksLayerGroup.value;

    if (!currentMap || !layerGroup){
        console.warn('Map or layer group is not initialized');
        return;
    }

    layerGroup.clearLayers();

    if (props.tracks && props.tracks.length > 0){
        let hasValidTracksToDraw = false;
        props.tracks.forEach(trackCoordinates => {
            if (trackCoordinates && trackCoordinates.length > 1){
                const latLngs: LatLngExpression[] = trackCoordinates
                .filter(coord => typeof coord[0] === 'number' && typeof coord[1] === 'number' && !isNaN(coord[0]) && !isNaN(coord[1]))
                .map(coord => L.latLng(coord[0], coord[1]));

                if (latLngs.length > 1){
                    const polyline: LeafletPolyline = L.polyline(latLngs, {
                        color: defaultTrackColor,
                        weight: 3,
                        opacity: 0.7
                    });
                    layerGroup.addLayer(polyline);
                    hasValidTracksToDraw = true;
                }
            }
        });

        if (hasValidTracksToDraw){
            const bounds: LatLngBounds = layerGroup.getBounds();
            if (bounds.isValid()){
                currentMap.invalidateSize();
                currentMap.fitBounds(bounds.pad(0.1));
            } else {
                currentMap.setView([59.4370, 24.7536], 7); //tallinn
            }
        } else {
            currentMap.setView([59.4370, 24.7536], 7); // tallinn (no valid tracks to draw, back to default)
        }
    } else {
        currentMap.setView([59.4370, 24.7536], 7); // tallinn (no tracks provided, back to default)
    }
};

onUnmounted(() => {
    if (leafletMap.value){
        leafletMap.value.remove();
        leafletMap.value = null;
    }
    tracksLayerGroup.value = null;
});

</script>

<template>
    <div ref="mapContainerRef" id="map-display-container-concise" style="height: 100%; width: 100%;">
    </div>
</template>

<style scoped>
#map-display-container-concise {
  background-color: #f0f0f0; 
  border: 1px solid #ccc;    
}
</style>
