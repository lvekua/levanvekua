import { defineConfig } from "astro/config";
import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
	integrations: [
		partytown({
			// Add common third-party script forwarding events
			config: {
				forward: [
					"dataLayer.push",
					"gtag",
					"ga",
					"fbq",
					"_hsq.push",
					"hj",
					"_linkedin_partner_id"
				],
			},
		}),
	],
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@import "/src/styles/theme.scss";`,
				},
			},
		},
	},
});
