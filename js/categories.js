/*
 * Category digs: after the daily, players can keep going with seven-round
 * digs drawn from one subject. Every prompt belongs to exactly one category
 * (tests/engine.test.js checks this).
 */
(function (root) {
  root.CP = root.CP || {};
  root.CP.CATEGORIES = [
    { id: "geography", name: "Geography", icon: "🌍", blurb: "countries, cities, rivers, peaks",
      ids: ["country", "usstate", "uscity", "worldcapital", "europecity", "capital", "statecapital", "africa", "asia", "europe",
            "japancity", "italycity", "island", "river", "lake", "desert", "mountain", "volcano", "waterfall", "sea",
            "caribbean", "nationalpark", "landmark", "bridge", "spokenlang", "currency"] },
    { id: "animals", name: "Animals & Nature", icon: "🦔", blurb: "creatures, breeds, plants",
      ids: ["animal", "dog", "catbreed", "horse", "bird", "mammal", "rodent", "primate", "shark", "whale", "fish", "snake",
            "reptile", "amphibian", "insect", "dinosaur", "extinct", "seacreature", "farmanimal", "wildcat", "tree", "flower",
            "houseplant", "mushroom", "berry"] },
    { id: "food", name: "Food & Drink", icon: "🍜", blurb: "dishes, snacks, drinks",
      ids: ["fruit", "vegetable", "cheese", "pasta", "spice", "bread", "nut", "breakfast", "pizzatopping", "dessert", "candy",
            "sandwich", "soup", "condiment", "icecream", "coffee", "japanesefood", "mexicanfood", "italianfood", "indianfood",
            "cookie", "fastfood", "soda", "cereal", "salad", "tea", "beer", "dumpling", "cocktail"] },
    { id: "screen", name: "Movies, TV & Music", icon: "🎬", blurb: "films, shows, songs, stars",
      ids: ["disney", "pixar", "bestpicture", "actor", "musician", "beatles", "taylorswift", "band", "musicgenre", "christmassong",
            "musical", "sitcom", "cartoon", "simpsons", "starwars", "harrypotter", "marvel", "disneychar", "superhero",
            "superhero_villain", "instrument", "composer"] },
    { id: "sports", name: "Sports & Games", icon: "🏆", blurb: "teams, athletes, games",
      ids: ["olympic", "sport", "athlete", "nbaplayer", "nflteam", "nbateam", "soccerclub", "boardgame", "card", "videogame",
            "console", "mario", "pokemon", "toy"] },
    { id: "science", name: "Science & the Body", icon: "🔬", blurb: "elements, anatomy, space",
      ids: ["element", "bone", "organ", "bodypart", "disease", "scientist", "constellation", "shape", "unit", "color"] },
    { id: "culture", name: "History & Culture", icon: "🏛️", blurb: "gods, books, art, history",
      ids: ["president", "greekgod", "romangod", "myth", "fairytale", "nurseryrhyme", "shakespeare", "author", "painter",
            "painting", "bible", "holiday", "dance", "profession"] },
    { id: "everyday", name: "Everyday Things", icon: "🧰", blurb: "brands, tools, clothes, tech",
      ids: ["kitchen", "furniture", "tool", "clothing", "hat", "shoe", "fabric", "gem", "carbrand", "carmodel", "fashionbrand",
            "socialapp", "language"] }
  ];
})(typeof window !== "undefined" ? window : globalThis);
