/* Prompt pack 5: pop culture, entertainment and the arts. Format as in data.js. */
(function (root) {
  var PROMPTS = [
    { id: "harrypotter", q: "Name a Harry Potter character", t: {
      p: "Harry Potter=harry|Hermione Granger=hermione|Ron Weasley=ron|Dumbledore=albus dumbledore|Voldemort=lord voldemort|Snape=severus snape",
      c: "Dobby|Luna Lovegood=luna",
      s: "Hagrid|Draco Malfoy=draco|Sirius Black=sirius|Neville Longbottom=neville|Ginny Weasley=ginny|Fred Weasley=fred|George Weasley=george|McGonagall|Bellatrix Lestrange=bellatrix|Lupin=remus lupin|Dolores Umbridge=umbridge|Cedric Diggory=cedric|Lucius Malfoy|Hedwig|Moaning Myrtle|Mad-Eye Moody=moody|Cho Chang|Percy Weasley|Molly Weasley|Arthur Weasley|Peter Pettigrew=wormtail|Tom Riddle|Dudley Dursley=dudley",
      r: "Fleur Delacour|Viktor Krum|Kingsley Shacklebolt|Tonks=nymphadora tonks|Bill Weasley|Charlie Weasley|Gilderoy Lockhart|Quirrell|Filch=argus filch|Mrs. Norris|Kreacher|Fawkes|Buckbeak|Aragog|Fluffy|Nagini|Crookshanks|Scabbers|Errol|Slughorn|Trelawney|Flitwick|Sprout|Madam Pomfrey|Madam Hooch|Ollivander|Grindelwald|Aberforth|Lavender Brown|Seamus Finnigan|Dean Thomas|Oliver Wood|Vernon Dursley|Petunia Dursley|Cornelius Fudge|Barty Crouch|Lily Potter|James Potter|Narcissa Malfoy|Griphook",
      d: "Winky|Dedalus Diggle|Mundungus Fletcher|Arabella Figg|Rufus Scrimgeour|Pius Thicknesse|Bathilda Bagshot|Xenophilius Lovegood|Ariana Dumbledore|Kendra Dumbledore|Fenrir Greyback|Antonin Dolohov|Rookwood|Yaxley|Amycus Carrow|Alecto Carrow|Bane|Firenze|Grawp|Ludo Bagman|Bertha Jorkins|Stan Shunpike|Ernie Prang|Tom the Barman|Madam Rosmerta|Hepzibah Smith|Merope Gaunt|Morfin Gaunt|Marvolo Gaunt|Gregorovitch",
      k: "Sir Cadogan::A painted knight who challenges everyone to duels and guards Gryffindor for a while." } },

    { id: "starwars", q: "Name a Star Wars character", t: {
      p: "Luke Skywalker=luke|Darth Vader=vader|Han Solo=han|Princess Leia=leia|Yoda|Chewbacca=chewie",
      c: "Jar Jar Binks=jar jar|Grogu=baby yoda",
      s: "Obi-Wan Kenobi=obi wan|R2-D2=r2d2|C-3PO=c3po|Anakin Skywalker=anakin|Palpatine=emperor palpatine|Darth Maul|Boba Fett|Padme Amidala=padme|Lando Calrissian=lando|Kylo Ren|Rey|Finn|Poe Dameron|BB-8|Mace Windu|Qui-Gon Jinn|Jabba the Hutt=jabba|Count Dooku|General Grievous|Ahsoka Tano=ahsoka|The Mandalorian=mando=din djarin",
      r: "Jango Fett|Wedge Antilles|Admiral Ackbar|Greedo|Wicket|Ewok|Grand Moff Tarkin=tarkin|Captain Phasma|Snoke|Rose Tico|Maz Kanata|Jyn Erso|Cassian Andor|K-2SO|Chirrut Imwe|Saw Gerrera|Orson Krennic|Cad Bane|Asajj Ventress|Captain Rex|Thrawn|Hera Syndulla|Ezra Bridger|Sabine Wren|Bo-Katan|Moff Gideon|Fennec Shand|IG-11|Cara Dune|Watto|Sebulba|Nute Gunray|Lobot|Bossk|IG-88|Dengar|Biggs Darklighter",
      d: "Salacious Crumb|Max Rebo|Sy Snootles|Bib Fortuna|Nien Nunb|Porkins|Dak Ralter|Zev Senesca|Hammerhead|Ponda Baba|Dr. Evazan|Figrin D'an|Garindan|Kabe|Yaddle|Ki-Adi-Mundi|Plo Koon|Kit Fisto|Shaak Ti|Aayla Secura|Even Piell|Saesee Tiin|Oppo Rancisis|Depa Billaba|Dexter Jettster|Taun We|Lama Su|Poggle the Lesser|Babu Frik|Zorii Bliss",
      k: "Lyn Me::The Max Rebo Band's Twi'lek backup dancer, with exactly one scene." } },

    { id: "simpsons", q: "Name a Simpsons character", t: {
      p: "Homer|Bart|Marge|Lisa|Maggie",
      c: "Disco Stu|Hans Moleman",
      s: "Mr. Burns=burns|Ned Flanders=flanders|Milhouse|Krusty the Clown=krusty|Apu|Moe|Barney|Chief Wiggum=wiggum|Ralph Wiggum=ralph|Smithers|Principal Skinner=skinner|Sideshow Bob|Nelson|Groundskeeper Willie=willie|Patty|Selma|Grampa Simpson=grampa=abe simpson|Comic Book Guy|Otto|Lenny|Carl|Edna Krabappel=krabappel|Dr. Hibbert|Itchy|Scratchy|Santa's Little Helper",
      r: "Kent Brockman|Dr. Nick|Lionel Hutz|Troy McClure|Professor Frink=frink|Sideshow Mel|Martin Prince|Jimbo|Kearney|Dolph|Rod Flanders|Todd Flanders|Maude Flanders|Reverend Lovejoy|Helen Lovejoy|Mayor Quimby|Fat Tony|Snake|Cletus|Gil|Luann Van Houten|Kirk Van Houten|Superintendent Chalmers|Ms. Hoover|Lunchlady Doris|Bumblebee Man|Duffman|Rainier Wolfcastle|Agnes Skinner|Snowball II|Mona Simpson|Herb Powell|Sherri and Terri|Uter|Database",
      d: "Jasper|Old Jewish Man|Squeaky-Voiced Teen|Captain McCallister|Crazy Cat Lady|Gil Gunderson|Artie Ziff|Lurleen Lumpkin|Cookie Kwan|Brandine|Drederick Tatum|Arnie Pye|Plopper|Spider-Pig|Blinky|Poochie|Frank Grimes=grimey|Shelbyville Manhattan|Mr. Teeny|Bleeding Gums Murphy|Jacques|Allison Taylor|Sarah Wiggum|Lou|Eddie",
      k: "Stampy::The elephant Bart won from a radio contest." } },

    { id: "shakespeare", q: "Name a Shakespeare play", t: {
      p: "Romeo and Juliet|Hamlet|Macbeth|Othello|King Lear",
      c: "Titus Andronicus|Cardenio",
      s: "A Midsummer Night's Dream=midsummer nights dream|Julius Caesar|The Tempest=tempest|Much Ado About Nothing|Twelfth Night|The Merchant of Venice=merchant of venice|The Taming of the Shrew=taming of the shrew|As You Like It|Richard III|Henry V|Antony and Cleopatra",
      r: "Richard II|Henry IV|Henry VI|Henry VIII|King John|Coriolanus|Cymbeline|The Winter's Tale=winters tale|Measure for Measure|All's Well That Ends Well|The Comedy of Errors=comedy of errors|Love's Labour's Lost|The Two Gentlemen of Verona|The Merry Wives of Windsor|Troilus and Cressida|Timon of Athens|Pericles",
      d: "The Two Noble Kinsmen|Edward III|Sir Thomas More",
      k: "Love's Labour's Won=Love's Labour's Won Lost Play::A Shakespeare play that's recorded as existing but has never been found." } },

    { id: "videogame", q: "Name a video game", t: {
      p: "Minecraft|Fortnite|Super Mario Bros.=super mario|Tetris|Call of Duty|Pac-Man=pacman|Grand Theft Auto=gta",
      c: "E.T. the Extra-Terrestrial=et|Goat Simulator",
      s: "The Legend of Zelda=zelda|Pokemon|Halo|Roblox|League of Legends=lol|World of Warcraft=wow|The Sims=sims|Sonic the Hedgehog=sonic|Street Fighter|Mortal Kombat|Among Us|Overwatch|Animal Crossing|Mario Kart|Donkey Kong|Space Invaders|Pong|Red Dead Redemption|The Witcher|Elden Ring|Skyrim|Fallout|Doom|Portal|Half-Life|Final Fantasy|Candy Crush|Angry Birds|Counter-Strike|Valorant|Apex Legends|Rocket League|Stardew Valley|Fall Guys",
      r: "Hollow Knight|Celeste|Undertale|Hades|Cuphead|Terraria|Dark Souls|Bloodborne|Sekiro|Metroid|Kirby|Castlevania|Mega Man|Galaga|Frogger|Asteroids|Q*bert|Dig Dug|Lemmings|Myst|Oregon Trail|SimCity|Civilization|StarCraft|Diablo|BioShock|Mass Effect|Chrono Trigger|EarthBound|Okami|Shadow of the Colossus|Journey|Limbo|Inside|Braid|Spelunky|Factorio|Outer Wilds|Disco Elysium",
      d: "Katamari Damacy|Rez|Ico|Killer7|Psychonauts|Grim Fandango|Day of the Tentacle|Planescape: Torment|System Shock|Thief|Deus Ex|Vagrant Story|Panzer Dragoon|Jet Set Radio|Shenmue|Toejam and Earl|Gitaroo Man|Mother 3|Seaman|Tokyo Jungle|Pathologic|LSD Dream Emulator|Kentucky Route Zero|Return of the Obra Dinn|Baba Is You|Viewfinder|Tunic|Animal Well",
      k: "Centipede=Centipede Arcade=centipede 1981::Atari's 1981 shooter, co-designed by Dona Bailey." } },

    { id: "console", q: "Name a video game console", t: {
      p: "PlayStation=ps1|Xbox|Nintendo Switch=switch|Wii|PlayStation 5=ps5",
      c: "Virtual Boy|Ouya",
      s: "PlayStation 2=ps2|PlayStation 3=ps3|PlayStation 4=ps4|Xbox 360|Xbox One|Xbox Series X|Nintendo 64=n64|GameCube|Super Nintendo=snes|NES=nintendo entertainment system|Game Boy|Nintendo DS=ds|3DS|Wii U|Sega Genesis=mega drive|Dreamcast|Atari 2600|PSP|Steam Deck",
      r: "Game Boy Color|Game Boy Advance|Sega Saturn|Sega Master System|Game Gear|PS Vita=vita|Atari Jaguar|Atari Lynx|Atari 5200|Atari 7800|Intellivision|ColecoVision|Neo Geo|TurboGrafx-16|3DO|N-Gage|Sega CD|32X|Magnavox Odyssey|Odyssey|Vectrex|Nintendo DSi|New 3DS|Switch Lite|Switch OLED",
      d: "Nuon|Philips CD-i=cdi|Amiga CD32|FM Towns Marty|PC-FX|WonderSwan|Neo Geo Pocket|Gizmondo|Tiger Game.com|Pokemon Mini|Nomad|Sega Pico|Playdia|Fairchild Channel F|Bally Astrocade|Emerson Arcadia|Casio Loopy|Super Cassette Vision|Zeebo",
      k: "Apple Pippin=pippin=bandai pippin::Apple's 1996 game console. About 42,000 sold." } },

    { id: "mario", q: "Name a Super Mario character", t: {
      p: "Mario|Luigi|Princess Peach=peach|Bowser|Yoshi|Toad",
      c: "Waluigi",
      s: "Wario|Donkey Kong|Daisy|Rosalina|Koopa Troopa|Goomba|Boo|Shy Guy|Bowser Jr.|Diddy Kong|Toadette|Lakitu|Piranha Plant|Bob-omb|Chain Chomp|Birdo|Kamek|Dry Bones|Hammer Bro|Blooper",
      r: "Toadsworth|Captain Toad|Pauline|Cappy|Lubba|Luma|Professor E. Gadd|King Boo|Petey Piranha|Kammy Koopa|Larry Koopa|Morton Koopa|Wendy Koopa|Iggy Koopa|Roy Koopa|Lemmy Koopa|Ludwig von Koopa|Thwomp|Whomp|Bullet Bill|Banzai Bill|Cheep Cheep|Spiny|Buzzy Beetle|Monty Mole|Wiggler|Pokey|Fuzzy|Magikoopa|Nabbit|Funky Kong|Cranky Kong|Dixie Kong|King K. Rool",
      d: "Tatanga|Fawful|Cackletta|Geno|Mallow|Smithy|Bowyer|Count Bleck|Dimentio|Mimi|Nastasia|O'Chunks|Vivian|Goombella|Kooper|Bombette|Parakarry|Lady Bow|Watt|Sushie|Lakilester|Tayce T.|Prince Haru|Captain Syrup|Kamella|Hooktail",
      k: "Wart::The villain of Super Mario Bros. 2, who hates vegetables." } },

    { id: "sitcom", q: "Name a TV sitcom", t: {
      p: "Friends|Seinfeld|The Office|The Big Bang Theory=big bang theory|How I Met Your Mother",
      c: "Arrested Development",
      s: "Parks and Recreation=parks and rec|Brooklyn Nine-Nine=brooklyn 99|Modern Family|Cheers|Frasier|I Love Lucy|The Simpsons|Fresh Prince of Bel-Air=fresh prince|Full House|Everybody Loves Raymond|Two and a Half Men|30 Rock|Community|Scrubs|New Girl|That '70s Show|Malcolm in the Middle|Schitt's Creek|Abbott Elementary|Ted Lasso|It's Always Sunny in Philadelphia=always sunny|Curb Your Enthusiasm|Family Matters|Home Improvement|The Golden Girls=golden girls|M*A*S*H=mash",
      r: "Fawlty Towers|Only Fools and Horses|Blackadder|Father Ted|The IT Crowd|Peep Show|Spaced|Red Dwarf|Absolutely Fabulous|Gavin and Stacey|Mr. Bean|The Good Place|Veep|Silicon Valley|What We Do in the Shadows|Superstore|Happy Endings|Taxi|The Jeffersons|Sanford and Son|Happy Days|Laverne & Shirley|Mork & Mindy|The Brady Bunch|Gilligan's Island|The Andy Griffith Show|Bewitched|I Dream of Jeannie|The Mary Tyler Moore Show|All in the Family|Married... with Children|Roseanne|Will & Grace|Spin City|NewsRadio|3rd Rock from the Sun",
      d: "The Thick of It|Detectorists|Toast of London|Garth Marenghi's Darkplace|Green Wing|Black Books|Count Arthur Strong|Phoenix Nights|Car Share|Getting On|Party Down|Enlightened|Review|Nathan For You|Lady Dynamite|Andy Barker, P.I.|Sledge Hammer!|Get a Life|The Ben Stiller Show|Flight of the Conchords|Bored to Death",
      k: "Police Squad::Only six episodes aired; it later became The Naked Gun films." } },

    { id: "musical", q: "Name a Broadway musical", t: {
      p: "Hamilton|Wicked|The Lion King|Les Miserables=les mis|The Phantom of the Opera=phantom",
      c: "Cats|Starlight Express",
      s: "Chicago|Rent|Grease|Mamma Mia!=mamma mia|Hairspray|Cabaret|The Sound of Music|West Side Story|Annie|Dear Evan Hansen|The Book of Mormon|Jersey Boys|Mean Girls|Beetlejuice|Matilda|Aladdin|Frozen|Six|Hadestown|Oklahoma!|Fiddler on the Roof|My Fair Lady|Into the Woods|Sweeney Todd|Moulin Rouge|Little Shop of Horrors|Avenue Q|Kinky Boots",
      r: "A Chorus Line|Evita|Jesus Christ Superstar|Joseph and the Amazing Technicolor Dreamcoat|Miss Saigon|Spring Awakening|Next to Normal|In the Heights|Fun Home|Come From Away|Waitress|Be More Chill|The Producers|Spamalot|Urinetown|The Music Man|Guys and Dolls|Hello, Dolly!|Gypsy|South Pacific|The King and I|Carousel|Kiss Me, Kate|Pippin|Godspell|Hair|Company|Follies|Sunday in the Park with George|Assassins|Once|The Last Five Years|Bat Out of Hell",
      d: "Carrie|Dance of the Vampires|Spider-Man: Turn Off the Dark|Merrily We Roll Along|Grey Gardens|The Scottsboro Boys|Passing Strange|Natasha, Pierre & The Great Comet of 1812=great comet|Bloody Bloody Andrew Jackson|Lestat|Glory Days|Dude|Rockabye Hamlet|Breakfast at Tiffany's|Kelly|Got Tu Go Disco",
      k: "Via Galactica::A 1972 space musical with trampolines that closed after 7 performances." } },

    { id: "christmassong", q: "Name a Christmas song", t: {
      p: "Jingle Bells|Silent Night|All I Want for Christmas Is You|White Christmas|Rudolph the Red-Nosed Reindeer=rudolph|Deck the Halls",
      c: "Grandma Got Run Over by a Reindeer|Feliz Navidad",
      s: "Last Christmas|Frosty the Snowman|Let It Snow|Joy to the World|O Holy Night|Santa Claus Is Coming to Town|Jingle Bell Rock|Rockin' Around the Christmas Tree|Have Yourself a Merry Little Christmas|The Twelve Days of Christmas|We Wish You a Merry Christmas|Little Drummer Boy|Away in a Manger|Hark! The Herald Angels Sing|O Come All Ye Faithful|Silver Bells|Winter Wonderland|It's the Most Wonderful Time of the Year|Blue Christmas|Sleigh Ride|Feliz Navidad Song=navidad|Mary's Boy Child|Happy Xmas (War Is Over)=happy xmas",
      r: "Fairytale of New York|Do They Know It's Christmas|Wonderful Christmastime|Merry Xmas Everybody|Step Into Christmas|Santa Baby|Baby It's Cold Outside|The Christmas Song=chestnuts roasting|I'll Be Home for Christmas|Carol of the Bells|God Rest Ye Merry Gentlemen|O Little Town of Bethlehem|Good King Wenceslas|The First Noel|Angels We Have Heard on High|In the Bleak Midwinter|Ding Dong Merrily on High|Here Comes Santa Claus|Holly Jolly Christmas|Christmas Wrapping|Mistletoe and Wine|Driving Home for Christmas|Underneath the Tree|Christmas Time Is Here",
      d: "Christmas in Hollis|2000 Miles|Stop the Cavalry|Lonely This Christmas|I Believe in Father Christmas|Christmas Lights|Christmas Canon|Coventry Carol|Gaudete|Personent Hodie|Il est ne|Riu Riu Chiu|The Holly and the Ivy|Wexford Carol|Huron Carol|I Saw Three Ships|Past Three O'Clock|Father Christmas|Thank God It's Christmas",
      k: "Christmas at Ground Zero=Christmas at Ground Zero Weird Al=christmas at ground zero song::'Weird Al' Yankovic's cheerful 1986 song about nuclear war at Christmas." } },

    { id: "fairytale", q: "Name a fairy tale", t: {
      p: "Cinderella|Snow White|Sleeping Beauty|Little Red Riding Hood|Goldilocks and the Three Bears=goldilocks",
      c: "Rumpelstiltskin",
      s: "Hansel and Gretel|Jack and the Beanstalk|Rapunzel|Beauty and the Beast|The Little Mermaid|The Three Little Pigs|The Princess and the Pea|The Frog Prince|The Ugly Duckling|Thumbelina|Pinocchio|Puss in Boots|The Gingerbread Man|The Emperor's New Clothes|The Snow Queen|The Elves and the Shoemaker|The Pied Piper of Hamelin=pied piper|Aladdin|Peter Pan",
      r: "The Twelve Dancing Princesses|The Brave Little Tailor|The Goose Girl|The Golden Goose|Bluebeard|Snow-White and Rose-Red|The Steadfast Tin Soldier|The Little Match Girl|The Red Shoes|The Wild Swans|Tom Thumb|Mother Holle|The Musicians of Bremen=bremen town musicians|Ali Baba|Sinbad|Jack the Giant Killer|The Fisherman and His Wife|Diamonds and Toads|Donkeyskin|East of the Sun and West of the Moon|The Tinderbox",
      d: "The Juniper Tree|Fitcher's Bird|Godfather Death|The Six Swans|Allerleirauh|The Robber Bridegroom|The Singing Bone|Clever Gretel|The Girl Without Hands|The Twelve Brothers|Iron John|The Water of Life|Vasilisa the Beautiful|Baba Yaga|The Firebird|Kate Crackernuts|Tattercoats|Molly Whuppie|Tam Lin",
      k: "Hans My Hedgehog=Hans My Hedgehog Tale=hans my hedgehog grimm::A Grimm tale about a half-hedgehog boy who rides a rooster." } },

    { id: "band", q: "Name a rock band", t: {
      p: "The Beatles=beatles|Queen|The Rolling Stones=rolling stones|Led Zeppelin|AC/DC=acdc|Nirvana",
      c: "Spinal Tap|Nickelback",
      s: "Pink Floyd|Metallica|Guns N' Roses=guns n roses|U2|Aerosmith|Foo Fighters|Red Hot Chili Peppers|The Who|Fleetwood Mac|Eagles|Coldplay|Green Day|Linkin Park|Bon Jovi|Kiss|Van Halen|Journey|Def Leppard|Pearl Jam|Radiohead|The Doors|Black Sabbath|Oasis|Imagine Dragons|Arctic Monkeys|The Killers|Blink-182|Maroon 5|Iron Maiden|Kings of Leon|Muse",
      r: "Rush|Genesis|Yes|The Clash|Sex Pistols|Ramones|The Cure|The Smiths|Joy Division|R.E.M.|Talking Heads|The Police|Dire Straits|Deep Purple|Lynyrd Skynyrd|ZZ Top|Creedence Clearwater Revival=ccr|Soundgarden|Alice in Chains|Stone Temple Pilots|Weezer|The Strokes|The White Stripes|Tame Impala|Queens of the Stone Age|System of a Down|Rage Against the Machine|Tool|Slipknot|My Chemical Romance|Paramore|Fall Out Boy|Panic! at the Disco|Gorillaz|The Velvet Underground",
      d: "Can|Neu!|Television|Wire|Slint|Mission of Burma|Husker Du|The Replacements|Minutemen|Big Star|The Zombies|Love|The Stooges|MC5|Gentle Giant|Van der Graaf Generator|King Crimson|Magma|Faust|Swans|Unwound|Drive Like Jehu|Polvo|Shellac|Lungfish|Thinking Fellers Union Local 282",
      k: "Shaggs::Three sisters whose 1969 album is either the worst or best ever made." } },


    { id: "bestpicture", q: "Name a Best Picture Oscar winner", t: {
      p: "Titanic|The Godfather|Gladiator|Forrest Gump|Parasite|Oppenheimer",
      c: "Crash|Shakespeare in Love",
      s: "Schindler's List|The Lord of the Rings: The Return of the King=return of the king|Casablanca|Gone with the Wind|Braveheart|The Silence of the Lambs|Rocky|Slumdog Millionaire|The Departed|No Country for Old Men|Argo|12 Years a Slave|Birdman|Spotlight|Moonlight|The Shape of Water|Green Book|Nomadland|CODA|Everything Everywhere All at Once|Chicago|A Beautiful Mind|American Beauty|Million Dollar Baby|The King's Speech|The Artist|Dances with Wolves|Rain Man|Amadeus|Gandhi|Ben-Hur|The Sound of Music|West Side Story|The Godfather Part II|One Flew Over the Cuckoo's Nest|Unforgiven|The Hurt Locker|Anora",
      r: "Lawrence of Arabia|My Fair Lady|Patton|The French Connection|The Sting|Annie Hall|The Deer Hunter|Kramer vs. Kramer|Ordinary People|Chariots of Fire|Terms of Endearment|Out of Africa|Platoon|The Last Emperor|Driving Miss Daisy|The English Patient|Midnight Cowboy|In the Heat of the Night|A Man for All Seasons|Tom Jones|The Apartment|Gigi|The Bridge on the River Kwai|Around the World in 80 Days|Marty|On the Waterfront|From Here to Eternity|All About Eve|Hamlet|The Best Years of Our Lives",
      d: "Wings|The Broadway Melody|All Quiet on the Western Front|Cimarron|Grand Hotel|It Happened One Night|Mutiny on the Bounty|The Great Ziegfeld|The Life of Emile Zola|You Can't Take It with You|Rebecca|How Green Was My Valley|Mrs. Miniver|Going My Way|The Lost Weekend|Gentleman's Agreement|All the King's Men|An American in Paris|The Greatest Show on Earth|Oliver!",
      k: "Cavalcade::The 1933 winner almost nobody has seen; it ends with a toast to England." } },

    { id: "socialapp", q: "Name a social media app or website", t: {
      p: "Facebook|Instagram|TikTok|Twitter=x|Snapchat|YouTube",
      c: "Myspace|Vine",
      s: "Reddit|LinkedIn|Pinterest|WhatsApp|Tumblr|Discord|Threads|Bluesky|Telegram|WeChat|Twitch|BeReal|Messenger|Quora|Clubhouse",
      r: "Mastodon|Flickr|Weibo|Douyin|Line|Kakao|VK=vkontakte|Signal|Periscope|Friendster|Bebo|Orkut|Google+=google plus|Path|Yik Yak|Ello|Vero|Parler|Truth Social|Gab|Nextdoor|Letterboxd|Goodreads|Strava|Untappd|Xanga|LiveJournal|DeviantArt",
      d: "Hi5|Tagged|Habbo|Club Penguin|Neopets|Gaia Online|Plurk|Jaiku|Diaspora|Peach|Google Buzz|Friendfeed|Digg|StumbleUpon|Delicious|Formspring|Ask.fm|Kik|Whisper|Meerkat|Cyworld|Mixi|Hyves|StudiVZ|Nasza Klasa|Draugiem",
      k: "Google Wave::Google's 2009 'future of email', shut down a year later." } },

    { id: "musicgenre", q: "Name a music genre", t: {
      p: "Rock|Pop|Hip Hop=rap|Jazz|Country|Classical",
      c: "Polka|Yodeling",
      s: "Blues|R&B=rnb|Reggae|Metal=heavy metal|Punk|Folk|EDM=electronic|Disco|Funk|Soul|Gospel|Techno|House|K-Pop=kpop|Indie|Grunge|Alternative|Latin|Salsa|Reggaeton|Opera|Bluegrass|Dubstep|Trap|Emo",
      r: "Ska|Swing|Bebop|Motown|Doo-Wop=doo wop|Rockabilly|Surf Rock|Shoegaze|Post-Punk|New Wave|Synthwave|Trance|Drum and Bass|Garage|Grime|Afrobeat|Afrobeats|Highlife|Cumbia|Bossa Nova|Samba|Tango|Flamenco|Fado|Bachata|Merengue|Zydeco|Cajun|Ambient|Lo-Fi|Hyperpop|Drill|Dancehall|Bhangra|J-Pop|Industrial|Death Metal|Black Metal",
      d: "Vaporwave|Witch House|Chillwave|Seapunk|Nightcore|Gabber|Breakcore|Footwork|Juke|Baile Funk|Kwaito|Gqom|Amapiano|Mbalax|Soukous|Benga|Chimurenga|Gnawa|Rai|Qawwali|Enka|Kayokyoku|City Pop|Dangdut|Mor Lam|Joik|Tuvan Throat Singing|Sea Shanty|Plunderphonics|Musique Concrete|Krautrock|Math Rock|Mathcore|Sludge",
      k: "Zeuhl::A genre invented by the French band Magma, sung in their own made-up language." } },

    { id: "superhero_villain", q: "Name a supervillain", t: {
      p: "The Joker=joker|Darth Vader|Lex Luthor|Thanos|Magneto|Loki",
      c: "Condiment King|Kite Man",
      s: "Green Goblin|Doctor Octopus=doc ock|Venom|Doctor Doom|Catwoman|Bane|Penguin|Riddler|Two-Face|Scarecrow|Poison Ivy|Harley Quinn|Mr. Freeze|Ultron|Red Skull|Kingpin|Sinestro|Darkseid|Brainiac|General Zod=zod|Mystique|Sandman|Electro|Mysterio|Vulture|Kraven|Carnage|Killmonger|Hela|Galactus|Apocalypse",
      r: "Ra's al Ghul|Deathstroke|Black Manta|Reverse-Flash|Captain Cold|Gorilla Grodd|Cheetah|Ares|Doomsday|Bizarro|Metallo|Parasite|Toyman|Mongul|Black Adam|Killer Croc|Clayface|Mad Hatter|Hush|Firefly|Hugo Strange|Scarlet Witch|Juggernaut|Sabretooth|Mister Sinister|Dormammu|Baron Zemo|M.O.D.O.K.=modok|Taskmaster|Bullseye|Shocker|Rhino|Lizard|Scorpion|Hobgoblin|Morbius|Kang",
      d: "Egghead|Paste-Pot Pete|Typeface|Polka-Dot Man|Calendar Man|Crazy Quilt|Kite-Man Jr.|Ten-Eyed Man|Mister Mxyzptlk|Prankster|Big Wheel|Stilt-Man|Whirlwind|Beetle|Unicorn|Porcupine|Batroc the Leaper|Arcade|Mojo|Fin Fang Foom|Dr. Bong|Asbestos Man|Armadillo|Gibbon|Dr. Sivana|Grundy",
      k: "Asbestos Lady::A Marvel villain in a fireproof suit, from more innocent times." } },

    { id: "cartoon", q: "Name a cartoon character", t: {
      p: "Mickey Mouse|SpongeBob SquarePants=spongebob|Bugs Bunny|Homer Simpson|Scooby-Doo=scooby doo|Tom and Jerry=tom|Pikachu",
      c: "Snagglepuss|Johnny Bravo",
      s: "Donald Duck|Goofy|Daffy Duck|Porky Pig|Tweety|Sylvester|Road Runner|Wile E. Coyote|Fred Flintstone|Barney Rubble|Garfield|Snoopy|Charlie Brown|Popeye|Patrick Star|Shaggy|Winnie the Pooh|Peter Griffin|Bart Simpson|Dora|Peppa Pig|Bluey|Woody Woodpecker|Pink Panther|Yogi Bear|George Jetson|Rugrats=tommy pickles|Cartman|Rick Sanchez=rick|Bender",
      r: "Foghorn Leghorn|Pepe Le Pew|Marvin the Martian|Elmer Fudd|Yosemite Sam|Speedy Gonzales|Taz=tasmanian devil|Huckleberry Hound|Top Cat|Quick Draw McGraw|Magilla Gorilla|Mighty Mouse|Felix the Cat|Betty Boop|Heckle and Jeckle|Underdog|Rocky and Bullwinkle=bullwinkle|Dudley Do-Right|Mr. Magoo|Droopy|Space Ghost|Courage the Cowardly Dog=courage|Dexter|Powerpuff Girls|Ed Edd n Eddy|Invader Zim|Rocko|Ren and Stimpy|Hey Arnold|Doug|Danny Phantom|Jimmy Neutron|Aang|Finn the Human|Steven Universe",
      d: "Gerald McBoing-Boing|Crusader Rabbit|Clutch Cargo|Gumby|Pokey|Deputy Dawg|Atom Ant|Secret Squirrel|Peter Potamus|Touche Turtle|Lippy the Lion|Hardy Har Har|Wally Gator|Breezly|Sneezly|Squiddly Diddly|Hong Kong Phooey|Captain Caveman|Grape Ape|Inch High|Cow and Chicken|I.M. Weasel|CatDog|Aaahh!!! Real Monsters|KaBlam!",
      k: "Hector Heathcote::A 1960s Terrytoons patriot who kept turning up at key moments in American history." } },

    { id: "nurseryrhyme", q: "Name a nursery rhyme", t: {
      p: "Twinkle Twinkle Little Star|Humpty Dumpty|Mary Had a Little Lamb|Baa Baa Black Sheep|Itsy Bitsy Spider=incy wincy spider|Hickory Dickory Dock",
      c: "Ring a Ring o' Roses=ring around the rosie",
      s: "Jack and Jill|Old MacDonald Had a Farm=old macdonald|Row Row Row Your Boat|Hey Diddle Diddle|Little Miss Muffet|Three Blind Mice|London Bridge Is Falling Down=london bridge|Pop Goes the Weasel|Little Bo Peep|Wheels on the Bus|Rock-a-Bye Baby|Old Mother Hubbard|Sing a Song of Sixpence|Pat-a-Cake|This Little Piggy|Hot Cross Buns|Five Little Monkeys|Head Shoulders Knees and Toes",
      r: "Little Jack Horner|Georgie Porgie|Jack Sprat|Old King Cole|Mary Mary Quite Contrary|Polly Put the Kettle On|Peter Piper|Peter Peter Pumpkin Eater|Diddle Diddle Dumpling|Wee Willie Winkie|Little Boy Blue|Ding Dong Bell|There Was an Old Woman Who Lived in a Shoe|Doctor Foster|Simple Simon|Lavender's Blue|Oranges and Lemons|Ride a Cock Horse|The Grand Old Duke of York|Here We Go Round the Mulberry Bush|I'm a Little Teapot|Pease Porridge Hot|One Two Buckle My Shoe|Rain Rain Go Away|Hush Little Baby",
      d: "Solomon Grundy|Tom Tom the Piper's Son|Goosey Goosey Gander|Lucy Locket|Bobby Shafto|Little Tommy Tucker|Three Men in a Tub|Hark Hark the Dogs Do Bark|As I Was Going to St Ives|The Queen of Hearts|Monday's Child|Ladybird Ladybird|Elsie Marley|Gay Go Up and Gay Go Down|Curly Locks|Cock a Doodle Doo",
      k: "Hector Protector::'Hector Protector was dressed all in green' — the King and Queen didn't like him." } },

    { id: "composer", q: "Name a classical composer", t: {
      p: "Mozart|Beethoven|Bach|Chopin|Tchaikovsky",
      c: "Pachelbel|Salieri",
      s: "Vivaldi|Handel|Haydn|Brahms|Schubert|Debussy|Wagner|Verdi|Liszt|Mendelssohn|Strauss|Dvorak|Rachmaninoff|Stravinsky|Puccini|Rossini|Mahler|Grieg|Holst|Elgar|Ravel|Satie|Gershwin|Copland|Saint-Saens|Prokofiev|Shostakovich|Philip Glass",
      r: "Schumann|Berlioz|Bizet|Mussorgsky|Rimsky-Korsakov|Sibelius|Bruckner|Faure|Offenbach|Purcell|Monteverdi|Telemann|Scarlatti|Corelli|Albinoni|Gluck|Paganini|Bartok|Janacek|Smetana|Borodin|Orff|Barber|Bernstein|Britten|Vaughan Williams|Part|Reich|Cage|Schoenberg|Berg|Webern|Messiaen|Ligeti|John Williams|Hans Zimmer|Einaudi",
      d: "Hildegard von Bingen|Perotin|Machaut|Dufay|Josquin|Palestrina|Tallis|Byrd|Gesualdo|Buxtehude|Rameau|Couperin|Lully|Zelenka|Pergolesi|Boccherini|Clementi|Hummel|Field|Alkan|Chausson|Franck|Scriabin|Medtner|Szymanowski|Nielsen|Ives|Varese|Xenakis|Nancarrow|Ustvolskaya|Gubaidulina",
      k: "Sorabji=kaikhosru sorabji::Wrote a piano piece over 4 hours long and banned others from playing his work." } },

    { id: "painting", q: "Name a famous painting", t: {
      p: "Mona Lisa|The Starry Night=starry night|The Last Supper|The Scream|Girl with a Pearl Earring",
      c: "Dogs Playing Poker|American Gothic",
      s: "The Birth of Venus|The Persistence of Memory=melting clocks|The Creation of Adam|Guernica|Water Lilies|Sunflowers|The Kiss|Night Hawks=nighthawks|Whistler's Mother|The Night Watch|Las Meninas|The Great Wave off Kanagawa=great wave|Washington Crossing the Delaware|Liberty Leading the People|Campbell's Soup Cans|The Son of Man|Impression, Sunrise|The Garden of Earthly Delights",
      r: "The School of Athens|The Arnolfini Portrait|The Hay Wain|The Fighting Temeraire|Wanderer above the Sea of Fog|Christina's World|A Sunday Afternoon on the Island of La Grande Jatte|Bal du moulin de la Galette|Olympia|Le Dejeuner sur l'herbe|Les Demoiselles d'Avignon|The Raft of the Medusa|Saturn Devouring His Son|The Third of May 1808|The Ambassadors|Primavera|The Tower of Babel|Netherlandish Proverbs|Hunters in the Snow|The Sleeping Gypsy|Composition with Red, Blue and Yellow|No. 5, 1948|Number 1|Ophelia|The Lady of Shalott|Café Terrace at Night|The Potato Eaters|Wheatfield with Crows",
      d: "The Ghent Altarpiece|The Isenheim Altarpiece|The Tribute Money|The Battle of San Romano|The Tempest|Sacred and Profane Love|Judith Slaying Holofernes|The Calling of Saint Matthew|The Swing|The Death of Marat|Oath of the Horatii|Burial at Ornans|The Gross Clinic|Ivan the Terrible and His Son|Black Square|The Treachery of Images|Broadway Boogie Woogie|Salvator Mundi",
      k: "Ecce Homo=Ecce Homo Fresco Restoration=monkey christ::A Spanish fresco 'restored' so badly it became a tourist hit." } },

    { id: "pixar", q: "Name a Pixar movie", t: {
      p: "Toy Story|Finding Nemo|Up|Cars|The Incredibles=incredibles|Monsters, Inc.=monsters inc",
      c: "Cars 2|The Good Dinosaur",
      s: "WALL-E=wall e|Ratatouille|Inside Out|Coco|A Bug's Life=bugs life|Brave|Toy Story 2|Toy Story 3|Toy Story 4|Finding Dory|Monsters University|Incredibles 2|Soul|Luca|Turning Red|Elemental|Inside Out 2|Onward|Lightyear|Cars 3",
      r: "Elio",
      d: "Luxo Jr.|Geri's Game|For the Birds|Partly Cloudy|La Luna|Lava|Bao|Piper|Purl|Kitbull|Burrow|Presto|Day & Night|One Man Band|Boundin'|Tin Toy|Red's Dream|Knick Knack|Lifted|Sanjay's Super Team|Float|Loop|Wind",
      k: "The Adventures of André & Wally B.=andre and wally b::The 1984 short made before Pixar was even Pixar." } }
  ];

  root.CP = root.CP || {};
  root.CP.PROMPTS = (root.CP.PROMPTS || []).concat(PROMPTS);
})(typeof window !== "undefined" ? window : globalThis);
