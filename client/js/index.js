// capturaramos al contenedor que tendra a nuestros productos adentro
const shopContent = document.getElementById("shopContent")
// este es mi array para mi carrito
const cart = [];

// Recorrer el array para acceder a los objetos mediante el forEach
productos.forEach((product )=>{
    const content = document.createElement("div"); //Con esto nos creamos otro elemento div que aparecera en nuestro html al que le agregaremos los datos de nuestros productos
    //Con innerHTML le damos cuerpo html a nuestro content que en este caso seria un div, con los datos de los productos
    content.innerHTML = `
    <img src="${product.img}">
    <h3>${product.productName}</h3>
    <p>${product.price} $</p>
    `;

    //Con append lo que hacemos es enchufarle a nuestro div con id shopContent los datos recolectados de nuestro array
    shopContent.append(content);

    const buyButton = document.createElement("button");
    buyButton.innerText = `Buy`

    content.append(buyButton);

    // le agregamos un escuchador de eventos para que escuche el click y ejecute lo que le pase adentro de la función
    buyButton.addEventListener("click", ()=>{
        //con esta condicion detectamos si hay dos productos en el carrito con un mismo id
        const repeat = cart.some((repeatProduct) => repeatProduct.id === product.id);
        
        if(repeat)
        {
        // con esta linea hacemos un mapeo del carrito y detectamos si hay productos con un mismo id
        // de ser asi los sumamos
            cart.map((prod) =>{
                if(prod.id === product.id){
                    prod.quanty++;
                    displayCartCounter();
                }
            });
        }else
         //con esta linea metemos adentro del carrito los productos que el usuario esta eligiendo
        {cart.push({
                id: product.id,
                productName: product.productName,
                price: product.price,
                quanty: product.quanty,
                img: product.img,
            });
            displayCartCounter();
        }
    });
});