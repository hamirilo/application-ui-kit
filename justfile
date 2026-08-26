default:
    @just --list

check:
    bun run typecheck
    bun run test
    bun run lint
    bun run build

build:
    bun run build

# 配布物が利用側プロジェクトでビルドできるかを検証する（npm install を伴うため遅い）
verify-package:
    bun run verify:package

typecheck:
    bun run typecheck

test:
    bun run test

lint:
    bun run lint

format:
    bun run format

storybook:
    bun run storybook

build-storybook:
    bun run build-storybook

