<template lang="pug">
  div.operation(:class="{deprecated: item.deprecated}")
    app-method(:item="item._method")
    p.operation--message.pl-1.markdown(v-if="sum && item._.summary") {{item._.summary}}
    p.operation--message.pl-1(v-else-if="!(sum && item._.summary)" v-html="params(item._pathName)")
    v-btn.clippy(flat icon @click.native.stop="clippy()")
      v-icon copy
</template>

<script>
  import { mapGetters } from 'vuex'
  import * as types from '../../../store/types'
  import appMethod from './Method'

  export default {
    components: {
      appMethod
    },
    props: ['item', 'sum'],
    computed: {
      ...mapGetters([
        types.VIEW_SUMMARY,
        types.VIEW_PATH])
    },
    methods: {
      params (value) {
        return value.replace(/\//g, '/\u200b')
          .replace(/{/g, '<span class="param text-success">')
          .replace(/}/g, '</span>')
      },
      parsePlainText (value) {
        return value.replace(/{/g, '').replace(/}/g, '')
      },
      clippy () {
        var dummy = document.createElement('textarea')
        document.body.appendChild(dummy)
        dummy.value = this.parsePlainText(this.item._pathName)
        dummy.select()
        document.execCommand('copy')
        document.body.removeChild(dummy)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .clippy
    width 42.2px

  .deprecated
    opacity 0.5

  .deprecated > span:last-child
    text-decoration line-through

  .operation
    display flex
    flex 1
    width 100%

  .operation--message
    padding-top 6px
    padding-bottom 4px
    width calc(100% - 64px)

  >>> .param
    opacity 0.87
    background-color rgba(224, 224, 224, 0.75)
    border-radius 4px
    padding 2px 4px
    margin 0 1px 1px 1px
    line-height 22px
    color #000 !important
</style>
