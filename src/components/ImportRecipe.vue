<template>
    <CustomModal v-if="isLoading">
        <LoadingModal>Importing Recipe ...</LoadingModal>
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
                            {{ site.name }}
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
import { Recipe } from '@/api/types/recipe';
import { computed, defineComponent, onMounted, ref } from 'vue';
import CustomModal from '@/components/shared/CustomModal.vue';
import LoadingModal from '@/components/shared/LoadingModal.vue';
import useRecipeState from '@/store/recipe-state';

export default defineComponent({
    name: 'ImportRecipe',

    components: {
        CustomModal,
        LoadingModal,
    },

    emits: ['importedRecipe'],

    setup(_, { emit }) {
        const input = ref<HTMLInputElement>();
        const tooltip = ref<HTMLDivElement>();
        const overlay = ref<HTMLDivElement>();

        const importErrors = ref<string | null>(null);

        const windowWidth = ref<number>(window.innerWidth);

        const { isLoading, integratedSites } = useRecipeState();

        onMounted(() => {
            window.addEventListener(
                'resize',
                () => (windowWidth.value = window.innerWidth)
            );

            useRecipeState().getIntegratedSites();

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

            useRecipeState()
                .importRecipe(inputUrl)
                .then((importedRecipe: Recipe) => {
                    emit('importedRecipe', importedRecipe);
                })
                .catch((err: string) => {
                    importErrors.value = err;
                });
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
