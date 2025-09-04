<template>
  <v-app-bar app color="senai-red" dark elevation="4" density="comfortable">
    <!-- Logo Section -->
    <template v-slot:prepend>
      <v-img
        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTIwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRTUzRTNFIi8+Cjx0ZXh0IHg9IjYwIiB5PSIyNiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNFTkFJPC90ZXh0Pgo8L3N2Zz4="
        alt="SENAI"
        max-height="36"
        max-width="120"
        class="mr-4"
      />
    </template>

    <v-divider vertical class="mx-2 opacity-30" />

    <!-- Date Section -->
    <v-icon size="small" class="mr-2">mdi-calendar</v-icon>
    <span class="text-body-2 font-weight-medium text-capitalize">{{ formattedDate }}</span>

    <v-spacer />

    <!-- Desktop Menu Items -->
    <template v-slot:append>
      <div class="d-none d-lg-flex">
        <v-btn
          v-for="item in menuItems"
          :key="item.text"
          :href="item.link"
          target="_blank"
          variant="text"
          size="small"
          class="text-caption opacity-90"
        >
          <v-icon size="small" class="mr-1">{{ item.icon }}</v-icon>
          {{ item.text }}
        </v-btn>
      </div>

      <!-- Mobile Menu -->
      <v-menu class="d-flex d-lg-none">
        <template v-slot:activator="{ props }">
          <v-btn
            icon="mdi-dots-vertical"
            v-bind="props"
            variant="text"
          />
        </template>
        <v-list>
          <v-list-item
            v-for="item in menuItems"
            :key="item.text"
            :href="item.link"
            target="_blank"
          >
            <template v-slot:prepend>
              <v-icon>{{ item.icon }}</v-icon>
            </template>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
</template>

<script setup>
import { computed } from 'vue'

const formattedDate = computed(() => {
  const date = new Date()
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const menuItems = [
  { text: 'INTRANET', icon: 'mdi-web', link: 'http://intranet568.sp.senai.br/' },
  { text: 'PORTAL EDU', icon: 'mdi-school', link: 'https://pess.sesisenaispedu.org.br/' },
  { text: 'RH SAP', icon: 'mdi-account-group', link: 'https://portalrh.sesisenaisp.org.br/arte/' },
  { text: 'GED', icon: 'mdi-file-document', link: 'https://sesisenaisp.sharepoint.com/sites/NovaGED' },
  { text: 'OUTLOOK', icon: 'mdi-email', link: 'https://mail.sesisenaisp.org.br/' },
  { text: 'SGSET', icon: 'mdi-cog', link: 'https://sgset.sp.senai.br/' },
  { text: 'EMPREGRA+', icon: 'mdi-briefcase', link: 'https://www.senaipr.org.br/' }
]
</script>
