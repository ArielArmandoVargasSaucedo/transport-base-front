<template>
  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
    <q-card class="fit no-shadow" bordered>
      <q-card-section class="text-h6 q-pb-none">
        <q-item>
          <q-item-section avatar class="">
            <q-icon color="blue" name="access_time" style="font-size: 2em;" />
          </q-item-section>

          <q-item-section>
            <div class="text-h6">{{ props.title }}</div>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-card-section class="">
        <q-timeline color="secondary">

          <q-timeline-entry v-for="(timeline, index) in props.infoLines" :key="index" :title="timeline.title"
            :color="timeline.color" :icon="timeline.icon" :side="timeline.side">
            <div>
              {{ timeline.desc }}
            </div>
          </q-timeline-entry>
        </q-timeline>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { InfoLineContentInterface } from 'src/interfaces/InfoLineContentInterface';

interface Props {
  infoLines: Array<InfoLineContentInterface>
  title: string
}

// se definen las props
const props: Props = defineProps<Props>()


</script>
