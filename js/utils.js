export function filterProductsByCategory(products, category) {
    if (!category || category === "Все") return products;
    return products.filter(product => product.category === category);
}

export function calculateTotalPrice(cartItems) {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
}

export function formatPrice(price) {
    return price.toLocaleString('ru-RU') + ' руб.';
}

// Самопроверка функций (запустится при загрузке utils.js)
function runSimpleTests() {
    const testProducts = [
        { id: 1, title: "Test 1", price: 100, category: "Электроника" },
        { id: 2, title: "Test 2", price: 200, category: "Одежда" }
    ];

    // Тест filterProductsByCategory
    const filtered = filterProductsByCategory(testProducts, "Электроника");
    console.log('Тест фильтрации:',
        filtered.length === 1 && filtered[0].id === 1 ?
        '✅ Успех' :
        '❌ Ошибка'
    );

    // Тест calculateTotalPrice
    const total = calculateTotalPrice([
        { price: 100, quantity: 2 },
        { price: 200, quantity: 1 }
    ]);
    console.log('Тест суммы:', total === 400 ? '✅ Успех' : '❌ Ошибка');
}

runSimpleTests();