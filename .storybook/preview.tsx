import * as React from 'react'
import type { Preview, Decorator } from '@storybook/react-vite'
import { ApplicationToaster } from '../components/application'
import './storybook.css'

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme as 'light' | 'dark'

  React.useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    // プレビュー iframe の地色もテーマに追従させる
    document.body.style.backgroundColor =
      theme === 'dark' ? 'oklch(0.208 0.014 285.938)' : 'oklch(1 0 0)'
    return () => root.classList.remove('dark')
  }, [theme])

  return (
    <div className="app-preview font-sans p-6">
      <Story />
      {/* トーストは常時マウントが前提（実アプリではルートレイアウトに 1 つ） */}
      <ApplicationToaster />
    </div>
  )
}

const preview: Preview = {
  decorators: [withTheme],

  globalTypes: {
    theme: {
      description: 'ライト / ダーク切替',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },

  parameters: {
    layout: 'fullscreen',

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    // アクセシビリティ検査を全 Story で実行する。
    // 違反があっても Story は表示されるが、a11y パネルに警告が出る。
    a11y: { test: 'todo' },

    // レスポンシブ確認用。実アプリの想定ブレークポイントに合わせる。
    viewport: {
      options: {
        mobile: { name: 'Mobile (sm)', styles: { width: '375px', height: '667px' } },
        tablet: { name: 'Tablet (md)', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop (lg)', styles: { width: '1280px', height: '800px' } },
      },
    },

    options: {
      /*
       * サイドバーの並び。
       * Getting Started → Foundations → Components → Patterns → Gallery の順に置き、
       * 各コンポーネント内では Overview を先頭に固定する（比較用の一覧を最初に見せる）。
       *
       * <important>
       * storySort は **インラインで完結**させる必要がある。Storybook は index を作る前に
       * preview の AST からこの関数だけを取り出して eval するため、
       *   - 外で定義した定数・関数を参照すると「Unexpected 'storySort'」で落ちる
       *   - TS の型注釈を書くと eval が構文エラーになる（TS のまま評価される）
       * 引数の型は既定値で与えている。Storybook は常に 2 引数で呼ぶため既定値は使われない。
       * </important>
       *
       * <important>
       * 0 を返した組は Storybook が収集した順（ファイル名の昇順、ファイル内では定義順）の
       * まま残る。Components がアルファベット順、各ファイルの Story が定義順になるのは
       * この性質に頼っている。
       * </important>
       */
      storySort: (a = { title: '', name: '' }, b = { title: '', name: '' }) => {
        const SECTION_ORDER = [
          'Getting Started',
          'Foundations',
          'Components',
          'Patterns',
          'Gallery',
        ]
        const FOUNDATIONS_ORDER = ['Colors', 'Typography', 'Spacing', 'Radius & Shadow', 'Icons']
        // 見る順（画面の組み立て方 → 状態の見せ方 → 一覧の作り方）
        const PATTERNS_ORDER = [
          'Form',
          'EmptyState',
          'ErrorState',
          'Search',
          'DataTable',
          'ButtonGroupExample',
        ]

        // 一覧にない名前は末尾に置く（Story を足しても並びが壊れないようにする）
        const rank = (order = [''], name = '') => {
          const index = order.indexOf(name)
          return index === -1 ? order.length : index
        }

        const aPath = a.title.split('/')
        const bPath = b.title.split('/')

        const bySection = rank(SECTION_ORDER, aPath[0]) - rank(SECTION_ORDER, bPath[0])
        if (bySection !== 0) return bySection

        const order =
          aPath[0] === 'Foundations'
            ? FOUNDATIONS_ORDER
            : aPath[0] === 'Patterns'
              ? PATTERNS_ORDER
              : null
        if (order) {
          const byName =
            rank(order, aPath.slice(1).join('/')) - rank(order, bPath.slice(1).join('/'))
          if (byName !== 0) return byName
        }

        // 同じコンポーネント内では Overview を先頭に固定する
        if (a.title === b.title) {
          return Number(a.name !== 'Overview') - Number(b.name !== 'Overview')
        }

        return 0
      },
    },
  },
}

export default preview
