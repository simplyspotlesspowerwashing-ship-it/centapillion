/* Prompt pack 4: geography and places. Format as in data.js. */
(function (root) {
  var PROMPTS = [
    { id: "asia", q: "Name a country in Asia", t: {
      p: "China|Japan|India|South Korea=korea|Thailand|Vietnam",
      c: "Bhutan|Kazakhstan",
      s: "Indonesia|Philippines|Malaysia|Singapore|Pakistan|Afghanistan|Iran|Iraq|Saudi Arabia|Israel|North Korea|Nepal|Bangladesh|Sri Lanka|Mongolia|Cambodia|Myanmar=burma|Laos|Taiwan|Turkey|Syria|Jordan|Lebanon|United Arab Emirates=uae|Qatar|Russia",
      r: "Uzbekistan|Kyrgyzstan|Tajikistan|Turkmenistan|Kuwait|Bahrain|Oman|Yemen|Maldives|East Timor=timor-leste|Georgia|Armenia|Azerbaijan|Cyprus|Palestine",
      d: "Timor|Hong Kong|Macau",
      k: "Brunei=Brunei Darussalam=nation of brunei::Its sultan's palace has 1,788 rooms." } },


    { id: "europe", q: "Name a country in Europe", t: {
      p: "France|Germany|Italy|Spain|United Kingdom=uk=britain=england|Greece",
      c: "Liechtenstein|Vatican City=vatican",
      s: "Portugal|Netherlands=holland|Belgium|Switzerland|Austria|Sweden|Norway|Denmark|Finland|Ireland|Poland|Russia|Ukraine|Iceland|Czech Republic=czechia|Hungary|Croatia|Scotland|Wales|Turkey",
      r: "Romania|Bulgaria|Serbia|Slovakia|Slovenia|Estonia|Latvia|Lithuania|Belarus|Luxembourg|Monaco|Malta|Cyprus|Albania|Bosnia and Herzegovina=bosnia|Montenegro|North Macedonia=macedonia|Moldova|Andorra|San Marino|Kosovo|Georgia",
      d: "Faroe Islands|Gibraltar|Isle of Man|Jersey|Guernsey|Aland|Transnistria|Northern Cyprus|Svalbard",
      k: "Sealand=principality of sealand::A 'nation' built on a WWII sea fort off England." } },

    { id: "island", q: "Name an island", t: {
      p: "Hawaii|Greenland|Australia|Madagascar|Ireland|Japan",
      c: "Easter Island|Atlantis",
      s: "Iceland|Cuba|Jamaica|Puerto Rico|Bali|Sicily|Sardinia|Corsica|Crete|Cyprus|Malta|Tasmania|New Guinea|Borneo|Sumatra|Java|Sri Lanka|Taiwan|Manhattan|Long Island|Maui|Oahu|Bermuda|Bahamas|Tahiti|Fiji|Great Britain|Newfoundland|Galapagos",
      r: "Santorini|Mykonos|Capri|Ibiza|Mallorca=majorca|Tenerife|Isle of Skye=skye|Isle of Wight|Anglesey|Zanzibar|Mauritius|Seychelles|Bora Bora|Phuket|Hokkaido|Okinawa|Baffin Island|Ellesmere|Sakhalin|Hainan|Socotra|Svalbard|Kodiak|Nantucket|Martha's Vineyard|Alcatraz|Ellis Island|Rhodes|Lanzarote",
      d: "Tristan da Cunha|Pitcairn|Kerguelen|Heard Island|Clipperton|Nauru|Tuvalu|Tokelau|Niue|Rapa Nui|St Helena=saint helena|Ascension|Lord Howe|Norfolk Island|Christmas Island|Diego Garcia|Wrangel Island|Novaya Zemlya|Jan Mayen|Bear Island|Kiska|Attu|Sentinel Island=north sentinel",
      k: "Bouvet=Bouvet Island::The remotest island on Earth: 1,600 km from anywhere, all ice." } },

    { id: "river", q: "Name a river", t: {
      p: "Nile|Amazon|Mississippi|Thames|Danube",
      c: "Styx|Ganges",
      s: "Yangtze|Rhine|Seine|Hudson|Colorado|Missouri|Ohio|Rio Grande|Volga|Tigris|Euphrates|Jordan|Mekong|Congo|Zambezi|Niger|Indus|Potomac|Columbia|Yukon|St. Lawrence|Tiber|Loire|Yellow River=huang he",
      r: "Orinoco|Parana|Ob|Yenisei|Lena|Amur|Irrawaddy|Brahmaputra|Elbe|Oder|Vistula|Rhone|Po|Ebro|Tagus|Douro|Shannon|Severn|Mersey|Tyne|Clyde|Tennessee|Snake|Arkansas|Delaware|Charles|Susquehanna|Sacramento|Fraser|Mackenzie|Murray|Darling|Limpopo|Orange|Dnieper|Don",
      d: "Ural|Kolyma|Indigirka|Salween|Chao Phraya|Red River|Pearl River|Xi|Sutlej|Godavari|Kaveri|Narmada|Senegal|Volta|Ubangi|Kasai|Uruguay|Madeira|Purus|Negro|Xingu|Tocantins|Magdalena|Dee|Spey|Tweed|Wear|Ouse|Avon",
      k: "Okavango::A river that never reaches the sea; it vanishes into the Kalahari." } },

    { id: "lake", q: "Name a lake", t: {
      p: "Lake Michigan=michigan|Lake Superior=superior|Lake Tahoe=tahoe|Lake Erie=erie|Lake Ontario=ontario|Lake Huron=huron",
      c: "Loch Ness|Great Salt Lake",
      s: "Lake Victoria|Lake Baikal=baikal|Caspian Sea|Lake Titicaca=titicaca|Lake Geneva|Lake Como|Crater Lake|Lake Placid|Lake Mead|Lake Powell|Lake Champlain|Dead Sea|Lake Tanganyika|Lake Malawi",
      r: "Lake Garda|Lake Constance=bodensee|Lake Lucerne|Lake Winnipeg|Great Bear Lake|Great Slave Lake|Lake Okeechobee|Lake Pontchartrain|Lake Louise|Lake Ladoga|Lake Onega|Lake Balaton|Lake Bled|Windermere|Loch Lomond|Lough Neagh|Lake Chad|Lake Turkana|Lake Nicaragua|Lake Maracaibo|Aral Sea|Lake Eyre|Lake Taupo|Lake Toba",
      d: "Lake Vostok|Lake Natron|Lake Hillier|Spotted Lake|Lake Retba|Lake Kivu|Lake Nyos|Lake Assal|Issyk-Kul|Lake Balkhash|Lake Van|Lake Urmia|Lake Inle|Tonle Sap|Lake Wakatipu|Lake Pukaki|Lake Atitlan|Lake Bogoria|Plitvice",
      k: "Lake Peigneur::Drained in 1980 when an oil rig drilled into the salt mine below it." } },

    { id: "desert", q: "Name a desert", t: {
      p: "Sahara|Gobi|Mojave|Antarctica|Arabian Desert=arabian",
      c: "Death Valley|Atacama",
      s: "Kalahari|Sonoran|Namib|Great Victoria|Chihuahuan|Great Basin|Thar|Arctic|Patagonian|Syrian Desert|Negev|Sinai",
      r: "Taklamakan|Karakum|Kyzylkum|Rub' al Khali=empty quarter|Dasht-e Kavir|Dasht-e Lut|Simpson Desert|Gibson Desert|Tanami|Great Sandy|Painted Desert|Black Rock Desert|Colorado Desert|Danakil|Ogaden|Libyan Desert|Nubian Desert|Wadi Rum",
      d: "Atacama Altiplano|Sechura|La Guajira|Bardenas Reales|Accona|Strzelecki|Little Sandy|Nefud|Dahna|Registan|Ordos|Badain Jaran|Tengger|Kubuqi|Lencois Maranhenses|Alvord Desert|Owyhee|Red Desert",
      k: "Tabernas::Europe's only true desert, where Spaghetti Westerns were filmed." } },

    { id: "statecapital", q: "Name a U.S. state capital", t: {
      p: "Sacramento|Austin|Boston|Denver|Atlanta",
      c: "Montpelier|Juneau",
      s: "Albany|Tallahassee|Phoenix|Nashville|Honolulu|Salt Lake City|Indianapolis|Columbus|Springfield|Richmond|Raleigh|Seattle|Olympia|Lansing|Harrisburg|Trenton|Annapolis|Baton Rouge|Oklahoma City|Santa Fe|Carson City|Boise|Madison|St. Paul|Hartford|Providence|Little Rock|Des Moines|Topeka|Lincoln",
      r: "Cheyenne|Helena|Bismarck|Jefferson City|Frankfort|Montgomery|Jackson|Columbia|Charleston|Dover|Concord|Augusta",
      d: "Agana=hagatna|Charlotte Amalie|Pago Pago|Saipan|San Juan",
      k: "Pierre=Pierre South Dakota=pierre sd::Pronounced 'peer'. Second-smallest state capital." } },

    { id: "japancity", q: "Name a city in Japan", t: {
      p: "Tokyo|Kyoto|Osaka|Hiroshima",
      c: "Nagasaki",
      s: "Yokohama|Sapporo|Kobe|Nagoya|Nara|Fukuoka|Sendai|Okinawa|Naha|Hakone|Nikko",
      r: "Kawasaki|Saitama|Chiba|Kitakyushu|Kumamoto|Kagoshima|Niigata|Shizuoka|Hamamatsu|Okayama|Kanazawa|Matsumoto|Takayama|Himeji|Hakodate|Nagano|Kamakura|Beppu|Matsuyama|Takamatsu|Kochi|Aomori|Akita",
      d: "Shirakawa-go|Yamagata|Morioka|Matsue|Tokushima|Kurashiki|Onomichi|Ise|Wakayama|Otaru|Asahikawa|Kushiro|Abashiri|Miyazaki|Ishigaki|Toyama|Fukui|Gifu|Tsu",
      k: "Tottori::Home to Japan's biggest sand dunes, and a museum of sand sculptures." } },

    { id: "nationalpark", q: "Name a U.S. national park", t: {
      p: "Yellowstone|Yosemite|Grand Canyon|Zion",
      c: "Death Valley",
      s: "Glacier|Grand Teton|Rocky Mountain|Great Smoky Mountains=smoky mountains|Acadia|Arches|Olympic|Bryce Canyon|Joshua Tree|Everglades|Sequoia|Mount Rainier|Canyonlands|Badlands|Shenandoah|Denali|Redwood|Crater Lake",
      r: "Capitol Reef|Mesa Verde|Big Bend|Carlsbad Caverns|Hot Springs|Mammoth Cave|Haleakala|Hawaii Volcanoes|Petrified Forest|Saguaro|White Sands|Great Sand Dunes|Black Canyon of the Gunnison|Kings Canyon|Lassen Volcanic|Pinnacles|Channel Islands|Theodore Roosevelt|Wind Cave|Voyageurs|Isle Royale|Indiana Dunes|Cuyahoga Valley|Biscayne|New River Gorge",
      d: "Gates of the Arctic|Lake Clark|Katmai|Kenai Fjords|Wrangell-St. Elias|Glacier Bay|Dry Tortugas|Congaree|North Cascades|Great Basin|Guadalupe Mountains|American Samoa|Virgin Islands",
      k: "Kobuk Valley::Arctic sand dunes, and some years fewer than 20 visitors." } },

    { id: "volcano", q: "Name a volcano", t: {
      p: "Mount Vesuvius=vesuvius|Mount St. Helens=st helens|Mount Etna=etna|Mount Fuji=fuji|Krakatoa",
      c: "Yellowstone|Eyjafjallajokull",
      s: "Mauna Loa|Kilauea|Mount Pinatubo=pinatubo|Mount Rainier|Stromboli|Popocatepetl|Kilimanjaro|Mount Hood|Mauna Kea|Tambora|Cotopaxi|Hekla|Mount Shasta",
      r: "Pelee=mount pelee|Nevado del Ruiz|Paricutin|Santorini|Thera|Mount Erebus|Mount Agung|Merapi|Taal|Sakurajima|Mount Ontake|Unzen|Grimsvotn|Katla|Laki|Surtsey|Nyiragongo|Erta Ale|Villarrica|Chimborazo|Lassen Peak|Mount Mazama|Long Valley|Campi Flegrei",
      d: "Toba|Ojos del Salado|Llullaillaco|Kawah Ijen|Anak Krakatau|Tavurvur|Mount Tarawera|Ruapehu|Tongariro|White Island=whakaari|Hunga Tonga|Klyuchevskaya|Bezymianny|Shiveluch|Novarupta|Mount Katmai|Mount Spurr|Augustine|Soufriere Hills",
      k: "Ol Doinyo Lengai=Ol Doinyo Lengai Natrocarbonatite=lengai::The only volcano that erupts black lava that turns white." } },

    { id: "bridge", q: "Name a famous bridge", t: {
      p: "Golden Gate Bridge=golden gate|Brooklyn Bridge|London Bridge|Tower Bridge",
      c: "Bridge of Sighs|Rainbow Bridge",
      s: "Sydney Harbour Bridge|Ponte Vecchio|Charles Bridge|Rialto Bridge|Bay Bridge|George Washington Bridge|Verrazzano-Narrows|Manhattan Bridge|Williamsburg Bridge|Mackinac Bridge|Seven Mile Bridge|Millau Viaduct|Forth Bridge|Pont Neuf|Pont des Arts",
      r: "Akashi Kaikyo|Oresund Bridge|Chesapeake Bay Bridge|Lake Pontchartrain Causeway|Tsing Ma|Stari Most|Chain Bridge|Clifton Suspension Bridge|Severn Bridge|Humber Bridge|Millennium Bridge|Erasmus Bridge|Alexandre III|Helix Bridge|Banpo Bridge|Hangzhou Bay|Danyang-Kunshan|Royal Gorge Bridge|Sunshine Skyway|Confederation Bridge|Quebec Bridge",
      d: "Living Root Bridges|Puente de la Mujer|Khaju Bridge|Si-o-se-pol|Iron Bridge|Pulteney Bridge|Kintai Bridge|Pont du Gard|Alcantara Bridge|Devil's Bridge|Rakotzbrucke|Moses Bridge|Gateshead Millennium|Infinity Bridge|Henderson Waves|Dragon Bridge|Langkawi Sky Bridge|Capilano",
      k: "Q'eswachaka=Q'eswachaka Rope Bridge::An Inca grass bridge rewoven by hand every June." } },

    { id: "landmark", q: "Name a famous landmark", t: {
      p: "Eiffel Tower|Statue of Liberty|Great Wall of China=great wall|Taj Mahal|Big Ben|Pyramids=pyramids of giza",
      c: "Stonehenge|Leaning Tower of Pisa=leaning tower",
      s: "Colosseum|Mount Rushmore|Christ the Redeemer|Machu Picchu|Sydney Opera House|Golden Gate Bridge|Empire State Building|Sphinx|Parthenon|Acropolis|Burj Khalifa|Petra|Angkor Wat|Chichen Itza|Notre-Dame|Sagrada Familia|Kremlin|Buckingham Palace|Space Needle|Hollywood Sign|Arc de Triomphe|Louvre|Brandenburg Gate|Times Square",
      r: "Neuschwanstein|Alhambra|Forbidden City|Potala Palace|Hagia Sophia|Blue Mosque|St. Basil's Cathedral|Moai|Easter Island Heads|CN Tower|Gateway Arch|Golden Temple|Borobudur|Mont Saint-Michel|Versailles|Atomium|Manneken Pis|Little Mermaid|Uluru|Table Mountain|Christ of the Andes|Tower of London|Westminster Abbey|Edinburgh Castle|Pantheon",
      d: "Derawar Fort|Great Mosque of Djenne|Lalibela|Mohenjo-daro|Persepolis|Bagan|Prambanan|Shwedagon|Sigiriya|Hampi|Meteora|Kizhi Pogost|Sedlec Ossuary|Hallgrimskirkja|Kinderdijk|Carcassonne|Ggantija|Skara Brae|Newgrange",
      k: "Gobekli Tepe::A stone temple 11,000 years old, older than farming and writing." } },

    { id: "olympichost", q: "Name a city that has hosted the Olympics", t: {
      p: "London|Paris|Los Angeles|Tokyo|Beijing",
      c: "Athens|Sarajevo",
      s: "Rio de Janeiro=rio|Sydney|Atlanta|Barcelona|Seoul|Moscow|Munich|Mexico City|Montreal|Berlin|Rome|Vancouver|Sochi|Salt Lake City|Lake Placid|Calgary|Turin|Pyeongchang|Nagano|Lillehammer",
      r: "Amsterdam|Antwerp|Stockholm|Helsinki|Melbourne|Squaw Valley|Innsbruck|Grenoble|Sapporo|Albertville|Oslo|Cortina d'Ampezzo|St. Moritz|Chamonix|Garmisch-Partenkirchen",
      d: "Garmisch|Cortina",
      k: "St. Louis=St. Louis 1904::The 1904 marathon winner was caught riding in a car." } },

    { id: "waterfall", q: "Name a waterfall", t: {
      p: "Niagara Falls=niagara|Victoria Falls|Angel Falls",
      c: "Iguazu Falls=iguazu",
      s: "Yosemite Falls|Multnomah Falls|Bridalveil Fall|Horseshoe Falls|Gullfoss|Skogafoss|Seljalandsfoss|Kaieteur Falls|Havasu Falls|Dettifoss|Rhine Falls",
      r: "Tugela Falls|Sutherland Falls|Plitvice|Krka|Kaaterskill|Shoshone Falls|Snoqualmie|Burney Falls|Kegon Falls|Nachi Falls|Jog Falls|Dudhsagar|Huangguoshu|Ban Gioc|Kuang Si|Erawan|Gocta|Blue Nile Falls|Murchison Falls|Wallaman Falls",
      d: "Vinnufossen|Mardalsfossen|Tyssestrengene|Staubbach|Trummelbach|Reichenbach|Krimml|Cascata delle Marmore|Svartifoss|Hraunfossar|Glymur|Kjosfossen|Salto del Laja|Ruacana|Inga Falls|Boyoma|Khone Phapheng",
      k: "Blood Falls::An Antarctic glacier that leaks red, iron-rich brine." } },

    { id: "italycity", q: "Name a city in Italy", t: {
      p: "Rome|Venice|Florence|Milan|Naples",
      c: "Pompeii",
      s: "Pisa|Turin|Bologna|Verona|Genoa|Palermo|Siena|Sorrento|Amalfi|Positano|Capri|Bari|Catania|Trieste|Parma|Modena",
      r: "Lucca|Padua|Bergamo|Brescia|Como|Cremona|Mantua|Ferrara|Ravenna|Rimini|Ancona|Perugia|Assisi|Orvieto|San Gimignano|Cagliari|Lecce|Matera|Taranto|Messina|Syracuse|Salerno|Reggio Calabria|Trento|Bolzano|Udine|Aosta",
      d: "Alberobello|Montepulciano|Cortona|Volterra|Urbino|Spoleto|Gubbio|Noto|Ragusa|Cefalu|Tropea|Otranto|Gallipoli|Polignano a Mare|Bergamo Alta|Vicenza|Treviso|Chioggia|Sabbioneta",
      k: "Civita di Bagnoregio=civita::'The dying town', reachable only by footbridge, about 10 residents." } },

    { id: "germanycity", q: "Name a city in Germany", t: {
      p: "Berlin|Munich|Hamburg|Frankfurt|Cologne=koln",
      c: "Dusseldorf",
      s: "Stuttgart|Dresden|Leipzig|Nuremberg|Bonn|Heidelberg|Hanover|Bremen|Dortmund|Essen|Mainz|Augsburg|Freiburg",
      r: "Wiesbaden|Karlsruhe|Mannheim|Munster|Aachen|Kiel|Lubeck|Rostock|Potsdam|Weimar|Erfurt|Jena|Wurzburg|Bamberg|Regensburg|Passau|Ulm|Trier|Koblenz|Magdeburg|Halle|Chemnitz|Bielefeld|Duisburg|Bochum",
      d: "Rothenburg ob der Tauber=rothenburg|Quedlinburg|Goslar|Wernigerode|Meissen|Bautzen|Gorlitz|Stralsund|Wismar|Lindau|Garmisch|Oberammergau|Fussen|Eisenach|Celle|Wolfsburg|Ingolstadt|Bayreuth",
      k: "Hameln=Hamelin Pied Piper=hameln town=hamelin::The Pied Piper town, where drums and music are banned on one street." } },

    { id: "spokenlang", q: "Name a language", t: {
      p: "English|Spanish|French|German|Chinese=mandarin|Japanese",
      c: "Klingon|Esperanto",
      s: "Italian|Portuguese|Russian|Arabic|Hindi|Korean|Latin|Greek|Dutch|Swedish|Norwegian|Danish|Polish|Turkish|Hebrew|Vietnamese|Thai|Cantonese|Irish=gaelic|Welsh|Finnish|Tagalog=filipino|Swahili|Urdu|Bengali|Persian=farsi|Sign Language=asl",
      r: "Hungarian|Czech|Slovak|Romanian|Bulgarian|Serbian|Croatian|Ukrainian|Icelandic|Catalan|Basque|Afrikaans|Zulu|Xhosa|Yoruba|Igbo|Hausa|Amharic|Punjabi|Tamil|Telugu|Gujarati|Marathi|Malay|Indonesian|Hawaiian|Maori|Navajo|Cherokee|Quechua|Scottish Gaelic|Yiddish|Sanskrit|Tibetan|Mongolian|Kurdish|Pashto|Haitian Creole|Albanian",
      d: "Breton|Cornish|Manx|Romansh|Sami|Faroese|Frisian|Sorbian|Ladino|Aramaic|Coptic|Akkadian|Sumerian|Etruscan|Ainu|Basque Euskara|Tok Pisin|Bislama|Inuktitut|Cree|Ojibwe|Lakota|Nahuatl|Guarani|Aymara|Wolof|Tigrinya|Dzongkha|Khmer|Lao|Hmong",
      k: "Silbo Gomero=silbo::A whistled form of Spanish used to talk across the valleys of La Gomera." } },

    { id: "australiacity", q: "Name a city in Australia", t: {
      p: "Sydney|Melbourne|Brisbane|Perth|Adelaide",
      c: "Canberra",
      s: "Gold Coast|Darwin|Hobart|Cairns|Newcastle|Wollongong|Geelong|Townsville|Alice Springs",
      r: "Ballarat|Bendigo|Toowoomba|Launceston|Mackay|Rockhampton|Bundaberg|Wagga Wagga|Albury|Coffs Harbour|Byron Bay|Broome|Kalgoorlie|Mildura|Orange|Dubbo|Bathurst|Noosa|Port Macquarie|Fremantle",
      d: "Broken Hill|Mount Isa|Tennant Creek|Katherine|Kununurra|Esperance|Albany|Port Hedland|Karratha|Longreach|Charleville|Ceduna|Whyalla|Burnie|Devonport|Queanbeyan",
      k: "Coober Pedy::An opal-mining town where people live underground to escape the heat." } },

    { id: "chinacity", q: "Name a city in China", t: {
      p: "Beijing|Shanghai|Hong Kong|Shenzhen|Guangzhou",
      c: "Wuhan|Macau",
      s: "Chengdu|Xi'an=xian|Chongqing|Tianjin|Nanjing|Hangzhou|Suzhou|Harbin|Guilin|Lhasa|Kunming|Qingdao|Dalian",
      r: "Xiamen|Shenyang|Changsha|Zhengzhou|Jinan|Hefei|Fuzhou|Nanning|Guiyang|Urumqi|Lanzhou|Taiyuan|Shijiazhuang|Ningbo|Wuxi|Dongguan|Foshan|Zhuhai|Sanya|Lijiang|Dali|Datong|Luoyang|Kashgar",
      d: "Dunhuang|Pingyao|Zhangjiajie|Yangshuo|Fenghuang|Hohhot|Baotou|Xining|Yinchuan|Turpan|Hami|Kaifeng|Anyang|Qufu|Tai'an|Huangshan|Jingdezhen|Shangri-La|Ruili",
      k: "Ordos=Ordos Kangbashi=kangbashi::A new city built for a million people that stood almost empty." } },

    { id: "texascity", q: "Name a city in Texas", t: {
      p: "Houston|Dallas|Austin|San Antonio|El Paso",
      c: "Paris|Waco",
      s: "Fort Worth|Corpus Christi|Arlington|Plano|Lubbock|Amarillo|Galveston|Laredo|Irving|Garland|Frisco|McKinney|Brownsville|Killeen|Midland|Odessa|Beaumont|Abilene|Round Rock|College Station",
      r: "Denton|Tyler|Wichita Falls|San Marcos|New Braunfels|Pasadena|Pearland|Sugar Land|The Woodlands|Conroe|Temple|Victoria|McAllen|Harlingen|Edinburg|Longview|Texarkana|San Angelo|Nacogdoches|Port Arthur|Kerrville|Fredericksburg",
      d: "Marfa|Terlingua|Luckenbach|Jefferson|Gruene|Alpine|Fort Davis|Big Spring|Del Rio|Eagle Pass|Uvalde|Crockett|Palestine|Mineral Wells|Shamrock|Dalhart|Pampa|Muleshoe|Dime Box",
      k: "Ding Dong::A real Texas town named after two shopkeepers called Bell." } },

    { id: "caribbean", q: "Name a Caribbean country or island", t: {
      p: "Jamaica|Cuba|Bahamas|Puerto Rico|Dominican Republic|Haiti",
      c: "Bermuda",
      s: "Barbados|Aruba|Trinidad and Tobago=trinidad|St. Lucia=saint lucia|Antigua|Grenada|Cayman Islands=cayman|Turks and Caicos|U.S. Virgin Islands=virgin islands|British Virgin Islands|Curacao|St. Kitts|Martinique|Guadeloupe|St. Barts|St. Martin=sint maarten",
      r: "Dominica|St. Vincent and the Grenadines=st vincent|Bonaire|Anguilla|Montserrat|Nevis|Tobago|Barbuda|St. Thomas|St. John|St. Croix|Vieques|Culebra|Grand Cayman|Isla Margarita|Roatan|Cozumel",
      d: "Sint Eustatius=statia|Marie-Galante|Les Saintes|Bequia|Mustique|Carriacou|Petit St. Vincent|Navassa|Isla de la Juventud|Andros|Eleuthera|Exuma|Inagua|San Salvador",
      k: "Saba::A volcano island with a road locals were told was impossible to build." } }
  ];

  root.CP = root.CP || {};
  root.CP.PROMPTS = (root.CP.PROMPTS || []).concat(PROMPTS);
})(typeof window !== "undefined" ? window : globalThis);
