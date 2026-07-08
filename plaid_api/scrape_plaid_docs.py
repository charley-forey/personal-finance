#!/usr/bin/env python3
"""Scrape Plaid API documentation into organized markdown files for AI agent context."""

from __future__ import annotations

import json
import re
import time
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup, NavigableString, Tag
from markdownify import markdownify as md

BASE_URL = "https://plaid.com"
OUTPUT_DIR = Path(__file__).parent

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; PlaidDocsScraper/1.0; personal-finance-os)",
    "Accept": "text/html,application/xhtml+xml",
}

# Seed pages from the Plaid API sidebar, organized by section.
SECTIONS: list[dict] = [
    {
        "id": "00-overview",
        "title": "Overview",
        "pages": [
            ("overview", "/docs/api/", "API Reference Overview"),
            ("libraries", "/docs/api/libraries/", "Client Libraries"),
            ("versioning", "/docs/api/versioning/", "API Versioning"),
            ("postman", "/docs/api/postman/", "Postman Collection"),
            ("webhooks", "/docs/api/webhooks/", "Webhooks"),
        ],
    },
    {
        "id": "01-payments-and-funding",
        "title": "Payments and Funding",
        "pages": [
            ("auth", "/docs/api/products/auth/", "Auth"),
            ("signal-and-balance", "/docs/api/products/signal/", "Signal and Balance"),
            ("identity", "/docs/api/products/identity/", "Identity"),
            ("transfer", "/docs/api/products/transfer/", "Transfer"),
            ("investments-move", "/docs/api/products/investments-move/", "Investments Move"),
            ("payment-initiation", "/docs/api/products/payment-initiation/", "Payment Initiation (Europe)"),
            ("virtual-accounts", "/docs/api/products/virtual-accounts/", "Virtual Accounts"),
        ],
    },
    {
        "id": "02-financial-insights",
        "title": "Financial Insights",
        "pages": [
            ("transactions", "/docs/api/products/transactions/", "Transactions"),
            ("investments", "/docs/api/products/investments/", "Investments"),
            ("liabilities", "/docs/api/products/liabilities/", "Liabilities"),
            ("enrich", "/docs/api/products/enrich/", "Enrich"),
        ],
    },
    {
        "id": "03-kyc-aml-anti-fraud",
        "title": "KYC/AML and Anti-Fraud",
        "pages": [
            ("kyc-aml-users", "/docs/api/kyc-aml-users/", "Look up Dashboard Users"),
            ("identity-verification", "/docs/api/products/identity-verification/", "Identity Verification"),
            ("monitor", "/docs/api/products/monitor/", "Monitor"),
        ],
    },
    {
        "id": "04-credit-and-underwriting",
        "title": "Credit and Underwriting",
        "pages": [
            ("check", "/docs/api/products/check/", "Consumer Report (Plaid Check)"),
            ("assets", "/docs/api/products/assets/", "Assets"),
            ("statements", "/docs/api/products/statements/", "Statements"),
            ("income", "/docs/api/products/income/", "Income"),
        ],
    },
    {
        "id": "05-instant-onboarding",
        "title": "Instant Onboarding",
        "pages": [
            ("layer", "/docs/api/products/layer/", "Plaid Layer"),
        ],
    },
    {
        "id": "06-fundamentals",
        "title": "Fundamentals",
        "pages": [
            ("items", "/docs/api/items/", "Items"),
            ("accounts", "/docs/api/accounts/", "Accounts"),
            ("institutions", "/docs/api/institutions/", "Institutions"),
            ("sandbox", "/docs/api/sandbox/", "Sandbox"),
            ("link", "/docs/api/link/", "Link"),
            ("users", "/docs/api/users/", "Users"),
            ("consent", "/docs/api/consent/", "Consent"),
            ("network", "/docs/api/network/", "Network"),
            ("oauth", "/docs/api/oauth/", "OAuth"),
        ],
    },
    {
        "id": "07-partnerships",
        "title": "Partnerships",
        "pages": [
            ("processors", "/docs/api/processors/", "Processor Tokens"),
            ("processor-partners", "/docs/api/processor-partners/", "Processor Partners"),
            ("partner", "/docs/api/partner/", "Reseller Partners"),
        ],
    },
]


@dataclass
class PageMeta:
    path: str
    title: str
    section_id: str
    section_title: str
    slug: str
    source_url: str


def normalize_path(path: str) -> str:
    """Normalize a docs path to a canonical form without hash or query."""
    if path.startswith("http"):
        parsed = urlparse(path)
        path = parsed.path
    if not path.startswith("/docs/api/"):
        return ""
    path = path.split("#")[0].split("?")[0]
    if not path.endswith("/"):
        path += "/"
    return path


def slug_from_path(path: str) -> str:
    path = normalize_path(path)
    slug = path.removeprefix("/docs/api/").strip("/")
    return slug.replace("/", "--") or "overview"


def discover_api_paths(html: str) -> set[str]:
    soup = BeautifulSoup(html, "html.parser")
    paths: set[str] = set()
    for anchor in soup.select("a[href]"):
        href = anchor.get("href", "")
        normalized = normalize_path(href)
        if normalized:
            paths.add(normalized)
    return paths


def remove_noise(soup: BeautifulSoup) -> None:
    for selector in [
        "script",
        "style",
        "noscript",
        "nav",
        "header",
        "footer",
        "[class*='Sidebar']",
        "[class*='sidebar']",
        "[class*='TableOfContents']",
        "[class*='Breadcrumb']",
        "[class*='SearchBar']",
        "[class*='Footer']",
        "[class*='HeaderLinks']",
        "[class*='CopyButton']",
        "[class*='Feedback']",
    ]:
        for el in soup.select(selector):
            el.decompose()


def extract_main_content(soup: BeautifulSoup) -> Tag | None:
    for selector in [
        "main",
        "[class*='ApiReferencePage']",
        "[class*='DocPage']",
        "[class*='ContentPage']",
        "article",
    ]:
        node = soup.select_one(selector)
        if node and len(node.get_text(strip=True)) > 200:
            return node
    return soup.body


def extract_endpoints(soup: BeautifulSoup) -> list[str]:
    endpoints: list[str] = []
    seen: set[str] = set()
    for heading in soup.select("h4, h3, h2"):
        text = heading.get_text(" ", strip=True)
        if text.startswith("/") and text not in seen:
            seen.add(text)
            endpoints.append(text)
    for anchor in soup.select("a[href*='#']"):
        href = anchor.get("href", "")
        if "#" not in href:
            continue
        fragment = href.split("#", 1)[1]
        title = anchor.get_text(" ", strip=True)
        if fragment and title and not title.startswith("#"):
            label = title.lstrip("# ").strip()
            if label.startswith("/") or label.isupper() or "webhook" in label.lower():
                entry = label if label.startswith("/") else label
                if entry not in seen:
                    seen.add(entry)
                    endpoints.append(entry)
    return endpoints


def clean_markdown(text: str) -> str:
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\u00a0", " ", text)
    return text.strip() + "\n"


def build_frontmatter(meta: PageMeta, endpoints: list[str]) -> str:
    payload = {
        "title": meta.title,
        "source_url": meta.source_url,
        "section": meta.section_title,
        "section_id": meta.section_id,
        "slug": meta.slug,
        "endpoints": endpoints,
        "doc_type": "plaid_api_reference",
        "purpose": "AI agent context for personal finance operating system",
    }
    lines = ["---"]
    for key, value in payload.items():
        if isinstance(value, list):
            lines.append(f"{key}:")
            for item in value:
                lines.append(f'  - "{item}"')
        else:
            escaped = str(value).replace('"', '\\"')
            lines.append(f'{key}: "{escaped}"')
    lines.append("---\n")
    return "\n".join(lines)


def html_to_markdown(html: str, meta: PageMeta) -> tuple[str, list[str]]:
    soup = BeautifulSoup(html, "html.parser")
    content = extract_main_content(soup)
    if content is None:
        raise ValueError(f"No content found for {meta.source_url}")

    endpoints = extract_endpoints(content)
    remove_noise(content)

    heading = content.find(["h1", "h2"])
    title = meta.title
    if heading:
        title = heading.get_text(" ", strip=True) or meta.title

    body_md = md(str(content), heading_style="ATX", bullets="-", strip=["img"])
    body_md = clean_markdown(body_md)

    doc = build_frontmatter(meta, endpoints)
    doc += f"# {title}\n\n"
    doc += f"> **Source:** [{meta.source_url}]({meta.source_url})\n"
    doc += f"> **Section:** {meta.section_title}\n\n"
    if endpoints:
        doc += "## Endpoints & Webhooks on this page\n\n"
        for endpoint in endpoints:
            doc += f"- `{endpoint}`\n"
        doc += "\n---\n\n"
    doc += body_md
    return doc, endpoints


def assign_section(path: str) -> tuple[str, str, str, str]:
    """Return section_id, section_title, slug, title for a docs path."""
    normalized = normalize_path(path)
    best_match: tuple[str, str, str, str] | None = None
    best_len = -1

    for section in SECTIONS:
        for slug, section_path, title in section["pages"]:
            section_norm = normalize_path(section_path)
            if normalized == section_norm:
                return section["id"], section["title"], slug, title
            if normalized.startswith(section_norm) and len(section_norm) > best_len:
                rel = normalized.removeprefix(section_norm).strip("/")
                nested_slug = f"{slug}--{rel.replace('/', '--')}" if rel else slug
                nested_title = f"{title} / {rel.replace('-', ' ').replace('/', ' / ').title()}" if rel else title
                best_match = (section["id"], section["title"], nested_slug, nested_title)
                best_len = len(section_norm)

    if best_match:
        return best_match

    slug = slug_from_path(path)
    return "99-discovered", "Discovered Pages", slug, slug.replace("--", " / ").replace("-", " ").title()


def output_path_for(meta: PageMeta) -> Path:
    section_dir = OUTPUT_DIR / meta.section_id
    slug_parts = meta.slug.split("--")

    # Nest transfer and users sub-pages in subfolders for clarity.
    if meta.section_id == "01-payments-and-funding" and slug_parts[0] == "transfer" and len(slug_parts) > 1:
        return section_dir / "transfer" / f"{'--'.join(slug_parts[1:])}.md"
    if meta.section_id == "06-fundamentals" and slug_parts[0] == "users" and len(slug_parts) > 1:
        return section_dir / "users" / f"{'--'.join(slug_parts[1:])}.md"
    if meta.section_id == "00-overview" and slug_parts[0] == "webhooks" and len(slug_parts) > 1:
        return section_dir / "webhooks" / f"{'--'.join(slug_parts[1:])}.md"

    return section_dir / f"{meta.slug}.md"


def fetch_page(session: requests.Session, path: str) -> str:
    url = urljoin(BASE_URL, path)
    response = session.get(url, headers=HEADERS, timeout=60)
    response.raise_for_status()
    return response.text


def seed_metadata() -> dict[str, PageMeta]:
    mapping: dict[str, PageMeta] = {}
    for section in SECTIONS:
        for slug, path, title in section["pages"]:
            normalized = normalize_path(path)
            mapping[normalized] = PageMeta(
                path=normalized,
                title=title,
                section_id=section["id"],
                section_title=section["title"],
                slug=slug,
                source_url=urljoin(BASE_URL, normalized),
            )
    return mapping


def write_index(all_pages: list[PageMeta], endpoint_index: dict[str, list[str]]) -> None:
    lines = [
        "# Plaid API Documentation (Agent Context)",
        "",
        "Scraped Plaid API reference documentation for building a personal finance operating system.",
        "",
        "## How to use this corpus",
        "",
        "- Each `.md` file is a self-contained page from [Plaid API docs](https://plaid.com/docs/api/).",
        "- YAML frontmatter includes section, source URL, and extracted endpoints/webhooks.",
        "- Start with `00-overview/overview.md` for API fundamentals, auth, and environments.",
        "- Product endpoints live under section folders (`01-payments-and-funding`, `02-financial-insights`, etc.).",
        "",
        "## Sections",
        "",
    ]

    by_section: dict[str, list[PageMeta]] = {}
    for page in sorted(all_pages, key=lambda p: (p.section_id, p.slug)):
        by_section.setdefault(page.section_id, []).append(page)

    for section in SECTIONS:
        section_id = section["id"]
        lines.append(f"### {section['title']} (`{section_id}/`)")
        lines.append("")
        for page in by_section.get(section_id, []):
            rel = output_path_for(page).relative_to(OUTPUT_DIR).as_posix()
            lines.append(f"- [{page.title}]({rel})")
        lines.append("")

    discovered = by_section.get("99-discovered", [])
    if discovered:
        lines.append("### Discovered Pages (`99-discovered/`)")
        lines.append("")
        for page in discovered:
            rel = output_path_for(page).relative_to(OUTPUT_DIR).as_posix()
            lines.append(f"- [{page.title}]({rel})")
        lines.append("")

    lines.extend(["## Endpoint Index", ""])
    for endpoint in sorted(endpoint_index):
        locations = endpoint_index[endpoint]
        lines.append(f"- `{endpoint}` → {', '.join(f'`{loc}`' for loc in locations)}")

    index_path = OUTPUT_DIR / "README.md"
    index_path.write_text("\n".join(lines) + "\n", encoding="utf-8")

    manifest = {
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "base_url": BASE_URL,
        "page_count": len(all_pages),
        "pages": [
            {
                "title": p.title,
                "path": output_path_for(p).relative_to(OUTPUT_DIR).as_posix(),
                "source_url": p.source_url,
                "section": p.section_title,
            }
            for p in sorted(all_pages, key=lambda p: (p.section_id, p.slug))
        ],
    }
    (OUTPUT_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")


def main() -> None:
    session = requests.Session()
    known = seed_metadata()
    to_visit = set(known.keys())
    visited: set[str] = set()
    saved_pages: list[PageMeta] = []
    endpoint_index: dict[str, list[str]] = {}

    print(f"Starting scrape with {len(to_visit)} seed pages...")

    while to_visit:
        path = sorted(to_visit)[0]
        to_visit.remove(path)
        if path in visited:
            continue

        section_id, section_title, slug, title = assign_section(path)
        meta = known.get(path) or PageMeta(
            path=path,
            title=title,
            section_id=section_id,
            section_title=section_title,
            slug=slug,
            source_url=urljoin(BASE_URL, path),
        )

        try:
            print(f"Fetching {path}")
            html = fetch_page(session, path)
            markdown, endpoints = html_to_markdown(html, meta)

            out_path = output_path_for(meta)
            out_path.parent.mkdir(parents=True, exist_ok=True)
            out_path.write_text(markdown, encoding="utf-8")
            saved_pages.append(meta)
            visited.add(path)

            rel_path = out_path.relative_to(OUTPUT_DIR).as_posix()
            for endpoint in endpoints:
                endpoint_index.setdefault(endpoint, [])
                if rel_path not in endpoint_index[endpoint]:
                    endpoint_index[endpoint].append(rel_path)

            discovered = discover_api_paths(html)
            for discovered_path in discovered:
                if discovered_path not in visited:
                    to_visit.add(discovered_path)

            time.sleep(0.4)
        except Exception as exc:
            print(f"ERROR {path}: {exc}")

    write_index(saved_pages, endpoint_index)
    print(f"\nDone. Saved {len(saved_pages)} pages to {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
