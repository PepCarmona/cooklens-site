<template>
    <div>
        <div>
            <button @click="showAddRecipe">Add recipe</button>
            <button @click="showAllRecipes">View all recipes</button>
            <button @click="showSearchRecipe">Search recipe</button>
        </div>
        <div v-if="selectedView === 'add'">
            <h3>New recipe</h3>

            <label for="title">Title: </label>
            <input type="text" id="title" />

            <label for="body">Description: </label>
            <input type="text" id="body" />
        </div>
        <div v-if="selectedView === 'view'">
            <h3>Total number of recipes: {{}}</h3>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="selectedView === 'search'">
            <h3>Search by title</h3>

            <input type="text" id="search" />
            <button>Search</button>

            <div>
                <div>Title2</div>
                <div>Description</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

type View = 'add' | 'view' | 'search';

export default defineComponent({
    setup() {
        const selectedView = ref<View | null>(null);

        const data = {
            selectedView,
        };

        function showAddRecipe() {
            selectedView.value = selectedView.value === 'add' ? null : 'add';
        }

        function showAllRecipes() {
            selectedView.value = selectedView.value === 'view' ? null : 'view';
        }

        function showSearchRecipe() {
            selectedView.value =
                selectedView.value === 'search' ? null : 'search';
        }

        return {
            ...data,
            showAddRecipe,
            showAllRecipes,
            showSearchRecipe,
        };
    },
});
</script>
