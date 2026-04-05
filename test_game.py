import sys
from playwright.sync_api import sync_playwright

SCREENSHOT_PATH = r"C:\Users\Administrator\AndroidStudioProjects\CosmicPlasma\test_screenshot.png"
FILE_URL = "file:///C:/Users/Administrator/AndroidStudioProjects/CosmicPlasma/app/src/main/assets/index.html"

results = []
console_errors = []

def log(label, passed, detail=""):
    status = "PASS" if passed else "FAIL"
    msg = f"[{status}] {label}"
    if detail:
        msg += f" — {detail}"
    results.append((passed, msg))
    print(msg)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844})

    # Capture console errors
    page.on("console", lambda msg: console_errors.append(f"[{msg.type.upper()}] {msg.text}") if msg.type in ("error", "warning") else None)
    page.on("pageerror", lambda err: console_errors.append(f"[PAGE ERROR] {err}"))

    # 1. Load the game
    try:
        page.goto(FILE_URL, wait_until="domcontentloaded", timeout=15000)
        # Wait for splash screen to potentially hide and game to init
        page.wait_for_timeout(3000)
        log("Load game", True, "Page loaded successfully")
    except Exception as e:
        log("Load game", False, str(e))
        browser.close()
        sys.exit(1)

    # 2. Take screenshot
    try:
        page.screenshot(path=SCREENSHOT_PATH, full_page=True)
        log("Take screenshot", True, SCREENSHOT_PATH)
    except Exception as e:
        log("Take screenshot", False, str(e))

    # 3. Check tap button exists and is clickable
    tap_btn = page.locator("#plasma-click-btn")
    try:
        tap_btn.wait_for(state="visible", timeout=5000)
        is_visible = tap_btn.is_visible()
        is_enabled = tap_btn.is_enabled()
        log("Tap button exists and visible", is_visible)
        log("Tap button is enabled/clickable", is_enabled)
    except Exception as e:
        log("Tap button exists", False, str(e))

    # 4. Click tap button 5 times, verify plasma counter increases
    try:
        plasma_el = page.locator("#plasma-amount")
        plasma_el.wait_for(state="visible", timeout=5000)

        def get_plasma():
            txt = plasma_el.inner_text().strip().replace(",", "").split(".")[0]
            # Handle shorthand like "1.2K" etc.
            txt = txt.replace(" ", "")
            if txt.endswith("K"):
                return float(txt[:-1]) * 1000
            if txt.endswith("M"):
                return float(txt[:-1]) * 1_000_000
            try:
                return float(txt)
            except:
                return 0

        before = get_plasma()
        for i in range(5):
            tap_btn.click()
            page.wait_for_timeout(150)
        after = get_plasma()

        increased = after > before
        log("Plasma counter increases after 5 taps", increased,
            f"Before: {before}, After: {after}")
    except Exception as e:
        log("Plasma counter tap test", False, str(e))

    # 5. Check generator items are visible
    try:
        # Ensure generators tab is active
        generators_tab = page.locator(".tab-btn[data-tab='generators']")
        generators_tab.click()
        page.wait_for_timeout(500)

        gen_list = page.locator("#generators-list")
        gen_list.wait_for(state="visible", timeout=5000)
        gen_items = page.locator("#generators-list .generator-item, #generators-list .gen-item, #generators-list > *")
        count = gen_items.count()
        log("Generator items visible", count > 0, f"Found {count} generator element(s)")
    except Exception as e:
        log("Generator items visible", False, str(e))

    # 6. Tab navigation — click each tab and verify panel becomes active
    tabs = [
        ("generators", "#tab-generators"),
        ("upgrades",   "#tab-upgrades"),
        ("prestige",   "#tab-prestige"),
        ("stats",      "#tab-stats"),
    ]
    for tab_name, panel_id in tabs:
        try:
            btn = page.locator(f".tab-btn[data-tab='{tab_name}']")
            btn.click()
            page.wait_for_timeout(400)
            panel = page.locator(panel_id)
            panel_class = panel.get_attribute("class") or ""
            is_active = "active" in panel_class
            log(f"Tab '{tab_name}' navigation", is_active,
                f"Panel classes: '{panel_class}'")
        except Exception as e:
            log(f"Tab '{tab_name}' navigation", False, str(e))

    browser.close()

# Summary
print("\n" + "="*55)
print("TEST SUMMARY")
print("="*55)
passed = sum(1 for ok, _ in results if ok)
failed = sum(1 for ok, _ in results if not ok)
print(f"Passed: {passed}  |  Failed: {failed}  |  Total: {len(results)}")

if console_errors:
    print(f"\nCONSOLE ERRORS/WARNINGS ({len(console_errors)}):")
    for e in console_errors:
        print(" ", e)
else:
    print("\nNo console errors or warnings detected.")
