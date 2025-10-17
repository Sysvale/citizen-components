#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';

/**
 * Script para reorganizar componentes Vue seguindo a convenção Keldor
 *
 * Ordem das seções:
 * 1. Importações
 * 2. Props (defineProps/withDefaults)
 * 3. Emits (defineEmits)
 * 4. Variáveis reativas (ref, reactive)
 * 5. Variáveis computadas (computed)
 * 6. Watchers (watch, watchEffect)
 * 7. Hooks de ciclo de vida (onMounted, onUnmounted, etc)
 * 8. Métodos (functions)
 * 9. Expose (defineExpose)
 */

const SECTION_ORDER = {
	imports: 0,
	model: 1,
	props: 2,
	emits: 3,
	reactive: 4,
	computed: 5,
	watchers: 6,
	hooks: 7,
	methods: 8,
	expose: 9,
	other: 10,
};

const LIFECYCLE_HOOKS = [
	'onBeforeMount',
	'onMounted',
	'onBeforeUpdate',
	'onUpdated',
	'onBeforeUnmount',
	'onUnmounted',
	'onActivated',
	'onDeactivated',
	'onErrorCaptured',
];

const REACTIVE_FUNCTIONS = [
	'ref',
	'reactive',
	'shallowRef',
	'shallowReactive',
	'useTemplateRef',
];
const COMPUTED_FUNCTIONS = ['computed'];
const WATCH_FUNCTIONS = ['watch', 'watchEffect'];

function identifySectionType(line) {
	const trimmed = line.trim();

	// Importações
	if (trimmed.startsWith('import ')) {
		return 'imports';
	}

	// Model
	if (trimmed.match(/^(const|let)\s+\w+\s*=\s*defineModel/)) {
		return 'model';
	}

	// Props
	if (
		trimmed.match(/^(const|let)\s+props\s*=\s*(defineProps|withDefaults)/)
	) {
		return 'props';
	}

	// Emits
	if (trimmed.match(/^(const|let)\s+emits\s*=\s*defineEmits/)) {
		return 'emits';
	}

	// Expose
	if (trimmed.startsWith('defineExpose(')) {
		return 'expose';
	}

	// Hooks de ciclo de vida (incluindo composables como onClickOutside)
	if (LIFECYCLE_HOOKS.some(hook => trimmed.startsWith(`${hook}(`))) {
		return 'hooks';
	}

	// Hooks de composables (onClickOutside, etc)
	if (trimmed.match(/^on[A-Z]\w+\(/)) {
		return 'hooks';
	}

	// Variáveis reativas
	if (
		trimmed.match(
			/^(const|let)\s+\w+\s*=\s*(ref|reactive|shallowRef|shallowReactive|useTemplateRef)/
		)
	) {
		return 'reactive';
	}

	// Variáveis computadas
	if (trimmed.match(/^(const|let)\s+\w+\s*=\s*computed/)) {
		return 'computed';
	}

	// Watchers
	if (WATCH_FUNCTIONS.some(fn => trimmed.startsWith(`${fn}(`))) {
		return 'watchers';
	}

	// Métodos (functions declaradas com function keyword)
	if (trimmed.match(/^(async\s+)?function\s+\w+/)) {
		return 'methods';
	}

	// Instanciação de classes/serviços - trata como variável reativa
	if (trimmed.match(/^(const|let)\s+\w+\s*=\s*new\s+/)) {
		return 'reactive';
	}

	// Métodos (arrow functions ou const = function)
	if (trimmed.match(/^(const|let)\s+\w+\s*=\s*(async\s+)?\(/)) {
		return 'methods';
	}

	return 'other';
}

function parseScriptSetup(scriptContent) {
	const lines = scriptContent.split('\n');
	const sections = [];
	let currentSection = null;
	let emptyLineBuffer = [];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const trimmed = line.trim();

		// Linha vazia
		if (!trimmed) {
			emptyLineBuffer.push(line);
			continue;
		}

		// Comentário
		if (trimmed.startsWith('//')) {
			emptyLineBuffer.push(line);
			continue;
		}

		const sectionType = identifySectionType(line);

		// Se mudou de seção ou é uma nova seção
		if (!currentSection || currentSection.type !== sectionType) {
			if (currentSection) {
				// Remove linhas vazias do final da seção anterior
				while (
					currentSection.lines.length > 0 &&
					!currentSection.lines[
						currentSection.lines.length - 1
					].trim()
				) {
					currentSection.lines.pop();
				}
				sections.push(currentSection);
			}

			currentSection = {
				type: sectionType,
				lines: [line], // Não inclui emptyLineBuffer para evitar linhas vazias no início
				order: SECTION_ORDER[sectionType] || SECTION_ORDER.other,
			};
			emptyLineBuffer = [];
		} else {
			// Continua na mesma seção
			currentSection.lines.push(...emptyLineBuffer, line);
			emptyLineBuffer = [];
		}

		// Se a linha tem abertura de parênteses/colchetes/chaves, continua até fechar
		let openBrackets = (line.match(/[{[(]/g) || []).length;
		let closeBrackets = (line.match(/[}\])]/g) || []).length;
		let bracketCount = openBrackets - closeBrackets;

		while (bracketCount > 0 && i + 1 < lines.length) {
			i++;
			const nextLine = lines[i];
			currentSection.lines.push(nextLine);

			openBrackets = (nextLine.match(/[{[(]/g) || []).length;
			closeBrackets = (nextLine.match(/[}\])]/g) || []).length;
			bracketCount += openBrackets - closeBrackets;
		}
	}

	if (currentSection) {
		// Remove linhas vazias do final da última seção
		while (
			currentSection.lines.length > 0 &&
			!currentSection.lines[currentSection.lines.length - 1].trim()
		) {
			currentSection.lines.pop();
		}
		sections.push(currentSection);
	}

	return sections;
}

function reorganizeSections(sections) {
	// Remove duplicatas baseado no primeiro linha de cada seção
	const seen = new Set();
	const uniqueSections = sections.filter(section => {
		const firstLine = section.lines.find(l => l.trim()).trim();
		if (seen.has(firstLine)) {
			return false;
		}
		seen.add(firstLine);
		return true;
	});

	// Agrupa seções por tipo
	const grouped = {};

	uniqueSections.forEach(section => {
		if (!grouped[section.type]) {
			grouped[section.type] = [];
		}
		grouped[section.type].push(section);
	});

	// Reorganiza seguindo a ordem definida
	const reorganized = [];
	const sectionTypes = Object.keys(SECTION_ORDER).sort(
		(a, b) => SECTION_ORDER[a] - SECTION_ORDER[b]
	);

	sectionTypes.forEach(type => {
		if (grouped[type]) {
			grouped[type].forEach(section => {
				reorganized.push(section);
			});
		}
	});

	// Adiciona seções 'other' no final
	if (grouped.other) {
		grouped.other.forEach(section => {
			reorganized.push(section);
		});
	}

	return reorganized;
}

function extractSections(content) {
	// Extrai seções de forma manual para evitar problemas com regex
	const sections = {
		template: null,
		script: null,
		style: null,
		scriptTag: null,
		scriptContent: null,
	};

	// Encontra o índice das tags principais (não aninhadas)
	const scriptStartIdx = content.indexOf('<script setup');
	const scriptEndIdx = content.indexOf('</script>', scriptStartIdx);

	if (scriptStartIdx === -1 || scriptEndIdx === -1) {
		return null;
	}

	// Extrai o script
	const scriptTagEnd = content.indexOf('>', scriptStartIdx);
	sections.scriptTag = content.substring(scriptStartIdx, scriptTagEnd + 1);
	sections.scriptContent = content
		.substring(scriptTagEnd + 1, scriptEndIdx)
		.trim();
	sections.script = content.substring(scriptStartIdx, scriptEndIdx + 9); // +9 para incluir </script>

	// Extrai template (tudo antes do script)
	sections.template = content.substring(0, scriptStartIdx).trim();

	// Extrai style (tudo depois do script)
	const afterScript = content.substring(scriptEndIdx + 9).trim();
	if (afterScript) {
		sections.style = afterScript;
	}

	return sections;
}

function formatVueFile(filePath) {
	const content = readFileSync(filePath, 'utf-8');

	const sections = extractSections(content);

	if (!sections) {
		console.log(`⚠️  Pulando ${filePath} (sem <script setup>)`);
		return false;
	}

	const { template, scriptTag, scriptContent, style } = sections;

	// Parse e reorganiza
	const scriptSections = parseScriptSetup(scriptContent);
	const reorganized = reorganizeSections(scriptSections);

	// Monta o script reorganizado
	const newScriptLines = [];
	let lastSectionType = null;

	reorganized.forEach((section, index) => {
		// Adiciona linha vazia entre seções de tipos diferentes (exceto na primeira)
		if (lastSectionType !== null && lastSectionType !== section.type) {
			newScriptLines.push('');
		}

		// Adiciona linhas da seção
		newScriptLines.push(...section.lines);

		lastSectionType = section.type;
	});

	const newScriptContent = newScriptLines.join('\n');
	const newScript = `${scriptTag}\n${newScriptContent}\n</script>`;

	// Monta o arquivo completo preservando template e style
	let newContent = '';

	if (template) {
		newContent += template + '\n\n';
	}

	newContent += newScript;

	if (style) {
		newContent += '\n\n' + style;
	}

	// Adiciona newline no final do arquivo
	newContent += '\n';

	// Escreve o arquivo
	writeFileSync(filePath, newContent, 'utf-8');

	return true;
}

// Processa arquivos
async function main() {
	const pattern = process.argv[2] || 'src/**/*.vue';
	const files = await glob(pattern);

	console.log(`🔍 Encontrados ${files.length} arquivos .vue\n`);

	let processed = 0;
	let skipped = 0;

	files.forEach(file => {
		const formatted = formatVueFile(file);
		if (formatted) {
			console.log(`✅ ${file}`);
			processed++;
		} else {
			skipped++;
		}
	});

	console.log(`\n✨ Formatação concluída!`);
	console.log(`   ${processed} arquivo(s) processado(s)`);
	if (skipped > 0) {
		console.log(`   ${skipped} arquivo(s) pulado(s)`);
	}
}

main().catch(console.error);
