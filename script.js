// Función para mostrar la alerta personalizada

function showAlert(message) {
    const alertBox = document.getElementById("customAlert");
    const alertMessage = document.getElementById("alertMessage");

    alertMessage.textContent = message;
    alertBox.classList.remove("hidden");
    alertBox.classList.add("visible"); // Hacer la alerta visible

    // Ocultar la alerta después de 5 segundos
    setTimeout(() => {
        alertBox.classList.remove("visible"); // Ocultar la alerta
        alertBox.classList.add("hidden");
    }, 5000);
}


// Función para cerrar la alerta personalizada
function closeAlert() {
    document.getElementById('customAlert').classList.add('hidden');
}

const form = document.getElementById('itemForm');
const itemList = document.getElementById('itemList');
let currentItemId = null; // Para manejar la edición de artículos

// Evento que carga los artículos cuando la página se carga
document.addEventListener('DOMContentLoaded', loadItems);

// Función para formatear el número como moneda en pesos colombianos
function formatCurrency(value) {
    return Number(value).toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    });
}

// Función para cargar artículos
async function loadItems() {
    const response = await fetch('/items');
    if (response.ok) {
        const items = await response.json();
        itemList.innerHTML = ''; // Limpiar la lista antes de agregar nuevos elementos
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.Nombre} - Cantidad: ${item.cantidad} - Precio Unitario: ${formatCurrency(item.precioUnitario)} - Descripción: ${item.Descripción}`;

            // Crear un contenedor para los botones
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-container';

            // Botón para aumentar la cantidad
            const increaseButton = document.createElement('button');
            increaseButton.className = 'boton-rud increase';
            increaseButton.textContent = '+';
            increaseButton.onclick = async () => {
                item.cantidad += 1;
                await updateItem(item._id, item);
            };

            // Botón para disminuir la cantidad
            const decreaseButton = document.createElement('button');
            decreaseButton.className = 'boton-rud decrease';
            decreaseButton.textContent = '-';
            decreaseButton.onclick = async () => {
                if (item.cantidad > 0) {
                    item.cantidad -= 1;
                    await updateItem(item._id, item);
            
                    // Mostrar alerta personalizada si la cantidad es menor o igual a 5
                    if (item.cantidad <= 5) {
                        showAlert(`⚠️ ¡Atención! La cantidad de "${item.Nombre}" es ${item.cantidad}. Por debajo del stock recomendado.`);
                    }
                }
            };

            // Botón para eliminar el artículo
            const deleteButton = document.createElement('button');
            deleteButton.className = 'boton-rud delete';
            deleteButton.textContent = 'Eliminar';
            deleteButton.onclick = async () => {
                await deleteItem(item._id);
            };

            // Botón para modificar el artículo
            const editButton = document.createElement('button');
            editButton.className = 'boton-rud edit';
            editButton.textContent = 'Modificar';
            editButton.onclick = () => {
                document.getElementById('Nombre').value = item.Nombre;
                document.getElementById('Cantidad').value = item.cantidad;
                document.getElementById('precioUnitario').value = item.precioUnitario;
                document.getElementById('Descripción').value = item.Descripción;
                currentItemId = item._id;

                document.querySelector('.botoncrear').style.display = 'none';
                document.getElementById('updateButton').style.display = 'block';
            };

            buttonContainer.appendChild(increaseButton);
            buttonContainer.appendChild(decreaseButton);
            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(deleteButton);
            li.appendChild(buttonContainer);
            itemList.appendChild(li);
        });
    } else {
        console.error('Error al cargar los artículos');
    }
}
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evitar que se recargue la página al enviar el formulario

    const Nombre = document.getElementById('Nombre').value.trim();
    const cantidad = Math.max(0, Number(document.getElementById('Cantidad').value));
    const precioUnitario = Math.max(100, Number(document.getElementById('precioUnitario').value));
    const Descripción = document.getElementById('Descripción').value;

    if (!Nombre || isNaN(cantidad) || isNaN(precioUnitario)) {
        alert('Por favor, completa todos los campos requeridos correctamente.');
        return;
    }

    if (cantidad <= 5) {
        showAlert(`⚠️ ¡Atención! La cantidad de "${Nombre}" es ${cantidad}, por debajo del stock recomendado.`);
    }

    const response = await fetch('/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Nombre, cantidad, precioUnitario, Descripción }),
    });

    if (response.ok) {
        form.reset(); // Limpiar el formulario después de agregar el artículo
        await loadItems(); // Recargar la lista de artículos
    } else {
        alert('Error al agregar el artículo');
    }
});


// Evento para actualizar un artículo
document.getElementById('updateButton').onclick = async () => {
    const updatedItem = {
        Nombre: document.getElementById('Nombre').value,
        cantidad: parseInt(document.getElementById('Cantidad').value, 10),
        precioUnitario: parseFloat(document.getElementById('precioUnitario').value),
        Descripción: document.getElementById('Descripción').value,
    };

    // Verificar si la cantidad es menor o igual a 5
    if (updatedItem.cantidad <= 5) {
        // Mostrar alerta personalizada en lugar de usar alert()
        showAlert(`⚠️ ¡Atención! La cantidad de "${updatedItem.Nombre}" es ${updatedItem.cantidad}.   Por debajo del stock recomendado.`);
    }

    // Actualizar el artículo
    await updateItem(currentItemId, updatedItem);

    // Limpiar el formulario y ocultar el botón de actualización
    document.getElementById('itemForm').reset();
    document.querySelector('.botoncrear').style.display = 'block';
    document.getElementById('updateButton').style.display = 'none';
};

// Función para actualizar un artículo
async function updateItem(id, updatedItem) {
    const response = await fetch(`/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem),
    });

    if (response.ok) {
        await loadItems(); // Recargar la lista después de actualizar
    } else {
        alert('Error al actualizar el artículo');
    }
}

// Función para eliminar un artículo
async function deleteItem(id) {
    const response = await fetch(`/items/${id}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        await loadItems(); // Recargar la lista después de eliminar
    } else {
        alert('Error al eliminar el artículo');
    }
}

// Cargar artículos al iniciar
loadItems();
