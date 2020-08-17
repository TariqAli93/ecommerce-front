<template>
<div class="page-404">
    <div class="text-404">
        <h1>404</h1>
        <p>تعذر الوصول الى هذه الصفحة</p>
        <v-btn color="secondary" depressed to="/">
            العودة الى الرئيسية
        </v-btn>
    </div>

    <div class="artwork-404"></div>
</div>
</template>

<script>
export default {
    metaInfo() {
        return {
            title: 'خطأ 404',
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
}
</script>

<style lang="scss">
.page-404 {
    display: block;
    position: relative;
    min-height: 650px;

    .text-404 {
        position: relative;
        z-index: 2;
        display: flex;
        width: 100%;
        height: 550px;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        h1 {
            font-size: 10.3vw;
            padding: 0;
            margin: 0 auto;
            color: #263A4C;
            line-height: 1;
        }

        p {
            font-size: 30px;
            color: #263A4C;
        }
    }

    .artwork-404 {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 1;

        background: {
            image: url('../assets/images/404.png');
            repeat: no-repeat;
            position: center;
            size: cover;
        }

        ;
    }
}
</style>
