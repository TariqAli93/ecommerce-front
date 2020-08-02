<template>
<div class="register-page">
    <v-snackbar v-model="snackbar" :color="color" top>
        {{ message }}

        <template v-slot:action="{ attrs }">
            <v-btn color="secondary" icon v-bind="attrs" @click="snackbar = false">
                <i style="font-size: 14px" class="im im-x-mark"></i>
            </v-btn>
        </template>
    </v-snackbar>
    <v-dialog v-model="dialog" max-width="650px" origin="center center" persistent>
        <v-card class="pa-0" style="overflow: auto">
            <v-system-bar class="pa-5" height="70px" color="secondary" dark>
                <v-btn color="secondary" fab small @click="dialog = false">
                    <i class="im im-x-mark"></i>
                </v-btn>
            </v-system-bar>

            <v-form ref="login" class="pa-4" v-model="valid" lazy-validation @submit.prevent="login">
                <v-row>
                    <v-col cols="12">
                        <v-text-field color="#28DF47" :rules="[v => !!v || 'هذا الحقل مطلوب', v => /.+@.+\..+/.test(v) || 'ايميل غير صحيح']" type="email" required autocomplete="off" v-model="resetEmail" label="البريد الالكتروني" prepend-inner-icon="fa-envelope"></v-text-field>
                    </v-col>
                </v-row>

                <v-btn color="#28DF47" :disabled="!valid" width="200px" depressed large class="mx-auto" block type="submit">
                    اعادة تعين
                </v-btn>
            </v-form>
        </v-card>
    </v-dialog>
    <div class="parts">
        <div class="part w-30">
            <div class="form">
                <v-btn color="#28DF47" dark to="/" :disabled="btn_loading" fab class="fab-home" width="60px" height="60px">
                    <i class="im im-home"></i>
                </v-btn>
                <div class="logo"></div>
                <v-form ref="login" v-model="valid" lazy-validation @submit.prevent="login">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field color="#28DF47" :rules="[v => !!v || 'هذا الحقل مطلوب']" type="text" required autocomplete="off" v-model="username" label="اسم المستخدم" prepend-inner-icon="fa-user"></v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-text-field color="#28DF47" :rules="[v => !!v || 'هذا الحقل مطلوب']" type="password" required v-model="password" label="كلمة المرور" prepend-inner-icon="fa-lock"></v-text-field>
                        </v-col>
                        
                        <v-col cols="12">
                            <v-text-field color="#28DF47" :rules="[v => !!v || 'هذا الحقل مطلوب']" type="password" required v-model="email" label="البريد الالكتروني" prepend-inner-icon="fa-envelope"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-btn color="#28DF47" dark :loading="btn_loading" :disabled="!valid" width="200px" rounded large class="mx-auto" type="submit">
                        انشاء الحساب
                    </v-btn>
                </v-form>
            </div>
        </div>

        <div class="part w-70 bg">
            <div class="content">
                <h1>مرحبا بك من جديد</h1>
                <p>
                    اهلا و سهلة بك زائرنا العزيز في هذه الصفحة يمكنك انشاء حساب و تسجيل الدخول و التمتع بجميع خصائص الموقع او يمكنك تسجيل الدخول اذا كان لديك حساب بالفعل عن طريق الرابط ادناه
                </p>
                <v-btn color="white" rounded outlined to="/login">
                    تسجيل الدخول
                </v-btn>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            username: '',
            password: '',
            email: '',
            resetEmail: '',
            valid: true,
            dialog: false,
            message: '',
            color: '',
            snackbar: false,
            btn_loading: false,
        }
    },

    mounted() {
        if (this.isLoggedIn) {
            this.$router.push({
                name: 'home'
            });
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
                            this.color = '#28DF47';
                            this.message = `مرحبا بك ${user.userName}` + ' تم تسجيل الدخول بنجاح'
                            this.btn_loading = false;
                            localStorage.setItem('username', user.userName);
                            if (this.$store.state.token !== null) {
                                this.$router.push({
                                    name: 'home'
                                });
                            }
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

        validate() {
            this.$refs.login.validate()
        },
    },
}
</script>

<style lang="scss">
.register-page {
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
                        size: auto;
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
