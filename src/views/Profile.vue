<template>
<div class="profile-page">
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
                            <v-btn color="#28DF47" depressed medium dark>
                                <i class="im im-edit" style="font-size: 13px; margin-left: 10px"></i>
                                <span>تحرير</span>
                            </v-btn>
                        </div>
                    </div>
                </div>

                <div class="banner-tabs">
                    <v-tabs v-model="profileTabs" background-color="white" style="border-bottom: 1px solid rgba(0,0,0,0.10)" color="#28DF47" left>
                        <v-tab>معلوماتي</v-tab>
                        <v-tab>فواتيري</v-tab>
                    </v-tabs>

                    <v-tabs-items v-model="profileTabs" class="pt-7 pb-7">
                        <v-tab-item>
                            <v-list nav>
                                <v-list-item>
                                    <div class="d-flex align-center justify-start">
                                        <span class="pl-5">اسم المستخدم: </span>
                                        <span>{{ userInfo.userName }}</span>
                                    </div>
                                </v-list-item>
                                <v-divider></v-divider>
                                <v-list-item>
                                    <div class="d-flex align-center justify-start">
                                        <span class="pl-5">رقم الهاتف: </span>
                                        <span>{{ userInfo.phone }}</span>
                                    </div>
                                </v-list-item>
                                <v-divider></v-divider>
                                <v-list-item>
                                    <div class="d-flex align-center justify-start">
                                        <span class="pl-5">البريد الالكتروني: </span>
                                        <span>{{ userInfo.email }}</span>
                                    </div>
                                </v-list-item>
                                <v-divider></v-divider>
                                <v-list-item>
                                    <div class="d-flex align-center justify-start">
                                        <span class="pl-5">العنوان: </span>
                                        <span>{{ userInfo.address }}</span>
                                    </div>
                                </v-list-item>
                            </v-list>
                        </v-tab-item>

                        <v-tab-item>
                            <v-data-table :headers="headers" :items="invoices" :page.sync="page" :items-per-page="itemsPerPage" hide-default-footer @page-count="pageCount = $event" :loading="invoices.length < 1" class="elevation-0">
                                <template v-slot:item.actions="{ item }">
                                    <v-btn color="#28DF47" small depressed dark :to="`/invoice/${item.idInvoice}`">
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
                                <v-pagination v-model="page" color="#28DF47" :length="pageCount"></v-pagination>
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
    data() {
        return {
            page: 1,
            pageCount: 0,
            itemsPerPage: 10,
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
                self.invoice_id = result.data.idUserInvoice;
                self.invoice_note = result.data.note;
                setTimeout(() => {
                    self.invoices = result.data.products;
                }, 1200)

                console.log(result);
            })
            .catch(err => {
                console.error(err.response);
            })
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
</style>
