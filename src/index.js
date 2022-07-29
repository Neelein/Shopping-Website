import './index.css'
import Swiper, { Navigation, Pagination,Autoplay } from 'swiper';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';



//navbar toggle menu
const menu=document.querySelector('.menu')
const toggle=document.querySelector('.nav-toggle')
toggle.addEventListener('click',()=>{
    toggle.classList.toggle('active')
    menu.classList.toggle('active')
})



// home section slider

const swiper=new Swiper('.swiper',{
        modules: [Navigation, Pagination,Autoplay],
        loop:true,
        pagination: {
            el: '.swiper-pagination',
            dynamicBullets: true,
            clickable: true,
        },

        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoplay:{
            delay:2500,
            disableOnInteraction:false
        }
    }
)
// sidebar-bnt open and close
const openSidebarBtn=document.querySelector('.shopping-cart-btn')
const closeSidebarBtn=document.querySelector('.close-btn i')
const sidebar=document.querySelector('.sidebar')
const cartContainer=document.querySelector('.sidebar-container')


openSidebarBtn.addEventListener('click',()=>{
    sidebar.classList.add('active')
})
closeSidebarBtn.addEventListener('click',()=>{
    sidebar.classList.remove('active')
})


// product 
const productContainer=document.querySelector('.product-container')

let cart=[]

let buttonDOM=[]

class Products{
    async getProduct(){
        try{
            let res= await fetch('https://fakestoreapi.com/products?limit=12')
            let data=res.json()
            return data
        }catch(error){
            console.log(error)
        }
    }
}

class UI{
    displayProduct(data){
        let productCards=``
            data.forEach(product=>{
                productCards+=`
                <div class="product-card">
                    <img src="${product.image}" alt="">
                    <span class="product-price">${product.price}$</span>
                    <p class="title">${product.title}</p>
                    <button class="product-btn btn" data-id=${product.id}>Add Cart</button>
                </div>
            `
            })
        productContainer.innerHTML=productCards
    }
    getBagButton(){
        const buttons=[...document.querySelectorAll('.product-btn')]
        buttonDOM=buttons
        buttons.forEach(button=>{
            let id=button.dataset.id
            let inCart=cart.find(item=>item.id==id)
            if(inCart){
                button.disabled=true
                button.innerText='In Cart'
            }
            button.addEventListener("click",(e)=>{
                e.target.innerText="In Cart"
                e.target.disabled=true
                let cartItem={...Storage.getProducts(id),amount:1}
                cart=[...cart,cartItem]
                Storage.saveCart(cart)
                this.addCartItem(cartItem)
                this.setTotal(cart)
                this.showCart()
            })
        })
    }
    addCartItem(item){
        const div=document.createElement('div')
        div.classList.add('sidebar-item')
        div.innerHTML=`
            <div class="picture">
                <img src="${item.image}" alt="">
            </div>
            <div class="amount">
                <span class="add-btn"><i class="fa-solid fa-angle-up add" data-id=${item.id}></i></span>
                <span class="item-amount">${item.amount}</span>
                <span class="reduce-btn"><i class="fa-solid fa-angle-down reduce" data-id=${item.id}></i></span>
            </div>
            <div class="delete"><i class="fa-solid fa-trash-can trash-icon" data-id=${item.id}></i></div>
        `
        cartContainer.appendChild(div)
    }
    setTotal(cart){
        const total=document.querySelector('.total')
        let tempTotal=0
        cart.map(item=>{
            tempTotal+=item.price*item.amount
        })
        total.innerHTML=`Total:${Math.floor(tempTotal.toFixed(2))} $`
    }

    showCart(){
        sidebar.classList.add('active')
    }
    setApp(){
        cart=Storage.getCart()
        this.setTotal(cart)
        this.popurlateCart(cart)
    }
    popurlateCart(cart){
        cart.forEach(item=>this.addCartItem(item))
    }
    cartLogic(){
        cartContainer.addEventListener('click',(e)=>{
            if(e.target.classList.contains('trash-icon')){
                let removeItem=e.target
                let id=removeItem.dataset.id
                cartContainer.removeChild(removeItem.parentElement.parentElement)
                this.removeItem(id)
            }else if(e.target.classList.contains('add')){
                let addAmount=e.target
                let id=addAmount.dataset.id
                let tempItem=cart.find(item=>item.id == id)
                tempItem.amount=tempItem.amount+1
                Storage.saveCart(cart)
                this.setTotal(cart)
                addAmount.parentElement.nextElementSibling.innerHTML=tempItem.amount
            }
            else if(e.target.classList.contains('reduce')){
                let lowAmount=e.target
                let id=lowAmount.dataset.id
                let tempItem=cart.find(item=>item.id == id)
                tempItem.amount=tempItem.amount-1
                if(tempItem.amount>0){
                    Storage.saveCart(cart)
                    this.setTotal(cart)
                    lowAmount.parentElement.previousElementSibling.innerHTML=tempItem.amount
                }else{
                    cartContainer.removeChild(lowAmount.parentElement.parentElement.parentElement)
                    this.removeItem(id)
                }
            }
        })
        
    }
    removeItem(id){
        cart=cart.filter(item=>item.id!=id)
        this.setTotal(cart)
        Storage.saveCart(cart)
        let button=this.getSingleButton(id)
        button.disabled=false
        button.innerText='Add Cart'
    }
    getSingleButton(id){
        return buttonDOM.find(item=>item.dataset.id==id)
    }
}

class Storage{
    static saveProducts(product){
        localStorage.setItem("products",JSON.stringify(product))
    }
    static getProducts(id){
        let prodcuts=JSON.parse(localStorage.getItem('products'))
        return prodcuts.find(product=>product.id == id)
    }
    static saveCart(cart){
        localStorage.setItem('cart',JSON.stringify(cart))
    }
    static getCart(){
        return localStorage.getItem('cart')? JSON.parse(localStorage.getItem("cart")):[]
    }
}

window.document.addEventListener('DOMContentLoaded',()=>{
    const products=new Products
    const ui=new UI
    ui.setApp()
    products.getProduct()
    .then(product=>{
        ui.displayProduct(product)
        Storage.saveProducts(product)
    })
    .then(()=>{
        ui.getBagButton()
        ui.cartLogic()
    })

})



