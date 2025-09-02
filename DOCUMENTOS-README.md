# 📁 Gerenciador de Documentos

Este sistema permite organizar e acessar facilmente todos os seus documentos através de uma interface web moderna.

## 🚀 Como usar

### 1. Configurar o caminho da pasta

Edite o arquivo `gerar-arquivos.js` na linha 10:

```javascript
const PASTA_LOCAL = 'C:\\Users\\Andre Toneto\\Desktop\\Estudos excel'
```

Altere para o caminho da sua pasta de documentos.

### 2. Gerar a lista de arquivos

Execute o comando no terminal:

```bash
node gerar-arquivos.js
```

### 3. Acessar os documentos

Abra a página **Formulários** no site para ver todos os seus documentos organizados em cartões.

## 📋 Funcionalidades

### ✅ **Visualização em cartões**
- Interface moderna com Vuetify
- Ícones específicos para cada tipo de arquivo
- Informações de tamanho e tipo

### ✅ **Busca e filtros**
- Busca por nome do arquivo
- Filtro por tipo de arquivo (XLSX, PDF, DOCX, etc.)
- Estatísticas em tempo real

### ✅ **Abertura de arquivos**
- Clique nos cartões para abrir arquivos
- Funciona com protocolo `file://` 
- Abre diretamente no programa padrão

### ✅ **Tipos de arquivo suportados**
- 📊 **Excel**: XLSX, XLS
- 📄 **PDF**: PDF  
- 📝 **Word**: DOCX, DOC
- 📈 **PowerPoint**: PPTX, PPT
- 📋 **Dados**: CSV, TXT
- 🗄️ **Banco**: ACCDB, MDB
- 📁 **Outros**: Qualquer tipo de arquivo

## ⚙️ Como funciona

1. **Escaneamento**: O script `gerar-arquivos.js` escaneia recursivamente sua pasta
2. **Geração**: Cria o arquivo `public/arquivos.json` com metadados
3. **Visualização**: A página carrega os dados e exibe em cartões
4. **Abertura**: Links `file://` abrem arquivos localmente

## 🎨 Interface

### Header
- Título e descrição da seção
- Ícone temático SENAI

### Estatísticas  
- Total de arquivos
- Contadores por tipo
- Cards coloridos por categoria

### Filtros
- Campo de busca por nome
- Seletor de tipo de arquivo
- Contador de resultados

### Grid de documentos
- Cards responsivos
- Hover effects
- Badges de tipo
- Informações de tamanho

## 🔧 Personalização

### Alterar pasta monitorada
```javascript
// Em gerar-arquivos.js
const PASTA_LOCAL = 'C:\\Seus\\Documentos\\Aqui'
```

### Adicionar novos tipos
```javascript
// Em src/views/formularios/index.vue
const getIconeTipo = (tipo) => {
  const icones = {
    'XLSX': 'mdi-file-excel',
    'PDF': 'mdi-file-pdf-box',
    'NOVO_TIPO': 'mdi-file-seu-icone' // Adicione aqui
  }
}
```

### Personalizar cores
```javascript
const getCorTipo = (tipo) => {
  const cores = {
    'XLSX': 'success',
    'PDF': 'error',
    'SEU_TIPO': 'purple' // Adicione aqui
  }
}
```

## 🐛 Solução de problemas

### ❌ "Arquivo arquivos.json não encontrado"
**Solução**: Execute `node gerar-arquivos.js` primeiro

### ❌ "Pasta não encontrada"  
**Solução**: Verifique o caminho em `gerar-arquivos.js`

### ❌ "Arquivo não abre"
**Solução**: 
- Verifique se o arquivo ainda existe
- Execute novamente o script para atualizar
- Alguns navegadores bloqueiam protocolo `file://`

### ❌ "Permissão negada"
**Solução**: Verifique permissões da pasta no sistema

## 📝 Exemplo de saída do script

```
🔍 Escaneando pasta de documentos...
📁 Pasta: C:\Users\Andre Toneto\Desktop\Estudos excel
━━━━━━━━━━━━━━━━━━━━━━━━━━━���━━━━━━━━━━━━━━━━━━━━━━
✅ Lista de arquivos gerada com sucesso!
📄 Arquivo: public/arquivos.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 ESTATÍSTICAS:
   📁 Total de arquivos: 15
   💾 Tamanho total: 4.2 MB
   📋 Tipos de arquivo:
      XLSX: 8 arquivos
      PDF: 4 arquivos  
      DOCX: 2 arquivos
      CSV: 1 arquivo
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 Pronto! Recarregue a página de formulários para ver os documentos.
```

## 🔄 Atualização automática

Para manter a lista sempre atualizada, você pode:

1. **Executar manualmente** sempre que adicionar arquivos
2. **Criar script batch** para executar automaticamente
3. **Usar task scheduler** do Windows para executar periodicamente

---

✅ **Seus documentos agora estão organizados e facilmente acessíveis!**
