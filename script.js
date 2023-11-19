/*
|----------------------------------------------------
| A little BEM helper, not required though
|----------------------------------------------------
*/
let BEM = {
  computed: {
    BEMBlock() {
      return `v-${this.$options.name}`;
    },
    BEMElement() {
      return `v-${this.$parent.$options.name}__${this.$options.name}`;
    } } };



/*
|----------------------------------------------------
| Some Mock Data
|----------------------------------------------------
*/

const ARTBOOKS = [
{
  id: '001',
  title: 'Mavis',
  subtitle: 'From',
  /* i want to using <p> tag here */
  description: 'Em yêu thương, Những dòng chữ này không đủ để diễn đạt hết tình cảm của em dành cho Tea. Mỗi ngày, em cảm thấy hạnh phúc khi được có em Tea. Em biết rằng không có từ ngữ nào đủ để diễn tả tấm lòng em dành Tea. Mỗi khi em nhìn thấy ánh sáng trong đôi mắt Tea, em nhận ra rằng đó chính là nơi em muốn ở. Em Tea là nguồn động viên, là người em muốn chia sẻ mọi khoảnh khắc vui buồn, vượt qua giai đoạn khó khăn. Tea là người mà em chọn, và em sẽ luôn bên Tea, trải qua mọi khó khăn và hạnh phúc. Chỉ cần có em, cuộc sống trở nên ý nghĩa hơn. Chúc em 20/11 vui vẻ, nhiều niềm vui, hạnh phúc, ngọt ngào mãi bên em Yêu thương nhiều,',
  image: '1.png',
  groove: true,
  obiStyles: {
    color: 'hsl(0, 0, 22%)',
    backgroundColor: 'hsla(48, 89%, 50%, .22)',
    textAlign: 'right' ,
     } }];




/*
|----------------------------------------------------
| Book Components
|----------------------------------------------------
*/
Vue.component('book', {
  mixins: [BEM],
  props: ['title', 'subtitle', 'description', 'image', 'groove', 'book-styles', 'obi-styles'],
  data() {
    return {
      isFlipped: false,
      classObject: {
        'has-groove': this.groove } };


  },
  template: `
    <article @click="flip" :class="[BEMBlock, classObject, { 'is-flipped' : isFlipped }]">
      <obi 
       :title="title" 
       :subtitle="subtitle" 
       :book-styles="bookStyles" 
       :obi-styles="obiStyles" 
       :front="true">
      </obi>
      <cover :image="image" :book-styles="bookStyles" front>
        <section slot="front"></section>
      </cover>
      <spine :book-styles="bookStyles"></spine>
      <cover :book-styles="bookStyles" back>
        <p slot="back" class="v-book__description" v-text="description"></p>
      </cover>
      <obi :obi-styles="obiStyles"></obi>
    </article>
  `,
  methods: {
    flip: function () {
      this.isFlipped = !this.isFlipped;
    } } });



/*
|----------------------------------------------------
| The Obi, or Belly Band, around the book
|----------------------------------------------------
*/
Vue.component('obi', {
  props: ['title', 'subtitle', 'obi-styles', 'front'],
  template: `
    <div class="v-book__obi" :style="obiStyles" :class="{ 'is-back': !front }">
      <div v-if="front">
        <div v-if="subtitle" class="v-book__subtitle" v-text="subtitle"></div>
        <div v-if="title" class="v-book__title" v-text="title"></div>
      </div>
    </div>
  ` });


Vue.component('cover', {
  mixins: [BEM],
  props: ['front', 'back', 'image', 'book-styles'],
  data() {
    return {
      loading: false,
      classObject: {
        'is-back': this.back !== undefined,
        'is-front': this.front !== undefined } };


  },
  computed: {

    /*A makeshift lazy-load that fixes the jittering
      when the cover image is loaded. In a "real"
      situation you would probably do something
      more proper. */
    coverImage: function () {
      let vm = this;
      let img = new Image();
      let url = this.image;
      vm.loading = true;

      img.onload = function () {
        img.src = url;
      };

      if (img.complete) {
        vm.loading = false;
      }

      return {
        backgroundImage: `url(${this.image})` };

    } },

  template: `
    <section :class="[BEMElement, classObject]" :style="[bookStyles, coverImage]">
      <loader v-if="loading"></loader>
      <slot name="front"></slot>
      <slot name="back"></slot>
    </section>
  ` });


/* 
Admitted, a separate component for a spine is a bit overkill,
but what the heck. We're just having fun here. */
Vue.component('spine', {
  mixins: [BEM],
  props: ['book-styles'],
  template: `
    <section :class="[BEMElement]" :style="[bookStyles]"></section>
  ` });


Vue.component('loader', {
  props: ['is-loading'],
  template: `
    <div class="v-loader">✵</div>
  ` });


new Vue({
  el: document.getElementsByTagName('body')[0],
  data: {
    books: {
      artbooks: ARTBOOKS } },


  methods: {

    /* A note on staggering, or that neat, delayed 
    fade in effect on the books. In Vue 2.0, you
    have to combine the special <transition-group>
    tag along with a few methods like these below
    to get a result like the one you see.
    
    Basically, we first decide what "state" the
    book should be in BEFORE it enters the stage
    and then WHEN it enters the stage, we change
    that state to how it should end up.
    */
    beforeItemEnters: function (el) {
      el.style.opacity = 0;
      el.style.top = '-10px';
    },
    whenItemEnters: function (el) {
      const delay = el.dataset.index * 500;
      setTimeout(function () {
        el.style.opacity = 1;
        el.style.top = '0px';
      }, delay);
    } } });
