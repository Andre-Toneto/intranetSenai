<template>
  <v-dialog
    v-model="internalModelValue"
    max-width="800"
    persistent
  >
    <v-card rounded="xl">
      <v-card-title class="bg-senai-red text-white pa-6">
        <div class="d-flex align-center">
          <v-icon size="32" class="mr-3">mdi-file-excel</v-icon>
          <div>
            <h3 class="text-h5 font-weight-bold">Configurar Planilha Excel</h3>
            <p class="text-body-2 mb-0 text-grey-lighten-3">
              Faça upload da planilha "Alunos Cursos Regulares ano 2025.xlsx"
            </p>
          </div>
        </div>
      </v-card-title>

      <v-card-text class="pa-6">
        <!-- Upload de arquivo -->
        <v-alert
          v-if="!arquivoSelecionado && !temDadosExistentes"
          type="info"
          variant="tonal"
          class="mb-6"
        >
          <template v-slot:prepend>
            <v-icon>mdi-information</v-icon>
          </template>
          <div>
            <strong>Formato esperado:</strong> Planilha Excel (.xlsx) com os cursos:<br>
            • CAI<br>
            • SESI TÉC ADM<br>
            • SEDUC TÉC ELETROMECÂNICA<br><br>
            Cada planilha deve conter as turmas e alunos do respectivo curso.
          </div>
        </v-alert>

        <!-- Status dos dados existentes -->
        <v-card
          v-if="temDadosExistentes"
          variant="outlined"
          color="success"
          class="mb-6"
        >
          <v-card-title class="bg-success text-white pa-4">
            <v-icon class="mr-2">mdi-check-circle</v-icon>
            Planilha Configurada
          </v-card-title>
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-body-1 font-weight-medium mb-1">
                  <strong>{{ resumoDados.totalAlunos }}</strong> alunos em <strong>{{ resumoDados.totalCursos }}</strong> cursos
                </p>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  <v-icon size="small" class="mr-1">mdi-clock</v-icon>
                  Última atualização: {{ formatarData(resumoDados.ultimaAtualizacao) }}
                </p>
              </div>
              <div class="d-flex gap-2">
                <v-btn
                  color="warning"
                  variant="outlined"
                  prepend-icon="mdi-swap-horizontal"
                  @click="mostrarTrocaArquivo"
                >
                  Trocar Planilha
                </v-btn>
                <v-btn
                  color="error"
                  variant="outlined"
                  prepend-icon="mdi-delete"
                  @click="confirmarRemocao"
                >
                  Remover
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Área de drop/seleção de arquivo -->
        <div
          v-show="!temDadosExistentes || mostrandoTrocaArquivo"
          class="upload-area pa-8 text-center rounded-lg border-dashed"
          :class="{
            'border-success': arquivoSelecionado,
            'border-primary': !arquivoSelecionado && !dragOver,
            'border-info elevation-4': dragOver
          }"
          @dragover.prevent="dragOver = true"
          @dragleave.prevent="dragOver = false"
          @drop.prevent="handleDrop"
          @click="selecionarArquivo"
          style="cursor: pointer; border-width: 2px;"
        >
          <input
            ref="fileInput"
            type="file"
            accept=".xlsx,.xls"
            style="display: none"
            @change="handleFileSelect"
          >

          <v-icon
            :color="arquivoSelecionado ? 'success' : 'primary'"
            size="64"
            class="mb-4"
          >
            {{ arquivoSelecionado ? 'mdi-check-circle' : 'mdi-cloud-upload' }}
          </v-icon>

          <h4 class="text-h6 mb-2">
            {{ arquivoSelecionado ? 'Arquivo Selecionado' : 'Clique ou arraste a planilha aqui' }}
          </h4>

          <p v-if="arquivoSelecionado" class="text-body-1 font-weight-medium text-success">
            📁 {{ arquivoSelecionado.name }}
            <br>
            📊 {{ formatarTamanho(arquivoSelecionado.size) }}
          </p>
          <p v-else class="text-body-2 text-medium-emphasis">
            Formatos aceitos: .xlsx, .xls
          </p>
        </div>

        <v-divider class="my-6" />

        <h4 class="text-h6 mb-3 d-flex align-center">
          <v-icon class="mr-2">mdi-link-variant</v-icon>
          Importar por link
        </h4>
        <v-row class="align-center">
          <v-col cols="12" md="9">
            <v-text-field
              v-model="linkPlanilha"
              label="Link direto da planilha (.xlsx ou .xls)"
              placeholder="https://.../arquivo.xlsx"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-link"
              clearable
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-btn
              block
              color="senai-red"
              :disabled="!linkPlanilha || processando"
              :loading="loadingLink"
              @click="processarLink"
              prepend-icon="mdi-download"
            >
              Processar Link
            </v-btn>
          </v-col>
        </v-row>

        <!-- Preview dos dados -->
        <div v-if="dadosPreview" class="mt-6">
          <h4 class="text-h6 mb-4 d-flex align-center">
            <v-icon class="mr-2">mdi-eye</v-icon>
            Preview dos Dados
          </h4>

          <v-row>
            <v-col
              v-for="planilha in dadosPreview.nomesPlanilhas"
              :key="planilha"
              cols="12"
              md="4"
            >
              <v-card variant="outlined" rounded="lg">
                <v-card-title class="text-body-1 font-weight-bold bg-grey-lighten-4">
                  📊 {{ planilha }}
                </v-card-title>
                <v-card-text>
                  <p class="text-body-2 mb-1">
                    <strong>Registros:</strong> {{ dadosPreview.planilhas[planilha].totalRegistros }}
                  </p>
                  <p class="text-body-2 mb-1">
                    <strong>Colunas:</strong> {{ dadosPreview.planilhas[planilha].colunas.length }}
                  </p>
                  <v-chip-group class="mt-2">
                    <v-chip
                      v-for="coluna in dadosPreview.planilhas[planilha].colunas.slice(0, 3)"
                      :key="coluna"
                      size="x-small"
                      variant="outlined"
                    >
                      {{ coluna }}
                    </v-chip>
                    <v-chip
                      v-if="dadosPreview.planilhas[planilha].colunas.length > 3"
                      size="x-small"
                      variant="outlined"
                    >
                      +{{ dadosPreview.planilhas[planilha].colunas.length - 3 }} mais
                    </v-chip>
                  </v-chip-group>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Erro -->
        <v-alert
          v-if="erro"
          type="error"
          variant="tonal"
          class="mt-4"
          closable
          @click:close="erro = ''"
        >
          {{ erro }}
        </v-alert>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-spacer />

        <!-- Botão Cancelar para troca de arquivo -->
        <v-btn
          v-if="mostrandoTrocaArquivo"
          variant="outlined"
          @click="mostrandoTrocaArquivo = false"
          :disabled="processando"
        >
          Cancelar Troca
        </v-btn>

        <!-- Botão Fechar padrão -->
        <v-btn
          v-else
          variant="outlined"
          @click="fechar"
          :disabled="processando"
        >
          {{ temDadosExistentes && !mostrandoTrocaArquivo ? 'Fechar' : 'Cancelar' }}
        </v-btn>

        <!-- Botão Processar/Salvar -->
        <v-btn
          v-if="!temDadosExistentes || mostrandoTrocaArquivo || dadosPreview"
          color="senai-red"
          :disabled="!arquivoSelecionado || processando"
          :loading="processando"
          @click="processarArquivo"
        >
          {{ dadosPreview ? 'Salvar Dados' : 'Processar Planilha' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useExcelData } from '@/composables/useExcelData.js'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'dados-configurados'])

const { lerArquivoExcel, lerArquivoExcelUrl, processarDadosPlanilha, salvarDadosProcessados, carregarDadosProcessados, temDadosPlanilha } = useExcelData()

const internalModelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const fileInput = ref(null)
const arquivoSelecionado = ref(null)
const dadosPreview = ref(null)
const processando = ref(false)
const erro = ref('')
const dragOver = ref(false)
const mostrandoTrocaArquivo = ref(false)
const linkPlanilha = ref('')
const loadingLink = ref(false)

// Dados existentes
const temDadosExistentes = ref(false)
const resumoDados = ref({})

const verificarDadosExistentes = () => {
  temDadosExistentes.value = temDadosPlanilha()
  if (temDadosExistentes.value) {
    const dados = carregarDadosProcessados()
    if (dados) {
      resumoDados.value = {
        totalAlunos: dados.totalAlunos || 0,
        totalCursos: Object.keys(dados.cursos || {}).length,
        ultimaAtualizacao: dados.ultimaAtualizacao
      }
    }
  }
}

const selecionarArquivo = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    arquivoSelecionado.value = file
    dadosPreview.value = null
    erro.value = ''
  }
}

const handleDrop = (event) => {
  dragOver.value = false
  const files = event.dataTransfer.files
  if (files.length > 0) {
    arquivoSelecionado.value = files[0]
    dadosPreview.value = null
    erro.value = ''
  }
}

const processarLink = async () => {
  if (!linkPlanilha.value) return

  processando.value = true
  loadingLink.value = true
  erro.value = ''

  try {
    const dadosExcel = await lerArquivoExcelUrl(linkPlanilha.value)
    dadosPreview.value = dadosExcel
  } catch (error) {
    console.error('Erro ao processar link:', error)
    erro.value = error.message || 'Erro ao processar link'
  } finally {
    processando.value = false
    loadingLink.value = false
  }
}

const processarArquivo = async () => {
  if (!arquivoSelecionado.value) return

  processando.value = true
  erro.value = ''

  try {
    // Se já temos preview, apenas salvar
    if (dadosPreview.value) {
      const dadosProcessados = processarDadosPlanilha(dadosPreview.value)
      const sucesso = salvarDadosProcessados(dadosProcessados)
      
      if (sucesso) {
        emit('dados-configurados')
        fechar()
      } else {
        erro.value = 'Erro ao salvar dados processados'
      }
      return
    }

    // Processar arquivo Excel
    const dadosExcel = await lerArquivoExcel(arquivoSelecionado.value)
    dadosPreview.value = dadosExcel

  } catch (error) {
    console.error('Erro ao processar arquivo:', error)
    erro.value = error.message || 'Erro ao processar arquivo'
  } finally {
    processando.value = false
  }
}

const mostrarTrocaArquivo = () => {
  mostrandoTrocaArquivo.value = true
  arquivoSelecionado.value = null
  dadosPreview.value = null
  erro.value = ''
}

const confirmarRemocao = () => {
  if (confirm('⚠️ ATENÇÃO!\n\nTem certeza que deseja remover TODOS os dados da planilha?\n\nEsta ação não pode ser desfeita e você precisará fazer upload da planilha novamente.')) {
    removerDados()
  }
}

const removerDados = () => {
  localStorage.removeItem('carometro_dados_excel')
  localStorage.removeItem('carometro_excel_timestamp')
  temDadosExistentes.value = false
  resumoDados.value = {}
  mostrandoTrocaArquivo.value = false
  emit('dados-configurados')
}

const fechar = () => {
  internalModelValue.value = false
  // Reset
  arquivoSelecionado.value = null
  dadosPreview.value = null
  erro.value = ''
  dragOver.value = false
  mostrandoTrocaArquivo.value = false
}

const formatarTamanho = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatarData = (isoString) => {
  if (!isoString) return 'N/A'
  return new Date(isoString).toLocaleString('pt-BR')
}

// Verificar dados existentes quando o modal abrir
watch(internalModelValue, (newValue) => {
  if (newValue) {
    verificarDadosExistentes()
  }
})

onMounted(() => {
  verificarDadosExistentes()
})
</script>

<style scoped>
.upload-area {
  transition: all 0.3s ease;
}

.upload-area:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

.border-dashed {
  border-style: dashed !important;
}
</style>
