// Inputs
const descriptionInput = document.getElementById('description-input');
const amountInput = document.getElementById('amount-input');
const percentageInput = document.getElementById('percentage')
const cashWithdrawalInput = document.getElementById('cash-withdrawal-input');
const cashAddInput = document.getElementById('cash-add-input');

// Selects
const paymentMethodEntry = document.getElementById('payment-method-entry');
const paymentMethodTable = document.getElementById('payment-method-table');
const paymentMethodCards = document.getElementById('payment-method-cards');

// Buttons
const btnAddSale = document.getElementById('add-sale-btn');
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