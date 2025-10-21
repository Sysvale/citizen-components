# CitizenTable

Componente de tabela para exibição de cidadãos com busca, paginação e campos personalizáveis.

## Uso Básico

```vue
<template>
	<CitizenTable
		v-model="selectedCitizens"
		@edit="handleEdit"
		@details="handleDetails"
	/>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CitizenTable, type Citizen } from 'citizen-components';

const selectedCitizens = ref<Citizen[]>([]);

function handleEdit() {
	console.log('Editar cidadão');
}

function handleDetails() {
	console.log('Ver detalhes do cidadão');
}
</script>
```

## Props

### `modelValue`

- **Tipo:** `Citizen[]`
- **Obrigatório:** Não
- **Padrão:** `[]`

Array de cidadãos selecionados (v-model).

```vue
<CitizenTable v-model="selectedCitizens" />
```

### Outras Props

O componente aceita todas as props do `CdsDataTable` através de `v-bind="$attrs"`, incluindo:

- `variant`: Variante de cor (padrão: `'green'`)
- Todas as props padrão do CdsDataTable

```vue
<CitizenTable variant="blue" />
```

## Events

### `edit`

Emitido quando o botão de editar é clicado.

```vue
<CitizenTable @edit="handleEdit" />
```

### `details`

Emitido quando o botão de detalhes é clicado.

```vue
<CitizenTable @details="handleDetails" />
```

## Slots

### `prepend-action`

Permite adicionar botões personalizados **antes** dos botões padrão (detalhes e editar) na coluna de ações.

**Props disponíveis no slot:**

- `data`: Objeto do cidadão
- `field`: Campo atual
- `rowIndex`: Índice da linha
- `colIndex`: Índice da coluna

```vue
<template>
	<CitizenTable>
		<template #prepend-action="{ data, rowIndex }">
			<CdsIconButton
				size="sm"
				icon="heart-outline"
				tooltip-text="Favoritar"
				@cds-click="handleFavorite(data, rowIndex)"
			/>
		</template>
	</CitizenTable>
</template>

<script setup lang="ts">
import { CitizenTable } from 'citizen-components';

function handleFavorite(citizen, index) {
	console.log('Favoritar cidadão:', citizen, 'na linha:', index);
}
</script>
```

### `append-action`

Permite adicionar botões personalizados **depois** dos botões padrão (detalhes e editar) na coluna de ações.

**Props disponíveis no slot:**

- `data`: Objeto do cidadão
- `field`: Campo atual
- `rowIndex`: Índice da linha
- `colIndex`: Índice da coluna

```vue
<template>
	<CitizenTable>
		<template #append-action="{ data, rowIndex }">
			<CdsIconButton
				size="sm"
				icon="trash-outline"
				tooltip-text="Deletar"
				@cds-click="handleDelete(data, rowIndex)"
			/>
		</template>
	</CitizenTable>
</template>

<script setup lang="ts">
import { CitizenTable } from 'citizen-components';

function handleDelete(citizen, index) {
	console.log('Deletar cidadão:', citizen, 'na linha:', index);
}
</script>
```

## Funcionalidades

### Busca

O componente possui um campo de busca integrado que filtra os cidadãos por `nome`, `cpf` e `cns`.

### Paginação

A paginação é automática e exibida quando há mais de uma página de resultados.

### Campos Personalizáveis

Os usuários podem selecionar quais campos desejam visualizar na tabela através de um menu de campos customizáveis.

**Campos disponíveis:**

- Nome (sempre visível)
- Data de nascimento
- Endereço
- Sexo
- RG
- Telefone
- Celular
- Raça
- Nome da mãe
- CPF do responsável
- Email

### Formatação Automática

O componente formata automaticamente:

- **CPF**: Máscara `XXX.XXX.XXX-XX`
- **CNS**: Máscara apropriada
- **Datas**: Formato `DD/MM/AAAA`
- **Booleanos**: "Sim" ou "Não"
- **Sexo**: "Masculino" ou "Feminino"
- **Raça**: Tradução para português
- **Campos vazios**: Exibidos como `--`

## Exemplos

### Escutando eventos

```vue
<template>
	<CitizenTable
		v-model="selectedCitizens"
		variant="blue"
		@edit="handleEdit"
		@details="handleDetails"
	/>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CitizenTable, type Citizen } from 'citizen-components';

const selectedCitizens = ref<Citizen[]>([]);

function handleEdit() {
	console.log('Editar cidadão');
	// Lógica de edição
}

function handleDetails() {
	console.log('Ver detalhes');
	// Lógica de visualização
}
</script>
```

### Com botões personalizados

```vue
<template>
	<CitizenTable
		v-model="selectedCitizens"
		@edit="handleEdit"
		@details="handleDetails"
	>
		<template #prepend-action="{ data }">
			<CdsIconButton
				size="sm"
				icon="heart-outline"
				tooltip-text="Favoritar"
				@cds-click="handleFavorite(data)"
			/>
		</template>

		<template #append-action="{ data }">
			<CdsIconButton
				size="sm"
				icon="download-outline"
				tooltip-text="Baixar prontuário"
				@cds-click="downloadRecord(data)"
			/>
			<CdsIconButton
				size="sm"
				icon="trash-outline"
				tooltip-text="Deletar"
				variant="danger"
				@cds-click="handleDelete(data)"
			/>
		</template>
	</CitizenTable>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CitizenTable, type Citizen } from 'citizen-components';

const selectedCitizens = ref<Citizen[]>([]);

function handleEdit() {
	console.log('Editar cidadão');
}

function handleDetails() {
	console.log('Ver detalhes');
}

function handleFavorite(citizen: Citizen) {
	console.log('Favoritar:', citizen.name);
}

function downloadRecord(citizen: Citizen) {
	console.log('Baixar prontuário de:', citizen.name);
}

function handleDelete(citizen: Citizen) {
	console.log('Deletar:', citizen.name);
}
</script>
```

**Ordem de exibição dos botões:**

```
[Favoritar] → [Ver detalhes] → [Editar] → [Baixar prontuário] → [Deletar]
 prepend         padrão         padrão          append              append
```

## Tipos

```typescript
import type { Citizen } from 'citizen-components';

// Citizen: interface completa do cidadão
```

## Comportamento da API

O componente realiza requisições automáticas para a API configurada, incluindo:

- **Paginação**: Atualiza os dados ao mudar de página
- **Busca**: Filtra os resultados ao digitar no campo de busca
- **Campos personalizados**: Solicita apenas os campos selecionados pelo usuário

Consulte a [documentação de configuração](../configuration.md) para detalhes sobre o formato esperado da API.
