<template>
    <div class="profile-container">
        <PageHeader @go-back="handleGoBack">
            <template v-slot:title>My Profile</template>
            <template v-slot:actions>
                <span class="settings">
                    <i class="las la-sliders-h"></i>
                </span>
            </template>
        </PageHeader>
        <div class="user-info-container">
            <div class="user-info">
                <div class="info">
                    <div class="username">
                        {{ authenticatedUser.username }}
                    </div>
                    <div class="mail">
                        <span v-if="authenticatedUser.email">
                            {{ authenticatedUser.email }}
                        </span>
                        <span v-else>Add email</span>
                    </div>
                </div>
                <div class="image"></div>
            </div>
            <div class="links">
                <router-link :to="{ name: 'myRecipes' }">
                    <button>
                        <i class="las la-book"></i>
                        <span>My Recipes</span>
                    </button>
                </router-link>
                <router-link :to="{ name: 'favRecipes' }">
                    <button>
                        <i class="lar la-heart"></i>
                        <span>Favorites</span>
                    </button>
                </router-link>
                <router-link :to="{ name: 'myWeekPlan' }">
                    <button>
                        <i class="las la-calendar-week"></i>
                        <span>Week Plans</span>
                    </button>
                </router-link>
            </div>
            <div class="more-info">
                <!-- <span class="title">More…</span> -->
                <div>
                    <span>Logout</span>
                    <i class="las la-sign-out-alt"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useAuthState from '@/store/auth-state';
import PageHeader from '@/components/shared/PageHeader.vue';

export default defineComponent({
    name: 'Profile',

    components: {
        PageHeader,
    },

    setup() {
        const { authenticatedUser } = useAuthState();

        return {
            authenticatedUser,
        };
    },
});
</script>

<style scoped>
.user-info-container {
    margin: 0 1rem;
}
.user-info {
    display: flex;
    padding: 1rem 0;
}
.info {
    text-align: left;
    flex-grow: 1;
}
.username {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 0.5rem;
    letter-spacing: 1.2px;
}
.mail {
    font-size: 14px;
    color: var(--grey-800);
}
.image {
    height: 60px;
    width: 60px;
    border-radius: 60px;
    background-image: url('https://randomuser.me/api/portraits/men/46.jpg');
    background-size: cover;
    background-position: center;
}
.links {
    display: flex;
    justify-content: space-between;
    padding: 1rem 0;
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
}
.links a {
    width: 100%;
}
.links button {
    flex-wrap: wrap;
    margin: auto;
}
.links i {
    display: block;
    width: 100%;
    margin-bottom: 1rem;
    font-size: 28px;
}
.links span {
    display: block;
    font-size: 14px;
    color: var(--grey-800);
}

.more-info {
    text-align: left;
    margin-top: 4rem;
}
.more-info .title {
    display: block;
    margin: 20px 0;
    font-size: 20px;
    font-family: var(--title-font);
}
.more-info > div {
    padding: 1rem;
    display: flex;
    justify-content: space-between;
}
.la-arrow-right {
    font-size: 16px;
}
</style>
