# CeritaKita — Templates

Reusable templates for running the Scrum process (see `02-Scrum-Process.md`).

## 1. User story template

```markdown
#### US-XX — <Title>
- **As a** <role>, **I want** <capability>, **so that** <benefit>.
- **FR:** <feature IDs> · **Priority:** Must/Should/Could · **Points:** <n> · **Sprint:** <n>
- **Acceptance criteria:**
  - Given <context>, when <action>, then <observable outcome>.
  - …
- **Notes:** <dependencies, edge cases>
```

## 2. Sprint planning template

```markdown
### Sprint N — <Theme>
- **Goal:** <one sentence outcome>
- **Date range:** <start> – <end>
- **Committed stories:** US-…, US-…
- **Committed points:** <n>
- **Dependencies/risks:** <notes>
```

## 3. Daily scrum template

```markdown
| Who | Yesterday | Today | Blockers |
|---|---|---|---|
| Dev A | … | … | — |
| Dev B | … | … | — |
```

## 4. Sprint review template

```markdown
### Sprint N Review — <date>
| Story | Accepted? | Demo note | Follow-up |
|---|---|---|---|
| US-01 | ✅ / ❌ | … | — |
- **Committed:** <n> points · **Completed:** <n> points · **Velocity:** <n>
- **Demo link:** <url>
```

## 5. Sprint retrospective template

```markdown
### Sprint N Retro — <date>
**What went well:**
- …
**What didn't go well:**
- …
**Action items:**
- [ ] <action> → owner, due date
```

## 6. Burndown table

```markdown
| Day | Remaining points |
|---|---|
| Mon | 24 |
| Tue | 21 |
| … | … |
```

## 7. Definition of Done checklist (per story)

```markdown
- [ ] Acceptance criteria pass
- [ ] `npm run build` (both apps) passes
- [ ] `npm run lint` / `tsc --noEmit` clean
- [ ] API verified (status codes correct)
- [ ] Happy path + one edge case tested
- [ ] Design system + Bahasa Indonesia copy confirmed
- [ ] No secrets committed
- [ ] Demo note added
```

## 8. Definition of Ready checklist (per story)

```markdown
- [ ] User story format complete
- [ ] Given/When/Then acceptance criteria
- [ ] Story points assigned
- [ ] MoSCoW priority set
- [ ] Dependencies identified
- [ ] UI references design system (if applicable)
```
