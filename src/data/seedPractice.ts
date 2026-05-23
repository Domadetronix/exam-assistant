import type { PracticeCategory } from '../types';

export const seedPractice: PracticeCategory[] = [
  {
    id: 'blender',
    title: 'Blender (3D)',
    description: 'Горячие клавиши, команды, базовое моделирование, workflow',
    icon: '🧊',
    sections: [
      {
        id: 'hotkeys',
        title: 'Горячие клавиши',
        content: `## Основные горячие клавиши

- **Tab** — переключение Object Mode / Edit Mode
- **G** — перемещение (Grab)
- **R** — поворот (Rotate)
- **S** — масштабирование (Scale)
- **A** — выделить всё
- **Alt+A** — снять выделение
- **Shift+A** — меню добавления объектов
- **X** или **Delete** — удалить
- **Numpad 1/3/7** — вид спереди/справа/сверху
- **Numpad 5** — переключение перспектива/ортогональ
- **Numpad 0** — вид через камеру
- **Z** — переключение режимов отображения

## В Edit Mode

- **1 / 2 / 3** — режим вершин / рёбер / граней
- **E** — выдавливание (Extrude)
- **I** — вставка грани (Inset)
- **Ctrl+B** — фаска (Bevel)
- **Ctrl+R** — петля разреза (Loop Cut)
- **K** — нож (Knife)
- **F** — создать грань из выделенного
- **M** — слияние (Merge)`
      },
      {
        id: 'primitives',
        title: 'Создание примитивов',
        content: `## Создание сферы

1. Shift+A → Mesh → UV Sphere
2. В левом нижнем углу — параметры (сегменты, кольца, радиус)

## Создание цилиндра

1. Shift+A → Mesh → Cylinder
2. Параметры: вершины, радиус, высота

## Создание куба

1. Shift+A → Mesh → Cube
2. Стандартный размер 2×2×2`
      },
      {
        id: 'workflow',
        title: 'Базовое моделирование',
        content: `## Workflow моделирования

1. **Блокинг** — создание грубой формы примитивами
2. **Уточнение** — добавление деталей через Extrude / Inset / Bevel / Loop Cut
3. **Сглаживание** — Subdivision Surface modifier (Ctrl+1, Ctrl+2)
4. **Чистка топологии** — N-gons → quads, проверка нормалей
5. **Развёртка UV** — режим Edit, U → Smart UV / Unwrap
6. **Текстурирование / материалы**

## Создание выемки в объекте

1. Выделить грань → I (Inset) → сузить грань
2. E (Extrude) → ввести отрицательное значение (например -0.2)
3. При необходимости — Bevel рёбер для скруглений`
      }
    ]
  },
  {
    id: 'animate',
    title: 'Adobe Animate',
    description: 'Timeline, keyframes, motion tween, экспорт',
    icon: '🎬',
    sections: [
      {
        id: 'timeline',
        title: 'Timeline и слои',
        content: `## Timeline

- Каждый слой — независимая дорожка
- Кадр (frame) — единица времени
- Кадровая частота задаётся в File → Properties (обычно 24 fps)
- F5 — вставить обычный кадр
- F6 — вставить keyframe
- F7 — вставить пустой keyframe
- Shift+F5 / Shift+F6 — удалить кадр / keyframe`
      },
      {
        id: 'tween',
        title: 'Motion Tween',
        content: `## Создание Motion Tween

1. Выделить объект на сцене
2. Преобразовать в символ: F8 → Movie Clip / Graphic
3. Правый клик по слою → Create Motion Tween
4. Перейти на нужный кадр и переместить/повернуть объект — keyframe создастся автоматически

## Classic Tween (старый способ)

1. Создать keyframe в начале и в конце
2. Правый клик между ними → Create Classic Tween`
      },
      {
        id: 'export',
        title: 'Экспорт',
        content: `## Варианты экспорта

- **File → Export → Export Movie** — MP4, MOV, GIF, последовательность изображений
- **File → Export → Export Animated GIF** — для веба
- **File → Publish Settings** — настройки HTML5 Canvas / SWF / AIR
- **Ctrl+Enter** — быстрый просмотр в среде`
      }
    ]
  },
  {
    id: 'publications',
    title: 'Дизайн публикаций',
    description: 'Сетки, поля, bleed, DPI, подготовка к печати',
    icon: '📰',
    sections: [
      {
        id: 'grids',
        title: 'Сетки и поля',
        content: `## Модульные сетки

- **Колонки** — обычно 6, 8, 12
- **Gutter** — расстояние между колонками (4–8 мм для печати)
- **Margin (поля)** — внешние отступы документа

## Стандарты полей

- Книжная вёрстка: внешние поля 15–20 мм, внутренние 18–25 мм
- Журналы: 10–15 мм по всем сторонам
- Корешковое поле всегда больше — учитывает переплёт`
      },
      {
        id: 'print',
        title: 'Подготовка к печати',
        content: `## Bleed (вылеты)

- **Bleed** — область за пределами обреза, обычно **3–5 мм**
- Все элементы у края должны заходить в bleed
- Защитные поля: важные элементы — не ближе **5 мм** от линии реза

## Разрешение (DPI)

- Печать офсет / лазер: **300 dpi**
- Широкоформат (баннеры): 100–150 dpi
- Экран / веб: 72 ppi

## Цветовой профиль

- Печать: **CMYK** (профиль FOGRA39 / ISO Coated)
- Экран: **RGB** (sRGB)

## Экспорт PDF для печати

- **PDF/X-1a** или **PDF/X-4**
- Crop marks (метки реза) + bleed 3 мм
- Все шрифты — embedded или outlined`
      }
    ]
  },
  {
    id: 'mobile',
    title: 'Дизайн мобильных приложений',
    description: 'Safe area, размеры экранов, UX-паттерны, auto layout',
    icon: '📱',
    sections: [
      {
        id: 'sizes',
        title: 'Размеры экранов',
        content: `## iOS (точки / pt)

- iPhone SE: **375 × 667**
- iPhone 13/14/15: **390 × 844**
- iPhone Pro Max: **430 × 932**

## Android (dp)

- Базовый размер: **360 × 800**
- Большие устройства: **412 × 915**

## Плотности

- iOS: @1x / @2x / @3x
- Android: mdpi (1x), hdpi (1.5x), xhdpi (2x), xxhdpi (3x), xxxhdpi (4x)`
      },
      {
        id: 'safearea',
        title: 'Safe Area',
        content: `## Что такое Safe Area

Это безопасная зона экрана, в которую не попадают системные элементы: чёлка, нижняя индикаторная полоска, статус-бар.

## Рекомендации

- Кнопки и важный контент — внутри safe area
- Фон может выходить за границы
- В iOS используем UIScreen safeAreaInsets
- В CSS: \`padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);\``
      },
      {
        id: 'patterns',
        title: 'UX-паттерны',
        content: `## Базовые паттерны

- **Tab bar** — нижняя навигация (3–5 пунктов)
- **Bottom sheet** — выдвижная панель снизу
- **Pull to refresh** — потяните вниз для обновления
- **Swipe to delete** — свайп для действия
- **FAB** (Floating Action Button) — основное действие (Material)
- **Modal / Dialog** — модальные окна для важных действий

## Размеры тач-зон

- Минимум: **44×44 pt** (iOS), **48×48 dp** (Android)
- Расстояние между тач-зонами: ≥ 8 pt`
      }
    ]
  },
  {
    id: 'web',
    title: 'Разработка сайтов',
    description: 'HTML, CSS, JavaScript, структура документа',
    icon: '🌐',
    sections: [
      {
        id: 'html-template',
        title: 'Базовый HTML-шаблон',
        content: `## Создание шаблона в VS Code

В VS Code с Emmet:

- Введите \`html:5\` и нажмите **Tab**
- Или просто \`!\` и **Tab**

## Получится:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>

</body>
</html>
\`\`\`

## Подключение CSS и JS

\`\`\`html
<link rel="stylesheet" href="style.css">
<script src="app.js" defer></script>
\`\`\``
      },
      {
        id: 'html-tags',
        title: 'HTML-теги',
        content: `## Основные теги

| Тег | Назначение |
|---|---|
| \`<div>\` | Блочный контейнер |
| \`<span>\` | Строчный контейнер |
| \`<p>\` | Параграф текста |
| \`<br>\` | Перенос строки |
| \`<hr>\` | Горизонтальная линия |
| \`<img>\` | Изображение |
| \`<a>\` | Ссылка |
| \`<button>\` | Кнопка |
| \`<ul>\` / \`<ol>\` | Маркированный / нумерованный список |
| \`<li>\` | Элемент списка |
| \`<form>\` | Форма |
| \`<input>\` | Поле ввода |

## Примеры

\`\`\`html
<a href="https://example.com" target="_blank">Ссылка</a>
<img src="cat.jpg" alt="Кот" width="200">
<button type="button">Жми</button>
<ul>
  <li>Первый</li>
  <li>Второй</li>
</ul>
<form action="/submit" method="post">
  <input type="text" name="user" placeholder="Имя">
  <button type="submit">Отправить</button>
</form>
\`\`\``
      },
      {
        id: 'css',
        title: 'CSS-справочник',
        content: `## Подключение CSS

\`\`\`html
<!-- Внешний файл -->
<link rel="stylesheet" href="style.css">

<!-- Внутренний -->
<style>
  body { background: #eee; }
</style>

<!-- Инлайн -->
<div style="color: red;">Текст</div>
\`\`\`

## Селекторы

- **Класс**: \`.btn { ... }\` → \`<div class="btn">\`
- **ID**: \`#header { ... }\` → \`<div id="header">\`
- **Тег**: \`p { ... }\`

## Flexbox

\`\`\`css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}
\`\`\`

## Grid

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
\`\`\`

## Position

- \`static\` (по умолчанию)
- \`relative\` — относительно нормального положения
- \`absolute\` — относительно ближайшего позиционированного предка
- \`fixed\` — относительно окна
- \`sticky\` — прилипает при прокрутке

## Margin и Padding

- \`margin\` — внешний отступ
- \`padding\` — внутренний отступ
- Сокращения: \`margin: 10px 20px;\` (верх/низ, лево/право)`
      },
      {
        id: 'js',
        title: 'JavaScript-справочник',
        content: `## querySelector

\`\`\`js
const btn = document.querySelector('.btn');
const all = document.querySelectorAll('li');
\`\`\`

## addEventListener

\`\`\`js
btn.addEventListener('click', (event) => {
  console.log('Кликнули!', event);
});
\`\`\`

## Изменение DOM

\`\`\`js
const el = document.querySelector('#title');
el.textContent = 'Новый текст';
el.classList.add('active');
el.classList.remove('hidden');
el.classList.toggle('open');
el.style.color = 'red';

// Создание элемента
const li = document.createElement('li');
li.textContent = 'Новый пункт';
document.querySelector('ul').appendChild(li);
\`\`\`

## Базовый fetch

\`\`\`js
fetch('https://api.example.com/users')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

// async / await
async function loadUsers() {
  const res = await fetch('/api/users');
  const data = await res.json();
  return data;
}
\`\`\``
      }
    ]
  }
];
