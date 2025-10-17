# CitizenService

Serviço responsável por gerenciar requisições de dados de cidadãos, com suporte automático a API real ou dados mockados.

## Uso Básico

```typescript
import { CitizenService } from 'citizen-components';

const citizenService = new CitizenService();

// Buscar cidadãos com paginação
const response = await citizenService.index({
	page: 1,
	perPage: 10,
	searchString: 'João',
	fields: ['name', 'cpf', 'birth_date'],
});

console.log(response.data); // Array de cidadãos
console.log(response.meta); // Metadados de paginação
```

## Métodos

### `index(params: CitizenServiceParams): Promise<CitizenResponse>`

Busca uma lista de cidadãos com suporte a paginação, busca e seleção de campos.

**Parâmetros:**

```typescript
interface CitizenServiceParams {
	page: number; // Número da página (obrigatório)
	fields?: string[]; // Campos a serem retornados
	searchString?: string; // String de busca
	perPage?: number; // Itens por página
}
```

**Retorno:**

```typescript
interface CitizenResponse {
	data: Citizen[]; // Array de cidadãos
	meta: {
		current_page: number; // Página atual
		per_page: number; // Itens por página
		total: number; // Total de itens
		last_page: number; // Última página
	};
}
```

**Exemplo:**

```typescript
const response = await citizenService.index({
	page: 1,
	perPage: 15,
	searchString: 'Maria',
	fields: ['name', 'cpf', 'email', 'phone'],
});
```

## Comportamentos Automáticos

### Modo Mock vs API Real

O service detecta automaticamente o modo de operação: usa dados mockados por padrão ou realiza requisições reais quando `apiBaseUrl` e `endpoints.index` estão configurados.

**Modo Mock (Padrão):**

- Ativado quando não há `apiBaseUrl` configurado
- Gera 150 cidadãos fictícios automaticamente
- Simula delay de 1 segundo para requisições

<br>

**Modo API Real:**

- Ativado quando `apiBaseUrl` e `endpoints.index` estão configurados
- Faz requisições HTTP reais usando Axios
- Consulte a [documentação de configuração](../configuration.md)

```typescript
// Configuração para API real
app.use(CitizenComponentsPlugin, {
	apiBaseUrl: 'https://api.example.com',
	endpoints: {
		index: '/citizens',
	},
});
```

### Busca

A busca (via `searchString`) funciona nos seguintes campos:

1. **Nome**: Busca case-insensitive no nome completo
2. **CPF**: Remove máscaras automaticamente para busca precisa
3. **CNS**: Remove máscaras automaticamente para busca precisa

**Exemplos de busca:**

```typescript
// Busca por nome
await citizenService.index({
	page: 1,
	searchString: 'joão', // Encontra "João Silva", "Maria João", etc.
});

// Busca por CPF (com ou sem máscara)
await citizenService.index({
	page: 1,
	searchString: '123.456.789-00', // Funciona
});

await citizenService.index({
	page: 1,
	searchString: '12345678900', // Também funciona
});
```

### Filtragem de Campos

Quando `fields` é especificado, apenas os campos solicitados são retornados, **mais** os campos essenciais:

**Campos sempre retornados:**

- `name`
- `cpf`
- `cns`

**Exemplo:**

```typescript
const response = await citizenService.index({
	page: 1,
	fields: ['email', 'phone'],
});

// Retorna: name, cpf, cns, email, phone
// (name, cpf e cns são incluídos automaticamente)
```

### Paginação

A paginação é calculada automaticamente no modo mock e segue o padrão Laravel no modo API:

```typescript
const response = await citizenService.index({
	page: 2,
	perPage: 20,
});

console.log(response.meta);
// {
//   current_page: 2,
//   per_page: 20,
//   total: 150,
//   last_page: 8
// }
```

## Tratamento de Erros

O serviço possui tratamento de erros integrado:

```typescript
try {
	const response = await citizenService.index({
		page: 1,
		perPage: 10,
	});
	console.log(response.data);
} catch (error) {
	console.error('Erro ao buscar cidadãos:', error);
	// Error: Error fetching citizens: [mensagem de erro detalhada]
}
```

**Tipos de erro:**

- Erros de rede (timeout, conexão recusada, etc.)
- Erros de resposta da API (4xx, 5xx)
- Erros de validação

## Integração com Componentes

O `CitizenService` é usado internamente pelos componentes:

- **CitizenSelect**: Usa o serviço para buscar e filtrar cidadãos
- **CitizenTable**: Usa o serviço para paginação, busca e carregamento de dados

Você não precisa instanciar o serviço manualmente quando usa os componentes, mas pode usá-lo diretamente quando precisar de acesso programático aos dados.

## Tipos TypeScript

```typescript
import type {
	CitizenService,
	CitizenServiceParams,
	CitizenResponse,
	Citizen,
} from 'citizen-components';
```

Para mais detalhes sobre a configuração da API, consulte a [documentação de configuração](../configuration.md).
