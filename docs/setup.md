# react-ui-lab セットアップ手順書

> **このドキュメントについて**
> Claude Code に「この `setup.md` の通りにセットアップして」と渡せば、上から順に実行してくれる構成にしています。
> 各ステップに「✅ 完了確認」を入れているので、人間側でも進捗を追えます。

---

## プロジェクト概要

- **目的**: ReactのUIコンポーネント集を作り、Storybookでポートフォリオとして公開する
- **技術スタック**: Vite + React + TypeScript + Storybook + Tailwind CSS + SCSS Modules
- **方針**: アクセシビリティ(WCAG 2.1)を意識し、同じコンポーネントをTailwind版/SCSS版の両方で実装する
- **公開先**: GitHub Pages
- **将来計画**: Phase 2 で Next.js + MDX 版に発展させる

---

## 0. 前提環境の確認

### 必要なバージョン

```bash
node -v   # v20.x 以上を推奨(LTS)
npm -v    # v10.x 以上
git --version
```

### Node.js バージョンの固定(任意だが推奨)

プロジェクトルートで使うNode.jsバージョンを固定するため、`.nvmrc` を作成します。

```bash
echo "lts/*" > .nvmrc
```

### ✅ 完了確認
- [ ] Node.js 20以上が入っている
- [ ] npm 10以上が入っている
- [ ] git が使える

---

## 1. Vite + React + TypeScript プロジェクト作成

### プロジェクトを作成

```bash
# 任意の作業ディレクトリで実行
npm create vite@latest react-ui-lab -- --template react-ts
cd react-ui-lab
npm install
```

### 動作確認

```bash
npm run dev
# → http://localhost:5173 が開けばOK
```

確認できたら `Ctrl+C` で停止。

### ✅ 完了確認
- [ ] `react-ui-lab/` ディレクトリが作成された
- [ ] `npm run dev` で初期画面が表示される

---

## 2. Storybook の導入

```bash
npx storybook@latest init
```

途中で「どのフレームワークか」聞かれたら `Vite + React` を選択(自動検出されるはず)。

導入後、自動でStorybookが起動します。`Ctrl+C` で停止。

### 起動確認

```bash
npm run storybook
# → http://localhost:6006 が開けばOK
```

### ✅ 完了確認
- [ ] `.storybook/` ディレクトリが作成された
- [ ] `src/stories/` に初期ストーリーファイルがある
- [ ] `npm run storybook` でStorybookが起動する

---

## 3. Tailwind CSS の導入

### インストール

```bash
npm install -D tailwindcss@latest postcss autoprefixer
npx tailwindcss init -p
```

> **メモ**: Tailwind CSS v4 が出ていますが、Storybookとの相性や情報量を考えると **v3.x** で開始するのが学習面で安全です。
> 慣れてからv4に上げるのを推奨。インストール時にv4が入ったら、以下に置き換えてください:
> ```bash
> npm uninstall tailwindcss
> npm install -D tailwindcss@^3 postcss autoprefixer
> npx tailwindcss init -p
> ```

### `tailwind.config.js` を編集

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./.storybook/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 後でデザイントークンと連動させる
    },
  },
  plugins: [],
}
```

### `src/index.css` の先頭に Tailwind ディレクティブを追加

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Storybook で Tailwind を読み込ませる

`.storybook/preview.ts` (または `preview.tsx`) を編集:

```ts
import type { Preview } from '@storybook/react'
import '../src/index.css' // ← この行を追加

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
```

### ✅ 完了確認
- [ ] `tailwind.config.js` が作成・編集された
- [ ] `src/index.css` にTailwindディレクティブがある
- [ ] Storybookで Tailwind クラスが効く(後で確認)

---

## 4. SCSS Modules のサポート

Vite は標準でSCSSをサポートしますが、`sass` パッケージのインストールが必要です。

```bash
npm install -D sass
```

### グローバルなSCSS変数ファイルを準備

```bash
mkdir -p src/styles
```

`src/styles/_tokens.scss` を作成:

```scss
// ===================================
// Design Tokens (SCSS版)
// ===================================
// ※ tokens.css と同じ値を保つこと

// Colors - Primary
$color-primary-50: #f0f7f3;
$color-primary-500: #4a7c59;
$color-primary-700: #356041;

// Colors - Neutral
$color-neutral-50: #fafafa;
$color-neutral-200: #e5e5e5;
$color-neutral-500: #737373;
$color-neutral-900: #171717;

// Spacing (8pt grid)
$space-1: 0.25rem;  // 4px
$space-2: 0.5rem;   // 8px
$space-3: 0.75rem;  // 12px
$space-4: 1rem;     // 16px
$space-6: 1.5rem;   // 24px
$space-8: 2rem;     // 32px

// Border Radius
$radius-sm: 0.25rem;
$radius-md: 0.5rem;
$radius-lg: 0.75rem;

// Typography
$font-size-sm: 0.875rem;
$font-size-base: 1rem;
$font-size-lg: 1.125rem;
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-bold: 700;
```

### CSS Variables 版も用意(Tailwindと共通利用するため)

`src/styles/tokens.css` を作成:

```css
:root {
  /* Colors - Primary */
  --color-primary-50: #f0f7f3;
  --color-primary-500: #4a7c59;
  --color-primary-700: #356041;

  /* Colors - Neutral */
  --color-neutral-50: #fafafa;
  --color-neutral-200: #e5e5e5;
  --color-neutral-500: #737373;
  --color-neutral-900: #171717;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;

  /* Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
}
```

`src/index.css` の先頭に追記:

```css
@import './styles/tokens.css';

@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Tailwind config からトークンを参照

`tailwind.config.js` を更新:

```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./.storybook/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          500: 'var(--color-primary-500)',
          700: 'var(--color-primary-700)',
        },
        neutral: {
          50: 'var(--color-neutral-50)',
          200: 'var(--color-neutral-200)',
          500: 'var(--color-neutral-500)',
          900: 'var(--color-neutral-900)',
        },
      },
    },
  },
  plugins: [],
}
```

### ✅ 完了確認
- [ ] `sass` がインストールされた
- [ ] `src/styles/_tokens.scss` がある
- [ ] `src/styles/tokens.css` がある
- [ ] Tailwind config から CSS変数を参照している

---

## 5. ESLint / Prettier / a11y プラグイン

### 必要なパッケージのインストール

```bash
npm install -D \
  prettier \
  eslint-config-prettier \
  eslint-plugin-jsx-a11y \
  eslint-plugin-storybook \
  @storybook/addon-a11y
```

### `.prettierrc` を作成

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

### `eslint.config.js` を編集して a11y プラグインを追加

Vite の初期化で生成された `eslint.config.js` に、`jsx-a11y` のルールを追加します。

```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'storybook-static'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
)
```

### Storybook に a11y アドオンを追加

`.storybook/main.ts` の `addons` 配列に追加:

```ts
const config: StorybookConfig = {
  // ... 既存設定 ...
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y', // ← 追加
  ],
  // ...
}
```

### ✅ 完了確認
- [ ] Prettier 設定ファイルがある
- [ ] ESLint で `jsx-a11y` ルールが効いている
- [ ] Storybook に a11y タブが表示される

---

## 6. ディレクトリ構成の整備

```bash
# 不要な初期ファイルを整理
rm -rf src/assets src/App.css

# コンポーネント用ディレクトリを作成
mkdir -p src/components
mkdir -p src/utils
```

### 推奨ディレクトリ構成

```
react-ui-lab/
├── .storybook/                 # Storybook設定
│   ├── main.ts
│   └── preview.ts
├── src/
│   ├── components/             # コンポーネント本体
│   │   └── Button/
│   │       ├── Button.tsx              # Tailwind版
│   │       ├── Button.scss.tsx         # SCSS版(後ほど)
│   │       ├── Button.module.scss      # SCSS版のスタイル
│   │       ├── Button.stories.tsx
│   │       ├── Button.test.tsx (任意)
│   │       └── index.ts
│   ├── styles/
│   │   ├── tokens.css                  # CSS Variables
│   │   └── _tokens.scss                # SCSS変数
│   ├── utils/                  # 共通ユーティリティ
│   ├── index.css
│   └── main.tsx
├── eslint.config.js
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── package.json
├── README.md
├── design.md                   # 設計ドキュメント(Phase 1の途中で作る)
└── CLAUDE.md                   # Claude Code用の指示書
```

### ✅ 完了確認
- [ ] `src/components/` がある
- [ ] `src/styles/` がトークンファイルを持つ

---

## 7. Storybook を GitHub Pages に公開する設定

### GitHub Actions ワークフローを作成

```bash
mkdir -p .github/workflows
```

`.github/workflows/deploy-storybook.yml` を作成:

```yaml
name: Deploy Storybook to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build-storybook
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./storybook-static

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### `package.json` のスクリプトを確認

`build-storybook` スクリプトがあることを確認(Storybook初期化時に自動で追加されているはず):

```json
{
  "scripts": {
    "build-storybook": "storybook build"
  }
}
```

### GitHub Pages の有効化(プッシュ後にWeb UIで設定)

リポジトリプッシュ後、GitHubの設定で:
1. **Settings → Pages**
2. **Source** を `GitHub Actions` に変更

これだけ。ワークフローは初回プッシュ時に動きます。

### ✅ 完了確認
- [ ] `.github/workflows/deploy-storybook.yml` がある
- [ ] `npm run build-storybook` がローカルで成功する

---

## 8. README.md とポートフォリオ向けの整備

### `README.md` を上書き

```markdown
# react-ui-lab

A collection of accessible React UI components built with TypeScript and Storybook.

## 🎯 Goals

- Build reusable, accessible (WCAG 2.1) UI components
- Compare implementation styles: Tailwind CSS vs SCSS Modules
- Document with Storybook for portfolio use

## 🛠 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS + SCSS Modules
- **Documentation**: Storybook
- **Accessibility**: jsx-a11y, @storybook/addon-a11y, Radix UI (selectively)

## 🚀 Getting Started

\`\`\`bash
npm install
npm run dev          # Start Vite dev server
npm run storybook    # Start Storybook (http://localhost:6006)
\`\`\`

## 📖 Documentation

- [Live Storybook](https://<your-github-username>.github.io/react-ui-lab/)
- [Design Document](./design.md)

## 📂 Project Structure

\`\`\`
src/
├── components/      # UI components
├── styles/          # Design tokens (CSS Variables + SCSS)
└── utils/           # Shared utilities
\`\`\`

## 📝 License

MIT
```

### ✅ 完了確認
- [ ] README.md にプロジェクト概要とリンクがある

---

## 9. Claude Code 用の指示書 `CLAUDE.md`

Claude Code がこのプロジェクトを正しく扱えるように、コンテキストファイルを作ります。

`CLAUDE.md` を作成:

```markdown
# Claude Code Context: react-ui-lab

## プロジェクト概要

ReactのUIコンポーネント集をポートフォリオとして公開するプロジェクト。
学習目的とアクセシビリティ(WCAG 2.1)アピールを兼ねる。

## 技術スタック

- React 18 + TypeScript
- Vite (ビルド)
- Storybook (ドキュメント・公開)
- Tailwind CSS + SCSS Modules (両方使う)

## 命名規則・コード規約

### コンポーネント
- PascalCase
- 1コンポーネント1ディレクトリ
- ファイル構成:
  - `Button.tsx` (Tailwind版)
  - `Button.scss.tsx` (SCSS版)
  - `Button.module.scss`
  - `Button.stories.tsx`
  - `index.ts` (re-export)

### CSS class
- SCSS Modules を使う場合は camelCase
- グローバルクラス(あまり使わないが) `rul-` プレフィックス
  - 理由: 将来 npm publish した時の名前衝突対策

### デザイントークン
- すべて `src/styles/tokens.css` (CSS Variables) と `src/styles/_tokens.scss` で定義
- コンポーネント内でハードコードしない
- Tailwind の任意値 `[#xxx]` も避ける

## アクセシビリティ方針

| Level | Components | 実装方針 |
|-------|-----------|---------|
| ★ 易 | Button, Badge, Card | 自前実装、基礎WCAG対応 |
| ★★ 中 | Tabs, Accordion, Tooltip | 自前、キーボード操作・ARIA |
| ★★★ 難 | Modal, Combobox | Radix UIベース |

各コンポーネントのStoryには「a11y対応ポイント」を Description で記述する。

## やらないこと

- 不要なライブラリの追加(用途が明確になるまで)
- グローバルスタイルの汚染
- `any` 型の使用

## 進め方

1. `design.md` の優先度リストの順にコンポーネントを作る
2. 1コンポーネントごとにブランチを切る(例: `feat/button`)
3. Storybook で見た目とa11yを確認後、PRを作る(自分で承認してOK)

## 参照ドキュメント

- `setup.md`: 初期セットアップ手順
- `design.md`: 設計方針・コンポーネント仕様
- `README.md`: プロジェクト概要
```

### ✅ 完了確認
- [ ] `CLAUDE.md` がプロジェクトルートにある

---

## 10. 初回コミット & GitHub プッシュ

### `.gitignore` の確認

Viteの初期化で `.gitignore` が作られているはずですが、以下が含まれているか確認:

```
node_modules
dist
storybook-static
.DS_Store
*.local
.env
```

### コミット

```bash
git add .
git commit -m "chore: initial setup with Vite, React, Storybook, Tailwind, SCSS"
```

### GitHub にリポジトリを作成してプッシュ

```bash
# GitHub CLIがある場合
gh repo create react-ui-lab --public --source=. --push

# ない場合は GitHub Web UI で作成後、
git remote add origin git@github.com:<your-username>/react-ui-lab.git
git branch -M main
git push -u origin main
```

### GitHub Pages の有効化

1. GitHub のリポジトリページ → **Settings** → **Pages**
2. **Source** を `GitHub Actions` に設定
3. 数分待つと GitHub Actions が走り、`https://<username>.github.io/react-ui-lab/` で公開される

### ✅ 完了確認
- [ ] GitHub にプッシュできた
- [ ] Actions タブでワークフローが成功している
- [ ] Pages の URL でStorybookが見える

---

## 🎉 セットアップ完了!

ここまで来たら Phase 1 の土台は完成です。次のステップは:

1. **`design.md` を作る** ... コンポーネント仕様・優先度・命名規則を整理
2. **最初のコンポーネント `Button` を作る** ... テンプレート化を意識
3. **Storyの書き方をパターン化** ... a11y対応ポイントの書式を統一

---

## トラブルシューティング

### Storybook で Tailwind が効かない
→ `.storybook/preview.ts` で `import '../src/index.css'` を忘れていないか確認

### GitHub Pages で 404 になる
→ Vite の `base` 設定が必要な場合がある
`vite.config.ts` で `base: '/react-ui-lab/'` を設定
ただしStorybookビルドは別なので、通常は不要

### ESLint の jsx-a11y がうるさい
→ ルールを段階的に有効化したい場合、`eslint.config.js` で個別に `'warn'` に下げる

---

## 参考リンク

- [Vite Docs](https://vite.dev/)
- [Storybook Docs](https://storybook.js.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [WCAG 2.1 (W3C)](https://www.w3.org/TR/WCAG21/)
- [Inclusive Components](https://inclusive-components.design/) ※a11y参考書
