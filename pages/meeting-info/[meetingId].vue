<template>
  <div class="page-container">
    <div class="flex justify-between items-center w-full">
      <div class="text-2xl font-bold w-full">會議資訊</div>
      <el-button type="secondary" @click="$router.push('/calendar')" class="!w-[120px]">返回日曆</el-button>
      <el-button v-if="mode === 'read'" type="primary" class="mr-auto !w-[120px]" @click="mode = 'edit'">
        編輯
      </el-button>
      <el-button v-if="mode === 'edit'" type="success" class="mr-auto !w-[120px]" @click="updateMeeting">
        儲存
      </el-button>
      <el-button v-if="mode === 'edit'" type="info" class="mr-auto !w-[120px]" @click="cancelEdit">
        取消
      </el-button>
    </div>
    <el-divider class="!my-2"></el-divider>
    <el-form ref="meetingFormRef" :model="meeting" label-width="100px" class="meeting-form">
      <div>

        <el-form-item label="標題" label-position="top">
          <el-input v-model="meeting.title" placeholder="請輸入標題" :disabled="mode === 'read'" />
        </el-form-item>
        <el-form-item label="標籤" label-position="top">
          <el-input v-model="meeting.tag" placeholder="請輸入標籤" :disabled="mode === 'read'" />
        </el-form-item>
        <el-form-item label="開始日期" label-position="top">
          <el-date-picker v-model="meeting.startDate" type="date" placeholder="請選擇開始日期" :disabled="mode === 'read'" />
        </el-form-item>
        <el-form-item label="開始時間" label-position="top">
          <el-time-select v-model="meeting.startTime" step="00:15" placeholder="請選擇開始時間" :disabled="mode === 'read'" />
        </el-form-item>
        <el-form-item label="結束日期" label-position="top">
          <el-date-picker v-model="meeting.endDate" type="date" placeholder="請選擇結束日期" :disabled="mode === 'read'" />
        </el-form-item>
        <el-form-item label="結束時間" label-position="top">
          <el-time-select v-model="meeting.endTime" step="00:15" placeholder="請選擇結束時間" :disabled="mode === 'read'" />
        </el-form-item>
        <el-form-item label="地點" label-position="top">
          <el-input v-model="meeting.location" placeholder="請輸入地點" :disabled="mode === 'read'" />
        </el-form-item>
        <el-form-item label="連結" label-position="top">
          <el-input v-model="meeting.link" placeholder="請輸入連結" :disabled="mode === 'read'" />
        </el-form-item>
        <el-form-item label="出席者" label-position="top" class="attendees !w-full">
          <el-select v-model="meeting.attendees" multiple placeholder="請選擇出席者" :disabled="mode === 'read'">
            <el-option v-for="attendee in attendees" :key="attendee" :label="attendee" :value="attendee" />
          </el-select>
        </el-form-item>
        <el-form-item label="不出席者" label-position="top" class="absentees !w-full">
          <el-select v-model="meeting.absentees" multiple placeholder="請選擇不出席者" :disabled="mode === 'read'">
            <el-option v-for="absentee in absentees" :key="absentee" :label="absentee" :value="absentee" />
          </el-select>
        </el-form-item>
        <el-form-item label="尚未回覆者" label-position="top" class="noResponse !w-full">
          <el-select v-model="meeting.noResponse" multiple placeholder="請選擇尚未回覆者" :disabled="mode === 'read'">
            <el-option v-for="noResponse in noResponses" :key="noResponse" :label="noResponse" :value="noResponse" />
          </el-select>
        </el-form-item>
        <el-form-item label-position="top" class="agendaItems !w-full">
          <template #label>
            <div class="flex justify-between items-center">
              <div>議程項目</div>
              <el-button :icon="Plus" class="!w-auto !m-0" circle @click="handleOpenItemDialog"
                :disabled="mode === 'read'"></el-button>
            </div>
          </template>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="title" label="標題" />
            <el-table-column label="時間">
              <template #default="{ row }">
                {{ row.startTime }} - {{ row.endTime }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="60px" v-if="mode === 'edit'">
              <template #default="{ row }">
                <div class="flex justify-center items-center gap-1">
                  <el-icon @click="handleEditAgendaItem(row)" class="!m-0 !p-0 !w-auto !fill-blue-500"
                    :disabled="mode === 'read'">
                    <Edit class="!text-blue-500" />
                  </el-icon>
                  <el-icon @click="handleDeleteAgendaItem(row)" class="!m-0 !p-0 !w-auto" :disabled="mode === 'read'">
                    <DeleteFilled class="!text-red-500" />
                  </el-icon>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="其他資訊" label-position="top" class="otherInfo !w-full">
          <el-input v-model="meeting.otherInfo" type="textarea" placeholder="請輸入其他資訊" :disabled="mode === 'read'" />
        </el-form-item>
      </div>
      <div>
        <el-form-item label="會議記錄" label-position="top" class="meetingNotes">
          <el-input v-model="meeting.meetingNotes" type="textarea" placeholder="請輸入會議記錄" :rows="25"
            :disabled="mode === 'read'" />
        </el-form-item>
        <el-form-item label="留言" label-position="top" class="comments">
          <el-input v-model="meeting.comments" type="textarea" placeholder="請輸入留言" :rows="5"
            :disabled="mode === 'read'" />
        </el-form-item>
      </div>
    </el-form>
    <el-button type="danger" @click="deleteMeetingDialog = true" class="!w-[120px]">刪除會議</el-button>
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
        完成新增項目
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
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { useRoute } from 'vue-router';

const mode = ref<'read' | 'edit'>('read'); // Default to 'read' mode
const route = useRoute();
const id = route.params.meetingId as string;

useHead({
  title: '會議資訊'
});

const deleteMeetingDialog = ref(false)
const handleCloseDeleteMeetingDialog = () => {
  deleteMeetingDialog.value = false;
}

const meeting = ref<any>({
  title: '',
  tag: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  location: '',
  link: '',
  attendees: [],
  absentees: [],
  noResponse: [],
  agendaItems: [],
  otherInfo: '',
});

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

const fakeTableData = ref([
  { id: 1, title: '會議議程1', startTime: '09:00', endTime: '10:00' },
  { id: 2, title: '會議議程2', startTime: '10:00', endTime: '11:00' },
]);

const tableData = ref<any[]>([]);

const attendees = ref<string[]>(['John Doe', 'Jane Smith']); // Example data
const absentees = ref<string[]>(['Alice Johnson', 'Bob Brown']); // Example data
const noResponses = ref<string[]>(['Charlie Davis', 'Dana White']); // Example data

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

async function handleDeleteMeeting() {
  /**
   * TODO: meetId 要更換成真實的 meetId 
   * */
  try {
    const response = await fetch(`http://localhost:8080/meetings/delete/${"TMpNeQfNW3jvLjNDaFlW"}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();

    if (response.status === 200) {
      // console.log('會議刪除成功');
      ElMessage({
        message: `成功刪除${responseData.title}會議!`,
        type: 'success',
      })
      router.push({path:'/calendar'})
      // Handle success, e.g., redirect to another page or show a success message
    } else {
      ElMessage.error(`會議刪除失敗`)
      // Handle error, e.g., show an error message
    }
  } catch (error) {
    console.error('會議刪除請求失敗', error);
    // Handle network error, e.g., show an error message
  }

  deleteMeetingDialog.value = false;

}

const updateMeeting = () => {
  // Save the changes to the meeting data
  console.log('儲存會議資訊', meeting.value);
  mode.value = 'read';
};

const cancelEdit = () => {
  mode.value = 'read';
  // Reset the form to the original meeting data
  meeting.value = {
    title: '',
    tag: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    link: '',
    attendees: [],
    absentees: [],
    noResponse: [],
    agendaItems: [],
    otherInfo: '',
  };
};

const fetchSingleMeeting = async (id: string) => {
  try {
    // const meetingData = await getSingleMeeting(id);
    // meeting.value = meetingData;
    console.log('獲取會議資訊', id);
  } catch (error) {
    console.error('獲取會議資訊失敗', error);
  }
};



onMounted(() => {
  fetchSingleMeeting(id);
  tableData.value = fakeTableData.value.map((item) => {
    return {
      title: item.title,
      startTime: item.startTime,
      endTime: item.endTime,
    };
  });
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