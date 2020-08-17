<template>
  <div class="Verfiy-page">
      <div class="d-flex align-center justify-center pa-6">
          <h4 class="pa-5 grey lighten-4">{{ message }}</h4>
      </div>
  </div>
</template>

<script>
export default {
    metaInfo() {
        return {
            title: 'تأكيد الحساب',
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
            code: '',
            message: ''
        }
    },

    mounted() {
        if(!this.$route.params.code) {
            this.$router.push({name: 'home'});
        }
        else {
            let verifyPromis = new Promise((reslove, reject) => {
                this.axios.put(`user/verfiy`, {
                    code: this.$route.params.code
                }).then(data => {
                    reslove(data)
                }).catch(err => {
                    reject(err)
                });
            });

            verifyPromis.then(result => {
                this.message = 'تم تفعيل الحساب بنجاح يمكنك الان تسجيل الدخول';
            }).catch(err => {
                this.message = 'حدث خطأ في تفعيل الحساب يرجى المحاولة لاحقا';
            })
            console.log(this.$route.params.code)
        }
    }
}
</script>

<style>

</style>