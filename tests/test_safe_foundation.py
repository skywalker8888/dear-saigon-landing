from html.parser import HTMLParser
from pathlib import Path
import re
import unittest
import json


ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")


class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self._href = None
        self._text = []

    def handle_starttag(self, tag, attrs):
        if tag == "a":
            self._href = dict(attrs).get("href", "")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag == "a" and self._href is not None:
            self.links.append((" ".join(" ".join(self._text).split()), self._href))
            self._href = None
            self._text = []


class SafeFoundationTests(unittest.TestCase):
    def test_transactional_language_is_fail_closed(self):
        prohibited = (
            "order online",
            "call to order",
            "order direct",
            "ready in ~20 min",
            "no app fees",
            "25–30%",
            "made to order",
            "buy 9, get your 10th free",
            "book catering",
        )
        lower = HTML.lower()
        for phrase in prohibited:
            self.assertNotIn(phrase.lower(), lower)
        self.assertIn("Online ordering is not enabled on this page.", HTML)

    def test_no_price_is_published(self):
        self.assertIsNone(re.search(r"\$\s*\d", HTML))

    def test_order_like_links_do_not_route_to_google(self):
        parser = LinkParser()
        parser.feed(HTML)
        for label, href in parser.links:
            if any(word in label.lower() for word in ("order", "checkout", "pay")):
                self.fail(f"transactional link remains: {label!r} -> {href!r}")

    def test_external_actions_are_limited_to_google_listing_and_phone(self):
        parser = LinkParser()
        parser.feed(HTML)
        allowed_external_prefixes = (
            "https://maps.google.com/?cid=7779167624269607469",
            "tel:+19056338388",
        )
        for label, href in parser.links:
            if href.startswith(("http://", "https://", "tel:")):
                self.assertTrue(
                    href.startswith(allowed_external_prefixes),
                    f"unapproved external destination remains: {label!r} -> {href!r}",
                )

    def test_owner_confirmed_public_facts_are_present(self):
        self.assertIn("2405 Fairview St, Burlington, ON L7R 2E4", HTML)
        self.assertNotIn("2405 Fairview St, Unit 3", HTML)
        self.assertIn("Closed Mon", HTML)
        self.assertIn("Tue&ndash;Thu 11am&ndash;9pm", HTML)
        self.assertIn("Fri&ndash;Sat 11am&ndash;10pm", HTML)
        self.assertIn("Sun 11am&ndash;9pm", HTML)
        self.assertIn("tel:+19056338388", HTML)

    def test_live_status_does_not_ignore_holiday_or_temporary_exceptions(self):
        unsafe_runtime_claims = (
            "Checking hours",
            "Open now",
            "Closed — opens",
            "always has current hours",
        )
        for claim in unsafe_runtime_claims:
            self.assertNotIn(claim, HTML)
        self.assertIn("Regular schedule · holiday hours may differ", HTML)

    def test_customer_identity_and_internal_boundaries_are_preserved(self):
        self.assertIn("<h1>Dear Saigon</h1>", HTML)
        self.assertNotIn("Vietnamese Noodle Bar", HTML)
        self.assertNotIn("America/Toronto", HTML)
        self.assertNotIn("Dear Saigon,<br", HTML)

    def test_structured_data_uses_only_scoped_public_facts(self):
        match = re.search(
            r'<script type="application/ld\+json">\s*(\{.*?\})\s*</script>',
            HTML,
            re.DOTALL,
        )
        self.assertIsNotNone(match)
        payload = json.loads(match.group(1))
        self.assertEqual(payload["name"], "Dear Saigon")
        self.assertEqual(payload["telephone"], "+1-905-633-8388")
        self.assertEqual(payload["address"]["streetAddress"], "2405 Fairview St")
        self.assertNotIn("priceRange", payload)
        self.assertNotIn("menu", payload)

    def test_accessibility_baseline(self):
        self.assertIn('class="skip-link" href="#main-content"', HTML)
        self.assertIn('<main id="main-content" tabindex="-1">', HTML)

    def test_referenced_local_images_exist(self):
        for source in re.findall(r'<img[^>]+src="([^"]+)"', HTML):
            if source.startswith(("http://", "https://", "data:")):
                continue
            self.assertTrue((ROOT / source).is_file(), f"missing image: {source}")

    def test_only_scoped_menu_names_remain(self):
        self.assertIn("Pho with Rare Beef", HTML)
        self.assertIn("Dear Saigon Pho", HTML)
        removed_unscoped_names = (
            "Grilled Pork w/ Spring Rolls",
            "Grilled Pork on Rice",
            "Chicken Pad Thai",
            "Deep Fried Spring Rolls",
        )
        for name in removed_unscoped_names:
            self.assertNotIn(name, HTML)

    def test_no_third_party_font_runtime_dependency(self):
        self.assertNotIn("fonts.googleapis.com", HTML)
        self.assertNotIn("fonts.gstatic.com", HTML)

    def test_core_content_does_not_fail_hidden(self):
        self.assertIn(".reveal, .reveal.in { opacity: 1; transform: none; }", HTML)
        self.assertIn(".hero-copy > * { opacity: 1; animation: none; }", HTML)
        self.assertIn(".hero-media { opacity: 1; animation: none; }", HTML)


if __name__ == "__main__":
    unittest.main()
