<template>
<div class="shopping-cart-page" :class="{'white': $store.getters.product_count < 1}">
    <v-sheet v-if="loading_screen" class="loading_sheet">
        <img src="../assets/images/loading-icon.svg" alt="Loading...">
    </v-sheet>

    <v-snackbar v-model="addToCartSnackbar" :color="addToCartSnackbarColor">
        {{ addToCartSnackbarText }}

        <template v-slot:action="{ attrs }">
            <v-btn :color="addToCartSnackbarColor === 'error' ? 'secondary' : 'white'" text v-bind="attrs" @click="addToCartSnackbar = false">
                <i class="im im-x-mark"></i>
            </v-btn>
        </template>
    </v-snackbar>

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
                        <div v-if="$store.getters.isLoggedIn" class="d-flex align-center justify-center mb-5 pa-3" style="background: white; border-radius: 10px;">
                            <input type="text" class="coupon-input" v-model="couponInput" placeholder="كود الخصم">
                            <v-btn color="#28DF47" :loading="couponLoading" :disabled="couponLoading" depressed rounded :dark="!couponLoading" @click="saveCoupon(couponInput)">
                                حفظ الكود
                            </v-btn>
                        </div>

                        <v-alert type="warning" v-else>
                            <span>يرجى تسجيل الدخول</span>
                        </v-alert>
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
                        <div class="note pt-5">
                            <v-textarea v-model="payment_note" color="#28DF47" label="تفاصيل اخرى" outlined></v-textarea>
                        </div>
                        <v-divider></v-divider>
                        <v-btn v-if="$store.getters.isLoggedIn" color="#28DF47" large depressed block rounded dark class="mt-3" @click="bay()">
                            اكمل عملية الشراء
                        </v-btn>

                        <v-alert type="warning" v-else>
                            <span>يرجى تسجيل الدخول</span>
                        </v-alert>
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
            couponInput: '',
            couponLoading: false,
            addToCartSnackbar: false,
            addToCartSnackbarText: '',
            addToCartSnackbarColor: '',
            tax_number: 0,
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
            addressVal: 'بغداد-الدورة-شارع ابو طيارة',
            productsImagesPath: new serverPath().URL,
            isEditing: null,
            payment: true,
            payment_note: '',
            loading_screen: false,
        }
    },

    computed: {
        cart() {
            return this.$store.state.cart;
        },

        totalPrice() {
            return (this.$store.getters.totalPrice * this.tax_number) / 100 + this.$store.getters.totalPrice
        },
    },

    methods: {
        decodeJwt(token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        },

        removeItem(index) {
            this.$store.dispatch('removeItemFromCart', index);
        },

        incresQty(index) {
            this.$store.dispatch('countUpQty', index)
        },

        decresQty(index) {
            this.$store.dispatch('countDownQty', index)
        },

        startSnackBar(text, color) {
            let self = this;
            self.addToCartSnackbar = true;
            self.addToCartSnackbarText = text;
            self.addToCartSnackbarColor = color;
        },

        saveCoupon(number) {
            let self = this;
            let couponNumber = localStorage.coupon ? JSON.parse(localStorage.coupon) : null;
            self.couponLoading = true;

            if (couponNumber === null) {
                self.axios.get(`couponDate/${number}`)
                    .then(data => {
                        if (data.data === "" || data.data.isUsed === 1) {
                            setTimeout(() => {
                                self.startSnackBar('تم انتهاء صلاحية الكود', 'error');
                                self.couponLoading = false;
                            }, 1400)
                        } else {
                            setTimeout(() => {
                                self.startSnackBar(`تم اضافة كود الخصم - ستحصل على خصم ${data.data.value} %`, '#28DF47');
                                self.couponLoading = false;
                                localStorage.setItem('coupon', JSON.stringify(data.data));

                                self.axios.put(`couponStatus/${data.data.idCoupon}`, {
                                    status: 1
                                }).then(result => {}).catch(err => {
                                    console.error(err.response)
                                })
                            }, 1400)
                        }
                    })
                    .catch(err => {
                        self.startSnackBar('يرجى ادخال رقم الكوبون', 'error');
                        self.couponLoading = false;
                    })
            } else {
                self.startSnackBar('لا يمكنك اضافة اكثر من كوبون واحد', 'error');
                self.couponLoading = false;
            }
        },

        bay() {
            let self = this;
            let token = self.$store.state.token;
            let user = self.decodeJwt(token);
            let userId = user.id;
            let products = [];
            let coupon = localStorage.coupon ? JSON.parse(localStorage.coupon).value : 0;
            let percent = '';
            let pricetax = '';
            let itemprice = '';
            let itemPlusQty = '';

            if (self.payment) {
                let stateCart = self.$store.state.cart.forEach(item => {
                    percent = Math.floor((item.product.price * item.qty) / 100 * coupon);
                    pricetax = Math.floor((item.product.price * item.qty) / 100 * self.tax_number);
                    itemPlusQty = Math.floor(item.product.price * item.qty);
                    itemprice = Math.floor(itemPlusQty + pricetax);

                    products.push({
                        productId: item.product.idProduct,
                        quantity: item.qty,
                        discount: coupon,
                        totalPrice: Math.floor(itemprice - percent)
                    });
                });

                self.axios.post('addMultiInvoice', {
                    userId: userId,
                    note: self.payment_note,
                    products: products,

                }, {
                    headers: {
                        Authorization: `bearer ${self.$store.state.token}`
                    }
                }).then(result => {
                    self.loading_screen = true;
                    setTimeout(() => {
                        self.startSnackBar('تم الشراء بنجاح . شكرا لكم', '#28DF47');
                        self.loading_screen = false;
                        setTimeout(() => {
                            localStorage.removeItem('coupon');
                            localStorage.removeItem('cart');
                            self.$store.state.cart = [];
                            self.$router.push({
                                name: 'profile'
                            });
                        }, 1500)
                    }, 2400);
                }).catch(err => {
                    self.loading_screen = false;
                    console.error(err.response)
                });

            }
        }
    },
    mounted() {
        this.tax_number = this.$store.state.tax_number || 0;
        if (this.$store.getters.isLoggedIn !== true) {
            this.$router.push('/login')
        }
    },

    metaInfo: {
        title: 'سلة المشتريات',
        titleTemplate: '%s | المتجر العراقي',
        htmlAttrs: {
            lang: 'ar',
            amp: true
        },
        bodyAttrs: {
            class: ['body']
        },
        meta: [{
                charset: 'utf-8'
            },
            {
                name: 'description',
                content: 'foo'
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            }
        ],
    },
}
</script>

<style lang="scss">
.shopping-cart-page {
    background: #f1f1f1;
    position: relative;

    &.white {
        background: white;
    }

    .loading_sheet {
        position: absolute !important;
        top: 0;
        right: 0;
        z-index: 200;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
        background: rgba(white, .80) !important;

        img {
            display: block;
            max-width: 120px;
            max-height: 120px;
            animation: spin .7s linear infinite;
        }
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
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
