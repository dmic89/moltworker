---
name: ai-humanizer
description: Removes AI-typical writing patterns from text to make it sound more natural and human. Detects and fixes inflated symbolism, promotional language, em-dash overuse, and AI vocabulary.
---

# AI Humanizer

Entferne AI-typische Schreibmuster aus Texten, um sie natuerlicher und menschlicher klingen zu lassen.

## Wann aktivieren

Wenn der User darum bittet, einen Text zu "humanisieren", "natuerlicher zu machen", oder wenn er explizit fragt ob ein Text "nach AI klingt".

## AI-typische Muster erkennen und entfernen

### 1. Aufgeblaehte Symbolik

AI-Texte verwenden oft uebertriebene Metaphern und Symbolik wo einfache Sprache reichen wuerde.

- **Vorher:** "The city was a tapestry woven from threads of ambition and resilience."
- **Nachher:** "The city had a mix of ambition and toughness."

### 2. Werbliche Sprache

Uebertrieben positive, verkaufsfoerdernde Formulierungen.

- **Vorher:** "This groundbreaking, revolutionary approach transforms the way we think about..."
- **Nachher:** "This approach changes how we think about..."

### 3. Em-Dash Uebernutzung

AI-Texte verwenden exzessiv Em-Dashes (---) als Stilmittel.

- **Vorher:** "The project --- which had been in development for years --- finally launched --- much to everyone's relief."
- **Nachher:** "The project, which had been in development for years, finally launched, much to everyone's relief."

Regel: Maximal ein Em-Dash pro Absatz ist akzeptabel. Ersetze den Rest durch Kommas, Klammern oder Punkte.

### 4. Rule-of-Three

AI listet obsessiv Dinge in Dreiergruppen auf.

- **Vorher:** "It was fast, efficient, and reliable. The team was dedicated, passionate, and skilled."
- **Nachher:** "It was fast and reliable. The team was dedicated and skilled."

Regel: Nicht jede Aufzaehlung braucht genau drei Elemente.

### 5. AI-Vokabular

Diese Woerter und Phrasen sind starke AI-Indikatoren. Ersetze sie durch natuerlichere Alternativen:

| AI-Wort | Natuerliche Alternative |
|---|---|
| delve | look into, explore, examine |
| tapestry | mix, combination, collection |
| vibrant | lively, active, colorful |
| landscape | field, area, situation |
| leverage | use, take advantage of |
| utilize | use |
| facilitate | help, enable, make possible |
| streamline | simplify, speed up |
| foster | encourage, support |
| robust | strong, solid, reliable |
| seamless | smooth, easy |
| comprehensive | complete, thorough, full |
| furthermore | also, and, plus |
| moreover | also, and |
| in conclusion | to sum up, overall |
| it's worth noting | note that, keep in mind |
| it's important to note | note that |
| plays a crucial role | is important for, matters for |
| at its core | basically, essentially |
| in today's [X] landscape | today, now, currently |
| navigating the complexities | dealing with, handling |
| a testament to | shows, proves, reflects |

### 6. Uebertriebene Strukturierung

AI-Texte haben oft zu viele Ueberschriften, Bullet Points und nummerierte Listen wo Fliesstext natuerlicher waere.

Regel: Nicht jeder Absatz braucht eine Ueberschrift. Fliesstext ist oft lesbarer.

### 7. Satzanfaenge

AI beginnt Saetze oft mit den gleichen Phrasen:

- "In the realm of..."
- "When it comes to..."
- "It's worth mentioning that..."
- "One of the key aspects..."

Ersetze durch direkte, variierende Satzanfaenge.

### 8. Zusammenfassende Schlussaetze

AI beendet Abschnitte fast immer mit einer zusammenfassenden Floskel:

- "In conclusion, X remains a Y that Z."
- "Ultimately, X serves as a powerful reminder of Y."
- "As we move forward, X will continue to shape Y."

Regel: Lass den Text einfach enden wenn der Punkt gemacht ist. Nicht jeder Abschnitt braucht ein Fazit.

## Vorgehen

1. **Text lesen** und AI-Muster identifizieren
2. **Muster markieren** - dem User zeigen welche Stellen nach AI klingen und warum
3. **Ueberarbeiteten Text liefern** - natuerlichere Version
4. **Aenderungen erklaeren** - kurz begruenden was geaendert wurde

## Wichtig

- Den **Inhalt und die Aussage** des Textes beibehalten - nur den Stil aendern
- Nicht den gesamten Text umschreiben - nur die AI-typischen Stellen korrigieren
- Die **Stimme des Users** beibehalten - nicht deinen eigenen Stil aufzwingen
- Im Zweifel lieber weniger aendern als zu viel
