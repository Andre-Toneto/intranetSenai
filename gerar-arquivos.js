import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Emular __dirname no ES Module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ⚠️ CONFIGURE AQUI O CAMINHO DA SUA PASTA DE DOCUMENTOS:
const PASTA_LOCAL = 'C:\\Users\\Andre Toneto\\Desktop\\Estudos excel'

// Arquivo de saída (não altere)
const OUTPUT_JSON = path.join(__dirname, 'public', 'arquivos.json')

/**
 * Lista todos os arquivos de uma pasta recursivamente
 */
function listarArquivos(diretorio, raiz = '') {
  const arquivos = []

  try {
    if (!fs.existsSync(diretorio)) {
      console.error(`❌ Pasta não encontrada: ${diretorio}`)
      console.log('💡 Verifique se o caminho está correto no arquivo gerar-arquivos.js')
      return []
    }

    fs.readdirSync(diretorio).forEach(item => {
      const caminhoCompleto = path.join(diretorio, item)
      
      try {
        const stats = fs.statSync(caminhoCompleto)

        if (stats.isFile()) {
          // Adicionar arquivo à lista
          arquivos.push({
            nome: item,
            caminho: `file:///${caminhoCompleto.replace(/\\/g, '/')}`,
            tipo: path.extname(item).replace('.', '').toUpperCase() || 'UNKNOWN',
            tamanho: formatarTamanho(stats.size),
            dataModificacao: stats.mtime.toISOString(),
            pasta: raiz || 'Raiz'
          })
        } else if (stats.isDirectory()) {
          // Recursão para subpastas
          const subArquivos = listarArquivos(caminhoCompleto, path.join(raiz, item))
          arquivos.push(...subArquivos)
        }
      } catch (error) {
        console.warn(`⚠️ Erro ao acessar: ${caminhoCompleto} - ${error.message}`)
      }
    })
  } catch (error) {
    console.error(`❌ Erro ao ler diretório ${diretorio}:`, error.message)
  }

  return arquivos
}

/**
 * Formata o tamanho do arquivo em uma unidade legível
 */
function formatarTamanho(bytes) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

/**
 * Gera estatísticas dos arquivos
 */
function gerarEstatisticas(arquivos) {
  const tipos = {}
  let tamanhoTotal = 0

  arquivos.forEach(arquivo => {
    // Contar por tipo
    tipos[arquivo.tipo] = (tipos[arquivo.tipo] || 0) + 1
    
    // Calcular tamanho total (aproximado)
    const tamanho = arquivo.tamanho
    if (tamanho.includes('KB')) {
      tamanhoTotal += parseFloat(tamanho) * 1024
    } else if (tamanho.includes('MB')) {
      tamanhoTotal += parseFloat(tamanho) * 1024 * 1024
    } else if (tamanho.includes('GB')) {
      tamanhoTotal += parseFloat(tamanho) * 1024 * 1024 * 1024
    }
  })

  return {
    totalArquivos: arquivos.length,
    tipos,
    tamanhoTotal: formatarTamanho(tamanhoTotal)
  }
}

// Executar o script
console.log('🔍 Escaneando pasta de documentos...')
console.log(`📁 Pasta: ${PASTA_LOCAL}`)
console.log('━'.repeat(50))

const lista = listarArquivos(PASTA_LOCAL)

if (lista.length === 0) {
  console.log('❌ Nenhum arquivo encontrado!')
  console.log('💡 Verifique se:')
  console.log('   - O caminho está correto')
  console.log('   - A pasta existe e tem arquivos')
  console.log('   - Você tem permissão para acessar a pasta')
  process.exit(1)
}

// Gerar estatísticas
const stats = gerarEstatisticas(lista)

// Salvar arquivo JSON
try {
  // Garantir que a pasta public existe
  const publicDir = path.dirname(OUTPUT_JSON)
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(lista, null, 2), 'utf-8')
  
  console.log('✅ Lista de arquivos gerada com sucesso!')
  console.log(`📄 Arquivo: ${OUTPUT_JSON}`)
  console.log('━'.repeat(50))
  console.log('📊 ESTATÍSTICAS:')
  console.log(`   📁 Total de arquivos: ${stats.totalArquivos}`)
  console.log(`   💾 Tamanho total: ${stats.tamanhoTotal}`)
  console.log('   📋 Tipos de arquivo:')
  
  Object.entries(stats.tipos)
    .sort(([,a], [,b]) => b - a)
    .forEach(([tipo, count]) => {
      console.log(`      ${tipo}: ${count} arquivo${count > 1 ? 's' : ''}`)
    })
  
  console.log('━'.repeat(50))
  console.log('🎉 Pronto! Recarregue a página de formulários para ver os documentos.')
  
} catch (error) {
  console.error('❌ Erro ao salvar arquivo:', error.message)
  process.exit(1)
}
