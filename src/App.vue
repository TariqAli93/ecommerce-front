<template>
<v-app>
    <v-sheet v-if="loading_screen" width="100vw" height="100vh" color="white" class="loading_sheet">
        <img src="./assets/images/loading-icon.svg" alt="Loading...">
    </v-sheet>

    <v-navigation-drawer v-if="showDefaultLayout" right v-model="$store.state.sidebar" fixed style="z-index: 5000" temporary width="450">
        <template v-slot:prepend>
            <div class="pa-5 white" style="border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important">
                <div class="d-flex justify-space-between align-center">
                    <h3>سلة المشتريات</h3>
                    <v-btn color="#28DF47" fab elevation="0" dark width="50px" height="50px" @click="$store.state.sidebar = false">
                        <i class="im im-x-mark"></i>
                    </v-btn>
                </div>
            </div>
        </template>
        <sidecart />
        <template v-slot:append>
            <div class="pa-5 white" v-if="$store.getters.product_count > 0" style="border-top: 1px solid rgba(0, 0, 0, 0.1) !important">
                <v-btn v-if="$store.getters.isLoggedIn !== true" color="#28DF47" block dark depressed to="/login">
                    تسجيل الدخول
                </v-btn>

                <v-btn v-else color="#28DF47" block dark depressed to="/cart">
                    عرض السلة
                </v-btn>
                <h4 class="d-block text-center pa-3">المجموع - بدون ضرائب : {{ totalPrice }} <i class="fa fa-dollar"></i></h4>
            </div>
        </template>
    </v-navigation-drawer>
    <v-app-bar v-if="showDefaultLayout" class="toolbar-custom" scroll-threshold="300" fixed style="z-index: 4500" color="white">
        <navbar />
    </v-app-bar>

    <v-main id="scrollingTarget" :class="{'is-padding': showDefaultLayout}">
        <router-view></router-view>
    </v-main>

    <v-footer inset v-if="showDefaultLayout" class="footer">
        <v-container fluid>
            <div class="footer-inner">
                <div class="d-flex align-center justify-center">
                    <div style="width: 33%" class="d-flex justify-start">
                        <v-menu offset-y top class="rounded-sm" nudge-top="10" transition="slide-y-reverse-transition">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn color="#28DF47" block dark depressed v-bind="attrs" v-on="on">
                                    القوائم
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item v-for="(item, index) in navlist" :key="index">
                                    <v-list-item-title>{{ item.text }}</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </div>

                    <v-divider class="mx-4" vertical></v-divider>
                    <span style="width: 33%">
                        <address><a style="color: black">بغداد - الدورة - شارع ابو طيارة</a></address>
                    </span>
                    <v-divider class="mx-4" vertical></v-divider>
                    <ul class="d-flex align-center justify-center">
                        <li><a href="/"><i class="im im-facebook"></i></a></li>
                        <li><a href="/"><i class="im im-twitter"></i></a></li>
                        <li><a href="/"><i class="im im-instagram"></i></a></li>
                        <li><a href="/"><i class="im im-snapchat"></i></a></li>
                    </ul>
                </div>
            </div>
            <v-divider></v-divider>
            <div class="footer-copyright d-flex align-center justify-center pa-4">
                <span>جميع الحقوق محفوظة <i class="fa fa-copyright" aria-hidden="true"></i></span>
            </div>
        </v-container>
    </v-footer>
    <v-btn color="#28DF47" dark id="goToUpBtn" fab small fixed right bottom @click="$vuetify.goTo(0)">
        <i class="im im-arrow-up" style="font-size: 13px"></i>
    </v-btn>
</v-app>
</template>

<style lang="scss">
#goToUpBtn {
    transform: translateX(250px);
    visibility: hidden;
    opacity: 0;
    transition: all 0.2s ease 0.12s;

    &.active {
        visibility: visible;
        opacity: 1;
        transform: translateX(0px);
    }
}

.footer-inner {
    display: block;
    padding: 30px 0px;

    ul {
        list-style: none;

        li {
            display: block;
            padding: 10px;

            a {
                display: block;
                font-size: 15px;
                color: black;
                padding: 10px 20px;

                i {
                    color: black;
                }
            }
        }
    }
}

.toolbar-custom {
    height: auto !important;
    padding: 0px !important;
    box-shadow: 0 2px 10px 0 rgba(black, .10) !important;
    transition: all 0.2s ease 0.12s;

    .v-toolbar__content {
        height: auto !important;
        padding: 0 !important;
    }
}

.loading_sheet {
    position: fixed !important;
    top: 0;
    right: 0;
    z-index: 12000;
    display: flex;
    align-items: center;
    justify-content: center;

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
</style>

<script>
import navbar from '@/components/navbar/'
import sidecart from '@/components/sidecart'
export default {
    name: 'App',
    components: {
        navbar,
        sidecart
    },

    data() {
        return {
            sidebar: false,
            loading_screen: true,
            upBtn: false,
            navlist: [{
                    to: '/',
                    text: 'الرئيسية'
                },
                {
                    to: '/about',
                    text: 'من نحن'
                },
                {
                    to: '/shop',
                    text: 'المتجر'
                },
                {
                    to: '/contact',
                    text: 'اتصل بنا'
                },
            ]
        }
    },

    computed: {
        showDefaultLayout() {
            let pathes = ['/login', '/register'];
            let currentPath = this.$route.path;

            if (pathes.includes(currentPath)) {
                return false
            }
            return true
        },

        totalPrice() {
            return this.$store.getters.totalPrice;
        }
    },

    mounted() {
        setTimeout(() => {
            this.loading_screen = false;
        }, 2000);

        window.addEventListener('scroll', event => {
            this.goUpBtn();
        });

        window.addEventListener('beforeunload', (event) => {
            if (this.$store.state.cart.length > 0) {
                event.preventDefault();
                event.returnValue = 'لديك منتجات في السلة';
            }
        })
    },

    watch: {
        '$route'(to, from) {
            this.loading_screen = true;

            setTimeout(() => {
                this.loading_screen = false;
            }, 2000)
        }
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

        goUpBtn() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollOffsetNumber = 450;
            const up = document.querySelector('#goToUpBtn');

            if (scrollTop >= scrollOffsetNumber) {
                up.classList.add('active');
            } else {
                up.classList.remove('active')
            }
        }
    },

    metaInfo: {
        title: 'الصفحة الرئيسية',
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
};
</script>
