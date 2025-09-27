document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    updateTotalPrice();
    setupCartEventListeners();
});

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartsContainer = document.querySelector('.carts');
    cartsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Ваша корзина пуста</p>
                <a href="index.html">Вернуться в каталог</a>
            </div>
        `;
        updateTotalPrice();
        return;
    }

    cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart';
                cartItemElement.innerHTML = `
            <div class="text">
                <img src="${item.image}" alt="${item.title}">
                <div>
                    <p>${item.title}</p>
                    <p class="size">Размер: ${item.size}</p>
                    ${item.color ? `<p class="color">Цвет: ${item.color}</p>` : ''}
                </div>
            </div>
            <section>
                <div class="t">
                    <p>Цена:</p>
                    <h1>${item.price.toLocaleString('ru-RU')} руб.</h1>
                </div>
                <div class="quantity-control">
                    <button class="quantity-btn minus" data-id="${item.uniqueId}">-</button>
                    <input type="number" min="1" value="${item.quantity}" 
                           data-id="${item.uniqueId}">
                    <button class="quantity-btn plus" data-id="${item.uniqueId}">+</button>
                    <button class="remove-btn" data-id="${item.uniqueId}">Удалить</button>
                </div>
            </section>
        `;
        if (item.color) {
            const colorElement = cartItemElement.querySelector('.color');
            if (colorElement) {
                colorElement.style.setProperty('--item-color', getColorCode(item.color));
            }
        }
        cartsContainer.appendChild(cartItemElement);
    });
    function getColorCode(color) {
        const colors = {
            'белый': 'white',
            'черный': 'black',
            'серый': 'gray',
            'красный': 'red',
            'синий': 'blue',
            'зеленый': 'green',
            'розовый': 'pink',
            'голубой': 'lightblue',
            'бежевый': 'beige'
        };
        return colors[color] || color;
    }
    updateTotalPrice();
}
function updateTotalPrice() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalPriceElement = document.querySelector('.total-price');
    const checkoutBtn = document.querySelector('.checkout-btn');

    if (totalPriceElement) {
        totalPriceElement.textContent = `${total.toLocaleString('ru-RU')} руб.`;
    }

    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
    }
}

function setupCartEventListeners() {
    document.addEventListener('click', (e) => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (e.target.classList.contains('remove-btn')) {
            const uniqueId = e.target.dataset.id;
            const newCart = cart.filter(item => item.uniqueId !== uniqueId);
            localStorage.setItem('cart', JSON.stringify(newCart));
            renderCart();
        }

        if (e.target.classList.contains('plus')) {
            const uniqueId = e.target.dataset.id;
            const item = cart.find(item => item.uniqueId === uniqueId);
            if (item) {
                item.quantity += 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            }
        }

        if (e.target.classList.contains('minus')) {
            const uniqueId = e.target.dataset.id;
            const item = cart.find(item => item.uniqueId === uniqueId);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            }
        }
        if (e.target.classList.contains('checkout-btn')) {
            if (cart.length > 0) {
                // Здесь можно добавить логику оформления заказа
                alert('Заказ оформлен!');
                // Очистка корзины после заказа
                localStorage.removeItem('cart');
                renderCart();
            }
        }
    });


    document.addEventListener('change', (e) => {
        if (e.target.type === 'number' && e.target.closest('.quantity-control')) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const uniqueId = e.target.dataset.id;
            const newQuantity = parseInt(e.target.value);

            if (newQuantity < 1) {
                e.target.value = 1;
                return;
            }

            const item = cart.find(item => item.uniqueId === uniqueId);
            if (item) {
                item.quantity = newQuantity;
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            }
        }
    });
}