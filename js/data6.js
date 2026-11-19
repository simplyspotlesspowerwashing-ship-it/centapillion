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

    { id: "scientist", q: "Name a famous scientist", t: {
      p: "Albert Einstein=einstein|Isaac Newton=newton|Marie Curie=curie|Charles Darwin=darwin|Stephen Hawking=hawking",
      c: "Nikola Tesla=tesla|Bill Nye",
      s: "Galileo|Thomas Edison=edison|Copernicus|Louis Pasteur=pasteur|Gregor Mendel=mendel|Alexander Fleming=fleming|Neil deGrasse Tyson|Carl Sagan=sagan|Richard Feynman=feynman|Niels Bohr=bohr|Rosalind Franklin|Jane Goodall|Archimedes|Aristotle|Benjamin Franklin|Alan Turing=turing|Johannes Kepler=kepler|Michael Faraday=faraday|Robert Oppenheimer=oppenheimer|Ada Lovelace",
      r: "Max Planck=planck|Werner Heisenberg=heisenberg|Erwin Schrodinger=schrodinger|James Clerk Maxwell=maxwell|Dmitri Mendeleev=mendeleev|Antoine Lavoisier=lavoisier|Robert Boyle|Robert Hooke|Edwin Hubble=hubble|Enrico Fermi=fermi|Paul Dirac|Ernest Rutherford=rutherford|J.J. Thomson|Linus Pauling|Francis Crick|James Watson|Edward Jenner|Joseph Lister|Florence Nightingale|Rachel Carson|Barbara McClintock|Lise Meitner|Emmy Noether|Katherine Johnson|Tycho Brahe|Alfred Wegener|Alfred Wallace|Carl Linnaeus|Leonhard Euler|Carl Gauss",
      d: "Ignaz Semmelweis|Henrietta Leavitt|Cecilia Payne|Chien-Shiung Wu|Dorothy Hodgkin|Mary Anning|Alexander von Humboldt|Antonie van Leeuwenhoek|Ibn al-Haytham|Al-Khwarizmi|Hypatia|Eratosthenes|Srinivasa Ramanujan|Satyendra Bose|Jagadish Chandra Bose|Hideki Yukawa|Gertrude Elion|Alice Ball|Ernest Just|Marie Tharp|Vera Rubin|Jocelyn Bell Burnell|Tu Youyou|Lynn Margulis",
      k: "Inge Lehmann::Found Earth's solid inner core in 1936 and lived to 104." } },

    { id: "hat", q: "Name a type of hat", t: {
      p: "Baseball Cap=cap|Cowboy Hat|Beanie|Top Hat|Fedora",
      c: "Fascinator|Tinfoil Hat",
      s: "Beret|Bowler Hat=bowler=derby|Sombrero|Trilby|Panama Hat|Bucket Hat|Sun Hat|Visor|Hard Hat|Helmet|Crown|Tiara|Turban|Bandana|Snapback|Trucker Hat|Party Hat|Chef's Hat=toque|Graduation Cap=mortarboard|Fez|Pirate Hat|Witch Hat|Santa Hat",
      r: "Boater|Pork Pie|Deerstalker|Stetson|Akubra|Newsboy Cap=flat cap|Balaclava|Pith Helmet|Tricorn|Bicorne|Busby|Bearskin|Cloche|Pillbox|Bonnet|Kufi|Kippah=yarmulke|Ushanka|Trapper Hat|Glengarry|Tam o' Shanter|Homburg|Gatsby|Garrison Cap|Kepi|Coonskin Cap|Conical Hat=non la",
      d: "Capotain|Phrygian Cap|Petasos|Pileus|Hennin|Wimple|Coif|Mitre|Zucchetto|Biretta|Galero|Shako|Montera|Tembel|Tubeteika|Taqiyah|Karakul|Papakha|Chullo|Gat|Jingasa|Kasa|Tyrolean Hat|Cavalier Hat|Boonie",
      k: "Pickelhaube::The spiked Prussian helmet; the spike was originally a vent." } },

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
