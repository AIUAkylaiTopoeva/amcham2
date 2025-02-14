const steps = document.querySelectorAll(".step");
const progressBar = document.querySelector(".progress-bar");
const formSteps = document.querySelectorAll(".form-step");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
let currentStep = 0;

function updateFormSteps() {
    formSteps.forEach((step, index) => {
        step.classList.toggle("active", index === currentStep);
        step.style.display = index === currentStep ? "block" : "none"; // Показываем текущий шаг
    });

    steps.forEach((step, index) => {
        step.classList.toggle("active", index <= currentStep);
    });

    progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;

    prevBtn.disabled = currentStep === 0;
    nextBtn.textContent = currentStep === formSteps.length - 1 
        ? translations[currentLang]["submit"] 
        : translations[currentLang]["next"];
}

function validateStep() {
    const inputs = formSteps[currentStep].querySelectorAll("input[required], textarea[required]");
    let valid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add("error");
            valid = false;
        } else {
            input.classList.remove("error");
        }
    });

    return valid;
}

nextBtn.addEventListener("click", () => {
    if (!validateStep()) return;

    if (currentStep < steps.length - 1) {
        currentStep++;
        updateFormSteps();
    } else {
        alert(translations[currentLang]["formSubmitted"]);
    }
});

prevBtn.addEventListener("click", () => {
    if (currentStep > 0) {
        currentStep--;
        updateFormSteps();
    }
});

steps.forEach((step, index) => {
    step.addEventListener("click", () => {
        if (index <= currentStep) {
            currentStep = index;
            updateFormSteps();
        }
    });
});

// let currentLang = "ru";

// function changeLanguage(lang) {
//     console.log(`Загружаем язык: ${lang}`); // Проверка языка в консоли
//     fetch(`${lang}.json`)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`Ошибка загрузки: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log("Переводы загружены:", data); // Выведем полученные переводы
//             translations = data;
//             currentLang = lang;

//             document.querySelectorAll("[data-translate]").forEach(element => {
//                 const key = element.getAttribute("data-translate");
//                 if (translations[key]) {
//                     element.textContent = translations[key];
//                 }
//             });

//             updateFormSteps(); // Чтобы обновить кнопки
//         })
//         .catch(error => console.error("Ошибка загрузки перевода:", error));
// }

// changeLanguage(currentLang);

document.getElementById("currentYear").textContent = new Date().getFullYear();


document.getElementById("languageBtn").addEventListener("click", function() {
    document.getElementById("languageDropdown").classList.toggle("hidden");
});
document.getElementById('multiStepForm').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const formData = new FormData(this);

    try {
        const response = await fetch('https://127.0.0.1:5500', { 
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Форма успешно отправлена!');
        } else {
            alert('Ошибка при отправке формы');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка сети');
    }
});

window.addEventListener("scroll", function () {
    let header = document.querySelector("header");
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

function toggleLanguageDropdown() {
    document.getElementById("languageDropdown").classList.toggle("show");
}

window.onclick = function (event) {
    if (!event.target.matches("#languageBtn")) {
        document.getElementById("languageDropdown").classList.remove("show");
    }
};
let currentLang = "ru";

function changeLanguage(lang) {
    fetch(`languages/${lang}.json`)
        .then(response => response.json())
        .then(data => {
            document.querySelectorAll("[data-i18n]").forEach(element => {
                const key = element.getAttribute("data-i18n");
                if (data[key]) {
                    element.textContent = data[key];
                }
            });
            localStorage.setItem("selectedLang", lang); // Запоминаем язык
            currentLang = lang;
        })
        .catch(error => console.error("Ошибка загрузки перевода:", error));
}

// Проверяем, какой язык был сохранён, иначе устанавливаем русский
const savedLang = localStorage.getItem("selectedLang") || "ru";
changeLanguage(savedLang);

// Обработчик кликов по кнопкам смены языка
document.querySelectorAll(".language-selector a").forEach(link => {
    link.addEventListener("click", function (event) {
        event.preventDefault();
        const selectedLang = this.getAttribute("data-lang"); // data-lang вместо onclick
        changeLanguage(selectedLang);
    });
});

function updateFormStep() {
    formSteps.forEach((step, index) => {
        step.style.display = index === currentStep ? "block" : "none"; 
    });

    steps.forEach((step, index) => {
        step.classList.toggle("active", index <= currentStep);
    });

    progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
}

// Обработчик кликов по шагам
steps.forEach(step => {
    step.addEventListener("click", function () {
        const stepIndex = parseInt(this.getAttribute("data-step"), 10);
        if (stepIndex <= currentStep) {
            currentStep = stepIndex;
            updateFormStep();
        }
    });
});

// Обновляем форму при загрузке
updateFormStep();