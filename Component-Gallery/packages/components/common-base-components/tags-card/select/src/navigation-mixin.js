export default {
  data() {
    return {
      hoverOption: -1
    }
  },

  computed: {
    optionsAllDisabled() {
      return this.options
        .filter((option) => option.visible)
        .every((option) => option.disabled)
    }
  },

  watch: {
    hoverIndex(val) {
      if (typeof val === 'number' && val > -1) {
        this.hoverOption = this.options[val] || {}
      }
      this.options.forEach((option) => {
        option.hover = this.hoverOption === option
      })
    }
  },

  methods: {
    // prettier-ignore
    navigateOptions(direction) { // NOSONAR
      if (!this.visible) { // NOSONAR
        this.visible = true
        return
      }
      if (this.options.length === 0 || this.filteredOptionsCount === 0) return // NOSONAR
      if (!this.optionsAllDisabled) { // NOSONAR
        if (direction === 'next') { // NOSONAR
          this.hoverIndex++
          if (this.hoverIndex === this.options.length) { // NOSONAR
            this.hoverIndex = 0
          }
        } else if (direction === 'prev') { // NOSONAR
          this.hoverIndex--
          if (this.hoverIndex < 0) { // NOSONAR
            this.hoverIndex = this.options.length - 1
          }
        } else { // NOSONAR
          console.log('Error: Invalid direction value in navigateOptions')
        }
        const option = this.options[this.hoverIndex]
        // prettier-ignore
        if (option.disabled === true || option.groupDisabled === true || !option.visible) { // NOSONAR
          this.navigateOptions(direction)
        }
        this.$nextTick(() => this.scrollToOption(this.hoverOption)) // NOSONAR
      }
    }
  }
}
