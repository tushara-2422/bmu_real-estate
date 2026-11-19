/* =========================================================
   Property data — edit this file to manage your listings.
   All listings are in Bangalore (Bengaluru).
   city  = zone of the city (used for the "Location" filter)
   area  = locality / neighbourhood
   price = number in INR (sale = total price, rent = per month)
   images[0] is the cover photo.
   ========================================================= */
const IMG = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const AGENTS = {
  aarav: { name: "Aarav Mehta", role: "Senior Advisor, Central Bangalore", photo: IMG("1507003211169-0a1dd7228f2d", 300), phone: "+91 98450 00001" },
  isha: { name: "Isha Kapoor", role: "Luxury Villas, East Bangalore", photo: IMG("1494790108377-be9c29b29330", 300), phone: "+91 98450 00002" },
  kabir: { name: "Kabir Rao", role: "Rentals, South Bangalore", photo: IMG("1500648767791-00dcc994a43e", 300), phone: "+91 98450 00003" },
  meera: { name: "Meera Shah", role: "North Bangalore & NRI Desk", photo: IMG("1438761681033-6461ffad8d80", 300), phone: "+91 98450 00004" },
};

const PROPERTIES = [
  {
    id: "nandi-hills-retreat", title: "Nandi Hills Retreat", city: "North Bangalore", area: "Nandi Hills Road",
    type: "Villa", mode: "buy", price: 49000000, beds: 4, baths: 4, sqft: 5200, year: 2023,
    tags: ["Hill views", "New launch"], featured: true, agent: "meera",
    images: ["1599809275671-b5942cabc7a2", "1544984243-ec57ea16fe25", "1600607687939-ce8a6c25118c", "1600566753190-17f0baa2a6c3"],
    amenities: ["Infinity pool", "Sunset deck", "Home automation", "Solar power", "Staff quarters", "EV charging"],
    description: "Four bedrooms on a plot off Nandi Hills Road, about 45 minutes from Hebbal when the traffic's kind. The deck faces the hills and gets the sunset. Most homes out here are weekend places, but you could easily live in this one.",
  },
  {
    id: "whitefield-glasshouse", title: "Whitefield Glasshouse", city: "East Bangalore", area: "Whitefield",
    type: "Villa", mode: "buy", price: 62000000, beds: 5, baths: 5, sqft: 5600, year: 2022,
    tags: ["Gated community"], featured: true, agent: "isha",
    images: ["1600607688969-a5bfcd646154", "1600585154340-be6161a56a0c", "1600566753086-00f18fb6b3ea", "1613545325278-f24b0cae1224"],
    amenities: ["Clubhouse", "Private lawn", "Home office", "EV charging", "24×7 security", "Modular kitchen"],
    description: "A five-bedroom villa built around an old rain tree, in a gated community near ITPL. Lots of glass, a real lawn, and a small study that gets the morning light.",
  },
  {
    id: "sarjapur-lake-villa", title: "Sarjapur Lake Villa", city: "East Bangalore", area: "Sarjapur Road",
    type: "Villa", mode: "buy", price: 54000000, beds: 4, baths: 4, sqft: 4800, year: 2024,
    tags: ["Lake view", "Ready to move"], featured: true, agent: "isha",
    images: ["1582268611958-ebfd161ef9cf", "1600585153490-76fb20a32601", "1600210491369-e753d80a41f3", "1600566752229-250ed79470f8"],
    amenities: ["Lake-facing deck", "Private garden", "Smart home", "Clubhouse", "International school nearby", "2-car parking"],
    description: "New and ready to move into, right next to a lake that has actually been cleaned up. There are good schools nearby, and the drive to the Outer Ring Road offices is reasonable.",
  },
  {
    id: "sadashivanagar-residence", title: "Sadashivanagar Residence", city: "Central Bangalore", area: "Sadashivanagar",
    type: "Independent House", mode: "buy", price: 185000000, beds: 6, baths: 7, sqft: 9200, year: 2021,
    tags: ["Landmark address"], featured: true, agent: "aarav",
    images: ["1613490493576-7fde63acd811", "1600585154526-990dced4db0d", "1598928506311-c55ded91a20c", "1611094016919-36b65678f3d6"],
    amenities: ["Private lift", "Home theatre", "Terrace garden", "Staff quarters", "Wine room", "4-car parking"],
    description: "A big, quiet house on one of the old streets near the Golf Course. Six bedrooms, a lift, a home theatre and a terrace garden. Homes like this rarely come up for sale.",
  },
  {
    id: "indiranagar-penthouse", title: "Indiranagar Penthouse", city: "Central Bangalore", area: "Indiranagar",
    type: "Apartment", mode: "buy", price: 48000000, beds: 4, baths: 4, sqft: 3400, year: 2024,
    tags: ["Penthouse", "Skyline view"], featured: false, agent: "aarav",
    images: ["1600573472550-8090b5e0745e", "1545324418-cc1a3fa10c00", "1616594039964-ae9021a400a0", "1611094016919-36b65678f3d6"],
    amenities: ["Private terrace", "Concierge", "Gym & spa", "Rooftop pool", "Covered parking"],
    description: "Top floor, two streets off 100 Feet Road, with a terrace that looks out over the trees. You can walk to the metro and to most of the good places to eat.",
  },
  {
    id: "devanahalli-farm-estate", title: "Devanahalli Farm Estate", city: "North Bangalore", area: "Devanahalli",
    type: "Farmhouse", mode: "buy", price: 75000000, beds: 6, baths: 6, sqft: 9000, year: 2019,
    tags: ["2 acres"], featured: false, agent: "meera",
    images: ["1602343168117-bb8ffe3e2e9f", "1505843513577-22bb7d21e455", "1570129477492-45c003edd2be", "1568605114967-8130f3a36994"],
    amenities: ["2-acre land", "Orchard", "Pool", "Party lawn", "Staff housing", "Borewell"],
    description: "Two acres about fifteen minutes from the airport, with fruit trees, a pool and plenty of lawn. Built for long weekends and big family lunches.",
  },
  {
    id: "hebbal-lakeview", title: "Hebbal Lakeview Residences", city: "North Bangalore", area: "Hebbal",
    type: "Apartment", mode: "buy", price: 31000000, beds: 3, baths: 3, sqft: 2400, year: 2023,
    tags: ["Lake view", "Ready to move"], featured: false, agent: "meera",
    images: ["1512917774080-9991f1c4c750", "1594484208280-efa00f96fc21", "1613545325278-f24b0cae1224", "1611094016919-36b65678f3d6"],
    amenities: ["Clubhouse", "Lap pool", "Jogging track", "Gym", "24×7 security", "Power backup"],
    description: "Three-bedroom flats looking out over Hebbal Lake, ready to move into. Handy for Manyata Tech Park and the airport road.",
  },
  {
    id: "yelahanka-courtyard-villa", title: "Yelahanka Courtyard Villa", city: "North Bangalore", area: "Yelahanka",
    type: "Villa", mode: "rent", price: 180000, beds: 4, baths: 4, sqft: 3800, year: 2018,
    tags: ["Courtyard", "Pool"], featured: false, agent: "meera",
    images: ["1613553507747-5f8d62ad5904", "1416331108676-a22ccb276e35", "1599809275671-b5942cabc7a2", "1600566753190-17f0baa2a6c3"],
    amenities: ["Private pool", "Courtyard", "Caretaker", "Furnished", "Outdoor kitchen"],
    description: "A four-bedroom villa built around a courtyard and pool, in a quiet part of Yelahanka New Town. Partly furnished, and available on a long lease.",
  },
  {
    id: "koramangala-garden-flat", title: "Koramangala Garden Flat", city: "South Bangalore", area: "Koramangala",
    type: "Apartment", mode: "rent", price: 95000, beds: 3, baths: 3, sqft: 1750, year: 2021,
    tags: ["Furnished"], featured: false, agent: "kabir",
    images: ["1618221195710-dd6b41faaea6", "1522708323590-d24dbb6b0267", "1502672260266-1c1ef2d93688", "1560185007-cde436f6a4d0"],
    amenities: ["Fully furnished", "Private garden", "Power backup", "Pet friendly", "Covered parking"],
    description: "A ground-floor three-bedroom with its own garden, on a leafy street in 4th Block. Furnished, pets are fine, and you're close to everything.",
  },
  {
    id: "hsr-studio-loft", title: "HSR Studio Loft", city: "South Bangalore", area: "HSR Layout",
    type: "Studio", mode: "rent", price: 42000, beds: 1, baths: 1, sqft: 720, year: 2020,
    tags: ["Furnished", "Walkable"], featured: false, agent: "kabir",
    images: ["1600210492493-0946911123ea", "1502672260266-1c1ef2d93688", "1522708323590-d24dbb6b0267", "1560185007-cde436f6a4d0"],
    amenities: ["Furnished", "High ceilings", "Balcony", "Power backup", "Washer/dryer"],
    description: "A bright studio with high ceilings in HSR Sector 2. Furnished, with a small balcony. Easy for anyone working on the Outer Ring Road.",
  },
  {
    id: "bellandur-orr-office", title: "ORR Grade-A Office", city: "East Bangalore", area: "Bellandur",
    type: "Commercial", mode: "rent", price: 650000, beds: 0, baths: 4, sqft: 6000, year: 2022,
    tags: ["Plug & play"], featured: false, agent: "aarav",
    images: ["1497366216548-37526070297c", "1486406146926-c627a92ad1ab", "1554995207-c18c203602cb", "1600607687939-ce8a6c25118c"],
    amenities: ["80 workstations", "4 meeting rooms", "Pantry", "LEED Gold", "Reserved parking"],
    description: "Ready-to-use office space on the Outer Ring Road in Bellandur, with about 80 desks, four meeting rooms and a pantry.",
  },
  {
    id: "jp-nagar-family-home", title: "JP Nagar Family Home", city: "South Bangalore", area: "JP Nagar",
    type: "Independent House", mode: "buy", price: 36000000, beds: 4, baths: 4, sqft: 3200, year: 2020,
    tags: ["Corner plot"], featured: false, agent: "kabir",
    images: ["1564013799919-ab600027ffc6", "1580587771525-78b9dba3b914", "1512917774080-9991f1c4c750", "1613545325278-f24b0cae1224"],
    amenities: ["Terrace", "Rainwater harvesting", "Solar water", "Servant room", "2-car parking"],
    description: "A sunny corner house in JP Nagar 6th Phase with four bedrooms and a terrace. Parks, schools and the metro are all close by.",
  },
];

const CITIES = [...new Set(PROPERTIES.map((p) => p.city))].sort();
const TYPES = [...new Set(PROPERTIES.map((p) => p.type))].sort();
const LOCALITIES = [...new Set(PROPERTIES.map((p) => p.area))].sort();

function formatPrice(p) {
  const n = p.price;
  let s;
  if (n >= 1e7) s = `₹${parseFloat((n / 1e7).toFixed(2))} Cr`;
  else if (n >= 1e5) s = `₹${parseFloat((n / 1e5).toFixed(2))} L`;
  else s = `₹${n.toLocaleString("en-IN")}`;
  return p.mode === "rent" ? `${s}<small> /mo</small>` : s;
}
