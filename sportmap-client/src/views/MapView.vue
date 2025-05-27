<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useGpsDataStore } from '@/stores/gpsData';
import { useAuthStore } from '@/stores/auth';
import MapDisplay from '@/components/MapDisplay.vue';
import type { GpsSessionView, GpsSessionType } from '@/types';

const gpsDataStore = useGpsDataStore();
const authStore = useAuthStore();

const selectedSessionId = ref<string | null>(null);
const trackUpdateTimer = ref<number | null>(null);
const updateIntervalMs = ref(10000);

const selectedSessionTypeId = ref<string>('');
const availableSessionTypes = computed(() => gpsDataStore.sessionTypes);

const sessions = computed(() => gpsDataStore.sessions);
const isLoadingSessions = computed(() => gpsDataStore.isLoadingSessions);
const isLoadingLocations = computed(() => gpsDataStore.isLoadingLocations);
const isLoadingSessionTypes = computed(() => gpsDataStore.isLoadingSessionTypes);

const trackCoordinatesForMap = computed(() => {
  if (gpsDataStore.selectedSessionLocations && gpsDataStore.selectedSessionLocations.length > 0){
    return [gpsDataStore.selectedTrackCoordinates];
  }
  return [];
});

const apiError = computed(() => gpsDataStore.error);

const getSessionTypeName = (typeJsonString: string | null | undefined): string => {
  if (!typeJsonString){
    return 'Unknown';
  }
  try {
    const typeObj = JSON.parse(typeJsonString);
    return typeObj.en || typeObj.et || typeJsonString || 'Unknown';
  } catch (e) {
    return typeJsonString;
  }
}

const filteredSessions = computed(() => {
  if (!selectedSessionTypeId.value){
    return sessions.value;
  }
  const selectedTypeObject = availableSessionTypes.value.find(type => type.id === selectedSessionTypeId.value);
  if (!selectedTypeObject){
    return sessions.value;
  }

  const filterTypeName = getSessionTypeName(selectedTypeObject.name);

  return sessions.value.filter(session => {
    const sessionTypeName = getSessionTypeName(session.gpsSessionType);
    return sessionTypeName === filterTypeName;
  });
});

onMounted(async () => {
  if (authStore.isAuthenticated){
    await gpsDataStore.fetchGpsSessions();
    await gpsDataStore.fetchGpsSessionTypes();
  } else {
    console.warn('User is not authenticated, cannot fetch GPS sessions.');
  }
});

const selectSession = async (sessionId: string | null) => {
  stopTrackUpdateTimer();

  if (sessionId == null || selectedSessionId.value === sessionId){
    selectedSessionId.value = null;
    gpsDataStore.clearSelectedTrackData();
    return;
  }

  selectedSessionId.value = sessionId;
  await gpsDataStore.fetchLocationsForSession(sessionId);

  if (gpsDataStore.selectedSessionLocations.length > 0){
    startTrackUpdateTimer();
  }
};

const startTrackUpdateTimer = () => {
  if (trackUpdateTimer.value){
    clearInterval(trackUpdateTimer.value);
  }
  if (selectedSessionId.value){
    trackUpdateTimer.value = window.setInterval(async () => {
      if (selectedSessionId.value){
        await gpsDataStore.fetchLocationsForSession(selectedSessionId.value);
      } else {
        stopTrackUpdateTimer();
      }
    }, updateIntervalMs.value)
  }
};

const stopTrackUpdateTimer = () => {
  if (trackUpdateTimer.value){
    clearInterval(trackUpdateTimer.value);
    trackUpdateTimer.value = null;
  }
};

watch(selectedSessionId, (newId, oldId) => {
  if (!newId && oldId){
    stopTrackUpdateTimer();
  }
});

onUnmounted(() => {
  stopTrackUpdateTimer();
})
</script>

<template>
    <div class="map-view-container">
      <aside class="sidebar">
        <h2>Tracks</h2>

        <div class="filter-group">
        <label for="sessionTypeFilter">Filter by Type:</label>
        <select id="sessionTypeFilter" v-model="selectedSessionTypeId" class="filter-select">
          <option value="">All Types</option>
          <option v-for="type in availableSessionTypes" :key="type.id" :value="type.id">
            {{ getSessionTypeName(type.name) }} </option>
        </select>
        <div v-if="isLoadingSessionTypes" class="loading-small">Loading types...</div>
        </div>

        <div v-if="isLoadingSessions" class="loading-message">Loading sessions...</div>
        <div v-if="apiError && !isLoadingSessions" class="error-message">Error: {{ apiError }}</div>

        <ul v-if="!isLoadingSessions && filteredSessions.length > 0" class="session-list">
          <li 
              v-for="session in filteredSessions"
              :key="session.id"
              @click="selectSession(session.id)"
              :class="{ 'selected-session': selectedSessionId === session.id }"
              class="session-item"
              role="button"
              tabindex="0"
              @keydown.enter="selectSession(session.id)"
              @keydown.space="selectSession(session.id)"
          >
              <strong>{{ session.name || 'Unnamed Track' }}</strong>
              <br />
              <small>Recorded: {{ new Date(session.recordedAt).toLocaleString() }}</small>
              <br />
              <small v-if="session.gpsSessionType">Type: {{ getSessionTypeName(session.gpsSessionType) }}</small>
              <br v-if="session.gpsSessionType && session.userFirstLastName" />
              <small v-if="session.userFirstLastName">By: {{ session.userFirstLastName }}</small>
              <br />
              <small v-if="session.distance != null">Distance: {{ (session.distance / 1000).toFixed(2)  }} km</small>
          </li>
        </ul>

        <p v-if="!isLoadingSessions && filteredSessions.length === 0 && !apiError && sessions.length > 0 && selectedSessionTypeId !== ''">
          No sessions match your filter criteria.
        </p>

        <p v-if="!isLoadingSessions && sessions.length === 0 && !apiError">
          No GPS sessions found.
        </p>

        <button v-if="selectedSessionId" @click="selectSession(null)" class="clear-selection-button">
          Clear Selected Track
        </button>
      </aside>

      <section class="map-section">
        <div v-if="isLoadingLocations && selectedSessionId" class="loading-overlay">Loading track data...</div>
        <MapDisplay :tracks="trackCoordinatesForMap" />
        <div v-if="selectedSessionId && !isLoadingLocations && trackCoordinatesForMap.length === 0 && (!gpsDataStore.selectedSessionLocations || gpsDataStore.selectedSessionLocations.length === 0)" class="info-message">
          No location data available for the selected track, or the track is empty.
        </div>
        <div v-if="!selectedSessionId && !isLoadingLocations" class="info-message">
          Select a track from the list to view it on the map.
        </div>
      </section>
    </div>
</template>

<style scoped>
.map-view-container {
  display: flex;
  height: calc(100vh - 130px); 
  max-height: calc(100vh - 130px);
  overflow: hidden;
}

.sidebar {
  width: 320px;
  padding: 1rem;
  border-right: 1px solid #dee2e6;
  overflow-y: auto;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.4rem;
  color: #343a40;
}

.filter-group {
  margin-bottom: 1rem;
}
.filter-group label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
  font-size: 0.9rem;
}
.filter-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  box-sizing: border-box;
  background-color: white;
}
.loading-small {
    font-size: 0.8em;
    color: #6c757d;
    margin-top: 0.25rem;
}

.session-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  overflow-y: auto;
}

.session-item {
  padding: 0.8rem 0.75rem;
  border-bottom: 1px solid #e9ecef;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
}

.session-item:last-child {
  border-bottom: none;
}

.session-item:hover {
  background-color: #e9ecef;
}

.session-item.selected-session {
  background-color: #007bff;
  color: white;
}
.session-item.selected-session small {
  color: #e0e0e0;
}

.session-item strong {
  font-weight: 500;
  display: block;
  margin-bottom: 0.25rem;
}
.session-item small {
  font-size: 0.8rem;
  color: #6c757d;
  display: block;
  line-height: 1.4;
}

.clear-selection-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  width: 100%;
  flex-shrink: 0;
}
.clear-selection-button:hover {
  background-color: #5a6268;
}

.map-section {
  flex-grow: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.map-section > :deep(#map-display-container-concise) {
    flex-grow: 1;
    min-height: 0;
}


.loading-message, .error-message, .info-message {
  padding: 1rem;
  text-align: center;
}
.error-message {
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c2c7;
  border-radius: 0.25rem;
  margin: 0.5rem;
}
.info-message {
  color: #0c5460;
  background-color: #d1ecf1;
  border: 1px solid #bee5eb;
  border-radius: 0.25rem;
  margin: 1rem;
  padding: 1rem;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  font-size: 1.2rem;
  color: #333;
}
</style>