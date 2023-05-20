import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'

export default defineConfig({
  integrations: [tailwind()],
  routes: {
    '/': {
      component: '/pages/index.astro'
    },
    '/intro': {
      component: '/pages/intro.astro'
    },
    '/interview': {
      component: '/pages/interview.astro'
    },
    '/results': {
      component: '/pages/results.astro'
    }
  }
})
