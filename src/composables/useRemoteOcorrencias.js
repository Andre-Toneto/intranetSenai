export const useRemoteOcorrencias = () => {
  const STORAGE_URL_KEY = 'ocorrencias_webapp_url'

  const getUrl = () => {
    try {
      const v = localStorage.getItem(STORAGE_URL_KEY)
      return typeof v === 'string' ? v.trim() : ''
    } catch {
      return ''
    }
  }

  const setUrl = (url) => {
    if (!url || !/^https?:\/\//i.test(url)) throw new Error('URL inválida')
    localStorage.setItem(STORAGE_URL_KEY, url.trim())
  }

  const isConfigured = () => !!getUrl()

  const safeFetch = async (path = '', options = {}) => {
    const base = getUrl()
    if (!base) throw new Error('Web App não configurado')
    const url = base.replace(/\/$/, '') + path
    const isPost = (options?.method || 'GET').toUpperCase() === 'POST'
    const headers = isPost ? { 'Content-Type': 'text/plain;charset=utf-8' } : {}
    const res = await fetch(url, { headers, ...options })
    if (!res.ok) throw new Error(`Falha na requisição: ${res.status}`)
    return res.json()
  }

  const list = async (cursoId, turmaId, alunoId) => {
    const qs = new URLSearchParams({
      action: 'list',
      cursoId: String(cursoId || ''),
      turmaId: String(turmaId || ''),
      alunoId: String(alunoId || ''),
    })
    const data = await safeFetch('?' + qs.toString())
    return Array.isArray(data?.items) ? data.items : []
  }

  const add = async (cursoId, turmaId, alunoId, ocorrencia) => {
    const payload = { action: 'add', cursoId, turmaId, alunoId, ocorrencia }
    const data = await safeFetch('', { method: 'POST', body: JSON.stringify(payload) })
    return data?.item || ocorrencia
  }

  const update = async (cursoId, turmaId, alunoId, ocorrenciaId, patch) => {
    const payload = { action: 'update', cursoId, turmaId, alunoId, ocorrenciaId, patch }
    const data = await safeFetch('', { method: 'POST', body: JSON.stringify(payload) })
    return data?.item || null
  }

  const remove = async (cursoId, turmaId, alunoId, ocorrenciaId) => {
    const payload = { action: 'remove', cursoId, turmaId, alunoId, ocorrenciaId }
    await safeFetch('', { method: 'POST', body: JSON.stringify(payload) })
    return true
  }

  return { getUrl, setUrl, isConfigured, list, add, update, remove }
}
