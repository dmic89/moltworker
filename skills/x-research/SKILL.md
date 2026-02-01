---
name: x-research
description: Research X/Twitter posts, trends, and accounts using the xAI Grok API with Live Search. Summarize discussions, analyze trends, and monitor specific accounts. Requires XAI_API_KEY env var.
---

# X/Twitter Research via Grok API (Live Search)

Recherchiere X/Twitter-Posts, Trends und Accounts über die xAI Grok API mit **Live Search**. Grok hat direkten Echtzeit-Zugriff auf X-Daten.

## Voraussetzungen

- `XAI_API_KEY` muss als Environment Variable gesetzt sein
- Model: `grok-4-1-fast` (mit Server-Side Tools)
- Endpoint: `/v1/responses` (NICHT `/v1/chat/completions`)

## API-Zugriff (Aktuell - Februar 2026)

Die xAI API nutzt den **Responses Endpoint** mit **Server-Side Tools** für Live X-Search.

### Basis-Anfrage mit X-Search

```bash
curl -s https://api.x.ai/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -d '{
    "model": "grok-4-1-fast",
    "tools": [{"type": "x_search"}],
    "input": "Search X for posts about [THEMA]. What are people saying?"
  }'
```

### Response parsen

```bash
curl -s https://api.x.ai/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -d '{
    "model": "grok-4-1-fast",
    "tools": [{"type": "x_search"}],
    "input": "Search X for posts about [THEMA]"
  }' | jq '.output[] | select(.type=="message") | .content[] | select(.type=="output_text") | .text'
```

## Anwendungsfälle

### 1. Posts zu einem Thema recherchieren

```bash
curl -s https://api.x.ai/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -d '{
    "model": "grok-4-1-fast",
    "tools": [{"type": "x_search"}],
    "input": "Search X for recent discussions about [THEMA]. Summarize the key posts, opinions, and sentiment. Include specific accounts and post content."
  }'
```

### 2. Trends analysieren

```bash
curl -s https://api.x.ai/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -d '{
    "model": "grok-4-1-fast",
    "tools": [{"type": "x_search"}],
    "input": "What are the current trending topics on X about [BEREICH]? Which discussions are getting the most engagement?"
  }'
```

### 3. Account-Recherche (mit Handle-Filter)

```bash
curl -s https://api.x.ai/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -d '{
    "model": "grok-4-1-fast",
    "tools": [
      {
        "type": "x_search",
        "x_search": {
          "allowed_x_handles": ["USERNAME1", "USERNAME2"]
        }
      }
    ],
    "input": "What have these accounts posted recently? Summarize their key posts."
  }'
```

### 4. Zeitlich eingegrenzte Suche

```bash
curl -s https://api.x.ai/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -d '{
    "model": "grok-4-1-fast",
    "tools": [
      {
        "type": "x_search",
        "x_search": {
          "from_date": "2026-01-25",
          "to_date": "2026-02-01"
        }
      }
    ],
    "input": "Search X for posts about [THEMA] from the last week."
  }'
```

### 5. Sentiment-Analyse

```bash
curl -s https://api.x.ai/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -d '{
    "model": "grok-4-1-fast",
    "tools": [{"type": "x_search"}],
    "input": "Search X for posts about [THEMA/PRODUKT]. Analyze the sentiment - what percentage is positive, negative, neutral? Give specific examples of each."
  }'
```

### 6. Wettbewerber-Monitoring

```bash
curl -s https://api.x.ai/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -d '{
    "model": "grok-4-1-fast",
    "tools": [
      {
        "type": "x_search",
        "x_search": {
          "allowed_x_handles": ["COMPETITOR1", "COMPETITOR2", "COMPETITOR3"]
        }
      }
    ],
    "input": "What are these competitor accounts posting about? What topics, strategies, and engagement patterns do you see?"
  }'
```

## Verfügbare Tools

| Tool | Beschreibung |
|------|-------------|
| `x_search` | X/Twitter Suche (Posts, Accounts, Trends) |
| `web_search` | Web-Suche (optional, für zusätzlichen Kontext) |

## X-Search Parameter (Optional)

Füge `x_search` Objekt zum Tool hinzu für Filter:

```json
{
  "type": "x_search",
  "x_search": {
    "allowed_x_handles": ["handle1", "handle2"],
    "excluded_x_handles": ["spam_account"],
    "from_date": "2026-01-01",
    "to_date": "2026-02-01",
    "enable_image_understanding": true,
    "enable_video_understanding": true
  }
}
```

| Parameter | Beschreibung |
|-----------|-------------|
| `allowed_x_handles` | Nur Posts von diesen Accounts (max 10) |
| `excluded_x_handles` | Posts von diesen Accounts ausschließen |
| `from_date` | Start-Datum (YYYY-MM-DD) |
| `to_date` | End-Datum (YYYY-MM-DD) |
| `enable_image_understanding` | Bilder in Posts analysieren |
| `enable_video_understanding` | Videos in Posts analysieren |

## Verfügbare Modelle

| Modell | Für Server-Side Tools? | Empfehlung |
|--------|------------------------|------------|
| `grok-4-1-fast` | ✅ Ja | Standard für X-Research |
| `grok-4` | ✅ Ja | Tiefere Analyse |
| `grok-3` | ❌ Nein | Nicht für Live Search |
| `grok-3-mini` | ❌ Nein | Nicht für Live Search |

**Wichtig:** Nur `grok-4` Familie unterstützt Server-Side Tools (x_search, web_search).

## Response-Struktur

Die Response enthält:
- `output[].content[].text` — Der finale Text
- `output[].content[].annotations` — Zitationen mit X-Post URLs
- `usage` — Token-Verbrauch und Kosten

### Response parsen (vollständig)

```bash
# Text extrahieren
jq '.output[] | select(.type=="message") | .content[] | select(.type=="output_text") | .text'

# Zitationen extrahieren
jq '.output[] | select(.type=="message") | .content[] | select(.type=="output_text") | .annotations'
```

## Ausgabe-Format

Strukturiere X-Recherche Ergebnisse so:

```
## X-Recherche: [Thema]

**Zeitraum:** Letzte [X] Tage

### Wichtigste Posts
- @account1: "Post-Inhalt..." (XX Likes, XX Reposts)
  Link: https://x.com/i/status/...
- @account2: "Post-Inhalt..." (XX Likes, XX Reposts)
  Link: https://x.com/i/status/...

### Zusammenfassung
[2-3 Sätze Zusammenfassung der Diskussion]

### Stimmung
[Positiv/Negativ/Gemischt mit kurzer Begründung]
```

## Tipps

- **Immer `grok-4-1-fast`** für X-Research (grok-3 unterstützt keine Server-Side Tools)
- Sei spezifisch in der Anfrage - je genauer das Thema, desto bessere Ergebnisse
- Für deutschsprachige X-Diskussionen explizit "auf Deutsch" oder "im DACH-Raum" angeben
- Nutze `from_date`/`to_date` für zeitliche Eingrenzung
- Nutze `allowed_x_handles` für Account-spezifische Recherche
- Bei großen Themen die Anfrage eingrenzen (Zeitraum, Region, Community)

## Kosten

- Server-Side Tools (x_search) werden in `usage.num_server_side_tools_used` gezählt
- Live Search ist aktuell kostenlos in Beta (Stand Februar 2026)
- Token-Kosten sind in `usage.cost_in_usd_ticks` (1M ticks = $1)
