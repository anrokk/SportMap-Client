<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useGpsDataStore } from '@/stores/gpsData';
import { useAuthStore } from '@/stores/auth';
import type { GpsSessionCreate, GpsSessionType } from '@/types';
import router from '@/router';

const gpsDataStore = useGpsDataStore();
const authStore = useAuthStore();

const name = ref('');
const description = ref('');
const selectedGpsSessionTypeId = ref<string>('');
const recordedAt = ref<string>(new Date().toISOString().slice(0, 16));
const paceMin = ref<number | null>(null);
const paceMax = ref<number | null>(null);

const sessionTypes = computed(() => gpsDataStore.sessionTypes);
const isLoadingSessionTypes = computed(() => gpsDataStore.isLoadingSessionTypes);

const isLoading = computed(() => gpsDataStore.isLoadingSessions);
const creationError = computed(() => gpsDataStore.error);

const getSessionTypeName = (typeJsonString: string | null | undefined): string => {
    if(!typeJsonString){
        return 'Unknown';
    }
    try{
        const typeObj = JSON.parse(typeJsonString);
        return typeObj.en || typeObj.et || typeJsonString || 'Unknown type';
    } catch (e) {
        return typeJsonString;
    }
};

onMounted(async () => {
    if (authStore.isAuthenticated){
        if (gpsDataStore.sessionTypes.length === 0){
            await gpsDataStore.fetchGpsSessionTypes();
        }
    } else {
        router.push({ name: 'login'});
    }
});

const handleSubmit = async () => {
    if (!name.value || !description.value || !selectedGpsSessionTypeId.value){
        gpsDataStore.error = "Name, description and session type are required.";
        return;
    }

    const sessionData: GpsSessionCreate = {
        name: name.value,
        description: description.value,
        gpsSessionTypeId: selectedGpsSessionTypeId.value,
        recordedAt: recordedAt.value ? new Date(recordedAt.value).toISOString() : null,
        paceMin: paceMin.value,
        paceMax: paceMax.value
    };

    try {
        const newSession = await gpsDataStore.createNewGpsSession(sessionData);
        if (newSession){
            router.push({ name: 'map' });
        } else{

        }
    } catch (error){
        console.error('Error creating session:', error);
    }
};
</script>

<template>
    <div class="create-track-view">
        <div class="form-container">
            <h2>Create New Track</h2>
            <form @submit.prevent="handleSubmit" class="track-form">
                <div class="form-group">
                    <label for="name">Track Name</label>
                    <input type="text" id="name" v-model="name" required :disabled="isLoading" />
                </div>

                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" v-model="description" rows="3" required :disabled="isLoading"></textarea>
                </div>

                <div class="form-group">
                    <label for="gpsSessionTypeId">Track Type</label>
                    <select id="gpsSessionTypeId" v-model="selectedGpsSessionTypeId" required :disabled="isLoading || isLoadingSessionTypes">
                        <option disabled value="">Please select a type</option>
                        <option v-for="type in sessionTypes" :key="type.id" :value="type.id">
                            {{ getSessionTypeName(type.name) }}
                        </option>
                    </select>
                    <div v-if="isLoadingSessionTypes" class="loading-small">Loading types...</div>
                </div>

                <div class="form-group">
                    <label for="recordedAt">Recorded at (Start Time)</label>
                    <input type="datetime-local" id="recordedAt" v-model="recordedAt" :disabled="isLoading" />
                </div>

                <div class="form-group">
                    <label for="paceMin">Min pace (min/km)</label>
                    <input type="number" step="0.01" id="paceMin" v-model.number="paceMin" placeholder="Optional" :disabled="isLoading" />
                </div>

                <div class="form-group">
                    <label for="paceMax">Max pace (min/km)</label>
                    <input type="number" step="0.01" id="paceMax" v-model.number="paceMax" placeholder="Optional" :disabled="isLoading" />
                </div>

                <div v-if="creationError" class="error-message">
                    <p>{{ creationError }}</p>
                </div>

                <button type="submit" class="submit-button" :disabled="isLoading">
                    <span v-if="isLoading">Creating track...</span>
                    <span v-else>Create track</span>
                </button>
            </form>
        </div>
    </div>
</template>

<style scoped>
.create-track-view {
  display: flex;
  justify-content: center;
  padding: 2rem;
  background-color: #f4f7f6;
}

.form-container {
  background-color: #ffffff;
  padding: 2rem 2.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
  font-weight: 600;
}

.track-form .form-group {
  margin-bottom: 1.25rem;
}

.track-form label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.track-form input[type="text"],
.track-form input[type="datetime-local"],
.track-form input[type="number"],
.track-form textarea,
.track-form select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  transition: border-color 0.2s ease-in-out;
  font-size: 0.95rem;
}

.track-form textarea {
  resize: vertical;
  min-height: 80px;
}

.track-form input:focus,
.track-form textarea:focus,
.track-form select:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #28a745; /* Green for create */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s ease-in-out;
}

.submit-button:hover {
  background-color: #218838;
}

.submit-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  padding: 0.75rem;
  border-radius: 4px;
  margin-top: 1rem;
  margin-bottom: 1rem;
  text-align: center;
}

.error-message p {
  margin: 0;
}

.loading-small {
    font-size: 0.8em;
    color: #6c757d;
    margin-top: 0.25rem;
}
</style>
