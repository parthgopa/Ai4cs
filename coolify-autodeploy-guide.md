# Coolify Auto-Deploy via GitHub Actions — Complete Guide

> **Project:** Ai4cs on Hostinger VPS (coolify.merishiksha.com)  
> **Goal:** Auto-deploy on every `git push` to `main`

---

## Why GitHub Webhooks Don't Work with Coolify API

Coolify's deploy endpoint (`/api/v1/deploy`) requires a **Bearer token** passed as an HTTP `Authorization` header:

```
Authorization: Bearer YOUR_TOKEN
```

GitHub Webhooks **cannot send custom headers** — they only send a payload + an HMAC secret signature. This is why every webhook attempt returned `401 Unauthorized`, no matter what you put in the "Secret" field on GitHub.

**The correct solution is GitHub Actions**, which can make HTTP requests with custom headers.

---

## Mistakes Made & How to Fix Them

### ❌ Mistake 1 — Using `coolify` as the webhook secret
**What happened:** GitHub's webhook Secret field uses HMAC signing, not plain password auth. Putting `coolify` there does nothing useful for Coolify's API.

**Fix:** The webhook approach is wrong entirely. Use GitHub Actions instead (see below).

---

### ❌ Mistake 2 — Pasting the API token in GitHub's webhook Secret field
**What happened:** Even with a real Coolify API token in GitHub's Secret field, it still returns 401 because GitHub signs the payload with it — it doesn't send it as a Bearer token in the Authorization header.

**Fix:** Don't use webhooks at all. Store the token in GitHub Actions Secrets and use it in a `curl` command inside the workflow.

---

### ❌ Mistake 3 — Testing against `app.coolify.io` instead of your own instance
**What happened:**
```bash
curl https://app.coolify.io/api/v1/deploy  # ❌ Wrong — this is Coolify's cloud
```
**Fix:**
```bash
curl https://coolify.merishiksha.com/api/v1/deploy  # ✅ Your own instance
```

---

### ❌ Mistake 4 — Missing `Bearer` prefix in Authorization header
**What happened:**
```bash
--header 'Authorization: 2|ICvvRgLHb0I...'  # ❌ Missing "Bearer"
```
**Fix:**
```bash
--header 'Authorization: Bearer 2|ICvvRgLHb0I...'  # ✅ Correct
```

---

### ❌ Mistake 5 — Creating a new webhook instead of deleting the old one
**What happened:** After setting up GitHub Actions, the old webhook was still active and kept firing, sending the raw YAML file content as the POST body to Coolify.

**Fix:** Go to GitHub repo → **Settings → Webhooks** → **Delete ALL webhooks** before relying on GitHub Actions.

---

## Correct Setup — Step by Step

### Step 1 — Enable the API in Coolify
- Go to `https://coolify.merishiksha.com` → **Settings → General**
- Make sure the **API toggle is enabled** ✅
- Without this, all API tokens will return 401

---

### Step 2 — Generate a Coolify API Token
- Go to Coolify → **Profile → Keys & Tokens → API Tokens**
- Create a new token and copy the **full value** (e.g., `2|ICvvRgLHb0IJd9ARLW1D8K2GRU33lAlpVkrFw4Qkef97f241`)
- Do not truncate it

---

### Step 3 — Test the Token Works
Run this from your VPS terminal:
```bash
curl "https://coolify.merishiksha.com/api/v1/deploy?uuid=YOUR_APP_UUID&force=false" \
  --header 'Authorization: Bearer YOUR_FULL_TOKEN'
```
Expected success response:
```json
{"deployments":[{"message":"Application Ai4cs deployment queued.","resource_uuid":"...","deployment_uuid":"..."}]}
```
If you get `401`, the API is not enabled or the token is wrong.

---

### Step 4 — Add Token to GitHub Secrets
- Go to your GitHub repo → **Settings → Secrets and variables → Actions**
- Click **New repository secret**
- Name: `COOLIFY_TOKEN`
- Value: your full API token

---

### Step 5 — Create the GitHub Actions Workflow
In your local project, create the file at exactly this path:

```
your-repo/
└── .github/
    └── workflows/
        └── deploy.yml
```

Contents of `deploy.yml`:
```yaml
name: Deploy to Coolify

on:
  push:
    branches:
      - main  # change if your branch is different

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Coolify Deploy
        run: |
          curl --request GET \
            "https://coolify.merishiksha.com/api/v1/deploy?uuid=YOUR_APP_UUID&force=false" \
            --header 'Authorization: Bearer ${{ secrets.COOLIFY_TOKEN }}'
```

Replace `YOUR_APP_UUID` with your app's UUID (found in Coolify → app → Webhooks page).

---

### Step 6 — Delete All Old Webhooks
- Go to GitHub repo → **Settings → Webhooks**
- **Delete every webhook listed** — they will conflict with GitHub Actions

---

### Step 7 — Push and Verify
```bash
git add .github/workflows/deploy.yml
git commit -m "Add Coolify auto-deploy workflow"
git push
```

Then go to GitHub repo → **Actions tab** — you should see a green ✅ workflow run. Coolify will also show a new deployment queued.

---

## Quick Reference

| Thing | Where to find it |
|---|---|
| App UUID | Coolify → your app → Webhooks tab |
| API Token | Coolify → Profile → Keys & Tokens |
| Enable API | Coolify → Settings → General |
| GitHub Secrets | GitHub repo → Settings → Secrets and variables → Actions |
| Workflow runs | GitHub repo → Actions tab |

---

## How It Works (Summary)

```
git push → GitHub Actions triggers → curl hits Coolify API
           with Bearer token in header → Coolify queues deployment ✅
```

GitHub Webhooks path (broken):
```
git push → GitHub sends POST to Coolify webhook URL
           with HMAC secret (not Bearer token) → Coolify returns 401 ❌
```
