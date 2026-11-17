#!/usr/bin/env python3
"""
Fetch complete answer lists from Wikidata for each prompt, with a popularity
signal: the number of Wikipedia language editions covering each item
("sitelinks"). Results are cached in tools/wikidata/<prompt>.json so the
answer build (tools/build_extra.py) runs offline and reproducibly.

Source: QLever's Wikidata endpoint (fast), falling back to query.wikidata.org.

Usage:  python3 tools/wikidata_fetch.py --all      # refetch every prompt (about 5 minutes)
        python3 tools/wikidata_fetch.py            # fetch anything not cached
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


def kinds(*qids, **kw):
    """Every type of a thing: all sub-types (P279+) and direct instances of the given classes."""
    vals = " ".join("wd:" + q for q in qids)
    deep = "wdt:P279+" if kw.get("deep") else "wdt:P279|wdt:P279/wdt:P279"   # two levels keeps out products and oddities
    return {"where": "VALUES ?k { %s } ?x %s ?k ." % (vals, deep), "min": kw.get("min", 2)}


# People lists: a job title alone lets in anyone who once had that job (Trump as an actor,
# Einstein as an author), so each requires real output in the field.
NOT = "MINUS { VALUES ?no { %s } ?x wdt:P106 ?no }"
ATHLETE = {"where": "VALUES ?o { wd:Q937857 wd:Q3665646 wd:Q10833314 wd:Q19204627 wd:Q10871364 wd:Q11774891 wd:Q11338576 "
                    "wd:Q378622 wd:Q13156709 wd:Q11513337 wd:Q10843402 wd:Q12299841 wd:Q13382576 wd:Q13381863 } "
                    "?x wdt:P106 ?o ; wdt:P641 ?sport . " + NOT % "wd:Q82955 wd:Q36180 wd:Q4964182 wd:Q169470 wd:Q33999", "min": 50}
ACTOR = {"where": "VALUES ?o { wd:Q33999 wd:Q10800557 wd:Q10798782 } ?x wdt:P106 ?o . "
                  "{ SELECT ?x WHERE { ?f wdt:P161 ?x . MINUS { ?f wdt:P136 wd:Q93204 } MINUS { ?f wdt:P31 wd:Q93204 } } "
                  "GROUP BY ?x HAVING(COUNT(DISTINCT ?f) >= 8) } " + NOT % "wd:Q82955 wd:Q1028181 wd:Q36834 wd:Q177220 wd:Q2526255", "min": 40}
AUTHOR = {"where": "VALUES ?o { wd:Q36180 wd:Q6625963 wd:Q49757 wd:Q214917 wd:Q4853732 } ?x wdt:P106 ?o . "
                   "{ SELECT ?x WHERE { ?w wdt:P50 ?x ; wdt:P31/wdt:P279* wd:Q7725634 } GROUP BY ?x HAVING(COUNT(DISTINCT ?w) >= 3) } "
                   + NOT % "wd:Q82955 wd:Q169470 wd:Q1028181 wd:Q1281618 wd:Q170790", "min": 40}
MUSICIAN = {"where": "VALUES ?o { wd:Q177220 wd:Q639669 wd:Q2252262 wd:Q488205 wd:Q36834 } ?x wdt:P106 ?o . "
                     "{ SELECT ?x WHERE { VALUES ?t { wd:Q482994 wd:Q208569 wd:Q134556 wd:Q7366 } ?w wdt:P175 ?x ; wdt:P31 ?t } "
                     "GROUP BY ?x HAVING(COUNT(DISTINCT ?w) >= 5) } " + NOT % "wd:Q82955", "min": 30}

# prompt id -> graph pattern selecting ?x, and a minimum sitelink count
SPEC = {
    # current sovereign states only (no dissolution date), current capitals only (no end date)
    # --- broad prompts ---
    "country": {"where": "?x wdt:P31 wd:Q3624078 . FILTER NOT EXISTS { ?x wdt:P576 ?end }", "min": 0},
    "worldcapital": {"where": "?c wdt:P31 wd:Q3624078 ; p:P36 ?st . ?st ps:P36 ?x . "
                              "FILTER NOT EXISTS { ?c wdt:P576 ?end } FILTER NOT EXISTS { ?st pq:P582 ?stop }", "min": 0},
    "uscity": {"where": "?x wdt:P31 wd:Q1093829 .", "min": 12},
    "europecity": {"where": "VALUES ?t { wd:Q1549591 wd:Q515 } ?x wdt:P31 ?t ; wdt:P17 ?c . ?c wdt:P30 wd:Q46 .", "min": 30},
    "athlete": ATHLETE,
    "nbaplayer": {"where": "?x wdt:P106 wd:Q3665646 ; wdt:P54 ?team . ?team wdt:P118 wd:Q155223 .", "min": 12},
    "author": AUTHOR,
    "musician": MUSICIAN,
    "actor": ACTOR,
    "soccerclub": {"where": "?x wdt:P31 wd:Q476028 .", "min": 30},
    "beatles": {"where": "VALUES ?t { wd:Q7366 wd:Q134556 wd:Q105543609 } ?x wdt:P175 wd:Q1299 ; wdt:P31 ?t .", "min": 0},  # songs and singles, not albums
    "taylorswift": {"where": "VALUES ?t { wd:Q7366 wd:Q134556 wd:Q105543609 } ?x wdt:P175 wd:Q26876 ; wdt:P31 ?t .", "min": 0},
    "horse": {"where": "?x wdt:P31 wd:Q1160573 .", "min": 0},
    "marvel": {"where": "?x wdt:P1441 ?wk . ?wk wdt:P123 wd:Q173496 . ?x wdt:P31/wdt:P279* wd:Q95074 . MINUS { VALUES ?u { wd:Q18043309 wd:Q20714890 wd:Q19786052 wd:Q98039362 wd:Q2101612 } ?x wdt:P1080 ?u }", "min": 2},  # not licensed Star Wars/Trek/Indiana Jones characters
    "disneychar": {"where": "?x wdt:P31/wdt:P279* wd:Q95074 ; wdt:P1441 ?w . ?w wdt:P272 wd:Q1047410 .", "min": 3},
    "carmodel": {"where": "?x wdt:P31 wd:Q3231690 .", "min": 10},
    "fashionbrand": {"where": "VALUES ?t { wd:Q1618899 wd:Q3661311 } ?x wdt:P31 ?t .", "min": 6},
    "romangod": {"where": "?x wdt:P31 wd:Q11688446 .", "min": 0},
    "fish": {"where": "?x wdt:P171+ wd:Q127282 . ?x wdt:P1843 ?cn . FILTER(lang(?cn) = 'en')", "min": 8, "common": True},
    # --- widen thin prompts ---
    "snake": taxon("Q16986904", 3),  # Ophidia
    "extinct": {"where": "?x wdt:P141 wd:Q237350 ; wdt:P1843 ?cn . FILTER(lang(?cn) = 'en')", "min": 3, "common": True},
    "fruit": {"where": "?x wdt:P279+ wd:Q3314483 .", "min": 3},  # kinds of fruit, not cultivars
    "vegetable": {"where": "?x wdt:P279+ wd:Q11004 .", "min": 3},
    "berry": {"where": "?x %s wd:Q13184 ." % KIND, "min": 3},
    "superhero": {"where": "?x wdt:P106 wd:Q188784 .", "min": 3},
    "superhero_villain": {"where": "?x wdt:P9071 wd:Q6498903 .", "min": 3},
    "kitchen": kinds("Q3773693", "Q1521410"),
    "breakfast": kinds("Q80973"),
    "coffee": kinds("Q37756327", "Q8486"),
    "icecream": kinds("Q13233"),
    "bone": kinds("Q265868", "Q25513701", min=1),
    "organ": {"where": "{ ?x wdt:P279+ wd:Q712378 } UNION { ?x wdt:P279+ wd:Q25449120 } MINUS { ?x wdt:P279+ wd:Q24060707 }", "min": 3},  # not plant organs
    "shape": kinds("Q815741", "Q37555", "Q172937", "Q4365210", min=2),  # geometric shapes, polygons, polyhedra
    "tree": kinds("Q10884", min=1, deep=True),
    "flower": kinds("Q506", min=1),
    "landmark": {"where": "?x wdt:P1435 wd:Q9259 .", "min": 25},  # World Heritage Sites with wide coverage
    "socialapp": {"where": "VALUES ?k { wd:Q3220391 wd:Q620615 wd:Q1668024 } ?x wdt:P31 ?k .", "min": 25},  # social networks, apps
    "christmassong": {"where": "?x wdt:P136 wd:Q1443316 ; wdt:P31 ?t . VALUES ?t { wd:Q7366 wd:Q134556 wd:Q105543609 wd:Q2188189 }", "min": 0},  # songs and singles only
    "seacreature": taxon("Q25326", 5),  # molluscs; fish/sharks/whales come from the composite
    "muscle": kinds("Q7365", min=1, deep=True),
    "joint": kinds("Q9644", min=1, deep=True),
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
    "bridge": {"where": "?x wdt:P31/wdt:P279* wd:Q12280 .", "min": 8},
    "japancity": {"where": "?x wdt:P31 wd:Q494721 .", "min": 3},
    "italycity": {"where": "?x wdt:P31 wd:Q747074 .", "min": 30},
    "germanycity": {"where": "?x wdt:P17 wd:Q183 ; wdt:P31 ?t . ?t wdt:P279* wd:Q515 .", "min": 25},
    "chinacity": {"where": "?x wdt:P17 wd:Q148 ; wdt:P31 ?t . ?t wdt:P279* wd:Q515 .", "min": 20},
    "australiacity": {"where": "?x wdt:P17 wd:Q408 ; wdt:P31 ?t . ?t wdt:P279* wd:Q515 .", "min": 8},
    "texascity": {"where": "?x wdt:P31 wd:Q1093829 ; wdt:P131+ wd:Q1439 .", "min": 6},
    "painter": {"where": "?x wdt:P106 wd:Q1028181 . FILTER EXISTS { ?w wdt:P170 ?x ; wdt:P31 wd:Q3305213 . }", "min": 45},  # has a painting on Wikidata (drops hobbyists)
    "composer": {"where": "?x wdt:P106 wd:Q36834 ; wdt:P569 ?b . FILTER(YEAR(?b) < 1935) FILTER EXISTS { ?w wdt:P86 ?x . } MINUS { ?x wdt:P106 wd:Q177220 } MINUS { ?x wdt:P136 wd:Q8341 } MINUS { ?x wdt:P106 wd:Q2526255 } MINUS { ?x wdt:P106 wd:Q245068 }", "min": 30},  # has a composed work; not singers, jazz, film directors, comedians
    "scientist": {"where": "?x wdt:P106/wdt:P279* wd:Q901 .", "min": 60},
    "disney": {"where": "?x wdt:P31 wd:Q11424 ; wdt:P272 wd:Q1047410 .", "min": 0},
    "pixar": {"where": "VALUES ?t { wd:Q11424 wd:Q202866 } ?x wdt:P31 ?t ; wdt:P272 wd:Q127552 .", "min": 0},  # features only
    "bestpicture": {"where": "?x wdt:P31 wd:Q11424 ; wdt:P166 wd:Q102427 .", "min": 0},  # films, not producers
    "videogame": {"where": "?x wdt:P31 wd:Q7889 .", "min": 8},
    "console": {"where": "?x wdt:P279+ wd:Q8076 .", "min": 12},  # console models are subclasses; the floor drops obscure Pong clones
    "sitcom": {"where": "?x wdt:P136 wd:Q170238 .", "min": 12},
    "musical": {"where": "?x wdt:P1219 ?ibdb ; wdt:P86 ?composer . MINUS { ?x wdt:P31/wdt:P279* wd:Q1344 } MINUS { ?x wdt:P31/wdt:P279* wd:Q2107 } MINUS { ?x wdt:P136 wd:Q1344 }", "min": 0},  # Broadway (IBDB) shows with a composer; not operas or ballets
    "band": {"where": "?x wdt:P31 wd:Q5741069 .", "min": 8},
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
    "dumpling": kinds("Q1854639"),
    "cookie": {"where": "?x %s wd:Q13266 ." % KIND, "min": 2},
    "fastfood": {"where": "?x wdt:P31 wd:Q18509232 .", "min": 1},
    "candy": {"where": "{ ?x wdt:P279+ wd:Q185583 } UNION { ?x wdt:P31 wd:Q1361086 } UNION { ?x wdt:P279 wd:Q1361086 }", "min": 1},  # candies and chocolate bars
    "cereal": {"where": "?x %s wd:Q768267 ." % KIND, "min": 0},
    "soda": {"where": "?x %s wd:Q147538 ." % KIND, "min": 3},
    "beer": {"where": "?x %s wd:Q1998962 ." % KIND, "min": 2},
    "bread": {"where": "?x %s wd:Q7802 ." % KIND, "min": 3},
    "tea": {"where": "?x %s wd:Q6097 ." % KIND, "min": 3},
    "mushroom": taxon("Q764", 4),  # fungi with English common names
    "potato": {"where": "?x %s wd:Q10514020 ." % KIND, "min": 2},
    "salad": {"where": "?x %s wd:Q9266 ." % KIND, "min": 2},
    "spice": {"where": "{ ?x %s wd:Q42527 . } UNION { ?x %s wd:Q207123 . }" % (KIND, KIND), "min": 5},
    "houseplant": {"where": "?x %s wd:Q203834 ." % KIND, "min": 5},
    "italianfood": {"where": "?x wdt:P2012 wd:Q192786 . MINUS { ?x wdt:P31/wdt:P279* wd:Q43229 } MINUS { ?x wdt:P31/wdt:P279* wd:Q11707 }", "min": 3},  # dishes, not restaurants
    "japanesefood": {"where": "?x wdt:P2012 wd:Q234138 . MINUS { ?x wdt:P31/wdt:P279* wd:Q43229 } MINUS { ?x wdt:P31/wdt:P279* wd:Q11707 }", "min": 3},  # dishes, not restaurants
    "mexicanfood": {"where": "?x wdt:P2012 wd:Q207965 . MINUS { ?x wdt:P31/wdt:P279* wd:Q43229 } MINUS { ?x wdt:P31/wdt:P279* wd:Q11707 }", "min": 3},  # dishes, not restaurants
    "indianfood": {"where": "?x wdt:P2012 wd:Q192087 . MINUS { ?x wdt:P31/wdt:P279* wd:Q43229 } MINUS { ?x wdt:P31/wdt:P279* wd:Q11707 }", "min": 3},  # dishes, not restaurants
    "fairytale": {"where": "?x wdt:P31 wd:Q699 .", "min": 2},
    "nurseryrhyme": {"where": "?x wdt:P31 wd:Q1123037 .", "min": 0},
    "painting": {"where": "?x wdt:P31 wd:Q3305213 .", "min": 8},
    "cartoon": {"where": "?x wdt:P31 wd:Q15711870 .", "min": 15},
    "holiday": {"where": "{ ?x wdt:P31 wd:Q1197685 . } UNION { ?x wdt:P31 wd:Q1445650 . }", "min": 15},
    "language": {"where": "?x wdt:P31 wd:Q9143 .", "min": 6},
    "disease": {"where": "{ ?x wdt:P31 wd:Q12136 } UNION { ?x wdt:P279+ wd:Q12136 }", "min": 15},
    "moon": {"where": "VALUES ?p { wd:Q2 wd:Q111 wd:Q319 wd:Q193 wd:Q324 wd:Q332 wd:Q339 } ?x wdt:P397 ?p ; wdt:P31/wdt:P279* wd:Q2537 .", "min": 0},  # moons of the planets and Pluto
    "constellation": {"where": "?x wdt:P31 wd:Q8928 .", "min": 0},
    "currency": {"where": "?x wdt:P31 wd:Q8142 .", "min": 10},
    "unit": {"where": "{ ?x wdt:P31 wd:Q47574 } UNION { ?x wdt:P31 ?u . ?u wdt:P279 wd:Q47574 } MINUS { ?x wdt:P31/wdt:P279* wd:Q8142 } MINUS { ?x wdt:P31/wdt:P279* wd:Q11514315 }", "min": 4},  # units, not currencies or eras
    "instrument": {"where": "?x wdt:P279+ wd:Q34379 .", "min": 3},  # kinds of instrument, not individual instruments or software
    "musicgenre": {"where": "?x wdt:P31 wd:Q188451 .", "min": 20},
    "dance": kinds("Q11639", min=3, deep=True),
    "sport": {"where": "?x %s wd:Q349 ." % KIND, "min": 15},
    "boardgame": {"where": "?x wdt:P31 wd:Q131436 .", "min": 5},
    "card": {"where": "?x wdt:P31 wd:Q142714 .", "min": 5},
    "carbrand": {"where": "?x wdt:P31 wd:Q786820 .", "min": 15},
    "profession": {"where": "?x wdt:P31 wd:Q28640 .", "min": 20},
    "toy": kinds("Q11422", min=3),
    "clothing": {"where": "?x wdt:P279 wd:Q11460 .", "min": 10},
    "hat": {"where": "{ ?x wdt:P279+ wd:Q80151 } UNION { ?x wdt:P31 wd:Q80151 } UNION { ?x wdt:P279 wd:Q14952 } MINUS { ?x wdt:P279* wd:Q173603 }", "min": 2},  # hats and direct kinds of headgear, not helmets
    "shoe": {"where": "{ ?x wdt:P279+ wd:Q22676 } UNION { ?x wdt:P279+ wd:Q161928 } MINUS { ?x wdt:P279* wd:Q43663 }", "min": 2},  # not socks
    "furniture": kinds("Q14745"),
    "tool": kinds("Q2578402"),
    "gem": kinds("Q83437"),
    "fabric": kinds("Q28823", min=3),
    "nut": {"where": "?x %s wd:Q11009 ." % KIND, "min": 5},
    "mammal": taxon("Q7377", 30),
    "shark": taxon("Q7372", 5),
    "rodent": taxon("Q10850", 12),
    "primate": taxon("Q7380", 12),
    "whale": taxon("Q160", 1),  # Cetacea
    "amphibian": taxon("Q10908", 20),
    "reptile": {"where": "VALUES ?c { wd:Q122422 wd:Q223044 wd:Q25363 wd:Q15099738 } ?x wdt:P171+ ?c . ?x wdt:P1843 ?cn . FILTER(lang(?cn) = 'en')", "min": 3, "common": True},  # squamates, turtles, crocodilians, tuatara (not birds)
    "bird": taxon("Q5113", 40),
    "insect": taxon("Q1390", 8),
}


# QLever (University of Freiburg) serves a full Wikidata copy and answers in about a second.
# The Wikidata Query Service is the fallback; it can be throttled to one query a minute.
ENDPOINTS = ["https://qlever.dev/api/wikidata", "https://query.wikidata.org/sparql"]
PREFIXES = """PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX p: <http://www.wikidata.org/prop/>
PREFIX ps: <http://www.wikidata.org/prop/statement/>
PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
PREFIX wikibase: <http://wikiba.se/ontology#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
"""


def sparql(q, tries=3):
    err = None
    for endpoint in ENDPOINTS:
        for i in range(tries):
            try:
                url = endpoint + "?" + urllib.parse.urlencode({"query": PREFIXES + q})
                req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/sparql-results+json"})
                return json.load(urllib.request.urlopen(req, timeout=300))["results"]["bindings"]
            except Exception as e:
                err = e
                time.sleep(5 if "qlever" in endpoint else 70)
    raise err


def query(spec):
    name = "?cn" if spec.get("common") else "?l"
    label = "" if spec.get("common") else "?x rdfs:label ?l . FILTER(lang(?l) = 'en')"
    return ("SELECT DISTINCT ?x %s ?sl WHERE { %s ?x wikibase:sitelinks ?sl . FILTER(?sl >= %d) %s }"
            % (name, spec["where"], spec["min"], label))


def main():
    os.makedirs(CACHE, exist_ok=True)
    args = sys.argv[1:]
    only = set(SPEC) if "--all" in args else set(a for a in args if not a.startswith("--"))
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
        time.sleep(1)


if __name__ == "__main__":
    main()
