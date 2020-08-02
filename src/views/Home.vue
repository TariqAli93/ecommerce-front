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

    <v-carousel class="custom-carousel" show-arrows delimiter-icon="fa-minus" next-icon="fa-long-arrow-right" prev-icon="fa-long-arrow-left" hide-delimiter-background show-arrows-on-hover>
        <v-carousel-item v-for="i in 5" :key="i">
            <img src="../assets/images/login.jpg">
        </v-carousel-item>
    </v-carousel>

    <!-- newest -->
    <section class="section">
        <div class="title">
            <span>احدث المنتجات</span>
        </div>
        <v-container fluid>
            <v-row v-if="!loaddedContent">
                <v-col cols="12" xl="4" lg="4" md="4" sm="1" v-for="i in 3" :key="i">
                    <v-sheet>
                        <v-skeleton-loader class="mx-auto" type="card-avatar, article, actions"></v-skeleton-loader>
                    </v-sheet>
                </v-col>
            </v-row>

            <v-row v-else>
                <v-col cols="12" xl="4" lg="4" md="4" sm="1" v-for="product in newProducts" :key="product.idProduct">
                    <div class="card">
                        <div class="card-image">
                            <img :src="productsImagesPath + product.image" />
                        </div>

                        <div class="card-content">
                            <div class="card-content-header">
                                <h2>{{ product.productName }}</h2>
                            </div>

                            <div class="card-content-body">
                                <div class="card-content-body-btns">
                                    <v-btn color="secondary" rounded width="40px" min-width="20px" height="40px">
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
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </section>

    <section class="featured-section">
        <!-- <div class="image" style="`background-image:`"></div> -->
        <v-img :src="featuredProduct.image" class="image" tag="div"></v-img>
        <div class="content">
            <h2>{{ featuredProduct.productName }}</h2>
            <p>{{ featuredProduct.description }}</p>
            <v-btn color="black" dark medium depressed>
                <i class="im im-arrow-right" style="margin-left: 5px; font-size: 13px"></i>
                <span>عرض المنتج</span>
            </v-btn>
        </div>
    </section>

    <!-- best sales -->
    <section class="section">
        <div class="title">
            <span>افضل المبيعات</span>
        </div>
        <v-container fluid>
            <v-row>
                <v-col cols="12" xl="4" lg="4" md="4" sm="1" v-for="i in 3" :key="i">
                    <v-sheet v-if="!loaddedContent">
                        <v-skeleton-loader class="mx-auto" type="card-avatar, article, actions"></v-skeleton-loader>
                    </v-sheet>

                    <div class="card" v-else>
                        <div class="card-image">
                            <img src="../assets/images/login.jpg" />
                        </div>

                        <div class="card-content">
                            <div class="card-content-header">
                                <h2>اسم المنتج</h2>
                            </div>

                            <div class="card-content-body">
                                <div class="card-content-body-btns">
                                    <v-btn color="secondary" rounded width="40px" min-width="20px" height="40px">
                                        <i class="im im-eye" style="font-size: 13px"></i>
                                    </v-btn>

                                    <v-btn color="#28DF47" dark rounded width="40px" min-width="20px" height="40px">
                                        <i class="im im-shopping-cart" style="font-size: 13px"></i>
                                    </v-btn>
                                </div>

                                <h4><span>{{ i * 200 }}</span> <i class="fa fa-dollar"></i> </h4>

                                <p>{{ 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis, hic omnis rem, odio atque inventore optio, repellendus accusamus numquam similique ipsum illum tempora tenetur dolore neque doloremque? Nulla, fuga et.'.substring(0,100) + '...' }}</p>
                            </div>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </section>

    <section class="parallax">
        <div class="content d-flex align-center justify-center flex-column" style="height: 100%">
            <h1>خليك بالبيت</h1>
            <P>المتجر العراقي يوفر لك احتياجاتك بدون متروح للسوق و توصيل مجانا لحد باب البيت انته اطلب و احنه انفذ</P>
            <v-btn color="white" outlined rounded>
                اطلب الان
            </v-btn>
        </div>
    </section>

    <!-- all products -->
    <section class="section">
        <div class="title">
            <span>كل المنتجات</span>
        </div>
        <v-container fluid>
            <v-row>
                <v-col cols="12" xl="4" lg="4" md="4" sm="1" v-for="(item, index) in allProducts" :key="index">
                    <v-sheet v-if="!loaddedContent" color="grey lighten-4">
                        <v-skeleton-loader class="mx-auto" type="card-avatar, article, actions"></v-skeleton-loader>
                    </v-sheet>

                    <div class="card" v-else>
                        <div class="card-image">
                            <img :src="productsImagesPath + item.image" />
                        </div>

                        <div class="card-content">
                            <div class="card-content-header">
                                <h2>{{ item.productName }}</h2>
                            </div>

                            <div class="card-content-body">
                                <div class="card-content-body-btns">
                                    <v-btn color="secondary" rounded width="40px" min-width="20px" height="40px">
                                        <i class="im im-eye" style="font-size: 13px"></i>
                                    </v-btn>

                                    <v-btn color="#28DF47" dark rounded width="40px" min-width="20px" height="40px" @click="saveToCart(item)">
                                        <i class="im im-shopping-cart" style="font-size: 13px"></i>
                                    </v-btn>
                                </div>

                                <h4><span>{{ item.price }}</span> <i class="fa fa-dollar"></i> </h4>

                                <p>{{ item.description.substring(0,100) + '...' }}</p>
                            </div>
                        </div>
                    </div>
                </v-col>
            </v-row>

            <div v-show="containerLoading" class="container-loading">
                <img src="../assets/images/loading-icon.svg" alt="Loading...">
            </div>

            <v-btn color="#28DF47" :disabled="containerLoading || !loaddedContent" class="mx-auto" @click="showMore()" style="margin: 0 auto; display: block; margin-top: 15px" dark depressed rounded>
                <i class="im im-plus" style="font-size: 10px; margin-left: 5px"></i>
                <span>عرض المزيد</span>
            </v-btn>
        </v-container>
    </section>
</div>
</template>

<script>
import moment, {
    localeData
} from 'moment'
import serverPath from '../plugins/ServerSidePath'
export default {
    data() {
        return {
            show: false,
            allCount: 3,
            containerLoading: false,
            loaddedContent: false,
            addToCartSnackbar: false,
            addToCartSnackbarText: '',
            addToCartSnackbarColor: '',
            productsImagesPath: new serverPath().URL,
            featuredProduct: [],
            newProducts: [],
            allProducts: [],
            allProductsCount: 3
        }
    },

    methods: {
        showMore() {
            this.containerLoading = true
            setTimeout(() => {
                this.allProductsCount += 3;
                this.containerLoading = false;
                this.getAllProducts();
            }, 2000)
        },

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

        getNewProducts() {
            let self = this;
            self.axios.get('newProducts')
                .then(data => {
                    self.loaddedContent = true;
                    self.newProducts = data.data;
                })
                .catch(err => {
                    console.error(err)
                })
        },

        getAllProducts() {
            let self = this;
            self.axios.get('products')
                .then(data => {
                    self.allProducts = data.data.slice(0, self.allProductsCount);
                    self.featuredProduct = data.data[0];
                })
                .catch(err => {
                    console.error(err);
                })
        }
    },

    mounted() {
        this.getNewProducts()
        this.getAllProducts();
    },

    computed: {}
}
</script>

<style lang="scss">
.v-main {
    &.is-padding {
        padding-top: 160px !important;
    }
}

.home-page {
    min-height: 100%;

    .custom-carousel {
        height: 100vh !important;

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

    .parallax {
        min-height: 250px;
        padding: 3rem 0;
        position: relative;
        filter: hue-rotate(295deg);

        background: {
            image: url('../assets/images/background.png');
            repeat: no-repeat;
            position: right top;
            size: 100%;
            attachment: fixed;
        }

        .content {
            height: 100%;
            color: white;
            padding: 10px;
            margin-bottom: 10px;
            position: relative;
            z-index: 2;

            h1 {
                font-size: 4rem;
                padding: 10px;
                font-weight: 900;
            }

            p {
                padding: 10px;
                font-weight: 500;
                max-width: 400px;
                text-align: center;
                line-height: 2;
            }
        }
    }

    .featured-section {
        padding: 0px;
        display: flex;
        align-items: center;
        background: white;
        overflow: hidden;

        .v-image {
            background: {
                image: url('../assets/images/product-1.jpg');
                repeat: no-repeat;
                size: cover;
                position: center;
            }

            width: 44%;
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
            bottom: -205px;
            left: 0;
            right: 0;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            padding: 20px;
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
