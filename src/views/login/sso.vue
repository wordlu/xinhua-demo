<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {
      site: null
    }
  },
  created() {
    const data = window.location.href.includes('cpad')
    if (data) {
      // 域名
      window.location.href = 'http://10.3.2.57:8090/sso/ssoLogin?serviceId=http://cpad/login'
    } else {
      window.location.href = 'http://10.3.2.57:8090/sso/ssoLogin?serviceId=http://10.3.2.98/login'
    }
  }
}
</script>
