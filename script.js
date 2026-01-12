const CONFIG = {
  images: {
    background: 'img/background.png',
    logo: 'img/logo.svg',
    holo: 'img/holo.png',
    stamp: 'img/stamp.png'
  },
  a4: {
    width: 842,
    height: 595
  },
  date: {
    monthNames: {
      ru: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
      en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    }
  }
};

let translations = {};
let courseData = {};

const elements = {
  a4Page: document.getElementById('a4Page'),
  htmlPage: document.getElementById('html-page'),
  slctLang: document.getElementById('slctLang'),
  inptDate: document.getElementById('inptDate'),
  inptName: document.getElementById('inptName'),
  cptLevel: document.getElementById('cptLevel'),
  slctCourse: document.getElementById('slctCourse'),
  slctLevel: document.getElementById('slctLevel'),
  toggleStamp: document.getElementById('toggleStamp'),
  exportBtn: document.getElementById('exportBtn'),
  txtDate: document.getElementById('txtDate'),
  txtName: document.getElementById('txtName'),
  txtCourse: document.getElementById('txtCourse'),
  txtSkills: document.getElementById('txtSkills'),
  imgStamp: document.getElementById('imgStamp'),
  messageBox: document.getElementById('messageBox'),
  messageBoxText: document.getElementById('messageBoxText'),
  messageBoxBtn: document.getElementById('messageBoxBtn')
};

const checkCriticalElements = () => {
  const criticalIds = ['a4Page', 'exportBtn', 'slctCourse', 'slctLevel', 'slctLang'];
  return criticalIds.every(id => elements[id]);
};

const showMessage = (message) => {
  if (elements.messageBoxText && elements.messageBox) {
    elements.messageBoxText.textContent = message;
    elements.messageBox.classList.remove('hidden');
  } else {
    alert(message);
  }
};

const getCurrentLang = () => {
  return document.querySelector('.segment-control button.active')?.dataset.lang || 'ru';
};


// Загрузка данных
const loadData = async () => {
  try {
    const [translationsRes, courseDataRes] = await Promise.all([
      fetch('translations.json'),
      fetch('courseData.json')
    ]);

    if (!translationsRes.ok || !courseDataRes.ok) {
      throw new Error(`Ошибка загрузки данных: ${translationsRes.status} / ${courseDataRes.status}`);
    }

    [translations, courseData] = await Promise.all([
      translationsRes.json(),
      courseDataRes.json()
    ]);

    console.log("Данные успешно загружены");
  } catch (error) {
    console.error("Ошибка загрузки:", error);
    showMessage(`Ошибка загрузки данных: ${error.message}. Проверьте файлы translations.json и courseData.json`);
    throw error;
  }
};

// Язык
const applyTranslations = (lang) => {
  const langData = translations[lang];
  if (!langData) return;

  document.querySelectorAll('[data-lang-key]').forEach(el => {
    el.textContent = langData[el.dataset.langKey] || el.textContent;
  });

  elements.slctLang?.querySelectorAll('button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  if (elements.toggleStamp) {
    elements.toggleStamp.checked = lang === 'ru';
    updateStampVisibility();
  }

  localStorage.setItem('lang', lang);
};

// Курс
const populateCourses = () => {
  const lang = getCurrentLang();
  const courses = courseData;
  if (!courses) return;

  const options = Object.entries(courses)
    .filter(([id, course]) => course[lang]?.title)
    .map(([id, course]) => 
      `<option value="${id}">${course[lang].title}</option>`
    );

  elements.slctCourse.innerHTML = 
    `<option value="">${translations[lang]?.selectCourseOption || 'Выберите курс'}</option>` +
    options.join('');

  const savedCourseId = localStorage.getItem(`selectedCourse-${lang}`);
  if (savedCourseId && courses[savedCourseId]) {
    elements.slctCourse.value = savedCourseId;
  } else if (options.length > 0) {
    elements.slctCourse.value = Object.keys(courses)[0];
  }

  populateLevels();
};

// Уровень
const populateLevels = () => {
  const lang = getCurrentLang();
  const selectedCourseId = elements.slctCourse.value;
  const course = courseData[selectedCourseId]?.[lang];

  const levelOptions = course?.levels 
    ? Object.keys(course.levels).map(levelName => 
        `<option value="${levelName}">${levelName}</option>`
      ).join('')
    : '';

  elements.slctLevel.innerHTML = 
    `<option value="">${translations[lang]?.selectLevelOption || 'Выберите уровень'}</option>` +
    levelOptions;

  if (course?.levels) {
    const savedLevel = localStorage.getItem(`selectedLevel-${lang}-${selectedCourseId}`);
    if (savedLevel && course.levels[savedLevel]) {
      elements.slctLevel.value = savedLevel;
    } else if (Object.keys(course.levels).length > 0) {
      elements.slctLevel.value = Object.keys(course.levels)[0];
    }
  }

  updateCourseDisplay();
};

const updateCourseDisplay = () => {
  const lang = getCurrentLang();
  const course = courseData[elements.slctCourse.value]?.[lang];
  const langData = translations[lang];
  const selectedLevel = elements.slctLevel.value;
  
  if (!course || !langData) return;

  elements.txtCourse && (elements.txtCourse.textContent = course.title || '');
  elements.txtSkills && (elements.txtSkills.innerHTML = 
    course.levels?.[selectedLevel]?.filter(t => t.trim())
      .map(t => `<li>${t}</li>`).join('') || '');

  const levelEl = document.getElementById('cptLevel');
  const certLevelEl = document.getElementById('crtLevel');
  levelEl && (levelEl.textContent = `${langData.cptLevelPrefix || ''} ${selectedLevel} ${langData.cptLevelSuffix || ''}`.trim());
  certLevelEl && (certLevelEl.textContent = selectedLevel || langData.cptLevel);

  localStorage.setItem(`selectedCourse-${lang}`, elements.slctCourse.value);
  localStorage.setItem(`selectedLevel-${lang}-${elements.slctCourse.value}`, selectedLevel);

  updateCertificateContent();
};

// Обновление содержимого сертификата
const updateCertificateContent = () => {
  const lang = getCurrentLang();
  
  if (elements.inptDate.value && elements.txtDate) {
    const date = new Date(elements.inptDate.value);
    const day = date.getDate();
    const year = date.getFullYear();
    const monthName = CONFIG.date.monthNames[lang]?.[date.getMonth()] || CONFIG.date.monthNames.en[date.getMonth()];
    elements.txtDate.textContent = `${day} ${monthName}, ${year}`;
  }

  if (elements.txtName) {
    elements.txtName.textContent = elements.inptName.value;
  }
};

const updateStampVisibility = () => {
  if (!elements.imgStamp || !elements.toggleStamp) return;
  
  const isVisible = elements.toggleStamp.checked;
  elements.imgStamp.style.opacity = isVisible ? '1' : '0';
  
  if (!isVisible) {
      if (!elements.toggleStamp.checked) {
        elements.imgStamp.style.display = 'none';
      }
  } else {
    elements.imgStamp.style.display = 'block';
  }
};


// Генерация PDF
const generatePDF = async () => {
  const lang = getCurrentLang();
  const langData = translations[lang];

  if (!elements.inptName.value.trim()) {
    showMessage(langData.studentNameRequired);
    return;
  }

  try {
    const canvas = await html2canvas(elements.a4Page, {
      scale: 4,
      useCORS: true,
      logging: false
    });

    const pdf = new window.jspdf.jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [CONFIG.a4.width, CONFIG.a4.height]
    });

    pdf.addImage(canvas.toDataURL('image/jpeg', 0.8), 'JPEG', 0, 0, CONFIG.a4.width, CONFIG.a4.height);
    pdf.save('certificate.pdf');

    console.log('PDF успешно создан');
  } catch (error) {
    console.error('Ошибка генерации PDF:', error);
    showMessage(`${langData.pdfErrorMessagePrefix || 'Ошибка:'} ${error.message}`);
  }
};

const init = async () => {
  if (!checkCriticalElements()) {
    showMessage("Критические элементы страницы не найдены. Проверьте структуру HTML.");
    return;
  }

  try {
    await loadData();
    
    const today = new Date();
    elements.inptDate.value = today.toISOString().split('T')[0];
    
    const savedLang = localStorage.getItem('lang') || 'ru';
    applyTranslations(savedLang);
    
    if (elements.a4Page) {
      elements.a4Page.style.width = `${CONFIG.a4.width}px`;
      elements.a4Page.style.height = `${CONFIG.a4.height}px`;
    }
    
    populateCourses();
    
  } catch (error) {
    console.error("Ошибка инициализации:", error);
  }
};

// Обработчики событий
const setupEventListeners = () => {
  if (elements.inptDate) elements.inptDate.addEventListener('input', updateCertificateContent);
  if (elements.inptName) elements.inptName.addEventListener('input', updateCertificateContent);
  if (elements.slctCourse) elements.slctCourse.addEventListener('change', populateLevels);
  if (elements.slctLevel) elements.slctLevel.addEventListener('change', updateCourseDisplay);
  if (elements.toggleStamp) elements.toggleStamp.addEventListener('change', updateStampVisibility);
  
  if (elements.exportBtn) {
    elements.exportBtn.addEventListener('click', (e) => {
      e.preventDefault();
      generatePDF();
    });
  }
  
  if (elements.slctLang) {
    elements.slctLang.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON' && e.target.dataset.lang) {
        applyTranslations(e.target.dataset.lang);
        populateCourses();
      }
    });
  }
  
  if (elements.messageBoxBtn) {
    elements.messageBoxBtn.addEventListener('click', () => {
      elements.messageBox.classList.add('hidden');
    });
  }
};

// Инициализация 
window.addEventListener('DOMContentLoaded', () => {
  init();
  setupEventListeners();
});