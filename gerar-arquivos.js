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

const lista = listarArquivos(PASTA_LOCAL)

// Gerar estatísticas

// Salvar arquivo JSON
try {
  // Garantir que a pasta public existe
  const publicDir = path.dirname(OUTPUT_JSON)
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(lista, null, 2), 'utf-8')
  
} catch (error) {
  console.error('❌ Erro ao salvar arquivo:', error.message)
  process.exit(1)
}
