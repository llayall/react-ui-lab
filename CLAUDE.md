# Claude Code Context: react-ui-lab

## プロジェクト概要

ReactのUIコンポーネント集をポートフォリオとして公開するプロジェクト。
学習目的とアクセシビリティ(WCAG 2.1)アピールを兼ねる。

## 技術スタック

- React 19 + TypeScript
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
