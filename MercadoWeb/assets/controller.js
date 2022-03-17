const product_container = document.querySelector('#container');
const cart = document.getElementById('cart-div');

(()=>{addElementToCart(true)})()

function fillCart(data, product, restart){
    if(data[product] <= 0) return;
    if(data[product] === 1 || restart){
        const img_div = cart.appendChild(document.createElement('div'));
        img_div.className = 'col-4 text-center';
        // img_div.style = 'border-right: 3.5px solid black';
        const img = img_div.appendChild(document.createElement('img'));
        img.src = product + '.png';
        img.setAttribute('width', '45');

        const x_div = cart.appendChild(document.createElement('div'));
        x_div.className = 'col-4 text-center';
        const x = x_div.appendChild(document.createElement('p'));
        x.textContent = `x`;
        const p_div = cart.appendChild(document.createElement('div'));
        p_div.className = 'col-4 text-start';
        const p = p_div.appendChild(document.createElement('p'));
        p.textContent = `${data[product]}`;
        p.id = `cart-product#${product}`;
    }else{
        document.getElementById(`cart-product#${product}`).textContent = data[product];
    }
}

product_container.addEventListener('click', async (e) => {
    for(let i = 0; i <= 2; i++){
        if(e.path[i].id.includes('product-#')){
            await fetch(`http://localhost:3000/`, {
                method: "POST",
                body: JSON.stringify(e.path[i].id.split('#')[1]),
            }).then( () => addElementToCart());
        }
    }
});

async function addElementToCart(restart = false){
    let counter = 0;
    const cart_counter = document.querySelector('.cart-counter');
    await fetch('http://localhost:3000/products').then(response => response.json()).then(data => {
        const names = Object.keys(data);
        names.forEach(product => {
            data[product] == 0 ? false : document.getElementById('product-counter-'+product).textContent = data[product];
            counter += data[product];
            fillCart(data, product, restart);
        });
        counter <= 0 ? cart_counter.style = 'display: none' : cart_counter.style = 'display: block';
        cart_counter.textContent = counter;
    });

}
