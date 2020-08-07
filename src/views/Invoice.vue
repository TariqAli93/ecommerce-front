<template>
<div class="invoice-page">
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
        <v-data-table :headers="headers" :items.sync="filteredProducts">
            <template v-slot:item.qty="{ item }">
                {{ (item.totalPrice / item.price).toFixed(0) }}
            </template>
        </v-data-table>
    </v-container>
</div>
</template>

<script>
export default {
    data() {
        return {
            products: [],
            invoice_id: '',
            quantity: '',
            breadcrumb_list: [{
                    text: 'المتجر',
                    disabled: false,
                    href: '/',
                },
                {
                    text: 'الملف الشخصي',
                    disabled: true,
                    href: '/',
                },
                {
                    text: 'الفاتورة',
                    disabled: true,
                    href: '/',
                }
            ],
            headers: [{
                    text: 'المنتج',
                    value: 'productName',
                    sortable: false
                },
                {
                    text: 'الكمية',
                    value: 'qty',
                    sortable: false,
                },
                {
                    text: 'سعر المنتج',
                    value: 'price',
                    sortable: false,
                },
                {
                    text: 'قسيمة الخصم',
                    value: 'discount',
                    sortable: false,
                },
                {
                    text: 'السعر النهائي',
                    value: 'totalPrice',
                    sortable: false,
                },
            ],
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

    mounted() {
        let self = this;
        let token = self.$store.state.token;
        let user = self.decodeJwt(token);
        let userId = user.id;


        self.axios.get(`userInvoice/${userId}`, {
            headers: {
                Authorization: `bearer ${token}`
            }
        })
        .then(result => {
            self.products = result.data.products;
        }).catch((err) => {
            console.error(err)
        });

        this.filteredProducts
    },

    computed: {
        filteredProducts() {
            let self = this;
            self.invoice_id = Number(self.$route.params.id);
            return self.products.filter(product => {
                return product.idInvoice === self.invoice_id;
            });
        },
    }
}
</script>

<style>

</style>
