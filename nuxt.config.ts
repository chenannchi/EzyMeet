// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@element-plus/nuxt', '@nuxtjs/tailwindcss', '@pinia/nuxt'],
  css: [
    '~/assets/styles/main.scss'
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/styles/_variables.scss" as *;',
        }
      }
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      firebase: {
        apiKey:    process.env.FIREBASE_API_KEY,
        authDomain:process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket:process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId:process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId:     process.env.FIREBASE_APP_ID
      }
    }
  },
  plugins: ['~/plugins/firebase.ts']
})