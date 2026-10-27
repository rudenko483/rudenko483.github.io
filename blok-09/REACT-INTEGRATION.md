# Фон первого экрана: подключение

Действующий БЛОК 09 — статические HTML/CSS/JavaScript. В нём нет React, Tailwind, TypeScript или `components.json`. Визуальный эффект подключён в `dist/index.html` через декоративный слой `.hero-background`; формула градиента взята из присланного компонента. Слой не перехватывает клики и плавно переходит в чёрный фон следующего блока.

Исходный React-компонент сохранён отдельно и **не исполняется в статической версии**:

```text
components/ui/tailwind-css-background-snippet.tsx
lib/utils.ts
demo.tsx
```

Стили действующего сайта: `dist/tokens.css`, `dist/style.css`. На GitHub Pages это `blok-09/tokens.css` и `blok-09/style.css`.

## Отдельный React-проект

Для React-версии можно создать Vite-проект через официальный CLI:

```bash
npx shadcn@latest init -t vite
```

Выбрать TypeScript. Если React-проект уже существует, добавить недостающие зависимости:

```bash
npm install tailwindcss @tailwindcss/vite clsx tailwind-merge
npm install -D typescript @types/react @types/react-dom @types/node
```

В `src/index.css` подключить Tailwind:

```css
@import "tailwindcss";
@source "../components";
```

В `vite.config.ts` включить `react()` и `tailwindcss()` из `@vitejs/plugin-react` и `@tailwindcss/vite`. Для сохранённой структуры, где `components/` находится в корне, настроить `@` на корень:

```ts
import { fileURLToPath, URL } from "node:url";
// внутри defineConfig:
resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } }
```

В `tsconfig.json` и `tsconfig.app.json`, внутри `compilerOptions`:

```json
{ "baseUrl": ".", "paths": { "@/*": ["./*"] } }
```

В существующем Vite-проекте после настройки выполнить `npx shadcn@latest init`. В `components.json` использовать алиасы `components: "@/components"`, `ui: "@/components/ui"`, `utils: "@/lib/utils"`; CSS — `src/index.css`. Папка `components/ui` объединяет переиспользуемые элементы и сохраняет предсказуемые пути импорта для CLI. При стандартном `@ → src` соответствующие папки должны находиться в `src/`.

Скопировать сохранённые файлы и импортировать `HeroDemo` в `src/App.tsx`. Для отрицательного `z-index` фонового компонента нужен изолированный контейнер, например `<main className="relative isolate"><HeroDemo /></main>`.

Инструкции настройки подготовлены по [shadcn/ui для Vite](https://ui.shadcn.com/docs/installation/vite) и [Tailwind CSS для Vite](https://tailwindcss.com/docs/installation/using-vite). Эти команды не запускались над опубликованным статическим сайтом.
