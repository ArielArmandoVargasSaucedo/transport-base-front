<template>
    <q-btn flat color="white" icon="language">
        <q-menu>
            <q-list style="min-width: 100px">
                <q-item clickable @click="$i18n.locale = 'es'" v-close-popup>
                    <q-item-section>Español</q-item-section>
                </q-item>
                <q-item clickable @click="$i18n.locale = 'en'" v-close-popup>
                    <q-item-section>English</q-item-section>
                </q-item>
            </q-list>
        </q-menu>
    </q-btn>
</template>

<script lang="ts" setup></script>

<style></style>