#!/usr/bin/env python3
"""
Second answer source: Wikipedia category trees. Catches items Wikidata files under an
unexpected class (Neenach Volcano is in "Volcanoes of California" on Wikipedia but not
typed as a volcano on Wikidata). Page titles are cached in tools/wikipedia/<prompt>.json.

Usage:  python3 tools/wikipedia_fetch.py volcano card     # crawl these prompts
        python3 tools/wikipedia_fetch.py --all
Polite: one request at a time, a pause between requests, retries on rate limiting.
"""
import json, os, re, sys, time, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, "tools", "wikipedia")
API = "https://en.wikipedia.org/w/api.php"
UA = "centapillion-build/1.0 (trivia game answer lists; low volume)"

# Subcategories never worth entering (people, events, media, maintenance).
SKIP_CAT = re.compile(r"(people|players|designers|ists\b|writers|actors|characters|episodes|images|templates|stubs|lists of|"
                      r"by year|eruptions|disasters|companies|manufacturers|organizations|organisations|events|tournaments|"
                      r"competitions|awards|works about|in fiction|media|films|albums|songs|books|video games|wikipedia|"
                      r"articles|redirects|portals|history of|culture of|economy of|geology of|museums|restaurants|chains|in art|in popular culture|"
                      r"operas|paintings|sculptures|statues|asteroids|temples|cults|festivals|works|poems|plays|novels|"
                      r"television|radio|comics|fictional|mythology in|depictions|iconography|epithets|sanctuaries|"
                      r"shrines|feast|holidays|given names|surnames|ships|aircraft|racing|races|records|rally|concept cars)", re.I)
# Page titles that are never answers.
SKIP_PAGE = re.compile(r"^\d|^(list of|lists of|outline of|index of|glossary of|history of|timeline of|template:|category:|portal:)|"
                       r"\((opera|painting|sculpture|poem|play|song|album|film|novel|asteroid|ship|given name|surname)\b|"
                       r"\b(eruption|disaster|festival|championship|tournament|association|federation|society|museum)\b", re.I)

SPEC = {
    # today's and this week's prompts first
    "card": {"cats": ["Card games", "Dedicated deck card games", "Shedding-type card games", "Trick-taking card games",
                      "Collectible card games", "Card games introduced in the 2010s", "Card games introduced in the 2020s",
                      "Party games"], "depth": 1},
    "sitcom": {"cats": ["American television sitcoms", "British television sitcoms", "Canadian television sitcoms",
                        "Australian television sitcoms", "2020s American sitcoms", "Animated sitcoms"], "depth": 2},
    "indianfood": {"cats": ["Indian cuisine", "Indian dishes", "Indian desserts", "Indian breads", "Indian snack foods",
                            "Curry dishes", "Indian rice dishes", "Indian soups", "Indian drinks", "Punjabi cuisine",
                            "South Indian cuisine", "Bengali cuisine", "Gujarati cuisine", "Hyderabadi cuisine",
                            "Kerala cuisine", "Tamil cuisine", "Goan cuisine", "Mughlai cuisine", "Rajasthani cuisine",
                            "Indian chicken dishes", "Indian vegetarian dishes"], "depth": 1},
    "volcano": {"cats": ["Volcanoes", "Volcanoes by country", "Extinct volcanoes", "Stratovolcanoes", "Shield volcanoes",
                         "Cinder cones", "Calderas", "Lava domes", "Submarine volcanoes", "Supervolcanoes"], "depth": 3},
    "romangod": {"cats": ["Roman gods", "Roman goddesses", "Roman deities", "Personifications in Roman mythology",
                          "Etruscan gods", "Etruscan goddesses", "Sabine deities", "Imported Roman deities"], "depth": 0},
    "carmodel": {"cats": ["Cars by brand", "Sports cars", "Compact cars", "Mid-size cars", "Full-size cars", "Subcompact cars",
                          "Sport utility vehicles", "Pickup trucks", "Minivans", "Muscle cars", "Supercars", "Electric cars",
                          "Microcars", "Kei cars", "Station wagons", "Convertibles", "Hatchbacks"], "depth": 1},
    "italycity": {"cats": ["Cities and towns in Italy", "Municipalities of Italy"], "depth": 2},
    "amphibian": {"cats": ["Amphibians by common name", "Frogs", "Toads", "Salamanders", "Newts", "Caecilians"], "depth": 2},
    "reptile": {"cats": ["Reptiles by common name", "Lizards", "Snakes", "Turtles", "Crocodilians", "Geckos", "Skinks",
                         "Chameleons", "Iguanas", "Monitor lizards", "Tortoises"], "depth": 2},
    "nflteam": {"cats": ["National Football League teams", "Defunct National Football League teams"], "depth": 1},
    "constellation": {"cats": ["Constellations", "Former constellations", "Asterisms (astronomy)"], "depth": 1},
    "clothing": {"cats": ["Clothing by type", "Tops (clothing)", "Trousers and shorts", "Skirts", "Dresses", "Coats (clothing)",
                          "Jackets", "Sweaters", "Undergarments", "Nightwear", "Sportswear", "Folk costumes",
                          "Headgear", "Neckwear", "Gloves", "Hosiery", "Swimwear"], "depth": 1},
    "unit": {"cats": ["Units of measurement", "Units of length", "Units of mass", "Units of volume", "Units of time",
                      "Units of area", "Units of temperature", "Units of energy", "Units of pressure", "Units of power",
                      "Units of force", "Units of speed", "Units of information", "Customary units of measurement",
                      "Obsolete units of measurement", "Imperial units", "SI units", "Non-SI metric units"], "depth": 1},
    "shape": {"cats": ["Geometric shapes", "Polygons", "Polyhedra", "Curves", "Surfaces", "Quadrilaterals", "Triangles",
                       "Platonic solids", "Archimedean solids", "Johnson solids", "Polygonal tilings", "Symbols"], "depth": 1},
    "spokenlang": {"cats": ["Languages by country", "Constructed languages", "Extinct languages", "Sign languages",
                            "Language isolates", "Pidgins and creoles"], "depth": 2},
    "usstate": {"cats": ["States of the United States"], "depth": 0},
    "instrument": {"cats": ["Musical instruments", "String instruments", "Wind instruments", "Percussion instruments",
                            "Keyboard instruments", "Electronic musical instruments", "Brass instruments", "Woodwind instruments",
                            "Drums", "Idiophones", "Lutes", "Zithers", "Flutes", "Bagpipes", "Harps", "Folk instruments"], "depth": 2},
    "myth": {"cats": ["Legendary creatures", "Legendary creatures by type", "Mythological hybrids", "Dragons",
                      "Cryptids", "Fairies", "Demons", "Giants", "Shapeshifting", "Undead", "Water spirits",
                      "Greek legendary creatures", "Japanese legendary creatures", "Slavic legendary creatures",
                      "Norse legendary creatures", "Celtic legendary creatures", "Hindu legendary creatures"], "depth": 1},
    "composer": {"cats": ["Romantic composers", "Classical-period composers", "Baroque composers", "Renaissance composers",
                          "Medieval composers", "20th-century classical composers", "21st-century classical composers",
                          "Impressionist composers", "Minimalist composers", "Opera composers"], "depth": 0},
    "toy": {"cats": ["Toys", "Traditional toys", "Toy brands", "Educational toys", "Dolls", "Action figures", "Toy vehicles",
                     "Construction toys", "Puzzles", "Plush toys", "Toy weapons", "Outdoor toys", "Fads"], "depth": 1},
    "nurseryrhyme": {"cats": ["English nursery rhymes", "Nursery rhymes", "Children's songs", "Lullabies",
                              "American children's songs"], "depth": 1},
    "whale": {"cats": ["Whales", "Dolphins", "Porpoises", "Baleen whales", "Toothed whales", "Beaked whales", "Oceanic dolphins",
                       "River dolphins"], "depth": 1},
    "coffee": {"cats": ["Coffee drinks", "Coffee preparation", "Coffee varieties", "Coffee beverages"], "depth": 1},
    "sport": {"cats": ["Sports by type", "Ball games", "Team sports", "Individual sports", "Racket sports", "Combat sports",
                       "Water sports", "Winter sports", "Motorsport", "Extreme sports", "Bat-and-ball games",
                       "Football codes", "Hockey", "Equestrian sports", "Cue sports", "Target sports", "Olympic sports",
                       "Mind sports", "Traditional sports", "Variations of basketball", "Variations of volleyball"], "depth": 1},
    "berry": {"cats": ["Berries", "Rubus", "Vaccinium", "Ribes", "Edible fruits"], "depth": 1},
    "beatles": {"cats": ["The Beatles songs", "Songs written by Lennon–McCartney", "Songs written by George Harrison"], "depth": 0},
    "bone": {"cats": ["Bones of the head and neck", "Bones of the upper limb", "Bones of the lower limb", "Bones of the thorax",
                      "Bones of the pelvis", "Bones of the vertebral column", "Bones of the hand", "Bones of the foot",
                      "Skull", "Ossicles", "Sesamoid bones"], "depth": 1},
    "mammal": {"cats": ["Mammals by common name", "Mammals"], "depth": 1},
    "hat": {"cats": ["Hats", "Caps", "Headgear", "Helmets", "Crowns (headgear)", "Military hats", "Religious headgear",
                     "Hats by type"], "depth": 1},
    "carbrand": {"cats": ["Car brands", "Car manufacturers", "Defunct motor vehicle manufacturers", "Sports car manufacturers",
                          "Vintage vehicles", "Car manufacturers of the United States", "Car manufacturers of Germany",
                          "Car manufacturers of Japan", "Car manufacturers of Italy", "Car manufacturers of France",
                          "Car manufacturers of the United Kingdom", "Car manufacturers of China"], "depth": 1},
    "breakfast": {"cats": ["Breakfast foods", "Breakfast dishes", "Breakfast cereals", "Pancakes", "Egg dishes", "Porridges",
                           "Breakfast sandwiches", "Breakfast sausages"], "depth": 1},
    "scientist": {"cats": [], "depth": 0},
    "fashionbrand": {"cats": ["Clothing brands", "Fashion brands", "Luxury brands", "Sportswear brands", "Clothing companies",
                              "Haute couture", "Streetwear brands", "Jeans by brand", "Shoe brands", "Swimwear brands",
                              "Clothing brands of the United States", "Clothing brands of Italy", "Clothing brands of France",
                              "Clothing brands of the United Kingdom", "Clothing brands of Japan"], "depth": 1},
    "bridge": {"cats": ["Bridges by country", "Suspension bridges", "Cable-stayed bridges", "Arch bridges", "Truss bridges",
                        "Covered bridges", "Bascule bridges", "Footbridges", "Viaducts"], "depth": 2},
    "greekgod": {"cats": ["Greek gods", "Greek goddesses", "Twelve Olympians", "Titans (mythology)", "Greek primordial deities",
                          "Nymphs", "Muses (mythology)", "Personifications in Greek mythology", "Greek sea gods",
                          "Greek chthonic deities", "Greek underworld deities", "Greek love and lust deities",
                          "Greek war deities", "Greek wind deities", "Greek sun gods", "Greek moon goddesses"], "depth": 1},
    "pasta": {"cats": ["Types of pasta", "Pasta", "Pasta dishes", "Dumplings", "Stuffed pasta"], "depth": 1},
    "spice": {"cats": ["Spices", "Herbs", "Culinary herbs and spices", "Spice mixtures", "Herb and spice mixtures"], "depth": 1},
    "dinosaur": {"cats": ["Dinosaur genera", "Theropods", "Sauropods", "Ornithopods", "Ceratopsians", "Ankylosaurs",
                          "Stegosaurs", "Pachycephalosaurs", "Hadrosaurids", "Tyrannosaurids", "Dromaeosaurids",
                          "Ornithomimosaurs", "Therizinosaurs", "Oviraptorosaurs", "Spinosaurids", "Abelisaurids",
                          "Allosauroids", "Titanosaurs", "Diplodocids", "Prosauropods"], "depth": 1},
    "vegetable": {"cats": ["Vegetables", "Leaf vegetables", "Root vegetables", "Stem vegetables", "Fruit vegetables",
                           "Legumes", "Squashes and pumpkins", "Alliums", "Brassica", "Edible tubers", "Edible legumes",
                           "Sea vegetables", "Mushrooms"], "depth": 1},
    "mountain": {"cats": ["Mountains by country", "Eight-thousanders", "Seven Summits", "Ultra-prominent peaks",
                          "Mountains of the Alps", "Mountains of the Himalayas", "Mountains of the Rocky Mountains",
                          "Mountains of the Andes", "Fourteeners of Colorado"], "depth": 2},
    "marvel": {"cats": ["Marvel Comics characters", "Marvel Comics superheroes", "Marvel Comics supervillains",
                        "Marvel Comics mutants", "X-Men members", "Avengers (comics) members", "Spider-Man characters",
                        "Fantastic Four characters", "Guardians of the Galaxy characters", "Marvel Cinematic Universe characters"],
               "depth": 1},
    "sandwich": {"cats": ["Sandwiches", "American sandwiches", "British sandwiches", "Hot sandwiches", "Breakfast sandwiches",
                          "Hamburgers (food)", "Hot dogs", "Wraps (food)", "Italian sandwiches", "Mexican sandwiches",
                          "Vietnamese sandwiches", "Submarine sandwiches"], "depth": 1},
    "bestpicture": {"cats": ["Best Picture Academy Award winners"], "depth": 0},
    "island": {"cats": ["Islands by country", "Islands of the Caribbean", "Islands of Oceania", "Islands of the Mediterranean",
                        "Islands of Scotland", "Islands of Greece", "Islands of Indonesia", "Islands of the Philippines",
                        "Islands of Japan", "Islands of Hawaii", "Islands of Florida", "Islands of New York (state)"], "depth": 2},
    "pixar": {"cats": ["Pixar animated films", "Pixar short films"], "depth": 0},
    "musician": {"cats": [], "depth": 0},
    "actor": {"cats": [], "depth": 0},
    "europe": {"cats": [], "depth": 0},
    "asia": {"cats": [], "depth": 0},
}


def api(params, tries=6):
    params = dict(params, format="json", formatversion=2)
    url = API + "?" + urllib.parse.urlencode(params)
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            return json.load(urllib.request.urlopen(req, timeout=60))
        except Exception as e:
            err = e
            time.sleep(5 * (i + 1))
    raise err


def members(cat):
    pages, subs, cont = [], [], {}
    while True:
        r = api(dict({"action": "query", "list": "categorymembers", "cmtitle": "Category:" + cat, "cmlimit": 500,
                      "cmtype": "page|subcat", "cmnamespace": "0|14"}, **cont))
        for m in r.get("query", {}).get("categorymembers", []):
            (subs if m["ns"] == 14 else pages).append(m["title"])
        time.sleep(0.6)
        if "continue" not in r:
            return pages, subs
        cont = r["continue"]


def crawl(spec):
    seen_cats, titles = set(), set()
    frontier = [(c, 0) for c in spec["cats"]]
    while frontier:
        cat, d = frontier.pop(0)
        if cat in seen_cats or len(seen_cats) > 1500:
            continue
        seen_cats.add(cat)
        try:
            pages, subs = members(cat)
        except Exception as e:
            print("   skip %s (%s)" % (cat, e)); continue
        titles.update(t for t in pages if not SKIP_PAGE.search(t))
        if d < spec["depth"]:
            frontier += [(s.split(":", 1)[1], d + 1) for s in subs if not SKIP_CAT.search(s)]
    return sorted(titles), len(seen_cats)


def main():
    os.makedirs(CACHE, exist_ok=True)
    args = sys.argv[1:]
    only = [p for p in SPEC if SPEC[p]["cats"]] if "--all" in args else [a for a in args if not a.startswith("--")]
    for pid in only:
        if pid not in SPEC or not SPEC[pid]["cats"]:
            print("%-12s no categories" % pid); continue
        t = time.time()
        titles, ncat = crawl(SPEC[pid])
        with open(os.path.join(CACHE, pid + ".json"), "w", encoding="utf-8") as f:
            json.dump(titles, f, ensure_ascii=False, indent=0)
        print("%-12s %6d pages from %4d categories  %5.0fs" % (pid, len(titles), ncat, time.time() - t))


if __name__ == "__main__":
    main()
