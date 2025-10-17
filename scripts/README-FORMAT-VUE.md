# Script de Formatação de Componentes Vue

Este script reorganiza automaticamente os componentes Vue seguindo a **Convenção de Código Keldor**.

## Uso

### Formatar um arquivo específico

```bash
npm run format:vue src/components/MeuComponente.vue
```

### Formatar todos os componentes

```bash
npm run format:vue
```

Por padrão, o script processa todos os arquivos `.vue` dentro de `src/`.

### Formatar com padrão customizado

```bash
npm run format:vue "src/pages/**/*.vue"
```

## Estrutura de Código Aplicada

O script reorganiza o `<script setup>` dos componentes na seguinte ordem:

1. **Importações** - `import ...`
2. **Model** - `defineModel()`
3. **Props** - `defineProps()` / `withDefaults()`
4. **Emits** - `defineEmits()`
5. **Variáveis reativas** - `ref()`, `reactive()`, `useTemplateRef()`, `new Class()`
6. **Variáveis computadas** - `computed()`
7. **Watchers** - `watch()`, `watchEffect()`
8. **Hooks de ciclo de vida** - `onMounted()`, `onClickOutside()`, etc
9. **Métodos** - `function minhaFuncao() {}`
10. **Expose** - `defineExpose()`

## Características

- ✅ Preserva o template e style intactos
- ✅ Remove duplicatas de código
- ✅ Mantém formatação e indentação
- ✅ Adiciona uma linha vazia entre seções diferentes
- ✅ Preserva comentários

## Limitações

- ⚠️ Funciona apenas com `<script setup>`
- ⚠️ Não processa componentes com Options API
- ⚠️ Pode não identificar corretamente código muito complexo ou não convencional

## Integração com Workflow

Recomendamos executar o script:

1. Antes de fazer commit de novos componentes
2. Durante code review para garantir padronização
3. Ao atualizar componentes antigos para a nova convenção

## Exemplo

### Antes

```vue
<script setup>
import { ref, computed } from 'vue';

function minhaFuncao() {
	// ...
}

const minhaVar = ref(0);

const props = defineProps({
	nome: String,
});

const valorComputado = computed(() => minhaVar.value * 2);
</script>
```

### Depois

```vue
<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
	nome: String,
});

const minhaVar = ref(0);

const valorComputado = computed(() => minhaVar.value * 2);

function minhaFuncao() {
	// ...
}
</script>
```

## Problemas?

Se encontrar algum problema com o script:

1. Verifique se o componente usa `<script setup>`
2. Certifique-se de que o código está sintaticamente correto
3. Reporte issues complexas para a equipe de desenvolvimento
