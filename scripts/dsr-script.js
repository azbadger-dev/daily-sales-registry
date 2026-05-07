const addSale = () => {
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const methodKey = paymentMethodEntry.value;
    const methodData = PAYMENT_METHODS[methodKey];

    if (!description || isNaN(amount) || amount <= 0) {
        alert("Por favor, ingresa una descripción y un monto válido.");
        return;
    }

    let finalAmount = amount;

    if (methodData.acceptsTax) {
        const taxPercent = parseFloat(percentageInput.value) || 5;
        finalAmount = amount + (amount * (taxPercent / 100));
    }

    const newSale = {
        id: Date.now(),
        description,
        amount: finalAmount,
        method: methodData.name,
        icon: methodData.icon
    };

    salesList.push(newSale);
    saveData();

    clearInputs();
    updateView();

    alert("Venta agregada con éxito. Esta se encuentra en reflejada en la tabla de ventas.");
};

const updateView = () => {
    const oldSalesTable = document.querySelectorAll('.created-element');
    oldSalesTable.forEach(sale => { sale.remove() });

    const emptySales = document.querySelectorAll('.empty-sales');
    if (salesList.length === 0) {
        document.documentElement.style.setProperty('--empty-sales-display', 'grid')
        return;
    }
    document.documentElement.style.setProperty('--empty-sales-display', 'none')

    const filteredValue = parseInt(paymentMethodTable.value);
    filteredSalesList = (filteredValue === 1) ? salesList : salesList.filter(
        sale => sale.method === PAYMENT_METHODS[(filteredValue - 1)].name
    );

    filteredSalesList.forEach(sale => {
        renderTableRow(sale);
        renderCard(sale);
    });

    updateTotal();
};

const renderTableRow = (sale) => {
    const row = document.createElement('div');
    row.classList.add('sale-content', 'created-element');

    row.innerHTML = `
        <span>${sale.description}</span>
        <span>$${sale.amount.toFixed(2)}</span>
        <span>${sale.method} <i class='bx ${sale.icon}'></i></span>
        <button class="btn-trash"><i class="bx bx-trash"></i></button>
    `;
    const btnTrash = row.querySelector('.btn-trash');
    btnTrash.addEventListener('click', () => { deleteSale(sale.id) })

    const lineDiv = document.createElement('div');
    lineDiv.classList.add('sale-content', 'created-element');
    const line = document.createElement('hr');
    line.style.gridColumn = 'span 4';
    lineDiv.append(line);
    dashBoardTableDiv.appendChild(row);
    dashBoardTableDiv.appendChild(lineDiv);
};

const renderCard = (sale) => {
    const card = document.createElement('div');
    card.classList.add('dashboard-cards', 'created-element');

    card.innerHTML = `
        <label class="label-description">Descripción:</label>
        <span class="span-description">${sale.description}</span>
        <hr>
        <label class="label-amount">Monto:</label>
        <span class="span-amount">$${sale.amount.toFixed(2)}</span>
        <hr>
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
};

const updateTotal = () => {
    totalSales = Math.round(salesList.reduce((acc, a) => { return acc + parseFloat(a.amount) }, 0) * 100) / 100;
    const filteredTotal = Math.round(filteredSalesList.reduce((acc, a) => { return acc + parseFloat(a.amount) }, 0) * 100) / 100;
    renderTotalTable(filteredTotal.toFixed(2));
    renderTotalCards(filteredTotal.toFixed(2));
};

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
};

const deleteSale = (id) => {
    salesList = salesList.filter(sale => sale.id !== id);
    saveData();
    updateView();
};

const percentageDisplayStatus = () => {
    const methodKey = parseInt(paymentMethodEntry.value);
    if (PAYMENT_METHODS[methodKey].acceptsTax) {
        percentageDiv.style.display = 'grid';
    } else {
        percentageInput.value = '';
        percentageDiv.style.display = 'none';
    }
};

const addCash = () => {
    if (cashAddInput.value && parseFloat(cashAddInput.value) > 0) {
        cashAdditions += parseFloat(cashAddInput.value);
    } else { alert("Por favor, ingresa un monto válido.") };
    clearInputs();
    saveData();
};

const withdrawalCash = () => {
    if (!cashWithdrawalInput.value && !parseFloat(cashWithdrawalInput.value) > 0) {
        alert("Por favor, ingresa un monto válido.");
        return
    } else if (calculateCashStatus().total < parseFloat(cashWithdrawalInput.value)) {
        alert("El monto a retirar no puede ser mayor al disponible en caja.");
        return
    }
    cashWithdrawals += parseFloat(cashWithdrawalInput.value);
    clearInputs();
    saveData();
};

const editInitialCash = () => {
    prevCashInput.disabled = false;
    btnPrevCashEdit.style.display = 'none';
    btnPrevCashSave.style.display = 'block';
}

const saveInitialCash = () => {
    if (prevCashInput.value && parseFloat(prevCashInput.value) > 0) {
        prevCashInput.disabled = true;
        btnPrevCashEdit.style.display = 'block';
        btnPrevCashSave.style.display = 'none';
        cashInitial = parseFloat(prevCashInput.value);
    } else { alert("Por favor, ingresa un monto válido.") };
    saveData();
}

const calculateCashStatus = () => {
    const totalCashSales = salesList.filter(sale => sale.method === 'Efectivo')
        .reduce((acc, sale) => acc + sale.amount, 0);

    const currentInCash = cashInitial + totalCashSales + cashAdditions - cashWithdrawals;

    return {
        sales: totalCashSales,
        total: currentInCash,
    }

};

const generateWhatsAppReport = () => {
    const today = new Date();
    const dateFormat = today.toLocaleDateString('es-PA', {
        weekday: 'long', day: 'numeric',
        month: 'long', year: 'numeric'
    });

    let report = `*Registro del día ${dateFormat}*\n`

    Object.values(PAYMENT_METHODS).forEach(method => {
        const filtered = salesList.filter(s => s.method === method.name);
        if (filtered.length > 0) {
            const subtotal = filtered.reduce((acc, s) => acc + s.amount, 0);
            report += `\n*${method.name.toUpperCase()}:$${subtotal.toFixed(2)}*\n`;
            filtered.forEach(s => report += `• $${s.amount.toFixed(2)} ${s.description}\n`);
        }
    });

    const cashStatus = calculateCashStatus();

    report += `\n*Total Del Día = $${totalSales.toFixed(2)}*`;
    report += `\n\n*CAJA MENUDA*`;
    report += `\nSaldo anterior: $${cashInitial.toFixed(2)}`;
    report += `\n+$${cashStatus.sales.toFixed(2)} - Ventas en Efectivo`
    report += `\n+$${cashAdditions.toFixed(2)} - Efectivo Agregado`
    report += `\n-$${cashWithdrawals.toFixed(2)} - Efectivo Retirado`
    report += `\n\n*Total en caja: $${cashStatus.total.toFixed(2)}*`;

    reportOutput.value = report;

    alert("Día cerrado con éxito. El reporte está listo en el cuadro de texto.");
};

const quickCopy = () => {
    const textToCopy = reportOutput.value;
    if (textToCopy) {
        navigator.clipboard.writeText(textToCopy)
            .then(() => {

                const originalText = btnCopy.innerHTML;
                btnCopy.innerHTML = `<i class="bx bx-check"></i>`;
                btnCopy.style.backgroundColor = '#4CAF50';
                btnCopy.style.color = '#ffffff';

                setTimeout(() => {
                    btnCopy.innerHTML = originalText;
                    btnCopy.style.backgroundColor = '';
                    btnCopy.style.color = '';
                }, 2000);
            })
            .catch(err => {
                console.error('Error al copiar: ', err);
            });
    }
}

const saveData = () => {
    localStorage.setItem('sales_rgl', JSON.stringify(salesList));

    const cashData = {
        initial: cashInitial,
        add: cashAdditions,
        withdraw: cashWithdrawals
    };
    localStorage.setItem('cash_rgl', JSON.stringify(cashData));
};

const loadData = () => {
    const savedSales = localStorage.getItem('sales_rgl');
    const savedCash = localStorage.getItem('cash_rgl');

    if (savedSales) {
        salesList = JSON.parse(savedSales);
    }

    if (savedCash) {
        const cash = JSON.parse(savedCash);
        cashInitial = cash.initial;
        cashAdditions = cash.add;
        cashWithdrawals = cash.withdraw;

        prevCashInput.value = cashInitial;
    }
    updateView();
};

const finishDay = () => {
    if (salesList.length === 0) {
        alert("No hay ventas registradas para cerrar el día.");
        return;
    }

    const confirmClose = confirm("¿Estás seguro de cerrar el día? Se borrarán las ventas actuales.");

    if (confirmClose) {
        generateWhatsAppReport();

        salesList = [];
        cashAdditions = 0;
        cashWithdrawals = 0;
        cashInitial = 0;

        localStorage.removeItem('sales_rgl');
        localStorage.removeItem('cash_rgl')

        updateView();
    }
};

// Inputs
const descriptionInput = document.getElementById('description-input');
const amountInput = document.getElementById('amount-input');
const percentageInput = document.getElementById('percentage-input')
const cashWithdrawalInput = document.getElementById('cash-withdrawal-input');
const cashAddInput = document.getElementById('cash-add-input');
const prevCashInput = document.getElementById('prev-cash-input');

// textarea
const reportOutput = document.getElementById('report-output-textarea');

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
btnCashWithdrawal.addEventListener('click', () => { withdrawalCash() });
const btnCashAdd = document.getElementById('cash-add-btn');
btnCashAdd.addEventListener('click', () => { addCash() });
const btnPrevCashEdit = document.getElementById('prev-cash-edit-btn');
btnPrevCashEdit.addEventListener('click', () => { editInitialCash() });
const btnPrevCashSave = document.getElementById('prev-cash-save-btn');
btnPrevCashSave.addEventListener('click', () => { saveInitialCash() });
const btnReportOutput = document.getElementById('report-output-btn');
btnReportOutput.addEventListener('click', () => { finishDay() });
const btnCopy = document.getElementById('quick-copy-btn');
btnCopy.addEventListener('click', () => { quickCopy() });

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
let cashInitial = 0;
let cashAdditions = 0;
let cashWithdrawals = 0;

loadData();