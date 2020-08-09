<template>
<div class="category-products">
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
                        <span style="color: #28DF47">{{item.text}}</span>
                    </v-breadcrumbs-item>
                </template>
            </v-breadcrumbs>
        </v-container>
    </div>

    <div v-if="products.length < 1">
        <v-container>
            <v-alert type="warning">
                <h4>لا توجد منتجات حاليا!</h4>
            </v-alert>
        </v-container>
    </div>
    <div v-else>
        <v-container>
            <v-row>
                <v-col cols="12" xl="4" lg="4" md="4" sm="1" v-for="(product, index) in products" :key="index">
                    <v-sheet v-if="!pageLoaded">
                        <v-skeleton-loader class="mx-auto" type="card-avatar, article, actions"></v-skeleton-loader>
                    </v-sheet>

                    <div class="card">
                        <div class="card-image">
                            <img :src="server_url + product.image" />
                        </div>

                        <div class="card-content">
                            <div class="card-content-header">
                                <h2>{{ product.productName }}</h2>
                            </div>

                            <div class="card-content-body">
                                <div class="card-content-body-btns">
                                    <v-btn color="secondary" rounded width="40px" min-width="20px" height="40px" :to="`/product/${product.idProduct}`">
                                        <i class="im im-eye" style="font-size: 13px"></i>
                                    </v-btn>

                                    <v-btn color="#28DF47" dark rounded width="40px" min-width="20px" height="40px" @click="saveToCart(product)">
                                        <i class="im im-shopping-cart" style="font-size: 13px"></i>
                                    </v-btn>
                                </div>

                                <h4><span>{{ product.price }}</span> <i class="fa fa-dollar"></i> </h4>

                                <p>{{ product.description.substring(0,100) + '...' }}</p>
                            </div>
                        </div>

                        <div class="product-name">
                            <h2>{{ product.productName }}</h2>
                        </div>
                    </div>
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
            products: [],
            CateId: '',
            pageLoaded: false,
            server_url: new serverPath().URL,
            addToCartSnackbar: false,
            addToCartSnackbarText: '',
            addToCartSnackbarColor: '',
            cateName: '',
            breadcrumb_list: [{
                    text: 'المتجر',
                    disabled: false,
                    href: '/',
                },
                {
                    text: 'التصنيفات',
                    disabled: true,
                    href: '/',
                },

                {
                    text: '',
                    disabled: true,
                    href: '/'
                }
            ],
        }
    },

    mounted() {
        this.categoriesName();
    },
    
    methods: {
        saveToCart(product) {
            this.addToCartSnackbar = false;
            this.$store.dispatch('additemToCart', {
                product: product,
                qty: 1
            });
            this.addToCartSnackbar = true;
            this.addToCartSnackbarText = 'تم اضافة المنتج بنجاح';
            this.addToCartSnackbarColor = 'secondary';
        },

        categoriesName() {
            let self = this;
            self.axios.get(`category/${self.$route.params.id}`)
            .then(data => {
                self.breadcrumb_list[2].text = data.data.categoryName;
                console.log(data)
            })
            .catch(err => {
                throw new Error(err)
            })
        },

        getProductsByCate(id) {
            let self = this;
            self.axios(`productCategory/${id}`)
                .then(data => {
                    setTimeout(() => {
                        if (data.data.length < 1) {
                            self.product = [];
                        } else {
                            self.products = data.data;
                        }
                        self.pageLoaded = true;
                    }, 1500)
                })
                .catch(err => {
                    self.product = [];
                    console.error(err);
                })
        }
    },

    watch: {
        '$route.params': {
            handler(newId) {
                const {
                    id
                } = newId

                this.getProductsByCate(id);
                this.categoriesName();
            },
            immediate: true,
        }
    },
}
</script>

<style lang="scss">
.card {
    position: relative;
    background: white;
    padding: 0;
    border-radius: 2px;
    width: 100%;
    overflow: hidden;
    box-shadow: 0 4px 13px 0 rgb(0, 0, 0, 9%);
    transition: all 0.2s ease 0.05s;

    .product-name {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        position: absolute;
        width: 100%;
        padding: 30px;
        left: 0;
        bottom: 0;
        text-align: center;
        height: 200px;
        background: rgb(0, 0, 0);
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.6898109585631127) 0%, rgba(255, 255, 255, 0) 100%);
        color: #28DF47;
    }

    &-image {
        display: block;
        width: 100%;
        min-height: 450px;
        max-height: 450px;
        height: 100%;
        transition: all 0.2s ease 0.05s;

        img {
            display: block;
            max-width: 100%;
            width: fit-content;
            height: 100%;
            min-height: 450px;
        }
    }

    &-content {
        position: absolute;
        width: 100%;
        height: fit-content;
        min-height: 225px;
        background: transparent;
        box-shadow: none;
        bottom: -100%;
        left: 0;
        right: 0;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 20px;
        opacity: 0;
        z-index: 10;
        transition: all 0.2s ease 0.05s;

        &-header {
            text-align: center;
            position: relative;
            padding: 10px 0px;
            color: #28DF47;

            &:before {
                content: "";
                position: absolute;
                width: 0%;
                height: 3px;
                background: #28DF47;
                bottom: 0;
                left: 0;
                transition: all 0.2s ease 0.09s;
            }
        }

        &-body {
            padding-top: 7px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            visibility: hidden;
            opacity: 0;
            transition: all 0.2s ease 0.05s;

            &-btns {
                padding: 20px 0px;

                .v-btn {
                    margin: 0 10px;
                    transform: translateY(30px);

                    &:first-child {
                        transition: all 0.2s ease 0.10s
                    }

                    &:last-child {
                        transition: all 0.2s ease 0.12s
                    }

                }
            }

            p {
                font-size: 17px;
                font-weight: 300;
                text-align: center;
                visibility: hidden;
                opacity: 0;
                transform: translateY(30px);
                color: black;
                transition: all 0.2s ease 0.12s;
            }

            h4 {
                font-weight: 900;
                padding: 10px 15px;
                border: 1px solid rgba(black, .20);
                margin-bottom: 10px;
                color: black;
                border-left-color: transparent;
                border-right-color: transparent;
            }
        }
    }

    &:hover {
        box-shadow: 0 2px 20px 0 rgba(black, .20);
        transform: translateY(-5px);

        .card-image {
            filter: blur(5px);
        }

        .card-content {
            bottom: 0px;
            opacity: 1;
            background: rgba(white, .95);

            &-header {
                &:before {
                    width: 100%;
                }
            }

            &-body {
                visibility: visible;
                opacity: 1;

                &-btns {
                    .v-btn {
                        transform: translateY(0px);
                    }
                }

                p {
                    visibility: visible;
                    opacity: 1;
                    transform: translateY(0px);
                }
            }
        }
    }
}
</style>
