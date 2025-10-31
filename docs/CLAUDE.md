Rules:
- Use pnpm instead of npm
- Try to avoid using useEffect and useState for managing state of application / loading stuff. Try cleaner alternatives that are easier to debug.
- Avoid prop drilling at all costs, its better to have more globalized state. For example via Zustand.

Useful to know:
- our project is meant to be mobile friendly hence why our main overlay of the UI is w-300px, our infinite grid background is different because its ok for that to be full width of the viewport. but UI like buttons, scroll, etc must all fit within the w-300px layout.

Unless explicitly asked for:
- Do not run pnpm build 
- Do not run pnpm dev


Tasks I often ask for:
- deepResearch("{{my instruction here}}"):
    - You explore the documentation, search files, search local program files and take notes in ./ClaudeNotes markdown which will be useful for your longterm planning and execution. Also useful for me to learn as well.
    - This is an inefficent method to your traditional research, you read the entire file in its entirety and make the entire picture visible. Updating notes as you go. The less efficient portion is to save time for myself in the future (we sacrifice short term efficiency for longer term efficincy as your and me both learn deeper)
- silkDeepResearch("{{my instruction / situation here}}")
    - you only research the /silk-latest-docs, you dont read anywhere else or other files and surface the notes you take in ./ClaudeNotes/ in markdown
    - same instructions as the other above
    - you research the /silk-examples repository as well which provides correct code and how to implement it (note you never run pnpm build or pnpm i on it, it is a separate codebase for documentation purposes only for us to learn and implement into our own project)

