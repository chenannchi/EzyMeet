<template>
  <div class="product-card relative">
    
    <div class="product-card__image">
      <img :src="product.Product.image" alt="product.name" />
    </div>
    
    <div class="product-card__info">
      <h3>{{ product.Product.name }}</h3>
      <p>${{ product.Product.price }}</p>
    </div>
    <el-select v-model="product.quantity" placeholder="選擇數量" @change="handleQuantityChange">
      <el-option
        v-for="n in 10"
        :key="n"
        :label="n"
        :value="n"
      ></el-option>
    </el-select>
    <el-icon
      class="remove-icon absolute top-0 right-0 m-2 cursor-pointer !text-red-500 !font-bold"
      @click="handleRemoveProduct"
      size="24"
    >
      <Close  />
    </el-icon>
  </div>
</template>
<script setup lang="ts">
import {Close} from '@element-plus/icons-vue';
import type { OrderItem} from '~/types/interfaces';

const props = defineProps<{
  product: OrderItem;
}>();

const emits = defineEmits(['update:product', 'remove']);

const handleQuantityChange = () => {
  emits('update:product', props.product);
};

const handleRemoveProduct = () => {
  props.product.quantity = 0;
  emits('remove', props.product);
};
</script>
<style lang="scss" scoped>
.product-card {
  display: flex;
  // flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
  padding:15px;
  justify-content: center;
  align-items: flex-start;
  background-color: $secondary;
  .product-card__image {
    img {
      width: 200px;
      // height: 100%;
      object-fit: cover;
    }
  }
  .product-card__info {
    display: flex;
    width: 100%;
    padding: 0 1rem;
    flex-direction: column;
    align-items: flex-start;
    h3 {
      font-size: 1.5rem;
      margin: 0;
    }
    p {
      margin: 0.5rem 0;
    }
  }
  .el-select{
    margin: auto 0;
    width: 200px;
  }
}
</style>
