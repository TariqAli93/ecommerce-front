<template>
<div class="shopping-cart-page" :class="{'white': $store.getters.product_count < 1}">
    <div class="breadcrumbs grey lighten-4">
        <v-container>
            <v-breadcrumbs :items="breadcrumb_list">
                <template v-slot:divider>
                    <i style="color: #28DF47; font-size: 15px" class="im im-arrow-left" aria-hidden="true"></i>
                </template>
                <template v-slot:item="{ item }">
                    <v-breadcrumbs-item :to="item.href" style="color: #28DF47" :disabled="item.disabled">
                        <span style="color: #28DF47">{{item.text.toUpperCase()}}</span>
                    </v-breadcrumbs-item>
                </template>
            </v-breadcrumbs>
        </v-container>
    </div>

    <div class="cart-container" v-if="$store.getters.product_count > 0">
        <v-container>
            <v-row>
                <v-col cols="12" sm="12" md="8" lg="8" xl="8">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>المنتج</th>
                                <th>الوصف</th>
                                <th>الكمية</th>
                                <th>السعر</th>
                                <th>حذف</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="(item, index) in cart" :key="index">
                                <td>
                                    <div class="product_image">
                                        <img :src="productsImagesPath + item.product.image">
                                    </div>
                                </td>
                                <td>{{ item.product.description.substring(0,120) + '...' }}</td>
                                <td>
                                    <div class="qty">
                                        <span class="plus" @click="incresQty(index)">
                                            <i class="im im-angle-up"></i>
                                        </span>
                                        <span class="qty-num">
                                            {{ item.qty }}
                                        </span>
                                        <span class="minus" @click="decresQty(index)">
                                            <i class="im im-angle-down"></i>
                                        </span>
                                    </div>
                                </td>
                                <td>{{ item.product.price }}<i class="fa fa-dollar"></i></td>
                                <td>
                                    <v-btn color="secondary" icon small @click="removeItem(index)"><i style="font-size: 14px" class="im im-x-mark"></i></v-btn>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </v-col>

                <v-col cols="12" sm="12" md="4" lg="4" xl="4">
                    <div class="coupon">
                        <div class="d-flex align-center justify-center mb-5 pa-3" style="background: white; border-radius: 10px;">
                            <input type="text" class="coupon-input" placeholder="كود الخصم">
                            <v-btn color="#28DF47" depressed rounded dark>
                                حفظ الكود
                            </v-btn>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-head mb-3 pa-4">
                            <h2 class="text-center">الناتج الكلي</h2>
                        </div>

                        <v-divider></v-divider>

                        <v-list dense nav class="mt-3">
                            <v-list-item class="pa-4 d-flex align-center justify-space-between" color="transparent">
                                <span>العنوان :</span>
                                <v-text-field v-model="addressVal" :disabled="!isEditing"></v-text-field>
                                <v-btn color="secondary" icon small @click="isEditing = !isEditing">
                                    <i style="font-size: 13px" class="im im-edit"></i>
                                </v-btn>

                                <v-btn color="secondary" icon small v-show="isEditing">
                                    <i style="font-size: 13px" class="im im-check-mark"></i>
                                </v-btn>
                            </v-list-item>

                            <v-divider></v-divider>

                            <v-list-item class="pa-4 d-flex align-center justify-space-between" color="transparent">
                                <span>الضريبة :</span>
                                <span>{{ tax_number }} %</span>
                            </v-list-item>

                            <v-divider></v-divider>

                            <v-list-item class="pa-4 d-flex align-center justify-space-between" color="transparent">
                                <span>المبلغ الكلي :</span>
                                <span>{{ totalPrice }} دولار</span>
                            </v-list-item>
                        </v-list>
                        <v-divider></v-divider>
                        <v-btn color="#28DF47" large depressed block rounded dark class="mt-3">
                            اكمل عملية الشراء
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </div>

    <div v-else class="cart-empty">
        <div class="emptystate"></div>
        <h4>لا توجد منتجات في السلة !</h4>
    </div>
</div>
</template>

<script>
import serverPath from '../plugins/ServerSidePath'
export default {
    data() {
        return {
            breadcrumb_list: [{
                    text: 'المتجر',
                    disabled: false,
                    href: '/',
                },
                {
                    text: 'سلة المشتريات',
                    disabled: true,
                    href: '/cart',
                }
            ],
            tax_number: 10,
            addressVal: 'بغداد-الدورة-شارع ابو طيارة',
            productsImagesPath: new serverPath().URL,
            isEditing: null
        }
    },

    computed: {
        cart() {
            return this.$store.state.cart;
        },
        totalPrice() {
            // return ((this.$store.getters.totalPrice / this.tax_number) * 100);
            return (this.$store.getters.totalPrice * this.tax_number) / 100 + this.$store.getters.totalPrice
        },
    },
    methods: {
        removeItem(index) {
            this.$store.dispatch('removeItemFromCart', index);
        },

        incresQty(index) {
            this.$store.dispatch('countUpQty', index)
            console.log(index);
        },

        decresQty(index) {
            this.$store.dispatch('countDownQty', index)
            console.log(index);
        }
    },
    mounted() {
        if (this.$store.getters.isLoggedIn !== true) {
            this.$router.push('/login')
        }
    }
}
</script>

<style lang="scss">
.shopping-cart-page {
    background: #f1f1f1;

    &.white {
        background: white;
    }

    .coupon {
        &-input {
            background: whitesmoke;
            padding: 10px 10px;
            border: none;
            outline: none;
            box-shadow: none;
            border-radius: 30px;
            margin: 0 0 0 10px;
            width: 100%;
        }
    }

    .qty {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        span.plus,
        span.minus {
            cursor: pointer;
            padding: 10px;

            i {
                color: black;
                font-size: 15px;
            }
        }

        &-num {
            background: white;
            border-radius: 5px;
            padding: 10px;
            width: 50px;
            text-align: center;
            cursor: text;
        }
    }

    .cart-empty {
        padding: 3rem 0px;

        .emptystate {
            background: {
                image: url('../assets/images/empty-bag-bg.png');
                repeat: no-repeat;
                size: contain;
                position: center;
            }

            width: 350px;
            height: 200px;
            margin: 0 auto;
        }

        h4 {
            display: block;
            text-align: center;
            width: 100%;
            padding: 20px;
        }
    }

    .cart-container {
        padding: 20px 0px;
    }

    .card {
        background: white;
        padding: 20px;
        border-radius: 10px;
        position: sticky;
        top: 175px;
        box-shadow: none;

        &:hover {
            box-shadow: none;
            transform: translateY(0);
        }

        .v-list {
            background: transparent !important;
        }

        .v-list-item {
            background: transparent !important;
        }
    }

    .table {
        border: none;
        border-collapse: collapse !important;
        width: 100%;
        margin-bottom: 1rem;
        background-color: transparent;

        tbody+tbody {
            border-top: 2px solid #dee2e6;
        }

        td,
        th {
            padding: 0.75rem;
            vertical-align: middle;
            border-top: 1px solid #dee2e6;
        }

        thead {
            th {
                vertical-align: bottom;
                border-bottom: 2px solid #dee2e6;
            }
        }

        .product_image {
            display: block;
            width: 120px;
            height: 120px;
            border-radius: 10px;
            overflow: hidden;

            img {
                display: block;
                width: 100%;
                height: 100%;
            }
        }
    }

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
}
</style>
