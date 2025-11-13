# CreateCitizenSidesheet

Componente de _SideSheet_ (painel lateral) para o **cadastro de um novo usuário SUS (cidadão)**. Exibe um formulário com campos essenciais e utiliza validação antes de enviar os dados para a API.

## Uso Básico

O componente é controlado por um `v-model` booleano para exibir ou ocultar o painel.

```vue
<template>
	<CdsButton @click="showSidesheet = true">Cadastrar Novo Cidadão</CdsButton>

	<CreateCitizenSidesheet
		v-model="showSidesheet"
		@success="handleCreatedCitizen"
	/>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CreateCitizenSidesheet, type Citizen } from 'citizen-components';

const showSidesheet = ref(false);

function handleCreatedCitizen(newCitizen: Citizen) {
	console.log('Cidadão criado com sucesso:', newCitizen.name);
}
</script>
```

## Props

O componente aceita todas as props do `CdsSideSheet` através de `v-bind="$attrs"`, incluindo:

- `action-button-variant`: Variante de cor (padrão: `'green'`)
- `size`: Tamanho do sidesheet (padrão: `'md'`)
- Todas as props padrão do CdsSideSheet

```vue
<CreateCitizenSidesheet action-button-variant="blue" size="sm" />
```

## Events

O componente emite eventos ao completar com sucesso o cadastro do usuário.

### `success`

Emitido quando o cidadão é criado com sucesso.

- **Payload:** `citizen: Citizen` (o objeto do cidadão recém-criado).

```vue
<CreateCitizenSidesheet
	@success="newCitizen => console.log('Cidadão criado!', newCitizen)"
/>
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

### Máscara de Entrada

O componente utiliza mascaramento para garantir o formato correto de documentos:

- **CNS**: Máscara `### #### #### ####`
- **CPF**: Máscara `###.###.###-##`

### Fluxo de Criação

O fluxo de dados do formulário é gerenciado automaticamente.

## Comportamento da API

Consulte a [documentação de configuração](../configuration.md) para detalhes sobre o formato esperado da API.
