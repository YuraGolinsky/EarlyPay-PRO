const ctx = document.getElementById('chart').getContext('2d');
let chart;

// Створення графіка з перекладеними підписами
function buildChart(labels, baseBal, accelBal, paid) {
    const lang = localStorage.getItem('lang') || 'uk';
    const t = translations[lang];

    if (chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                    label: lang === 'en' ? 'Balance (standard)' : 'Залишок (звичайно)',
                    data: baseBal,
                    borderColor: '#888',
                    borderWidth: 2,
                    tension: 0.1,
                    fill: false
                },
                {
                    label: lang === 'en' ? 'Balance (with early payments)' : 'Залишок (з достроковими)',
                    data: accelBal,
                    borderColor: '#28a745',
                    borderWidth: 2,
                    tension: 0.1,
                    fill: false
                },
                {
                    label: lang === 'en' ? 'Total paid' : 'Фактично сплачено',
                    data: paid,
                    borderColor: '#007bff',
                    borderWidth: 2,
                    tension: 0.1,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'bottom' } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function calcSchedule() {
    const amount = +document.getElementById('amount').value || 0;
    const months = +document.getElementById('months').value || 1;
    const rate = (+document.getElementById('rate').value || 0) / 100 / 12;
    const extraInput = +document.getElementById('extraPay').value || 0;
    const parts = Math.max(1, +document.getElementById('extraParts').value || 1);
    const salary = +document.getElementById('salary').value || 0;
    const expenses = +document.getElementById('expenses').value || 0;

    // Ануїтетний платіж
    const annuity = (amount * rate) / (1 - Math.pow(1 + rate, -months));

    // Рекомендований додатковий платіж
    const recExtra = Math.max(0, salary - expenses - annuity);
    document.getElementById('recExtra').textContent = recExtra.toFixed(2);

    // Використовуємо або рекомендований, або користувацький
    const extra = extraInput > 0 ? extraInput : recExtra;

    // Розбиваємо на частини
    const extraPieces = [];
    let remaining = extra;
    for (let i = 0; i < parts; i++) {
        const piece = Math.round(remaining / (parts - i) * 100) / 100;
        extraPieces.push(piece);
        remaining -= piece;
    }

    // Масиви для графіка
    const labels = [];
    const balBase = [];
    const balAccel = [];
    const paidLine = [];

    let base = amount;
    let accel = amount;
    let totalPaid = 0;
    let extraIndex = 0;

    for (let m = 1; m <= months && accel > 0; m++) {
        labels.push(m);

        // Звичайний залишок
        const intBase = base * rate;
        const princBase = annuity - intBase;
        base -= princBase;
        balBase.push(Math.max(base, 0));

        // Достроковий залишок
        let extraPiece = extraPieces[extraIndex] || 0;
        if (extraPiece > 0) extraIndex++;
        const intAccel = accel * rate;
        const princAccel = Math.min(annuity - intAccel, accel);
        accel -= princAccel + extraPiece;
        balAccel.push(Math.max(accel, 0));

        totalPaid += annuity + extraPiece;
        paidLine.push(totalPaid);
    }

    buildChart(labels, balBase, balAccel, paidLine);

    // Таблиця
    const tbody = document.querySelector('#schedule tbody');
    tbody.innerHTML = '';
    base = amount;
    totalPaid = 0;
    extraIndex = 0;

    const lang = localStorage.getItem('lang') || 'uk';
    const head = translations[lang].tableHead;

    for (let m = 1; m <= months && base > 0; m++) {
        const intBase = base * rate;
        const princ = annuity - intBase;
        let extraPiece = extraPieces[extraIndex] || 0;
        if (extraPiece > 0) extraIndex++;

        base -= princ + extraPiece;
        totalPaid += annuity + extraPiece;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${m}</td>
            <td>${(annuity + extraPiece).toFixed(2)}</td>
            <td>${intBase.toFixed(2)}</td>
            <td>${princ.toFixed(2)}</td>
            <td>${Math.max(base, 0).toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
    }

    // Підсумки
    document.getElementById('monthPayment').textContent = annuity.toFixed(2);
    document.getElementById('totalPaid').textContent = totalPaid.toFixed(2);
    document.getElementById('overpay').textContent = (totalPaid - amount).toFixed(2);
    document.getElementById('percentPaid').textContent = ((totalPaid / amount) * 100).toFixed(2) + '%';
}

document.getElementById('calcBtn').addEventListener('click', calcSchedule);