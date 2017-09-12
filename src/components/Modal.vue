<template>
  <div>
    <div class="md-modal modal-normal md-modal-transition" v-bind:class="{'md-show':mdShow}">
      <div class="md-modal-inner">
        <div class="md-top">
          <div class="md-title"><slot name="title"></slot></div>
          <button class="md-close" @click="closeModal()"></button>
        </div>
        <div class="md-content">
          <div class="confirm-tips">
            <slot name="message"></slot>
          </div>
          <div class="btn-wrap">
            <slot name="btnGroup"></slot>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="mdShow" @click="closeModal()"></div>
  </div>
</template>

<script>

    export default {
        props:['mdShow'],
        data() {
            return {

            }
        },
        components: {

        },
        methods:{
          closeModal(){
            //send boardcast to parent component
            this.$emit('close');
          }
        }
    }
</script>
