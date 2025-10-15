---
layout: home

hero:
    name: 'Citizen Components'
    tagline: Componentes Vue para uso como o citizens
    actions:
        - theme: brand
          text: Começar
          link: /configuration
        - theme: alt
          text: Ver no GitHub
          link: https://github.com/Sysvale/citizen-components

features:
    - title: 🔍 Busca Inteligente
      details: Componente com autocompletar e busca em tempo real de cidadãos
    - title: ⚙️ Configurável
      details: Configure endpoints de API ou use dados mockados para desenvolvimento
    - title: 📘 TypeScript
      details: Totalmente tipado com suporte completo ao TypeScript
    - title: 🎨 Design System
      details: Integrado com o Cuida Design System da Sysvale
---

## Instalação

```bash
npm install citizen-components
```

## Quick Start

```typescript
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import CitizenComponentsPlugin from 'citizen-components';
import 'citizen-components/style.css';

const app = createApp(App);

app.use(CitizenComponentsPlugin, {
	apiBaseUrl: 'https://api.example.com',
});

app.mount('#app');
```

```vue
<!-- App.vue -->
<template>
	<CitizenSelect
		v-model="citizen"
		show-button
		fluid
	/>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CitizenSelect, type Citizen } from 'citizen-components';

const citizen = ref<Citizen | null>(null);
</script>
```
