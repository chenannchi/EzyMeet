<template>
  <div class="page-container">
    <el-calendar ref="calendar">
      <template #header="{ date }">
        <el-button size="small" @click="selectDate('prev-month')" class="!w-auto">
          < </el-button>
            <span>{{ date }}</span>
            <el-button size="small" @click="selectDate('next-month')" class="!w-auto">
              >
            </el-button>
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
          <el-date-picker v-model="meeting.startDate" type="date" placeholder="請選擇開始日期" :disabled-date="disabledDate"/>
        </el-form-item>
        <el-form-item label="開始時間" label-position="top">
          <el-time-select v-model="meeting.startTime" step="00:15" placeholder="請選擇開始時間" />
        </el-form-item>
        <el-form-item label="結束日期" label-position="top" :rules="[{ validator: validateEndDate, trigger: 'change' }]">
          <el-date-picker v-model="meeting.endDate" type="date" placeholder="請選擇結束日期" :disabled-date="disabledDate"/>
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
      <el-button type="primary" @click="handleCreateMeeting" class="!w-full">完成新增會議</el-button>
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
        <el-button type="info" @click="handleAddAgendaItem">
          <!-- <el-button type="info" @click="console.log('add agenda item')"> -->

          完成新增項目
        </el-button>
      </template>
    </el-dialog>
  </div>

</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { CalendarDateType, CalendarInstance } from 'element-plus'
import { Plus, DeleteFilled, Edit } from '@element-plus/icons-vue';
const calendar = ref<CalendarInstance>()
const createMode = ref(true)


useHead({
  title: '行事曆'
})

const selectDate = (val: CalendarDateType) => {
  if (!calendar.value) return
  calendar.value.selectDate(val)
}

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

const agendaItemDialog = ref(false)
const agendaItemFormRef = ref<any>(null)

const agendaItemForm = ref<any>({
  title: '',
  startTime: '',
  endTime: '',
})

const handleOpenItemDialog = () => {
  // console.log('open item dialog')
  agendaItemDialog.value = true
}

const handleCloseAgendaItemDialog = () => {
  // console.log('close item dialog')
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
    } else {
      console.log('Validation failed');
    }
  });
  // meeting.value.agendaItems.push(agendaItemForm.value)
  // agendaItemDialog.value = false
}

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

async function handleCreateMeeting() {
  console.log('create meeting', meeting.value)
  const startDate = new Date(meeting.value.startDate)
  const endDate = new Date(meeting.value.endDate)

  if (startDate > endDate) {
    alert('結束日期必須大於開始日期')
    return
  }

  if (meeting.value.startTime > meeting.value.endTime) {
    alert('結束時間必須大於開始時間')
    return
  }

  const originalStartDate = meeting.value.startDate;
  const originalTimeString = meeting.value.startTime;
  const originalEndDate = meeting.value.endDate;
  const originalEndTimeString = meeting.value.endTime;

  const [startHours, startMinutes] = originalTimeString.split(':').map(Number);
  const [endHours, endMinutes] = originalEndTimeString.split(':').map(Number);

  originalStartDate.setHours(startHours);
  originalStartDate.setMinutes(startMinutes);
  originalStartDate.setSeconds(0);
  originalStartDate.setMilliseconds(0);

  originalEndDate.setHours(endHours);
  originalEndDate.setMinutes(endMinutes);
  originalEndDate.setSeconds(0);
  originalEndDate.setMilliseconds(0);

  const startTimeStamp = new Date(originalStartDate.getTime()).toISOString();
  const endTimeStamp = new Date(originalEndDate.getTime()).toISOString();

  console.log('startTimeStamp', startTimeStamp)
  console.log('endTimeStamp', endTimeStamp)


  console.log('meeting', meeting.value)
  createMode.value = false
  console.log('body', JSON.stringify({
    title: meeting.value.title,
    label: meeting.value.label,
    startDate: startTimeStamp,
    endDate: endTimeStamp,
    location: meeting.value.location,
    link: meeting.value.link,
    invitees: [{
      ...meeting.value.invitees.map((userId: any) => ({
        id: '',
        meetingId: '',
        userId: userId,
        status: 'INVITED',
      }))
    }],
    // agendaItems: tableData.value,
    description: meeting.value.description,
  }),)

  try {
    const response = await fetch('http://localhost:8080/meetings/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body:
        JSON.stringify({
          title: meeting.value.title,
          label: meeting.value.label,
          timeslot: {
            startDate: startTimeStamp,
            endDate: endTimeStamp,
          },
          location: meeting.value.location,
          link: meeting.value.link,
            invitees: meeting.value.invitees.map((userId: any) => ({
            id: '',
            meetingId: '',
            userId: String(userId),
            status: 'INVITED',
            })),


          // agendaItems: tableData.value,
          description: meeting.value.description,
        }),
    });

    if (!response.ok) {
      throw new Error('Failed to create meeting');
    }

    const data = await response.json();
    console.log('API response:', data);
  } catch (error) {
    console.error('Error creating meeting:', error);
  }
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
};

const validateStartTime = (rule: any, value: string, callback: Function) => {
  if (!value) {
    return callback(new Error('請選擇開始時間'));
  } else if (agendaItemForm.value.endTime && value >= agendaItemForm.value.endTime) {
    return callback(new Error('開始時間必須早於結束時間'));
  }
  callback();
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

const fakeMeeting = {
  title: '會議標題',
  label: '會議標籤',
  startDate: '2023-10-01',
  startTime: '09:00',
  endDate: '2023-10-01',
  endTime: '10:00',
  location: '會議室A',
}

onMounted(() => {
  invitees.value = fakeUsers.map((user) => ({
    id: user.id,
    googleId: user.googleId,
    userName: user.userName,
    email: user.email,
  }))
});

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