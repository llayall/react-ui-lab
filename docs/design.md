# react-ui-lab Design Document

> **このドキュメントについて**
> プロジェクトの設計方針・命名規則・コンポーネント仕様を定義します。
> Claude Code への指示書としても機能します。新しいコンポーネントを追加するときは、まずこのドキュメントの「コンポーネント仕様」セクションを参照・更新してから実装してください。

---

## 1. プロジェクトのゴール

### 学習目的
- React + TypeScript でのコンポーネント設計力を高める
- Storybook によるドキュメント駆動開発を実践する
- WCAG 2.1 を意識したアクセシブルな実装を体系化する
- Tailwind CSS と SCSS Modules の両方を実務レベルで扱えるようになる

### ポートフォリオ目的
- B2B SaaS / プロダクトデザイナー / デザインエンジニア職への応募で見せられる成果物
- 「設計と実装を両方できる」希少性を可視化する
- アクセシビリティへの理解を実装で示す

### 成功の基準
- Storybook が GitHub Pages で公開されている
- 8 個以上のコンポーネントが Tailwind 版・SCSS 版の両方で実装されている
- 各コンポーネントの a11y チェックが Storybook 上で確認できる
- README から1分以内にプロジェクトの価値が伝わる

---

## 2. 設計原則

### 2.1 デザイントークン駆動
- 色・余白・タイポはすべて `src/styles/tokens.css` (CSS Variables) と `src/styles/_tokens.scss` で定義する
- コンポーネント内でハードコード(`#4a7c59` など)しない
- Tailwind の任意値構文(`text-[#xxx]`, `p-[13px]` など)も避ける
- トークン追加時は両ファイルを同時に更新する

### 2.2 アクセシビリティ・ファースト
- セマンティック HTML を最優先(`<button>` を `<div onClick>` で代替しない)
- ARIA 属性はセマンティック HTML で表現できないときの最終手段
- すべてのインタラクティブ要素はキーボードのみで操作可能にする
- フォーカスリングを消さない、または同等の視覚的代替を必ず用意する
- カラーコントラスト比は WCAG 2.1 AA(4.5:1)以上を目標、Storybook の a11y アドオンで都度確認

### 2.3 同一コンポーネントの 2 実装
- 各コンポーネントは Tailwind 版と SCSS Modules 版の両方を作る
- ロジック(状態管理・キーボード操作・ARIA)は共通化できるなら `useXxx` フック等に切り出す
- 命名規約:
  - Tailwind 版: `Button.tsx`
  - SCSS 版: `Button.scss.tsx`
  - スタイル: `Button.module.scss`

### 2.4 Storybook ファースト
- すべてのコンポーネントには Story を書く
- Story は最低でも以下のバリエーションを用意:
  - Default
  - すべての Variant(props によるバリエーション)
  - すべての State(hover, focus, disabled, error など、再現可能なもの)
  - エッジケース(長文、空、極端なサイズなど)
- Story ごとに「a11y 対応ポイント」を Description に書く

### 2.5 過剰設計を避ける
- props は最初は最小限。「いつか使うかも」を実装しない
- ライブラリは追加するごとに `design.md` の「依存ライブラリ」セクションに理由を記載する
- 1 ファイル 200 行を超えたら設計を見直すサイン

---

## 3. ディレクトリ・ファイル命名規則

### 3.1 ディレクトリ構成

```
src/
├── components/
│   └── Button/
│       ├── Button.tsx              # Tailwind 版
│       ├── Button.scss.tsx         # SCSS 版
│       ├── Button.module.scss      # SCSS スタイル
│       ├── Button.stories.tsx      # Storybook
│       ├── useButton.ts            # ロジック共通化(必要時のみ)
│       └── index.ts                # re-export
├── styles/
│   ├── tokens.css                  # CSS Variables
│   ├── _tokens.scss                # SCSS 変数
│   └── _mixins.scss                # SCSS mixin(必要時)
├── utils/
│   └── cn.ts                       # className 結合ユーティリティ
└── types/
    └── common.ts                   # 共通型定義(必要時)
```

### 3.2 命名規約

| 対象 | 規約 | 例 |
|------|------|-----|
| コンポーネント | PascalCase | `Button`, `TextField` |
| ファイル(コンポーネント) | PascalCase.tsx | `Button.tsx` |
| ファイル(その他) | camelCase または kebab-case | `useButton.ts`, `cn.ts` |
| 関数・変数 | camelCase | `handleClick`, `isOpen` |
| 型・interface | PascalCase | `ButtonProps`, `Variant` |
| CSS Variable | kebab-case + プレフィックス | `--color-primary-500` |
| SCSS 変数 | $kebab-case | `$color-primary-500` |
| SCSS Module の class | camelCase | `.buttonPrimary` |
| グローバル class(避ける) | rul- プレフィックス | `.rul-visually-hidden` |

### 3.3 props 命名

- boolean: `is`, `has`, `should` で始める(`isDisabled`, `hasIcon`)
- イベントハンドラ: `on` + 動詞(`onClick`, `onValueChange`)
- 「外側から制御」と「内側で制御」を区別する場合は controlled/uncontrolled パターンに従う(`value` / `defaultValue`)

---

## 4. デザイントークン

### 4.1 トークン体系

| カテゴリ | プレフィックス | 例 |
|---------|--------------|-----|
| カラー | `--color-` | `--color-primary-500` |
| 余白 | `--space-` | `--space-4` |
| 角丸 | `--radius-` | `--radius-md` |
| フォントサイズ | `--font-size-` | `--font-size-base` |
| フォント太さ | `--font-weight-` | `--font-weight-medium` |
| 行間 | `--line-height-` | `--line-height-normal` |
| 影 | `--shadow-` | `--shadow-md` |
| 遷移 | `--transition-` | `--transition-base` |
| z-index | `--z-` | `--z-modal` |

### 4.2 カラースケール

各カラーは 50 / 100 / 200 / 300 / 400 / 500 / 600 / 700 / 800 / 900 の 10 段階で定義する(必要なものから順次追加)。
500 を「基準色」とする。

- **Primary**: ブランドカラー(現状: 緑系 `#4a7c59`)
- **Neutral**: グレースケール
- **Semantic**: `success` / `warning` / `error` / `info`(後で追加)

### 4.3 余白(8pt grid)

```
--space-0:  0
--space-1:  0.25rem  (4px)
--space-2:  0.5rem   (8px)
--space-3:  0.75rem  (12px)
--space-4:  1rem     (16px)
--space-5:  1.25rem  (20px)
--space-6:  1.5rem   (24px)
--space-8:  2rem     (32px)
--space-10: 2.5rem   (40px)
--space-12: 3rem     (48px)
--space-16: 4rem     (64px)
```

### 4.4 タイポグラフィ

```
--font-size-xs:   0.75rem    (12px)
--font-size-sm:   0.875rem   (14px)
--font-size-base: 1rem       (16px)  ← 本文
--font-size-lg:   1.125rem   (18px)
--font-size-xl:   1.25rem    (20px)
--font-size-2xl:  1.5rem     (24px)
--font-size-3xl:  1.875rem   (30px)
```

### 4.5 ブレークポイント(参考、Tailwind 標準準拠)

```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
```

---

## 5. アクセシビリティ方針

### 5.1 難易度別の実装方針

| Level | コンポーネント | 実装方針 | キーポイント |
|-------|--------------|---------|------------|
| ★ 易 | Button, Badge, Card | 自前実装 | セマンティックHTML、フォーカスリング |
| ★ 易 | Input/TextField, Checkbox, Radio | 自前実装 | label との関連付け、エラー伝達 |
| ★★ 中 | Tabs, Accordion | 自前実装 | 矢印キー操作、`aria-expanded`, `aria-controls` |
| ★★ 中 | Tooltip | 自前実装 | hover/focus 両対応、`aria-describedby` |
| ★★★ 難 | Modal/Dialog | Radix UI ベース | フォーカストラップ、`aria-modal`、ESC で閉じる |
| ★★★ 難 | Combobox, DatePicker(任意) | Radix UI ベース | スクリーンリーダー対応の難易度が高い |

### 5.2 すべてのコンポーネントに共通する a11y チェック

- [ ] キーボードのみで操作できる
- [ ] フォーカス状態が視覚的にわかる
- [ ] スクリーンリーダーで意図が伝わる(VoiceOver で確認)
- [ ] カラーコントラスト比が AA 以上
- [ ] 動きを抑えたい人向けに `prefers-reduced-motion` を尊重(アニメーションがある場合)
- [ ] Storybook の a11y アドオンで violations が出ない

### 5.3 Story での a11y 対応ポイント記述ルール

各コンポーネントの Story には、以下の形式で a11y 対応ポイントを書く:

```markdown
## Accessibility

- **Keyboard**: Space / Enter で発火、Tab でフォーカス移動
- **Screen Reader**: `<button>` 要素を使用、`aria-label` で代替テキスト提供可
- **Focus**: ブラウザデフォルトのフォーカスリングを保持、カスタム時は同等の視認性を確保
- **WCAG**: 1.4.3 Contrast (AA), 2.1.1 Keyboard, 2.4.7 Focus Visible
```

---

## 6. コンポーネント優先度リスト(Phase 1)

### 実装順序

優先度は「学習効果 × ポートフォリオ価値 × 実装難易度」のバランスで決定。

| # | Component | Difficulty | 学習ポイント | 必須props |
|---|-----------|-----------|------------|----------|
| 1 | **Button** | ★ | コンポーネント設計の型作り | `variant`, `size`, `isDisabled`, `onClick` |
| 2 | **Badge** | ★ | バリエーションのみのシンプル系 | `variant`, `children` |
| 3 | **Card** | ★ | 構造的コンポーネント、children パターン | `children`, `as`(任意) |
| 4 | **TextField** | ★ | フォーム要素の基本、ラベル関連付け | `label`, `value`, `onChange`, `error` |
| 5 | **Checkbox** | ★ | controlled/uncontrolled の理解 | `checked`, `onChange`, `label` |
| 6 | **Tabs** | ★★ | キーボード操作、複数の関連要素 | `tabs`, `defaultIndex`, `onChange` |
| 7 | **Accordion** | ★★ | disclosure パターン | `items`, `allowMultiple` |
| 8 | **Modal/Dialog** | ★★★ | Radix UI 統合、フォーカストラップ | `isOpen`, `onClose`, `title` |

### 任意拡張(時間があれば)

- Tooltip / Toast / Avatar / Select / Skeleton / Breadcrumb

---

## 7. コンポーネント仕様(詳細)

### 7.1 Button

#### Variants
- `primary` (デフォルト) — 主要アクション
- `secondary` — 副次アクション
- `ghost` — 控えめなアクション(背景透過)
- `danger` — 破壊的アクション

#### Sizes
- `sm` (32px height)
- `md` (40px height、デフォルト)
- `lg` (48px height)

#### Props

```ts
interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isDisabled?: boolean
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children: React.ReactNode
}
```

#### a11y 要件
- ネイティブ `<button>` 要素を使う
- `isDisabled` のとき `disabled` 属性 + `aria-disabled` を付ける
- `isLoading` のとき `aria-busy="true"` を付け、ローディング表示を伴う
- アイコンのみのボタンは必ず `aria-label` を要求(または `children` にテキスト)

#### Stories
- Default, All Variants, All Sizes, With Icons, Loading, Disabled, Long Text

---

### 7.2 Badge

#### Variants
- `neutral`, `primary`, `success`, `warning`, `error`

#### Props

```ts
interface BadgeProps {
  variant?: 'neutral' | 'primary' | 'success' | 'warning' | 'error'
  children: React.ReactNode
}
```

#### a11y 要件
- 装飾用の場合は `<span>` で OK
- ステータスを示す場合は `role="status"` も検討(リアルタイム更新する場合)

---

### 7.3 Card

#### Props

```ts
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'article' | 'section'
  children: React.ReactNode
}
```

サブコンポーネントとして `Card.Header`, `Card.Body`, `Card.Footer` を提供(compound component パターン)。

#### a11y 要件
- カード全体がリンクの場合は内部に `<a>` を置き、カード自体はクリック可能にしない(誤タップ防止 + スクリーンリーダー)

---

### 7.4 TextField

#### Props

```ts
interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string                  // 必須(視覚的に隠す場合は visuallyHidden)
  helperText?: string
  errorMessage?: string
  isRequired?: boolean
  isDisabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}
```

#### a11y 要件
- `<label htmlFor>` で必ず input と関連付ける
- `errorMessage` があるとき `aria-invalid="true"` + `aria-describedby` でエラーメッセージを参照
- `helperText` も `aria-describedby` でリンク
- `isRequired` のとき `aria-required="true"`(ネイティブ `required` も併用)

---

### 7.5 Checkbox

#### Props

```ts
interface CheckboxProps {
  label: string
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  isDisabled?: boolean
  isIndeterminate?: boolean       // 中間状態
}
```

#### a11y 要件
- ネイティブ `<input type="checkbox">` を使う
- カスタム見た目にする場合も、視覚的に隠す形でネイティブ要素を残す
- `isIndeterminate` は ref 経由で `el.indeterminate = true` を設定、`aria-checked="mixed"` も付ける

---

### 7.6 Tabs

#### Props

```ts
interface TabsProps {
  tabs: { label: string; content: React.ReactNode }[]
  defaultIndex?: number
  onChange?: (index: number) => void
}
```

#### a11y 要件(WAI-ARIA Tabs パターン準拠)
- タブリスト: `role="tablist"`
- 各タブ: `role="tab"`, `aria-selected`, `aria-controls`
- パネル: `role="tabpanel"`, `aria-labelledby`
- キーボード:
  - `←` / `→` で前後のタブへフォーカス移動
  - `Home` / `End` で先頭・末尾へ
  - フォーカスとアクティベーションは「automatic」(フォーカス即選択)で実装

---

### 7.7 Accordion

#### Props

```ts
interface AccordionProps {
  items: { id: string; title: string; content: React.ReactNode }[]
  allowMultiple?: boolean
  defaultOpenIds?: string[]
}
```

#### a11y 要件
- 各見出しは `<button>` でラップ(`aria-expanded`, `aria-controls` 必須)
- パネルは `role="region"`, `aria-labelledby`
- `<h3>` などの見出しレベルは外から指定できるようにする(構造的に正しい階層を保つため)

---

### 7.8 Modal/Dialog

#### 実装方針
Radix UI の `@radix-ui/react-dialog` をベースに、見た目だけ自前で作る。

#### Props

```ts
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string                  // SR向け、視覚的に表示するかは別propで制御
  showTitle?: boolean
  description?: string
  children: React.ReactNode
}
```

#### a11y 要件(Radix が自動で対応する範囲を含む)
- フォーカストラップ
- `aria-modal="true"`, `role="dialog"`
- `aria-labelledby` (title), `aria-describedby` (description)
- ESC キーで閉じる
- 開いた時の初期フォーカス位置を制御(通常: 最初のフォーカス可能要素 or 閉じるボタン)
- 閉じた時にトリガー要素へフォーカスを戻す
- 背景のスクロール抑制

---

## 8. 依存ライブラリ

追加するライブラリは必ずここに「使う理由」を記録する。

### 確定ライン

| Library | Version | 用途 | 理由 |
|---------|---------|------|------|
| react | ^18 | フレームワーク | - |
| typescript | ^5 | 型 | - |
| vite | ^5 | ビルドツール | 高速、設定が少ない |
| @storybook/react-vite | ^8 | ドキュメント | デファクト |
| tailwindcss | ^3 | スタイリング(片方) | 学習効率と情報量 |
| sass | latest | SCSS Modules | 既存スキルと地続き |

### Phase 1 中に追加予定

| Library | 用途 | 理由 |
|---------|------|------|
| clsx または class-variance-authority | className 結合 | バリアント管理を型安全に |
| @radix-ui/react-dialog | Modal | a11y 実装の現実解 |

### 追加するときの判断基準

- そのライブラリ無しで作ると 200 行以上書く必要があるか?
- 自前実装すると a11y バグが出やすいか?
- バンドルサイズへの影響は許容できるか?
- メンテナンスされているか(直近 6 ヶ月以内のコミット)?

---

## 9. Story 作成のテンプレート

すべての Story は以下の構造に従う(Claude Code への指示としても機能):

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
ボタンコンポーネント。クリック可能な主要なアクション要素を表現する。

## Accessibility
- **Keyboard**: Space / Enter で発火
- **Screen Reader**: ネイティブ \`<button>\` 要素を使用
- **WCAG**: 1.4.3 Contrast (AA), 2.1.1 Keyboard, 2.4.7 Focus Visible
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Button',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
}

// ... AllSizes, WithIcons, Loading, Disabled, LongText
```

---

## 10. 開発フロー

1. このドキュメントの「コンポーネント仕様」セクションで対象を確認
2. 実装の前に、不明点・追加 props があればこのドキュメントを先に更新
3. ブランチを切る: `feat/<component-name>`(例: `feat/button`)
4. Tailwind 版を実装(`Component.tsx`)
5. Story を書く(最低 6 パターン)
6. Storybook で目視・a11y アドオンで確認
7. SCSS 版を実装(`Component.scss.tsx` + `Component.module.scss`)
8. SCSS 版の Story も追加(または同じ Story の中で切り替え)
9. PR 作成 → セルフレビュー → main にマージ
10. GitHub Actions が走り、Storybook が自動デプロイされる

---

## 11. このドキュメントの育て方

- コンポーネントを 1 つ作るたびに「学んだこと」を関連セクションに反映する
- ライブラリを追加したら「依存ライブラリ」セクションに理由を書く
- 命名や設計に迷ったら、まずここを見て、無ければ追記する

> **メモ**: このドキュメントが厚くなってきたら、ファイル分割を検討
> (例: `docs/design-tokens.md`, `docs/components/Button.md` など)
