<template>
  <div class="page-container">
    <el-form ref="meetingFormRef" :model="meeting" label-width="100px" class="meeting-form">
      <div>

        <el-form-item label="標題" label-position="top">
          <el-input v-model="meeting.title" placeholder="請輸入標題" />
        </el-form-item>
        <el-form-item label="標籤" label-position="top">
          <el-input v-model="meeting.tag" placeholder="請輸入標籤" />
        </el-form-item>
        <el-form-item label="開始日期" label-position="top">
          <el-date-picker v-model="meeting.startDate" type="date" placeholder="請選擇開始日期" />
        </el-form-item>
        <el-form-item label="開始時間" label-position="top">
          <el-time-select v-model="meeting.startTime" step="00:15" placeholder="請選擇開始時間" />
        </el-form-item>
        <el-form-item label="結束日期" label-position="top">
          <el-date-picker v-model="meeting.endDate" type="date" placeholder="請選擇結束日期" />
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
        <el-form-item label="出席者" label-position="top" class="attendees">
          <el-select v-model="meeting.attendees" multiple placeholder="請選擇出席者">
            <el-option v-for="attendee in attendees" :key="attendee" :label="attendee" :value="attendee" />
          </el-select>
        </el-form-item>
        <el-form-item label="不出席者" label-position="top" class="absentees">
          <el-select v-model="meeting.absentees" multiple placeholder="請選擇不出席者">
            <el-option v-for="absentee in absentees" :key="absentee" :label="absentee" :value="absentee" />
          </el-select>
        </el-form-item>
        <el-form-item label="尚未回覆者" label-position="top" class="noResponse">
          <el-select v-model="meeting.noResponse" multiple placeholder="請選擇尚未回覆者">
            <el-option v-for="noResponse in noResponses" :key="noResponse" :label="noResponse" :value="noResponse" />
          </el-select>
        </el-form-item>
        <el-form-item label-position="top" class="agendaItems">
          <template #label>
            <div class="flex justify-between items-center">
              <div>議程項目</div>
              <el-button :icon="Plus" class="!w-auto !m-0" circle @click="handleOpenItemDialog"></el-button>
            </div>
          </template>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="其他資訊" label-position="top" class="otherInfo">
          <el-input v-model="meeting.otherInfo" type="textarea" placeholder="請輸入其他資訊" />
        </el-form-item>
        <el-form-item label="會議記錄" label-position="top" class="meetingNotes">
          <el-input v-model="meeting.meetingNotes" type="textarea" placeholder="請輸入會議記錄" />
        </el-form-item>
        <el-form-item label="留言" label-position="top" class="comments">
          <el-input v-model="meeting.comments" type="textarea" placeholder="請輸入留言" />
        </el-form-item>
        <!-- *使用者留言區 -->
        <!-- <div class="flex justify-center items-center">
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div> -->
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Plus } from '@element-plus/icons-vue';

useHead({
  title: '會議資訊'
});

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

const attendees = ref<string[]>(['John Doe', 'Jane Smith']); // Example data
const absentees = ref<string[]>(['Alice Johnson', 'Bob Brown']); // Example data
const noResponses = ref<string[]>(['Charlie Davis', 'Dana White']); // Example data

const handleOpenItemDialog = () => {
  // Handle opening the item dialog
};
</script>

<style scoped lang="scss">
.page-container {
  padding-top: 50px;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
  max-width: 60vw;
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

      >*{
        width: 50%;
        padding: 0 10px;
      }
    }
    >div:last-child {
      display: flex;
      width: 50%;
      flex-wrap: wrap;
      // flex-direction: column;
      // gap: 20px;
      >*{
        width: 100%;
        padding: 0 10px;
      }
    }
  }
}
</style>