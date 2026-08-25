/**
 * Label14 allergen dictionary
 *
 * Sources (official):
 * - FSA, Food allergen labelling and information requirements technical guidance
 *   https://www.gov.uk/government/publications/food-allergen-labelling-and-information-requirements-technical-guidance
 * - FSA, Allergen labelling for food manufacturers
 *   https://www.gov.uk/government/publications/allergen-labelling-for-food-manufacturers
 * - FSA / GOV.UK, Allergen guidance for food businesses (14 allergens list)
 *   https://www.gov.uk/government/publications/allergen-guidance-for-food-businesses
 * - Assimilated Regulation (EU) No. 1169/2011, Annex II
 *
 * This is a formatter dictionary, not a laboratory analysis.
 * Compounds such as "spice mix" or "seasoning" are never auto-guessed.
 */
(function (global) {
  "use strict";

  const ALLERGENS = {
    celery: {
      id: "celery",
      label: "Celery",
      group: "celery",
      annex: "Celery",
    },
    wheat: {
      id: "wheat",
      label: "Wheat",
      group: "gluten",
      annex: "Cereals containing gluten",
    },
    rye: {
      id: "rye",
      label: "Rye",
      group: "gluten",
      annex: "Cereals containing gluten",
    },
    barley: {
      id: "barley",
      label: "Barley",
      group: "gluten",
      annex: "Cereals containing gluten",
    },
    oats: {
      id: "oats",
      label: "Oats",
      group: "gluten",
      annex: "Cereals containing gluten",
    },
    crustaceans: {
      id: "crustaceans",
      label: "Crustaceans",
      group: "crustaceans",
      annex: "Crustaceans",
    },
    eggs: {
      id: "eggs",
      label: "Eggs",
      group: "eggs",
      annex: "Eggs",
    },
    fish: {
      id: "fish",
      label: "Fish",
      group: "fish",
      annex: "Fish",
    },
    lupin: {
      id: "lupin",
      label: "Lupin",
      group: "lupin",
      annex: "Lupin",
    },
    milk: {
      id: "milk",
      label: "Milk",
      group: "milk",
      annex: "Milk",
    },
    molluscs: {
      id: "molluscs",
      label: "Molluscs",
      group: "molluscs",
      annex: "Molluscs",
    },
    mustard: {
      id: "mustard",
      label: "Mustard",
      group: "mustard",
      annex: "Mustard",
    },
    peanuts: {
      id: "peanuts",
      label: "Peanuts",
      group: "peanuts",
      annex: "Peanuts",
    },
    sesame: {
      id: "sesame",
      label: "Sesame",
      group: "sesame",
      annex: "Sesame",
    },
    soybeans: {
      id: "soybeans",
      label: "Soya",
      group: "soybeans",
      annex: "Soybeans",
    },
    sulphites: {
      id: "sulphites",
      label: "Sulphur dioxide / sulphites",
      group: "sulphites",
      annex: "Sulphur dioxide and sulphites (if more than 10 mg/kg or 10 mg/litre)",
    },
    almond: {
      id: "almond",
      label: "Almond",
      group: "treenuts",
      annex: "Tree nuts",
    },
    hazelnut: {
      id: "hazelnut",
      label: "Hazelnut",
      group: "treenuts",
      annex: "Tree nuts",
    },
    walnut: {
      id: "walnut",
      label: "Walnut",
      group: "treenuts",
      annex: "Tree nuts",
    },
    cashew: {
      id: "cashew",
      label: "Cashew",
      group: "treenuts",
      annex: "Tree nuts",
    },
    pecan: {
      id: "pecan",
      label: "Pecan",
      group: "treenuts",
      annex: "Tree nuts",
    },
    brazil: {
      id: "brazil",
      label: "Brazil nut",
      group: "treenuts",
      annex: "Tree nuts",
    },
    pistachio: {
      id: "pistachio",
      label: "Pistachio",
      group: "treenuts",
      annex: "Tree nuts",
    },
    macadamia: {
      id: "macadamia",
      label: "Macadamia",
      group: "treenuts",
      annex: "Tree nuts",
    },
  };

  /**
   * Phrase aliases, longest-first at match time.
   * display:
   *   self  — emphasise the matched food name (butter, cheese, eggs)
   *   ref   — keep the ingredient and add (Allergen) in bold (whey (Milk))
   *
   * Dairy designations (cheese, butter, cream, yoghurt) may be emphasised
   * without repeating "milk" — FSA technical guidance paras 40–42.
   * Less familiar milk products and derivatives must reference milk.
   */
  const ALIASES = [
    // --- Exceptions / non-Annex II "nut" and "flour" words (blockers) ---
    { phrase: "buckwheat flour", allergen: null },
    { phrase: "buckwheat", allergen: null },
    { phrase: "cornflour", allergen: null },
    { phrase: "corn flour", allergen: null },
    { phrase: "maize flour", allergen: null },
    { phrase: "rice flour", allergen: null },
    { phrase: "gram flour", allergen: null },
    { phrase: "chickpea flour", allergen: null },
    { phrase: "besan", allergen: null },
    { phrase: "coconut flour", allergen: null },
    { phrase: "potato flour", allergen: null },
    { phrase: "tapioca flour", allergen: null },
    { phrase: "tapioca starch", allergen: null },
    { phrase: "potato starch", allergen: null },
    { phrase: "corn starch", allergen: null },
    { phrase: "maize starch", allergen: null },
    { phrase: "arrowroot", allergen: null },
    { phrase: "chestnut flour", allergen: null },
    { phrase: "water chestnut", allergen: null },
    { phrase: "water chestnuts", allergen: null },
    { phrase: "sweet chestnut", allergen: null },
    { phrase: "chestnuts", allergen: null },
    { phrase: "chestnut", allergen: null },
    { phrase: "pine nuts", allergen: null },
    { phrase: "pine nut", allergen: null },
    { phrase: "pinenuts", allergen: null },
    { phrase: "coconut milk", allergen: null },
    { phrase: "coconut cream", allergen: null },
    { phrase: "coconut oil", allergen: null },
    { phrase: "desiccated coconut", allergen: null },
    { phrase: "coconut", allergen: null },
    { phrase: "nutmeg", allergen: null },
    { phrase: "butternut squash", allergen: null },
    { phrase: "butternut", allergen: null },
    { phrase: "shea nut", allergen: null },
    { phrase: "shea", allergen: null },
    { phrase: "tiger nut", allergen: null },
    { phrase: "tiger nuts", allergen: null },

    // --- Cereals containing gluten: wheat ---
    // FSA: declare the specific cereal; spelt/Khorasan/Kamut need a wheat reference.
    { phrase: "self-raising flour", allergen: "wheat", display: "ref", ref: "Wheat" },
    { phrase: "self raising flour", allergen: "wheat", display: "ref", ref: "Wheat" },
    { phrase: "selfraising flour", allergen: "wheat", display: "ref", ref: "Wheat" },
    { phrase: "plain flour", allergen: "wheat", display: "ref", ref: "Wheat" },
    { phrase: "strong white flour", allergen: "wheat", display: "ref", ref: "Wheat" },
    { phrase: "strong flour", allergen: "wheat", display: "ref", ref: "Wheat" },
    { phrase: "bread flour", allergen: "wheat", display: "ref", ref: "Wheat" },
    { phrase: "wholemeal flour", allergen: "wheat", display: "ref", ref: "Wheat" },
    { phrase: "whole wheat flour", allergen: "wheat", display: "ref", ref: "Wheat" },
    { phrase: "wholewheat flour", allergen: "wheat", display: "ref", ref: "Wheat" },
    { phrase: "wheat flour", allergen: "wheat", display: "self-part", part: "Wheat" },
    { phrase: "00 flour", allergen: "wheat", display: "ref", ref: "Wheat" },
    { phrase: "tipo 00", allergen: "wheat", display: "ref", ref: "Wheat" },
    { phrase: "wheat starch", allergen: "wheat", display: "self-part", part: "Wheat" },
    { phrase: "wheat protein", allergen: "wheat", display: "self-part", part: "Wheat" },
    { phrase: "wheat gluten", allergen: "wheat", display: "self-part", part: "Wheat" },
    { phrase: "vital wheat gluten", allergen: "wheat", display: "self-part", part: "Wheat" },
    { phrase: "khorasan wheat", allergen: "wheat", display: "self-part", part: "Wheat" },
    { phrase: "khorasan", allergen: "wheat", display: "ref", ref: "Wheat" },
    { phrase: "kamut", allergen: "wheat", display: "ref", ref: "Wheat" },
    { phrase: "spelt flour", allergen: "wheat", display: "ref", ref: "Wheat" },
    { phrase: "spelt", allergen: "wheat", display: "ref", ref: "Wheat" },
    { phrase: "durum wheat", allergen: "wheat", display: "self-part", part: "Wheat" },
    { phrase: "durum", allergen: "wheat", display: "ref", ref: "Wheat" },
    { phrase: "semolina", allergen: "wheat", display: "ref", ref: "Wheat" },
    { phrase: "couscous", allergen: "wheat", display: "ref", ref: "Wheat" },
    { phrase: "bulgur", allergen: "wheat", display: "ref", ref: "Wheat" },
    { phrase: "bulgar", allergen: "wheat", display: "ref", ref: "Wheat" },
    { phrase: "freekeh", allergen: "wheat", display: "ref", ref: "Wheat" },
    { phrase: "seitan", allergen: "wheat", display: "ref", ref: "Wheat" },
    { phrase: "breadcrumbs", allergen: "wheat", display: "ref", ref: "Wheat" },
    { phrase: "breadcrumb", allergen: "wheat", display: "ref", ref: "Wheat" },
    { phrase: "rusk", allergen: "wheat", display: "ref", ref: "Wheat" },
    { phrase: "panko", allergen: "wheat", display: "ref", ref: "Wheat" },
    { phrase: "wheat", allergen: "wheat", display: "self" },
    { phrase: "flour", allergen: "wheat", display: "ref", ref: "Wheat", note: "Mapped as wheat flour, the usual UK bakery meaning. If this is rice, gram, cornflour or another flour, edit the name." },

    // --- rye / barley / oats ---
    { phrase: "rye flour", allergen: "rye", display: "self-part", part: "Rye" },
    { phrase: "rye bread", allergen: "rye", display: "self-part", part: "Rye" },
    { phrase: "rye", allergen: "rye", display: "self" },
    { phrase: "barley malt extract", allergen: "barley", display: "self-part", part: "Barley" },
    { phrase: "barley malt", allergen: "barley", display: "self-part", part: "Barley" },
    { phrase: "malted barley", allergen: "barley", display: "self-part", part: "Barley" },
    { phrase: "malt extract", allergen: "barley", display: "ref", ref: "Barley", note: "Malt extract is usually from barley. Confirm the grain on the supplier spec." },
    { phrase: "barley", allergen: "barley", display: "self" },
    { phrase: "porridge oats", allergen: "oats", display: "self-part", part: "Oats" },
    { phrase: "rolled oats", allergen: "oats", display: "self-part", part: "Oats" },
    { phrase: "oat flour", allergen: "oats", display: "self-part", part: "Oats" },
    { phrase: "oat milk", allergen: "oats", display: "self-part", part: "Oats" },
    { phrase: "oatmeal", allergen: "oats", display: "self" },
    { phrase: "oats", allergen: "oats", display: "self" },

    // Common finished wheat bakery goods when used as an ingredient
    { phrase: "digestive biscuits", allergen: "wheat", display: "ref", ref: "Wheat" },
    { phrase: "digestives", allergen: "wheat", display: "ref", ref: "Wheat" },
    { phrase: "graham crackers", allergen: "wheat", display: "ref", ref: "Wheat" },

    // --- Crustaceans (FSA examples: prawns, lobster, crabs, crayfish, langoustines, shrimp paste) ---
    { phrase: "shrimp paste", allergen: "crustaceans", display: "ref", ref: "Crustaceans" },
    { phrase: "langoustine", allergen: "crustaceans", display: "ref", ref: "Crustaceans" },
    { phrase: "langoustines", allergen: "crustaceans", display: "ref", ref: "Crustaceans" },
    { phrase: "crayfish", allergen: "crustaceans", display: "ref", ref: "Crustaceans" },
    { phrase: "scampi", allergen: "crustaceans", display: "ref", ref: "Crustaceans" },
    { phrase: "prawns", allergen: "crustaceans", display: "ref", ref: "Crustaceans" },
    { phrase: "prawn", allergen: "crustaceans", display: "ref", ref: "Crustaceans" },
    { phrase: "lobster", allergen: "crustaceans", display: "ref", ref: "Crustaceans" },
    { phrase: "shrimp", allergen: "crustaceans", display: "ref", ref: "Crustaceans" },
    { phrase: "shrimps", allergen: "crustaceans", display: "ref", ref: "Crustaceans" },
    { phrase: "crab", allergen: "crustaceans", display: "ref", ref: "Crustaceans" },
    { phrase: "crabs", allergen: "crustaceans", display: "ref", ref: "Crustaceans" },
    { phrase: "crustaceans", allergen: "crustaceans", display: "self" },
    { phrase: "crustacean", allergen: "crustaceans", display: "self" },

    // --- Eggs (all bird eggs) ---
    { phrase: "egg white", allergen: "eggs", display: "self-part", part: "Egg" },
    { phrase: "egg whites", allergen: "eggs", display: "self-part", part: "Egg" },
    { phrase: "egg yolk", allergen: "eggs", display: "self-part", part: "Egg" },
    { phrase: "egg yolks", allergen: "eggs", display: "self-part", part: "Egg" },
    { phrase: "egg wash", allergen: "eggs", display: "self-part", part: "Egg" },
    { phrase: "dried egg", allergen: "eggs", display: "self-part", part: "Egg" },
    { phrase: "egg powder", allergen: "eggs", display: "self-part", part: "Egg" },
    { phrase: "albumen", allergen: "eggs", display: "ref", ref: "Egg" },
    { phrase: "albumin", allergen: "eggs", display: "ref", ref: "Egg" },
    { phrase: "mayonnaise", allergen: "eggs", display: "ref", ref: "Egg" },
    { phrase: "mayo", allergen: "eggs", display: "ref", ref: "Egg" },
    { phrase: "meringue", allergen: "eggs", display: "ref", ref: "Egg" },
    { phrase: "eggs", allergen: "eggs", display: "self" },
    { phrase: "egg", allergen: "eggs", display: "self" },

    // --- Fish ---
    { phrase: "fish sauce", allergen: "fish", display: "self-part", part: "Fish" },
    { phrase: "anchovy essence", allergen: "fish", display: "ref", ref: "Fish" },
    { phrase: "anchovies", allergen: "fish", display: "ref", ref: "Fish" },
    { phrase: "anchovy", allergen: "fish", display: "ref", ref: "Fish" },
    { phrase: "worcestershire sauce", allergen: null, ambiguous: true, reason: "Worcestershire sauce often contains anchovy (fish). Check the bottle and add the named ingredients if it does." },
    { phrase: "worcester sauce", allergen: null, ambiguous: true, reason: "Worcestershire sauce often contains anchovy (fish). Check the bottle and add the named ingredients if it does." },
    { phrase: "cod", allergen: "fish", display: "ref", ref: "Fish" },
    { phrase: "haddock", allergen: "fish", display: "ref", ref: "Fish" },
    { phrase: "salmon", allergen: "fish", display: "ref", ref: "Fish" },
    { phrase: "tuna", allergen: "fish", display: "ref", ref: "Fish" },
    { phrase: "mackerel", allergen: "fish", display: "ref", ref: "Fish" },
    { phrase: "sardines", allergen: "fish", display: "ref", ref: "Fish" },
    { phrase: "sardine", allergen: "fish", display: "ref", ref: "Fish" },
    { phrase: "trout", allergen: "fish", display: "ref", ref: "Fish" },
    { phrase: "sea bass", allergen: "fish", display: "ref", ref: "Fish" },
    { phrase: "seabass", allergen: "fish", display: "ref", ref: "Fish" },
    { phrase: "plaice", allergen: "fish", display: "ref", ref: "Fish" },
    { phrase: "halibut", allergen: "fish", display: "ref", ref: "Fish" },
    { phrase: "pollock", allergen: "fish", display: "ref", ref: "Fish" },
    { phrase: "coleys", allergen: "fish", display: "ref", ref: "Fish" },
    { phrase: "coley", allergen: "fish", display: "ref", ref: "Fish" },
    { phrase: "tilapia", allergen: "fish", display: "ref", ref: "Fish" },
    { phrase: "fish", allergen: "fish", display: "self" },

    // --- Peanuts (must use "peanuts", not groundnuts/monkey nuts alone) ---
    { phrase: "peanut butter", allergen: "peanuts", display: "self-part", part: "Peanut" },
    { phrase: "peanut oil", allergen: "peanuts", display: "self-part", part: "Peanut" },
    { phrase: "groundnut oil", allergen: "peanuts", display: "ref", ref: "Peanuts" },
    { phrase: "groundnuts", allergen: "peanuts", display: "ref", ref: "Peanuts" },
    { phrase: "groundnut", allergen: "peanuts", display: "ref", ref: "Peanuts" },
    { phrase: "monkey nuts", allergen: "peanuts", display: "ref", ref: "Peanuts" },
    { phrase: "monkey nut", allergen: "peanuts", display: "ref", ref: "Peanuts" },
    { phrase: "arachis", allergen: "peanuts", display: "ref", ref: "Peanuts" },
    { phrase: "peanuts", allergen: "peanuts", display: "self" },
    { phrase: "peanut", allergen: "peanuts", display: "self" },

    // --- Soybeans (soya / soy are sufficient; tofu and edamame need a soya reference) ---
    { phrase: "textured vegetable protein", allergen: "soybeans", display: "ref", ref: "Soya" },
    { phrase: "textured soya protein", allergen: "soybeans", display: "self-part", part: "Soya" },
    { phrase: "soya protein", allergen: "soybeans", display: "self-part", part: "Soya" },
    { phrase: "soy protein", allergen: "soybeans", display: "ref", ref: "Soya" },
    { phrase: "edamame beans", allergen: "soybeans", display: "ref", ref: "Soya" },
    { phrase: "edamame", allergen: "soybeans", display: "ref", ref: "Soya" },
    { phrase: "soy sauce", allergen: "soybeans", display: "ref", ref: "Soya", note: "Many UK soy sauces also contain wheat. Check the bottle; add wheat if it is an ingredient." },
    { phrase: "soya sauce", allergen: "soybeans", display: "self-part", part: "Soya", note: "Many UK soya sauces also contain wheat. Check the bottle; add wheat if it is an ingredient." },
    { phrase: "tamari", allergen: "soybeans", display: "ref", ref: "Soya" },
    { phrase: "soya milk", allergen: "soybeans", display: "self-part", part: "Soya" },
    { phrase: "soy milk", allergen: "soybeans", display: "ref", ref: "Soya" },
    { phrase: "soybean", allergen: "soybeans", display: "ref", ref: "Soya" },
    { phrase: "soybeans", allergen: "soybeans", display: "ref", ref: "Soya" },
    { phrase: "soya bean", allergen: "soybeans", display: "self-part", part: "Soya" },
    { phrase: "soya beans", allergen: "soybeans", display: "self-part", part: "Soya" },
    { phrase: "soya flour", allergen: "soybeans", display: "self-part", part: "Soya" },
    { phrase: "soy flour", allergen: "soybeans", display: "ref", ref: "Soya" },
    { phrase: "tofu", allergen: "soybeans", display: "ref", ref: "Soya" },
    { phrase: "tempeh", allergen: "soybeans", display: "ref", ref: "Soya" },
    { phrase: "miso", allergen: "soybeans", display: "ref", ref: "Soya" },
    { phrase: "soya", allergen: "soybeans", display: "self" },
    { phrase: "soy", allergen: "soybeans", display: "ref", ref: "Soya" },

    // --- Milk and products (including lactose) ---
    { phrase: "skimmed milk powder", allergen: "milk", display: "self-part", part: "Milk" },
    { phrase: "milk powder", allergen: "milk", display: "self-part", part: "Milk" },
    { phrase: "whole milk", allergen: "milk", display: "self-part", part: "Milk" },
    { phrase: "semi-skimmed milk", allergen: "milk", display: "self-part", part: "Milk" },
    { phrase: "semi skimmed milk", allergen: "milk", display: "self-part", part: "Milk" },
    { phrase: "skimmed milk", allergen: "milk", display: "self-part", part: "Milk" },
    { phrase: "condensed milk", allergen: "milk", display: "self-part", part: "Milk" },
    { phrase: "evaporated milk", allergen: "milk", display: "self-part", part: "Milk" },
    { phrase: "buttermilk", allergen: "milk", display: "self" },
    { phrase: "milk chocolate", allergen: "milk", display: "self-part", part: "Milk" },
    { phrase: "white chocolate", allergen: "milk", display: "ref", ref: "Milk" },
    { phrase: "cream cheese", allergen: "milk", display: "self" },
    { phrase: "soured cream", allergen: "milk", display: "self" },
    { phrase: "sour cream", allergen: "milk", display: "self" },
    { phrase: "clotted cream", allergen: "milk", display: "self" },
    { phrase: "double cream", allergen: "milk", display: "self" },
    { phrase: "single cream", allergen: "milk", display: "self" },
    { phrase: "whipping cream", allergen: "milk", display: "self" },
    { phrase: "whipped cream", allergen: "milk", display: "self" },
    { phrase: "creme fraiche", allergen: "milk", display: "self" },
    { phrase: "crème fraîche", allergen: "milk", display: "self" },
    { phrase: "creme fraiche", allergen: "milk", display: "self" },
    { phrase: "fromage frais", allergen: "milk", display: "ref", ref: "Milk" },
    { phrase: "fromage-frais", allergen: "milk", display: "ref", ref: "Milk" },
    { phrase: "mascarpone", allergen: "milk", display: "ref", ref: "Milk" },
    { phrase: "quark", allergen: "milk", display: "ref", ref: "Milk" },
    { phrase: "cottage cheese", allergen: "milk", display: "self" },
    { phrase: "cream cheese", allergen: "milk", display: "self" },
    { phrase: "ice cream", allergen: "milk", display: "self-part", part: "Cream" },
    { phrase: "yogurt", allergen: "milk", display: "self" },
    { phrase: "yoghurt", allergen: "milk", display: "self" },
    { phrase: "greek yogurt", allergen: "milk", display: "self" },
    { phrase: "greek yoghurt", allergen: "milk", display: "self" },
    { phrase: "natural yoghurt", allergen: "milk", display: "self" },
    { phrase: "natural yogurt", allergen: "milk", display: "self" },
    { phrase: "whey powder", allergen: "milk", display: "ref", ref: "Milk" },
    { phrase: "whey", allergen: "milk", display: "ref", ref: "Milk" },
    { phrase: "casein", allergen: "milk", display: "ref", ref: "Milk" },
    { phrase: "caseinate", allergen: "milk", display: "ref", ref: "Milk" },
    { phrase: "lactose", allergen: "milk", display: "ref", ref: "Milk" },
    { phrase: "ghee", allergen: "milk", display: "ref", ref: "Milk" },
    { phrase: "clarified butter", allergen: "milk", display: "self-part", part: "Butter" },
    { phrase: "unsalted butter", allergen: "milk", display: "self-part", part: "Butter" },
    { phrase: "salted butter", allergen: "milk", display: "self-part", part: "Butter" },
    { phrase: "butter", allergen: "milk", display: "self" },
    { phrase: "cheddar", allergen: "milk", display: "self" },
    { phrase: "stilton", allergen: "milk", display: "self" },
    { phrase: "brie", allergen: "milk", display: "self" },
    { phrase: "camembert", allergen: "milk", display: "self" },
    { phrase: "mozzarella", allergen: "milk", display: "self" },
    { phrase: "parmesan", allergen: "milk", display: "self" },
    { phrase: "parmigiano", allergen: "milk", display: "ref", ref: "Milk" },
    { phrase: "pecorino", allergen: "milk", display: "ref", ref: "Milk" },
    { phrase: "halloumi", allergen: "milk", display: "self" },
    { phrase: "feta", allergen: "milk", display: "self" },
    { phrase: "ricotta", allergen: "milk", display: "self" },
    { phrase: "paneer", allergen: "milk", display: "ref", ref: "Milk" },
    { phrase: "cantal", allergen: "milk", display: "ref", ref: "Milk" },
    { phrase: "cheese", allergen: "milk", display: "self" },
    { phrase: "cream", allergen: "milk", display: "self" },
    { phrase: "milk", allergen: "milk", display: "self" },

    // --- Tree nuts (specific nut must be named; chestnut/pine/coconut are not Annex II) ---
    { phrase: "ground almonds", allergen: "almond", display: "self-part", part: "Almonds" },
    { phrase: "almond flour", allergen: "almond", display: "self-part", part: "Almond" },
    { phrase: "almond meal", allergen: "almond", display: "self-part", part: "Almond" },
    { phrase: "almond milk", allergen: "almond", display: "self-part", part: "Almond" },
    { phrase: "almond extract", allergen: null, ambiguous: true, reason: "Almond extract may be real almond or flavouring. Check the supplier spec." },
    { phrase: "flaked almonds", allergen: "almond", display: "self-part", part: "Almonds" },
    { phrase: "flaked almond", allergen: "almond", display: "self-part", part: "Almond" },
    { phrase: "marzipan", allergen: "almond", display: "ref", ref: "Almond" },
    { phrase: "frangipane", allergen: "almond", display: "ref", ref: "Almond" },
    { phrase: "almonds", allergen: "almond", display: "self" },
    { phrase: "almond", allergen: "almond", display: "self" },
    { phrase: "hazelnut spread", allergen: "hazelnut", display: "self-part", part: "Hazelnut" },
    { phrase: "hazelnuts", allergen: "hazelnut", display: "self" },
    { phrase: "hazelnut", allergen: "hazelnut", display: "self" },
    { phrase: "filberts", allergen: "hazelnut", display: "ref", ref: "Hazelnut" },
    { phrase: "filbert", allergen: "hazelnut", display: "ref", ref: "Hazelnut" },
    { phrase: "walnuts", allergen: "walnut", display: "self" },
    { phrase: "walnut", allergen: "walnut", display: "self" },
    { phrase: "cashew nuts", allergen: "cashew", display: "self-part", part: "Cashew" },
    { phrase: "cashew nut", allergen: "cashew", display: "self-part", part: "Cashew" },
    { phrase: "cashews", allergen: "cashew", display: "self" },
    { phrase: "cashew", allergen: "cashew", display: "self" },
    { phrase: "pecan nuts", allergen: "pecan", display: "self-part", part: "Pecan" },
    { phrase: "pecan nut", allergen: "pecan", display: "self-part", part: "Pecan" },
    { phrase: "pecans", allergen: "pecan", display: "self" },
    { phrase: "pecan", allergen: "pecan", display: "self" },
    { phrase: "brazil nuts", allergen: "brazil", display: "self" },
    { phrase: "brazil nut", allergen: "brazil", display: "self" },
    { phrase: "brazils", allergen: "brazil", display: "ref", ref: "Brazil nut" },
    { phrase: "pistachios", allergen: "pistachio", display: "self" },
    { phrase: "pistachio", allergen: "pistachio", display: "self" },
    { phrase: "macadamia nuts", allergen: "macadamia", display: "self-part", part: "Macadamia" },
    { phrase: "macadamia nut", allergen: "macadamia", display: "self-part", part: "Macadamia" },
    { phrase: "macadamias", allergen: "macadamia", display: "self" },
    { phrase: "macadamia", allergen: "macadamia", display: "self" },
    { phrase: "queensland nut", allergen: "macadamia", display: "ref", ref: "Macadamia" },
    { phrase: "queensland nuts", allergen: "macadamia", display: "ref", ref: "Macadamia" },

    // --- Celery (stick, celeriac, leaf, seed, oil, salt, spice, oleoresin) ---
    { phrase: "celery salt", allergen: "celery", display: "self-part", part: "Celery" },
    { phrase: "celery seed", allergen: "celery", display: "self-part", part: "Celery" },
    { phrase: "celery seeds", allergen: "celery", display: "self-part", part: "Celery" },
    { phrase: "celery leaf", allergen: "celery", display: "self-part", part: "Celery" },
    { phrase: "celery leaves", allergen: "celery", display: "self-part", part: "Celery" },
    { phrase: "celery oil", allergen: "celery", display: "self-part", part: "Celery" },
    { phrase: "celery spice", allergen: "celery", display: "self-part", part: "Celery" },
    { phrase: "celeriac", allergen: "celery", display: "self" },
    { phrase: "celery", allergen: "celery", display: "self" },

    // --- Mustard ---
    { phrase: "english mustard", allergen: "mustard", display: "self-part", part: "Mustard" },
    { phrase: "dijon mustard", allergen: "mustard", display: "self-part", part: "Mustard" },
    { phrase: "wholegrain mustard", allergen: "mustard", display: "self-part", part: "Mustard" },
    { phrase: "whole grain mustard", allergen: "mustard", display: "self-part", part: "Mustard" },
    { phrase: "mustard powder", allergen: "mustard", display: "self-part", part: "Mustard" },
    { phrase: "mustard seeds", allergen: "mustard", display: "self-part", part: "Mustard" },
    { phrase: "mustard seed", allergen: "mustard", display: "self-part", part: "Mustard" },
    { phrase: "mustard oil", allergen: "mustard", display: "self-part", part: "Mustard" },
    { phrase: "mustard", allergen: "mustard", display: "self" },

    // --- Sesame (tahini must reference sesame; gingelly oil is sesame) ---
    { phrase: "sesame seeds", allergen: "sesame", display: "self-part", part: "Sesame" },
    { phrase: "sesame seed", allergen: "sesame", display: "self-part", part: "Sesame" },
    { phrase: "sesame oil", allergen: "sesame", display: "self-part", part: "Sesame" },
    { phrase: "gingelly oil", allergen: "sesame", display: "ref", ref: "Sesame" },
    { phrase: "gingelly", allergen: "sesame", display: "ref", ref: "Sesame" },
    { phrase: "tahini paste", allergen: "sesame", display: "ref", ref: "Sesame" },
    { phrase: "tahini", allergen: "sesame", display: "ref", ref: "Sesame" },
    { phrase: "tahina", allergen: "sesame", display: "ref", ref: "Sesame" },
    { phrase: "houmous", allergen: "sesame", display: "ref", ref: "Sesame" },
    { phrase: "hummus", allergen: "sesame", display: "ref", ref: "Sesame" },
    { phrase: "humous", allergen: "sesame", display: "ref", ref: "Sesame" },
    { phrase: "sesame", allergen: "sesame", display: "self" },

    // --- Sulphur dioxide / sulphites (>10 mg/kg or 10 mg/litre as SO2) ---
    { phrase: "sodium metabisulphite", allergen: "sulphites", display: "self-part", part: "sulphite" },
    { phrase: "sodium metabisulfite", allergen: "sulphites", display: "self-part", part: "sulfite" },
    { phrase: "potassium metabisulphite", allergen: "sulphites", display: "self-part", part: "sulphite" },
    { phrase: "potassium metabisulfite", allergen: "sulphites", display: "self-part", part: "sulfite" },
    { phrase: "sodium sulphite", allergen: "sulphites", display: "self-part", part: "sulphite" },
    { phrase: "sodium sulfite", allergen: "sulphites", display: "self-part", part: "sulfite" },
    { phrase: "potassium sulphite", allergen: "sulphites", display: "self-part", part: "sulphite" },
    { phrase: "sulphur dioxide", allergen: "sulphites", display: "self" },
    { phrase: "sulfur dioxide", allergen: "sulphites", display: "self" },
    { phrase: "sulphites", allergen: "sulphites", display: "self" },
    { phrase: "sulphite", allergen: "sulphites", display: "self" },
    { phrase: "sulfites", allergen: "sulphites", display: "self" },
    { phrase: "sulfite", allergen: "sulphites", display: "self" },
    { phrase: "e220", allergen: "sulphites", display: "ref", ref: "Sulphur dioxide" },
    { phrase: "e221", allergen: "sulphites", display: "ref", ref: "Sulphites" },
    { phrase: "e222", allergen: "sulphites", display: "ref", ref: "Sulphites" },
    { phrase: "e223", allergen: "sulphites", display: "ref", ref: "Sulphites" },
    { phrase: "e224", allergen: "sulphites", display: "ref", ref: "Sulphites" },
    { phrase: "e226", allergen: "sulphites", display: "ref", ref: "Sulphites" },
    { phrase: "e227", allergen: "sulphites", display: "ref", ref: "Sulphites" },
    { phrase: "e228", allergen: "sulphites", display: "ref", ref: "Sulphites" },

    // --- Lupin ---
    { phrase: "lupin flour", allergen: "lupin", display: "self-part", part: "Lupin" },
    { phrase: "lupin seed", allergen: "lupin", display: "self-part", part: "Lupin" },
    { phrase: "lupin seeds", allergen: "lupin", display: "self-part", part: "Lupin" },
    { phrase: "lupine", allergen: "lupin", display: "self" },
    { phrase: "lupin", allergen: "lupin", display: "self" },

    // --- Molluscs ---
    { phrase: "mussels", allergen: "molluscs", display: "ref", ref: "Mollusc" },
    { phrase: "mussel", allergen: "molluscs", display: "ref", ref: "Mollusc" },
    { phrase: "oysters", allergen: "molluscs", display: "ref", ref: "Mollusc" },
    { phrase: "oyster sauce", allergen: "molluscs", display: "ref", ref: "Mollusc" },
    { phrase: "oyster", allergen: "molluscs", display: "ref", ref: "Mollusc" },
    { phrase: "scallops", allergen: "molluscs", display: "ref", ref: "Mollusc" },
    { phrase: "scallop", allergen: "molluscs", display: "ref", ref: "Mollusc" },
    { phrase: "cockles", allergen: "molluscs", display: "ref", ref: "Mollusc" },
    { phrase: "cockle", allergen: "molluscs", display: "ref", ref: "Mollusc" },
    { phrase: "clams", allergen: "molluscs", display: "ref", ref: "Mollusc" },
    { phrase: "clam", allergen: "molluscs", display: "ref", ref: "Mollusc" },
    { phrase: "winkles", allergen: "molluscs", display: "ref", ref: "Mollusc" },
    { phrase: "winkle", allergen: "molluscs", display: "ref", ref: "Mollusc" },
    { phrase: "squid", allergen: "molluscs", display: "ref", ref: "Mollusc" },
    { phrase: "calamari", allergen: "molluscs", display: "ref", ref: "Mollusc" },
    { phrase: "octopus", allergen: "molluscs", display: "ref", ref: "Mollusc" },
    { phrase: "snails", allergen: "molluscs", display: "ref", ref: "Mollusc" },
    { phrase: "snail", allergen: "molluscs", display: "ref", ref: "Mollusc" },
    { phrase: "molluscs", allergen: "molluscs", display: "self" },
    { phrase: "mollusc", allergen: "molluscs", display: "self" },
    { phrase: "mollusks", allergen: "molluscs", display: "self" },
  ];

  /**
   * Compounds Label14 must never invent an allergen for.
   * If the user has already named an Annex II food inside the line,
   * those named foods are still detected.
   */
  const AMBIGUOUS = [
    { re: /\b(spice mix|spices mix|mixed spice|mixed spices|seasoning|seasonings|herbs and spices|herbs and spice)\b/, reason: "Blends such as spice mix or seasoning are never guessed. Open the supplier spec and list each ingredient, including any of the 14 allergens." },
    { re: /\b(curry powder|curry paste|garam masala|five spice|chinese five spice|ras el hanout|za['’]?atar)\b/, reason: "Spice blends can hide celery, mustard, sesame, nuts or gluten. List the named ingredients from the spec." },
    { re: /\b(stock cube|stock powder|bouillon|broth mix|gravy granules|gravy mix)\b/, reason: "Stock and gravy mixes often contain celery, wheat or milk. Do not guess — copy the spec." },
    { re: /\b(pesto)\b/, reason: "Pesto may contain cashew, pine nuts (not Annex II) and cheese (milk). Check the jar and name the nuts and dairy actually used." },
    { re: /\b(worcestershire|worcester sauce)\b/, reason: "Often contains anchovy (fish). Confirm from the label." },
    { re: /\b(dark chocolate|plain chocolate|chocolate chips|choc chips|chocolate)\b/, reason: "Cocoa is not one of the 14. Some chocolate contains milk or soya lecithin. Check the bar; add milk or soya if they are ingredients. Do not use this tool for factory ‘may contain’." },
    { re: /\b(margarine|baking spread|dairy-free spread|dairy free spread)\b/, reason: "Spreads vary: some contain milk, some do not. Check the pack." },
    { re: /\b(shortcrust pastry|puff pastry|filo pastry|pastry)\b/, reason: "Pastry is a compound (typically wheat, and often butter/milk). List its ingredients from the pack." },
    { re: /\b(baking powder)\b/, reason: "Some baking powders use wheat flour as a carrier. Check the tub." },
    { re: /\b(vanilla extract|vanilla essence|flavouring|flavourings|natural flavouring|natural flavourings)\b/, reason: "Flavourings are not guessed. Check whether an allergen carrier is declared on the spec." },
    { re: /\b(dried apricots?|dried apple|dried apples|dried fruit|sultanas?|raisins?)\b/, reason: "Dried fruit is often preserved with sulphur dioxide. Only declare sulphites if the finished food is above 10 mg/kg as SO₂ — confirm with the spec, do not guess." },
    { re: /\b(wine|sherry|beer)\b/, reason: "Wine and some beers may contain sulphites; beer may contain barley. Confirm from the spec." },
    { re: /\b(cake mix|bread mix|icing mix|frosting mix)\b/, reason: "Mixes are compounds. List every ingredient from the pack." },
    { re: /\b(nutella|chocolate spread)\b/, reason: "Spreads are compounds (often hazelnut and milk). List the named ingredients from the pot." },
    { re: /^(mixed )?nuts$/, reason: "‘Nuts’ is not enough — UK rules name the specific tree nut (almond, hazelnut, walnut, cashew, pecan, Brazil, pistachio, macadamia). Peanuts are separate." },
    { re: /\b(custard powder)\b/, reason: "Custard powder is often cornflour and flavouring, not milk. Fresh custard usually contains milk and egg. Check which you used." },
    { re: /\b(worcester)\b/, reason: "Check Worcestershire sauce for anchovy (fish)." },
  ];

  /**
   * Common single foods that are not themselves Annex II allergens.
   * Used only to avoid nagging on sugar, oil, fruit, etc.
   * Never used to clear a blend or a named allergen.
   */
  const NON_ALLERGEN = [
    "caster sugar", "granulated sugar", "icing sugar", "confectioners sugar",
    "soft light brown sugar", "soft brown sugar", "light brown sugar",
    "dark brown sugar", "brown sugar", "muscovado sugar", "demerara sugar",
    "coconut sugar", "sugar", "honey", "golden syrup", "maple syrup",
    "black treacle", "treacle", "molasses", "glucose", "glucose syrup",
    "sunflower oil", "rapeseed oil", "vegetable oil", "olive oil",
    "coconut oil", "neutral oil", "oil",
    "bicarbonate of soda", "baking soda", "bicarb", "cream of tartar",
    "sea salt", "table salt", "salt", "flaky salt",
    "cocoa powder", "cocoa", "cacao powder",
    "grated carrots", "carrot", "carrots",
    "lemon zest", "lemon juice", "lemon", "lime zest", "lime juice", "lime",
    "orange zest", "orange juice", "orange",
    "apple", "apples", "banana", "bananas", "berries", "blueberry",
    "blueberries", "raspberry", "raspberries", "strawberry", "strawberries",
    "cinnamon", "ground cinnamon", "ground ginger", "fresh ginger", "ginger",
    "vanilla pod", "vanilla bean", "vanilla seeds",
    "water", "sparkling water",
    "yeast", "dried yeast", "instant yeast", "fresh yeast",
    "poppy seeds", "poppy seed", "sunflower seeds", "pumpkin seeds",
    "chia seeds", "flax seeds", "linseed",
    "dates", "fig", "figs", "prune", "prunes",
    "coffee", "espresso", "tea",
    "vinegar", "white wine vinegar", "cider vinegar",
  ];

  const ANNEX_FOURTEEN = [
    { id: "celery", name: "Celery", detail: "Stick celery, celeriac (celery root), leaf, seed, oil, salt, spice and oleoresin." },
    { id: "gluten", name: "Cereals containing gluten", detail: "Wheat (including spelt, Khorasan / Kamut), rye, barley and oats, and products of those cereals. The cereal name is what must be emphasised, not the word ‘gluten’." },
    { id: "crustaceans", name: "Crustaceans", detail: "For example prawns, crabs, lobsters, crayfish, langoustines and shrimp paste." },
    { id: "eggs", name: "Eggs", detail: "Eggs from all birds (hen, duck, quail, goose and others) and products such as egg white or yolk." },
    { id: "fish", name: "Fish", detail: "All species, plus products such as anchovy and fish sauce, unless a specific Annex II exemption applies." },
    { id: "lupin", name: "Lupin", detail: "Lupin seed and lupin flour." },
    { id: "milk", name: "Milk", detail: "Milk from mammals (cow, sheep, goat, buffalo and others), including lactose, whey, casein, ghee, and familiar dairy foods such as butter, cream, yoghurt and cheese." },
    { id: "molluscs", name: "Molluscs", detail: "For example mussels, oysters, squid, clams, cockles, scallops, winkles and snails." },
    { id: "mustard", name: "Mustard", detail: "Seeds, flour, table mustard, oils and oleoresins; all mustard species." },
    { id: "peanuts", name: "Peanuts", detail: "Also called groundnuts or monkey nuts — the label must say peanuts. Includes peanut oil." },
    { id: "sesame", name: "Sesame", detail: "Seeds, powder and oil. Tahini and gingelly oil must reference sesame. Houmous typically contains tahini." },
    { id: "soybeans", name: "Soybeans (soya)", detail: "Soya / soy is enough. Tofu and edamame need a clear soya reference. Fully refined soya oil is exempt." },
    { id: "sulphites", name: "Sulphur dioxide and sulphites", detail: "Declare when present above 10 mg/kg or 10 mg/litre as total SO₂ in the food as consumed." },
    { id: "treenuts", name: "Tree nuts", detail: "Almond, hazelnut, walnut, cashew, pecan, Brazil nut, pistachio and macadamia (Queensland nut) only. Chestnut, pine nut and coconut are not on this list and must not be emphasised as Annex II nuts." },
  ];

  function normalize(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/[–—]/g, "-")
      .replace(/&/g, " and ")
      .replace(/flavour/g, "flavor") // internal only; we still display UK spelling
      .replace(/yogurt/g, "yoghurt")
      .replace(/houmous|humous|homous/g, "hummus")
      .replace(/[^a-z0-9%\s.+-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function escapeRe(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function titleCaseWord(word) {
    if (!word) return word;
    if (/^[A-Z0-9]+$/.test(word) && word.length <= 4) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  function prettyName(name) {
    const n = String(name || "").trim().replace(/\s+/g, " ");
    if (!n) return "";
    return n
      .split(" ")
      .map(function (w, i) {
        const lower = w.toLowerCase();
        if (i > 0 && ["and", "or", "of", "with", "in"].indexOf(lower) !== -1) return lower;
        if (/^e\d{3}[a-z]?$/i.test(w)) return w.toUpperCase();
        return titleCaseWord(lower);
      })
      .join(" ");
  }

  function findMatches(norm) {
    const hits = [];
    const used = [];

    function overlaps(start, end) {
      return used.some(function (span) {
        return start < span.end && end > span.start;
      });
    }

    const sorted = ALIASES.slice().sort(function (a, b) {
      return b.phrase.length - a.phrase.length;
    });

    sorted.forEach(function (alias) {
      const re = new RegExp("\\b" + escapeRe(alias.phrase) + "\\b", "g");
      let m;
      while ((m = re.exec(norm)) !== null) {
        if (overlaps(m.index, m.index + m[0].length)) continue;
        used.push({ start: m.index, end: m.index + m[0].length });
        hits.push({
          phrase: alias.phrase,
          allergen: alias.allergen,
          display: alias.display || null,
          ref: alias.ref || null,
          part: alias.part || null,
          note: alias.note || null,
          ambiguous: !!alias.ambiguous,
          reason: alias.reason || null,
          start: m.index,
          end: m.index + m[0].length,
        });
      }
    });

    return hits.sort(function (a, b) {
      return a.start - b.start;
    });
  }

  function findAmbiguous(norm, hits) {
    const flags = [];
    AMBIGUOUS.forEach(function (rule) {
      if (rule.re.test(norm)) {
        flags.push({ reason: rule.reason });
      }
    });
    hits.forEach(function (h) {
      if (h.ambiguous && h.reason) {
        flags.push({ reason: h.reason });
      }
      if (h.note) {
        flags.push({ reason: h.note, soft: true });
      }
    });
    // de-dupe reasons
    const seen = {};
    return flags.filter(function (f) {
      if (seen[f.reason]) return false;
      seen[f.reason] = true;
      return true;
    });
  }

  function emphasiseHtml(pretty, hits) {
    // Rebuild display from original pretty name using hit positions on the normalised string.
    // Simpler and more reliable: apply known display rules to the pretty name.
    const norm = normalize(pretty);
    const active = hits.filter(function (h) {
      return h.allergen && !h.ambiguous;
    });
    if (!active.length) {
      return escapeHtml(prettyName(pretty));
    }

    // Prefer a single primary hit — the longest allergen phrase
    const primary = active.slice().sort(function (a, b) {
      return b.phrase.length - a.phrase.length;
    })[0];

    const displayPretty = prettyName(pretty);
    const d = primary.display;
    const bold = function (text) {
      return "<strong>" + escapeHtml(text) + "</strong>";
    };

    if (d === "self") {
      const re = new RegExp("\\b(" + escapeRe(primary.phrase) + ")\\b", "i");
      if (re.test(displayPretty)) {
        return escapeHtml(displayPretty).replace(new RegExp("\\b(" + escapeRe(prettyName(primary.phrase)) + ")\\b", "i"), function (m) {
          return "<strong>" + m + "</strong>";
        });
      }
      return bold(displayPretty);
    }

    if (d === "self-part" && primary.part) {
      const partRe = new RegExp("(" + escapeRe(primary.part) + ")", "i");
      if (partRe.test(displayPretty)) {
        return escapeHtml(displayPretty).replace(partRe, function (m) {
          return "<strong>" + m + "</strong>";
        });
      }
      return escapeHtml(displayPretty) + " (" + bold(primary.part) + ")";
    }

    if (d === "ref" && primary.ref) {
      // Avoid doubling if the name already includes the allergen word
      const already = new RegExp("\\b" + escapeRe(primary.ref) + "\\b", "i");
      if (already.test(displayPretty)) {
        return escapeHtml(displayPretty).replace(new RegExp("(" + escapeRe(primary.ref) + ")", "i"), function (m) {
          return "<strong>" + m + "</strong>";
        });
      }
      return escapeHtml(displayPretty) + " (" + bold(primary.ref) + ")";
    }

    return escapeHtml(displayPretty);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function analyseIngredient(name) {
    const raw = String(name || "").trim();
    const norm = normalize(raw);
    if (!norm) {
      return {
        name: raw,
        hits: [],
        allergens: [],
        flags: [],
        known: false,
        html: "",
      };
    }

    const hits = findMatches(norm);
    const allergenHits = hits.filter(function (h) {
      return h.allergen && !h.ambiguous;
    });
    const flags = findAmbiguous(norm, hits);
    const known = allergenHits.length > 0;
    const blockedSafe = hits.some(function (h) { return h.allergen === null && !h.ambiguous; });
    const safe = !known && (blockedSafe || isNonAllergen(norm));
    const unknown = !known && !safe && flags.length === 0;

    if (unknown) {
      flags.push({
        reason: "Not recognised as one of the 14 major allergens. Confirm against the supplier specification — if it hides an allergen (or is a blend), name the parts.",
        unknown: true,
      });
    }

    const allergens = [];
    const seen = {};
    allergenHits.forEach(function (h) {
      if (seen[h.allergen]) return;
      seen[h.allergen] = true;
      const meta = ALLERGENS[h.allergen];
      allergens.push({
        id: h.allergen,
        label: meta ? meta.label : h.allergen,
        annex: meta ? meta.annex : "",
        group: meta ? meta.group : "",
      });
    });

    return {
      name: raw,
      hits: allergenHits,
      allergens: allergens,
      flags: flags,
      known: known,
      safe: safe,
      unknown: unknown,
      html: emphasiseHtml(raw, allergenHits),
    };
  }

  function isNonAllergen(norm) {
    var stripped = norm.replace(/^(fresh|organic|dried|ground|grated|chopped|sliced|whole|large|medium|small)\s+/g, "").trim();
    return NON_ALLERGEN.indexOf(norm) !== -1 || NON_ALLERGEN.indexOf(stripped) !== -1;
  }

  function referenceList() {
    return ANNEX_FOURTEEN.slice();
  }

  global.Label14Allergens = {
    ALLERGENS: ALLERGENS,
    analyseIngredient: analyseIngredient,
    referenceList: referenceList,
    normalize: normalize,
    prettyName: prettyName,
    escapeHtml: escapeHtml,
  };
})(typeof window !== "undefined" ? window : globalThis);
