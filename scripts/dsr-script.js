const addSale = () => {
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const methodKey = paymentMethodEntry.value;
    const methodData = PAYMENT_METHODS[methodKey];

    // Validación básica
    if (!description || isNaN(amount) || amount <= 0) {
        alert("Por favor, ingresa una descripción y un monto válido.");
        return;
    }

    let finalAmount = amount;

    // Lógica de impuesto usando el objeto de configuración
    if (methodData.acceptsTax) {
        const taxPercent = parseFloat(percentageInput.value) || 5; // 5% por defecto
        finalAmount = amount + (amount * (taxPercent / 100));
    }

    const newSale = {
        id: Date.now(), // Genera un ID único basado en tiempo
        description,
        amount: finalAmount,
        method: methodData.name,
        icon: methodData.icon
    };

    salesList.push(newSale);

    // Limpiar campos y actualizar vista
    clearInputs();
    updateView();
};

const updateView = () => {
    const oldSalesTable = document.querySelectorAll('.created-element');
    oldSalesTable.forEach(sale => { sale.remove() });
    if (salesList.length === 0) {
        // Aquí podrías poner un mensaje de "No hay ventas"
        return;
    }

    const filteredValue = parseInt(paymentMethodTable.value);
    filteredSalesList = (filteredValue === 1) ? salesList : salesList.filter(
        sale => sale.method === PAYMENT_METHODS[(filteredValue - 1)].name
    );

    // 3. Recorremos la lista de ventas y generamos los elementos
    filteredSalesList.forEach(sale => {
        renderTableRow(sale);
        renderCard(sale);
    });

    // 4. Al final, actualizamos el total acumulado
    updateTotal();
};

// Genera la fila para la tabla (Desktop)
const renderTableRow = (sale) => {
    const row = document.createElement('div');
    row.classList.add('sale-content', 'created-element'); // La clase que definiste en tu CSS Grid

    row.innerHTML = `
        <span class="span-description">${sale.description}</span>
        <span class="span-amount">$${sale.amount.toFixed(2)}</span>
        <div class="header-payment-method">
            <span class="span-payment-method">${sale.method}</span>
            <i class='bx ${sale.icon}'></i>
        </div>
        <button class="btn-trash">
            <i class="bx bx-trash"></i>
        </button>
    `;
    const btnTrash = row.querySelector('.btn-trash');
    btnTrash.addEventListener('click', () => { deleteSale(sale.id) })
    dashBoardTableDiv.appendChild(row);
};

// Genera la tarjeta para móvil
const renderCard = (sale) => {
    const card = document.createElement('div');
    card.classList.add('dashboard-cards', 'created-element');

    card.innerHTML = `
        <label class="label-description">Descripción:</label>
        <span class="span-description">${sale.description}</span>
        <label class="label-amount">Monto:</label>
        <span class="span-amount">$${sale.amount.toFixed(2)}</span>
        <label class="label-payment-method">Método:</label>
        <span class="span-payment-method">${sale.method} <i class='bx ${sale.icon}'></i></span>
        <button class="btn-trash" onclick="deleteSale(${sale.id})">
            <i class="bx bx-trash"></i>
        </button>
    `;
    const btnTrash = card.querySelector('.btn-trash');
    btnTrash.addEventListener('click', () => { deleteSale(sale.id) })
    dashBoardCardsDiv.appendChild(card);
};

const clearInputs = () => {
    const fieldsToClear = [
        descriptionInput,
        amountInput,
        percentageInput,
        cashWithdrawalInput,
        cashAddInput
    ];

    fieldsToClear.forEach(input => {
        if (input) { input.value = '' };
    });
}

const updateTotal = () => {
    totalSales = Math.round(salesList.reduce((acc, a) => { return acc + parseFloat(a.amount) }, 0) * 100) / 100;
    const filteredTotal = Math.round(filteredSalesList.reduce((acc, a) => { return acc + parseFloat(a.amount) }, 0) * 100) / 100;
    renderTotalTable(filteredTotal.toFixed(2));
    renderTotalCards(filteredTotal.toFixed(2));
}

const renderTotalTable = (filtered) => {
    const totalTitle = document.createElement('div');
    totalTitle.classList.add('total-title', 'created-element');
    totalTitle.innerHTML = `Total`;

    const totalAmount = document.createElement('div');
    totalAmount.classList.add('total-amount', 'created-element');
    totalAmount.innerHTML = `${filtered}`;

    dashBoardTableDiv.appendChild(totalTitle);
    dashBoardTableDiv.appendChild(totalAmount);
};

const renderTotalCards = (filtered) => {
    const card = document.createElement('div');
    card.classList.add('dashboard-card-total', 'created-element');
    card.innerHTML = `
        <label>Total</label>
        <span>$${filtered}</span>
    `;
    dashBoardCardsDiv.appendChild(card);
}

const deleteSale = (id) => {
    salesList = salesList.filter(sale => sale.id !== id);
    updateView();
}

const percentageDisplayStatus = () => {
    const methodKey = parseInt(paymentMethodEntry.value);
    if (PAYMENT_METHODS[methodKey].acceptsTax) {
        percentageDiv.style.display = 'grid';
    } else {
        percentageInput.value = '';
        percentageDiv.style.display = 'none';
    }
}

const syncFilters = () => {

}

// Inputs
const descriptionInput = document.getElementById('description-input');
const amountInput = document.getElementById('amount-input');
const percentageInput = document.getElementById('percentage-input')
const cashWithdrawalInput = document.getElementById('cash-withdrawal-input');
const cashAddInput = document.getElementById('cash-add-input');

// Selects
const paymentMethodEntry = document.getElementById('payment-method-entry');
paymentMethodEntry.addEventListener('change', () => { percentageDisplayStatus() });
const paymentMethodTable = document.getElementById('payment-method-table');
const paymentMethodCards = document.getElementById('payment-method-cards');
const allFilters = document.querySelectorAll('.filter-sync');
allFilters.forEach(select => {
    select.addEventListener('change', (e) => {
        const val = e.target.value;

        allFilters.forEach(s => s.value = val);
        updateView();
    });
});

// Buttons
const btnAddSale = document.getElementById('add-sale-btn');
btnAddSale.addEventListener('click', () => { addSale() });
const btnCashWithdrawal = document.getElementById('cash-withdrawal-btn');
const btnCashAdd = document.getElementById('cash-add-btn');
const btnPrevCashEdit = document.getElementById('prev-cash-edit-btn');
const btnPrevCashSave = document.getElementById('prev-cash-save-btn');
const btnReportOutput = document.getElementById('report-output-btn');

// Containers
const percentageDiv = document.getElementById('percentage-div');
const dashBoardTableDiv = document.getElementById('dashboard-table-div');
const dashBoardCardsDiv = document.getElementById('dashboard-cards-div');

const PAYMENT_METHODS = {
    1: { name: 'Efectivo', icon: 'bx-money', acceptsTax: false },
    2: { name: 'Tarjeta', icon: 'bx-credit-card', acceptsTax: true },
    3: { name: 'Yappy', icon: 'bx-mobile-alt', acceptsTax: false },
    4: { name: 'Yappy Comercial', icon: 'bx-store', acceptsTax: false },
    5: { name: 'Transferencia', icon: 'bx-transfer', acceptsTax: false },
};

let salesList = [];
let filteredSalesList = [];
let totalSales = 0;