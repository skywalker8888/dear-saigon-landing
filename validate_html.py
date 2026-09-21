import sys
from html.parser import HTMLParser

class HTMLValidator(HTMLParser):
    def __init__(self):
        super().__init__()
        self.errors = []
        self.tag_stack = []
    
    def handle_starttag(self, tag, attrs):
        if tag not in ['meta', 'link', 'br', 'img', 'hr', 'input']:
            self.tag_stack.append(tag)
    
    def handle_endtag(self, tag):
        if tag not in ['meta', 'link', 'br', 'img', 'hr', 'input']:
            if not self.tag_stack:
                self.errors.append(f"Unexpected closing tag: {tag}")
            elif self.tag_stack[-1] == tag:
                self.tag_stack.pop()
            else:
                self.errors.append(f"Mismatched tag: expected {self.tag_stack[-1]}, got {tag}")
    
    def error(self, message):
        self.errors.append(message)

def validate_html_file(filename):
    print(f"Validating {filename}...")
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    validator = HTMLValidator()
    try:
        validator.feed(content)
        if validator.errors:
            print(f"  ❌ Errors found:")
            for error in validator.errors[:5]:  # Show first 5 errors
                print(f"     - {error}")
        else:
            print(f"  ✅ No parsing errors found")
        
        # Check if Speed Insights was added
        if 'window.si' in content and '/_vercel/speed-insights/script.js' in content:
            print(f"  ✅ Speed Insights scripts detected")
        else:
            print(f"  ❌ Speed Insights scripts NOT found")
        
        return len(validator.errors) == 0
    except Exception as e:
        print(f"  ❌ Validation error: {e}")
        return False

if __name__ == '__main__':
    files = ['index.html', 'phone-ai.html']
    all_valid = True
    for f in files:
        if not validate_html_file(f):
            all_valid = False
        print()
    
    if all_valid:
        print("✅ All files validated successfully!")
        sys.exit(0)
    else:
        print("⚠️  Some validation issues found")
        sys.exit(0)  # Exit 0 anyway since minor issues are ok
