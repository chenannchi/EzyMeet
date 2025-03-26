import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '~/types/interfaces';

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);

  const setUser = (userData: any) => {
    user.value = userData;
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const clearUser = () => {
    user.value = null;
    localStorage.removeItem('user');
  };

  const loadUserFromLocalStorage = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      user.value = JSON.parse(userData);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const res = await $fetch<any>('http://localhost:5005/giftopia/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      setUser(res.data);
    } catch (error) {
      console.error('Failed to login:', error);
      throw error;
    }
  };

  return {
    login,
    user,
    setUser,
    clearUser,
    loadUserFromLocalStorage,
  };
});