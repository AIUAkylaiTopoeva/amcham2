const steps = document.querySelectorAll(".step");
const progressBar = document.querySelector(".progress-bar");
const formSteps = document.querySelectorAll(".form-step");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
let currentStep = 0;

// Обновление шагов формы и прогресс-бара
function updateFormSteps() {
    formSteps.forEach((step, index) => {
        step.classList.toggle("active", index === currentStep);
    });

    steps.forEach((step, index) => {
        step.classList.toggle("active", index <= currentStep);
    });

    progressBar.style.width = `${(currentStep / (steps.length - 1)) * 100}%`;

    prevBtn.disabled = currentStep === 0;
    nextBtn.textContent = currentStep === steps.length - 1 ? translations[currentLang]["submit"] : translations[currentLang]["next"];
}

// Валидация обязательных полей перед переходом на следующий шаг
function validateStep() {
    const inputs = formSteps[currentStep].querySelectorAll("input[required], textarea[required]");
    let valid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add("error"); // Добавляем класс ошибки
            valid = false;
        } else {
            input.classList.remove("error"); // Убираем класс ошибки, если поле заполнено
        }
    });

    return valid;
}

// Обработчик кнопки "Далее"
nextBtn.addEventListener("click", () => {
    if (!validateStep()) return;

    if (currentStep < steps.length - 1) {
        currentStep++;
        updateFormSteps();
    } else {
        alert(translations[currentLang]["formSubmitted"]);
    }
});

// Обработчик кнопки "Назад"
prevBtn.addEventListener("click", () => {
    if (currentStep > 0) {
        currentStep--;
        updateFormSteps();
    }
});

// Клик по шагам (разрешается только возврат на предыдущие)
steps.forEach((step, index) => {
    step.addEventListener("click", () => {
        if (index <= currentStep) {
            currentStep = index;
            updateFormSteps();
        }
    });
});

// Функция смены языка
let currentLang = "ru"; // По умолчанию русский
let translations = {}; // Здесь будут храниться переводы

function changeLanguage(lang) {
    fetch(`translations/${lang}.json`)
        .then(response => response.json())
        .then(data => {
            translations = data;
            currentLang = lang;

            document.querySelectorAll("[data-translate]").forEach(element => {
                const key = element.getAttribute("data-translate");
                if (translations[key]) {
                    element.textContent = translations[key];
                }
            });

            // Обновляем кнопку "Далее/Отправить" при смене языка
            updateFormSteps();
        })
        .catch(error => console.error("Ошибка загрузки перевода:", error));
}

// Инициализация: загружаем переводы для языка по умолчанию
changeLanguage(currentLang);

// Обновление года в футере
document.getElementById("currentYear").textContent = new Date().getFullYear();

document.getElementById("languageBtn").addEventListener("click", function() {
    const dropdown = document.getElementById("languageDropdown");
    dropdown.classList.toggle("hidden");  // Переключаем видимость выпадающего списка
});
function toggleLanguageDropdown() {
    const languageDropdown = document.getElementById('languageDropdown');
    languageDropdown.classList.toggle('visible');
}
// var currentStep = 0; // Индекс текущего шага

// Функция для переключения между шагами
function nextPrev(n) {
    var steps = document.getElementsByClassName("form-step");
    var progressSteps = document.getElementsByClassName("step");

    // Скрыть текущий шаг
    steps[currentStep].classList.remove("active");
    progressSteps[currentStep].classList.remove("active");

    // Перейти к следующему или предыдущему шагу
    currentStep += n;

    // Если последний шаг, не позволяет двигаться дальше
    if (currentStep >= steps.length) {
        currentStep = steps.length - 1;
    }

    if (currentStep < 0) {
        currentStep = 0;
    }

    // Показать новый шаг
    steps[currentStep].classList.add("active");
    progressSteps[currentStep].classList.add("active");
}

// Инициализация первого шага
nextPrev(0);