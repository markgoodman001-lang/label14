# Label14


Week-1 prototype: a formatter for Natasha's Law / PPDS-style ingredients labels for food packed on site (stalls, sandwiches, meal-prep, cakes, deli pots — bakers included).
Paste a recipe, emphasise the 14 major UK allergens, print an A6 or Avery L7160-style label.

This is not a laboratory, not legal advice, and not an EHO sign-off.
It does not claim to be compliant, certified, or approved.

## How to open it

What v1 does:
- Product name, business name, ingredients with grams, optional may contain, pack date, use-by or best-before, optional batch
- Paste a recipe or type rows; sorts heaviest first
- Emphasises recognised UK major allergens in bold
- Does not guess blends such as spice mix or seasoning
- Print stays locked until allergens are confirmed
- A6 cake-box and Avery L7160-style 63.5 x 38.1 mm sheet
- Up to 3 recipes in localStorage only
- Disclaimer on screen and on the printed label

What v1 does not do:
- No backend, accounts, analytics, or tracking
- No checkout and no fake payments
- No barcode, nutrition, or QUID percentages
- No claim of legal compliance or EHO approval
- No lab test and no sulphite ppm calculation
- No invented ingredients inside a blend
- Chestnut, pine nut and coconut are not emphasised as Annex II tree nuts
- Avery layout is a practical CSS approximation; test on plain paper first

Official sources:
- FSA food allergen labelling technical guidance
- FSA allergen labelling for food manufacturers
- GOV.UK allergen guidance for food businesses
- FSA introduction to allergen labelling for PPDS food
- Assimilated Regulation (EU) No. 1169/2011 Annex II

Then open the local site in a browser, or open index.html as a file.
Print: margins None, scale 100 percent, Save as PDF if you want a file.

From this folder: python3 -m http.server 8140
Then open http://127.0.0.1:8140/

Source links:
- https://www.gov.uk/government/publications/food-allergen-labelling-and-information-requirements-technical-guidance/food-allergen-labelling-and-information-requirements-technical-guidance
- https://www.gov.uk/government/publications/allergen-labelling-for-food-manufacturers/allergen-labelling-for-food-manufacturers
- https://www.gov.uk/government/publications/allergen-guidance-for-food-businesses/allergen-guidance-for-food-businesses
- https://www.food.gov.uk/business-guidance/introduction-to-allergen-labelling-changes-ppds

## Copy for listing

Use **Copy ingredients for listing** under the label preview to copy a plain-text ingredients line with major allergens in CAPITALS — handy for UK distance-sale listings. You still confirm supplier specifications; Label14 is a formatter, not legal advice.
