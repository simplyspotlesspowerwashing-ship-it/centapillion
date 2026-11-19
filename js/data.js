/*
 * Centapillion prompt bank.
 *
 * Each prompt lists every accepted answer, grouped by rarity tier:
 *   p = Earthworm   (10)  the answer everyone digs up first
 *   c = Fool's Gold (15)  the famously "obscure" pick everyone reaches for
 *   s = Beetle      (30)  solid, tunnels with the crowd
 *   r = Mole        (60)  genuinely uncommon
 *   d = Magma Wyrm  (85)  true obscurity
 *   k = Centapillion (100) the designated gem, one per prompt
 *
 * Inside a tier, answers are separated by "|". An answer can carry
 * aliases separated by "=": the first name is the one shown.
 */
(function (root) {
  var PROMPTS = [
    { id: "fruit", q: "Name a fruit", t: {
      p: "Apple|Banana|Orange|Strawberry|Grape=grapes|Watermelon|Pineapple|Mango|Pear|Cherry",
      c: "Durian|Dragon Fruit=dragonfruit=pitaya|Star Fruit=starfruit=carambola|Kumquat",
      s: "Peach|Plum|Lemon|Lime|Blueberry|Raspberry|Kiwi=kiwifruit|Cantaloupe|Coconut|Pomegranate|Grapefruit|Apricot|Papaya|Fig|Blackberry|Nectarine|Cranberry|Avocado|Tangerine|Clementine|Honeydew|Passion Fruit=passionfruit|Tomato",
      r: "Lychee=litchi|Persimmon|Guava|Quince|Gooseberry|Elderberry|Mulberry|Date|Jackfruit|Plantain|Boysenberry|Tamarind|Loquat|Rambutan|Mangosteen|Currant|Huckleberry|Feijoa|Yuzu|Pomelo|Olive|Ugli Fruit=ugli|Blood Orange|Cherimoya|Pawpaw|Acai|Soursop=guanabana|Salak=snake fruit|Kiwano=horned melon",
      d: "Jabuticaba|Ackee|Medlar|Cloudberry|Sapodilla|Miracle Fruit=miracle berry|Lingonberry|Longan|Langsat|Marula|Bael|Cupuacu|Santol|Jambul|Lucuma|Pitanga=surinam cherry|Buddha's Hand=buddhas hand",
      k: "Monstera Deliciosa=monstera=fruit salad plant::Tastes like pineapple, banana and coconut at once." } },

    { id: "africa", q: "Name a country in Africa", t: {
      p: "Egypt|Nigeria|South Africa|Kenya|Morocco|Ethiopia",
      c: "Madagascar|Chad",
      s: "Ghana|Algeria|Tanzania|Uganda|Sudan|Somalia|Zimbabwe|Libya|Tunisia|Senegal|Rwanda|Cameroon|Angola|Republic of the Congo=congo|Democratic Republic of the Congo=drc=dr congo=zaire|Ivory Coast=cote d'ivoire|Mali|Namibia|Botswana|Zambia|Mozambique",
      r: "Niger|Malawi|Liberia|Sierra Leone|Burkina Faso|Gabon|Togo|Benin|Guinea|Mauritania|South Sudan|Eritrea|Lesotho|Eswatini=swaziland|Central African Republic|Burundi|Gambia=the gambia|Djibouti|Mauritius|Seychelles",
      d: "Equatorial Guinea|Guinea-Bissau=guinea bissau|Cape Verde=cabo verde|Comoros",
      k: "Sao Tome and Principe=sao tome::Africa's second-smallest country, sitting on the equator." } },

    { id: "dog", q: "Name a dog breed", t: {
      p: "Labrador=labrador retriever=lab|Golden Retriever|German Shepherd|Poodle|Bulldog|Chihuahua|Beagle",
      c: "Labradoodle|Shiba Inu|Xoloitzcuintli=xolo",
      s: "Pug|Husky=siberian husky|Dachshund|Boxer|Rottweiler|Dalmatian|Great Dane|Corgi=welsh corgi|Pit Bull=pitbull|Yorkshire Terrier=yorkie|Shih Tzu|Doberman=doberman pinscher|Border Collie|Collie|Greyhound|Saint Bernard=st bernard|Maltese|Pomeranian|Cocker Spaniel|French Bulldog=frenchie|Bloodhound|Australian Shepherd=aussie|Jack Russell Terrier=jack russell|Bichon Frise=bichon|Schnauzer|Mastiff|Springer Spaniel=english springer spaniel",
      r: "Akita|Basset Hound|Bernese Mountain Dog|Newfoundland|Samoyed|Whippet|Weimaraner|Vizsla|Shar Pei|Chow Chow|Malamute=alaskan malamute|Basenji|Rhodesian Ridgeback|Afghan Hound|Bull Terrier|Cavalier King Charles Spaniel=cavalier|Papillon|Irish Setter|Pointer|Sheltie=shetland sheepdog|Great Pyrenees|Boston Terrier|Havanese|Lhasa Apso|Cane Corso|Pekingese|Scottish Terrier=scottie|Westie=west highland terrier|Wolfhound=irish wolfhound|Borzoi|Saluki",
      d: "Komondor|Puli|Bergamasco|Leonberger|Otterhound|Lagotto Romagnolo|Kooikerhondje|Norwegian Lundehund=lundehund|Azawakh|Mudi|Catahoula|Schipperke|Sloughi|Plott Hound|Kuvasz|Briard|Tibetan Mastiff|Dandie Dinmont Terrier=dandie dinmont|Affenpinscher",
      k: "Peruvian Inca Orchid::A hairless dog kept by the Incas as a living hot-water bottle." } },

    { id: "element", q: "Name a chemical element", t: {
      p: "Oxygen|Hydrogen|Carbon|Gold|Iron|Helium",
      c: "Einsteinium|Tungsten=wolfram",
      s: "Nitrogen|Silver|Copper|Sodium|Calcium|Neon|Lead|Uranium|Zinc|Aluminum=aluminium|Potassium|Chlorine|Mercury|Platinum|Magnesium|Sulfur=sulphur|Lithium|Silicon|Tin|Plutonium|Nickel|Phosphorus|Fluorine|Iodine|Titanium|Argon|Radium|Cobalt",
      r: "Chromium|Manganese|Boron|Beryllium|Arsenic|Krypton|Xenon|Radon|Bismuth|Cesium=caesium|Barium|Bromine|Strontium|Lanthanum|Palladium|Rhodium|Iridium|Osmium|Selenium|Gallium|Germanium|Thorium|Vanadium|Zirconium|Cadmium|Antimony|Francium|Polonium|Americium|Curium|Neodymium|Tellurium|Indium|Rubidium|Molybdenum|Scandium|Yttrium|Oganesson|Tennessine|Nobelium|Fermium",
      d: "Praseodymium|Dysprosium|Ytterbium|Lutetium|Thulium|Holmium|Erbium|Gadolinium|Terbium|Europium|Samarium|Promethium|Hafnium|Rhenium|Technetium|Ruthenium|Niobium|Tantalum|Thallium|Astatine|Actinium|Protactinium|Neptunium|Berkelium|Californium|Mendelevium|Lawrencium|Rutherfordium|Dubnium|Bohrium|Hassium|Meitnerium|Darmstadtium|Roentgenium|Copernicium|Nihonium|Flerovium|Moscovium|Livermorium",
      k: "Seaborgium::The only element named after a person who was alive to see it." } },

    { id: "vegetable", q: "Name a vegetable", t: {
      p: "Carrot|Broccoli|Potato|Lettuce|Onion|Corn|Peas=pea|Spinach",
      c: "Romanesco|Kohlrabi",
      s: "Celery|Cucumber|Cauliflower|Cabbage|Pepper=bell pepper|Green Beans=green bean=string bean|Zucchini=courgette|Asparagus|Kale|Garlic|Beet=beetroot|Radish|Sweet Potato|Eggplant=aubergine|Mushroom|Pumpkin|Squash|Brussels Sprouts=brussel sprouts=brussels sprout|Artichoke|Leek|Turnip|Okra|Yam",
      r: "Parsnip|Rutabaga=swede|Bok Choy=pak choi|Arugula=rocket|Endive|Fennel|Chard=swiss chard|Collard Greens=collards|Shallot|Scallion=green onion|Watercress|Jicama|Daikon|Edamame|Snow Peas|Celeriac|Radicchio|Taro|Cassava=yuca|Butternut Squash|Mustard Greens|Lima Beans|Chickpeas=chickpea=garbanzo|Bamboo Shoots=bamboo shoot",
      d: "Salsify|Sunchoke=jerusalem artichoke|Cardoon|Samphire|Burdock|Lotus Root|Chayote|Fiddlehead|Ramps=ramp|Kalettes|Oca|Celtuce|Mizuna|Purslane|Tatsoi|Skirret|Yacon",
      k: "Crosne=chinese artichoke::A crunchy tuber that looks like a tiny white grub." } },

    { id: "instrument", q: "Name a musical instrument", t: {
      p: "Piano|Guitar|Drums=drum|Violin|Flute|Trumpet",
      c: "Theremin|Kazoo|Didgeridoo",
      s: "Saxophone=sax|Cello|Clarinet|Bass=bass guitar|Harp|Trombone|Ukulele|Tuba|Harmonica|Banjo|Accordion|Xylophone|Oboe|Viola|Tambourine|French Horn=horn|Organ|Keyboard|Triangle|Cymbal=cymbals|Bagpipes|Recorder|Mandolin",
      r: "Bassoon|Piccolo|Sitar|Marimba|Glockenspiel|Harpsichord|Lute|Double Bass=upright bass=contrabass|Cornet|Euphonium|Timpani|Vibraphone|Bongo=bongos|Congas=conga|Steel Drum=steelpan|Synthesizer=synth|Ocarina|Dulcimer|Zither|Lyre|Pan Flute=panpipes|Castanets|Cowbell|Tabla|Djembe|Fiddle|Shakuhachi|Koto|Bugle|Melodica|Kalimba|Celesta",
      d: "Hurdy-Gurdy=hurdy gurdy|Erhu|Oud|Balalaika|Bouzouki|Shamisen|Sousaphone|Contrabassoon|Flugelhorn|Ondes Martenot|Glass Harmonica|Nyckelharpa|Duduk|Kora|Gamelan|Mbira|Hang Drum=handpan|Serpent|Crumhorn|Sackbut|Clavichord|Cimbalom|Guzheng|Pipa|Bandoneon|Tromba Marina",
      k: "Stalacpipe Organ=great stalacpipe organ::Played by tapping stalactites in a Virginia cave." } },

    { id: "olympic", q: "Name an Olympic sport", t: {
      p: "Swimming|Gymnastics|Track and Field=athletics|Basketball|Soccer=football",
      c: "Curling|Skeleton|Breaking=breakdancing",
      s: "Tennis|Volleyball|Boxing|Diving|Wrestling|Cycling|Skiing|Figure Skating|Ice Hockey=hockey|Fencing|Rowing|Archery|Judo|Taekwondo|Weightlifting|Snowboarding|Golf|Sailing|Rugby=rugby sevens|Surfing|Skateboarding|Triathlon|Marathon|Bobsled=bobsleigh|Luge|Speed Skating",
      r: "Handball|Water Polo|Badminton|Table Tennis=ping pong|Canoeing|Kayaking|Equestrian|Dressage|Shooting|Biathlon|Modern Pentathlon=pentathlon|Synchronized Swimming=artistic swimming|Trampoline|Field Hockey|Sport Climbing=climbing|Karate|Softball|Baseball|Beach Volleyball|Ski Jumping|Nordic Combined|Short Track|Freestyle Skiing|Mogul Skiing=moguls|Rhythmic Gymnastics|Heptathlon|Decathlon|Steeplechase|Race Walking=racewalking",
      d: "Tug of War|Lacrosse|Cricket|Polo|Croquet|Roque|Jeu de Paume|Pelota|Motorboating|Rackets|Live Pigeon Shooting|Rope Climbing|Solo Synchronized Swimming|Plunge for Distance|Skijoring|Bandy|Military Patrol",
      k: "Art Competitions=painting::Medals were awarded for painting and poetry until 1948." } },

    { id: "bone", q: "Name a bone in the human body", t: {
      p: "Femur|Skull|Rib=ribs|Spine",
      c: "Stapes=stirrup",
      s: "Tibia|Fibula|Humerus|Radius|Ulna|Pelvis|Sternum|Clavicle=collarbone|Scapula=shoulder blade|Patella=kneecap|Jaw=jawbone|Mandible|Vertebra=vertebrae|Coccyx=tailbone",
      r: "Cranium|Maxilla|Sacrum|Hip Bone=hipbone|Phalanges=phalanx|Metacarpal=metacarpals|Metatarsal=metatarsals|Carpal=carpals|Tarsal=tarsals|Calcaneus=heel bone|Ilium|Ischium|Pubis|Hyoid|Incus=anvil|Malleus=hammer|Atlas|Axis|Zygomatic=cheekbone|Talus",
      d: "Scaphoid|Lunate|Triquetrum|Pisiform|Trapezium|Trapezoid|Capitate|Hamate|Cuboid|Navicular|Cuneiform|Ethmoid|Sphenoid|Vomer|Lacrimal|Palatine|Occipital|Parietal|Temporal|Frontal|Nasal Bone|Inferior Nasal Concha|Sesamoid",
      k: "Fabella::A tiny bone behind the knee that only some people have." } },

    { id: "greekgod", q: "Name a Greek god or goddess", t: {
      p: "Zeus|Poseidon|Hades|Athena|Aphrodite|Apollo",
      c: "Nike|Eros",
      s: "Hera|Ares|Artemis|Hermes|Hephaestus|Dionysus|Demeter|Persephone|Hestia|Kronos=cronus",
      r: "Gaia|Uranus|Rhea|Pan|Hecate|Nemesis|Helios|Selene|Eos|Hypnos|Thanatos|Iris|Hebe|Tyche|Nyx|Morpheus|Prometheus|Atlas|Chaos|Asclepius|Hyperion|Oceanus|Themis|Mnemosyne|Tethys|Aeolus|Triton|Eris",
      d: "Erebus|Aether|Hemera|Phanes|Pontus|Tartarus|Nereus|Proteus|Harmonia|Enyo|Deimos|Phobos|Boreas|Zephyrus|Notus|Eurus|Hesperus|Phosphorus|Astraea|Metis|Coeus|Crius|Iapetus|Phoebe|Theia|Dione|Leto|Ananke|Momus|Geras",
      k: "Ploutos=plutus::The god of wealth. Zeus blinded him so he would give it out at random." } },

    { id: "cheese", q: "Name a type of cheese", t: {
      p: "Cheddar|Mozzarella|Swiss|Parmesan|American",
      c: "Casu Marzu|Limburger",
      s: "Brie|Gouda|Feta|Provolone|Blue Cheese=blue|Cream Cheese|Ricotta|Monterey Jack=jack|Pepper Jack|Colby|Camembert|Goat Cheese=chevre|Cottage Cheese|Gorgonzola|Muenster=munster|Havarti|Roquefort|Stilton|Gruyere|Halloumi|Mascarpone|Paneer|Emmental",
      r: "Manchego|Asiago|Pecorino|Fontina|Burrata|Edam|Jarlsberg|Wensleydale|Queso Fresco|Cotija|Raclette|Comte|Taleggio|Boursin|Port Salut|Gloucester=double gloucester|Leicester=red leicester|Oaxaca|Velveeta|String Cheese|Neufchatel|Labneh|Ricotta Salata|Bocconcini",
      d: "Epoisses|Reblochon|Mimolette|Stinking Bishop|Morbier|Brunost|Vacherin|Tomme|Pont-l'Eveque=pont l eveque|Caciocavallo|Scamorza|Cabrales|Idiazabal|Kashkaval|Graviera|Tete de Moine|Appenzeller|Ossau-Iraty|Livarot|Sbrinz|Lancashire|Caerphilly|Shropshire Blue",
      k: "Pule=donkey cheese::Made from Balkan donkey milk. Among the priciest cheeses on Earth." } },

    { id: "language", q: "Name a programming language", t: {
      p: "Python|Java|JavaScript=js|C++=cpp=c plus plus|C",
      c: "Brainfuck|Assembly",
      s: "C#=c sharp=csharp|Ruby|PHP|Swift|Go=golang|Rust|Kotlin|TypeScript=ts|SQL|HTML|R|Perl|MATLAB|Scala|Visual Basic=vb|Objective-C=objective c|Dart|Bash=shell",
      r: "Haskell|Lua|Fortran|COBOL|Lisp|Pascal|Erlang|Elixir|Clojure|F#=f sharp|Julia|Scheme|Prolog|Groovy|Delphi|BASIC|Smalltalk|OCaml|Zig|Nim|Crystal|Ada|PowerShell|Solidity|Elm|Racket|Scratch|Logo",
      d: "APL|Forth|ALGOL|Simula|Modula-2=modula|Eiffel|SNOBOL|Tcl|Rexx|Idris|Agda|Coq|Factor|J|K|Q|Chapel|Pony|Red|Rebol|Io|Hack|Raku|ABAP|PL/I=pl1|LabVIEW|Malbolge|Befunge|Whitespace|INTERCAL",
      k: "Shakespeare Programming Language=shakespeare=spl::Programs are written as plays. Variables are characters." } },

    { id: "capital", q: "Name a capital city in Europe", t: {
      p: "Paris|London|Rome|Berlin|Madrid",
      c: "Vatican City=vatican|Andorra la Vella",
      s: "Athens|Amsterdam|Vienna|Dublin|Lisbon|Brussels|Prague|Moscow|Stockholm|Oslo|Copenhagen|Warsaw|Budapest|Helsinki|Bern|Edinburgh|Kyiv=kiev",
      r: "Reykjavik|Bucharest|Sofia|Belgrade|Zagreb|Bratislava|Ljubljana|Tallinn|Riga|Vilnius|Minsk|Monaco|Luxembourg|Sarajevo|Tirana|Valletta|Cardiff|Belfast",
      d: "Skopje|Podgorica|Chisinau|San Marino|Vaduz|Pristina|Nicosia|Tbilisi|Yerevan|Baku",
      k: "Torshavn=thorshavn::Capital of the Faroe Islands, one of the smallest capitals there is." } },

    { id: "pasta", q: "Name a type of pasta", t: {
      p: "Spaghetti|Penne|Macaroni|Lasagna=lasagne|Fettuccine",
      c: "Bucatini",
      s: "Linguine|Ravioli|Rigatoni|Fusilli|Farfalle=bowtie|Tortellini|Rotini|Ziti|Angel Hair=capellini|Orzo|Gnocchi|Shells=conchiglie|Manicotti|Cannelloni|Elbow",
      r: "Orecchiette|Pappardelle|Tagliatelle|Vermicelli|Ditalini|Cavatappi|Gemelli|Campanelle|Radiatori|Paccheri|Tortelloni|Agnolotti|Cavatelli|Ziti Rigati|Trofie|Strozzapreti|Mafaldine|Stelline|Acini di Pepe|Fregola|Casarecce|Anelli|Rotelle=wagon wheel",
      d: "Lumache|Corzetti|Lorighittas|Busiate|Garganelli|Pici|Bigoli|Malloreddus|Testaroli|Scialatielli|Mezzelune|Cappelletti|Sorpresine|Gigli|Calamarata|Creste di Gallo|Trenette|Fileja",
      k: "Su Filindeu::Sardinian 'threads of God', made by only a handful of people alive." } },

    { id: "gem", q: "Name a gemstone", t: {
      p: "Diamond|Ruby|Emerald|Sapphire",
      c: "Painite",
      s: "Amethyst|Topaz|Opal|Pearl|Jade|Garnet|Turquoise|Aquamarine|Onyx|Quartz|Peridot|Citrine|Amber|Moonstone|Tanzanite",
      r: "Tourmaline|Lapis Lazuli=lapis|Alexandrite|Zircon|Spinel|Morganite|Jasper|Agate|Malachite|Obsidian|Bloodstone|Carnelian|Tiger's Eye=tigers eye|Rose Quartz|Coral|Jet|Beryl|Kunzite|Iolite|Chrysoberyl|Rhodolite|Labradorite|Sunstone|Moissanite",
      d: "Benitoite|Taaffeite|Grandidierite|Poudretteite|Musgravite|Jeremejevite|Red Beryl=bixbite|Serendibite|Tsavorite|Demantoid|Sphene=titanite|Hackmanite|Charoite|Sugilite|Ammolite|Larimar|Chrysoprase|Andalusite|Euclase|Hiddenite|Padparadscha",
      k: "Fordite=detroit agate::Layers of old car-factory paint, cut and polished like stone." } },

    { id: "boardgame", q: "Name a board game", t: {
      p: "Monopoly|Chess|Scrabble|Checkers=draughts|Clue=cluedo",
      c: "Go|Settlers of Catan=catan",
      s: "Risk|Sorry=sorry!|Trouble|Candy Land=candyland|Battleship|Connect Four=connect 4|Operation|Life=the game of life|Backgammon|Chutes and Ladders=snakes and ladders|Stratego|Trivial Pursuit|Mouse Trap|Guess Who|Pictionary|Othello=reversi|Ticket to Ride|Pandemic|Mancala|Parcheesi=ludo",
      r: "Carcassonne|Ticket to Ride Europe|Dominion|Splendor|Azul|Wingspan|Codenames|Terraforming Mars|Gloomhaven|Twilight Imperium|Agricola|Puerto Rico|Power Grid|Small World|King of Tokyo|Dixit|7 Wonders=seven wonders|Scythe|Kingdomino|Mahjong|Shogi|Chinese Checkers|Hungry Hungry Hippos|Cranium|Balderdash|Axis and Allies|Diplomacy|Mastermind|Boggle|Yahtzee",
      d: "Twixt|Hive|Tak|Hnefatafl|Senet|Royal Game of Ur=game of ur|Nine Men's Morris=nine mens morris|Fanorona|Pente|Blokus|Brass|Root|Spirit Island|Through the Ages|Le Havre|Tigris and Euphrates|Acquire|Survive|Fireball Island|Heroquest|Dark Tower|Crokinole|Carrom|Pachisi",
      k: "The Landlord's Game::The 1904 game Monopoly was copied from, meant as a warning about landlords." } },

    { id: "dinosaur", q: "Name a dinosaur", t: {
      p: "T. Rex=t rex=trex=tyrannosaurus=tyrannosaurus rex|Triceratops|Velociraptor=raptor|Stegosaurus|Brachiosaurus",
      c: "Pterodactyl=pteranodon|Brontosaurus",
      s: "Diplodocus|Ankylosaurus|Spinosaurus|Allosaurus|Parasaurolophus|Iguanodon|Dilophosaurus|Pachycephalosaurus|Apatosaurus|Gallimimus|Compsognathus|Carnotaurus|Giganotosaurus|Archaeopteryx",
      r: "Deinonychus|Oviraptor|Protoceratops|Microraptor|Therizinosaurus|Baryonyx|Styracosaurus|Maiasaura|Edmontosaurus|Corythosaurus|Argentinosaurus|Mosasaurus|Plesiosaurus|Utahraptor|Troodon|Coelophysis|Ceratosaurus|Megalosaurus|Albertosaurus|Kentrosaurus|Sauropelta|Euoplocephalus|Psittacosaurus|Herrerasaurus|Dreadnoughtus|Suchomimus|Amargasaurus",
      d: "Nigersaurus|Mamenchisaurus|Kosmoceratops|Stygimoloch|Dracorex|Nothronychus|Mononykus|Yutyrannus|Sinosauropteryx|Irritator|Masiakasaurus|Concavenator|Deinocheirus|Halszkaraptor|Qianzhousaurus|Pentaceratops|Einiosaurus|Scelidosaurus|Minmi|Patagotitan|Rajasaurus|Austroraptor|Balaur",
      k: "Fruitadens::One of the smallest dinosaurs, about the size of a chicken." } },

    { id: "spice", q: "Name a spice or herb", t: {
      p: "Salt|Pepper=black pepper|Cinnamon|Basil|Garlic|Oregano",
      c: "Saffron|Asafoetida=hing",
      s: "Paprika|Cumin|Ginger|Nutmeg|Thyme|Rosemary|Parsley|Cilantro=coriander|Mint|Dill|Turmeric|Chili Powder=chili|Cayenne|Sage|Cloves=clove|Bay Leaf=bay leaves|Vanilla|Curry Powder=curry|Chives|Mustard|Allspice|Cardamom|Tarragon|Fennel Seed",
      r: "Star Anise|Anise|Fenugreek|Sumac|Za'atar=zaatar|Marjoram|Lemongrass|Caraway|Mace|Juniper|Sorrel|Lovage|Chervil|Savory|Celery Seed|Garam Masala|Five Spice|Herbes de Provence|Sesame|Poppy Seed|Smoked Paprika|Wasabi|Horseradish|Kaffir Lime=makrut lime|Galangal|Epazote|Annatto=achiote|Shiso",
      d: "Grains of Paradise|Long Pepper|Sichuan Pepper=szechuan pepper|Nigella=kalonji|Ajwain|Mahlab|Amchur|Black Lime=loomi|Sansho|Grains of Selim|Hyssop|Rue|Woodruff|Costmary|Perilla|Culantro|Rau Ram|Angelica|Sweet Cicely|Borage|Tonka Bean|Kokum",
      k: "Cubeb=tailed pepper::A peppery berry with a little tail, once more prized than black pepper." } },

    { id: "painter", q: "Name a famous painter", t: {
      p: "Picasso=pablo picasso|Van Gogh=vincent van gogh|Leonardo da Vinci=da vinci=leonardo|Monet=claude monet|Michelangelo",
      c: "Bob Ross|Banksy",
      s: "Rembrandt|Dali=salvador dali|Frida Kahlo=kahlo|Andy Warhol=warhol|Raphael|Renoir|Matisse|Cezanne|Jackson Pollock=pollock|Georgia O'Keeffe=okeeffe|Vermeer|Klimt|Munch=edvard munch|Degas|Rothko|Botticelli|Caravaggio|Edward Hopper=hopper|Basquiat|Norman Rockwell=rockwell",
      r: "Goya|Gauguin|Seurat|Kandinsky|Magritte|Hokusai|Turner=jmw turner|Constable|Titian|El Greco|Velazquez|Manet|Pissarro|Toulouse-Lautrec|Modigliani|Chagall|Miro|Mondrian|Paul Klee=klee|Bosch=hieronymus bosch|Bruegel=brueghel|Rubens|Durer|Whistler|Sargent|Lichtenstein|Keith Haring=haring|Hockney|Kusama|Diego Rivera=rivera",
      d: "Hilma af Klint|Artemisia Gentileschi|Caspar David Friedrich|Egon Schiele|Giotto|Jan van Eyck|Hans Holbein|Piero della Francesca|Fra Angelico|Tintoretto|Zurbaran|Chardin|Fragonard|Watteau|Ingres|Gericault|Delacroix|Courbet|Morisot|Cassatt|Vuillard|Bonnard|Kirchner|Kollwitz|Bacon=francis bacon|Rothenberg|Leonora Carrington|Remedios Varo|Tamara de Lempicka|Agnes Martin",
      k: "Adolf Wolfli=wolfli::Made 25,000 pages of art while living in a Swiss psychiatric hospital." } },

    { id: "president", q: "Name a U.S. president", t: {
      p: "George Washington=washington|Abraham Lincoln=lincoln|Barack Obama=obama|Donald Trump=trump|Joe Biden=biden",
      c: "William Henry Harrison=harrison",
      s: "John F. Kennedy=jfk=kennedy|Thomas Jefferson=jefferson|Franklin D. Roosevelt=fdr|Theodore Roosevelt=teddy roosevelt=roosevelt|Ronald Reagan=reagan|Bill Clinton=clinton|George W. Bush=bush=george bush|Richard Nixon=nixon|Jimmy Carter=carter|John Adams=adams|Dwight Eisenhower=eisenhower=ike|Harry Truman=truman|Andrew Jackson=jackson|Lyndon B. Johnson=lbj|George H. W. Bush|Ulysses S. Grant=grant|Gerald Ford=ford",
      r: "James Madison=madison|James Monroe=monroe|John Quincy Adams|Woodrow Wilson=wilson|William Howard Taft=taft|Herbert Hoover=hoover|Calvin Coolidge=coolidge|Warren G. Harding=harding|James K. Polk=polk|Andrew Johnson|Grover Cleveland=cleveland|William McKinley=mckinley|Martin Van Buren=van buren|James Buchanan=buchanan|Zachary Taylor=taylor|John Tyler=tyler",
      d: "Millard Fillmore=fillmore|Franklin Pierce=pierce|Rutherford B. Hayes=hayes|James A. Garfield=garfield|Benjamin Harrison",
      k: "Chester A. Arthur=chester arthur=arthur::Famous for his sideburns and for 80 pairs of trousers." } },

    { id: "disney", q: "Name a Disney animated movie", t: {
      p: "Frozen|The Lion King=lion king|Aladdin|The Little Mermaid=little mermaid|Snow White",
      c: "The Black Cauldron=black cauldron|Fantasia",
      s: "Moana|Tangled|Beauty and the Beast|Cinderella|Mulan|Toy Story|Encanto|Zootopia|Pinocchio|Bambi|Dumbo|Peter Pan|Sleeping Beauty|Lilo & Stitch=lilo and stitch|Hercules|Pocahontas|Tarzan|The Jungle Book=jungle book|101 Dalmatians|Big Hero 6|Wreck-It Ralph=wreck it ralph|Coco|Up|Finding Nemo|Monsters, Inc.=monsters inc|The Incredibles=incredibles|Cars|Ratatouille|WALL-E=wall e|Inside Out|Frozen II=frozen 2",
      r: "Robin Hood|The Aristocats=aristocats|Lady and the Tramp|Alice in Wonderland|The Fox and the Hound|The Rescuers|Oliver & Company=oliver and company|The Hunchback of Notre Dame=hunchback|The Emperor's New Groove=emperors new groove|Atlantis=atlantis the lost empire|Treasure Planet|Brother Bear|Bolt|Raya and the Last Dragon=raya|Wish|The Princess and the Frog=princess and the frog|Meet the Robinsons|Chicken Little|Strange World|The Sword in the Stone=sword in the stone|The Great Mouse Detective=great mouse detective|Fantasia 2000|A Bug's Life=bugs life|Brave|Luca|Turning Red|Elemental|Soul|Onward",
      d: "Home on the Range|Dinosaur|Saludos Amigos|The Three Caballeros=three caballeros|Make Mine Music|Fun and Fancy Free|Melody Time|The Adventures of Ichabod and Mr. Toad=ichabod and mr toad|The Many Adventures of Winnie the Pooh|Winnie the Pooh|The Rescuers Down Under=rescuers down under|The Good Dinosaur=good dinosaur|Lightyear",
      k: "Victory Through Air Power::A 1943 Disney film arguing for long-range bombing." } },

    { id: "flower", q: "Name a flower", t: {
      p: "Rose|Tulip|Daisy|Sunflower|Lily|Orchid",
      c: "Corpse Flower=rafflesia=titan arum|Venus Flytrap",
      s: "Daffodil|Carnation|Lavender|Lilac|Marigold|Violet|Iris|Peony|Hydrangea|Poppy|Dandelion|Chrysanthemum=mum|Magnolia|Hibiscus|Jasmine|Lotus|Pansy|Petunia|Geranium|Azalea|Begonia|Dahlia|Gardenia|Zinnia|Lily of the Valley|Cherry Blossom=sakura",
      r: "Snapdragon|Foxglove|Hollyhock|Larkspur|Delphinium|Gladiolus|Freesia|Anemone|Camellia|Wisteria|Bluebell|Crocus|Hyacinth|Morning Glory|Bougainvillea|Aster|Cosmos|Gerbera|Ranunculus|Lisianthus|Snowdrop|Primrose|Periwinkle|Forget-Me-Not=forget me not|Cornflower|Buttercup|Clover|Heather|Protea|Bird of Paradise=strelitzia",
      d: "Hellebore|Edelweiss|Ghost Orchid|Jade Vine|Kadupul|Middlemist Red|Gentian|Columbine|Trillium|Bleeding Heart|Lungwort|Scabiosa|Nigella=love-in-a-mist|Calendula|Statice|Plumeria=frangipani|Amaryllis|Agapanthus|Alstroemeria|Monkshood=aconite|Datura|Fritillary|Kniphofia=red hot poker",
      k: "Chocolate Cosmos::A dark red flower that really smells like chocolate." } },

    { id: "snake", q: "Name a type of snake", t: {
      p: "Rattlesnake|Cobra|Python|Anaconda|Garter Snake",
      c: "Black Mamba|Inland Taipan",
      s: "Boa=boa constrictor|King Cobra|Viper|Copperhead|Cottonmouth=water moccasin|Corn Snake|King Snake=kingsnake|Mamba|Green Mamba|Ball Python|Coral Snake|Milk Snake|Rat Snake|Adder|Sea Snake|Grass Snake|Asp|Sidewinder",
      r: "Bushmaster|Fer-de-Lance|Gaboon Viper|Puff Adder|Taipan|Boomslang|Krait|Tiger Snake|Brown Snake=eastern brown snake|Death Adder|Hognose Snake=hognose|Tree Python|Reticulated Python|Burmese Python|Racer|Whipsnake|Pit Viper|Horned Viper|Rhinoceros Viper|Twig Snake|Vine Snake|Bull Snake|Indigo Snake|Green Tree Python|Blood Python|Carpet Python|Ribbon Snake",
      d: "Flying Snake|Tentacled Snake|Sunbeam Snake|Blind Snake|Spider-Tailed Horned Viper|Rough Green Snake|Wolf Snake|Kukri Snake|Mangrove Snake|Paradise Tree Snake|Shieldtail|Pipe Snake|Wart Snake=file snake|Egg-Eating Snake|Leaf-Nosed Snake|Mud Snake|Ringneck Snake|Brahminy Blind Snake",
      k: "Barbados Threadsnake=threadsnake::The smallest snake known: about 10 cm long." } },

    { id: "sea", q: "Name an ocean or sea", t: {
      p: "Pacific Ocean=pacific|Atlantic Ocean=atlantic|Indian Ocean=indian|Arctic Ocean=arctic|Mediterranean Sea=mediterranean",
      c: "Dead Sea",
      s: "Southern Ocean=antarctic ocean|Caribbean Sea=caribbean|Red Sea|Black Sea|Caspian Sea|North Sea|Baltic Sea|South China Sea|Gulf of Mexico|Sea of Japan=east sea|Bering Sea|Arabian Sea|Coral Sea",
      r: "Adriatic Sea|Aegean Sea|Ionian Sea|Tyrrhenian Sea|Tasman Sea|Yellow Sea|East China Sea|Philippine Sea|Barents Sea|Norwegian Sea|Irish Sea|Celtic Sea|Labrador Sea|Ross Sea|Weddell Sea|Sea of Okhotsk|Sea of Marmara|Aral Sea|Salton Sea|Java Sea|Andaman Sea|Sulu Sea|Kara Sea|Beaufort Sea|Greenland Sea|White Sea",
      d: "Sea of Azov|Ligurian Sea|Alboran Sea|Balearic Sea|Wadden Sea|Laptev Sea|East Siberian Sea|Chukchi Sea|Lincoln Sea|Bismarck Sea|Solomon Sea|Arafura Sea|Timor Sea|Banda Sea|Celebes Sea|Molucca Sea|Flores Sea|Savu Sea|Bellingshausen Sea|Amundsen Sea|Scotia Sea|Irminger Sea|Seto Inland Sea|Libyan Sea|Levantine Sea|Cretan Sea|Myrtoan Sea",
      k: "Sargasso Sea::The only sea with no coastline at all." } },

    { id: "superhero", q: "Name a superhero", t: {
      p: "Superman|Batman|Spider-Man=spiderman|Wonder Woman|Iron Man",
      c: "Squirrel Girl|Aquaman",
      s: "Captain America|Hulk=the hulk|Thor|Black Panther|Wolverine|Flash=the flash|Green Lantern|Black Widow|Hawkeye|Deadpool|Captain Marvel|Doctor Strange|Ant-Man=ant man|Daredevil|Storm|Cyclops|Robin|Shazam|Green Arrow|Supergirl|Batgirl|Silver Surfer|Ghost Rider|Groot|Scarlet Witch|Vision|Falcon",
      r: "Cyborg|Martian Manhunter|Nightwing|Black Canary|Hawkman|Blue Beetle|Booster Gold|Static|Raven|Starfire|Beast Boy|Moon Knight|Ms. Marvel=ms marvel|She-Hulk=she hulk|Luke Cage|Iron Fist|Jessica Jones|Punisher|Blade|Nightcrawler|Rogue|Gambit|Jean Grey|Colossus|Kitty Pryde|Wasp|Namor|Human Torch|Mister Fantastic|Invisible Woman|The Thing|Spawn|Hellboy|Invincible",
      d: "Matter-Eater Lad|Arm-Fall-Off-Boy|Dazzler|Doop|Ambush Bug|Plastic Man|Elongated Man|Metamorpho|Animal Man|Swamp Thing|The Question|Rorschach|Nite Owl|Doctor Manhattan|Speedball|Sleepwalker|Darkhawk|Nova|Quasar|Moondragon|Howard the Duck|Man-Thing|Hercules|Black Bolt|Medusa|Crystal|Bouncing Boy|Color Kid",
      k: "Dogwelder::A DC hero who welds dead dogs to villains. Really." } },

    { id: "bread", q: "Name a type of bread", t: {
      p: "White Bread|Wheat Bread=whole wheat|Sourdough|Bagel|Baguette",
      c: "Naan|Focaccia",
      s: "Rye|Pita|Croissant|Ciabatta|Tortilla|Brioche|Challah|Cornbread|Pumpernickel|English Muffin|Biscuit|Roll|Bun|Banana Bread|Garlic Bread|Flatbread|Multigrain|Texas Toast|Pretzel|Toast",
      r: "Soda Bread|Matzo=matzah|Lavash|Chapati|Roti|Paratha|Injera|Arepa|Fougasse|Panettone|Stollen|Babka|Zucchini Bread|Monkey Bread|Hawaiian Roll|Potato Bread|Sprouted Bread=ezekiel bread|Bialy|Crumpet|Scone|Puri|Bhatura|Pan de Sal=pandesal|Pain de Mie|Spelt Bread|Damper",
      d: "Lefse|Pane Carasau|Pandoro|Kulich|Barmbrack|Bara Brith|Fry Bread|Bammy|Coppia Ferrarese|Bolillo|Pao de Queijo|Tsoureki|Krendel|Lahoh|Chorek|Sangak|Barbari|Taboon|Laffa|Pogaca|Simit|Khachapuri|Teacake|Manchet|Anadama",
      k: "Hardtack=ship's biscuit::Sailors' bread so hard it lasted for years at sea." } },

    { id: "constellation", q: "Name a constellation", t: {
      p: "Orion|Big Dipper|Little Dipper|Ursa Major|Ursa Minor",
      c: "Ophiuchus|Southern Cross=crux",
      s: "Cassiopeia|Leo|Scorpius=scorpio|Taurus|Gemini|Sagittarius|Cancer|Aries|Virgo|Libra|Capricornus=capricorn|Aquarius|Pisces|Pegasus|Draco|Cygnus|Andromeda|Perseus|Hercules|Lyra|Canis Major",
      r: "Aquila|Cepheus|Bootes|Corona Borealis|Auriga|Canis Minor|Centaurus|Hydra|Delphinus|Cetus|Eridanus|Lepus|Lupus|Monoceros|Pavo|Phoenix|Sagitta|Serpens|Triangulum|Vulpecula|Columba|Corvus|Crater|Ara|Carina|Puppis|Vela",
      d: "Antlia|Apus|Caelum|Camelopardalis|Chamaeleon|Circinus|Coma Berenices|Corona Australis|Dorado|Equuleus|Fornax|Grus|Horologium|Hydrus|Indus|Lacerta|Leo Minor|Lynx|Mensa|Microscopium|Musca|Norma|Octans|Pictor|Piscis Austrinus|Pyxis|Reticulum|Sculptor|Scutum|Sextans|Telescopium|Triangulum Australe|Tucana|Volans",
      k: "Argo Navis::A giant constellation that astronomers split into three in the 1750s." } },

    { id: "dance", q: "Name a style of dance", t: {
      p: "Ballet|Hip Hop|Salsa|Tango|Waltz",
      c: "The Floss=floss|Macarena",
      s: "Tap=tap dance|Jazz|Swing|Breakdancing=breaking|Ballroom|Contemporary|Line Dancing|Square Dance|Disco|Cha-Cha=cha cha|Samba|Foxtrot|Rumba|Belly Dance|Flamenco|Twerking|Moonwalk|Polka|Irish Dance=irish step dance|Merengue|Bachata|Hula|Zumba|Charleston",
      r: "Paso Doble|Quickstep|Mambo|Lindy Hop|Jive|Krumping|Popping|Locking|Voguing=vogue|Clogging|Bolero|Lambada|Kizomba|Bhangra|Bharatanatyam|Kathak|Capoeira|Haka|Can-Can=can can|Shuffle|Electric Slide|Cumbia|Reggaeton|Pole Dance|Two-Step=two step|West Coast Swing|Boogaloo",
      d: "Butoh|Kabuki|Odissi|Kuchipudi|Mohiniyattam|Morris Dance|Sword Dance|Tarantella|Hora|Kolo|Sirtaki|Fandango|Jota|Sardana|Mazurka|Polonaise|Gavotte|Minuet|Pavane|Galliard|Saltarello|Schuhplattler|Hopak|Kecak|Tinikling|Bon Odori|Lezginka|Dabke",
      k: "Dance of the Seven Veils::Salome's dance, made famous by Richard Strauss's opera." } },

    { id: "nut", q: "Name a nut", t: {
      p: "Peanut|Almond|Cashew|Walnut|Pecan",
      c: "Brazil Nut",
      s: "Pistachio|Hazelnut=filbert|Macadamia|Pine Nut=pignoli|Chestnut|Acorn|Coconut",
      r: "Hickory Nut|Beechnut|Butternut|Candlenut|Kola Nut=cola nut|Betel Nut=areca|Tiger Nut|Ginkgo Nut|Shea Nut|Pili Nut|Baru Nut|Black Walnut|Water Chestnut|Sacha Inchi",
      d: "Kukui|Bunya Nut|Monkey Puzzle Nut|Marula Nut|Mongongo|Yellowhorn|Breadnut|Paradise Nut|Sapucaia|Malabar Chestnut|Jack Nut|Heartnut|Buartnut|Chinquapin|Argan",
      k: "Coco de Mer=double coconut::The largest seed on Earth, up to 25 kg." } },

    { id: "shoe", q: "Name a type of shoe", t: {
      p: "Sneaker=sneakers|Boot=boots|Sandal=sandals|High Heels=heels|Flip-Flops=flip flops",
      c: "Crocs|Heelys",
      s: "Loafer=loafers|Slipper=slippers|Flats=ballet flats|Stiletto|Oxford|Moccasin|Clog=clogs|Cowboy Boot=cowboy boots|Wedge=wedges|Platform|Pump=pumps|Rain Boots=wellies=wellingtons|Hiking Boots|Cleats|Running Shoes|Slides|Mules|Espadrilles|Uggs",
      r: "Brogue|Derby|Monk Strap|Chelsea Boot|Chukka|Desert Boot|Boat Shoe=boat shoes|Mary Jane|Kitten Heel|Slingback|Peep Toe|Gladiator Sandal|Huarache|Jelly Shoes=jellies|Tap Shoes|Ballet Shoes=pointe shoes|Bowling Shoes|Spats|Galoshes|Snow Boots|Combat Boots|Doc Martens=docs|Wingtip|Saddle Shoe",
      d: "Geta|Zori|Jutti|Mojari|Opanak|Chopine|Pattens|Sabot|Klompen|Tabi|Waraji|Kolhapuri|Paduka|Valenki|Mukluk|Kamik|Brogan|Ghillie|Winklepicker|Creeper|Espadrille Wedge|Okobo|Lotus Shoe",
      k: "Crakow=poulaine::Medieval shoes with toes so long they were tied to the knee." } },

    { id: "mountain", q: "Name a mountain", t: {
      p: "Mount Everest=everest|K2|Kilimanjaro|Mount Fuji=fuji|Matterhorn",
      c: "Mount Olympus=olympus",
      s: "Denali=mount mckinley|Mont Blanc|Mount Rushmore=rushmore|Mount Rainier=rainier|Mount St. Helens=st helens|Aconcagua|Pikes Peak|Mount Whitney=whitney|Kangchenjunga|Vesuvius|Mount Etna=etna|Annapurna|Ben Nevis|Table Mountain|Mount Kenya|Mount Sinai=sinai|Mount Hood",
      r: "Elbrus|Lhotse|Makalu|Cho Oyu|Dhaulagiri|Manaslu|Nanga Parbat|Eiger|Jungfrau|Popocatepetl|Cotopaxi|Chimborazo|Mount Kosciuszko=kosciuszko|Mount Cook=aoraki|Ararat|Vinson=vinson massif|Puncak Jaya=carstensz pyramid|Mauna Loa|Mount Shasta|Grand Teton|Half Dome|Longs Peak|Mount Washington|Kinabalu|Mount Logan|Mount Ruapehu|Stromboli",
      d: "Gasherbrum|Broad Peak|Shishapangma|Ama Dablam|Siula Grande|Huascaran|Ojos del Salado|Fitz Roy|Cerro Torre|Kailash|Mount Erebus|Thor Peak|Trango Towers|Mount Roraima|Rwenzori|Mount Stanley|Ras Dashen|Toubkal|Mulhacen|Triglav|Musala|Olympus Mons",
      k: "Mauna Kea::Taller than Everest if you measure from the sea floor." } },

    { id: "card", q: "Name a card game", t: {
      p: "Poker|Solitaire|Go Fish|Uno|Blackjack",
      c: "Magic: The Gathering=magic the gathering=mtg|Pokemon",
      s: "Rummy|Gin Rummy|Hearts|Spades|Bridge|War|Crazy Eights|Old Maid|Euchre|Cribbage|Canasta|Spoons|Slapjack|Egyptian Ratscrew=egyptian rat screw|Speed|Spit|Baccarat|Texas Hold'em=texas holdem|President=presidents and assholes|Snap|Cheat=bs=i doubt it|Exploding Kittens|Cards Against Humanity|Skip-Bo=skip bo|Phase 10",
      r: "Pinochle|Whist|Bezique|Piquet|Ecarte|Klondike|Spider Solitaire=spider|FreeCell|Pyramid|Kings in the Corner|Rook|Pitch|Oh Hell|Durak|Scopa|Briscola|Tarot=tarot cards|Mau Mau|Concentration=memory|Sheepshead|Hanabi|Dutch Blitz|Set|Fluxx|Love Letter|Coup|Bang!=bang|Munchkin|Yu-Gi-Oh=yugioh",
      d: "Skat|Belote|Jass|Tute|Mus|Truco|Hanafuda|Karuta|Cassino|Faro|Klaberjass|Schafkopf|Doppelkopf|Tichu|Sueca|Bourre|Pedro|Napoleon|Pishe Pasha|Bisca|Sixty-Six|Brisca|Callabra|Cuarenta",
      k: "Cucumber=gurka::A Nordic trick-taking game where you avoid the last trick." } },

    { id: "currency", q: "Name a currency", t: {
      p: "Dollar|Euro|Pound=pound sterling|Yen|Peso",
      c: "Bitcoin|Dogecoin",
      s: "Rupee|Franc|Yuan=renminbi|Ruble=rouble|Won|Real|Lira|Krona|Krone|Rand|Dinar|Shekel|Baht|Dirham|Riyal|Zloty|Forint",
      r: "Ringgit|Rupiah|Dong|Kwacha|Naira|Cedi|Shilling|Birr|Kip|Kyat|Taka|Tenge|Som|Lari|Dram|Manat|Hryvnia|Lev|Leu|Koruna|Kuna|Denar|Lek|Mark|Drachma|Guilder|Peseta|Escudo|Sol|Boliviano|Guarani|Colon|Quetzal|Lempira|Cordoba|Balboa|Gourde",
      d: "Pula|Loti|Lilangeni|Ouguiya|Nakfa|Dalasi|Leone|Kwanza|Ariary|Afghani|Ngultrum|Rufiyaa|Pa'anga=paanga|Tala|Vatu|Kina|Pataca|Tugrik|Somoni|Florin|Ducat|Thaler|Sestertius|Denarius|Obol|Talent|Doubloon",
      k: "Rai Stones=rai=stone money::Giant stone discs on Yap. Some sit on the sea floor and still count." } },

    { id: "cocktail", q: "Name a cocktail", t: {
      p: "Margarita|Martini|Mojito|Pina Colada|Cosmopolitan",
      c: "Sex on the Beach|Long Island Iced Tea",
      s: "Old Fashioned|Manhattan|Daiquiri|Bloody Mary|Mai Tai|Mimosa|Moscow Mule|Negroni|Whiskey Sour|Tequila Sunrise|White Russian|Cuba Libre|Gin and Tonic=g&t|Screwdriver|Aperol Spritz=spritz|Espresso Martini|Paloma|Bellini|Sangria|Hurricane",
      r: "Sazerac|Mint Julep|Gimlet|Sidecar|Tom Collins|French 75|Dark 'n' Stormy=dark and stormy|Caipirinha|Pisco Sour|Zombie|Aviation|Boulevardier|Last Word|Paper Plane|Penicillin|Mudslide|Grasshopper|Black Russian|Kir Royale|Amaretto Sour|Rob Roy|Rusty Nail|Sea Breeze|Bramble|Hemingway Daiquiri|Painkiller|Michelada|Irish Coffee",
      d: "Corpse Reviver|Vieux Carre|Clover Club|Ramos Gin Fizz|Hanky Panky|Brandy Alexander|Singapore Sling|Jungle Bird|Bee's Knees=bees knees|Gibson|Vesper|Stinger|Godfather|Sherry Cobbler|Pink Lady|Mary Pickford|Monkey Gland|Blood and Sand|Bijou|Martinez|Toronto|Tuxedo|Brooklyn|Zombie Punch|Fish House Punch",
      k: "Ti' Punch::Rum, lime and cane syrup, from Martinique." } },

    { id: "pokemon", q: "Name a Pokémon", t: {
      p: "Pikachu|Charizard|Bulbasaur|Squirtle|Charmander|Eevee|Mewtwo",
      c: "Missingno|Arceus",
      s: "Jigglypuff|Meowth|Psyduck|Snorlax|Gengar|Mew|Lucario|Gyarados|Magikarp|Ditto|Blastoise|Venusaur|Pidgey|Rattata|Onix|Geodude|Vulpix|Ninetales|Dragonite|Lapras|Machamp|Raichu|Togepi|Wobbuffet|Greninja|Sylveon|Umbreon|Espeon|Vaporeon|Jolteon|Flareon|Lugia|Ho-Oh=ho oh|Rayquaza|Zubat|Slowpoke|Cubone|Mudkip|Torchic|Treecko|Piplup",
      r: "Spheal|Wooper|Quagsire|Marill|Sudowoodo|Ampharos|Scizor|Tyranitar|Gardevoir|Absol|Metagross|Salamence|Garchomp|Zoroark|Chandelure|Hydreigon|Aegislash|Mimikyu|Decidueye|Incineroar|Primarina|Corviknight|Dragapult|Toxtricity|Wailord|Slakoth|Sableye|Bidoof|Shuckle|Smeargle|Farfetch'd=farfetchd|Porygon|Unown|Kecleon|Spinda|Luvdisc|Bronzong|Rotom",
      d: "Stunfisk|Garbodor|Vanillite|Klefki|Dhelmise|Pyukumuku|Bruxish|Dracovish|Arctozolt|Falinks|Cufant|Wishiwashi|Komala|Minior|Type: Null=type null|Carbink|Hoopa|Volcanion|Spewpa|Trubbish|Cryogonal|Durant|Heatmor|Basculin|Sigilyph|Lumineon|Chingling|Finneon|Kricketot|Burmy|Wormadam|Glameow|Purugly|Chatot|Combee",
      k: "Nincada::Its evolution leaves behind a ghostly second Pokémon, Shedinja." } }
  ];

  root.CP = root.CP || {};
  root.CP.PROMPTS = (root.CP.PROMPTS || []).concat(PROMPTS);
})(typeof window !== "undefined" ? window : globalThis);
