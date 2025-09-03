import * as XLSX from 'xlsx'

export const useExcelData = () => {
  // Estrutura de cursos disponíveis
  const cursosDisponiveis = [
    { id: 'CAI', nome: 'CAI', cor: '#1976D2' },
    { id: 'SESI_TEC_ADM', nome: 'SESI TÉC ADM', cor: '#388E3C' },
    { id: 'SEDUC_TEC_ELETROMECANICA', nome: 'SEDUC TÉC ELETROMECÂNICA', cor: '#F57C00' }
  ]

  // Função para ler arquivo Excel
  const lerArquivoExcel = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('Nenhum arquivo fornecido'))
        return
      }

      // Verificar se é arquivo Excel
      if (!file.name.match(/\.(xlsx|xls)$/i)) {
        reject(new Error('Arquivo deve ser do tipo Excel (.xlsx ou .xls)'))
        return
      }

      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: 'array' })
          
          const planilhas = {}
          
          // Processar cada planilha
          workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName]
            const jsonData = XLSX.utils.sheet_to_json(worksheet)
            
            planilhas[sheetName] = {
              nome: sheetName,
              dados: jsonData,
              totalRegistros: jsonData.length,
              colunas: jsonData.length > 0 ? Object.keys(jsonData[0]) : []
            }
          })

          resolve({
            planilhas,
            totalPlanilhas: workbook.SheetNames.length,
            nomesPlanilhas: workbook.SheetNames
          })
        } catch (error) {
          reject(new Error('Erro ao processar arquivo Excel: ' + error.message))
        }
      }

      reader.onerror = () => {
        reject(new Error('Erro ao ler arquivo'))
      }

      reader.readAsArrayBuffer(file)
    })
  }

  // Função para processar dados da planilha e organizá-los por curso/turma
  const processarDadosPlanilha = (dadosExcel) => {
    const dadosProcessados = {
      cursos: {},
      totalAlunos: 0,
      ultimaAtualizacao: new Date().toISOString()
    }

    try {
      // Processar cada planilha
      Object.values(dadosExcel.planilhas).forEach(planilha => {
        const { dados, nome: nomePlanilha } = planilha

        dados.forEach(registro => {
          // Identificar curso baseado no nome da planilha ou campo específico
          let cursoId = identificarCurso(nomePlanilha, registro)

          console.log(`Processando planilha "${nomePlanilha}":`, {
            registro: registro,
            cursoIdentificado: cursoId
          })

          if (!cursoId) {
            console.warn('Curso não identificado para registro:', {
              planilha: nomePlanilha,
              registro: registro
            })
            return
          }

          // Inicializar curso se não existir
          if (!dadosProcessados.cursos[cursoId]) {
            const curso = cursosDisponiveis.find(c => c.id === cursoId)
            dadosProcessados.cursos[cursoId] = {
              id: cursoId,
              nome: curso?.nome || cursoId,
              cor: curso?.cor || '#607D8B',
              turmas: {},
              totalAlunos: 0
            }
          }

          // Extrair informações do aluno
          const aluno = extrairDadosAluno(registro, cursoId)
          if (!aluno.turma) {
            console.warn('Turma não identificada para aluno:', aluno)
            return
          }

          // Inicializar turma se não existir
          if (!dadosProcessados.cursos[cursoId].turmas[aluno.turma]) {
            dadosProcessados.cursos[cursoId].turmas[aluno.turma] = {
              id: aluno.turma,
              nome: aluno.turma,
              curso: cursoId,
              alunos: [],
              totalAlunos: 0
            }
          }

          // Adicionar aluno à turma
          dadosProcessados.cursos[cursoId].turmas[aluno.turma].alunos.push(aluno)
          dadosProcessados.cursos[cursoId].turmas[aluno.turma].totalAlunos++
          dadosProcessados.cursos[cursoId].totalAlunos++
          dadosProcessados.totalAlunos++
        })
      })

      return dadosProcessados
    } catch (error) {
      throw new Error('Erro ao processar dados da planilha: ' + error.message)
    }
  }

  // Função para identificar curso baseado na planilha ou dados
  const identificarCurso = (nomePlanilha, registro) => {
    const nome = (nomePlanilha || '').toUpperCase()

    console.log(`Identificando curso para planilha: "${nomePlanilha}" (normalizado: "${nome}")`)

    // Verificar no nome da planilha
    if (nome.includes('CAI')) {
      console.log('✓ Identificado como CAI')
      return 'CAI'
    }
    if (nome.includes('SESI') && nome.includes('ADM')) {
      console.log('✓ Identificado como SESI_TEC_ADM (SESI + ADM)')
      return 'SESI_TEC_ADM'
    }
    if (nome.includes('ADMINISTRAÇÃO') || nome.includes('ADMINISTRACAO') || (nome.includes('TECNICO') && nome.includes('ADM'))) {
      console.log('✓ Identificado como SESI_TEC_ADM (ADMINISTRAÇÃO)')
      return 'SESI_TEC_ADM'
    }
    // Reconhecer eletromecânica por vários padrões
    if (nome.includes('ELETROMECÂNICA') || nome.includes('ELETROMECANICA') ||
        nome.includes('ELETROMEC') || nome.includes('SEDUC') ||
        (nome.includes('TECNICO') && nome.includes('ELETR'))) {
      console.log('✓ Identificado como SEDUC_TEC_ELETROMECANICA (ELETROMECÂNICA)')
      return 'SEDUC_TEC_ELETROMECANICA'
    }

    // Verificar em campos do registro
    const campos = Object.values(registro).join(' ').toUpperCase()
    if (campos.includes('CAI')) return 'CAI'
    if (campos.includes('SESI') && campos.includes('ADM')) return 'SESI_TEC_ADM'
    if (campos.includes('ADMINISTRAÇÃO') || campos.includes('ADMINISTRACAO')) return 'SESI_TEC_ADM'
    if (campos.includes('ELETROMECÂNICA') || campos.includes('ELETROMECANICA') ||
        campos.includes('ELETROMEC') || campos.includes('SEDUC')) return 'SEDUC_TEC_ELETROMECANICA'

    // Tentar identificar por campo específico
    if (registro.curso || registro.Curso || registro.CURSO) {
      const curso = (registro.curso || registro.Curso || registro.CURSO || '').toUpperCase()
      if (curso.includes('CAI')) return 'CAI'
      if (curso.includes('ADM') || curso.includes('ADMINISTRAÇÃO') || curso.includes('ADMINISTRACAO')) return 'SESI_TEC_ADM'
      if (curso.includes('ELETROMECANICA') || curso.includes('ELETROMECÂNICA') ||
          curso.includes('ELETROMEC') || curso.includes('SEDUC')) return 'SEDUC_TEC_ELETROMECANICA'
    }

    // Verificar por padrões de turma (TEEA, TEEB = Técnico Eletromecânica)
    const turma = extrairCampo(registro, ['turma', 'Turma', 'TURMA', 'classe', 'Classe', 'CLASSE'])
    if (turma) {
      const turmaNorm = turma.toUpperCase()
      console.log(`Verificando padrão de turma: "${turma}" (normalizado: "${turmaNorm}")`)

      if (turmaNorm.startsWith('TEE') || turmaNorm.includes('ELETR')) {
        console.log('✓ Identificado como SEDUC_TEC_ELETROMECANICA (padrão turma TEE)')
        return 'SEDUC_TEC_ELETROMECANICA'
      }
      if (turmaNorm.startsWith('TAD') || turmaNorm.includes('ADM')) {
        console.log('✓ Identificado como SESI_TEC_ADM (padrão turma TAD)')
        return 'SESI_TEC_ADM'
      }
    }

    console.log('✗ Curso não identificado')
    return null
  }

  // Função para extrair dados do aluno do registro
  const extrairDadosAluno = (registro, cursoId) => {
    const aluno = {
      id: gerarIdAluno(registro),
      matricula: extrairCampo(registro, ['matricula', 'Matricula', 'MATRICULA', 'número', 'numero', "Nº de Matrícula"]),
      nome: extrairCampo(registro, ['nome', 'Nome', 'NOME', 'aluno', 'Aluno', 'ALUNO']),
      turma: extrairCampo(registro, ['turma', 'Turma', 'TURMA', 'classe', 'Classe', 'CLASSE']),
      curso: cursosDisponiveis.find(c => c.id === cursoId)?.nome || cursoId,
      cargo: 'Aluno',
      telefone: extrairCampo(registro, ['telefone', 'Telefone', 'TELEFONE', 'tel', "Telefone - Emegência"]),
      celular: extrairCampo(registro, ['celular', 'Celular', 'CELULAR', 'whatsapp', 'WhatsApp', 'Celular aluno']),
      email: extrairCampo(registro, ['email', 'Email', 'EMAIL', 'e-mail', 'E-mail']),
      rg: extrairCampo(registro, ['rg', 'RG', 'Rg']),
      cpf: extrairCampo(registro, ['cpf', 'CPF', 'Cpf']),
      endereco: extrairCampo(registro, ['endereco', 'Endereco', 'ENDERECO', 'endereço', 'Endereço', 'Endereço Aluno']),
      bairro: extrairCampo(registro, ['bairro', 'Bairro', 'BAIRRO']),
      cidade: extrairCampo(registro, ['cidade', 'Cidade', 'CIDADE','Município']),
      estado: extrairCampo(registro, ['estado', 'Estado', 'ESTADO', 'uf', 'UF']),
      cep: extrairCampo(registro, ['cep', 'CEP', 'Cep']),
      mae: extrairCampo(registro, ['mae', 'Mae', 'MAE', 'mãe', 'Mãe', 'mae_nome', 'Nome da Mãe']),
      pai: extrairCampo(registro, ['pai', 'Pai', 'PAI', 'pai_nome', 'Nome do Pai']),
      empresa: extrairCampo(registro, ['Empresa do contrato de aprendizagem']),
      foto: '',
      ocorrencias: [],
      fromSheet: true,
      lastSync: new Date().toISOString(),
      dadosOriginais: registro
    }

    return aluno
  }

  // Função auxiliar para extrair campo com nomes alternativos
  const extrairCampo = (registro, nomesCampos) => {
    for (const nome of nomesCampos) {
      if (registro[nome] !== undefined && registro[nome] !== null && registro[nome] !== '') {
        return String(registro[nome]).trim()
      }
    }
    return ''
  }

  // Função para gerar ID único do aluno
  const gerarIdAluno = (registro) => {
    const matricula = extrairCampo(registro, ['matricula', 'Matricula', 'MATRICULA'])
    const nome = extrairCampo(registro, ['nome', 'Nome', 'NOME'])
    const turma = extrairCampo(registro, ['turma', 'Turma', 'TURMA'])
    
    return `${turma}_${matricula || nome.replace(/\s+/g, '_')}_${Date.now()}`
  }

  // Função para salvar dados processados no localStorage
  const salvarDadosProcessados = (dados) => {
    try {
      localStorage.setItem('carometro_dados_excel', JSON.stringify(dados))
      localStorage.setItem('carometro_excel_timestamp', Date.now().toString())
      return true
    } catch (error) {
      console.error('Erro ao salvar dados no localStorage:', error)
      return false
    }
  }

  // Função para carregar dados processados do localStorage
  const carregarDadosProcessados = () => {
    try {
      const dados = localStorage.getItem('carometro_dados_excel')
      return dados ? JSON.parse(dados) : null
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error)
      return null
    }
  }

  // Função para obter alunos por curso e turma
  const getAlunosPorCursoTurma = (cursoId, turmaId) => {
    const dados = carregarDadosProcessados()
    if (!dados || !dados.cursos[cursoId] || !dados.cursos[cursoId].turmas[turmaId]) {
      return []
    }
    
    return dados.cursos[cursoId].turmas[turmaId].alunos || []
  }

  // Função para obter lista de cursos disponíveis
  const getCursosDisponiveis = () => {
    const dados = carregarDadosProcessados()
    if (!dados) return []
    
    return Object.values(dados.cursos).map(curso => ({
      id: curso.id,
      nome: curso.nome,
      cor: curso.cor,
      totalAlunos: curso.totalAlunos,
      totalTurmas: Object.keys(curso.turmas).length
    }))
  }

  // Função para obter turmas de um curso
  const getTurmasPorCurso = (cursoId) => {
    const dados = carregarDadosProcessados()
    if (!dados || !dados.cursos[cursoId]) {
      return []
    }
    
    return Object.values(dados.cursos[cursoId].turmas)
  }

  // Função para verificar se há dados da planilha
  const temDadosPlanilha = () => {
    return carregarDadosProcessados() !== null
  }

  // Função para ler arquivo Excel via URL
  const lerArquivoExcelUrl = async (url) => {
    if (!url || typeof url !== 'string' || !url.trim()) {
      return null
    }

    try {
      const response = await fetch(url, { mode: 'cors' })
      if (!response || !response.ok) {
        console.warn('Falha ao baixar arquivo Excel:', response ? response.status : 'sem resposta')
        return null
      }

      const buffer = await response.arrayBuffer()
      const data = new Uint8Array(buffer)
      const workbook = XLSX.read(data, { type: 'array' })

      const planilhas = {}
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        planilhas[sheetName] = {
          nome: sheetName,
          dados: jsonData,
          totalRegistros: jsonData.length,
          colunas: jsonData.length > 0 ? Object.keys(jsonData[0]) : []
        }
      })

      return {
        planilhas,
        totalPlanilhas: workbook.SheetNames.length,
        nomesPlanilhas: workbook.SheetNames
      }
    } catch (error) {
      console.warn('Erro ao obter/processar planilha por URL:', error?.message || error)
      return null
    }
  }

  // Normaliza links (Google Sheets/SharePoint) para download direto
  const normalizarUrlPlanilha = (url) => {
    if (!url) return ''
    try {
      const u = new URL(url)
      // Google Sheets -> export xlsx
      if (u.hostname.includes('docs.google.com') && /\/spreadsheets\/d\//.test(u.pathname)) {
        const match = u.pathname.match(/\/spreadsheets\/d\/([^/]+)/)
        if (match && match[1]) {
          return `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=xlsx`
        }
      }
      // SharePoint: garantir download=1
      if (u.hostname.includes('sharepoint.com')) {
        if (u.searchParams.has('web')) {
          u.searchParams.delete('web')
        }
        if (!u.searchParams.has('download')) {
          u.searchParams.set('download', '1')
        }
        return u.toString()
      }
      return url
    } catch (e) {
      return url
    }
  }

  // Obtém URL configurada via ENV ou localStorage
  // const getUrlConfigurada = () => {
  //   const sanitize = (u) => {
  //     const s = (u ?? '').toString().trim()
  //     if (!s || s.toLowerCase() === 'undefined' || s.toLowerCase() === 'null' || s === '#') return ''
  //     return s
  //   }
  //   const envUrl = sanitize(import.meta?.env?.VITE_CAROMETRO_EXCEL_URL)
  //   const storedUrl = sanitize(localStorage.getItem('carometro_excel_url'))
  //   const url = envUrl || storedUrl
  //   return normalizarUrlPlanilha(url)
  // }
  const getUrlConfigurada = () => {
    return "https://docs.google.com/spreadsheets/d/1BKSSU6khpPjJ7x8vsbRkwc7TJcAWk3yO/export?format=xlsx"
  }

  // Função para limpar cache
  const limparCache = () => {
    try {
      localStorage.removeItem('carometro_dados_excel')
      localStorage.removeItem('carometro_excel_timestamp')
      console.log('Cache limpo com sucesso')
      return true
    } catch (error) {
      console.error('Erro ao limpar cache:', error)
      return false
    }
  }

  // Sincroniza automaticamente a planilha configurada
  const sincronizarPlanilhaConfigurada = async (force = false) => {
    try {
      const url = getUrlConfigurada()
      if (!url) return false

      // Se force=true, limpar cache primeiro
      if (force) {
        limparCache()
      }

      if (!force && temDadosPlanilha()) return true

      console.log('Sincronizando planilha...', url)
      const dadosExcel = await lerArquivoExcelUrl(url)
      if (!dadosExcel) {
        console.warn('Falha ao carregar dados Excel')
        return false
      }

      console.log('Dados Excel carregados:', dadosExcel)
      const dadosProcessados = processarDadosPlanilha(dadosExcel)
      console.log('Dados processados:', dadosProcessados)
      return salvarDadosProcessados(dadosProcessados)
    } catch (e) {
      console.warn('Sincronização da planilha falhou:', e?.message || e)
      return false
    }
  }

  return {
    cursosDisponiveis,
    lerArquivoExcel,
    lerArquivoExcelUrl,
    processarDadosPlanilha,
    salvarDadosProcessados,
    carregarDadosProcessados,
    getAlunosPorCursoTurma,
    getCursosDisponiveis,
    getTurmasPorCurso,
    temDadosPlanilha,
    normalizarUrlPlanilha,
    getUrlConfigurada,
    sincronizarPlanilhaConfigurada,
    limparCache
  }
}
