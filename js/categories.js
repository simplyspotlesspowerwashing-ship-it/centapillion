/*
 * Category digs: one set of 7 per category per day, drawn from one subject. Every prompt belongs
 * to exactly one category (tests/engine.test.js checks this).
 */
(function (root) {
  root.CP = root.CP || {};
  root.CP.CATEGORIES = [
    { id: "geography", name: "Geography", icon: "🌍", blurb: "countries, cities, islands, peaks",
      ids: ["country", "usstate", "worldcapital", "capital", "statecapital", "africa", "asia", "europe", "japancity", "italycity", "californiacity", "texascity", "floridacity", "greekisland", "island", "river", "lake", "desert", "mountain", "volcano", "waterfall", "sea", "caribbean", "nationalpark", "landmark", "bridge", "tube", "landlocked", "islandnation", "spokenlang", "currency"] },
    { id: "animals", name: "Animals & Nature", icon: "🦔", blurb: "breeds, birds, butterflies, rocks",
      ids: ["dog", "terrier", "hound", "catbreed", "horse", "chickenbreed", "cattlebreed", "owl", "birdofprey", "butterfly", "rodent", "primate", "shark", "whale", "snake", "dinosaur", "extinct", "farmanimal", "wildcat", "flower", "houseplant", "mushroom", "berry", "mineral"] },
    { id: "food", name: "Food & Drink", icon: "🍜", blurb: "dishes, cheeses, grapes, drinks",
      ids: ["fruit", "vegetable", "apple", "grape", "chili", "cheese", "frenchcheese", "pasta", "spice", "bread", "nut", "breakfast", "pizzatopping", "dessert", "candy", "sandwich", "soup", "condiment", "icecream", "coffee", "japanesefood", "mexicanfood", "italianfood", "indianfood", "cookie", "fastfood", "soda", "cereal", "salad", "tea", "beer", "dumpling", "cocktail"] },
    { id: "screen", name: "Movies & TV", icon: "🎬", blurb: "films, stars, shows, heroes",
      ids: ["disney", "pixar", "bestpicture", "hanksfilm", "dicapriofilm", "spielbergfilm", "hitchcockfilm", "bondfilm", "mcufilm", "bestactor", "bestactress", "sitcom", "cartoon", "simpsons", "starwars", "swplanet", "harrypotter", "marvel", "avenger", "xmen", "disneychar", "superhero", "superhero_villain", "musical"] },
    { id: "music", name: "Music", icon: "🎵", blurb: "songs, bands, composers",
      ids: ["beatles", "taylorswift", "queensong", "mjsong", "elvissong", "madonnasong", "stonessong", "band", "musicgenre", "christmassong", "instrument", "composer"] },
    { id: "sports", name: "Sports & Games", icon: "🏆", blurb: "teams, drivers, games",
      ids: ["olympic", "nbaplayer", "nflteam", "nbateam", "mlbteam", "nhlteam", "soccerclub", "premierleague", "f1driver", "boardgame", "card", "videogame", "nintendogame", "console", "mario", "pokemon"] },
    { id: "culture", name: "History & Myth", icon: "🏛️", blurb: "emperors, popes, gods, books",
      ids: ["element", "bone", "organ", "scientist", "constellation", "president", "firstlady", "scotus", "romanemperor", "pope", "englishmonarch", "greekgod", "romangod", "egyptgod", "norsegod", "hindugod", "myth", "fairytale", "nurseryrhyme", "shakespeare", "kingbook", "painter", "painting", "bible", "dance"] },
    { id: "everyday", name: "Words & Things", icon: "🔤", blurb: "rhymes, words, brands, gear",
      ids: ["hat", "shoe", "gem", "carbrand", "carmodel", "fashionbrand", "socialapp", "language", "rhymecat", "rhymelight", "ology", "phobia"] }
  ];
})(typeof window !== "undefined" ? window : globalThis);
