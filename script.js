/* ==========================================================================
   EDUPULSE 360 — ЯДРО ПЛАТФОРМЫ (ОБЩЕЕ ДЛЯ ВСЕХ СТРАНИЦ)
   ========================================================================== */

const STORAGE_KEY = 'edupulse_multipage_v1';

const defaultData = {
  xp: 1450,
  role: 'student',
  teacherFilter: 'all',
  skills: [92, 95, 90, 93, 89, 94],
  skillLabels: ['Командность', 'Инициативность', 'Креативность', 'Аргументация', 'Лидерство', 'Дисциплина'],
  pulseVotes: { clear: 19, practice: 6, hard: 2 },
  questions: [
    { id: 1, text: 'Можно ли в начале следующего урока разобрать ещё один пример с параметром?', time: '3 мин назад', likes: 6 },
    { id: 2, text: 'Какие задачи войдут в пятничную проверочную работу?', time: '7 мин назад', likes: 4 }
  ],
  teachers: [
    {
      id: 1,
      name: 'Алексей Викторович Соколов',
      initials: 'АС',
      category: 'stem',
      subject: 'Физика и Инженерия',
      topic: 'Закон сохранения импульса и практикум',
      explain: 9.6,
      discipline: 9.2,
      freedom: 9.5,
      reviews: 142,
      rated: false
    },
    {
      id: 2,
      name: 'Елена Сергеевна Волкова',
      initials: 'ЕВ',
      category: 'stem',
      subject: 'Алгебра и Начала анализа',
      topic: 'Логарифмические уравнения и функции',
      explain: 9.5,
      discipline: 9.4,
      freedom: 9.1,
      reviews: 128,
      rated: false
    },
    {
      id: 3,
      name: 'Тимур Рустамович Алиев',
      initials: 'ТА',
      category: 'stem',
      subject: 'Информатика и Архитектура ПО',
      topic: 'Проектирование веб-интерфейсов и API',
      explain: 9.8,
      discipline: 9.5,
      freedom: 9.9,
      reviews: 184,
      rated: false
    },
    {
      id: 4,
      name: 'Мария Дмитриевна Орлова',
      initials: 'МО',
      category: 'humanities',
      subject: 'Английский язык и Риторика',
      topic: 'Academic Presentation & Debate Club',
      explain: 9.4,
      discipline: 9.1,
      freedom: 9.7,
      reviews: 112,
      rated: false
    },
    {
      id: 5,
      name: 'Дильноза Рустамовна Каримова',
      initials: 'ДК',
      category: 'humanities',
      subject: 'История и Обществознание',
      topic: 'Развитие научных школ и технологий',
      explain: 9.3,
      discipline: 9.2,
      freedom: 9.4,
      reviews: 96,
      rated: false
    },
    {
      id: 6,
      name: 'Виктор Павлович Громов',
      initials: 'ВГ',
      category: 'stem',
      subject: 'Химия и Лабораторный анализ',
      topic: 'Окислительно-восстановительные реакции',
      explain: 8.7,
      discipline: 8.9,
      freedom: 8.6,
      reviews: 84,
      rated: false
    }
  ],
  initiatives: [
    { id: 'i1', code: 'Инициатива #1', author: '9 «Инженерный» класс', category: 'Пространство', title: 'Зона коворкинга с мягкими пуфиками и быстрыми розетками для ноутбуков на 2 этаже', votes: 98, target: 100, budget: '4 800 000 сум', voted: false },
    { id: 'i2', code: 'Инициатива #2', author: 'Совет старшеклассников', category: 'Комфорт', title: 'Система предзаказа ланчей и напитков к большой перемене без очереди', votes: 84, target: 100, budget: '3 900 000 сум', voted: false },
    { id: 'i3', code: 'Инициатива #3', author: 'Инженерный клуб', category: 'Обучение', title: 'Открытая лаборатория 3D-печати и проведение школьных хакатонов раз в четверть', votes: 71, target: 90, budget: '2 700 000 сум', voted: false },
    { id: 'i4', code: 'Инициатива #4', author: '8–9 параллель', category: 'Инфраструктура', title: 'Индивидуальные локеры с кодовыми замками для хранения книг и проектов', votes: 62, target: 85, budget: '3 600 000 сум', voted: false }
  ],
  privileges: [
    { id: 'p1', title: 'Продление дедлайна домашнего задания (+24 часа)', desc: 'Официальное право сдать объемную домашнюю работу на день позже без потери балла.', cost: 350, claimed: false },
    { id: 'p2', title: '+1 бонусный балл к проверочному квизу', desc: 'Повышает оценку за текущий тест или самостоятельную работу на 1 балл.', cost: 500, claimed: false },
    { id: 'p3', title: 'Приоритетный выбор темы годового проекта', desc: 'Право выбрать тему исследования или партнера по команде до общей жеребьевки.', cost: 300, claimed: false }
  ]
};

let appState = loadAppState();
let activeTeacherId = 1;
let radarChartObj = null;
let budgetChartObj = null;

function loadAppState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return Object.assign({}, JSON.parse(JSON.stringify(defaultData)), JSON.parse(raw));
  } catch (e) {}
  return JSON.parse(JSON.stringify(defaultData));
}

function saveAppState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (e) {}
}

function calcAvgTeacher(t) {
  return Number(((t.explain + t.discipline + t.freedom) / 3).toFixed(1));
}

// Обновление шапки и баланса XP на любой странице
function syncHeaderBalances() {
  document.querySelectorAll('.js-xp-balance').forEach(el => {
    el.textContent = appState.xp.toLocaleString('ru-RU');
  });
}

// Мобильное меню (как в твоем примере)
function initNavigation() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => menu.classList.add('hidden'));
    });
  }

  // Плавное появление блоков при прокрутке
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

  // FAQ гармошка
  document.querySelectorAll('.faq-btn').forEach(button => {
    button.addEventListener('click', () => {
      const parent = button.closest('.faq-item');
      if (parent) parent.classList.toggle('open');
    });
  });
}

// ==========================================================================
// ЛОГИКА ГЛАВНОЙ СТРАНИЦЫ (index.html) — ОЦЕНИВАНИЕ И АРГУМЕНТАЦИЯ
// ==========================================================================
function filterTeachersList(cat) {
  appState.teacherFilter = cat;
  ['all', 'stem', 'humanities'].forEach(c => {
    const b = document.getElementById(`filter-btn-${c}`);
    if (b) b.classList.toggle('active', c === cat);
  });
  renderTeachersOnIndex();
}

function renderTeachersOnIndex() {
  const grid = document.getElementById('teachers-grid');
  if (!grid) return;

  const list = appState.teachers.filter(t => appState.teacherFilter === 'all' || t.category === appState.teacherFilter);

  grid.innerHTML = list.map(t => {
    const score = calcAvgTeacher(t);
    const statusLabel = score >= 5.0 ? 'Высокий индекс доверия' : 'Требуется методическая поддержка';
    const statusStyle = score >= 5.0
      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
      : 'bg-amber-50 text-amber-800 border-amber-200';

    return `
      <div class="apple-card apple-card-hover p-8 sm:p-10 flex flex-col justify-between space-y-6">
        <div class="space-y-4">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-[#471224] text-[#fef0d5] flex items-center justify-center font-bold text-base shrink-0">
                ${t.initials}
              </div>
              <div>
                <span class="text-xs font-semibold uppercase tracking-wider text-[#471224]/55 block">${t.subject}</span>
                <h3 class="text-xl font-bold text-[#471224] leading-snug">${t.name}</h3>
              </div>
            </div>
            <span class="px-3.5 py-1.5 rounded-full bg-[#fef0d5] text-[#471224] font-bold text-sm shrink-0">
              ${score.toFixed(1)}
            </span>
          </div>

          <div class="flex items-center justify-between">
            <span class="px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle}">${statusLabel}</span>
            <span class="text-xs text-[#471224]/55 font-medium">${t.reviews} оценок</span>
          </div>

          <p class="text-sm text-[#471224]/70">Тема недели: ${t.topic}</p>

          <div class="space-y-3 pt-2">
            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span>Понятность объяснения</span>
                <span>${t.explain.toFixed(1)} / 10</span>
              </div>
              <div class="w-full h-1.5 bg-[#fef0d5] rounded-full overflow-hidden">
                <div class="h-full bg-[#471224] rounded-full" style="width: ${t.explain * 10}%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span>Справедливость и порядок</span>
                <span>${t.discipline.toFixed(1)} / 10</span>
              </div>
              <div class="w-full h-1.5 bg-[#fef0d5] rounded-full overflow-hidden">
                <div class="h-full bg-[#471224] rounded-full" style="width: ${t.discipline * 10}%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span>Открытость к идеям и диалог</span>
                <span>${t.freedom.toFixed(1)} / 10</span>
              </div>
              <div class="w-full h-1.5 bg-[#fef0d5] rounded-full overflow-hidden">
                <div class="h-full bg-[#471224] rounded-full" style="width: ${t.freedom * 10}%"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-5 border-t border-[#471224]/10 flex items-center justify-between">
          <span class="text-xs font-medium text-[#471224]/60">Награда: +50 XP</span>
          ${t.rated
            ? `<span class="px-5 py-2.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">Отзыв учтен</span>`
            : `<button onclick="openRateModal(${t.id})" class="px-6 py-3 rounded-full bg-[#471224] text-white text-xs font-semibold hover:opacity-90 transition shadow-md">
                 Оценить занятие
               </button>`
          }
        </div>
      </div>
    `;
  }).join('');
}

const stopWords = ['скучно', 'тупой', 'ужас', 'ничего не понял', 'ненавижу', 'отстой', 'бесит', 'дурак', 'нудно'];

function openRateModal(id) {
  activeTeacherId = id;
  const t = appState.teachers.find(item => item.id === id);
  if (!t) return;

  document.getElementById('modal-t-subject').textContent = t.subject;
  document.getElementById('modal-t-name').textContent = t.name;
  document.getElementById('inp-explain').value = 9;
  document.getElementById('inp-discipline').value = 9;
  document.getElementById('inp-freedom').value = 9;
  document.getElementById('inp-argument').value = '';
  document.getElementById('ai-warning-box').classList.add('hidden');

  updateModalCalculation();
  const modal = document.getElementById('rate-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeRateModal() {
  const modal = document.getElementById('rate-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function setPresetScore(e, d, f) {
  document.getElementById('inp-explain').value = e;
  document.getElementById('inp-discipline').value = d;
  document.getElementById('inp-freedom').value = f;
  updateModalCalculation();
}

function updateModalCalculation() {
  const e = Number(document.getElementById('inp-explain').value);
  const d = Number(document.getElementById('inp-discipline').value);
  const f = Number(document.getElementById('inp-freedom').value);

  document.getElementById('lbl-explain').textContent = `${e} / 10`;
  document.getElementById('lbl-discipline').textContent = `${d} / 10`;
  document.getElementById('lbl-freedom').textContent = `${f} / 10`;

  const avg = Number(((e + d + f) / 3).toFixed(1));
  const comment = document.getElementById('inp-argument').value.trim();
  const isToxic = stopWords.some(w => comment.toLowerCase().includes(w));

  const statusBox = document.getElementById('modal-score-banner');
  const submitBtn = document.getElementById('btn-submit-rate');
  const warningBox = document.getElementById('ai-warning-box');

  if (isToxic) {
    warningBox.classList.remove('hidden');
  } else {
    warningBox.classList.add('hidden');
  }

  if (avg >= 5.0) {
    statusBox.className = 'p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 flex justify-between items-center';
    statusBox.innerHTML = `<span>Итоговый индекс занятия: <strong>${avg.toFixed(1)} / 10</strong></span><span>Высокая оценка (комментарий по желанию)</span>`;
  } else {
    statusBox.className = 'p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900 flex justify-between items-center';
    statusBox.innerHTML = `<span>Итоговый индекс: <strong>${avg.toFixed(1)} / 10</strong></span><span>Требуется конструктивный аргумент (мин. 25 симв.)</span>`;
  }

  if (isToxic) {
    submitBtn.disabled = true;
    submitBtn.className = 'px-8 py-4 rounded-full bg-[#471224]/30 text-white text-sm font-semibold cursor-not-allowed';
    submitBtn.textContent = 'Скорректируйте формулировку с помощью ИИ';
  } else if (avg < 5.0 && comment.length < 25) {
    submitBtn.disabled = true;
    submitBtn.className = 'px-8 py-4 rounded-full bg-[#471224]/30 text-white text-sm font-semibold cursor-not-allowed';
    submitBtn.textContent = `Добавьте аргументацию (${comment.length}/25 симв.)`;
  } else {
    submitBtn.disabled = false;
    submitBtn.className = 'px-8 py-4 rounded-full bg-[#471224] text-white text-sm font-semibold hover:opacity-95 transition shadow-lg cursor-pointer';
    submitBtn.textContent = 'Отправить оценку (+50 XP)';
  }
}

function testHarshPhrase() {
  const area = document.getElementById('inp-argument');
  area.value = 'Было ужасно скучно, ничего не понял на уроке!';
  updateModalCalculation();
}

function applyAiConstructiveText() {
  const area = document.getElementById('inp-argument');
  area.value = 'Во второй половине занятия темп разбора формул показался довольно быстрым. Хотелось бы разобрать на доске ещё два практических примера перед контрольной работой.';
  updateModalCalculation();
  showNotification('ИИ-помощник перевел замечание в конструктивный аргумент');
}

function submitEvaluationForm() {
  const t = appState.teachers.find(item => item.id === activeTeacherId);
  if (!t) return;

  const e = Number(document.getElementById('inp-explain').value);
  const d = Number(document.getElementById('inp-discipline').value);
  const f = Number(document.getElementById('inp-freedom').value);

  t.explain = Number(((t.explain * 4 + e) / 5).toFixed(1));
  t.discipline = Number(((t.discipline * 4 + d) / 5).toFixed(1));
  t.freedom = Number(((t.freedom * 4 + f) / 5).toFixed(1));
  t.reviews += 1;
  t.rated = true;
  appState.xp += 50;

  saveAppState();
  closeRateModal();
  syncHeaderBalances();
  renderTeachersOnIndex();
  showNotification('Благодарим за объективную обратную связь (+50 XP)');
}

// ==========================================================================
// ЛОГИКА СТРАНИЦЫ АНАЛИТИКИ И QR-ПУЛЬСА (analytics.html)
// ==========================================================================
function initAnalyticsPage() {
  const qrCanvas = document.getElementById('qr-code-canvas');
  if (qrCanvas && window.QRious) {
    const voteUrl = window.location.href.split('?')[0] + '?mode=pulse';
    const urlInput = document.getElementById('qr-url-input');
    if (urlInput) urlInput.value = voteUrl;
    new QRious({
      element: qrCanvas,
      value: voteUrl,
      size: 190,
      background: '#ffffff',
      foreground: '#471224',
      level: 'M'
    });
  }

  renderPulseBars();
  renderInitiativesList();
  renderSkillBoxes();
  renderPrivilegesOnAnalytics();

  // Инициализация Радара Навыков Chart.js
  const radarEl = document.getElementById('radarChartCanvas');
  if (radarEl && window.Chart) {
    radarChartObj = new Chart(radarEl.getContext('2d'), {
      type: 'radar',
      data: {
        labels: appState.skillLabels,
        datasets: [{
          label: 'Айдар Басиров',
          data: appState.skills,
          backgroundColor: 'rgba(71, 18, 36, 0.14)',
          borderColor: '#471224',
          pointBackgroundColor: '#471224',
          pointBorderColor: '#ffffff',
          borderWidth: 2.5,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          r: {
            min: 50,
            max: 100,
            ticks: { stepSize: 10, display: false },
            grid: { color: 'rgba(71, 18, 36, 0.1)' },
            angleLines: { color: 'rgba(71, 18, 36, 0.1)' },
            pointLabels: {
              color: '#471224',
              font: { family: 'Inter', size: 11, weight: '600' }
            }
          }
        },
        plugins: { legend: { display: false } }
      }
    });
  }

  // График распределения бюджета инициатив
  const budgetEl = document.getElementById('budgetChartCanvas');
  if (budgetEl && window.Chart) {
    budgetChartObj = new Chart(budgetEl.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Коворкинг 2 этаж', 'Предзаказ ланчей', '3D-лаборатория', 'Локеры для книг'],
        datasets: [{
          label: 'Поддержка голосами (+)',
          data: appState.initiatives.map(i => i.votes),
          backgroundColor: '#471224',
          borderRadius: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, max: 120, ticks: { color: '#471224' } },
          x: { ticks: { color: '#471224' } }
        }
      }
    });
  }
}

function updateCustomQr(val) {
  const qrCanvas = document.getElementById('qr-code-canvas');
  if (qrCanvas && window.QRious && val.trim()) {
    new QRious({
      element: qrCanvas,
      value: val.trim(),
      size: 190,
      background: '#ffffff',
      foreground: '#471224',
      level: 'M'
    });
  }
}

function castLivePulse(type) {
  appState.pulseVotes[type] += 1;
  appState.xp += 25;
  saveAppState();
  syncHeaderBalances();
  renderPulseBars();
  showNotification('Ваш голос мгновенно учтен в статистике урока (+25 XP)');
}

function simulateClassroomWave() {
  let step = 0;
  const interval = setInterval(() => {
    step++;
    const r = Math.random();
    if (r < 0.72) appState.pulseVotes.clear++;
    else if (r < 0.92) appState.pulseVotes.practice++;
    else appState.pulseVotes.hard++;
    renderPulseBars();
    if (step >= 15) {
      clearInterval(interval);
      saveAppState();
      showNotification('Синхронизированы ответы 15 учеников класса');
    }
  }, 140);
}

function renderPulseBars() {
  const totalEl = document.getElementById('pulse-total');
  if (!totalEl) return;

  const total = appState.pulseVotes.clear + appState.pulseVotes.practice + appState.pulseVotes.hard;
  const pClear = Math.round((appState.pulseVotes.clear / total) * 100);
  const pPrac = Math.round((appState.pulseVotes.practice / total) * 100);
  const pHard = Math.max(0, 100 - pClear - pPrac);

  totalEl.textContent = total;
  document.getElementById('pct-clear').textContent = `${pClear}% (${appState.pulseVotes.clear})`;
  document.getElementById('pct-practice').textContent = `${pPrac}% (${appState.pulseVotes.practice})`;
  document.getElementById('pct-hard').textContent = `${pHard}% (${appState.pulseVotes.hard})`;

  document.getElementById('bar-clear').style.width = `${pClear}%`;
  document.getElementById('bar-practice').style.width = `${pPrac}%`;
  document.getElementById('bar-hard').style.width = `${pHard}%`;

  const qContainer = document.getElementById('live-questions-box');
  if (qContainer) {
    qContainer.innerHTML = appState.questions.map(q => `
      <div class="p-4 rounded-2xl bg-[#fef0d5]/55 flex items-center justify-between gap-3 text-xs">
        <div>
          <span class="font-semibold text-[#471224] block">${q.text}</span>
          <span class="text-[#471224]/55">${q.time}</span>
        </div>
        <button onclick="upvoteLiveQuestion(${q.id})" class="px-3 py-1.5 rounded-full bg-white text-[#471224] font-bold shrink-0">
          + ${q.likes}
        </button>
      </div>
    `).join('');
  }
}

function sendClassroomQuestion() {
  const input = document.getElementById('phone-question-input');
  if (!input || !input.value.trim()) return;
  appState.questions.unshift({
    id: Date.now(),
    text: input.value.trim(),
    time: 'Только что',
    likes: 1
  });
  input.value = '';
  saveAppState();
  renderPulseBars();
  showNotification('Вопрос выведен на экран преподавателя');
}

function upvoteLiveQuestion(id) {
  const q = appState.questions.find(i => i.id === id);
  if (q) {
    q.likes += 1;
    saveAppState();
    renderPulseBars();
  }
}

// Голосование за школьные инициативы (Только +)
function renderInitiativesList() {
  const box = document.getElementById('initiatives-grid');
  if (!box) return;

  const sorted = [...appState.initiatives].sort((a, b) => b.votes - a.votes);
  box.innerHTML = sorted.map((item, idx) => {
    const pct = Math.min(100, Math.round((item.votes / item.target) * 100));
    return `
      <div class="apple-card p-8 flex flex-col justify-between space-y-5">
        <div class="space-y-3">
          <div class="flex items-center justify-between text-xs font-semibold">
            <span class="px-3 py-1 rounded-full bg-[#fef0d5] text-[#471224]">#${idx + 1} • ${item.category}</span>
            <span class="text-[#471224]/60">Оценка бюджета: ${item.budget}</span>
          </div>
          <h3 class="text-lg font-bold text-[#471224] leading-snug">${item.title}</h3>
          <p class="text-xs text-[#471224]/60">Автор предложения: ${item.author}</p>
        </div>

        <div class="space-y-3 pt-3 border-t border-[#471224]/10">
          <div>
            <div class="flex justify-between text-xs font-semibold mb-1.5">
              <span>Поддержка учеников и учителей</span>
              <span>${item.votes} / ${item.target} голосов (+)</span>
            </div>
            <div class="w-full h-2 bg-[#fef0d5] rounded-full overflow-hidden">
              <div class="h-full bg-[#471224] rounded-full transition-all duration-300" style="width: ${pct}%"></div>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs text-[#471224]/60">Формат: только положительные голоса</span>
            <button onclick="upvoteInitiative('${item.id}')" class="px-5 py-2.5 rounded-full bg-[#471224] text-white text-xs font-semibold hover:opacity-90 transition">
              Поддержать (+1)
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (budgetChartObj) {
    budgetChartObj.data.datasets[0].data = appState.initiatives.map(i => i.votes);
    budgetChartObj.update();
  }
}

function upvoteInitiative(id) {
  const target = appState.initiatives.find(i => i.id === id);
  if (!target) return;
  target.votes += 1;
  appState.xp += 15;
  saveAppState();
  syncHeaderBalances();
  renderInitiativesList();
  showNotification(`Вы поддержали инициативу (+15 XP)`);
}

function renderSkillBoxes() {
  const el = document.getElementById('skills-boxes-grid');
  if (!el) return;
  el.innerHTML = appState.skillLabels.map((lbl, idx) => `
    <div class="p-4 rounded-2xl bg-[#fef0d5]/55 text-center">
      <div class="text-xs font-medium text-[#471224]/65 truncate">${lbl}</div>
      <div class="text-xl font-bold text-[#471224] mt-1">${appState.skills[idx]}</div>
    </div>
  `).join('');
}

function boostSkillScore() {
  const i = Math.floor(Math.random() * appState.skills.length);
  appState.skills[i] = Math.min(100, appState.skills[i] + 2);
  appState.xp += 20;
  saveAppState();
  syncHeaderBalances();
  renderSkillBoxes();
  if (radarChartObj) {
    radarChartObj.data.datasets[0].data = appState.skills;
    radarChartObj.update();
  }
  showNotification(`Компетенция «${appState.skillLabels[i]}» повышена (+20 XP)`);
}

function renderPrivilegesOnAnalytics() {
  const box = document.getElementById('privileges-cards');
  if (!box) return;
  box.innerHTML = appState.privileges.map(p => `
    <div class="apple-card p-8 flex flex-col justify-between space-y-5">
      <div>
        <span class="text-xs font-semibold uppercase tracking-wider text-[#471224]/55">Бонус за активность</span>
        <h4 class="text-xl font-bold text-[#471224] mt-1 mb-2">${p.title}</h4>
        <p class="text-sm text-[#471224]/70 leading-relaxed">${p.desc}</p>
      </div>
      <div class="pt-4 border-t border-[#471224]/10 flex items-center justify-between">
        <span class="font-bold text-base text-[#471224]">${p.cost} XP</span>
        ${p.claimed
          ? `<span class="px-4 py-2 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">Активировано</span>`
          : `<button onclick="redeemPrivilege('${p.id}')" class="px-5 py-2.5 rounded-full bg-[#471224] text-white text-xs font-semibold hover:opacity-90 transition">
               Обменять баллы
             </button>`
        }
      </div>
    </div>
  `).join('');
}

function redeemPrivilege(id) {
  const item = appState.privileges.find(p => p.id === id);
  if (!item || item.claimed) return;
  if (appState.xp < item.cost) {
    showNotification('Недостаточно баллов XP для обмена');
    return;
  }
  appState.xp -= item.cost;
  item.claimed = true;
  saveAppState();
  syncHeaderBalances();
  renderPrivilegesOnAnalytics();
  showNotification(`Привилегия «${item.title}» активирована в вашем профиле`);
}

function showNotification(text) {
  let root = document.getElementById('toast-container');
  if (!root) {
    root = document.createElement('div');
    root.id = 'toast-container';
    root.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(root);
  }
  const item = document.createElement('div');
  item.className = 'px-6 py-4 rounded-2xl bg-[#471224] text-[#fef0d5] text-xs sm:text-sm font-semibold shadow-xl transition-all duration-300';
  item.textContent = text;
  root.appendChild(item);
  setTimeout(() => {
    item.style.opacity = '0';
    setTimeout(() => item.remove(), 300);
  }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  syncHeaderBalances();
  initNavigation();
  renderTeachersOnIndex();
  initAnalyticsPage();
});