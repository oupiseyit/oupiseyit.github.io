#!/usr/bin/env bash
# deploy.sh — publish & update https://oupiseyit.github.io
#
# First run:  initialises the repo and force-pushes the portfolio.
# Later runs: detects an existing repo and just pushes new changes
#             (so use this every time you want to update the site).
#
# Prerequisites:
#   • The empty repo "oupiseyit.github.io" already exists on GitHub
#     (a "user site" repo MUST be named exactly <your-username>.github.io).
#   • You can authenticate with either:
#       - GitHub CLI (`brew install gh && gh auth login`), or
#       - HTTPS + Personal Access Token at the password prompt
#         (create one at https://github.com/settings/tokens, scope: repo)

set -e

GITHUB_USER="oupiseyit"
REPO_NAME="pisey-ou.github.io"
HTTPS_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
SSH_URL="git@github.com:${GITHUB_USER}/${REPO_NAME}.git"
REMOTE_URL="${HTTPS_URL}"

# ---------- helpers ----------
say()   { printf "\n\033[1;36m==> %s\033[0m\n" "$*"; }
ok()    { printf "\033[1;32m✔\033[0m %s\n" "$*"; }
warn()  { printf "\033[1;33m!\033[0m %s\n" "$*"; }
die()   { printf "\033[1;31m✘\033[0m %s\n" "$*"; exit 1; }

# ---------- sanity checks ----------
[[ -f "index.html" ]] || die "Run this from the LinkedinProfile folder (no index.html found here)."
command -v git >/dev/null || die "git is not installed. Install with: xcode-select --install"

# ---------- auth strategy ----------
if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  ok "GitHub CLI detected and authenticated."
else
  warn "GitHub CLI not authenticated — git will prompt for a Personal Access Token."
  warn "(Generate one at https://github.com/settings/tokens with the 'repo' scope.)"
fi

# ---------- decide: fresh init vs update ----------
NEED_INIT=1
if [[ -d ".git" ]]; then
  if git rev-parse --is-inside-work-tree >/dev/null 2>&1 \
     && git log -1 >/dev/null 2>&1; then
    NEED_INIT=0
    ok "Existing valid git repo detected — running in UPDATE mode."
  else
    warn "Found a broken .git folder from a previous attempt. Cleaning it up…"
    rm -rf .git || die "Could not remove .git — try:  sudo rm -rf .git"
  fi
fi

# ---------- ensure remote is correct ----------
ensure_remote() {
  if git remote get-url origin >/dev/null 2>&1; then
    CURRENT_URL="$(git remote get-url origin)"
    if [[ "${CURRENT_URL}" != "${REMOTE_URL}" && "${CURRENT_URL}" != "${SSH_URL}" ]]; then
      warn "Existing 'origin' points at ${CURRENT_URL}"
      warn "Resetting it to ${REMOTE_URL}"
      git remote set-url origin "${REMOTE_URL}"
    fi
  else
    say "Adding 'origin' remote: ${REMOTE_URL}"
    git remote add origin "${REMOTE_URL}"
  fi
}

# ---------- fresh init path ----------
if [[ $NEED_INIT -eq 1 ]]; then
  say "Initialising fresh git repo on branch 'main'"
  git init -b main >/dev/null

  git config user.email "oupisey.it@gmail.com"
  git config user.name  "Pisey Ou"

  say "Staging files (Profile.pdf is excluded by .gitignore)"
  git add .

  say "Creating initial commit"
  git commit -m "Initial commit: portfolio site (day/night theme + load animations)" >/dev/null
  ok "Commit created."

  ensure_remote

  say "Pushing to GitHub (force, since this is the first publish)"
  git push -u origin main --force
  ok "First publish complete."
else
  # ---------- update path ----------
  ensure_remote

  say "Staging local changes"
  git add .

  if git diff --cached --quiet; then
    warn "No changes to commit. Site is already up to date with your local files."
  else
    read -rp "Commit message [Update portfolio site]: " MSG
    MSG="${MSG:-Update portfolio site}"
    git commit -m "${MSG}"
    ok "Commit created."
  fi

  say "Pushing to GitHub"
  if ! git push origin main; then
    warn "Standard push rejected — the remote and local histories diverge."
    warn "This usually happens when GitHub auto-created a README on the repo."
    read -rp "Force-push and overwrite the remote? [y/N]: " ANSWER
    if [[ "${ANSWER}" =~ ^[Yy]$ ]]; then
      git push origin main --force
      ok "Force-push complete."
    else
      die "Aborted. To merge instead, run:  git pull --rebase origin main  &&  bash deploy.sh"
    fi
  else
    ok "Push complete."
  fi
fi

# ---------- final hint ----------
cat <<EOF

🎉  All done.

Your site:   https://pisey-ou.github.io
The repo:    https://github.com/${GITHUB_USER}/${REPO_NAME}

If the page doesn't appear in a minute or two, check Pages settings:
  https://github.com/${GITHUB_USER}/${REPO_NAME}/settings/pages
  → Source: "Deploy from a branch"
  → Branch: main / (root)  →  Save

To update later, just edit your files and re-run:
  bash deploy.sh
EOF
