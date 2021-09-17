<template>
    <CustomModal v-if="isLoading">
        <div class="modalContent">
            <span class="mb-1">Importing Recipe</span>
            <LoadingSpinner class="m-auto" size="xxxl" />
        </div>
    </CustomModal>
    <div class="import-container mt-1 w-100 p-1 justify-center">
        <div class="import-inner-container row mt-0 justify-center">
            <div class="tooltip-container">
                <span class="row justify-center mb-05"
                    >Import recipe from one of our &nbsp;
                    <span
                        @click="showIntegratedSitesMobile"
                        class="dotted"
                        :class="{ loading: integratedSites.length === 0 }"
                    >
                        supported sites
                    </span>
                    <div
                        v-if="integratedSites.length > 0"
                        class="tooltip"
                        ref="tooltip"
                    >
                        <span v-for="site in integratedSites" :key="site">
                            {{ site }}
                        </span>
                    </div>
                    <div
                        @click="hideIntegratedSitesMobile"
                        class="overlay"
                        ref="overlay"
                    ></div>
                </span>
            </div>
            <div class="row mt-05">
                <div class="d-flex w-100">
                    <input
                        ref="input"
                        class="w-100 p-05"
                        type="text"
                        placeholder="Url"
                        @keypress="autoImport"
                    />
                    <button @click="importFromUrl" class="ml-05">Import</button>
                </div>

                <div v-if="importErrors" class="errors">
                    {{ importErrors }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { URI } from '@/api/config';
import { Recipe } from '@/api/recipes/recipe';
import { AxiosError, AxiosResponse, AxiosStatic } from 'axios';
import { computed, defineComponent, inject, onMounted, ref } from 'vue';
import CustomModal from './shared/CustomModal.vue';
import { EOS_LOADING_ANIMATED as LoadingSpinner } from 'eos-icons-vue3';

export default defineComponent({
    name: 'ImportRecipe',

    components: {
        CustomModal,
        LoadingSpinner,
    },

    emits: ['importedRecipe'],

    setup(_, { emit }) {
        const axios: AxiosStatic | undefined = inject('axios');

        const input = ref<HTMLInputElement>();
        const tooltip = ref<HTMLDivElement>();
        const overlay = ref<HTMLDivElement>();

        const integratedSites = ref<string[]>([]);
        const importErrors = ref<string | null>(null);

        const windowWidth = ref<number>(window.innerWidth);

        const isLoading = ref(false);

        onMounted(() => {
            window.addEventListener(
                'resize',
                () => (windowWidth.value = window.innerWidth)
            );

            axios
                ?.get(URI.recipes.integratedSites)
                .then(
                    (response) =>
                        (integratedSites.value = Object.keys(response.data))
                )
                .catch((err) => console.error(err));
            input.value?.focus();
        });

        const isMobile = computed(() => windowWidth.value < 768);

        function importFromUrl() {
            const inputUrl = input.value?.value ?? '';

            importErrors.value = null;

            if (inputUrl === '') {
                importErrors.value = 'Input URL is empty';
                return;
            }

            isLoading.value = true;

            const url = new URL(URI.recipes.import);
            url.searchParams.append('url', inputUrl);

            axios
                ?.get(url.toString())
                .then((response: AxiosResponse<Recipe>) => {
                    emit('importedRecipe', response.data);
                })
                .catch((err: AxiosError) => {
                    console.error(err.response?.data);
                    importErrors.value = err.response?.data;
                })
                .finally(() => (isLoading.value = false));
        }

        // TODO: refactor to v-if
        function showIntegratedSitesMobile() {
            if (overlay.value && tooltip.value && isMobile.value) {
                overlay.value.style.display = 'block';
                tooltip.value.style.display = 'block';
            }
        }

        function hideIntegratedSitesMobile() {
            if (overlay.value && tooltip.value) {
                overlay.value.style.display = 'none';
                tooltip.value.style.display = 'none';
            }
        }

        function autoImport(event: KeyboardEvent) {
            if (event.key === 'Enter') {
                importFromUrl();
            }
        }

        return {
            input,
            tooltip,
            overlay,
            importErrors,
            integratedSites,
            isLoading,
            isMobile,
            importFromUrl,
            showIntegratedSitesMobile,
            hideIntegratedSitesMobile,
            autoImport,
        };
    },
});
</script>

<style scoped>
.import-container {
    background-color: lightgrey;
}

span {
    font-size: 0.95rem;
}
span.dotted {
    border-bottom: 1px dotted black;
    cursor: help;
}
span.dotted.loading {
    cursor: progress;
}
input {
    background-color: rgba(255, 255, 255, 0.5);
    border: 1px solid black;
    outline: none;
}
input:focus {
    border: 2px solid orange;
    border-radius: 2px;
}
button {
    background-color: grey;
    color: white;
    border: 1px solid black;
    border-radius: 2px;
    padding: 1rem;
}

.tooltip-container {
    position: relative;
}
.tooltip {
    display: none;
    position: absolute;
    bottom: -100%;
    right: 0;
    background-color: black;
    color: white;
    padding: 0.4rem;
    border-radius: 5px;
    z-index: 11;
}
.tooltip::after {
    content: ' ';
    position: absolute;
    bottom: 100%;
    right: 50%;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent black transparent;
}
.tooltip > span::before {
    content: '· ';
}
.dotted:hover + .tooltip {
    display: block;
}

.overlay {
    display: none;
    position: fixed;
    height: calc(100vh - 100px);
    width: 100vw;
    top: 50px;
    left: 0;
    background-color: transparent;
    z-index: 10;
}

.errors {
    margin-top: 0.5rem;
    color: red;
    font-size: 0.8rem;
}

.modalContent > * {
    display: block;
}
.modalContent > span {
    font-size: 1.2rem;
    font-weight: 600;
}

@media only screen and (min-width: 500px) {
    span {
        font-size: 1.2rem;
    }
}
@media only screen and (min-width: 767px) {
    .tooltip {
        bottom: 0;
        right: -32%;
    }
    .tooltip::after {
        bottom: 50%;
        right: 99%;
        border-color: transparent black transparent transparent;
    }
}
@media only screen and (min-width: 769px) {
    .import-inner-container {
        width: 60%;
        margin-left: auto;
        margin-right: auto;
    }
    span {
        font-size: 1.4rem;
    }
}
</style>
