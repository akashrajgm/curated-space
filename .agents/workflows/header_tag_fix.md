---
description: Fix JSX tag mismatch in Header.jsx
---

**Step 84 Execution: JSX Tag Alignment**

1. Open `src/components/Header.jsx`.
2. Locate line **120** where a `</div>` incorrectly closes the dropdown.
3. Replace that closing tag with `</motion.div>`.
4. Ensure there is **no stray `</motion.div>`** on line 121 (remove it if present).
5. Save the file.
6. Verify the Vite overlay no longer shows a `PARSE_ERROR`.

This will restore the Header component and bring the UI back online.
