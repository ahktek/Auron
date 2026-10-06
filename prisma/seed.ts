import { PrismaClient, Role, DiscountType } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting AUREN database seed...");

  // 1. Clean existing records in correct order
  await prisma.adminAuditLog.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.inventoryReservation.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.comingSoonLead.deleteMany({});
  await prisma.bundleItem.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.productCollection.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.collection.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.discountCode.deleteMany({});
  await prisma.journalPost.deleteMany({});
  await prisma.stockist.deleteMany({});
  await prisma.announcementBar.deleteMany({});
  await prisma.megaMenuItem.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Admin User & Test Customer
  const adminPassword = "AurenAdmin2026!SecureKey";
  const adminHash = await hashPassword(adminPassword);

  await prisma.user.create({
    data: {
      email: "admin@aurencarry.com",
      name: "Marcus Vance (Owner)",
      passwordHash: adminHash,
      role: Role.OWNER,
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  const customerHash = await hashPassword("Customer123!Secure");
  const customer = await prisma.user.create({
    data: {
      email: "customer@example.com",
      name: "Elena Rostova",
      passwordHash: customerHash,
      role: Role.CUSTOMER,
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
      addresses: {
        create: {
          label: "Apartment",
          firstName: "Elena",
          lastName: "Rostova",
          street1: "742 Evergreen Terrace",
          city: "Portland",
          state: "OR",
          postalCode: "97201",
          country: "United States",
          countryCode: "US",
          isDefaultShipping: true,
          isDefaultBilling: true,
        },
      },
    },
  });

  console.log("\n==========================================");
  console.log("🔐 ADMIN CREDENTIALS (Generated for Seed)");
  console.log(`   Email:    admin@aurencarry.com`);
  console.log(`   Password: ${adminPassword}`);
  console.log(`   Role:     OWNER`);
  console.log("==========================================\n");

  // 3. Categories (6 top-level + nested subcategories)
  const categoriesData = [
    {
      name: "Bags & Luggage",
      slug: "bags-luggage",
      description: "Engineered backpacks, weekender duffels, and lightweight carry-ons built for seamless transit.",
      subcategories: [
        { name: "Backpacks", slug: "backpacks" },
        { name: "Totes & Slings", slug: "totes-slings" },
        { name: "Weekenders & Duffels", slug: "weekenders" },
        { name: "Luggage", slug: "luggage" },
      ],
    },
    {
      name: "Travel",
      slug: "travel",
      description: "Smart organizers, passport sleeves, and dopp kits to eliminate airport friction.",
      subcategories: [
        { name: "Toiletry Kits", slug: "toiletry-kits" },
        { name: "Passport Wallets", slug: "passport-wallets" },
        { name: "Packing Cubes", slug: "packing-cubes" },
        { name: "Luggage Tags", slug: "luggage-tags" },
      ],
    },
    {
      name: "Wallets",
      slug: "wallets",
      description: "Sculpted slim profiles, RFID protection, and premium vegetable-tanned leather.",
      subcategories: [
        { name: "Slim Bifolds", slug: "slim-bifolds" },
        { name: "Card Holders", slug: "card-holders" },
        { name: "Zip Wallets", slug: "zip-wallets" },
        { name: "Travel Wallets", slug: "travel-wallets" },
      ],
    },
    {
      name: "Tech",
      slug: "tech",
      description: "Padded device sleeves, cable portfolios, and desk accessories for mobile workflows.",
      subcategories: [
        { name: "Laptop Sleeves", slug: "laptop-sleeves" },
        { name: "Tech Kits", slug: "tech-kits" },
        { name: "Desk Mats", slug: "desk-mats" },
        { name: "Phone Cases", slug: "phone-cases" },
      ],
    },
    {
      name: "Accessories",
      slug: "accessories",
      description: "Refined key organizers, sunglasses folios, and everyday hardware.",
      subcategories: [
        { name: "Key Covers", slug: "key-covers" },
        { name: "Eyewear Cases", slug: "eyewear-cases" },
        { name: "Notebook Covers", slug: "notebook-covers" },
        { name: "Lanyards & Straps", slug: "lanyards-straps" },
      ],
    },
    {
      name: "Featured",
      slug: "featured",
      description: "Seasonal highlights, award-winning silhouettes, and limited capsule releases.",
      subcategories: [
        { name: "Popular", slug: "popular" },
        { name: "By Activity", slug: "by-activity" },
        { name: "By Collection", slug: "by-collection" },
      ],
    },
  ];

  const categoryMap = new Map<string, string>();

  for (let i = 0; i < categoriesData.length; i++) {
    const cat = categoriesData[i];
    const createdCat = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        sortOrder: i,
        isFeatured: true,
      },
    });
    categoryMap.set(cat.slug, createdCat.id);

    for (let j = 0; j < cat.subcategories.length; j++) {
      const sub = cat.subcategories[j];
      const createdSub = await prisma.category.create({
        data: {
          name: sub.name,
          slug: sub.slug,
          parentId: createdCat.id,
          sortOrder: j,
        },
      });
      categoryMap.set(sub.slug, createdSub.id);
    }
  }

  // 4. Collections (8 collections)
  const collectionsData = [
    {
      name: "Everyday Carry",
      slug: "everyday-carry",
      title: "The Everyday Carry Collection",
      subtitle: "Streamlined silhouettes refined for daily movement.",
      editorialHeader: "Designed to strip away the unnecessary, keeping your core essentials right at hand.",
      isFeatured: true,
      sortOrder: 1,
    },
    {
      name: "The Apex Flight Series",
      slug: "apex-flight",
      title: "The Apex Flight Series",
      subtitle: "Ultra-durable, weather-resistant ballistic nylon carry goods.",
      editorialHeader: "Engineered in partnership with transcontinental travelers for supreme transit efficiency.",
      isFeatured: true,
      sortOrder: 2,
    },
    {
      name: "Coastal All-Weather",
      slug: "coastal-all-weather",
      title: "Coastal All-Weather Series",
      subtitle: "Sealed seams, YKK AquaGuard zips, and recycled ripstop.",
      editorialHeader: "Unwavering protection against downpours, sea mist, and spontaneous weekend expeditions.",
      isFeatured: true,
      sortOrder: 3,
    },
    {
      name: "Minimalist Leather Studio",
      slug: "leather-studio",
      title: "Minimalist Leather Studio",
      subtitle: "Gold-rated environmental tannery leather that patinas gracefully.",
      editorialHeader: "Tactile, supple, and timeless. Each piece develops a rich luster unique to your life.",
      isFeatured: true,
      sortOrder: 4,
    },
    {
      name: "Work & Commute Essentials",
      slug: "work-commute",
      title: "Work & Commute Essentials",
      subtitle: "Organized storage for laptops, cables, chargers, and documents.",
      editorialHeader: "Maintain effortless focus on your transit between home, office, and creative studio.",
      isFeatured: true,
      sortOrder: 5,
    },
    {
      name: "The Midnight Edition",
      slug: "midnight-edition",
      title: "The Midnight Black Edition",
      subtitle: "Monochromatic matte-black hardware and stealth technical fabrics.",
      editorialHeader: "A nocturnal aesthetic focused on understated silhouette, shadow, and tactical precision.",
      isFeatured: false,
      sortOrder: 6,
    },
    {
      name: "Sustainable Eco-Technical",
      slug: "eco-technical",
      title: "Sustainable Eco-Technical",
      subtitle: "Crafted from 100% post-consumer recycled plastic bottles.",
      editorialHeader: "High-performance tensile durability with minimal ecological impact.",
      isFeatured: false,
      sortOrder: 7,
    },
    {
      name: "Travel & Transit Masterclass",
      slug: "travel-transit",
      title: "Travel & Transit Masterclass",
      subtitle: "Cabin-approved dimensions and intuitive customs checkpoint access.",
      editorialHeader: "Flow through security and long-haul flights with zero baggage friction.",
      isFeatured: false,
      sortOrder: 8,
    },
  ];

  const collectionMap = new Map<string, string>();
  for (const c of collectionsData) {
    const col = await prisma.collection.create({
      data: c,
    });
    collectionMap.set(c.slug, col.id);
  }

  // 5. 42 Comprehensive Products
  const productsRaw = [
    // Backpacks
    {
      name: "Apex Transit Backpack 24L",
      slug: "apex-transit-backpack-24l",
      subtitle: "All-day commuter backpack with dedicated 16-inch laptop chamber",
      categoryId: categoryMap.get("backpacks")!,
      basePrice: 199.0,
      compareAtPrice: 229.0,
      isBestseller: true,
      isFeatured: true,
      isNewRelease: false,
      tags: ["backpack", "travel", "commute", "water-resistant"],
      collections: ["apex-flight", "work-commute", "everyday-carry"],
      details: "Clamshell opening for effortless packing. Magnetic quick-snap sternum strap. Concealed passport security pocket behind lumbar pad.",
      materialsInfo: "Constructed from 100% recycled 600D polyester with water-repellent coating and premium eco-tanned leather accents.",
      dimensionsInfo: "510 x 330 x 180 mm (20 x 13 x 7 inches) · Weight: 1.1kg (2.4 lbs) · Capacity: 24 Liters",
      capacityInfo: "Fits 16” MacBook Pro, water bottle up to 750ml, jacket, headphones, notebook, and power bank.",
      careInfo: "Spot clean with damp cloth and mild soap. Air dry away from direct sunlight.",
      variants: [
        { colorName: "Charcoal Ink", colorHex: "#27272A", sku: "ATB-24-BLK", price: 199.0, inventory: 45 },
        { colorName: "Saddle Tan", colorHex: "#A05A2C", sku: "ATB-24-TAN", price: 199.0, inventory: 32 },
        { colorName: "Olive Forest", colorHex: "#3C4836", sku: "ATB-24-OLV", price: 199.0, inventory: 20 },
      ],
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Strata Daypack 18L",
      slug: "strata-daypack-18l",
      subtitle: "Featherlight everyday backpack for agile city movement",
      categoryId: categoryMap.get("backpacks")!,
      basePrice: 149.0,
      isBestseller: true,
      isFeatured: true,
      isNewRelease: true,
      tags: ["backpack", "commute", "lightweight"],
      collections: ["everyday-carry", "work-commute"],
      details: "Minimalist exterior with dual stretch water bottle pockets. Internal padded suspended sleeve for tablets and 14-inch laptops.",
      materialsInfo: "High-density 420D recycled ripstop nylon with polyurethane water-resistant backing.",
      dimensionsInfo: "450 x 290 x 140 mm · Weight: 720g · Capacity: 18 Liters",
      capacityInfo: "Fits 14” laptop, daily essentials, light sweater, keys, and water bottle.",
      careInfo: "Wipe with damp cloth. Do not machine wash.",
      variants: [
        { colorName: "Obsidian", colorHex: "#18181B", sku: "STDP-18-OBS", price: 149.0, inventory: 50 },
        { colorName: "Terracotta", colorHex: "#C25E34", sku: "STDP-18-TER", price: 149.0, inventory: 28 },
        { colorName: "Sandstone", colorHex: "#D8D2C2", sku: "STDP-18-SND", price: 149.0, inventory: 15 },
      ],
      image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Vanguard Commuter Roll-Top 28L",
      slug: "vanguard-commuter-rolltop-28l",
      subtitle: "Expandable roll-top weather fortress for cycling and storm commuting",
      categoryId: categoryMap.get("backpacks")!,
      basePrice: 239.0,
      compareAtPrice: 269.0,
      isBestseller: false,
      isFeatured: true,
      isNewRelease: true,
      tags: ["backpack", "cycling", "weatherproof", "rolltop"],
      collections: ["coastal-all-weather", "midnight-edition"],
      details: "Fidlock V-buckle magnetic roll-top closure. Side zipper access directly into the main compartment. High-visibility reflective paneling.",
      materialsInfo: "X-Pac VX21 waterproof laminate exterior with coated YKK AquaGuard zips.",
      dimensionsInfo: "540 x 320 x 190 mm (expandable to 660 mm height) · Capacity: 22-28L",
      capacityInfo: "Holds cycling helmet, change of clothes, 16” laptop, shoes, and hydration reservoir.",
      careInfo: "Clean with soft cloth and warm water.",
      variants: [
        { colorName: "Matte Black", colorHex: "#121214", sku: "VCR-28-BLK", price: 239.0, inventory: 24 },
        { colorName: "Storm Grey", colorHex: "#64748B", sku: "VCR-28-GRY", price: 239.0, inventory: 19 },
      ],
      image: "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Aeris Flight Pack 35L",
      slug: "aeris-flight-pack-35l",
      subtitle: "Maximum carry-on capacity backpack for one-bag international travel",
      categoryId: categoryMap.get("backpacks")!,
      basePrice: 289.0,
      isBestseller: true,
      isFeatured: true,
      isNewRelease: false,
      tags: ["travel", "backpack", "carry-on", "flight"],
      collections: ["apex-flight", "travel-transit"],
      details: "TSA checkpoint-friendly lie-flat laptop sleeve. Stowable padded shoulder harness and load-lifters. Fits all IATA overhead bins.",
      materialsInfo: "1680D Ballistic Cordura nylon with soft-touch microfiber lining in glasses and phone chambers.",
      dimensionsInfo: "545 x 350 x 215 mm · Weight: 1.45kg · Capacity: 35 Liters",
      capacityInfo: "Sufficient space for 4-7 days of travel apparel, 2 pairs of shoes, laptop, toiletries, and travel documents.",
      careInfo: "Spot clean only.",
      variants: [
        { colorName: "Carbon Black", colorHex: "#18181B", sku: "AFP-35-BLK", price: 289.0, inventory: 38 },
        { colorName: "Navy Deep", colorHex: "#1E293B", sku: "AFP-35-NVY", price: 289.0, inventory: 22 },
      ],
      image: "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?auto=format&fit=crop&w=1200&q=80",
    },

    // Totes & Slings
    {
      name: "Nexus Crossbody Sling 7L",
      slug: "nexus-crossbody-sling-7l",
      subtitle: "Self-compressing crossbody sling with expandable central gusset",
      categoryId: categoryMap.get("totes-slings")!,
      basePrice: 99.0,
      isBestseller: true,
      isFeatured: true,
      isNewRelease: false,
      tags: ["sling", "crossbody", "everyday"],
      collections: ["everyday-carry", "coastal-all-weather"],
      details: "Dual-direction zipper for ambidextrous reach. Integrated key leash with magnetic quick-release clip. Padded sunglasses pouch.",
      materialsInfo: "Recycled Baida nylon exterior with DWR finish.",
      dimensionsInfo: "320 x 180 x 100 mm · Weight: 380g · Capacity: 7 Liters",
      capacityInfo: "Fits iPad Mini / Kindle, water bottle, point-and-shoot camera, phone, and sunglasses.",
      careInfo: "Wipe clean with a wet microfiber towel.",
      variants: [
        { colorName: "Basalt Black", colorHex: "#27272A", sku: "NCS-7-BLK", price: 99.0, inventory: 60 },
        { colorName: "Clay Orange", colorHex: "#C25E34", sku: "NCS-7-CLY", price: 99.0, inventory: 40 },
        { colorName: "Slate Blue", colorHex: "#475569", sku: "NCS-7-BLU", price: 99.0, inventory: 25 },
      ],
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Atelier Canvas Tote 20L",
      slug: "atelier-canvas-tote-20l",
      subtitle: "Architectural structured tote with zippered top and leather shoulder straps",
      categoryId: categoryMap.get("totes-slings")!,
      basePrice: 169.0,
      compareAtPrice: 189.0,
      isBestseller: false,
      isFeatured: true,
      isNewRelease: true,
      tags: ["tote", "work", "canvas", "leather"],
      collections: ["work-commute", "leather-studio"],
      details: "Self-standing reinforced base. Internal padded 15-inch laptop pocket and dual slip pockets for notebooks.",
      materialsInfo: "Heavyweight 18oz organic cotton duck canvas with full-grain bridle leather handles.",
      dimensionsInfo: "420 x 360 x 150 mm · Weight: 850g · Capacity: 20 Liters",
      capacityInfo: "Accommodates work laptop, lunch box, reading book, water bottle, and daily tech accessories.",
      careInfo: "Canvas spot clean with water; treat leather straps with natural balm once a year.",
      variants: [
        { colorName: "Natural Cream / Tan", colorHex: "#EAE6DF", sku: "ACT-20-CRM", price: 169.0, inventory: 35 },
        { colorName: "Blackout", colorHex: "#18181B", sku: "ACT-20-BLK", price: 169.0, inventory: 27 },
      ],
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Mini Crossbody Pouch 2.5L",
      slug: "mini-crossbody-pouch",
      subtitle: "Compact companion for phone, passport, cards, and daily micro-essentials",
      categoryId: categoryMap.get("totes-slings")!,
      basePrice: 59.0,
      isBestseller: false,
      isFeatured: false,
      isNewRelease: true,
      tags: ["pouch", "sling", "minimalist"],
      collections: ["everyday-carry"],
      details: "Detachable soft-woven paracord strap with custom aluminum carabiner hardware.",
      materialsInfo: "500D Cordura Ripstop with waterproof zippers.",
      dimensionsInfo: "210 x 140 x 50 mm · Weight: 160g",
      capacityInfo: "Holds iPhone 16 Pro Max, wallet, keys, passport, and lip balm.",
      careInfo: "Spot clean.",
      variants: [
        { colorName: "Pitch Black", colorHex: "#18181B", sku: "MCP-2-BLK", price: 59.0, inventory: 40 },
        { colorName: "Amber Rust", colorHex: "#B45309", sku: "MCP-2-AMB", price: 59.0, inventory: 30 },
      ],
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80",
    },

    // Weekenders & Luggage
    {
      name: "Overland Weekender Duffel 42L",
      slug: "overland-weekender-duffel-42l",
      subtitle: "Refined travel duffel with separate ventilated shoe garage",
      categoryId: categoryMap.get("weekenders")!,
      basePrice: 229.0,
      isBestseller: true,
      isFeatured: true,
      isNewRelease: false,
      tags: ["duffel", "travel", "weekender"],
      collections: ["travel-transit", "coastal-all-weather"],
      details: "Luggage handle pass-through strap for rolling luggage integration. Wide doctor-bag wireframe mouth stays open while packing.",
      materialsInfo: "Water-resistant 900D coated recycled canvas with leather handle wrap.",
      dimensionsInfo: "530 x 340 x 250 mm · Weight: 1.3kg · Capacity: 42 Liters",
      capacityInfo: "Fits 3-4 days of clothing, pair of boots/sneakers in isolated compartment, toiletry dopp, and tech gear.",
      careInfo: "Spot clean with damp sponge.",
      variants: [
        { colorName: "Olive Drab", colorHex: "#3C4836", sku: "OWD-42-OLV", price: 229.0, inventory: 35 },
        { colorName: "Midnight Navy", colorHex: "#1E293B", sku: "OWD-42-NVY", price: 229.0, inventory: 28 },
        { colorName: "Anthracite", colorHex: "#27272A", sku: "OWD-42-ANT", price: 229.0, inventory: 40 },
      ],
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Aero Carry-On Spinner 38L",
      slug: "aero-carry-on-spinner-38l",
      subtitle: "Aerospace polycarbonate hardshell with whisper-quiet Hinomoto 360° wheels",
      categoryId: categoryMap.get("luggage")!,
      basePrice: 345.0,
      isBestseller: false,
      isFeatured: true,
      isNewRelease: true,
      tags: ["luggage", "spinner", "hardshell", "travel"],
      collections: ["apex-flight", "travel-transit"],
      details: "TSA-approved dual combination lock. Front quick-access shock-absorbing pocket for 16-inch laptops.",
      materialsInfo: "100% German Makrolon polycarbonate shell with aircraft-grade aluminum telescoping handle.",
      dimensionsInfo: "550 x 360 x 230 mm · Weight: 3.2kg · Capacity: 38 Liters",
      capacityInfo: "Meets carry-on size regulations for all major domestic and international airlines.",
      careInfo: "Wipe polycarbonate shell with microfiber towel.",
      variants: [
        { colorName: "Slate Matte", colorHex: "#3F3F46", sku: "ACS-38-SLT", price: 345.0, inventory: 18 },
        { colorName: "Desert Sand", colorHex: "#D8D2C2", sku: "ACS-38-SND", price: 345.0, inventory: 14 },
      ],
      image: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=1200&q=80",
    },

    // Wallets
    {
      name: "Apex Slim Bifold Wallet",
      slug: "apex-slim-bifold-wallet",
      subtitle: "Engineered ultra-flat bifold with quick-draw primary card slots",
      categoryId: categoryMap.get("slim-bifolds")!,
      basePrice: 79.0,
      compareAtPrice: 89.0,
      isBestseller: true,
      isFeatured: true,
      isNewRelease: false,
      tags: ["wallet", "bifold", "leather", "rfid"],
      collections: ["everyday-carry", "leather-studio"],
      details: "Stores 4-11 cards and flat unfolded bills without unnecessary bulk. Pull-tab access for lesser-used backup cards. RFID blocking layer.",
      materialsInfo: "Full-grain, environmentally certified vegetable-tanned leather from gold-rated Leather Working Group tannery.",
      dimensionsInfo: "85 x 102 x 10 mm · Weight: 46g",
      capacityInfo: "Holds 4 to 12 credit cards, flat banknotes (USD, EUR, GBP), and micro business cards.",
      careInfo: "Condition with natural beeswax leather cream periodically.",
      variants: [
        { colorName: "Caramel Tan", colorHex: "#A05A2C", sku: "ASB-CRM", price: 79.0, inventory: 85 },
        { colorName: "Espresso Brown", colorHex: "#3E2723", sku: "ASB-ESP", price: 79.0, inventory: 60 },
        { colorName: "Black Onyx", colorHex: "#18181B", sku: "ASB-BLK", price: 79.0, inventory: 90 },
        { colorName: "Forest Green", colorHex: "#1E3A2F", sku: "ASB-GRN", price: 79.0, inventory: 35 },
      ],
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Card Sleeve Minimalist",
      slug: "card-sleeve-minimalist",
      subtitle: "Our slimmest leather silhouette for true front-pocket essentials",
      categoryId: categoryMap.get("card-holders")!,
      basePrice: 49.0,
      isBestseller: true,
      isFeatured: true,
      isNewRelease: false,
      tags: ["wallet", "card-holder", "leather", "minimal"],
      collections: ["everyday-carry", "leather-studio"],
      details: "Two quick-access card slots on exterior, plus central stash pocket with leather pull-tab for 2-4 cards or folded cash.",
      materialsInfo: "Full-grain semi-vegetable tanned cowhide leather.",
      dimensionsInfo: "70 x 103 x 5 mm · Weight: 24g",
      capacityInfo: "Accommodates 2 to 8 cards and folded cash.",
      careInfo: "Wipe gently with soft cloth.",
      variants: [
        { colorName: "Saddle Tan", colorHex: "#A05A2C", sku: "CSM-TAN", price: 49.0, inventory: 110 },
        { colorName: "Ink Charcoal", colorHex: "#27272A", sku: "CSM-INK", price: 49.0, inventory: 95 },
        { colorName: "Terracotta Ochre", colorHex: "#C25E34", sku: "CSM-OCH", price: 49.0, inventory: 65 },
      ],
      image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Zip Folio Wallet",
      slug: "zip-folio-wallet",
      subtitle: "All-round zippered security for cash, coins, phone, and up to 14 cards",
      categoryId: categoryMap.get("zip-wallets")!,
      basePrice: 119.0,
      isBestseller: false,
      isFeatured: false,
      isNewRelease: true,
      tags: ["wallet", "zip-wallet", "leather"],
      collections: ["leather-studio"],
      details: "Smooth metallic teeth zipper opens flat for unobstructed visibility. Magnetic coin pouch snaps shut securely.",
      materialsInfo: "Premium top-grain nappa leather with microfiber lining.",
      dimensionsInfo: "105 x 120 x 20 mm · Weight: 95g",
      capacityInfo: "Holds 4-14 cards, coins, receipts, SIM card, and passport in a pinch.",
      careInfo: "Condition every 6 months.",
      variants: [
        { colorName: "Black Onyx", colorHex: "#18181B", sku: "ZFW-BLK", price: 119.0, inventory: 40 },
        { colorName: "Cognac Brown", colorHex: "#78350F", sku: "ZFW-COG", price: 119.0, inventory: 32 },
      ],
      image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Passport Transit Sleeve",
      slug: "passport-transit-sleeve",
      subtitle: "Sleek boarding companion with micro travel pen and boarding pass fold",
      categoryId: categoryMap.get("travel-wallets")!,
      basePrice: 89.0,
      isBestseller: true,
      isFeatured: true,
      isNewRelease: false,
      tags: ["passport", "travel", "leather"],
      collections: ["travel-transit", "leather-studio"],
      details: "Includes precision-machined mini ballpoint pen. Holds passport, boarding pass, 4 cards, and backup currency.",
      materialsInfo: "Vegetable-tanned leather with gold foil embossed transit icon.",
      dimensionsInfo: "140 x 100 x 9 mm · Weight: 60g",
      capacityInfo: "Standard international passport, folded boarding pass, 4 cards, pen.",
      careInfo: "Keep dry.",
      variants: [
        { colorName: "Midnight Blue", colorHex: "#1E293B", sku: "PTS-NVY", price: 89.0, inventory: 50 },
        { colorName: "Caramel Tan", colorHex: "#A05A2C", sku: "PTS-CRM", price: 89.0, inventory: 45 },
      ],
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
    },

    // Tech
    {
      name: "Venture Tech Portfolio Kit",
      slug: "venture-tech-portfolio-kit",
      subtitle: "Origami-style fold-out organizer for cables, chargers, dongles, and mouse",
      categoryId: categoryMap.get("tech-kits")!,
      basePrice: 65.0,
      compareAtPrice: 75.0,
      isBestseller: true,
      isFeatured: true,
      isNewRelease: false,
      tags: ["tech", "organizer", "cables", "commute"],
      collections: ["work-commute", "everyday-carry"],
      details: "Zips open flat like an accordion for instant desktop overview. Stretch mesh chambers prevent cables from tangling.",
      materialsInfo: "Recycled woven polyester exterior with waterproof zipper and ripstop lining.",
      dimensionsInfo: "230 x 130 x 70 mm · Weight: 210g",
      capacityInfo: "Holds MacBook charger, Magic Mouse, USB-C cables, stylus, flash drives, and AirPods.",
      careInfo: "Wipe with damp cloth.",
      variants: [
        { colorName: "Slate Charcoal", colorHex: "#334155", sku: "VTP-GRY", price: 65.0, inventory: 70 },
        { colorName: "Desert Ochre", colorHex: "#C25E34", sku: "VTP-OCH", price: 65.0, inventory: 45 },
        { colorName: "Pitch Black", colorHex: "#18181B", sku: "VTP-BLK", price: 65.0, inventory: 60 },
      ],
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Structured Leather Laptop Sleeve 16”",
      slug: "structured-leather-laptop-sleeve-16",
      subtitle: "Magnetic closure padded sleeve with plush microfiber scratch defense",
      categoryId: categoryMap.get("laptop-sleeves")!,
      basePrice: 109.0,
      isBestseller: false,
      isFeatured: true,
      isNewRelease: true,
      tags: ["tech", "laptop-sleeve", "leather", "work"],
      collections: ["work-commute", "leather-studio"],
      details: "Discreet rear magnetic clasp shuts smoothly with zero zipper scratch risk. Cutout port allows in-sleeve laptop charging.",
      materialsInfo: "Smooth environmental leather with dense shock-absorbent neoprene core.",
      dimensionsInfo: "385 x 265 x 18 mm · Weight: 310g",
      capacityInfo: "Tailored for 16-inch MacBook Pro M1/M2/M3/M4 or similar ultrabooks.",
      careInfo: "Leather care balm recommended once yearly.",
      variants: [
        { colorName: "Obsidian Black", colorHex: "#18181B", sku: "SLS-16-BLK", price: 109.0, inventory: 42 },
        { colorName: "Tan Cognac", colorHex: "#9A3412", sku: "SLS-16-COG", price: 109.0, inventory: 34 },
      ],
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Architect Leather Desk Mat",
      slug: "architect-leather-desk-mat",
      subtitle: "Reversible premium leather and natural wool felt workspace foundation",
      categoryId: categoryMap.get("desk-mats")!,
      basePrice: 89.0,
      isBestseller: true,
      isFeatured: false,
      isNewRelease: false,
      tags: ["desk", "leather", "workspace"],
      collections: ["work-commute", "leather-studio"],
      details: "Embedded magnetic cable routing bar keeps your phone charger anchored at the top corner of your desk.",
      materialsInfo: "Genuine vegan bonded leather top paired with anti-slip natural wool felt underside.",
      dimensionsInfo: "800 x 400 x 4 mm · Weight: 650g",
      capacityInfo: "Spans keyboard, mouse, and daily notepad.",
      careInfo: "Wipe with damp cloth.",
      variants: [
        { colorName: "Black & Grey Felt", colorHex: "#27272A", sku: "ADM-BLK", price: 89.0, inventory: 55 },
        { colorName: "Chestnut & Sand Felt", colorHex: "#78350F", sku: "ADM-CHT", price: 89.0, inventory: 38 },
      ],
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80",
    },

    // Travel
    {
      name: "Dopp Standing Toiletry Kit",
      slug: "dopp-standing-toiletry-kit",
      subtitle: "Water-resistant standing wash pouch with wipe-clean internal dividers",
      categoryId: categoryMap.get("toiletry-kits")!,
      basePrice: 65.0,
      isBestseller: true,
      isFeatured: true,
      isNewRelease: false,
      tags: ["travel", "toiletry", "dopp", "waterproof"],
      collections: ["travel-transit", "coastal-all-weather"],
      details: "Stands upright on wet bathroom countertops. Magnetic toothbrush shelf keeps bristles dry and hygienic.",
      materialsInfo: "Coated waterproof nylon shell with antibacterial wipe-clean interior lining.",
      dimensionsInfo: "240 x 140 x 110 mm · Weight: 220g · Capacity: 3.5 Liters",
      capacityInfo: "Holds full travel-size shampoo, deodorant, electric toothbrush, razor, and cologne.",
      careInfo: "Rinse inside under faucet; air dry.",
      variants: [
        { colorName: "Shadow Slate", colorHex: "#334155", sku: "DTK-GRY", price: 65.0, inventory: 60 },
        { colorName: "Terracotta Clay", colorHex: "#C25E34", sku: "DTK-TER", price: 65.0, inventory: 40 },
      ],
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Compression Packing Cube Set (3-Pack)",
      slug: "compression-packing-cube-set",
      subtitle: "Double-zipper compression system saves up to 40% luggage volume",
      categoryId: categoryMap.get("packing-cubes")!,
      basePrice: 55.0,
      isBestseller: true,
      isFeatured: false,
      isNewRelease: false,
      tags: ["travel", "packing-cube", "compression"],
      collections: ["travel-transit"],
      details: "Includes Small (underwear/socks), Medium (shirts/shorts), and Large (sweaters/trousers) cubes.",
      materialsInfo: "Ultra-silky 70D high-tenacity ripstop nylon with breathable mesh window.",
      dimensionsInfo: "S: 25x18cm, M: 35x25cm, L: 40x30cm",
      capacityInfo: "Organizes up to 10 days of folded wardrobe neatly.",
      careInfo: "Hand wash cold.",
      variants: [
        { colorName: "Arctic Stone", colorHex: "#CBD5E1", sku: "CPC-3-STN", price: 55.0, inventory: 75 },
        { colorName: "Midnight", colorHex: "#0F172A", sku: "CPC-3-BLK", price: 55.0, inventory: 90 },
      ],
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
    },

    // Accessories
    {
      name: "Orbit Key Folio Organizer",
      slug: "orbit-key-folio-organizer",
      subtitle: "Silent, pocket-protecting leather sheath for 2 to 8 keys with D-ring",
      categoryId: categoryMap.get("key-covers")!,
      basePrice: 42.0,
      isBestseller: true,
      isFeatured: false,
      isNewRelease: false,
      tags: ["accessories", "keys", "leather"],
      collections: ["everyday-carry", "leather-studio"],
      details: "Eliminates key jingle and shields smartphone screens from scratches in your pockets.",
      materialsInfo: "Full-grain leather with stainless steel locking hardware pin.",
      dimensionsInfo: "82 x 20 x 20 mm · Weight: 35g",
      capacityInfo: "Houses 2-8 standard keys plus car key fob attached to D-ring.",
      careInfo: "Wipe with damp cloth.",
      variants: [
        { colorName: "Cognac Tan", colorHex: "#B45309", sku: "OKF-COG", price: 42.0, inventory: 90 },
        { colorName: "Matte Black", colorHex: "#18181B", sku: "OKF-BLK", price: 42.0, inventory: 80 },
      ],
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Structured Sunglasses Hard Case",
      slug: "structured-sunglasses-case",
      subtitle: "Slim foldable origami case that flattens into a slip pocket when glasses are worn",
      categoryId: categoryMap.get("eyewear-cases")!,
      basePrice: 48.0,
      isBestseller: false,
      isFeatured: false,
      isNewRelease: true,
      tags: ["accessories", "eyewear", "leather"],
      collections: ["everyday-carry"],
      details: "Clever magnetic origami structure folds completely flat when empty to occupy zero pocket space.",
      materialsInfo: "Durable textured leatherette exterior with soft microfiber inner cushion.",
      dimensionsInfo: "160 x 70 x 65 mm (expands from 15mm flat) · Weight: 80g",
      capacityInfo: "Fits standard aviator, wayfarer, and round frame sunglasses.",
      careInfo: "Wipe clean.",
      variants: [
        { colorName: "Espresso", colorHex: "#3E2723", sku: "SSC-ESP", price: 48.0, inventory: 50 },
        { colorName: "Desert Sand", colorHex: "#D8D2C2", sku: "SSC-SND", price: 48.0, inventory: 40 },
      ],
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  // Generate 22 more products systematically to achieve 40+ total
  const additionalProductsData = [
    { title: "Metro Commuter Briefcase 15L", category: "totes-slings", price: 185, tags: ["briefcase", "work", "commute"] },
    { title: "Kitsilano Rolltop Backpack 22L", category: "backpacks", price: 175, tags: ["backpack", "weatherproof"] },
    { title: "Equinox Travel Duffel 55L", category: "weekenders", price: 250, tags: ["travel", "duffel"] },
    { title: "Horizon Hybrid Suitcase 60L", category: "luggage", price: 395, tags: ["luggage", "travel"] },
    { title: "Element Passport Folio", category: "travel-wallets", price: 75, tags: ["passport", "leather"] },
    { title: "Apex Coin & Card Pouch", category: "zip-wallets", price: 45, tags: ["wallet", "coins"] },
    { title: "Nomad Field Notebook Cover", category: "notebook-covers", price: 55, tags: ["leather", "notebook"] },
    { title: "Terra All-Weather Lanyard", category: "lanyards-straps", price: 28, tags: ["accessories", "strap"] },
    { title: "Strata Tech Cable Roll", category: "tech-kits", price: 38, tags: ["tech", "cables"] },
    { title: "Form Minimalist Card Case", category: "card-holders", price: 42, tags: ["card-holder", "minimal"] },
    { title: "Venture Sling Mini 4L", category: "totes-slings", price: 85, tags: ["sling", "everyday"] },
    { title: "Apex Travel Toiletry Roll", category: "toiletry-kits", price: 58, tags: ["travel", "toiletry"] },
    { title: "Apex Laptop Sleeve 14”", category: "laptop-sleeves", price: 95, tags: ["laptop-sleeve", "tech"] },
    { title: "Urban Transit Backpack 20L", category: "backpacks", price: 165, tags: ["backpack", "commute"] },
    { title: "Studio Leather Tote Large", category: "totes-slings", price: 195, tags: ["tote", "leather"] },
    { title: "Apex Bifold Micro", category: "slim-bifolds", price: 68, tags: ["wallet", "bifold"] },
    { title: "Modular Key Carabiner Clip", category: "key-covers", price: 35, tags: ["accessories", "hardware"] },
    { title: "Aero Packing Compression Cube S/M", category: "packing-cubes", price: 42, tags: ["travel", "packing"] },
    { title: "Pinnacle Weekender 35L", category: "weekenders", price: 210, tags: ["weekender", "travel"] },
    { title: "Transit Luggage Tag Leather", category: "luggage-tags", price: 30, tags: ["travel", "leather"] },
    { title: "Desk Cable Weight Organizer", category: "desk-mats", price: 32, tags: ["desk", "tech"] },
    { title: "Nomad Phone Wallet Case", category: "phone-cases", price: 48, tags: ["phone-case", "leather"] },
  ];

  for (const item of additionalProductsData) {
    const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    productsRaw.push({
      name: item.title,
      slug,
      subtitle: `Expertly engineered ${item.title.toLowerCase()} for daily movement and dependable utility`,
      categoryId: categoryMap.get(item.category) || categoryMap.get("backpacks")!,
      basePrice: item.price,
      compareAtPrice: Math.round(item.price * 1.15),
      isBestseller: false,
      isFeatured: false,
      isNewRelease: true,
      tags: item.tags,
      collections: ["everyday-carry"],
      details: "Constructed with premium weather-resistant fabrics and thoughtful interior compartmentalization.",
      materialsInfo: "Sustainably produced ripstop canvas and certified eco-tanned leather.",
      dimensionsInfo: "Ergonomic engineered profile calibrated for daily carry convenience.",
      capacityInfo: "Tailored to carry essential gear cleanly and securely.",
      careInfo: "Spot clean with damp cloth.",
      variants: [
        { colorName: "Charcoal Ink", colorHex: "#27272A", sku: `${slug.substring(0, 8).toUpperCase()}-BLK`, price: item.price, inventory: 40 },
        { colorName: "Saddle Tan", colorHex: "#A05A2C", sku: `${slug.substring(0, 8).toUpperCase()}-TAN`, price: item.price, inventory: 30 },
      ],
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
    });
  }

  // Create products in database
  const createdProductsMap = new Map<string, string>();

  for (let i = 0; i < productsRaw.length; i++) {
    const p = productsRaw[i];
    const createdProduct = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        subtitle: p.subtitle,
        description: `${p.subtitle}. Built by AUREN with architectural discipline and tactile premium craftsmanship.`,
        details: p.details,
        materialsInfo: p.materialsInfo,
        dimensionsInfo: p.dimensionsInfo,
        capacityInfo: p.capacityInfo,
        careInfo: p.careInfo,
        basePrice: p.basePrice,
        compareAtPrice: p.compareAtPrice,
        categoryId: p.categoryId,
        isPublished: true,
        isFeatured: p.isFeatured,
        isBestseller: p.isBestseller,
        isNewRelease: p.isNewRelease,
        tags: p.tags,
        sortOrder: i,
        rating: 4.85,
        reviewCount: Math.floor(Math.random() * 80) + 12,
        images: {
          create: [
            {
              url: p.image,
              altText: `${p.name} - Studio hero view`,
              isHero: true,
              sortOrder: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
              altText: `${p.name} - Detailed material close-up`,
              isHero: false,
              sortOrder: 1,
            },
          ],
        },
      },
    });

    createdProductsMap.set(p.slug, createdProduct.id);

    // Create variants
    for (let vIdx = 0; vIdx < p.variants.length; vIdx++) {
      const v = p.variants[vIdx];
      await prisma.productVariant.create({
        data: {
          productId: createdProduct.id,
          sku: v.sku,
          title: `${p.name} - ${v.colorName}`,
          colorName: v.colorName,
          colorHex: v.colorHex,
          price: v.price,
          compareAtPrice: p.compareAtPrice,
          inventory: v.inventory,
          isDefault: vIdx === 0,
          sortOrder: vIdx,
        },
      });
    }

    // Link to collections
    for (const colSlug of p.collections) {
      const colId = collectionMap.get(colSlug);
      if (colId) {
        await prisma.productCollection.create({
          data: {
            productId: createdProduct.id,
            collectionId: colId,
            sortOrder: i,
          },
        });
      }
    }

    // Seed 2 sample reviews per top product
    if (i < 8) {
      await prisma.review.create({
        data: {
          productId: createdProduct.id,
          userId: customer.id,
          authorName: "Alexander Hayes",
          authorEmail: "alexander.hayes@example.com",
          rating: 5,
          title: "Superior build quality and magnetic details",
          body: "I've carried this daily for three months across commuting and two cross-country flights. The tactile leather and smooth zippers make it a joy to use every morning.",
          status: "APPROVED",
          isVerifiedPurchase: true,
        },
      });
      await prisma.review.create({
        data: {
          productId: createdProduct.id,
          authorName: "Karin Lindqvist",
          authorEmail: "karin.l@example.com",
          rating: 5,
          title: "Eliminated pocket bulk completely",
          body: "The clever layout holds everything I need without feeling bulky. Exceptionally clean design aesthetic that fits right into my studio.",
          status: "APPROVED",
          isVerifiedPurchase: true,
        },
      });
    }
  }

  // 6. 3 Bundles / Value Sets
  const bundlesData = [
    {
      name: "The Daily Commuter Value Set",
      slug: "daily-commuter-value-set",
      subtitle: "Apex Transit Backpack + Tech Portfolio Kit + Slim Bifold",
      basePrice: 299.0,
      compareAtPrice: 343.0,
      items: ["apex-transit-backpack-24l", "venture-tech-portfolio-kit", "apex-slim-bifold-wallet"],
    },
    {
      name: "The Weekend Transit Bundle",
      slug: "weekend-transit-bundle",
      subtitle: "Overland Weekender Duffel + Dopp Standing Toiletry Kit + Passport Sleeve",
      basePrice: 339.0,
      compareAtPrice: 383.0,
      items: ["overland-weekender-duffel-42l", "dopp-standing-toiletry-kit", "passport-transit-sleeve"],
    },
    {
      name: "The Desk Organization Kit",
      slug: "desk-organization-kit",
      subtitle: "Structured Laptop Sleeve 16” + Leather Desk Mat + Tech Cable Roll",
      basePrice: 199.0,
      compareAtPrice: 236.0,
      items: ["structured-leather-laptop-sleeve-16", "architect-leather-desk-mat", "strata-tech-cable-roll"],
    },
  ];

  for (const b of bundlesData) {
    const bundleProduct = await prisma.product.create({
      data: {
        name: b.name,
        slug: b.slug,
        subtitle: b.subtitle,
        description: `Complete bundled carry solution saving over 15% compared to purchasing items individually. ${b.subtitle}.`,
        basePrice: b.basePrice,
        compareAtPrice: b.compareAtPrice,
        categoryId: categoryMap.get("featured")!,
        isPublished: true,
        isBundle: true,
        isFeatured: true,
        tags: ["bundle", "value-set", "gift"],
        images: {
          create: {
            url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
            altText: `${b.name} Value Set Hero`,
            isHero: true,
          },
        },
      },
    });

    await prisma.productVariant.create({
      data: {
        productId: bundleProduct.id,
        sku: `${b.slug.substring(0, 10).toUpperCase()}-SET`,
        title: `${b.name} (Complete Set)`,
        price: b.basePrice,
        compareAtPrice: b.compareAtPrice,
        inventory: 25,
        isDefault: true,
      },
    });

    for (const childSlug of b.items) {
      const childId = createdProductsMap.get(childSlug);
      if (childId) {
        await prisma.bundleItem.create({
          data: {
            bundleProductId: bundleProduct.id,
            itemProductId: childId,
            quantity: 1,
          },
        });
      }
    }
  }

  // 7. 10 Journal Posts
  const journalPostsData = [
    {
      slug: "the-geometry-of-minimalist-carry",
      title: "The Geometry of Minimalist Carry: Stripping Back the Noise",
      subtitle: "How architectural volume studies informed our newest backpack silhouette.",
      excerpt: "When designing the Apex Transit series, our industrial design team eliminated every zipper pull and seam that didn't serve a specific physiological movement.",
      categoryName: "Design & Craft",
      authorName: "Marcus Vance",
      readingTimeMinutes: 5,
      coverImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
    },
    {
      slug: "inside-the-tannery-gold-rated-leather",
      title: "Inside the Tannery: Why Gold-Rated Leather Matters",
      subtitle: "A deep dive into closed-loop water treatment and vegetable tanning in Tuscany.",
      excerpt: "Leather has carried human stories for millennia. We explore how modern environmental standards ensure ethical, zero-waste craftsmanship.",
      categoryName: "Materials",
      authorName: "Elena Rostova",
      readingTimeMinutes: 7,
      coverImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
    },
    {
      slug: "one-bag-travel-7-days-in-copenhagen",
      title: "One-Bag Travel: 7 Days in Copenhagen with Just 28 Liters",
      subtitle: "Mastering the art of traveling carry-on only without sacrificing style or comfort.",
      excerpt: "How to assemble a multi-weather capsule wardrobe and pack with military-grade efficiency using compression organizers.",
      categoryName: "Field Notes",
      authorName: "Soren Møller",
      readingTimeMinutes: 6,
      coverImage: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=1200&q=80",
    },
    {
      slug: "circularity-and-recycled-ripstop",
      title: "Transforming Ocean-Bound Plastics into Technical Ripstop",
      subtitle: "The engineering behind our Coastal All-Weather textiles.",
      excerpt: "How discarded water bottles undergo high-tensile molecular reweaving into abrasion-resistant ballistic cloth.",
      categoryName: "Sustainability",
      authorName: "Claire Zhang",
      readingTimeMinutes: 4,
      coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    },
    {
      slug: "the-pocket-purge-slimming-down-your-edc",
      title: "The Pocket Purge: How to Slim Down Your Daily Carry",
      subtitle: "A practical guide to shedding unnecessary loyalty cards, bulk coins, and loose keys.",
      excerpt: "The psychological relief of stepping out the door with perfectly flat pockets and nothing jingling in your stride.",
      categoryName: "Guides",
      authorName: "Marcus Vance",
      readingTimeMinutes: 3,
      coverImage: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=80",
    },
    {
      slug: "tactile-analog-tools-for-digital-nomads",
      title: "Analog Anchors for Digital Thinkers",
      subtitle: "Why writing in a leather-bound notebook sparks better creative breakthroughs than digital notes.",
      excerpt: "In a world of notifications, carrying a physical pen and notebook provides an essential cognitive quiet zone.",
      categoryName: "Culture",
      authorName: "Julian Reed",
      readingTimeMinutes: 5,
      coverImage: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80",
    },
    {
      slug: "repair-over-replace-our-ten-year-pledge",
      title: "Repair Over Replace: Our Ten-Year Warranty Pledge",
      subtitle: "How our modular hardware design ensures every bag can be serviced, not landfilled.",
      excerpt: "We build bags intended to be repaired with standard tools. Meet our Portland workshop repair technicians.",
      categoryName: "Sustainability",
      authorName: "Claire Zhang",
      readingTimeMinutes: 4,
      coverImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    },
    {
      slug: "magnetic-hardware-and-sensory-design",
      title: "The Click: Precision Magnetic Hardware and Sensory UX",
      subtitle: "Engineering tactile acoustic satisfaction in every closure.",
      excerpt: "A behind-the-scenes look at how neodymium magnetic buckles are tuned to deliver a crisp, reassuring acoustic snap.",
      categoryName: "Design & Craft",
      authorName: "Marcus Vance",
      readingTimeMinutes: 5,
      coverImage: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80",
    },
    {
      slug: "curating-the-ultimate-mobile-desk",
      title: "Curating the Ultimate Mobile Desk Setup",
      subtitle: "From coffee shops to airport lounges: keeping your workstation organized everywhere.",
      excerpt: "Tools, cable routing habits, and lightweight desk pads that allow you to enter deep focus anywhere in seconds.",
      categoryName: "Productivity",
      authorName: "Julian Reed",
      readingTimeMinutes: 6,
      coverImage: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80",
    },
    {
      slug: "winter-care-protecting-natural-leather",
      title: "Winter Care: Protecting Natural Leather Against Snow and Salt",
      subtitle: "Simple three-step seasonal hydration for your wallets and bags.",
      excerpt: "Beeswax balms, salt neutralization, and proper drying techniques to keep your leather goods aging beautifully.",
      categoryName: "Care & Repair",
      authorName: "Elena Rostova",
      readingTimeMinutes: 4,
      coverImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  for (const post of journalPostsData) {
    await prisma.journalPost.create({
      data: {
        slug: post.slug,
        title: post.title,
        subtitle: post.subtitle,
        excerpt: post.excerpt,
        content: `
          <p class="lead">${post.excerpt}</p>
          <h2>The Philosophy of Considered Movement</h2>
          <p>Every object we carry through the world creates either friction or freedom. When design is executed with restraint, objects cease to be burdens and become natural extensions of your workflow.</p>
          <blockquote>"Simplicity is not the absence of clutter, that's a consequence of simplicity. Simplicity is somehow essentially describing the purpose and place of an object."</blockquote>
          <h2>Materials, Tension, and Longevity</h2>
          <p>By pairing high-density technical weaves with naturally tanned hides, we engineer items that resist rain and scuffs while softening naturally to your touch. Every seam is double-bar-tacked at stress nodes to survive years of brisk commuting and luggage rack jostling.</p>
          <p>Invest in objects that grow more beautiful with every departure stamp.</p>
        `,
        coverImage: post.coverImage,
        authorName: post.authorName,
        categoryName: post.categoryName,
        readingTimeMinutes: post.readingTimeMinutes,
        isPublished: true,
        publishedAt: new Date(),
      },
    });
  }

  // 8. 12 Global Stockists
  const stockistsData = [
    { name: "AUREN Flagship Studio Portland", street: "412 NW 11th Ave", city: "Portland", state: "OR", postalCode: "97209", country: "United States", countryCode: "US", phone: "+1 503-555-0142", latitude: 45.5262, longitude: -122.6828 },
    { name: "Nordic Goods Co. Copenhagen", street: "Gothersgade 44", city: "Copenhagen", state: "Hovedstaden", postalCode: "1123", country: "Denmark", countryCode: "DK", phone: "+45 33 12 40 55", latitude: 55.6828, longitude: 12.5805 },
    { name: "Kaufmann & Sons Zurich", street: "Bahnhofstrasse 28", city: "Zurich", state: "ZH", postalCode: "8001", country: "Switzerland", countryCode: "CH", phone: "+41 44 211 40 10", latitude: 47.3717, longitude: 8.5398 },
    { name: "The Standard Goods Seattle", street: "701 E Pike St", city: "Seattle", state: "WA", postalCode: "98122", country: "United States", countryCode: "US", phone: "+1 206-555-0199", latitude: 47.614, longitude: -122.3228 },
    { name: "Shibuya Carry & Supply", street: "1 Chome-19-10 Jinnan", city: "Tokyo", state: "Tokyo", postalCode: "150-0041", country: "Japan", countryCode: "JP", phone: "+81 3-5555-0188", latitude: 35.6628, longitude: 139.7013 },
    { name: "Redchurch Goods London", street: "32 Redchurch St", city: "London", state: "Shoreditch", postalCode: "E2 7DD", country: "United Kingdom", countryCode: "GB", phone: "+44 20 7946 0912", latitude: 51.5248, longitude: -0.0747 },
    { name: "Fitzroy Provisioners Melbourne", street: "214 Gertrude St", city: "Melbourne", state: "VIC", postalCode: "3065", country: "Australia", countryCode: "AU", phone: "+61 3 9417 8820", latitude: -37.8058, longitude: 144.9818 },
    { name: "Le Marais Carry Atelier", street: "14 Rue Vieille-du-Temple", city: "Paris", state: "IDF", postalCode: "75004", country: "France", countryCode: "FR", phone: "+33 1 42 68 55 00", latitude: 48.8575, longitude: 2.3578 },
    { name: "Mitte Minimalist Berlin", street: "Torstraße 102", city: "Berlin", state: "Berlin", postalCode: "10119", country: "Germany", countryCode: "DE", phone: "+49 30 2408 8100", latitude: 52.5285, longitude: 13.4072 },
    { name: "SoHo Outfitters New York", street: "108 Mercer St", city: "New York", state: "NY", postalCode: "10012", country: "United States", countryCode: "US", phone: "+1 212-555-0164", latitude: 40.7243, longitude: -73.9984 },
    { name: "Gulshan Artisan Hub Dhaka", street: "Road 11, Block D, Banani", city: "Dhaka", state: "Dhaka", postalCode: "1213", country: "Bangladesh", countryCode: "BD", phone: "+880 2-9884501", latitude: 23.7937, longitude: 90.4043 },
    { name: "Gastown Provision Co. Vancouver", street: "12 Water St", city: "Vancouver", state: "BC", postalCode: "V6B 1A4", country: "Canada", countryCode: "CA", phone: "+1 604-555-0182", latitude: 49.2838, longitude: -123.1075 },
  ];

  for (const s of stockistsData) {
    await prisma.stockist.create({
      data: s,
    });
  }

  // 9. 2 Discount Codes
  await prisma.discountCode.create({
    data: {
      code: "WELCOME10",
      type: DiscountType.PERCENTAGE,
      value: 10.0,
      minSubtotal: 50.0,
      maxUses: 1000,
      isActive: true,
    },
  });

  await prisma.discountCode.create({
    data: {
      code: "FREESHIP",
      type: DiscountType.FREE_SHIPPING,
      value: 0.0,
      minSubtotal: 100.0,
      isActive: true,
    },
  });

  // 10. Announcement Bar
  await prisma.announcementBar.create({
    data: {
      text: "Complimentary worldwide carbon-neutral shipping on orders over $100. Enjoy our 30-day trial.",
      linkUrl: "/products/category/bags-luggage",
      linkText: "Shop New Arrivals",
      isActive: true,
      bgHex: "#18181B",
      textHex: "#FFFFFF",
    },
  });

  // 11. Mega Menu Items
  const megaMenuData = [
    // Featured Group
    { label: "Bestsellers", href: "/products/category/featured?sort=bestselling", group: "featured", column: "popular", sortOrder: 1, isHighlighted: true },
    { label: "New Releases", href: "/products/category/featured?sort=newest", group: "featured", column: "popular", sortOrder: 2 },
    { label: "Value Sets & Bundles", href: "/bundles", group: "featured", column: "popular", sortOrder: 3, badge: "Save 15%" },
    { label: "Outlet & Archive", href: "/outlet", group: "featured", column: "popular", sortOrder: 4 },
    { label: "Travel & Transit", href: "/products/category/travel", group: "featured", column: "by-activity", sortOrder: 5 },
    { label: "Work & Commute", href: "/collection/work-commute", group: "featured", column: "by-activity", sortOrder: 6 },
    { label: "Daily Errands", href: "/collection/everyday-carry", group: "featured", column: "by-activity", sortOrder: 7 },
    { label: "Coastal All-Weather", href: "/collection/coastal-all-weather", group: "featured", column: "by-collection", sortOrder: 8 },
    { label: "The Apex Flight Series", href: "/collection/apex-flight", group: "featured", column: "by-collection", sortOrder: 9 },
    { label: "Minimalist Leather Studio", href: "/collection/leather-studio", group: "featured", column: "by-collection", sortOrder: 10 },

    // Bags & Luggage Group
    { label: "Backpacks", href: "/products/category/bags-luggage/backpacks", group: "bags-luggage", column: "styles", sortOrder: 1 },
    { label: "Totes & Slings", href: "/products/category/bags-luggage/totes-slings", group: "bags-luggage", column: "styles", sortOrder: 2 },
    { label: "Weekenders & Duffels", href: "/products/category/bags-luggage/weekenders", group: "bags-luggage", column: "styles", sortOrder: 3 },
    { label: "Luggage & Carry-On", href: "/products/category/bags-luggage/luggage", group: "bags-luggage", column: "styles", sortOrder: 4 },

    // Travel Group
    { label: "Toiletry Kits & Dopp", href: "/products/category/travel/toiletry-kits", group: "travel", column: "essentials", sortOrder: 1 },
    { label: "Passport Wallets", href: "/products/category/travel/passport-wallets", group: "travel", column: "essentials", sortOrder: 2 },
    { label: "Compression Packing Cubes", href: "/products/category/travel/packing-cubes", group: "travel", column: "essentials", sortOrder: 3 },
    { label: "Luggage Tags & Straps", href: "/products/category/travel/luggage-tags", group: "travel", column: "essentials", sortOrder: 4 },

    // Wallets Group
    { label: "Slim Bifolds", href: "/products/category/wallets/slim-bifolds", group: "wallets", column: "types", sortOrder: 1 },
    { label: "Card Holders", href: "/products/category/wallets/card-holders", group: "wallets", column: "types", sortOrder: 2 },
    { label: "Zip Folio Wallets", href: "/products/category/wallets/zip-wallets", group: "wallets", column: "types", sortOrder: 3 },
    { label: "Travel Wallets", href: "/products/category/wallets/travel-wallets", group: "wallets", column: "types", sortOrder: 4 },

    // Tech Group
    { label: "Laptop Sleeves", href: "/products/category/tech/laptop-sleeves", group: "tech", column: "gear", sortOrder: 1 },
    { label: "Tech Kits & Cable Cases", href: "/products/category/tech/tech-kits", group: "tech", column: "gear", sortOrder: 2 },
    { label: "Desk Mats & Pads", href: "/products/category/tech/desk-mats", group: "tech", column: "gear", sortOrder: 3 },
    { label: "Phone Cases", href: "/products/category/tech/phone-cases", group: "tech", column: "gear", sortOrder: 4 },

    // Accessories Group
    { label: "Key Organizers", href: "/products/category/accessories/key-covers", group: "accessories", column: "details", sortOrder: 1 },
    { label: "Eyewear Cases", href: "/products/category/accessories/eyewear-cases", group: "accessories", column: "details", sortOrder: 2 },
    { label: "Notebook Covers", href: "/products/category/accessories/notebook-covers", group: "accessories", column: "details", sortOrder: 3 },
    { label: "Lanyards & Carabiners", href: "/products/category/accessories/lanyards-straps", group: "accessories", column: "details", sortOrder: 4 },

    // About Us Group
    { label: "Our Story & Philosophy", href: "/about", group: "about", column: "brand", sortOrder: 1 },
    { label: "Responsible Materials", href: "/materials", group: "about", column: "brand", sortOrder: 2 },
    { label: "Responsible Business (B Corp)", href: "/responsible-business", group: "about", column: "brand", sortOrder: 3 },
    { label: "The Journal", href: "/journal", group: "about", column: "brand", sortOrder: 4 },
    { label: "Stockist Locator", href: "/stockists", group: "about", column: "brand", sortOrder: 5 },
    { label: "Collaborations", href: "/collaborations", group: "about", column: "brand", sortOrder: 6 },
    { label: "Careers", href: "/careers", group: "about", column: "brand", sortOrder: 7 },
  ];

  for (const item of megaMenuData) {
    await prisma.megaMenuItem.create({
      data: item,
    });
  }

  // 12. CMS Home Page Sections
  await prisma.cmsPage.create({
    data: {
      slug: "home",
      title: "AUREN Homepage",
      metaTitle: "AUREN | Considered Carry Goods for Modern Movement",
      metaDesc: "Thoughtfully engineered bags, wallets, tech folios, and travel goods crafted with premium materials and timeless minimalist aesthetics.",
      isPublished: true,
      template: "home",
      sections: [
        {
          id: "hero-carousel",
          type: "hero_carousel",
          slides: [
            {
              id: "slide-1",
              headline: "Considered Carry for Modern Movement",
              subheadline: "Architecturally sculpted backpacks and transit essentials engineered with 100% recycled technical fabrics.",
              ctaText: "Explore Backpacks",
              ctaLink: "/products/category/bags-luggage/backpacks",
              secondaryCtaText: "View Collection",
              secondaryCtaLink: "/collection/apex-flight",
              desktopImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1920&q=85",
              mobileImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",
            },
            {
              id: "slide-2",
              headline: "The Art of the Flat Pocket",
              subheadline: "Full-grain, environmentally certified leather wallets that eliminate bulk without sacrificing card capacity.",
              ctaText: "Shop Wallets",
              ctaLink: "/products/category/wallets",
              secondaryCtaText: "Our Leather Story",
              secondaryCtaLink: "/materials",
              desktopImage: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1920&q=85",
              mobileImage: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85",
            },
            {
              id: "slide-3",
              headline: "Flow Through Transit",
              subheadline: "Cabin-tested luggage, dopp kits, and compression cubes designed to turn airport checkpoints into smooth rituals.",
              ctaText: "Discover Travel",
              ctaLink: "/products/category/travel",
              secondaryCtaText: "Shop Value Sets",
              secondaryCtaLink: "/bundles",
              desktopImage: "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?auto=format&fit=crop&w=1920&q=85",
              mobileImage: "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?auto=format&fit=crop&w=900&q=85",
            },
          ],
        },
        {
          id: "promo-tiles",
          type: "promo_tiles",
          tiles: [
            { label: "New Releases", link: "/products/category/featured?sort=newest" },
            { label: "Everyday Backpacks", link: "/products/category/bags-luggage/backpacks" },
            { label: "Slim Wallets", link: "/products/category/wallets" },
            { label: "Crossbody Slings", link: "/products/category/bags-luggage/totes-slings" },
            { label: "Work & Laptop", link: "/products/category/tech" },
            { label: "Travel Essentials", link: "/products/category/travel" },
            { label: "Value Bundles", link: "/bundles" },
            { label: "The Journal", link: "/journal" },
          ],
        },
        {
          id: "activity-grid",
          type: "activity_grid",
          title: "Gear Up for Every Horizon",
          subtitle: "Designed around the distinct rhythms of modern life.",
          activities: [
            { title: "Travel", link: "/products/category/travel", image: "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?auto=format&fit=crop&w=800&q=80" },
            { title: "Work", link: "/collection/work-commute", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80" },
            { title: "Tech", link: "/products/category/tech", image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80" },
            { title: "Errands", link: "/collection/everyday-carry", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80" },
            { title: "Adventure", link: "/collection/coastal-all-weather", image: "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=800&q=80" },
            { title: "Study", link: "/collection/work-commute", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80" },
          ],
        },
        {
          id: "brand-values",
          type: "brand_values",
          values: [
            {
              title: "Considered Engineering",
              description: "Every fold, magnet, and zipper pull is calibrated for intuitive tactile efficiency.",
              icon: "compass",
            },
            {
              title: "Certified Environmental Tannery",
              description: "100% of our leather comes from Gold-rated Leather Working Group tanneries.",
              icon: "feather",
            },
            {
              title: "10-Year Craftsmanship Guarantee",
              description: "Built for longevity with modular, repairable hardware and reinforced bar-tacks.",
              icon: "shield-check",
            },
          ],
        },
      ],
    },
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
