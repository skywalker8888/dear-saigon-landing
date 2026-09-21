# Dear Saigon Burlington

Visit-only site for the Burlington noodle bar: native web menu, hours, phone, and directions.

- Home: `index.html`
- Menu: `menu.html`
- Printable PDF: `dear-saigon-menu.pdf`

Locked public facts: 2405 Fairview St, Unit 3 · `(905) 633-8388` · closed Mondays. This site does not take payments.

```bash
python3 -m http.server 4173
python3 -m unittest tests/test_visit_site.py
```
