"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Eintrag = { id: string; datum: string; mahlzeit?: string; name: string; kcal: number; kh: number; eiweiss: number; fett: number; ballaststoffe?: number };
type DBItem = { name: string; kcal: number; kh: number; eiweiss: number; fett: number; ballaststoffe: number; einheit: string; synonyme?: string[] };

type Suende = { emoji: string; name: string; kcal: number; kh: number; eiweiss: number; fett: number };

const SUENDEN: Suende[] = [
  { emoji: "🍕", name: "Pizza (1 Stück)", kcal: 260, kh: 31, eiweiss: 10, fett: 10 },
  { emoji: "🍟", name: "Pommes (Portion)", kcal: 290, kh: 37, eiweiss: 3.5, fett: 15 },
  { emoji: "🍔", name: "Burger", kcal: 540, kh: 45, eiweiss: 28, fett: 25 },
  { emoji: "🥐", name: "Croissant", kcal: 406, kh: 46, eiweiss: 7, fett: 22 },
  { emoji: "🍫", name: "Schokolade (50g)", kcal: 268, kh: 30, eiweiss: 3.5, fett: 15 },
  { emoji: "🍺", name: "Bier (500ml)", kcal: 215, kh: 17.5, eiweiss: 2.5, fett: 0 },
  { emoji: "🍷", name: "Wein (200ml)", kcal: 166, kh: 4, eiweiss: 0.2, fett: 0 },
  { emoji: "🍞", name: "Brötchen", kcal: 190, kh: 37, eiweiss: 6, fett: 1.8 },
  { emoji: "🍝", name: "Pasta (200g)", kcal: 316, kh: 62, eiweiss: 11.6, fett: 1.8 },
  { emoji: "🍨", name: "Eiskugel", kcal: 140, kh: 16, eiweiss: 2.4, fett: 7.5 },
];

const MAHLZEITEN = [
  { key: "fruehstueck", label: "Frühstück", icon: "🌅" },
  { key: "mittagessen", label: "Mittagessen", icon: "☀️" },
  { key: "abendessen",  label: "Abendessen",  icon: "🌙" },
  { key: "snack",       label: "Snack",       icon: "🍎" },
];

// Mini-DB für Schnellsuche (Keto + Alltag + Sünden)
const DB: DBItem[] = [
  // === KETO-BASICS ===
  { name: "Ei (1 Stück)", kcal: 85, kh: 0.6, eiweiss: 7, fett: 6, ballaststoffe: 0, einheit: "Stück", synonyme: ["eier","hühnerei"] },
  { name: "Sahne (30% Fett)", kcal: 290, kh: 3, eiweiss: 2, fett: 30, ballaststoffe: 0, einheit: "ml", synonyme: ["schlagsahne","süße sahne","kochsahne","schlag","obers","creme","sahen"] },
  { name: "Sahne (35% Fett / Schlagsahne)", kcal: 337, kh: 2.7, eiweiss: 2, fett: 35, ballaststoffe: 0, einheit: "ml", synonyme: ["sahne","schlag","obers","cream"] },
  { name: "Schmand 24%", kcal: 240, kh: 3, eiweiss: 2.5, fett: 24, ballaststoffe: 0, einheit: "g", synonyme: ["sauerrahm","schmant"] },
  { name: "Butter", kcal: 740, kh: 0.5, eiweiss: 0.7, fett: 82, ballaststoffe: 0, einheit: "g" },
  { name: "Ghee", kcal: 876, kh: 0, eiweiss: 0, fett: 99, ballaststoffe: 0, einheit: "g", synonyme: ["butterschmalz"] },
  { name: "Frischkäse (Doppelrahm)", kcal: 260, kh: 2.5, eiweiss: 5, fett: 26, ballaststoffe: 0, einheit: "g", synonyme: ["philadelphia","cream cheese"] },
  { name: "Quark (mager)", kcal: 67, kh: 4, eiweiss: 12, fett: 0.2, ballaststoffe: 0, einheit: "g" },
  { name: "Skyr", kcal: 63, kh: 4, eiweiss: 11, fett: 0.2, ballaststoffe: 0, einheit: "g" },
  { name: "Griechischer Joghurt 10%", kcal: 133, kh: 4, eiweiss: 7, fett: 10, ballaststoffe: 0, einheit: "g", synonyme: ["joghurt","yogurt"] },
  { name: "Mascarpone", kcal: 430, kh: 3, eiweiss: 4, fett: 44, ballaststoffe: 0, einheit: "g" },
  { name: "Gouda", kcal: 356, kh: 0.5, eiweiss: 25, fett: 28, ballaststoffe: 0, einheit: "g" },
  { name: "Mozzarella", kcal: 280, kh: 2, eiweiss: 18, fett: 22, ballaststoffe: 0, einheit: "g" },
  { name: "Parmesan", kcal: 431, kh: 0, eiweiss: 38, fett: 29, ballaststoffe: 0, einheit: "g" },
  { name: "Feta", kcal: 264, kh: 1, eiweiss: 14, fett: 22, ballaststoffe: 0, einheit: "g", synonyme: ["schafskäse"] },
  { name: "Hüttenkäse (Cottage Cheese)", kcal: 103, kh: 3, eiweiss: 11, fett: 5, ballaststoffe: 0, einheit: "g", synonyme: ["cottage"] },
  { name: "Hähnchenbrust", kcal: 110, kh: 0, eiweiss: 23, fett: 1.5, ballaststoffe: 0, einheit: "g", synonyme: ["chicken","huhn","hühnchen"] },
  { name: "Rinderhack", kcal: 250, kh: 0, eiweiss: 18, fett: 20, ballaststoffe: 0, einheit: "g", synonyme: ["hackfleisch","faschiertes"] },
  { name: "Speck / Bacon", kcal: 430, kh: 0, eiweiss: 12, fett: 42, ballaststoffe: 0, einheit: "g", synonyme: ["bauchspeck"] },
  { name: "Lachs (frisch)", kcal: 208, kh: 0, eiweiss: 20, fett: 13, ballaststoffe: 0, einheit: "g", synonyme: ["salmon"] },
  { name: "Thunfisch (Dose)", kcal: 116, kh: 0, eiweiss: 26, fett: 1, ballaststoffe: 0, einheit: "g", synonyme: ["tuna"] },
  { name: "Olivenöl", kcal: 884, kh: 0, eiweiss: 0, fett: 100, ballaststoffe: 0, einheit: "ml" },
  { name: "MCT-Öl", kcal: 884, kh: 0, eiweiss: 0, fett: 100, ballaststoffe: 0, einheit: "ml", synonyme: ["mct"] },
  { name: "Avocado", kcal: 160, kh: 2, eiweiss: 2, fett: 15, ballaststoffe: 7, einheit: "g" },
  { name: "Brokkoli", kcal: 34, kh: 4, eiweiss: 3, fett: 0.4, ballaststoffe: 2.6, einheit: "g" },
  { name: "Zucchini", kcal: 17, kh: 2, eiweiss: 1.3, fett: 0.2, ballaststoffe: 1, einheit: "g" },
  { name: "Blumenkohl", kcal: 25, kh: 3, eiweiss: 2, fett: 0.3, ballaststoffe: 2, einheit: "g", synonyme: ["karfiol"] },
  { name: "Spinat", kcal: 23, kh: 1, eiweiss: 3, fett: 0.4, ballaststoffe: 2.2, einheit: "g" },
  { name: "Mandeln", kcal: 576, kh: 7, eiweiss: 21, fett: 50, ballaststoffe: 12, einheit: "g" },
  { name: "Walnüsse", kcal: 654, kh: 7, eiweiss: 15, fett: 65, ballaststoffe: 7, einheit: "g" },
  { name: "Erythrit", kcal: 0, kh: 0, eiweiss: 0, fett: 0, ballaststoffe: 0, einheit: "g", synonyme: ["zuckerersatz"] },
  { name: "Flohsamenschalen", kcal: 160, kh: 69, eiweiss: 3, fett: 1, ballaststoffe: 67, einheit: "g", synonyme: ["psyllium"] },
  { name: "Mandelmehl", kcal: 590, kh: 9, eiweiss: 21, fett: 52, ballaststoffe: 10, einheit: "g" },
  { name: "Kokosmehl", kcal: 400, kh: 20, eiweiss: 19, fett: 15, ballaststoffe: 38, einheit: "g" },
  { name: "Erdbeeren", kcal: 32, kh: 6, eiweiss: 0.7, fett: 0.3, ballaststoffe: 2, einheit: "g" },
  { name: "Himbeeren", kcal: 52, kh: 5, eiweiss: 1.2, fett: 0.7, ballaststoffe: 6.5, einheit: "g" },
  { name: "Kaffee (schwarz)", kcal: 2, kh: 0, eiweiss: 0.3, fett: 0, ballaststoffe: 0, einheit: "ml" },
  { name: "Proteinpulver (Whey)", kcal: 370, kh: 6, eiweiss: 75, fett: 5, ballaststoffe: 1, einheit: "g", synonyme: ["whey","protein"] },

  // === FLEISCH & FISCH ===
  { name: "Rinderfilet", kcal: 136, kh: 0, eiweiss: 21, fett: 5.5, ballaststoffe: 0, einheit: "g", synonyme: ["steak","filet"] },
  { name: "Schweinefilet", kcal: 143, kh: 0, eiweiss: 22, fett: 6, ballaststoffe: 0, einheit: "g", synonyme: ["schwein"] },
  { name: "Schweineschnitzel", kcal: 190, kh: 0, eiweiss: 22, fett: 11, ballaststoffe: 0, einheit: "g", synonyme: ["schnitzel"] },
  { name: "Putenbrust", kcal: 107, kh: 0, eiweiss: 24, fett: 1, ballaststoffe: 0, einheit: "g", synonyme: ["pute","truthahn"] },
  { name: "Salami", kcal: 425, kh: 1, eiweiss: 22, fett: 36, ballaststoffe: 0, einheit: "g" },
  { name: "Schinken (gekocht)", kcal: 108, kh: 1, eiweiss: 18, fett: 3.5, ballaststoffe: 0, einheit: "g" },
  { name: "Bratwurst", kcal: 285, kh: 2, eiweiss: 15, fett: 24, ballaststoffe: 0, einheit: "g", synonyme: ["wurst","grillwurst"] },
  { name: "Garnelen", kcal: 80, kh: 0, eiweiss: 18, fett: 0.9, ballaststoffe: 0, einheit: "g", synonyme: ["shrimps","crevetten"] },
  { name: "Kabeljau / Dorsch", kcal: 70, kh: 0, eiweiss: 16, fett: 0.3, ballaststoffe: 0, einheit: "g", synonyme: ["dorsch","fisch"] },

  // === GEMÜSE (ALLE) ===
  { name: "Tomate", kcal: 18, kh: 3, eiweiss: 0.9, fett: 0.2, ballaststoffe: 1.2, einheit: "g", synonyme: ["tomaten","paradeiser"] },
  { name: "Gurke", kcal: 12, kh: 1.5, eiweiss: 0.6, fett: 0.1, ballaststoffe: 0.6, einheit: "g" },
  { name: "Paprika (rot)", kcal: 31, kh: 6, eiweiss: 1, fett: 0.3, ballaststoffe: 2, einheit: "g", synonyme: ["paprika"] },
  { name: "Zwiebel", kcal: 40, kh: 9, eiweiss: 1, fett: 0.1, ballaststoffe: 1.8, einheit: "g", synonyme: ["zwiebeln"] },
  { name: "Knoblauch (1 Zehe)", kcal: 15, kh: 3, eiweiss: 0.6, fett: 0.1, ballaststoffe: 0.2, einheit: "Stück", synonyme: ["knob"] },
  { name: "Karotte", kcal: 41, kh: 8, eiweiss: 0.9, fett: 0.2, ballaststoffe: 2.9, einheit: "g", synonyme: ["möhre","rübe","karotten"] },
  { name: "Kartoffel (gekocht)", kcal: 77, kh: 17, eiweiss: 2, fett: 0.1, ballaststoffe: 1.8, einheit: "g", synonyme: ["kartoffeln"] },
  { name: "Süßkartoffel", kcal: 86, kh: 20, eiweiss: 1.6, fett: 0.1, ballaststoffe: 3, einheit: "g", synonyme: ["batate","sweet potato"] },
  { name: "Mais (Dose)", kcal: 83, kh: 16, eiweiss: 2.7, fett: 1.2, ballaststoffe: 2.4, einheit: "g" },
  { name: "Erbsen (gegart)", kcal: 84, kh: 14, eiweiss: 5.4, fett: 0.4, ballaststoffe: 5.5, einheit: "g" },
  { name: "Feldsalat", kcal: 14, kh: 0.5, eiweiss: 2, fett: 0.4, ballaststoffe: 1.5, einheit: "g", synonyme: ["salat","rapunzel"] },
  { name: "Champignons", kcal: 22, kh: 0.6, eiweiss: 3.1, fett: 0.3, ballaststoffe: 1.8, einheit: "g", synonyme: ["pilze","mushrooms"] },

  // === GETREIDE & BROT ===
  { name: "Weißbrot / Toastbrot", kcal: 265, kh: 51, eiweiss: 8, fett: 3, ballaststoffe: 2.5, einheit: "g", synonyme: ["toast","weisbrot","weißbrot","toastbrot"] },
  { name: "Vollkornbrot", kcal: 225, kh: 40, eiweiss: 8, fett: 2, ballaststoffe: 7, einheit: "g", synonyme: ["brot","vollkorn"] },
  { name: "Brötchen (Semmel)", kcal: 270, kh: 53, eiweiss: 8.7, fett: 2.5, ballaststoffe: 2.4, einheit: "g", synonyme: ["semmel","brötchen","weck","kaiser"] },
  { name: "Croissant", kcal: 406, kh: 46, eiweiss: 7, fett: 22, ballaststoffe: 2, einheit: "g" },
  { name: "Spaghetti (gekocht)", kcal: 158, kh: 31, eiweiss: 5.8, fett: 0.9, ballaststoffe: 1.8, einheit: "g", synonyme: ["nudeln","pasta","spaghetti","penne","rigatoni"] },
  { name: "Reis (weiß, gekocht)", kcal: 130, kh: 28, eiweiss: 2.7, fett: 0.3, ballaststoffe: 0.5, einheit: "g", synonyme: ["reis"] },
  { name: "Haferflocken", kcal: 372, kh: 59, eiweiss: 13, fett: 7, ballaststoffe: 10, einheit: "g", synonyme: ["oats","hafer","müsli"] },
  { name: "Müsli (mit Früchten)", kcal: 370, kh: 68, eiweiss: 8.5, fett: 6.5, ballaststoffe: 7, einheit: "g" },

  // === SÜSSES & SNACKS ===
  { name: "Schokolade (Milch)", kcal: 535, kh: 60, eiweiss: 7, fett: 30, ballaststoffe: 2, einheit: "g", synonyme: ["schoki","schoko","milchschokolade","chocolate"] },
  { name: "Schokolade (Zartbitter 70%)", kcal: 580, kh: 33, eiweiss: 8, fett: 43, ballaststoffe: 12, einheit: "g", synonyme: ["zartbitter","dark chocolate","bitterschokolade"] },
  { name: "Gummibärchen", kcal: 340, kh: 77, eiweiss: 7, fett: 0.5, ballaststoffe: 0, einheit: "g", synonyme: ["gummibären","haribo"] },
  { name: "Chips (gesalzen)", kcal: 536, kh: 53, eiweiss: 7, fett: 33, ballaststoffe: 4, einheit: "g", synonyme: ["kartoffelchips","pringles"] },
  { name: "Popcorn (gesalzen)", kcal: 480, kh: 59, eiweiss: 9, fett: 28, ballaststoffe: 8, einheit: "g" },
  { name: "Keks / Butterkeks", kcal: 480, kh: 72, eiweiss: 7, fett: 18, ballaststoffe: 2, einheit: "g", synonyme: ["kekse","cookies","plätzchen"] },
  { name: "Muffin (Schokolade)", kcal: 390, kh: 55, eiweiss: 5, fett: 18, ballaststoffe: 2, einheit: "g" },
  { name: "Donut", kcal: 440, kh: 50, eiweiss: 5, fett: 24, ballaststoffe: 1.5, einheit: "g" },
  { name: "Torte / Kuchen (Ø)", kcal: 350, kh: 48, eiweiss: 5, fett: 15, ballaststoffe: 1, einheit: "g", synonyme: ["kuchen","torte","streuselkuchen","käsekuchen"] },
  { name: "Eis (Vanille)", kcal: 207, kh: 24, eiweiss: 3.5, fett: 11, ballaststoffe: 0, einheit: "g", synonyme: ["speiseeis","eiskugel"] },
  { name: "Nutella", kcal: 539, kh: 58, eiweiss: 6.3, fett: 31, ballaststoffe: 3.4, einheit: "g", synonyme: ["nuss-nougat","nougat"] },

  // === FAST FOOD & RESTAURANT ===
  { name: "Pizza Margherita (1 Stück)", kcal: 260, kh: 31, eiweiss: 10, fett: 10, ballaststoffe: 2, einheit: "Stück", synonyme: ["pizza"] },
  { name: "Burger (normal)", kcal: 540, kh: 45, eiweiss: 28, fett: 25, ballaststoffe: 2, einheit: "g", synonyme: ["hamburger","cheeseburger"] },
  { name: "Pommes Frites (Portion)", kcal: 290, kh: 37, eiweiss: 3.5, fett: 15, ballaststoffe: 3, einheit: "g", synonyme: ["pommes","fritten","frites"] },
  { name: "Döner Kebab (ohne Brot)", kcal: 210, kh: 5, eiweiss: 18, fett: 13, ballaststoffe: 1.5, einheit: "g", synonyme: ["döner","kebab"] },
  { name: "Döner Kebab (mit Brot)", kcal: 290, kh: 28, eiweiss: 17, fett: 12, ballaststoffe: 2, einheit: "g" },
  { name: "Currywurst (mit Soße)", kcal: 310, kh: 16, eiweiss: 14, fett: 20, ballaststoffe: 1, einheit: "g", synonyme: ["currywurst"] },
  { name: "Hot Dog", kcal: 290, kh: 26, eiweiss: 11, fett: 15, ballaststoffe: 1.5, einheit: "g" },
  { name: "Sushi (Maki, 6 Stück)", kcal: 200, kh: 35, eiweiss: 7, fett: 2, ballaststoffe: 1.5, einheit: "Portion", synonyme: ["maki","nigiri","sushi"] },

  // === OBST ===
  { name: "Apfel", kcal: 52, kh: 12, eiweiss: 0.3, fett: 0.2, ballaststoffe: 2.4, einheit: "g" },
  { name: "Banane", kcal: 89, kh: 20, eiweiss: 1.1, fett: 0.3, ballaststoffe: 2.6, einheit: "g" },
  { name: "Orange", kcal: 47, kh: 10, eiweiss: 0.9, fett: 0.1, ballaststoffe: 2.4, einheit: "g", synonyme: ["mandarine","clementine"] },
  { name: "Weintrauben", kcal: 69, kh: 16, eiweiss: 0.7, fett: 0.2, ballaststoffe: 0.9, einheit: "g", synonyme: ["trauben","grapes"] },
  { name: "Mango", kcal: 60, kh: 14, eiweiss: 0.8, fett: 0.4, ballaststoffe: 1.8, einheit: "g" },
  { name: "Ananas", kcal: 50, kh: 12, eiweiss: 0.5, fett: 0.1, ballaststoffe: 1.4, einheit: "g" },

  // === GETRÄNKE ===
  { name: "Milch (3,5%)", kcal: 64, kh: 4.7, eiweiss: 3.3, fett: 3.5, ballaststoffe: 0, einheit: "ml", synonyme: ["vollmilch","milch"] },
  { name: "Orangensaft", kcal: 45, kh: 10, eiweiss: 0.7, fett: 0.2, ballaststoffe: 0.4, einheit: "ml", synonyme: ["oj","saft","o-saft"] },
  { name: "Coca-Cola (normal)", kcal: 42, kh: 10.6, eiweiss: 0, fett: 0, ballaststoffe: 0, einheit: "ml", synonyme: ["cola","coke","pepsi"] },
  { name: "Bier (normal, 5%)", kcal: 43, kh: 3.5, eiweiss: 0.5, fett: 0, ballaststoffe: 0, einheit: "ml", synonyme: ["pils","helles","weizen","bier"] },
  { name: "Wein (trocken)", kcal: 83, kh: 2, eiweiss: 0.1, fett: 0, ballaststoffe: 0, einheit: "ml", synonyme: ["rotwein","weißwein","rosé","wein"] },
  { name: "Latte Macchiato (Vollmilch)", kcal: 77, kh: 6, eiweiss: 4, fett: 3.5, ballaststoffe: 0, einheit: "ml", synonyme: ["latte","cappuccino","cafe","kaffee mit milch"] },

  // === FERTIGGERICHTE & KONSERVEN ===
  { name: "Tomatensoße (Dose)", kcal: 35, kh: 6.5, eiweiss: 1.5, fett: 0.4, ballaststoffe: 1.5, einheit: "g", synonyme: ["tomatensauce","passata","tomatenmark"] },
  { name: "Joghurt (3,5%)", kcal: 66, kh: 4.7, eiweiss: 3.5, fett: 3.5, ballaststoffe: 0, einheit: "g", synonyme: ["naturjoghurt","fruchtjoghurt"] },
  { name: "Leberwurst", kcal: 318, kh: 1, eiweiss: 13, fett: 28, ballaststoffe: 0, einheit: "g" },
  { name: "Frühstücksflocken (Cornflakes)", kcal: 372, kh: 84, eiweiss: 7.5, fett: 1, ballaststoffe: 3, einheit: "g", synonyme: ["cornflakes","cerealien","flocken"] },

  // === KETO-EXTRAS ===
  { name: "Kokosöl", kcal: 892, kh: 0, eiweiss: 0, fett: 100, ballaststoffe: 0, einheit: "ml", synonyme: ["kokosfett"] },
  { name: "Kokosnussmilch", kcal: 160, kh: 2.5, eiweiss: 1.5, fett: 16, ballaststoffe: 0, einheit: "ml", synonyme: ["kokosmilch"] },
  { name: "Kokosmehl", kcal: 400, kh: 20, eiweiss: 19, fett: 15, ballaststoffe: 38, einheit: "g" },
  { name: "Kaffee (schwarz)", kcal: 2, kh: 0, eiweiss: 0.3, fett: 0, ballaststoffe: 0, einheit: "ml" },
  { name: "Proteinpulver (Whey)", kcal: 370, kh: 6, eiweiss: 75, fett: 5, ballaststoffe: 1, einheit: "g", synonyme: ["whey","protein"] },
];

function suchen(q: string): DBItem[] {
  if (q.length < 2) return [];
  const qL = q.toLowerCase().trim();
  const treffer: { item: DBItem; score: number }[] = [];
  for (const item of DB) {
    const nameL = item.name.toLowerCase();
    const synL  = (item.synonyme ?? []).map(s => s.toLowerCase());
    let score = 0;
    if (nameL.startsWith(qL))                  score = 100;
    else if (nameL.includes(qL))               score = 80;
    else if (synL.some(s => s.startsWith(qL))) score = 70;
    else if (synL.some(s => s.includes(qL)))   score = 60;
    else {
      const allMatch = qL.split(/\s+/).every(w => nameL.includes(w) || synL.some(s => s.includes(w)));
      if (allMatch) score = 40;
    }
    if (score > 0) treffer.push({ item, score });
  }
  return treffer.sort((a, b) => b.score - a.score).slice(0, 6).map(t => t.item);
}

function aktuelleStunde(): string {
  const h = new Date().getHours();
  if (h < 11) return "fruehstueck";
  if (h < 14) return "mittagessen";
  if (h < 18) return "abendessen";
  return "snack";
}

export default function EssenSchnell() {
  const [naehrwerte, setNaehrwerte] = useState<Eintrag[]>([]);
  const [showForm, setShowForm]     = useState(false);
  const [mahlzeit, setMahlzeit]     = useState(aktuelleStunde());
  const [suchText, setSuchText]     = useState("");
  const [dbTreffer, setDbTreffer]   = useState<DBItem[]>([]);
  const [apiTreffer, setApiTreffer] = useState<{ name: string; kcal: number; kh: number; eiweiss: number; fett: number; ballaststoffe: number }[]>([]);
  const [apiLadt, setApiLadt]       = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [gewaehlt, setGewaehlt]     = useState<DBItem | null>(null);
  const [menge, setMenge]           = useState("100");
  const [einheit, setEinheit]       = useState("g");
  const [manuell, setManuell]       = useState(false);
  const [nName, setNName]           = useState("");
  const [nKcal, setNKcal]           = useState("");
  const [nKh, setNKh]               = useState("");
  const [nEiweiss, setNEiweiss]     = useState("");
  const [nFett, setNFett]           = useState("");

  const heute = new Date().toLocaleDateString("de-DE");

  useEffect(() => {
    const n = localStorage.getItem("ketome_naehrwerte");
    if (n) setNaehrwerte(JSON.parse(n));
  }, []);

  const heuteEintraege = naehrwerte.filter(e => e.datum === heute);

  function formLeeren() {
    setSuchText(""); setDbTreffer([]); setApiTreffer([]); setGewaehlt(null);
    setMenge("100"); setEinheit("g"); setManuell(false);
    setNName(""); setNKcal(""); setNKh(""); setNEiweiss(""); setNFett("");
  }

  function waehlenMitBase(name: string, einheitStr: string, b: DBItem) {
    setGewaehlt(b);
    setNName(name);
    setEinheit(einheitStr);
    setSuchText(name);
    setDbTreffer([]);
    setApiTreffer([]);
    berechne(b, "100");
    setMenge("100");
  }

  function dbWaehlen(item: DBItem) {
    waehlenMitBase(item.name, item.einheit, item);
  }

  function apiWaehlen(item: { name: string; kcal: number; kh: number; eiweiss: number; fett: number; ballaststoffe: number }) {
    const als: DBItem = { ...item, einheit: "g", synonyme: [] };
    waehlenMitBase(item.name, "g", als);
  }

  function berechne(item: DBItem, mengeStr: string) {
    const m = parseFloat(mengeStr) || 0;
    const f = item.einheit === "Stück" ? m : m / 100;
    setNKcal(String(Math.round(item.kcal * f)));
    setNKh(String(Math.round(item.kh * f * 10) / 10));
    setNEiweiss(String(Math.round(item.eiweiss * f * 10) / 10));
    setNFett(String(Math.round(item.fett * f * 10) / 10));
  }

  function mengeAendern(m: string) {
    setMenge(m);
    if (gewaehlt) berechne(gewaehlt, m);
  }

  function sucheTippen(q: string) {
    setSuchText(q);
    setDbTreffer(suchen(q));
    setGewaehlt(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.length < 2) { setApiTreffer([]); setApiLadt(false); return; }
    setApiLadt(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/lebensmittel?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        const lokaleNamen = new Set(suchen(q).map(i => i.name.toLowerCase()));
        setApiTreffer((data.produkte ?? []).filter((p: { name: string }) => !lokaleNamen.has(p.name.toLowerCase())));
      } catch { /* ignore */ }
      setApiLadt(false);
    }, 500);
  }

  function hinzufuegen() {
    if (!nName && !suchText) return;
    const neu: Eintrag = {
      id: Date.now().toString(), datum: heute, mahlzeit,
      name: nName || suchText,
      kcal: parseInt(nKcal) || 0,
      kh: parseFloat(nKh) || 0,
      eiweiss: parseFloat(nEiweiss) || 0,
      fett: parseFloat(nFett) || 0,
      ballaststoffe: gewaehlt ? gewaehlt.ballaststoffe * (parseFloat(menge) / 100) : 0,
    };
    const alle = [...naehrwerte, neu];
    setNaehrwerte(alle);
    localStorage.setItem("ketome_naehrwerte", JSON.stringify(alle));
    window.dispatchEvent(new Event("ketome-daten-gespeichert"));
    formLeeren();
    setShowForm(false);
  }

  function schnell(e: Eintrag) {
    const neu = { ...e, id: Date.now().toString(), datum: heute, mahlzeit };
    const alle = [...naehrwerte, neu];
    setNaehrwerte(alle);
    localStorage.setItem("ketome_naehrwerte", JSON.stringify(alle));
    window.dispatchEvent(new Event("ketome-daten-gespeichert"));
  }

  function suendeEintragen(s: Suende) {
    const neu: Eintrag = { id: Date.now().toString(), datum: heute, mahlzeit, name: s.name, kcal: s.kcal, kh: s.kh, eiweiss: s.eiweiss, fett: s.fett, ballaststoffe: 0 };
    const alle = [...naehrwerte, neu];
    setNaehrwerte(alle);
    localStorage.setItem("ketome_naehrwerte", JSON.stringify(alle));
    window.dispatchEvent(new Event("ketome-daten-gespeichert"));
  }

  const zuletzt = [...naehrwerte].reverse()
    .filter((e, i, arr) => arr.findIndex(x => x.name === e.name) === i)
    .slice(0, 4);

  const khFarbe = (kh: number) => kh > 5 ? "#f59e0b" : "#22c55e";

  return (
    <div className="rounded-2xl mb-4 overflow-hidden" style={{ backgroundColor: "#101410", border: "1px solid #1a2a1a" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="text-sm font-bold" style={{ color: "#4a8a4a" }}>🍽️ Heute gegessen</div>
        <Link href="/essen" className="text-sm px-3 py-1.5 rounded-lg font-medium" style={{ backgroundColor: "#1a2a1a", color: "#4ade80" }}>
          Alle →
        </Link>
      </div>

      {/* Heutige Einträge */}
      {heuteEintraege.length > 0 && (
        <div className="px-4 pb-3 space-y-2">
          {heuteEintraege.slice(-3).map(e => (
            <div key={e.id} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "#1a2a1a" }}>
              <div className="flex items-center gap-2">
                <span className="text-base">
                  {MAHLZEITEN.find(m => m.key === e.mahlzeit)?.icon ?? "🍽️"}
                </span>
                <span className="text-base">{e.name}</span>
              </div>
              <div className="flex gap-3 text-sm font-medium">
                {e.kcal > 0 && <span style={{ color: "#f59e0b" }}>{e.kcal} kcal</span>}
                {e.kh > 0 && <span style={{ color: khFarbe(Math.max(0, e.kh - (e.ballaststoffe || 0))) }}>
                  {Math.round(Math.max(0, e.kh - (e.ballaststoffe || 0)) * 10) / 10}g KH
                </span>}
              </div>
            </div>
          ))}
          {heuteEintraege.length > 3 && (
            <Link href="/essen" className="block text-sm py-1 text-center font-medium" style={{ color: "#4ade80" }}>
              + {heuteEintraege.length - 3} weitere → alle ansehen
            </Link>
          )}
        </div>
      )}

      {!showForm && heuteEintraege.length === 0 && (
        <p className="px-4 pb-3 text-sm" style={{ color: "#3a5a3a" }}>Noch nichts heute eingetragen.</p>
      )}

      {/* Schnellauswahl: Zuletzt */}
      {zuletzt.length > 0 && !showForm && (
        <div className="px-4 pb-3">
          <div className="text-xs mb-2 font-semibold tracking-wide" style={{ color: "#3a6a3a" }}>ZULETZT</div>
          <div className="flex flex-wrap gap-2">
            {zuletzt.map((e, i) => (
              <button key={i} onClick={() => schnell(e)}
                className="px-3 py-1.5 rounded-full text-sm"
                style={{ backgroundColor: "#151a15", border: "1px solid #1a2a1a", color: "#ccc" }}>
                + {e.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Schnellauswahl: Sünden */}
      {!showForm && (
        <div className="px-4 pb-4">
          <div className="text-xs mb-2 font-semibold tracking-wide" style={{ color: "#9a3a3a" }}>😈 SÜNDEN</div>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {SUENDEN.map((s, i) => (
              <button key={i} onClick={() => suendeEintragen(s)}
                className="px-3 py-1.5 rounded-full text-sm whitespace-nowrap flex-shrink-0"
                style={{ backgroundColor: "#1a0d0d", border: "1px solid #3a1a1a", color: "#fca5a5" }}>
                {s.emoji} {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Formular */}
      {showForm ? (
        <div className="px-4 pb-5 pt-2">
          {/* Mahlzeit-Auswahl */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {MAHLZEITEN.map(m => (
              <button key={m.key} onClick={() => setMahlzeit(m.key)}
                className="py-2.5 rounded-xl text-sm font-semibold text-center"
                style={{
                  backgroundColor: mahlzeit === m.key ? "#22c55e" : "#151a15",
                  color: mahlzeit === m.key ? "#000" : "#3a7a3a",
                  border: mahlzeit === m.key ? "none" : "1px solid #1a2a1a",
                }}>
                <div className="text-lg">{m.icon}</div>
                <div className="text-xs mt-0.5">{m.label.split("s")[0]}</div>
              </button>
            ))}
          </div>

          {/* DB-Suche */}
          <div className="relative mb-3">
            <input value={suchText} onChange={e => sucheTippen(e.target.value)}
              placeholder="🔍 Lebensmittel suchen..."
              className="w-full px-4 py-3 rounded-xl outline-none text-white text-base"
              style={{ backgroundColor: "#151a15" }} />
            {suchText.length >= 2 && (dbTreffer.length > 0 || apiTreffer.length > 0 || apiLadt) && (
              <div className="absolute z-10 left-0 right-0 top-full mt-1 rounded-xl overflow-hidden shadow-xl max-h-72 overflow-y-auto"
                style={{ backgroundColor: "#1a1a1a", border: "1px solid #22c55e44" }}>
                {dbTreffer.map((item, i) => (
                  <button key={`db-${i}`} onClick={() => dbWaehlen(item)}
                    className="w-full px-4 py-3 text-left text-base border-b flex items-center justify-between"
                    style={{ borderColor: "#222" }}>
                    <span>{item.name}</span>
                    <span className="text-sm font-medium" style={{ color: "#22c55e" }}>{item.kcal} kcal · {item.kh}g KH</span>
                  </button>
                ))}
                {apiTreffer.map((item, i) => (
                  <button key={`api-${i}`} onClick={() => apiWaehlen(item)}
                    className="w-full px-4 py-3 text-left text-base border-b flex items-center justify-between"
                    style={{ borderColor: "#222" }}>
                    <span>{item.name}</span>
                    <span className="text-sm font-medium" style={{ color: "#a78bfa" }}>{item.kcal} kcal · {item.kh}g KH</span>
                  </button>
                ))}
                {apiLadt && (
                  <div className="px-4 py-3 text-sm flex items-center gap-2" style={{ color: "#555" }}>
                    <span className="animate-spin inline-block">⏳</span> Weitere suchen…
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Menge + Schnell-Buttons */}
          {gewaehlt && (
            <>
              <div className="flex gap-2 mb-3">
                <div className="flex-1">
                  <div className="text-sm mb-1.5 font-medium" style={{ color: "#4a8a4a" }}>Menge</div>
                  <input value={menge} onChange={e => mengeAendern(e.target.value)} type="number"
                    className="w-full px-3 py-3 rounded-xl outline-none text-white text-lg text-center font-bold"
                    style={{ backgroundColor: "#151a15" }} />
                </div>
                <div className="w-20 flex flex-col justify-end">
                  <div className="py-3 rounded-xl text-base text-center font-semibold"
                    style={{ backgroundColor: "#151a15", color: "#aaa" }}>{einheit}</div>
                </div>
              </div>
              {(einheit === "g" || einheit === "ml") && (
                <div className="flex gap-2 mb-3 flex-wrap">
                  {[10, 25, 50, 100, 150, 200].map(g => (
                    <button key={g} onClick={() => mengeAendern(String(g))}
                      className="px-3 py-2 rounded-lg text-sm font-semibold"
                      style={{
                        backgroundColor: menge === String(g) ? "#22c55e" : "#1a2a1a",
                        color: menge === String(g) ? "#000" : "#4ade80",
                        border: "1px solid #1a3a1a",
                      }}>
                      {g}{einheit}
                    </button>
                  ))}
                </div>
              )}
              {/* Vorschau Makros */}
              <div className="grid grid-cols-4 gap-1 text-center mb-4 py-3 rounded-xl"
                style={{ backgroundColor: "#0d150d" }}>
                <div><div className="text-base font-bold" style={{ color: "#f59e0b" }}>{nKcal}</div><div className="text-xs" style={{ color: "#6b5a2a" }}>kcal</div></div>
                <div><div className="text-base font-bold" style={{ color: "#22c55e" }}>{nKh}g</div><div className="text-xs" style={{ color: "#2a5a2a" }}>KH</div></div>
                <div><div className="text-base font-bold" style={{ color: "#22c55e" }}>{nEiweiss}g</div><div className="text-xs" style={{ color: "#2a5a2a" }}>Eiweiß</div></div>
                <div><div className="text-base font-bold" style={{ color: "#a78bfa" }}>{nFett}g</div><div className="text-xs" style={{ color: "#3a2a5a" }}>Fett</div></div>
              </div>
            </>
          )}

          {/* Manuell (wenn nicht aus DB) */}
          {!gewaehlt && suchText.length > 0 && (
            <div className="mb-4">
              <input value={nName} onChange={e => setNName(e.target.value)}
                placeholder="Name des Lebensmittels"
                className="w-full px-4 py-3 rounded-xl outline-none text-white text-base mb-3"
                style={{ backgroundColor: "#151a15" }} />
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "kcal", val: nKcal, set: setNKcal },
                  { label: "KH g", val: nKh, set: setNKh },
                  { label: "Eiw.", val: nEiweiss, set: setNEiweiss },
                  { label: "Fett", val: nFett, set: setNFett },
                ].map(({ label, val, set }) => (
                  <div key={label}>
                    <div className="text-xs mb-1.5 text-center font-medium" style={{ color: "#4a8a4a" }}>{label}</div>
                    <input value={val} onChange={e => { set(e.target.value); setManuell(true); }} type="number"
                      className="w-full px-2 py-2.5 rounded-xl outline-none text-white text-base text-center font-bold"
                      style={{ backgroundColor: "#151a15" }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={() => { setShowForm(false); formLeeren(); }}
              className="flex-1 py-3.5 rounded-xl text-base font-medium"
              style={{ backgroundColor: "#151a15", color: "#666" }}>
              Abbrechen
            </button>
            <button onClick={hinzufuegen} disabled={!gewaehlt && !nName && !suchText}
              className="flex-1 py-3.5 rounded-xl font-black text-black text-base"
              style={{ backgroundColor: (gewaehlt || nName || suchText) ? "#22c55e" : "#1a2a1a",
                       color: (gewaehlt || nName || suchText) ? "#000" : "#3a5a3a" }}>
              ✓ Hinzufügen
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowForm(true)}
          className="w-full py-4 text-base font-black text-black"
          style={{ backgroundColor: "#22c55e" }}>
          + Eintragen
        </button>
      )}
    </div>
  );
}
