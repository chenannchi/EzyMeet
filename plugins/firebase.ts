import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public.firebase as {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  }
  const firebaseConfig = {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId
  };

  const app = initializeApp(firebaseConfig)

  const auth = getAuth(app)
  const provider = new GoogleAuthProvider()

  // 把 auth、provider、工具函式掛到 Nuxt App
  nuxtApp.provide('firebaseAuth', auth)
  nuxtApp.provide('googleProvider', provider)
  nuxtApp.provide('signInWithGoogle', () => signInWithPopup(auth, provider))
  nuxtApp.provide('signOutFirebase', () => signOut(auth))

  return {
    provide: {
      onAuthStateChanged: (cb: (user: FirebaseUser | null) => void) =>
        onAuthStateChanged(auth, cb)
    }
  }
})