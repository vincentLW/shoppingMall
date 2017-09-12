<template>
    <div>
      <nav-header></nav-header>
      <nav-bread>
        <span >Goods</span>
        <!--<span slot="B">测试一下</span>-->
      </nav-bread>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a>
            <a href="javascript:void(0)" class="price" @click="sortGoods">Price
              <svg class="icon icon-arrow-short" v-bind:class="{'sort-up':!sortFlag}">
                <!--<use xmlns: xlink:="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-short"></use>-->
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-short"></use>
              </svg>
            </a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd><a href="javascript:void(0)" v-bind:class="{'cur':priceChecked=='all'}" @click="setPriceFilter('all')">All</a></dd>
                <dd v-for="(price,index) in priceFilter" >
                  <a href="javascript:void(0)" v-bind:class="{'cur':priceChecked==index}" @click="setPriceFilter(index)">{{price.startPrice}} - {{price.endPrice}}</a>
                </dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="(item,index) in goodsList">
                    <div class="pic">
                      <a href="#"><img v-lazy="'static/'+item.productImage" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.salePrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div v-infinite-scroll="loadMore" class="load-more" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                  <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="overLayFlag" @click="closePop" ></div>
      <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
        <p slot="message">
          Please Log In first to add item to the cart
        </p>
        <div slot="btnGroup">
          <a class="btn btn--m" @click="mdShow=false">Close</a>
        </div>
      </modal>

      <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
        <p slot="message">
          <svg class="icon-status-ok">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
          </svg>
          <span>Add item to cart successfully</span>
        </p>
        <div slot="btnGroup">
          <a class="btn btn--m" @click="mdShowCart=false">Close</a>
          <router-link class="btn btn--m" href="javascript:;" to="/cart">Check Cart</router-link>

        </div>
      </modal>
      <nav-footer></nav-footer>
    </div>
</template>
<style>
  .load-more{
    height:100px;
    line-height: 100px;
    text-align: center;
  }
  .sort-out{
    transform: rotate(180deg);
    transition: all .3s ease-out;
  }
  .btn:hover{
    background-color: #ffe5e6;
    transition: all .3s ease-out;
  }
</style>
<script>
    import './../assets/css/base.css'
    import './../assets/css/login.css'
    import './../assets/css/product.css'
    import NavHeader from '@/components/NavHeader.vue'
    import NavFooter from '@/components/NavFooter.vue'
    import NavBread from '@/components/NavBread.vue'
    import Modal from '@/components/Modal.vue'
    import axios from 'axios'
    export default{
        data(){
            return {
                goodsList:[],
                priceFilter:[
                  {
                  startPrice:'0.00',
                  endPrice:'499.00'
                  },
                  {
                  startPrice:'500.00',
                  endPrice:'999.00'
                  },
                  {
                  startPrice:'1000.00',
                  endPrice:'1999.00'
                  }
                ],
              priceChecked:'all',
              mdShow:false,
              mdShowCart:false,
              filterBy:false,
              overLayFlag:false,
              sortFlag:true,
              page:1,
              pageSize:8,
              busy:true,
              loading:false
            }
        },
        components: {
            NavHeader,
            NavFooter,
            NavBread,
            Modal
        },
      //initial method for lifetime
        mounted:function () {
          this.getGoodsList();
        },
        methods:{
          getGoodsList(flag){
            var param={
              page:this.page,
              pageSize:this.pageSize,
              sort:this.sortFlag?1:-1,
              priceLevel:this.priceChecked
            };
            //before get data show loading
            this.loading=true;
            //get dat from mock
            axios.get('/goods',{
              params:param
            }).then((result)=>{
                this.loading=false;
                let response=result.data;
                if(response.status=='0'){
                  //if flag is true mean it will load more data
                  if(flag){
                      this.goodsList=this.goodsList.concat(response.result.list);
                  }else{
                      this.goodsList=response.result.list;
                  }
                  //if flag is true mean it will load more data
                  if(response.result.count<8){
                    this.busy=true;
                  }else {
                    this.busy=false;
                  }
                }else{
                  this.goodsList=[];
                }

            });

          },
          showFilterPop(){
            this.filterBy=true,
            this.overLayFlag=true
          },
          closePop(){
            this.overLayFlag=false,
            this.filterBy=false
          },
          setPriceFilter(index){
            this.priceChecked=index;
            this.page=1;
            this.getGoodsList(false);
            this.closePop();
          },
          sortGoods(){
            this.sortFlag=!this.sortFlag;
            this.page=1;
            this.pageSize=8;
            this.getGoodsList();
          },
          loadMore(){
            this.busy=true;
            setTimeout(() => {
              this.page++;
              this.getGoodsList(true);
              this.busy = false;
            }, 500);
          },
          addCart(productId){
            axios.post('/goods/addCart',{productId:productId}).then((res)=> {
              console.log(res);
              if(res.data.status=='0'){
                this.mdShowCart=true;
              }else{
                this.mdShow=true;
              }
            });
          },
          closeModal(){
            this.mdShow=false;
            this.mdShowCart=false;
          }

        }
    }
</script>
