#!/usr/bin/env python3
"""
Build js/data-extra.js: extra accepted answers for each prompt.

This follows the process Krillion describes in its FAQ:
  1. Aggregate answer sets from datasets (lists, dictionaries, reference data).
  2. Merge and clean them against the hand-curated answers.
  3. Score rarity mechanically against a familiarity measure. Krillion uses
     the Linguabase familiarity database; this uses wordfreq's Zipf frequency,
     calibrated against the hand-tiered answers (see CUTS below).
  4. A manual pass decides Common, Too Clever and the gem. This script only
     ever adds Uncommon, Rare and Deep Cut answers; hand tiers always win.

Inputs:
  CORPORA   path to a checkout of https://github.com/dariusk/corpora
            (default: ../dariusk/corpora next to this repo's parent)
  pip:      wordfreq, pronouncing, pycountry

Usage:  python3 tools/build_extra.py
Writes: js/data-extra.js and tools/answer-build-log.md
"""
import json, os, re, subprocess, sys, unicodedata
from collections import Counter, OrderedDict

import wordfreq, pronouncing, pycountry

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CORPORA = os.environ.get("CORPORA", os.path.join(os.path.dirname(ROOT), "dariusk", "corpora"))
DATA = os.path.join(CORPORA, "data")

# Zipf cut-offs, calibrated on the hand tiers (medians: Uncommon 3.29, Rare 2.68, Deep Cut 1.82).
CUTS = [(3.3, "s"), (2.2, "r"), (-1, "d")]


def compact(raw):
    """Same normalisation as engine.js compact()."""
    s = unicodedata.normalize("NFD", str(raw))
    s = "".join(c for c in s if unicodedata.category(c) != "Mn").lower()
    s = s.replace("&", " and ").replace("+", "plus").replace("#", "sharp")
    s = re.sub(r"['’`]", "", s)
    s = re.sub(r"[^a-z0-9]+", " ", s).strip()
    s = re.sub(r"^(the|a|an) ", "", s)
    return s.replace(" ", "")


def tier_for(name):
    z = wordfreq.zipf_frequency(name.lower(), "en")
    for cut, t in CUTS:
        if z >= cut:
            return t, z


def load(rel):
    with open(os.path.join(DATA, rel), encoding="utf-8") as f:
        return json.load(f)


def strings(x, field="name"):
    """Flatten a dataset value into display strings."""
    out = []
    if isinstance(x, str):
        out.append(x)
    elif isinstance(x, list):
        for v in x:
            if isinstance(v, str):
                out.append(v)
            elif isinstance(v, list) and v and isinstance(v[0], str):
                out.append(v[0])
            elif isinstance(v, dict):
                for k in (field, "name", "title", "identifier"):
                    if isinstance(v.get(k), str):
                        out.append(v[k]); break
    elif isinstance(x, dict):
        for v in x.values():
            out.extend(strings(v, field))
    return out


def tidy(name):
    if "/" in name:                                    # "Submarine/Sub sandwich" -> aliases
        parts = [tidy(x) for x in name.split("/")]
        parts = [x for x in parts if x]
        return "=".join(parts) if parts else None
    name = re.sub(r"\s*\([^)]*\)", "", name)          # drop parentheticals
    name = re.sub(r"\s+", " ", name).strip(" ,;-")
    if not name or len(name) > 40 or re.search(r"\d", name):
        return None
    if name.islower():
        name = " ".join(w if w in ("and", "of", "the", "de", "la", "du") else w[:1].upper() + w[1:] for w in name.split(" "))
    return name


def titled(words):
    return [w[:1].upper() + w[1:] for w in words]


# ---------- sources per prompt ----------
def src_birds():
    out = []
    for f, k in (("animals/birds_north_america.json", "birds"), ("animals/birds_antarctica.json", "birds")):
        for grp in load(f)[k]:
            out.extend(strings(grp.get("members", []) if isinstance(grp, dict) else grp))
    out.extend(load("animals/mainly-ducks.json")["ducks"])
    return out


# CMU Pronouncing Dictionary rhymes, kept only after a manual pass (names and
# brand words removed). Run vet_rhymes() to see fresh candidates.
VETTED_RHYMES = {
    "cat": "that at fat flat sat chat combat hat bat pat rat stat mat vat matte brat tat spat scat splat gnat begat slat nonfat",
    "light": "right might night white quite fight site tonight write despite flight bright tight sight height alright bite "
             "invite knight slight wright overnight spite delight polite outright upright cite rite kite lite rewrite plight "
             "reunite ignite fright excite recite blight wight sprite byte incite mite electrolyte alight onsite uptight indict "
             "trite forthright sleight bight impolite contrite overwrite reignite nonwhite terabyte",
}


def src_rhymes(word):
    ok = set(VETTED_RHYMES[word].split())
    return titled(sorted(w for w in pronouncing.rhymes(word) if w in ok))


def vet_rhymes(word, minz=2.0):
    return sorted({w for w in pronouncing.rhymes(word) if wordfreq.zipf_frequency(w, "en") >= minz and w.isalpha()})


def src_suffix(suffix, minz=1.0):
    return titled([w for w in wordfreq.top_n_list("en", 400000) if w.endswith(suffix) and w != suffix.strip("-")
                   and w.isalpha() and wordfreq.zipf_frequency(w, "en") >= minz])


def src_languages():
    names = []
    for l in pycountry.languages:
        if getattr(l, "type", "") in ("L", "E", "A", "H") and getattr(l, "scope", "") in ("I", "M"):
            names.append(l.name)
    return names


def src_blues():
    hues = ("blue", "azure", "navy", "teal", "cyan", "cerulean", "indigo", "sapphire", "cobalt", "ultramarine",
            "periwinkle", "turquoise", "aqua", "denim", "cornflower", "steel blue", "prussian")
    names = [c["name"] for c in load("colors/wikipedia.json")]
    names += strings(load("colors/crayola.json"))
    return [n for n in names if any(h in n.lower() for h in hues) and n.lower() != "blue"]


def src_texas():
    return [c["city"] for c in load("geography/us_cities.json")["cities"] if c.get("state") == "Texas"]


def src_greek_gods():
    return load("mythology/greek_gods.json")["greek_gods"] + load("mythology/greek_titans.json")["greek_titans"]


def src_myth():
    return load("mythology/monsters.json")["names"] + load("mythology/greek_monsters.json")["greek_monsters"]


SOURCES = OrderedDict([
    ("dog", lambda: load("animals/dogs.json")["dogs"]),
    ("catbreed", lambda: load("animals/cats.json")["cats"]),
    ("dinosaur", lambda: load("animals/dinosaurs.json")["dinosaurs"]),
    ("bird", src_birds),
    ("element", lambda: strings(load("science/elements.json")["elements"])),
    ("fruit", lambda: load("foods/fruits.json")["fruits"]),
    ("vegetable", lambda: load("foods/vegetables.json")["vegetables"]),
    ("cheese", lambda: load("foods/curds.json")["curds"]),
    ("spice", lambda: load("foods/herbs_n_spices.json")["herbs"] + load("foods/herbs_n_spices.json")["spices"]),
    ("bread", lambda: load("foods/breads_and_pastries.json")["breads"]),
    ("beer", lambda: load("foods/beer_styles.json")["beer_styles"]),
    ("cocktail", lambda: load("foods/iba_cocktails.json")["cocktails"]),
    ("condiment", lambda: load("foods/condiments.json")["condiments"]),
    ("pizzatopping", lambda: load("foods/pizzaToppings.json")["pizzaToppings"]),
    ("sandwich", lambda: strings(load("foods/sandwiches.json")["sandwiches"])),
    ("fish", lambda: load("foods/fish.json")["fish"]),
    ("flower", lambda: load("plants/flowers.json")["flowers"]),
    ("pokemon", lambda: strings(load("games/pokemon.json")["pokemon"])),
    ("scientist", lambda: load("humans/scientists.json")["scientists"]),
    ("myth", src_myth),
    ("greekgod", src_greek_gods),
    ("river", lambda: strings(load("geography/rivers.json")["rivers"])),
    ("instrument", lambda: load("music/instruments.json")["instruments"]),
    ("musicgenre", lambda: load("music/genres.json")["genres"]),
    ("gem", lambda: load("materials/gemstones.json")["gemstones"]),
    ("fabric", lambda: load("materials/fabrics.json")["fabrics"]),
    ("disease", lambda: strings(load("medicine/infectious_diseases.json")["diseases"])),
    ("clothing", lambda: load("objects/clothing.json")["clothes"]),
    ("profession", lambda: load("humans/occupations.json")["occupations"] + load("humans/obsolete-occupations.json")["occupations"]),
    ("boardgame", lambda: load("games/board_games.json")["games"]),
    ("language", lambda: load("technology/programming_languages.json")),
    ("sport", lambda: load("sports/sports.json")["sports"]),
    ("carbrand", lambda: load("corporations/cars.json")["cars"]),
    ("texascity", src_texas),
    ("shade", src_blues),
    ("spokenlang", src_languages),
    ("rhymecat", lambda: src_rhymes("cat")),
    ("rhymelight", lambda: src_rhymes("light")),
    ("ology", lambda: src_suffix("ology")),
    ("phobia", lambda: src_suffix("phobia", 0.5)),
])

# Words that shouldn't be accepted even if a dataset lists them.
BLOCK = {
    "disease": re.compile(r"by infectious agent|^(acquired|inherited|benign|malignant|primary|secondary) "),
    "profession": re.compile(r"^(assistant|other|all other|miscellaneous) "),
    "cheese": re.compile(r"cheese product|processed cheese food|^(butter|yogh?urt|kefir|cream|sour cream|buttermilk|ghee|clotted cream|creme fraiche|crème fraîche)$"),
    "sport": re.compile(r"\bsports?$"),
}
# A single everyday word scores too easily ("Milk" river, "Sake" language).
COMMON_WORD_ZIPF = 4.6
STRICT_COMMON = {"spokenlang": 3.0, "river": 4.0, "cocktail": 4.2}


def edit1(a, b):
    """True when a and b differ by at most one insert, delete, swap or substitution."""
    if a == b:
        return True
    la, lb = len(a), len(b)
    if abs(la - lb) > 1:
        return False
    if la == lb:
        diff = [i for i in range(la) if a[i] != b[i]]
        return len(diff) == 1 or (len(diff) == 2 and diff[1] == diff[0] + 1 and a[diff[0]] == b[diff[1]] and a[diff[1]] == b[diff[0]])
    if la > lb:
        a, b = b, a
    i = 0
    while i < len(a) and a[i] == b[i]:
        i += 1
    return a[i:] == b[i + 1:]


def hand_keys():
    js = r"""
for (const f of ["data","data2","data3","data4","data5","data6"]) require("./js/"+f+".js");
const CP=require("./js/engine.js"),E=CP.engine;const o={};
for(const p of CP.PROMPTS){const a=E.indexFor(p).answers;o[p.id]={keys:a.flatMap(x=>x.keys),gem:a.find(x=>x.tier==="k").keys};}
process.stdout.write(JSON.stringify(o));"""
    return json.loads(subprocess.check_output(["node", "-e", js], cwd=ROOT))


def main():
    if not os.path.isdir(DATA):
        sys.exit("corpora checkout not found at %s (set CORPORA=...)" % CORPORA)
    hand = hand_keys()
    extra, log = OrderedDict(), []
    for pid, fn in SOURCES.items():
        if pid not in hand:
            sys.exit("unknown prompt id " + pid)
        taken = set(hand[pid]["keys"])
        gem = hand[pid]["gem"]
        tiers = {"s": [], "r": [], "d": []}
        seen, kept, dropped = set(), [], Counter()
        cands = []
        for raw in fn():
            entry = tidy(raw)
            if not entry:
                dropped["unusable"] += 1; continue
            cands.append(entry)
        # most familiar spelling first, so near-duplicates keep the common form
        cands.sort(key=lambda e: -wordfreq.zipf_frequency(e.split("=")[0].lower(), "en"))
        long_taken = [t for t in taken if len(t) >= 6]
        for entry in cands:
            names = entry.split("=")
            keys = [compact(n) for n in names]
            k = keys[0]
            if len(k) < 3 or any(x in seen for x in keys):
                continue
            seen.update(keys)
            if any(x in taken or (x.endswith("s") and x[:-1] in taken) or x + "s" in taken for x in keys):
                dropped["already listed"] += 1; continue
            if len(k) >= 6 and any(edit1(k, t) for t in long_taken + kept):
                dropped["spelling variant"] += 1; continue
            if any(len(x) >= 4 and (g.startswith(x) or x.startswith(g)) for x in keys for g in gem):
                dropped["overlaps gem"] += 1; continue
            if pid in BLOCK and BLOCK[pid].search(entry.lower()):
                dropped["blocked"] += 1; continue
            if " " not in names[0] and wordfreq.zipf_frequency(names[0].lower(), "en") >= STRICT_COMMON.get(pid, COMMON_WORD_ZIPF):
                dropped["everyday word"] += 1; continue
            if len(k) >= 6:
                kept.append(k)
            t, z = tier_for(names[0])
            tiers[t].append(entry)
        added = sum(len(v) for v in tiers.values())
        extra[pid] = {t: "|".join(sorted(v, key=str.lower)) for t, v in tiers.items() if v}
        log.append((pid, len(hand[pid]["keys"]), added, {t: len(v) for t, v in tiers.items()}, dict(dropped)))

    with open(os.path.join(ROOT, "js", "data-extra.js"), "w", encoding="utf-8") as f:
        f.write("/* Generated by tools/build_extra.py. Do not edit by hand: change the script or the hand data. */\n")
        f.write("(function (root) {\n  root.CP = root.CP || {};\n  root.CP.EXTRA = ")
        f.write(json.dumps(extra, ensure_ascii=False, indent=1))
        f.write(";\n})(typeof window !== \"undefined\" ? window : globalThis);\n")

    total = sum(x[2] for x in log)
    lines = ["# Answer build log", "",
             "Generated by `tools/build_extra.py`. Extra answers come from the datasets listed in that script,",
             "are de-duplicated against the hand-curated answers, and are tiered by word frequency",
             "(Zipf ≥ 3.3 Uncommon, ≥ 2.2 Rare, otherwise Deep Cut). Hand tiers always win.", "",
             "Total extra answers: **%d** across %d prompts." % (total, len(log)), "",
             "| Prompt | Hand keys | Added | Uncommon | Rare | Deep Cut | Skipped |", "|---|---|---|---|---|---|---|"]
    for pid, hk, added, t, d in log:
        lines.append("| %s | %d | %d | %d | %d | %d | %s |" % (pid, hk, added, t["s"], t["r"], t["d"], ", ".join("%s %d" % kv for kv in d.items()) or "—"))
    with open(os.path.join(ROOT, "tools", "answer-build-log.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print("added %d answers across %d prompts" % (total, len(log)))


if __name__ == "__main__":
    main()
