<template>
  <div class="base-checkbox-group__namespace" ref="baseCheckBoxGroup">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'BaseCheckboxGroup',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  // This lifecycle hook is called when the component is created
  created() {
    // Listen for the 'BaseCheckbox-change' event on the global event bus
    this.$globalEventBus.$on('BaseCheckbox-change', (data) => {
      // Check if the data's _uid is not equal to the current component's _uid
      if (data._uid !== this?._uid) {
        return
      }

      // Use the $nextTick method to ensure that the DOM has been updated
      this.$nextTick(() => {
        // Check if the baseCheckBoxGroup ref exists
        if (this.$refs.baseCheckBoxGroup) {
          // Get all the input elements with the class 'base-checkbox__input__original'
          const inputList = this.$refs.baseCheckBoxGroup.querySelectorAll('.base-checkbox__input__original')

          // Initialize the result array
          const result = []
          // Check if the inputList exists and is not empty
          if (inputList && inputList.length) {
            // Loop through each input element
            inputList.forEach((item) => {
              // Parse the data attribute of the input element
              const itemData = JSON.parse(item.getAttribute('data-data'))
              // If the item is checked, push its value to the result array
              if (itemData.checked) {
                result.push(itemData.value)
              }
            })
          }
          // Emit a 'change' event with the result array
          this.$emit('change', result)
        }
      })
    })
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/mixins/px-to-rem';

.base-checkbox-group__namespace {
  height: px-to-rem(32);
}
</style>
