<template>
<v-app>
    <div class="mobile-detect" v-show="detectMob()">
        <h1>انت تستخدم هاتف</h1>
        
        <h4>{{ mobileVersion }}</h4>
        
        <p>لتجربة افضل يرجى تحميل التطبيق الخاص بنا على</p>

        <v-btn color="#28DF47" v-show="androidPhone" rounded medium depressed dark>
            <i class="im im-google-play"></i>
            <span>Google Play</span>
        </v-btn>
        
        <v-btn color="#28DF47" v-show="iosPhone" rounded medium depressed dark>
            <i class="im im-apple-os"></i>
            <span>Apple Store</span>
        </v-btn>
    </div>
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
        <div class="footer-container">
            <div class="input">
                <input type="text" class="subscribe-input" placeholder="اشتراك في النشرة البريدية">
                <button class="subscribe-button">
                    <i class="im im-check-mark"></i>
                </button>
            </div>
        </div>

        <v-divider></v-divider>

        <div class="footer-container">
            <div class="footer-item footer-item-logo">
                <router-link tag="a" class="logo" to="/"></router-link>
                <p class="logo-slug">
                    مرحبا بك في المتجر العراقي للتسوق الالكتروني
                </p>
            </div>

            <div class="footer-item">
                <a href="#">من نحن</a>
                <a href="#">اتصل بنا</a>
                <a href="#">سياسة الارجاع</a>
                <a href="#">الخصوصية</a>
                <a href="#">سياسة الارجاع</a>
                <a href="#">الخصوصية</a>
            </div>

            <div class="footer-item">
                <a href="#">من نحن</a>
                <a href="#">اتصل بنا</a>
                <a href="#">سياسة الارجاع</a>
                <a href="#">الخصوصية</a>
                <a href="#">سياسة الارجاع</a>
                <a href="#">الخصوصية</a>
            </div>

            <div class="footer-item">
                <a href="#">من نحن</a>
                <a href="#">اتصل بنا</a>
                <a href="#">سياسة الارجاع</a>
                <a href="#">الخصوصية</a>
                <a href="#">سياسة الارجاع</a>
                <a href="#">الخصوصية</a>
            </div>
        </div>

        <v-divider></v-divider>

        <div class="footer-container">
            <div class="footer-social">
                <a href="#"><i class="im im-facebook"></i></a>
                <a href="#"><i class="im im-twitter"></i></a>
                <a href="#"><i class="im im-instagram"></i></a>
                <a href="#"><i class="im im-snapchat"></i></a>
            </div>
        </div>
    </v-footer>
    <v-btn color="#28DF47" dark id="goToUpBtn" fab small fixed right bottom @click="$vuetify.goTo(0)">
        <i class="im im-arrow-up" style="font-size: 13px"></i>
    </v-btn>
</v-app>
</template>

<style lang="scss">
.mobile-detect {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 30000;
    flex-direction: column;
    text-align: center;

    p {
        font-weight: 500;
        padding: 10px 0px;
    }

    .v-btn {
        height: auto !important;
        width: auto !important;
        padding: 20px 30px !important;
        margin-bottom:  20px;
        i {
            margin-left: 10px;
            font-size: 15px;
            margin-bottom: 0px;
        }

        span {
            font-weight: 900;
        }
    }
}

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

.footer {
    display: block !important;
    background: #1f1f1f !important;

    &-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 100px;

        .footer-social {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 10px;

            a {
                display: flex;
                color: #28DF47;
                opacity: .5;
                font-size: 15px;
                width: 50px;
                height: 50px;
                align-items: center;
                justify-content: center;
                position: relative;
                margin: 0 10px;
                text-decoration: none;
                transition: all 0.2s ease 0.05s;

                i {
                    position: relative;
                    z-index: 1;
                }

                &:before {
                    content: "";
                    position: absolute;
                    width: 50px;
                    height: 50px;
                    left: 0;
                    right: 0;
                    margin: 0 auto;
                    background: #28DF47;
                    top: 0;
                    z-index: 0;
                    border-radius: 5px;
                    transform: scale(.6);
                    opacity: 0;
                    transition: all 0.2s ease 0.05s;
                }

                &:hover,
                &:focus,
                &:active {
                    opacity: 1;
                    color: white;

                    &:before {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
            }
        }

        .input {
            display: block;
            width: 100%;
            position: relative;
            padding: 0 35px;

            .subscribe-input {
                width: 100%;
                background: transparent;
                height: 55px;
                border: 2px solid #28df28;
                display: block;
                border-radius: 50px;
                padding-right: 70px;
                outline: none;
                color: #28df28;
                opacity: .5;
                transition: all 0.2s ease 0.05s;

                &:hover,
                &:focus,
                &:active {
                    opacity: 1;
                }

                &:hover+.subscribe-button,
                &:focus+.subscribe-button,
                &:active+.subscribe-button {
                    opacity: 1;
                }
            }

            .subscribe-button {
                position: absolute;
                width: 40px;
                height: 40px;
                background: #28df28;
                border: none;
                outline: none;
                box-shadow: none;
                border-radius: 100px;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: .5;
                top: 50%;
                right: 45px;
                transform: translateY(-50%);
                transition: all 0.2s ease 0.05s;

                i {
                    margin: 0;
                    font-size: 14px;
                    color: WHITE;
                }
            }
        }

        .footer-item {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            width: 100%;
            padding: 30px 10px;

            &-logo {
                padding: 30px;
                opacity: .5;
                transition: all 0.2s ease 0.05s;

                .logo {
                    background: {
                        image: url('./assets/images/logo.png');
                        repeat: no-repeat;
                        size: cover;
                        position: center;
                    }

                    ;
                    width: 315px;
                    height: 100px;
                }

                .logo-slug {
                    color: #28DF47;
                    font-weight: 900;
                    font-size: 13px;
                    display: block;
                    width: 100%;
                    text-align: center;
                }

                &:hover,
                &:focus,
                &:active {
                    opacity: 1;
                }
            }

            a:not(.logo) {
                display: block;
                text-align: right;
                text-decoration: none;
                color: #28DF47;
                opacity: .5;
                padding: 5px 5px;
                position: relative;
                min-width: 120px;
                transition: all 0.2s ease 0.05s;

                &:before {
                    content: "";
                    position: absolute;
                    width: 0%;
                    height: 2px;
                    bottom: 0;
                    right: 0;
                    background: #28DF47;
                    transition: all 0.2s ease 0.05s;
                }

                &:not(:last-child) {
                    margin-bottom: 5px;
                }

                &:hover,
                &:focus,
                &:active {
                    opacity: 1;

                    &:before {
                        width: 100%;
                    }
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
            mobileVersion: '',
            androidPhone: false,
            iosPhone: false,
            app_info: {},
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
        },

        appinfo() {
            return this.app_info;
        }
    },

    mounted() {
        setTimeout(() => {
            this.loading_screen = false;
        }, 2000);

        window.addEventListener('scroll', event => {
            this.goUpBtn();
        });

        this.axios.get('settings')
        .then(data => {
            this.app_info = data.data[0];
        })
        .catch(err => {
            console.error(err)
        });

        console.log(this.appinfo)
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
        },

        detectMob() {
            // global vars
            var unknown = '-';
            var nVer = navigator.appVersion;
            var nAgt = navigator.userAgent;
            var version = '' + parseFloat(navigator.appVersion);
            var majorVersion = parseInt(navigator.appVersion, 10);
            var nameOffset, verOffset, ix;

            // system
            var os = unknown;
            var clientStrings = [{
                    s: 'Windows 10',
                    r: /(Windows 10.0|Windows NT 10.0)/
                },
                {
                    s: 'Windows 8.1',
                    r: /(Windows 8.1|Windows NT 6.3)/
                },
                {
                    s: 'Windows 8',
                    r: /(Windows 8|Windows NT 6.2)/
                },
                {
                    s: 'Windows 7',
                    r: /(Windows 7|Windows NT 6.1)/
                },
                {
                    s: 'Windows Vista',
                    r: /Windows NT 6.0/
                },
                {
                    s: 'Windows Server 2003',
                    r: /Windows NT 5.2/
                },
                {
                    s: 'Windows XP',
                    r: /(Windows NT 5.1|Windows XP)/
                },
                {
                    s: 'Windows 2000',
                    r: /(Windows NT 5.0|Windows 2000)/
                },
                {
                    s: 'Windows ME',
                    r: /(Win 9x 4.90|Windows ME)/
                },
                {
                    s: 'Windows 98',
                    r: /(Windows 98|Win98)/
                },
                {
                    s: 'Windows 95',
                    r: /(Windows 95|Win95|Windows_95)/
                },
                {
                    s: 'Windows NT 4.0',
                    r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/
                },
                {
                    s: 'Windows CE',
                    r: /Windows CE/
                },
                {
                    s: 'Windows 3.11',
                    r: /Win16/
                },
                {
                    s: 'Android',
                    r: /Android/
                },
                {
                    s: 'Open BSD',
                    r: /OpenBSD/
                },
                {
                    s: 'Sun OS',
                    r: /SunOS/
                },
                {
                    s: 'Linux',
                    r: /(Linux|X11)/
                },
                {
                    s: 'iOS',
                    r: /(iPhone|iPad|iPod)/
                },
                {
                    s: 'Mac OS X',
                    r: /Mac OS X/
                },
                {
                    s: 'Mac OS',
                    r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/
                },
                {
                    s: 'QNX',
                    r: /QNX/
                },
                {
                    s: 'UNIX',
                    r: /UNIX/
                },
                {
                    s: 'BeOS',
                    r: /BeOS/
                },
                {
                    s: 'OS/2',
                    r: /OS\/2/
                },
                {
                    s: 'Search Bot',
                    r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/
                }
            ];

            // system loop
            for (var id in clientStrings) {
                var cs = clientStrings[id];
                if (cs.r.test(nAgt)) {
                    os = cs.s;
                    break;
                }
            }

            // assign os version number in variable 
            var osVersion = unknown;

            // is your system windows os variable now is Windows
            if (/Windows/.test(os)) {
                osVersion = /Windows (.*)/.exec(os)[1];
                os = 'Windows';
            }

            switch (os) {
                // is your system Mac OS X os variable now is Mac OS X
                case 'Mac OS X':
                    osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
                    break;

                    // is your system Android os variable now is Android
                case 'Android':
                    osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
                    break;

                    // is your system iOS os variable now is iOS
                case 'iOS':
                    osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
                    osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
                    break;
            }

            this.mobileVersion = os + ' ' + osVersion;

            if (os === 'Android' || os === 'iOS') {
                if(os === 'Android') {
                    this.androidPhone = true;
                } else {
                    this.iosPhone = true;
                }
                return true;
            } else {
                return false;
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
