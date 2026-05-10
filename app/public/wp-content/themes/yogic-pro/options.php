<?php         
/**
 * A unique identifier is defined to store the options in the database and reference them from the theme.
 * By default it uses the theme name, in lowercase and without spaces, but this can be changed if needed.
 * If the identifier changes, it'll appear as if the options have been reset.
 */ 

function optionsframework_option_name() {
	// Change this to use your theme slug
	$themename = wp_get_theme();
	$themename = preg_replace("/\W/", "_", strtolower($themename) );
	return $themename;
}

/**
 * Defines an array of options that will be used to generate the settings page and be saved in the database.
 * When creating the 'id' fields, make sure to use all lowercase and no spaces.
 *
 * If you are making your theme translatable, you should replace 'yogic-pro'
 * with the actual text domain for your theme.  Read more:
 * http://codex.wordpress.org/Function_Reference/load_theme_textdomain
*/

function optionsframework_options() {
	//array of all custom font types.
	$font_types = array( '' => '',
    'ABeeZee' => 'ABeeZee',
    'Abel' => 'Abel',
    'Abril Fatface' => 'Abril Fatface',
    'Aclonica' => 'Aclonica',
    'Acme' => 'Acme',
    'Actor' => 'Actor',
    'Adamina' => 'Adamina',
    'Advent Pro' => 'Advent Pro',
    'Aguafina Script' => 'Aguafina Script',
    'Akronim' => 'Akronim',
    'Aladin' => 'Aladin',
    'Aldrich' => 'Aldrich',
    'Alegreya' => 'Alegreya',
    'Alegreya Sans SC' => 'Alegreya Sans SC',
    'Alegreya SC' => 'Alegreya SC',
    'Alex Brush' => 'Alex Brush',
    'Alef' => 'Alef',
    'Alfa Slab One' => 'Alfa Slab One',
    'Alice' => 'Alice',
    'Alike' => 'Alike',
    'Alike Angular' => 'Alike Angular',
    'Allan' => 'Allan',
    'Allerta' => 'Allerta',
    'Allerta Stencil' => 'Allerta Stencil',
    'Allura' => 'Allura',
    'Almendra' => 'Almendra',
    'Almendra Display' => 'Almendra Display',
    'Almendra SC' => 'Almendra SC',
    'Amiri' => 'Amiri',
    'Amarante' => 'Amarante',
    'Amaranth' => 'Amaranth',
    'Amatic SC' => 'Amatic SC',
    'Amethysta' => 'Amethysta',
    'Amita' => 'Amita',
    'Anaheim' => 'Anaheim',
    'Andada' => 'Andada',
    'Andika' => 'Andika',
    'Annie Use Your Telescope' => 'Annie Use Your Telescope',
    'Anonymous Pro' => 'Anonymous Pro',
    'Antic' => 'Antic',
    'Antic Didone' => 'Antic Didone',
    'Antic Slab' => 'Antic Slab',
    'Anton' => 'Anton',
    'Angkor' => 'Angkor',
    'Arapey' => 'Arapey',
    'Arbutus' => 'Arbutus',
    'Arbutus Slab' => 'Arbutus Slab',
    'Architects Daughter' => 'Architects Daughter',
    'Archivo White' => 'Archivo White',
    'Archivo Narrow' => 'Archivo Narrow',
    'Arial' => 'Arial',
    'Arimo' => 'Arimo',
    'Arya' => 'Arya',
    'Arizonia' => 'Arizonia',
    'Armata' => 'Armata',
    'Artifika' => 'Artifika',
    'Arvo' => 'Arvo',
    'Asar' => 'Asar',
    'Asap' => 'Asap',
    'Asset' => 'Asset',
	'Assistant' => 'Assistant',
    'Astloch' => 'Astloch',
    'Asul' => 'Asul',
    'Atomic Age' => 'Atomic Age',
    'Aubrey' => 'Aubrey',
    'Audiowide' => 'Audiowide',
    'Autour One' => 'Autour One',
    'Average' => 'Average',
    'Average Sans' => 'Average Sans',
    'Averia Gruesa Libre' => 'Averia Gruesa Libre',
    'Averia Libre' => 'Averia Libre',
    'Averia Sans Libre' => 'Averia Sans Libre',
    'Averia Serif Libre' => 'Averia Serif Libre',
    'Battambang' => 'Battambang',
    'Bad Script' => 'Bad Script',
    'Bayon' => 'Bayon',
    'Balthazar' => 'Balthazar',
    'Bangers' => 'Bangers',
    'Basic' => 'Basic',
    'Baumans' => 'Baumans',
    'Belgrano' => 'Belgrano',
    'Belleza' => 'Belleza',
    'BenchNine' => 'BenchNine',
    'Bentham' => 'Bentham',
    'Berkshire Swash' => 'Berkshire Swash',
    'Bevan' => 'Bevan',
    'Bigelow Rules' => 'Bigelow Rules',
    'Bigshot One' => 'Bigshot One',
    'Bilbo' => 'Bilbo',
    'Bilbo Swash Caps' => 'Bilbo Swash Caps',
    'Biryani' => 'Biryani',
    'Bitter' => 'Bitter',
    'Black Ops One' => 'Black Ops One',
    'Bokor' => 'Bokor',
    'Bonbon' => 'Bonbon',
    'Boogaloo' => 'Boogaloo',
    'Bowlby One' => 'Bowlby One',
    'Bowlby One SC' => 'Bowlby One SC',
    'Brawler' => 'Brawler',
    'Bree Serif' => 'Bree Serif',
    'Bubblegum Sans' => 'Bubblegum Sans',
    'Bubbler One' => 'Bubbler One',
    'Buda' => 'Buda',
    'Buenard' => 'Buenard',
    'Butcherman' => 'Butcherman',
    'Butcherman Caps' => 'Butcherman Caps',
    'Butterfly Kids' => 'Butterfly Kids',
    'Cabin' => 'Cabin',
    'Cabin Condensed' => 'Cabin Condensed',
    'Cabin Sketch' => 'Cabin Sketch',
    'Cabin' => 'Cabin',
    'Caesar Dressing' => 'Caesar Dressing',
    'Cagliostro' => 'Cagliostro',
    'Calligraffitti' => 'Calligraffitti',
    'Cambay' => 'Cambay',
    'Cambo' => 'Cambo',
    'Candal' => 'Candal',
    'Cantarell' => 'Cantarell',
    'Cantata One' => 'Cantata One',
    'Cantora One' => 'Cantora One',
    'Capriola' => 'Capriola',
    'Cardo' => 'Cardo',
    'Carme' => 'Carme',
    'Carrois Gothic' => 'Carrois Gothic',
    'Carrois Gothic SC' => 'Carrois Gothic SC',
    'Carter One' => 'Carter One',
    'Caveat' => 'Caveat',
    'Caveat Brush' => 'Caveat Brush',
    'Catamaran' => 'Catamaran',
    'Caudex' => 'Caudex',
    'Cedarville Cursive' => 'Cedarville Cursive',
    'Ceviche One' => 'Ceviche One',
    'Changa One' => 'Changa One',
    'Chango' => 'Chango',
    'Chau Philomene One' => 'Chau Philomene One',
    'Chenla' => 'Chenla',
    'Chela One' => 'Chela One',
    'Chelsea Market' => 'Chelsea Market',
    'Cherry Cream Soda' => 'Cherry Cream Soda',
    'Cherry Swash' => 'Cherry Swash',
    'Chewy' => 'Chewy',
    'Chicle' => 'Chicle',
    'Chivo' => 'Chivo',
    'Chonburi' => 'Chonburi',
    'Cinzel' => 'Cinzel',
    'Cinzel Decorative' => 'Cinzel Decorative',
    'Clicker Script' => 'Clicker Script',
    'Coda' => 'Coda',
    'Codystar' => 'Codystar',
    'Combo' => 'Combo',
    'Comfortaa' => 'Comfortaa',
    'Coming Soon' => 'Coming Soon',
    'Condiment' => 'Condiment',
    'Content' => 'Content',
    'Contrail One' => 'Contrail One',
    'Convergence' => 'Convergence',
    'Cookie' => 'Cookie',
    'Comic Sans MS' => 'Comic Sans MS',
    'Copse' => 'Copse',
    'Corben' => 'Corben',
    'Courgette' => 'Courgette',
    'Cousine' => 'Cousine',
    'Coustard' => 'Coustard',
    'Covered By Your Grace' => 'Covered By Your Grace',
    'Crafty Girls' => 'Crafty Girls',
    'Creepster' => 'Creepster',
    'Creepster Caps' => 'Creepster Caps',
    'Crete Round' => 'Crete Round',
    'Crimson' => 'Crimson',
    'Croissant One' => 'Croissant One',
    'Crushed' => 'Crushed',
    'Cuprum' => 'Cuprum',
    'Cutive' => 'Cutive',
    'Cutive Mono' => 'Cutive Mono',
    'Damion' => 'Damion',
    'Dangrek' => 'Dangrek',
    'Dancing Script' => 'Dancing Script',
    'Dawning of a New Day' => 'Dawning of a New Day',
    'Days One' => 'Days One',
    'Dekko' => 'Dekko',
    'Delius' => 'Delius',
    'Delius Swash Caps' => 'Delius Swash Caps',
    'Delius Unicase' => 'Delius Unicase',
    'Della Respira' => 'Della Respira',
    'Denk One' => 'Denk One',
    'Devonshire' => 'Devonshire',
    'Dhurjati' => 'Dhurjati',
    'Didact Gothic' => 'Didact Gothic',
    'Diplomata' => 'Diplomata',
    'Diplomata SC' => 'Diplomata SC',
    'Domine' => 'Domine',
    'Donegal One' => 'Donegal One',
    'Doppio One' => 'Doppio One',
    'Dorsa' => 'Dorsa',
    'Dosis' => 'Dosis',
    'Dr Sugiyama' => 'Dr Sugiyama',
    'Droid Sans' => 'Droid Sans',
    'Droid Sans Mono' => 'Droid Sans Mono',
    'Droid Serif' => 'Droid Serif',
    'Duru Sans' => 'Duru Sans',
    'Dynalight' => 'Dynalight',
    'EB Garamond' => 'EB Garamond',
    'Eczar' => 'Eczar',
    'Eagle Lake' => 'Eagle Lake',
    'Eater' => 'Eater',
    'Eater Caps' => 'Eater Caps',
    'Economica' => 'Economica',
    'Ek Mukta' => 'Ek Mukta',
    'Electrolize' => 'Electrolize',
    'Elsie' => 'Elsie',
    'Elsie Swash Caps' => 'Elsie Swash Caps',
    'Emblema One' => 'Emblema One',
    'Emilys Candy' => 'Emilys Candy',
    'Engagement' => 'Engagement',
    'Englebert' => 'Englebert',
    'Enriqueta' => 'Enriqueta',
    'Erica One' => 'Erica One',
    'Esteban' => 'Esteban',
    'Euphoria Script' => 'Euphoria Script',
    'Ewert' => 'Ewert',
    'Exo' => 'Exo',
    'Exo 2' => 'Exo 2',
    'Expletus Sans' => 'Expletus Sans',
    'Fanwood Text' => 'Fanwood Text',
    'Fascinate' => 'Fascinate',
    'Fascinate Inline' => 'Fascinate Inline',
    'Fasthand' => 'Fasthand',
    'Faster One' => 'Faster One',
    'Federant' => 'Federant',
    'Federo' => 'Federo',
    'Felipa' => 'Felipa',
    'Fenix' => 'Fenix',
    'Finger Paint' => 'Finger Paint',
    'Fira Mono' => 'Fira Mono',
    'Fira Sans' => 'Fira Sans',
    'Fjalla One' => 'Fjalla One',
    'Fjord One' => 'Fjord One',
    'Flamenco' => 'Flamenco',
    'Flavors' => 'Flavors',
    'Fondamento' => 'Fondamento',
    'Fontdiner Swanky' => 'Fontdiner Swanky',
    'Forum' => 'Forum',
    'Francois One' => 'Francois One',
    'FreeSans' => 'FreeSans',
    'Freckle Face' => 'Freckle Face',
    'Fredericka the Great' => 'Fredericka the Great',
    'Fredoka One' => 'Fredoka One',
    'Fresca' => 'Fresca',
    'Freehand' => 'Freehand',
    'Frijole' => 'Frijole',
    'Fruktur' => 'Fruktur',
    'Fugaz One' => 'Fugaz One',
    'Gafata' => 'Gafata',
    'Galdeano' => 'Galdeano',
    'Galindo' => 'Galindo',
    'Gentium Basic' => 'Gentium Basic',
    'Gentium Book Basic' => 'Gentium Book Basic',
    'Geo' => 'Geo',
    'Georgia' => 'Georgia',
    'Geostar' => 'Geostar',
    'Geostar Fill' => 'Geostar Fill',
    'Germania One' => 'Germania One',
    'Gilda Display' => 'Gilda Display',
    'Give You Glory' => 'Give You Glory',
    'Glass Antiqua' => 'Glass Antiqua',
    'Glegoo' => 'Glegoo',
    'Gloria Hallelujah' => 'Gloria Hallelujah',
    'Goblin One' => 'Goblin One',
    'Gochi Hand' => 'Gochi Hand',
    'Gorditas' => 'Gorditas',
    'Gurajada' => 'Gurajada',
    'Goudy Bookletter 1911' => 'Goudy Bookletter 1911',
    'Graduate' => 'Graduate',
    'Grand Hotel' => 'Grand Hotel',
    'Gravitas One' => 'Gravitas One',
    'Great Vibes' => 'Great Vibes',
    'Griffy' => 'Griffy',
    'Gruppo' => 'Gruppo',
    'Gudea' => 'Gudea',
    'Gidugu' => 'Gidugu',
    'GFS Didot' => 'GFS Didot',
    'GFS Neohellenic' => 'GFS Neohellenic',
    'Habibi' => 'Habibi',
    'Hammersmith One' => 'Hammersmith One',
    'Halant' => 'Halant',
    'Hanalei' => 'Hanalei',
    'Hanalei Fill' => 'Hanalei Fill',
    'Handlee' => 'Handlee',
    'Hanuman' => 'Hanuman',
    'Happy Monkey' => 'Happy Monkey',
    'Headland One' => 'Headland One',
    'Henny Penny' => 'Henny Penny',
    'Herr Von Muellerhoff' => 'Herr Von Muellerhoff',
    'Hind' => 'Hind',
    'Hind Siliguri' => 'Hind Siliguri',
    'Hind Vadodara' => 'Hind Vadodara',
    'Holtwood One SC' => 'Holtwood One SC',
    'Homemade Apple' => 'Homemade Apple',
    'Homenaje' => 'Homenaje',
    'IM Fell' => 'IM Fell',
    'Itim' => 'Itim',
    'Iceberg' => 'Iceberg',
    'Iceland' => 'Iceland',
    'Imprima' => 'Imprima',
    'Inconsolata' => 'Inconsolata',
    'Inder' => 'Inder',
    'Indie Flower' => 'Indie Flower',
    'Inknut Antiqua' => 'Inknut Antiqua',
    'Inika' => 'Inika',
    'Irish Growler' => 'Irish Growler',
    'Istok Web' => 'Istok Web',
    'Italiana' => 'Italiana',
    'Italianno' => 'Italianno',
    'Jacques Francois' => 'Jacques Francois',
    'Jacques Francois Shadow' => 'Jacques Francois Shadow',
    'Jim Nightshade' => 'Jim Nightshade',
    'Jockey One' => 'Jockey One',
    'Jaldi' => 'Jaldi',
    'Jolly Lodger' => 'Jolly Lodger',
    'Josefin Sans' => 'Josefin Sans',
    'Josefin Sans' => 'Josefin Sans',
    'Josefin Slab' => 'Josefin Slab',
    'Joti One' => 'Joti One',
    'Judson' => 'Judson',
    'Julee' => 'Julee',
    'Julius Sans One' => 'Julius Sans One',
    'Junge' => 'Junge',
    'Jura' => 'Jura',
    'Just Another Hand' => 'Just Another Hand',
    'Just Me Again Down Here' => 'Just Me Again Down Here',
    'Kadwa' => 'Kadwa',
    'Kdam Thmor' => 'Kdam Thmor',
    'Kalam' => 'Kalam', 
    'Kameron' => 'Kameron',
    'Kantumruy' => 'Kantumruy',
    'Karma' => 'Karma',
    'Karla' => 'Karla',
    'Kaushan Script' => 'Kaushan Script',
    'Kavoon' => 'Kavoon',
    'Keania One' => 'Keania One',
    'Kelly Slab' => 'Kelly Slab',
    'Kenia' => 'Kenia',
    'Khand' => 'Khand',
    'Khmer' => 'Khmer',
    'Khula' => 'Khula',
    'Kite One' => 'Kite One',
    'Knewave' => 'Knewave',
    'Kotta One' => 'Kotta One',
    'Kranky' => 'Kranky',
    'Kreon' => 'Kreon',
    'Kristi' => 'Kristi',
    'Koulen' => 'Koulen',
    'Krona One' => 'Krona One',
    'Kurale' => 'Kurale',
    'Lakki Reddy' => 'Lakki Reddy',
    'La Belle Aurore' => 'La Belle Aurore',
    'Lancelot' => 'Lancelot',
    'Laila' => 'Laila',
    'Lato' => 'Lato',
    'Lateef' => 'Lateef',
    'League Script' => 'League Script',
    'Leckerli One' => 'Leckerli One',
    'Ledger' => 'Ledger',
    'Lekton' => 'Lekton',
    'Lemon' => 'Lemon',
    'Libre Baskerville' => 'Libre Baskerville',
    'Life Savers' => 'Life Savers',
    'Lilita One' => 'Lilita One',
    'Limelight' => 'Limelight',
    'Linden Hill' => 'Linden Hill',
    'Lobster' => 'Lobster',
    'Lobster Two' => 'Lobster Two',
    'Londrina Outline' => 'Londrina Outline',
    'Londrina Shadow' => 'Londrina Shadow',
    'Londrina Sketch' => 'Londrina Sketch',
    'Londrina Solid' => 'Londrina Solid',
    'Lora' => 'Lora',
    'Love Ya Like A Sister' => 'Love Ya Like A Sister',
    'Loved by the King' => 'Loved by the King',
    'Lovers Quarrel' => 'Lovers Quarrel',
    'Lucida Sans Unicode' => 'Lucida Sans Unicode',
    'Luckiest Guy' => 'Luckiest Guy',
    'Lusitana' => 'Lusitana',
    'Lustria' => 'Lustria',
    'Macondo' => 'Macondo',
    'Macondo Swash Caps' => 'Macondo Swash Caps',
    'Magra' => 'Magra',
    'Maiden Orange' => 'Maiden Orange',
    'Mallanna' => 'Mallanna',
    'Mandali' => 'Mandali',
    'Mako' => 'Mako',
    'Marcellus' => 'Marcellus',
    'Marcellus SC' => 'Marcellus SC',
    'Marck Script' => 'Marck Script',
    'Margarine' => 'Margarine',
    'Marko One' => 'Marko One',
    'Marmelad' => 'Marmelad',
    'Marvel' => 'Marvel',
    'Martel' => 'Martel',
    'Martel Sans' => 'Martel Sans',
    'Mate' => 'Mate',
    'Mate SC' => 'Mate SC',
    'Maven Pro' => 'Maven Pro',
    'McLaren' => 'McLaren',
    'Meddon' => 'Meddon',
    'MedievalSharp' => 'MedievalSharp',
    'Medula One' => 'Medula One',
    'Megrim' => 'Megrim',
    'Meie Script' => 'Meie Script',
    'Merienda' => 'Merienda',
    'Merienda One' => 'Merienda One',
    'Merriweather' => 'Merriweather',
    'Metal' => 'Metal',
    'Metal Mania' => 'Metal Mania',
    'Metamorphous' => 'Metamorphous',
    'Metrophobic' => 'Metrophobic',
    'Michroma' => 'Michroma',
    'Milonga' => 'Milonga',
    'Miltonian' => 'Miltonian',
    'Miltonian Tattoo' => 'Miltonian Tattoo',
    'Miniver' => 'Miniver',
    'Miss Fajardose' => 'Miss Fajardose',
    'Miss Saint Delafield' => 'Miss Saint Delafield',
    'Modak' => 'Modak',
    'Modern Antiqua' => 'Modern Antiqua',
    'Molengo' => 'Molengo',
    'Molle' => 'Molle',
    'Moulpali' => 'Moulpali',
    'Monda' => 'Monda',
    'Monofett' => 'Monofett',
    'Monoton' => 'Monoton',
    'Monsieur La Doulaise' => 'Monsieur La Doulaise',
    'Montaga' => 'Montaga',
    'Montez' => 'Montez',
    'Montserrat' => 'Montserrat',
    'Montserrat Alternates' => 'Montserrat Alternates',
    'Montserrat Subrayada' => 'Montserrat Subrayada',
    'Mountains of Christmas' => 'Mountains of Christmas',
    'Mouse Memoirs' => 'Mouse Memoirs',
    'Moul' => 'Moul',
    'Mr Bedford' => 'Mr Bedford',
    'Mr Bedfort' => 'Mr Bedfort',
    'Mr Dafoe' => 'Mr Dafoe',
    'Mr De Haviland' => 'Mr De Haviland',
    'Mrs Saint Delafield' => 'Mrs Saint Delafield',
    'Mrs Sheppards' => 'Mrs Sheppards',
    'Muli' => 'Muli',
    'Mystery Quest' => 'Mystery Quest',
    'Neucha' => 'Neucha',
    'Neuton' => 'Neuton',
    'New Rocker' => 'New Rocker',
    'News Cycle' => 'News Cycle',
    'Niconne' => 'Niconne',
    'Nixie One' => 'Nixie One',
    'Nobile' => 'Nobile',
    'Nokora' => 'Nokora',
    'Norican' => 'Norican',
    'Nosifer' => 'Nosifer',
    'Nosifer Caps' => 'Nosifer Caps',
    'Nova Mono' => 'Nova Mono',
    'Noticia Text' => 'Noticia Text',
    'Noto Sans' => 'Noto Sans',
    'Noto Serif' => 'Noto Serif',
    'Nova Round' => 'Nova Round',
    'Numans' => 'Numans',
    'Nunito' => 'Nunito',
    'NTR' => 'NTR',
    'Offside' => 'Offside',
    'Oldenburg' => 'Oldenburg',
    'Oleo Script' => 'Oleo Script',
    'Oleo Script Swash Caps' => 'Oleo Script Swash Caps',
    'Open Sans' => 'Open Sans',
    'Open Sans Condensed' => 'Open Sans Condensed',
    'Oranienbaum' => 'Oranienbaum',
    'Orbitron' => 'Orbitron',
    'Odor Mean Chey' => 'Odor Mean Chey',
    'Oregano' => 'Oregano',
    'Orienta' => 'Orienta',
    'Original Surfer' => 'Original Surfer',
    'Oswald' => 'Oswald',
    'Over the Rainbow' => 'Over the Rainbow',
    'Overlock' => 'Overlock',
    'Overlock SC' => 'Overlock SC',
    'Ovo' => 'Ovo',
    'Oxygen' => 'Oxygen',
    'Oxygen Mono' => 'Oxygen Mono',
    'Palanquin Dark' => 'Palanquin Dark',
    'Peddana' => 'Peddana',
    'Poppins' => 'Poppins',
    'PT Mono' => 'PT Mono',
    'PT Sans' => 'PT Sans',
    'PT Sans Caption' => 'PT Sans Caption',
    'PT Sans Narrow' => 'PT Sans Narrow',
    'PT Serif' => 'PT Serif',
    'PT Serif Caption' => 'PT Serif Caption',
    'Pacifico' => 'Pacifico',
    'Paprika' => 'Paprika',
    'Parisienne' => 'Parisienne',
    'Passero One' => 'Passero One',
    'Passion One' => 'Passion One',
    'Patrick Hand' => 'Patrick Hand',
    'Patrick Hand SC' => 'Patrick Hand SC',
    'Patua One' => 'Patua One',
    'Paytone One' => 'Paytone One',
    'Peralta' => 'Peralta',
    'Permanent Marker' => 'Permanent Marker',
    'Petit Formal Script' => 'Petit Formal Script',
    'Petrona' => 'Petrona',
    'Philosopher' => 'Philosopher',
    'Piedra' => 'Piedra',
    'Pinyon Script' => 'Pinyon Script',
    'Pirata One' => 'Pirata One',
    'Plaster' => 'Plaster',
    'Palatino Linotype' => 'Palatino Linotype',
    'Play' => 'Play',
    'Playball' => 'Playball',
    'Playfair Display' => 'Playfair Display',
    'Playfair Display SC' => 'Playfair Display SC',
    'Podkova' => 'Podkova',
    'Poiret One' => 'Poiret One',
    'Poller One' => 'Poller One',
    'Poly' => 'Poly',
    'Pompiere' => 'Pompiere',
    'Pontano Sans' => 'Pontano Sans',
    'Port Lligat Sans' => 'Port Lligat Sans',
    'Port Lligat Slab' => 'Port Lligat Slab',
    'Prata' => 'Prata',
    'Pragati Narrow' => 'Pragati Narrow',
    'Preahvihear' => 'Preahvihear',
    'Press Start 2P' => 'Press Start 2P',
    'Princess Sofia' => 'Princess Sofia',
    'Prociono' => 'Prociono',
    'Prosto One' => 'Prosto One',
    'Puritan' => 'Puritan',
    'Purple Purse' => 'Purple Purse',
    'Quando' => 'Quando',
    'Quantico' => 'Quantico',
    'Quattrocento' => 'Quattrocento',
    'Quattrocento Sans' => 'Quattrocento Sans',
    'Questrial' => 'Questrial',
    'Quicksand' => 'Quicksand',
    'Quintessential' => 'Quintessential',
    'Qwigley' => 'Qwigley',
    'Racing Sans One' => 'Racing Sans One',
    'Radley' => 'Radley',
    'Rajdhani' => 'Rajdhani',
    'Raleway Dots' => 'Raleway Dots',
    'Raleway' => 'Raleway',
    'Rambla' => 'Rambla',
    'Ramabhadra' => 'Ramabhadra',
    'Ramaraja' => 'Ramaraja',
    'Rammetto One' => 'Rammetto One',
    'Ranchers' => 'Ranchers',
    'Rancho' => 'Rancho',
    'Ranga' => 'Ranga',
    'Ravi Prakash' => 'Ravi Prakash',
    'Rationale' => 'Rationale',
    'Redressed' => 'Redressed',
    'Reenie Beanie' => 'Reenie Beanie',
    'Revalia' => 'Revalia',
    'Rhodium Libre' => 'Rhodium Libre',
    'Ribeye' => 'Ribeye',
    'Ribeye Marrow' => 'Ribeye Marrow',
    'Righteous' => 'Righteous',
    'Risque' => 'Risque',
    'Roboto' => 'Roboto',
    'Roboto Condensed' => 'Roboto Condensed',
    'Roboto Mono' => 'Roboto Mono',
    'Roboto Slab' => 'Roboto Slab',
    'Rochester' => 'Rochester',
    'Rock Salt' => 'Rock Salt',
    'Rokkitt' => 'Rokkitt',
    'Romanesco' => 'Romanesco',
    'Ropa Sans' => 'Ropa Sans',
    'Rosario' => 'Rosario',
    'Rosarivo' => 'Rosarivo',
    'Rouge Script' => 'Rouge Script',
    'Rozha One' => 'Rozha One',
    'Rubik' => 'Rubik',
    'Rubik One' => 'Rubik One',
    'Rubik Mono One' => 'Rubik Mono One',
    'Ruda' => 'Ruda',
    'Rufina' => 'Rufina',
    'Ruge Boogie' => 'Ruge Boogie',
    'Ruluko' => 'Ruluko',
    'Rum Raisin' => 'Rum Raisin',
    'Ruslan Display' => 'Ruslan Display',
    'Russo One' => 'Russo One',
    'Ruthie' => 'Ruthie',
    'Rye' => 'Rye',
    'Sacramento' => 'Sacramento',
    'Sail' => 'Sail',
    'Salsa' => 'Salsa',
    'Sanchez' => 'Sanchez',
    'Sancreek' => 'Sancreek',
    'Sahitya' => 'Sahitya',
    'Sansita One' => 'Sansita One',
    'Sarpanch' => 'Sarpanch',
    'Sarina' => 'Sarina',
    'Satisfy' => 'Satisfy',
    'Scada' => 'Scada',
    'Scheherazade' => 'Scheherazade',
    'Schoolbell' => 'Schoolbell',
    'Seaweed Script' => 'Seaweed Script',
    'Sarala' => 'Sarala',
    'Sevillana' => 'Sevillana',
    'Seymour One' => 'Seymour One',
    'Shadows Into Light' => 'Shadows Into Light',
    'Shadows Into Light Two' => 'Shadows Into Light Two',
    'Shanti' => 'Shanti',
    'Share' => 'Share',
    'Share Tech' => 'Share Tech',
    'Share Tech Mono' => 'Share Tech Mono',
    'Shojumaru' => 'Shojumaru',
    'Short Stack' => 'Short Stack',
    'Sigmar One' => 'Sigmar One',
    'Suranna' => 'Suranna',
    'Suravaram' => 'Suravaram',
    'Suwannaphum' => 'Suwannaphum',
    'Signika' => 'Signika',
    'Signika Negative' => 'Signika Negative',
    'Simonetta' => 'Simonetta',
    'Siemreap' => 'Siemreap',
    'Sirin Stencil' => 'Sirin Stencil',
    'Six Caps' => 'Six Caps',
    'Skranji' => 'Skranji',
    'Slackey' => 'Slackey',
    'Smokum' => 'Smokum',
    'Smythe' => 'Smythe',
    'Sniglet' => 'Sniglet',
    'Snippet' => 'Snippet',
    'Snowburst One' => 'Snowburst One',
    'Sofadi One' => 'Sofadi One',
    'Sofia' => 'Sofia',
    'Sonsie One' => 'Sonsie One',
    'Sorts Mill Goudy' => 'Sorts Mill Goudy',
    'Sorts Mill Goudy' => 'Sorts Mill Goudy',
    'Source Code Pro' => 'Source Code Pro',
    'Source Sans Pro' => 'Source Sans Pro',
    'Special I am one' => 'Special I am one',
    'Spicy Rice' => 'Spicy Rice',
    'Spinnaker' => 'Spinnaker',
    'Spirax' => 'Spirax',
    'Squada One' => 'Squada One',
    'Sree Krushnadevaraya' => 'Sree Krushnadevaraya',
    'Stalemate' => 'Stalemate',
    'Stalinist One' => 'Stalinist One',
    'Stardos Stencil' => 'Stardos Stencil',
    'Stint Ultra Condensed' => 'Stint Ultra Condensed',
    'Stint Ultra Expanded' => 'Stint Ultra Expanded',
    'Stoke' => 'Stoke',
    'Stoke' => 'Stoke',
    'Strait' => 'Strait',
    'Sura' => 'Sura',
    'Sumana' => 'Sumana',
    'Sue Ellen Francisco' => 'Sue Ellen Francisco',
    'Sunshiney' => 'Sunshiney',
    'Supermercado One' => 'Supermercado One',
    'Swanky and Moo Moo' => 'Swanky and Moo Moo',
    'Syncopate' => 'Syncopate',
    'Symbol' => 'Symbol',
    'Timmana' => 'Timmana',
    'Taprom' => 'Taprom',
    'Tangerine' => 'Tangerine',
    'Tahoma' => 'Tahoma',
    'Teko' => 'Teko',
    'Telex' => 'Telex',
    'Tenali Ramakrishna' => 'Tenali Ramakrishna',
    'Tenor Sans' => 'Tenor Sans',
    'Terminal Dosis' => 'Terminal Dosis',
    'Terminal Dosis Light' => 'Terminal Dosis Light',
    'Text Me One' => 'Text Me One',
    'The Girl Next Door' => 'The Girl Next Door',
    'Tienne' => 'Tienne',
    'Tillana' => 'Tillana',
    'Tinos' => 'Tinos',
    'Titan One' => 'Titan One',
    'Titillium Web' => 'Titillium Web',
    'Trade Winds' => 'Trade Winds',
    'Trebuchet MS' => 'Trebuchet MS',
    'Trocchi' => 'Trocchi',
    'Trochut' => 'Trochut',
    'Trykker' => 'Trykker',
    'Tulpen One' => 'Tulpen One',
    'Ubuntu' => 'Ubuntu',
    'Ubuntu Condensed' => 'Ubuntu Condensed',
    'Ubuntu Mono' => 'Ubuntu Mono',
    'Ultra' => 'Ultra',
    'Uncial Antiqua' => 'Uncial Antiqua',
    'Underdog' => 'Underdog',
    'Unica One' => 'Unica One',
    'UnifrakturCook' => 'UnifrakturCook',
    'UnifrakturMaguntia' => 'UnifrakturMaguntia',
    'Unkempt' => 'Unkempt',
    'Unlock' => 'Unlock',
    'Unna' => 'Unna',
    'VT323' => 'VT323',
    'Vampiro One' => 'Vampiro One',
    'Varela' => 'Varela',
    'Varela Round' => 'Varela Round',
    'Vast Shadow' => 'Vast Shadow',
    'Vesper Libre' => 'Vesper Libre',
    'Verdana' => 'Verdana',
    'Vibur' => 'Vibur',
    'Vidaloka' => 'Vidaloka',
    'Viga' => 'Viga',
    'Voces' => 'Voces',
    'Volkhov' => 'Volkhov',
    'Vollkorn' => 'Vollkorn',
    'Voltaire' => 'Voltaire',
    'Waiting for the Sunrise' => 'Waiting for the Sunrise',
    'Wallpoet' => 'Wallpoet',
    'Walter Turncoat' => 'Walter Turncoat',
    'Warnes' => 'Warnes',
    'Wellfleet' => 'Wellfleet',
    'Wendy One' => 'Wendy One',
    'Wire One' => 'Wire One',
    'Yanone Kaffeesatz' => 'Yanone Kaffeesatz',
    'Yantramanav' => 'Yantramanav',
    'Yellowtail' => 'Yellowtail',
    'Yeseva One' => 'Yeseva One',
    'Yesteryear' => 'Yesteryear',
    'Zeyada' => 'Zeyada'
  );

	//array of all font sizes.
	$font_sizes = array( 
		'10px' => '10px',
		'11px' => '11px',
	);
	
	$options = array();
	$imagepath =  get_template_directory_uri() . '/images/';

	
	for($n=12;$n<=200;$n+=1){
		$font_sizes[$n.'px'] = $n.'px';
	}
	
	// Pull all the pages into an array
	 $options_pages = array();
	 $options_pages_obj = get_pages('sort_column=post_parent,menu_order');
	 $options_pages[''] = 'Select a page:';
	 foreach ($options_pages_obj as $page) {
	  $options_pages[$page->ID] = $page->post_title;
	 }

	// array of section content.
	$section_text = array(	
			1 => array(			
			'section_title'	=> '',
			'menutitle'		=> 'section1',
			'bgcolor' 		=> '#394650',
			'bgimage'		=> '',
			'class'			=> '',
			'content'		=> '[column_content type="vid_galle_left"][custom-video youtubeid="COqheaxpWJw" cover="'.get_template_directory_uri().'/images/video-cover2.jpg"][/column_content][column_content type="vid_galle_right"]
[about_yoga title="About Yoga" description="Proin luctus libero nec bibendum cursus. Suspendisse tempor congue condimentum. In et porta nibh. "]
[our_mission title="Our Mission Statement" info="Donec in metus lectus" description="Proin luctus libero nec bibendum cursus. Suspen tempor congue condimentum. In et porta nibh. consequat tortor mattis vehicula vehicula."][/column_content]',
		),
		
		
		2 => array(		
			'section_title'	=> '',
			'menutitle'		=> 'section2',
			'bgcolor' 		=> '#f6f6ec',
			'bgimage'		=> '',
			'class'			=> '',
			'content'		=> '[column_content type="welcome_leftbox"]<h5>WHAT WE OFFER</h5><h3>We provide the most powerful service</h3>Donec in metus lectus. Integer vulputate porta elit, fringilla mollis mag luctus vel. Interdui malesuada fames ac ante ipsum primis in fauci. [button_pink align="left" name="Read more" link="#" target=""][/column_content][column_content type="welcome_righbox"][welcome_sevices title="Best Workshop" description="fringilla mollis mag luct Interdum et malesuada fames ac ant ipsum primis in fauci." image="'.get_template_directory_uri().'/images/welcome_icon1.png" link="#"][welcome_sevices title="Best Teacher Training" description="fringilla mollis mag luct Interdum et malesuada fames ac ant ipsum primis in fauci." image="'.get_template_directory_uri().'/images/welcome_icon2.png" link="#" class="last"][welcome_sevices title="Best Classes Ever" description="fringilla mollis mag luct Interdum et malesuada fames ac ant ipsum primis in fauci." image="'.get_template_directory_uri().'/images/welcome_icon3.png" link="#"][welcome_sevices title="Cardio Training" description="fringilla mollis mag luct Interdum et malesuada fames ac ant ipsum primis in fauci." image="'.get_template_directory_uri().'/images/welcome_icon4.png" link="#" class="last"][/column_content][clear]',
		),		
				
		
		3 => array(			
			'section_title'	=> 'Benefits of Yoga',
			'menutitle'		=> 'section3',
			'bgcolor' 		=> '#303030',
			'bgimage'		=> get_template_directory_uri().'/images/benefit_yogabg.jpg',
			'class'			=> '',
			'content'		=> '[benefit_yoga title="Reduce Stress" icon="'.get_template_directory_uri().'/images/benefit_icon1.png" link="#"][benefit_yoga title="Self-confidence" icon="'.get_template_directory_uri().'/images/benefit_icon2.png" link="#"][benefit_yoga title="Sharpen Memory" icon="'.get_template_directory_uri().'/images/benefit_icon3.png" link="#"][benefit_yoga title="Become Creative" icon="'.get_template_directory_uri().'/images/benefit_icon4.png" link="#"][benefit_yoga title="More Relaxation" icon="'.get_template_directory_uri().'/images/benefit_icon5.png" link="#"][benefit_yoga title="Alleviate Anxiety" icon="'.get_template_directory_uri().'/images/benefit_icon6.png" link="#"]'
		),
		
		
		4 => array(			
			'section_title'	=> 'Our Classes',
			'menutitle'		=> 'section4',
			'bgcolor' 		=> '#f4f4f4',
			'bgimage'		=> '',
			'class'			=> '',
			'content'		=> '[subtitle size="16px" color="#535353" align="center" description="Nunc commodo lacinia ipsum, scelerisque cursus libero ullamcorper sed. Praesent fermentum nisl ac neque tristique porttitor. Sed lectus lacus, vestibulum at fermentum."]
			
[our_classes title="YogaFit For Beginners" date="25/09/19" time="13:30 - 15:00" description="fringilla mollis mag luct Interdum et malesuada fames ac ant ipsum primis in fauci." image="'.get_template_directory_uri().'/images/yogaclass_img1.jpg" link="#"][our_classes title="YogaFit For Pregnant" date="25/09/19" time="13:30 - 15:00" description="fringilla mollis mag luct Interdum et malesuada fames ac ant ipsum primis in fauci." image="'.get_template_directory_uri().'/images/yogaclass_img2.jpg" link="#"][our_classes title="Private & Group Lessons" date="25/09/19" time="13:30 - 15:00" description="fringilla mollis mag luct Interdum et malesuada fames ac ant ipsum primis in fauci." image="'.get_template_directory_uri().'/images/yogaclass_img3.jpg" link="#" class="last"]',
		),	
		
		5 => array(			
			'section_title'	=> '',
			'menutitle'		=> 'section5',
			'bgcolor' 		=> '#ffffff',
			'bgimage'		=> get_template_directory_uri().'/images/features-sectionbg.jpg',
			'class'			=> '',
			'content'		=> '[column_content type="features_videobox"][custom-video youtubeid="yrYoyQF10d8" cover="'.get_template_directory_uri().'/images/ft-video-cover.jpg"][/column_content][column_content type="features_infobox"][section-main-title align="left" title="Our Features"]Proin luctus libero nec bibendum cursus. Suspendisse tempor congue condimentum. In et porta nibh. Sed consequat tortor mattis vehicula vehicula. Vivamus quis est nisl. Praesent ac elit et sapien molestie interdum in quis felis. Duis elit erat, feugiat vel nunc et, blandit semper lorem. [button_pink align="left" name="Read More" link="#" target=""][/column_content][column_content type="features_servicesbx"][features_sevices icon="'.get_template_directory_uri().'/images/features_icon1.png" title="Maditation Center" description="fringilla mollis mag luct Interdum et malesuada fames ac ant ipsum."][features_sevices icon="'.get_template_directory_uri().'/images/features_icon2.png" title="Maditation Center" description="fringilla mollis mag luct Interdum et malesuada fames ac ant ipsum."][features_sevices icon="'.get_template_directory_uri().'/images/features_icon3.png" title="Maditation Center" description="fringilla mollis mag luct Interdum et malesuada fames ac ant ipsum."][/column_content]'
		),
		
		6 => array(			
			'section_title'	=> 'Our Instructors',
			'menutitle'		=> 'section6',
			'bgcolor' 		=> '#f6f6ec',
			'bgimage'		=> '',
			'class'			=> '',
			'content'		=> '[subtitle size="16px" color="#535353" align="center" description=" Sed quis ultricies sapien, et bibendum ligula. Nam consequat velit orci, posuere volutpat quam viverra sit amet. Phasellus tempor diam non nunc hendrerit lobortis consectetur at dui. Fusce varius velit eu mauris placerat vulputate."][our-team show="-1"]'
		),
		
		7 => array(			
			'section_title'	=> 'Pricing Plan',
			'menutitle'		=> 'section7',
			'bgcolor' 		=> '#ffffff',
			'bgimage'		=> '',
			'class'			=> '',
			'content'		=> '[pricing_table columns="3"]
[price_column highlight="no" bgcolor="#f6f6ec"]	   
	[price_header image="'.get_template_directory_uri().'/images/price_img01.jpg" title="One Month Plan" startfrom="Starting from" price="$39"][/price_header]	
	[price_row]Starter Pack Included[/price_row]
	[price_row class="none"]Personal Trainer[/price_row]
	[price_row class="none"]Convienient Time[/price_row]
	[price_row class="none"]Special Class[/price_row]		
	[price_row]Group Training[/price_row]
	[price_row]Ayurvedic Medicine[/price_row]					
	[price_footer link="#1"]Appointment Now[/price_footer]	
[/price_column]
[price_column highlight="yes" bgcolor="#f6f6ec"]	
	[price_header image="'.get_template_directory_uri().'/images/price_img02.jpg" title="One Month Plan" startfrom="Starting from" price="$59"][/price_header]	
	[price_row]Starter Pack Included[/price_row]
	[price_row]Personal Trainer[/price_row]
	[price_row class="none"]Convienient Time[/price_row]
	[price_row]Special Class[/price_row]		
	[price_row]Group Training[/price_row]
	[price_row]Ayurvedic Medicine[/price_row]				
	[price_footer link="#2"]Appointment Now[/price_footer]
[/price_column]
[price_column highlight="no" bgcolor="#f6f6ec"]	
	[price_header image="'.get_template_directory_uri().'/images/price_img03.jpg" title="One Month Plan" startfrom="Starting from" price="$99"][/price_header]	
	[price_row]Starter Pack Included[/price_row]
	[price_row]Personal Trainer[/price_row]
	[price_row]Convienient Time[/price_row]
	[price_row]Special Class[/price_row]		
	[price_row]Group Training[/price_row]
	[price_row]Ayurvedic Medicine[/price_row]				
	[price_footer link="#3"]Appointment Now[/price_footer]
[/price_column]
[/pricing_table]'
		),
		
		8 => array(			
			'section_title'	=> '',
			'menutitle'		=> 'section8',
			'bgcolor' 		=> '#323234',
			'bgimage'		=> get_template_directory_uri().'/images/testimonials_bg.jpg',
			'class'			=> '',
			'content'		=> '[column_content type="one_half"][testimonials][/column_content]

[column_content type="one_half_last"][section-main-title align="left" title="What Others Say"][subtitle size="16px" color="#ffffff" align="left" description="Vestibulum odio dui, posuere efermentum at euismod velleo. Nunc luctus, sapien non aliquam tincidunt, tortor nibh facilisis nunc, in rhoncus nulla augue eget lacus."]
	
Phasellus diam sem, sollicitudin in tincidunt id, varius at felis. Donec a velit eros. Maecenas bibendum commodo fermentum. Etiam ex leo, rutrum nec tempus non, finibus ullamcorper leo. Aenean vitae massa sem. Sed sagittis, libero eget placerat tempus, nunc eros pharetra nisl, nec consequat lacus tortor id neque. Duis quis ipsum urna. Ut consequat 
[/column_content]'
		),
		
		9 => array(			
			'section_title'	=> '', 
			'menutitle'		=> 'section9',
			'bgcolor' 		=> '#ffffff',
			'bgimage'		=> '',
			'class'			=> '',
			'content'		=> '[column_content type="faq_left"][section-main-title align="left" title="Yoga & Meditation FAQ"][subtitle size="22px" color="#ffffff" align="left" description="Find your answer here"][accordion]
[accordion_content title="How to register and join Yoga & Meditation Center"]
ANSWER:		
Proin luctus libero nec bibendum cursus. Suspendisse tempor congue condimentum. In et porta n consequat tortor mattis vehicula vehicula. Vivamus nisl. Praesent ac elit et sapien molestie.
[/accordion_content]
[accordion_content title="Can i make my own event here?"]
ANSWER:
Luctus libero nec bibendum cursus. Suspendisse tempor congue condimentum consequat tortor mattis vehicula vehicula. Vivamus nisl. Praesent ac elit et sapien molestie.
[/accordion_content]
[accordion_content title="How to register and join Yoga & Meditation Center"]
ANSWER:		
Praesent ac elit et sapien moles tieuctus libero nec bibendum cursus. Suspendisse tempor congue condimentum consequat tortor mattis vehicula vehicula. Vivamus nisl. 
[/accordion_content]
[/accordion]
<div class="findbx">Can not find your question? <a href="#">Click here</a></div>
[/column_content]

[column_content type="faq_right"][counter value="965" title="Happy Clients" description="fringilla mollis mag luct Imalesuadaey fames ac ant ipsum primiin fauci."][counter value="25" title="Years of Experience" description="fringilla mollis mag luct Imalesuadaey fames ac ant ipsum primiin fauci."][counter value="50" title="Professional Instructors" description="fringilla mollis mag luct Imalesuadaey fames ac ant ipsum primiin fauci."][counter value="786" title="Monthly Classes" description="fringilla mollis mag luct Imalesuadaey fames ac ant ipsum primiin fauci."][/column_content]'
		),	
		
		10 => array(			
			'section_title'	=> '',
			'menutitle'		=> 'section10',
			'bgcolor' 		=> '#272d2d',
			'bgimage'		=> get_template_directory_uri().'/images/sections10_bg.jpg',
			'class'			=> '',
			'content'		=> '[column_content type="practice_theory"][section-main-title align="left" title="Yoga is 99% practice and 1% theory"]Proin luctus libero nec bibendum cursus. Suspendisse tempor congue condimentum. In et porta nibh. Sed consequat tortor mattis vehicula vehicula.
[button_pink align="left" name="Get Started" link="#" target=""]
[/column_content]'
		),	
		
		11 => array(			
			'section_title'	=> '',
			'menutitle'		=> 'section11',
			'bgcolor' 		=> '#98cc4d',
			'bgimage'		=> '',
			'class'			=> '',
			'content'		=> '[column_content type="partner_left"][section-main-title align="left" title="Our Partners"]Proin luctus libero nec bibendum cursus. Suspendisse tempor congue condimentum.[/column_content]

[column_content type="partner_right"][client_lists][client image="'.get_template_directory_uri().'/images/client-logo01.png" title="Yoga Center" link="#"][client image="'.get_template_directory_uri().'/images/client-logo02.png" title="Meditation" link="#"][client image="'.get_template_directory_uri().'/images/client-logo03.png" title="Yoga Fitness" link="#"][client image="'.get_template_directory_uri().'/images/client-logo04.png"  title="Naturopathy" link="#"][/client_lists][/column_content]'
		),	
				
	);

	$options = array();

	//Basic Settings
	$options[] = array(
		'name' => __('Basic Settings', 'yogic-pro'),
		'type' => 'heading');

	$options[] = array(
		'name' => __('Logo', 'yogic-pro'),
		'desc' => __('Upload your main logo here', 'yogic-pro'),
		'id' => 'sitelogo',
		'class' => '',
		'std'	=> get_template_directory_uri().'/images/logo.png',
		'type' => 'upload');
		
	$options[] = array(		
		'desc' => __('Change your custom logo height', 'yogic-pro'),
		'id' => 'logoheight',
		'std' => '45',
		'type' => 'text');
		
	$options[] = array(		
		'desc' => __('manage logo width', 'yogic-pro'),
		'id' => 'logowidth',
		'std' => '20%',
		'type' => 'text');	
		
	$options[] = array(	
		'name' => __('Site title & Description', 'yogic-pro'),		
		'desc'	=> __('Check To Show site title and description', 'yogic-pro'),
		'id'	=> 'hide_titledesc',
		'type'	=> 'checkbox',
		'std'	=> '');		
		
	$options[] = array(	
		'name' => __('Layout Option', 'yogic-pro'),		
		'desc'	=> __('Check To View Box Layout ', 'yogic-pro'),
		'id'	=> 'boxlayout',
		'type'	=> 'checkbox',
		'std'	=> '');
			
	$options[] = array(
		'name' => __('Sticky Header', 'yogic-pro'),
		'desc' => __('Check this to show sticky header on scroll', 'yogic-pro'),
		'id' => 'headstick',
		'std' => '',
		'type' => 'checkbox');		
			
	$options[] = array(
		'name' => __('Hide Animation', 'yogic-pro'),
		'desc' => __('Check this to hide animation on scroll', 'yogic-pro'),
		'id' => 'scrollanimation',
		'std' => '',
		'type' => 'checkbox');		

	$options[] = array(
		'name' => __('Custom CSS', 'yogic-pro'),
		'desc' => __('Some Custom Styling for your site. Place any css codes here instead of the style.css file.', 'yogic-pro'),
		'id' => 'style2',
		'std' => '',
		'type' => 'textarea');
		
	$options[] = array(
		'name' => __('Header Social Icons', 'yogic-pro'),
		'desc' => __('social icons for header', 'yogic-pro'),
		'id' => 'headersocialicon',
		'std' => '[social_area]
[social icon="fab fa-facebook-f" link="#"] 
[social icon="fab fa-twitter" link="#"] 
[social icon="fab fa-google-plus-g" link="#"] 
[social icon="fab fa-linkedin-in" link="#"] 
[social icon="fas fa-rss" link="#"] 
[social icon="fab fa-youtube" link="#"]				
[/social_area]',
		'type' => 'textarea');		
		
	$options[] = array(
		'name' => __('Header Contact Info', 'yogic-pro'),
		'desc' => __('Edit header contact info from here. NOTE: icon name should be as it is giving by font awesome site(far fa-clock) More social icons can be found at: https://fontawesome.com/icons', 'yogic-pro'),
		'id' => 'headerinfo',
		'std' => '<div class="infobox"><i class="fas fa-phone-volume"></i><span>(+89) 530 - 352 - 3027</span> </div>
<div class="infobox"><i class="fas fa-envelope-open-text"></i><span>info@sitename.com</span> </div>',
		'type' => 'textarea');	
		
	$options[] = array(		
		'desc' => __('Check to hide header contact info strip', 'yogic-pro'),
		'id' => 'headinfodata',
		'std' => '',
		'type' => 'checkbox');	
		
	// font family start 		
	$options[] = array(
		'name' => __('Font Faces', 'yogic-pro'),
		'desc' => __('Select font for the body text', 'yogic-pro'),
		'id' => 'bodyfontface',
		'type' => 'select',
		'std' => 'Assistant',
		'options' => $font_types );
		
	$options[] = array(
		'desc' => __('Select font for the textual logo', 'yogic-pro'),
		'id' => 'logofontface',
		'type' => 'select',
		'std' => 'Assistant',
		'options' => $font_types );
		
	$options[] = array(
		'desc' => __('Select font for the navigation text', 'yogic-pro'),
		'id' => 'navfontface',
		'type' => 'select',
		'std' => 'Assistant',
		'options' => $font_types );
		
	$options[] = array(
		'desc' => __('Select font family for all heading tag.', 'yogic-pro'),
		'id' => 'headfontface',
		'type' => 'select',
		'std' => 'Assistant',
		'options' => $font_types );
		
	$options[] = array(
		'desc' => __('Select font for Section title', 'yogic-pro'),
		'id' => 'sectiontitlefontface',
		'type' => 'select',
		'std' => 'Assistant',
		'options' => $font_types );	
			
	$options[] = array(
		'desc' => __('Select font for Slide title', 'yogic-pro'),
		'id' => 'slidetitlefontface',
		'type' => 'select',
		'std' => 'Assistant',
		'options' => $font_types );	
		
	$options[] = array(
		'desc' => __('Select font for Slide Description', 'yogic-pro'),
		'id' => 'slidedesfontface',
		'type' => 'select',
		'std' => 'Assistant',
		'options' => $font_types );	

		
	// font sizes start	
	$options[] = array(
		'name' => __('Font Sizes', 'yogic-pro'),
		'desc' => __('Select font size for body text', 'yogic-pro'),
		'id' => 'bodyfontsize',
		'type' => 'select',
		'std' => '16px',
		'options' => $font_sizes );
		
	$options[] = array(
		'desc' => __('Select font size for textual logo', 'yogic-pro'),
		'id' => 'logofontsize',
		'type' => 'select',
		'std' => '38px',
		'options' => $font_sizes );
		
	$options[] = array(
		'desc' => __('Select font size for navigation', 'yogic-pro'),
		'id' => 'navfontsize',
		'type' => 'select',
		'std' => '15px',
		'options' => $font_sizes );	

		
	$options[] = array(
		'desc' => __('Select font size for section title', 'yogic-pro'),
		'id' => 'sectitlesize',
		'type' => 'select',
		'std' => '40px',
		'options' => $font_sizes );
		
	$options[] = array(
		'desc' => __('Select font size for footer title', 'yogic-pro'),
		'id' => 'ftfontsize',
		'type' => 'select',
		'std' => '30px',
		'options' => $font_sizes );	

	$options[] = array(
		'desc' => __('Select h1 font size', 'yogic-pro'),
		'id' => 'h1fontsize',
		'std' => '30px',
		'type' => 'select',
		'options' => $font_sizes);

	$options[] = array(
		'desc' => __('Select h2 font size', 'yogic-pro'),
		'id' => 'h2fontsize',
		'std' => '28px',
		'type' => 'select',
		'options' => $font_sizes);

	$options[] = array(
		'desc' => __('Select h3 font size', 'yogic-pro'),
		'id' => 'h3fontsize',
		'std' => '18px',
		'type' => 'select',
		'options' => $font_sizes);

	$options[] = array(
		'desc' => __('Select h4 font size', 'yogic-pro'),
		'id' => 'h4fontsize',
		'std' => '22px',
		'type' => 'select',
		'options' => $font_sizes);

	$options[] = array(
		'desc' => __('Select h5 font size', 'yogic-pro'),
		'id' => 'h5fontsize',
		'std' => '20px',
		'type' => 'select',
		'options' => $font_sizes);

	$options[] = array(
		'desc' => __('Select h6 font size', 'yogic-pro'),
		'id' => 'h6fontsize',
		'std' => '14px',
		'type' => 'select',
		'options' => $font_sizes);


	// font colors start

	$options[] = array(
		'name' => __('Site Colors Scheme', 'yogic-pro'),
		'desc' => __('Change the color scheme of hole site', 'yogic-pro'),
		'id' => 'colorscheme',
		'std' => '#cf317c',
		'type' => 'color');
		
	$options[] = array(
		'desc' => __('change second color scheme for hole site', 'yogic-pro'),
		'id' => 'secondcolorofsite',
		'std' => '#98cc4d',
		'type' => 'color');		
		
	$options[] = array(	
		'name' => __('Font Colors', 'yogic-pro'),	
		'desc' => __('Select font color for the body text', 'yogic-pro'),
		'id' => 'bodyfontcolor',
		'std' => '#535353',
		'type' => 'color');	
		
	$options[] = array(
		'desc' => __('Select font color for textual logo', 'yogic-pro'),
		'id' => 'logofontcolor',
		'std' => '#ffffff',
		'type' => 'color');
		
	$options[] = array(
		'desc' => __('Select font color for header top phone and email', 'yogic-pro'),
		'id' => 'headertopfontcolor',
		'std' => '#ffffff',
		'type' => 'color');	
		
	$options[] = array(
		'desc' => __('Select font color for logo tagline', 'yogic-pro'),
		'id' => 'logotaglinecolor',
		'std' => '#ffffff',
		'type' => 'color');	
		
	$options[] = array(
		'desc' => __('Select font color for section title', 'yogic-pro'),
		'id' => 'sectitlecolor',
		'std' => '#121212',
		'type' => 'color');	
	
	$options[] = array(
		'desc' => __('Select font color for navigation', 'yogic-pro'),
		'id' => 'navfontcolor',
		'std' => '#ffffff',
		'type' => 'color');
		
	$options[] = array(
		'desc' => __('Select font color for widget title', 'yogic-pro'),
		'id' => 'wdgttitleccolor',
		'std' => '#ffffff',
		'type' => 'color');
		
	$options[] = array(
		'desc' => __('Select font color for footer title', 'yogic-pro'),
		'id' => 'foottitlecolor',
		'std' => '#fffefe',
		'type' => 'color');
		
	$options[] = array(
		'desc' => __('Select font color for footer', 'yogic-pro'),
		'id' => 'footdesccolor',
		'std' => '#ffffff',
		'type' => 'color');	
		
	$options[] = array(
		'desc' => __('Select font color for footer copyright and design by text', 'yogic-pro'),
		'id' => 'designcolor',
		'std' => '#ffffff',
		'type' => 'color');

	$options[] = array(
		'desc' => __('Select font hover color for links / anchor tags', 'yogic-pro'),
		'id' => 'linkhovercolor',
		'std' => '#272727',
		'type' => 'color');			
		
	$options[] = array(
		'desc' => __('Select font color for sidebar li a', 'yogic-pro'),
		'id' => 'sidebarfontcolor',
		'std' => '#78797c',
		'type' => 'color');	
		
	$options[] = array(
		'desc' => __('Select font hover color for footer design by links', 'yogic-pro'),
		'id' => 'copylinkshover',
		'std' => '#ffffff',
		'type' => 'color');	

	$options[] = array(
		'desc' => __('Select h1 font color', 'yogic-pro'),
		'id' => 'h1fontcolor',
		'std' => '#272727',
		'type' => 'color');
		
	$options[] = array(
		'desc' => __('Select h2 font color', 'yogic-pro'),
		'id' => 'h2fontcolor',
		'std' => '#272727',
		'type' => 'color');	
		
	$options[] = array(
		'desc' => __('Select h3 font color', 'yogic-pro'),
		'id' => 'h3fontcolor',
		'std' => '#272727',
		'type' => 'color');	
		
	$options[] = array(
		'desc' => __('Select h4 font color', 'yogic-pro'),
		'id' => 'h4fontcolor',
		'std' => '#272727',
		'type' => 'color');	

	$options[] = array(
		'desc' => __('Select h5 font color', 'yogic-pro'),
		'id' => 'h5fontcolor',
		'std' => '#272727',
		'type' => 'color');	

	$options[] = array(
		'desc' => __('Select h6 font color', 'yogic-pro'),
		'id' => 'h6fontcolor',
		'std' => '#272727',
		'type' => 'color');	
		
	$options[] = array(
		'desc' => __('Select font color for footer social icons', 'yogic-pro'),
		'id' => 'footsocialcolor',
		'std' => '#e2e2e2',
		'type' => 'color');	
		
	$options[] = array(
		'desc' => __('Select font color for gallery filter ', 'yogic-pro'),
		'id' => 'galleryfiltercolor',
		'std' => '#6e6d6d',
		'type' => 'color');			
		
	$options[] = array(
		'desc' => __('Select font hover color for gallery filter ', 'yogic-pro'),
		'id' => 'galleryfiltercolorhv',
		'std' => '#ffffff',
		'type' => 'color');	
		
	$options[] = array(
		'desc' => __('Select font color for photogallery title ', 'yogic-pro'),
		'id' => 'gallerytitlecolorhv',
		'std' => '#ffffff',
		'type' => 'color');			
		
	$options[] = array(
		'desc' => __('Select font color for client testimonilas description', 'yogic-pro'),
		'id' => 'testimonialdescriptioncolor',
		'std' => '#717171',
		'type' => 'color');	
		
	$options[] = array(
		'desc' => __('Select font color for sidebar widget box', 'yogic-pro'),
		'id' => 'widgetboxfontcolor',
		'std' => '#6e6d6d',
		'type' => 'color');	
		
	$options[] = array(
		'desc' => __('Select font color for toggle menu on responsive', 'yogic-pro'),
		'id' => 'togglemenucolor',
		'std' => '#ffffff',
		'type' => 'color');
		
	$options[] = array(
		'desc' => __('Select font color for team member title', 'yogic-pro'),
		'id' => 'teamttlfontcolor',
		'std' => '#353535',
		'type' => 'color');	
		
	$options[] = array(
		'desc' => __('Select font color for team member Experience year', 'yogic-pro'),
		'id' => 'teamdegigfontcolor',
		'std' => '#4c4c4c',
		'type' => 'color');			
					
		
	// Background start			
	$options[] = array(
		'name' => __('Background Colors', 'yogic-pro'),	
		'desc' => __('Select background color for header', 'yogic-pro'),
		'id' => 'headerbgcolor',
		'std' => '#000000',
		'type' => 'color');
		
	$options[] = array(		
		'desc' => __('Select background opacity color for site header', 'yogic-pro'),
		'id' => 'headerbgopacity',
		'std' => '0.2',
		'type' => 'select',
		'options'	=> array('1'=>1, '0.9'=>0.9,'0.8'=>0.8,'0.7'=>0.7,'0.6'=>0.6,'0.5'=>0.5,'0.4'=>0.4,'0.3'=>0.3,'0.2'=>0.2,'0.1'=>0.1,'0'=>0,));				
		
	$options[] = array(		
		'desc' => __('Select background color for footer', 'yogic-pro'),
		'id' => 'footerbgcolor',
		'std' => '#242d34',
		'type' => 'color');	
		
	$options[] = array(
		'desc' => __('Select background color for footer copyrights section', 'yogic-pro'),
		'id' => 'footercoprbgcolor',
		'std' => '#1e252a',
		'type' => 'color');	
		
	$options[] = array(
		'desc' => __('Select background color for photogallery filter', 'yogic-pro'),
		'id' => 'galleryfilter',
		'std' => '#f1f1f1',
		'type' => 'color');		
		
	$options[] = array(
		'desc' => __('Select background color for client testimonials pager dots', 'yogic-pro'),
		'id' => 'testidotsbgcolor',
		'std' => '#ffffff',
		'type' => 'color');		
	
	$options[] = array(
		'desc' => __('Select background color for sidebar widget search box', 'yogic-pro'),
		'id' => 'widgetboxbgcolor',
		'std' => '#F0EFEF',
		'type' => 'color');			
	
	// Border colors			
	$options[] = array(	
		'name' => __('Border Colors', 'yogic-pro'),		
		'desc' => __('Select border color for sidebar li a', 'yogic-pro'),
		'id' => 'sidebarliaborder',
		'std' => '#d0cfcf',
		'type' => 'color');	
		
	$options[] = array(			
		'desc' => __('Select border color for gallery filter', 'yogic-pro'),
		'id' => 'galleryfilterbdr',
		'std' => '#494949',
		'type' => 'color');			
	

	// Default Buttons		
	$options[] = array(
		'name' => __('Button Colors', 'yogic-pro'),
		'desc' => __('Select background hover color for default button', 'yogic-pro'),
		'id' => 'btnbghvcolor',
		'std' => '#202020',
		'type' => 'color');		

	$options[] = array(
		'desc' => __('Select font color default button', 'yogic-pro'),
		'id' => 'btntxtcolor',
		'std' => '#ffffff',
		'type' => 'color');

	$options[] = array(
		'desc' => __('Select font hover color for default button', 'yogic-pro'),
		'id' => 'btntxthvcolor',
		'std' => '#ffffff',
		'type' => 'color');					

	// Slider Caption colors
	$options[] = array(	
		'name' => __('Slider Caption Colors', 'yogic-pro'),				
		'desc' => __('Select font color for slider title', 'yogic-pro'),
		'id' => 'slidetitlecolor',
		'std' => '#ffffff',
		'type' => 'color');			
		
	$options[] = array(		
		'desc' => __('Select font color for slider description', 'yogic-pro'),
		'id' => 'slidedesccolor',
		'std' => '#ffffff',
		'type' => 'color');	
		
		
	$options[] = array(
		'desc' => __('Select font size for slider title', 'yogic-pro'),
		'id' => 'slidetitlefontsize',
		'type' => 'select',
		'std' => '45px',
		'options' => $font_sizes );

		
	$options[] = array(
		'desc' => __('Select font size for slider description', 'yogic-pro'),
		'id' => 'slidedescfontsize',
		'type' => 'select',
		'std' => '16px',
		'options' => $font_sizes );
		
	// Slider controls colors		
	$options[] = array(
		'name' => __('Slider controls Colors', 'yogic-pro'),
		'desc' => __('Select background color for slider pager', 'yogic-pro'),
		'id' => 'sldpagebg',
		'std' => '#ffffff',
		'type' => 'color');
		
	$options[] = array(
		'desc' => __('Select background color for slider navigation arrows', 'yogic-pro'),
		'id' => 'sldarrowbg',
		'std' => '#000000',
		'type' => 'color');	
		
	$options[] = array(		
		'desc' => __('Select background opacity color for header slider navigation arrows', 'yogic-pro'),
		'id' => 'sldarrowopacity',
		'std' => '0.0',
		'type' => 'select',
		'options'	=> array('1'=>1, '0.9'=>0.9,'0.8'=>0.8,'0.7'=>0.7,'0.6'=>0.6,'0.5'=>0.5,'0.4'=>0.4,'0.3'=>0.3,'0.2'=>0.2,'0.1'=>0.1,'0.0'=>0.0,));			
		

	$options[] = array(		
		'name' => __('Excerpt Lenth', 'yogic-pro'),		
		'desc' => __('Select excerpt length for testimonials section', 'yogic-pro'),
		'id' => 'testimonialsexcerptlength',
		'std' => '30',
		'type' => 'text');
		
	$options[] = array(		
		'desc' => __('Select excerpt length for blog post', 'yogic-pro'),
		'id' => 'blogpostexcerptlength',
		'std' => '45',
		'type' => 'text');
		
	$options[] = array(	
		'name' => __('Read More Custom Text', 'yogic-pro'),		
		'desc' => __('add read more button text for latest news sections', 'yogic-pro'),
		'id' => 'blogpostreadmoretext',
		'std' => '',
		'type' => 'text');	
		
	$options[] = array(		
		'desc' => __('Change read more button text for latest blog post template', 'yogic-pro'),
		'id' => 'readmoretext_blogtemplates',
		'std' => 'Read more &rarr;',
		'type' => 'text');	
		
	$options[] = array(		
		'desc' => __('Change Show All Button text for photo gallery section', 'yogic-pro'),
		'id' => 'galleryshowallbtn',
		'std' => 'Show All',
		'type' => 'text');	
		
	$options[] = array(		
		'desc' => __('Change menu word on responsive view', 'yogic-pro'),
		'id' => 'menuwordchange',
		'std' => 'Menu',
		'type' => 'text');
		
	$options[] = array(
		'name' => __('Blog Single Layout', 'yogic-pro'),
		'desc' => __('Select layout. eg:Boxed, Wide', 'yogic-pro'),
		'id' => 'singlelayout',
		'type' => 'select',
		'std' => 'singleright',
		'options' => array('singleright'=>'Blog Single Right Sidebar', 'singleleft'=>'Blog Single Left Sidebar', 'sitefull'=>'Blog Single Full Width', 'nosidebar'=>'Blog Single No Sidebar') );	
		
	$options[] = array(
		'name' => __('Team Single Layout', 'yogic-pro'),
		'desc' => __('Select layout. eg:left,right,full', 'yogic-pro'),
		'id' => 'teamsinglelayout',
		'type' => 'select',
		'std' => 'sitefull',
		'options' => array('singleright'=>'Team Single Right Sidebar', 'singleleft'=>'Team Single Left Sidebar', 'sitefull'=>'Team Single Full Width', 'nosidebar'=>'Team Single No Sidebar') );	
		
		
	$options[] = array(
		'name' => __('Woocommerce Page Layout', 'yogic-pro'),
		'desc' => __('Select layout. eg:right-sidebar, left-sidebar, full-width', 'yogic-pro'),
		'id' => 'woocommercelayout',
		'type' => 'select',
		'std' => 'woocommercesitefull',
		'options' => array('woocommerceright'=>'Woocommerce Right Sidebar', 'woocommerceleft'=>'Woocommerce Left Sidebar', 'woocommercesitefull'=>'Woocommerce Full Width') );	
		
	$options[] = array(
		'name' => __('Testimonials Single Layout', 'yogic-pro'),
		'desc' => __('Select layout. eg:left,right,full', 'yogic-pro'),
		'id' => 'testimonialsinglelayout',
		'type' => 'select',
		'std' => 'sitefull',
		'options' => array('singleright'=>'Testimonials Single Right Sidebar', 'singleleft'=>'Testimonials Single Left Sidebar', 'sitefull'=>'Testimonials Single Full Width', 'nosidebar'=>'Testimonials Single No Sidebar') );	
	
	
	$options[] = array(	
		'name' => __('Testimonials Rotating Speed', 'yogic-pro'),	
		'desc' => __('manage testimonials rotating speed.', 'yogic-pro'),
		'id' => 'testimonialsrotatingspeed',
		'std' => '8000',
		'type' => 'text');	
		
	$options[] = array(		
		'desc' => __('True/False Auto play Testimonials.','yogic-pro'),
		'id' => 'testimonialsautoplay',
		'std' => 'true',
		'type' => 'select',
		'options' => array('true'=>'True', 'false'=>'False'));			
		

	//Layout Settings
	$options[] = array(
		'name' => __('Sections', 'yogic-pro'),
		'type' => 'heading');
	
	$options[] = array(	
		'name' => __('Top Three column Services Section', 'yogic-pro'),
		'desc'	=> __('first Services box for frontpage section','yogic-pro'),
		'id' 	=> 'box1',
		'type'	=> 'select',
		'options' => $options_pages,
	);
	
	$options[] = array(		
		'desc' => __('upload image for first box.', 'yogic-pro'),
		'id' => 'boximg1',
		'class' => '',
		'std'	=> '',
		'type' => 'upload');
	
	$options[] = array(	
		'desc'	=> __('Second Services box for frontpage section','yogic-pro'),
		'id' 	=> 'box2',
		'type'	=> 'select',
		'options' => $options_pages,
	);
	
	$options[] = array(		
		'desc' => __('upload image for second box.', 'yogic-pro'),
		'id' => 'boximg2',
		'class' => '',
		'std'	=> '',
		'type' => 'upload');
	
	$options[] = array(	
		'desc'	=> __('Third Services box for frontpage section','yogic-pro'),
		'id' 	=> 'box3',
		'type'	=> 'select',
		'options' => $options_pages,
	);
	
	$options[] = array(		
		'desc' => __('upload image for third box.', 'yogic-pro'),
		'id' => 'boximg3',
		'class' => '',
		'std'	=> '',
		'type' => 'upload');
	
	$options[] = array(	
		'desc'	=> __('Fourth Services box for frontpage section','yogic-pro'),
		'id' 	=> 'box4',
		'type'	=> 'select',
		'options' => $options_pages,
	);
	
	$options[] = array(		
		'desc' => __('upload image for fourth box.', 'yogic-pro'),
		'id' => 'boximg4',
		'class' => '',
		'std'	=> '',
		'type' => 'upload');
		
	$options[] = array(	
		'desc'	=> __('Fifth Services box for frontpage section','yogic-pro'),
		'id' 	=> 'box5',
		'type'	=> 'select',
		'options' => $options_pages,
	);
	
	$options[] = array(		
		'desc' => __('upload image for fifth box.', 'yogic-pro'),
		'id' => 'boximg5',
		'class' => '',
		'std'	=> '',
		'type' => 'upload');
		
	$options[] = array(	
		'desc'	=> __('Six Services box for frontpage section','yogic-pro'),
		'id' 	=> 'box6',
		'type'	=> 'select',
		'options' => $options_pages,
	);
	
	$options[] = array(		
		'desc' => __('upload image for six box.', 'yogic-pro'),
		'id' => 'boximg6',
		'class' => '',
		'std'	=> '',
		'type' => 'upload');
		
	$options[] = array(		
		'desc' => __('Select excerpt length for three column services section', 'yogic-pro'),
		'id' => 'pageboxexcerptlength',
		'std' => '20',
		'type' => 'text');	
		
	$options[] = array(		
		'desc' => __('change read more button for three column services section', 'yogic-pro'),
		'id' => 'pagereadmorebutton',
		'std' => 'Read More',
		'type' => 'text');		
		
	$options[] = array(			
		'desc'	=> __('Check to hide three column services section', 'yogic-pro'),
		'id'	=> 'hide3boxservicessection',
		'type'	=> 'checkbox',
		'std'	=> '');			
				
			
			
	//Section tab
	$options[] = array(
		'name' => __('Number of Sections', 'yogic-pro'),
		'desc' => __('Select number of sections', 'yogic-pro'),
		'id' => 'numsection',
		'type' => 'select',
		'std' => '11',
		'options' => array_combine(range(1,30), range(1,30)) );

	$numsecs = of_get_option( 'numsection', 11 );

	for( $n=1; $n<=$numsecs; $n++){
		$options[] = array(
			'desc' => __("<h3>Section ".$n."</h3>", 'yogic-pro'),
			'class' => 'toggle_title',
			'type' => 'info');
			
		
		$options[] = array(
			'name' => __('Section Title', 'yogic-pro'),
			'id' => 'sectiontitle'.$n,
			'std' => ( ( isset($section_text[$n]['section_title']) ) ? $section_text[$n]['section_title'] : '' ),
			'type' => 'text');

		$options[] = array(
			'name' => __('Section ID', 'yogic-pro'),
			'desc'	=> __('Enter your section ID here. SECTION ID MUST BE IN SMALL LETTERS ONLY AND DO NOT ADD SPACE OR SYMBOL.', 'yogic-pro'),
			'id' => 'menutitle'.$n,
			'std' => ( ( isset($section_text[$n]['menutitle']) ) ? $section_text[$n]['menutitle'] : '' ),
			'type' => 'text');

		$options[] = array(
			'name' => __('Section Background Color', 'yogic-pro'),
			'desc' => __('Select background color for section', 'yogic-pro'),
			'id' => 'sectionbgcolor'.$n,
			'std' => ( ( isset($section_text[$n]['bgcolor']) ) ? $section_text[$n]['bgcolor'] : '' ),
			'type' => 'color');
			
		$options[] = array(
			'name' => __('Background Image', 'yogic-pro'),
			'id' => 'sectionbgimage'.$n,
			'class' => '',
			'std' => ( ( isset($section_text[$n]['bgimage']) ) ? $section_text[$n]['bgimage'] : '' ),
			'type' => 'upload');

		$options[] = array(
			'name' => __('Section CSS Class', 'yogic-pro'),
			'desc' => __('Set class for this section.', 'yogic-pro'),
			'id' => 'sectionclass'.$n,
			'std' => ( ( isset($section_text[$n]['class']) ) ? $section_text[$n]['class'] : '' ),
			'type' => 'text');
			
		$options[] = array(
			'name'	=> __('Hide Section', 'yogic-pro'),
			'desc'	=> __('Check to hide this section', 'yogic-pro'),
			'id'	=> 'hidesec'.$n,
			'type'	=> 'checkbox',
			'std'	=> '');

		$options[] = array(
			'name' => __('Section Content', 'yogic-pro'),
			'id' => 'sectioncontent'.$n,
			'std' => ( ( isset($section_text[$n]['content']) ) ? $section_text[$n]['content'] : '' ),
			'type' => 'editor');
	}


	//SLIDER SETTINGS
	$options[] = array(
		'name' => __('Homepage Slider', 'yogic-pro'),
		'type' => 'heading');
		
	$options[] = array(
		'name' => __('Inner Page Banner', 'yogic-pro'),
		'desc' => __('Upload inner page banner for site', 'yogic-pro'),
		'id' => 'innerpagebanner',
		'class' => '',
		'std'	=> get_template_directory_uri()."/images/inner-banner.jpg",
		'type' => 'upload');
		
	//[qcld_hero id=2]	
	$options[] = array(
		'name' => __('Custom Slider Shortcode Area For Home Page', 'yogic-pro'),
		'desc' => __('Enter here your slider shortcode without php tag', 'yogic-pro'),
		'id' => 'customslider',
		'std' => '',
		'type' => 'textarea');		
		
	$options[] = array(
		'name' => __('Slider Effects and Timing', 'yogic-pro'),
		'desc' => __('Select slider effect.','yogic-pro'),
		'id' => 'slideefect',
		'std' => 'random',
		'type' => 'select',
		'options' => array('random'=>'Random', 'fade'=>'Fade', 'fold'=>'Fold', 'sliceDown'=>'Slide Down', 'sliceDownLeft'=>'Slide Down Left', 'sliceUp'=>'Slice Up', 'sliceUpLeft'=>'Slice Up Left', 'sliceUpDown'=>'Slice Up Down', 'sliceUpDownLeft'=>'Slice Up Down Left', 'slideInRight'=>'SlideIn Right', 'slideInLeft'=>'SlideIn Left', 'boxRandom'=>'Box Random', 'boxRain'=>'Box Rain', 'boxRainReverse'=>'Box Rain Reverse', 'boxRainGrow'=>'Box Rain Grow', 'boxRainGrowReverse'=>'Box Rain Grow Reverse' ));
		
	$options[] = array(
		'desc' => __('Animation speed should be multiple of 100.', 'yogic-pro'),
		'id' => 'slideanim',
		'std' => 500,
		'type' => 'text');
		
	$options[] = array(
		'desc' => __('Add slide pause time.', 'yogic-pro'),
		'id' => 'slidepause',
		'std' => 4000,
		'type' => 'text');
		
	$options[] = array(
		'name' => __('Slide Controllers', 'yogic-pro'),
		'desc' => __('Hide/Show Direction Naviagtion of slider.','yogic-pro'),
		'id' => 'slidenav',
		'std' => 'true',
		'type' => 'select',
		'options' => array('true'=>'Show', 'false'=>'Hide'));
		
	$options[] = array(
		'desc' => __('Hide/Show pager of slider.','yogic-pro'),
		'id' => 'slidepage',
		'std' => 'true',
		'type' => 'select',
		'options' => array('true'=>'Show', 'false'=>'Hide'));
		
	$options[] = array(
		'desc' => __('Pause Slide on Hover.','yogic-pro'),
		'id' => 'slidepausehover',
		'std' => 'false',
		'type' => 'select',
		'options' => array('true'=>'Yes', 'false'=>'No'));	
		
	$options[] = array(
		'name' => __('Slider Image 1', 'yogic-pro'),
		'desc' => __('First Slide', 'yogic-pro'),
		'id' => 'slide1',
		'class' => '',
		'std' => get_template_directory_uri()."/images/slides/slider1.jpg",
		'type' => 'upload');

	
	$options[] = array(
		'desc' => __('Title 1', 'yogic-pro'),
		'id' => 'slidetitle1',
		'std' => 'Meditation and Yoga',
		'type' => 'text');

	$options[] = array(
                'desc' => __('SubTitle 1', 'yogic-pro'),
                'id' => 'slidesubtitle1',
                'std' => 'Meditation and Yoga',
                'type' => 'text');
		
	$options[] = array(
		'desc' => __('Description or Tagline', 'yogic-pro'),
		'id' => 'slidedesc1',
		'std' => 'Donec in metus lectus. Integer vulputate porta elit, fringilla mollis mag luctus fringilla mollis mag luctus.',
		'type' => 'textarea');
		
	$options[] = array(
		'desc' => __('Read More Button Text', 'yogic-pro'),
		'id' => 'slidebutton1',
		'std' => 'Read More',
		'type' => 'text');	

	$options[] = array(
		'desc' => __('Slide Url for Read More Button', 'yogic-pro'),
		'id' => 'slideurl1',
		'std' => '#',
		'type' => 'text');		
		
	
	$options[] = array(
		'name' => __('Slider Image 2', 'yogic-pro'),
		'desc' => __('Second Slide', 'yogic-pro'),
		'class' => '',
		'id' => 'slide2',
		'std' => get_template_directory_uri()."/images/slides/slider2.jpg",
		'type' => 'upload');
		
	
	$options[] = array(
		'desc' => __('Title 2', 'yogic-pro'),
		'id' => 'slidetitle2',
		'std' => 'Stay Fit & Calm',
		'type' => 'text');

	 $options[] = array(
                'desc' => __('SubTitle 2', 'yogic-pro'),
                'id' => 'slidesubtitle2',
                'std' => 'Stay Fit & Calm',
                'type' => 'text');

	$options[] = array(
		'desc' => __('Description or Tagline', 'yogic-pro'),
		'id' => 'slidedesc2',
		'std' => 'Integer vulputate porta elit, fringilla mollis mag luctus vel. Donec in metus lectus. Integer vulputate porta elit.',
		'type' => 'textarea');	
		
	$options[] = array(
		'desc' => __('Read More Button Text', 'yogic-pro'),
		'id' => 'slidebutton2',
		'std' => 'Read More',
		'type' => 'text');			
		
	$options[] = array(
		'desc' => __('Slide Url for Read More Button', 'yogic-pro'),
		'id' => 'slideurl2',
		'std' => '#',
		'type' => 'text');	
	
	$options[] = array(
		'name' => __('Slider Image 3', 'yogic-pro'),
		'desc' => __('Third Slide', 'yogic-pro'),
		'id' => 'slide3',
		'class' => '',
		'std' => get_template_directory_uri()."/images/slides/slider3.jpg",
		'type' => 'upload');
		
	$options[] = array(
		'desc' => __('Title 3', 'yogic-pro'),
		'id' => 'slidetitle3',
		'std' => 'Yoga For Cool Mind',
		'type' => 'text');

	 $options[] = array(
                'desc' => __('SubTitle 3', 'yogic-pro'),
                'id' => 'slidesubtitle3',
                'std' => 'Stay Fit & Calm',
                'type' => 'text');
		
	$options[] = array(
		'desc' => __('Description or Tagline', 'yogic-pro'),
		'id' => 'slidedesc3',
		'std' => 'Fringilla mollis mag luctus fringilla mollis mag luctus. Donec in metus lectus Integer vulputate porta elit.',
		'type' => 'textarea');
		
	$options[] = array(
		'desc' => __('Read More Button Text', 'yogic-pro'),
		'id' => 'slidebutton3',
		'std' => 'Read More',
		'type' => 'text');			
		
	$options[] = array(
		'desc' => __('Slide Url for Read More Button', 'yogic-pro'),
		'id' => 'slideurl3',
		'std' => '#',
		'type' => 'text');	
	
	$options[] = array(
		'name' => __('Slider Image 4', 'yogic-pro'),
		'desc' => __('Third Slide', 'yogic-pro'),
		'id' => 'slide4',
		'class' => '',
		'std' => '',
		'type' => 'upload');
		
	$options[] = array(
		'desc' => __('Title 4', 'yogic-pro'),
		'id' => 'slidetitle4',
		'std' => '',
		'type' => 'text');

	$options[] = array(
                'desc' => __('SubTitle 4', 'yogic-pro'),
                'id' => 'slidesubtitle4',
                'std' => 'Stay Fit & Calm',
                'type' => 'text');
		
	$options[] = array(
		'desc' => __('Description or Tagline', 'yogic-pro'),
		'id' => 'slidedesc4',
		'std' => '',
		'type' => 'textarea');
		
	$options[] = array(
		'desc' => __('Read More Button Text', 'yogic-pro'),
		'id' => 'slidebutton4',
		'std' => '',
		'type' => 'text');			
		
	$options[] = array(
		'desc' => __('Slide Url for Read More Button', 'yogic-pro'),
		'id' => 'slideurl4',
		'std' => '',
		'type' => 'text');				
	
	$options[] = array(
		'name' => __('Slider Image 5', 'yogic-pro'),
		'desc' => __('Fifth Slide', 'yogic-pro'),
		'id' => 'slide5',
		'class' => '',
		'std' => '',
		'type' => 'upload');
		
	$options[] = array(
		'desc' => __('Title 5', 'yogic-pro'),
		'id' => 'slidetitle5',
		'std' => '',
		'type' => 'text');
		
	$options[] = array(
		'desc' => __('Description or Tagline', 'yogic-pro'),
		'id' => 'slidedesc5',
		'std' => '',
		'type' => 'textarea');
		
	$options[] = array(
		'desc' => __('Read More Button Text', 'yogic-pro'),
		'id' => 'slidebutton5',
		'std' => '',
		'type' => 'text');			
		
	$options[] = array(
		'desc' => __('Slide Url for Read More Button', 'yogic-pro'),
		'id' => 'slideurl5',
		'std' => '',
		'type' => 'text');
		
	$options[] = array(
		'name' => __('Slider Image 6', 'yogic-pro'),
		'desc' => __('Sixth Slide', 'yogic-pro'),
		'id' => 'slide6',
		'class' => '',
		'std' => '',
		'type' => 'upload');
		
	$options[] = array(
		'desc' => __('Title 6', 'yogic-pro'),
		'id' => 'slidetitle6',
		'std' => '',
		'type' => 'text');
		
	$options[] = array(
		'desc' => __('Description or Tagline', 'yogic-pro'),
		'id' => 'slidedesc6',
		'std' => '',
		'type' => 'textarea');
		
	$options[] = array(
		'desc' => __('Read More Button Text', 'yogic-pro'),
		'id' => 'slidebutton6',
		'std' => '',
		'type' => 'text');		
		
	$options[] = array(
		'desc' => __('Slide Url for Read More Button', 'yogic-pro'),
		'id' => 'slideurl6',
		'std' => '',
		'type' => 'text');
		
	$options[] = array(
		'name' => __('Slider Image 7', 'yogic-pro'),
		'desc' => __('Seventh Slide', 'yogic-pro'),
		'id' => 'slide7',
		'class' => '',
		'std' => '',
		'type' => 'upload');
		
	$options[] = array(
		'desc' => __('Title 7', 'yogic-pro'),
		'id' => 'slidetitle7',
		'std' => '',
		'type' => 'text');
		
	$options[] = array(
		'desc' => __('Description or Tagline', 'yogic-pro'),
		'id' => 'slidedesc7',
		'std' => '',
		'type' => 'textarea');
		
	$options[] = array(
		'desc' => __('Read More Button Text', 'yogic-pro'),
		'id' => 'slidebutton7',
		'std' => '',
		'type' => 'text');			
		
	$options[] = array(
		'desc' => __('Slide Url for Read More Button', 'yogic-pro'),
		'id' => 'slideurl7',
		'std' => '',
		'type' => 'text');
		
	$options[] = array(
		'name' => __('Slider Image 8', 'yogic-pro'),
		'desc' => __('Eighth Slide', 'yogic-pro'),
		'id' => 'slide8',
		'class' => '',
		'std' => '',
		'type' => 'upload');

		
	$options[] = array(
		'desc' => __('Title 8', 'yogic-pro'),
		'id' => 'slidetitle8',
		'std' => '',
		'type' => 'text');
		
	$options[] = array(
		'desc' => __('Description or Tagline', 'yogic-pro'),
		'id' => 'slidedesc8',
		'std' => '',
		'type' => 'textarea');
		
	$options[] = array(
		'desc' => __('Read More Button Text', 'yogic-pro'),
		'id' => 'slidebutton8',
		'std' => '',
		'type' => 'text');		
		
	$options[] = array(
		'desc' => __('Slide Url for Read More Button', 'yogic-pro'),
		'id' => 'slideurl8',
		'std' => '',
		'type' => 'text');
		
	$options[] = array(
		'name' => __('Slider Image 9', 'yogic-pro'),
		'desc' => __('Ninth Slide', 'yogic-pro'),
		'id' => 'slide9',
		'class' => '',
		'std' => '',
		'type' => 'upload');
		
	$options[] = array(
		'desc' => __('Title 9', 'yogic-pro'),
		'id' => 'slidetitle9',
		'std' => '',
		'type' => 'text');
		
	$options[] = array(
		'desc' => __('Description or Tagline', 'yogic-pro'),
		'id' => 'slidedesc9',
		'std' => '',
		'type' => 'textarea');
		
	$options[] = array(
		'desc' => __('Read More Button Text', 'yogic-pro'),
		'id' => 'slidebutton9',
		'std' => '',
		'type' => 'text');			
		
	$options[] = array(
		'desc' => __('Slide Url for Read More Button', 'yogic-pro'),
		'id' => 'slideurl9',
		'std' => '',
		'type' => 'text');
		
	$options[] = array(
		'name' => __('Slider Image 10', 'yogic-pro'),
		'desc' => __('Tenth Slide', 'yogic-pro'),
		'id' => 'slide10',
		'class' => '',
		'std' => '',
		'type' => 'upload');
		
	$options[] = array(
		'desc' => __('Title 10', 'yogic-pro'),
		'id' => 'slidetitle10',
		'std' => '',
		'type' => 'text');
		
	$options[] = array(
		'desc' => __('Description or Tagline', 'yogic-pro'),
		'id' => 'slidedesc10',
		'std' => '',
		'type' => 'textarea');
		
	$options[] = array(
		'desc' => __('Read More Button Text', 'yogic-pro'),
		'id' => 'slidebutton10',
		'std' => '',
		'type' => 'text');			
	
	$options[] = array(
		'desc' => __('Slide Url for Read More Button', 'yogic-pro'),
		'id' => 'slideurl10',
		'std' => '',
		'type' => 'text');
	

	//Footer SETTINGS
	$options[] = array(
		'name' => __('Footer', 'yogic-pro'),
		'type' => 'heading');
		
	$options[] = array(
		'name' => __('Footer Layout', 'yogic-pro'),
		'desc' => __('footer Select layout. eg:Column, 1, 2, 3 and 4', 'yogic-pro'),
		'id' => 'footerlayout',
		'type' => 'select',
		'std' => 'fourcolumn',
		'options' => array('onecolumn'=>'Footer 1 column', 'twocolumn'=>'Footer 2 column', 'threecolumn'=>'Footer 3 column', 'fourcolumn'=>'Footer 4 column', ) );			

	
	$options[] = array(
		'name' => __('Footer About company Title', 'yogic-pro'),
		'desc' => __('about company title for footer', 'yogic-pro'),
		'id' => 'abouttitle',
		'std' => 'About Company',
		'type' => 'text');
		
	$options[] = array(
		'name' => __('About company Description', 'yogic-pro'),
		'desc' => __('about company description for footer', 'yogic-pro'),
		'id' => 'aboutusdescription',
		'std' => 'Proin luctus libero nec bibendum cursus. Suspendisse tempor cong condimentum. In et porta nibh. Sonsequat tortor mattis vehicula vehicula luctus libero bibendum cursus. Suspendis congue condimentum. In et portan. Sed consequat tortor mattis vehicula vehicula luctus libero bibendum cursus. Suspendis congue condimentum. In et porta nibh consequat.',
		'type' => 'textarea');
	
	$options[] = array(
		'name' => __('Yoga Classes', 'yogic-pro'),
		'desc' => __('Footer Yoga Classes title.', 'yogic-pro'),
		'id' => 'classestitle',
		'std' => 'Yoga Classes',
		'type' => 'text');	
		
	$options[] = array(
		'name' => __('Footer Quick links Title', 'yogic-pro'),
		'desc' => __('footer quick links title.', 'yogic-pro'),
		'id' => 'quicklinktitle',
		'std' => 'Quick Links',
		'type' => 'text');	
		
	$options[] = array(
		'name' => __('Footer Contact Info', 'yogic-pro'),
		'desc' => __('Add footer contact info title here', 'yogic-pro'),
		'id' => 'contacttitle',
		'std' => 'Contact info',
		'type' => 'text');	
		
	$options[] = array(	
		'desc' => __('Add company address here.', 'yogic-pro'),
		'id' => 'address',
		'std' => 'Peachtree Center Ave De, Atlanta, Fake Address, USA',
		'type' => 'textarea');	

	$options[] = array(
                'desc' => __('Add company gmap address here.', 'yogic-pro'),
                'id' => 'addgmap',
                'std' => 'google map address link',
                'type' => 'text');

	$options[] = array(	
		'desc' => __('Add company address here.', 'yogic-pro'),
		'id' => 'address2',
		'std' => 'Peachtree Center Ave De, Atlanta, Fake Address, USA',
		'type' => 'textarea');	

	$options[] = array(
                'desc' => __('Add company gmap address here.', 'yogic-pro'),
                'id' => 'addgmap2',
                'std' => 'google map addre link',
                'type' => 'text');

	$options[] = array(	
		'desc' => __('Add company address here.', 'yogic-pro'),
		'id' => 'address3',
		'std' => 'Peachtree Center Ave De, Atlanta, Fake Address, USA',
		'type' => 'textarea');	

	$options[] = array(
                'desc' => __('Add company gmap address here.', 'yogic-pro'),
                'id' => 'addgmap3',
                'std' => 'google map addre link',
                'type' => 'text');

	$options[] = array(
		'desc' => __('Add email address here.', 'yogic-pro'),
		'id' => 'email',
		'std' => 'info@sitename.com',
		'type' => 'text');
		
	$options[] = array(		
		'desc' => __('Add phone number here.', 'yogic-pro'),
		'id' => 'phone',
		'std' => '345-677-554',
		'type' => 'text');	
		
	$options[] = array(		
		'desc' => __('Add website here.', 'yogic-pro'),
		'id' => 'website',
		'std' => 'http://sitename.com',
		'type' => 'text');
		
	$options[] = array(
		'name' => __('Footer Social Icons', 'yogic-pro'),
		'desc' => __('social icons for footer', 'yogic-pro'),
		'id' => 'footersocialicon',
		'std' => '[social_area]
[social icon="fab fa-facebook-f" link="#"]
[social icon="fab fa-twitter" link="#" class="odd"]
[social icon="fab fa-linkedin" link="#"]
[social icon="fab fa-youtube" link="#" class="odd"]
[social icon="fab fa-instagram" link="#"]
[clear]				
[/social_area]',
		'type' => 'textarea');			
	
		
	$options[] = array(
		'name' => __('Footer Copyright', 'yogic-pro'),
		'desc' => __('Copyright Text for your site.', 'yogic-pro'),
		'id' => 'copytext',
		'std' => 'Copyright &copy; 2023. All rights reserved',
		'type' => 'textarea');
		
	$options[] = array(
		'desc' => __('Footer Text Link', 'yogic-pro'),
		'id' => 'ftlink',
		'std' => 'Design by <a href="'.esc_url('https://gracethemes.com').'" target="_blank">Grace Themes</a>',
		'type' => 'textarea',);
		
	$options[] = array(
		'desc' => __('Footer Back to Top Button', 'yogic-pro'),
		'id' => 'backtotop',
		'std' => '[back-to-top]',
		'type' => 'textarea',);

	//Short codes
	$options[] = array(
		'name' => __('Short Codes', 'yogic-pro'),
		'type' => 'heading');
	
		
	$options[] = array(
		'name' => __('Welcome Sections', 'yogic-pro'),
		'desc' => __('[welcome_sevices title="title here" description="short description here" image="image url with http://" ]<br />
		[welcome_sevices subtitle="subtitle here"  title="title here" description="short description here" image="image url with http://"]<br />
		[welcome_sevices subtitle="subtitle here"  title="title here" description="short description here" image="image url with http://"]', 'yogic-pro'),
		'type' => 'info');
		
		
	$options[] = array(
		'name' => __('Benefits of Yoga', 'yogic-pro'),
		'desc' => __('[benefit_yoga title="Enter title here" icon="image url with http://" link="#"]<br />
		[benefit_yoga title="Enter title here" icon="image url with http://" link="#"]<br />
		[benefit_yoga title="Enter title here" icon="image url with http://" link="#"]<br />
		[benefit_yoga title="Enter title here" icon="image url with http://" link="#"]', 'yogic-pro'),
		'type' => 'info');
		
	$options[] = array(
		'name' => __('Our Classes', 'yogic-pro'),
		'desc' => __('[our_classes title="enter  title here" date="date here" time="enter time here" description="short desciption here" image="image url with http://" link="#"]<br />
		[our_classes title="enter  title here" date="date here" time="enter time here" description="short desciption here" image="image url with http://" link="#"]<br />
		[our_classes title="enter  title here" date="date here" time="enter time here" description="short desciption here" image="image url with http://" link="#"]', 'yogic-pro'),
		'type' => 'info');	
		
	$options[] = array(
		'name' => __('Features Services', 'yogic-pro'),
		'desc' => __('[features_sevices icon="image url with http://" title="enter title here" description="short description here"]<br />
		[features_sevices icon="image url with http://" title="enter title here" description="short description here"]<br />
		[features_sevices icon="image url with http://" title="enter title here" description="short description here"]', 'yogic-pro'),
		'type' => 'info');
		
	$options[] = array(
		'name' => __('Our Instructors', 'yogic-pro'),
		'desc' => __('[our-team show="-1"]', 'yogic-pro'),
		'type' => 'info');
		
	$options[] = array(
		'name' => __('What Others Say', 'yogic-pro'),
		'desc' => __('[testimonials]', 'yogic-pro'),
		'type' => 'info');								
		
	$options[] = array(
		'name' => __('Custom Video', 'yogic-pro'),
		'desc' => __('[custom-video youtubeid="GRcOhbNG8vo" cover="enter here cover photo with http://"]', 'yogic-pro'),
		'type' => 'info');	
		
	$options[] = array(
		'name' => __('Counter', 'yogic-pro'),
		'desc' => __('[counter value="enter here counter value" title="enter here title" description="short description here"]<br />
		[counter value="enter here counter value" title="enter here title" description="short description here"]<br /><br />
		[counter value="enter here counter value" title="enter here title" description="short description here"]<br /><br />
		[counter value="enter here counter value" title="enter here title" description="short description here"]<br />', 'yogic-pro'),
		'type' => 'info');	
		
	$options[] = array(
		'name' => __('Partners Logo', 'yogic-pro'),
		'desc' => __('[client_lists]<br />
		[client image="logo image url with http://" title="Title here" link="#"]<br />
		[client image="logo image url with http://" title="Title here" link="#"]<br />
		[client image="logo image url with http://" title="Title here" link="#"]<br />
		[client image="logo image url with http://" title="Title here" link="#"]<br />
		[/client_lists]', 'yogic-pro'),
		'type' => 'info');		
						
		
	$options[] = array(
		'name' => __('Section Main Title', 'yogic-pro'),
		'desc' => __('[section-main-title align="" title="enter title here"]', 'yogic-pro'),
		'type' => 'info');	
		
	$options[] = array(
		'name' => __('Photo Gallery', 'yogic-pro'),
		'desc' => __('[photogallery filter="false" show="8"]', 'yogic-pro'),
		'type' => 'info');				

		
	$options[] = array(
		'name' => __('All Testimonials Listing', 'yogic-pro'),
		'desc' => __('[testimonials-listing show="10"]', 'yogic-pro'),
		'type' => 'info');	
		
		
	$options[] = array(
		'name' => __('Contact Form', 'yogic-pro'),
		'desc' => __('[contactform to_email="test@example.com" title="Contact Form"] 
', 'yogic-pro'),
		'type' => 'info');	
		
	$options[] = array(
		'name' => __('Latest News', 'yogic-pro'),
		'desc' => __('[latest-news showposts="3" comment="show" date="show" author="show"]', 'yogic-pro'),
		'type' => 'info');	
	
		
	$options[] = array(
		'name' => __('Custom Button', 'yogic-pro'),
		'desc' => __('[button align="center" name="View Gallery" link="#" target=""]', 'yogic-pro'),
		'type' => 'info');		
		
	$options[] = array(
		'name' => __('Search Form', 'yogic-pro'),
		'desc' => __('[searchform]', 'yogic-pro'),
		'type' => 'info');
		
	$options[] = array(
		'name' => __('Social Icons ( Note: More social icons can be found at: https://fontawesome.com/icons)', 'yogic-pro'),
		'desc' => __('[social_area]<br />
			[social icon="fab fa-facebook-f" link="#"]<br />
			[social icon="fab fa-twitter" link="#"]<br />
			[social icon="fab fa-linkedin-in" link="#"]<br />
			[social icon="fab fa-google-plus-g" link="#"]<br />
		[/social_area]', 'yogic-pro'),
		'type' => 'info');	

	$options[] = array(
		'name' => __('2 Column Content', 'yogic-pro'),
		'desc' => __('<pre>
[column_content type="one_half"]
	Column 1 Content goes here...
[/column_content]

[column_content type="one_half_last"]
	Column 2 Content goes here...
[/column_content]
</pre>', 'yogic-pro'),
		'type' => 'info');	

	$options[] = array(
		'name' => __('3 Column Content', 'yogic-pro'),
		'desc' => __('<pre>
[column_content type="one_third"]
	Column 1 Content goes here...
[/column_content]

[column_content type="one_third"]
	Column 2 Content goes here...
[/column_content]

[column_content type="one_third_last"]
	Column 3 Content goes here...
[/column_content]
</pre>', 'yogic-pro'),
		'type' => 'info');	

	$options[] = array(
		'name' => __('4 Column Content', 'yogic-pro'),
		'desc' => __('<pre>
[column_content type="one_fourth"]
	Column 1 Content goes here...
[/column_content]

[column_content type="one_fourth"]
	Column 2 Content goes here...
[/column_content]

[column_content type="one_fourth"]
	Column 3 Content goes here...
[/column_content]

[column_content type="one_fourth_last"]
	Column 4 Content goes here...
[/column_content]
</pre>', 'yogic-pro'),
		'type' => 'info');	

	$options[] = array(
		'name' => __('5 Column Content', 'yogic-pro'),
		'desc' => __('<pre>
[column_content type="one_fifth"]
	Column 1 Content goes here...
[/column_content]

[column_content type="one_fifth"]
	Column 2 Content goes here...
[/column_content]

[column_content type="one_fifth"]
	Column 3 Content goes here...
[/column_content]

[column_content type="one_fifth"]
	Column 4 Content goes here...
[/column_content]

[column_content type="one_fifth_last"]
	Column 5 Content goes here...
[/column_content]
</pre>', 'yogic-pro'),
		'type' => 'info');	

	$options[] = array(
		'name' => __('Tabs', 'yogic-pro'),
		'desc' => __('<pre>
[tabs]
	[tab title="TAB TITLE 1"]
		TAB CONTENT 1
	[/tab]
	[tab title="TAB TITLE 2"]
		TAB CONTENT 2
	[/tab]
	[tab title="TAB TITLE 3"]
		TAB CONTENT 3
	[/tab]
[/tabs]
</pre>', 'yogic-pro'),
		'type' => 'info');


	$options[] = array(
		'name' => __('Toggle Content', 'yogic-pro'),
		'desc' => __('<pre>
[toggle_content title="Toggle Title 1"]
	Toggle content 1...
[/toggle_content]
[toggle_content title="Toggle Title 2"]
	Toggle content 2...
[/toggle_content]
[toggle_content title="Toggle Title 3"]
	Toggle content 3...
[/toggle_content]
</pre>', 'yogic-pro'),
		'type' => 'info');


	$options[] = array(
		'name' => __('Accordion Content', 'yogic-pro'),
		'desc' => __('<pre>
[accordion]
	[accordion_content title="ACCORDION TITLE 1"]
		ACCORDION CONTENT 1
	[/accordion_content]
	[accordion_content title="ACCORDION TITLE 2"]
		ACCORDION CONTENT 2
	[/accordion_content]
	[accordion_content title="ACCORDION TITLE 3"]
		ACCORDION CONTENT 3
	[/accordion_content]
[/accordion]
</pre>', 'yogic-pro'),
		'type' => 'info');
		
	$options[] = array(
		'name' => __('Clear', 'yogic-pro'),
		'desc' => __('<pre>
[clear]
</pre>', 'yogic-pro'),
		'type' => 'info');	

	$options[] = array(
		'name' => __('HR / Horizontal separation line', 'yogic-pro'),
		'desc' => __('<pre>
[hr] or &lt;hr&gt;
</pre>', 'yogic-pro'),
		'type' => 'info');
		
	$options[] = array(
		'name' => __('Subtitle', 'yogic-pro'),
		'desc' => __('[subtitle color="#111111" size="15px" align="" description="short descriptio here"]', 'yogic-pro'),
		'type' => 'info');	
	
	$options[] = array(
		'name' => __('Scroll to Top', 'yogic-pro'),
		'desc' => __('[back-to-top] 
', 'yogic-pro'),
		'type' => 'info');

	return $options;
}