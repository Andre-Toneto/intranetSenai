<template>
  <div>
    <!-- Seleção de Curso e Turma (se não selecionada) -->
    <div v-if="!selecaoFeita">
      <v-container fluid>
        <v-row justify="center">
          <v-col cols="12">
            <v-card elevation="8" rounded="xl" class="pa-6 mb-4">
              <v-card-title class="text-center pb-4">
                <div class="text-center">
                  <v-icon size="56" color="senai-red" class="mb-3">mdi-account-school</v-icon>
                  <h2 class="text-h4 text-senai-red font-weight-medium mb-2">Carômetro SENAI</h2>
                  <p class="text-body-1 text-medium-emphasis">Selecione o curso e turma para visualizar os alunos</p>
                </div>
              </v-card-title>

              <v-card-text>
                <!-- Seletor de Curso e Turma -->
                <div v-if="!temDadosExcel" class="text-center py-12">
                  <v-progress-circular
                    indeterminate
                    color="senai-red"
                    size="64"
                  />
                  <p class="text-body-1 text-medium-emphasis mt-4">
                    Carregando cursos e turmas...
                  </p>
                </div>
                <CarometroCursoTurmaSelector
                  v-else
                  ref="selectorRef"
                  @curso-turma-selecionados="onCursoTurmaSelecionados"
                  @configurar-excel="abrirConfigExcel"
                />

                <!-- Botão para configurar Excel se não tiver dados -->
                <!-- <div v-if="!temDadosExcel" class="text-center mt-6">
                  <v-divider class="mb-4" />
                  <p class="text-body-2 text-medium-emphasis mb-4">
                    Para começar, você precisa configurar sua planilha Excel com os dados dos alunos
                  </p>
                  <v-btn
                    color="senai-red"
                    size="large"
                    prepend-icon="mdi-file-excel"
                    rounded="xl"
                    @click="abrirConfigExcel"
                  >
                    Configurar Planilha Excel
                  </v-btn>
                </div> -->

              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Carômetro (se curso/turma selecionada) -->
    <div v-else>
      <!-- Header da Turma -->
      <v-container fluid>
        <v-card :color="cursoSelecionado.cor || 'senai-red'" dark elevation="4" rounded="xl" class="mb-4">
          <v-card-text class="pa-6">
            <v-row align="center">
              <v-col>
                <div class="d-flex align-center">
                  <v-avatar :color="lightenColor(cursoSelecionado.cor || '#D32F2F')" size="64" class="mr-4">
                    <v-icon color="white" size="32">mdi-school</v-icon>
                  </v-avatar>
                  <div>
                    <h2 class="text-h4 font-weight-bold mb-1">{{ turmaSelecionada.nome }}</h2>
                    <p class="text-h6 opacity-90 mb-1">{{ cursoSelecionado.nome }}</p>
                    <p class="text-body-2 opacity-80 mb-0">{{ totalAlunos }} alunos cadastrados</p>
                  </div>
                </div>
              </v-col>
              <v-col cols="auto">
                <div class="d-flex gap-2">
                  <v-btn
                    variant="outlined"
                    color="white"
                    @click="abrirConfigExcel"
                    prepend-icon="mdi-cog"
                  >
                    Configurar
                  </v-btn>
                  <v-btn
                    variant="outlined"
                    color="white"
                    @click="voltarSelecao"
                    prepend-icon="mdi-arrow-left"
                  >
                    Voltar
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>

      <!-- Componente Carômetro -->
      <Carometro
        :turma="turmaSelecionada.id"
        :curso="cursoSelecionado.id"
        @selectPessoa="selecionarPessoa"
        @updateTotal="atualizarTotal"
      />
    </div>

    <!-- Modal de Pessoa -->
    <CarometroPessoaModal
      v-model="modalAberto"
      :pessoa="pessoaSelecionada"
      :curso="cursoSelecionado"
      :turma="turmaSelecionada"
    />

    <!-- Modal de Configuração Excel -->
    <!-- <CarometroExcelUploadModal
      v-model="configExcelAberto"
      @dados-configurados="onDadosConfigurados"
    /> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useExcelData } from '@/composables/useExcelData.js'
import CarometroCursoTurmaSelector from '@/components/carometro/cursoTurmaSelector.vue'
import Carometro from '@/components/carometro/index.vue'
import CarometroPessoaModal from '@/components/carometro/pessoaModal.vue'
import CarometroExcelUploadModal from '@/components/carometro/excelUploadModal.vue'

const router = useRouter()
const modalAberto = ref(false)
const configExcelAberto = ref(false)
const pessoaSelecionada = ref({})

const { temDadosPlanilha, sincronizarPlanilhaConfigurada } = useExcelData()

// Estado da seleção
const selecaoFeita = ref(false)
const cursoSelecionado = ref({})
const turmaSelecionada = ref({})
const totalAlunos = ref(0)

// Estado para entrada manual
const temDadosExcel = ref(false)

const selectorRef = ref(null)

// Verificar se há dados Excel disponíveis
const verificarDadosExcel = () => {
  temDadosExcel.value = temDadosPlanilha()
}

onMounted(async () => {
  // Sem autenticação: acesso direto ao carômetro
  console.log('🚀 Iniciando carômetro...')

  // Forçar limpeza de cache se houver parâmetro na URL
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.has('nocache') || urlParams.has('refresh')) {
    console.log('🧹 Parâmetro de limpeza detectado, limpando cache...')
    try {
      localStorage.removeItem('carometro_dados_excel')
      localStorage.removeItem('carometro_excel_timestamp')
      sessionStorage.removeItem('carometro_selecao')
    } catch (e) {
      console.warn('Erro ao limpar cache:', e)
    }
  }

  // Sincroniza automaticamente se houver URL configurada (ENV/localStorage)
  try {
    console.log('📊 Sincronizando planilha...')
    await sincronizarPlanilhaConfigurada(true) // Sempre forçar na primeira carga
  } catch (e) {
    console.warn('Falha ao sincronizar planilha configurada automaticamente:', e?.message || e)
  }

  verificarDadosExcel()

  // Verificar se há seleção salva
  const selecaoSalva = sessionStorage.getItem('carometro_selecao')
  if (selecaoSalva) {
    try {
      const selecao = JSON.parse(selecaoSalva)
      cursoSelecionado.value = selecao.curso
      turmaSelecionada.value = selecao.turma
      selecaoFeita.value = true
    } catch (error) {
      console.error('Erro ao carregar seleção salva:', error)
    }
  }
})

const onCursoTurmaSelecionados = (selecao) => {
  cursoSelecionado.value = selecao.curso
  turmaSelecionada.value = selecao.turma
  selecaoFeita.value = true
  
  // Salvar seleção
  sessionStorage.setItem('carometro_selecao', JSON.stringify(selecao))
}


const voltarSelecao = () => {
  selecaoFeita.value = false
  cursoSelecionado.value = {}
  turmaSelecionada.value = {}
  totalAlunos.value = 0

  sessionStorage.removeItem('carometro_selecao')
}

const selecionarPessoa = (pessoa) => {
  pessoaSelecionada.value = pessoa
  modalAberto.value = true
}

const atualizarTotal = (alunos) => {
  totalAlunos.value = Array.isArray(alunos) ? alunos.length : 0
}

const abrirConfigExcel = () => {
  configExcelAberto.value = true
}

const onDadosConfigurados = () => {
  verificarDadosExcel()
  
  // Recarregar cursos no seletor
  if (selectorRef.value && selectorRef.value.recarregarCursos) {
    selectorRef.value.recarregarCursos()
  }
  
  // Se estiver em modo manual e agora tem dados Excel, voltar para seleção
  if (selecaoFeita.value && cursoSelecionado.value.id === 'MANUAL') {
    voltarSelecao()
  }
}

// Função auxiliar para clarear cor
const lightenColor = (color) => {
  // Remover # se presente
  color = color.replace('#', '')
  
  // Converter para RGB
  const r = parseInt(color.substr(0, 2), 16)
  const g = parseInt(color.substr(2, 2), 16)
  const b = parseInt(color.substr(4, 2), 16)
  
  // Clarear 20%
  const factor = 1.2
  const newR = Math.min(255, Math.floor(r * factor))
  const newG = Math.min(255, Math.floor(g * factor))
  const newB = Math.min(255, Math.floor(b * factor))
  
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}
</script>
