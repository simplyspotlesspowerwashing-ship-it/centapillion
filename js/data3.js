/* Prompt pack 3: food and drink. Format as in data.js. */
(function (root) {
  var PROMPTS = [
    { id: "breakfast", q: "Name a breakfast food", t: {
      p: "Eggs=egg|Pancakes=pancake|Bacon|Cereal|Toast|Waffles=waffle",
      c: "Shakshuka|Eggs Benedict",
      s: "Oatmeal=porridge|French Toast|Sausage|Bagel|Yogurt=yoghurt|Muffin|Croissant|Hash Browns|Omelette=omelet|Granola|Fruit|Biscuits and Gravy|Breakfast Burrito|Avocado Toast|Smoothie|Grits|Doughnut=donut|Scrambled Eggs|English Muffin|Ham",
      r: "Huevos Rancheros|Chilaquiles|Crepes=crepe|Quiche|Frittata|Kippers|Black Pudding|Full English|Congee|Dosa|Idli|Poha|Muesli|Danish|Scones|Cinnamon Roll|Corned Beef Hash|Breakfast Sandwich|Scrapple|Johnnycake|Kedgeree|Natto|Tamagoyaki|Pain au Chocolat|Overnight Oats|Acai Bowl|Hotcakes|Toad in the Hole",
      d: "Menemen|Ful Medames|Laverbread|Bubble and Squeak|Pastel de Nata|Gallo Pinto|Mangu|Kaya Toast|Youtiao|Shengjianbao|Khao Tom|Pho|Paratha|Upma|Pesarattu|Chakchouka|Bircher|Bannock|Farl|Boxty|Migas|Arepa|Changua|Simit",
      k: "Ackee and Saltfish::Jamaica's national dish. Ackee is poisonous if picked unripe." } },

    { id: "pizzatopping", q: "Name a pizza topping", t: {
      p: "Pepperoni|Cheese|Mushrooms=mushroom|Sausage|Pineapple|Olives=olive",
      c: "Anchovies=anchovy|Ham and Pineapple",
      s: "Onions=onion|Peppers=green pepper=bell pepper|Bacon|Ham|Chicken|Jalapenos=jalapeno|Tomatoes=tomato|Spinach|Ground Beef=beef|Basil|Garlic|Mozzarella|Salami|Black Olives|BBQ Chicken|Meatballs",
      r: "Artichokes=artichoke|Sun-Dried Tomatoes|Feta|Prosciutto|Arugula=rocket|Goat Cheese|Ricotta|Capers|Banana Peppers|Red Onion|Corn|Egg|Broccoli|Eggplant=aubergine|Zucchini|Shrimp|Tuna|Pesto|Buffalo Chicken|Chorizo|Parmesan|Pickles",
      d: "Truffle|Burrata|Nduja|Soppressata|Speck|Gorgonzola|Fig|Pear|Potato|Clams|Calamari|Kimchi|Mac and Cheese|Lardons|Taleggio|Fennel Sausage|Caramelized Onion|Roasted Garlic|Squash Blossom",
      k: "Hot Honey::Chili-infused honey on pepperoni. It took over New York slices." } },

    { id: "dessert", q: "Name a dessert", t: {
      p: "Ice Cream|Cake|Brownie=brownies|Cookie=cookies|Pie|Cheesecake",
      c: "Baked Alaska|Creme Brulee",
      s: "Tiramisu|Apple Pie|Pudding|Cupcake|Donut=doughnut|Sundae|Milkshake|Fudge|Mousse|Cobbler|Banana Split|Macaron|Churros|Flan|Pavlova|Gelato|Panna Cotta|Trifle|Eclair|Carrot Cake|Red Velvet Cake|Key Lime Pie",
      r: "Baklava|Cannoli|Souffle|Profiteroles|Sticky Toffee Pudding|Tres Leches|Mochi|Crumble|Bread Pudding|Strudel|Sorbet|Semifreddo|Affogato|Clafoutis|Tarte Tatin|Gulab Jamun|Kheer|Rice Pudding|Black Forest Cake|Lemon Bars|Whoopie Pie|Bananas Foster|Eton Mess|Knafeh|Bundt Cake",
      d: "Kouign-Amann|Charlotte Russe|Croquembouche|Mille-Feuille|Paris-Brest|Opera Cake|Sachertorte|Dobos Torte|Kulfi|Halo-Halo|Bingsu|Dango|Brigadeiro|Alfajor|Malva Pudding|Koeksister|Syllabub|Cranachan|Bakewell Tart|Mont Blanc",
      k: "Spotted Dick=spotted dog::A steamed British pudding with currants and a famous name." } },

    { id: "candy", q: "Name a candy or chocolate bar", t: {
      p: "Snickers|M&M's=m and ms=mms|Reese's=reeses|Kit Kat=kitkat|Skittles|Twix",
      c: "Circus Peanuts|Necco Wafers",
      s: "Hershey's=hersheys|Milky Way|3 Musketeers=three musketeers|Starburst|Sour Patch Kids|Butterfinger|Twizzlers|Jolly Rancher|Tootsie Roll|Nerds|Gummy Bears|Swedish Fish|Laffy Taffy|Airheads|Hershey's Kisses=kisses|Milk Duds|Junior Mints|Whoppers|Almond Joy|Mounds|Baby Ruth|Jelly Beans|Candy Corn|Lollipop|Mars Bar=mars|Toblerone|Ferrero Rocher",
      r: "PayDay|Heath|Rolo|York Peppermint Pattie=york|Mr. Goodbar|Krackel|100 Grand|Whatchamacallit|Zagnut|Smarties|Sugar Babies|Mike and Ike|Hot Tamales|Red Vines|Dots|Good & Plenty|Charleston Chew|Bit-O-Honey|Cadbury Creme Egg|Crunchie|Flake|Wispa|Twirl|Aero|Lion Bar|Boost|Double Decker|Picnic|Caramello|Fruit Gushers",
      d: "Abba-Zaba|Chick-O-Stick|Big Hunk|Goo Goo Cluster|Mallo Cup|Clark Bar|Valomilk|Cherry Mash|Owl's Nest|Sky Bar|Turkish Taffy|Clark|Sugar Daddy|Squirrel Nut Zippers|Mary Jane|Boston Baked Beans|Atomic Fireball|Zero Bar|Look! Bar|Marathon|Wunderbar|Fry's Chocolate Cream",
      k: "Idaho Spud=idaho spud bar::A cocoa-marshmallow 'potato' rolled in coconut, made since 1918." } },

    { id: "sandwich", q: "Name a type of sandwich", t: {
      p: "BLT|Grilled Cheese|Peanut Butter and Jelly=pbj=pb&j|Club|Ham and Cheese|Turkey",
      c: "Fluffernutter|Croque Monsieur",
      s: "Reuben|Philly Cheesesteak=cheesesteak|Sub=submarine|Hoagie|Panini|Tuna Melt|Egg Salad|Chicken Salad|Meatball Sub|French Dip|Sloppy Joe|Pulled Pork|Gyro|Hamburger=burger|Hot Dog|Patty Melt|Wrap|Cuban|Po' Boy=po boy|Monte Cristo",
      r: "Banh Mi|Muffuletta|Cubano|Torta|Katsu Sando|Hot Brown|Beef on Weck|Italian Beef|Chopped Cheese|Bocadillo|Croque Madame|Smorrebrod|Chip Butty|Bacon Butty|Egg Mayo|Ploughman's|Cucumber Sandwich|Lobster Roll|Tramezzino|Pambazo|Shawarma|Falafel Wrap|Elvis Sandwich",
      d: "Francesinha|Chivito|Bauru|Mitraillette|Zapiekanka|Doner|Choripan|Lampredotto|Jambon-Beurre|Pan Bagnat|Spiedie|Horseshoe|Gatsby|Bunny Chow|Vada Pav|Kati Roll|Arepa|Pastrami on Rye|Barros Jarpa",
      k: "Fool's Gold Loaf=fools gold::A whole loaf filled with peanut butter, jelly and a pound of bacon." } },

    { id: "soup", q: "Name a soup", t: {
      p: "Chicken Noodle|Tomato|Clam Chowder=chowder|Minestrone|French Onion",
      c: "Gazpacho|Bird's Nest Soup",
      s: "Vegetable|Lentil|Split Pea|Potato Leek|Broccoli Cheddar|Ramen|Pho|Miso|Chili|Beef Stew=stew|Gumbo|Borscht|Wonton|Egg Drop|Hot and Sour|Butternut Squash|Mushroom|Chicken Tortilla|Bisque|Lobster Bisque|Matzo Ball",
      r: "Tom Yum|Tom Kha|Laksa|Mulligatawny|Pozole|Menudo|Avgolemono|Vichyssoise|Bouillabaisse|Cock-a-Leekie|Cullen Skink|Scotch Broth|Goulash|Ribollita|Pasta e Fagioli|Caldo Verde|Harira|Ajiaco|Sancocho|Callaloo|Udon|Bun Bo Hue|Solyanka|Shchi",
      d: "Sopa de Lima|Zurek|Okroshka|Kharcho|Pepperpot|Bird's Nest|Turtle Soup|Mock Turtle|Waterzooi|Erwtensoep|Fanesca|Chupe|Locro|Feijoada|Bak Kut Teh|Seolleongtang|Samgyetang|Yukgaejang|Soto",
      k: "Mohinga::Myanmar's catfish-and-rice-noodle breakfast soup." } },

    { id: "condiment", q: "Name a condiment or sauce", t: {
      p: "Ketchup|Mustard|Mayonnaise=mayo|Ranch|Hot Sauce|Barbecue Sauce=bbq sauce",
      c: "Sriracha|Marmite",
      s: "Soy Sauce|Relish|Salsa|Hummus|Guacamole|Pesto|Tartar Sauce|Honey Mustard|Teriyaki|Worcestershire|Tabasco|Horseradish|Vinegar|Buffalo Sauce|Thousand Island|Aioli|Gravy|Hollandaise|Alfredo|Marinara|Tzatziki|Chutney",
      r: "Hoisin|Fish Sauce|Oyster Sauce|Gochujang|Chimichurri|Harissa|Romesco|Tahini|Ponzu|Sambal|Piccalilli|Branston Pickle|HP Sauce=brown sauce|Vegemite|Remoulade|Bearnaise|Salsa Verde|Mole|Chipotle Mayo|Kewpie|Zhug|Peri-Peri=piri piri|Fry Sauce|Comeback Sauce",
      d: "Colatura|Nuoc Cham|XO Sauce|Doubanjiang|Furikake|Tkemali|Ajika|Mojo|Pebre|Chakalaka|Mostarda|Ketjap Manis|Toum|Muhammara|Shito|Pique|Banana Ketchup|Amba|Sauce Gribiche",
      k: "Garum=liquamen::Rome's fermented fish sauce, used like salt in almost everything." } },

    { id: "icecream", q: "Name an ice cream flavor", t: {
      p: "Vanilla|Chocolate|Strawberry|Mint Chocolate Chip=mint chip|Cookies and Cream|Rocky Road",
      c: "Neapolitan|Superman",
      s: "Cookie Dough|Butter Pecan|Coffee|Pistachio|Chocolate Chip|Salted Caramel|Moose Tracks|Birthday Cake|Rum Raisin|Cherry Garcia|Peanut Butter|Coconut|Mango|Lemon|French Vanilla|Black Cherry|Cotton Candy|Bubblegum",
      r: "Spumoni|Tutti Frutti|Butterscotch|Green Tea=matcha|Black Raspberry|Maple Walnut|Cinnamon|Dulce de Leche|Stracciatella|Hazelnut|Banana|Peach|Raspberry Ripple|Phish Food|Chunky Monkey|Half Baked|Lavender|Honeycomb|Fudge Ripple|Coffee Toffee",
      d: "Black Sesame|Ube|Taro|Durian|Red Bean|Earl Grey|Olive Oil|Goat Cheese|Sweet Corn|Avocado|Licorice|Rose|Saffron|Cardamom|Thai Tea|Horchata|Grape Nut|Teaberry|Malted Milk",
      k: "Blue Moon::Bright blue, Midwestern, and nobody agrees what it tastes like." } },

    { id: "coffee", q: "Name a coffee drink", t: {
      p: "Latte|Cappuccino|Espresso|Mocha|Americano",
      c: "Pumpkin Spice Latte=psl",
      s: "Macchiato|Flat White|Cold Brew|Iced Coffee|Frappuccino|Cortado|Black Coffee|Caramel Macchiato|Affogato|Irish Coffee|Drip Coffee|Red Eye|Decaf|Turkish Coffee|Vietnamese Iced Coffee",
      r: "Ristretto|Lungo|Doppio|Cafe au Lait|Cafe Con Leche|Cafe Cubano|Breve|Piccolo|Nitro Cold Brew|Dalgona|Long Black|Gibraltar|Frappe|Mazagran|Eiskaffee|Cafe de Olla|Bulletproof Coffee|Shakerato|Galao",
      d: "Kopi Luwak|Egg Coffee=ca phe trung|Yuenyeung|Bicerin|Marocchino|Carajillo|Cafe Bombon|Espresso Romano|Wiener Melange|Pharisaer|Einspanner|Cafe Touba|Qishr|Kopi Tubruk",
      k: "Kaffeost=coffee cheese::Finnish coffee poured over cubes of squeaky cheese." } },

    { id: "japanesefood", q: "Name a Japanese food", t: {
      p: "Sushi|Ramen|Tempura|Sashimi|Miso Soup",
      c: "Natto|Fugu",
      s: "Teriyaki|Udon|Soba|Edamame|Gyoza|Mochi|Onigiri|Tonkatsu|Yakitori|Katsu Curry|Bento|Wasabi|Takoyaki|Okonomiyaki|Matcha|Wagyu|Donburi|Sake",
      r: "Karaage|Yakisoba|Sukiyaki|Shabu-Shabu=shabu shabu|Unagi|Chawanmushi|Tamagoyaki|Katsudon|Oyakodon|Gyudon|Natto Rice|Dango|Taiyaki|Dorayaki|Nikujaga|Oden|Kare Raisu|Umeboshi|Tsukemono|Agedashi Tofu|Korokke|Omurice|Furikake",
      d: "Monjayaki|Chanko Nabe|Shirasu|Basashi|Uni|Ikura|Shiokara|Mentaiko|Hiyashi Chuka|Kakigori|Warabi Mochi|Yokan|Anmitsu|Zaru Soba|Kitsune Udon|Ochazuke|Inarizushi|Chikuwa|Hambagu",
      k: "Hoto::Thick, flat noodles stewed with pumpkin in Yamanashi miso." } },

    { id: "mexicanfood", q: "Name a Mexican food", t: {
      p: "Taco|Burrito|Quesadilla|Nachos|Enchilada",
      c: "Chimichanga|Mole",
      s: "Guacamole|Salsa|Fajitas|Tamale|Churro|Tostada|Chips and Salsa|Queso|Refried Beans|Elote|Tortilla|Carnitas|Al Pastor|Pozole|Menudo|Chile Relleno|Flautas|Taquitos|Sopes|Tres Leches|Horchata",
      r: "Chilaquiles|Huevos Rancheros|Barbacoa|Birria|Cochinita Pibil|Gordita|Huarache|Tlayuda|Pambazo|Torta|Enfrijoladas|Molletes|Esquites|Ceviche|Aguachile|Sope|Carne Asada|Chorizo|Tinga|Mole Poblano|Pico de Gallo|Pan Dulce|Concha",
      d: "Chapulines|Huitlacoche|Tejuino|Tepache|Atole|Champurrado|Cabrito|Machaca|Papadzules|Panuchos|Salbutes|Tlacoyo|Memela|Chalupa|Molote|Mixiote|Zacahuil|Capirotada|Jericalla",
      k: "Escamoles=insect caviar::Ant larvae, known as Mexico's insect caviar." } },

    { id: "italianfood", q: "Name an Italian dish", t: {
      p: "Pizza|Spaghetti|Lasagna=lasagne|Risotto|Ravioli",
      c: "Spaghetti Carbonara=carbonara|Cacio e Pepe",
      s: "Fettuccine Alfredo=alfredo|Bruschetta|Gnocchi|Tiramisu|Chicken Parmesan=chicken parm|Calzone|Minestrone|Caprese Salad=caprese|Osso Buco|Pesto Pasta|Gelato|Cannoli|Arancini|Focaccia|Polenta|Panna Cotta|Penne alla Vodka|Spaghetti Bolognese=bolognese|Eggplant Parmesan",
      r: "Saltimbocca|Vitello Tonnato|Carpaccio|Pasta alla Norma|Amatriciana|Puttanesca|Arrabbiata|Supplì|Ribollita|Panzanella|Porchetta|Piadina|Cotoletta|Bistecca alla Fiorentina|Burrata|Agnolotti|Pappardelle al Ragu|Frittata|Zabaglione|Affogato|Granita|Sfogliatella",
      d: "Vincisgrassi|Bagna Cauda|Lampredotto|Trippa alla Romana|Cima alla Genovese|Pansoti|Malloreddus|Pizzoccheri|Canederli|Pasta con le Sarde|Caponata|Torta Pasqualina|Farinata|Cecina|Cassoeula",
      k: "Casu Marzu=maggot cheese::A Sardinian cheese ripened by live maggots. Officially illegal." } },

    { id: "indianfood", q: "Name an Indian dish", t: {
      p: "Butter Chicken|Chicken Tikka Masala=tikka masala|Naan|Curry|Samosa",
      c: "Vindaloo|Phaal",
      s: "Biryani|Tandoori Chicken|Dal=daal=dhal|Palak Paneer|Chana Masala|Korma|Saag|Pakora|Aloo Gobi|Paneer Tikka|Rogan Josh|Masala Dosa=dosa|Roti|Chapati|Lassi|Raita|Gulab Jamun|Jalfrezi|Madras",
      r: "Malai Kofta|Dal Makhani|Chole Bhature|Pav Bhaji|Vada Pav|Idli|Uttapam|Rasam|Sambar|Kheer|Jalebi|Rasgulla|Kulfi|Bhindi Masala|Baingan Bharta|Keema|Nihari|Haleem|Dhokla|Pani Puri=golgappa|Bhel Puri|Pongal|Kadai Paneer",
      d: "Litti Chokha|Thukpa|Momos|Sarson da Saag|Laal Maas|Gatte ki Sabzi|Dal Baati|Appam|Puttu|Avial|Kosha Mangsho|Shorshe Ilish|Misal Pav|Sabudana Khichdi|Khandvi|Bisi Bele Bath|Chettinad|Goan Xacuti",
      k: "Undhiyu=undhiyo::A Gujarati winter dish once slow-cooked upside down in a buried clay pot." } },

    { id: "cookie", q: "Name a type of cookie", t: {
      p: "Chocolate Chip|Oatmeal Raisin|Sugar Cookie|Peanut Butter|Oreo",
      c: "Snickerdoodle|Macaron",
      s: "Shortbread|Gingerbread|Fortune Cookie|Biscotti|Macaroon|Snowball=russian tea cake|Thumbprint|White Chocolate Macadamia|Chocolate Crinkle|Fig Newton|Animal Crackers|Girl Scout Cookies|Thin Mints|Nilla Wafer|Graham Cracker|Molasses Cookie|Butter Cookie",
      r: "Madeleine|Linzer|Pizzelle|Amaretti|Rugelach|Spritz|Hamantaschen|Stroopwafel|Speculoos=biscoff|Lebkuchen|Pfeffernusse|Anzac Biscuit|Digestive|Jaffa Cake|Hobnob|Custard Cream|Bourbon|Florentine|Tuile|Black and White Cookie|Whoopie Pie|Alfajor|Polvoron|Mexican Wedding Cookie",
      d: "Springerle|Krumkake|Kourabiedes|Melomakarona|Ma'amoul|Kleicha|Ghraybeh|Ricciarelli|Cantucci|Brutti ma Buoni|Kipferl|Vanillekipferl|Zimtsterne|Speculaas|Garibaldi|Shrewsbury Biscuit|Jumble|Hermit",
      k: "Joe Frogger::A molasses-rum cookie from 1700s Massachusetts, named after a tavern keeper." } },

    { id: "fastfood", q: "Name a fast food chain", t: {
      p: "McDonald's=mcdonalds|Burger King|Wendy's=wendys|Taco Bell|KFC=kentucky fried chicken|Subway",
      c: "In-N-Out=in n out|Chick-fil-A=chick fil a",
      s: "Pizza Hut|Domino's=dominos|Chipotle|Popeyes|Arby's=arbys|Sonic|Dairy Queen|Jack in the Box|Five Guys|Panda Express|Papa John's|Little Caesars|Carl's Jr.|Hardee's|Whataburger|Shake Shack|Panera|Dunkin'=dunkin donuts|Starbucks|Wingstop|Del Taco",
      r: "White Castle|Culver's|Raising Cane's|Zaxby's|Bojangles|Church's|Checkers|Rally's|Krystal|El Pollo Loco|Long John Silver's|Steak 'n Shake|Jersey Mike's|Jimmy John's|Firehouse Subs|Qdoba|Moe's|Freddy's|Smashburger|Nando's|Greggs|Tim Hortons|A&W|Quiznos|Blimpie",
      d: "Burgerville|Runza|Taco John's|Taco Time|Krispy Kreme|Wienerschnitzel|Nathan's|Cook Out|Lee's Famous Recipe|Roy Rogers|Teddy's Bigger Burgers|Jollibee|Mos Burger|Hesburger|Max Burgers|Harvey's|Mary Brown's",
      k: "Pal's Sudden Service::A Tennessee chain with giant burgers and hot dogs on its roofs." } },

    { id: "soda", q: "Name a soda or soft drink", t: {
      p: "Coca-Cola=coke|Pepsi|Sprite|Dr Pepper|Mountain Dew|Fanta",
      c: "Moxie|Tab",
      s: "7 Up=seven up|Root Beer|Ginger Ale|Diet Coke|Coke Zero|A&W|Canada Dry|Sunkist|Crush|Mug|Barq's|Schweppes|Fresca|Sierra Mist|Starry|Cream Soda|Orange Soda|Club Soda|Tonic Water|Red Bull|Monster",
      r: "Mello Yello|Big Red|RC Cola|Faygo|Jones Soda|Squirt|Vernors|Surge|Crystal Pepsi|Pepsi Blue|Irn-Bru=irn bru|Ting|Inca Kola|Guarana Antarctica|Jarritos|Lilt|Tango|Vimto|Lucozade|Orangina|Sarsaparilla|Birch Beer|Cheerwine|Sun Drop",
      d: "Kickapoo Joy Juice|Mr. Pibb|Pibb Xtra|Bubble Up|Frostie|Dad's|Grapico|Double Cola|Nehi|Postobon|Kola Champagne|Kvass|Tarkhuna|Mirinda|Mezzo Mix|Almdudler|Apollinaris|Ramune|Calpis",
      k: "Ale-8-One=ale 8::Kentucky's ginger-citrus soda, a pun on 'a late one'." } },

    { id: "cereal", q: "Name a breakfast cereal", t: {
      p: "Cheerios|Frosted Flakes|Froot Loops=fruit loops|Lucky Charms|Cinnamon Toast Crunch|Corn Flakes",
      c: "Grape-Nuts=grape nuts",
      s: "Rice Krispies|Cap'n Crunch=captain crunch|Cocoa Puffs|Raisin Bran|Special K|Honey Nut Cheerios|Trix|Apple Jacks|Fruity Pebbles|Cocoa Pebbles|Honey Bunches of Oats|Frosted Mini-Wheats|Chex|Kix|Golden Grahams|Corn Pops|Count Chocula|Life|Reese's Puffs|Cookie Crisp",
      r: "Wheaties|Shredded Wheat|Weetabix|Crunchy Nut|Coco Pops|Honey Smacks|Smacks|Cracklin' Oat Bran|Cinnamon Life|Rice Chex|Franken Berry|Boo Berry|Waffle Crisp|Oreo O's|French Toast Crunch|Honeycomb|Alpha-Bits|Quisp|Basic 4|Total|Kashi|Muesli|Granola",
      d: "Mr. T Cereal|Nerds Cereal|Ice Cream Cones Cereal|Freakies|Fruit Brute|Yummy Mummy|Sir Grapefellow|Pac-Man Cereal|Smurf-Berry Crunch|C-3PO's|Kaboom|Body Buddies|OJ's|Buc Wheats|Crispy Critters|King Vitaman",
      k: "Urkel-Os::A 1991 cereal tie-in for the Family Matters nerd Steve Urkel." } },

    { id: "salad", q: "Name a type of salad", t: {
      p: "Caesar|Garden Salad|Greek Salad|Cobb|Potato Salad",
      c: "Waldorf|Jell-O Salad",
      s: "Chef Salad|Pasta Salad|Caprese|Coleslaw|Egg Salad|Chicken Salad|Tuna Salad|Macaroni Salad|Fruit Salad|Wedge|Spinach Salad|Taco Salad|Kale Salad|House Salad|Cucumber Salad|Quinoa Salad",
      r: "Nicoise|Tabbouleh|Fattoush|Panzanella|Som Tam=papaya salad|Larb|Ambrosia|Three Bean Salad|Seven Layer Salad|Watergate Salad|Olivier Salad=russian salad|Kachumber|Shirazi Salad|Insalata Caprese|Mesclun|Chopped Salad|Cucumber Wakame|Seaweed Salad|Broccoli Salad",
      d: "Gado-Gado|Rojak|Herring Under a Fur Coat=shuba|Vinegret|Lobio|Kisir|Piyaz|Horiatiki|Salade Lyonnaise|Insalata di Rinforzo|Ensalada Rusa|Pico de Gallo Salad|Yam Woon Sen|Goi Cuon|Snickers Salad|Frog Eye Salad",
      k: "Laphet Thoke=tea leaf salad::Myanmar's salad of fermented tea leaves and crunchy beans." } },

    { id: "potato", q: "Name a potato dish", t: {
      p: "French Fries=fries|Mashed Potatoes=mash|Baked Potato|Hash Browns|Potato Chips=crisps",
      c: "Poutine|Tater Tots",
      s: "Potato Salad|Scalloped Potatoes|Potatoes au Gratin=au gratin|Roast Potatoes|Potato Skins|Home Fries|Twice-Baked Potatoes|Curly Fries|Wedges|Latkes|Gnocchi|Shepherd's Pie|Potato Soup|Pierogi",
      r: "Rosti|Patatas Bravas|Duchess Potatoes|Hasselback Potatoes|Pommes Anna|Dauphinoise|Colcannon|Champ|Boxty|Aloo Gobi|Aloo Paratha|Tortilla Espanola=spanish omelette|Bubble and Squeak|Croquettes|Smashed Potatoes|Jacket Potato|Chips",
      d: "Tartiflette|Raclette|Kartoffelkloesse|Kugel|Papa a la Huancaina|Causa|Llapingacho|Rumbledethumps|Stamppot|Kroppkakor|Cepelinai|Draniki|Pommes Souffles|Truffade|Hutspot|Pyttipanna",
      k: "Aligot::Mashed potato beaten with so much cheese it stretches a metre." } },

    { id: "tea", q: "Name a type of tea", t: {
      p: "Green Tea|Black Tea|Earl Grey|Chamomile|Peppermint=mint tea",
      c: "Matcha|Kombucha",
      s: "Oolong|White Tea|Chai|English Breakfast|Jasmine|Rooibos|Hibiscus|Iced Tea|Sweet Tea|Bubble Tea=boba|Lemon Tea|Ginger Tea|Darjeeling|Assam|Herbal Tea|Masala Chai",
      r: "Pu-erh=puerh|Sencha|Genmaicha|Hojicha|Lapsang Souchong|Ceylon|Yerba Mate=mate|Lady Grey|Irish Breakfast|Gunpowder|Keemun|Tie Guan Yin|Longjing=dragonwell|Silver Needle|Rooibos Chai|Thai Tea|Milk Tea|Turmeric Latte|Barley Tea",
      d: "Gyokuro|Kukicha|Bancha|Da Hong Pao|Bai Mudan|Huangshan Maofeng|Butter Tea=po cha|Yellow Tea|Kuding|Guayusa|Honeybush|Tulsi|Rooibos Honeybush|Lemon Verbena|Sobacha|Yuja Cha|Teh Tarik",
      k: "Noon Chai=kashmiri pink tea::Kashmir's pink tea, made with salt and baking soda." } },

    { id: "beer", q: "Name a style of beer", t: {
      p: "Lager|IPA|Stout|Pilsner|Ale",
      c: "Light Beer|Sour",
      s: "Pale Ale|Porter|Wheat Beer|Hefeweizen|Amber Ale|Brown Ale|Blonde Ale|Bock|Red Ale|Double IPA|Hazy IPA|Belgian Wit=witbier|Cream Ale|Kolsch|Saison|Oktoberfest=marzen",
      r: "Dunkel|Doppelbock|Tripel|Dubbel|Quadrupel|Lambic|Gose|Berliner Weisse|Barleywine|Scotch Ale|Imperial Stout|Milk Stout|Oatmeal Stout|Schwarzbier|Rauchbier|Altbier|Vienna Lager|Helles|Bitter|Mild|ESB|Gueuze|Flanders Red",
      d: "Gruit|Kvass|Grodziskie|Lichtenhainer|Kellerbier|Zwickelbier|Eisbock|Weizenbock|Steinbier|Kentucky Common|California Common=steam beer|Braggot|Chicha|Oud Bruin|Faro|Kriek|Framboise|Bière de Garde|Tafelbier",
      k: "Sahti::A Finnish farmhouse ale filtered through juniper branches." } },

    { id: "dumpling", q: "Name a type of dumpling", t: {
      p: "Gyoza|Wonton|Pierogi|Dim Sum|Potsticker",
      c: "Xiaolongbao=soup dumpling",
      s: "Ravioli|Momo|Dumpling|Bao|Siu Mai=shumai|Har Gow|Empanada|Samosa|Matzo Ball|Gnocchi|Mandu|Tortellini|Pelmeni|Jiaozi",
      r: "Khinkali|Manti|Vareniki|Knish|Knodel|Spaetzle|Gulab Jamun|Modak|Kreplach|Wontons in Chili Oil|Har Kau|Char Siu Bao|Tangyuan|Zongzi|Pastel|Coxinha|Kroppkaka|Pitepalt",
      d: "Khachapuri|Chuchvara|Buuz|Khuushuur|Bansh|Joshpara|Tortelli|Klecki|Kopytka|Halusky|Germknodel|Marillenknodel|Pyzy|Kluski|Dushbara|Kalduny",
      k: "Culurgiones::Sardinian dumplings pinched shut to look like ears of wheat." } }
  ];

  root.CP = root.CP || {};
  root.CP.PROMPTS = (root.CP.PROMPTS || []).concat(PROMPTS);
})(typeof window !== "undefined" ? window : globalThis);
