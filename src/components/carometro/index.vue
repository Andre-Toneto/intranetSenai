<template>
  <v-container fluid>
    <!-- Campo de Busca -->
    <v-row class="mb-4" v-if="pessoas.length > 0">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="termoBusca"
          label="Buscar por nome ou matrícula"
          placeholder="Digite o nome ou matrícula do aluno..."
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
          class="rounded-lg"
        >
          <template v-slot:append-inner>
            <v-fade-transition>
              <v-chip
                v-if="termoBusca && pessoasFiltradas.length !== pessoas.length"
                size="small"
                color="primary"
                variant="flat"
              >
                {{ pessoasFiltradas.length }} de {{ pessoas.length }}
              </v-chip>
            </v-fade-transition>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" md="6" class="d-flex align-center">
        <v-chip-group class="flex-wrap">
          <v-chip
            :color="!filtroAtivo ? 'primary' : 'default'"
            :variant="!filtroAtivo ? 'flat' : 'outlined'"
            size="small"
            @click="limparFiltros"
          >
            <v-icon start size="small">mdi-account-group</v-icon>
            Todos ({{ pessoas.length }})
          </v-chip>
          <v-chip
            v-if="termoBusca"
            color="success"
            variant="flat"
            size="small"
            prepend-icon="mdi-filter"
          >
            Filtrados ({{ pessoasFiltradas.length }})
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>

    <!-- Cabeçalho com botões de ação -->
    <v-row class="mb-4">
      <v-col>
        <div class="d-flex justify-space-between align-center flex-wrap ga-2">
          <div>
            <h3 class="text-h6 text-senai-red font-weight-medium">
              {{ pessoasFiltradas.length }} {{ pessoasFiltradas.length === 1 ? 'pessoa encontrada' : 'pessoas encontradas' }}
              <span v-if="termoBusca" class="text-body-2 text-medium-emphasis">de {{ pessoas.length }} total</span>
            </h3>
            <p class="text-caption text-medium-emphasis mb-0">
              <v-icon size="small" class="mr-1">
                {{ temDadosExcel && props.curso ? 'mdi-file-excel' : 'mdi-google-spreadsheet' }}
              </v-icon>
              <span v-if="temDadosExcel && props.curso">Dados da planilha Excel</span>
              <span v-else>Dados locais ou sincronizados</span>
            </p>
          </div>
          <div class="d-flex ga-2 flex-wrap">
            <v-btn
              variant="outlined"
              color="primary"
              prepend-icon="mdi-refresh"
              size="small"
              :loading="loadingRefresh"
              @click="atualizarDados"
            >
              Atualizar
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <v-progress-circular indeterminate color="senai-red" size="64" />
      <p class="text-body-1 text-medium-emphasis mt-4">Carregando dados...</p>
    </div>

    <!-- Lista vazia -->
    <div v-else-if="pessoas.length === 0" class="text-center py-12">
      <v-icon
        size="80"
        color="grey-lighten-2"
        class="mb-4"
      >
        mdi-google-spreadsheet
      </v-icon>

      <h3 class="text-h6 text-medium-emphasis mb-2">Nenhuma pessoa encontrada</h3>

      <p class="text-body-2 text-medium-emphasis mb-6">
        Verifique se a turma <strong>{{ turma }}</strong> existe na sua planilha
      </p>

      <div class="d-flex gap-2 justify-center flex-wrap">
        <v-btn
          variant="outlined"
          color="primary"
          prepend-icon="mdi-refresh"
          @click="atualizarDados"
        >
          Atualizar Dados
        </v-btn>
      </div>
    </div>

    <!-- Mensagem quando nenhum resultado for encontrado -->
    <div v-else-if="pessoas.length > 0 && pessoasFiltradas.length === 0" class="text-center py-12">
      <v-icon
        size="80"
        color="grey-lighten-2"
        class="mb-4"
      >
        mdi-account-search
      </v-icon>

      <h3 class="text-h6 text-medium-emphasis mb-2">Nenhum aluno encontrado</h3>

      <p class="text-body-2 text-medium-emphasis mb-6">
        Não foi possível encontrar alunos com o termo "<strong>{{ termoBusca }}</strong>"<br>
        Verifique se digitou corretamente o nome ou matrícula.
      </p>

      <v-btn
        color="primary"
        variant="outlined"
        prepend-icon="mdi-filter-remove"
        @click="limparFiltros"
      >
        Limpar Busca
      </v-btn>
    </div>

    <!-- Grid Responsivo Moderno -->
    <v-row v-else-if="pessoasFiltradas.length > 0" class="d-flex">
      <v-col
        v-for="pessoa in pessoasFiltradas"
        :key="pessoa.matricula"
        cols="12"
        sm="6"
        md="4"
        lg="2"
        xl="2"
        class="d-flex pa-1"
      >
        <v-card
          hover
          rounded="xl"
          elevation="4"
          class="person-card flex-grow-1"
          @click="abrirModal(pessoa)"
          style="cursor: pointer"
        >
          <!-- Badge da fonte dos dados -->
          <v-chip
            size="x-small"
            :color="getCorBadge()"
            variant="flat"
            class="position-absolute"
            style="top: 8px; right: 8px; z-index: 1"
          >
            <v-icon start size="x-small">
              {{ getIconeBadge() }}
            </v-icon>
            {{ getTextoBadge() }}
          </v-chip>

          <!-- Avatar/Foto -->
          <div class="text-center pt-6 pb-2">
            <v-avatar size="80" class="elevation-4">
              <v-img :src="fotoSrcs[getPessoaKey(pessoa)] || getFoto(pessoa)" cover>
                <template #error>
                  <v-icon size="40" color="grey-lighten-1">mdi-account</v-icon>
                </template>
              </v-img>
            </v-avatar>
          </div>

          <!-- Informações -->
          <v-card-title class="text-center text-h6 font-weight-bold text-senai-red px-4 pb-1 student-name">
            {{ pessoa.nome }}
          </v-card-title>

          <v-card-subtitle class="text-center text-body-2 text-medium-emphasis px-4 pb-2">
            {{ pessoa.cargo }}
          </v-card-subtitle>

          <!-- Badge de Status e Matrícula -->
          <div class="d-flex justify-center align-center text-center pb-4 gap-2">
            <v-chip
              size="small"
              color="success"
              variant="outlined"
            >
              <v-icon start size="small">mdi-check-circle</v-icon>
              Ativo
            </v-chip>
            <div class="text-center">
              <div class="text-caption text-medium-emphasis">Matrícula</div>
              <div class="text-body-2 font-weight-medium">{{ pessoa.matricula }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useCarometro } from '@/composables/useCarometro.js'
import { useExcelData } from '@/composables/useExcelData.js'

const props = defineProps({
  turma: String,
  curso: String
})

const emit = defineEmits(['selectPessoa', 'updateTotal'])

const pessoas = ref([])
const loading = ref(false)
const temDadosExcel = ref(false)

// Busca e filtros
const termoBusca = ref('')

const { getAlunosTurma } = useCarometro()
const { getAlunosPorCursoTurma, temDadosPlanilha } = useExcelData()

const loadingRefresh = ref(false)

// Computed para filtros
const pessoasFiltradas = computed(() => {
  if (!termoBusca.value) return pessoas.value

  const termo = termoBusca.value.toLowerCase().trim()
  return pessoas.value.filter(pessoa => {
    const nome = pessoa.nome?.toLowerCase() || ''
    const matricula = pessoa.matricula?.toString().toLowerCase() || ''

    return nome.includes(termo) || matricula.includes(termo)
  })
})

const filtroAtivo = computed(() => {
  return !!termoBusca.value
})

const carregarAlunos = async () => {
  if (!props.turma) return

  loading.value = true
  try {
    let alunosCarregados = []

    // Atualizar estado do Excel
    atualizarEstadoExcel()

    // Primeiro tentar carregar da planilha Excel se curso for especificado
    if (props.curso && temDadosExcel.value) {
      alunosCarregados = getAlunosPorCursoTurma(props.curso, props.turma)

      if (alunosCarregados.length > 0) {
        pessoas.value = alunosCarregados
        emit('updateTotal', pessoas.value)
        pessoas.value.forEach(resolverFoto)
        return
      }
    }

    // Fallback para dados locais (localStorage)
    alunosCarregados = getAlunosTurma(props.turma, props.curso)

    pessoas.value = alunosCarregados
    emit('updateTotal', pessoas.value)
    // Resolver fotos para lista
    pessoas.value.forEach(resolverFoto)
  } catch (error) {
    console.error('Erro ao carregar alunos:', error)
    pessoas.value = []
    emit('updateTotal', [])
  } finally {
    loading.value = false
  }
}

const abrirModal = (pessoa) => {
  const foto = fotoSrcs.value[getPessoaKey(pessoa)] || getFoto(pessoa)
  emit('selectPessoa', { ...pessoa, foto })
}

const atualizarDados = async () => {
  loadingRefresh.value = true
  try {
    await carregarAlunos()
  } catch (error) {
    console.error('Erro ao atualizar dados:', error)
    alert('Erro ao atualizar dados: ' + (error.message || 'Erro desconhecido'))
  } finally {
    loadingRefresh.value = false
  }
}

const limparFiltros = () => {
  termoBusca.value = ''
}

// Carregar alunos apenas no cliente
onMounted(() => {
  atualizarEstadoExcel()
  if (props.turma) {
    carregarAlunos()
  }
})

// Watch para mudanças na turma ou curso
watch(() => [props.turma, props.curso], ([newTurma, newCurso]) => {
  if (newTurma) {
    fotoSrcs.value = {}
    carregarAlunos()
  }
})

// Funções auxiliares para badge
const getCorBadge = () => {
  if (temDadosExcel.value && props.curso) return 'success'
  return 'warning'
}

const getIconeBadge = () => {
  if (temDadosExcel.value && props.curso) return 'mdi-file-excel'
  return 'mdi-database'
}

const getTextoBadge = () => {
  if (temDadosExcel.value && props.curso) return 'Excel'
  return 'Local'
}

// Atualizar estado do Excel
const atualizarEstadoExcel = () => {
  temDadosExcel.value = temDadosPlanilha()
}

// Cache de URLs resolvidas por pessoa.id
const fotoSrcs = ref({})

// Normalização base (minúsculas, sem acentos, espaços únicos)
const baseNome = (nome) => {
  return String(nome || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s_-]/g, '')
    .replace(/\s+/g, ' ')
}

const nomeComSep = (nome, sep) => baseNome(nome).replace(/\s+/g, sep)

// Converte para Title Case preservando apenas letras/números dos nomes normalizados
const toTitleCase = (str) => {
  const b = baseNome(str)
  return b
    .split(' ')
    .map(p => (p ? p.charAt(0).toUpperCase() + p.slice(1) : ''))
    .join(' ')
}

// Title Case preservando acentos do texto original
const toTitleCaseRaw = (str) => {
  const r = String(str || '').trim().replace(/\s+/g, ' ')
  return r
    .split(' ')
    .map(p => (p ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() : ''))
    .join(' ')
}

// Normalização NFC para evitar problemas de composição Unicode
const toNFC = (s) => {
  try { return String(s || '').normalize('NFC') } catch { return String(s || '') }
}

// Gera variações possíveis para pastas de curso/turma
const folderVariants = (str) => {
  const raw = String(str || '').trim().replace(/\s+/g, ' ')
  const rawNFC = toNFC(raw)
  return [
    raw,
    rawNFC,
    raw.toUpperCase(),
    raw.toLowerCase(),
    rawNFC.toUpperCase(),
    rawNFC.toLowerCase(),
    nomeComSep(str, '_'),
    nomeComSep(str, '-'),
    baseNome(str)
  ]
}

// Encoda segmento de URL com segurança
const enc = (s) => encodeURIComponent(String(s || ''))

// Candidatos de arquivo para tentar (inclui variações de nome e pastas) e encoding de URL
const buildCandidatos = (pessoa) => {
  const nome = pessoa?.nome || ''
  const raw = String(nome).trim().replace(/\s+/g, ' ')
  const rawNFC = toNFC(raw)

  const nomes = Array.from(new Set([
    // Normalizados (lower, sem acento)
    nomeComSep(nome, '_'),
    nomeComSep(nome, '-'),
    baseNome(nome),
    baseNome(nome).replace(/\s+/g, ''),

    // Title Case a partir do normalizado (sem acento)
    toTitleCase(nome),
    toTitleCase(nome).replace(/\s+/g, '_'),
    toTitleCase(nome).replace(/\s+/g, '-'),
    toTitleCase(nome).replace(/\s+/g, ''),

    // Title Case preservando acentos do original
    toTitleCaseRaw(rawNFC),
    toTitleCaseRaw(rawNFC).replace(/\s+/g, '_'),
    toTitleCaseRaw(rawNFC).replace(/\s+/g, '-'),
    toTitleCaseRaw(rawNFC).replace(/\s+/g, ''),

    // Originais (como vieram, preservando acentos)
    raw,
    rawNFC,
    raw.replace(/\s+/g, '_'),
    raw.replace(/\s+/g, '-'),
    raw.replace(/\s+/g, ''),
    rawNFC.replace(/\s+/g, '_'),
    rawNFC.replace(/\s+/g, '-'),
    rawNFC.replace(/\s+/g, ''),
  ]))

  const exts = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG', '.WEBP']

  const cursoDirs = folderVariants(props.curso)
  const turmaDirs = folderVariants(props.turma)

  const candidatos = []
  for (const c of cursoDirs) {
    for (const t of turmaDirs) {
      for (const n of nomes) {
        for (const ext of exts) {
          candidatos.push(`/fotos/${enc(c)}/${enc(t)}/${enc(n)}${ext}`)
        }
      }
    }
  }
  return candidatos
}

// Tenta resolver a primeira URL existente
const getPessoaKey = (pessoa) => pessoa?.id || pessoa?.matricula || baseNome(pessoa?.nome || '')

const resolverFoto = (pessoa) => {
  if (!pessoa || !props.curso || !props.turma) return
  const key = getPessoaKey(pessoa)
  if (!key || fotoSrcs.value[key]) return
  const candidatos = buildCandidatos(pessoa)
  const tryNext = (i) => {
    if (i >= candidatos.length) { fotoSrcs.value[key] = ''; return }
    const url = candidatos[i]
    const img = new Image()
    img.onload = () => { fotoSrcs.value[key] = url }
    img.onerror = () => tryNext(i + 1)
    img.src = url
  }
  tryNext(0)
}

// Retorna uma URL padrão (primeira convenção) caso ainda não resolvido
const getFoto = (pessoa) => {
  if (pessoa?.foto) return pessoa.foto
  const nome = nomeComSep(pessoa?.nome || '', '_')
  if (!nome || !props.curso || !props.turma) return ''
  return `/fotos/${enc(props.curso)}/${enc(props.turma)}/${enc(nome)}.jpg`
}
</script>

<style scoped>
.person-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.person-card:hover {
  transform: translateY(-8px);
  border-color: rgb(var(--v-theme-senai-red));
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

/* Transições para busca e filtros */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.fade-slide-move {
  transition: transform 0.4s ease;
}

/* Estilo para campo de busca */
.v-text-field {
  transition: all 0.3s ease;
}

.v-text-field:focus-within {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary-rgb), 0.15);
}

/* Animação para chips de filtro */
.v-chip {
  transition: all 0.3s ease;
}

.v-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.student-name {
  white-space: normal;
  word-break: break-word;
}
</style>
