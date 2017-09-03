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
            <a href="javascript:void(0)" class="price" @click="sortGoods">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd><a href="javascript:void(0)" v-bind:class="{'cur':priceChecked=='all'}" @click="priceChecked=all">All</a></dd>
                <dd v-for="(price,index) in priceFilter" >
                  <a href="javascript:void(0)" v-bind:class="{'cur':priceChecked==index}" @click="setPriceFilter(index)">{{price.startPrice}} - {{price.endPrice}}</a>
                </dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="(item,index) in goodsList.list">
                    <div class="pic">
                      <a href="#"><img v-lazy="'static/'+item.productImage" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.salePrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
      <nav-footer></nav-footer>
    </div>
</template>
<script>
    import './../assets/css/base.css'
    import './../assets/css/login.css'
    import './../assets/css/product.css'
    import NavHeader from '@/components/NavHeader.vue'
    import NavFooter from '@/components/NavFooter.vue'
    import NavBread from '@/components/NavBread.vue'
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
              filterBy:false,
              overLayFlag:false,
              sortFlag:true,
              page:1,
              pageSize:8
            }
        },
        components: {
            NavHeader,
            NavFooter,
            NavBread
        },
      //initial method for lifetime
        mounted:function () {
          this.getGoodsList();
        },
        methods:{
          getGoodsList(){
            var param={
              page:this.page,
              pageSize:this.pageSize,
              sort:this.sortFlag?1:-1
            };
            //get dat from mock
            axios.get('/goods',{
              params:param
            }).then((result)=>{
                let response=result.data;

                if(response.status=='0'){
                  this.goodsList=response.result;
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
            this.closePop();
          },
          sortGoods(){
            this.sortFlag=!this.sortFlag;
            this.page=1;
            this.pageSize=8;
            this.getGoodsList();
          }
        }
    }
</script>
