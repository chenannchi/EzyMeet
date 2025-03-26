<template>
  <div class="page-container">
    <el-calendar v-model="value">
      <template #header="{ date }">

        <!-- <el-button-group class="w-full"> -->
        <!-- <el-button size="small" @click="selectDate('prev-year')">
            Previous Year
          </el-button> -->
        <el-button size="small" @click="selectDate('prev-month')" class="!w-auto">
          < </el-button>
            <!-- <el-button size="small" @click="selectDate('today')">Today</el-button> -->
            <span>{{ date }}</span>
            <el-button size="small" @click="selectDate('next-month')" class="!w-auto">
              >
            </el-button>
            <!-- <el-button size="small" @click="selectDate('next-year')">
            Next Year
          </el-button> -->
            <!-- </el-button-group> -->
      </template>
    </el-calendar>
    <el-form ref="meetingFormRef" :model="meeting" label-width="100px" class="meeting-form">
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
      <el-form-item label="受邀者" label-position="top" class="invitees">
      <el-select v-model="meeting.invitees" multiple placeholder="請選擇受邀者">
        <el-option v-for="invitee in invitees" :key="invitee" :label="invitee" :value="invitee" />
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
      <el-form-item label="其他資訊" label-position="top" class="otherInfo">
      <el-input v-model="meeting.otherInfo" type="textarea" placeholder="請輸入其他資訊" />
      </el-form-item>
    </el-form>
    <el-dialog v-model="agendaItemDialog" :before-close="handleCloseAgendaItemDialog">
      <!-- <div class="title"></div> -->
      <el-form ref="agendaItemFormRef" style="" :model="agendaItemForm" label-width="auto"
        status-icon>
        <el-form-item label="標題" prop="title">
          <el-input v-model="agendaItemForm.title" placeholder="請輸入標題" />
        </el-form-item>
        <el-form-item label="開始時間" prop="startTime">
          <el-time-select v-model="agendaItemForm.startTime" placeholder="請選擇開始時間" step="00:15" />
        </el-form-item>
        <el-form-item label="結束時間" prop="endTime">
          <el-time-select v-model="agendaItemForm.endTime" placeholder="請選擇結束時間" step="00:15" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="info" @click="handleAddAgendaItem">
          完成新增項目
        </el-button>
      </template>
    </el-dialog>
  </div>

</template>
<script setup lang="ts">
import type { Product } from '~/types/interfaces';
import {
  Plus
} from '@element-plus/icons-vue'
useHead({
  title: '行事曆'
})

const meeting = ref<any>({
  title: '',
  tag: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  location: '',
  link: '',
  invitees: [],
  agendaItems: [],
  otherInfo: '',
})

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

const agendaItemDialog = ref(false)


const handleAddAgendaItem = () => {
  // console.log('add agenda item')
  meeting.value.agendaItems.push(agendaItemForm.value)
  agendaItemDialog.value = false
}

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
  
  .el-calendar {
    width: 60%;
    margin: 0 auto;
  }

  >.el-form {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    // gap: 10px;
    flex-wrap: wrap;
  }

  > .el-form.meeting-form {
    width: 40%; 
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    
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
    &.otherInfo,
    &.agendaItems {
      width: 100%;
    }

    &.agendaItems {
      :deep(.el-form-item__label) {
        width: 100%;
      }
    }
  }


  // >* {
  //   width: 100%;
  //   max-width: 800px;
  //   margin: 0 auto;
  // }
}
</style>