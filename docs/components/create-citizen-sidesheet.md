# CreateCitizenSidesheet

Componente de _SideSheet_ (painel lateral) para o **cadastro de um novo usuário SUS (cidadão)**. Exibe um formulário com campos essenciais e utiliza validação antes de enviar os dados para a API.

## Uso Básico

O componente é controlado por um `v-model` booleano para exibir ou ocultar o painel.

```vue
<template>
	<CdsButton @click="showSidesheet = true">Cadastrar Novo Cidadão</CdsButton>

	<CreateCitizenSidesheet
		v-model="showSidesheet"
		@success="handleSuccess"
		@error="handleError"
	/>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CreateCitizenSidesheet, type Citizen } from 'citizen-components';

const showSidesheet = ref(false);

function handleSuccess(newCitizen: Citizen) {
	console.log('Cidadão criado com sucesso:', newCitizen.name);
}

function handleError(errorMessage: string) {
	console.error('Erro ao criar cidadão:', errorMessage);
}
</script>
```

## Props

O componente aceita props para controlar o estado, customizar o texto e a aparência do `CdsSideSheet`.

### `modelValue`

- **Tipo:** `boolean`
- **Obrigatório:** Sim
- **Padrão:** `false`

Controla a visibilidade do SideSheet.

```vue
<CreateCitizenSidesheet v-model="showSidesheet" />
```

### `okButtonText`

- **Tipo:** `string`
- **Obrigatório:** Não
- **Padrão:** `'Criar'`

Texto do botão de ação principal (OK), que inicia o cadastro.

### `cancelButtonText`

- **Tipo:** `string`
- **Obrigatório:** Não
- **Padrão:** `'Cancelar'`

Texto do botão de cancelar.

### `actionButtonVariant`

- **Tipo:** `string`
- **Obrigatório:** Não
- **Padrão:** `'green'`

Variante de cor do botão de ação principal (ex: `'blue'`, `'green'`).

### `size`

- **Tipo:** `string`
- **Obrigatório:** Não
- **Padrão:** `'md'`

Tamanho do SideSheet (os mesmos utilizados como tokens no Cuida).

```vue
<CreateCitizenSidesheet
	v-model="showSidesheet"
	ok-button-text="Salvar Cidadão"
	action-button-variant="blue"
	size="lg"
/>
```

## Events

O componente emite eventos ao completar (sucesso) ou falhar (erro) a tentativa de cadastro.

### `success`

Emitido quando o cidadão é criado com sucesso.

- **Payload:** `citizen: Citizen` (o objeto do cidadão recém-criado).

```vue
<CreateCitizenSidesheet
	@success="newCitizen => console.log('Cidadão criado!', newCitizen)"
/>
```

### `error`

Emitido quando ocorre um erro na requisição à API.

- **Payload:** `errorMessage: string` (mensagem de erro).

```vue
<CreateCitizenSidesheet @error="error => console.error('Falha no cadastro:', error)" />
```

## Funcionalidades

### Formulário e Validação

O componente exibe um formulário de cadastro estruturado que inclui os campos essenciais para o registro de um usuário SUS. Todos os campos são **obrigatórios** e possuem validação em tempo real.

### Campos e regras

- **Nome**: Mínimo de 5 caracteres.
- **CNS**: Validação de formato CNS válido.
- **CPF**: Validação de CPF válido.
- **Data de nascimento**: Não pode ser uma data futura.
- **Sexo**: Seleção obrigatória (Masculino / Feminino).

### Mascaramento de Entrada

O componente utiliza mascaramento para garantir o formato correto de documentos:

- **CNS**: Máscara `### #### #### ####`
- **CPF**: Máscara `###.###.###-##`

### Fluxo de Criação

O fluxo de dados do formulário é gerenciado automaticamente.

## Comportamento da API

Consulte a [documentação de configuração](../configuration.md) para detalhes sobre o formato esperado da API.
