const modalContainer = document.getElementById("modal-container");
const modalOverlay = document.getElementById("modal-overlay");
const cartBtn = document.getElementById("cart-btn")
const cartCounter = document.getElementById("cart-counter")


//funcion para crear el modal
const displayCart = () =>{
    // esta linea sirve para que el modal no se duplique al seleccionar varios productos
    modalContainer.innerHTML = "";
    //con estas lineas nos aseguramos que al presionar el botón del carrito
    // podamos abrirlo sin que haya inconvenientes con el codigo css
    modalContainer.style.display = "block";
    modalOverlay.style.display = "block";
    //Creamos un header
    const modalHeader = document.createElement("div");
    
    //A ese header le creamos un boton de salida
    const modalClose = document.createElement("div");
    modalClose.innerText = "❌"
    modalClose.className = "modal-close"
    modalHeader.append(modalClose); //se lo agregamos al header

    modalClose.addEventListener("click", ()=>{
        modalContainer.style.display = "none";
        modalOverlay.style.display = "none";
    })

    //le creamos un titulo
    const modalTitle = document.createElement("div");
    modalTitle.innerText = "Cart";
    modalTitle.className = "modal-title";
    modalHeader.append(modalTitle); //se lo agreamos al header

    modalContainer.append(modalHeader) //agregamos el header al modal container

    //creamos el body
    if(cart.length > 0){

        cart.forEach((product)=>{
            const modalBody = document.createElement("div");
            modalBody.className= "modal-body"
            modalBody.innerHTML = `
            <div class="product">
            <img class="product-img" src="${product.img}"/>
            <div class="product-info">
            <h4>${product.productName}</h4>
            </div>
            <div class="quantity">
            <span class="quantity-btn-decrese">-</span>
            <span class="quantity-btn-input">${product.quanty}</span>
            <span class="quantity-btn-increse">+</span>
            </div>
            <div class="price">${product.price * product.quanty} $ </div>
            <div class="delete-product">❌</div>
            </div>
            `;
            modalContainer.append(modalBody); //agregamos el body al modal container
            
            //query selector permite capturar elementos por su clase css
            const decrese = modalBody.querySelector(".quantity-btn-decrese");
            decrese.addEventListener("click", ()=>{
            if(product.quanty !== 1){
                product.quanty--;
                displayCart();
                displayCartCounter();
            }
        });
        
        const increse = modalBody.querySelector(".quantity-btn-increse");
        increse.addEventListener("click", ()=>{
            product.quanty++;
            displayCart();
            displayCartCounter();
        });
        
        //delete product
        const deleteProduct = modalBody.querySelector(".delete-product");
        deleteProduct.addEventListener("click", ()=>{
            deleteCartProduct(product.id);
        })
        
    });

    //modal footer
    
    const total = cart.reduce((acc, el) => acc + el.price * el.quanty,0)
    
    const modalFooter = document.createElement("div");
    modalFooter.className = "modal-footer"
    modalFooter.innerHTML = `
    <div class=""total-price">Total: ${total}</div>
    <button class="btn-primary" id="checkout-btn">Ir a mercado pago</button>
    <div id="wallet_container"></div>
    `;
    modalContainer.append(modalFooter) //agregamos el footer al modal container

    //mp
    const mp = new MercadoPago("TEST-b4af370e-b891-4c9c-89d9-dad0b569e924", {
        locale: "es-AR",
    });

    //función que genera un titulo con info del carrito
    const generateCartDescription = () =>{
        return cart.map(product => `${product.productName} (x${product.quanty})`).join(', ');
    }

    //capturamos el boton de checkout
    document.getElementById("checkout-btn").addEventListener("click", async() =>{
        //le pasamos la información
        try{
            const orderData = {
                title: generateCartDescription(),
                quantity: 1,
                price: total,
            };
        //mostramos mercado pago
            const response  = await fetch("http://localhost:3000/create_preference",{
                method: "POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body: JSON.stringify(orderData),
            });

            const preference = await response.json();
            createCheckoutButton(preference.id);
        } catch (error){
            alert("Error :(");
            console.log(error);
        }
    });

    const createCheckoutButton = (preferenceId) => {
    const bricksBuilder = mp.bricks();

    //crear el boton de mercado pago
    const renderComponent = async () =>{
        if (window.checkoutButton) window.checkoutButton.unmount(); 
            
        await bricksBuilder.create("wallet", "wallet_container", {
            initialization: {
                preferenceId: preferenceId,
            },
        });
    };

    renderComponent();
};



}else{
    const modalText = document.createElement("h2");
    modalText.className = "modal-body";
    modalText.innerText = "Tu carrito esta vacio";
    modalContainer.append(modalText);
}
};


// al pulsar este boton abrimos el carrito
// lo que hicimos fue agregarle el evento listener para que al hacer click
// se ejecuta la constante displaycart
cartBtn.addEventListener("click", displayCart);

const deleteCartProduct = (id) =>{
    const foundId = cart.findIndex((element)=> element.id === id);
    //splice sirve para eliminar elementos de un array, mediante dos parametros, el primero el indice, y el segundo cuantos elementos quiero eliminar
    cart.splice(foundId, 1);
    displayCart();
    displayCartCounter();
};

const displayCartCounter=()=>{
    const cartLength = cart.reduce((acc, el) => acc + el.quanty,0);
    if(cartLength > 0){
        cartCounter.style.display = "block";
        cartCounter.innerText = cartLength;
    }else{
        cartCounter.style.display="none";
    }
}