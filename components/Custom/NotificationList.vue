<template>
  <div class="notifitcation-list">
    <div v-for="notification in notifications" :key="notification.id" class="notification-card"
      @click="handleClickNotification(notification)">
      <h4 class="font-semibold">{{ notification.title }}</h4>
      <p class="text-gray-600 text-sm">{{ formatDate(notification.createdAt) }}</p>

      <div v-if="notification.status === 'PENDING'" class="mt-2 flex gap-2">
        <el-button type="success" class="!w-1/2 !m-0"
          @click.stop="() => replyInvitation(notification.id, 'ACCEPTED')">Accept</el-button>
        <el-button type="danger" class="!w-1/2 !m-0"
          @click.stop="() => replyInvitation(notification.id, 'REJECTED')">Reject</el-button>
      </div>

      <div v-else class="mt-2 text-sm text-gray-500">
        Meeting "{{ notification.title }}" has been
        {{ notification.status === 'ACCEPTED' ? 'accepted' : notification.status === 'REJECTED' ? 'rejected' : 'updated' }}.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const notifications = ref([])
const userId = ref('')
const route = useRoute()
const router = useRouter()

const fetchNotifications = async () => {
  try {
    const res = await fetch(`http://localhost:8080/notifications/${userId.value}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error('Failed to fetch notifications')
    const data = await res.json()
    notifications.value = data
    console.log('Fetched notifications:', notifications.value)
  } catch (err) {
    console.error(err)
    notifications.value = []
  }
}

const replyInvitation = async (id, status) => {
  try {
    const res = await fetch(`http://localhost:8080/notifications/replyInvitation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId: id, status: status }),
    })
    if (!res.ok) throw new Error('Failed to update notification')

    await fetchNotifications() // Refresh notifications after responding

    // After successful response
    const notification = notifications.value.find(n => n.id === id)
    emit('close-notification')

    // Check the current route
    const onMeetingInfoPage = route.path.startsWith('/meeting-info/')
    const onCurrentMeetingPage = route.path === `/meeting-info/${notification.meetingId}`

    // Determine navigation behavior
    if (onCurrentMeetingPage) {
      // If already on this meeting's page, just refresh the data
      router.replace({
        path: route.path,
        query: { refresh: 'true' }
      })
    } else if (onMeetingInfoPage) {
      // If on another meeting's page, navigate to this meeting
      router.push(`/meeting-info/${notification.meetingId}?refresh=true`)
    }
    // If on calendar or another page, don't navigate - just stay there
  } catch (err) {
    console.error(err)
  }
}

const emit = defineEmits(['close-notification'])

const handleClickNotification = (notification) => {
  // Handle notification click, e.g., navigate to a specific page or show details
  // console.log('Notification clicked:', notification)
  emit('close-notification')


  // Check the current route
  const onMeetingInfoPage = route.path.startsWith('/meeting-info/')
  const onCurrentMeetingPage = route.path === `/meeting-info/${notification.meetingId}`

  if (onCurrentMeetingPage) {
    // If already on this meeting's page, just refresh the data
    router.replace({
      path: route.path,
      query: { refresh: 'true' }
    })
  } else {
    // Navigate to meeting page for all other cases
    router.push(`/meeting-info/${notification.meetingId}?refresh=true`)
  }
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString()
}

onMounted(async () => {
  const user = localStorage.getItem('user');
  userId.value = user ? JSON.parse(user).id : '';
  await fetchNotifications()
})

</script>

<style scoped lang="scss">
.notifitcation-list {
  // max-width: 600px;
  // width: 100vw;
  width: 400px;
  position: absolute;
  top: 80px;
  right: 2%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 9999;
}

.notification-card {
  width: 100%;
  background-color: $secondary;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  word-break: break-word;
  white-space: normal;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>