<template>
  <v-container fluid>
    <!-- Header Section -->
    <v-card color="senai-red" dark elevation="8" rounded="lg" class="mb-6">
      <v-card-text class="pa-6">
        <v-row align="center">
          <v-col cols="12" md="8">
            <h1 class="text-h3 font-weight-light mb-3">Documentos e Formulários</h1>
            <p class="text-h6 font-weight-light opacity-80">
              Acesse facilmente todos os seus documentos organizados
            </p>
          </v-col>
          <v-col cols="12" md="4" class="text-center">
            <v-icon size="80" color="white" class="opacity-80">mdi-folder-multiple</v-icon>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <v-progress-circular indeterminate color="senai-red" size="64" />
      <p class="text-body-1 text-medium-emphasis mt-4">Carregando documentos...</p>
    </div>

    <!-- Error State -->
    <v-alert
      v-else-if="erro"
      type="error"
      variant="tonal"
      class="mb-6"
    >
      <template v-slot:prepend>
        <v-icon>mdi-alert-circle</v-icon>
      </template>
      <div>
        <strong>Erro ao carregar documentos:</strong><br>
        {{ erro }}<br><br>
        <small>
          <strong>Dica:</strong> Execute o comando <code>node gerar-arquivos.js</code> 
          na raiz do projeto para gerar a lista de arquivos.
        </small>
      </div>
    </v-alert>

    <!-- Stats Section -->
    <v-row v-else class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2" rounded="lg" class="text-center pa-4">
          <v-icon size="48" color="primary" class="mb-2">mdi-file-multiple</v-icon>
          <h3 class="text-h4 font-weight-bold text-primary">{{ arquivos.length }}</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">Total de Arquivos</p>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2" rounded="lg" class="text-center pa-4">
          <v-icon size="48" color="success" class="mb-2">mdi-file-excel</v-icon>
          <h3 class="text-h4 font-weight-bold text-success">{{ contarPorTipo('XLSX') }}</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">Planilhas Excel</p>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2" rounded="lg" class="text-center pa-4">
          <v-icon size="48" color="error" class="mb-2">mdi-file-pdf-box</v-icon>
          <h3 class="text-h4 font-weight-bold text-error">{{ contarPorTipo('PDF') }}</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">Documentos PDF</p>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2" rounded="lg" class="text-center pa-4">
          <v-icon size="48" color="warning" class="mb-2">mdi-file-word</v-icon>
          <h3 class="text-h4 font-weight-bold text-warning">{{ contarPorTipo('DOCX') }}</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">Documentos Word</p>
        </v-card>
      </v-col>
    </v-row>

    <!-- Search and Filter Section -->
    <v-row v-if="arquivos.length > 0" class="mb-4">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="termoBusca"
          label="Buscar documentos"
          placeholder="Digite o nome do arquivo..."
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
          class="rounded-lg"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          v-model="filtroTipo"
          :items="tiposDisponiveis"
          label="Filtrar por tipo"
          variant="outlined"
          density="comfortable"
          clearable
          hide-details
          class="rounded-lg"
        >
          <template v-slot:prepend-inner>
            <v-icon>mdi-filter</v-icon>
          </template>
        </v-select>
      </v-col>
    </v-row>

    <!-- Results Info -->
    <div v-if="arquivos.length > 0" class="mb-4">
      <h3 class="text-h6 text-senai-red font-weight-medium">
        {{ arquivosFiltrados.length }} {{ arquivosFiltrados.length === 1 ? 'documento encontrado' : 'documentos encontrados' }}
        <span v-if="termoBusca || filtroTipo" class="text-body-2 text-medium-emphasis">
          de {{ arquivos.length }} total
        </span>
      </h3>
    </div>

    <!-- No Results -->
    <div v-if="arquivos.length > 0 && arquivosFiltrados.length === 0" class="text-center py-12">
      <v-icon size="80" color="grey-lighten-2" class="mb-4">mdi-file-search</v-icon>
      <h3 class="text-h6 text-medium-emphasis mb-2">Nenhum documento encontrado</h3>
      <p class="text-body-2 text-medium-emphasis mb-6">
        Tente ajustar os filtros ou termo de busca.
      </p>
      <v-btn
        color="primary"
        variant="outlined"
        prepend-icon="mdi-filter-remove"
        @click="limparFiltros"
      >
        Limpar Filtros
      </v-btn>
    </div>

    <!-- Documents Grid -->
    <v-row v-if="arquivosFiltrados.length > 0">
      <v-col
        v-for="arquivo in arquivosFiltrados"
        :key="arquivo.caminho"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
      >
        <v-card
          hover
          rounded="xl"
          elevation="4"
          class="document-card h-100"
          @click="abrirArquivo(arquivo)"
          style="cursor: pointer"
        >
          <!-- Badge do tipo -->
          <v-chip
            :color="getCorTipo(arquivo.tipo)"
            size="small"
            variant="flat"
            class="position-absolute"
            style="top: 8px; right: 8px; z-index: 1"
          >
            {{ arquivo.tipo }}
          </v-chip>

          <!-- Ícone do arquivo -->
          <div class="text-center pt-6 pb-4">
            <v-icon
              :color="getCorTipo(arquivo.tipo)"
              size="64"
              class="mb-2"
            >
              {{ getIconeTipo(arquivo.tipo) }}
            </v-icon>
          </div>

          <!-- Informações do arquivo -->
          <v-card-title class="text-center px-4 pb-2">
            <span class="text-body-1 font-weight-bold text-senai-red">
              {{ arquivo.nome }}
            </span>
          </v-card-title>

          <v-card-subtitle class="text-center px-4 pb-4">
            <div class="d-flex justify-center align-center gap-2">
              <v-chip size="x-small" variant="outlined">
                <v-icon start size="x-small">mdi-weight</v-icon>
                {{ arquivo.tamanho }}
              </v-chip>
            </div>
          </v-card-subtitle>

          <!-- Hover Actions -->
          <v-card-actions class="justify-center pa-4 pt-0">
            <v-btn
              variant="outlined"
              color="primary"
              size="small"
              prepend-icon="mdi-open-in-new"
              @click.stop="abrirArquivo(arquivo)"
            >
              Abrir
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <div v-if="!loading && !erro && arquivos.length === 0" class="text-center py-12">
      <v-icon size="120" color="grey-lighten-2" class="mb-4">mdi-folder-open</v-icon>
      <h3 class="text-h4 text-medium-emphasis mb-4">Nenhum documento encontrado</h3>
      <p class="text-body-1 text-medium-emphasis mb-6">
        Execute o script <code>gerar-arquivos.js</code> para escanear sua pasta de documentos.
      </p>
      
      <v-card variant="outlined" color="info" class="mx-auto" max-width="600">
        <v-card-text class="pa-4">
          <div class="d-flex align-center mb-3">
            <v-icon color="info" class="mr-2">mdi-information</v-icon>
            <h4 class="text-subtitle-1 font-weight-medium">Como usar</h4>
          </div>
          <ol class="text-left text-body-2">
            <li class="mb-2">Edite o arquivo <code>gerar-arquivos.js</code> com o caminho da sua pasta</li>
            <li class="mb-2">Execute: <code>node gerar-arquivos.js</code></li>
            <li>Recarregue esta página para ver seus documentos</li>
          </ol>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const arquivos = ref([])
const loading = ref(true)
const erro = ref('')
const termoBusca = ref('')
const filtroTipo = ref('')

const carregarArquivos = async () => {
  loading.value = true
  erro.value = ''

  try {
    const response = await fetch('/arquivos.json')
    
    if (!response.ok) {
      throw new Error('Arquivo arquivos.json não encontrado. Execute o script gerar-arquivos.js primeiro.')
    }

    const data = await response.json()
    arquivos.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Erro ao carregar arquivos:', error)
    erro.value = error.message
    arquivos.value = []
  } finally {
    loading.value = false
  }
}

const arquivosFiltrados = computed(() => {
  let resultado = arquivos.value

  // Filtro por termo de busca
  if (termoBusca.value) {
    const termo = termoBusca.value.toLowerCase().trim()
    resultado = resultado.filter(arquivo => 
      arquivo.nome.toLowerCase().includes(termo)
    )
  }

  // Filtro por tipo
  if (filtroTipo.value) {
    resultado = resultado.filter(arquivo => 
      arquivo.tipo === filtroTipo.value
    )
  }

  return resultado
})

const tiposDisponiveis = computed(() => {
  const tipos = [...new Set(arquivos.value.map(arquivo => arquivo.tipo))].sort()
  return tipos.map(tipo => ({
    title: `${tipo} (${contarPorTipo(tipo)})`,
    value: tipo
  }))
})

const contarPorTipo = (tipo) => {
  return arquivos.value.filter(arquivo => arquivo.tipo === tipo).length
}

const getCorTipo = (tipo) => {
  const cores = {
    'XLSX': 'success',
    'XLS': 'success', 
    'PDF': 'error',
    'DOCX': 'info',
    'DOC': 'info',
    'PPTX': 'warning',
    'PPT': 'warning',
    'CSV': 'secondary',
    'TXT': 'grey',
    'ACCDB': 'purple',
    'MDB': 'purple'
  }
  return cores[tipo] || 'primary'
}

const getIconeTipo = (tipo) => {
  const icones = {
    'XLSX': 'mdi-file-excel',
    'XLS': 'mdi-file-excel',
    'PDF': 'mdi-file-pdf-box',
    'DOCX': 'mdi-file-word',
    'DOC': 'mdi-file-word',
    'PPTX': 'mdi-file-powerpoint',
    'PPT': 'mdi-file-powerpoint',
    'CSV': 'mdi-file-delimited',
    'TXT': 'mdi-file-document',
    'ACCDB': 'mdi-database',
    'MDB': 'mdi-database'
  }
  return icones[tipo] || 'mdi-file'
}

const abrirArquivo = (arquivo) => {
  try {
    // Tenta abrir o arquivo usando o protocolo file://
    window.open(arquivo.caminho, '_blank')
  } catch (error) {
    console.error('Erro ao abrir arquivo:', error)
    
    // Fallback: tentar usar createObjectURL ou mostrar alerta
    alert(`Para abrir este arquivo, copie e cole o caminho no explorador de arquivos:\n\n${arquivo.caminho.replace('file:///', '')}`)
  }
}

const limparFiltros = () => {
  termoBusca.value = ''
  filtroTipo.value = ''
}

onMounted(() => {
  carregarArquivos()
})
</script>

<style scoped>
.document-card {
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.document-card:hover {
  transform: translateY(-4px);
  border-color: rgb(var(--v-theme-senai-red));
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.v-card-actions {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.document-card:hover .v-card-actions {
  opacity: 1;
}

code {
  background-color: rgba(var(--v-theme-surface-variant), 0.5);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}
</style>
