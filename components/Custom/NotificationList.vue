<template>
  <div class="notifitcation-list">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="notification-card"
    >
      <h3 class="font-semibold">{{ notification.meetingTitle }}</h3>
      <p class="text-gray-600 text-sm">{{ formatDate(notification.meetingTime) }}</p>

      <div v-if="notification.status === 'PENDING'" class="mt-2 flex gap-2">
        <el-button type="success" size="small" class="!w-1/2 !m-0" @click="respond(notification.id, 'ACCEPTED')">Accept</el-button>
        <el-button type="danger" size="small" class="!w-1/2 !m-0" @click="respond(notification.id, 'REJECTED')">Reject</el-button>
      </div>

      <div v-else class="mt-2 text-sm text-gray-500">
        You {{ notification.status.toLowerCase() }} this invitation.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const notifications = ref([])

const fetchNotifications = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  notifications.value = [
    {
      id: 1,
      meetingTitle: 'Project Kickoff',
      meetingTime: '2024-06-10T10:00:00',
      status: 'PENDING'
    },
    {
      id: 2,
      meetingTitle: 'Design Review',
      meetingTime: '2024-06-12T14:30:00',
      status: 'ACCEPTED'
    },
    {
      id: 3,
      meetingTitle: 'Sprint Planning',
      meetingTime: '2024-06-15T09:00:00',
      status: 'REJECTED'
    }
  ]
}

const respond = async (id, status) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  const notif = notifications.value.find(n => n.id === id)
  if (notif) notif.status = status
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString()
}

onMounted(fetchNotifications)
</script>

<style scoped lang="scss">
.notifitcation-list {
  max-width: 600px;
  /* margin: auto; */
  /* padding: 1rem; */
  position: absolute;
  top: 80px;
  right: 2%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  /* z-index: 1000; */
  .notification-card {
    background-color: $secondary;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;

    
  }
}
</style>