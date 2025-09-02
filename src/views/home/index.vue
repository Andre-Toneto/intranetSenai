<template>
  <v-container fluid>
    <!-- Welcome Section -->
    <v-card color="senai-red" dark elevation="8" rounded="lg" class="mb-6">
      <v-card-text class="pa-6">
        <v-row align="center">
          <v-col cols="12" md="8">
            <h1 class="text-h3 font-weight-light mb-3">Bem-vindo ao Portal SENAI</h1>
            <p class="text-h6 font-weight-light opacity-80">
              Acesse todas as ferramentas educacionais em um só lugar
            </p>
          </v-col>
          <v-col cols="12" md="4" class="text-center">
            <v-icon size="80" color="white" class="opacity-80">mdi-school</v-icon>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Main Content Grid -->
    <v-row>
      <!-- Security Alert -->
      <v-col cols="12" lg="8">
        <v-card color="error" dark elevation="4" rounded="lg">
          <v-card-text class="pa-6">
            <v-row align="start" no-gutters>
              <v-col cols="auto">
                <v-icon size="48" class="mr-4">mdi-shield-alert</v-icon>
              </v-col>
              <v-col>
                <h2 class="text-h5 mb-3">Proteja-se contra o Phishing</h2>
                <p class="text-body-1 mb-4">
                  Mantenha-se seguro! Aprenda a identificar e evitar ataques de phishing
                  que podem comprometer seus dados pessoais e profissionais.
                </p>
                <v-btn
                  variant="outlined"
                  color="white"
                  size="large"
                  prepend-icon="mdi-open-in-new"
                >
                  Saiba Mais
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Quick Access Tools -->
      <v-col cols="12" lg="4">
        <v-row dense>
          <!-- Power BI -->
          <v-col cols="12" sm="6" lg="12">
            <v-card
              elevation="4"
              rounded="lg"
              hover
              @click="openPowerBI"
              style="cursor: pointer"
            >
              <v-sheet color="warning" class="pa-4 text-center">
                <v-icon size="40" color="white" class="mb-2">mdi-chart-bar</v-icon>
                <h3 class="text-h6 text-white">Power BI</h3>
                <p class="text-body-2 text-white opacity-80 mb-0">Relatórios e Dashboards</p>
              </v-sheet>
            </v-card>
          </v-col>

          <!-- Educational Planning -->
          <v-col cols="12" sm="6" lg="12">
            <v-card
              elevation="4"
              rounded="lg"
              hover
              @click="openPlanning"
              style="cursor: pointer"
            >
              <v-sheet color="info" class="pa-4 text-center">
                <v-icon size="40" color="white" class="mb-2">mdi-calendar-edit</v-icon>
                <h3 class="text-h6 text-white">Planejamento de Ensino</h3>
                <p class="text-body-2 text-white opacity-80 mb-0">Organização Pedagógica</p>
              </v-sheet>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Additional Tools Section -->
    <v-row class="mt-6">
      <v-col cols="12">
        <h2 class="text-h4 text-senai-red font-weight-medium mb-4">Ferramentas Principais</h2>
      </v-col>

      <v-col
        v-for="tool in mainTools"
        :key="tool.name"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card
          elevation="2"
          rounded="lg"
          hover
          @click="openTool(tool)"
          style="cursor: pointer"
        >
          <v-card-text class="pa-4 text-center">
            <v-icon :color="tool.color" size="36" class="mb-3">{{ tool.icon }}</v-icon>
            <h4 class="text-h6 text-senai-red font-weight-medium">{{ tool.name }}</h4>
            <p class="text-body-2 text-medium-emphasis mb-0">{{ tool.description }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const mainTools = ref([
  {
    name: 'Carômetro',
    description: 'Gestão de alunos',
    icon: 'mdi-account-group',
    color: 'senai-red',
    route: '/carometro/login'
  },
  {
    name: 'Calendário',
    description: 'Cronograma escolar',
    icon: 'mdi-calendar',
    color: 'primary',
    route: '/calendario'
  },
  {
    name: 'Formulários',
    description: 'Documentos digitais',
    icon: 'mdi-form-select',
    color: 'success',
    route: '/formularios'
  },
  {
    name: 'Coordenação',
    description: 'Gestão administrativa',
    icon: 'mdi-account-supervisor',
    color: 'warning',
    route: '/coordenacao'
  }
])

const openPowerBI = () => {
  console.log('Abrindo Power BI...')
}

const openPlanning = () => {
  console.log('Abrindo Planejamento...')
}

const openTool = (tool) => {
  router.push(tool.route)
}
</script>
