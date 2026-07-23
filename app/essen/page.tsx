"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Eintrag = {
  id: string; datum: string; name: string; menge: number; einheit: string;
  kcal: number; kh: number; eiweiss: number; fett: number; ballaststoffe: number;
};

// Lebensmitteldatenbank — Werte pro 100g
type DBItem = { name: string; kcal: number; kh: number; eiweiss: number; fett: number; ballaststoffe: number; einheit: string; synonyme?: string[] };
const DB: DBItem[] = [
  // ── EIER & MILCHPRODUKTE ──────────────────────────────────────────────────
  { name: "Ei (1 Stück, ca. 60g)", kcal: 85, kh: 0.6, eiweiss: 7, fett: 6, ballaststoffe: 0, einheit: "Stück", synonyme: ["eier","hühnerei"] },
  { name: "Eiweiß (1 Stück)", kcal: 18, kh: 0.2, eiweiss: 4, fett: 0, ballaststoffe: 0, einheit: "Stück", synonyme: ["egg white","eiklarr"] },
  { name: "Eigelb (1 Stück)", kcal: 55, kh: 0.3, eiweiss: 2.5, fett: 5, ballaststoffe: 0, einheit: "Stück" },
  { name: "Sahne (30% Fett)", kcal: 290, kh: 3, eiweiss: 2, fett: 30, ballaststoffe: 0, einheit: "ml", synonyme: ["schlagsahne","süße sahne","kochsahne","sahen","creme","cream","schlag","schlagobers","obers","süsse sahne"] },
  { name: "Sahne (35% Fett / Schlagsahne)", kcal: 337, kh: 2.7, eiweiss: 2, fett: 35, ballaststoffe: 0, einheit: "ml", synonyme: ["sahne","schlag","schlagobers","obers","cream","whipping cream"] },
  { name: "Schmand 24%", kcal: 240, kh: 3, eiweiss: 2.5, fett: 24, ballaststoffe: 0, einheit: "g", synonyme: ["schmant","sauerrahm"] },
  { name: "Saure Sahne / Crème fraîche", kcal: 215, kh: 3, eiweiss: 2.5, fett: 20, ballaststoffe: 0, einheit: "g", synonyme: ["creme fraiche","crème","saure sahne","sauerrahm","smetana"] },
  { name: "Butter", kcal: 740, kh: 0.5, eiweiss: 0.7, fett: 82, ballaststoffe: 0, einheit: "g" },
  { name: "Ghee (geklärte Butter)", kcal: 876, kh: 0, eiweiss: 0, fett: 99, ballaststoffe: 0, einheit: "g", synonyme: ["butterschmalz","klarbutter"] },
  { name: "Frischkäse (Doppelrahm)", kcal: 260, kh: 2.5, eiweiss: 5, fett: 26, ballaststoffe: 0, einheit: "g", synonyme: ["philadelphia","doppelrahm","cream cheese"] },
  { name: "Frischkäse (Magerstufe)", kcal: 97, kh: 3.5, eiweiss: 11, fett: 4, ballaststoffe: 0, einheit: "g" },
  { name: "Quark (20% Fett i.Tr.)", kcal: 107, kh: 4, eiweiss: 12, fett: 5, ballaststoffe: 0, einheit: "g", synonyme: ["magerquark","speisequark"] },
  { name: "Quark (mager)", kcal: 67, kh: 4, eiweiss: 12, fett: 0.2, ballaststoffe: 0, einheit: "g" },
  { name: "Skyr", kcal: 63, kh: 4, eiweiss: 11, fett: 0.2, ballaststoffe: 0, einheit: "g" },
  { name: "Griechischer Joghurt 10%", kcal: 133, kh: 4, eiweiss: 7, fett: 10, ballaststoffe: 0, einheit: "g", synonyme: ["joghurt","yogurt","griechisch"] },
  { name: "Joghurt 3,5%", kcal: 61, kh: 5, eiweiss: 3.5, fett: 3.5, ballaststoffe: 0, einheit: "g" },
  { name: "Mascarpone", kcal: 430, kh: 3, eiweiss: 4, fett: 44, ballaststoffe: 0, einheit: "g" },
  { name: "Ricotta", kcal: 150, kh: 3, eiweiss: 11, fett: 11, ballaststoffe: 0, einheit: "g" },
  // ── KÄSE ─────────────────────────────────────────────────────────────────
  { name: "Gouda", kcal: 356, kh: 0.5, eiweiss: 25, fett: 28, ballaststoffe: 0, einheit: "g" },
  { name: "Edamer", kcal: 314, kh: 0.5, eiweiss: 25, fett: 23, ballaststoffe: 0, einheit: "g" },
  { name: "Emmentaler", kcal: 380, kh: 0, eiweiss: 29, fett: 29, ballaststoffe: 0, einheit: "g" },
  { name: "Cheddar", kcal: 403, kh: 0.1, eiweiss: 25, fett: 34, ballaststoffe: 0, einheit: "g" },
  { name: "Mozzarella (ganzer)", kcal: 280, kh: 2, eiweiss: 18, fett: 22, ballaststoffe: 0, einheit: "g" },
  { name: "Mozzarella light", kcal: 190, kh: 2, eiweiss: 22, fett: 10, ballaststoffe: 0, einheit: "g" },
  { name: "Parmesan", kcal: 431, kh: 0, eiweiss: 38, fett: 29, ballaststoffe: 0, einheit: "g", synonyme: ["parmigiano"] },
  { name: "Brie", kcal: 334, kh: 0.5, eiweiss: 20, fett: 28, ballaststoffe: 0, einheit: "g" },
  { name: "Camembert", kcal: 300, kh: 0.5, eiweiss: 19, fett: 25, ballaststoffe: 0, einheit: "g" },
  { name: "Feta", kcal: 264, kh: 1, eiweiss: 14, fett: 22, ballaststoffe: 0, einheit: "g", synonyme: ["schafskäse"] },
  { name: "Hüttenkäse (Cottage Cheese)", kcal: 103, kh: 3, eiweiss: 11, fett: 5, ballaststoffe: 0, einheit: "g", synonyme: ["cottage","hüttenkäse"] },
  { name: "Harzer Käse", kcal: 125, kh: 0, eiweiss: 30, fett: 1, ballaststoffe: 0, einheit: "g", synonyme: ["harzer","sauermilchkäse"] },
  // ── FLEISCH ───────────────────────────────────────────────────────────────
  { name: "Hähnchenbrust", kcal: 110, kh: 0, eiweiss: 23, fett: 1.5, ballaststoffe: 0, einheit: "g", synonyme: ["chicken breast","hühnerbrust","huhn","hühnchen"] },
  { name: "Hähnchenkeule (ohne Knochen)", kcal: 148, kh: 0, eiweiss: 18, fett: 8, ballaststoffe: 0, einheit: "g", synonyme: ["chicken","keule","oberschenkel"] },
  { name: "Rinderhack", kcal: 250, kh: 0, eiweiss: 18, fett: 20, ballaststoffe: 0, einheit: "g", synonyme: ["hackfleisch","rinderhackfleisch","faschiertes"] },
  { name: "Schweinehack", kcal: 290, kh: 0, eiweiss: 15, fett: 26, ballaststoffe: 0, einheit: "g", synonyme: ["hackfleisch","gemischtes hack"] },
  { name: "Rindfleisch (Steak)", kcal: 218, kh: 0, eiweiss: 22, fett: 14, ballaststoffe: 0, einheit: "g", synonyme: ["steak","rind","beef","sirloin","entrecote"] },
  { name: "Schweinebauch", kcal: 450, kh: 0, eiweiss: 10, fett: 45, ballaststoffe: 0, einheit: "g", synonyme: ["bauch","pork belly"] },
  { name: "Schweinefilet", kcal: 109, kh: 0, eiweiss: 22, fett: 2, ballaststoffe: 0, einheit: "g" },
  { name: "Speck / Bacon", kcal: 430, kh: 0, eiweiss: 12, fett: 42, ballaststoffe: 0, einheit: "g", synonyme: ["bauchspeck","frühstücksspeck","pancetta"] },
  { name: "Salami", kcal: 425, kh: 1, eiweiss: 18, fett: 38, ballaststoffe: 0, einheit: "g" },
  { name: "Schinken (gekocht)", kcal: 120, kh: 1, eiweiss: 18, fett: 5, ballaststoffe: 0, einheit: "g" },
  { name: "Schinken (roh/Prosciutto)", kcal: 250, kh: 0, eiweiss: 25, fett: 16, ballaststoffe: 0, einheit: "g", synonyme: ["prosciutto","rohschinken","serrano","parma"] },
  { name: "Chorizo", kcal: 455, kh: 2, eiweiss: 24, fett: 38, ballaststoffe: 0, einheit: "g" },
  { name: "Leberwurst", kcal: 320, kh: 2, eiweiss: 13, fett: 28, ballaststoffe: 0, einheit: "g" },
  { name: "Lammkeule", kcal: 206, kh: 0, eiweiss: 20, fett: 14, ballaststoffe: 0, einheit: "g", synonyme: ["lamm","lammfleisch"] },
  // ── FISCH & MEERESFRÜCHTE ─────────────────────────────────────────────────
  { name: "Lachs (frisch)", kcal: 208, kh: 0, eiweiss: 20, fett: 13, ballaststoffe: 0, einheit: "g", synonyme: ["salmon"] },
  { name: "Lachs (geräuchert)", kcal: 159, kh: 0, eiweiss: 18, fett: 9, ballaststoffe: 0, einheit: "g", synonyme: ["räucherlachs","smoked salmon"] },
  { name: "Thunfisch (Dose, in Wasser)", kcal: 116, kh: 0, eiweiss: 26, fett: 1, ballaststoffe: 0, einheit: "g", synonyme: ["tuna"] },
  { name: "Thunfisch (Dose, in Öl)", kcal: 200, kh: 0, eiweiss: 22, fett: 12, ballaststoffe: 0, einheit: "g" },
  { name: "Sardinen (Dose)", kcal: 208, kh: 0, eiweiss: 25, fett: 12, ballaststoffe: 0, einheit: "g" },
  { name: "Makrele", kcal: 262, kh: 0, eiweiss: 19, fett: 20, ballaststoffe: 0, einheit: "g" },
  { name: "Garnelen / Shrimps", kcal: 99, kh: 0, eiweiss: 21, fett: 1, ballaststoffe: 0, einheit: "g", synonyme: ["crevetten","prawns","shrimps"] },
  { name: "Dorsch / Kabeljau", kcal: 82, kh: 0, eiweiss: 18, fett: 0.7, ballaststoffe: 0, einheit: "g", synonyme: ["kabeljau","cod","pollack"] },
  { name: "Forelle", kcal: 119, kh: 0, eiweiss: 20, fett: 4, ballaststoffe: 0, einheit: "g" },
  // ── ÖLE & FETTE ───────────────────────────────────────────────────────────
  { name: "Olivenöl", kcal: 884, kh: 0, eiweiss: 0, fett: 100, ballaststoffe: 0, einheit: "ml", synonyme: ["olive oil"] },
  { name: "Kokosöl", kcal: 884, kh: 0, eiweiss: 0, fett: 100, ballaststoffe: 0, einheit: "ml", synonyme: ["coconut oil"] },
  { name: "MCT-Öl", kcal: 884, kh: 0, eiweiss: 0, fett: 100, ballaststoffe: 0, einheit: "ml", synonyme: ["mct","mittelkettige fettsäuren"] },
  { name: "Avocadoöl", kcal: 884, kh: 0, eiweiss: 0, fett: 100, ballaststoffe: 0, einheit: "ml" },
  { name: "Mayonnaise", kcal: 680, kh: 1, eiweiss: 1.5, fett: 75, ballaststoffe: 0, einheit: "g", synonyme: ["mayo","majonäse"] },
  // ── NÜSSE & SAMEN ─────────────────────────────────────────────────────────
  { name: "Mandeln", kcal: 576, kh: 7, eiweiss: 21, fett: 50, ballaststoffe: 12, einheit: "g" },
  { name: "Walnüsse", kcal: 654, kh: 7, eiweiss: 15, fett: 65, ballaststoffe: 7, einheit: "g" },
  { name: "Macadamia", kcal: 718, kh: 5, eiweiss: 8, fett: 76, ballaststoffe: 8, einheit: "g" },
  { name: "Paranüsse", kcal: 656, kh: 4, eiweiss: 14, fett: 66, ballaststoffe: 7, einheit: "g" },
  { name: "Haselnüsse", kcal: 628, kh: 7, eiweiss: 15, fett: 61, ballaststoffe: 9, einheit: "g" },
  { name: "Pekannüsse", kcal: 691, kh: 4, eiweiss: 9, fett: 72, ballaststoffe: 10, einheit: "g" },
  { name: "Erdnüsse", kcal: 567, kh: 8, eiweiss: 26, fett: 49, ballaststoffe: 9, einheit: "g", synonyme: ["peanuts","arachis"] },
  { name: "Erdnussbutter (ohne Zucker)", kcal: 588, kh: 9, eiweiss: 25, fett: 50, ballaststoffe: 6, einheit: "g", synonyme: ["peanut butter","erdnussmus"] },
  { name: "Mandelmus", kcal: 614, kh: 7, eiweiss: 21, fett: 56, ballaststoffe: 10, einheit: "g" },
  { name: "Sonnenblumenkerne", kcal: 584, kh: 11, eiweiss: 21, fett: 51, ballaststoffe: 9, einheit: "g", synonyme: ["kürbiskerne","samen"] },
  { name: "Kürbiskerne", kcal: 559, kh: 4, eiweiss: 30, fett: 49, ballaststoffe: 6, einheit: "g" },
  { name: "Chiasamen", kcal: 486, kh: 6, eiweiss: 17, fett: 31, ballaststoffe: 34, einheit: "g", synonyme: ["chia"] },
  { name: "Leinsamen", kcal: 534, kh: 2, eiweiss: 18, fett: 42, ballaststoffe: 27, einheit: "g", synonyme: ["flachs","leinöl"] },
  { name: "Sesam", kcal: 573, kh: 5, eiweiss: 18, fett: 50, ballaststoffe: 12, einheit: "g", synonyme: ["tahini","sesammus"] },
  // ── KETO-BACKZUTATEN ──────────────────────────────────────────────────────
  { name: "Mandelmehl (entölt)", kcal: 390, kh: 9, eiweiss: 40, fett: 14, ballaststoffe: 12, einheit: "g" },
  { name: "Mandelmehl (vollfett)", kcal: 590, kh: 9, eiweiss: 21, fett: 52, ballaststoffe: 10, einheit: "g" },
  { name: "Kokosmehl", kcal: 400, kh: 20, eiweiss: 19, fett: 15, ballaststoffe: 38, einheit: "g" },
  { name: "Flohsamenschalen", kcal: 160, kh: 69, eiweiss: 3, fett: 1, ballaststoffe: 67, einheit: "g", synonyme: ["psyllium","psylliumschalen","flohsamen"] },
  { name: "Bambusfasern", kcal: 60, kh: 55, eiweiss: 3, fett: 1, ballaststoffe: 55, einheit: "g" },
  { name: "Haferfasern", kcal: 215, kh: 53, eiweiss: 16, fett: 7, ballaststoffe: 45, einheit: "g", synonyme: ["oat fiber"] },
  { name: "Luzernemehl / Lupinenmehl", kcal: 340, kh: 7, eiweiss: 38, fett: 8, ballaststoffe: 17, einheit: "g", synonyme: ["lupin","lupinen"] },
  { name: "Erythrit", kcal: 0, kh: 0, eiweiss: 0, fett: 0, ballaststoffe: 0, einheit: "g", synonyme: ["erythritol","zuckerersatz","süßungsmittel"] },
  { name: "Xylit", kcal: 240, kh: 60, eiweiss: 0, fett: 0, ballaststoffe: 0, einheit: "g", synonyme: ["xylitol","birkenzucker","zuckerersatz"] },
  { name: "Stevia (Pulver)", kcal: 0, kh: 0, eiweiss: 0, fett: 0, ballaststoffe: 0, einheit: "g", synonyme: ["stevia","süßungsmittel"] },
  { name: "Backpulver", kcal: 53, kh: 12, eiweiss: 0, fett: 0, ballaststoffe: 0, einheit: "g" },
  { name: "Kakaopulver (ungesüßt)", kcal: 228, kh: 10, eiweiss: 20, fett: 12, ballaststoffe: 33, einheit: "g", synonyme: ["kakao","cacao"] },
  // ── GEMÜSE ────────────────────────────────────────────────────────────────
  { name: "Avocado", kcal: 160, kh: 2, eiweiss: 2, fett: 15, ballaststoffe: 7, einheit: "g" },
  { name: "Brokkoli", kcal: 34, kh: 4, eiweiss: 3, fett: 0.4, ballaststoffe: 2.6, einheit: "g" },
  { name: "Blumenkohl", kcal: 25, kh: 3, eiweiss: 2, fett: 0.3, ballaststoffe: 2, einheit: "g", synonyme: ["karfiol"] },
  { name: "Zucchini", kcal: 17, kh: 2, eiweiss: 1.3, fett: 0.2, ballaststoffe: 1, einheit: "g", synonyme: ["courgette"] },
  { name: "Spinat (frisch)", kcal: 23, kh: 1, eiweiss: 3, fett: 0.4, ballaststoffe: 2.2, einheit: "g" },
  { name: "Spinat (TK)", kcal: 21, kh: 0.6, eiweiss: 2.6, fett: 0.4, ballaststoffe: 1.9, einheit: "g" },
  { name: "Gurke", kcal: 12, kh: 1.5, eiweiss: 0.6, fett: 0.1, ballaststoffe: 0.5, einheit: "g" },
  { name: "Paprika (rot)", kcal: 31, kh: 6, eiweiss: 1, fett: 0.3, ballaststoffe: 2, einheit: "g" },
  { name: "Paprika (grün)", kcal: 20, kh: 3, eiweiss: 0.9, fett: 0.2, ballaststoffe: 1.5, einheit: "g" },
  { name: "Tomate", kcal: 18, kh: 3, eiweiss: 0.9, fett: 0.2, ballaststoffe: 1.2, einheit: "g" },
  { name: "Cherrytomaten", kcal: 18, kh: 3, eiweiss: 0.9, fett: 0.2, ballaststoffe: 1.2, einheit: "g", synonyme: ["cocktailtomaten"] },
  { name: "Sellerie (Stange)", kcal: 14, kh: 2, eiweiss: 0.7, fett: 0.2, ballaststoffe: 1.8, einheit: "g", synonyme: ["staudensellerie"] },
  { name: "Salat (gemischt)", kcal: 15, kh: 2, eiweiss: 1.3, fett: 0.2, ballaststoffe: 1.5, einheit: "g", synonyme: ["blattsalat","rukola","rucola","feldsalat","kopfsalat","eisberg"] },
  { name: "Rucola", kcal: 25, kh: 2, eiweiss: 2.6, fett: 0.7, ballaststoffe: 1.6, einheit: "g" },
  { name: "Feldsalat", kcal: 21, kh: 1.5, eiweiss: 2.1, fett: 0.4, ballaststoffe: 1.4, einheit: "g", synonyme: ["rapunzel","valerianella"] },
  { name: "Spargel (grün)", kcal: 20, kh: 2, eiweiss: 2.2, fett: 0.2, ballaststoffe: 1.5, einheit: "g" },
  { name: "Spargel (weiß)", kcal: 18, kh: 1.8, eiweiss: 1.9, fett: 0.1, ballaststoffe: 1.5, einheit: "g" },
  { name: "Pilze / Champignons", kcal: 22, kh: 1, eiweiss: 3.1, fett: 0.3, ballaststoffe: 1, einheit: "g", synonyme: ["champignon","steinpilz","pilze","mushroom"] },
  { name: "Lauch / Porree", kcal: 31, kh: 4.5, eiweiss: 1.8, fett: 0.3, ballaststoffe: 2.2, einheit: "g", synonyme: ["porree","leek"] },
  { name: "Zwiebel", kcal: 40, kh: 9, eiweiss: 1, fett: 0.1, ballaststoffe: 1.7, einheit: "g", synonyme: ["schalotte","rote zwiebel"] },
  { name: "Knoblauch", kcal: 149, kh: 33, eiweiss: 6, fett: 0.5, ballaststoffe: 2, einheit: "g" },
  { name: "Kohlrabi", kcal: 27, kh: 4, eiweiss: 1.8, fett: 0.1, ballaststoffe: 1.8, einheit: "g" },
  { name: "Weißkohl / Sauerkraut", kcal: 25, kh: 4, eiweiss: 1.3, fett: 0.2, ballaststoffe: 2.5, einheit: "g", synonyme: ["kraut","sauerkraut","kohl"] },
  { name: "Rosenkohl", kcal: 43, kh: 5, eiweiss: 4, fett: 0.5, ballaststoffe: 4, einheit: "g" },
  { name: "Aubergine", kcal: 25, kh: 3, eiweiss: 1, fett: 0.2, ballaststoffe: 2.5, einheit: "g", synonyme: ["eggplant"] },
  { name: "Radieschen", kcal: 16, kh: 2, eiweiss: 1.1, fett: 0.1, ballaststoffe: 1.5, einheit: "g" },
  { name: "Oliven (grün)", kcal: 145, kh: 1, eiweiss: 1, fett: 15, ballaststoffe: 3, einheit: "g" },
  { name: "Oliven (schwarz)", kcal: 115, kh: 2, eiweiss: 0.8, fett: 11, ballaststoffe: 3, einheit: "g" },
  // ── OBST (keto-tauglich) ──────────────────────────────────────────────────
  { name: "Erdbeeren", kcal: 32, kh: 6, eiweiss: 0.7, fett: 0.3, ballaststoffe: 2, einheit: "g" },
  { name: "Himbeeren", kcal: 52, kh: 5, eiweiss: 1.2, fett: 0.7, ballaststoffe: 6.5, einheit: "g" },
  { name: "Brombeeren", kcal: 43, kh: 5, eiweiss: 1.4, fett: 0.5, ballaststoffe: 5.3, einheit: "g" },
  { name: "Heidelbeeren / Blaubeeren", kcal: 57, kh: 12, eiweiss: 0.7, fett: 0.3, ballaststoffe: 2.4, einheit: "g", synonyme: ["blaubeeren","blueberries"] },
  { name: "Zitrone", kcal: 29, kh: 3, eiweiss: 1.1, fett: 0.3, ballaststoffe: 1.8, einheit: "g", synonyme: ["lemon","zitronensaft"] },
  // ── GETRÄNKE ──────────────────────────────────────────────────────────────
  { name: "Kaffee (schwarz)", kcal: 2, kh: 0, eiweiss: 0.3, fett: 0, ballaststoffe: 0, einheit: "ml" },
  { name: "Bulletproof Coffee", kcal: 230, kh: 0, eiweiss: 0.5, fett: 26, ballaststoffe: 0, einheit: "ml", synonyme: ["butter coffee","bp coffee"] },
  { name: "Tee (ungesüßt)", kcal: 1, kh: 0.1, eiweiss: 0, fett: 0, ballaststoffe: 0, einheit: "ml" },
  { name: "Mandelmilch (ungesüßt)", kcal: 17, kh: 0.6, eiweiss: 0.6, fett: 1.4, ballaststoffe: 0.4, einheit: "ml", synonyme: ["almond milk"] },
  { name: "Kokosmilch (Dose)", kcal: 197, kh: 3, eiweiss: 2, fett: 20, ballaststoffe: 0.2, einheit: "ml", synonyme: ["coconut milk","kokoscreme"] },
  // ── SAUCEN & WÜRZEN ───────────────────────────────────────────────────────
  { name: "Senf (mittelscharf)", kcal: 82, kh: 6, eiweiss: 5, fett: 4, ballaststoffe: 1, einheit: "g", synonyme: ["senf","mustard","dijon","senfsoße"] },
  { name: "Senf (scharf)", kcal: 75, kh: 4, eiweiss: 5, fett: 4, ballaststoffe: 1, einheit: "g", synonyme: ["senf","scharfer senf","mustard"] },
  { name: "Senf (süß / Honigsenf)", kcal: 135, kh: 18, eiweiss: 3, fett: 4, ballaststoffe: 1, einheit: "g", synonyme: ["senf","honigsenf","sweet mustard"] },
  { name: "Ketchup", kcal: 102, kh: 22, eiweiss: 1.5, fett: 0.2, ballaststoffe: 1, einheit: "g", synonyme: ["tomatenketchup","tomaten ketchup","catsup"] },
  { name: "Mayonnaise", kcal: 680, kh: 1, eiweiss: 1.5, fett: 75, ballaststoffe: 0, einheit: "g", synonyme: ["mayo","majonäse","aioli"] },
  { name: "Tomatenmark", kcal: 82, kh: 12, eiweiss: 4, fett: 0.4, ballaststoffe: 2.5, einheit: "g", synonyme: ["tomatenmus","passata"] },
  { name: "Sojasoße", kcal: 53, kh: 5, eiweiss: 8, fett: 0, ballaststoffe: 0, einheit: "ml", synonyme: ["sojasauce","tamari","soy sauce"] },
  { name: "Pesto (Basilikum)", kcal: 450, kh: 4, eiweiss: 5, fett: 46, ballaststoffe: 1, einheit: "g", synonyme: ["pesto rosso","pesto verde"] },
  { name: "Worcestershire-Soße", kcal: 78, kh: 18, eiweiss: 2, fett: 0, ballaststoffe: 0, einheit: "ml", synonyme: ["worcester","worcestershire sauce"] },
  { name: "Essig (Apfelessig)", kcal: 22, kh: 1, eiweiss: 0, fett: 0, ballaststoffe: 0, einheit: "ml", synonyme: ["apfelessig","essig","vinegar","balsamico"] },
  { name: "Olivenöl", kcal: 884, kh: 0, eiweiss: 0, fett: 100, ballaststoffe: 0, einheit: "ml", synonyme: ["olive oil","oliven öl"] },
  { name: "Kokosöl", kcal: 862, kh: 0, eiweiss: 0, fett: 100, ballaststoffe: 0, einheit: "g", synonyme: ["coconut oil","kokosfett"] },
  // ── PROTEINPRODUKTE ───────────────────────────────────────────────────────
  { name: "Proteinpulver (Whey)", kcal: 370, kh: 6, eiweiss: 75, fett: 5, ballaststoffe: 1, einheit: "g", synonyme: ["whey","molkenprotein","protein"] },
  { name: "Proteinpulver (Casein)", kcal: 350, kh: 5, eiweiss: 78, fett: 3, ballaststoffe: 1, einheit: "g", synonyme: ["casein","protein"] },
  { name: "Collagen-Pulver", kcal: 360, kh: 0, eiweiss: 90, fett: 0, ballaststoffe: 0, einheit: "g", synonyme: ["kollagen","collagen peptides"] },
];

// Synonyme für bessere Suche
const SYNONYME: Record<string, string[]> = {
  sahne: ["schlagsahne","süße sahne","kochsahne","obers","schlagobers","creme fraiche","schmand"],
  hack: ["hackfleisch","faschiertes","rinderhack","schweinehack"],
  joghurt: ["yogurt","griechischer joghurt","skyr"],
  käse: ["gouda","edamer","cheddar","mozzarella","parmesan","feta","brie","camembert"],
};

function dbSucheLogik(q: string): DBItem[] {
  if (!q || q.length < 2) return [];
  const qL = q.toLowerCase().trim();
  const treffer: { item: DBItem; score: number }[] = [];
  for (const item of DB) {
    const nameL = item.name.toLowerCase();
    const synL  = (item.synonyme ?? []).map(s => s.toLowerCase());
    let score = 0;
    if (nameL.startsWith(qL))               score = 100;
    else if (nameL.includes(qL))            score = 80;
    else if (synL.some(s => s.startsWith(qL))) score = 70;
    else if (synL.some(s => s.includes(qL)))   score = 60;
    // Teilwort-Treffer: jedes Suchwort muss irgendwo vorkommen
    else {
      const woerter = qL.split(/\s+/);
      const allMatch = woerter.every(w => nameL.includes(w) || synL.some(s => s.includes(w)));
      if (allMatch) score = 40;
    }
    if (score > 0) treffer.push({ item, score });
  }
  return treffer.sort((a, b) => b.score - a.score).slice(0, 8).map(t => t.item);
}

function runde(n: number) { return Math.round(n * 10) / 10; }

function ProgressBar({ wert, ziel, farbe }: { wert: number; ziel: number; farbe: string }) {
  const pct = ziel > 0 ? Math.min(100, Math.round((wert / ziel) * 100)) : 0;
  return (
    <div className="rounded-full h-1.5 overflow-hidden" style={{ backgroundColor: "#1a2a1a" }}>
      <div className="h-1.5 rounded-full transition-all"
        style={{ width: `${pct}%`, backgroundColor: wert >= ziel ? "#ef4444" : farbe }} />
    </div>
  );
}

export default function EssenPage() {
  const [eintraege, setEintraege] = useState<Eintrag[]>([]);
  const [ziele, setZiele] = useState({ kcal: 1500, kh: 20, eiweiss: 100, fett: 120 });
  const heute = new Date().toLocaleDateString("de-DE");
  const [datum, setDatum] = useState(heute);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Formular
  const [suche, setSuche] = useState("");
  const [dbTreffer, setDbTreffer] = useState<typeof DB>([]);
  const [apiTreffer, setApiTreffer] = useState<{ name: string; kcal: number; kh: number; eiweiss: number; fett: number; ballaststoffe: number }[]>([]);
  const [apiLadt, setApiLadt] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Gespeicherte 100g-Basiswerte für Mengen-Neuberechnung
  const base100g = useRef<{ kcal: number; kh: number; eiweiss: number; fett: number; bst: number; einheit: string } | null>(null);
  const [nName, setNName] = useState("");
  const [nMenge, setNMenge] = useState("100");
  const [nEinheit, setNEinheit] = useState("g");
  const [nKcal, setNKcal] = useState("");
  const [nKh, setNKh] = useState("");
  const [nEiweiss, setNEiweiss] = useState("");
  const [nFett, setNFett] = useState("");
  const [nBst, setNBst] = useState("");
  const [manuell, setManuell] = useState(false);
  const [schnellTab, setSchnellTab] = useState<"zuletzt" | "meist">("zuletzt");

  useEffect(() => {
    const n = localStorage.getItem("ketome_naehrwerte");
    const z = localStorage.getItem("ketome_ziele");
    if (n) setEintraege(JSON.parse(n));
    if (z) { const zObj = JSON.parse(z); setZiele({ kcal: zObj.kcal || 1500, kh: zObj.kh || 20, eiweiss: zObj.eiweiss || 100, fett: zObj.fett || 120 }); }
  }, []);

  function speichern(liste: Eintrag[]) {
    setEintraege(liste);
    localStorage.setItem("ketome_naehrwerte", JSON.stringify(liste));
    window.dispatchEvent(new Event("ketome-daten-gespeichert"));
  }

  function datumVerschieben(r: number) {
    const [d, m, y] = datum.split(".").map(Number);
    const nd = new Date(y, m - 1, d);
    nd.setDate(nd.getDate() + r);
    const neu = nd.toLocaleDateString("de-DE");
    if (neu <= heute) setDatum(neu);
  }

  function formLeeren() {
    setSuche(""); setDbTreffer([]); setApiTreffer([]); setNName(""); setNMenge("100"); setNEinheit("g");
    setNKcal(""); setNKh(""); setNEiweiss(""); setNFett(""); setNBst(""); setManuell(false); setEditId(null);
    base100g.current = null;
  }

  function dbSuchen(q: string) {
    setSuche(q);
    if (q.length < 2) { setDbTreffer([]); setApiTreffer([]); setApiLadt(false); return; }
    setDbTreffer(dbSucheLogik(q));
    // API-Suche mit Debounce
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setApiLadt(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const lokaleNamen = new Set(dbSucheLogik(q).map(i => i.name.toLowerCase()));
        const alleProdukte: typeof apiTreffer = [];

        // Open Food Facts direkt im Browser — kein Server-Timeout
        try {
          const fields = "product_name,product_name_de,nutriments";
          const offRes = await fetch(
            `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&json=1&page_size=30&fields=${fields}&search_simple=1&action=process&lc=de&cc=de`,
            { signal: AbortSignal.timeout(8000) }
          );
          const offData = await offRes.json() as { products?: Array<{ product_name?: string; product_name_de?: string; nutriments?: Record<string, number> }> };
          for (const p of offData.products ?? []) {
            const name = (p.product_name_de || p.product_name || "").trim();
            const n = p.nutriments ?? {};
            const kcal = Math.round(n["energy-kcal_100g"] ?? n["energy-kcal"] ?? (n["energy_100g"] ? n["energy_100g"] / 4.184 : 0));
            const kh = Math.round((n["carbohydrates_100g"] ?? 0) * 10) / 10;
            if (!name || (kcal === 0 && kh === 0)) continue;
            alleProdukte.push({ name, kcal, kh, eiweiss: Math.round((n["proteins_100g"] ?? 0) * 10) / 10, fett: Math.round((n["fat_100g"] ?? 0) * 10) / 10, ballaststoffe: Math.round((n["fiber_100g"] ?? 0) * 10) / 10 });
          }
        } catch { /* OFF nicht erreichbar */ }

        // FatSecret via eigene API (Fallback für was OFF nicht kennt)
        try {
          const fsRes = await fetch(`/api/lebensmittel?q=${encodeURIComponent(q)}`);
          const fsData = await fsRes.json();
          const offNamen = new Set(alleProdukte.map(p => p.name.toLowerCase()));
          for (const p of fsData.produkte ?? []) {
            if (!offNamen.has(p.name.toLowerCase())) alleProdukte.push(p);
          }
        } catch { /* API nicht erreichbar */ }

        const gefiltert = alleProdukte.filter(p => !lokaleNamen.has(p.name.toLowerCase()));
        setApiTreffer(gefiltert.slice(0, 40));
      } catch { /* kein Problem */ }
      setApiLadt(false);
    }, 500);
  }

  function auswaehlenMitBase(name: string, einheit: string, b: { kcal: number; kh: number; eiweiss: number; fett: number; bst: number }) {
    base100g.current = { ...b, einheit };
    setNName(name);
    setNEinheit(einheit);
    setSuche(name);
    setDbTreffer([]);
    setApiTreffer([]);
    const m = parseFloat(nMenge) || 100;
    const faktor = einheit === "Stück" ? 1 : m / 100;
    setNKcal(String(Math.round(b.kcal * faktor)));
    setNKh(String(runde(b.kh * faktor)));
    setNEiweiss(String(runde(b.eiweiss * faktor)));
    setNFett(String(runde(b.fett * faktor)));
    setNBst(String(runde(b.bst * faktor)));
    setManuell(false);
  }

  function dbAuswaehlen(item: typeof DB[0]) {
    auswaehlenMitBase(item.name, item.einheit, { kcal: item.kcal, kh: item.kh, eiweiss: item.eiweiss, fett: item.fett, bst: item.ballaststoffe });
  }

  function apiAuswaehlen(item: { name: string; kcal: number; kh: number; eiweiss: number; fett: number; ballaststoffe: number }) {
    auswaehlenMitBase(item.name, "g", { kcal: item.kcal, kh: item.kh, eiweiss: item.eiweiss, fett: item.fett, bst: item.ballaststoffe });
  }

  // Wenn Menge geändert wird, Basiswerte neu berechnen
  function mengeAendern(val: string) {
    setNMenge(val);
    const b = base100g.current;
    if (!manuell && b) {
      const m = parseFloat(val) || 100;
      const faktor = b.einheit === "Stück" ? 1 : m / 100;
      setNKcal(String(Math.round(b.kcal * faktor)));
      setNKh(String(runde(b.kh * faktor)));
      setNEiweiss(String(runde(b.eiweiss * faktor)));
      setNFett(String(runde(b.fett * faktor)));
      setNBst(String(runde(b.bst * faktor)));
    }
  }

  function hinzufuegen() {
    if (!nName && !nKcal) return;
    const neu: Eintrag = {
      id: editId || Date.now().toString(),
      datum,
      name: nName || "Mahlzeit",
      menge: parseFloat(nMenge) || 0,
      einheit: nEinheit,
      kcal: parseInt(nKcal) || 0,
      kh: parseFloat(nKh) || 0,
      eiweiss: parseFloat(nEiweiss) || 0,
      fett: parseFloat(nFett) || 0,
      ballaststoffe: parseFloat(nBst) || 0,
    };
    const ohneAlt = editId ? eintraege.filter(e => e.id !== editId) : eintraege;
    speichern([...ohneAlt, neu]);
    formLeeren();
    setShowForm(false);
  }

  function bearbeiten(e: Eintrag) {
    setEditId(e.id);
    setNName(e.name); setNMenge(String(e.menge || 100)); setNEinheit(e.einheit || "g");
    setNKcal(String(e.kcal)); setNKh(String(e.kh)); setNEiweiss(String(e.eiweiss));
    setNFett(String(e.fett)); setNBst(String(e.ballaststoffe || 0));
    setSuche(e.name); setManuell(true);
    setShowForm(true);
  }

  function loeschen(id: string) {
    speichern(eintraege.filter(e => e.id !== id));
  }

  function schnellHinzufuegen(e: Eintrag) {
    const neu = { ...e, id: Date.now().toString(), datum };
    speichern([...eintraege, neu]);
  }

  const tagEintraege = eintraege.filter(e => e.datum === datum);
  const tagKcal = tagEintraege.reduce((s, e) => s + e.kcal, 0);
  const tagKh = runde(tagEintraege.reduce((s, e) => s + e.kh, 0));
  const tagEiweiss = runde(tagEintraege.reduce((s, e) => s + e.eiweiss, 0));
  const tagFett = runde(tagEintraege.reduce((s, e) => s + e.fett, 0));
  const istHeute = datum === heute;

  const zuletzt = [...eintraege].reverse()
    .filter((e, i, arr) => arr.findIndex(x => x.name === e.name) === i).slice(0, 6);
  const meist = Object.values(
    eintraege.reduce((acc, e) => {
      if (!acc[e.name]) acc[e.name] = { ...e, count: 0 };
      acc[e.name].count++;
      return acc;
    }, {} as Record<string, Eintrag & { count: number }>)
  ).sort((a, b) => b.count - a.count).slice(0, 6);
  const schnellListe = schnellTab === "zuletzt" ? zuletzt : meist;

  return (
    <main className="px-4 py-6 pb-28" style={{ backgroundColor: "#080b08" }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-black">🍽️ Essen</h1>
        <Link href="/tracking" className="text-xs px-3 py-1.5 rounded-full"
          style={{ backgroundColor: "#101410", color: "#3a7a3a", border: "1px solid #1a2a1a" }}>
          📊 Gewicht & Maße
        </Link>
      </div>

      {/* Datum-Navigation */}
      <div className="flex items-center justify-between mb-4 rounded-2xl px-4 py-3"
        style={{ backgroundColor: "#101410", border: "1px solid #1a2a1a" }}>
        <button onClick={() => datumVerschieben(-1)} className="text-2xl w-10 text-center" style={{ color: "#22c55e" }}>‹</button>
        <div className="text-center">
          <div className="font-black text-base" style={{ color: istHeute ? "#22c55e" : "#f0f4f0" }}>
            {istHeute ? "Heute" : datum}
          </div>
          {!istHeute && (
            <button onClick={() => setDatum(heute)} className="text-xs mt-0.5" style={{ color: "#3a7a3a" }}>
              → Zu heute
            </button>
          )}
        </div>
        <button onClick={() => datumVerschieben(1)} className="text-2xl w-10 text-center"
          style={{ color: istHeute ? "#1a2a1a" : "#22c55e" }} disabled={istHeute}>›</button>
      </div>

      {/* Tageszusammenfassung */}
      <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#101410", border: "1px solid #1a2a1a" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold" style={{ color: "#3a5a3a" }}>TAGESZIEL</div>
          <Link href="/tracking" className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: "#1a2a1a", color: "#3a7a3a" }}>⚙ Ziele</Link>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            { label: "Kalorien", wert: tagKcal, ziel: ziele.kcal, farbe: "#f59e0b", einheit: "kcal" },
            { label: "Netto-KH", wert: tagKh, ziel: ziele.kh, farbe: tagKh > ziele.kh ? "#ef4444" : tagKh > ziele.kh * 0.7 ? "#f59e0b" : "#22c55e", einheit: "g" },
            { label: "Eiweiß", wert: tagEiweiss, ziel: ziele.eiweiss, farbe: "#22c55e", einheit: "g" },
            { label: "Fett", wert: tagFett, ziel: ziele.fett, farbe: "#8b5cf6", einheit: "g" },
          ].map(({ label, wert, ziel, farbe, einheit }) => {
            const rest = Math.round((ziel - wert) * 10) / 10;
            const over = ziel > 0 && wert > ziel;
            const pct = ziel > 0 ? Math.min(100, Math.round((wert / ziel) * 100)) : 0;
            return (
              <div key={label} className="rounded-xl p-3" style={{ backgroundColor: "#151a15" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-[10px] font-semibold" style={{ color: "#3a5a3a" }}>{label}</div>
                  <div className="text-[10px]" style={{ color: "#2a3a2a" }}>{wert} / {ziel} {einheit}</div>
                </div>
                <div className="rounded-full h-1 overflow-hidden mb-1.5" style={{ backgroundColor: "#1a2a1a" }}>
                  <div className="h-1 rounded-full" style={{ width: `${pct}%`, backgroundColor: over ? "#ef4444" : farbe }} />
                </div>
                <div className="text-xs font-bold" style={{ color: over ? "#ef4444" : rest < ziel * 0.1 ? "#f59e0b" : farbe }}>
                  {over ? `${Math.round((wert - ziel) * 10) / 10} ${einheit} drüber` : `noch ${rest} ${einheit}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* + Hinzufügen Button */}
      <button onClick={() => { formLeeren(); setShowForm(!showForm); }}
        className="w-full py-3.5 rounded-2xl font-black text-black mb-4 text-base"
        style={{ backgroundColor: showForm && !editId ? "#1a2a1a" : "#22c55e", color: showForm && !editId ? "#3a7a3a" : "#000" }}>
        {showForm && !editId ? "✕ Abbrechen" : "+ Lebensmittel / Mahlzeit eintragen"}
      </button>

      {/* Formular */}
      {showForm && (
        <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#101410", border: "1px solid #22c55e22" }}>
          {editId && <div className="text-xs mb-3 font-semibold" style={{ color: "#f59e0b" }}>✏️ Eintrag bearbeiten</div>}

          {/* Suche in Datenbank */}
          <div className="relative mb-3">
            <input value={suche} onChange={e => dbSuchen(e.target.value)}
              placeholder="🔍 Lebensmittel suchen (z.B. Ei, Quark, Brokkoli...)"
              className="w-full px-4 py-3 rounded-xl outline-none text-white text-sm"
              style={{ backgroundColor: "#151a15" }} />
            {suche.length >= 2 && (
              <div className="absolute z-10 left-0 right-0 top-full mt-1 rounded-xl overflow-hidden"
                style={{ backgroundColor: "#151a15", border: "1px solid #22c55e33" }}>
                {/* Lokale Keto-DB-Treffer */}
                {dbTreffer.map((item, i) => (
                  <button key={`db-${i}`} onClick={() => dbAuswaehlen(item)}
                    className="w-full px-4 py-2.5 text-left text-sm border-b flex items-center justify-between"
                    style={{ borderColor: "#1a2a1a" }}>
                    <span>{item.name}</span>
                    <span className="text-xs" style={{ color: "#22c55e" }}>{item.kcal} kcal · {item.kh}g KH</span>
                  </button>
                ))}
                {/* API-Treffer */}
                {apiTreffer.map((item, i) => (
                  <button key={`api-${i}`} onClick={() => apiAuswaehlen(item)}
                    className="w-full px-4 py-2.5 text-left text-sm border-b flex items-center justify-between"
                    style={{ borderColor: "#1a2a1a" }}>
                    <span>{item.name}</span>
                    <span className="text-xs" style={{ color: "#8b5cf6" }}>{item.kcal} kcal · {item.kh}g KH</span>
                  </button>
                ))}
                {/* Ladeindikator */}
                {apiLadt && (
                  <div className="px-4 py-2.5 text-xs flex items-center gap-2" style={{ color: "#555" }}>
                    <span className="animate-spin inline-block">⏳</span> Weitere Produkte werden gesucht…
                  </div>
                )}
                {/* Keine Treffer */}
                {!apiLadt && dbTreffer.length === 0 && apiTreffer.length === 0 && (
                  <div className="px-4 py-3">
                    <div className="text-xs mb-2" style={{ color: "#555" }}>Noch nichts gefunden…</div>
                    <button onClick={() => { setNName(suche); setManuell(true); setDbTreffer([]); setApiTreffer([]); }}
                      className="block w-full text-left text-xs py-1.5 px-2 rounded-lg"
                      style={{ backgroundColor: "#1a1a1a", color: "#666" }}>
                      + „{suche}" manuell eintragen
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Name (manuell) */}
          {(manuell || !nName) && (
            <input value={nName} onChange={e => setNName(e.target.value)}
              placeholder="Name (falls nicht in DB gefunden)"
              className="w-full px-4 py-2.5 rounded-xl outline-none text-white text-sm mb-3"
              style={{ backgroundColor: "#151a15" }} />
          )}

          {/* Menge */}
          <div className="flex gap-2 mb-2">
            <div className="flex-1">
              <div className="text-xs mb-1" style={{ color: "#3a5a3a" }}>Menge</div>
              <input value={nMenge} onChange={e => mengeAendern(e.target.value)} type="number"
                className="w-full px-3 py-2.5 rounded-xl outline-none text-white text-sm text-center font-bold"
                style={{ backgroundColor: "#151a15" }} />
            </div>
            <div className="w-20">
              <div className="text-xs mb-1" style={{ color: "#3a5a3a" }}>Einheit</div>
              <select value={nEinheit} onChange={e => setNEinheit(e.target.value)}
                className="w-full px-2 py-2.5 rounded-xl outline-none text-white text-sm"
                style={{ backgroundColor: "#151a15" }}>
                <option>g</option><option>ml</option><option>Stück</option><option>EL</option><option>TL</option><option>Portion</option>
              </select>
            </div>
          </div>

          {/* Schnell-Gramm-Buttons */}
          {(nEinheit === "g" || nEinheit === "ml") && (
            <div className="flex gap-1.5 mb-3 flex-wrap">
              {[10, 25, 50, 75, 100, 150, 200].map(g => (
                <button key={g} type="button"
                  onClick={() => mengeAendern(String(g))}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: nMenge === String(g) ? "#22c55e" : "#1a2a1a",
                    color: nMenge === String(g) ? "#000" : "#4ade80",
                    border: "1px solid #1a3a1a",
                  }}>
                  {g}{nEinheit}
                </button>
              ))}
              <button type="button"
                onClick={() => mengeAendern("")}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold"
                style={{ backgroundColor: "#1a1a1a", color: "#555", border: "1px solid #222" }}>
                eigene
              </button>
            </div>
          )}

          {/* Nährwerte */}
          <div className="text-xs mb-2" style={{ color: "#3a5a3a" }}>
            Nährwerte {nEinheit !== "Stück" ? `für ${nMenge || "?"} ${nEinheit}` : ""}
            {!manuell && nName && DB.find(l => l.name === nName) &&
              <button onClick={() => setManuell(true)} className="ml-2 underline" style={{ color: "#22c55e" }}>manuell anpassen</button>
            }
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { label: "kcal", val: nKcal, set: setNKcal, farbe: "#f59e0b" },
              { label: "KH gesamt (g)", val: nKh, set: setNKh, farbe: "#ef4444" },
              { label: "Eiweiß (g)", val: nEiweiss, set: setNEiweiss, farbe: "#22c55e" },
              { label: "Fett (g)", val: nFett, set: setNFett, farbe: "#8b5cf6" },
            ].map(({ label, val, set, farbe }) => (
              <div key={label}>
                <div className="text-xs mb-1" style={{ color: farbe + "aa" }}>{label}</div>
                <input value={val} onChange={e => { set(e.target.value); setManuell(true); }} type="number"
                  className="w-full px-3 py-2.5 rounded-xl outline-none text-white text-sm text-center"
                  style={{ backgroundColor: "#151a15" }} />
              </div>
            ))}
          </div>
          <div className="mb-4">
            <div className="text-xs mb-1" style={{ color: "#3a5a3a" }}>Ballaststoffe (g) — Netto-KH = KH − Ballaststoffe</div>
            <input value={nBst} onChange={e => { setNBst(e.target.value); setManuell(true); }} type="number"
              className="w-full px-3 py-2.5 rounded-xl outline-none text-white text-sm"
              style={{ backgroundColor: "#151a15" }} />
          </div>
          <div className="flex gap-2">
            <button onClick={() => { formLeeren(); setShowForm(false); }}
              className="flex-1 py-2.5 rounded-xl text-sm"
              style={{ backgroundColor: "#151a15", color: "#555" }}>Abbrechen</button>
            <button onClick={hinzufuegen}
              className="flex-1 py-2.5 rounded-xl font-black text-black text-sm"
              style={{ backgroundColor: "#22c55e" }}>
              {editId ? "Speichern ✓" : "Hinzufügen ✓"}
            </button>
          </div>
        </div>
      )}

      {/* Schnellauswahl */}
      {!showForm && (zuletzt.length > 0 || meist.length > 0) && (
        <div className="mb-4">
          <div className="flex gap-2 mb-2">
            {(["zuletzt", "meist"] as const).map(t => (
              <button key={t} onClick={() => setSchnellTab(t)}
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: schnellTab === t ? "#22c55e" : "#101410", color: schnellTab === t ? "#000" : "#3a7a3a", border: "1px solid #1a2a1a" }}>
                {t === "zuletzt" ? "🕐 Zuletzt" : "⭐ Meist"}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {schnellListe.map((e, i) => (
              <button key={i} onClick={() => schnellHinzufuegen(e)}
                className="px-3 py-2 rounded-xl text-xs text-left"
                style={{ backgroundColor: "#101410", border: "1px solid #1a2a1a", color: "#ccc" }}>
                <span className="font-semibold">{e.name}</span>
                {e.menge > 0 && <span className="ml-1" style={{ color: "#3a5a3a" }}>{e.menge}{e.einheit}</span>}
                {e.kcal > 0 && <span className="ml-1" style={{ color: "#f59e0b" }}>{e.kcal}kcal</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Einträge des Tages */}
      {tagEintraege.length > 0 ? (
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#101410", border: "1px solid #1a2a1a" }}>
          <div className="px-4 py-2.5" style={{ backgroundColor: "#151a15" }}>
            <span className="text-xs font-semibold" style={{ color: "#3a5a3a" }}>
              {tagEintraege.length} Einträge — {istHeute ? "heute" : datum}
            </span>
          </div>
          {tagEintraege.map(e => (
            <div key={e.id} className="px-4 py-3 border-t" style={{ borderColor: "#151a15" }}>
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{e.name}</span>
                    {e.menge > 0 && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: "#151a15", color: "#3a5a3a" }}>
                        {e.menge} {e.einheit}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3 text-xs mt-1 flex-wrap">
                    {e.kcal > 0 && <span style={{ color: "#f59e0b" }}>{e.kcal} kcal</span>}
                    {e.kh > 0 && <span style={{ color: "#ef4444" }}>{runde(e.kh)}g KH</span>}
                    {e.eiweiss > 0 && <span style={{ color: "#22c55e" }}>{e.eiweiss}g Eiw.</span>}
                    {e.fett > 0 && <span style={{ color: "#8b5cf6" }}>{e.fett}g Fett</span>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => bearbeiten(e)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-sm"
                    style={{ backgroundColor: "#151a15", color: "#3a7a3a" }}>✏️</button>
                  <button onClick={() => loeschen(e.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-sm"
                    style={{ backgroundColor: "#151a15", color: "#2a3a2a" }}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10" style={{ color: "#2a3a2a" }}>
          <div className="text-5xl mb-3">🥗</div>
          <p className="text-sm">Noch nichts für {istHeute ? "heute" : datum} eingetragen.</p>
          <p className="text-xs mt-1" style={{ color: "#1a2a1a" }}>Tippe auf + um loszulegen</p>
        </div>
      )}
    </main>
  );
}
