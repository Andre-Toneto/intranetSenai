<template>
  <v-navigation-drawer
    app
    permanent
    :width="navigationWidth"
    color="surface"
    elevation="4"
    border="0"
  >
    <!-- Header -->
    <v-list-item class="pa-4">
      <template v-slot:prepend>
        <v-icon color="senai-red" size="large">mdi-view-dashboard</v-icon>
      </template>
      <v-list-item-title class="text-h6 font-weight-medium">Menu Principal</v-list-item-title>
    </v-list-item>

    <v-divider />

    <!-- Navigation Items -->
    <v-list density="comfortable" nav class="pa-2">
      <v-list-item
        v-for="item in navItems"
        :key="item.text"
        :to="`/${item.route}`"
        rounded="xl"
        class="mb-1"
      >
        <template v-slot:prepend>
          <v-icon :color="getIconColor(item.route)">{{ item.icon }}</v-icon>
        </template>
        <v-list-item-title class="font-weight-medium">{{ item.text }}</v-list-item-title>
        <template v-slot:append v-if="item.badge">
          <v-chip size="x-small" color="senai-red" text-color="white">
            {{ item.badge }}
          </v-chip>
        </template>
      </v-list-item>
    </v-list>

    <!-- Footer -->
    <template v-slot:append>
      <v-divider />
      <v-list-item
        prepend-icon="mdi-help-circle"
        title="Ajuda"
        subtitle="Suporte técnico"
        density="compact"
        @click="openHelp"
        class="pa-4"
      />
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const navigationWidth = ref(280)

const navItems = [
  { text: 'Carômetro', route: 'carometro', icon: 'mdi-account-group', badge: 'Novo' },
  { text: 'Planilha de Registros', route: '', icon: 'mdi-table-large' },
  { text: 'Formulários', route: 'formularios', icon: 'mdi-form-select' },
  { text: 'Horário Escolar', route: '', icon: 'mdi-calendar-clock' },
  { text: 'Calendário Escolar', route: '', icon: 'mdi-calendar' },
  { text: 'Proposta Pedagógica', route: '', icon: 'mdi-book-open-variant' },
  { text: 'Plano Escolar', route: '', icon: 'mdi-file-document-outline' },
  { text: 'Coordenação', route: '', icon: 'mdi-account-supervisor' },
  { text: 'Regimento SENAI', route: '', icon: 'mdi-gavel' },
  { text: 'Educacional Plano', route: '', icon: 'mdi-school' }
]

const getIconColor = (routeName) => {
  const currentRoute = route?.path || ''
  return currentRoute.includes(routeName) ? 'senai-red' : 'senai-navy'
}

const openHelp = () => {
  console.log('Abrindo ajuda...')
}

onMounted(() => {
  const updateWidth = () => {
    navigationWidth.value = window.innerWidth < 960 ? 260 : 280
  }

  updateWidth()
  window.addEventListener('resize', updateWidth)

  onUnmounted(() => {
    window.removeEventListener('resize', updateWidth)
  })
})
</script>
