# Configuração

O pacote `citizen-components` pode ser configurado para usar APIs reais ao invés de dados mockados.

## Instalação do Plugin

Configure o plugin no `main.ts` do seu projeto Vue:

```typescript
import { createApp } from 'vue';
import App from './App.vue';
import CitizenComponentsPlugin from 'citizen-components';
import 'citizen-components/style.css';

const app = createApp(App);

app.use(CitizenComponentsPlugin, {
  apiBaseUrl: 'https://api.example.com',
  endpoints: {
    searchCitizens: '/citizens/search',
  },
});

app.mount('#app');
```

## Opções de Configuração

### `apiBaseUrl`

- **Tipo:** `string`
- **Obrigatório:** Não
- **Padrão:** `''` (usa mock)

URL base da sua API. Se não fornecido, o componente usará dados mockados.

```typescript
app.use(CitizenComponentsPlugin, {
  apiBaseUrl: 'https://api.meuapp.com',
});
```

### `endpoints`

- **Tipo:** `object`
- **Obrigatório:** Não

Objeto com os endpoints customizados:

```typescript
app.use(CitizenComponentsPlugin, {
  apiBaseUrl: 'https://api.meuapp.com',
  endpoints: {
    searchCitizens: '/api/v1/citizens/search', // padrão: '/citizens/search'
  },
});
```


## Formato da API

O endpoint de busca deve aceitar um query parameter `q` e retornar um array de cidadãos:

**Request:**
```
GET /citizens/search?q=João
```

**Response:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "João da Silva",
    "cpf": "12345678900",
    "cns": "123456789012345",
    "gender": "M",
    "cpf_responsible": null,
    "mother_name": "Maria da Silva",
    "birth_date": "1990-01-15",
    "phone": "11 1234-5678",
    "cellphone": "11 98765-4321",
    "email": "joao@example.com",
    "address": {
      "cep": "01234-567",
      "street": "Rua Exemplo",
      "number": "123",
      "complement": "Apto 45",
      "neighborhood": "Centro",
      "city": "São Paulo",
      "uf": "SP"
    },
    "race": "white",
    "co_cidadao": 1234,
    "is_dead": false,
    "pregnant": false,
    "identification_document": "MG1234567",
    "issuing_agency": "SSP"
  }
]
```

## Modo de Desenvolvimento

Se você não configurar `apiBaseUrl`, o componente automaticamente usará dados mockados. Isso é útil para desenvolvimento e testes:

```typescript
// Sem configuração = modo mock
const app = createApp(App);
app.mount('#app');
```
