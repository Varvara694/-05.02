import { products } from './data.js';

// Инициализация корзины
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentCategory = "Все";

document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    setupEventListeners();
});

function renderProducts(productsToRender, category = currentCategory) {
    const cartsContainer = document.querySelector('.carts');
    cartsContainer.innerHTML = '';

    const filteredProducts = category === "Все" ?
        productsToRender :
        productsToRender.filter(p => p.category === category);

    filteredProducts.forEach(product => {
                const productElement = document.createElement('div');
                productElement.className = 'cart';
                productElement.dataset.category = product.category;
                productElement.innerHTML = `
            <div class="text">
                <img src="${product.image}" alt="${product.title}">
                <p>${product.title}</p>
            </div>
            <section>
                <div class="t">
                    <p>цена</p>
                    <h1>${product.price.toLocaleString('ru-RU')} руб.</h1>
                </div>
                ${product.colors ? `
                <div class="color-selector">
                    <p>Цвет:</p>
                    <div class="color-options">
                        ${product.colors.map(color => `
                            <button data-color="${color}" style="background: ${getColorCode(color)}"></button>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                <div class="buttons">
                    ${product.sizes.map(size => 
                        `<button data-size="${size}">${size}</button>`
                    ).join('')}
                </div>
            </section>
            <button class="btn" data-id="${product.id}">Добавить в корзину</button>
        `;
        cartsContainer.appendChild(productElement);
    });
}

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

function setupEventListeners() {
    document.getElementById('categoryFilter').addEventListener('change', (e) => {
        currentCategory = e.target.value;
        renderProducts(products, currentCategory);
    });

    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn')) {
            const productId = parseInt(e.target.dataset.id);
            const product = products.find(p => p.id === productId);
            const cartItem = e.target.closest('.cart');
            
            if (!product) return;
            
            // Получаем выбранный размер
            const sizeButtons = cartItem.querySelectorAll('[data-size]');
            let selectedSize = null;
            
            sizeButtons.forEach(btn => {
                if (btn.classList.contains('selected')) {
                    selectedSize = btn.dataset.size;
                }
            });
            
            // Получаем выбранный цвет (только если у товара есть цвета)
            let selectedColor = null;
            if (product.colors) {
                const colorButtons = cartItem.querySelectorAll('[data-color]');
                colorButtons.forEach(btn => {
                    if (btn.classList.contains('selected')) {
                        selectedColor = btn.dataset.color;
                    }
                });
            }
            
            // Проверяем обязательные параметры
            if (!selectedSize) {
                alert('Пожалуйста, выберите размер');
                return;
            }
            
            if (product.colors && !selectedColor) {
                alert('Пожалуйста, выберите цвет');
                return;
            }
            
            // Добавляем товар в корзину
            addToCart(product, selectedSize, selectedColor);
            
            // Анимация кнопки
            e.target.textContent = '✓ Добавлено';
            e.target.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                e.target.textContent = 'Добавить в корзину';
                e.target.style.backgroundColor = '#3B95EA';
            }, 2000);
        }
        
        if (e.target.hasAttribute('data-color')) {
            const colorButtons = e.target.closest('.color-options').querySelectorAll('button');
            colorButtons.forEach(btn => btn.classList.remove('selected'));
            e.target.classList.add('selected');
        }
        
        if (e.target.hasAttribute('data-size')) {
            const buttons = e.target.closest('.buttons').querySelectorAll('button');
            buttons.forEach(btn => btn.classList.remove('selected'));
            e.target.classList.add('selected');
        }
    });
}

function addToCart(product, size, color = null) {
    // Создаем уникальный ID с учетом размера и цвета
    const uniqueId = color ? `${product.id}-${size}-${color}` : `${product.id}-${size}`;
    
    const existingItemIndex = cart.findIndex(item => item.uniqueId === uniqueId);
    
    if (existingItemIndex >= 0) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({
            ...product,
            uniqueId,
            size,
            color: color || undefined, // сохраняем цвет, если он есть
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Текущая корзина:', cart);
}

function filterProductsByCategory(category) {
    const allProducts = document.querySelectorAll('.cart');
    
    allProducts.forEach(product => {
        const productCategory = product.dataset.category;
        product.style.display = (category === "Все" || productCategory === category) ? 'flex' : 'none';
    });
}