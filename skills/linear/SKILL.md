---
name: linear
description: Linear project management integration via GraphQL API. Read tickets, update status, add comments. Requires LINEAR_API_KEY env var.
---

# Linear Integration

Arbeite mit Linear-Tickets ueber die GraphQL API. Authentifizierung laeuft ueber die `LINEAR_API_KEY` Umgebungsvariable.

## Voraussetzungen

- `LINEAR_API_KEY` muss als Environment Variable gesetzt sein

## API-Zugriff

Alle Anfragen gehen an `https://api.linear.app/graphql`:

```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: $LINEAR_API_KEY" \
  -d '{"query": "{ viewer { id name email } }"}'
```

## Haeufige Queries

### Ticket-Details abrufen (ueber Identifier wie MOL-42)

```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: $LINEAR_API_KEY" \
  -d '{
    "query": "query($filter: IssueFilter) { issues(filter: $filter, first: 1) { nodes { id identifier title description priority priorityLabel state { name } labels { nodes { name } } assignee { name } comments { nodes { body user { name } createdAt } } } } }",
    "variables": {
      "filter": {
        "number": { "eq": 42 },
        "team": { "key": { "eq": "MOL" } }
      }
    }
  }'
```

### Meine offenen Tickets auflisten

```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: $LINEAR_API_KEY" \
  -d '{
    "query": "{ viewer { assignedIssues(filter: { state: { type: { nin: [\"completed\", \"canceled\"] } } }, first: 50) { nodes { identifier title priority priorityLabel state { name } labels { nodes { name } } } } } }"
  }'
```

### Alle Tickets eines Teams auflisten

```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: $LINEAR_API_KEY" \
  -d '{
    "query": "query($teamKey: String!) { team(key: $teamKey) { issues(first: 50, filter: { state: { type: { nin: [\"completed\", \"canceled\"] } } }) { nodes { identifier title priority priorityLabel state { name } assignee { name } } } } }",
    "variables": { "teamKey": "MOL" }
  }'
```

### Teams und Workflow-States auflisten

```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: $LINEAR_API_KEY" \
  -d '{
    "query": "{ teams { nodes { id key name states { nodes { id name type } } } } }"
  }'
```

## Mutations

### Ticket-Status aendern

Zuerst die State-ID fuer den Ziel-Status ermitteln (siehe "Teams und Workflow-States auflisten"), dann:

```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: $LINEAR_API_KEY" \
  -d '{
    "query": "mutation($id: String!, $stateId: String!) { issueUpdate(id: $id, input: { stateId: $stateId }) { success issue { identifier state { name } } } }",
    "variables": {
      "id": "<issue-uuid>",
      "stateId": "<state-uuid>"
    }
  }'
```

Typische State-Transitions:
- **In Progress**: Wenn du anfaengst an einem Ticket zu arbeiten
- **Done/Completed**: Wenn der PR gemergt wurde (nur auf Anweisung)

### Kommentar hinzufuegen

```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: $LINEAR_API_KEY" \
  -d '{
    "query": "mutation($issueId: String!, $body: String!) { commentCreate(input: { issueId: $issueId, body: $body }) { success comment { id } } }",
    "variables": {
      "issueId": "<issue-uuid>",
      "body": "PR erstellt: https://github.com/owner/repo/pull/123"
    }
  }'
```

### Neues Ticket erstellen

```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: $LINEAR_API_KEY" \
  -d '{
    "query": "mutation($teamId: String!, $title: String!, $description: String) { issueCreate(input: { teamId: $teamId, title: $title, description: $description }) { success issue { identifier title url } } }",
    "variables": {
      "teamId": "<team-uuid>",
      "title": "Ticket-Titel",
      "description": "Beschreibung in Markdown"
    }
  }'
```

## Workflow mit GitHub

Wenn der User ein Ticket bearbeiten will:

1. **Ticket lesen** - Details, Beschreibung, Acceptance Criteria abrufen
2. **Status auf "In Progress" setzen** - Zeigt dem Team dass jemand dran arbeitet
3. **Code implementieren** - Ueber den GitHub-Skill
4. **PR erstellen** - Mit Ticket-Referenz im PR-Body
5. **Kommentar in Linear** - Link zum PR hinterlassen
6. **User informieren** - PR-Link zurueckmelden

## Tipps

- Die `id` eines Issues (UUID) ist nicht das gleiche wie der `identifier` (z.B. MOL-42). Fuer Mutations brauchst du die UUID.
- Hole dir die UUID immer ueber eine Query mit dem Identifier-Filter.
- `jq` ist hilfreich um die JSON-Antworten zu parsen: `| jq '.data.issues.nodes[0]'`
- Bei grossen Ergebnismengen nutze Pagination mit `first` und `after` Cursor.
