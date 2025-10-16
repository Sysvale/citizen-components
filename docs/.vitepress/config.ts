import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: 'Citizen Components',
	description: 'Componentes Vue para busca e listagem de cidadãos',
	themeConfig: {
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Configuração', link: '/configuration' },
			{ text: 'Componentes', link: '/components/citizen-select' },
		],

		sidebar: [
			{
				text: 'Início',
				items: [
					{ text: 'Introdução', link: '/' },
					{ text: 'Configuração', link: '/configuration' },
				],
			},
			{
				text: 'Componentes',
				items: [
					{
						text: 'CitizenSelect',
						link: '/components/citizen-select',
					},
				],
			},
		],

		socialLinks: [
			{
				icon: 'github',
				link: 'https://github.com/Sysvale/citizen-components',
			},
		],
	},
});
