export interface HeritageProperty {
  id: string
  name: string
  county: string
  type: PropertyType
  description?: string
  visited: boolean
  visitDate?: string
  notes?: string
  imageUrl?: string
}

export type PropertyType =
  | "Castle"
  | "Abbey"
  | "Priory"
  | "Church"
  | "Roman fort"
  | "Roman villa"
  | "Country House"
  | "Palace"
  | "Manor house"
  | "Megalithic tomb"
  | "Stone circle"
  | "Henge"
  | "Hillfort"
  | "Device Fort"
  | "Tower"
  | "Bridge"
  | "Village"
  | "Amphitheatre"
  | "Wall"
  | "Gatehouse"
  | "Other"

export const HERITAGE_PROPERTIES: HeritageProperty[] = [
  // Bedfordshire (4 properties)
  {
    id: "bed-1",
    name: "Bushmead Priory",
    county: "Bedfordshire",
    type: "Priory",
    visited: false,
    description:
      "A medieval Augustinian priory founded in the 12th century, featuring well-preserved refectory and other monastic buildings.",
  },
  {
    id: "bed-2",
    name: "De Grey Mausoleum",
    county: "Bedfordshire",
    type: "Other",
    visited: false,
    description: "An 18th-century mausoleum built for the de Grey family, showcasing neoclassical architecture.",
  },
  {
    id: "bed-3",
    name: "Houghton House",
    county: "Bedfordshire",
    type: "Country House",
    visited: false,
    description:
      "A 17th-century mansion ruins, once known as the 'English Versailles', built for the Countess of Pembroke.",
  },
  {
    id: "bed-4",
    name: "Wrest Park House and Gardens",
    county: "Bedfordshire",
    type: "Country House",
    visited: false,
    description:
      "An 18th-century mansion with spectacular formal gardens, featuring a French-style château and landscaped grounds.",
  },

  // Berkshire (1 property)
  {
    id: "ber-1",
    name: "Donnington Castle",
    county: "Berkshire",
    type: "Castle",
    visited: false,
    description:
      "A 14th-century castle built by Sir Richard Abberbury, featuring twin-towered gatehouse that survived the English Civil War.",
  },

  // Bristol (1 property)
  {
    id: "bri-1",
    name: "Temple Church",
    county: "Bristol",
    type: "Church",
    visited: false,
    description:
      "A medieval church built by the Knights Templar in the 12th century, featuring a distinctive leaning tower.",
  },

  // Cambridgeshire (4 properties)
  { id: "cam-1", name: "Denny Abbey and Farmland Museum", county: "Cambridgeshire", type: "Abbey", visited: false },
  { id: "cam-2", name: "Duxford Chapel", county: "Cambridgeshire", type: "Church", visited: false },
  { id: "cam-3", name: "Isleham Priory Church", county: "Cambridgeshire", type: "Church", visited: false },
  { id: "cam-4", name: "Longthorpe Tower", county: "Cambridgeshire", type: "Tower", visited: false },

  // Cheshire (4 properties)
  { id: "che-1", name: "Beeston Castle", county: "Cheshire", type: "Castle", visited: false },
  {
    id: "che-2",
    name: "Chester Castle: Agricola Tower and Castle Walls",
    county: "Cheshire",
    type: "Castle",
    visited: false,
  },
  { id: "che-3", name: "Chester Roman Amphitheatre", county: "Cheshire", type: "Amphitheatre", visited: false },
  { id: "che-4", name: "Sandbach Crosses", county: "Cheshire", type: "Other", visited: false },

  // Cornwall (17 properties)
  { id: "cor-1", name: "Ballowall Barrow", county: "Cornwall", type: "Megalithic tomb", visited: false },
  { id: "cor-2", name: "Carn Euny Ancient Village", county: "Cornwall", type: "Village", visited: false },
  { id: "cor-3", name: "Chysauster Ancient Village", county: "Cornwall", type: "Village", visited: false },
  { id: "cor-4", name: "Dupath Well", county: "Cornwall", type: "Other", visited: false },
  { id: "cor-5", name: "Halliggye Fogou", county: "Cornwall", type: "Other", visited: false },
  { id: "cor-6", name: "Hurlers Stone Circles", county: "Cornwall", type: "Stone circle", visited: false },
  { id: "cor-7", name: "King Doniert's Stone", county: "Cornwall", type: "Other", visited: false },
  { id: "cor-8", name: "Launceston Castle", county: "Cornwall", type: "Castle", visited: false },
  { id: "cor-9", name: "Pendennis Castle", county: "Cornwall", type: "Device Fort", visited: false },
  { id: "cor-10", name: "Penhallam", county: "Cornwall", type: "Manor house", visited: false },
  { id: "cor-11", name: "Restormel Castle", county: "Cornwall", type: "Castle", visited: false },
  { id: "cor-12", name: "St Breock Downs Monolith", county: "Cornwall", type: "Other", visited: false },
  { id: "cor-13", name: "St Catherine's Castle", county: "Cornwall", type: "Device Fort", visited: false },
  { id: "cor-14", name: "St Mawes Castle", county: "Cornwall", type: "Device Fort", visited: false },
  {
    id: "cor-15",
    name: "Tintagel Castle",
    county: "Cornwall",
    type: "Castle",
    visited: false,
    description:
      "A 13th-century medieval fortification built by Richard, Earl of Cornwall, on a site with early medieval settlement. Legendary birthplace of King Arthur, perched dramatically on Cornwall's rugged coastline.",
  },
  { id: "cor-16", name: "Tregiffian Burial Chamber", county: "Cornwall", type: "Megalithic tomb", visited: false },
  { id: "cor-17", name: "Trethevy Quoit", county: "Cornwall", type: "Megalithic tomb", visited: false },

  // Cumbria (27 properties)
  { id: "cum-1", name: "Ambleside Roman Fort", county: "Cumbria", type: "Roman fort", visited: false },
  { id: "cum-2", name: "Bow Bridge", county: "Cumbria", type: "Bridge", visited: false },
  { id: "cum-3", name: "Brough Castle", county: "Cumbria", type: "Castle", visited: false },
  { id: "cum-4", name: "Brougham Castle", county: "Cumbria", type: "Castle", visited: false },
  { id: "cum-5", name: "Carlisle Castle", county: "Cumbria", type: "Castle", visited: false },
  { id: "cum-6", name: "Castlerigg Stone Circle", county: "Cumbria", type: "Stone circle", visited: false },
  { id: "cum-7", name: "Clifton Hall", county: "Cumbria", type: "Manor house", visited: false },
  { id: "cum-8", name: "Countess Pillar", county: "Cumbria", type: "Other", visited: false },
  { id: "cum-9", name: "Furness Abbey", county: "Cumbria", type: "Abbey", visited: false },
  { id: "cum-10", name: "Hadrian's Wall: Banks East Turret", county: "Cumbria", type: "Other", visited: false },
  {
    id: "cum-11",
    name: "Hadrian's Wall: Birdoswald Roman Fort",
    county: "Cumbria",
    type: "Roman fort",
    visited: false,
  },
  { id: "cum-12", name: "Hadrian's Wall: Hare Hill", county: "Cumbria", type: "Wall", visited: false },
  {
    id: "cum-13",
    name: "Hadrian's Wall: Harrows Scar Milecastle and Wall",
    county: "Cumbria",
    type: "Wall",
    visited: false,
  },
  { id: "cum-14", name: "Hadrian's Wall: Poltross Burn Milecastle", county: "Cumbria", type: "Other", visited: false },
  {
    id: "cum-15",
    name: "Hadrian's Wall: Leahill Turret and Piper Sike Turret",
    county: "Cumbria",
    type: "Other",
    visited: false,
  },
  { id: "cum-16", name: "Hadrian's Wall: Pike Hill Signal Tower", county: "Cumbria", type: "Tower", visited: false },
  {
    id: "cum-17",
    name: "Hadrian's Wall: Willowford Wall, Turrets and Bridge",
    county: "Cumbria",
    type: "Wall",
    visited: false,
  },
  { id: "cum-18", name: "Hardknott Roman Fort", county: "Cumbria", type: "Roman fort", visited: false },
  { id: "cum-19", name: "King Arthur's Round Table", county: "Cumbria", type: "Henge", visited: false },
  { id: "cum-20", name: "Lanercost Priory", county: "Cumbria", type: "Priory", visited: false },
  { id: "cum-21", name: "Mayburgh Henge", county: "Cumbria", type: "Henge", visited: false },
  { id: "cum-22", name: "Penrith Castle", county: "Cumbria", type: "Castle", visited: false },
  { id: "cum-23", name: "Piel Castle", county: "Cumbria", type: "Castle", visited: false },
  { id: "cum-24", name: "Ravenglass Roman Bath House", county: "Cumbria", type: "Other", visited: false },
  { id: "cum-25", name: "Shap Abbey", county: "Cumbria", type: "Abbey", visited: false },
  { id: "cum-26", name: "Stott Park Bobbin Mill", county: "Cumbria", type: "Other", visited: false },
  { id: "cum-27", name: "Wetheral Priory Gatehouse", county: "Cumbria", type: "Gatehouse", visited: false },

  // Derbyshire (9 properties)
  {
    id: "der-1",
    name: "Arbor Low Stone Circle and Gib Hill Barrow",
    county: "Derbyshire",
    type: "Stone circle",
    visited: false,
  },
  {
    id: "der-2",
    name: "Bolsover Castle",
    county: "Derbyshire",
    type: "Castle",
    visited: false,
    description:
      "Built between 1612 and 1617 by Sir Charles Cavendish, it stands on the earthworks of a 12th-century medieval castle. Designed by Robert Smythson, it's a masterpiece of Jacobean architecture.",
  },
  { id: "der-3", name: "Bolsover Cundy House", county: "Derbyshire", type: "Other", visited: false },
  { id: "der-4", name: "Hardwick Hall", county: "Derbyshire", type: "Country House", visited: false },
  { id: "der-5", name: "Hob Hurst's House", county: "Derbyshire", type: "Other", visited: false },
  { id: "der-6", name: "Nine Ladies Stone Circle", county: "Derbyshire", type: "Stone circle", visited: false },
  { id: "der-7", name: "Peveril Castle", county: "Derbyshire", type: "Castle", visited: false },
  { id: "der-8", name: "Sutton Scarsdale Hall", county: "Derbyshire", type: "Country House", visited: false },
  { id: "der-9", name: "Wingfield Manor", county: "Derbyshire", type: "Manor house", visited: false },

  // Devon (13 properties)
  { id: "dev-1", name: "Bayard's Cove Fort", county: "Devon", type: "Device Fort", visited: false },
  { id: "dev-2", name: "Berry Pomeroy Castle", county: "Devon", type: "Castle", visited: false },
  { id: "dev-3", name: "Blackbury Camp", county: "Devon", type: "Hillfort", visited: false },
  { id: "dev-4", name: "Dartmouth Castle", county: "Devon", type: "Device Fort", visited: false },
  { id: "dev-5", name: "Grimspound", county: "Devon", type: "Village", visited: false },
  { id: "dev-6", name: "Hound Tor Deserted Medieval Village", county: "Devon", type: "Village", visited: false },
  { id: "dev-7", name: "Kirkham House", county: "Devon", type: "Other", visited: false },
  { id: "dev-8", name: "Lydford Castle and Saxon Town", county: "Devon", type: "Castle", visited: false },
  { id: "dev-9", name: "Merrivale Prehistoric Settlement", county: "Devon", type: "Village", visited: false },
  { id: "dev-10", name: "Okehampton Castle", county: "Devon", type: "Castle", visited: false },
  { id: "dev-11", name: "Royal Citadel, Plymouth", county: "Devon", type: "Other", visited: false },
  { id: "dev-12", name: "Totnes Castle", county: "Devon", type: "Castle", visited: false },
  { id: "dev-13", name: "Upper Plym Valley", county: "Devon", type: "Other", visited: false },

  // Dorset (12 properties)
  { id: "dor-1", name: "Abbotsbury Abbey", county: "Dorset", type: "Abbey", visited: false },
  { id: "dor-2", name: "Christchurch Castle & Norman House", county: "Dorset", type: "Castle", visited: false },
  { id: "dor-3", name: "Fiddleford Manor", county: "Dorset", type: "Manor house", visited: false },
  { id: "dor-4", name: "Jordan Hill Roman Temple", county: "Dorset", type: "Other", visited: false },
  { id: "dor-5", name: "Kingston Russell Stone Circle", county: "Dorset", type: "Stone circle", visited: false },
  { id: "dor-6", name: "Knowlton Church and Earthworks", county: "Dorset", type: "Church", visited: false },
  { id: "dor-7", name: "Maiden Castle", county: "Dorset", type: "Hillfort", visited: false },
  { id: "dor-8", name: "Nine Stones, Winterbourne Abbas", county: "Dorset", type: "Stone circle", visited: false },
  { id: "dor-9", name: "Portland Castle", county: "Dorset", type: "Device Fort", visited: false },
  { id: "dor-10", name: "St Catherine's Chapel", county: "Dorset", type: "Church", visited: false },
  { id: "dor-11", name: "Sherborne Old Castle", county: "Dorset", type: "Castle", visited: false },
  { id: "dor-12", name: "Winterbourne Poor Lot Barrows", county: "Dorset", type: "Other", visited: false },

  // County Durham (6 properties)
  { id: "dur-1", name: "Auckland Castle Deer House", county: "County Durham", type: "Other", visited: false },
  { id: "dur-2", name: "Barnard Castle", county: "County Durham", type: "Castle", visited: false },
  { id: "dur-3", name: "Bowes Castle", county: "County Durham", type: "Castle", visited: false },
  { id: "dur-4", name: "Derwentcote Steel Furnace", county: "County Durham", type: "Other", visited: false },
  { id: "dur-5", name: "Egglestone Abbey", county: "County Durham", type: "Abbey", visited: false },
  { id: "dur-6", name: "Finchale Priory", county: "County Durham", type: "Priory", visited: false },

  // East Riding of Yorkshire (3 properties)
  {
    id: "ery-1",
    name: "Burton Agnes Manor House",
    county: "East Riding of Yorkshire",
    type: "Manor house",
    visited: false,
  },
  { id: "ery-2", name: "Howden Minster", county: "East Riding of Yorkshire", type: "Church", visited: false },
  { id: "ery-3", name: "Skipsea Castle", county: "East Riding of Yorkshire", type: "Castle", visited: false },

  // East Sussex (5 properties)
  { id: "ess-1", name: "Bayham Old Abbey", county: "East Sussex", type: "Abbey", visited: false },
  {
    id: "ess-2",
    name: "Battle Abbey",
    county: "East Sussex",
    type: "Abbey",
    visited: false,
    description:
      "A partially ruined abbey complex built on the scene of the Battle of Hastings in 1066. Founded by William the Conqueror to commemorate his victory, with the high altar marking the spot where King Harold fell.",
  },
  { id: "ess-3", name: "Battle of Hastings Battlefield", county: "East Sussex", type: "Other", visited: false },
  { id: "ess-4", name: "Camber Castle", county: "East Sussex", type: "Device Fort", visited: false },
  { id: "ess-5", name: "Pevensey Castle", county: "East Sussex", type: "Castle", visited: false },

  // Essex (9 properties)
  {
    id: "esx-1",
    name: "Audley End House",
    county: "Essex",
    type: "Country House",
    visited: false,
    description:
      "An early-17th-century country house, once a palace and now one-third of its original size. Built by Thomas Howard, 1st Earl of Suffolk, it was once one of the largest houses in England.",
  },
  { id: "esx-2", name: "Hadleigh Castle", county: "Essex", type: "Castle", visited: false },
  { id: "esx-3", name: "Lexden Earthworks and Bluebottle Grove", county: "Essex", type: "Other", visited: false },
  { id: "esx-4", name: "Mistley Towers", county: "Essex", type: "Other", visited: false },
  { id: "esx-5", name: "Prior's Hall Barn", county: "Essex", type: "Other", visited: false },
  { id: "esx-6", name: "St. Botolph's Priory", county: "Essex", type: "Priory", visited: false },
  { id: "esx-7", name: "St John's Abbey Gate, Colchester", county: "Essex", type: "Gatehouse", visited: false },
  {
    id: "esx-8",
    name: "Tilbury Fort",
    county: "Essex",
    type: "Device Fort",
    visited: false,
    description:
      "A Device Fort built in 1539 on the north bank of the River Thames to defend London from sea attacks. Famous as the site where Elizabeth I delivered her speech to troops before the Spanish Armada.",
  },
  { id: "esx-9", name: "Waltham Abbey Gatehouse and Bridge", county: "Essex", type: "Gatehouse", visited: false },

  // Gloucestershire (16 properties)
  { id: "glo-1", name: "Belas Knap Long Barrow", county: "Gloucestershire", type: "Megalithic tomb", visited: false },
  { id: "glo-2", name: "Blackfriars, Gloucester", county: "Gloucestershire", type: "Other", visited: false },
  { id: "glo-3", name: "Cirencester Amphitheatre", county: "Gloucestershire", type: "Amphitheatre", visited: false },
  { id: "glo-4", name: "Great Witcombe Roman Villa", county: "Gloucestershire", type: "Roman villa", visited: false },
  { id: "glo-5", name: "Greyfriars, Gloucester", county: "Gloucestershire", type: "Church", visited: false },
  { id: "glo-6", name: "Hailes Abbey", county: "Gloucestershire", type: "Abbey", visited: false },
  { id: "glo-7", name: "Kingswood Abbey Gatehouse", county: "Gloucestershire", type: "Gatehouse", visited: false },
  { id: "glo-8", name: "Notgrove Long Barrow", county: "Gloucestershire", type: "Megalithic tomb", visited: false },
  { id: "glo-9", name: "Nympsfield Long Barrow", county: "Gloucestershire", type: "Megalithic tomb", visited: false },
  { id: "glo-10", name: "Odda's Chapel", county: "Gloucestershire", type: "Church", visited: false },
  { id: "glo-11", name: "Offa's Dyke", county: "Gloucestershire", type: "Other", visited: false },
  { id: "glo-12", name: "Over Bridge", county: "Gloucestershire", type: "Bridge", visited: false },
  { id: "glo-13", name: "St Briavels Castle", county: "Gloucestershire", type: "Castle", visited: false },
  { id: "glo-14", name: "St Mary's Church, Kempley", county: "Gloucestershire", type: "Church", visited: false },
  { id: "glo-15", name: "Uley Long Barrow", county: "Gloucestershire", type: "Megalithic tomb", visited: false },
  { id: "glo-16", name: "Windmill Tump", county: "Gloucestershire", type: "Megalithic tomb", visited: false },

  // Hampshire (16 properties)
  { id: "ham-1", name: "Bishop's Waltham Palace", county: "Hampshire", type: "Palace", visited: false },
  { id: "ham-2", name: "Calshot Castle", county: "Hampshire", type: "Device Fort", visited: false },
  { id: "ham-3", name: "Flowerdown Barrows", county: "Hampshire", type: "Other", visited: false },
  { id: "ham-4", name: "Fort Brockhurst", county: "Hampshire", type: "Other", visited: false },
  { id: "ham-5", name: "Fort Cumberland", county: "Hampshire", type: "Other", visited: false },
  { id: "ham-6", name: "Hurst Castle", county: "Hampshire", type: "Device Fort", visited: false },
  {
    id: "ham-7",
    name: "King James's and Landport Gates, Portsmouth",
    county: "Hampshire",
    type: "Other",
    visited: false,
  },
  { id: "ham-8", name: "Medieval Merchant's House, Southampton", county: "Hampshire", type: "Other", visited: false },
  { id: "ham-9", name: "Netley Abbey", county: "Hampshire", type: "Abbey", visited: false },
  { id: "ham-10", name: "Portchester Castle", county: "Hampshire", type: "Castle", visited: false },
  {
    id: "ham-11",
    name: "Royal Garrison Church (Domus Dei), Portsmouth",
    county: "Hampshire",
    type: "Church",
    visited: false,
  },
  {
    id: "ham-12",
    name: "Silchester Roman City Walls and Amphitheatre",
    county: "Hampshire",
    type: "Wall",
    visited: false,
  },
  { id: "ham-13", name: "The Grange, Northington", county: "Hampshire", type: "Country House", visited: false },
  { id: "ham-14", name: "Titchfield Abbey", county: "Hampshire", type: "Abbey", visited: false },
  {
    id: "ham-15",
    name: "Wolvesey Castle (Old Bishop's Palace), Winchester",
    county: "Hampshire",
    type: "Castle",
    visited: false,
  },

  // Herefordshire (7 properties)
  { id: "her-1", name: "Arthur's Stone", county: "Herefordshire", type: "Megalithic tomb", visited: false },
  { id: "her-2", name: "Edvin Loach Old Church", county: "Herefordshire", type: "Church", visited: false },
  { id: "her-3", name: "Goodrich Castle", county: "Herefordshire", type: "Castle", visited: false },
  { id: "her-4", name: "Longtown Castle", county: "Herefordshire", type: "Castle", visited: false },
  { id: "her-5", name: "Mortimer's Cross Water Mill", county: "Herefordshire", type: "Other", visited: false },
  { id: "her-6", name: "Rotherwas Chapel", county: "Herefordshire", type: "Church", visited: false },
  { id: "her-7", name: "Wigmore Castle", county: "Herefordshire", type: "Castle", visited: false },

  // Hertfordshire (3 properties)
  { id: "hrt-1", name: "Berkhamsted Castle", county: "Hertfordshire", type: "Castle", visited: false },
  { id: "hrt-2", name: "Old Gorhambury House", county: "Hertfordshire", type: "Country House", visited: false },
  { id: "hrt-3", name: "St Albans Roman Wall", county: "Hertfordshire", type: "Wall", visited: false },

  // Isle of Wight (5 properties)
  { id: "iow-1", name: "Appuldurcombe House", county: "Isle of Wight", type: "Country House", visited: false },
  {
    id: "iow-2",
    name: "Carisbrooke Castle",
    county: "Isle of Wight",
    type: "Castle",
    visited: false,
    description:
      "An 11th-century motte-and-bailey castle with traces of a Roman fort underneath. Famous as the prison of Charles I before his execution, featuring a unique donkey-powered well wheel.",
  },
  {
    id: "iow-3",
    name: "Osborne House",
    county: "Isle of Wight",
    type: "Country House",
    visited: false,
    description:
      "A former royal residence built for Queen Victoria and Prince Albert between 1845 and 1851. Designed by Prince Albert in the style of an Italian Renaissance palazzo, it was the Queen's beloved retreat.",
  },
  { id: "iow-4", name: "St. Catherine's Oratory", county: "Isle of Wight", type: "Other", visited: false },
  { id: "iow-5", name: "Yarmouth Castle", county: "Isle of Wight", type: "Device Fort", visited: false },

  // Isles of Scilly (9 properties)
  {
    id: "ios-1",
    name: "Bant's Carn Burial Chamber",
    county: "Isles of Scilly",
    type: "Megalithic tomb",
    visited: false,
  },
  { id: "ios-2", name: "Cromwell's Castle", county: "Isles of Scilly", type: "Other", visited: false },
  { id: "ios-3", name: "Garrison Walls", county: "Isles of Scilly", type: "Other", visited: false },
  { id: "ios-4", name: "Halangy Down Ancient Village", county: "Isles of Scilly", type: "Village", visited: false },
  { id: "ios-5", name: "Harry's Walls", county: "Isles of Scilly", type: "Other", visited: false },
  {
    id: "ios-6",
    name: "Innisidgen Lower and Upper Burial Chambers",
    county: "Isles of Scilly",
    type: "Megalithic tomb",
    visited: false,
  },
  { id: "ios-7", name: "King Charles's Castle", county: "Isles of Scilly", type: "Other", visited: false },
  { id: "ios-8", name: "Old Blockhouse", county: "Isles of Scilly", type: "Other", visited: false },
  {
    id: "ios-9",
    name: "Porth Hellick Down Burial Chamber",
    county: "Isles of Scilly",
    type: "Megalithic tomb",
    visited: false,
  },

  // Kent (25 properties)
  { id: "ken-1", name: "Deal Castle", county: "Kent", type: "Device Fort", visited: false },
  {
    id: "ken-2",
    name: "Dover Castle",
    county: "Kent",
    type: "Castle",
    visited: false,
    description:
      "Founded in the 12th century, Dover Castle is known as the 'Key to England' due to its defensive significance. It's the largest castle in England, with a Great Tower built by Henry II and extensive medieval tunnels.",
  },
  { id: "ken-3", name: "Dymchurch Martello Tower", county: "Kent", type: "Tower", visited: false },
  { id: "ken-4", name: "Eynsford Castle", county: "Kent", type: "Castle", visited: false },
  { id: "ken-5", name: "Faversham Stone Chapel", county: "Kent", type: "Church", visited: false },
  { id: "ken-6", name: "Horne's Place Chapel", county: "Kent", type: "Church", visited: false },
  { id: "ken-7", name: "Kit's Coty House", county: "Kent", type: "Megalithic tomb", visited: false },
  { id: "ken-8", name: "Knights Templar Church, Dover", county: "Kent", type: "Church", visited: false },
  { id: "ken-9", name: "Little Kit's Coty House", county: "Kent", type: "Megalithic tomb", visited: false },
  { id: "ken-10", name: "Lullingstone Roman Villa", county: "Kent", type: "Roman villa", visited: false },
  { id: "ken-11", name: "Maison Dieu, Faversham", county: "Kent", type: "Other", visited: false },
  { id: "ken-12", name: "Milton Chantry, Gravesend", county: "Kent", type: "Church", visited: false },
  { id: "ken-13", name: "Old Soar Manor", county: "Kent", type: "Manor house", visited: false },
  { id: "ken-14", name: "Reculver Roman Fort and Reculver Towers", county: "Kent", type: "Roman fort", visited: false },
  { id: "ken-15", name: "Richborough Castle and Amphitheatre", county: "Kent", type: "Castle", visited: false },
  { id: "ken-16", name: "Rochester Castle", county: "Kent", type: "Castle", visited: false },
  { id: "ken-17", name: "St Augustine's Abbey", county: "Kent", type: "Abbey", visited: false },
  { id: "ken-18", name: "St Augustine's Conduit House", county: "Kent", type: "Other", visited: false },
  { id: "ken-19", name: "St Augustine's Cross", county: "Kent", type: "Other", visited: false },
  { id: "ken-20", name: "St John's Commandery", county: "Kent", type: "Priory", visited: false },
  { id: "ken-21", name: "St Leonard's Tower", county: "Kent", type: "Tower", visited: false },
  { id: "ken-22", name: "Sutton Valence Castle", county: "Kent", type: "Castle", visited: false },
  { id: "ken-23", name: "Temple Manor", county: "Kent", type: "Manor house", visited: false },
  { id: "ken-24", name: "Upnor Castle", county: "Kent", type: "Device Fort", visited: false },
  { id: "ken-25", name: "Walmer Castle", county: "Kent", type: "Device Fort", visited: false },
  { id: "ken-26", name: "Western Heights, Dover", county: "Kent", type: "Other", visited: false },

  // Lancashire (4 properties)
  { id: "lan-1", name: "Goodshaw Chapel", county: "Lancashire", type: "Church", visited: false },
  { id: "lan-2", name: "Sawley Abbey", county: "Lancashire", type: "Abbey", visited: false },
  { id: "lan-3", name: "Warton Old Rectory", county: "Lancashire", type: "Other", visited: false },
  { id: "lan-4", name: "Whalley Abbey Gatehouse", county: "Lancashire", type: "Gatehouse", visited: false },

  // Leicestershire (3 properties)
  { id: "lei-1", name: "Ashby de la Zouch Castle", county: "Leicestershire", type: "Castle", visited: false },
  { id: "lei-2", name: "Jewry Wall", county: "Leicestershire", type: "Wall", visited: false },
  { id: "lei-3", name: "Kirby Muxloe Castle", county: "Leicestershire", type: "Castle", visited: false },

  // Lincolnshire (8 properties)
  { id: "lin-1", name: "Bolingbroke Castle", county: "Lincolnshire", type: "Castle", visited: false },
  { id: "lin-2", name: "Gainsborough Old Hall", county: "Lincolnshire", type: "Manor house", visited: false },
  { id: "lin-3", name: "Gainsthorpe Medieval Village", county: "Lincolnshire", type: "Village", visited: false },
  { id: "lin-4", name: "Lincoln Medieval Bishop's Palace", county: "Lincolnshire", type: "Palace", visited: false },
  { id: "lin-5", name: "Sibsey Trader Windmill", county: "Lincolnshire", type: "Other", visited: false },
  {
    id: "lin-6",
    name: "St Peter's Church, Barton-upon-Humber",
    county: "Lincolnshire",
    type: "Church",
    visited: false,
  },
  { id: "lin-7", name: "Tattershall College", county: "Lincolnshire", type: "Other", visited: false },
  { id: "lin-8", name: "Thornton Abbey and Gatehouse", county: "Lincolnshire", type: "Abbey", visited: false },

  // London (14 properties)
  { id: "lon-1", name: "Apsley House", county: "London", type: "Other", visited: false },
  { id: "lon-2", name: "Chapter House and Pyx Chamber", county: "London", type: "Other", visited: false },
  { id: "lon-3", name: "Chiswick House", county: "London", type: "Other", visited: false },
  { id: "lon-4", name: "Coombe Conduit", county: "London", type: "Other", visited: false },
  {
    id: "lon-5",
    name: "Down House",
    county: "London",
    type: "Country House",
    visited: false,
    description:
      "The home of Charles Darwin from 1842 to 1882, where he wrote 'On the Origin of Species'. The house and gardens remain much as Darwin left them, including his famous 'thinking path'.",
  },
  { id: "lon-6", name: "Eltham Palace", county: "London", type: "Palace", visited: false },
  { id: "lon-7", name: "Harmondsworth Great Barn", county: "London", type: "Other", visited: false },
  { id: "lon-8", name: "Jewel Tower", county: "London", type: "Tower", visited: false },
  { id: "lon-9", name: "Kenwood House", county: "London", type: "Country House", visited: false },
  { id: "lon-10", name: "London Wall, Tower Hill", county: "London", type: "Wall", visited: false },
  { id: "lon-11", name: "Marble Hill House", county: "London", type: "Country House", visited: false },
  { id: "lon-12", name: "Ranger's House", county: "London", type: "Country House", visited: false },
  { id: "lon-13", name: "Wellington Arch", county: "London", type: "Other", visited: false },
  { id: "lon-14", name: "Winchester Palace", county: "London", type: "Palace", visited: false },

  // Norfolk (21 properties)
  { id: "nor-1", name: "Baconsthorpe Castle", county: "Norfolk", type: "Castle", visited: false },
  { id: "nor-2", name: "Berney Arms Windmill", county: "Norfolk", type: "Other", visited: false },
  { id: "nor-3", name: "Binham Market Cross", county: "Norfolk", type: "Other", visited: false },
  { id: "nor-4", name: "Binham Priory", county: "Norfolk", type: "Priory", visited: false },
  { id: "nor-5", name: "Blakeney Guildhall", county: "Norfolk", type: "Other", visited: false },
  { id: "nor-6", name: "Burgh Castle", county: "Norfolk", type: "Roman fort", visited: false },
  { id: "nor-7", name: "Caister Roman Fort", county: "Norfolk", type: "Roman fort", visited: false },
  { id: "nor-8", name: "Castle Acre Bailey Gate", county: "Norfolk", type: "Other", visited: false },
  { id: "nor-9", name: "Castle Acre Castle", county: "Norfolk", type: "Castle", visited: false },
  { id: "nor-10", name: "Castle Acre Priory", county: "Norfolk", type: "Priory", visited: false },
  { id: "nor-11", name: "Castle Rising Castle", county: "Norfolk", type: "Castle", visited: false },
  { id: "nor-12", name: "Cow Tower, Norwich", county: "Norfolk", type: "Tower", visited: false },
  { id: "nor-13", name: "Creake Abbey", county: "Norfolk", type: "Abbey", visited: false },
  { id: "nor-14", name: "Great Yarmouth Row Houses", county: "Norfolk", type: "Other", visited: false },
  { id: "nor-15", name: "Greyfriars' Cloisters, Great Yarmouth", county: "Norfolk", type: "Other", visited: false },
  { id: "nor-16", name: "Grimes Graves", county: "Norfolk", type: "Other", visited: false },
  { id: "nor-17", name: "North Elham Chapel", county: "Norfolk", type: "Church", visited: false },
  { id: "nor-18", name: "St Olave's Priory", county: "Norfolk", type: "Priory", visited: false },
  { id: "nor-19", name: "Thetford, Church of the Holy Sepulchre", county: "Norfolk", type: "Church", visited: false },
  { id: "nor-20", name: "Thetford Priory", county: "Norfolk", type: "Priory", visited: false },
  { id: "nor-21", name: "Thetford Warren Lodge", county: "Norfolk", type: "Other", visited: false },
  { id: "nor-22", name: "Weeting Castle", county: "Norfolk", type: "Castle", visited: false },

  // North Yorkshire (27 properties)
  { id: "ny-1", name: "Aldborough Roman Site", county: "North Yorkshire", type: "Other", visited: false },
  { id: "ny-2", name: "Beadlam Roman Villa", county: "North Yorkshire", type: "Roman villa", visited: false },
  { id: "ny-3", name: "Byland Abbey", county: "North Yorkshire", type: "Abbey", visited: false },
  { id: "ny-4", name: "Clifford's Tower", county: "North Yorkshire", type: "Tower", visited: false },
  { id: "ny-5", name: "Easby Abbey", county: "North Yorkshire", type: "Abbey", visited: false },
  {
    id: "ny-6",
    name: "Fountains Abbey",
    county: "North Yorkshire",
    type: "Abbey",
    visited: false,
    description:
      "A Cistercian monastery founded in 1132, it's one of the largest and best-preserved ruined Cistercian monasteries in England. The abbey features stunning Gothic architecture and beautiful water gardens.",
  },
  { id: "ny-7", name: "Gisborough Priory", county: "North Yorkshire", type: "Priory", visited: false },
  { id: "ny-8", name: "Helmsley Castle", county: "North Yorkshire", type: "Castle", visited: false },
  { id: "ny-9", name: "Kirkham Priory", county: "North Yorkshire", type: "Priory", visited: false },
  { id: "ny-10", name: "Marmion Tower", county: "North Yorkshire", type: "Tower", visited: false },
  { id: "ny-11", name: "Middleham Castle", county: "North Yorkshire", type: "Castle", visited: false },
  { id: "ny-12", name: "Mount Grace Priory", county: "North Yorkshire", type: "Priory", visited: false },
  { id: "ny-13", name: "Pickering Castle", county: "North Yorkshire", type: "Castle", visited: false },
  { id: "ny-14", name: "Piercebridge Roman Bridge", county: "North Yorkshire", type: "Bridge", visited: false },
  { id: "ny-15", name: "Richmond Castle", county: "North Yorkshire", type: "Castle", visited: false },
  { id: "ny-16", name: "Rievaulx Abbey", county: "North Yorkshire", type: "Abbey", visited: false },
  { id: "ny-17", name: "St Mary's Church, Studley Royal", county: "North Yorkshire", type: "Church", visited: false },
  { id: "ny-18", name: "Scarborough Castle", county: "North Yorkshire", type: "Castle", visited: false },
  { id: "ny-19", name: "Spofforth Castle", county: "North Yorkshire", type: "Castle", visited: false },
  {
    id: "ny-20",
    name: "Stanwick Iron Age Fortifications",
    county: "North Yorkshire",
    type: "Hillfort",
    visited: false,
  },
  { id: "ny-21", name: "Steeton Hall Gateway", county: "North Yorkshire", type: "Gatehouse", visited: false },
  { id: "ny-22", name: "Thornborough Henges", county: "North Yorkshire", type: "Henge", visited: false },
  {
    id: "ny-23",
    name: "Wharram Percy Deserted Medieval Village",
    county: "North Yorkshire",
    type: "Village",
    visited: false,
  },
  { id: "ny-24", name: "Wade's Causeway", county: "North Yorkshire", type: "Other", visited: false },
  { id: "ny-25", name: "Whitby Abbey", county: "North Yorkshire", type: "Abbey", visited: false },
  { id: "ny-26", name: "York Cold War Bunker", county: "North Yorkshire", type: "Other", visited: false },

  // Northamptonshire (5 properties)
  { id: "nth-1", name: "Apethorpe Hall", county: "Northamptonshire", type: "Country House", visited: false },
  { id: "nth-2", name: "Chichele College", county: "Northamptonshire", type: "Other", visited: false },
  { id: "nth-3", name: "Eleanor Cross, Geddington", county: "Northamptonshire", type: "Other", visited: false },
  { id: "nth-4", name: "Kirby Hall", county: "Northamptonshire", type: "Country House", visited: false },
  { id: "nth-5", name: "Rushton Triangular Lodge", county: "Northamptonshire", type: "Other", visited: false },

  // Northumberland (25 properties)
  { id: "nbl-1", name: "Aydon Castle", county: "Northumberland", type: "Castle", visited: false },
  { id: "nbl-2", name: "Belsay Hall, Castle & Gardens", county: "Northumberland", type: "Castle", visited: false },
  {
    id: "nbl-3",
    name: "Berwick-upon-Tweed Barracks & Main Guard",
    county: "Northumberland",
    type: "Other",
    visited: false,
  },
  {
    id: "nbl-4",
    name: "Berwick-upon-Tweed Castle & Berwick Ramparts",
    county: "Northumberland",
    type: "Castle",
    visited: false,
  },
  { id: "nbl-5", name: "Black Middens Bastle House", county: "Northumberland", type: "Manor house", visited: false },
  { id: "nbl-6", name: "Brinkburn Priory", county: "Northumberland", type: "Priory", visited: false },
  { id: "nbl-7", name: "Dunstanburgh Castle", county: "Northumberland", type: "Castle", visited: false },
  { id: "nbl-8", name: "Edlingham Castle", county: "Northumberland", type: "Castle", visited: false },
  { id: "nbl-9", name: "Etal Castle", county: "Northumberland", type: "Castle", visited: false },
  { id: "nbl-10", name: "Hadrian's Wall: Black Carts Turret", county: "Northumberland", type: "Other", visited: false },
  { id: "nbl-11", name: "Hadrian's Wall: Brunton Turret", county: "Northumberland", type: "Other", visited: false },
  {
    id: "nbl-12",
    name: "Hadrian's Wall: Cawfields Roman Wall",
    county: "Northumberland",
    type: "Wall",
    visited: false,
  },
  {
    id: "nbl-13",
    name: "Hadrian's Wall: Chesters Roman Fort and Chesters Bridge",
    county: "Northumberland",
    type: "Roman fort",
    visited: false,
  },
  {
    id: "nbl-14",
    name: "Hadrian's Wall: Corbridge Roman Town",
    county: "Northumberland",
    type: "Other",
    visited: false,
  },
  { id: "nbl-15", name: "Hadrian's Wall: Heddon-on-the-Wall", county: "Northumberland", type: "Wall", visited: false },
  {
    id: "nbl-16",
    name: "Hadrian's Wall: Housesteads Roman Fort",
    county: "Northumberland",
    type: "Roman fort",
    visited: false,
  },
  {
    id: "nbl-17",
    name: "Hadrian's Wall: Planetrees Roman Wall",
    county: "Northumberland",
    type: "Wall",
    visited: false,
  },
  { id: "nbl-18", name: "Hadrian's Wall: Sewingshields Wall", county: "Northumberland", type: "Wall", visited: false },
  {
    id: "nbl-19",
    name: "Hadrian's Wall: Temple of Mithras, Carrawburgh",
    county: "Northumberland",
    type: "Other",
    visited: false,
  },
  { id: "nbl-20", name: "Hadrian's Wall: Walltown Crags", county: "Northumberland", type: "Wall", visited: false },
  { id: "nbl-21", name: "Hadrian's Wall: Winshields Wall", county: "Northumberland", type: "Wall", visited: false },
  { id: "nbl-22", name: "Lindisfarne Priory", county: "Northumberland", type: "Priory", visited: false },
  { id: "nbl-23", name: "Norham Castle", county: "Northumberland", type: "Castle", visited: false },
  { id: "nbl-24", name: "Prudhoe Castle", county: "Northumberland", type: "Castle", visited: false },
  { id: "nbl-25", name: "Warkworth Castle", county: "Northumberland", type: "Castle", visited: false },
  { id: "nbl-26", name: "Warkworth Hermitage", county: "Northumberland", type: "Other", visited: false },

  // Nottinghamshire (2 properties)
  { id: "not-1", name: "Mattersey Priory", county: "Nottinghamshire", type: "Priory", visited: false },
  { id: "not-2", name: "Rufford Abbey", county: "Nottinghamshire", type: "Abbey", visited: false },

  // Oxfordshire (10 properties)
  { id: "oxf-1", name: "Abingdon County Hall Museum", county: "Oxfordshire", type: "Other", visited: false },
  { id: "oxf-2", name: "Deddington Castle", county: "Oxfordshire", type: "Castle", visited: false },
  { id: "oxf-3", name: "Minster Lovell Hall and Dovecote", county: "Oxfordshire", type: "Manor house", visited: false },
  { id: "oxf-4", name: "North Hinksey Conduit House", county: "Oxfordshire", type: "Other", visited: false },
  { id: "oxf-5", name: "North Leigh Roman Villa", county: "Oxfordshire", type: "Roman villa", visited: false },
  { id: "oxf-6", name: "Rollright Stones", county: "Oxfordshire", type: "Stone circle", visited: false },
  { id: "oxf-7", name: "Uffington Castle", county: "Oxfordshire", type: "Hillfort", visited: false },
  { id: "oxf-8", name: "Uffington: Dragon Hill", county: "Oxfordshire", type: "Other", visited: false },
  { id: "oxf-9", name: "Uffington White Horse", county: "Oxfordshire", type: "Other", visited: false },
  { id: "oxf-10", name: "Wayland's Smithy", county: "Oxfordshire", type: "Megalithic tomb", visited: false },

  // Rutland (1 property)
  { id: "rut-1", name: "Lyddington Bede House", county: "Rutland", type: "Other", visited: false },

  // Shropshire (16 properties)
  { id: "shr-1", name: "Acton Burnell Castle", county: "Shropshire", type: "Castle", visited: false },
  { id: "shr-2", name: "Boscobel House and The Royal Oak", county: "Shropshire", type: "Manor house", visited: false },
  { id: "shr-3", name: "Buildwas Abbey", county: "Shropshire", type: "Abbey", visited: false },
  { id: "shr-4", name: "Cantlop Bridge", county: "Shropshire", type: "Bridge", visited: false },
  { id: "shr-5", name: "Clun Castle", county: "Shropshire", type: "Castle", visited: false },
  { id: "shr-6", name: "Haughmond Abbey", county: "Shropshire", type: "Abbey", visited: false },
  {
    id: "shr-7",
    name: "Iron Bridge",
    county: "Shropshire",
    type: "Bridge",
    visited: false,
    description:
      "Constructed between 1777 and 1781, it was the first major bridge in the world to be made of cast iron. A symbol of the Industrial Revolution, it spans the River Severn in the Ironbridge Gorge.",
  },
  { id: "shr-8", name: "Langley Chapel", county: "Shropshire", type: "Church", visited: false },
  { id: "shr-9", name: "Lilleshall Abbey", county: "Shropshire", type: "Priory", visited: false },
  { id: "shr-10", name: "Mitchell's Fold Stone Circle", county: "Shropshire", type: "Stone circle", visited: false },
  { id: "shr-11", name: "Moreton Corbet Castle", county: "Shropshire", type: "Castle", visited: false },
  { id: "shr-12", name: "Old Oswestry Hill Fort", county: "Shropshire", type: "Hillfort", visited: false },
  { id: "shr-13", name: "Stokesay Castle", county: "Shropshire", type: "Castle", visited: false },
  { id: "shr-14", name: "Wenlock Priory", county: "Shropshire", type: "Priory", visited: false },
  { id: "shr-15", name: "White Ladies Priory", county: "Shropshire", type: "Priory", visited: false },
  { id: "shr-16", name: "Wroxeter Roman City", county: "Shropshire", type: "Other", visited: false },

  // Somerset (12 properties)
  { id: "som-1", name: "Cleeve Abbey", county: "Somerset", type: "Abbey", visited: false },
  { id: "som-2", name: "Dunster Butter Cross", county: "Somerset", type: "Other", visited: false },
  { id: "som-3", name: "Dunster Gallox Bridge", county: "Somerset", type: "Bridge", visited: false },
  { id: "som-4", name: "Dunster Yarn Market", county: "Somerset", type: "Other", visited: false },
  { id: "som-5", name: "Farleigh Hungerford Castle", county: "Somerset", type: "Castle", visited: false },
  { id: "som-6", name: "Glastonbury Tribunal", county: "Somerset", type: "Other", visited: false },
  { id: "som-7", name: "Meare Fish House", county: "Somerset", type: "Other", visited: false },
  { id: "som-8", name: "Muchelney Abbey", county: "Somerset", type: "Abbey", visited: false },
  { id: "som-9", name: "Nunney Castle", county: "Somerset", type: "Castle", visited: false },
  { id: "som-10", name: "Sir Bevil Grenville's Monument", county: "Somerset", type: "Other", visited: false },
  { id: "som-11", name: "Stanton Drew Circles and Cove", county: "Somerset", type: "Stone circle", visited: false },
  { id: "som-12", name: "Stoney Littleton Long Barrow", county: "Somerset", type: "Megalithic tomb", visited: false },

  // South Yorkshire (4 properties)
  { id: "sy-1", name: "Brodsworth Hall and Gardens", county: "South Yorkshire", type: "Country House", visited: false },
  { id: "sy-2", name: "Conisbrough Castle", county: "South Yorkshire", type: "Castle", visited: false },
  { id: "sy-3", name: "Monk Bretton Priory", county: "South Yorkshire", type: "Priory", visited: false },
  { id: "sy-4", name: "Roche Abbey", county: "South Yorkshire", type: "Abbey", visited: false },

  // Staffordshire (2 properties)
  { id: "sta-1", name: "Croxden Abbey", county: "Staffordshire", type: "Abbey", visited: false },
  { id: "sta-2", name: "Wall Roman Site", county: "Staffordshire", type: "Other", visited: false },

  // Suffolk (8 properties)
  { id: "suf-1", name: "Bury St Edmunds Abbey", county: "Suffolk", type: "Abbey", visited: false },
  { id: "suf-2", name: "Framlingham Castle", county: "Suffolk", type: "Castle", visited: false },
  { id: "suf-3", name: "Landguard Fort", county: "Suffolk", type: "Device Fort", visited: false },
  { id: "suf-4", name: "Leiston Abbey", county: "Suffolk", type: "Abbey", visited: false },
  { id: "suf-5", name: "Moulton Packhorse Bridge", county: "Suffolk", type: "Bridge", visited: false },
  { id: "suf-6", name: "Orford Castle", county: "Suffolk", type: "Castle", visited: false },
  { id: "suf-7", name: "Saxtead Green Post Mill", county: "Suffolk", type: "Other", visited: false },
  { id: "suf-8", name: "St James' Chapel, Lindsey", county: "Suffolk", type: "Church", visited: false },

  // Surrey (2 properties)
  { id: "sur-1", name: "Farnham Castle Keep", county: "Surrey", type: "Castle", visited: false },
  { id: "sur-2", name: "Waverley Abbey", county: "Surrey", type: "Abbey", visited: false },

  // Tyne and Wear (6 properties)
  { id: "tw-1", name: "Bessie Surtees House", county: "Tyne and Wear", type: "Other", visited: false },
  {
    id: "tw-2",
    name: "Hadrian's Wall: Benwell Roman Temple & Vallum Crossing",
    county: "Tyne and Wear",
    type: "Other",
    visited: false,
  },
  { id: "tw-3", name: "Hadrian's Wall: Denton Hall Turret", county: "Tyne and Wear", type: "Other", visited: false },
  { id: "tw-4", name: "Hylton Castle", county: "Tyne and Wear", type: "Castle", visited: false },
  { id: "tw-5", name: "St Paul's Monastery, Jarrow", county: "Tyne and Wear", type: "Priory", visited: false },
  { id: "tw-6", name: "Tynemouth Priory & Castle", county: "Tyne and Wear", type: "Castle", visited: false },

  // Warwickshire (1 property)
  { id: "war-1", name: "Kenilworth Castle", county: "Warwickshire", type: "Castle", visited: false },

  // West Midlands (2 properties)
  { id: "wm-1", name: "Halesowen Abbey", county: "West Midlands", type: "Abbey", visited: false },
  { id: "wm-2", name: "J. W. Evans Silver Factory", county: "West Midlands", type: "Other", visited: false },

  // West Sussex (2 properties)
  { id: "ws-1", name: "Boxgrove Priory", county: "West Sussex", type: "Priory", visited: false },
  { id: "ws-2", name: "Bramber Castle", county: "West Sussex", type: "Castle", visited: false },

  // Wiltshire (19 properties)
  { id: "wil-1", name: "Alexander Keiller Museum", county: "Wiltshire", type: "Other", visited: false },
  { id: "wil-2", name: "Avebury", county: "Wiltshire", type: "Henge", visited: false },
  { id: "wil-3", name: "Bradford-on-Avon Tithe Barn", county: "Wiltshire", type: "Other", visited: false },
  { id: "wil-4", name: "Bratton Camp", county: "Wiltshire", type: "Hillfort", visited: false },
  { id: "wil-5", name: "Chisbury Chapel", county: "Wiltshire", type: "Church", visited: false },
  { id: "wil-6", name: "Hatfield Earthworks", county: "Wiltshire", type: "Henge", visited: false },
  { id: "wil-7", name: "Ludgershall Castle", county: "Wiltshire", type: "Castle", visited: false },
  { id: "wil-8", name: "Ludgershall Cross", county: "Wiltshire", type: "Other", visited: false },
  { id: "wil-9", name: "Netheravon Dovecote", county: "Wiltshire", type: "Other", visited: false },
  { id: "wil-10", name: "Old Sarum Castle", county: "Wiltshire", type: "Castle", visited: false },
  { id: "wil-11", name: "Old Wardour Castle", county: "Wiltshire", type: "Castle", visited: false },
  { id: "wil-12", name: "The Sanctuary", county: "Wiltshire", type: "Stone circle", visited: false },
  {
    id: "wil-13",
    name: "Silbury Hill",
    county: "Wiltshire",
    type: "Other",
    visited: false,
    description:
      "A Neolithic artificial hill, one of the largest man-made monuments in Europe, constructed around 2400 BC.",
  },
  {
    id: "wil-14",
    name: "Stonehenge",
    county: "Wiltshire",
    type: "Henge",
    visited: false,
    description:
      "A Neolithic henge and timber circle monument consisting of an outer ring of Sarsen standing stones and an inner ring of bluestones, oriented towards the summer solstice sunrise. One of the world's most famous prehistoric monuments, built around 3100-1600 BC.",
  },
  { id: "wil-15", name: "West Kennet Avenue", county: "Wiltshire", type: "Other", visited: false },
  { id: "wil-16", name: "West Kennet Long Barrow", county: "Wiltshire", type: "Megalithic tomb", visited: false },
  { id: "wil-17", name: "Westbury White Horse", county: "Wiltshire", type: "Other", visited: false },
  { id: "wil-18", name: "Windmill Hill", county: "Wiltshire", type: "Other", visited: false },
  { id: "wil-19", name: "Woodhenge", county: "Wiltshire", type: "Henge", visited: false },

  // Worcestershire (2 properties)
  { id: "wor-1", name: "Leigh Court Barn", county: "Worcestershire", type: "Other", visited: false },
  {
    id: "wor-2",
    name: "Witley Court",
    county: "Worcestershire",
    type: "Country House",
    visited: false,
    description:
      "An Italianate mansion built in 1655, enormously expanded in the early 19th century and later underwent massive reconstruction in the mid-19th century. Famous for its spectacular fountain and formal gardens.",
  },
]

export const getPropertiesByCounty = () => {
  return HERITAGE_PROPERTIES.reduce(
    (acc, property) => {
      if (!acc[property.county]) {
        acc[property.county] = []
      }
      acc[property.county].push(property)
      return acc
    },
    {} as Record<string, HeritageProperty[]>,
  )
}

export const getPropertiesByType = () => {
  return HERITAGE_PROPERTIES.reduce(
    (acc, property) => {
      if (!acc[property.type]) {
        acc[property.type] = []
      }
      acc[property.type].push(property)
      return acc
    },
    {} as Record<PropertyType, HeritageProperty[]>,
  )
}

export const getVisitedCount = () => {
  return HERITAGE_PROPERTIES.filter((p) => p.visited).length
}

export const getTotalCount = () => {
  return HERITAGE_PROPERTIES.length
}
