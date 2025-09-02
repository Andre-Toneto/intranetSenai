<template>
  <v-dialog v-model="isOpen" max-width="1100" persistent>
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
                      <v-chip v-if="ocorrencias?.length" size="small" color="error" variant="outlined">
                        <template v-if="termoPesquisa.trim() && ocorrenciasFiltradas.length !== ocorrencias.length">
                          {{ ocorrenciasFiltradas.length }} de {{ ocorrencias.length }}
                        </template>
                        <template v-else>
                          {{ ocorrencias.length }} registro{{ ocorrencias.length !== 1 ? 's' : '' }}
                        </template>
                      </v-chip>
                    </div>

                    <!-- Barra de pesquisa e botão para adicionar ocorrência -->
                    <div class="d-flex align-center gap-3 mb-3">
                      <v-text-field
                        v-model="termoPesquisa"
                        placeholder="Pesquisar por tipo, data, descrição..."
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-magnify"
                        clearable
                        hide-details
                        class="flex-grow-1 "
                      />
                      <v-btn
                        color="error"
                        variant="outlined"
                        prepend-icon="mdi-plus"
                        @click="abrirModalOcorrencia()"
                        :loading="saving"
                        class="ml-3"
                      >
                      <span>
                        Nova <br />Ocorrência
                      </span>
                      </v-btn>
                    </div>

                    <!-- Lista com scroll fixo -->
                    <v-sheet height="200" rounded="lg" border class="pa-2 overflow-y-auto">
                      <template v-if="ocorrenciasFiltradas && ocorrenciasFiltradas.length">
                        <v-card
                          v-for="ocorrencia in ocorrenciasFiltradas"
                          :key="ocorrencia.id"
                          class="mb-2"
                          variant="outlined"
                          rounded="lg"
                        >
                          <v-card-text class="pa-3">
                            <div class="d-flex justify-space-between">
                              <div class="d-flex flex-grow-1">
                                <v-icon color="error" size="12" class="mt-1 mr-2">mdi-circle</v-icon>
                                <div class="flex-grow-1">
                                  <div class="d-flex align-center mb-1">
                                    <v-chip size="x-small" color="warning" variant="outlined" class="mr-2">
                                      {{ ocorrencia.tipo || 'Outro' }}
                                    </v-chip>
                                  </div>
                                  <p class="text-body-2 mb-1">{{ ocorrencia.descricao || ocorrencia }}</p>
                                  <div class="d-flex align-center justify-space-between">
                                    <p class="text-caption d-flex align-center">
                                      <v-icon size="12" class="mr-1">mdi-calendar</v-icon>
                                      {{ new Date(ocorrencia.data || Date.now()).toLocaleDateString('pt-BR') }}
                                    </p>
                                    <p class="text-caption d-flex align-center">
                                      <v-icon size="12" class="mr-1">mdi-account</v-icon>
                                      {{ ocorrencia.autor || 'N/A' }}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div class="d-flex flex-column ml-2">
                                <v-btn
                                  icon="mdi-pencil"
                                  size="x-small"
                                  variant="text"
                                  color="primary"
                                  @click="abrirModalOcorrencia(ocorrencia)"
                                  class="mb-1"
                                />
                                <v-btn
                                  icon="mdi-delete"
                                  size="x-small"
                                  variant="text"
                                  color="error"
                                  @click="excluirOcorrencia(ocorrencia)"
                                />
                              </div>
                            </div>
                          </v-card-text>
                        </v-card>
                      </template>
                      <template v-else>
                        <div class="text-center pa-6">
                          <template v-if="termoPesquisa.trim() && ocorrencias.length > 0">
                            <!-- Nenhum resultado na pesquisa -->
                            <v-icon size="64" color="info" class="mb-2">mdi-magnify</v-icon>
                            <h4 class="text-subtitle-1 font-weight-medium">Nenhuma ocorrência encontrada</h4>
                            <p class="text-body-2">Nenhuma ocorrência corresponde à pesquisa "{{ termoPesquisa }}".</p>
                          </template>
                          <template v-else>
                            <!-- Nenhuma ocorrência registrada -->
                            <v-icon size="64" color="success" class="mb-2">mdi-check-circle-outline</v-icon>
                            <h4 class="text-subtitle-1 font-weight-medium">Nenhuma ocorrência registrada</h4>
                            <p class="text-body-2">{{ pessoa.nome }} não possui registros de ocorrências.</p>
                          </template>
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

  <!-- Modal para Adicionar/Editar Ocorrência -->
  <v-dialog v-model="modalOcorrencia" max-width="600" persistent>
    <v-card rounded="xl">
      <v-card-title class="pa-6 pb-4">
        <div class="d-flex align-center">
          <v-icon color="error" class="mr-3">mdi-alert-circle</v-icon>
          <h3>{{ editandoOcorrencia ? 'Editar Ocorrência' : 'Nova Ocorrência' }}</h3>
        </div>
      </v-card-title>

      <v-card-text class="pa-6 pt-0">
        <v-form>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="formOcorrencia.tipo"
                :items="tiposOcorrencia"
                label="Tipo de Ocorrência"
                variant="outlined"
                density="compact"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formOcorrencia.data"
                label="Data"
                type="date"
                variant="outlined"
                density="compact"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="formOcorrencia.autor"
                label="Professor/Responsável"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-account-tie"
                placeholder="Nome do professor que está registrando"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="formOcorrencia.descricao"
                label="Descrição da Ocorrência"
                variant="outlined"
                density="compact"
                rows="4"
                placeholder="Descreva detalhadamente a ocorrência..."
                counter
                required
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-btn
          variant="outlined"
          @click="modalOcorrencia = false"
          :disabled="saving"
        >
          Cancelar
        </v-btn>
        <v-spacer />
        <v-btn
          color="error"
          @click="salvarOcorrencia"
          :loading="saving"
        >
          {{ editandoOcorrencia ? 'Atualizar' : 'Registrar' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useOcorrencias } from '@/composables/useOcorrencias.js'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  pessoa: { type: Object, default: () => ({}) },
  curso: { type: Object, default: () => ({}) },
  turma: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:modelValue'])

// Composable para ocorrências
const { saving, list, add, update, remove } = useOcorrencias()

// Estado do modal de ocorrência
const modalOcorrencia = ref(false)
const editandoOcorrencia = ref(null)
const formOcorrencia = ref({
  tipo: 'Disciplinar',
  descricao: '',
  data: new Date().toISOString().split('T')[0],
  autor: ''
})

// Estado das ocorrências
const ocorrencias = ref([])
const ocorrenciasFiltradas = ref([])
const termoPesquisa = ref('')

// Atualizar lista de ocorrências quando pessoa mudar
watch(() => props.pessoa, (novaPessoa) => {
  if (novaPessoa?.id || novaPessoa?.matricula) {
    carregarOcorrencias()
  }
}, { immediate: true })

// Funções para gerenciar ocorrências
const carregarOcorrencias = () => {
  if (!props.pessoa?.id && !props.pessoa?.matricula) return

  const alunoId = props.pessoa.id || props.pessoa.matricula
  const cursoId = props.curso?.id
  const turmaId = props.turma?.id || props.turma?.nome

  ocorrencias.value = list(cursoId, turmaId, alunoId)
  filtrarOcorrencias()
}

// Função para filtrar ocorrências
const filtrarOcorrencias = () => {
  if (!termoPesquisa.value.trim()) {
    ocorrenciasFiltradas.value = [...ocorrencias.value]
    return
  }

  const termo = termoPesquisa.value.toLowerCase().trim()

  ocorrenciasFiltradas.value = ocorrencias.value.filter(ocorrencia => {
    // Filtrar por tipo
    const tipoMatch = (ocorrencia.tipo || '').toLowerCase().includes(termo)

    // Filtrar por data (formato brasileiro e ISO)
    const dataOcorrencia = new Date(ocorrencia.data || Date.now())
    const dataFormatada = dataOcorrencia.toLocaleDateString('pt-BR')
    const dataISO = dataOcorrencia.toISOString().split('T')[0]
    const dataMatch = dataFormatada.includes(termo) || dataISO.includes(termo)

    // Filtrar por descrição também
    const descricaoMatch = (ocorrencia.descricao || '').toLowerCase().includes(termo)

    // Filtrar por autor
    const autorMatch = (ocorrencia.autor || '').toLowerCase().includes(termo)

    return tipoMatch || dataMatch || descricaoMatch || autorMatch
  })
}

// Watch para filtrar quando o termo de pesquisa mudar
watch(termoPesquisa, filtrarOcorrencias)

// Watch para recarregar quando as ocorrências mudarem
watch(ocorrencias, filtrarOcorrencias, { deep: true })

const abrirModalOcorrencia = (ocorrencia = null) => {
  if (ocorrencia) {
    // Editando ocorrência existente
    editandoOcorrencia.value = ocorrencia
    formOcorrencia.value = {
      tipo: ocorrencia.tipo || 'Disciplinar',
      descricao: ocorrencia.descricao || '',
      data: ocorrencia.data ? new Date(ocorrencia.data).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      autor: ocorrencia.autor || ''
    }
  } else {
    // Nova ocorrência
    editandoOcorrencia.value = null
    formOcorrencia.value = {
      tipo: 'Disciplinar',
      descricao: '',
      data: new Date().toISOString().split('T')[0],
      autor: ''
    }
  }
  modalOcorrencia.value = true
}

const salvarOcorrencia = async () => {
  if (!formOcorrencia.value.descricao.trim() || !formOcorrencia.value.autor.trim()) {
    alert('Descrição e professor são obrigatórios!')
    return
  }

  try {
    const alunoId = props.pessoa.id || props.pessoa.matricula
    const cursoId = props.curso?.id
    const turmaId = props.turma?.id || props.turma?.nome

    if (editandoOcorrencia.value) {
      // Atualizar ocorrência existente
      await update(cursoId, turmaId, alunoId, editandoOcorrencia.value.id, {
        ...formOcorrencia.value,
        data: new Date(formOcorrencia.value.data).toISOString()
      })
    } else {
      // Adicionar nova ocorrência
      await add(cursoId, turmaId, alunoId, {
        ...formOcorrencia.value,
        data: new Date(formOcorrencia.value.data).toISOString()
      })
    }

    carregarOcorrencias()
    modalOcorrencia.value = false
  } catch (error) {
    console.error('Erro ao salvar ocorrência:', error)
    alert('Erro ao salvar ocorrência: ' + error.message)
  }
}

const excluirOcorrencia = async (ocorrencia) => {
  if (!confirm('Tem certeza que deseja excluir esta ocorrência?')) return

  try {
    const alunoId = props.pessoa.id || props.pessoa.matricula
    const cursoId = props.curso?.id
    const turmaId = props.turma?.id || props.turma?.nome

    await remove(cursoId, turmaId, alunoId, ocorrencia.id)
    carregarOcorrencias()
  } catch (error) {
    console.error('Erro ao excluir ocorrência:', error)
    alert('Erro ao excluir ocorrência: ' + error.message)
  }
}

// Tipos de ocorrência disponíveis
const tiposOcorrencia = [
  'Disciplinar',
  'Comportamental',
  'Acadêmico',
  'Falta',
  'Atraso',
  'Outro'
]

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
