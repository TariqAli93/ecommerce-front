<template>
<div class="profile-page">
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
                    <i style="color: #69BCB8; font-size: 15px" class="im im-arrow-left" aria-hidden="true"></i>
                </template>
                <template v-slot:item="{ item }">
                    <v-breadcrumbs-item :to="item.href" style="color: #69BCB8" :disabled="item.disabled">
                        <span style="color: #69BCB8">{{item.text.toUpperCase()}}</span>
                    </v-breadcrumbs-item>
                </template>
            </v-breadcrumbs>
        </v-container>
    </div>

    <v-dialog v-model="updateProfileModal" persistent max-width="500px" transition="dialog-transition">
        <v-card class="elevation-0 pa-0">
            <v-toolbar dark color="#69BCB8" elevation="0">
                <v-btn icon dark @click="updateProfileModal = false">
                    <i class="im im-x-mark"></i>
                </v-btn>
                <v-toolbar-title>تحديث المستخدم</v-toolbar-title>
            </v-toolbar>

            <v-form ref="updateProfile" class="pa-5" v-model="valid" lazy-validation @submit.prevent="update">
                <v-row>
                    <v-col cols="12">
                        <v-text-field color="#69BCB8" :rules="[v => !!v || 'هذا الحقل مطلوب', v => /^07([\d]{3})[(\D\s)]?[\d]{3}[(\D\s)]?[\d]{3}$/.test(v) || 'رقم الهاتف غير صحيح']" type="text" required v-model="phone" label="رقم الهاتف" prepend-inner-icon="fa-phone"></v-text-field>
                    </v-col>

                    <v-col cols="12">
                        <v-text-field color="#69BCB8" :rules="[v => !!v || 'هذا الحقل مطلوب']" type="text" required v-model="address" label="العنوان" prepend-inner-icon="fa-map-marker"></v-text-field>
                    </v-col>
                </v-row>

                <v-btn color="#69BCB8" depressed block dark :loading="btn_loading" :disabled="!valid" width="200px" rounded large class="mx-auto" type="submit">
                    تحديث
                </v-btn>
            </v-form>
        </v-card>
    </v-dialog>

    <v-dialog v-model="updatePasswordModal" persistent max-width="500px" transition="dialog-transition">
        <v-card class="elevation-0 pa-0">
            <v-toolbar dark color="#69BCB8" elevation="0">
                <v-btn icon dark @click="updatePasswordModal = false">
                    <i class="im im-x-mark"></i>
                </v-btn>
                <v-toolbar-title>تعديل كلمة المرور</v-toolbar-title>
            </v-toolbar>

            <v-form ref="updatePassword" class="pa-5" v-model="valid" lazy-validation @submit.prevent="resetPassword($event)">
                <v-row>
                    <v-col cols="12">
                        <v-text-field color="#69BCB8" label="كلمة المرور القديمة" :type="showPassword ? 'text' : 'password'" v-model="oldPassword" :append-icon="showPassword ? 'fa-eye-slash' : 'fa-eye'" @click:append="showPassword = !showPassword" prepend-inner-icon="fa-lock"></v-text-field>
                    </v-col>

                    <v-col cols="12">
                        <v-text-field color="#69BCB8" :rules="[v => !!v || 'هذا الحقل مطلوب', v => (v && v.length > 6) || 'كلمة المرور قصيرة']" label="كلمة المرور الجديدة" :type="showPassword ? 'text' : 'password'" required v-model="newPassword" :append-icon="showPassword ? 'fa-eye-slash' : 'fa-eye'" @click:append="showPassword = !showPassword" prepend-inner-icon="fa-lock"></v-text-field>
                    </v-col>
                </v-row>

                <v-btn color="#69BCB8" depressed block dark :loading="btn_loading" :disabled="!valid" width="200px" rounded large class="mx-auto" type="submit">
                    تحديث
                </v-btn>
            </v-form>
        </v-card>
    </v-dialog>

    <v-container>
        <div class="profile-content">
            <div class="banner">
                <div class="banner-image">
                    <div class="d-flex align-center justify-space-between" style="width: 100%">
                        <div class="d-flex align-center justify-center">
                            <img src="../assets/images/profile-image.svg" />
                            <h3>{{ userInfo.userName }}</h3>
                        </div>

                        <div>
                            <v-btn color="secondary" depressed medium dark @click="updatePasswordModal = true">
                                <i class="im im-key" style="font-size: 13px; margin-left: 10px"></i>
                                <span>تغير كلمة المرور</span>
                            </v-btn>

                            <v-btn color="#69BCB8" depressed medium dark @click="updateProfileModal = true" class="mr-5">
                                <i class="im im-edit" style="font-size: 13px; margin-left: 10px"></i>
                                <span>تحرير</span>
                            </v-btn>
                        </div>
                    </div>
                </div>

                <div class="banner-tabs">
                    <v-tabs v-model="profileTabs" background-color="white" style="border-bottom: 1px solid rgba(0,0,0,0.10)" color="#69BCB8" left>
                        <v-tab>معلوماتي</v-tab>
                        <v-tab>فواتيري</v-tab>
                    </v-tabs>

                    <v-tabs-items v-model="profileTabs" class="pt-7 pb-7">
                        <v-tab-item>
                            <v-list nav>
                                <v-list-item>
                                    <div class="d-flex align-center justify-start">
                                        <span class="pl-5">اسم المستخدم: </span>
                                        <span>{{ profileInfo.name }}</span>
                                    </div>
                                </v-list-item>
                                <v-divider></v-divider>
                                <v-list-item>
                                    <div class="d-flex align-center justify-start">
                                        <span class="pl-5">رقم الهاتف: </span>
                                        <span>{{ profileInfo.phone }}</span>
                                    </div>
                                </v-list-item>
                                <v-divider></v-divider>
                                <v-list-item>
                                    <div class="d-flex align-center justify-start">
                                        <span class="pl-5">البريد الالكتروني: </span>
                                        <span>{{ profileInfo.email }}</span>
                                    </div>
                                </v-list-item>
                                <v-divider></v-divider>
                                <v-list-item>
                                    <div class="d-flex align-center justify-start">
                                        <span class="pl-5">العنوان: </span>
                                        <span>{{ profileInfo.address }}</span>
                                    </div>
                                </v-list-item>
                            </v-list>
                        </v-tab-item>

                        <v-tab-item>
                            <v-data-table :headers="headers" :items.sync="invoices" :page.sync="page" :items-per-page="itemsPerPage" hide-default-footer @page-count="pageCount = $event" class="elevation-0">
                                <template v-slot:item.actions="{ item }">
                                    <v-btn color="#69BCB8" small depressed dark :to="`/invoice/${item.idInvoice}`">
                                        <span>عرض الفاتورة</span>
                                    </v-btn>
                                </template>

                                <template v-slot:item.discount="{ item }">
                                    <span>{{ item.discount }} %</span>
                                </template>

                                <template v-slot:item.tax="{ item }">
                                    <span>{{ $store.state.tax_number }} %</span>
                                </template>
                            </v-data-table>

                            <div class="text-center d-flex align-center justify-center pt-2">
                                <v-pagination v-model="page" color="#69BCB8" :length="pageCount"></v-pagination>
                            </div>
                        </v-tab-item>
                    </v-tabs-items>
                </div>
            </div>
        </div>
    </v-container>
</div>
</template>

<script>
export default {
    metaInfo() {
        return {
            title: 'الملف الشخصي | ' + this.userInfo.userName,
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
            page: 1,
            pageCount: 0,
            itemsPerPage: 10,
            updateProfileModal: false,
            updatePasswordModal: false,
            valid: true,
            btn_loading: false,
            phone: '',
            address: '',
            newPassword: '',
            oldPassword: '',
            showPassword: false,
            profileInfo: {
                name: '',
                email: '',
                address: '',
                phone: '',
            },
            breadcrumb_list: [{
                    text: 'المتجر',
                    disabled: false,
                    href: '/',
                },
                {
                    text: 'الملف الشخصي',
                    disabled: true,
                    href: '/profile',
                }
            ],
            profileTabs: null,
            headers: [{
                    text: 'رقم الفاتورة',
                    value: 'idUserInvoice',
                    sortable: false
                },
                {
                    text: 'اسم المنتج',
                    value: 'productName',
                    sortable: false
                },
                {
                    text: 'السعر الكلي',
                    value: 'totalPrice',
                    sortable: false
                },
                {
                    text: 'قسيمة الخصم',
                    value: 'discount',
                    sortable: false
                },
                {
                    text: 'ضريبة المنتج',
                    value: 'tax',
                    sortable: false
                },
                {
                    text: 'العرض',
                    value: 'actions',
                    sortable: false
                },
            ],
            invoices: [],
            invoice_id: '',
            invoice_note: '',
            addToCartSnackbar: false,
            addToCartSnackbarColor: '',
            addToCartSnackbarText: '',
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

        update() {
            let self = this;
            self.btn_loading = true;
            let postData = {
                phone: this.phone,
                address: this.address
            };

            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `bearer ${this.$store.state.token}`
                }
            };

            let updatePromise = new Promise((resolve, reject) => {
                self.axios.put(`user/${this.userInfo.id}`, postData, axiosConfig).then(data => {
                    self.getUserInfo();
                    resolve(data);
                }).catch(err => {
                    self.getUserInfo();
                    reject(err.response);
                });
            });

            updatePromise.then(data => {
                setTimeout(() => {
                    self.addToCartSnackbar = true;
                    self.addToCartSnackbarColor = '#69BCB8';
                    self.addToCartSnackbarText = 'تم تحديث المستخدم بنجاح';
                    self.btn_loading = false;
                    self.updateProfileModal = false;
                }, 2000)
            }).catch(err => {
                setTimeout(() => {
                    self.addToCartSnackbar = true;
                    self.addToCartSnackbarColor = 'error';
                    self.addToCartSnackbarText = 'خطأ في تحديث المستخدم';
                    self.updateProfileModal = false;
                    self.btn_loading = false;
                }, 2000)
            });
        },

        resetPassword(event) {
            let self = this;
            self.btn_loading = true;
            let token = self.$store.state.token;
            let user_id = self.decodeJwt(token).id;

            if (self.newPassword === self.oldPassword) {
                self.addToCartSnackbar = true;
                self.addToCartSnackbarColor = 'error';
                self.addToCartSnackbarText = 'كلمة السر الجديدة يجب ان تكون مختلفة عن القديمة';
                self.btn_loading = false;
            } else {
                self.axios.post('updatePassword', {
                    id: user_id,
                    password: self.newPassword,
                    oldPassword: self.oldPassword
                }, {
                    headers: {
                        Authorization: `bearer ${token}`
                    }
                }).then(data => {
                    self.addToCartSnackbar = true;
                    self.addToCartSnackbarColor = '#69BCB8';
                    self.addToCartSnackbarText = 'تم تحديث كلمة المرور بنجاح';
                    self.btn_loading = false;
                    self.updatePasswordModal = false;
                    console.log(data)
                }).catch(err => {
                    console.error(err);
                    self.btn_loading = false;
                });
            }
        },

        validate() {
            this.$refs.updateProfile.validate()
        },

        getUserInfo() {
            let self = this;
            let idUser = self.decodeJwt(self.$store.state.token).id;

            self.axios.get(`user/${idUser}`, {
                    headers: {
                        Authorization: `bearer ${self.$store.state.token}`
                    }
                })
                .then(data => {
                    self.profileInfo = {
                        name: data.data.name,
                        phone: data.data.phone,
                        address: data.data.address,
                        email: data.data.email,
                    }

                    this.phone = data.data.phone;
                    this.address = data.data.address;
                })
                .catch(err => {
                    console.error(err.response)
                })
        }
    },

    computed: {
        userInfo() {
            return this.decodeJwt(this.$store.state.token)
        }
    },

    mounted() {
        if (!this.$store.getters.isLoggedIn) {
            this.$router.push({
                path: '/'
            })
        }

        let self = this;
        self.axios.get(`userInvoice/${self.userInfo.id}`, {
                headers: {
                    Authorization: `bearer ${self.$store.state.token}`
                }
            })
            .then(result => {
                console.log(result.data);
                if (result.data.products.length > 0) {
                    self.invoice_id = result.data.idUserInvoice;
                    self.invoice_note = result.data.note;
                    self.invoices = result.data.products;
                }
            })
            .catch(err => {
                console.error(err.response);
            });

        this.getUserInfo();
    }
}
</script>

<style lang="scss">
.profile-content {
    display: block;
    padding: 0;
    background: transparent;

    .banner {
        display: block;
        padding: 0px;

        &-image {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            background: transparent;
            padding: 20px;
            position: relative;
            border-bottom: 1px solid rgba(black, .10);

            img {
                display: block;
                width: 70px;
                height: 70px;
                box-shadow: 0 2px 20px 0 rgba(black, .10);
                margin-left: 40px;
            }

            h3 {
                position: relative;
                font-weight: 900;
            }
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
        bottom: -155px;
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
