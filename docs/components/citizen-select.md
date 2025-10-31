# CitizenSelect

Componente de busca e seleção de cidadãos.

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

- **Tipo:** `CitizenSelectModelType` (`Citizen | Partial<Citizen> | string | null`)
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

### `invalid`

- **Tipo:** `Boolean`
- **Obrigatório:** Não
- **Padrão:** `false`

Prop que indica se o estado do input é inválido. Útil para validações.

```vue
<CitizenSelect show-button :invalid="true" />
```

### `errorMessage`

- **Tipo:** `String`
- **Obrigatório:** Não
- **Padrão:** `'Falha na validação'`

Prop utilizada para apresentar a mensagem de erro quando a prop `invalid` é `true`.

```vue
<CitizenSelect show-button :invalid="true" error-message="O campo deve ser preenchido" />
```

### `label`

- **Tipo:** `String`
- **Obrigatório:** Não
- **Padrão:** `'Buscar cidadão'`

Prop utilizada para alterar o texto da label do input.

```vue
<CitizenSelect show-button label="Procurar cidadão"/>
```

### `required`

- **Tipo:** `Boolean`
- **Obrigatório:** Não
- **Padrão:** `false`

Prop utilizada para indicar se o preenchimento do input é obrigatório ou não.

```vue
<CitizenSelect show-button label="Procurar cidadão"/>
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
import type { Citizen, CitizenSelectModelType } from 'citizen-components';

// Citizen: interface completa do cidadão
// CitizenSelectModelType: Citizen | Partial<Citizen> | string | null
```
