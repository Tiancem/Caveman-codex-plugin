# caveman-codex

[JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) empaquetado como plugin de Codex, **autoactivo desde el primer turno**: un hook `SessionStart` inyecta el ruleset completo (skill + tabla de intensidad) en cada sesión de Codex.

El repo ES el plugin (mismo layout que [ponytail](https://github.com/DietrichGebert/ponytail), plugin de referencia de OpenAI):

```
.codex-plugin/plugin.json    manifiesto (skills + hooks)
skills/caveman/SKILL.md      la skill original (fuente única: el hook la lee, no copia texto)
hooks/hooks.json             hook SessionStart (ruta default, sin campo en manifiesto)
hooks/caveman-activate.js    inyecta SKILL.md como additionalContext
```

## Instalar (para tu amigo)

1. Clonar:
   ```bash
   git clone https://github.com/Tiancem/Caveman-codex-plugin.git ~/Caveman-codex-plugin
   ```
2. Registrar el marketplace (una vez):
   ```bash
   codex plugin marketplace add ~/caveman-codex
   ```
3. Instalar el plugin:
   ```bash
   codex plugin install caveman
   ```
4. **Trust del hook**: los hooks de plugin no son "managed" — Codex los salta hasta que el usuario los revisa y confía (Settings → Hooks, o el aviso en TUI). Sin este paso, la skill se instala pero no se autoactiva.
5. Nueva sesión: banner `CAVEMAN MODE ACTIVE (full)` y Caveman ya anda. Niveles: `/caveman lite|full|ultra|wenyan-...` (la skill lo trae).

## Notas

- El hook emite `systemMessage` + `hookSpecificOutput.additionalContext` (formato de hook JSON de Codex, verificado con node local).
- `exit 0` siempre: un problema de inyección no frena la sesión.
- SKILL.md de upstream (MIT) — actualizarlo = re-copy el archivo, el hook siempre lee el archivo, nunca re-tipea el ruleset.
- Si `codex plugin install` no lo encuentra (el marketplace no auto-lista el plugin vecino), alternativa manual: editar `~/.codex/config.toml` con `[plugins.caveman] path = "~/caveman-codex"` — confirmar formato exacto en la sección "Install a local plugin manually" de [docs de plugins](https://developers.openai.com/plugins/build/plugins) según la versión de Codex.
