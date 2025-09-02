<template>
  <v-container fluid class="fill-height">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="12" rounded="lg" class="pa-6">
          <v-card-title class="text-center pb-4">
            <div class="text-center">
              <v-icon size="48" color="senai-red" class="mb-2">mdi-account-group</v-icon>
              <h2 class="text-h4 text-senai-red font-weight-medium mb-2">Acesso ao Carômetro</h2>
              <p class="text-body-1 text-medium-emphasis">Autenticação necessária</p>
            </div>
          </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="authenticate">
              <v-text-field
                v-model="credentials.usuario"
                label="Usuário"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-account"
                :rules="usuarioRules"
                class="mb-3"
              />

              <v-text-field
                v-model="credentials.senha"
                label="Senha"
                type="password"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-lock"
                :rules="senhaRules"
                class="mb-4"
              />

              <v-btn
                :disabled="!valid"
                :loading="loading"
                color="senai-red"
                size="large"
                block
                type="submit"
                elevation="2"
              >
                Autenticar
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const valid = ref(false)
const loading = ref(false)

const credentials = ref({
  usuario: '',
  senha: ''
})

const usuarioRules = [
  v => !!v || 'Usuário é obrigatório'
]

const senhaRules = [
  v => !!v || 'Senha é obrigatória'
]

const authenticate = () => {
  loading.value = true

  setTimeout(() => {
    if (credentials.value.usuario === 'professor' && credentials.value.senha === '123456') {
      sessionStorage.setItem('carometro_authenticated', 'true')
      router.push('/carometro')
    } else {
      alert('Credenciais inválidas. Use: professor/123456')
    }
    loading.value = false
  }, 1000)
}
</script>
