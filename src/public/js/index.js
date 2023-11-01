const socket = io();

const productsInTable = (products) => {
    let tabla = document.getElementById('tbodyTableProducts');
    tabla.innerHTML = '';
    products.forEach(product => {
        const productsInTable = document.createElement('tr');
        productsInTable.innerHTML = `
        <td>${product.id}</td>
        <td>${product.title}</td>
        <td class="tdDescription">${product.description}</td>
        <td>$ ${product.price}</td>
        <td>${product.code}</td>
        <td>${product.stock}</td>
        <td>${product.category}</td>
        `;
        tabla.appendChild(productsInTable);
    })
};

socket.on('connect', () => {
    socket.emit('newConnection', socket.id);
});

socket.on('updateProducts', (products) =>{
    productsInTable(products)
})




