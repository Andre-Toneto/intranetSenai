import { ref } from 'vue'
import { useExcelData } from '@/composables/useExcelData.js'
import { useCarometro } from '@/composables/useCarometro.js'

export const useOcorrencias = () => {
  const { carregarDadosProcessados, salvarDadosProcessados, temDadosPlanilha } = useExcelData()
  const { getAlunosTurma, saveAlunosTurma } = useCarometro()
  const saving = ref(false)

  const normalizeArray = (arr) => Array.isArray(arr) ? arr : []

  const genId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

  const findAlunoExcel = (cursoId, turmaId, alunoId) => {
    const dados = carregarDadosProcessados()
    if (!dados || !cursoId || !turmaId || !alunoId) return { dados: null, aluno: null, turma: null }
    const curso = dados.cursos?.[cursoId]
    const turma = curso?.turmas?.[turmaId]
    if (!turma) return { dados, aluno: null, turma: null }
    const idx = turma.alunos.findIndex(a => a.id === alunoId || a.matricula === alunoId)
    const aluno = idx >= 0 ? turma.alunos[idx] : null
    return { dados, aluno, turma, idx }
  }

  const findAlunoFallback = (turmaId, alunoId) => {
    const alunos = getAlunosTurma(turmaId)
    const idx = alunos.findIndex(a => a.id === alunoId || a.matricula === alunoId)
    const aluno = idx >= 0 ? alunos[idx] : null
    return { alunos, aluno, idx }
  }

  const list = (cursoId, turmaId, alunoId) => {
    if (temDadosPlanilha() && cursoId) {
      const { aluno } = findAlunoExcel(cursoId, turmaId, alunoId)
      return normalizeArray(aluno?.ocorrencias)
    }
    const { aluno } = findAlunoFallback(turmaId, alunoId)
    return normalizeArray(aluno?.ocorrencias)
  }

  const add = async (cursoId, turmaId, alunoId, payload) => {
    saving.value = true
    try {
      const nova = {
        id: genId(),
        tipo: (payload?.tipo || 'Outro'),
        descricao: String(payload?.descricao || '').trim(),
        data: payload?.data || new Date().toISOString(),
        autor: payload?.autor || 'Administrador'
      }

      if (temDadosPlanilha() && cursoId) {
        const { dados, aluno } = findAlunoExcel(cursoId, turmaId, alunoId)
        if (!dados || !aluno) throw new Error('Aluno não encontrado')
        aluno.ocorrencias = normalizeArray(aluno.ocorrencias)
        aluno.ocorrencias.unshift(nova)
        if (!salvarDadosProcessados(dados)) throw new Error('Falha ao salvar dados')
        return nova
      } else {
        const { alunos, aluno, idx } = findAlunoFallback(turmaId, alunoId)
        if (!aluno) throw new Error('Aluno não encontrado')
        aluno.ocorrencias = normalizeArray(aluno.ocorrencias)
        aluno.ocorrencias.unshift(nova)
        alunos[idx] = aluno
        if (!saveAlunosTurma(turmaId, alunos)) throw new Error('Falha ao salvar dados')
        return nova
      }
    } finally {
      saving.value = false
    }
  }

  const update = async (cursoId, turmaId, alunoId, ocorrenciaId, patch) => {
    saving.value = true
    try {
      if (temDadosPlanilha() && cursoId) {
        const { dados, aluno } = findAlunoExcel(cursoId, turmaId, alunoId)
        if (!dados || !aluno) throw new Error('Aluno não encontrado')
        aluno.ocorrencias = normalizeArray(aluno.ocorrencias)
        const i = aluno.ocorrencias.findIndex(o => o.id === ocorrenciaId)
        if (i === -1) throw new Error('Ocorrência não encontrada')
        aluno.ocorrencias[i] = { ...aluno.ocorrencias[i], ...patch }
        if (!salvarDadosProcessados(dados)) throw new Error('Falha ao salvar dados')
        return aluno.ocorrencias[i]
      } else {
        const { alunos, aluno, idx } = findAlunoFallback(turmaId, alunoId)
        if (!aluno) throw new Error('Aluno não encontrado')
        aluno.ocorrencias = normalizeArray(aluno.ocorrencias)
        const i = aluno.ocorrencias.findIndex(o => o.id === ocorrenciaId)
        if (i === -1) throw new Error('Ocorrência não encontrada')
        aluno.ocorrencias[i] = { ...aluno.ocorrencias[i], ...patch }
        alunos[idx] = aluno
        if (!saveAlunosTurma(turmaId, alunos)) throw new Error('Falha ao salvar dados')
        return aluno.ocorrencias[i]
      }
    } finally {
      saving.value = false
    }
  }

  const remove = async (cursoId, turmaId, alunoId, ocorrenciaId) => {
    saving.value = true
    try {
      if (temDadosPlanilha() && cursoId) {
        const { dados, aluno } = findAlunoExcel(cursoId, turmaId, alunoId)
        if (!dados || !aluno) throw new Error('Aluno não encontrado')
        aluno.ocorrencias = normalizeArray(aluno.ocorrencias)
        const nova = aluno.ocorrencias.filter(o => o.id !== ocorrenciaId)
        aluno.ocorrencias = nova
        if (!salvarDadosProcessados(dados)) throw new Error('Falha ao salvar dados')
        return true
      } else {
        const { alunos, aluno, idx } = findAlunoFallback(turmaId, alunoId)
        if (!aluno) throw new Error('Aluno não encontrado')
        aluno.ocorrencias = normalizeArray(aluno.ocorrencias)
        const nova = aluno.ocorrencias.filter(o => o.id !== ocorrenciaId)
        aluno.ocorrencias = nova
        alunos[idx] = aluno
        if (!saveAlunosTurma(turmaId, alunos)) throw new Error('Falha ao salvar dados')
        return true
      }
    } finally {
      saving.value = false
    }
  }

  return { saving, list, add, update, remove }
}
