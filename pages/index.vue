<template>
  <div class="page-container">
    <div class="flex justify-center items-center">
      <img src="/logo/ezymeet_logo.png" alt="logo" />
    </div>
    <CustomButton :type="'primary'" class="!mr-auto !w-auto" v-if="!user && !isLoading" @click="handleLogin">使用 Google 登入
    </CustomButton>
    <div v-else-if="user">
      <p id="welcome-statement">Welcome to EzyMeet！ <br/>{{ user.displayName }}</p>
      <div class="flex justify-center w-full">
      <CustomButton :type="'primary'" class="!w-auto" @click="toCalendar">進入會議管理頁面
      </CustomButton>
      </div>
    </div>
    <p v-else v-loading="loading"></p>
  </div>
  
</template>
<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

useHead({
  title: '首頁'
})

const { user, isLoading, login, logout, getIdToken } = useAuth()

const loading = ref(true)
const router = useRouter()

const toCalendar = () => {
  router.push('/calendar')
}

const handleLogin = async () => {
  try {
    await login()
    await handleSyncLoginUser()
    // console.log('登入成功:', user.value?.uid)
    // if (user) {
    //   router.push('/calendar')
    // } else {
    //   alert('登入失敗')
    // }
  } catch (error) {
    console.error('登入錯誤:', error)
    alert('發生錯誤')
  }
}

const handleSyncLoginUser = async () => {
  try{
    const response = await fetch("http://localhost:8080/user/sync", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        googleUid:user.value?.uid,
        email:user.value?.email,
        emailVerified:user.value?.emailVerified,
        providerId:user.value?.providerId,
        createdAt:user.value?.metadata.creationTime,
        lastSignInTime:user.value?.metadata.lastSignInTime,
        idToken: await getIdToken(),
        displayName:user.value?.displayName,
        photoURL:user.value?.photoURL,
        phoneNumber:user.value?.phoneNumber,

      })
    })
    const loginUserInfo = await response.json()
    localStorage.setItem('user', JSON.stringify(loginUserInfo))
    console.log('response:', response)
  }
  catch (error) {
    console.error('Error fetching user data:', error)
  }
}
</script>
<style scoped lang="scss">
.page-container {
  padding-top: 50px;
  // padding: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
  max-width: 60vw;
  margin: 0 auto;


  >* {
    width: 80%;
    max-width: 800px;
    margin: 0 auto;
  }

  #welcome-statement {
    font-size: 45px;
    font-weight: 500;
    color: $primary;
    margin-top: 20px;
    padding-bottom:60px;
    line-height: normal;
    text-align: center;
    font-family: "Fraunces", serif;
  }
}


</style>