import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLoginDialogStore = defineStore('loginDialog', () => {
  const loginDialogVisible = ref(false);

  const showLoginDialog = () => {
    loginDialogVisible.value = true;
  };

  const hideLoginDialog = () => {
    loginDialogVisible.value = false;
  };

  return {
    loginDialogVisible,
    showLoginDialog,
    hideLoginDialog,
  };
});