import { ref, computed, getCurrentInstance } from 'vue'
import type { User as FirebaseUser } from 'firebase/auth'
import { useRouter } from 'vue-router'

export function useAuth() {
  const { $firebaseAuth, $onAuthStateChanged, $signInWithGoogle, $signOutFirebase } =
    getCurrentInstance()!.appContext.config.globalProperties as any

  const user = ref<FirebaseUser | null>(null)
  const isLoading = ref(true)

  $onAuthStateChanged((u: FirebaseUser | null) => {
    user.value = u
    isLoading.value = false
  })

  const login = async () => {
    isLoading.value = true
    await $signInWithGoogle()
}

  const logout = async () => {
    await $signOutFirebase()
  }

  const getIdToken = async () => {
    if (!user.value) return null
    return await user.value.getIdToken()
  }

  return {
    user: computed(() => user.value),
    isLoading: computed(() => isLoading.value),
    login,
    logout,
    getIdToken
  }
}
