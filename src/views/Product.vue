<template>
<div class="product-page">
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

    <div class="product-card">
        <v-container>
            <v-row>
                <v-col cols="12" xs="12" sm="12" md="4" lg="4" xl="4">
                    <div class="product-control grey lighten-4 pa-4">
                        <div>
                            <h3>{{ product_info.name }}</h3>
                        </div>
                        <div class="input">
                            <v-text-field type="number" label="الكمية" :disabled="product_info.quantity < 1" min="1" :max="product_info.quantity" v-model="qtyInput"></v-text-field>
                        </div>
                        <div class="list">
                            <v-list class="pa-0 mb-4" color="transparent">
                                <v-list-item class="pa-0" color="transparent">
                                    <v-list-item-icon>
                                        <i class="im im-store"></i>
                                    </v-list-item-icon>

                                    <v-list-item-title>
                                        <span>الكمية في المتجر</span>
                                    </v-list-item-title>

                                    <div>{{ product_info.quantity }}</div>
                                </v-list-item>
                                <v-divider></v-divider>
                                <v-list-item class="pa-0" color="transparent">
                                    <v-list-item-icon>
                                        <i class="im im-credit-card"></i>
                                    </v-list-item-icon>

                                    <v-list-item-title>
                                        <span>سعر المنتج</span>
                                    </v-list-item-title>

                                    <div class="d-flex align-center justify-center"><span>{{ product_info.price}}</span><span><i class="fa fa-dollar"></i></span> </div>
                                </v-list-item>
                            </v-list>
                        </div>
                        <div class="btns">
                            <v-btn color="#28DF47" block :disabled="product_info.quantity < 1" depressed dark @click="saveToCart(products)">
                                اضافة الى السلة
                            </v-btn>

                            <v-btn color="secondary" block depressed to="/">
                                العودة الى المتجر
                            </v-btn>
                        </div>
                    </div>
                </v-col>

                <v-col cols="12" xs="12" sm="12" md="8" lg="8" xl="8">
                    <v-carousel class="custom-carousel" show-arrows delimiter-icon="fa-minus" next-icon="fa-long-arrow-right" prev-icon="fa-long-arrow-left" hide-delimiter-background show-arrows-on-hover>
                        <v-carousel-item>
                            <img :src="server_url + product_info.image">
                        </v-carousel-item>
                    </v-carousel>
                </v-col>
            </v-row>
        </v-container>
    </div>
</div>
</template>

<script>
import serverPath from '../plugins/ServerSidePath'
export default {
    data() {
        return {
            qtyInput: 1,
            addToCartSnackbar: false,
            addToCartSnackbarText: '',
            addToCartSnackbarColor: '',
            breadcrumb_list: [{
                    text: 'المتجر',
                    disabled: false,
                    href: '/',
                },
                {
                    text: 'المنتجات',
                    disabled: true,
                    href: '/',
                },

                {
                    text: '',
                    disabled: true,
                    href: '/'
                }
            ],
            product_info: {},
            products: null,
            server_url: new serverPath().URL
        }
    },
    mounted() {
        this.getProductInfo();
    },

    methods: {
        saveToCart(product) {
            this.addToCartSnackbar = false;
            this.$store.commit('ADD_PRODUCT_TO_CART', {
                product: product,
                qty: this.qtyInput
            });
            this.addToCartSnackbar = true;
            this.addToCartSnackbarText = 'تم اضافة المنتج بنجاح';
            this.addToCartSnackbarColor = 'secondary';
        },
        getProductInfo() {
            let self = this;
            self.axios.get(`product/${self.$route.params.id}`)
                .then(data => {
                    self.breadcrumb_list[2].text = data.data.productName;
                    self.product_info = {
                        id: data.data.idProduct,
                        name: data.data.productName,
                        price: data.data.price,
                        quantity: data.data.quantity,
                        image: data.data.image
                    };
                    self.products = data.data;
                    console.log(self.products)
                })
                .catch(err => {
                    throw new Error(err)
                })
        },
    }
}
</script>

<style lang="scss">
.product-page {
    padding: 20px 0px;

    .product-control {
        h3 {
            padding: 30px 0px;
            font-weight: 900;
        }

        .input,
        .list,
        .btns {
            padding: 10px 0;
        }

        .btns {
            .v-btn {
                margin-bottom: 20px;
            }
        }

        // input
        // list
        // btns

    }

    .custom-carousel {
        height: 500px !important;

        .v-responsive__content {
            height: 100%;
        }

        .v-carousel__item {
            height: 100% !important;
        }

        .v-window__next,
        .v-window__prev {
            button {
                background: #28DF47 !important;
                color: white !important;
                width: 70px;
                height: 70px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 5px;
            }
        }

        .v-carousel__controls {
            .theme--dark.v-btn.v-btn--icon {
                border-radius: 5px !important;
                background: transparent !important;
                color: white !important;

                &:before {
                    opacity: 1;
                    background: transparent !important;
                }

                i {
                    color: white !important;
                    opacity: 1;
                }

                &.v-item--active {
                    background: #28DF47 !important;
                    color: white !important;

                    &:before {
                        opacity: 1;
                        background: #28DF47 !important;
                    }

                    i {
                        color: white !important;
                        opacity: 1;
                    }
                }
            }
        }

        img {
            display: block;
            width: 100%;
            height: 100%;
        }
    }
}
</style>
