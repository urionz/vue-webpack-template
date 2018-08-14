<template>
    <div id="app">
        {{#router}}
        <router-view></router-view>
        {{/router}}
    </div>
</template>

<script>
export default {
    name: 'App'
}
</script>

<style lang="sass">
#app
    background: red
</style>
