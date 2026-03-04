"""Visual SEO Audit Script - captures screenshots and DOM analysis."""
import sys
import io
import json

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

from playwright.sync_api import sync_playwright

URL = "https://www.bilibilisfactory.tech/"
DESKTOP_OUTPUT = "/tmp/seo-audit-desktop.png"
MOBILE_OUTPUT = "/tmp/seo-audit-mobile.png"

DESKTOP_JS = """
() => {
    const d = {};
    d.title = document.title || null;
    const md = document.querySelector("meta[name='description']");
    d.metaDescription = md ? md.getAttribute("content") : null;
    const can = document.querySelector("link[rel='canonical']");
    d.canonical = can ? can.getAttribute("href") : null;
    const ogt = document.querySelector("meta[property='og:title']");
    d.ogTitle = ogt ? ogt.getAttribute("content") : null;
    const ogd = document.querySelector("meta[property='og:description']");
    d.ogDescription = ogd ? ogd.getAttribute("content") : null;
    const ogi = document.querySelector("meta[property='og:image']");
    d.ogImage = ogi ? ogi.getAttribute("content") : null;
    const vp = document.querySelector("meta[name='viewport']");
    d.viewportMeta = vp ? vp.getAttribute("content") : null;

    const h1s = Array.from(document.querySelectorAll("h1"));
    d.h1Count = h1s.length;
    d.h1Texts = h1s.map(el => ({
        text: el.textContent.trim().substring(0, 120),
        visible: el.offsetParent !== null,
        rect: el.getBoundingClientRect().toJSON()
    }));
    d.h2Texts = Array.from(document.querySelectorAll("h2"))
        .map(el => el.textContent.trim().substring(0, 80));

    const imgs = Array.from(document.querySelectorAll("img"));
    d.totalImages = imgs.length;
    d.imagesWithoutAlt = imgs
        .filter(i => !i.getAttribute("alt") || i.getAttribute("alt").trim() === "")
        .map(i => ({ src: i.src.substring(0, 100), alt: i.getAttribute("alt") }));
    d.imagesWithAlt = imgs
        .filter(i => i.getAttribute("alt") && i.getAttribute("alt").trim() !== "").length;

    const links = Array.from(document.querySelectorAll("a"));
    d.totalLinks = links.length;
    d.linksWithoutText = links
        .filter(a => !a.textContent.trim() && !a.getAttribute("aria-label"))
        .map(a => a.href.substring(0, 80));

    const btns = Array.from(document.querySelectorAll("button, [role='button'], a")).slice(0, 25);
    d.ctaElements = btns.map(el => ({
        tag: el.tagName,
        text: el.textContent.trim().substring(0, 60),
        rect: el.getBoundingClientRect().toJSON(),
        visible: el.offsetParent !== null
    }));

    const nav = document.querySelector("nav, header nav, [role='navigation']");
    d.navFound = !!nav;
    d.navRect = nav ? nav.getBoundingClientRect().toJSON() : null;
    d.navLinks = nav
        ? Array.from(nav.querySelectorAll("a")).map(a => a.textContent.trim().substring(0, 40))
        : [];

    const jld = Array.from(document.querySelectorAll("script[type='application/ld+json']"));
    d.structuredDataCount = jld.length;
    d.structuredData = jld.map(s => {
        try { return JSON.parse(s.textContent); } catch(e) { return "parse error"; }
    });

    d.htmlLang = document.documentElement.getAttribute("lang");
    d.lazyImageCount = Array.from(document.querySelectorAll("img[loading='lazy']")).length;
    d.ctaAboveFold = d.ctaElements.filter(el => el.rect.top < 800 && el.rect.top >= 0 && el.visible);

    d.bodyTextSample = document.body.innerText.trim().substring(0, 500);

    const hiddenEls = Array.from(document.querySelectorAll("*"))
        .filter(el => {
            const s = window.getComputedStyle(el);
            const hasText = el.textContent.trim().length > 10 && el.children.length === 0;
            return hasText && (s.display === "none" || s.visibility === "hidden");
        })
        .slice(0, 10)
        .map(el => ({ tag: el.tagName, text: el.textContent.trim().substring(0, 80) }));
    d.hiddenTextElements = hiddenEls;

    return d;
}
"""

MOBILE_JS = """
() => {
    const d = {};
    d.hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;
    d.scrollWidth = document.documentElement.scrollWidth;
    d.viewportWidth = window.innerWidth;

    const textEls = Array.from(document.querySelectorAll("p, span, li, a, h1, h2, h3, h4"))
        .filter(el => el.offsetParent !== null && el.textContent.trim().length > 3)
        .slice(0, 25);
    d.fontSizes = textEls.map(el => ({
        tag: el.tagName,
        text: el.textContent.trim().substring(0, 40),
        fontSize: parseFloat(window.getComputedStyle(el).fontSize)
    }));

    const interactive = Array.from(document.querySelectorAll("a, button, [role='button'], input, select"));
    d.smallTouchTargets = interactive
        .filter(el => {
            const r = el.getBoundingClientRect();
            return el.offsetParent !== null && (r.width < 44 || r.height < 44) && r.width > 0;
        })
        .slice(0, 10)
        .map(el => ({
            tag: el.tagName,
            text: el.textContent.trim().substring(0, 40) || el.getAttribute("aria-label") || "",
            width: Math.round(el.getBoundingClientRect().width),
            height: Math.round(el.getBoundingClientRect().height)
        }));

    const hb = document.querySelector("[class*='hamburger'], [class*='menu-icon'], [class*='burger'], button[aria-label*='menu'], button[aria-label*='Menu'], button[aria-label*='nav']");
    d.hamburgerFound = !!hb;
    d.hamburgerText = hb ? (hb.textContent.trim() || hb.getAttribute("aria-label") || "found") : null;

    const h1 = document.querySelector("h1");
    d.h1MobileRect = h1 ? h1.getBoundingClientRect().toJSON() : null;
    d.h1AboveFoldMobile = h1 ? h1.getBoundingClientRect().top < 844 : false;

    const nav = document.querySelector("nav, [role='navigation']");
    d.mobileNavVisible = nav ? nav.offsetParent !== null : false;
    d.mobileNavRect = nav ? nav.getBoundingClientRect().toJSON() : null;

    const overflowEls = Array.from(document.querySelectorAll("*"))
        .filter(el => {
            const r = el.getBoundingClientRect();
            return r.right > window.innerWidth + 5 && r.width > 0 && el.textContent.trim().length > 0;
        })
        .slice(0, 5)
        .map(el => ({
            tag: el.tagName,
            cls: el.className.substring(0, 60),
            overflowBy: Math.round(el.getBoundingClientRect().right - window.innerWidth)
        }));
    d.overflowElements = overflowEls;

    return d;
}
"""


def run():
    results = {}
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # --- Desktop ---
        dctx = browser.new_context(
            viewport={"width": 1280, "height": 800},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        )
        dp = dctx.new_page()
        dp.goto(URL, wait_until="networkidle", timeout=30000)
        dp.wait_for_timeout(2000)
        dp.screenshot(path=DESKTOP_OUTPUT, full_page=False)
        print("Desktop screenshot saved to", DESKTOP_OUTPUT)

        results["desktop_seo"] = dp.evaluate(DESKTOP_JS)
        dctx.close()

        # --- Mobile ---
        mctx = browser.new_context(
            viewport={"width": 390, "height": 844},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1",
            is_mobile=True,
            has_touch=True,
            device_scale_factor=3,
        )
        mp = mctx.new_page()
        mp.goto(URL, wait_until="networkidle", timeout=30000)
        mp.wait_for_timeout(2000)
        mp.screenshot(path=MOBILE_OUTPUT, full_page=False)
        print("Mobile screenshot saved to", MOBILE_OUTPUT)

        results["mobile_checks"] = mp.evaluate(MOBILE_JS)
        mctx.close()
        browser.close()

    return results


if __name__ == "__main__":
    data = run()
    print("\n=== SEO AUDIT DATA ===")
    print(json.dumps(data, indent=2, ensure_ascii=True))
