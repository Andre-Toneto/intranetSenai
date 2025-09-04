import { ref } from 'vue'
import { useExcelData } from '@/composables/useExcelData.js'
import { useRemoteOcorrencias } from '@/composables/useRemoteOcorrencias.js'

export const useOcorrencias = () => {
  const { carregarDadosProcessados, temDadosPlanilha } = useExcelData()
  const { isConfigured: remoteReady, list: rList, add: rAdd, update: rUpdate, remove: rRemove, setUrl: setRemoteUrl, getUrl: getRemoteUrl } = useRemoteOcorrencias()
  const saving = ref(false)

  const STORAGE_KEY = 'carometro_ocorrencias_store'
  const store = ref({ version: 1, updatedAt: null, registros: {}, tombstones: {} })
  const loaded = ref(false)

  const normalizeArray = (arr) => Array.isArray(arr) ? arr : []
  const genId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

  const ensureLoaded = async () => {
    if (loaded.value) return
    try {
      const cached = localStorage.getItem(STORAGE_KEY)
      if (cached) {
        const parsed = JSON.parse(cached)
        store.value = { tombstones: {}, ...parsed, registros: parsed.registros || {}, tombstones: parsed.tombstones || {} }
        loaded.value = true
        return
      }
      const base = (import.meta && import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : './'
      const resp = await fetch(`${base}data/ocorrencias.json`, { cache: 'no-store' })
      if (resp.ok) {
        const json = await resp.json()
        const base = json && typeof json === 'object' ? json : {}
        store.value = {
          version: 1,
          updatedAt: base.updatedAt || null,
          registros: base.registros || {},
          tombstones: base.tombstones || {}
        }
      }
    } catch (e) {
      // fallback silently
      store.value = { version: 1, updatedAt: null, registros: {}, tombstones: {} }
    } finally {
      loaded.value = true
      persist()
    }
  }

  const persist = () => {
    try {
      store.value.updatedAt = new Date().toISOString()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store.value))
    } catch {}
  }

  const getPath = (cursoId, turmaId, alunoId) => {
    const c = String(cursoId || '').trim()
    const t = String(turmaId || '').trim()
    const a = String(alunoId || '').trim()
    if (!c || !t || !a) return null
    if (!store.value.registros[c]) store.value.registros[c] = {}
    if (!store.value.registros[c][t]) store.value.registros[c][t] = {}
    if (!store.value.registros[c][t][a]) store.value.registros[c][t][a] = []
    return store.value.registros[c][t][a]
  }

  const getTombs = (cursoId, turmaId, alunoId) => {
    const c = String(cursoId || '').trim()
    const t = String(turmaId || '').trim()
    const a = String(alunoId || '').trim()
    if (!c || !t || !a) return null
    if (!store.value.tombstones[c]) store.value.tombstones[c] = {}
    if (!store.value.tombstones[c][t]) store.value.tombstones[c][t] = {}
    if (!store.value.tombstones[c][t][a]) store.value.tombstones[c][t][a] = {}
    return store.value.tombstones[c][t][a]
  }

  const importLegacyIfNeeded = (cursoId, turmaId, alunoId) => {
    // Importa ocorrências embutidas no aluno da planilha (legado) apenas uma vez
    if (!temDadosPlanilha()) return
    try {
      const dados = carregarDadosProcessados()
      const aluno = dados?.cursos?.[cursoId]?.turmas?.[turmaId]?.alunos?.find(
        a => a.id === alunoId || a.matricula === alunoId
      )
      const atuais = getPath(cursoId, turmaId, alunoId)
      if (aluno && Array.isArray(aluno.ocorrencias) && atuais.length === 0 && aluno.ocorrencias.length > 0) {
        aluno.ocorrencias.forEach(o => atuais.push(o))
        persist()
      }
    } catch {}
  }

  const list = (cursoId, turmaId, alunoId) => {
    ensureLoaded()
    const arr = getPath(cursoId, turmaId, alunoId) || []
    if (arr.length === 0) importLegacyIfNeeded(cursoId, turmaId, alunoId)
    return [...(getPath(cursoId, turmaId, alunoId) || [])]
  }

  const refreshFromRemote = async (cursoId, turmaId, alunoId) => {
    if (!cursoId || !turmaId || !alunoId) return list(cursoId, turmaId, alunoId)
    if (!remoteReady()) return list(cursoId, turmaId, alunoId)
    try {
      const items = await rList(cursoId, turmaId, alunoId)
      const current = getPath(cursoId, turmaId, alunoId) || []
      const tombs = getTombs(cursoId, turmaId, alunoId) || {}
      const map = new Map(current.map(o => [o.id, o]))
      items.forEach(o => map.set(o.id, o))
      const merged = Array.from(map.values()).filter(o => !tombs[o.id])
      const target = getPath(cursoId, turmaId, alunoId)
      if (target) {
        store.value.registros[cursoId][turmaId][alunoId] = merged
        persist()
      }
      return list(cursoId, turmaId, alunoId)
    } catch {
      return list(cursoId, turmaId, alunoId)
    }
  }

  const add = async (cursoId, turmaId, alunoId, payload) => {
    saving.value = true
    try {
      await ensureLoaded()
      const arr = getPath(cursoId, turmaId, alunoId)
      const tombs = getTombs(cursoId, turmaId, alunoId)
      if (!arr || !tombs) throw new Error('Curso, Turma e Aluno são obrigatórios')
      const nova = {
        id: genId(),
        tipo: (payload?.tipo || 'Outro'),
        descricao: String(payload?.descricao || '').trim(),
        data: payload?.data || new Date().toISOString(),
        autor: payload?.autor || 'Administrador'
      }
      delete tombs[nova.id]
      arr.unshift(nova)
      persist()
      if (remoteReady()) {
        rAdd(cursoId, turmaId, alunoId, nova).then(remoteItem => {
          const idx = arr.findIndex(o => o.id === nova.id)
          if (idx >= 0) arr[idx] = { ...arr[idx], ...remoteItem }
          persist()
        }).catch(() => {})
      }
      return nova
    } finally {
      saving.value = false
    }
  }

  const update = async (cursoId, turmaId, alunoId, ocorrenciaId, patch) => {
    saving.value = true
    try {
      await ensureLoaded()
      const arr = getPath(cursoId, turmaId, alunoId)
      if (!arr) throw new Error('Curso, Turma e Aluno são obrigatórios')
      const i = arr.findIndex(o => o.id === ocorrenciaId)
      if (i === -1) throw new Error('Ocorrência não encontrada')
      arr[i] = { ...arr[i], ...patch }
      persist()
      if (remoteReady()) {
        rUpdate(cursoId, turmaId, alunoId, ocorrenciaId, patch).catch(() => {})
      }
      return arr[i]
    } finally {
      saving.value = false
    }
  }

  const remove = async (cursoId, turmaId, alunoId, ocorrenciaId) => {
    saving.value = true
    try {
      await ensureLoaded()
      const arr = getPath(cursoId, turmaId, alunoId)
      const tombs = getTombs(cursoId, turmaId, alunoId)
      if (!arr || !tombs) throw new Error('Curso, Turma e Aluno são obrigatórios')
      const nova = arr.filter(o => o.id !== ocorrenciaId)
      store.value.registros[cursoId][turmaId][alunoId] = nova
      tombs[ocorrenciaId] = true
      persist()
      if (remoteReady()) {
        rRemove(cursoId, turmaId, alunoId, ocorrenciaId).catch(() => {})
      }
      return true
    } finally {
      saving.value = false
    }
  }

  const exportToFile = () => {
    const dataStr = JSON.stringify(store.value, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ocorrencias.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importFromObject = (obj) => {
    if (!obj || typeof obj !== 'object') throw new Error('Arquivo inválido')
    const registros = obj.registros && typeof obj.registros === 'object' ? obj.registros : {}
    const tombstones = obj.tombstones && typeof obj.tombstones === 'object' ? obj.tombstones : {}
    store.value = { version: 1, updatedAt: new Date().toISOString(), registros, tombstones }
    persist()
  }

  const getRemote = () => getRemoteUrl()
  const setRemote = (url) => setRemoteUrl(url)

  return { saving, list, add, update, remove, exportToFile, importFromObject, getRemote, setRemote, refreshFromRemote }
}
