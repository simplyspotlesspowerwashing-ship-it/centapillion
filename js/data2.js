/* Prompt pack 2: animals and nature. Format as in data.js. */
(function (root) {
  var PROMPTS = [
    { id: "mammal", q: "Name a mammal", t: {
      p: "Dog|Cat|Human=person|Elephant|Lion|Horse|Cow|Whale|Monkey|Bear",
      c: "Platypus|Bat",
      s: "Tiger|Giraffe|Zebra|Kangaroo|Dolphin|Pig|Sheep|Goat|Rabbit|Mouse|Rat|Deer|Wolf|Fox|Gorilla|Chimpanzee|Hippopotamus=hippo|Rhinoceros=rhino|Camel|Squirrel|Koala|Panda|Cheetah|Leopard|Seal|Otter|Raccoon|Hamster|Moose|Bison|Buffalo|Donkey|Beaver",
      r: "Armadillo|Sloth|Anteater|Hedgehog|Porcupine|Skunk|Opossum|Badger|Wombat|Echidna|Lemur|Meerkat|Mongoose|Hyena|Jaguar|Walrus|Manatee|Narwhal|Orca|Llama|Alpaca|Yak|Tapir|Okapi|Pangolin|Capybara|Chinchilla|Ferret|Weasel|Lynx|Bobcat|Caribou=reindeer|Elk|Gazelle|Antelope|Warthog|Orangutan|Baboon|Mole|Shrew|Vole|Gopher|Wolverine|Red Panda|Sea Lion|Dugong",
      d: "Aye-Aye=aye aye|Saiga|Solenodon|Tenrec|Hyrax|Pika|Quoll|Numbat|Bilby|Kinkajou|Coati|Fossa|Binturong|Dhole|Gerenuk|Dik-Dik=dik dik|Babirusa|Colugo|Slow Loris=loris|Tarsier|Vaquita|Zorilla|Olingo|Takin|Markhor|Gaur|Bongo|Sitatunga|Desman|Hutia|Agouti|Paca|Jerboa|Springhare|Cuscus|Marten|Fisher|Tayra|Ratel=honey badger",
      k: "Zonkey::Half zebra, half donkey, with stripy legs." } },

    { id: "seacreature", q: "Name a sea creature", t: {
      p: "Shark|Whale|Dolphin|Octopus|Jellyfish|Fish|Crab",
      c: "Axolotl|Blobfish",
      s: "Starfish=sea star|Seahorse|Squid|Lobster|Shrimp|Clam|Oyster|Sea Turtle=turtle|Stingray=ray|Seal|Sea Lion|Eel|Orca=killer whale|Manta Ray|Sea Urchin|Coral|Anemone=sea anemone|Swordfish|Tuna|Pufferfish=puffer|Clownfish|Walrus|Narwhal|Barracuda|Hammerhead",
      r: "Anglerfish|Nautilus|Cuttlefish|Sea Cucumber|Manatee|Dugong|Beluga|Sea Otter|Moray Eel|Lionfish|Sunfish=mola mola|Barnacle|Krill|Plankton|Sea Slug=nudibranch|Sand Dollar|Hermit Crab|Mussel|Scallop|Conch|Marlin|Sailfish|Flying Fish|Sea Dragon|Pipefish|Portuguese Man o' War=man o war|Box Jellyfish|Sperm Whale|Humpback Whale|Blue Whale|Mantis Shrimp|King Crab|Horseshoe Crab|Sea Snake|Grouper",
      d: "Frilled Shark|Goblin Shark|Gulper Eel|Viperfish|Fangtooth|Barreleye|Dumbo Octopus|Vampire Squid|Giant Isopod|Yeti Crab|Sea Pig|Sea Spider|Siphonophore|Comb Jelly=ctenophore|Salp|Hagfish|Lamprey|Oarfish|Coelacanth|Chimaera|Sarcastic Fringehead|Leafy Sea Dragon|Pistol Shrimp|Bobbit Worm|Christmas Tree Worm|Feather Star|Basket Star|Sea Butterfly|Glaucus=blue dragon|Lanternfish",
      k: "Immortal Jellyfish=turritopsis::Can turn back into a baby polyp when it gets old." } },

    { id: "catbreed", q: "Name a cat breed", t: {
      p: "Siamese|Persian|Maine Coon|Tabby|Sphynx",
      c: "Munchkin|Scottish Fold",
      s: "Bengal|Ragdoll|British Shorthair|Russian Blue|Calico|Abyssinian|Himalayan|Birman|Burmese|Siberian|Norwegian Forest Cat=norwegian forest|American Shorthair|Exotic Shorthair|Savannah|Tuxedo|Domestic Shorthair",
      r: "Devon Rex|Cornish Rex|Bombay|Tonkinese|Oriental Shorthair=oriental|Manx|Turkish Van|Turkish Angora|Egyptian Mau|Ocicat|Chartreux|Balinese|Somali|Ragamuffin|Japanese Bobtail|Selkirk Rex|LaPerm|Havana Brown|Korat|Singapura|Snowshoe|Nebelung|American Curl|Pixie-Bob=pixie bob|Toyger",
      d: "Khao Manee|Sokoke|Peterbald|Donskoy|Kurilian Bobtail|Chausie|Burmilla|Cymric|Serengeti|Minskin|Ukrainian Levkoy|Sphynx Elf=elf cat|Bambino|Dwelf|Aphrodite Giant|Mekong Bobtail|Thai|Raas|Arabian Mau",
      k: "Lykoi=werewolf cat::A patchy-coated breed nicknamed the werewolf cat." } },

    { id: "shark", q: "Name a type of shark", t: {
      p: "Great White=great white shark|Hammerhead|Tiger Shark|Whale Shark|Bull Shark",
      c: "Megalodon|Greenland Shark",
      s: "Mako=shortfin mako|Nurse Shark|Blue Shark|Basking Shark|Lemon Shark|Reef Shark|Blacktip|Whitetip|Thresher|Goblin Shark|Leopard Shark|Sand Tiger|Dogfish",
      r: "Megamouth|Frilled Shark|Cookiecutter Shark|Wobbegong|Angel Shark|Sawshark|Bonnethead|Porbeagle|Silky Shark|Dusky Shark|Sixgill|Sevengill|Horn Shark|Zebra Shark|Bamboo Shark|Epaulette Shark|Port Jackson|Salmon Shark|Oceanic Whitetip|Lantern Shark|Spinner Shark|Swell Shark",
      d: "Pocket Shark|Ninja Lanternshark|Bramble Shark|Kitefin|Crocodile Shark|Pyjama Shark|Tasselled Wobbegong|Speartooth|Ganges Shark|Daggernose|Smalltooth Sand Tiger|Prickly Dogfish|Viper Dogfish|Pygmy Shark|Shortnose Sawshark|Sleeper Shark",
      k: "Helicoprion::An ancient shark with a buzzsaw spiral of teeth." } },

    { id: "farmanimal", q: "Name a farm animal", t: {
      p: "Cow|Pig|Chicken|Horse|Sheep|Goat",
      c: "Alpaca|Llama",
      s: "Duck|Turkey|Donkey|Rooster|Goose|Rabbit|Bull|Lamb|Calf|Piglet|Ox|Hen|Mule|Dog|Cat|Pony",
      r: "Buffalo|Yak|Emu|Ostrich|Guinea Fowl|Quail|Bee=honeybee|Peacock|Water Buffalo|Bison|Camel|Pigeon|Pheasant|Heifer|Steer|Ram|Ewe|Sow|Boar|Billy Goat|Nanny Goat|Gander|Capon|Mare|Stallion|Foal",
      d: "Zebu|Gayal|Banteng|Reindeer|Vicuna|Guanaco|Silkworm|Cochineal|Barrow|Wether|Gilt|Pullet|Bantam|Cockerel|Drake|Poult|Kid|Shoat|Yearling",
      k: "Hinny::A mule's rarer cousin: horse father, donkey mother." } },

    { id: "aussie", q: "Name an animal found in Australia", t: {
      p: "Kangaroo|Koala|Emu|Wombat|Platypus",
      c: "Drop Bear|Quokka",
      s: "Dingo|Wallaby|Tasmanian Devil|Echidna|Crocodile|Kookaburra|Cockatoo|Possum|Box Jellyfish|Funnel-Web Spider=funnel web|Redback Spider=redback|Cassowary|Taipan|Brown Snake|Great White Shark|Galah|Lorikeet|Bilby",
      r: "Numbat|Quoll|Sugar Glider|Bandicoot|Thorny Devil|Frilled Lizard|Blue-Tongued Skink=blue tongue|Goanna|Bearded Dragon|Cane Toad|Lyrebird|Platypus Frog|Wallaroo|Tree Kangaroo|Pademelon|Bettong|Potoroo|Flying Fox|Dugong|Saltwater Crocodile|Black Swan|Magpie|Kelpie|Brolga|Budgerigar=budgie",
      d: "Thylacine=tasmanian tiger|Dunnart|Antechinus|Bush Stone-Curlew|Cassowary Chick|Mallee Fowl=malleefowl|Pygmy Possum|Cuscus|Marsupial Mole|Bush Rat|Mulgara|Kowari|Ningaui|Phascogale|Bandy-Bandy|Inland Taipan|Perentie|Gecko|Night Parrot|Gouldian Finch|Superb Fairywren",
      k: "Ibis=bin chicken=australian white ibis::The beloved bin-raiding national icon." } },

    { id: "extinct", q: "Name an extinct animal", t: {
      p: "Dodo|Dinosaur|T. Rex=t rex=tyrannosaurus|Woolly Mammoth=mammoth|Sabre-Toothed Tiger=saber tooth tiger=smilodon",
      c: "Megalodon|Passenger Pigeon",
      s: "Mastodon|Tasmanian Tiger=thylacine|Velociraptor|Triceratops|Woolly Rhinoceros=woolly rhino|Dire Wolf|Great Auk|Quagga|Pterodactyl|Stegosaurus|Moa|Irish Elk|Cave Bear|Giant Sloth=ground sloth|Trilobite",
      r: "Steller's Sea Cow|Aurochs|Elephant Bird|Haast's Eagle|Glyptodont|Western Black Rhino|Pyrenean Ibex|Baiji=yangtze river dolphin|Golden Toad|Carolina Parakeet|Heath Hen|Labrador Duck|Bubal Hartebeest|Barbary Lion|Javan Tiger|Caspian Tiger|Bali Tiger|Ammonite|Dimetrodon|Plesiosaur|Mosasaur|Dunkleosteus|Archaeopteryx|Titanoboa",
      d: "Megatherium|Diprotodon|Thylacoleo|Arthropleura|Meganeura|Anomalocaris|Opabinia|Paraceratherium|Megalania|Gigantopithecus|Andrewsarchus|Entelodont|Chalicotherium|Doedicurus|Macrauchenia|Toxodon|Smilodon Populator|Xerces Blue|Rocky Mountain Locust|Schomburgk's Deer|Sea Mink|Bramble Cay Melomys|Lord Howe Swamphen",
      k: "Hallucigenia::So weird that scientists first drew it upside down." } },

    { id: "primate", q: "Name a primate", t: {
      p: "Monkey|Gorilla|Chimpanzee=chimp|Human|Orangutan",
      c: "Aye-Aye=aye aye|Bonobo",
      s: "Baboon|Lemur|Gibbon|Mandrill|Capuchin|Spider Monkey|Howler Monkey|Macaque|Marmoset|Tamarin|Squirrel Monkey|Proboscis Monkey|Snow Monkey=japanese macaque",
      r: "Tarsier|Loris|Slow Loris|Bushbaby=galago|Colobus|Langur|Uakari|Saki|Titi|Owl Monkey|Gelada|Drill|Vervet|Mangabey|Siamang|Golden Lion Tamarin|Rhesus Macaque|Barbary Macaque|Sifaka|Indri|Potto|Douc",
      d: "Pygmy Marmoset|Cotton-Top Tamarin|Emperor Tamarin|Muriqui|Guenon|Talapoin|Patas Monkey|Hoolock|Snub-Nosed Monkey|Angwantibo|Mouse Lemur|Dwarf Lemur|Sportive Lemur|Avahi|Bald Uakari|Night Monkey|Allen's Swamp Monkey",
      k: "Kipunji=highland mangabey::Discovered in 2003, the first new monkey genus in 80 years." } },

    { id: "eggs", q: "Name an animal that lays eggs", t: {
      p: "Chicken|Bird|Snake|Turtle|Duck|Fish",
      c: "Platypus|Echidna",
      s: "Crocodile|Alligator|Lizard|Frog|Spider|Ant|Bee|Butterfly|Ostrich|Penguin|Goose|Shark|Octopus|Tortoise|Salmon|Iguana|Gecko|Toad|Emu|Turkey|Quail",
      r: "Komodo Dragon|Salamander|Newt|Axolotl|Seahorse|Squid|Snail|Slug|Termite|Cockroach|Mosquito|Ladybug|Scorpion|Tick|Lobster|Crab|Starfish|Jellyfish|Sea Turtle|Kiwi|Cassowary|Hummingbird|Chameleon|Tuatara|Skate",
      d: "Caecilian|Hagfish|Horseshoe Crab|Nautilus|Cuttlefish|Velvet Worm|Tardigrade|Sea Urchin|Earthworm|Leech|Coelacanth|Monotreme|Bowfin|Paddlefish|Sturgeon|Mudskipper",
      k: "Long-Beaked Echidna=zaglossus::One of only a handful of mammals that lays eggs." } },

    { id: "nocturnal", q: "Name a nocturnal animal", t: {
      p: "Owl|Bat|Raccoon|Moth",
      c: "Aye-Aye=aye aye|Kiwi",
      s: "Fox|Hedgehog|Opossum=possum|Skunk|Firefly|Cat|Badger|Wolf|Mouse|Rat|Hamster|Cockroach|Scorpion|Leopard|Lion|Hyena|Koala|Wombat|Armadillo|Mosquito|Cricket|Frog",
      r: "Tarsier|Slow Loris|Bushbaby=galago|Sugar Glider|Kinkajou|Fennec Fox|Aardvark|Pangolin|Porcupine|Tasmanian Devil|Quoll|Bilby|Jerboa|Flying Squirrel|Nightjar|Potoo|Gecko|Tapir|Ocelot|Margay|Serval",
      d: "Aardwolf|Binturong|Olingo|Potto|Night Monkey=owl monkey|Douroucouli|Frogmouth|Oilbird|Kowari|Dunnart|Tenrec|Genet|Civet|Spectral Bat|Ringtail",
      k: "Kakapo=owl parrot::A flightless, nocturnal parrot that smells like honey." } },

    { id: "wildcat", q: "Name a member of the cat family", t: {
      p: "Lion|Tiger|Cheetah|Leopard|House Cat=cat",
      c: "Liger|Sabre-Toothed Cat=smilodon",
      s: "Jaguar|Panther|Cougar=puma=mountain lion|Lynx|Bobcat|Snow Leopard|Ocelot|Black Panther|Clouded Leopard",
      r: "Serval|Caracal|Margay|Jaguarundi|Fishing Cat|Sand Cat|Pallas's Cat=manul|Wildcat|Sunda Clouded Leopard|Canada Lynx|Iberian Lynx|Eurasian Lynx|Tigon",
      d: "Kodkod|Oncilla|Andean Mountain Cat|Pampas Cat|Geoffroy's Cat|Flat-Headed Cat|Rusty-Spotted Cat|Marbled Cat|Bay Cat|Asian Golden Cat|African Golden Cat|Jungle Cat|Leopard Cat",
      k: "Black-Footed Cat::Africa's smallest cat, and the deadliest hunter of all cats." } },

    { id: "amphibian", q: "Name an amphibian", t: {
      p: "Frog|Toad|Salamander|Newt",
      c: "Axolotl",
      s: "Bullfrog|Tree Frog|Poison Dart Frog|Cane Toad|Tadpole|Leopard Frog|Red-Eyed Tree Frog|Mudpuppy|Fire Salamander|Spring Peeper",
      r: "Caecilian|Hellbender|Olm|Siren|Amphiuma|Glass Frog|Goliath Frog|Horned Frog=pacman frog|Surinam Toad|Midwife Toad|Spadefoot Toad|Natterjack Toad|Golden Toad|Tomato Frog|Wood Frog|Fire-Bellied Toad|Chinese Giant Salamander|Tiger Salamander|Spotted Salamander",
      d: "Purple Frog|Darwin's Frog|Gastric-Brooding Frog|Paedophryne|Lake Titicaca Frog|Waxy Monkey Frog|Budgett's Frog|Mossy Frog|Turtle Frog|Tailed Frog|Ensatina|Lungless Salamander|Rough-Skinned Newt|Crocodile Newt|Marbled Newt",
      k: "Hairy Frog=horror frog::Breaks its own toe bones to make claws when threatened." } },

    { id: "reptile", q: "Name a reptile", t: {
      p: "Snake|Lizard|Turtle|Crocodile|Alligator",
      c: "Komodo Dragon|Tuatara",
      s: "Tortoise|Iguana|Gecko|Chameleon|Python|Cobra|Rattlesnake|Bearded Dragon|Sea Turtle|Anaconda|Gila Monster|Monitor Lizard|Skink|Boa|Viper|Caiman",
      r: "Gharial|Thorny Devil|Frilled Lizard|Basilisk|Anole|Horned Lizard|Slow Worm|Glass Lizard|Leatherback|Snapping Turtle|Box Turtle|Galapagos Tortoise|Marine Iguana|Black Mamba|King Cobra|Taipan|Mamba|Copperhead|Sidewinder|Uromastyx",
      d: "Amphisbaenian=worm lizard|Mata Mata|Shingleback|Armadillo Girdled Lizard|Draco=flying lizard|Satanic Leaf-Tailed Gecko|Tokay Gecko|Crested Gecko|Agama|Tegu|Blind Snake|Mexican Beaded Lizard|Chuckwalla|Alligator Snapping Turtle|Spiny Softshell",
      k: "Pig-Nosed Turtle::A turtle with a snout like a pig and flippers like a sea turtle." } },

    { id: "berry", q: "Name a berry", t: {
      p: "Strawberry|Blueberry|Raspberry|Blackberry|Cranberry",
      c: "Goji Berry=goji|Acai",
      s: "Gooseberry|Elderberry|Boysenberry|Mulberry|Huckleberry|Currant|Blackcurrant|Redcurrant|Lingonberry|Grape|Cherry",
      r: "Cloudberry|Loganberry|Salmonberry|Marionberry|Dewberry|Bilberry|Juniper Berry|Barberry|Chokeberry=aronia|Sea Buckthorn|Serviceberry|Saskatoon|Tayberry|Wineberry|Thimbleberry|Bearberry|Holly Berry|Rowanberry|Snowberry|Golden Berry=cape gooseberry=physalis",
      d: "Crowberry|Cowberry|Nannyberry|Hackberry|Baneberry|Pokeberry=pokeweed|Bunchberry|Partridgeberry|Soapberry|Silverberry|Schisandra|Maqui|Calafate|Jostaberry|Haskap",
      k: "Miracle Berry=miracle fruit=synsepalum::Makes sour food taste sweet for an hour after." } },

    { id: "houseplant", q: "Name a houseplant", t: {
      p: "Cactus|Aloe Vera=aloe|Snake Plant|Spider Plant|Succulent|Fern",
      c: "Monstera|Fiddle-Leaf Fig=fiddle leaf fig",
      s: "Pothos|Peace Lily|Orchid|Rubber Plant|Bonsai|Philodendron|ZZ Plant|Jade Plant|Bamboo=lucky bamboo|Ivy|Money Tree|Palm|Begonia|African Violet|Venus Flytrap|Air Plant=tillandsia|Croton|Dracaena|Calathea",
      r: "String of Pearls|Pilea=chinese money plant|Bird of Paradise|Bird's Nest Fern|Boston Fern|Prayer Plant|Anthurium|Hoya|Peperomia|Christmas Cactus|Ponytail Palm|Dieffenbachia|Aglaonema|Alocasia|Schefflera|Parlor Palm|Coleus|Tradescantia|Kalanchoe|Bromeliad|Asparagus Fern|Maidenhair Fern",
      d: "Pitcher Plant|Sundew|Butterwort|Staghorn Fern|Rhipsalis|Haworthia|Echeveria|Sansevieria Cylindrica|Rhaphidophora|Syngonium|Fittonia|Maranta|Stromanthe|Ctenanthe|Episcia|Streptocarpus|Gasteria|Bunny Ear Cactus",
      k: "Lithops=living stones::Succulents disguised as pebbles to avoid being eaten." } },

    { id: "mushroom", q: "Name a mushroom", t: {
      p: "Portobello|Button Mushroom=button|Shiitake|Truffle",
      c: "Magic Mushroom=psilocybin|Death Cap",
      s: "Oyster Mushroom=oyster|Chanterelle|Morel|Enoki|Porcini|Cremini|Fly Agaric=amanita|Puffball|Lion's Mane=lions mane|Maitake=hen of the woods|Reishi|Chaga|Toadstool",
      r: "Cordyceps|King Trumpet|Shimeji|Wood Ear|Black Trumpet|Hedgehog Mushroom|Chicken of the Woods|Destroying Angel|Stinkhorn|Shaggy Mane|Matsutake|Turkey Tail|Inkcap|Honey Fungus|Jelly Ear|Bolete|Nameko|Straw Mushroom|Beefsteak Fungus",
      d: "Bleeding Tooth Fungus|Devil's Fingers|Amethyst Deceiver|Veiled Lady|Ghost Fungus|Bioluminescent Fungus|Earthstar|Bird's Nest Fungus|Lobster Mushroom|Blue Milk Cap|Indigo Milk Cap|Witch's Butter|Cauliflower Mushroom|Saffron Milk Cap|Parasol Mushroom|Blewit|Webcap|Fairy Ring",
      k: "Humongous Fungus::A single Oregon honey fungus spread over 9 square km." } },

    { id: "collective", q: "Name a collective noun for animals (like a \"pride\" of lions)", t: {
      p: "Pride|Herd|Flock|Pack|School|Swarm",
      c: "Murder|Parliament",
      s: "Pod|Colony|Gaggle|Litter|Hive|Troop|Shoal|Gang|Den|Brood|Nest",
      r: "Murmuration|Crash|Tower|Bloat|Dazzle|Business|Prickle|Skulk|Leap|Ambush|Romp|Scurry|Mischief|Unkindness|Exaltation|Charm|Clowder|Kindle|Drove|Sleuth|Sloth|Parade|Cackle|Raft|Army|Conspiracy",
      d: "Kaleidoscope|Bask|Bevy|Covey|Gam|Husk|Labor|Lounge|Memory|Mustering|Ostentation|Rhumba|Siege|Smack|Wisdom|Zeal|Glaring|Knot|Muster|Nye|Obstinacy|Rookery|Shrewdness|Tiding|Wake",
      k: "Implausibility=implausibility of gnus::Officially, a group of gnus is an implausibility." } },

    { id: "babyanimal", q: "Name the word for a baby animal", t: {
      p: "Puppy|Kitten|Calf|Cub|Foal|Chick",
      c: "Joey",
      s: "Lamb|Piglet|Duckling|Tadpole|Fawn|Kid|Pup|Gosling|Bunny=kit|Colt|Filly|Owlet|Hatchling",
      r: "Eaglet|Cygnet|Leveret|Squab|Fry|Elver|Spiderling|Larva|Nymph|Poult|Keet|Cria|Whelp|Eyas|Shoat|Hoglet|Kitling|Fingerling|Smolt|Parr",
      d: "Spat|Codling|Squeaker|Nestling|Fledgling|Chrysalis|Pupa|Grub|Maggot|Caterpillar|Polliwog|Alevin|Pinkie|Infant|Nit",
      k: "Puggle=baby echidna::A baby echidna or platypus is a puggle." } },

    { id: "famousanimal", q: "Name a famous real-life animal", t: {
      p: "Laika|Dolly the Sheep=dolly|Harambe|Grumpy Cat|Hachiko",
      c: "Koko=koko the gorilla|Doge",
      s: "Lassie|Seabiscuit|Marley|Balto|Keiko|Tilikum|Moo Deng|Pedro|Ham the Chimp=ham|Bo Obama|Socks|Knut|Paul the Octopus|Pudsey|Smokey Bear",
      r: "Lonesome George|Martha|Phar Lap|Secretariat|Red Rum|Trakr|Greyfriars Bobby|Old Yeller|Bucephalus|Copenhagen|Marengo|Jumbo|Pickles|Togo|Clever Hans|Lil Bub|Maru|Boo|Tillman|Bubbles|Washoe|Nim Chimpsky",
      d: "Felicette|Belka|Strelka|Able and Baker|Sergeant Stubby=stubby|Cher Ami|Unsinkable Sam|Simon|Tamworth Two|Ming the Clam|Jonathan the Tortoise=jonathan|Tamagoro|Taro and Jiro|Owney",
      k: "Wojtek=wojtek the bear::A bear who served in the Polish army and carried artillery shells." } },

    { id: "whale", q: "Name a whale or dolphin", t: {
      p: "Blue Whale|Killer Whale=orca|Humpback Whale=humpback|Bottlenose Dolphin|Sperm Whale",
      c: "Narwhal|Beluga",
      s: "Gray Whale=grey whale|Right Whale|Bowhead|Minke|Fin Whale|Pilot Whale|Porpoise|Spinner Dolphin|River Dolphin|Pink Dolphin=amazon river dolphin",
      r: "Sei Whale|Bryde's Whale|Beaked Whale|Pygmy Sperm Whale|Dwarf Sperm Whale|Risso's Dolphin|Dusky Dolphin|Common Dolphin|Spotted Dolphin|Hector's Dolphin|Irrawaddy Dolphin|Commerson's Dolphin|False Killer Whale|Melon-Headed Whale|Vaquita|Harbour Porpoise=harbor porpoise|Dall's Porpoise",
      d: "Cuvier's Beaked Whale|Baird's Beaked Whale|Omura's Whale|Pygmy Right Whale|Rice's Whale|Baiji|Tucuxi|Franciscana|Boto|Clymene Dolphin|Fraser's Dolphin|Rough-Toothed Dolphin|Hourglass Dolphin|Peale's Dolphin|Burmeister's Porpoise",
      k: "Spade-Toothed Whale::Never seen alive. Known only from a few bones and two stranded bodies." } },

    { id: "cactus", q: "Name a cactus or succulent", t: {
      p: "Aloe Vera=aloe|Saguaro|Prickly Pear|Jade Plant",
      c: "Peyote",
      s: "Christmas Cactus|Barrel Cactus|Agave|Echeveria|Snake Plant|Hens and Chicks|String of Pearls|Cholla|Organ Pipe Cactus|Yucca|Bunny Ear Cactus|Moon Cactus",
      r: "Haworthia|Lithops|Sedum|Kalanchoe|Crassula|Sempervivum|Golden Barrel|Old Man Cactus|Hedgehog Cactus|Pincushion Cactus|Mammillaria|Euphorbia|Zebra Plant|Panda Plant|Burro's Tail|Dragon Fruit Cactus|Rat Tail Cactus|Fishhook Barrel|Ocotillo|San Pedro",
      d: "Pachypodium|Adenium|Fenestraria|Conophytum|Ariocarpus|Astrophytum|Gymnocalycium|Echinopsis|Rhipsalis|Epiphyllum|Stapelia|Huernia|Senecio|Aeonium|Dudleya|Graptopetalum|Gasteria|Aloinopsis",
      k: "Welwitschia=welwitschia mirabilis::Grows just two leaves, ever, and can live over 1,000 years." } },

    { id: "rodent", q: "Name a rodent", t: {
      p: "Mouse|Rat|Squirrel|Hamster|Guinea Pig|Beaver",
      c: "Capybara|Naked Mole Rat",
      s: "Chipmunk|Gerbil|Porcupine|Chinchilla|Prairie Dog|Groundhog=woodchuck|Gopher|Vole|Lemming|Marmot|Muskrat|Dormouse|Flying Squirrel",
      r: "Degu|Agouti|Paca|Jerboa|Kangaroo Rat|Pack Rat=woodrat|Nutria=coypu|Mara|Viscacha|Hutia|Pocket Gopher|Mole Rat|Spiny Mouse|Cotton Rat|Deer Mouse|Gundi|Springhare",
      d: "Pacarana|Tuco-Tuco|Cuis|Coruro|Dassie Rat|Cane Rat|Blesmol|Zokor|Jird|Hopping Mouse|Cloud Rat|Bamboo Rat|Mountain Beaver|Scaly-Tailed Squirrel|Giant Pouched Rat",
      k: "African Crested Rat=crested rat::Chews poison bark and smears it on its fur. Deadly to bite." } }
  ];

  root.CP = root.CP || {};
  root.CP.PROMPTS = (root.CP.PROMPTS || []).concat(PROMPTS);
})(typeof window !== "undefined" ? window : globalThis);
