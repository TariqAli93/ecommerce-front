<template>
<div class="navbar">
    <v-dialog v-model="dialog_logout" max-width="300" persistent origin="top top" transition="slide-y-transition">
        <v-card>
            <v-card-title class="headline pb-4">
                تسجيل الخروج
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pt-3">
                هل انت واثق من تسجيل الخروج
            </v-card-text>
            <v-card-actions class="d-flex align-center justify-center" width="100">
                <v-spacer></v-spacer>
                <div class="d-flex align-center justify-start" style="width: 100%">
                    <v-btn color="#28DF47" :loading="dialog_logout_accept_loading" class="mx-auto d-block" text @click="logout()">
                        تسجيل الخروج
                    </v-btn>

                    <v-btn color="red darken-1" class="mx-auto d-block" :disabled="dialog_logout_accept_loading" text @click="dialog_logout = false">
                        الغاء الامر
                    </v-btn>
                </div>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <div class="top">
        <div class="right-wrapper">
            <v-btn v-for="btn in social_media" :key="btn.id" icon :color="btn.color" medium>
                <i style="font-size: 14px" :class="`im im-${btn.icon}`"></i>
            </v-btn>
        </div>

        <div class="middle-wrapper">
            <div class="search-container">
                <v-autocomplete clearable dense :cache-items="false" v-model="navbar_search" :loading="search_loading" :items="search_items" :search-input.sync="search_input" item-text="productName" item-value="idProduct" hide-details label="هل تبحث عن منتج ؟" color="#28DF47" solo-inverted @change="gotToProduct(navbar_search)" flat>
                </v-autocomplete>
            </div>
        </div>

        <div class="left-wrapper">
            <div class="shopping-btn">
                <v-btn color="#28DF47" dark depressed medium @click="$store.state.sidebar = true">
                    <i style="font-size: 14px; margin-left: 10px" class="im im-shopping-cart"></i>
                    <span>سلة المشتريات</span>
                    <div class="badge-number elevation-2">
                        <small>{{ $store.getters.product_count }}</small>
                    </div>
                </v-btn>
            </div>
        </div>
    </div>

    <div class="divider"></div>

    <div class="bottom">
        <div class="logo">
            <router-link to="/">
                <img src="../../assets/images/logo.png" alt="المتجر العراقي">
            </router-link>
        </div>

        <div>
            <ul class="navlist">
                <li>
                    <router-link tag="a" to="/" exact-active-class="active" exact>
                        الرئيسية
                    </router-link>
                </li>
                <li v-for="category in categories" :key="category.idCategory" class="order-1">
                    <router-link tag="a" :to="`/category/${category.idCategory}`" exact-active-class="active" exact>
                        {{ category.categoryName }}
                    </router-link>
                </li>

                <v-menu color="#28DF47" open-on-hover left transition="slide-y-transition" bottom v-if="categories.length < 7">
                    <template v-slot:activator="{ on, attrs }">
                        <li class="navlist-li order-2">
                            <a v-bind="attrs" v-on="on" exact-active-class="active" exact>
                                المزيد
                            </a>
                        </li>
                    </template>

                    <v-list nav color="#28DF47" dark>
                        <v-list-item v-for="category in categoriesNotInList" :key="category.idCategory" :to="`/category/${category.idCategory}`">
                            <v-list-item-title color="#28DF47">{{ category.categoryName }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>

                <v-menu v-if="$store.getters.isLoggedIn" color="#28DF47" left open-on-hover transition="slide-y-transition" bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="#28DF47" height="60px" depressed medium dark v-bind="attrs" v-on="on">
                            <i class="im im-user-circle ml-3"></i>
                            {{ username }}
                        </v-btn>
                    </template>
                    <v-list color="#28DF47" dark>
                        <v-list-item to="/profile">
                            <v-list-item-title><i class="fa fa-user-circle ml-3"></i> الملف الشخصي</v-list-item-title>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item @click="dialog_logout = true">
                            <v-list-item-title><i class="fa fa-sign-out ml-3"></i> تسجيل الخروج</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>

                <v-btn v-else color="#28DF47" to="/login" width="60px" height="60px" depressed medium dark>
                    <i class="im im-user-male"></i>
                </v-btn>
            </ul>
        </div>
    </div>

    <div class="search-overlay" v-show="overlay"></div>
    <v-snackbar v-model="logoutSnackBar" style="z-index: 5600" color="#28DF47" absolute app dark bottom centered>
        {{ logoutMessage }}
    </v-snackbar>
</div>
</template>

<script>
export default {
    data() {
        return {
            overlay: false,
            logoutSnackBar: false,
            logoutMessage: '',
            searchActive: false,
            navbar_search: null,
            search_loading: false,
            search_items: [],
            search_products: [],
            search_input: null,
            dialog_logout: false,
            dialog_logout_accept_loading: false,
            categories: [],
            categoriesNotInList: [],
            social_media: [{
                    icon: 'facebook',
                    id: 1,
                    color: '#28DF47'
                },
                {
                    icon: 'twitter',
                    id: 2,
                    color: '#28DF47'
                },
                {
                    icon: 'instagram',
                    id: 3,
                    color: '#28DF47'
                },
            ],
        }
    },

    mounted() {
        let self = this;
        self.axios.get('products')
            .then(data => {
                self.search_products = data.data;
            })
            .catch(err => {
                console.error(err);
            });

        self.getCategories();
    },

    watch: {
        search_input(val) {
            val && this.querySelections(val)
        }
    },

    computed: {
        username() {
            if (localStorage.username) {
                return localStorage.username
            } else {
                return sessionStorage.username
            }
        },
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

        querySelections(v) {
            this.search_loading = true;
            setTimeout(() => {
                this.search_items = this.search_products.filter(e => {
                    return (e.productName || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1
                })
                this.search_loading = false;
            }, 1500)
        },

        gotToProduct(id) {
            if (id !== 0 && typeof id === 'number') {
                this.$router.push({
                    path: `/product/${id}`
                });
                this.search_items = [];
                return true
            } else {
                return false
            }
        },

        getCategories() {
            let self = this;
            self.axios.get('categories')
                .then(data => {
                    self.categories = data.data.slice(0, 5);

                    self.categoriesNotInList = data.data.slice(5, data.data.length);
                })
                .catch(err => {
                    console.error(err);
                })
        },

        logout() {
            this.dialog_logout_accept_loading = true;
            setTimeout(() => {
                this.$store.dispatch('userLogout');
                this.dialog_logout_accept_loading = false;
                this.dialog_logout = false;
                this.logoutSnackBar = true;
                this.logoutMessage = 'تم تسجيل الخروج بنجاح'
            }, 1000)
        },
    }
}
</script>

<style lang="scss">
.navbar {
    width: 100%;
    margin: 0 auto;

    .top {
        display: flex;
        padding: 10px 0px;
        justify-content: space-between;
        align-items: center;
        width: 1250px;
        margin: 0 auto;
        position: relative;

        .left-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;

            .shopping-btn {
                position: relative;

                .badge-number {
                    position: absolute;
                    width: fit-content;
                    height: 100%;
                    background: #28DF47;
                    color: white;
                    display: flex;
                    align-content: center;
                    justify-content: center;
                    justify-items: center;
                    align-self: center;
                    border-radius: 50px;
                    padding: 0px 10px;
                    margin-right: 10px;
                    top: -20px;
                    left: -20px;

                    small {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: 900;
                        font-size: 13px;
                    }
                }
            }

            .search-btn {
                display: flex;
                position: relative;

                .v-btn {
                    order: 1;
                    position: relative;
                    z-index: 450;
                }

                .search-container {
                    width: 1250px;
                    transform: translateY(-50px);
                    visibility: hidden;
                    opacity: 0;
                    position: absolute;
                    left: 100%;
                    top: 0;
                    transition: all 0.2s ease 0.05s;
                    transform-origin: left;
                    z-index: 440;
                    background: white;

                    &.active {
                        visibility: visible;
                        opacity: 1;
                        transform: translateY(0px);
                    }
                }
            }
        }

        .middle-wrapper {
            min-width: 70%;
            position: relative;
            z-index: 6000;
        }
    }

    .divider {
        border-bottom: 1px solid rgba(black, .10);
    }

    .bottom {
        display: flex;
        padding: 10px 0px;
        justify-content: space-between;
        align-items: center;
        width: 1250px;
        margin: 0 auto;

        .logo {
            display: block;

            a {
                display: block;
                padding: 10px 0px;

                img {
                    display: block;
                    width: 150px;
                }
            }
        }

        ul.navlist {
            display: flex;
            align-items: center;
            justify-content: center;
            list-style: none;
            padding: 0;
            margin: 0;

            .order-1 {
                order: 1;
            }

            .order-2 {
                order: 2;
            }

            li {
                display: block;
                padding: 10px;

                a {
                    display: block;
                    padding: 10px 20px;
                    color: #28DF47;
                    position: relative;
                    text-decoration: none;

                    &:before {
                        content: "";
                        position: absolute;
                        width: 0%;
                        height: 3px;
                        bottom: 0;
                        right: 0;
                        margin: 0 auto;
                        background: #28DF47;
                        border-radius: 10px;
                        transition: all 0.2s ease 0.05s;
                    }

                    &:hover,
                    &:focus,
                    &:active {
                        &:before {
                            width: 100%;
                        }
                    }

                    &.active {
                        &:before {
                            width: 100%;
                        }
                    }
                }
            }

            .v-btn {
                margin-right: 15px;
                order: 2;
            }
        }
    }
}
</style>
