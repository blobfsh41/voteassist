
# Git Commit Guidelines

To keep our repository history clean, readable, and easy to debug, we use the Conventional Commits standard. Do not use version numbers as commit messages. Instead, describe what changed and why.

## Commit Message Formula

Every commit message must follow this simple structure:

```text
<type>: <short description in present tense>
```

## Approved Types

- `feat`: A new feature or capability (for example, `feat: add password reset button`)
- `fix`: A bug fix (for example, `fix: resolve crash on mobile checkout`)
- `docs`: Changes to documentation or Markdown files (for example, `docs: update installation instructions`)
- `style`: Formatting, missing semicolons, or cosmetic changes that do not affect code execution (for example, `style: fix indentation in login form`)
- `refactor`: Rewriting code without changing its external behaviour or fixing a bug (for example, `refactor: simplify database connection logic`)
- `test`: Adding missing tests or correcting existing tests (for example, `test: add unit test for email validator`)
- `chore`: Updating build tasks, package dependencies, or configuration tools (for example, `chore: bump lodash package version`)

## Rules of Thumb

1. Use the imperative mood: write your description as if you are giving a command (for example, `fix: solve login bug` instead of `fixed login bug` or `fixes login bug`).
2. Keep it short: aim for 50 characters or fewer for the message.
3. No version numbers: never name a commit `version 1.0.0`. Use Git tags for version releases instead.

## How to Handle Version Releases

When you are ready to mark a specific release or version milestone, do not make a commit for it. Use a Git tag:

```bash
# 1. Create a tag for the current commit
git tag -a v1.0.0 -m "Release version 1.0.0"

# 2. Push the tag to GitHub
git push origin v1.0.0
```