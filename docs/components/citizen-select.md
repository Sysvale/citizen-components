# CitizenSelect

Componente de busca e seleção de cidadãos com autocompletar.

## Uso Básico

```vue
<template>
	<CitizenSelect
		v-model="selectedCitizen"
		show-button
	/>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CitizenSelect, type Citizen } from 'citizen-components';

const selectedCitizen = ref<Citizen | null>(null);
</script>
```

## Props

### `modelValue`

- **Tipo:** `CitizenModelType` (`Citizen | Partial<Citizen> | string | null`)
- **Obrigatório:** Não
- **Padrão:** `null`

Valor selecionado (v-model).

```vue
<CitizenSelect v-model="citizen" />
```

### `showButton`

- **Tipo:** `boolean`
- **Obrigatório:** Sim

Define se o botão de busca deve ser exibido.

```vue
<CitizenSelect show-button />
```

### `fluid`

- **Tipo:** `boolean`
- **Obrigatório:** Não
- **Padrão:** `false`

Se `true`, o componente ocupa 100% da largura do container pai.

```vue
<CitizenSelect show-button fluid />
```

### `variant`

- **Tipo:** `string`
- **Obrigatório:** Não
- **Padrão:** `'green'`

Variante de cor do botão de busca.

```vue
<CitizenSelect show-button variant="blue" />
```

### `optionsField`

- **Tipo:** `keyof Citizen`
- **Obrigatório:** Não
- **Padrão:** `'name'`

Campo do objeto Citizen usado para exibição no input.

```vue
<CitizenSelect show-button options-field="cpf" />
```

## Exemplos

### Sem botão de busca

```vue
<CitizenSelect :show-button="false" />
```

### Com largura fluida

```vue
<div style="width: 500px;">
  <CitizenSelect show-button fluid />
</div>
```

### Escutando mudanças

```vue
<template>
	<CitizenSelect
		v-model="citizen"
		show-button
		@update:model-value="onCitizenChange"
	/>

	<p v-if="citizen">Cidadão selecionado: {{ citizen.name }}</p>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CitizenSelect, type Citizen } from 'citizen-components';

const citizen = ref<Citizen | null>(null);

function onCitizenChange(value: Citizen | null) {
	console.log('Cidadão alterado:', value);
}
</script>
```

## Tipos

```typescript
import type { Citizen, CitizenModelType } from 'citizen-components';

// Citizen: interface completa do cidadão
// CitizenModelType: Citizen | Partial<Citizen> | string | null
```
