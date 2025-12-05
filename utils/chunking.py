from pathlib import Path
from typing import List, Dict
from wordsegment import load, segment
import re

load()

def adaptive_chunk_markdown(
    file_path: Path,
    min_size: int = 300,
    max_size: int = 1200,
    overlap: int = 100
) -> List[Dict]:

    try:
        text = file_path.read_text(encoding="utf-8")
    except Exception as e:
        return [{"text": "", "metadata": {"error": str(e), "source_file": file_path.name}}]

    if not text.strip():
        return [{"text": "", "metadata": {"warning": "Empty file", "source_file": file_path.name}}]

    text = re.sub(r"<!--\s*image\s*-->", "", text, flags=re.IGNORECASE)
    text = re.sub(r"<!--\s*formula-not-decoded\s*-->", "[Formula]", text, flags=re.IGNORECASE)
    text = re.sub(r"<!--.*?-->", "", text, flags=re.DOTALL)

    html_entities = {"&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&nbsp;": " ", "&apos;": "'"}
    for entity, char in html_entities.items():
        text = text.replace(entity, char)

    text = re.sub(r"\n{4,}", "\n\n\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"([a-z])([A-Z])", r"\1 \2", text)

    _lines = []
    for line in text.split("\n"):
        s = line.strip()
        if (s.startswith(("```", "|")) or
            re.match(r"^#{1,6}\s+", s) or
            re.match(r"^[\*\-\+]\s+|^(\d+\.)\s+|^>\s+", s) or
            re.match(r"^\|[\-\:\|\s]+\|\s*$", s)):
            _lines.append(line)
            continue

        words = []
        for word in line.split():
            prefix = re.match(r"^[\W_]*", word).group()
            suffix = re.search(r"[\W_]*$", word).group()
            core = word[len(prefix): len(word)-len(suffix) if suffix else None]

            if len(core) > 12 and core.isalpha() and not core.isupper():
                segs = segment(core.lower())
                if len(segs) > 1 and all(len(w) > 1 for w in segs):
                    words.append(prefix + " ".join(segs) + suffix)
                    continue
            words.append(word)
        _lines.append(" ".join(words))

    text = "\n".join(_lines)
    lines = text.split("\n")

    sections = []
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        if not stripped:
            i += 1
            continue

        # Headers
        header_match = re.match(r"^(#{1,6})\s+(.*)", stripped)
        if header_match:
            level = len(header_match.group(1))
            sections.append(("header", line, i, i+1, level))
            i += 1
            continue

        # Code blocks
        if stripped.startswith("```"):
            start = i
            i += 1
            while i < len(lines) and not lines[i].strip().startswith("```"):
                i += 1
            i += 1
            content = "\n".join(lines[start:i])
            sections.append(("code", content, start, i, 0))
            continue

        # Tables
        if stripped.startswith("|") and stripped.endswith("|"):
            start = i
            i += 1
            if i < len(lines) and re.match(r"^\|[\-\:\|\s]+\|\s*$", lines[i].strip()):
                i += 1
            while i < len(lines) and lines[i].strip().startswith("|") and not re.match(r"^\|[\-\:\|\s]+\|\s*$", lines[i].strip()):
                i += 1
            content = "\n".join(lines[start:i])
            sections.append(("table", content, start, i, 0))
            continue

        if re.match(r"^[\*\-\+]\s+|^(\d+\.)\s+", stripped):
            start = i
            while i < len(lines):
                curr = lines[i].strip()
                if not curr or not re.match(r"^[\t ]*[\*\-\+]\s+|^[\t ]*(\d+\.)\s+|^[\t ]{2,}", curr):
                    break
                i += 1
            content = "\n".join(lines[start:i])
            sections.append(("list", content, start, i, 0))
            continue

        # Blockquotes
        if stripped.startswith(">"):
            start = i
            while i < len(lines) and lines[i].strip().startswith(">"):
                i += 1
            content = "\n".join(lines[start:i])
            sections.append(("quote", content, start, i, 0))
            continue

        # Paragraphs
        start = i
        para_lines = []
        while i < len(lines):
            curr = lines[i].strip()
            if not curr or curr.startswith(("```", "#", ">", "|", "*", "-", "+", "1.")) or re.match(r"^\d+\.\s+", curr):
                break
            para_lines.append(lines[i])
            i += 1
        if para_lines:
            content = "\n".join(para_lines)
            sections.append(("paragraph", content, start, i, 0))

    chunks = []
    current_text = ""
    current_sections = []
    header_stack = []

    for sec_type, content, line_start, line_end, level in sections:
        content_size = len(content)
        current_size = len(current_text)

        if sec_type == "header":
            header_text = content.lstrip("# ").strip()
            header_stack = [h for h in header_stack if h[1] < level]
            header_stack.append((header_text, level))

        should_split = False

        if sec_type == "header" and current_size >= min_size:
            should_split = True

        elif sec_type in ("code", "table") and content_size > min_size and current_size >= min_size:
            should_split = True

        elif current_size + content_size + 50 > max_size and current_size > 0:
            should_split = True

        if should_split and current_text.strip():
            header_path = " > ".join(h[0] for h in header_stack) if header_stack else "Root"
            chunks.append({
                "text": current_text.strip(),
                "metadata": {
                    "header": header_path,
                    "sections": current_sections.copy(),
                    "size": len(current_text.strip()),
                    "source_file": file_path.name,
                    "chunk_type": "mixed" if len(set(current_sections)) > 1 else current_sections[0]
                }
            })

            # Overlap
            if overlap > 0 and len(current_text) > overlap:
                current_text = current_text[-overlap:] + "\n\n" + content
            else:
                current_text = content
            current_sections = [sec_type]

        else:
            if current_text:
                current_text += "\n\n" + content
            else:
                current_text = content
            if sec_type not in current_sections:
                current_sections.append(sec_type)

    #  chunk
    if current_text.strip():
        header_path = " > ".join(h[0] for h in header_stack) if header_stack else "Root"
        chunks.append({
            "text": current_text.strip(),
            "metadata": {
                "header": header_path,
                "sections": current_sections,
                "size": len(current_text.strip()),
                "source_file": file_path.name,
                "chunk_type": "mixed" if len(set(current_sections)) > 1 else current_sections[0]
            }
        })

    if not chunks and text.strip():
        chunks.append({
            "text": text.strip(),
            "metadata": {
                "header": "Root",
                "sections": ["full_document"],
                "size": len(text.strip()),
                "source_file": file_path.name,
                "note": "Single chunk - too small to split"
            }
        })

    final_chunks = []
    for chunk in chunks:
        if chunk["metadata"]["size"] > max_size * 1.8:
            sentences = re.split(r'(?<=[.!?])\s+', chunk["text"])
            sub = ""
            for sent in sentences:
                if len(sub) + len(sent) > max_size and sub:
                    final_chunks.append({
                        "text": sub.strip(),
                        "metadata": {**chunk["metadata"], "size": len(sub.strip()), "note": "force_split_large"}
                    })
                    sub = sent
                else:
                    sub += " " + sent if sub else sent
            if sub.strip():
                final_chunks.append({
                    "text": sub.strip(),
                    "metadata": {**chunk["metadata"], "size": len(sub.strip())}
                })
        else:
            final_chunks.append(chunk)

    return final_chunks
