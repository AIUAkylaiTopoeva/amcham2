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

function changeLanguage(lang) {
    alert("Выбран язык: " + lang);
    document.getElementById("languageDropdown").classList.remove("show");
}

window.onclick = function (event) {
    if (!event.target.matches("#languageBtn")) {
        document.getElementById("languageDropdown").classList.remove("show");
    }
};