#!/usr/bin/env bash
# deploy.sh — one-shot publisher for pisey-ou.github.io
# Usage:
#   1. Create an empty repo on GitHub named EXACTLY:  pisey-ou.github.io
#      (Public, do NOT initialise with README/license/.gitignore)
#   2. Open Terminal, cd into this folder, then run:
#         bash deploy.sh
#   3. After the push completes, your site will be live in 1–2 minutes at:
#         https://pisey-ou.github.io

set -e

GITHUB_USER="pisey-ou"
REPO_NAME="${GITHUB_USER}.github.io"
REMOTE_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo "==> Cleaning any previous git state…"
rm -rf .git

echo "==> Initialising fresh git repo (branch: main)…"
git init -b main

echo "==> Configuring local commit identity…"
git config user.email "oupisey.it@gmail.com"
git config user.name  "Pisey Ou"

echo "==> Staging and committing files…"
git add .
git commit -m "Initial commit: portfolio site (day/night theme + load animations)"

echo "==> Adding remote: ${REMOTE_URL}"
git remote add origin "${REMOTE_URL}"

echo "==> Pushing to GitHub… (you'll be prompted to authenticate)"
git push -u origin main

echo ""
echo "✅  Done. Your site will be live shortly at:"
echo "    https://${GITHUB_USER}.github.io"
echo ""
echo "If GitHub Pages is not enabled automatically, go to:"
echo "    https://github.com/${GITHUB_USER}/${REPO_NAME}/settings/pages"
echo "    → Source: Deploy from a branch"
echo "    → Branch: main / (root)  →  Save"
