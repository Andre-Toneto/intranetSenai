<template>
  <v-dialog v-model="isOpen" max-width="1000" persistent>
    <v-card elevation="24" rounded="xl" :style="{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }">
      <!-- Header com gradiente -->
      <v-sheet
        class="d-flex align-center justify-space-between pa-2"
        rounded="t-xl"
        :style="{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #6366f1 100%)' }"
      >
        <div class="d-flex align-center">
          <v-avatar size="64" class="elevation-8" :style="{ border: '4px solid rgba(255,255,255,0.3)' }">
            <v-img v-if="pessoa.foto" :src="pessoa.foto">
              <template #error>
                <v-icon color="white" size="32">mdi-account</v-icon>
              </template>
            </v-img>
            <v-icon v-else color="white" size="32">mdi-account</v-icon>
          </v-avatar>
          <div class="ml-4">
            <div class="d-flex align-center">
              <h2 class="text-h5 font-weight-bold text-white mr-3">{{ pessoa.nome?.toUpperCase() }}</h2>
              <v-chip size="small" color="success" variant="elevated">
                <v-icon start size="small">mdi-check-circle</v-icon>
                Ativo
              </v-chip>
            </div>
            <p class="text-body-2 text-white">{{ pessoa.cargo }}</p>
          </div>
        </div>
        <v-btn icon="mdi-close" variant="text" color="white" size="large" @click="isOpen = false" />
      </v-sheet>

      <!-- Conteúdo -->
      <v-card-text class="pa-6">
        <v-row>
          <!-- Cards -->
          <v-col cols="12">
            <v-row dense>
              <!-- foto -->
              <v-col cols="12" md="3" class="d-flex justify-center">
                <v-img v-if="pessoa.foto" :src="pessoa.foto" height="240" width="180" rounded="lg" cover class="elevation-6">
                  <template #error>
                    <v-sheet height="240" width="180" rounded="lg" class="elevation-6 d-flex align-center justify-center">
                      <v-icon size="80" color="grey-lighten-2">mdi-account</v-icon>
                    </v-sheet>
                  </template>
                </v-img>
                <v-sheet v-else height="240" width="180" rounded="lg" class="elevation-6 d-flex align-center justify-center">
                  <v-icon size="80" color="grey-lighten-2">mdi-account</v-icon>
                </v-sheet>
              </v-col>
              
              <!-- Acadêmico -->
              <v-col cols="12" sm="3">
                <v-card elevation="4" rounded="xl" variant="tonal">
                  <v-card-text>
                    <div class="d-flex align-center mb-2">
                      <v-icon color="primary" class="mr-2">mdi-school</v-icon>
                      <span class="text-subtitle-1 font-weight-medium">Acadêmico</span>
                    </div>
                    <v-divider class="mb-2" />
                    <v-list class="flex" density="compact">
                      <v-list-item title="Matrícula" :subtitle="pessoa.matricula" />
                      <v-list-item title="Turma" :subtitle="pessoa.turma" />
                      <v-list-item title="Curso" :subtitle="pessoa.curso" />
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Pessoal -->
              <v-col cols="12" sm="3">
                <v-card elevation="4" rounded="xl" variant="tonal">
                  <v-card-text>
                    <div class="d-flex align-center mb-2">
                      <v-icon color="warning" class="mr-2">mdi-account-circle</v-icon>
                      <span class="text-subtitle-1 font-weight-medium">Pessoal</span>
                    </div>
                    <v-divider class="mb-2" />
                    <v-list density="compact">
                      <v-list-item title="RG" :subtitle="pessoa.rg || 'Não informado'" />
                      <v-list-item title="CPF" :subtitle="pessoa.cpf || 'Não informado'" />
                      <v-list-item title="Email" :subtitle="pessoa.email || 'Não informado'" />
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Filiação -->
              <v-col cols="12" sm="3">
                <v-card elevation="4" rounded="xl" variant="tonal">
                  <v-card-text>
                    <div class="d-flex align-center mb-2">
                      <v-icon color="success" class="mr-2">mdi-account-group</v-icon>
                      <span class="text-subtitle-1 font-weight-medium">Filiação</span>
                    </div>
                    <v-divider class="mb-2" />
                    <v-list density="compact">
                      <v-list-item title="Mãe" :subtitle="pessoa.mae || 'Não informado'" />
                      <v-list-item title="Pai" :subtitle="pessoa.pai || 'Não informado'" />
                      <v-list-item title="Empresa" :subtitle="pessoa.empresa || 'Não informado'" />
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Contato -->
              <v-col cols="12" sm="6">
                <v-card elevation="4" rounded="xl" variant="tonal">
                  <v-card-text>
                    <div class="d-flex align-center mb-2">
                      <v-icon color="info" class="mr-2">mdi-phone</v-icon>
                      <span class="text-subtitle-1 font-weight-medium">Contato</span>
                    </div>
                    <v-divider class="mb-2" />
                    <v-list density="compact">
                      <v-list-item title="Telefone" :subtitle="pessoa.telefone || 'Não informado'" />
                      <v-list-item title="Celular" :subtitle="pessoa.celular || 'Não informado'" />
                      <v-list-item title="Endereço" :subtitle="getEndereco()" />
                      <v-list-item title="Cidade" :subtitle="getCidade()" />
                      <v-list-item title="CEP" :subtitle="pessoa.cep || 'Não informado'" />
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Ocorrências -->
              <v-col cols="12" sm="6">
                <v-card elevation="4" rounded="xl" variant="tonal">
                  <v-card-text>
                    <div class="d-flex justify-space-between align-center mb-3">
                      <div class="d-flex align-center">
                        <v-icon color="error" class="mr-2">mdi-history</v-icon>
                        <h3 class="text-subtitle-1 font-weight-medium">Histórico de Ocorrências</h3>
                      </div>
                      <v-chip v-if="pessoa.ocorrencias?.length" size="small" color="error" variant="outlined">
                        {{ pessoa.ocorrencias.length }} registros
                      </v-chip>
                    </div>

                    <!-- Lista com scroll fixo -->
                    <v-sheet height="200" rounded="lg" border class="pa-2 overflow-y-auto">
                      <template v-if="pessoa.ocorrencias && pessoa.ocorrencias.length">
                        <v-card
                          v-for="(ocorrencia, index) in pessoa.ocorrencias"
                          :key="index"
                          class="mb-2"
                          variant="outlined"
                          rounded="lg"
                        >
                          <v-card-text class="pa-3">
                            <div class="d-flex">
                              <v-icon color="error" size="12" class="mt-1 mr-2">mdi-circle</v-icon>
                              <div>
                                <p class="text-body-2">{{ ocorrencia }}</p>
                                <p class="text-caption d-flex align-center">
                                  <v-icon size="12" class="mr-1">mdi-calendar</v-icon>
                                  {{ new Date().toLocaleDateString('pt-BR') }}
                                </p>
                              </div>
                            </div>
                          </v-card-text>
                        </v-card>
                      </template>
                      <template v-else>
                        <div class="text-center pa-6">
                          <v-icon size="64" color="success" class="mb-2">mdi-check-circle-outline</v-icon>
                          <h4 class="text-subtitle-1 font-weight-medium">Nenhuma ocorrência registrada</h4>
                          <p class="text-body-2">{{ pessoa.nome }} não possui registros de ocorrências.</p>
                        </div>
                      </template>
                    </v-sheet>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>

      <!-- Footer -->
      <v-card-actions class="pa-6 pt-0">
        <v-btn variant="outlined" color="primary" @click="isOpen = false" rounded="lg" size="large">
          <v-icon start>mdi-arrow-left</v-icon>
          Voltar
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  pessoa: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const getEndereco = () => {
  const endereco = props.pessoa.endereco || ''
  const bairro = props.pessoa.bairro || ''
  
  if (endereco && bairro) {
    return `${endereco}, ${bairro}`
  } else if (endereco) {
    return endereco
  } else if (bairro) {
    return bairro
  }
  
  return 'Não informado'
}

const getCidade = () => {
  const cidade = props.pessoa.cidade || ''
  const estado = props.pessoa.estado || ''
  
  if (cidade && estado) {
    return `${cidade} - ${estado}`
  } else if (cidade) {
    return cidade
  } else if (estado) {
    return estado
  }
  
  return 'Não informado'
}
</script>
