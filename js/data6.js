/* Prompt pack 6: science, everyday things and wordplay. Format as in data.js. */
(function (root) {
  var PROMPTS = [
    { id: "organ", q: "Name an organ of the human body", t: {
      p: "Heart|Brain|Lungs=lung|Liver|Kidney=kidneys|Stomach",
      c: "Skin|Appendix",
      s: "Intestines=bowel|Small Intestine|Large Intestine=colon|Pancreas|Gallbladder|Spleen|Bladder|Eyes=eye|Tongue|Thyroid|Uterus=womb|Ovaries=ovary|Esophagus=oesophagus|Prostate",
      r: "Adrenal Gland|Pituitary Gland|Pineal Gland|Thymus|Larynx|Trachea|Pharynx|Diaphragm|Rectum|Duodenum|Tonsils|Testes|Cervix|Hypothalamus|Cerebellum|Placenta|Lymph Nodes|Bone Marrow|Cornea|Retina",
      d: "Interstitium|Islets of Langerhans|Parathyroid|Epididymis|Vas Deferens|Fallopian Tube|Urethra|Ureter|Jejunum|Ileum|Cecum|Medulla Oblongata|Amygdala|Hippocampus|Thalamus|Corpus Callosum|Vomeronasal Organ|Organ of Corti|Cochlea",
      k: "Mesentery=Mesentery Organ=mesentery reclassified::Officially reclassified as its own organ in 2017." } },

    { id: "disease", q: "Name a disease or illness", t: {
      p: "Cancer|Flu=influenza|Covid=covid-19=coronavirus|Diabetes|Cold=common cold|Chickenpox",
      c: "Scurvy|Bubonic Plague=black death",
      s: "Measles|Mumps|Malaria|Tuberculosis=tb|Pneumonia|Asthma|Alzheimer's=alzheimers|Parkinson's|HIV|AIDS|Polio|Smallpox|Rabies|Cholera|Ebola|Hepatitis|Strep Throat|Bronchitis|Arthritis|Leukemia|Lupus|Migraine|Stroke|Shingles|Lyme Disease|Mono=mononucleosis|Tetanus|Anemia|Epilepsy",
      r: "Leprosy|Typhoid|Yellow Fever|Dengue|Zika|Rubella|Diphtheria|Whooping Cough=pertussis|Gout|Rickets|Beriberi|Pellagra|Cystic Fibrosis|Sickle Cell|Hemophilia|Huntington's|ALS=lou gehrig's disease|Multiple Sclerosis=ms|Crohn's|Celiac|Psoriasis|Eczema|Sepsis|Meningitis|Encephalitis|Gangrene|Hypothermia|Scarlet Fever|Legionnaires'|Anthrax|Salmonella|E. coli",
      d: "Kuru|Fatal Familial Insomnia|Progeria|Fibrodysplasia Ossificans Progressiva=fop|Elephantiasis|Trench Foot|Sweating Sickness|Ergotism|St. Vitus Dance|Chagas|Leishmaniasis|Trypanosomiasis=sleeping sickness|Guinea Worm|Yaws|Pinta|Buruli Ulcer|Kawasaki Disease|Moyamoya|Stendhal Syndrome|Jerusalem Syndrome|Foreign Accent Syndrome|Alice in Wonderland Syndrome",
      k: "Dancing Plague=Dancing Plague of 1518=dancing mania::Hundreds in Strasbourg danced for days and couldn't stop." } },

    { id: "scientist", q: "Name a famous scientist", t: {
      p: "Albert Einstein=einstein|Isaac Newton=newton|Marie Curie=curie|Charles Darwin=darwin|Stephen Hawking=hawking",
      c: "Nikola Tesla=tesla|Bill Nye",
      s: "Galileo|Thomas Edison=edison|Copernicus|Louis Pasteur=pasteur|Gregor Mendel=mendel|Alexander Fleming=fleming|Neil deGrasse Tyson|Carl Sagan=sagan|Richard Feynman=feynman|Niels Bohr=bohr|Rosalind Franklin|Jane Goodall|Archimedes|Aristotle|Benjamin Franklin|Alan Turing=turing|Johannes Kepler=kepler|Michael Faraday=faraday|Robert Oppenheimer=oppenheimer|Ada Lovelace",
      r: "Max Planck=planck|Werner Heisenberg=heisenberg|Erwin Schrodinger=schrodinger|James Clerk Maxwell=maxwell|Dmitri Mendeleev=mendeleev|Antoine Lavoisier=lavoisier|Robert Boyle|Robert Hooke|Edwin Hubble=hubble|Enrico Fermi=fermi|Paul Dirac|Ernest Rutherford=rutherford|J.J. Thomson|Linus Pauling|Francis Crick|James Watson|Edward Jenner|Joseph Lister|Florence Nightingale|Rachel Carson|Barbara McClintock|Lise Meitner|Emmy Noether|Katherine Johnson|Tycho Brahe|Alfred Wegener|Alfred Wallace|Carl Linnaeus|Leonhard Euler|Carl Gauss",
      d: "Ignaz Semmelweis|Henrietta Leavitt|Cecilia Payne|Chien-Shiung Wu|Dorothy Hodgkin|Mary Anning|Alexander von Humboldt|Antonie van Leeuwenhoek|Ibn al-Haytham|Al-Khwarizmi|Hypatia|Eratosthenes|Srinivasa Ramanujan|Satyendra Bose|Jagadish Chandra Bose|Hideki Yukawa|Gertrude Elion|Alice Ball|Ernest Just|Marie Tharp|Vera Rubin|Jocelyn Bell Burnell|Tu Youyou|Lynn Margulis",
      k: "Inge Lehmann::Found Earth's solid inner core in 1936 and lived to 104." } },

    { id: "shape", q: "Name a shape", t: {
      p: "Circle|Square|Triangle|Rectangle|Star|Heart",
      c: "Rhombus|Dodecahedron",
      s: "Oval|Pentagon|Hexagon|Octagon|Diamond|Trapezoid=trapezium|Parallelogram|Cube|Sphere|Cylinder|Cone|Pyramid|Crescent|Ellipse|Semicircle|Cross|Arrow",
      r: "Heptagon|Nonagon|Decagon|Dodecagon|Kite|Prism|Tetrahedron|Octahedron|Icosahedron|Torus|Cuboid|Hemisphere|Spiral|Helix|Quadrilateral|Polygon|Annulus|Arc|Sector|Chevron|Trefoil|Quatrefoil|Scalene Triangle|Isosceles Triangle|Right Triangle",
      d: "Deltoid|Astroid|Cardioid|Lemniscate|Rhombicuboctahedron|Reuleaux Triangle|Mobius Strip|Klein Bottle|Hendecagon|Tridecagon|Chiliagon|Myriagon|Apeirogon|Superellipse|Squircle|Stadium|Lune|Vesica Piscis|Salinon|Arbelos|Pentagram|Hexagram|Enneagram",
      k: "Gomboc::A 3D shape that always rolls itself upright, discovered in 2006." } },

    { id: "profession", q: "Name a job or profession", t: {
      p: "Doctor|Teacher|Nurse|Lawyer|Firefighter|Police Officer=cop",
      c: "Astronaut|Chimney Sweep",
      s: "Chef|Engineer|Dentist|Pilot|Farmer|Mechanic|Plumber|Electrician|Accountant|Architect|Scientist|Programmer=software engineer|Artist|Actor|Musician|Writer|Journalist|Banker|Cashier|Waiter|Barber|Carpenter|Janitor|Veterinarian=vet|Pharmacist|Soldier|Judge|Professor|Librarian|Photographer|Designer|Baker|Butcher|Driver|Mail Carrier=postman",
      r: "Surgeon|Paramedic|Therapist|Psychologist|Optometrist|Chiropractor|Air Traffic Controller|Flight Attendant|Lifeguard|Tailor|Florist|Jeweler|Locksmith|Welder|Roofer|Bricklayer|Glazier|Plasterer|Upholsterer|Blacksmith|Cobbler|Butler|Nanny|Real Estate Agent|Auctioneer|Actuary|Economist|Translator|Interpreter|Sommelier|Barista|Bartender|Bouncer|Stuntman|Mortician|Coroner|Surveyor",
      d: "Farrier|Cooper|Wheelwright|Chandler|Fletcher|Thatcher|Lamplighter|Town Crier|Ferryman|Lighthouse Keeper|Dowser|Foley Artist|Gaffer|Best Boy|Key Grip|Ethical Hacker|Snake Milker|Odor Judge|Chicken Sexer|Golf Ball Diver|Professional Mourner|Iceberg Mover|Water Slide Tester|Bed Warmer|Pet Food Taster",
      k: "Knocker-Upper::Paid to tap on windows with a long pole to wake people before alarm clocks." } },

    { id: "furniture", q: "Name a piece of furniture", t: {
      p: "Chair|Table|Bed|Couch=sofa|Desk|Dresser",
      c: "Chaise Longue=chaise lounge|Futon",
      s: "Bookshelf=bookcase|Stool|Bench|Recliner|Armchair|Nightstand=bedside table|Wardrobe|Cabinet|Ottoman|Coffee Table|Dining Table|Bunk Bed|Crib|Rocking Chair|Love Seat|Sectional|Hammock|Closet|Chest of Drawers|TV Stand|Footstool|Vanity|Shelf",
      r: "Armoire|Credenza|Sideboard|Buffet|Hutch|Chiffonier|Davenport|Settee|Divan|Daybed|Trundle Bed|Murphy Bed|Four-Poster Bed|Canopy Bed|Hope Chest|Highboy|Lowboy|Etagere|Bureau|Secretary Desk|Roll-Top Desk|Console Table|Side Table|Pouf|Bean Bag|Barstool|Hall Tree|Coat Rack|Chesterfield",
      d: "Escritoire|Tallboy|Whatnot|Canterbury|Torchiere|Commode|Wingback|Fauteuil|Bergere|Klismos|Savonarola Chair|Misericord|Settle|Tete-a-Tete|Causeuse|Méridienne=meridienne|Fainting Couch|Dumbwaiter|Credence|Pembroke Table|Gateleg Table|Lazy Susan",
      k: "Tantalus=Tantalus Cabinet::A locked decanter stand: you can see the whisky but can't reach it." } },

    { id: "tool", q: "Name a tool in a toolbox", t: {
      p: "Hammer|Screwdriver|Wrench|Pliers|Saw|Drill",
      c: "Sonic Screwdriver|Allen Key=allen wrench=hex key",
      s: "Tape Measure|Level|Utility Knife=box cutter|Socket Wrench|Chisel|Crowbar|File|Clamp|Stud Finder|Vise Grips|Wire Cutters|Mallet|Nail Gun|Sandpaper|Hacksaw|Staple Gun|Flashlight|Ratchet|Monkey Wrench|Pipe Wrench|Square|Pencil",
      r: "Awl|Plane|Spokeshave|Rasp|Punch|Nail Set|Center Punch|Torque Wrench|Multimeter|Soldering Iron|Heat Gun|Caulk Gun|Pry Bar|Tin Snips|Bolt Cutters|Coping Saw|Jigsaw|Circular Saw|Router|Orbital Sander|Plumb Bob|Chalk Line|Feeler Gauge|Calipers|Tap and Die|Countersink|Hole Saw|Putty Knife|Trowel|Speed Square",
      d: "Drawknife|Froe|Adze|Scorp|Bradawl|Gimlet|Brace and Bit|Nibbler|Burnisher|Scribe|Marking Gauge|Dovetail Saw|Fret Saw|Rifflers|Shoulder Plane|Rabbet Plane|Cat's Paw|Bucking Bar|Swage|Fuller|Hardy|Pipe Reamer|Basin Wrench|Crow's Foot Wrench|Strap Wrench",
      k: "Spudger::A flat prying stick made for opening phones and gadgets." } },

    { id: "clothing", q: "Name an item of clothing", t: {
      p: "Shirt|Pants=trousers|Jeans|Dress|Jacket|Socks=sock|T-Shirt=tshirt",
      c: "Onesie|Kilt",
      s: "Sweater=jumper|Hoodie|Skirt|Shorts|Coat|Hat|Scarf|Gloves|Underwear|Bra|Pajamas=pyjamas|Suit|Tie|Vest|Blouse|Leggings|Boots|Shoes|Belt|Cardigan|Tank Top|Polo Shirt|Sweatpants|Swimsuit|Bikini|Robe|Overalls|Raincoat|Beanie|Mittens|Boxers",
      r: "Tuxedo|Blazer|Trench Coat|Parka|Poncho|Cape|Shawl|Sarong|Kimono|Sari|Turtleneck|Camisole|Corset|Romper|Jumpsuit|Dungarees|Chinos|Culottes|Capris|Jodhpurs|Waistcoat|Bow Tie|Cravat|Ascot|Suspenders=braces|Garter|Slip|Petticoat|Negligee|Toga|Tunic|Kaftan|Dashiki|Hijab|Burqa|Balaclava",
      d: "Doublet|Jerkin|Codpiece|Ruff|Farthingale|Bustle|Crinoline|Hakama|Obi|Hanbok|Cheongsam=qipao|Ao Dai|Dirndl|Lederhosen|Sporran|Barong|Guayabera|Pareo|Lungi|Dhoti|Kurta|Shalwar Kameez|Gho|Deel|Chapan|Anorak|Gilet|Spencer|Plus Fours|Puttees|Gaiters|Spats",
      k: "Gho Bhutan=gho robe::Bhutan's national dress for men, required by law at work and school." } },

    { id: "hat", q: "Name a type of hat", t: {
      p: "Baseball Cap=cap|Cowboy Hat|Beanie|Top Hat|Fedora",
      c: "Fascinator|Tinfoil Hat",
      s: "Beret|Bowler Hat=bowler=derby|Sombrero|Trilby|Panama Hat|Bucket Hat|Sun Hat|Visor|Hard Hat|Helmet|Crown|Tiara|Turban|Bandana|Snapback|Trucker Hat|Party Hat|Chef's Hat=toque|Graduation Cap=mortarboard|Fez|Pirate Hat|Witch Hat|Santa Hat",
      r: "Boater|Pork Pie|Deerstalker|Stetson|Akubra|Newsboy Cap=flat cap|Balaclava|Pith Helmet|Tricorn|Bicorne|Busby|Bearskin|Cloche|Pillbox|Bonnet|Kufi|Kippah=yarmulke|Ushanka|Trapper Hat|Glengarry|Tam o' Shanter|Homburg|Gatsby|Garrison Cap|Kepi|Coonskin Cap|Conical Hat=non la",
      d: "Capotain|Phrygian Cap|Petasos|Pileus|Hennin|Wimple|Coif|Mitre|Zucchetto|Biretta|Galero|Shako|Montera|Tembel|Tubeteika|Taqiyah|Karakul|Papakha|Chullo|Gat|Jingasa|Kasa|Tyrolean Hat|Cavalier Hat|Boonie",
      k: "Pickelhaube::The spiked Prussian helmet; the spike was originally a vent." } },

    { id: "fabric", q: "Name a type of fabric", t: {
      p: "Cotton|Silk|Wool|Polyester|Denim|Leather",
      c: "Spandex|Gore-Tex",
      s: "Linen|Velvet|Satin|Nylon|Rayon|Cashmere|Flannel|Fleece|Lace|Suede|Corduroy|Chiffon|Tweed|Jersey|Canvas|Lycra|Acrylic|Felt|Burlap",
      r: "Muslin|Gingham|Seersucker|Taffeta|Organza|Tulle|Chambray|Calico|Poplin|Twill|Gabardine|Crepe|Georgette|Jacquard|Brocade|Damask|Chenille|Mohair|Alpaca|Angora|Merino|Bamboo|Hemp|Jute|Modal|Lyocell=tencel|Microfiber|Terrycloth|Oilcloth|Moleskin|Oxford Cloth|Chintz|Paisley",
      d: "Bombazine|Barathea|Grosgrain|Shantung|Dupioni|Habotai|Charmeuse|Crepe de Chine|Voile|Batiste|Lawn|Cambric|Dimity|Madras|Ikat|Kente|Mudcloth|Toile|Melton|Loden|Vicuna|Qiviut|Pina|Abaca|Ramie|Kapok|Sharkskin|Cordura|Kevlar",
      k: "Byssus=Byssus Sea Silk=sea silk fabric=sea silk::Woven from the beard threads of giant clams; one woman still makes it." } },

    { id: "sport", q: "Name a sport", t: {
      p: "Soccer=football|Basketball|Baseball|Tennis|Golf|American Football|Hockey",
      c: "Quidditch|Curling",
      s: "Volleyball|Rugby|Cricket|Boxing|Wrestling|Swimming|Bowling|Lacrosse|Badminton|Table Tennis=ping pong|Skiing|Snowboarding|Surfing|Skateboarding|Cycling|Track=running|Gymnastics|Softball|Field Hockey|Ice Skating|Fencing|Archery|MMA|Karate|Judo|Pickleball|Water Polo",
      r: "Squash|Racquetball|Handball|Polo|Rowing|Canoeing|Kayaking|Sailing|Triathlon|Darts|Snooker|Pool=billiards|Bobsled|Luge|Skeleton|Biathlon|Netball|Ultimate Frisbee|Disc Golf|Dodgeball|Kickball|Rock Climbing|Parkour|Hurling|Gaelic Football|Australian Rules Football=aussie rules|Jai Alai|Sumo|Kabaddi|Sepak Takraw|Bandy|Floorball|Korfball",
      d: "Shinty|Pesapallo|Hornussen|Underwater Hockey|Underwater Rugby|Chess Boxing|Cheese Rolling|Toe Wrestling|Bog Snorkelling|Wife Carrying|Extreme Ironing|Zorbing|Buzkashi|Calcio Storico|Pato|Fistball|Tchoukball|Cycleball|Bo-Taoshi|Kin-Ball|Footvolley|Joggling|Sipa",
      k: "Bossaball::Volleyball on an inflatable trampoline court, with samba music." } },

    { id: "toy", q: "Name a toy", t: {
      p: "Lego|Barbie|Teddy Bear|Yo-Yo=yoyo|Rubik's Cube=rubiks cube|Doll",
      c: "Furby|Pet Rock",
      s: "Hot Wheels|Slinky|Play-Doh=playdough|Nerf Gun=nerf|Etch A Sketch|Jack-in-the-Box|Kite|Frisbee|Hula Hoop|Jump Rope|Action Figure|G.I. Joe|Mr. Potato Head|Tamagotchi|Beanie Babies|Fidget Spinner|Magic 8 Ball|Spinning Top|Marbles|Water Gun|Toy Soldiers|Rocking Horse|Bouncy Ball|Lite-Brite|Cabbage Patch Kids|Polly Pocket|My Little Pony|Transformers|Tonka Truck",
      r: "Spirograph|View-Master|Lincoln Logs|K'nex|Erector Set|Tinkertoy|Stretch Armstrong|Silly Putty|Easy-Bake Oven|Operation|Simon|Speak & Spell|Teddy Ruxpin|Pogo Stick|Skip-It|Bop It|Tickle Me Elmo|Bratz|Care Bears|Troll Doll|Matchbox Cars|Radio Flyer|Magna-Doodle|Lava Lamp|Koosh Ball|Super Soaker|Rock 'em Sock 'em Robots|Sea-Monkeys|Chatter Telephone|Weebles",
      d: "Clackers|Lawn Darts|Moon Shoes|Creepy Crawlers|Shrinky Dinks|Colorforms|Wooly Willy|Gyroscope|Zoetrope|Kendama|Diabolo|Cup and Ball|Whirligig|Thaumatrope|Bilboquet|Water Wiggler|Pound Puppies|Popples|Glo Worm|Lazer Tag",
      k: "Gilbert U-238 Atomic Energy Lab=atomic energy lab=u-238 lab::A 1950 kids' kit that came with real uranium samples." } },

    { id: "holiday", q: "Name a holiday", t: {
      p: "Christmas|Halloween|Thanksgiving|Easter|New Year's=new years|Valentine's Day=valentines day",
      c: "Festivus|Talk Like a Pirate Day",
      s: "Hanukkah=chanukah|Diwali|Ramadan|Eid|Kwanzaa|Independence Day=fourth of july|St. Patrick's Day|Mother's Day|Father's Day|Memorial Day|Labor Day|Veterans Day|Martin Luther King Jr. Day=mlk day|Presidents' Day|Columbus Day|Passover|Lunar New Year=chinese new year|Day of the Dead=dia de los muertos|Mardi Gras|April Fools' Day|Groundhog Day|Earth Day|Juneteenth|Boxing Day|Cinco de Mayo|Good Friday",
      r: "Yom Kippur|Rosh Hashanah|Purim|Holi|Vesak|Songkran|Nowruz|Guy Fawkes Night=bonfire night|Bastille Day|Canada Day|Australia Day|Anzac Day|Remembrance Day|Oktoberfest|Carnival|Lent|Ash Wednesday|Epiphany|All Saints' Day|Pentecost|Hogmanay|Burns Night|St. Andrew's Day|Mid-Autumn Festival|Dragon Boat Festival|Obon|Tet|Chuseok|Pi Day|Leap Day",
      d: "Up Helly Aa|Saturnalia|Beltane|Samhain|Imbolc|Lughnasadh|Walpurgis Night|Midsummer|Krampusnacht|St. Lucia Day|Sinterklaas|Twelfth Night|Plough Monday|Shrove Tuesday|Maundy Thursday|Whitsun|Lammas|Michaelmas|Martinmas|Candlemas|Setsubun|Hina Matsuri|Tanabata|Loy Krathong|Inti Raymi|Towel Day",
      k: "Mole Day::Celebrated on 10/23 from 6:02 am to 6:02 pm, for Avogadro's number." } },

    { id: "myth", q: "Name a mythological creature", t: {
      p: "Dragon|Unicorn|Mermaid|Phoenix|Vampire|Werewolf",
      c: "Chupacabra|Bigfoot",
      s: "Griffin=gryphon|Centaur|Minotaur|Medusa|Pegasus|Cyclops|Hydra|Kraken|Sphinx|Fairy|Troll|Ogre|Goblin|Elf|Dwarf|Gnome|Leprechaun|Banshee|Zombie|Yeti|Loch Ness Monster=nessie|Siren|Cerberus|Gorgon|Harpy|Satyr|Genie=djinn|Ghost",
      r: "Basilisk|Chimera|Manticore|Wendigo|Kitsune|Kappa|Tengu|Oni|Golem|Selkie|Kelpie|Changeling|Pixie|Sprite|Nymph|Dryad|Naiad|Valkyrie|Fenrir|Jormungandr|Sleipnir|Thunderbird|Roc|Behemoth|Leviathan|Wyvern|Hippogriff|Cockatrice|Jackalope|Mothman|Jersey Devil|Krampus|Baba Yaga|Bunyip|Yowie|Skinwalker",
      d: "Amphisbaena|Bonnacon|Catoblepas|Lamassu|Simurgh|Huma|Baku|Nue|Jorogumo|Nukekubi|Rokurokubi|Tanuki|Encantado|Boitata|Curupira|Mapinguari|Ahool|Mokele-Mbembe|Grootslang|Tikoloshe|Adlet|Qalupalik|Nuckelavee|Each-Uisge|Draugr|Nisse|Fossegrim|Strix|Lamia|Empusa|Ammit|Bakunawa",
      k: "Kasa-obake=umbrella ghost::A Japanese one-eyed umbrella spirit that hops on one leg." } },

    { id: "carbrand", q: "Name a car brand", t: {
      p: "Toyota|Ford|Honda|Chevrolet=chevy|BMW|Tesla",
      c: "DeLorean|Yugo",
      s: "Mercedes-Benz=mercedes|Audi|Volkswagen=vw|Nissan|Hyundai|Kia|Subaru|Mazda|Jeep|Dodge|Ram|GMC|Cadillac|Lexus|Acura|Infiniti|Porsche|Ferrari|Lamborghini|Volvo|Jaguar|Land Rover|Mini|Fiat|Buick|Chrysler|Lincoln|Mitsubishi|Bentley|Rolls-Royce|Maserati",
      r: "Aston Martin|Bugatti|McLaren|Alfa Romeo|Peugeot|Renault|Citroen|Skoda|Seat|Opel|Vauxhall|Saab|Pontiac|Oldsmobile|Plymouth|Mercury|Saturn|Hummer|Genesis|Polestar|Rivian|Lucid|BYD|Lotus|Koenigsegg|Pagani|Suzuki|Isuzu|Daewoo|Smart|Dacia|Lancia|Rover|MG|Holden|Tata|Mahindra",
      d: "Studebaker|Packard|Hudson|Nash|AMC|Tucker|Edsel|Cord|Duesenberg|Pierce-Arrow|Stutz|Auburn|Hispano-Suiza|Isotta Fraschini|Bristol|Morgan|TVR|Reliant|Wartburg|Lada|Moskvitch|Zastava|Proton|Perodua|Hindustan|Spyker|Noble|Ginetta|Caterham|Rimac|Wiesmann|Bizzarrini",
      k: "Trabant::An East German car with a body made of resin-reinforced cotton waste." } }

  ];

  root.CP = root.CP || {};
  root.CP.PROMPTS = (root.CP.PROMPTS || []).concat(PROMPTS);
})(typeof window !== "undefined" ? window : globalThis);
