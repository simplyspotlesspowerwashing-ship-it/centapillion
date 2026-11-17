#!/usr/bin/env python3
"""
Fetch complete answer lists from Wikidata for each prompt, with a popularity
signal: the number of Wikipedia language editions covering each item
("sitelinks"). Results are cached in tools/wikidata/<prompt>.json so the
answer build (tools/build_extra.py) runs offline and reproducibly.

Usage:  python3 tools/wikidata_fetch.py            # fetch anything not cached
        python3 tools/wikidata_fetch.py dog lake   # refetch these prompts
"""
import json, os, sys, time, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, "tools", "wikidata")
UA = "centapillion-build/1.0 (trivia game answer lists)"

ISA = "wdt:P31/wdt:P279*"          # instance of (any subclass of)
KIND = "wdt:P31|wdt:P279"          # instance of, or a direct subclass of (a "type of" thing)


def taxon(clade, min_sl):
    """Species/genera under a clade, labelled with their English common name."""
    return {"where": "?x wdt:P171+ wd:%s . ?x wdt:P1843 ?cn . FILTER(lang(?cn) = 'en')" % clade, "min": min_sl, "common": True}


# prompt id -> graph pattern selecting ?x, and a minimum sitelink count
SPEC = {
    # current sovereign states only (no dissolution date), current capitals only (no end date)
    "africa": {"where": "?x wdt:P31 wd:Q3624078 ; wdt:P30 wd:Q15 . FILTER NOT EXISTS { ?x wdt:P576 ?end }", "min": 0},
    "asia": {"where": "?x wdt:P31 wd:Q3624078 ; wdt:P30 wd:Q48 . FILTER NOT EXISTS { ?x wdt:P576 ?end }", "min": 0},
    "europe": {"where": "?x wdt:P31 wd:Q3624078 ; wdt:P30 wd:Q46 . FILTER NOT EXISTS { ?x wdt:P576 ?end }", "min": 0},
    "capital": {"where": "?c wdt:P31 wd:Q3624078 ; wdt:P30 wd:Q46 ; p:P36 ?st . ?st ps:P36 ?x . "
                         "FILTER NOT EXISTS { ?c wdt:P576 ?end } FILTER NOT EXISTS { ?st pq:P582 ?stop }", "min": 0},
    "island": {"where": "?x wdt:P31 wd:Q23442 .", "min": 20},
    "lake": {"where": "?x wdt:P31 wd:Q23397 .", "min": 15},
    "river": {"where": "?x wdt:P31 wd:Q4022 .", "min": 20},
    "desert": {"where": "?x wdt:P31 wd:Q8514 .", "min": 4},
    "waterfall": {"where": "?x wdt:P31 wd:Q34038 .", "min": 5},
    "volcano": {"where": "?x %s wd:Q8072 ." % ISA, "min": 10},
    "mountain": {"where": "?x wdt:P31 wd:Q8502 .", "min": 25},
    "bridge": {"where": "?x wdt:P31 wd:Q12280 .", "min": 15},
    "japancity": {"where": "?x wdt:P31 wd:Q494721 .", "min": 3},
    "italycity": {"where": "?x wdt:P31 wd:Q747074 .", "min": 30},
    "germanycity": {"where": "?x wdt:P17 wd:Q183 ; wdt:P31 ?t . ?t wdt:P279* wd:Q515 .", "min": 25},
    "chinacity": {"where": "?x wdt:P17 wd:Q148 ; wdt:P31 ?t . ?t wdt:P279* wd:Q515 .", "min": 20},
    "australiacity": {"where": "?x wdt:P17 wd:Q408 ; wdt:P31 ?t . ?t wdt:P279* wd:Q515 .", "min": 8},
    "texascity": {"where": "?x wdt:P31 wd:Q1093829 ; wdt:P131+ wd:Q1439 .", "min": 6},
    "painter": {"where": "?x wdt:P106 wd:Q1028181 . FILTER EXISTS { ?w wdt:P170 ?x ; wdt:P31 wd:Q3305213 . }", "min": 45},  # has a painting on Wikidata (drops hobbyists)
    "composer": {"where": "?x wdt:P106 wd:Q36834 ; wdt:P569 ?b . FILTER(YEAR(?b) < 1935)", "min": 30},
    "scientist": {"where": "?x wdt:P106/wdt:P279* wd:Q901 .", "min": 60},
    "disney": {"where": "?x wdt:P31 wd:Q11424 ; wdt:P272 wd:Q1047410 .", "min": 0},
    "pixar": {"where": "VALUES ?t { wd:Q11424 wd:Q202866 } ?x wdt:P31 ?t ; wdt:P272 wd:Q127552 .", "min": 0},  # features only
    "bestpicture": {"where": "?x wdt:P31 wd:Q11424 ; wdt:P166 wd:Q102427 .", "min": 0},  # films, not producers
    "videogame": {"where": "?x wdt:P31 wd:Q7889 .", "min": 35},
    "console": {"where": "?x %s wd:Q8076 ." % ISA, "min": 3},
    "sitcom": {"where": "?x wdt:P136 wd:Q170238 .", "min": 12},
    "musical": {"where": "?x wdt:P136 wd:Q2743 . MINUS { ?x wdt:P31/wdt:P279* wd:Q11424 } MINUS { ?x wdt:P31/wdt:P279* wd:Q482994 }", "min": 6},  # stage musicals: genre musical, not films/albums
    "band": {"where": "?x wdt:P31 wd:Q5741069 .", "min": 30},
    "shakespeare": {"where": "?x wdt:P50 wd:Q692 ; wdt:P31/wdt:P279* wd:Q25379 .", "min": 0},
    "harrypotter": {"where": "?x wdt:P1080 wd:Q5410773 ; wdt:P31/wdt:P279* wd:Q95074 .", "min": 0},
    "simpsons": {"where": "?x wdt:P1441 wd:Q886 .", "min": 0},
    "starwars": {"where": "?x wdt:P8345 wd:Q462 ; wdt:P31/wdt:P279* wd:Q95074 .", "min": 0},
    "mario": {"where": "?x wdt:P8345 wd:Q12379 ; wdt:P31/wdt:P279* wd:Q95074 .", "min": 0},
    "pokemon": {"where": "?x wdt:P31 wd:Q3966183 .", "min": 0},
    "greekgod": {"where": "?x wdt:P31 wd:Q22989102 .", "min": 0},
    "myth": {"where": "?x wdt:P31 wd:Q2239243 .", "min": 8},
    "cheese": {"where": "?x %s wd:Q10943 ." % KIND, "min": 3},
    "dog": {"where": "?x wdt:P31 wd:Q39367 .", "min": 0},
    "catbreed": {"where": "?x wdt:P31 wd:Q43577 .", "min": 0},
    "cocktail": {"where": "?x %s wd:Q134768 ." % KIND, "min": 2},
    "dessert": {"where": "?x %s wd:Q182940 ." % KIND, "min": 4},
    "sandwich": {"where": "?x %s wd:Q28803 ." % KIND, "min": 2},
    "soup": {"where": "?x %s wd:Q41415 ." % KIND, "min": 3},
    "condiment": {"where": "{ ?x %s wd:Q2596997 . } UNION { ?x %s wd:Q178359 . }" % (KIND, KIND), "min": 3},
    "pasta": {"where": "?x %s wd:Q178 ." % KIND, "min": 2},
    "dumpling": {"where": "?x %s wd:Q1854639 ." % KIND, "min": 2},
    "cookie": {"where": "?x %s wd:Q13266 ." % KIND, "min": 2},
    "fastfood": {"where": "?x wdt:P31 wd:Q18509232 .", "min": 5},
    "candy": {"where": "?x %s wd:Q1361086 ." % KIND, "min": 2},
    "cereal": {"where": "?x %s wd:Q768267 ." % KIND, "min": 1},
    "soda": {"where": "?x %s wd:Q147538 ." % KIND, "min": 3},
    "beer": {"where": "?x %s wd:Q1998962 ." % KIND, "min": 2},
    "bread": {"where": "?x %s wd:Q7802 ." % KIND, "min": 3},
    "tea": {"where": "?x %s wd:Q6097 ." % KIND, "min": 3},
    "mushroom": {"where": "?x %s wd:Q654236 ." % KIND, "min": 3},
    "potato": {"where": "?x %s wd:Q10514020 ." % KIND, "min": 2},
    "salad": {"where": "?x %s wd:Q9266 ." % KIND, "min": 2},
    "spice": {"where": "{ ?x %s wd:Q42527 . } UNION { ?x %s wd:Q207123 . }" % (KIND, KIND), "min": 5},
    "houseplant": {"where": "?x %s wd:Q203834 ." % KIND, "min": 5},
    "italianfood": {"where": "?x wdt:P2012 wd:Q192786 . MINUS { ?x wdt:P31/wdt:P279* wd:Q43229 } MINUS { ?x wdt:P31/wdt:P279* wd:Q11707 }", "min": 3},  # dishes, not restaurants
    "japanesefood": {"where": "?x wdt:P2012 wd:Q234138 . MINUS { ?x wdt:P31/wdt:P279* wd:Q43229 } MINUS { ?x wdt:P31/wdt:P279* wd:Q11707 }", "min": 3},  # dishes, not restaurants
    "mexicanfood": {"where": "?x wdt:P2012 wd:Q207965 . MINUS { ?x wdt:P31/wdt:P279* wd:Q43229 } MINUS { ?x wdt:P31/wdt:P279* wd:Q11707 }", "min": 3},  # dishes, not restaurants
    "indianfood": {"where": "?x wdt:P2012 wd:Q192087 . MINUS { ?x wdt:P31/wdt:P279* wd:Q43229 } MINUS { ?x wdt:P31/wdt:P279* wd:Q11707 }", "min": 3},  # dishes, not restaurants
    "fairytale": {"where": "?x wdt:P31 wd:Q699 .", "min": 8},
    "nurseryrhyme": {"where": "?x wdt:P31 wd:Q1123037 .", "min": 2},
    "painting": {"where": "?x wdt:P31 wd:Q3305213 .", "min": 25},
    "cartoon": {"where": "?x wdt:P31 wd:Q15711870 .", "min": 15},
    "holiday": {"where": "{ ?x wdt:P31 wd:Q1197685 . } UNION { ?x wdt:P31 wd:Q1445650 . }", "min": 15},
    "language": {"where": "?x wdt:P31 wd:Q9143 .", "min": 6},
    "disease": {"where": "?x wdt:P31 wd:Q12136 .", "min": 40},
    "moon": {"where": "VALUES ?p { wd:Q2 wd:Q111 wd:Q319 wd:Q193 wd:Q324 wd:Q332 wd:Q339 } ?x wdt:P397 ?p ; wdt:P31/wdt:P279* wd:Q2537 .", "min": 0},  # moons of the planets and Pluto
    "constellation": {"where": "?x wdt:P31 wd:Q8928 .", "min": 0},
    "currency": {"where": "?x wdt:P31 wd:Q8142 .", "min": 10},
    "unit": {"where": "?x %s wd:Q47574 ." % KIND, "min": 15},
    "instrument": {"where": "?x %s wd:Q34379 ." % KIND, "min": 15},
    "musicgenre": {"where": "?x wdt:P31 wd:Q188451 .", "min": 20},
    "dance": {"where": "?x %s wd:Q11639 ." % KIND, "min": 10},
    "sport": {"where": "?x %s wd:Q349 ." % KIND, "min": 15},
    "boardgame": {"where": "?x wdt:P31 wd:Q131436 .", "min": 5},
    "card": {"where": "?x wdt:P31 wd:Q142714 .", "min": 5},
    "carbrand": {"where": "?x wdt:P31 wd:Q786820 .", "min": 15},
    "profession": {"where": "?x wdt:P31 wd:Q28640 .", "min": 20},
    "toy": {"where": "?x %s wd:Q11422 ." % KIND, "min": 10},
    "clothing": {"where": "?x wdt:P279 wd:Q11460 .", "min": 10},
    "hat": {"where": "?x %s wd:Q80151 ." % KIND, "min": 5},
    "shoe": {"where": "?x %s wd:Q22676 ." % KIND, "min": 5},
    "furniture": {"where": "?x wdt:P279 wd:Q14745 .", "min": 8},
    "tool": {"where": "?x %s wd:Q2578402 ." % KIND, "min": 5},
    "gem": {"where": "?x %s wd:Q83437 ." % KIND, "min": 5},
    "fabric": {"where": "?x %s wd:Q28823 ." % KIND, "min": 5},
    "nut": {"where": "?x %s wd:Q11009 ." % KIND, "min": 5},
    "mammal": taxon("Q7377", 30),
    "shark": taxon("Q7372", 5),
    "rodent": taxon("Q10850", 12),
    "primate": taxon("Q7380", 12),
    "whale": taxon("Q160", 6),
    "amphibian": taxon("Q10908", 20),
    "reptile": taxon("Q10811", 25),
    "bird": taxon("Q5113", 40),
    "insect": taxon("Q1390", 40),
}


def sparql(q, tries=4):
    err = None
    for i in range(tries):
        try:
            url = "https://query.wikidata.org/sparql?" + urllib.parse.urlencode({"query": q, "format": "json"})
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/sparql-results+json"})
            return json.load(urllib.request.urlopen(req, timeout=120))["results"]["bindings"]
        except Exception as e:
            err = e
            time.sleep(70)
    raise err


def query(spec):
    name = "?cn" if spec.get("common") else "?l"
    label = "" if spec.get("common") else "?x rdfs:label ?l . FILTER(lang(?l) = 'en')"
    return ("SELECT DISTINCT ?x %s ?sl WHERE { %s ?x wikibase:sitelinks ?sl . FILTER(?sl >= %d) %s }"
            % (name, spec["where"], spec["min"], label))


def main():
    os.makedirs(CACHE, exist_ok=True)
    only = set(sys.argv[1:])
    for pid, spec in SPEC.items():
        path = os.path.join(CACHE, pid + ".json")
        if only and pid not in only:
            continue
        if not only and os.path.exists(path):
            continue
        t = time.time()
        try:
            rows = sparql(query(spec))
        except Exception as e:
            print("%-14s FAILED %s" % (pid, e)); continue
        key = "cn" if spec.get("common") else "l"
        items = {}
        for r in rows:
            name, sl = r[key]["value"], int(r["sl"]["value"])
            if name not in items or sl > items[name]:
                items[name] = sl
        out = sorted(([n, s] for n, s in items.items()), key=lambda x: -x[1])
        with open(path, "w", encoding="utf-8") as f:
            json.dump(out, f, ensure_ascii=False, indent=0)
        print("%-14s %5d items  %4.1fs  top: %s" % (pid, len(out), time.time() - t, ", ".join(n for n, _ in out[:4])))
        time.sleep(62)


if __name__ == "__main__":
    main()
