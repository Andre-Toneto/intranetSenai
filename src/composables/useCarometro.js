import { useExcelData } from './useExcelData.js'

export const useCarometro = () => {
  const { getAlunosPorCursoTurma, getCursosDisponiveis, getTurmasPorCurso, temDadosPlanilha } = useExcelData()
  
  // Função para obter dados de uma turma (integrada com Excel)
  const getAlunosTurma = (turma, curso = null) => {
    if (!turma) return []

    // Primeiro tentar buscar da planilha Excel se curso for especificado
    if (curso && temDadosPlanilha()) {
      const alunosExcel = getAlunosPorCursoTurma(curso, turma)
      if (alunosExcel.length > 0) {
        return alunosExcel
      }
    }

    // Fallback para dados locais (localStorage)
    try {
      const key = `carometro_turma_${turma}`
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Erro ao carregar alunos do localStorage:', error)
      return []
    }
  }

  // Função para salvar dados de uma turma
  const saveAlunosTurma = (turma, alunos) => {
    if (!turma) return false
    
    try {
      const key = `carometro_turma_${turma}`
      localStorage.setItem(key, JSON.stringify(alunos))
      return true
    } catch (error) {
      console.error('Erro ao salvar alunos no localStorage:', error)
      return false
    }
  }

  // Função para adicionar ou atualizar um aluno
  const saveAluno = (turma, aluno) => {
    if (!turma || !aluno || !aluno.matricula) {
      throw new Error('Turma, aluno e matrícula são obrigatórios')
    }

    const alunos = getAlunosTurma(turma)
    const alunoIndex = alunos.findIndex(a => a.matricula === aluno.matricula)
    
    if (alunoIndex >= 0) {
      // Atualizar aluno existente
      alunos[alunoIndex] = { ...alunos[alunoIndex], ...aluno }
    } else {
      // Adicionar novo aluno
      alunos.push({
        ...aluno,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      })
    }

    const success = saveAlunosTurma(turma, alunos)
    if (!success) {
      throw new Error('Erro ao salvar dados no localStorage')
    }

    return {
      success: true,
      message: alunoIndex >= 0 ? 'Aluno atualizado com sucesso' : 'Aluno adicionado com sucesso',
      alunos
    }
  }

  // Função para remover um aluno
  const deleteAluno = (turma, matricula) => {
    if (!turma || !matricula) {
      throw new Error('Turma e matrícula são obrigatórias')
    }

    const alunos = getAlunosTurma(turma)
    const alunoIndex = alunos.findIndex(a => a.matricula === matricula)
    
    if (alunoIndex === -1) {
      return {
        success: true,
        message: 'Aluno não encontrado',
        alunos
      }
    }

    alunos.splice(alunoIndex, 1)
    
    const success = saveAlunosTurma(turma, alunos)
    if (!success) {
      throw new Error('Erro ao salvar dados no localStorage')
    }

    return {
      success: true,
      message: 'Aluno removido com sucesso',
      alunos
    }
  }


  return {
    getAlunosTurma,
    saveAluno,
    deleteAluno,
    // Métodos para Excel
    getCursosDisponiveis,
    getTurmasPorCurso,
    temDadosPlanilha
  }
}
