# Fluxo de Testes E2E via Playwright — `@sysvale/citizen-components`

> Guia padronizado para validar mudanças no pacote `citizen-components` de ponta a ponta
> (E2E) usando **Playwright contra a instância real do pacote dentro de uma aplicação consumidora**.
>
> Hoje ele é específico do projeto `server` (frontend `regulation-vue-3`), mas foi desenhado
> para evoluir para um processo **genérico** reutilizável em qualquer aplicação que consuma o
> `citizen-components`.

---

## 1. Por que testar via Playwright contra a aplicação consumidora?

`citizen-components` é uma **biblioteca de componentes Vue**. Ela não roda sozinha — os
componentes (`CitizenSelect`, `CreateCitizenSidesheet`, `EditCitizenSidesheet`,
`CitizenSummaryViewer`, ...) só exercem comportamento real quando montados dentro de uma
aplicação Vue de verdade.

Os testes unitários (Vitest) cobrem a lógica pura (modelos, serviços, regras de form). Mas
várias coisas **só aparecem em runtime**:

- Layout real do grid do formulário (colunas/`colSpan`);
- Máscaras e formatação aplicadas na interface (ex.: CEP `#####-###`);
- Fluxo de busca/seleção de cidadão acoplado ao backend + autenticação local do server;
- Interação real com os componentes do Cuida DS dentro do form;
- Sidesheets (criar/editar/detalhar) abrindo e renderizando corretamente.

O teste E2E via Playwright **abre o navegador**, navega na aplicação real e valida o
comportamento de ponta a ponta, incluindo a apresentação visual.

> **Princípio central:** a mudança é feita no **código-fonte TS do pacote**, mas validada na
> **instância do pacote dentro do consumer**. Sempre há um passo de "levar o build para a
> instância consumidora" e outro de "restaurar" após o teste.

---

## 2. Arquitetura do fluxo

```
 ┌──────────────────────────────────────────────────────────────────┐
 │  1. CÓDIGO-FONTE (repo citizen-components)                       │
 │     src/models/Address.ts, citizenFormFields.ts, ...             │
 └───────────────────────────────┬──────────────────────────────────┘
                                 │ 2. npm run build  →  gera dist/
                                 ▼
 ┌──────────────────────────────────────────────────────────────────┐
 │  3. INSTÂNCIA NO CONSUMER (projeto server)                       │
 │     resources/assets/js-vue/aplications/regulation-vue-3/        │
 │     node_modules/@sysvale/citizen-components/ ← dist/ local      │
 └───────────────────────────────┬──────────────────────────────────┘
                                 │ 4. npm run build (consumer)  →  bundle JS
                                 ▼
 ┌──────────────────────────────────────────────────────────────────┐
 │  5. SERVER LOCAL RODANDO (http://localhost)                      │
 │     app/regulation/accompaniment ...                             │
 └───────────────────────────────┬──────────────────────────────────┘
                                 │
                                 ▼
 ┌──────────────────────────────────────────────────────────────────┐
 │  6. PLAYWRIGHT (MCP → browser)                                   │
 │     login local → busca cidadão → valida UI → evidências         │
 └───────────────────────────────┬──────────────────────────────────┘
                                 │
                                 ▼
 ┌──────────────────────────────────────────────────────────────────┐
 │  7. RESTAURAÇÃO (voltar consumer ao estado original)             │
 └──────────────────────────────────────────────────────────────────┘
```

---

## 3. Pré-requisitos

| Requisito | Observação |
|-----------|-----------|
| Projeto `server` clonado/local (`~/dev/server`) | É o host da aplicação consumidora |
| Rotina do server rodando | Backend + Mongo + dados de cidadão em `http://localhost` |
| `node_modules` do consumer acessível | Em alguns ambientes é root-owned (`sudo` pede senha); usar `mv`/rename como workaround (ver seção 6) |
| Acesso fácil ao Playwright (MCP) | Conecta ao browser via `skill_mcp` / ferramenta Playwright |
| Conhecimento dos dados de teste | CPF/CNS de um cidadão real do ambiente para buscar/validar |

---

## 4. Passo a passo padrão (checklist)

### Fase A — Alterar o código-fonte do pacote

> Assumimos que a mudança já está sendo desenvolvida na **branch de trabalho** do repo
> `citizen-components` (nunca na `main`) — a criação do branch é parte do fluxo de
> desenvolvimento da mudança, **não** do fluxo de teste E2E.

1. Fazer as mudanças no **código-fonte TypeScript** (`src/...`). O `.yalc`/`node_modules` do
   consumer só tem **build**, sem fonte — o trabalho real é sempre no repo upstream.
2. Rodar os **testes unitários** (garantir verde antes de ir pro browser):
   ```bash
   npm test
   ```
3. Gerar o build novo do pacote:
   ```bash
   npm run build
   ```
   > Confirmar que o `dist/` contém a mudança (ex.: `grep -c 'label:"CEP"' dist/...`).

### Fase B — Levar o build para a instância no consumer (server)

> Caminho do consumer: `resources/assets/js-vue/aplications/regulation-vue-3/`

1. (Recomendado) **Backup** do `node_modules` atual do pacote no consumer, para poder
   restaurar depois:
   ```bash
   # exemplo: renomear (não copiar, mantém permissões)
   mv node_modules/@sysvale/citizen-components node_modules/citizen-components.root-bak
   ```
2. **Copiar o `dist/` novo do repo para o `node_modules` do consumer** (via diretório real ou
   symlink para `.yalc`):
   ```bash
   cp -r <repo>/dist node_modules/@sysvale/citizen-components/dist
   # ou, se usando yalc:
   yalc push   # do repo do pacote
   ```
3. **Rebuildar o consumer** para gerar o bundle final com as mudanças:
   ```bash
   cd resources/assets/js-vue/aplications/regulation-vue-3
   npm run build
   ```
   > O bundle sai em `public/regulation-vue-3/regulation-vue-3.js`.
4. **Confirmar** que o bundle final contém a mudança (ex.):
   ```bash
   grep -c 'formatCep\|label:"CEP"' public/regulation-vue-3/regulation-vue-3.js
   ```

### Fase C — Subir/garantir o server rodando

1. Certificar que o server está no ar em `http://localhost` (app `/app/regulation/...`).
2. Garantir que a sessão de login **local** do server está válida — se não, refazer o login no browser.

### Fase D — Validar com Playwright (E2E no browser)

1. Abrir o browser via Playwright e navegar até a área de uso do componente:
   - Ex.: `/app/regulation/accompaniment` (Acompanhamento → Nova marcação).
2. **Login** (se necessário) — o fluxo usa a autenticação **local** do server (usuário
   autenticado no próprio app, sem Keycloak). Antes de solicitar credenciais ao usuário,
   verificar se existe um arquivo de credenciais de teste (ex.: `.playwright-mcp/.env` ou
   arquivo de credenciais versionado fora do repositório) e usar as credenciais de lá; somente
   se esse arquivo **não existir**, perguntar ao usuário as credenciais de teste para login.
3. Percorrer o fluxo real de acordo com a mudança (ex.: buscar cidadão, selecionar, validar
   dados exibidos, abrir sidesheet de edição, conferir layout).
4. **Coletar evidências** — snapshots de página do Playwright (ficam em `.playwright-mcp/`
   e/ou `validate-state.yml` no repo) para registrar o estado validado.
5. Pedir **confirmação visual** ao usuário (ex.: "ficou bem bom") antes de considerar validado.

### Fase E — Restauração do consumer (server) após a validação

> **IMPORTANTE:** o teste usa a instância "suja" (com o build novo). Após validar, restaurar o
> consumer para não deixar mudanças residuais no server.

1. Restaurar o `node_modules` original do pacote no consumer:
   ```bash
   # remover o que foi sobrescrito/symlink
   rm -rf node_modules/@sysvale/citizen-components
   # restaurar o backup (mantém owner original)
   mv node_modules/citizen-components.root-bak node_modules/@sysvale/citizen-components
   ```
2. Remover pasta `.yalc` órfã, se tiver sido criada.
3. **Rebuildar o consumer** para reverter o bundle:
   ```bash
   cd resources/assets/js-vue/aplications/regulation-vue-3
   npm run build
   ```
4. **Verificar a reversão** no bundle (evidências da ausência da mudança):
   ```bash
   grep -c 'formatCep\|label:"CEP"' public/regulation-vue-3/regulation-vue-3.js   # → 0
   ```
5. Confirmar que não restaram mudanças versionadas no server (apenas as pré-existentes).

---

## 5. Boas práticas e armadilhas conhecidas

- **Nunca commitar artefatos de teste** (`.playwright-mcp/`, `validate-state.yml`, `.omo/`,
  docs de trabalho) no mesmo commit da mudança do pacote — mantê-los fora (untracked).
- **`node_modules` root-owned no server** pode exigir `sudo`; como workaround, usar `mv`
  (rename) em vez de copiar, pois preserva o owner e não pede senha.
- **Mismatch de versão:** o consumer pode esperar `^x.y.z` diferente da versão do repo local.
  Verificar se o test via instância está sobrescrevendo uma versão mais nova que a local, para
  não gerar "downgrade aparente" ao restaurar.
- **Evidências antes de declarar validade:** sempre confirmar no bundle/browser que a mudança
  de fato apareceu (grep no bundle + screenshot/snapshot no browser).
- **Restauração completa:** bundle `public/` volta ao estado original após rebuild; confirmar
  por grep e `git status` do server.

---

## 6. Generalização futura (roadmap)

O fluxo acima é o **padrão de referência** deste repositório, mas foi pensado para virar um
processo genérico. Próximos passos possíveis:

| Objetivo | Ideia |
|----------|-------|
| **Parametrizar a aplicação consumidora** | Extrair o caminho do consumer e o comando de build para variáveis de ambiente/CLI, em vez de hardcodar `regulation-vue-3`/`server` |
| **Script de setup/teardown** | Criar scripts `e2e:setup` e `e2e:teardown` que automatizam Fase B e Fase E (backup → dist → rebuild → restore) de forma idempotente |
| **Test runner Playwright dedicado** | Evoluir do Playwright MCP (validação manual guiada) para testes `*.spec.ts` versionáveis, com um helper de `setup` consumidor genérico |
| **Fixture de dados** | Centralizar dados de teste (CPF/CNS de cidadãos) em um arquivo compartilhado, com seed/injeção no ambiente |
| **Container/isolamento** | Rodar uma instância do consumer descartável (ex.: container) só para o teste E2E, evitando mexer no `node_modules` do ambiente de dev real |
| **Documento único para N aplicações** | Transformar este MD em um template reutilizável, com a seção 4 marcando qual passo depende de cada projeto |

---

## 7. Referências

- `README.md` — comandos de build/test do pacote (`npm test`, `npm run build`).
- Projeto consumidor: `server` → `resources/assets/js-vue/aplications/regulation-vue-3/`.
