<template>
  <div v-if="!readonly">
    <ClientOnly>
      <el-select v-bind="$attrs" v-model="selectId" :suffix-icon="ElIconCaretBottom">
        <el-option v-for="item in items" :key="item.id" :label="item.label" :value="item.id" @click="clickItem(item.id)" />
      </el-select>
    </ClientOnly>
  </div>
  <!-- <div v-else>
    <CustomInput v-model="selectLabel" disabled />
  </div> -->
</template>

<script setup lang="ts">
const emit = defineEmits(['change']);
const props = withDefaults(
  defineProps<{
    h?: number;
    items?: any[];
    value: number;
    readonly?: boolean;
  }>(),
  {
    h: 36,
    items: () => {
      return [
        { id: 10, label: '10' },
        { id: 20, label: '20' },
        { id: 50, label: '50' },
        { id: 100, label: '100' },
      ];
    },
    readonly: false,
  }
);
const height = props.h + 'px';
const selectId = ref();
const selectLabel = ref();
selectId.value = props.value;
selectLabel.value = props.items.filter((x: any) => x.id == selectId.value)[0]?.label;

const clickItem = (id: any) => {
  selectId.value = id;
  emit('change', selectId.value);
};
</script>
<style lang="scss" scoped>
:deep(.el-select__wrapper) {
  box-shadow: 0 0 0 1px #c4c4c4 inset !important;
  height: v-bind(height) !important;
  min-width: 80px;
}

:deep(.el-select__caret) {
  color: black;
  height: 18px;
  width: 18px;
}
</style>
