---
name: github
description: GitHub integration via git and gh CLI. Clone repos, create branches, commit code, push changes and create pull requests. Requires GITHUB_TOKEN env var.
---

# GitHub Integration

Arbeite mit GitHub-Repos ueber `git` und `gh` CLI. Authentifizierung laeuft automatisch ueber die `GITHUB_TOKEN` Umgebungsvariable.

## Voraussetzungen

- `GITHUB_TOKEN` muss als Environment Variable gesetzt sein (Fine-grained PAT)
- `git` und `gh` sind im Container vorinstalliert

## Repo-Verzeichnis

Klone alle Repos nach `/root/clawd/repos/<owner>/<repo>`:

```bash
mkdir -p /root/clawd/repos/<owner>
gh repo clone <owner>/<repo> /root/clawd/repos/<owner>/<repo>
```

Falls das Repo bereits geklont ist, aktualisiere es:

```bash
cd /root/clawd/repos/<owner>/<repo>
git fetch origin
git checkout main && git pull origin main
```

## Branch-Konvention

Erstelle Branches nach diesem Muster:

```
feature/<ticket-id>-<kurzbeschreibung>
```

Beispiele:
- `feature/MOL-42-add-user-profile`
- `feature/MOL-103-fix-login-redirect`
- `fix/MOL-55-null-pointer-crash`

```bash
git checkout -b feature/<ticket-id>-<kurzbeschreibung>
```

## Workflow

### 1. Repo klonen oder aktualisieren

```bash
# Erstmaliges Klonen
gh repo clone owner/repo /root/clawd/repos/owner/repo

# Oder aktualisieren
cd /root/clawd/repos/owner/repo && git pull origin main
```

### 2. Branch erstellen

```bash
cd /root/clawd/repos/owner/repo
git checkout main
git pull origin main
git checkout -b feature/TICKET-ID-beschreibung
```

### 3. Code aendern

Dateien lesen, aendern, erstellen - alles im Repo-Verzeichnis.

### 4. Commit + Push

```bash
git add <geaenderte-dateien>
git commit -m "feat: kurze beschreibung

Ausfuehrliche Beschreibung was und warum.

Resolves TICKET-ID"
git push -u origin feature/TICKET-ID-beschreibung
```

### 5. Pull Request erstellen

```bash
gh pr create \
  --title "feat: kurze beschreibung" \
  --body "## Summary

Beschreibung der Aenderungen.

## Ticket
Resolves TICKET-ID

## Changes
- Aenderung 1
- Aenderung 2"
```

## Commit Message Format

Verwende Conventional Commits:

| Prefix | Verwendung |
|---|---|
| `feat:` | Neues Feature |
| `fix:` | Bugfix |
| `refactor:` | Code-Umbau ohne Funktionsaenderung |
| `docs:` | Dokumentation |
| `chore:` | Build, Dependencies, Config |
| `test:` | Tests |

## Sicherheitsregeln

- **Nie direkt auf `main` oder `master` pushen** - immer einen Feature-Branch erstellen
- **Nie `--force` pushen** ohne explizite Anweisung vom User
- **Keine Secrets committen** - pruefe vor dem Commit dass keine API Keys, Passwoerter oder Tokens in den Dateien sind
- **Immer erst den aktuellen Stand pullen** bevor du einen neuen Branch erstellst

## Nuetzliche gh-Befehle

```bash
# Repo-Info anzeigen
gh repo view owner/repo

# Offene PRs auflisten
gh pr list --repo owner/repo

# PR-Status pruefen
gh pr view <pr-number> --repo owner/repo

# PR mergen (nur auf explizite Anweisung!)
gh pr merge <pr-number> --repo owner/repo --squash
```
