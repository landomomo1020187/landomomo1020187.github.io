
var vm = new Vue({
    el: "#app",
    data:{
        editing: false,
        isCartOpen: false,
        isCheckOutOpen: false,
        movies:[],
        cart: [],
        cartMovieList: [],
        currentMovie: null,
        key_word: [],
        goSearch: false,
        
        
    },
    //取得電影的資料
    created(){
        let apiUrl ="movie.json"
        axios.get(apiUrl).then(res=>{
            this.movies=res.data
        })
    },
    methods: {
        bgcss(url){
            return{
                'background-image':'url('+ url +')',
                'background-position':'center center',
                'background-size':"cover"  
            }
        },
        wheel(evt){
            TweenMax.to(".cards",0.8,{
                left:"+="+evt.deltaY*2+"px"
            })

        },
        singleAddCart(movie, evt){
            if(movie.totalQTY < movie.stock){
                this.currentMovie = movie
                let target = evt.target /*抓到物體的位置*/
                
                this.$nextTick(()=>{ 
                    /*執行動畫前檢查有無更新或有無抓到電影*/
                    TweenMax.from(".buybox",0.8,{
                        left: $(evt.target).offset().left,
                        top: $(evt.target).offset().top,
                        opacity:1
                    })
                })
                setTimeout(()=>{
                    this.cart.push(movie)
                },500)
                movie.totalQTY += 1
                console.log("cart= ", this.cart)
                movie.overStock = false
            }
            else{
                movie.overStock = true
            }
            
            
        },
        addCart(movie,evt){
            if(movie.totalQTY+movie.AddQTY <= movie.stock){
                this.currentMovie = movie
                let target = evt.target /*抓到物體的位置*/
                this.$nextTick(()=>{ 
                    /*執行動畫前檢查有無更新或有無抓到電影*/
                    TweenMax.from(".buybox",0.8,{
                        left: $(evt.target).offset().left,
                        top: $(evt.target).offset().top,
                        opacity:1
                    })
                })
                for(var i =0; i < movie.AddQTY; i++){
                    this.cart.push(movie)
                }
                movie.totalQTY += movie.AddQTY
                console.log("cart= ", this.cart)
                movie.overStock = false
                /*
                setTimeout(()=>{
                    this.cart.push(movie)
                },500) */
            }
            else{
                movie.overStock = true
            }
        },
        cartMovieListAdd(movie){
            this.cartMovieList.push(movie)
            console.log("cartMovieList=", this.cartMovieList)
            console.log("movies=", this.movies)
            console.log("hi")
        },
        
        addQTYButton(movie){
            if(movie.totalQTY < movie.stock){
                this.cart.push(movie)
                movie.totalQTY += 1
                console.log("movie in cart: ", this.cart)
                console.log("movieQTY: ", movie.totalQTY)
            }
        },
        subQTYButton(movie){
            if(movie.totalQTY > 0){
                for(var key in this.cart){
                    if(this.cart[key] == movie){
                        this.cart.splice(key, 1);
                        break;
                    }
                    
                }
                movie.totalQTY -= 1
                console.log("movie in cart: ", this.cart)
                console.log("movieQTY: ", movie.totalQTY)
            }
        },
        deleteMovie(movie){
            movie.totalQTY=0
            var cart2 = this.cart.filter((movies)=>movies!==movie)
            this.cart = cart2
            /*
            for(var key in this.cartMovieList){
                if(this.cartMovieList[key] == movie){
                    this.cartMovieList.splice(key,1)
                }
            }*/
            console.log("movie in cart: ", this.cart)
        },
        clearCart(){
            for(var i=0; i<this.cartMovieList.length; i++){
                this.cartMovieList[i].totalQTY = 0
            }
            this.cart=[]
            console.log("this.cartMovieList = ", this.cartMovieList)
            console.log("clear done")
        },
        enterToSearch(){
            var cards = document.getElementsByClassName("cards");
            let input = document.getElementById("inputKey").value;
            console.log("your input = ", input)
            this.key_word = input
            /*
            console.log("key_word = ", this.key_word)
            if(!cards[0].classList.contains("card")){
                alert("no movie")
            }*/
        },
        
        /*
        noMovieAlert(){
            var cards = document.getElementsByClassName("cards");
            if(!cards[0].classList.contains("card")){
                alert("no movie")
            }
        }*/
    },
    watch: {
        /* 觀察購物車是否加入點選的物件 cart size變化*/
        cart(){
            TweenMax.from(".fa-shopping-cart",0.3,{scale:0.5}) /*縮小放大*/
            
        }
    },
    computed:{
        totalPrice(){
            return this.cart.map(movie=>movie.price).reduce((total,p)=>total+p,0)
        },
        totalMovie(){
            return this.movies.map(movies=>movies.totalQTY).reduce((total,p)=>total+p,0)
        }
    }
})

/*
未完成部分：
    1.購物車中 訂購電影數量減至０時 電影應該跟著消失 而非繼續停留在畫面
    2.Search Key若找不到電影要出現查無此電影標示
    3.Add to Cart按太快圖片會卡住
    4.Checkout應該顯示在畫面正中間
    5.Editing開啟後的Panel不該擋到Movie Ordering標題
    6.Search Key輸入完後不用按Search鍵 直接按Enter也能搜尋




*/