import pathlib
import re
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
INDEX = (ROOT / "index.html").read_text(encoding="utf-8")
MENU = (ROOT / "menu.html").read_text(encoding="utf-8")
DATA = (ROOT / "js" / "menu-data.js").read_text(encoding="utf-8")
PAGES = INDEX + "\n" + MENU


class VisitOnlySiteTests(unittest.TestCase):
    def test_locked_phone_and_address(self):
        self.assertIn("(905) 633-8388", INDEX)
        self.assertIn("tel:+19056338388", INDEX)
        self.assertIn("2405 Fairview St, Unit 3", INDEX)
        self.assertIn("Burlington", INDEX)

    def test_monday_closed(self):
        self.assertRegex(INDEX, r"Closed Mon")
        hours = (ROOT / "js" / "site.js").read_text(encoding="utf-8")
        self.assertIn("1: null", hours)

    def test_native_menu_exists(self):
        self.assertIn("menu.html", INDEX)
        self.assertIn("P9", DATA)
        self.assertIn("Dear Saigon Pho", DATA)
        self.assertIn("SP1", DATA)
        self.assertIn("Dear Saigon Platter", DATA)
        self.assertIn("id=\"menuApp\"", MENU)

    def test_menu_search_and_vegetarian_filter(self):
        self.assertIn('id="menuSearch"', MENU)
        self.assertIn('id="vegFilter"', MENU)
        self.assertIn('id="menuChips"', MENU)
        self.assertGreaterEqual(DATA.count('"veg"'), 6)
        self.assertIn("Tofu Fresh Rolls", DATA)
        self.assertIn("Tofu Pad Thai", DATA)

    def test_no_transactional_checkout(self):
        blob = PAGES.lower()
        for banned in (
            "stripe",
            "checkout",
            "add to cart",
            "order online",
            "clover.com",
            "doordash",
            "ubereats",
            "skipthedishes",
        ):
            self.assertNotIn(banned, blob, banned)

    def test_no_published_prices(self):
        self.assertIsNone(re.search(r"\$\d", PAGES))
        self.assertIsNone(re.search(r"\$\d", DATA))

    def test_call_and_directions_actions(self):
        self.assertIn("tel:+19056338388", MENU)
        self.assertIn("maps.google.com", INDEX)
        self.assertIn("Get directions", INDEX)

    def test_pdf_still_available_from_menu(self):
        self.assertIn("dear-saigon-menu.pdf", MENU)

    def test_mapped_photos_only_reference_local_assets(self):
        for match in re.findall(r'photo:\s*"([^"]+)"', DATA):
            self.assertTrue(match.startswith("assets/"))
            self.assertTrue((ROOT / match).exists(), match)

    def test_skip_link_and_focus_styles(self):
        self.assertIn('class="skip"', INDEX)
        css = (ROOT / "css" / "site.css").read_text(encoding="utf-8")
        self.assertIn(":focus-visible", css)
        self.assertIn("prefers-reduced-motion", css)


if __name__ == "__main__":
    unittest.main()
