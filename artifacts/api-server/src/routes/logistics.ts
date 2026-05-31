import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/logistics/ai-adoption", async (_req, res): Promise<void> => {
  res.json({
    marketSize: 8.4,
    projectedMarketSize: 43.2,
    trends: [
      { year: 2019, adoptionRate: 6, investment: 0.3, companies: 42 },
      { year: 2020, adoptionRate: 10, investment: 0.5, companies: 71 },
      { year: 2021, adoptionRate: 16, investment: 0.9, companies: 134 },
      { year: 2022, adoptionRate: 24, investment: 1.8, companies: 230 },
      { year: 2023, adoptionRate: 34, investment: 3.1, companies: 380 },
      { year: 2024, adoptionRate: 46, investment: 5.2, companies: 580 },
      { year: 2025, adoptionRate: 58, investment: 8.4, companies: 820 },
    ],
    technologies: [
      { name: "Predictive Analytics", adoptionPercent: 62, useCases: "Demand forecasting, inventory optimization" },
      { name: "Route Optimization AI", adoptionPercent: 58, useCases: "Last-mile delivery, fleet management" },
      { name: "Warehouse Automation", adoptionPercent: 49, useCases: "Robotic picking, automated sorting" },
      { name: "IoT & Real-time Tracking", adoptionPercent: 71, useCases: "Cold-chain, container tracking" },
      { name: "Blockchain", adoptionPercent: 28, useCases: "Trade documentation, compliance" },
      { name: "Computer Vision", adoptionPercent: 34, useCases: "Quality inspection, cargo scanning" },
      { name: "Generative AI / LLMs", adoptionPercent: 22, useCases: "Customer support, document processing" },
      { name: "Digital Twins", adoptionPercent: 18, useCases: "Port simulation, supply chain modelling" },
    ],
  });
});

router.get("/logistics/transport-modes", async (_req, res): Promise<void> => {
  res.json([
    { mode: "Road", sharePercent: 65, volumeMT: 2600, growthRate: 8.2, color: "#FF6B35" },
    { mode: "Rail", sharePercent: 18, volumeMT: 720, growthRate: 9.8, color: "#004E89" },
    { mode: "Water / Inland Waterways", sharePercent: 6, volumeMT: 240, growthRate: 12.4, color: "#1B998B" },
    { mode: "Air Cargo", sharePercent: 2, volumeMT: 80, growthRate: 11.6, color: "#E84855" },
    { mode: "Pipeline", sharePercent: 9, volumeMT: 360, growthRate: 4.1, color: "#F9C74F" },
  ]);
});

router.get("/logistics/infrastructure", async (_req, res): Promise<void> => {
  res.json({
    ports: [
      { rank: 1, name: "Jawaharlal Nehru Port (JNPT)", state: "Maharashtra", cargoMT: 79.5, type: "Container", connected: "DMIC, Western DFC, Mumbai", aiEnabled: true },
      { rank: 2, name: "Mundra Port", state: "Gujarat", cargoMT: 161, type: "Multi-cargo", connected: "Western DFC, Ahmedabad, Delhi", aiEnabled: true },
      { rank: 3, name: "Paradip Port", state: "Odisha", cargoMT: 130, type: "Bulk", connected: "Eastern DFC, Visakhapatnam", aiEnabled: false },
      { rank: 4, name: "Visakhapatnam Port", state: "Andhra Pradesh", cargoMT: 76, type: "Multi-cargo", connected: "Eastern DFC, Chennai", aiEnabled: true },
      { rank: 5, name: "Chennai Port", state: "Tamil Nadu", cargoMT: 72, type: "Container + Bulk", connected: "Eastern & Western DFC, Bengaluru", aiEnabled: true },
      { rank: 6, name: "Kandla Port (Deendayal)", state: "Gujarat", cargoMT: 140, type: "Multi-cargo", connected: "Western DFC, Rajkot", aiEnabled: false },
      { rank: 7, name: "Haldia Port", state: "West Bengal", cargoMT: 62, type: "Bulk", connected: "Eastern DFC, Kolkata", aiEnabled: false },
      { rank: 8, name: "Kochi Port", state: "Kerala", cargoMT: 28, type: "Container", connected: "Coimbatore, Bengaluru via NH", aiEnabled: true },
    ],
    airports: [
      { rank: 1, name: "Indira Gandhi International", city: "Delhi", cargoMT: 1.08, connected: "Western DFC, Ludhiana, Chandigarh", aiEnabled: true },
      { rank: 2, name: "Chhatrapati Shivaji Maharaj Intl", city: "Mumbai", cargoMT: 0.88, connected: "JNPT, Pune, Nashik", aiEnabled: true },
      { rank: 3, name: "Kempegowda International", city: "Bengaluru", cargoMT: 0.54, connected: "Chennai, Hyderabad, KIADB", aiEnabled: true },
      { rank: 4, name: "Rajiv Gandhi International", city: "Hyderabad", cargoMT: 0.42, connected: "Visakhapatnam, Chennai", aiEnabled: true },
      { rank: 5, name: "Chennai International", city: "Chennai", cargoMT: 0.38, connected: "Chennai Port, Sriperumbudur", aiEnabled: false },
      { rank: 6, name: "Netaji Subhash Chandra Bose Intl", city: "Kolkata", cargoMT: 0.22, connected: "Haldia Port, Eastern DFC", aiEnabled: false },
      { rank: 7, name: "Sardar Vallabhbhai Patel Intl", city: "Ahmedabad", cargoMT: 0.18, connected: "Mundra Port, Surat", aiEnabled: true },
    ],
    expressways: [
      { rank: 1, name: "Delhi-Mumbai Expressway (PM Gati Shakti)", lengthKm: 1350, states: 6, corridors: "Delhi, Haryana, Rajasthan, MP, Gujarat, Maharashtra", status: "Under Construction" },
      { rank: 2, name: "Yamuna Expressway", lengthKm: 165, states: 2, corridors: "Delhi, Agra", status: "Live" },
      { rank: 3, name: "Purvanchal Expressway", lengthKm: 341, states: 1, corridors: "Lucknow to Ghazipur (UP)", status: "Live" },
      { rank: 4, name: "Mumbai-Pune Expressway", lengthKm: 95, states: 2, corridors: "Mumbai, Pune, JNPT Corridor", status: "Live" },
      { rank: 5, name: "Delhi-Meerut Expressway (RRTS)", lengthKm: 82, states: 2, corridors: "Delhi NCR, Meerut", status: "Live" },
      { rank: 6, name: "Bengaluru-Chennai Expressway", lengthKm: 262, states: 2, corridors: "Bengaluru, Chennai ports", status: "Under Construction" },
      { rank: 7, name: "Ahmedabad-Dholera Expressway", lengthKm: 110, states: 1, corridors: "Ahmedabad, DMIC Dholera", status: "Under Construction" },
      { rank: 8, name: "Ganga Expressway", lengthKm: 594, states: 1, corridors: "Meerut to Prayagraj (UP)", status: "Under Construction" },
    ],
    freightHubs: [
      { rank: 1, name: "Dedicated Freight Corridor – Western (WDFC)", state: "Haryana–Maharashtra", type: "Rail Freight Corridor", capacityMT: 150, status: "Live", connected: "JNPT, Mundra, Delhi, Ludhiana" },
      { rank: 2, name: "Dedicated Freight Corridor – Eastern (EDFC)", state: "Punjab–West Bengal", type: "Rail Freight Corridor", capacityMT: 120, status: "Live", connected: "Kolkata, Ludhiana, Varanasi" },
      { rank: 3, name: "CONCOR ICD Tughlakabad", state: "Delhi", type: "Inland Container Depot", capacityMT: 18, status: "Live", connected: "JNPT, Ludhiana, Kanpur" },
      { rank: 4, name: "Multimodal Logistics Park – Jogighopa", state: "Assam", type: "Multimodal Hub", capacityMT: 5, status: "Under Construction", connected: "Bangladesh, Bhutan, Myanmar" },
      { rank: 5, name: "Sanand Logistics Park", state: "Gujarat", type: "Industrial Logistics", capacityMT: 12, status: "Live", connected: "Mundra Port, Ahmedabad, Rajkot" },
      { rank: 6, name: "Chennai Multimodal Logistics Hub", state: "Tamil Nadu", type: "Multimodal Hub", capacityMT: 8, status: "Under Construction", connected: "Chennai Port, Kattupalli Port, Airport" },
      { rank: 7, name: "Delhi MMLP Nangal Chaudhry", state: "Haryana", type: "Multimodal Logistics Park", capacityMT: 16, status: "Under Construction", connected: "Western DFC, Delhi, Bhiwadi" },
    ],
    manufacturingHubs: [
      { rank: 1, name: "Surat Industrial Corridor", state: "Gujarat", sector: "Textiles, Diamonds, Chemicals", exportValueB: 38, supplyChainContrib: 14.2 },
      { rank: 2, name: "Pune-Nashik Manufacturing Belt", state: "Maharashtra", sector: "Automotive, Defence, Electronics", exportValueB: 29, supplyChainContrib: 11.8 },
      { rank: 3, name: "Bengaluru Tech & Aerospace Corridor", state: "Karnataka", sector: "Electronics, Aerospace, Pharma", exportValueB: 26, supplyChainContrib: 10.4 },
      { rank: 4, name: "Sriperumbudur-Chennai Corridor", state: "Tamil Nadu", sector: "Automobiles, Electronics (Samsung, Nokia)", exportValueB: 24, supplyChainContrib: 9.6 },
      { rank: 5, name: "Ludhiana Industrial Area", state: "Punjab", sector: "Textiles, Cycles, Auto Components", exportValueB: 12, supplyChainContrib: 5.1 },
      { rank: 6, name: "Manesar-Bawal DMIC Node", state: "Haryana", sector: "Automotive, Consumer Durables", exportValueB: 18, supplyChainContrib: 7.8 },
      { rank: 7, name: "Hyderabad Pharma City", state: "Telangana", sector: "Pharmaceuticals, Biotech", exportValueB: 21, supplyChainContrib: 8.3 },
      { rank: 8, name: "Greater Noida Electronics Hub", state: "Uttar Pradesh", sector: "Mobile Phones, IT Hardware", exportValueB: 15, supplyChainContrib: 6.2 },
    ],
  });
});

router.get("/logistics/supply-chain-networks", async (_req, res): Promise<void> => {
  res.json([
    { name: "Delhi-Mumbai Industrial Corridor (DMIC)", status: "Live", valueBUSD: 90, type: "Industrial + Logistics", states: 6, keyNodes: "Delhi, Jaipur, Ahmedabad, Mumbai, JNPT, Mundra", completion: 100 },
    { name: "Western Dedicated Freight Corridor (WDFC)", status: "Live", valueBUSD: 12.6, type: "Rail Freight", states: 6, keyNodes: "Ludhiana, Dadri, Rewari, Vadodara, JNPT", completion: 100 },
    { name: "Eastern Dedicated Freight Corridor (EDFC)", status: "Live", valueBUSD: 11.8, type: "Rail Freight", states: 9, keyNodes: "Ludhiana, Ambala, Khurja, Kanpur, Kolkata", completion: 100 },
    { name: "Sagarmala Programme (Port-Led Development)", status: "In Progress", valueBUSD: 123, type: "Port + Coastal", states: 14, keyNodes: "All 12 Major Ports, Coastal Economic Zones", completion: 62 },
    { name: "PM Gati Shakti National Master Plan", status: "In Progress", valueBUSD: 1400, type: "Multimodal Infrastructure", states: 28, keyNodes: "All major ports, airports, freight hubs", completion: 48 },
    { name: "Chennai-Bengaluru Industrial Corridor (CBIC)", status: "In Progress", valueBUSD: 7.2, type: "Industrial", states: 2, keyNodes: "Chennai, Hosur, Tumkur, Bengaluru", completion: 34 },
    { name: "Amritsar-Kolkata Industrial Corridor (AKIC)", status: "In Progress", valueBUSD: 14, type: "Industrial + Rail", states: 7, keyNodes: "Amritsar, Ludhiana, Chandigarh, Kolkata", completion: 28 },
    { name: "East Coast Economic Corridor (ECEC)", status: "In Progress", valueBUSD: 82, type: "Coastal + Industrial", states: 5, keyNodes: "Kolkata, Visakhapatnam, Chennai, Tuticorin", completion: 22 },
    { name: "Bangalore-Mumbai Economic Corridor (BMEC)", status: "In Progress", valueBUSD: 9.5, type: "Industrial", states: 2, keyNodes: "Bengaluru, Pune, Mumbai", completion: 18 },
    { name: "Hyderabad-Warangal Industrial Corridor (HWIC)", status: "In Progress", valueBUSD: 3.2, type: "Industrial", states: 1, keyNodes: "Hyderabad, Warangal, Nalgonda", completion: 41 },
  ]);
});

router.get("/logistics/market-advantages", async (_req, res): Promise<void> => {
  res.json({
    lpiScore: 3.4,
    lpiRank: 38,
    stats: [
      { label: "Logistics Market Size (2025)", value: 317, unit: "USD Billion", trend: "up" },
      { label: "Projected Market Size (2030)", value: 484, unit: "USD Billion", trend: "up" },
      { label: "CAGR (2025–2030)", value: 8.8, unit: "%", trend: "up" },
      { label: "Logistics Cost as % of GDP", value: 14, unit: "%", trend: "down" },
      { label: "Target Logistics Cost (2030)", value: 8, unit: "% of GDP", trend: "down" },
      { label: "Total Warehousing Space", value: 360, unit: "Million sq ft", trend: "up" },
    ],
    advantages: [
      { category: "Market Size & Growth", indiaScore: 88, worldAvg: 62, rank: 3, description: "3rd largest logistics market globally, CAGR of 8.8% outpacing world average of 5.2%" },
      { category: "Digital Infrastructure", indiaScore: 72, worldAvg: 58, rank: 12, description: "UPI-enabled supply chain payments, GSTN integration, Faceless assessments at ports" },
      { category: "Workforce & Cost Advantage", indiaScore: 91, worldAvg: 55, rank: 1, description: "Largest skilled logistics workforce at 1/5th the cost of developed nations" },
      { category: "Policy & Reform Momentum", indiaScore: 79, worldAvg: 61, rank: 8, description: "PM Gati Shakti, NLP 2022, Sagarmala, 100% FDI in logistics infrastructure" },
      { category: "Multimodal Connectivity", indiaScore: 68, worldAvg: 64, rank: 14, description: "Largest rail freight network in Asia; DFCs linking ports to hinterland" },
      { category: "AI & Tech Adoption", indiaScore: 66, worldAvg: 54, rank: 11, description: "Fastest-growing AI logistics market in Asia; 58% adoption projected by 2025" },
      { category: "Export Competitiveness", indiaScore: 74, worldAvg: 63, rank: 9, description: "PLI schemes driving manufacturing exports across 14 sectors" },
      { category: "Cold Chain Infrastructure", indiaScore: 55, worldAvg: 61, rank: 22, description: "Rapidly expanding; 37% CAGR in cold chain logistics investment" },
    ],
  });
});

router.get("/logistics/companies", async (_req, res): Promise<void> => {
  res.json([
    { name: "Delhivery", segment: "Express Logistics", aiTools: "Route AI, Demand Forecasting", aiUseCase: "ML-based route optimisation, real-time tracking", revenue: 1.8, aiAdoptionLevel: "Advanced" },
    { name: "Blue Dart (DHL)", segment: "Express & Air Cargo", aiTools: "Predictive Analytics, IoT", aiUseCase: "Shipment prediction, fleet telematics", revenue: 0.52, aiAdoptionLevel: "Advanced" },
    { name: "Mahindra Logistics", segment: "3PL / Supply Chain", aiTools: "Digital Twin, WMS AI", aiUseCase: "Warehouse automation, demand sensing", revenue: 0.67, aiAdoptionLevel: "High" },
    { name: "Gati-KWE", segment: "Surface Express", aiTools: "Route Optimisation, Chatbot", aiUseCase: "Dynamic routing, customer support AI", revenue: 0.35, aiAdoptionLevel: "Moderate" },
    { name: "Allcargo Logistics", segment: "NVOCC / 3PL", aiTools: "AI Freight Procurement", aiUseCase: "Spot rate prediction, container optimisation", revenue: 1.2, aiAdoptionLevel: "High" },
    { name: "CONCOR (Container Corp of India)", segment: "Rail Freight / ICD", aiTools: "IoT Tracking, Blockchain", aiUseCase: "Rail container tracking, customs EDI", revenue: 0.82, aiAdoptionLevel: "Moderate" },
    { name: "Amazon India (Logistics Arm)", segment: "E-commerce Logistics", aiTools: "Robotics AI, Drone Tech", aiUseCase: "Robotic sortation, drone delivery pilots", revenue: 4.2, aiAdoptionLevel: "Advanced" },
    { name: "Flipkart Ekart", segment: "E-commerce Logistics", aiTools: "ML Routing, Vision AI", aiUseCase: "Last-mile AI, photo-proof delivery", revenue: 2.1, aiAdoptionLevel: "Advanced" },
    { name: "TVS Supply Chain Solutions", segment: "Integrated Supply Chain", aiTools: "S&OP AI, Control Tower", aiUseCase: "End-to-end supply chain visibility", revenue: 0.94, aiAdoptionLevel: "High" },
    { name: "Rivigo (CEVA Logistics)", segment: "Relay Trucking", aiTools: "Driver AI, Relay Model", aiUseCase: "Driver fatigue AI, relay trucking model", revenue: 0.28, aiAdoptionLevel: "High" },
  ]);
});

router.get("/logistics/states", async (_req, res): Promise<void> => {
  res.json([
    { state: "Andhra Pradesh", lpi: 4.52, policyScore: 92, infrastructure: 88, aiAdoption: 74, warehouseCapacity: 28, rank: 1 },
    { state: "Telangana", lpi: 4.38, policyScore: 88, infrastructure: 82, aiAdoption: 78, warehouseCapacity: 22, rank: 2 },
    { state: "Gujarat", lpi: 4.34, policyScore: 90, infrastructure: 91, aiAdoption: 72, warehouseCapacity: 48, rank: 3 },
    { state: "Karnataka", lpi: 4.28, policyScore: 86, infrastructure: 80, aiAdoption: 82, warehouseCapacity: 34, rank: 4 },
    { state: "Maharashtra", lpi: 4.22, policyScore: 84, infrastructure: 85, aiAdoption: 76, warehouseCapacity: 62, rank: 5 },
    { state: "Tamil Nadu", lpi: 4.18, policyScore: 82, infrastructure: 83, aiAdoption: 68, warehouseCapacity: 38, rank: 6 },
    { state: "Haryana", lpi: 4.08, policyScore: 80, infrastructure: 78, aiAdoption: 64, warehouseCapacity: 42, rank: 7 },
    { state: "Punjab", lpi: 3.98, policyScore: 76, infrastructure: 74, aiAdoption: 58, warehouseCapacity: 24, rank: 8 },
    { state: "Rajasthan", lpi: 3.92, policyScore: 74, infrastructure: 72, aiAdoption: 54, warehouseCapacity: 28, rank: 9 },
    { state: "Uttar Pradesh", lpi: 3.86, policyScore: 72, infrastructure: 68, aiAdoption: 52, warehouseCapacity: 44, rank: 10 },
    { state: "Uttarakhand", lpi: 3.82, policyScore: 70, infrastructure: 66, aiAdoption: 48, warehouseCapacity: 12, rank: 11 },
    { state: "Himachal Pradesh", lpi: 3.76, policyScore: 68, infrastructure: 62, aiAdoption: 44, warehouseCapacity: 8, rank: 12 },
    { state: "West Bengal", lpi: 3.68, policyScore: 64, infrastructure: 64, aiAdoption: 46, warehouseCapacity: 26, rank: 13 },
    { state: "Kerala", lpi: 3.62, policyScore: 66, infrastructure: 60, aiAdoption: 50, warehouseCapacity: 14, rank: 14 },
    { state: "Odisha", lpi: 3.58, policyScore: 62, infrastructure: 58, aiAdoption: 42, warehouseCapacity: 18, rank: 15 },
  ]);
});

router.get("/logistics/global-comparison", async (_req, res): Promise<void> => {
  res.json([
    { country: "Germany", lpiRank: 1, lpiScore: 4.20, marketSizeB: 420, growthRate: 3.2, aiAdoption: 72, infrastructure: 96 },
    { country: "Singapore", lpiRank: 5, lpiScore: 4.10, marketSizeB: 52, growthRate: 4.1, aiAdoption: 84, infrastructure: 98 },
    { country: "USA", lpiRank: 6, lpiScore: 4.06, marketSizeB: 1850, growthRate: 3.8, aiAdoption: 88, infrastructure: 92 },
    { country: "Japan", lpiRank: 13, lpiScore: 3.92, marketSizeB: 280, growthRate: 2.8, aiAdoption: 76, infrastructure: 94 },
    { country: "China", lpiRank: 19, lpiScore: 3.70, marketSizeB: 780, growthRate: 7.2, aiAdoption: 86, infrastructure: 88 },
    { country: "India", lpiRank: 38, lpiScore: 3.40, marketSizeB: 317, growthRate: 8.8, aiAdoption: 58, infrastructure: 72 },
    { country: "Brazil", lpiRank: 55, lpiScore: 3.10, marketSizeB: 180, growthRate: 5.4, aiAdoption: 42, infrastructure: 58 },
    { country: "Indonesia", lpiRank: 63, lpiScore: 3.02, marketSizeB: 74, growthRate: 7.8, aiAdoption: 38, infrastructure: 54 },
  ]);
});

export default router;
