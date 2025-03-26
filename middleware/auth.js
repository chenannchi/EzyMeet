import { useUserStore } from '@/stores/user';
import { useLoginDialogStore } from '@/stores/loginDialog';

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();
  const loginDialogStore = useLoginDialogStore();

  if (!userStore.user) {
    loginDialogStore.showLoginDialog();
    return abortNavigation();
  }
});