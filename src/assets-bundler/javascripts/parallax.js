export default {
    props: {
        parallax: {
            default: true,
            type: Boolean
        },
        speedFactor: {
            default: 0.15,
            type: Number
        },
        fixed: {
            default: false,
            type: Boolean
        },
        breakpoint: {
            default: '(min-width: 968px)',
            type: String
        },
        sectionHeight: {
            default: 70,
            type: Number,
            required: false
        },
        sectionClass: {
            type: String,
            default: 'Masthead'
        },
        containerClass: {
            type: String,
            default: 'Masthead__image'
        },
        parallaxClass: {
            type: String,
            default: 'is-parallax'
        },
        fixedClass: {
            type: String,
            default: 'is-fixed'
        },
        direction: {
            type: String,
            default: 'up'
        }
    },
    data() {
        return {
            el: null,
            mediaQuery: null
        }
    },
    mounted() {
        if (this.parallax && !this.fixed) {
            this.el = this.$refs.parallax
            window.requestAnimationFrame = window.requestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (f) {
                    setTimeout(f, 1000 / 60)
                }
            this.init()
        }
    },
    methods: {
        animateElement() {
            const parentHeight = this.$refs.block.offsetHeight
            const parallaxHeight = this.$refs.parallax.offsetHeight
            const availableOffset = parallaxHeight - parentHeight
            let animationValue = (window.pageYOffset * this.speedFactor)
            if (animationValue <= availableOffset && animationValue >= 0) {
                this.el.style.transform = `translate3d(0, ${animationValue * this.directionValue}px ,0)`
            }
        },
        scrollHandler() {
            window.requestAnimationFrame(() => {
                if (this.isInView(this.$refs.parallax)) {
                    this.animateElement()
                }
            })
        },
        isInView(el) {
            let rect = el.getBoundingClientRect()
            return (
                rect.bottom >= 0 &&
                rect.top <= (window.innerHeight || document.documentElement.clientHeight)
            )
        },
        setupListener() {
            if (this.mediaQuery.matches) {
                window.addEventListener('scroll', this.scrollHandler, false)
            } else {
                window.removeEventListener('scroll', this.scrollHandler, false)
            }
        },
        init() {
            this.mediaQuery = window.matchMedia(this.breakpoint)
            if (this.mediaQuery) {
                this.mediaQuery.addListener(this.setupListener)
                this.setupListener()
            }
        }
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.scrollHandler, false)
    },
    computed: {
        directionValue() {
            return this.direction === 'down' ? +1 : -1
        }
    }
}