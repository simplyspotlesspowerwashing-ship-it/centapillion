/* Prompt pack 8: specific, Krillion-style prompts with complete answer sets. Format as in data.js. */
(function (root) {
  var PROMPTS = [
    // ---------- at the movies ----------
    { id: "hanksfilm", q: "Name a Tom Hanks movie", t: {
      p: "Forrest Gump|Toy Story|Cast Away|Saving Private Ryan|Big|The Green Mile",
      c: "The 'Burbs=the burbs|Joe Versus the Volcano",
      s: "Apollo 13|Philadelphia|Sleepless in Seattle|You've Got Mail|Catch Me If You Can|The Da Vinci Code|Captain Phillips|Sully|Splash|A League of Their Own|The Terminal|Road to Perdition|Bridge of Spies|Elvis|A Man Called Otto",
      r: "Angels & Demons=angels and demons|Inferno|Cloud Atlas|The Polar Express|Charlie Wilson's War|Larry Crowne|Saving Mr. Banks|The Post|Greyhound|News of the World|Finch|Turner & Hooch=turner and hooch|Bachelor Party|Dragnet|The Money Pit|Punchline|That Thing You Do!|The Ladykillers|Extremely Loud & Incredibly Close|A Beautiful Day in the Neighborhood|Asteroid City|Here|Pinocchio",
      d: "Volunteers|Every Time We Say Goodbye|Nothing in Common|The Man with One Red Shoe|The Bonfire of the Vanities|Radio Flyer|Mazes and Monsters|A Hologram for the King|The Circle|Ithaca|Fallen Angels",
      k: "He Knows You're Alone::A 1980 slasher film that was Tom Hanks's first movie role." } },

    { id: "dicapriofilm", q: "Name a Leonardo DiCaprio movie", t: {
      p: "Titanic|Inception|The Wolf of Wall Street|The Revenant|Catch Me If You Can|The Departed",
      c: "The Quick and the Dead",
      s: "Shutter Island|The Great Gatsby|Django Unchained|Once Upon a Time in Hollywood|Blood Diamond|Romeo + Juliet=romeo and juliet|Gangs of New York|The Aviator|Killers of the Flower Moon|Don't Look Up|One Battle After Another",
      r: "What's Eating Gilbert Grape|The Beach|The Basketball Diaries|Revolutionary Road|Body of Lies|J. Edgar|The Man in the Iron Mask|This Boy's Life|Total Eclipse|Marvin's Room|Celebrity",
      d: "Poison Ivy|Don's Plum|The Foot Shooting Party",
      k: "Critters 3::His 1991 film debut, a horror sequel about furry alien monsters." } },

    { id: "spielbergfilm", q: "Name a Steven Spielberg film", t: {
      p: "Jaws|E.T.=et=e.t. the extra-terrestrial|Jurassic Park|Raiders of the Lost Ark|Schindler's List|Saving Private Ryan",
      c: "Duel|1941",
      s: "Close Encounters of the Third Kind|Indiana Jones and the Temple of Doom=temple of doom|Indiana Jones and the Last Crusade=last crusade|Catch Me If You Can|Minority Report|War of the Worlds|Lincoln|Bridge of Spies|Ready Player One|West Side Story|The Fabelmans|Hook|The Color Purple|Munich|The Terminal|A.I. Artificial Intelligence=ai|The Lost World: Jurassic Park=the lost world",
      r: "Empire of the Sun|Always|Amistad|War Horse|The Adventures of Tintin=tintin|The BFG|The Post|Indiana Jones and the Kingdom of the Crystal Skull=kingdom of the crystal skull|The Sugarland Express",
      d: "Something Evil|Savage|Twilight Zone: The Movie",
      k: "Firelight::A 1964 sci-fi movie Spielberg made at 17 for about $500." } },

    { id: "hitchcockfilm", q: "Name an Alfred Hitchcock film", t: {
      p: "Psycho|The Birds|Vertigo|Rear Window|North by Northwest|Rebecca",
      c: "Rope|Lifeboat",
      s: "Dial M for Murder|Strangers on a Train|Notorious|To Catch a Thief|The 39 Steps|The Lady Vanishes|Spellbound|Shadow of a Doubt|Marnie|Frenzy|The Man Who Knew Too Much|Suspicion|Saboteur|Foreign Correspondent",
      r: "Family Plot|Topaz|Torn Curtain|The Wrong Man|The Trouble with Harry|I Confess|Stage Fright|Under Capricorn|The Paradine Case|Jamaica Inn|Young and Innocent|Sabotage|Secret Agent|Mr. & Mrs. Smith",
      d: "The Lodger|The Pleasure Garden|The Ring|Blackmail|Murder!|Rich and Strange|Number Seventeen|Champagne|The Manxman|Easy Virtue|Downhill|The Farmer's Wife|Juno and the Paycock|Waltzes from Vienna",
      k: "The Mountain Eagle::His second film (1926). Every known print is lost." } },

    { id: "bondfilm", q: "Name a James Bond film", closed: true, t: {
      p: "Goldfinger|Skyfall|Casino Royale|Dr. No=dr no|GoldenEye|Thunderball",
      c: "Casino Royale (1967)|Octopussy",
      s: "From Russia with Love|You Only Live Twice|On Her Majesty's Secret Service|Diamonds Are Forever|Live and Let Die|The Man with the Golden Gun|The Spy Who Loved Me|Moonraker|For Your Eyes Only|The Living Daylights|Licence to Kill=license to kill|Tomorrow Never Dies|The World Is Not Enough|Die Another Day|Quantum of Solace|Spectre|No Time to Die",
      r: "Never Say Never Again",
      d: "A View to a Kill",
      k: "Climax! Casino Royale::A 1954 TV episode: the first Bond on screen was an American, 'Jimmy' Bond." } },

    { id: "mcufilm", q: "Name a Marvel Cinematic Universe movie", t: {
      p: "Iron Man|The Avengers|Avengers: Endgame=endgame|Black Panther|Guardians of the Galaxy|Avengers: Infinity War=infinity war",
      c: "The Incredible Hulk|Eternals",
      s: "Iron Man 2|Thor|Captain America: The First Avenger|Iron Man 3|Thor: The Dark World|Captain America: The Winter Soldier=winter soldier|Avengers: Age of Ultron=age of ultron|Ant-Man|Captain America: Civil War=civil war|Doctor Strange|Guardians of the Galaxy Vol. 2|Spider-Man: Homecoming=homecoming|Thor: Ragnarok=ragnarok|Ant-Man and the Wasp|Captain Marvel|Spider-Man: Far From Home=far from home|Black Widow|Shang-Chi and the Legend of the Ten Rings=shang-chi|Spider-Man: No Way Home=no way home|Doctor Strange in the Multiverse of Madness|Thor: Love and Thunder|Black Panther: Wakanda Forever=wakanda forever|Ant-Man and the Wasp: Quantumania=quantumania|Guardians of the Galaxy Vol. 3|The Marvels|Deadpool & Wolverine=deadpool and wolverine|Captain America: Brave New World|Thunderbolts*=thunderbolts|The Fantastic Four: First Steps=fantastic four first steps",
      r: "Avengers: Doomsday|Spider-Man: Brand New Day",
      d: "Avengers: Secret Wars",
      k: "Werewolf by Night::A 2022 black-and-white Halloween special, the MCU's only full horror film." } },

    { id: "bestactor", q: "Name a Best Actor Oscar winner", t: {
      p: "Leonardo DiCaprio|Tom Hanks|Denzel Washington|Anthony Hopkins|Daniel Day-Lewis|Marlon Brando",
      c: "Jean Dujardin|Roberto Benigni",
      s: "Al Pacino|Jack Nicholson|Robert De Niro|Dustin Hoffman|Matthew McConaughey|Eddie Redmayne|Joaquin Phoenix|Gary Oldman|Rami Malek|Will Smith|Brendan Fraser|Cillian Murphy|Adrien Brody|Sean Penn|Russell Crowe|Kevin Spacey|Jamie Foxx|Philip Seymour Hoffman|Forest Whitaker|Colin Firth|Casey Affleck|Nicolas Cage|Michael Douglas|Paul Newman|Humphrey Bogart|Gregory Peck|Sidney Poitier|John Wayne|Gene Hackman",
      r: "Jeff Bridges|Geoffrey Rush|Ben Kingsley|Henry Fonda|Jon Voight|Richard Dreyfuss|Art Carney|Peter Finch|George C. Scott|Rod Steiger|Charlton Heston|David Niven|Ernest Borgnine|William Holden|Gary Cooper|Jose Ferrer|Broderick Crawford|Ronald Colman|Laurence Olivier|Ray Milland|Fredric March|Bing Crosby|James Cagney|Jimmy Stewart|Spencer Tracy|Robert Donat|Clark Gable|Charles Laughton|Wallace Beery|Lionel Barrymore|F. Murray Abraham|William Hurt|Michael Caine|Robert Duvall|Yul Brynner|Maximilian Schell|Burt Lancaster|Alec Guinness|Rex Harrison|Cliff Robertson",
      d: "Warner Baxter|George Arliss|Paul Lukas|Victor McLaglen",
      k: "Emil Jannings::The first Best Actor winner (1929), who received his Oscar before leaving for Germany." } },

    { id: "bestactress", q: "Name a Best Actress Oscar winner", t: {
      p: "Meryl Streep|Julia Roberts|Halle Berry|Natalie Portman|Kate Winslet|Emma Stone",
      c: "Luise Rainer|Marlee Matlin",
      s: "Katharine Hepburn|Frances McDormand|Jodie Foster|Sandra Bullock|Charlize Theron|Nicole Kidman|Hilary Swank|Cate Blanchett|Jennifer Lawrence|Olivia Colman|Renee Zellweger|Michelle Yeoh|Jessica Chastain|Reese Witherspoon|Gwyneth Paltrow|Helen Mirren|Marion Cotillard|Brie Larson|Julianne Moore|Audrey Hepburn|Elizabeth Taylor|Grace Kelly|Vivien Leigh|Ingrid Bergman|Bette Davis|Joan Crawford|Sophia Loren|Julie Andrews|Barbra Streisand|Jane Fonda|Mikey Madison",
      r: "Diane Keaton|Sally Field|Shirley MacLaine|Jessica Lange|Kathy Bates|Susan Sarandon|Holly Hunter|Emma Thompson|Jessica Tandy|Cher|Geraldine Page|Louise Fletcher|Faye Dunaway|Ellen Burstyn|Glenda Jackson|Liza Minnelli|Maggie Smith|Patricia Neal|Anne Bancroft|Simone Signoret|Joanne Woodward|Anna Magnani|Olivia de Havilland|Jane Wyman|Jennifer Jones|Greer Garson|Joan Fontaine|Ginger Rogers|Claudette Colbert|Norma Shearer|Mary Pickford|Marie Dressler|Helen Hayes|Kim Hunter",
      d: "Shirley Booth|Judy Holliday|Loretta Young",
      k: "Janet Gaynor::The very first Best Actress winner, honoured for three films at once in 1929." } },

    // ---------- music ----------
    { id: "queensong", q: "Name a Queen song", t: {
      p: "Bohemian Rhapsody|We Will Rock You|We Are the Champions|Don't Stop Me Now|Another One Bites the Dust|Under Pressure",
      c: "Flash|Bicycle Race",
      s: "Somebody to Love|Radio Ga Ga|I Want to Break Free|Killer Queen|Crazy Little Thing Called Love|Fat Bottomed Girls|Who Wants to Live Forever|The Show Must Go On|A Kind of Magic|Innuendo|I Want It All|Love of My Life|These Are the Days of Our Lives|Princes of the Universe|You're My Best Friend|One Vision|Hammer to Fall|Too Much Love Will Kill You",
      r: "Seven Seas of Rhye|Now I'm Here|Tie Your Mother Down|Spread Your Wings|'39|Brighton Rock|Keep Yourself Alive|Save Me|Play the Game|Las Palabras de Amor|Breakthru|The Invisible Man|Scandal|Headlong|I'm Going Slightly Mad|Friends Will Be Friends|Mustapha|Good Old-Fashioned Lover Boy|Body Language|Calling All Girls|Back Chat|It's a Hard Life|Thank God It's Christmas|Heaven for Everyone|Let Me Live|No-One but You|Mother Love|Made in Heaven",
      d: "The Prophet's Song|March of the Black Queen|Ogre Battle|Liar|My Fairy King|White Queen|Lazing on a Sunday Afternoon|Sweet Lady|Death on Two Legs|Sheer Heart Attack|Dreamer's Ball|Get Down Make Love|Sail Away Sweet Sister|Dragon Attack|Was It All Worth It",
      k: "Doing All Right::Written by Brian May and Tim Staffell in their pre-Queen band Smile." } },

    { id: "mjsong", q: "Name a Michael Jackson song", t: {
      p: "Thriller|Billie Jean|Beat It|Smooth Criminal|Man in the Mirror|Bad",
      c: "Ben|Rockin' Robin",
      s: "Black or White|Don't Stop 'Til You Get Enough|Rock with You|Wanna Be Startin' Somethin'|The Way You Make Me Feel|Remember the Time|Heal the World|Earth Song|Dirty Diana|They Don't Care About Us|You Are Not Alone|Human Nature|P.Y.T. (Pretty Young Thing)=pyt|Off the Wall|You Rock My World|Scream|In the Closet|Jam|Leave Me Alone|Will You Be There|Liberian Girl|Speed Demon|Another Part of Me|I Just Can't Stop Loving You|She's Out of My Life",
      r: "Got to Be There|One Day in Your Life|Who Is It|Give In to Me|Gone Too Soon|Stranger in Moscow|Blood on the Dance Floor|HIStory|Childhood|Butterflies|Cry|Love Never Felt So Good|Hollywood Tonight|Behind the Mask|Xscape|Workin' Day and Night|Can't Let Her Get Away|Dangerous|Ghosts|Unbreakable|Threatened",
      d: "Morphine|Is It Scary|Tabloid Junkie|Little Susie|Money|D.S.|2 Bad|Elizabeth, I Love You|Al Capone",
      k: "Carousel::A Thriller outtake that sat unreleased until 2001." } },

    { id: "elvissong", q: "Name an Elvis Presley song", t: {
      p: "Hound Dog|Jailhouse Rock|Can't Help Falling in Love|Love Me Tender|Suspicious Minds|Blue Suede Shoes",
      c: "Heartbreak Hotel|All Shook Up",
      s: "Return to Sender|Burning Love|Viva Las Vegas|In the Ghetto|It's Now or Never|Don't Be Cruel|A Little Less Conversation|Are You Lonesome Tonight?|Always on My Mind|Teddy Bear|Blue Christmas|Devil in Disguise|Good Luck Charm|Hard Headed Woman|Wooden Heart|Crying in the Chapel|Kentucky Rain|An American Trilogy",
      r: "That's All Right|Mystery Train|Too Much|Wear My Ring Around Your Neck|One Night|A Fool Such as I|Stuck on You|Surrender|His Latest Flame|Rock-A-Hula Baby|She's Not You|Bossa Nova Baby|If I Can Dream|Polk Salad Annie|Moody Blue|Way Down|Trouble|King Creole|Little Sister|Fever|Steamroller Blues|Separate Ways|My Way|Edge of Reality|Clambake",
      d: "That's When Your Heartaches Begin|Old Shep|Milkcow Blues Boogie|Baby Let's Play House|Good Rockin' Tonight|Blue Moon of Kentucky|I Forgot to Remember to Forget|Do the Clam|Song of the Shrimp|Ito Eats|Petunia, the Gardener's Daughter|There's No Room to Rhumba in a Sports Car",
      k: "My Happiness::The song an 18-year-old Elvis paid to record at Sun Studio in 1953." } },

    { id: "madonnasong", q: "Name a Madonna song", t: {
      p: "Like a Prayer|Like a Virgin|Material Girl|Vogue|Holiday|Hung Up",
      c: "Everybody|Burning Up",
      s: "Papa Don't Preach|La Isla Bonita|Into the Groove|Express Yourself|Frozen|Music|Ray of Light|Lucky Star|Borderline|Crazy for You|Open Your Heart|Cherish|Justify My Love|Take a Bow|Don't Cry for Me Argentina|Like It or Not|4 Minutes|Sorry|American Life|Beautiful Stranger|Die Another Day|Erotica|Secret|Live to Tell|True Blue|Who's That Girl|Dress You Up|Angel",
      r: "Causing a Commotion|Oh Father|Dear Jessie|Hanky Panky|This Used to Be My Playground|Rain|Fever|Deeper and Deeper|Bad Girl|Human Nature|You'll See|Drowned World/Substitute for Love|The Power of Good-Bye|Nothing Really Matters|Don't Tell Me|What It Feels Like for a Girl|Hollywood|Love Profusion|Jump|Give It 2 Me|Celebration|Give Me All Your Luvin'|Girl Gone Wild|Living for Love|Ghosttown|Medellín|I Rise",
      d: "Physical Attraction|Think of Me|I Know It|Over and Over|Shoo-Bee-Doo|Spotlight|Inside of Me|Skin|Mer Girl|Sky Fits Heaven|Candy Shop|Devil Pray|Bitch I'm Madonna",
      k: "Ain't No Big Deal::An early demo she planned as her debut single before 'Everybody' got the slot." } },

    { id: "stonessong", q: "Name a Rolling Stones song", t: {
      p: "(I Can't Get No) Satisfaction=satisfaction|Paint It Black|Sympathy for the Devil|Gimme Shelter|Start Me Up|Angie",
      c: "Ruby Tuesday|Mother's Little Helper",
      s: "Jumpin' Jack Flash|Brown Sugar|Wild Horses|You Can't Always Get What You Want|Honky Tonk Women|Beast of Burden|Miss You|Under My Thumb|Get Off of My Cloud|Let's Spend the Night Together|19th Nervous Breakdown|Tumbling Dice|It's Only Rock 'n Roll|Emotional Rescue|Waiting on a Friend|Harlem Shuffle|Mixed Emotions|Street Fighting Man|Play with Fire|As Tears Go By|Time Is on My Side|The Last Time|Doom and Gloom|Angry",
      r: "Dead Flowers|Can't You Hear Me Knocking|Sweet Virginia|Rocks Off|Happy|Shine a Light|Loving Cup|Midnight Rambler|Monkey Man|Love in Vain|Stray Cat Blues|No Expectations|Jigsaw Puzzle|Salt of the Earth|She's a Rainbow|2000 Light Years from Home|Lady Jane|Out of Time|Under the Boardwalk|Heart of Stone|Not Fade Away|Little Red Rooster|Fool to Cry|Hot Stuff|Respectable|Shattered|Undercover of the Night|One Hit (to the Body)|Love Is Strong|Anybody Seen My Baby?",
      d: "Moonlight Mile|I Got the Blues|Sister Morphine|Sway|Bitch|Torn and Frayed|Ventilator Blues|Casino Boogie|Coming Down Again|Winter|100 Years Ago|Memory Motel|Hand of Fate|Before They Make Me Run|Little T&A|Slave|Sweet Black Angel|Cocksucker Blues",
      k: "Child of the Moon::The B-side of 'Jumpin' Jack Flash', with a video shot in a burning forest." } },

    // ---------- books and screens ----------
    { id: "kingbook", q: "Name a Stephen King book", t: {
      p: "It|The Shining|Carrie|Misery|The Stand|Pet Sematary",
      c: "The Long Walk|Rage",
      s: "Cujo|Christine|Salem's Lot='salems lot|The Green Mile|The Dark Tower|Doctor Sleep|11/22/63|Under the Dome|The Dead Zone|Firestarter|The Outsider|Needful Things|Gerald's Game|Dolores Claiborne|Insomnia|Thinner|The Institute|Holly|Fairy Tale|Billy Summers|Later|Joyland|Mr. Mercedes|Cell|Duma Key|Lisey's Story|Bag of Bones|Dreamcatcher|Rita Hayworth and Shawshank Redemption=the shawshank redemption|The Body|Different Seasons|Night Shift|Skeleton Crew",
      r: "The Gunslinger|The Drawing of the Three|The Waste Lands|Wizard and Glass|Wolves of the Calla|Song of Susannah|The Talisman|Black House|The Tommyknockers|The Dark Half|Rose Madder|Desperation|The Regulators|The Girl Who Loved Tom Gordon|Hearts in Atlantis|From a Buick 8|Blaze|Revival|Finders Keepers|End of Watch|Elevation|Sleeping Beauties|The Running Man|Roadwork|The Eyes of the Dragon|Cycle of the Werewolf|Four Past Midnight|Nightmares & Dreamscapes|Everything's Eventual|Just After Sunset|Full Dark, No Stars|Bazaar of Bad Dreams|If It Bleeds|You Like It Darker|Never Flinch|Gwendy's Button Box|The Colorado Kid|UR",
      d: "Blockade Billy|The Plant|Faithful|On Writing|Danse Macabre|Guns|The Wind Through the Keyhole|Rose Red|Storm of the Century|Silver Bullet|Creepshow|Dark Tower: The Little Sisters of Eluria|N.|Mile 81|In the Tall Grass|Laurie|Rat|Slade",
      k: "Jhonathan and the Witches::A fairy tale King wrote at age 9, published in a 1993 anthology." } },

    { id: "swplanet", q: "Name a Star Wars planet", t: {
      p: "Tatooine|Hoth|Endor|Naboo|Coruscant|Alderaan",
      c: "Dagobah|Kessel",
      s: "Mustafar|Kashyyyk|Bespin|Kamino|Geonosis|Yavin 4=yavin|Jakku|Mandalore|Scarif|Utapau|Mon Cala|Lothal|Exegol|Starkiller Base|Crait|Ahch-To|Takodana|Jedha|Ryloth|Felucia|Dathomir|Corellia|Nevarro|Ferrix",
      r: "Mygeeto|Saleucami|Cato Neimoidia|Polis Massa|Christophsis|Umbara|Onderon|Lah'mu|Eadu|Batuu|Canto Bight|Cantonica|Pasaana|Kijimi|Ajan Kloss|Vandor|Mimban|Savareen|Malachor|Atollon|Ilum|Moraband|Korriban|Tython|Lehon|Taris|Dantooine|Manaan|Zeffo|Bogano|Tanalorr|Morak|Aldhani|Niamos|Narkina 5|Sullust",
      d: "Bastatha|Ruusan|Ossus|Rakata Prime|Csilla|Bakura|Myrkr|Ithor|Bimmiel|Belsavis|Ziost|Zakuul",
      k: "Ord Mantell::Name-dropped by Han Solo in The Empire Strikes Back as where he met a bounty hunter." } },

    { id: "avenger", q: "Name a member of the Avengers", t: {
      p: "Iron Man|Captain America|Thor|Hulk|Black Widow|Hawkeye",
      c: "Ant-Man|Wasp",
      s: "Spider-Man|Black Panther|Doctor Strange|Scarlet Witch|Vision|Falcon|War Machine|Captain Marvel|Winter Soldier|Quicksilver|Wolverine|Ms. Marvel|She-Hulk|Hercules|Wonder Man|Beast|Mockingbird|Tigra|Moon Knight|Luke Cage|Sentry|Spider-Woman",
      r: "Quasar|Starfox|Black Knight|Swordsman|Mantis|Hellcat|Firestar|Justice|Silverclaw|Crystal|Sersi|Moondragon|Two-Gun Kid|Triathlon|Jack of Hearts|Echo|Hyperion|Nightmask|Smasher|Captain Universe|Manifold|Cannonball|Sunspot|Squirrel Girl|Monica Rambeau|Photon|Doctor Druid|Thunderstrike|Rage|Living Lightning",
      d: "Gilgamesh|Masque|Deathcry|Demolition Man|Stingray|Machine Man|Darkhawk|Sandman|Spectrum|Blue Marvel|Nighthawk|Captain Britain|Valkyrie|Red Hulk|Rogue|Havok",
      k: "Rick Jones::A teenage sidekick credited in the comics with bringing the original Avengers together." } },

    { id: "xmen", q: "Name a member of the X-Men", t: {
      p: "Wolverine|Storm|Cyclops|Jean Grey|Professor X=charles xavier|Rogue",
      c: "Jubilee|Gambit",
      s: "Beast|Iceman|Angel|Archangel|Nightcrawler|Colossus|Kitty Pryde=shadowcat|Psylocke|Cable|Bishop|Emma Frost|Havok|Polaris|Magik|Dazzler|Banshee|Forge|Domino|Deadpool|X-23=laura kinney|Cannonball|Sunspot|Mirage|Magneto|Phoenix|Rachel Summers",
      r: "Sunfire|Longshot|Marvel Girl|Strong Guy|Multiple Man|Northstar|Warpath|Wolfsbane|Karma|Magma|Boom-Boom|Husk|Chamber|M|Marrow|Maggott|Cecilia Reyes|Joseph|Sage|Mimic|Changeling|Armor|Pixie|Hellion|Surge|Anole|Blindfold|Rockslide|Gentle",
      d: "Doop|Fantomex|Omega Sentinel|Lifeguard|Slipstream|Cypher|Darwin|Vulcan|Petra|Sway|Kid Omega|Glob Herman",
      k: "Thunderbird::John Proudstar joined in 1975 and died on just his second mission." } },

    { id: "nintendogame", q: "Name a Nintendo video game", t: {
      p: "Super Mario Bros.=super mario bros|Mario Kart|The Legend of Zelda=zelda|Super Smash Bros.=smash bros|Pokémon=pokemon|Animal Crossing",
      c: "Duck Hunt|Punch-Out!!=punch out",
      s: "Super Mario 64|Super Mario Odyssey|Super Mario Galaxy|Mario Kart 8|Mario Kart Wii|Breath of the Wild|Tears of the Kingdom|Ocarina of Time|Majora's Mask|Twilight Princess|Wind Waker|Link's Awakening|Metroid|Metroid Prime|Kirby|Donkey Kong|Donkey Kong Country|Star Fox|F-Zero|Pikmin|Splatoon|Mario Party|Wii Sports|Wii Fit|Brain Age|Nintendogs|Luigi's Mansion|Super Mario World|Super Mario Bros. 3|Yoshi's Island|Fire Emblem|Xenoblade Chronicles|EarthBound|Kid Icarus|Paper Mario|Mario Tennis|Mario Golf|Dr. Mario|Tetris|Ring Fit Adventure|Arms|1-2-Switch|Super Mario Wonder|Mario Kart World",
      r: "Excitebike|Ice Climber|Balloon Fight|Wrecking Crew|Clu Clu Land|Urban Champion|Golf|Tennis|Wild Gunman|Hogan's Alley|Kid Icarus: Uprising|Metroid Dread|Advance Wars|Wario Land|WarioWare|Mario & Luigi|Captain Toad: Treasure Tracker|Kirby's Epic Yarn|Yoshi's Woolly World|Chibi-Robo!|Custom Robo|Pokémon Snap|Pokémon Stadium|Pokémon Colosseum|Pikmin 4|Bayonetta 2|Astral Chain|Fire Emblem: Three Houses|Tomodachi Life|Miitopia|Nintendo Land|Wii Party|Wii Play|Game & Watch|Golden Sun|Sin and Punishment|Star Fox Adventures",
      d: "Sheriff|Donkey Kong Jr. Math|Mach Rider|Stack-Up|Gyromite|Kaeru no Tame ni Kane wa Naru|Famicom Detective Club|Marvelous|Mother|Doshin the Giant|Giftpia|Pullblox|Dillon's Rolling Western|Steel Diver|Jump Super Stars|Hotel Dusk|Captain Rainbow|Fossil Fighters|Rhythm Heaven",
      k: "Radar Scope::A failed 1980 arcade shooter whose unsold cabinets were converted into Donkey Kong." } },

    // ---------- history and myth ----------
    { id: "romanemperor", q: "Name a Roman emperor", t: {
      p: "Julius Caesar|Augustus|Nero|Caligula|Marcus Aurelius|Constantine",
      c: "Commodus|Hadrian",
      s: "Tiberius|Claudius|Vespasian|Titus|Domitian|Trajan|Antoninus Pius|Septimius Severus|Caracalla|Diocletian|Theodosius|Justinian|Nerva|Galba|Otho|Vitellius|Elagabalus|Severus Alexander|Aurelian|Romulus Augustulus|Julian|Valentinian|Valens|Honorius|Arcadius|Lucius Verus|Didius Julianus|Macrinus|Maximinus Thrax|Gordian|Philip the Arab|Decius|Valerian|Gallienus|Claudius Gothicus|Probus|Carus|Galerius|Maximian|Licinius|Constantius",
      r: "Geta|Balbinus|Pupienus|Trebonianus Gallus|Aemilian|Quintillus|Tacitus|Florian|Carinus|Numerian|Constantius Chlorus|Severus II|Maxentius|Maximinus Daia|Constantine II|Constans|Constantius II|Jovian|Gratian|Valentinian II|Magnus Maximus|Eugenius|Theodosius II|Valentinian III|Petronius Maximus|Avitus|Majorian|Libius Severus|Anthemius|Olybrius|Glycerius|Julius Nepos|Leo I|Zeno|Anastasius",
      d: "Gordian I|Gordian II|Gordian III|Hostilian|Herennius Etruscus|Volusian|Postumus|Victorinus|Tetricus|Vaballathus|Carausius|Allectus|Vetranio|Nepotianus|Magnentius|Procopius|Priscus Attalus|Constantine III|Jovinus|Johannes",
      k: "Pertinax::Ruled 87 days in AD 193 before the Praetorian Guard killed him and auctioned the throne." } },

    { id: "pope", q: "Name a pope", t: {
      p: "Pope Francis=francis|John Paul II|Benedict XVI|Peter=saint peter|Leo XIV|Pius XII",
      c: "Joan=pope joan|Celestine V",
      s: "John XXIII|Paul VI|John Paul I|Pius XI|Benedict XV|Pius X|Leo XIII|Pius IX|Gregory the Great=gregory i|Leo the Great=leo i|Innocent III|Urban II|Gregory VII|Boniface VIII|Alexander VI|Julius II|Leo X|Sixtus IV|Clement VII|Paul III|Pius V|Gregory XIII|Sixtus V|Urban VIII|Innocent X|Benedict XIV|Pius VI|Pius VII|Gregory XVI|Linus|Clement I",
      r: "Adrian IV|Adrian VI|Hadrian I|Formosus|Stephen VI|Sergius III|John XII|Sylvester II|Leo IX|Nicholas II|Alexander III|Innocent IV|Gregory IX|Nicholas III|Martin V|Eugene IV|Nicholas V|Callixtus III|Pius II|Paul II|Innocent VIII|Pius III|Marcellus II|Paul IV|Pius IV|Clement VIII|Paul V|Gregory XV|Alexander VII|Clement IX|Clement X|Innocent XI|Alexander VIII|Innocent XII|Clement XI|Innocent XIII|Benedict XIII|Clement XII|Clement XIII|Clement XIV|Leo XII|Pius VIII|Sylvester I|Damasus I|Gelasius I",
      d: "Anacletus|Evaristus|Alexander I|Telesphorus|Hyginus|Anicetus|Soter|Eleutherius|Victor I|Zephyrinus|Callixtus I|Urban I|Pontian|Anterus|Fabian|Cornelius|Lucius I|Dionysius|Felix I|Eutychian|Caius|Marcellinus|Marcellus I|Eusebius|Miltiades|Mark|Liberius|Siricius|Anastasius I|Zosimus|Boniface I|Hilarius|Simplicius|Hormisdas|Vigilius|Pelagius I|Sabinian|Deusdedit|Theodore I|Agatho|Conon|Constantine I|Zachary",
      k: "Sisinnius::Pope for just 20 days in 708." } },

    { id: "scotus", q: "Name a U.S. Supreme Court justice", t: {
      p: "Ruth Bader Ginsburg=rbg|Clarence Thomas|John Roberts|Sonia Sotomayor|Antonin Scalia|Thurgood Marshall",
      c: "John Jay|Oliver Wendell Holmes",
      s: "Brett Kavanaugh|Amy Coney Barrett|Neil Gorsuch|Ketanji Brown Jackson|Samuel Alito|Elena Kagan|Stephen Breyer|Anthony Kennedy|Sandra Day O'Connor|David Souter|John Paul Stevens|William Rehnquist|Earl Warren|John Marshall|William Howard Taft|Warren Burger|Harry Blackmun|Lewis Powell|Byron White|William Brennan|Felix Frankfurter|Hugo Black|William O. Douglas|Louis Brandeis|Roger Taney|Merrick Garland",
      r: "Charles Evans Hughes|Harlan Fiske Stone|Fred Vinson|Robert Jackson|Benjamin Cardozo|Potter Stewart|Abe Fortas|Arthur Goldberg|John Marshall Harlan|Joseph Story|Salmon Chase|Morrison Waite|Melville Fuller|Edward Douglass White|Stanley Reed|Frank Murphy|Wiley Rutledge|Owen Roberts|James McReynolds|George Sutherland|Pierce Butler|Willis Van Devanter|Sherman Minton|Harold Burton|Tom Clark|Charles Whittaker",
      d: "John Rutledge|William Cushing|James Wilson|John Blair|James Iredell|William Paterson|Samuel Chase|Oliver Ellsworth|Bushrod Washington|Alfred Moore|William Johnson|Brockholst Livingston|Thomas Todd|Gabriel Duvall|Smith Thompson|Robert Trimble|John McLean|Henry Baldwin|James Moore Wayne|Philip Barbour|John Catron|John McKinley|Peter Vivian Daniel|Samuel Nelson|Levi Woodbury|Robert Cooper Grier|Benjamin Curtis|John Archibald Campbell|Nathan Clifford",
      k: "Thomas Johnson::Served under 6 months (1791-93) and wrote just one opinion." } },

    { id: "egyptgod", q: "Name an Egyptian god or goddess", t: {
      p: "Ra=re|Anubis|Osiris|Isis|Horus|Set=seth",
      c: "Bastet|Sobek",
      s: "Thoth|Hathor|Ptah|Amun=amon|Nut|Geb|Shu|Tefnut|Nephthys|Sekhmet|Ma'at=maat|Khnum|Bes|Taweret|Aten|Atum|Khonsu|Apep=apophis|Amun-Ra=amun ra|Mut|Neith|Montu|Min|Hapi|Serqet=selket|Wadjet|Nekhbet|Khepri|Imhotep",
      r: "Anuket|Satis|Heqet|Meretseger|Renenutet|Seshat|Shezmu|Sopdet|Wepwawet|Aker|Babi|Bennu|Hu|Sia|Heka|Kek|Nun|Naunet|Huh|Hauhet|Amaunet|Mehen|Mafdet|Menhit|Pakhet|Wosret|Raettawy|Reshep|Qetesh|Astarte|Anat|Dedun|Mandulis|Arensnuphis|Apedemak|Shai|Meskhenet|Tatenen|Hedetet|Iusaaset",
      d: "Ammit|Am-heh|Bata|Ha|Hemsut|Iah|Kebechet|Mehet-Weret|Nehebkau|Qebehsenuef|Imsety|Duamutef|Seker|Tayet|Unut|Weneg|Werethekau|Yamm",
      k: "Ihy::A child god of music, depicted shaking a sistrum rattle." } },

    { id: "norsegod", q: "Name a Norse god or goddess", t: {
      p: "Odin|Thor|Loki|Freya=freyja|Frigg|Baldur=balder",
      c: "Tyr|Heimdall",
      s: "Frey=freyr|Hel|Njord|Bragi|Idun=idunn|Sif|Skadi|Vidar|Vali|Ullr|Forseti|Hodr=hod|Mimir|Ran|Aegir|Jord|Sigyn|Nanna|Fulla|Gefjon|Sol|Mani|Ymir|Fenrir|Jormungandr|Surtr|Valkyries|Norns",
      r: "Hoenir|Kvasir|Lodurr|Magni|Modi|Thrud|Gerd|Gna|Hlin|Lofn|Saga|Sjofn|Snotra|Syn|Var|Vor|Eir|Ostara|Dellingr|Nott|Dagr|Hermod|Borr|Buri|Vili|Ve|Bestla|Mundilfari|Hyndla|Elli",
      d: "Aurvandil|Beyla|Haddingjar|Heidrun|Holler|Lytir|Meili|Rindr|Ullin|Gullveig|Hlodyn|Fjorgyn|Odr",
      k: "Byggvir::A tiny servant of Freyr, mentioned once, thought to personify barley." } },

    { id: "hindugod", q: "Name a Hindu god or goddess", t: {
      p: "Shiva|Vishnu|Brahma|Ganesha=ganesh|Krishna|Lakshmi",
      c: "Hanuman|Kali",
      s: "Rama|Durga|Parvati|Saraswati|Indra|Agni|Surya|Vayu|Varuna|Yama|Kartikeya=murugan=skanda|Sita|Radha|Shakti|Ganga|Kama|Chandra|Narasimha|Varaha|Matsya|Kurma|Vamana|Parashurama|Balarama|Kalki|Jagannath|Venkateswara|Ayyappan|Vishvakarma",
      r: "Kubera|Rati|Soma|Rudra|Mitra|Aryaman|Bhaga|Pushan|Tvashtr|Savitr|Ushas|Ratri|Prithvi|Dyaus|Aditi|Diti|Ashvins|Maruts|Vasus|Bhairava|Virabhadra|Annapurna|Chamunda|Chinnamasta|Bhuvaneshvari|Tara|Kamakhya|Meenakshi|Mariamman|Santoshi Mata|Sheetala|Manasa|Bhumi|Dhanvantari|Hayagriva|Garuda|Nandi",
      d: "Ayyanar|Khandoba|Shasta|Bagalamukhi|Dhumavati|Matangi|Kamalatmika|Tripura Sundari|Kaumari|Vaishnavi|Varahi|Indrani|Brahmani|Maheshvari|Kalaratri|Kushmanda|Skandamata|Katyayani|Siddhidatri|Shailaputri|Brahmacharini|Chandraghanta|Mahagauri",
      k: "Vithoba::A form of Vishnu worshipped standing on a brick at Pandharpur." } },

    { id: "englishmonarch", q: "Name an English or British monarch", t: {
      p: "Elizabeth II|Henry VIII|Queen Victoria=victoria|Charles III|Elizabeth I|William the Conqueror=william i",
      c: "Lady Jane Grey|Edward VIII",
      s: "George VI|George V|Edward VII|William IV|George IV|George III|George II|George I|Anne|William III|Mary II|James II|Charles II|Charles I|James I|Mary I|Edward VI|Henry VII|Richard III|Edward V|Edward IV|Henry VI|Henry V|Henry IV|Richard II|Edward III|Edward II|Edward I|Henry III|King John=john|Richard I=richard the lionheart|Henry II|Stephen|Henry I|William II|Harold II|Edward the Confessor|Alfred the Great|Cnut=canute|Athelstan",
      r: "Matilda|Harold Harefoot|Harthacnut|Edmund Ironside|Æthelred the Unready=ethelred the unready|Edgar the Peaceful|Edward the Martyr|Edwy|Edmund I|Eadred|Edward the Elder|Sweyn Forkbeard|Oliver Cromwell|Richard Cromwell",
      d: "Æthelwulf|Æthelbald|Æthelberht|Æthelred I|Egbert|Offa|Penda|Raedwald|Edwin of Northumbria|Oswald|Ine of Wessex|Cædwalla",
      k: "Edgar Ætheling::Proclaimed king after the Battle of Hastings in 1066 but never crowned." } },

    { id: "firstlady", q: "Name a U.S. First Lady", t: {
      p: "Michelle Obama|Jacqueline Kennedy=jackie kennedy=jackie o|Eleanor Roosevelt|Hillary Clinton|Melania Trump|Laura Bush",
      c: "Dolley Madison|Martha Washington",
      s: "Nancy Reagan|Barbara Bush|Jill Biden|Rosalynn Carter|Betty Ford|Pat Nixon|Lady Bird Johnson|Mamie Eisenhower|Bess Truman|Abigail Adams|Mary Todd Lincoln|Edith Wilson|Lou Hoover|Grace Coolidge|Florence Harding|Helen Taft|Edith Roosevelt|Ida McKinley|Frances Cleveland|Lucy Hayes|Julia Grant",
      r: "Martha Jefferson Randolph|Elizabeth Monroe|Louisa Adams|Emily Donelson|Angelica Van Buren|Anna Harrison|Letitia Tyler|Julia Tyler|Sarah Polk|Margaret Taylor|Abigail Fillmore|Jane Pierce|Eliza Johnson|Lucretia Garfield|Mary Arthur McElroy|Rose Cleveland|Caroline Harrison|Mary Harrison McKee|Ellen Wilson",
      d: "Hannah Van Buren|Rachel Jackson|Ellen Arthur|Martha Wayles Jefferson|Priscilla Tyler|Mary Elizabeth Taylor Bliss|Martha Johnson Patterson",
      k: "Harriet Lane::Served as hostess for her bachelor uncle, President James Buchanan." } },

    // ---------- places ----------
    { id: "tube", q: "Name a London Underground station", t: {
      p: "King's Cross St Pancras=kings cross=king's cross|Oxford Circus|Baker Street|Waterloo|Victoria|Piccadilly Circus",
      c: "Cockfosters",
      s: "Paddington|Liverpool Street|London Bridge|Euston|Bank|Westminster|Leicester Square|Covent Garden|Tottenham Court Road|Bond Street|Green Park|Embankment|Charing Cross|Holborn|Camden Town|Angel|Brixton|Stratford|Canary Wharf|Wimbledon|Heathrow|Hammersmith|Notting Hill Gate|Earl's Court|South Kensington|Knightsbridge|Hyde Park Corner|Marble Arch|Tower Hill|Old Street|Moorgate|Farringdon|Aldgate|Elephant & Castle=elephant and castle|Shepherd's Bush|Highbury & Islington|Finsbury Park|Seven Sisters|Walthamstow Central|Wembley Park",
      r: "Arsenal|Archway|Barbican|Blackfriars|Borough|Bethnal Green|Bow Road|Chalk Farm|Clapham Common|Clapham North|Clapham South|Colliers Wood|Edgware Road|Gloucester Road|Goodge Street|Great Portland Street|Holland Park|Kennington|Lambeth North|Lancaster Gate|Mansion House|Marylebone|Monument|Oval|Pimlico|Queensway|Regent's Park|Russell Square|Sloane Square|St James's Park|St Paul's|Southwark|Stockwell|Temple|Vauxhall|Warren Street|Whitechapel|Mile End|Hampstead|Belsize Park|Kentish Town|Tufnell Park|Highgate|East Finchley|Golders Green|Morden|Tooting Bec|Balham|Richmond|Upminster|Epping|Amersham|Uxbridge|Ealing Broadway|Acton Town|Hounslow West|Harrow-on-the-Hill|Stanmore|Edgware|High Barnet",
      d: "Chesham|Chorleywood|Croxley|Moor Park|North Harrow|Pinner|Rayners Lane|Ruislip Manor|Ickenham|Hillingdon|West Ruislip|Theydon Bois|Debden|Loughton|Buckhurst Hill|Roding Valley|Chigwell|Grange Hill|Hainault|Fairlop|Barkingside|Newbury Park|Gants Hill|Redbridge|Wanstead|Snaresbrook|South Woodford|Woodford|Leytonstone|Leyton|Upney|Becontree|Dagenham Heathway|Dagenham East|Elm Park|Hornchurch|Upminster Bridge|Perivale|Hanger Lane|North Ealing|Park Royal|Alperton|Sudbury Town|Sudbury Hill|South Harrow|Northfields|Boston Manor|Osterley|Hatton Cross|Kew Gardens|Gunnersbury|Turnham Green|Stamford Brook|Ravenscourt Park|Goldhawk Road|Wood Lane|Latimer Road|Ladbroke Grove|Westbourne Park|Royal Oak|Warwick Avenue|Maida Vale|Kilburn Park|Queen's Park|Kensal Green|Willesden Junction|Harlesden|Stonebridge Park|Kenton|South Kenton|North Wembley|Burnt Oak|Colindale|Hendon Central|Brent Cross|Mill Hill East|West Finchley|Woodside Park|Totteridge & Whetstone|Arnos Grove|Bounds Green|Wood Green|Turnpike Lane|Manor House|Southgate|Oakwood|Blackhorse Road|Tottenham Hale|Pudding Mill Lane",
      k: "Mornington Crescent::Named a deliberately baffling radio 'game' on I'm Sorry I Haven't a Clue." } },

    { id: "greekisland", q: "Name a Greek island", t: {
      p: "Crete|Santorini|Mykonos|Corfu|Rhodes|Kos",
      c: "Lesbos|Ithaca",
      s: "Zakynthos=zante|Kefalonia=cephalonia|Naxos|Paros|Ios|Milos|Hydra|Aegina|Skiathos|Skopelos|Lefkada|Thassos|Samos|Chios|Patmos|Karpathos|Symi|Kalymnos|Leros|Andros|Tinos|Syros|Spetses|Poros|Euboea=evia|Delos|Sifnos|Folegandros|Amorgos|Antiparos|Kythira|Alonissos|Lemnos|Ikaria|Kastellorizo|Halki|Tilos|Nisyros|Astypalaia",
      r: "Kea|Kythnos|Serifos|Sikinos|Anafi|Donoussa|Koufonisia|Schinoussa|Iraklia|Kimolos|Salamis|Agistri|Skyros|Samothrace|Agios Efstratios|Psara|Oinousses|Fournoi|Lipsi|Agathonisi|Arki|Pserimos|Telendos|Kasos|Chrysi|Spinalonga|Paxos|Antipaxos|Ereikoussa|Othonoi|Mathraki|Meganisi|Kalamos|Kastos|Elafonisos|Dokos|Spetsopoula|Gyaros|Makronisos",
      d: "Kardiotissa|Polyaigos|Thirasia|Nea Kameni|Palea Kameni|Christiana|Strofades|Sapientza|Schiza|Elafonisi|Dia|Gramvousa|Antikythera|Stamfani|Arpyia|Kyra Panagia|Piperi|Gioura|Skantzoura|Peristera|Antimilos|Sofrano|Saria",
      k: "Gavdos::The southernmost inhabited point in Europe, a small island south of Crete." } },

    { id: "californiacity", q: "Name a city in California", t: {
      p: "Los Angeles=la|San Francisco=sf|San Diego|Sacramento|San Jose|Oakland",
      c: "Weed|Needles",
      s: "Fresno|Long Beach|Anaheim|Santa Ana|Riverside|Irvine|Bakersfield|Stockton|Berkeley|Pasadena|Santa Barbara|Santa Monica|Malibu|Beverly Hills|Palm Springs|Santa Cruz|Monterey|Carmel-by-the-Sea=carmel|Napa|Sonoma|Palo Alto|Mountain View|Cupertino|Sunnyvale|Santa Clara|Redwood City|San Mateo|Fremont|Hayward|Modesto|Chula Vista|Oceanside|Huntington Beach|Newport Beach|Laguna Beach|Burbank|Glendale|Torrance|Inglewood|Compton|West Hollywood|Hollywood|Venice|Redding|Eureka",
      r: "Visalia|Merced|Salinas|San Luis Obispo|Ventura|Oxnard|Thousand Oaks|Simi Valley|Lancaster|Palmdale|Victorville|San Bernardino|Ontario|Pomona|Rancho Cucamonga|Fontana|Moreno Valley|Temecula|Murrieta|Escondido|Carlsbad|Encinitas|Del Mar|La Jolla|Coronado|El Cajon|Chico|Davis|Vallejo|Fairfield|Vacaville|Concord|Walnut Creek|Antioch|Richmond|Alameda|San Leandro|Daly City|South San Francisco|Half Moon Bay|Sausalito|Mill Valley|San Rafael|Petaluma|Santa Rosa|Healdsburg|Ukiah|Fort Bragg|Mendocino|Arcata|Crescent City|Yreka|Lake Tahoe|South Lake Tahoe|Truckee|Mammoth Lakes|Bishop|Barstow|Indio|Palm Desert|Coachella|El Centro|Calexico",
      d: "Industry|Bradbury|Amador City|Trinidad|Sand City|Etna|Dorris|Fort Jones|Tulelake|Montague|Loyalton|Isleton|Portola|Biggs|Plymouth|Point Arena|Blue Lake|Ferndale|Rio Dell|Colma|Hidden Hills|Rolling Hills|Avalon|Holtville|Calipatria|Westmorland|Maricopa|Taft|Wasco|McFarland|Arvin|Tehachapi|Ridgecrest|California City",
      k: "Vernon::An industrial city in LA County with about 200 residents." } },

    { id: "texascity", q: "Name a city in Texas", t: {
      p: "Houston|Dallas|Austin|San Antonio|Fort Worth|El Paso",
      c: "Waco|Paris",
      s: "Arlington|Corpus Christi|Plano|Lubbock|Laredo|Irving|Garland|Frisco|McKinney|Amarillo|Brownsville|Killeen|Pasadena|Midland|Odessa|Beaumont|Round Rock|Denton|Abilene|Tyler|College Station|Galveston|Sugar Land|The Woodlands|San Marcos|New Braunfels|Lewisville|Richardson|Grand Prairie|Mesquite|Carrollton|Allen|League City|Pearland|Wichita Falls|McAllen|Edinburg|Harlingen|Temple|Bryan|Conroe|Longview|Victoria|Texarkana|Marfa",
      r: "Kerrville|Fredericksburg|Boerne|Seguin|Lockhart|Luling|Bastrop|Georgetown|Cedar Park|Pflugerville|Leander|Kyle|Buda|Wimberley|Dripping Springs|Lufkin|Nacogdoches|Huntsville|Sherman|Denison|Gainesville|Weatherford|Mineral Wells|Stephenville|Granbury|Cleburne|Waxahachie|Corsicana|Ennis|Athens|Palestine|Marshall|Jefferson|Kilgore|Port Arthur|Orange|Baytown|La Porte|Texas City|Freeport|Lake Jackson|Bay City|Rockport|Port Aransas|Kingsville|Alice|Del Rio|Eagle Pass|Uvalde|Alpine|Fort Stockton|Big Spring|Sweetwater|San Angelo|Brownwood|Pampa|Borger|Dumas|Childress|Vernon",
      d: "Terlingua|Luckenbach|Study Butte|Lajitas|Presidio|Valentine|Van Horn|Sierra Blanca|Mentone|Kent|Lipscomb|Mobeetie|Medicine Mound|Turkey|Quitaque|Matador|Guthrie|Paint Rock|Comfort|Bandera|Utopia|Tarpley|Leakey|Camp Wood|Langtry|Sanderson|Dryden|Marathon|Shafter|Cut and Shoot|Muleshoe|Earth|Nazareth|Happy",
      k: "Ding Dong::A Bell County community named after two families called Bell." } },

    { id: "floridacity", q: "Name a city in Florida", t: {
      p: "Miami|Orlando|Tampa|Jacksonville|Tallahassee|Key West",
      c: "Celebration|Kissimmee",
      s: "Fort Lauderdale|St. Petersburg|Clearwater|Sarasota|Naples|Fort Myers|Gainesville|Pensacola|Daytona Beach|West Palm Beach|Palm Beach|Boca Raton|Hollywood|Cape Coral|Port St. Lucie|Lakeland|Ocala|Melbourne|Cocoa Beach|Titusville|St. Augustine|Panama City|Destin|Miami Beach|Coral Gables|Hialeah|Homestead|Key Largo|Marathon|Fort Walton Beach|Delray Beach|Jupiter|Bradenton|Sanibel|Winter Park",
      r: "Pompano Beach|Deerfield Beach|Coral Springs|Plantation|Sunrise|Davie|Weston|Miramar|Pembroke Pines|Doral|Aventura|Sunny Isles Beach|Hallandale Beach|Dania Beach|Boynton Beach|Lake Worth|Wellington|Palm Beach Gardens|Stuart|Vero Beach|Sebastian|Palm Bay|Rockledge|New Smyrna Beach|Ormond Beach|Palm Coast|Deltona|Sanford|Altamonte Springs|Apopka|Clermont|Leesburg|The Villages|Mount Dora|Winter Haven|Bartow|Sebring|Avon Park|Arcadia|Punta Gorda|Port Charlotte|Venice|North Port|Bonita Springs|Marco Island|Immokalee|Everglades City|Islamorada|Big Pine Key|Apalachicola|Cedar Key|Crystal River|Brooksville|Dade City|Zephyrhills|Plant City|Tarpon Springs|Dunedin|Largo|Pinellas Park|Seminole|St. Pete Beach|Madeira Beach|Lake City|Live Oak|Fernandina Beach|Palatka",
      d: "Two Egg|Christmas|Yeehaw Junction|Lake Buena Vista|Bay Lake|Golden Beach|Indian Creek|Islandia|Jupiter Inlet Colony|Briny Breezes|Sopchoppy|Carrabelle|Chattahoochee|Bonifay|Paxton|Jay|Century|Eatonville|Montverde",
      k: "Weeki Wachee::A Florida city famous for live 'mermaid' shows, with a population of about 10." } },

    { id: "landlocked", q: "Name a landlocked country", t: {
      p: "Switzerland|Austria|Mongolia|Bolivia|Paraguay|Afghanistan",
      c: "Vatican City=vatican|Liechtenstein",
      s: "Nepal|Bhutan|Laos|Kazakhstan|Kyrgyzstan|Tajikistan|Turkmenistan|Hungary|Czechia=czech republic|Slovakia|Serbia|North Macedonia=macedonia|Belarus|Moldova|Armenia|Azerbaijan|Luxembourg|Andorra|San Marino|Ethiopia|South Sudan|Uganda|Rwanda|Burundi|Zambia|Zimbabwe|Malawi|Botswana|Lesotho|Eswatini=swaziland|Chad|Niger|Mali|Burkina Faso|Central African Republic",
      r: "Artsakh|South Ossetia|Transnistria",
      d: "Kosovo",
      k: "Uzbekistan::One of only two doubly landlocked countries, with Liechtenstein." } },

    { id: "islandnation", q: "Name an island country", t: {
      p: "Japan|United Kingdom=uk|Iceland|New Zealand|Madagascar|Jamaica",
      c: "Nauru|Tuvalu",
      s: "Ireland|Philippines|Indonesia|Cuba|Sri Lanka|Taiwan|Singapore|Malta|Cyprus|Bahrain|Maldives|Mauritius|Seychelles|Fiji|Samoa|Tonga|Bahamas|Barbados|Trinidad and Tobago|Dominican Republic|Haiti|Papua New Guinea|Timor-Leste=east timor|Brunei|Australia",
      r: "Kiribati|Marshall Islands|Micronesia|Palau|Solomon Islands|Vanuatu|Comoros|Cape Verde=cabo verde|Sao Tome and Principe|Saint Lucia|Saint Kitts and Nevis|Saint Vincent and the Grenadines|Antigua and Barbuda|Grenada|Dominica",
      d: "Cook Islands",
      k: "Niue::One of the world's largest coral islands, freely associated with New Zealand." } },

    // ---------- food and growing things ----------
    { id: "apple", q: "Name a variety of apple", t: {
      p: "Granny Smith|Honeycrisp|Gala|Fuji|Red Delicious|Golden Delicious",
      c: "Cosmic Crisp|Pink Lady",
      s: "McIntosh|Braeburn|Jazz|Envy|Ambrosia|Jonagold|Cortland|Empire|Rome|Macoun|Jonathan|Northern Spy|Winesap|SweeTango|Crispin=mutsu|Cripps Pink|Opal|Rave|Zestar|Snapdragon|Evercrisp|Pacific Rose|Kanzi|Smitten|Paula Red|Ginger Gold|Gravenstein|Bramley|Cox's Orange Pippin=cox|Russet|Egremont Russet|Discovery|Worcester Pearmain|Spartan|Idared|Elstar|Boskoop|Arkansas Black",
      r: "Baldwin|Roxbury Russet|Esopus Spitzenburg|Newtown Pippin|Ashmead's Kernel|Calville Blanc d'Hiver|Blenheim Orange|Lady Alice|Sundowner|Ruby Frost|Autumn Glory|Junami|Rubens|Wealthy|Duchess of Oldenburg|Yellow Transparent|Lodi|Stayman|York|Rhode Island Greening|Black Twig|Golden Russet|Hudson's Golden Gem|Chestnut Crab|Dolgo|Wolf River|Sops of Wine|Cox Pomona|Laxton's Superb|James Grieve|Beauty of Bath|Annie Elizabeth",
      d: "Knobbed Russet|Pitmaston Pineapple|Court Pendu Plat|Devonshire Quarrenden|Api Étoilé|Decio|Lady apple|Pomme d'Api|Nonpareil|Summer Rambo|Black Oxford|Hewes Crab|Harrison|Campfield|Graniwinkle",
      k: "Flower of Kent::Said to be the apple Isaac Newton watched fall from the tree." } },

    { id: "grape", q: "Name a wine grape", t: {
      p: "Cabernet Sauvignon=cabernet|Merlot|Chardonnay|Pinot Noir|Sauvignon Blanc|Pinot Grigio=pinot gris",
      c: "Zinfandel=primitivo|Malbec",
      s: "Riesling|Syrah=shiraz|Sangiovese|Tempranillo|Grenache=garnacha|Moscato=muscat|Chenin Blanc|Gewürztraminer=gewurztraminer|Viognier|Nebbiolo|Barbera|Cabernet Franc|Petit Verdot|Mourvèdre=monastrell|Carménère|Gamay|Pinotage|Semillon|Grüner Veltliner|Albariño=albarino|Torrontés|Verdejo|Vermentino|Prosecco=glera|Lambrusco|Montepulciano|Nero d'Avola|Aglianico|Petite Sirah|Concord",
      r: "Trebbiano|Garganega|Cortese|Arneis|Fiano|Greco|Falanghina|Dolcetto|Corvina|Negroamaro|Sagrantino|Touriga Nacional|Tinta Roriz|Baga|Alvarinho|Loureiro|Macabeo|Xarel-lo|Parellada|Mencía|Godello|Furmint|Hárslevelű|Blaufränkisch|Zweigelt|St. Laurent|Müller-Thurgau|Silvaner|Pinot Blanc|Pinot Meunier|Aligoté|Melon de Bourgogne|Marsanne|Roussanne|Picpoul|Carignan|Cinsault|Tannat|Mavrud|Saperavi|Rkatsiteli|Assyrtiko|Agiorgitiko|Xinomavro|Muscadine|Norton|Catawba|Niagara|Chambourcin",
      d: "Plavac Mali|Teran|Refosco|Schiava|Lagrein|Teroldego|Pelaverga|Ruché|Grignolino|Freisa|Erbaluce|Timorasso|Nascetta|Pigato|Bombino|Uva di Troia|Gaglioppo|Frappato|Perricone|Nerello Mascalese|Carricante|Cannonau|Bobal|Graciano|Prieto Picudo|Juan García|Listán Negro|Ramisco|Encruzado|Bical|Arinto|Antão Vaz|Kadarka|Kéknyelő",
      k: "Juhfark::A Hungarian white grape whose name means 'sheep's tail', for its long clusters." } },

    { id: "chili", q: "Name a type of chili pepper", t: {
      p: "Jalapeño=jalapeno|Habanero|Cayenne|Serrano|Ghost Pepper=bhut jolokia|Carolina Reaper",
      c: "Bell Pepper|Pepper X",
      s: "Chipotle|Poblano|Ancho|Anaheim|Scotch Bonnet|Thai Chili=bird's eye chili|Tabasco|Pimiento|Paprika|Banana Pepper|Pepperoncini|Shishito|Padrón=padron|Guajillo|Chile de Árbol=chile de arbol|Pasilla|Cubanelle|Hatch Chile=hatch|Trinidad Moruga Scorpion|Fresno|Piri Piri|Datil|Aleppo|Gochugaru",
      r: "Cascabel|Mulato|Puya|Pequin|Chiltepin|Chilaca|Mirasol|Aji Amarillo|Aji Panca|Rocoto|Manzano|Aji Charapita|Naga Viper|Infinity Chili|Trinidad Scorpion Butch T|7 Pot|Dorset Naga|Fatalii|Madame Jeanette|Wiri Wiri|Malagueta|Peppadew|Sweety Drop|Kashmiri Chili|Byadgi|Guntur Sannam|Jwala|Espelette|Urfa Biber|Marash|Hungarian Wax|Cherry Pepper|Facing Heaven|Er Jing Tiao",
      d: "Pimenta de Neyde|Bishop's Crown|Peter Pepper|Lemon Drop|Biquinho|Aji Dulce|Cumari|Bonda ma Jacques|Komodo Dragon|Dragon's Breath|Apocalypse Scorpion|Chocolate Bhutlah",
      k: "Fish Pepper::An heirloom pepper with striped fruit, once a secret of Baltimore crab houses." } },

    { id: "frenchcheese", q: "Name a French cheese", t: {
      p: "Brie|Camembert|Roquefort|Comté=comte|Chèvre=chevre|Gruyère=gruyere",
      c: "Époisses=epoisses|Mimolette",
      s: "Emmental|Raclette|Reblochon|Munster|Boursin|Port-Salut=port salut|Saint-Agur|Bleu d'Auvergne|Cantal|Morbier|Tomme de Savoie|Beaufort|Pont-l'Évêque=pont l'eveque|Livarot|Neufchâtel|Saint-Nectaire|Fourme d'Ambert|Valençay|Crottin de Chavignol|Sainte-Maure de Touraine|Brillat-Savarin|Coulommiers|Chaource|Langres|Mont d'Or=vacherin mont d'or|Ossau-Iraty|Salers|Laguiole|Saint-Marcellin|Saint-Félicien|Bûche de chèvre",
      r: "Abondance|Banon|Bleu de Gex|Bleu des Causses|Brie de Meaux|Brie de Melun|Chabichou du Poitou|Charolais|Pélardon|Picodon|Pouligny-Saint-Pierre|Rocamadour|Selles-sur-Cher|Tomme des Bauges|Maroilles|Vieux-Lille|Bethmale|Tomme de Brebis|Explorateur|Délice de Bourgogne|Pierre-Robert|Saint-André|Fromage blanc|Petit-suisse|Cancoillotte|Tête de Moine|Cabécou|Rigotte de Condrieu|Mothais-sur-Feuille|Soumaintrain|Trou du Cru|Ami du Chambertin|Olivet",
      d: "Gaperon|Boulette d'Avesnes|Persillé de Tignes|Chevrotin|Bleu de Termignon|Mâconnais|Neufchâtel cœur|Rollot|Dauphin|Gris de Lille|Bergues|Saint-Paulin|Tamié|Abbaye de Belloc|Fleur du Maquis|Niolo|Venaco",
      k: "Brocciu::Corsica's whey cheese, the only French cheese made from whey with protected status." } },

    // ---------- animals ----------
    { id: "owl", q: "Name a type of owl", strictcore: true, t: {
      p: "Barn Owl|Snowy Owl|Great Horned Owl|Barred Owl|Screech Owl|Burrowing Owl",
      c: "Elf Owl|Pel's Fishing Owl",
      s: "Tawny Owl|Little Owl|Eagle Owl=eurasian eagle-owl|Great Grey Owl=great gray owl|Long-eared Owl|Short-eared Owl|Spotted Owl|Northern Saw-whet Owl=saw-whet owl|Boreal Owl|Eastern Screech Owl|Western Screech Owl|Northern Pygmy Owl|Ferruginous Pygmy Owl|Flammulated Owl|Spectacled Owl|Blakiston's Fish Owl|Fish Owl|Scops Owl|Pygmy Owl|Hawk Owl",
      r: "Northern Hawk-Owl|Ural Owl|Tengmalm's Owl|Brown Fish Owl|Buffy Fish Owl|Verreaux's Eagle-Owl|Spotted Eagle-Owl|Cape Eagle-Owl|Indian Eagle-Owl|Philippine Eagle-Owl|Barking Owl|Powerful Owl|Rufous Owl|Sooty Owl|Masked Owl|Grass Owl|Morepork|Southern Boobook|Oriental Bay Owl|Crested Owl|Stygian Owl|Striped Owl|Mottled Owl|Black-and-white Owl|Rusty-barred Owl|Mexican Spotted Owl|Whiskered Screech Owl|Jungle Owlet|Spotted Owlet",
      d: "Seychelles Scops Owl|Anjouan Scops Owl|Forest Owlet|Long-whiskered Owlet|Tamaulipas Pygmy Owl|Cloud-forest Pygmy Owl|Albertine Owlet|Fearful Owl|Sjöstedt's Owlet|Usambara Eagle-Owl|Shelley's Eagle-Owl|Rajah Scops Owl|Giant Scops Owl|Puerto Rican Screech Owl|Socotra Scops Owl",
      k: "Laughing Owl::A New Zealand owl last seen in 1914, known for its maniacal call." } },

    { id: "birdofprey", q: "Name a bird of prey", strictcore: true, t: {
      p: "Bald Eagle|Golden Eagle|Peregrine Falcon|Hawk|Osprey|Vulture",
      c: "Secretary Bird|Harpy Eagle",
      s: "Red-tailed Hawk|Kestrel|Merlin|Kite|Condor|Andean Condor|California Condor|Buzzard|Harrier|Goshawk|Sparrowhawk|Falcon|Eagle|Gyrfalcon|Hobby|Lanner Falcon|Saker Falcon|Prairie Falcon|Cooper's Hawk|Sharp-shinned Hawk|Red-shouldered Hawk|Broad-winged Hawk|Rough-legged Hawk|Ferruginous Hawk|Harris's Hawk|Swainson's Hawk|Red Kite|Black Kite|White-tailed Eagle|Steller's Sea Eagle|Philippine Eagle|Crowned Eagle|Martial Eagle|Bateleur|Lammergeier=bearded vulture|Griffon Vulture|Turkey Vulture|Black Vulture|King Vulture|Caracara|Owl",
      r: "Booted Eagle|Bonelli's Eagle|Short-toed Snake Eagle|Imperial Eagle|Spanish Imperial Eagle|Tawny Eagle|Steppe Eagle|Verreaux's Eagle|Wedge-tailed Eagle|African Fish Eagle|Changeable Hawk-Eagle|Ornate Hawk-Eagle|Black Hawk-Eagle|Crested Caracara|Laughing Falcon|Aplomado Falcon|Bat Falcon|Orange-breasted Falcon|Eleonora's Falcon|Red-footed Falcon|Amur Falcon|Snail Kite|Swallow-tailed Kite|Mississippi Kite|White-tailed Kite|Hen Harrier|Northern Harrier|Montagu's Harrier|Marsh Harrier|Pallid Harrier|Honey Buzzard|Lappet-faced Vulture|White-backed Vulture|Hooded Vulture|Egyptian Vulture|Cinereous Vulture|Palm-nut Vulture",
      d: "Pygmy Falcon|Collared Falconet|Philippine Falconet|Black-thighed Falconet|Crane Hawk|Grey-headed Kite|Hook-billed Kite|Bat Hawk|Pearl Kite|Letter-winged Kite|Square-tailed Kite|Black-breasted Buzzard|Chanting Goshawk|Gabar Goshawk|Lizard Buzzard|Grasshopper Buzzard|Madagascar Serpent Eagle|Andaman Serpent Eagle|Congo Serpent Eagle|Long-tailed Hawk|Ridgway's Hawk|Galápagos Hawk|Solitary Eagle|Guiana Crested Eagle",
      k: "Hawaiian Hawk::Called 'io' in Hawaiian; it's the only hawk native to Hawaii." } },

    { id: "butterfly", q: "Name a butterfly", strictcore: true, t: {
      p: "Monarch|Swallowtail|Painted Lady|Red Admiral|Cabbage White|Blue Morpho",
      c: "Birdwing|Glasswing",
      s: "Peacock Butterfly|Tiger Swallowtail|Eastern Tiger Swallowtail|Black Swallowtail|Viceroy|Mourning Cloak|Buckeye|Common Buckeye|Question Mark|Comma|Fritillary|Great Spangled Fritillary|Gulf Fritillary|Zebra Longwing|Julia|Sulphur|Clouded Sulphur|Orange Sulphur|Brimstone|Orange-tip|Small Tortoiseshell|Large Blue|Holly Blue|Common Blue|Karner Blue|Spring Azure|Hairstreak|Skipper|Copper|Small Copper|Ringlet|Meadow Brown|Gatekeeper|Speckled Wood|Owl Butterfly|Purple Emperor|White Admiral|Camberwell Beauty|Apollo",
      r: "Cloudless Sulphur|Dainty Sulphur|Sleepy Orange|Little Yellow|Checkered White|Great Southern White|Pipevine Swallowtail|Spicebush Swallowtail|Giant Swallowtail|Zebra Swallowtail|Anise Swallowtail|Western Tiger Swallowtail|Palamedes Swallowtail|Red-spotted Purple|Hackberry Emperor|Tawny Emperor|Goatweed Leafwing|American Snout|Variegated Fritillary|Silver-bordered Fritillary|Baltimore Checkerspot|Pearl Crescent|Harvester|Little Wood Satyr|Common Wood-Nymph|Queen|Soldier|Lime Swallowtail|Common Mormon|Blue Tiger|Plain Tiger|Common Crow|Blue Pansy|Lemon Pansy|Kallima=dead leaf butterfly|Cracker|Malachite|Cattleheart|Postman|Doris Longwing|Sara Longwing",
      d: "Palos Verdes Blue|Mission Blue|Lange's Metalmark|Miami Blue|Schaus' Swallowtail|Homerus Swallowtail|Luzon Peacock Swallowtail|Bhutan Glory|Kaiser-i-Hind|Large Copper|Chequered Skipper|Duke of Burgundy|Glanville Fritillary",
      k: "Xerces Blue::A San Francisco butterfly, extinct since the 1940s as the city's dunes were built over." } },

    { id: "terrier", q: "Name a terrier breed", strictcore: true, t: {
      p: "Jack Russell Terrier=jack russell|Yorkshire Terrier=yorkie|Bull Terrier|Scottish Terrier=scottie|West Highland White Terrier=westie|Boston Terrier",
      c: "Airedale Terrier=airedale|Pit Bull=pit bull terrier",
      s: "Staffordshire Bull Terrier=staffy|American Staffordshire Terrier|Cairn Terrier|Fox Terrier|Wire Fox Terrier|Smooth Fox Terrier|Rat Terrier|Border Terrier|Welsh Terrier|Irish Terrier|Kerry Blue Terrier|Soft-coated Wheaten Terrier=wheaten|Bedlington Terrier|Parson Russell Terrier|Norfolk Terrier|Norwich Terrier|Silky Terrier|Australian Terrier|Tibetan Terrier|Miniature Schnauzer|Skye Terrier|Dandie Dinmont Terrier|Lakeland Terrier|Manchester Terrier|Toy Fox Terrier|Russian Black Terrier=black russian terrier|American Pit Bull Terrier",
      r: "Sealyham Terrier|Cesky Terrier|Glen of Imaal Terrier|Patterdale Terrier|Jagdterrier|Brazilian Terrier|Chilean Fox Terrier|Japanese Terrier|Kromfohrländer|Teddy Roosevelt Terrier|American Hairless Terrier|Miniature Bull Terrier|English Toy Terrier|Yorkshire Biewer=biewer terrier|Plummer Terrier|Fell Terrier|Lucas Terrier|Sporting Lucas Terrier",
      d: "Old English Terrier|Bull and Terrier|Paisley Terrier|Clydesdale Terrier|Turnspit Dog|Black and Tan Terrier|Welsh Hillman|Hunt Terrier|Rus Russian Toy",
      k: "English White Terrier::A 19th-century breed, now extinct, that was the ancestor of the Boston Terrier." } },

    { id: "hound", q: "Name a hound breed", strictcore: true, t: {
      p: "Beagle|Greyhound|Basset Hound|Bloodhound|Dachshund|Afghan Hound",
      c: "Basenji|Saluki",
      s: "Whippet|Irish Wolfhound|Borzoi|Rhodesian Ridgeback|Coonhound|Black and Tan Coonhound|Bluetick Coonhound|Redbone Coonhound|Treeing Walker Coonhound|American Foxhound|English Foxhound|Foxhound|Harrier|Scottish Deerhound=deerhound|Italian Greyhound|Pharaoh Hound|Ibizan Hound|Norwegian Elkhound=elkhound|Otterhound|Plott Hound=plott|Petit Basset Griffon Vendéen=pbgv|Grand Basset Griffon Vendéen|Sloughi|Azawakh|Portuguese Podengo|Cirneco dell'Etna|Thai Ridgeback|American English Coonhound",
      r: "Hamiltonstövare|Schillerstövare|Smålandsstövare|Finnish Hound|Estonian Hound|Polish Hound|Slovak Hound|Serbian Hound|Bosnian Coarse-haired Hound|Istrian Hound|Posavac Hound|Hanoverian Scenthound|Bavarian Mountain Hound|Alpine Dachsbracke|Westphalian Dachsbracke|Beagle-Harrier|Anglo-Français de Petite Vénerie|Grand Bleu de Gascogne|Petit Bleu de Gascogne|Ariégeois|Billy|Poitevin|Porcelaine|Grand Griffon Vendéen|Briquet Griffon Vendéen|Chien d'Artois|Basset Artésien Normand|Basset Bleu de Gascogne|Basset Fauve de Bretagne|Transylvanian Hound|Hellenic Hound|Segugio Italiano|Chortai|Taigan|Magyar Agár|Polish Greyhound|Spanish Greyhound=galgo|Mudhol Hound|Rampur Greyhound|Kanni|Chippiparai",
      d: "Southern Hound|North Country Beagle|Hare Indian Dog|Tahltan Bear Dog|Kerry Beagle|Gascon Saintongeois|Bruno Jura Hound|Schweizer Laufhund|Lucernese Hound|Bernese Hound|Jura Hound|Halden Hound|Hygen Hound|Dunker|Drever|Montenegrin Mountain Hound|Tyrolean Hound",
      k: "Talbot::An extinct white medieval hound that survives in English pub names and heraldry." } },

    { id: "chickenbreed", q: "Name a breed of chicken", strictcore: true, t: {
      p: "Rhode Island Red|Leghorn|Silkie|Plymouth Rock|Orpington|Bantam",
      c: "Ayam Cemani|Polish",
      s: "Buff Orpington|Wyandotte|Sussex|Australorp|Brahma|Cochin|Barred Rock|Easter Egger|Ameraucana|Araucana|Marans|Welsummer|Sebright|Faverolles|Jersey Giant|New Hampshire Red|Delaware|Dominique|Minorca|Ancona|Hamburg|Houdan|Frizzle|Naked Neck=turken|Cornish|Cornish Cross|ISA Brown|Golden Comet|Red Sex Link|Black Sex Link|Speckled Sussex|Lavender Orpington|Buckeye|Chantecler|Old English Game|Malay|Shamo|Aseel|Serama",
      r: "Andalusian|Campine|Crèvecœur|La Flèche|Lakenvelder|Scots Dumpy|Scots Grey|Dorking|Redcap|Derbyshire Redcap|Ixworth|Norfolk Grey|Croad Langshan|Langshan|Java|Holland|Lamona|Iowa Blue|Nankin|Pekin|Japanese Bantam|Rosecomb|Belgian d'Uccle|Barbu d'Anvers|Booted Bantam|Dutch Bantam|Sumatra|Yokohama|Phoenix|Sultan|Appenzeller Spitzhauben|Vorwerk|Lakenfelder|Bielefelder|Kraienköppe|Deathlayer=Westfälische Totleger|Penedesenca|Empordanesa|Black Spanish|Kadaknath|Ayam Kampung|Dong Tao|Swedish Flower Hen|Icelandic Chicken|Hedemora|Olandsk Dwarf",
      d: "Kulang|Thai Game|Ko Shamo|Yamato Gunkei|Tuzo|Satsumadori|Totenko|Tomaru|Koeyoshi|Uzurao|Minohiki|Ohiki|Chabo|Jitokko|Gifujidori|Tosa Jidori|Hinai Jidori",
      k: "Onagadori::A Japanese breed whose rooster tail feathers can grow over 10 metres." } },

    { id: "cattlebreed", q: "Name a breed of cattle", strictcore: true, t: {
      p: "Angus=aberdeen angus|Hereford|Holstein=holstein friesian|Jersey|Longhorn=texas longhorn|Highland=highland cattle",
      c: "Wagyu|Kobe",
      s: "Brahman|Charolais|Limousin|Simmental|Guernsey|Brown Swiss|Ayrshire|Shorthorn|Galloway|Belted Galloway|Dexter|Red Angus|Devon|Gelbvieh|Brangus|Santa Gertrudis|Beefmaster|Watusi=ankole-watusi|Zebu|Murray Grey|Chianina|Piedmontese|Belgian Blue|Blonde d'Aquitaine|Normande|Montbéliarde|Salers|Aubrac|Gir|Nelore|Sahiwal|Red Poll|Lincoln Red|Sussex|White Park|British White|Pinzgauer|Tarentaise|Maine-Anjou",
      r: "Kerry|Irish Moiled|Shetland|Luing|Beef Shorthorn|Milking Shorthorn|Gloucester|Welsh Black|Vaynol|English Longhorn|Belted Welsh|Dutch Belted=lakenvelder|Randall|Florida Cracker|Pineywoods|Senepol|Romosinuano|Corriente|Criollo|Ankole|Boran|Tuli|Mashona|Nguni|Afrikaner|Bonsmara|Drakensberger|Kankrej|Ongole|Tharparkar|Red Sindhi|Hariana|Kangayam|Vechur|Yak|Mithun|Banteng|Gaur|Hanwoo|Mishima|Kuchinoshima|Mongolian|Yakutian|Kalmyk|Grey Steppe|Hungarian Grey|Podolica|Maremmana|Romagnola|Marchigiana|Cabannina|Rendena|Valdostana|Braunvieh|Evolène|Hérens|Vosgienne|Bretonne Pie Noir|Parthenaise|Bazadaise|Gasconne|Lourdaise|Mirandaise|Barrosã|Maronesa|Mertolenga|Alentejana|Rubia Gallega|Retinta|Tudanca|Pirenaica|Asturiana",
      d: "Aurochs|Heck Cattle|Taurus Cattle|Enderby Island Cattle|Siri|Kholomogory|Bestuzhev|Yaroslavl|Lebedyn|Ukrainian Whiteheaded|Polish Red|Lithuanian Red|Latvian Blue|Estonian Native|Finncattle|Swedish Mountain|Telemark|Vestland Fjord|Dølafe",
      k: "Chillingham::A wild white herd in Northumberland, inbred in a park since at least the 1200s." } },

    // ---------- sports and science ----------
    { id: "f1driver", q: "Name a Formula 1 driver", t: {
      p: "Lewis Hamilton=hamilton|Michael Schumacher=schumacher|Ayrton Senna=senna|Max Verstappen=verstappen|Fernando Alonso=alonso|Sebastian Vettel=vettel",
      c: "Juan Manuel Fangio=fangio|Niki Lauda=lauda",
      s: "Alain Prost|Kimi Räikkönen=kimi raikkonen|Jenson Button|Nico Rosberg|Charles Leclerc|Lando Norris|Daniel Ricciardo|Sergio Pérez=checo perez|Carlos Sainz|George Russell|Oscar Piastri|Valtteri Bottas|Mika Häkkinen=mika hakkinen|Damon Hill|Nigel Mansell|Jackie Stewart|Jim Clark|Graham Hill|Stirling Moss|James Hunt|Emerson Fittipaldi|Nelson Piquet|Mario Andretti|Jack Brabham|Jochen Rindt|Gilles Villeneuve|Jacques Villeneuve|Rubens Barrichello|David Coulthard|Mark Webber|Felipe Massa|Pierre Gasly|Esteban Ocon|Yuki Tsunoda|Alex Albon|Lance Stroll|Kevin Magnussen|Nico Hülkenberg=hulkenberg|Mick Schumacher|Ralf Schumacher|Kimi Antonelli|Oliver Bearman|Liam Lawson|Franco Colapinto|Gabriel Bortoleto|Isack Hadjar|Zhou Guanyu|Logan Sargeant",
      r: "Alberto Ascari|Giuseppe Farina|Mike Hawthorn|Phil Hill|John Surtees|Denny Hulme|Jody Scheckter|Alan Jones|Keke Rosberg|Ronnie Peterson|Clay Regazzoni|Jacky Ickx|Jean Alesi|Gerhard Berger|Riccardo Patrese|Michele Alboreto|Eddie Irvine|Heinz-Harald Frentzen|Juan Pablo Montoya|Giancarlo Fisichella|Jarno Trulli|Robert Kubica|Heikki Kovalainen|Romain Grosjean|Pastor Maldonado|Kamui Kobayashi|Sergey Sirotkin|Daniil Kvyat|Max Chilton|Jules Bianchi|Roland Ratzenberger|Elio de Angelis|Patrick Depailler|Didier Pironi|René Arnoux|Jacques Laffite|Patrick Tambay|Thierry Boutsen|Martin Brundle|Johnny Herbert|Mika Salo|Pedro de la Rosa|Takuma Sato|Nyck de Vries|Antonio Giovinazzi|Nicholas Latifi|Nikita Mazepin",
      d: "Maria Teresa de Filippis|Divina Galica|Desiré Wilson|Giovanna Amati|Taki Inoue|Yuji Ide|Andrea de Cesaris|Jean-Pierre Jarier|Arturo Merzario|Vittorio Brambilla|Harald Ertl|Hans-Joachim Stuck|Rolf Stommelen|Chris Amon|Tony Brooks|Wolfgang von Trips|Lorenzo Bandini|Pedro Rodríguez|Ricardo Rodríguez|Jo Siffert|François Cevert|Peter Revson|Mark Donohue|Tom Pryce|Gunnar Nilsson",
      k: "Lella Lombardi::Still the only woman to score points in a Formula 1 World Championship race (1975)." } },

    { id: "mlbteam", q: "Name an MLB team", t: {
      p: "New York Yankees=yankees|Boston Red Sox=red sox|Los Angeles Dodgers=dodgers|Chicago Cubs=cubs|San Francisco Giants=giants|St. Louis Cardinals=cardinals",
      c: "Montreal Expos=expos|Brooklyn Dodgers",
      s: "New York Mets=mets|Atlanta Braves=braves|Houston Astros=astros|Philadelphia Phillies=phillies|Chicago White Sox=white sox|Detroit Tigers=tigers|Cleveland Guardians=guardians=cleveland indians|Baltimore Orioles=orioles|Toronto Blue Jays=blue jays|Seattle Mariners=mariners|Texas Rangers=rangers|Oakland Athletics=athletics=a's|Los Angeles Angels=angels|San Diego Padres=padres|Arizona Diamondbacks=diamondbacks=d-backs|Colorado Rockies=rockies|Milwaukee Brewers=brewers|Cincinnati Reds=reds|Pittsburgh Pirates=pirates|Minnesota Twins=twins|Kansas City Royals=royals|Tampa Bay Rays=rays=devil rays|Miami Marlins=marlins=florida marlins|Washington Nationals=nationals",
      r: "Washington Senators|Seattle Pilots|St. Louis Browns|Philadelphia Athletics|Kansas City Athletics|Milwaukee Braves|Boston Braves|New York Giants|California Angels|Anaheim Angels|Houston Colt .45s",
      d: "Baltimore Orioles (1901)|Milwaukee Brewers (1901)|Brooklyn Superbas|Boston Beaneaters|Louisville Colonels|Baltimore Terrapins|Pittsburgh Rebels|Brooklyn Tip-Tops|Kansas City Packers|Buffalo Blues|Newark Peppers|Chicago Whales|Providence Grays|Troy Trojans|Worcester Ruby Legs|Hartford Dark Blues",
      k: "Cleveland Spiders::Went 20-134 in 1899, still the worst record in major league history." } },

    { id: "nhlteam", q: "Name an NHL team", t: {
      p: "Toronto Maple Leafs=maple leafs|Montreal Canadiens=canadiens=habs|Boston Bruins=bruins|Chicago Blackhawks=blackhawks|New York Rangers=rangers|Detroit Red Wings=red wings",
      c: "Hartford Whalers=whalers|Quebec Nordiques=nordiques",
      s: "Pittsburgh Penguins=penguins|Edmonton Oilers=oilers|Philadelphia Flyers=flyers|Tampa Bay Lightning=lightning|Vegas Golden Knights=golden knights|Colorado Avalanche=avalanche|Washington Capitals=capitals=caps|Los Angeles Kings=kings|Vancouver Canucks=canucks|Calgary Flames=flames|Ottawa Senators=senators|Buffalo Sabres=sabres|New Jersey Devils=devils|New York Islanders=islanders|Florida Panthers=panthers|Carolina Hurricanes=hurricanes|Nashville Predators=predators|Dallas Stars=stars|St. Louis Blues=blues|Minnesota Wild=wild|Winnipeg Jets=jets|Anaheim Ducks=ducks=mighty ducks|San Jose Sharks=sharks|Columbus Blue Jackets=blue jackets|Seattle Kraken=kraken|Utah Mammoth=utah hockey club",
      r: "Arizona Coyotes=coyotes=phoenix coyotes|Atlanta Thrashers=thrashers|Minnesota North Stars=north stars|Atlanta Flames|Kansas City Scouts|Colorado Rockies|California Golden Seals|Cleveland Barons|Mighty Ducks of Anaheim",
      d: "Montreal Maroons|Ottawa Senators (original)|Hamilton Tigers|Quebec Bulldogs|Pittsburgh Pirates|Philadelphia Quakers|New York Americans|Brooklyn Americans|St. Louis Eagles|Toronto Arenas|Toronto St. Patricks|Detroit Cougars|Detroit Falcons|Oakland Seals",
      k: "Montreal Wanderers::One of the NHL's founding clubs in 1917. Their arena burned down after six games." } },

    { id: "premierleague", q: "Name a Premier League club (any season)", t: {
      p: "Manchester United=man utd=man united|Liverpool|Arsenal|Chelsea|Manchester City=man city|Tottenham Hotspur=tottenham=spurs",
      c: "Swindon Town|Blackpool",
      s: "Everton|Newcastle United=newcastle|Aston Villa|West Ham United=west ham|Leicester City=leicester|Southampton|Wolverhampton Wanderers=wolves|Crystal Palace|Brighton & Hove Albion=brighton|Fulham|Brentford|Nottingham Forest|Bournemouth|Leeds United=leeds|Burnley|Sheffield United|Watford|Norwich City=norwich|West Bromwich Albion=west brom|Stoke City=stoke|Swansea City=swansea|Sunderland|Middlesbrough|Blackburn Rovers=blackburn|Bolton Wanderers=bolton|Wigan Athletic=wigan|Hull City=hull|Cardiff City=cardiff|Reading|Portsmouth|Birmingham City|Derby County=derby|Queens Park Rangers=qpr|Ipswich Town=ipswich|Luton Town=luton|Huddersfield Town=huddersfield|Charlton Athletic=charlton|Coventry City=coventry|Sheffield Wednesday",
      r: "Wimbledon",
      d: "Oldham Athletic|Bradford City",
      k: "Barnsley::Spent a single season in the Premier League, 1997-98." } },

    { id: "mineral", q: "Name a mineral", t: {
      p: "Quartz|Diamond|Gold|Gypsum|Calcite|Talc",
      c: "Painite|Benitoite",
      s: "Feldspar|Mica|Pyrite|Hematite|Magnetite|Graphite|Halite|Fluorite|Topaz|Corundum|Beryl|Garnet|Olivine|Tourmaline|Malachite|Azurite|Galena|Sphalerite|Chalcopyrite|Bauxite|Dolomite|Apatite|Orthoclase|Muscovite|Biotite|Hornblende|Augite|Serpentine|Kaolinite|Barite|Cinnabar|Sulfur|Silver|Copper|Platinum|Turquoise|Opal|Jade|Obsidian",
      r: "Labradorite|Moonstone|Amazonite|Rhodochrosite|Rhodonite|Lepidolite|Spodumene|Kyanite|Staurolite|Andalusite|Sillimanite|Wollastonite|Zircon|Rutile|Anatase|Cassiterite|Wolframite|Scheelite|Molybdenite|Stibnite|Realgar|Orpiment|Arsenopyrite|Cuprite|Chrysocolla|Dioptase|Vanadinite|Wulfenite|Crocoite|Celestine|Anhydrite|Aragonite|Siderite|Smithsonite|Cerussite|Anglesite|Natrolite|Stilbite|Prehnite|Epidote|Vesuvianite|Datolite|Chrysoberyl|Spinel|Tanzanite",
      d: "Taaffeite|Grandidierite|Jeremejevite|Poudretteite|Kyawthuite|Musgravite|Red Beryl=bixbite|Serendibite|Hibonite|Ekanite|Cuprosklodowskite|Torbernite|Autunite|Carnotite|Uraninite",
      k: "Jadarite::Found in Serbia in 2006 with almost the same formula as Superman's kryptonite." } },

    // ---------- words and language ----------
    { id: "rhymelight", q: "Name a word that rhymes with \"light\"", t: {
      p: "Night|Bright|Right|Fight|Kite|Sight|White",
      c: "Dynamite|Kryptonite",
      s: "Bite|Might|Tight|Flight|Write|Height|Fright|Quite|Site|Spite|Mite|Rite|Knight|Slight|Plight|Delight|Polite|Invite|Ignite|Unite|Tonight|Despite|Alright|Midnight|Daylight|Sunlight|Moonlight|Spotlight|Flashlight|Twilight|Highlight|Goodnight",
      r: "Appetite|Satellite|Parasite|Termite|Erudite|Recite|Contrite|Excite|Incite|Overnight|Outright|Upright|Downright|Forthright|Copyright|Playwright|Birthright|Insight|Hindsight|Foresight|Oversight|Eyesight|Stalactite|Stalagmite|Meteorite|Anthracite|Bauxite|Graphite|Lite|Byte|Megabyte|Kilobyte|Gigabyte",
      d: "Troglodyte|Neophyte|Acolyte|Proselyte|Expedite|Extradite|Recondite|Bedight|Smite|Blight|Wight|Sprite|Trite|Bight|Plebiscite|Leucite|Cordite|Ammonite|Lignite|Dolomite|Calcite|Pyrite|Magnetite|Hematite|Malachite|Chlorite|Leukocyte|Lymphocyte",
      k: "Erythrocyte=red blood cell::Rhymes with light, and there are 25 trillion of them in you." } },

    { id: "ology", q: "Name a word that ends in \"-ology\"", t: {
      p: "Biology|Psychology|Technology|Geology|Sociology|Astrology",
      c: "Scientology|Apology",
      s: "Zoology|Theology|Archaeology|Anthropology|Ecology|Cardiology|Neurology|Mythology|Criminology|Terminology|Ideology|Methodology|Chronology|Physiology|Radiology|Dermatology|Oncology|Pathology|Meteorology|Musicology|Etymology|Cosmology|Paleontology|Ontology|Trilogy|Anthology",
      r: "Entomology|Ornithology|Herpetology|Ichthyology|Mycology|Virology|Immunology|Epidemiology|Pharmacology|Toxicology|Seismology|Volcanology|Gemology|Hydrology|Limnology|Mineralogy|Cytology|Histology|Endocrinology|Gastroenterology|Urology|Nephrology|Hematology|Ophthalmology|Audiology|Gerontology|Numerology|Phrenology|Graphology|Scatology|Eschatology|Tautology|Analogy|Doxology|Genealogy|Penology|Escapology",
      d: "Speleology|Dendrology|Oology|Cetology|Myrmecology|Arachnology|Malacology|Selenology|Campanology|Deltiology|Numismatology|Oenology|Zymology|Pogonology|Nephology|Hippology|Oneirology|Thanatology|Phenomenology|Teleology|Soteriology|Christology|Hagiology|Agrostology|Bryology|Pteridology|Batrachology",
      k: "Vexillology=Vexillology Flags::The study of flags. Its fans are called vexillologists." } },

    { id: "phobia", q: "Name a phobia", t: {
      p: "Arachnophobia|Claustrophobia|Acrophobia|Agoraphobia",
      c: "Hippopotomonstrosesquippedaliophobia|Triskaidekaphobia",
      s: "Xenophobia|Homophobia|Hydrophobia|Aerophobia|Coulrophobia|Ophidiophobia|Nyctophobia|Trypophobia|Germophobia=mysophobia|Technophobia|Glossophobia|Emetophobia|Thanatophobia|Cynophobia|Hemophobia",
      r: "Trypanophobia|Astraphobia|Entomophobia|Ailurophobia|Musophobia|Ornithophobia|Thalassophobia|Nomophobia|Philophobia|Gamophobia|Androphobia|Gynophobia|Pyrophobia|Autophobia|Necrophobia|Phasmophobia|Iatrophobia|Dentophobia|Atychophobia|Podophobia|Pogonophobia|Odontophobia|Chronophobia|Somniphobia",
      d: "Anatidaephobia|Pteronophobia|Omphalophobia|Ergophobia|Hexakosioihexekontahexaphobia|Paraskevidekatriaphobia|Ephebiphobia|Phobophobia|Sesquipedalophobia|Alektorophobia|Ombrophobia|Chionophobia|Heliophobia|Selenophobia|Xanthophobia|Chromophobia|Eisoptrophobia|Catoptrophobia|Lachanophobia|Turophobia|Allodoxaphobia",
      k: "Arachibutyrophobia=fear of peanut butter::Fear of peanut butter sticking to the roof of your mouth." } },

    { id: "rhymecat", q: "Name a word that rhymes with \"cat\"", t: {
      p: "Hat|Bat|Mat|Rat|Sat|Fat",
      c: "Cravat|Habitat",
      s: "Pat|Flat|That|Chat|Brat|Splat|Vat|Gnat|Spat|Slat|Tat|Drat|Scat|Format|Combat|Acrobat|Diplomat|Thermostat|Doormat|Wombat",
      r: "Aristocrat|Bureaucrat|Democrat|Autocrat|Technocrat|Laundromat|Copycat|Fiat|Begat|Muskrat|Nonfat|Lowfat|Ziggurat|Caveat|Cowpat|Tomcat|Hellcat|Bobcat|Wildcat|Ratatat|Hazmat|Photostat|Rheostat|Aerostat|Plutocrat|Meritocrat",
      d: "Ararat|Kalat|Concordat|Marabout|Prat|Plait|Ghat|Ewart|Sprat|Stat|Assignat|Magnificat|Heliostat|Gyrostat|Hydrostat|Kat|Krat|Pyat|Tat-tat|Lariat|Commissariat|Proletariat|Secretariat|Baccarat|Muscat|Samizdat|Tit for Tat=tit for tat",
      k: "Kittycat::Rhymes with cat. Also is a cat." } }
  ];

  root.CP = root.CP || {};
  root.CP.PROMPTS = (root.CP.PROMPTS || []).concat(PROMPTS);
})(typeof window !== "undefined" ? window : globalThis);
