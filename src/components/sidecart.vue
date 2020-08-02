<template>
<div id="productsInSideBar">
    <div v-if="$store.getters.product_count">
        <div class="product-item" v-for="(item, i) in cart" :key="i">
            <div class="img">
                <img :src="productsImagesPath + item.product.image">
            </div>
            <div class="content">
                <span>{{ item.product.productName }}</span>
                <small><i class="fa fa-dollar"></i> <span>{{ item.product.price }}<i style="font-size: 8px; margin: 0 5px" class="im im-x-mark"></i>{{ item.qty >= item.product.quantity ? item.product.quantity : item.qty}}</span></small>
            </div>
            <div class="action">
                <v-btn color="error" icon small @click="removeItem(i)">
                    <i class="im im-trash-can" style="font-size: 10px"></i>
                </v-btn>
            </div>
        </div>
    </div>

    <div class="d-flex align-center justify-center" style="height: 100%" v-else>
        <div class="emptystate"></div>
    </div>
</div>
</template>

<script>
import serverPath from '../plugins/ServerSidePath'
export default {
    data() {
        return {
            productsImagesPath: new serverPath().URL
        }
    },
    computed: {
        cart() {
            return this.$store.state.cart;
        }
    },

    methods: {
        removeItem(index) {
            this.$store.dispatch('removeItemFromCart', index);
        }
    },

    mounted() {

    }
}
</script>

<style lang="scss">
.emptystate {
    background: {
        image: url('../assets/images/empty.png');
        repeat: no-repeat;
        size: contain;
        position: center;
    }

    width: 350px;
    height: 350px;
    margin: 0 auto;
}

.product-item {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    padding: 3rem;
    border-bottom: 1px solid rgba(black, .10);

    .img {
        flex: 0 0 25%;
        min-height: 88px;
        display: block;
        padding: 10px;
        background: whitesmoke;
        border-radius: 50px;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
            display: block;
            width: 80px;
            height: 80px;
            border-radius: 500px;
        }
    }

    .content {
        flex: 0 0 65%;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        flex-direction: column;
        padding: 0px 20px;
    }

    .action {
        flex: 0 0 15%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
