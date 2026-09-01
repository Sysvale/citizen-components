# PROJECT KNOWLEDGE BASE

**Generated:** 2026-09-01
**Package:** `@sysvale/citizen-components`

## OVERVIEW

Biblioteca de componentes **Vue 3** (TypeScript + Vite) para busca, listagem e exibição de cidadãos. Componentes puros — só rodam de verdade dentro de uma aplicação Vue consumidora (ex.: frontend `regulation-vue-3` do projeto `server`). Integra com o design system `@sysvale/cuida` e `@sysvale/foundry`.

## STRUCTURE

```
./
├── src/
│   ├── components/               # Componentes públicos exportados (CitizenSelect, CitizenTable, *Sidesheet, *Summary*)
│   │   └── InternalComponents/   # Componentes internos, não exportados (CitizenForm, SummarySection, SelectDropdown,...)
│   ├── services/
│   │   ├── citizen/              # Citizen service + tipos + fixture/mock de dados (CPF/CNS reais de teste)
│   │   └── localities/           # Serviço de localidades (bairros/ruas)
│   ├── constants/                # Config do form (citizenFormFields) + dropdowns (genders, races, ufs,...)
│   ├── models/                   # Modelos de domínio (Citizen, Address)
│   ├── utils/
│   │   └── rules/                # Regras vee-validate (requiredWithout, maxDate, citizenFormRules)
│   ├── config.ts                 # Config global do plugin (apiBaseUrl + endpoints), setConfig/getConfig
│   ├── plugin.ts                 # Instala regras de form + provider do Cuida
│   ├── index.ts                  # Ponto de entrada: exporta componentes + tipos + plugin
│   └── types.ts                  # Tipos públicos: Citizen, Nullable, CitizenSelectModelType, Address, CitizenFormField,...
├── docs/                         # VitePress
├── scripts/                      # generate-index-types.js, format-vue-structure.js
├── dist/                         # Build gerado (não commitar)
└── .github/workflows/            # test, build-docs, deploy, publish, prettier (CI)
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Export público / novas props | `src/index.ts`, `src/types.ts` | Só o que está em `index.ts` vira API pública |
| Form de criar/editar cidadão | `src/constants/citizenFormFields.ts` + `src/components/InternalComponents/CitizenForm.vue` | Grid via `colSpan` (ex.: nome = 12, CPF = 12, CNS = 6) |
| Regras de validação | `src/utils/rules/` | vee-validate, mensagens pt-BR |
| Dados de cidadão p/ teste | `src/services/citizen/citizen.fixture.ts` / `citizen.mock.ts` | Usar valores reais (CPF/CNS) |
| Serviço de busca cidadão | `src/services/citizen/citizen.service.ts` | Busca via API ou mock fallback |
| Configuração do package | `src/config.ts` | `apiBaseUrl` + `endpoints` (index/create/update/neighborhoods/streets) |
| Documentação de componentes | `docs/components/*.md` + `docs/services/*.md` | VitePress, precisa adicionar no sidebar em `docs/.vitepress/config.ts` |

## CONVENTIONS

- **Tabs** (`indent_style=tab`, `indent_size=4`), `singleQuote`, `semi`, `arrowParens: avoid`, `printWidth: 92`, `.editorconfig` + `.prettierrc.json` definem tudo.
- **Testes unitários colocalizados**: `Arquivo.test.ts` ao lado do fonte (ex.: `CitizenForm.test.ts`), com snapshots em `__snapshots__/`.
- **Alias `@`** → `src` (usar em imports internos, ex.: `@/types`).
- **Constantes de opções de dropdown** (genders, races, ufs) expostas como função () em vez de objeto cru; UPPER_SNAKE para estruturas.
- **Tipos**: interfaces públicas em `types.ts` / `citizen.types.ts`; `Nullable<T>` = `T | null`; campos do `Citizen` usam snake_case (espelham a API).
- **Form**: cada campo em `citizenFormFields.ts` declara `name`, `label`, `rules`, `colSpan`, `component`, `mask`, etc. `required_without` para dependência entre campos.
- **Componentes** montados com `defineProps`/`defineEmits` (Composition API, `<script setup>`).
- **Conventional Commits**: `feat:`/`fix:`/`feat!:` disparam release via semantic-release; `docs:`/`chore:`/`style:`/`test:` não geram release (ver `README.md`).

## ANTI-PATTERNS (ESTE PROJETO)

- **Não commitar `dist/`** (está no `.gitignore`; é gerado).
- **Não commitar artefatos de teste E2E**: `.playwright-mcp/`, `validate-state.yml`, docs de trabalho (`docs/*.md` de sessão como `cep-citizen-components.md`) — manter fora (untracked).
- **Não editar direto o `node_modules`/`.yalc` do consumer** — o consumer só tem build, sem fonte. O trabalho real é sempre no repo upstream (`src/...`).
- **Não usar Keycloak**: o login do projeto `server` é **local**.
- **LSP TypeScript não instalado** neste projeto — usar `vue-tsc` (`npm run type-check`) e `vitest` via CLI para validar.

## COMMANDS

```bash
npm test                 # testes unitários (Vitest), jsdom
npm run build            # build-only (vite) + build-types (tsc) → dist/
npm run type-check       # vue-tsc --build
npm run lint             # eslint
npm run format           # prettier --write (format:vue p/ estrutura SFC)
npm run dev              # dev playground
npm run docs:dev         # VitePress
```

## NOTES

- **Testes são a fonte de verdade p/ lógica pura** (modelos, serviços, regras): rodar `npm test` antes de testar no browser.
- **`npm run build`** gera ES + CJS + `.d.ts` + CSS; validar que `dist/` contém a mudança antes de levar pro consumer.
- **Yalc**: pacote linkado no consumer via `yalc` (`.yalc/@sysvale/citizen-components`); após build no pacote, `yalc push` p/ atualizar a instância.
- **Provider `useToast`**: injetado via `app.provide` no plugin, não importar direto da lib.
- **Mesclagem de tipos**: `types.ts` re-exporta de `services/citizen/citizen.types` — manter fonte única do tipo `Citizen`.

### Testes automatizados (unitário + E2E)

- **Unitários (Vitest)**: cobrem lógica pura — modelos, serviços, regras de form. Colocados como `*.test.ts` ao lado do fonte; snapshots em `__snapshots__/`. Rodar com `npm test`.
- **E2E via Playwright (runtime)**: como a lib roda **dentro de uma aplicação consumidora** (ex.: frontend `regulation-vue-3` do `server`), a validação de ponta a ponta no browser usa Playwright contra a instância real do pacote. Configure o fluxo completo — Fases A→E: alterar fonte → build → levar dist p/ consumer → subir server → validar com Playwright → restaurar o consumer — conforme o guia padronizado em **`docs/e2e-testes-playwright.md`**. Siga esse doc ao fazer qualquer mudança que precise de validação visual/runtime.
