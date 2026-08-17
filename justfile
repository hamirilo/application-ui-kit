default:
    @just --list

check:
    bun run typecheck
    bun run test
    bun run lint

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

