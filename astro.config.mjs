import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  routes: {
    '/': {
      component: '/pages/index.astro'
    },
    '/intro': {
      component: '/pages/intro.astro'
    },
    '/interview': {
      component: '/pages/interview.astro'
    }
  }
})
