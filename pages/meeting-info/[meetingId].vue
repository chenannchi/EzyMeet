<template>
  <div class="page-container">
    <div class="flex justify-between items-center w-full">
      <div class="text-2xl font-bold w-full">會議資訊</div>
      <el-button type="default" @click="$router.push('/calendar')" class="!w-[120px]">返回日曆</el-button>
      <el-button v-if="mode === 'read' && userId !== meeting.host" type="primary" class="mr-auto !w-[120px]" @click="handleEdit">
        編輯
      </el-button>
      <el-button v-if="mode === 'edit'" type="success" class="mr-auto !w-[120px]" @click="handleSaveMeeting">
        儲存
      </el-button>
      <el-button v-if="mode === 'edit'" type="info" class="mr-auto !w-[120px]" @click="cancelEdit">
        取消
      </el-button>
    </div>
    <el-divider class="!my-2"></el-divider>
    <el-form ref="meetingFormRef" :model="meeting" label-width="100px" class="meeting-form" :rules="rules" v-loading="meeting.title === ''">
      <div>

        <el-form-item label="標題" label-position="top" prop="title">
          <el-input v-model="meeting.title" placeholder="請輸入標題" :disabled="mode === 'read'" prop="title" />
        </el-form-item>
        <el-form-item label="標籤" label-position="top">
          <el-input v-model="meeting.label" placeholder="請輸入標籤" :disabled="mode === 'read'" />
        </el-form-item>
        <el-form-item label="開始日期" label-position="top" prop="startDate">
          <el-date-picker v-model="meeting.startDate" type="date" placeholder="請選擇開始日期" :disabled-date="disabledDate"
            :disabled="mode === 'read'" />
        </el-form-item>
        <el-form-item label="開始時間" label-position="top" prop="startTime">
          <el-time-select v-model="meeting.startTime" step="00:15" placeholder="請選擇開始時間" :disabled="mode === 'read'" />
        </el-form-item>
        <el-form-item label="結束日期" label-position="top" prop="endDate">
          <el-date-picker v-model="meeting.endDate" type="date" placeholder="請選擇結束日期" :disabled-date="disabledDate"
            :disabled="mode === 'read'" />
        </el-form-item>
        <el-form-item label="結束時間" label-position="top" prop="endTime">
          <el-time-select v-model="meeting.endTime" step="00:15" placeholder="請選擇結束時間" :disabled="mode === 'read'" />
        </el-form-item>
        <el-form-item label="地點" label-position="top">
          <el-input v-model="meeting.location" placeholder="請輸入地點" :disabled="mode === 'read'" />
        </el-form-item>
        <el-form-item label="連結" label-position="top">
          <el-input v-model="meeting.link" placeholder="請輸入連結" :disabled="mode === 'read'" />
        </el-form-item>
        <!-- <el-form-item label="新增受邀者" label-position="top" class="invitees !w-full">
        <el-select v-model="meeting.invitees" multiple placeholder="請選擇受邀者">
        <el-option v-for="invitee in invitees" :key="invitee.id" :label="invitee.email" :value="invitee.id" />
        </el-select>
      </el-form-item> -->
        <el-form-item label="出席者" label-position="top" class="attendees !w-full">
          <el-select v-model="meeting.attendees" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="3"
            placeholder="" :disabled="mode === 'read'" suffix-icon="">
            <el-option v-for="attendee in participantsData.acceptedParticipants" :key="attendee.userId"
              :label="attendee.name + ' <' + attendee.email + '>'" :value="attendee.userId" />
          </el-select>
        </el-form-item>
        <el-form-item label="不出席者" label-position="top" class="absentees !w-full">
          <el-select v-model="meeting.absentees" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="3"
            placeholder="" :disabled="mode === 'read'" suffix-icon="">
            <el-option v-for="absentee in participantsData.declinedParticipants" :key="absentee.userId"
              :label="absentee.name + ' <' + absentee.email + '>'" :value="absentee.userId" />
          </el-select>
        </el-form-item>
        <el-form-item label="尚未回覆者" label-position="top" class="noResponses !w-full">
          <el-select v-model="meeting.noResponses" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="3"
            placeholder="" :disabled="mode === 'read'" suffix-icon="">
            <el-option v-for="participant in participantsData.invitedParticipants" :key="participant.userId"
              :label="participant.name + ' <' + participant.email + '>'" :value="participant.userId" />
          </el-select>
        </el-form-item>
        <el-form-item label-position="top" class="agendaItems !w-full">
          <template #label>
            <div class="flex justify-between items-center">
              <div>議程項目</div>
              <el-button :icon="Plus" class="!w-auto !m-0" circle @click="handleOpenItemDialog('add')"
                v-if="mode === 'edit'"></el-button>
            </div>
          </template>
          <el-table :data="agendaItemsData" style="width: 100%" empty-text="目前尚無議程">
            <el-table-column prop="title" label="標題" />
            <el-table-column label="時間">
              <template #default="{ row }">
                {{ row.startTime }} - {{ row.endTime }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="60px" v-if="mode === 'edit'">
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
        <el-form-item label="其他資訊" label-position="top" class="description !w-full">
          <el-input v-model="meeting.description" type="textarea" placeholder="請輸入其他資訊" :disabled="mode === 'read'" />
        </el-form-item>
      </div>
      <div>
        <el-form-item label="會議記錄" label-position="top" class="meetingNote">
          <el-input v-if="meetingFinished" v-model="meeting.meetingNote" type="textarea" placeholder="請輸入會議記錄"
            :rows="25" :disabled="mode === 'read'" />
          <div v-else class="w-full border border-2 border-dashed h-[200px] text-center self-center">尚未開放會議記錄專區</div>
        </el-form-item>
        <el-form-item label="留言" label-position="top" class="comments">
          <el-input v-if="meetingFinished" v-model="meeting.comments" type="textarea" placeholder="請輸入留言" :rows="5"
            :disabled="mode === 'read'" />
          <div v-else>尚未開放留言專區</div>
        </el-form-item>
      </div>
    </el-form>
    <el-button type="danger" @click="deleteMeetingDialog = true" class="!w-[120px]"
      v-if="mode === 'edit'">刪除會議</el-button>
  </div>
  <el-dialog v-model="agendaItemDialog" :before-close="handleCloseAgendaItemDialog">
    <el-form ref="agendaItemFormRef" style="" :model="agendaItemForm" label-width="auto" status-icon
      :rules="agendaRules">
      <el-form-item label="標題" prop="title">
        <el-input v-model="agendaItemForm.title" placeholder="請輸入標題" prop="title" />
      </el-form-item>
      <el-form-item label="開始時間" prop="startTime">
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
  <el-dialog title="刪除會議" v-model="deleteMeetingDialog" width="30%" :before-close="handleCloseDeleteMeetingDialog">
    <p>確定要刪除這個會議嗎？</p>
    <template #footer>
      <div class="flex justify-center items-center gap-2 mt-8">
        <el-button type="info" @click="deleteMeetingDialog = false" class="!mt-0">取消</el-button>
        <el-button type="primary" @click="handleDeleteMeeting()">刪除</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Plus, DeleteFilled, Edit } from '@element-plus/icons-vue';
// Removed unused imports
import { useRoute } from 'vue-router';
import type { invalidateTypeCache } from 'vue/compiler-sfc';
import type { FormRules } from 'element-plus';

useHead({
  title: '會議資訊'
});
const userId = ref('')
const mode = ref<'read' | 'edit'>('read');
const route = useRoute();
const router = useRouter();
const id = route.params.meetingId as string;

const agendaItemFormRef = ref<any>(null);
const meetingFormRef = ref<any>(null);
const agendaItemsData = ref<any[]>([]);
const deleteMeetingDialog = ref(false)
const agendaItemDialog = ref(false)
const agendaCreateMode = ref(true)


const participantsData = ref<any>({
  invitedParticipants: [],
  aceeptedParticipants: [],
  declinedParticipants: [],

});

interface RuleForm {
  host?: string; // Optional host property
  title: string;
  label: string;
  startDate: string | Date;
  startTime: string;
  endDate: string | Date;
  endTime: string;
  location: string;
  link: string;
  attendees: string[];
  absentees: string[];
  noResponses: string[];
  agendaItems: any[];
  description: string;
  meetingNote: string;
  comments: string; // Added comments property
}
const meeting = ref<RuleForm>({
  title: '',
  label: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  location: '',
  link: '',
  attendees: [],
  absentees: [],
  noResponses: [],
  agendaItems: [],
  description: '',
  meetingNote: '',
  comments: '', // Initialized comments property
});

const agendaItemForm = ref<any>({
  title: '',
  startTime: '',
  endTime: '',
})

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

const meetingFinished = ref(false)


function handleSaveMeeting() {
  if (!meetingFormRef.value) return;
  meetingFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        console.log('meeting', meeting.value);
        const { startTimeStamp, endTimeStamp } = generateTimestamps();
        const requestBody = createRequestBody(startTimeStamp, endTimeStamp);

        const response = await fetch(`http://localhost:8080/meetings/update/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (response.status === 409) {
          ElMessage({
            message: '會議時間衝突，請重新選擇',
            type: 'warning',
          });
          meetingFormRef.value.resetFields('startTime');
          meetingFormRef.value.resetFields('endTime');
          return;
        }

        if (response.status === 200) {
          ElMessage({
            message: '會議更新成功!',
            type: 'success',
          });

          originalMeeting.value = { ...meeting.value };

          mode.value = 'read';
        } else {
          ElMessage.error('會議更新失敗');
        }
      } catch (error) {
        console.error('會議更新請求失敗', error);
        ElMessage.error('會議更新請求失敗');
      }
    } else {
      console.log('Validation failed');
      ElMessage.warning('請完成必填欄位');
    }
  });
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


function createRequestBody(startTimeStamp: any, endTimeStamp: any) {
  const allParticipants = [
    ...(meeting.value.attendees || []).map((user: any) => ({
      userId: typeof user === 'string' ? user : user.userId,
      status: 'ACCEPTED'
    })),
    ...(meeting.value.absentees || []).map((user: any) => ({
      userId: typeof user === 'string' ? user : user.userId,
      status: 'DECLINED'
    })),
    ...(meeting.value.noResponses || []).map((user: any) => ({
      userId: typeof user === 'string' ? user : user.userId,
      status: 'INVITED'
    }))
  ];


  return {
    title: meeting.value.title,
    label: meeting.value.label,
    timeslot: { startDate: startTimeStamp, endDate: endTimeStamp },
    host: userId.value,
    location: meeting.value.location,
    link: meeting.value.link,
    participants: allParticipants,
    description: meeting.value.description || '',
    meetingRecord: meeting.value.meetingNote || '',
  };
}




const handleAddAgendaItem = () => {
  agendaItemFormRef.value.validate((valid: boolean) => {
    if (valid) {
      console.log('add agenda item');
      console.log('agendaItemForm', agendaItemForm.value);
      agendaItemsData.value.push({ ...agendaItemForm.value });
      console.log('agendaItemsData', agendaItemsData.value);
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

const handleCloseDeleteMeetingDialog = () => {
  deleteMeetingDialog.value = false;
}

const cancelEdit = () => {
  mode.value = 'read';
  meeting.value = originalMeeting.value ? { ...originalMeeting.value } : {
    title: '',
    label: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    link: '',
    attendees: [],
    absentees: [],
    noResponses: [],
    agendaItems: [],
    description: '',
    meetingNote: '',
    comments: '', // Added missing comments property
  }; // Reset to original meeting data
};

const handleDeleteMeeting = async () => {
  try {
    const response = await fetch(`http://localhost:8080/meetings/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.text();

    console.log('response', response.status);

    if (response.status === 200) {

      ElMessage({
        message: `成功刪除${responseData}會議!`,
        type: 'success',
      })
      await router.push({ path: '/calendar' });
    } else {
      ElMessage.error(`會議刪除失敗`)
    }
  } catch (error) {
    console.error('會議刪除請求失敗', error);
  }

  deleteMeetingDialog.value = false;

}

const originalMeeting = ref<RuleForm>({
  title: '',
  label: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  location: '',
  link: '',
  attendees: [],
  absentees: [],
  noResponses: [],
  agendaItems: [],
  description: '',
  meetingNote: '',
  comments: ''
});

const handleEdit = () => {
  mode.value = 'edit';
  originalMeeting.value = { ...meeting.value };  // Clear validation when switching to edit mode
};

const fetchSingleMeeting = async () => {
  try {
    const response = await fetch(`http://localhost:8080/meetings/meeting/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();

    console.log('responseData', responseData);
    if (response.status === 200) {
      const responseStartDate = responseData.timeslot.startDate
      const responseEndDate = responseData.timeslot.endDate
      meeting.value =
      {
        host: responseData.host,
        title: responseData.title,
        label: responseData.label,
        startDate: new Date(responseStartDate),
        startTime: new Date(responseData.timeslot.startDate).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
        endDate: new Date(responseEndDate),
        endTime: new Date(responseEndDate).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
        location: responseData.location,
        link: responseData.link,
        attendees: responseData.acceptedParticipants.map((participant: any) => participant.userId),
        absentees: responseData.declinedParticipants.map((participant: any) => participant.userId),
        noResponses: responseData.invitedParticipants.map((participant: any) => participant.userId),
        agendaItems: responseData.agendaItems,
        description: responseData.description,
        meetingNote: responseData.meetingRecord || '', // Added meetingNote property
        comments: responseData.comments || '', // Added comments property
      };
      participantsData.value = {
        invitedParticipants: responseData.invitedParticipants,
        acceptedParticipants: responseData.acceptedParticipants,
        declinedParticipants: responseData.declinedParticipants,
      };



    } else {
      console.error('會議資訊獲取失敗', responseData);
    }
  } catch (error) {
    console.error('會議資訊請求失敗', error);
  }
};

const disabledDate = (time: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to the start of today
  return time.getTime() < today.getTime();
}

const validateAgendaStartTime = (_: any, value: string, callback: Function) => {
  if (!value) {
    return callback(new Error('請選擇時間'));
  } else if (agendaItemForm.value.endTime && agendaItemForm.value.startTime >= agendaItemForm.value.endTime) {
    return callback(new Error('結束時間必須晚於開始時間'));
  }
  callback();
};

const validateAgendaEndTime = (_: any, value: string, callback: Function) => {
  if (!value) {
    return callback(new Error('請選擇時間'));
  } else if (agendaItemForm.value.startTime && agendaItemForm.value.startTime >= agendaItemForm.value.endTime) {
    return callback(new Error('結束時間必須晚於開始時間'));
  }
  callback();
};

const fakeTableData = ref<{ id: number; title: string; startTime: string; endTime: string }[]>([
  // { id: 1, title: '會議議程1', startTime: '09:00', endTime: '10:00' },
  // { id: 2, title: '會議議程2', startTime: '10:00', endTime: '11:00' },
]);

function areSameDay(date1: string | Date, date2: string | Date) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

const validateEndTime = (_: any, value: string, callback: Function) => {
  if (!value) {
    return callback(new Error('請選擇開始日期'));
  } else if (
    areSameDay(meeting.value.startDate, meeting.value.endDate) &&
    meeting.value.startTime && meeting.value.startTime >= value) {
    meetingFormRef.value.resetFields('endTime');
    return callback(new Error('結束時間必須晚於開始時間'));
  }
  callback();
};

// const validateStartTime = (_: any, value: string, callback: Function) => {
//   // console.log('validateStartTime', value, agendaItemForm.value.endTime)
//   if (!value) {
//     return callback(new Error('請選擇開始時間'));
//   } else if (
//     meeting.value.startTime &&
//     meeting.value.endTime &&
//     meeting.value.startDate === meeting.value.endDate &&
//     meeting.value.startTime >= meeting.value.endTime
//   ) {
//     return callback(new Error('開始時間必須早於結束時間'));
//   }else if (
//     meeting.value.startDate &&
//     meeting.value.endDate &&
//     meeting.value.startTime >= meeting.value.endTime
//   ) {
//     return callback(new Error('開始時間必須早於結束時間'));
//   }
//   callback();
//   // agendaItemFormRef.value.clearValidate('endTime'); // Clear end time validation if start time is valid
// };

// const validateStartDate = (_: any, value: string, callback: Function) => {
//   // console.log('validateStartDate', value, meeting.value.endDate)
//   if (!value) {
//     return callback(new Error('請選擇開始日期'));
//   } else if (meeting.value.endDate && new Date(value) > new Date(meeting.value.endDate)) {
//     return callback(new Error('開始日期必須早於結束日期'));
//   }
//   callback();
// };
const validateEndDate = (_: any, value: string, callback: Function) => {
  if (!value) {
    return callback(new Error('請選擇結束日期'));
  } else if (meeting.value.startDate && new Date(value) < new Date(meeting.value.startDate)) {
    meetingFormRef.value.resetFields('endDate');
    meetingFormRef.value.resetFields('endTime');
    return callback(new Error('結束日期必須晚於開始日期'));
  }
  callback();
};

const rules = reactive<FormRules<RuleForm>>({
  title: [{ required: true, message: '請輸入標題', trigger: 'change' }],
  startDate: [{ required: true, message: '請輸入開始日期', trigger: 'change' }],
  endDate: [{ required: true, validator: validateEndDate, trigger: 'change' }],
  startTime: [{ required: true, message: '請輸入開始時間', trigger: 'change' }],
  endTime: [{ required: true, validator: validateEndTime, trigger: 'change' }],
})

const agendaRules = reactive<FormRules<any>>({
  title: [{ required: true, message: '請輸入標題', trigger: 'change' }],
  startTime: [{ required: true, validator: validateAgendaStartTime, trigger: 'change' }],
  endTime: [{ required: true, validator: validateAgendaEndTime, trigger: 'change' }],
})

onMounted(async () => {
  const user = localStorage.getItem('user');
  userId.value = user ? JSON.parse(user).id : '';
  await fetchSingleMeeting();
  agendaItemsData.value = fakeTableData.value.map((item) => {
    return {
      id: item.id,
      title: item.title,
      startTime: item.startTime,
      endTime: item.endTime,
    };
  });
  meetingFinished.value = meeting.value.endDate <= new Date() && meeting.value.endTime < new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
})
</script>

<style scoped lang="scss">
.page-container {
  padding-top: 50px;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;

  .meeting-form {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    // flex-direction: column;
    gap: 20px;
    // height: 100vh;

    >div:first-child {
      display: flex;
      // flex-direction: column;
      width: 50%;
      // gap: 20px;
      flex-wrap: wrap;

      >* {
        width: 50%;
        padding: 0 10px;
      }
    }

    >div:last-child {
      display: flex;
      width: 50%;
      // flex-wrap: wrap;
      // justify-content: flex-start;
      // align-items: flex-start;
      flex-direction: column;

      // gap: 20px;
      >* {
        width: 100%;
        padding: 0 10px;
      }
    }
  }
}
</style>