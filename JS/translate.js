// --- Переклади ---
const translations = {
    uk: {
        title: "EarlyPay PRO",
        subtitle: "Калькулятор кредиту з достроковими платежами та графіками",
        amount: "Сума кредиту (UAH)",
        months: "Термін (міс.)",
        rate: "Річна ставка (%)",
        salary: "Щомісячна зарплата (UAH)",
        expenses: "Щомісячні витрати (UAH)",
        extraPay: "Бажана сума дострокового погашення (UAH)",
        extraParts: "На скільки частин розбити",
        calc: "Розрахувати",
        monthPayment: "Місячний платіж",
        totalPaid: "Всього сплатите",
        overpay: "Переплата (відсотки)",
        percentPaid: "% сплачено",
        recExtra: "Рекомендований додатковий платіж",
        tableHead: ["Міс.", "Платіж", "Процент", "Основний борг", "Залишок"],
        alert: "Pозрахунок кредиту 🙂"
    },
    en: {
        title: "EarlyPay PRO",
        subtitle: "Loan calculator with early payments and charts",
        amount: "Loan amount (UAH)",
        months: "Term (months)",
        rate: "Annual interest rate (%)",
        salary: "Monthly salary (UAH)",
        expenses: "Monthly expenses (UAH)",
        extraPay: "Desired early repayment amount (UAH)",
        extraParts: "Split into parts",
        calc: "Calculate",
        monthPayment: "Monthly payment",
        totalPaid: "Total paid",
        overpay: "Overpayment (interest)",
        percentPaid: "% paid",
        recExtra: "Recommended extra payment",
        tableHead: ["Month", "Payment", "Interest", "Principal", "Balance"],
        alert: "Loan calculation 🙂"
    }
};

// --- Застосування перекладу ---
function applyTranslations(lang) {
    const t = translations[lang];

    document.getElementById("title").textContent = t.title;
    document.getElementById("subtitle").textContent = t.subtitle;

    const labels = {
        amount: t.amount,
        months: t.months,
        rate: t.rate,
        salary: t.salary,
        expenses: t.expenses,
        extraPay: t.extraPay,
        extraParts: t.extraParts
    };

    for (const id in labels) {
        const lbl = document.querySelector(`label[for='${id}']`);
        if (lbl && lbl.firstChild) lbl.firstChild.nodeValue = labels[id] + " ";
    }

    document.getElementById("calcBtn").textContent = t.calc;

    [
        ["monthPayment", t.monthPayment],
        ["totalPaid", t.totalPaid],
        ["overpay", t.overpay],
        ["percentPaid", t.percentPaid],
        ["recExtra", t.recExtra]
    ].forEach(([id, text]) => {
        const el = document.querySelector(`#${id}`);
        if (el && el.previousElementSibling)
            el.previousElementSibling.textContent = text;
    });

    document.querySelectorAll("#schedule thead th")
        .forEach((th, i) => th.textContent = t.tableHead[i]);
}

// --- Тема ---
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.checked = true;
}
themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark', themeToggle.checked);
    localStorage.setItem('theme', themeToggle.checked ? 'dark' : 'light');
});

// --- Мова ---
const langToggle = document.getElementById('langToggle');
const savedLang = localStorage.getItem('lang') || 'uk';
langToggle.checked = savedLang === 'en';
applyTranslations(savedLang);

langToggle.addEventListener('change', () => {
    const lang = langToggle.checked ? 'en' : 'uk';
    applyTranslations(lang);
    localStorage.setItem('lang', lang);
});

// --- Кнопка розрахунку ---
const calcBtn = document.getElementById("calcBtn");
calcBtn.addEventListener("click", () => {
    const lang = localStorage.getItem("lang") || "uk";
    alert(translations[lang].alert);
});