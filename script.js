const steps = document.querySelectorAll(".step");
const progressBar = document.querySelector(".progress-bar");
const formSteps = document.querySelectorAll(".form-step");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
let currentStep = 0;

// Функция обновления шагов
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

let currentLang = "ru";
let translations = {};

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

            if (Object.keys(translations).length > 0) {
                updateFormSteps();
            }
        })
        .catch(error => console.error("Ошибка загрузки перевода:", error));
}

changeLanguage(currentLang);

document.getElementById("currentYear").textContent = new Date().getFullYear();


document.getElementById("languageBtn").addEventListener("click", function() {
    const dropdown = document.getElementById("languageDropdown");
    dropdown.classList.toggle("visible");  // Переключаем видимость списка
});