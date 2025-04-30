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
      <template #date-cell="{ data }">
        <p :class="data.isSelected ? 'is-selected' : ''">
          {{ data.day.split('-')[2] }}
        </p>
        <p class="meeting-count flex gap-1 items-center flex-wrap">
        <div v-for="meeting in getSpecificDateMeetingsInfo(data.day)" class="text-sm truncate px-1 border rounded-md"
          :key="meeting.id" @click="handleClickMeeting(meeting.id)"
          style=" background-color: #9c2e61; color: white; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          {{ meeting.title }}
        </div>
        </p>
      </template>
    </el-calendar>
    <div v-if="createMode" class="create-meeting">

      <el-form ref="meetingFormRef" :model="meeting" label-width="100px" class="meeting-form" :rules="rules">
        <el-form-item label="標題" label-position="top" prop="title">
          <el-input v-model="meeting.title" placeholder="請輸入標題" />
        </el-form-item>
        <el-form-item label="標籤" label-position="top">
          <el-input v-model="meeting.label" placeholder="請輸入標籤" />
        </el-form-item>
        <el-form-item label="開始日期" label-position="top" prop="startDate">
          <el-date-picker v-model="meeting.startDate" type="date" placeholder="請選擇開始日期" :disabled-date="disabledDate"/>
        </el-form-item>
        <el-form-item label="開始時間" label-position="top" prop="startTime">
          <el-time-select v-model="meeting.startTime" step="00:15" placeholder="請選擇開始時間" />
        </el-form-item>
        <el-form-item label="結束日期" label-position="top" prop="endDate">
          <el-date-picker v-model="meeting.endDate" type="date" placeholder="請選擇結束日期" :disabled-date="disabledDate"/>
        </el-form-item>
        <el-form-item label="結束時間" label-position="top" prop="endTime">
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
            <el-option v-for="participantOption in participantOptions" :key="participantOption.id" :label="participantOption.displayName+' <'+participantOption.email+'>'" :value="participantOption.id" />
          </el-select>
        </el-form-item>
        <el-form-item label-position="top" class="agendaItems !w-full">
          <template #label>
            <div class="flex justify-between items-center">
              <div>議程項目</div>
              <el-button :icon="Plus" class="!w-auto !m-0" circle @click="handleOpenItemDialog('add')"></el-button>
            </div>
          </template>
          <el-table :data="agendaItemsData" style="width: 100%" empty-text="目前尚無議程">
            <el-table-column prop="title" label="標題" />
            <el-table-column label="時間">
              <template #default="{ row }">
                {{ row.startTime }} - {{ row.endTime }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="60px">
              <template #default="{ row }">
                <div class="flex justify-center items-center gap-1">
                  <el-icon @click="openEditAgendaItem(row)" class="!m-0 !p-0 !w-auto !fill-blue-500">
                    <Edit class="!text-blue-500" />
                  </el-icon>
                  <el-icon @click="handleDeleteAgendaItem(row)" class="!m-0 !p-0 !w-auto">
                    <DeleteFilled class="!text-red-500" />
                  </el-icon>
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
        <el-form-item label="開始時間" prop="startTime" >
          <el-time-select v-model="agendaItemForm.startTime" placeholder="請選擇開始時間" step="00:15" />
        </el-form-item>
        <el-form-item label="結束時間" prop="endTime">
          <el-time-select v-model="agendaItemForm.endTime" placeholder="請選擇結束時間" step="00:15" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button v-if="agendaCreateMode" type="primary" @click="handleAddAgendaItem">
          完成新增項目
        </el-button>
        <el-button v-else type="primary" @click="handleEditAgendaItem">
          完成編輯項目
        </el-button>
      </template>
    </el-dialog>
  </div>

</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { CalendarDateType, CalendarInstance, FormRules } from 'element-plus'
import { Plus, DeleteFilled, Edit, UserFilled } from '@element-plus/icons-vue';

const userId = ref('')

const { user, isLoading, login, logout, getIdToken } = useAuth()
const router = useRouter()
const calendar = ref<CalendarInstance>()

useHead({
  title: '行事曆'
})

const createMode = ref(true)
const agendaItemDialog = ref(false)
const agendaItemFormRef = ref<any>(null)
const meetingFormRef = ref<any>(null)
const agendaCreateMode = ref(true)

const meeting = ref<RuleForm>({
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

const handleOpenItemDialog = (mode: string) => {
  agendaCreateMode.value = mode === 'add'
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
      agendaItemsData.value.push({ ...agendaItemForm.value });
      agendaItemDialog.value = false;
      agendaItemForm.value = {
        title: '',
        startTime: '',
        endTime: '',
      };
      agendaItemFormRef.value.resetFields(); // Reset the validation status
    } else {
      console.log('Validation failed');
    }
  });
};

const openEditAgendaItem = (row: any) => {
  agendaItemForm.value = { ...row };
  handleOpenItemDialog('edit');
  // agendaItemDialog.value = true
}
const handleEditAgendaItem = () => {
  agendaItemFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const index = agendaItemsData.value.findIndex((item) => item.id === agendaItemForm.value.id);
      if (index !== -1) {
        agendaItemsData.value[index] = { ...agendaItemForm.value };
      }
      agendaItemDialog.value = false;
      agendaItemForm.value = {
        title: '',
        startTime: '',
        endTime: '',
      };
      agendaItemFormRef.value.resetFields(); // Reset the validation status
    } else {
      console.log('Validation failed');
    }
  });

}

const handleDeleteAgendaItem = (row: any) => {
  const index = agendaItemsData.value.indexOf(row)
  if (index > -1) {
    agendaItemsData.value.splice(index, 1)
  }
}

async function handleCreateMeeting() {
  if (!meetingFormRef.value) return;
  meetingFormRef.value.validate(async (valid: boolean) => {
    console.log('valid', valid)
    if (!valid) return; // Only proceed if the form is valid

    try {
      const { startTimeStamp, endTimeStamp } = generateTimestamps();
      const requestBody = createRequestBody(startTimeStamp, endTimeStamp);

      const response = await fetch('http://localhost:8080/meetings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 409) {
        ElMessage({
          message: '會議時間衝突，請重新選擇',
          type: 'warning',
        });
        // meetingFormRef.value.resetFields('startDate');
        // meetingFormRef.value.resetFields('endDate');
        meetingFormRef.value.resetFields('startTime');
        meetingFormRef.value.resetFields('endTime');
        return;
      }

      if (!response.ok) throw new Error('Failed to create meeting');

      const data = await response.json();
      fetchAllMeetingsByUserId(userId.value);
      resetMeetingForm();
    } catch (error) {
      console.error('Error creating meeting:', error);
    }
  });
}

// function validateMeetingDates() {
//   const startDate = new Date(meeting.value.startDate);
//   const endDate = new Date(meeting.value.endDate);

//   if (startDate > endDate) {
//     alert('結束日期必須大於開始日期');
//     return false;
//   }
//   return true;
// }

// function validateMeetingTimes() {
//   if (meeting.value.startTime >= meeting.value.endTime) {
//     alert('結束時間必須大於開始時間');
//     return false;
//   }
//   return true;
// }

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

function createRequestBody(startTimeStamp: any, endTimeStamp: any) {
  return {
    title: meeting.value.title,
    label: meeting.value.label,
    timeslot: { startDate: startTimeStamp, endDate: endTimeStamp },
    host: userId.value,
    location: meeting.value.location,
    link: meeting.value.link,
    participants: meeting.value.invitees.map((userId: any) => ({
      userId: String(userId),
      status: 'INVITED',
    })),
    description: meeting.value.description,
  };
}

function resetMeetingForm() {
  createMode.value = false;
  agendaItemsData.value = [];
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

const fakeTableData = ref<{ id: number; title: string; startTime: string; endTime: string }[]>([
  // { id: 1, title: '會議議程1', startTime: '09:00', endTime: '10:00' },
  // { id: 2, title: '會議議程2', startTime: '10:00', endTime: '11:00' },
]);

const agendaItemsData = ref<any[]>([]);

const validateEndTime = (_: any, value: string, callback: Function) => {
  // console.log('validateEndTime', value, agendaItemForm.value.startTime)
  if (!value) {
    return callback(new Error('請選擇結束時間'));
  } else if (
    meeting.value.startTime &&
    meeting.value.endTime &&
    meeting.value.startDate === meeting.value.endDate &&
    meeting.value.startTime >= meeting.value.endTime
  ) {
    console.log
    return callback(new Error('結束時間必須晚於開始時間'));
  }
  else if(
    meeting.value.startDate &&
    meeting.value.endDate &&
    meeting.value.startTime >= meeting.value.endTime
  ) {
    return callback(new Error('結束時間必須晚於開始時間'));
  }
  callback();
  // agendaItemFormRef.value.clearValidate('startTime'); // Clear start time validation if end time is valid
};

const validateStartTime = (_: any, value: string, callback: Function) => {
  // console.log('validateStartTime', value, agendaItemForm.value.endTime)
  if (!value) {
    return callback(new Error('請選擇開始時間'));
  } else if (
    meeting.value.startTime &&
    meeting.value.endTime &&
    meeting.value.startDate === meeting.value.endDate &&
    meeting.value.startTime >= meeting.value.endTime
  ) {
    return callback(new Error('開始時間必須早於結束時間'));
  }else if (
    meeting.value.startDate &&
    meeting.value.endDate &&
    meeting.value.startTime >= meeting.value.endTime
  ) {
    return callback(new Error('開始時間必須早於結束時間'));
  }
  callback();
  // agendaItemFormRef.value.clearValidate('endTime'); // Clear end time validation if start time is valid
};

const validateStartDate = (_: any, value: string, callback: Function) => {
  // console.log('validateStartDate', value, meeting.value.endDate)
  if (!value) {
    return callback(new Error('請選擇開始日期'));
  } else if (meeting.value.endDate && new Date(value) > new Date(meeting.value.endDate)) {
    return callback(new Error('開始日期必須早於結束日期'));
  }
  callback();
};

const validateEndDate = (_: any, value: string, callback: Function) => {
  // console.log('validateEndDate', value, meeting.value.startDate)
  if (!value) {
    return callback(new Error('請選擇結束日期'));
  } else if (meeting.value.startDate && new Date(value) < new Date(meeting.value.startDate)) {
    return callback(new Error('結束日期必須晚於開始日期'));
  }
  callback();
};

type RuleForm = {
  title: string;
  label: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  link: string;
  invitees: string[];
  agendaItems: string[];
  description: string;
  [key: string]: any;
};

const rules = reactive<FormRules<RuleForm>>({
  title: [{ required: true, message: '請輸入標題', trigger: 'change' }],
  startDate: [{ required: true, validator: validateStartDate, trigger: 'change' }],
  endDate: [{ required: true, validator: validateEndDate, trigger: 'change' }],
  startTime: [{ required: true, validator: validateStartTime, trigger: 'change' }],
  endTime: [{ required: true, validator: validateEndTime, trigger: 'change' }],
})


const handleClickMeeting = (meetingId: string) => {
  router.push({
    path: `/meeting-info/${meetingId}`
  })
}

const participantOptions = ref()

const disabledDate = (time: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
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

const getSpecificDateMeetingsInfo = (date: string) => {
  const cellDate = new Date(date);
  cellDate.setHours(0, 0, 0, 0);
  const meetingsOnDate = meetings.value.filter((meeting: any) => {
    const startDate = new Date(meeting.startDate);
    const endDate = new Date(meeting.endDate);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    return cellDate >= startDate && cellDate <= endDate;
  });
  return meetingsOnDate.length > 0
    ? meetingsOnDate.map((meeting: { id: string; title: string }) => ({ id: meeting.id, title: meeting.title }))
    : [];
};

const meetings = ref([])

const fetchAllMeetingsByUserId = async (userId: string) => {
  try {
    const response = await fetch(`http://localhost:8080/meetings/user/${userId}`, {
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

const handleGetParticipantsOptions = async () => {
  try {
    const response = await fetch(`http://localhost:8080/user/participant-options/${userId.value}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();
    participantOptions.value = responseData.map((user: any) => ({
      id: user.id,
      displayName: user.displayName,
      email: user.email,
    }));

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

onMounted(async () => {
  const user = localStorage.getItem('user');
  userId.value = user ? JSON.parse(user).id : '';
  await fetchAllMeetingsByUserId(userId.value);
  await handleGetParticipantsOptions();
  createMode.value = false;
  agendaItemsData.value = fakeTableData.value.map((item) => ({
    id: item.id,
    title: item.title,
    startTime: item.startTime,
    endTime: item.endTime,
  }));
})
</script>
<style scoped lang="scss">
.page-container {
  padding-top: 0;
  padding-bottom: 0;
  // padding: 20px;
  display: flex;
  // flex-direction: column;
  width: 90%;
  // gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;

  gap: 20px;

  .el-calendar {
    width: 60%;

    :deep(tr) {
      // height: 150px;

      >* {
        height: 60px !important;

      }

      .el-calendar-day {
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