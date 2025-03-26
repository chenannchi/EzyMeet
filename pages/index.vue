<template>
  <div class="page-container">

    <el-carousel motion-blur height="300px">
      <el-carousel-item v-for="(img, idx) in promotions" :key="idx">
        <div class="image-container">
          <img :src="img" :alt="img">
        </div>
      </el-carousel-item>
    </el-carousel>
    <div class="products-section">
      <div class="title">最新上架</div>
      <div class="card" v-if="products" v-for="product in products" :key="product.productId"
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
import type { Product } from '~/types/interfaces';

useHead({
  title: '首页'
})

const router = useRouter();

const navigateToDetail = (id: number) => {
  router.push(`/product/${id}`);
};

const products = ref<Product[]|null>([]);

const promotions = [
  "/images/discounts/promotion1.jpg",
  "/images/discounts/promotion2.jpg",
  "/images/discounts/promotion3.jpg",
  "/images/discounts/promotion4.jpg",
  "/images/discounts/promotion5.jpg",
]

async function getNewProducts() {
  try {
    const res = await $fetch<any>(`http://localhost:5005/giftopia/products/new-products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    products.value = res.data;
  } catch (error) {
    console.error('商品加入購務車失敗', error);
  }
};

onMounted(() => {
  getNewProducts();
});

</script>
<style scoped lang="scss">
.page-container {
  padding-top: 50px;
  // padding: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;

  >* {
    width: 80%;
    max-width: 800px;
    margin: 0 auto;
  }
}

.el-carousel {
  width: 80%;
  margin: 0 auto;

  .el-carousel__item {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .image-container {
    width: auto;

    img {
      height: 100%;
      margin: 0 auto;
    }
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #e0c6cf;
  }

  .el-carousel__item:nth-child(2n + 1) {
    background-color: #e4e5ff;
  }
}



.products-section {
  display: flex;
  flex-wrap: wrap;
  // gap: 20px;
  margin-top: 20px;

  // background-color: lightblue;
  .title {
    font-size: 2rem;
    margin-bottom: 20px;
    width: 100%;
  }

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