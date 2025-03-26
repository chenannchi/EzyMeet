<template>
  <div class="page-container">

    <div class="left-filter">
      <el-input v-model="searchKeyword" size="large" placeholder="請輸入產品名稱" :prefix-icon="Search" />

      <div class="flex flex-col gap-1">
        <div class="title">產品類別</div>
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
          全選
        </el-checkbox>
        <el-checkbox-group v-model="checkedCategories" @change="handleCheckedCategoriesChange" class="flex flex-col gap-2">
          <el-checkbox v-for="category in categories" :key="category.categoryId" :label="category.name" :value="category.categoryId">
            {{ category.name }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <!-- <div class="price-interval">
        <div class="title">價格區間</div>
        <div class="flex flex-col gap-2 align-start justify-start">
          <el-input v-model="minPrice" placeholder="最小值" />
          <div class="my-auto mx-auto">-</div>
          <el-input v-model="maxPrice" placeholder="最大值" @blur="checkPriceRange" />
        </div>
      </div> -->
      <!-- <el-button type="info" plain @click="handleReset">清除篩選條件</el-button> -->
    </div>
    <div class="product-list">
      <div class="card" v-if="filteredProducts.length" v-for="product in filteredProducts" :key="product.productId"
        @click="navigateToDetail(product.productId)">
        <div class="card-image">
          <img :src="product.image" alt="Placeholder image" />
        </div>
        <div class="card-content">
          <div class="media">
            <div class="media-content">
              <p class="title is-4">{{ product.name }}</p>
              <p class="subtitle is-6">NT$ {{ product.price }}</p>
            </div>
          </div>
          <div class="content">
            {{ product.description }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import type { CheckboxValueType } from 'element-plus';
import type { Product, Category } from '@/types/interfaces';

useHead({
  title: '商品列表',
});

const searchKeyword = ref('');
const filteredProducts = ref<Product[]>([]);

// search filter
// const handleSearch = () => {
//   filteredProducts.value = productList.value.filter((product) => product.name.includes(searchKeyword.value));
// };
const router = useRouter();
const navigateToDetail = (id: number) => {  
  router.push(`/product/${id}`);
};

const handleReset = () => {
  searchKeyword.value = '';
  checkedCategories.value = [];
  minPrice.value = 0;
  maxPrice.value = 0;
  checkAll.value = false;
};

const checkAll = ref(false);
const isIndeterminate = ref(false);
const categories = ref<Category[]>([]);
const checkedCategories = ref<number[]>([]);

// Category filter
const handleCheckAllChange = (val: CheckboxValueType) => {
  checkedCategories.value = val ? categories.value.map(category => category.categoryId) : [];
  isIndeterminate.value = false;
};

const handleCheckedCategoriesChange = (value: string[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === categories.value.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < categories.value.length;
};

// price filter
const minPrice = ref<number>(0);
const maxPrice = ref<number>(0);

const checkPriceRange = () => {
  if (minPrice.value > maxPrice.value) {
    const temp = minPrice.value;
    minPrice.value = maxPrice.value;
    maxPrice.value = temp;
  }
};

watch([searchKeyword, checkedCategories, minPrice, maxPrice], () => {
  filteredProducts.value = productList.value.filter((product) => {
    const matchesCategory = checkedCategories.value.length === 0 || checkedCategories.value.includes(product.categoryId);
    const matchesPrice = (minPrice.value === 0 || product.price >= minPrice.value) && 
                         (maxPrice.value === 0 || product.price <= maxPrice.value);
    const matchesKeyword = product.name.toLowerCase().includes(searchKeyword.value.toLowerCase());
    return matchesCategory && matchesPrice && matchesKeyword;
  });
});

const productList = ref<Product[]>([]);

// write a getProduct api call
async function handleFetchProducts() {
  try {
    const res = await $fetch<any>('http://localhost:5005/giftopia/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('res:', res.data);
    productList.value = res.data;
    filteredProducts.value = res.data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
}

async function handleFetchCategories() {
  try {
    const res = await $fetch<any>('http://localhost:5005/giftopia/products/categories', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('res:', res.data);
    categories.value = res.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
};


onMounted(() => {
  handleFetchProducts();
  handleFetchCategories();
});
</script>
<style lang="scss" scoped>
.left-filter {
  width: 20%;
  float: left;
  padding: 10px;

  display: flex;
  flex-direction: column;
  gap: 30px;
}

.product-list {
  width: 80%;
  float: left;
  padding: 0 10px;
  display: flex;
  flex-wrap: wrap;
  // gap: 5%;
  // row-gap: 25px;

  .card {
    width: 33%;
    min-width: 200px;
    max-width: 300px;
    float: left;
    padding: 20px;
    // background-color: pink;
    border-radius: 20px;

    &:hover {
      cursor: pointer;
    }


    .card-image {
      background-color: $secondary;
      border-radius: 20px;
      
      img {
        margin: 0 auto;
        border-radius: 5%;
        height: 200px;
      }
    }

    .card-content {
      padding: 20px 0;

      .media {
        .media-content {
          .title {
            font-size: 1.5rem;
          }

          .subtitle {
            font-size: 1rem;
          }
        }


      }

      .content {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
      }
    }
  }
}
</style>
