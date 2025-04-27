<template>
  <div class="page-container">
    <el-calendar ref="calendar" v-if="meetings.length">
      <template #header="{ date }">
        <el-button size="small" @click="selectDate('prev-month')" class="!w-auto">
          < </el-button>
            <span>{{ date }}</span>
            <el-button size="small" @click="selectDate('next-month')" class="!w-auto">
              >
            </el-button>
      </template>
      <template #date-cell="{ data }">
        <p :class="data.isSelected ? 'is-selected' : ''">
          {{ data.day.split('-')[2] }}
        </p>
        <p class="meeting-count flex gap-1 items-center flex-wrap">
        <div v-for="meeting in getSpecificDateMeetingsInfo(data.day)" class="text-sm truncate px-1 border rounded-md" :key="meeting.id" @click="handleClickMeeting(meeting.id)"
          style=" background-color: #9c2e61; color: white; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          {{ meeting.title }}
        </div>
        </p>
      </template>
    </el-calendar>
    <div v-if="createMode" class="create-meeting">

      <el-form ref="meetingFormRef" :model="meeting" label-width="100px" class="meeting-form">
        <el-form-item label="標題" label-position="top">
          <el-input v-model="meeting.title" placeholder="請輸入標題" />
        </el-form-item>
        <el-form-item label="標籤" label-position="top">
          <el-input v-model="meeting.label" placeholder="請輸入標籤" />
        </el-form-item>
        <el-form-item label="開始日期" label-position="top" :rules="[{ validator: validateStartDate, trigger: 'change' }]">
          <el-date-picker v-model="meeting.startDate" type="date" placeholder="請選擇開始日期" :disabled-date="disabledDate" />
        </el-form-item>
        <el-form-item label="開始時間" label-position="top">
          <el-time-select v-model="meeting.startTime" step="00:15" placeholder="請選擇開始時間" />
        </el-form-item>
        <el-form-item label="結束日期" label-position="top" :rules="[{ validator: validateEndDate, trigger: 'change' }]">
          <el-date-picker v-model="meeting.endDate" type="date" placeholder="請選擇結束日期" :disabled-date="disabledDate" />
        </el-form-item>
        <el-form-item label="結束時間" label-position="top">
          <el-time-select v-model="meeting.endTime" step="00:15" placeholder="請選擇結束時間" />
        </el-form-item>
        <el-form-item label="地點" label-position="top">
          <el-input v-model="meeting.location" placeholder="請輸入地點" />
        </el-form-item>
        <el-form-item label="連結" label-position="top">
          <el-input v-model="meeting.link" placeholder="請輸入連結" />
        </el-form-item>
        <el-form-item label="受邀者" label-position="top" class="invitees">
          <el-select v-model="meeting.invitees" multiple placeholder="請選擇受邀者">
            <el-option v-for="invitee in invitees" :key="invitee.id" :label="invitee.email" :value="invitee.id" />
          </el-select>
        </el-form-item>
        <el-form-item label-position="top" class="agendaItems !w-full">
          <template #label>
            <div class="flex justify-between items-center">
              <div>議程項目</div>
              <el-button :icon="Plus" class="!w-auto !m-0" circle @click="handleOpenItemDialog"></el-button>
            </div>
          </template>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="title" label="標題" />
            <el-table-column label="時間">
              <template #default="{ row }">
                {{ row.startTime }} - {{ row.endTime }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="60px">
              <template #default="{ row }">
                <div class="flex justify-center items-center gap-1">
                  <el-button type="text" @click="handleEditAgendaItem(row)" class="!m-0 !p-0 !w-auto">
                    <el-icon>
                      <Edit />
                    </el-icon>
                  </el-button>
                  <el-button type="text" @click="handleDeleteAgendaItem(row)" class="!m-0 !p-0 !w-auto">
                    <el-icon>
                      <DeleteFilled />
                    </el-icon>
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="其他資訊" label-position="top" class="description">
          <el-input v-model="meeting.description" type="textarea" placeholder="請輸入其他資訊" />
        </el-form-item>
      </el-form>
      <div class="flex justify-between items-center gap-2">
        <el-button type="info" @click="handleCancelCreatingMeeting" class="!w-full">取消新增會議</el-button>
        <el-button type="primary" @click="handleCreateMeeting" class="!w-full">完成新增會議</el-button>
      </div>
    
    </div>
    <div v-else class="create-hint">
      <img src="/logo/ezymeet_logo.png" alt="logo" />
      <el-button type="primary" @click="createMode = true" class="!w-1/2">新增會議</el-button>
    </div>

    <el-dialog v-model="agendaItemDialog" :before-close="handleCloseAgendaItemDialog">
      <!-- <div class="title"></div> -->
      <el-form ref="agendaItemFormRef" style="" :model="agendaItemForm" label-width="auto" status-icon>
        <el-form-item label="標題" prop="title">
          <el-input v-model="agendaItemForm.title" placeholder="請輸入標題" />
        </el-form-item>
        <el-form-item label="開始時間" prop="startTime" :rules="[{ validator: validateStartTime, trigger: 'change' }]">
          <el-time-select v-model="agendaItemForm.startTime" placeholder="請選擇開始時間" step="00:15" />
        </el-form-item>
        <el-form-item label="結束時間" prop="endTime" :rules="[{ validator: validateEndTime, trigger: 'change' }]">
          <el-time-select v-model="agendaItemForm.endTime" placeholder="請選擇結束時間" step="00:15" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleAddAgendaItem">
          <!-- <el-button type="info" @click="console.log('add agenda item')"> -->

          完成新增項目
        </el-button>
      </template>
    </el-dialog>
  </div>

</template>
<script setup lang="ts">
import { ref } from 'vue'
import {useRouter} from 'vue-router'
import type { CalendarDateType, CalendarInstance } from 'element-plus'
import { Plus, DeleteFilled, Edit, UserFilled } from '@element-plus/icons-vue';

const { user, isLoading, login, logout, getIdToken } = useAuth()
const router = useRouter()
const calendar = ref<CalendarInstance>()

useHead({
  title: '行事曆'
})

const createMode = ref(true)
const agendaItemDialog = ref(false)
const agendaItemFormRef = ref<any>(null)

const meeting = ref<any>({
  title: '',
  label: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  location: '',
  link: '',
  invitees: [],
  agendaItems: [],
  description: '',
})

const agendaItemForm = ref<any>({
  title: '',
  startTime: '',
  endTime: '',
})






const selectDate = (val: CalendarDateType) => {
  if (!calendar.value) return
  calendar.value.selectDate(val)
}

const handleOpenItemDialog = () => {
  agendaItemDialog.value = true
}

const handleCloseAgendaItemDialog = () => {
  agendaItemForm.value = {
    title: '',
    startTime: '',
    endTime: '',
  }

  agendaItemDialog.value = false
}

const handleAddAgendaItem = () => {
  agendaItemFormRef.value.validate((valid: boolean) => {
    if (valid) {
      console.log('add agenda item');
      tableData.value.push(agendaItemForm.value);
      agendaItemDialog.value = false;
      agendaItemFormRef.value.resetFields();
    } else {
      agendaItemFormRef.value.resetFields('startTime');
      agendaItemFormRef.value.resetFields('endTime');

      console.log('Validation failed');
    }
  });
};

const handleEditAgendaItem = (row: any) => {
  console.log('edit agenda item', row)
  agendaItemForm.value = row
  agendaItemDialog.value = true
}

const handleDeleteAgendaItem = (row: any) => {
  console.log('delete agenda item', row)
  const index = tableData.value.indexOf(row)
  if (index > -1) {
    tableData.value.splice(index, 1)
  }
}

/**
 * TODO: userId需加入到host attr
 */
async function handleCreateMeeting() {
  try {
    if (!validateMeetingDates() || !validateMeetingTimes()) return;

    const { startTimeStamp, endTimeStamp } = generateTimestamps();
    const requestBody = createRequestBody(startTimeStamp, endTimeStamp);

    console.log('Request Body:', JSON.stringify(requestBody));

    const response = await fetch('http://localhost:8080/meetings/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) throw new Error('Failed to create meeting');

    const data = await response.json();
    console.log('API response:', data);

    resetMeetingForm();
  } catch (error) {
    console.error('Error creating meeting:', error);
  }
}

function validateMeetingDates() {
  const startDate = new Date(meeting.value.startDate);
  const endDate = new Date(meeting.value.endDate);

  if (startDate > endDate) {
    alert('結束日期必須大於開始日期');
    return false;
  }
  return true;
}

function validateMeetingTimes() {
  if (meeting.value.startTime > meeting.value.endTime) {
    alert('結束時間必須大於開始時間');
    return false;
  }
  return true;
}

function generateTimestamps() {
  const startDate = new Date(meeting.value.startDate);
  const endDate = new Date(meeting.value.endDate);

  const [startHours, startMinutes] = meeting.value.startTime.split(':').map(Number);
  const [endHours, endMinutes] = meeting.value.endTime.split(':').map(Number);

  startDate.setHours(startHours, startMinutes, 0, 0);
  endDate.setHours(endHours, endMinutes, 0, 0);

  return {
    startTimeStamp: startDate.toISOString(),
    endTimeStamp: endDate.toISOString(),
  };
}

function createRequestBody(startTimeStamp, endTimeStamp) {
  return {
    title: meeting.value.title,
    label: meeting.value.label,
    timeslot: { startDate: startTimeStamp, endDate: endTimeStamp },
    location: meeting.value.location,
    link: meeting.value.link,
    invitees: meeting.value.invitees.map(userId => ({
      id: '',
      meetingId: '',
      userId: String(userId),
      status: 'INVITED',
    })),
    description: meeting.value.description,
  };
}

function resetMeetingForm() {
  createMode.value = false;
  meeting.value = {
    title: '',
    label: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    link: '',
    invitees: [],
    agendaItems: [],
    description: '',
  };
}



const fakeTableData = ref([
  { id: 1, title: '會議議程1', startTime: '09:00', endTime: '10:00' },
  { id: 2, title: '會議議程2', startTime: '10:00', endTime: '11:00' },
]);

const tableData = ref<any[]>([]);



const validateEndTime = (rule: any, value: string, callback: Function) => {
  if (!value) {
    return callback(new Error('請選擇結束時間'));
  } else if (agendaItemForm.value.startTime && value <= agendaItemForm.value.startTime) {
    return callback(new Error('結束時間必須晚於開始時間'));
  }
  callback();
  agendaItemFormRef.value.clearValidate('startTime'); // Clear start time validation if end time is valid
};

const validateStartTime = (rule: any, value: string, callback: Function) => {
  if (!value) {
    return callback(new Error('請選擇開始時間'));
  } else if (agendaItemForm.value.endTime && value >= agendaItemForm.value.endTime) {
    return callback(new Error('開始時間必須早於結束時間'));
  }
  callback();
  agendaItemFormRef.value.clearValidate('endTime'); // Clear end time validation if start time is valid
};

const validateStartDate = (rule: any, value: string, callback: Function) => {
  if (!value) {
    return callback(new Error('請選擇開始日期'));
  } else if (meeting.value.endDate && new Date(value) > new Date(meeting.value.endDate)) {
    return callback(new Error('開始日期必須早於結束日期'));
  }
  callback();
};

const validateEndDate = (rule: any, value: string, callback: Function) => {
  if (!value) {
    return callback(new Error('請選擇結束日期'));
  } else if (meeting.value.startDate && new Date(value) < new Date(meeting.value.startDate)) {
    return callback(new Error('結束日期必須晚於開始日期'));
  }
  callback();
};

const handleClickMeeting = (meetingId: number) => {
  router.push({
    path: `/meeting-info/${meetingId}`
  })
}

const invitees = ref()


const fakeUsers = [
  { id: '1', googleId: 'google1', userName: 'User One', email: 'userone@example.com' },
  { id: '2', googleId: 'google2', userName: 'User Two', email: 'usertwo@example.com' },
  { id: '3', googleId: 'google3', userName: 'User Three', email: 'userthree@example.com' },
  { id: '4', googleId: 'google4', userName: 'User Four', email: 'userfour@example.com' }
]

const disabledDate = (time: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to the start of today
  return time.getTime() < today.getTime();
}

const handleCancelCreatingMeeting = () => {
  createMode.value = false
  meeting.value = {
    title: '',
    label: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    link: '',
    invitees: [],
    agendaItems: [],
    description: '',
  }
}

// const fakeMeetings = [
//   {
//     id: '1',
//     title: 'Team Sync',
//     label: 'Work',
//     timeslot: { startDate: '2025-04-01T09:00:00Z', endDate: '2025-04-01T10:00:00Z' },
//     location: 'Conference Room A',
//     link: 'https://example.com/meeting1',
//     invitees: [
//       { id: '1', meetingId: '1', userId: '1', status: 'INVITED' },
//       { id: '2', meetingId: '1', userId: '2', status: 'INVITED' },
//     ],
//     description: 'Weekly team sync-up meeting.',
//   },
//   {
//     id: '2',
//     title: 'Project Kickoff',
//     label: 'Work',
//     timeslot: { startDate: '2025-04-01T11:00:00Z', endDate: '2025-04-01T12:00:00Z' },
//     location: 'Conference Room B',
//     link: 'https://example.com/meeting2',
//     invitees: [
//       { id: '3', meetingId: '2', userId: '3', status: 'INVITED' },
//       { id: '4', meetingId: '2', userId: '4', status: 'INVITED' },
//     ],
//     description: 'Kickoff meeting for the new project.',
//   },
//   {
//     id: '3',
//     title: 'Design Review',
//     label: 'Work',
//     timeslot: { startDate: '2025-04-03T10:00:00Z', endDate: '2025-04-03T11:00:00Z' },
//     location: 'Conference Room C',
//     link: 'https://example.com/meeting3',
//     invitees: [
//       { id: '1', meetingId: '3', userId: '1', status: 'INVITED' },
//       { id: '2', meetingId: '3', userId: '2', status: 'INVITED' },
//     ],
//     description: 'Review of the latest design updates.',
//   },
//   {
//     id: '4',
//     title: 'Client Presentation',
//     label: 'Work',
//     timeslot: { startDate: '2025-04-02T13:00:00Z', endDate: '2025-04-02T14:00:00Z' },
//     location: 'Conference Room D',
//     link: 'https://example.com/meeting4',
//     invitees: [
//       { id: '3', meetingId: '4', userId: '3', status: 'INVITED' },
//       { id: '4', meetingId: '4', userId: '4', status: 'INVITED' },
//     ],
//     description: 'Presentation for the client on project progress.',
//   },
//   {
//     id: '5',
//     title: 'Team Retrospective',
//     label: 'Work',
//     timeslot: { startDate: '2025-04-02T15:00:00Z', endDate: '2025-04-02T16:00:00Z' },
//     location: 'Conference Room E',
//     link: 'https://example.com/meeting5',
//     invitees: [
//       { id: '1', meetingId: '5', userId: '1', status: 'INVITED' },
//       { id: '2', meetingId: '5', userId: '2', status: 'INVITED' },
//     ],
//     description: 'Team retrospective to discuss what went well and areas for improvement.',
//   },
//   {
//     id: '6',
//     title: 'Brainstorming Session',
//     label: 'Work',
//     timeslot: { startDate: '2025-04-02T17:00:00Z', endDate: '2025-04-02T18:00:00Z' },
//     location: 'Conference Room F',
//     link: 'https://example.com/meeting6',
//     invitees: [
//       { id: '3', meetingId: '6', userId: '3', status: 'INVITED' },
//       { id: '4', meetingId: '6', userId: '4', status: 'INVITED' },
//     ],
//     description: 'Brainstorming session for new ideas and strategies.',
//   },
// ]

const getSpecificDateMeetingsInfo = (date: string) => {
  const cellDate = new Date(date);
  cellDate.setHours(0, 0, 0, 0);
  const meetingsOnDate = meetings.value.filter(meeting => {
    const startDate = new Date(meeting.startDate);
    const endDate = new Date(meeting.endDate);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    return cellDate >= startDate && cellDate <= endDate;
  });
  return meetingsOnDate.length > 0
    ? meetingsOnDate.map(meeting => ({ id: meeting.id, title: meeting.title }))
    : [];
};

const meetings = ref([])

const fetchAllMeetingsByUserId = async () => {
  try {
    const response = await fetch(`http://localhost:8080/meetings/user/${'user-123'}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();

    meetings.value = responseData.map((meeting: any) => ({
      id: meeting.id,
      title: meeting.title,
      label: meeting.label,
      startDate: meeting.timeslot.startDate.split('T')[0],
      startTime: meeting.timeslot.startDate.split('T')[1].split('+')[0],
      endDate: meeting.timeslot.endDate.split('T')[0],
      endTime: meeting.timeslot.endDate.split('T')[1].split('+')[0],
      location: meeting.location,
      link: meeting.link,
      invitees: meeting.invitees,
      description: meeting.description,
      host: meeting.host,
    }));

    if (!response.ok) {
      throw new Error('Failed to fetch meetings');
    }

  } catch (error) {
    console.error('Error fetching meetings:', error);
  }
}


onMounted(async () => {
  /**
   * TODO: userId要更換成真實的
   */
  await fetchAllMeetingsByUserId("user-123");
  createMode.value = false;
  // meetings.value = fakeMeetings;
})


</script>
<style scoped lang="scss">
.page-container {
  padding-top: 50px;
  // padding: 20px;
  display: flex;
  // flex-direction: column;
  width: 100%;
  // gap: 20px;
  max-width: 90vw;
  margin: 0 auto;

  gap: 20px;

  .el-calendar {
    width: 60%;

    :deep(tr) {
      height: 150px;

      >* {
        height: 150px !important;

      }

      .el-calendar-day{
        height: 100% !important;
      }
    }
  }

  .create-hint {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 40%;
  }



  :deep(.el-dialog) {
    .el-form {
      width: 100%;

      .el-form-item {
        width: 100%;
        margin-bottom: 15px;

        .el-input,
        .el-date-editor,
        .el-select,
        .el-time-select {
          width: 100%;
        }
      }
    }
  }



  >.create-meeting {
    width: 40%;

    >.meeting-form {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: wrap;

    }
  }


  .el-form-item {
    width: 50%;
    padding: 5px;
    margin-bottom: 5px;

    :deep(.el-input),
    :deep(.el-date-editor),
    :deep(.el-select),
    :deep(.el-time-select) {
      width: 100%;
    }


    &.invitees,
    &.description,
    &.agendaItems {
      width: 100%;
    }

    &.agendaItems {
      :deep(.el-form-item__label) {
        width: 100%;
      }
    }
  }
}
</style>