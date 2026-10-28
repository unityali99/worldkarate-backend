# Agent Guidelines for Tourino Client Panel

## 1. Package Manager

- **Always use `pnpm`** (`pnpm build`, `pnpm start`, `pnpm add`, `pnpm remove`).
- Do NOT use `npm` or `yarn`. The project uses `pnpm-lock.yaml` with symlinked node_modules.

## 2. Fallow & Static Analysis Policy

- **On-demand only:** Only invoke `fallow` or `fallow-review` when the developer **explicitly asks** for an audit, health check, or PR review.
- **No unprompted gating:** Do NOT run `fallow` in the background or during regular feature development, bug fixing, or UI styling.
- **Exercise Caution When Requested:** If and only if the developer explicitly asks to run `fallow`, exercise deep caution before treating any finding as an actionable issue. Avoid perfectionism or over-engineering that risks breaking working features, UI styling, or code quality.

## 3. Code Integrity & Practicality

- Prioritize stability, readability, and working functionality over automated scoring numbers.
- Preserve existing public API contracts, component props, and export signatures so callers are never broken.

## 4. Software Engineering Principles

- Write clean, readable, maintainable, and reusable code.
- Consistently apply SOLID, DRY (Don't Repeat Yourself), YAGNI (You Aren't Gonna Need It), SoC (Separation of Concerns), KISS (Keep It Simple), and other relevant software engineering principles.
- Keep functions, components, and modules focused, with clear responsibilities and explicit dependencies.
- Reuse shared logic where it serves a real need; avoid premature abstractions, speculative features, unnecessary layers, and overengineering.
- Treat these principles as firm standards while choosing the simplest design that meets current requirements and preserves working behavior.

After implementing changes, present the changed files, relevant diffs, and test results. Leave changes uncommitted for my review. Do not commit, push, deploy, or apply database migrations until I explicitly approve that step.

## Test-Driven Development and Regression Testing

- Develop behavior changes and bug fixes alongside meaningful unit and integration tests. Use `pnpm` for all test commands.
- For bug fixes, first add a regression test that reproduces the reported failure. Confirm it fails for the expected reason, implement the fix, then confirm it passes.
- For new behavior, define the expected contract in tests before implementing it where practical.
- Review relevant existing tests during development. Update outdated expectations only when the intended behavior changes; never weaken assertions just to make tests pass.

### Project commands

- Build: `pnpm build`

## 6. Commit Conventions and Workflow

- Follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/): `<type>[optional scope]: <description>`.
- Use `feat` for new features, `fix` for bug fixes, and appropriate types such as `refactor`, `test`, `docs`, `chore`, `build`, `ci`, or `perf` for other changes. Write concise, specific descriptions.
- Mark breaking changes with `!` before the colon or a `BREAKING CHANGE:` footer. Add a body when needed to explain the reason or consequences.
- Inspect recent commit history and statistics before organizing commits. Match the repository’s typical scope and size while prioritizing logical cohesion. Avoid both excessive tiny commits and oversized commits containing unrelated work.
- Every change must belong to its specific, logically appropriate commit. Each commit must serve one coherent purpose. Keep related implementation, tests, and necessary documentation together; separate unrelated changes, including by staging individual hunks when needed.
- Keep each commit independently understandable and functional. Do not separate tightly coupled changes in a way that creates broken intermediate states.
- Review the working tree and staged diff before every commit. Stage deliberately, verify every included change, and exclude credentials, local environment files, database backups, and unintended generated files.
- Preserve unrelated work unless explicitly authorized to include it. When asked to commit all current project changes, include authorized changes regardless of who created them, organized by purpose.
- Run relevant checks using `pnpm`. Report failures or unavailable checks honestly; never claim validation that was not performed.
- Present changed files, relevant diffs, and test results for review. Leave changes uncommitted until explicitly authorized to commit. Commit authorization does not authorize pushing, deploying, applying database migrations, or rewriting existing history.
- After committing, report each commit’s hash and purpose, validation results, and any remaining uncommitted changes.
