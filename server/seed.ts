import { db } from "./db";
import {
  users,
  clients,
  emailCases,
  vehicles,
  waitlistRequests,
  knowledgeItems,
} from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(emailCases);
  await db.delete(waitlistRequests);
  await db.delete(vehicles);
  await db.delete(knowledgeItems);
  await db.delete(clients);
  await db.delete(users);

  // Seed users
  const [adminUser] = await db.insert(users).values([
    { username: "jean.dupont", password: "password123", displayName: "Jean Dupont", role: "admin" },
    { username: "marie.martin", password: "password123", displayName: "Marie Martin", role: "seller" },
    { username: "pierre.durand", password: "password123", displayName: "Pierre Durand", role: "seller" },
    { username: "sophie.bernard", password: "password123", displayName: "Sophie Bernard", role: "readonly" },
  ]).returning();

  // Seed clients
  const clientsData = await db.insert(clients).values([
    { name: "Lucas Moreau", email: "lucas.moreau@email.com", phone: "06 12 34 56 78", smsConsent: true },
    { name: "Emma Leroy", email: "emma.leroy@email.com", phone: "06 23 45 67 89", smsConsent: true },
    { name: "Hugo Bernard", email: "hugo.bernard@email.com", phone: "06 34 56 78 90", smsConsent: false },
    { name: "Chloé Dubois", email: "chloe.dubois@email.com", phone: "06 45 67 89 01", smsConsent: true },
    { name: "Gabriel Petit", email: "gabriel.petit@email.com", phone: "06 56 78 90 12", smsConsent: false },
  ]).returning();

  // Seed vehicles
  await db.insert(vehicles).values([
    {
      reference: "PEU-3008-001",
      brand: "Peugeot",
      model: "3008",
      year: 2023,
      fuel: "hybrid",
      transmission: "automatic",
      mileage: 15000,
      price: 35900,
      color: "Noir Perla",
      status: "available",
      aiUsable: true,
      description: "SUV familial hybride rechargeable, excellente autonomie électrique",
    },
    {
      reference: "REN-CLIO-002",
      brand: "Renault",
      model: "Clio",
      year: 2022,
      fuel: "gasoline",
      transmission: "manual",
      mileage: 28000,
      price: 15500,
      color: "Rouge Flamme",
      status: "available",
      aiUsable: true,
      description: "Citadine économique et fiable, idéale pour la ville",
    },
    {
      reference: "CIT-C3-003",
      brand: "Citroën",
      model: "C3",
      year: 2021,
      fuel: "diesel",
      transmission: "manual",
      mileage: 45000,
      price: 12900,
      color: "Blanc Banquise",
      status: "available",
      aiUsable: true,
      description: "Confort de conduite exceptionnel, faible consommation",
    },
    {
      reference: "TES-MOD3-004",
      brand: "Tesla",
      model: "Model 3",
      year: 2023,
      fuel: "electric",
      transmission: "automatic",
      mileage: 8000,
      price: 42900,
      color: "Bleu Nuit",
      status: "reserved",
      aiUsable: false,
      description: "Berline électrique premium, autonomie 500km, autopilot inclus",
    },
    {
      reference: "VW-GOLF-005",
      brand: "Volkswagen",
      model: "Golf",
      year: 2022,
      fuel: "gasoline",
      transmission: "automatic",
      mileage: 22000,
      price: 24500,
      color: "Gris Indium",
      status: "available",
      aiUsable: true,
      description: "Compacte premium, finition R-Line, toit ouvrant",
    },
    {
      reference: "BMW-X1-006",
      brand: "BMW",
      model: "X1",
      year: 2021,
      fuel: "diesel",
      transmission: "automatic",
      mileage: 55000,
      price: 29900,
      color: "Blanc Alpin",
      status: "sold",
      aiUsable: false,
      description: "SUV compact premium, excellent état, historique complet",
    },
  ]);

  // Seed email cases
  await db.insert(emailCases).values([
    {
      clientId: clientsData[0].id,
      subject: "Demande d'essai Peugeot 3008",
      content: "Bonjour,\n\nJe suis intéressé par le Peugeot 3008 hybride que j'ai vu sur votre site. Serait-il possible d'organiser un essai ce week-end ?\n\nMerci d'avance,\nLucas Moreau",
      senderEmail: "lucas.moreau@email.com",
      senderName: "Lucas Moreau",
      status: "new",
      priority: "high",
      aiReason: "Demande d'essai - nécessite planification",
      needsHuman: true,
    },
    {
      clientId: clientsData[1].id,
      subject: "Question sur le financement",
      content: "Bonjour,\n\nJe souhaiterais avoir plus d'informations sur les options de financement disponibles pour l'achat d'un véhicule neuf ou d'occasion.\n\nPouvez-vous me contacter pour en discuter ?\n\nCordialement,\nEmma Leroy",
      senderEmail: "emma.leroy@email.com",
      senderName: "Emma Leroy",
      status: "in_progress",
      priority: "medium",
      aiReason: "Question financière complexe",
      needsHuman: true,
      assignedTo: adminUser.id,
    },
    {
      clientId: clientsData[2].id,
      subject: "Réclamation - Problème technique",
      content: "Bonjour,\n\nJ'ai acheté un véhicule chez vous il y a 3 mois et je rencontre des problèmes avec le système de navigation. Le GPS ne fonctionne plus correctement depuis la dernière mise à jour.\n\nMerci de me recontacter rapidement.\n\nHugo Bernard",
      senderEmail: "hugo.bernard@email.com",
      senderName: "Hugo Bernard",
      status: "new",
      priority: "high",
      aiReason: "Réclamation client",
      needsHuman: true,
    },
    {
      clientId: clientsData[3].id,
      subject: "Estimation de reprise",
      content: "Bonjour,\n\nJe possède une Renault Clio 2019 avec 45000 km et je souhaiterais la faire reprendre pour l'achat d'un nouveau véhicule.\n\nPouvez-vous me donner une estimation ?\n\nMerci,\nChloé Dubois",
      senderEmail: "chloe.dubois@email.com",
      senderName: "Chloé Dubois",
      status: "follow_up",
      priority: "medium",
      aiReason: "Demande de reprise véhicule",
      needsHuman: true,
    },
    {
      subject: "Disponibilité Tesla Model 3",
      content: "Bonjour,\n\nAvez-vous des Tesla Model 3 disponibles actuellement ? Je recherche un modèle récent avec moins de 30000 km.\n\nMerci pour votre retour.",
      senderEmail: "prospect@email.com",
      senderName: null,
      status: "new",
      priority: "low",
      aiReason: "Question stock - véhicule spécifique indisponible",
      needsHuman: true,
    },
  ]);

  // Seed waitlist requests
  await db.insert(waitlistRequests).values([
    {
      clientId: clientsData[0].id,
      clientName: "Lucas Moreau",
      phone: "06 12 34 56 78",
      smsConsent: true,
      status: "waiting",
      priority: "high",
      brandPreference: "Peugeot",
      modelPreference: "3008",
      yearMin: 2022,
      fuelPreference: "hybrid",
      transmissionPreference: "automatic",
      maxBudget: 40000,
    },
    {
      clientId: clientsData[1].id,
      clientName: "Emma Leroy",
      phone: "06 23 45 67 89",
      smsConsent: true,
      status: "waiting",
      priority: "medium",
      brandPreference: "Renault",
      modelPreference: "Captur",
      yearMin: 2021,
      fuelPreference: "gasoline",
      maxMileage: 50000,
      maxBudget: 20000,
    },
    {
      clientName: "Thomas Petit",
      phone: "06 78 90 12 34",
      smsConsent: true,
      status: "contacted",
      priority: "high",
      brandPreference: "Tesla",
      yearMin: 2022,
      fuelPreference: "electric",
      maxBudget: 50000,
      notes: "Très intéressé, rappeler cette semaine",
      contactHistory: "15/01/2026 - Premier contact par téléphone, intéressé par Tesla Model 3 ou Y",
    },
    {
      clientName: "Julie Martin",
      phone: "06 89 01 23 45",
      smsConsent: false,
      status: "waiting",
      priority: "low",
      brandPreference: "Citroën",
      modelPreference: "C3",
      yearMax: 2023,
      fuelPreference: "diesel",
      maxMileage: 80000,
      maxBudget: 15000,
      colorPreference: "Blanc",
    },
    {
      clientName: "Antoine Rousseau",
      phone: "06 90 12 34 56",
      smsConsent: true,
      status: "converted",
      priority: "medium",
      brandPreference: "BMW",
      modelPreference: "X1",
      yearMin: 2020,
      maxBudget: 35000,
      contactHistory: "10/01/2026 - Vendu BMW X1 réf BMX-X1-006",
    },
  ]);

  // Seed knowledge items
  await db.insert(knowledgeItems).values([
    { category: "hours", key: "monday", value: "09:00 - 18:00" },
    { category: "hours", key: "tuesday", value: "09:00 - 18:00" },
    { category: "hours", key: "wednesday", value: "09:00 - 18:00" },
    { category: "hours", key: "thursday", value: "09:00 - 18:00" },
    { category: "hours", key: "friday", value: "09:00 - 18:00" },
    { category: "hours", key: "saturday", value: "10:00 - 17:00" },
    { category: "hours", key: "sunday", value: "Fermé" },
    { category: "contact", key: "address", value: "123 Avenue des Voitures\n75001 Paris" },
    { category: "contact", key: "phone_sales", value: "01 23 45 67 89" },
    { category: "contact", key: "phone_service", value: "01 23 45 67 90" },
    { category: "contact", key: "email_sales", value: "vente@autoconcession.fr" },
    { category: "contact", key: "email_service", value: "sav@autoconcession.fr" },
    { category: "procedure", key: "test_drive", value: "Essai gratuit sur rendez-vous. Permis de conduire et pièce d'identité requis. Durée: 30 minutes minimum." },
    { category: "procedure", key: "trade_in", value: "Estimation gratuite de votre véhicule actuel. Apporter carte grise, carnet d'entretien et clés." },
    { category: "procedure", key: "financing", value: "Solutions de financement personnalisées. Crédit classique, LOA, LLD disponibles. Simulation gratuite." },
    { category: "ai_rules", key: "tone", value: "professional" },
    { category: "ai_rules", key: "signature", value: "L'équipe AutoConcession" },
    { category: "ai_rules", key: "human_cases", value: "Négociation de prix, réclamation, demande de reprise, question juridique" },
    { category: "faq", key: "payment_methods", value: "Nous acceptons les paiements par carte bancaire, virement, chèque et financement." },
    { category: "faq", key: "warranty", value: "Tous nos véhicules d'occasion bénéficient d'une garantie minimum de 12 mois." },
  ]);

  console.log("Database seeded successfully!");
}

seed()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
