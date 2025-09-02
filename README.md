# Portal SENAI - Vue 3 + Vite

Este projeto foi migrado de **Nuxt 3** para **Vue 3 + Vite** para simplificar a arquitetura e remover dependências de SSR.

## 🚀 Tecnologias

- **Vue 3** - Framework reativo
- **Vite** - Build tool e dev server  
- **Vuetify 3** - Framework de UI Material Design
- **Vue Router** - Roteamento SPA
- **XLSX** - Manipulação de planilhas Excel

## 📁 Estrutura do Projeto

```
src/
├── main.js              # Ponto de entrada da aplicação
├── App.vue              # Componente raiz
├── router/              # Configuração do Vue Router
│   └── index.js
├── views/               # Páginas da aplicação (antigas pages/)
│   ├── home/
│   ├── carometro/
│   └── formularios/
├── components/          # Componentes reutilizáveis
│   ├── appNavigation/
│   ├── appToolbar/
│   └── carometro/
└── composables/         # Composables Vue (lógica reutilizável)
    ├── useCarometro.js
    └── useExcelData.js
```

## 🔄 Mudanças na Migração

### Removido (Nuxt)
- ❌ SSR (Server-Side Rendering)
- ❌ Sistema de rotas automático
- ❌ `useRouter()`, `useRoute()` do Nuxt
- ❌ `process.client` para detecção de cliente
- ❌ `onMounted()` com verificação de processo
- ❌ `<ClientOnly>` components

### Adicionado (Vue 3 + Vite)
- ✅ SPA (Single Page Application)
- ✅ Vue Router manual
- ✅ `useRouter()`, `useRoute()` do Vue Router
- ✅ Configuração manual do Vuetify
- ✅ Build estático com Vite

### Adaptações de Código

#### 1. **Roteamento**
```js
// Antes (Nuxt)
const router = useRouter() // do Nuxt

// Depois (Vue 3)
import { useRouter } from 'vue-router'
const router = useRouter()
```

#### 2. **Detecção de Cliente**
```js
// Antes (Nuxt)
if (process.client) {
  // código só no cliente
}

// Depois (Vue 3)
// Removido - agora roda sempre no cliente (SPA)
```

#### 3. **Composables**
```js
// Antes (Nuxt)
export const useCarometro = () => {
  // usava process.client
}

// Depois (Vue 3)
export const useCarometro = () => {
  // sem process.client, sempre cliente
}
```

## 🛠️ Comandos

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🎯 Funcionalidades

### Carômetro
- Upload e processamento de planilhas Excel
- Visualização de alunos por curso/turma
- Modal com detalhes dos alunos
- Busca e filtros
- Dados persistidos no localStorage

### Navegação
- Menu lateral responsivo
- Toolbar com links externos
- Tema customizado SENAI

### Formulários
- Lista de arquivos Excel disponíveis
- Interface para estudos com planilhas

## 🎨 Tema SENAI

O tema customizado do SENAI está configurado no `src/main.js`:

```js
const vuetify = createVuetify({
  theme: {
    defaultTheme: 'senaiTheme',
    themes: {
      senaiTheme: {
        colors: {
          primary: '#e53e3e',    // SENAI Red
          secondary: '#1e3a8a',  // Navy Blue
          'senai-red': '#e53e3e',
          'senai-navy': '#1e3a8a',
          // ...
        }
      }
    }
  }
})
```

## 🔧 Configuração

### Vite Config
O projeto usa `vite.config.js` com:
- Plugin Vue
- Plugin Vuetify com auto-import
- Aliases (@/ para src/)
- Proxy para desenvolvimento

### Build
O comando `npm run build` gera arquivos estáticos na pasta `dist/` prontos para deploy em qualquer servidor web.

## 📦 Deploy

Como agora é uma SPA, pode ser deployado em:
- ✅ Vercel
- ✅ Netlify  
- ✅ GitHub Pages
- ✅ Servidor web estático (Apache, Nginx)
- ✅ CDN

## 🐛 Troubleshooting

### Problema: Página em branco
- Verifique se o build foi feito corretamente
- Confirme se os assets estão sendo servidos

### Problema: Rotas não funcionam
- Configure o servidor para redirect all para `index.html`
- Para Nginx: `try_files $uri $uri/ /index.html;`

### Problema: CSS não carrega
- Verifique se o Vuetify está importado em `main.js`
- Confirme se os estilos MDI estão carregando

## 📝 Notas

- ⚠️ **Sem SSR**: Agora é SPA, sem renderização do lado servidor
- 🔄 **Sem Hydration**: Não há mais hidratação de estado
- 📱 **Mesmo comportamento**: Interface e funcionalidades mantidas
- 🚀 **Build mais rápido**: Vite é muito mais rápido que Nuxt para development

---

✅ **Migração concluída com sucesso!** O projeto agora roda como SPA com Vue 3 + Vite.
