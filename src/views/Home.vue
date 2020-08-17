<template>
<div class="home-page">
    <v-snackbar v-model="addToCartSnackbar" :color="addToCartSnackbarColor">
        {{ addToCartSnackbarText }}

        <template v-slot:action="{ attrs }">
            <v-btn :color="addToCartSnackbarColor === 'error' ? 'secondary' : 'white'" text v-bind="attrs" @click="addToCartSnackbar = false">
                <i class="im im-x-mark"></i>
            </v-btn>
        </template>
    </v-snackbar>

    <header class="home-header">
        <div class="header-content">
            <h1>{{ $store.getters.appInfo.app_name }}</h1>
            <p>يسعدنا تقديم افضل المنتجات بأنسب الاسعار و لجميع المحافظات</p>
        </div>
    </header>

    <section class="section">
        <div class="title">
            <span>احدث المنتجات</span>
        </div>
        <v-container fluid>
            <v-row v-if="!pageLoaded">
                <v-col cols="12" xl="4" lg="4" md="12" sm="12" v-for="i in 3" :key="i">
                    <v-sheet>
                        <v-skeleton-loader class="mx-auto" type="card-avatar, article, actions"></v-skeleton-loader>
                    </v-sheet>
                </v-col>
            </v-row>

            <v-row v-else>
                <v-col cols="12" xl="4" lg="4" md="12" sm="12" v-for="product in new_products" :key="product.idProduct">
                    <div class="card" v-show="pageLoaded">
                        <div class="out-of-stock" v-if="product.quantity < 1">
                            <span>غير متوفر</span>
                        </div>
                        <div class="card-image">
                            <img :src="server_url + product.image" />
                        </div>

                        <div class="card-content">
                            <div class="card-content-header">
                                <h2>{{ product.productName }}</h2>
                            </div>

                            <div class="card-content-body">
                                <div class="card-content-body-btns">
                                    <v-btn color="secondary" fab :to="`/product/${product.idProduct}`">
                                        <i class="im im-eye" style="font-size: 18px"></i>
                                    </v-btn>

                                    <v-btn color="#69BCB8" :dark="product.quantity > 0" fab :disabled="product.quantity < 1" @click="saveToCart(product)">
                                        <i class="im im-shopping-cart" style="font-size: 18px"></i>
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
    </section>

    <section class="featured-section">
        <v-sheet v-if="!pageLoaded" color="grey lighten-4" height="550">
            <v-skeleton-loader style="width: 450px" height="550" class="image" type="image" boilerplate></v-skeleton-loader>
        </v-sheet>

        <div v-else class="image" :style="`background-image: url(${server_url + featured_product.image})`"></div>

        <v-sheet v-if="!pageLoaded" color="grey lighten-4" style="width: 1000px">
            <v-skeleton-loader type="article, actions, sentences" boilerplate></v-skeleton-loader>
        </v-sheet>

        <div class="content" v-else>
            <h2>{{ featured_product.name }}</h2>
            <p>{{ featured_product.description.substring(0,250) + '...' }}</p>
            <v-btn :to="`/product/${featured_product.id}`" color="black" dark medium depressed>
                <i class="im im-arrow-right" style="margin-left: 5px; font-size: 13px"></i>
                <span>عرض المنتج</span>
            </v-btn>
        </div>
    </section>

    <section class="section">
        <div class="title">
            <span>افضل المبيعات</span>
        </div>
        <v-container fluid>
            <v-row>
                <v-col cols="12" xl="4" lg="4" md="12" sm="12" v-for="product in best_products" :key="product.idProduct">
                    <v-sheet v-if="!pageLoaded">
                        <v-skeleton-loader class="mx-auto" type="card-avatar, article, actions"></v-skeleton-loader>
                    </v-sheet>

                    <div class="card" v-show="pageLoaded">
                        <div class="out-of-stock" v-if="product.quantity < 1">
                            <span>غير متوفر</span>
                        </div>
                        <div class="card-image">
                            <img :src="server_url + product.image" />
                        </div>

                        <div class="card-content">
                            <div class="card-content-header">
                                <h2>{{ product.productName }}</h2>
                            </div>

                            <div class="card-content-body">
                                <div class="card-content-body-btns">
                                    <v-btn color="secondary" fab :to="`/product/${product.idProduct}`">
                                        <i class="im im-eye" style="font-size: 18px"></i>
                                    </v-btn>

                                    <v-btn color="#69BCB8" :dark="product.quantity > 0" fab :disabled="product.quantity < 1" @click="saveToCart(product)">
                                        <i class="im im-shopping-cart" style="font-size: 18px"></i>
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
    </section>

    <section class="section">
        <div class="title">
            <span>كل المنتجات</span>
        </div>
        <v-container fluid>
            <v-row>
                <v-col cols="12" xl="4" lg="4" md="12" sm="12" v-for="(product, index) in products" :key="index">
                    <v-sheet v-if="!pageLoaded" color="grey lighten-4">
                        <v-skeleton-loader class="mx-auto" type="card-avatar, article, actions"></v-skeleton-loader>
                    </v-sheet>

                    <div class="card" v-show="pageLoaded">
                        <div class="out-of-stock" v-if="product.quantity < 1">
                            <span>غير متوفر</span>
                        </div>
                        <div class="card-image">
                            <img :src="server_url + product.image" />
                        </div>

                        <div class="card-content">
                            <div class="card-content-header">
                                <h2>{{ product.productName }}</h2>
                            </div>

                            <div class="card-content-body">
                                <div class="card-content-body-btns">
                                    <v-btn color="secondary" fab :to="`/product/${product.idProduct}`">
                                        <i class="im im-eye" style="font-size: 18px"></i>
                                    </v-btn>

                                    <v-btn color="#69BCB8" :dark="product.quantity > 0" fab :disabled="product.quantity < 1" @click="saveToCart(product)">
                                        <i class="im im-shopping-cart" style="font-size: 18px"></i>
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

            <div v-show="isLoadingMoreProducts" class="container-loading">
                <img src="../assets/images/loading-icon.svg" alt="Loading...">
            </div>

            <v-btn color="#69BCB8" :disabled="isLoadingMoreProducts || !pageLoaded" class="mx-auto" style="margin: 0 auto; display: block; margin-top: 15px" dark depressed rounded @click="getMoreProducts">
                <i class="im im-plus" style="font-size: 10px; margin-left: 5px"></i>
                <span>عرض المزيد</span>
            </v-btn>
        </v-container>
    </section>
</div>
</template>

<script>
import serverPath from '../plugins/ServerSidePath'
export default {
    metaInfo() {
        return {
            title: 'الصفحة الرئيسية',
            titleTemplate: `%s | ${this.$store.getters.appInfo.app_name}`,
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
        }
    },
    data() {
        return {
            isLoadingMoreProducts: false,
            pageLoaded: false,
            addToCartSnackbar: false,
            addToCartSnackbarText: '',
            addToCartSnackbarColor: '',
            server_url: new serverPath().URL,
            products: [],
            products_number: 3,
            new_products: [],
            best_products: [],
            featured_product: {
                id: '',
                name: '',
                price: '',
                image: '',
                description: ''
            }
        }
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

        getAllProducts() {
            let self = this;
            self.axios.get('products').then(data => {
                self.products = data.data.reverse().splice(0, self.products_number);
                self.featured_product = {
                    id: data.data[2].idProduct,
                    name: data.data[2].productName,
                    price: data.data[2].price,
                    image: data.data[2].image,
                    description: data.data[2].description.substring(0, 250),
                };
                setTimeout(() => {
                    self.pageLoaded = true;
                }, 4500);
            }).catch(err => {
                throw new Error(err)
            })
        },

        getNewProducts() {
            let self = this;
            let products = [];
            self.axios.get('products')
                .then(data => {
                    products = data.data.filter(product => {
                        return Number(product.statusId) === 1
                    });

                    self.new_products = products.splice(0, 3);
                    setTimeout(() => {
                        self.pageLoaded = true;
                    }, 4500);
                }).catch(err => {
                    throw new Error(err)
                })
        },

        getBestSalesProducts() {
            let self = this;
            let products = [];
            self.axios.get('products')
                .then(data => {
                    products = data.data.filter(product => {
                        return Number(product.statusId) === 3
                    });

                    self.best_products = products.splice(0, 3);
                    setTimeout(() => {
                        self.pageLoaded = true;
                    }, 4500);
                }).catch(err => {
                    throw new Error(err)
                })
        },

        getMoreProducts() {
            let self = this;
            self.isLoadingMoreProducts = true;
            setTimeout(() => {
                self.products_number += 3;
                self.isLoadingMoreProducts = false;
                self.getAllProducts();
            }, 2000);
        }
    },

    mounted() {
        this.getAllProducts();
        this.getNewProducts();
        this.getBestSalesProducts();
    },
}
</script>

<style lang="scss">
@function strip-unit($value) {
    @return $value / ($value * 0 + 1);
}

@mixin fluid-type($min-vw, $max-vw, $min-font-size, $max-font-size) {
    $u1: unit($min-vw);
    $u2: unit($max-vw);
    $u3: unit($min-font-size);
    $u4: unit($max-font-size);

    @if $u1==$u2 and $u1==$u3 and $u1==$u4 {
        & {
            font-size: $min-font-size;

            @media screen and (min-width: $min-vw) {
                font-size: calc(#{$min-font-size} + #{strip-unit($max-font-size - $min-font-size)} * ((100vw - #{$min-vw}) / #{strip-unit($max-vw - $min-vw)}));
            }

            @media screen and (min-width: $max-vw) {
                font-size: $max-font-size;
            }
        }
    }
}

.home-page {
    min-height: 100%;

    .home-header {
        display: block;
        height: 100vh;
        width: 100%;
        position: relative;
        background: white;
        padding: 0 5rem;

        @media (max-width: 1100px) {
            padding: 0;
        }

        &:before {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;

            background: {
                image: url('../assets/images/header-image.svg');
                repeat: no-repeat;
                position: left bottom;
                size: 43%;
            }

            ;

            @media (max-width: 1100px) {
                display: none;
            }
        }

        .header-content {
            display: flex;
            align-items: flex-start;
            justify-content: center;
            flex-direction: column;
            width: 55%;
            height: 100%;

            @media (max-width: 1100px) {
                width: 100%;
                align-items: center;
                text-align: center;
                padding: 0px 50px;
            }

            h1 {
                $min_width: 320px;
                $max_width: 1200px;
                $min_font: 16px;
                $max_font: 75px;

                color: #69BCB8;
                @include fluid-type($min_width, $max_width, $min_font, $max_font);
                font-weight: 900;
            }

            p {
                $min_width: 320px;
                $max_width: 1200px;
                $min_font: 13px;
                $max_font: 40px;

                @include fluid-type($min_width, $max_width, $min_font, $max_font);
                font-weight: 400;
                color: black;
                width: 704px;

                @media (max-width: 1100px) {
                    width: 100%;
                }
            }
        }
    }

    .featured-section {
        padding: 0px;
        display: flex;
        align-items: center;
        background: white;
        overflow: hidden;

        .v-skeleton-loader__image {
            height: 550px !important;
        }

        .image {
            background: {
                repeat: no-repeat;
                size: cover;
                position: center;
            }

            width: 60%;
            height: 550px;
        }

        .content {
            display: flex;
            width: 100%;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            padding: 3rem;
            color: black;
            background: white;
            position: relative;
            right: -100px;
            // box-shadow: 50px 0 30px 0 rgba(black, 0.12);

            h2 {
                font-size: 5rem;
                position: relative;
                display: flex;
                width: fit-content;
                padding: 1rem 0;
                margin-bottom: 20px;
                font-weight: 900;

                &:before {
                    content: "";
                    position: absolute;
                    width: 60px;
                    height: 5px;
                    border-radius: 10px;
                    background: currentColor;
                    right: 0;
                    bottom: 0;
                }
            }

            p {
                display: block;
                width: 650px;
                line-height: 2;
                font-weight: 400;
            }
        }
    }

    .card {
        position: relative;
        background: white;
        padding: 0;
        border-radius: 2px;
        width: 100%;
        overflow: hidden;
        box-shadow: 0 4px 13px 0 rgb(0, 0, 0, 9%);
        transition: all 0.2s ease 0.05s;

        .out-of-stock {
            position: absolute;
            padding: 10px 0px;
            background: black;
            color: white;
            width: 165px;
            text-align: center;
            transform: rotate(45deg) translate(43px, -20px);
            z-index: 1;
            font-size: 16px;
            font-weight: 900;
        }

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
            color: #69BCB8;
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
                color: #69BCB8;

                &:before {
                    content: "";
                    position: absolute;
                    width: 0%;
                    height: 3px;
                    background: #69BCB8;
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

    .section {
        display: block;
        padding: 30px 3rem;
        background: white;

        @media (max-width: 1161px) {
            padding: 30px .7rem;
        }

        .title {
            position: relative;
            padding: 10px;
            text-align: center;
            max-width: 30%;
            margin: 0 auto;

            span {
                font-size: 2em;
                color: black;
                background: white;
                padding: 5px 40px;
                display: block;
                position: relative;
                z-index: 10;
                max-width: fit-content;
                text-align: center;
                margin: 0 auto;
                font-weight: 100;
            }

            &:before {
                content: "";
                position: absolute;
                width: 100%;
                height: .5px;
                background: black;
                left: 0;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                z-index: 9;
            }
        }

        .container-loading {
            position: relative;
            width: 100%;
            height: 70px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;

            img {
                display: block;
                width: 50px;
                height: 50px;
                margin: 0 auto;
                animation: spin .7s linear infinite;
            }
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg)
            }

            100% {
                transform: rotate(360deg)
            }
        }
    }
}
</style>
