<template>
<div class="login-page">
    <v-snackbar v-model="snackbar" :color="color" top>
        {{ message }}

        <template v-slot:action="{ attrs }">
            <v-btn color="secondary" icon v-bind="attrs" @click="snackbar = false">
                <i style="font-size: 14px" class="im im-x-mark"></i>
            </v-btn>
        </template>
    </v-snackbar>

    <v-dialog v-model="dialog" max-width="450px" origin="center center" persistent>
        <v-card class="pa-0" style="overflow: auto">
            <v-system-bar class="pa-5" height="70px" color="#69BCB8" dark>
                <v-btn color="secondary" icon small @click="dialog = false">
                    <i style="font-size: 13px" class="im im-x-mark"></i>
                </v-btn>
            </v-system-bar>

            <v-form ref="checkUserEmailForm" class="pa-4" v-model="validCheckUserEmailForm" lazy-validation @submit.prevent="checUserkEmail()">
                <v-row>
                    <v-col cols="12">
                        <v-text-field color="#69BCB8" :rules="[v => !!v || 'هذا الحقل مطلوب', v => /.+@.+\..+/.test(v) || 'ايميل غير صحيح']" type="email" required autocomplete="off" v-model="resetEmail" label="البريد الالكتروني" prepend-inner-icon="fa-envelope"></v-text-field>
                    </v-col>
                </v-row>

                <v-btn color="#69BCB8" :disabled="!validCheckUserEmailForm" dark :loading="btn_loading_email" depressed large class="mx-auto" block type="submit">
                    تحقق من البريد
                </v-btn>
            </v-form>
        </v-card>
    </v-dialog>

    <v-dialog v-model="userVerifcationCode" max-width="450px" origin="center center" persistent>
        <v-card class="pa-0" style="overflow: auto">
            <v-system-bar class="pa-5" height="70px" color="#69BCB8" dark>
                <v-btn color="secondary" icon small @click="userVerifcationCode = false">
                    <i style="font-size: 13px" class="im im-x-mark"></i>
                </v-btn>
            </v-system-bar>

            <div class="pa-7">
                <vue-fake-input :length="6" :fontSize="20" inputColor="#69BCB8" fontColor="secondary" :onlyNumber="true" :allowPaste="true" v-model="codeValue" />
            </div>

            <div class="pa-5">
                <v-btn color="#69BCB8" dark depressed large class="mx-auto" :loading="btn_loading_code" block @click.stop="checkVerifcationCode()">
                    ارسال الكود
                </v-btn>
            </div>
        </v-card>
    </v-dialog>

    <div class="parts">
        <div class="part w-30">
            <div class="form">
                <v-btn color="#69BCB8" dark to="/" :disabled="btn_loading" fab class="fab-home" width="60px" height="60px">
                    <i class="im im-home"></i>
                </v-btn>
                <div class="logo"></div>
                <v-form ref="login" v-model="valid" lazy-validation @submit.prevent="login">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field color="#69BCB8" :rules="[v => !!v || 'هذا الحقل مطلوب']" type="text" required autocomplete="off" v-model="username" label="اسم المستخدم" prepend-inner-icon="fa-user"></v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-text-field color="#69BCB8" :rules="[v => !!v || 'هذا الحقل مطلوب']" :type="showPassword ? 'text' : 'password'" required v-model="password" label="كلمة المرور" prepend-inner-icon="fa-lock" :append-icon="showPassword ? 'fa-eye-slash' : 'fa-eye'" @click:append="showPassword = !showPassword"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-checkbox v-model="rememberMe" color="#69BCB8" label="تذكرني"></v-checkbox>

                    <v-btn color="#69BCB8" dark :loading="btn_loading" :disabled="!valid" width="200px" rounded large class="mx-auto" type="submit">
                        تسجيل الدخول
                    </v-btn>

                    <div class="divider">
                        <span>او يمكنك</span>
                    </div>
                    <v-btn color="#69BCB8" class="mx-auto" width="200px" large depressed rounded text @click="dialog = true">استعادة كلمة المرور</v-btn>
                </v-form>
            </div>
        </div>

        <div class="part w-70 bg">
            <div class="content">
                <h1>مرحبا بك من جديد</h1>
                <p>
                    يمكنك الان التمتع بجميع مميزات الموقع من خلال تسجيل الدخول اذا كان لديك حساب او يمكن انشاء حساب مجانا من خلال الرابط ادناه و شراء كل متطلباتك بدون بذل اي مجهود و من خلال البيت
                </p>
                <v-btn color="white" rounded outlined to="/register">
                    انشاء حساب
                </v-btn>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import VueFakeInput from '../components/Pincode';
export default {
    components: {
        VueFakeInput
    },

    metaInfo() {
        return {
            title: 'تسجيل الدخول',
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
            username: '',
            password: '',
            resetEmail: '',
            showPassword: false,
            valid: true,
            validCheckUserEmailForm: true,
            dialog: false,
            userVerifcationCode: false,
            userVerifcationCodeNumber: '',
            message: '',
            color: '',
            snackbar: false,
            btn_loading: false,
            btn_loading_email: false,
            btn_loading_code: false,
            rememberMe: false,
            codeValue: '',
        }
    },

    computed: {
        isLoggedIn() {
            return this.$store.getters.isLoggedIn
        }
    },

    methods: {
        login() {
            this.btn_loading = true;
            let user = {
                userName: this.username,
                password: this.password
            };

            if (this.$refs.login.validate()) {
                setTimeout(() => {
                    this.$store.dispatch('loginProccess', user)
                        .then((result) => {
                            this.snackbar = true;
                            this.color = '#69BCB8';
                            this.message = `مرحبا بك ${user.userName}` + ' تم تسجيل الدخول بنجاح'
                            this.btn_loading = false;
                            if (this.rememberMe == true) {
                                localStorage.setItem('ACCESS_TOKEN', result.token);
                                localStorage.setItem('username', user.userName);
                            } else {
                                sessionStorage.setItem("ACCESS_TOKEN", result.token);
                                sessionStorage.setItem('username', user.userName);
                            }

                            this.$router.push({name: 'home'}).catch(()=>{});
                        }).catch((err) => {
                            this.snackbar = true;
                            this.color = 'error';
                            this.message = err.response.data.message;
                            this.btn_loading = false;
                        });
                }, 2000)

            } else {
                this.snackbar = true;
                this.color = 'error';
                this.message = 'كل الحقول مطلوبة'
                this.btn_loading = false;
            }
        },

        checUserkEmail() {
            let self = this;
            self.btn_loading_email = true;
            if (this.$refs.checkUserEmailForm.validate()) {
                self.axios.post('checkUserEmail', {
                    email: self.resetEmail
                }).then(data => {
                    self.snackbar = true;
                    self.color = '#69BCB8';
                    self.message = 'تحقق من البريد الالكتروني';
                    self.btn_loading_email = false;
                    self.dialog = false;
                    self.userVerifcationCode = true;
                }).catch(err => {
                    self.snackbar = true;
                    self.color = 'error';
                    self.message = 'يوجد خطأ في تأكيد البريد الالكتروني';
                    self.btn_loading_email = false;
                    self.dialog = false;
                    console.error(err);
                })
            }

        },

        checkVerifcationCode() {
            let self = this;
            self.btn_loading_code = true;
            self.axios.post('resetPassword', {
                email: self.resetEmail,
                code: Number(self.codeValue)
            }).then(data => {
                self.snackbar = true;
                self.color = '#69BCB8';
                self.message = 'تم ارسال كلمة المرور الى البريد الالكتروني';
                self.btn_loading_code = false;
                self.dialog = false;
                self.userVerifcationCode = false;
            }).catch(err => {
                self.snackbar = true;
                self.color = 'error';
                self.message = 'يوجد خطأ في تأكيد البريد الالكتروني';
                self.btn_loading_code = false;
                self.dialog = false;
                console.error(err.response);
            })
        }
    },
}
</script>

<style lang="scss">
.fk-input-container {
    width: 100%;
    display: flex !important;
    align-items: center;
    justify-content: center;
    direction: ltr;

    input {
        margin: 0 10px !important;
        border: 3px solid rgb(238, 238, 238) !important;
        width: 50px !important;
        height: 50px !important;
        border-radius: 4px !important;

        &:focus {
            border-color: #69BCB8 !important;
        }
    }
}

.login-page {
    height: 100vh;
    width: 100vw;
    background: white;

    .reset-card {
        position: relative;
    }

    .close-dialog {
        position: absolute !important;
        top: 0 !important;
        right: 0 !important;
    }

    .parts {
        display: flex;
        align-items: stretch;
        justify-content: center;
        height: 100%;
        width: 100%;

        .part {
            background: white;
            height: 100%;
            position: relative;
            z-index: 10;

            .fab-home {
                position: absolute;
                left: -30px;
                top: 30px;
            }

            &.w-30 {
                width: 30%;
                z-index: 30;
            }

            &.w-70 {
                width: 70%;
            }

            &.black {
                background: black;
            }

            .form {
                height: 100%;
                padding: 0px 4.4rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                .logo {
                    background: {
                        image: url('../assets/images/logo.png');
                        repeat: no-repeat;
                        size: contain;
                        position: center;
                    }

                    ;
                    width: 100%;
                    height: 150px;
                    display: block;
                    margin: 0 0 30px 0;
                }

                form {
                    .mx-auto {
                        margin: 0 auto !important;
                        display: block;
                        padding: 0 20px;
                    }

                    .divider {
                        position: relative;
                        text-align: center;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 30px;
                        margin: 30px auto;

                        &:before {
                            position: absolute;
                            content: "";
                            width: 100%;
                            height: 1px;
                            background: rgba(black, .10);
                            left: 0;
                            top: 50%;
                            transform: translateY(-50%);
                        }

                        span {
                            padding: 0 10px;
                            min-height: 30px;
                            color: black;
                            background: white;
                            display: block;
                            position: relative;
                            z-index: 10;
                        }
                    }
                }
            }

            &.bg {
                background: url('../assets/images/login.jpg');
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
            }

            .content {
                display: flex;
                align-items: flex-start;
                justify-content: center;
                flex-direction: column;
                height: 100%;
                color: white;
                padding: 0px 4rem;

                h1 {
                    font-size: 5vw;
                }

                p {
                    max-width: 550px;
                    font-size: 17px;
                    line-height: 2.5;
                }
            }
        }
    }
}
</style>
