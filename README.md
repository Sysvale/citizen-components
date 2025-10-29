# @sysvale/citizen-components

Biblioteca de componentes Vue 3 para busca e seleção de cidadãos, construída com TypeScript e Vite.

## Descrição

Este pacote fornece componentes reutilizáveis para integração com APIs de cidadãos, incluindo:

- **CitizenSelect**: Componente de busca e seleção de cidadãos com dropdown
- **CitizenService**: Serviço para buscar dados de cidadãos via API ou mock
- Suporte a fallback para dados mockados quando a API não está configurada
- TypeScript com tipos exportados

## Instalação

```bash
npm install @sysvale/citizen-components
```

### Peer Dependencies

```bash
npm install vue@^3.5.13 @sysvale/cuida@^3.147.0
```

## Configuração do Projeto

### Instalação das dependências

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

### Build

O build gera:

- Módulos ES e CommonJS em `dist/`
- Tipos TypeScript (`.d.ts`)
- CSS compilado

## Testes

O projeto utiliza [Vitest](https://vitest.dev/) para testes unitários.

### Executar testes

```bash
npm test
```

## Documentação

A documentação é construída com [VitePress](https://vitepress.dev/).

### Desenvolvimento da documentação

```bash
npm run docs:dev
```

Acesse em: http://localhost:5173

## Linting e Formatação

### Verificar lint

```bash
npm run lint
```

### Verificar formatação

```bash
npm run prettier:check
```

### Formatar código

```bash
npm run format
```

## Type Checking

```bash
npm run type-check
```

## Releases

O citizen-components utiliza [semantic-release](https://github.com/semantic-release/semantic-release) para versionamento e publicação automatizados.

### Como funciona

Ao mejar um PR na branch `main`, o CI automaticamente:
- Analisa os commits usando [Conventional Commits](https://www.conventionalcommits.org/)
- Calcula a próxima versão (patch, minor ou major)
- Atualiza `package.json` e `package-lock.json`
- Cria uma release no GitHub com notas geradas automaticamente
- Publica o pacote no NPM

### Conventional Commits

Use os seguintes prefixos nos commits:

- `feat:` - Nova funcionalidade (incrementa versão **minor**)
- `fix:` - Correção de bug (incrementa versão **patch**)
- `feat!:` ou `BREAKING CHANGE:` - Mudança que quebra compatibilidade (incrementa versão **major**)
- `docs:`, `chore:`, `style:`, `test:` - Não geram release
