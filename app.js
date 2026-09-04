/* Label14 v1 — browser-only PPDS label formatter */
(function () {
  "use strict";

  var STORAGE_KEY = "label14.recipes.v1";
  var FREE_LIMIT = 3;
  var A = window.Label14Allergens;

  var state = {
    ingredients: [],
    layout: "a6",
    confirmed: {},
    acknowledged: {},
    averyStart: 1,
  };

  var els = {};

  function $(id) {
    return document.getElementById(id);
  }

  function uid() {
    return "r" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function todayISO() {
    var d = new Date();
    var tz = d.getTimezoneOffset() * 60000;
    return new Date(d - tz).toISOString().slice(0, 10);
  }

  function formatUKDate(iso) {
    if (!iso) return "";
    var p = iso.split("-");
    if (p.length !== 3) return iso;
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var m = months[parseInt(p[1], 10) - 1] || p[1];
    return parseInt(p[2], 10) + " " + m + " " + p[0];
  }

  function parseNumber(v) {
    var n = parseFloat(String(v).replace(",", "."));
    return isFinite(n) ? n : 0;
  }

  function toGrams(qty, unit, name) {
    var q = parseNumber(qty);
    if (!q) return 0;
    unit = (unit || "g").toLowerCase();
    if (unit === "kg") return q * 1000;
    if (unit === "l" || unit === "ltr" || unit === "litre" || unit === "litres") return q * 1000;
    if (unit === "ml") return q;
    if (unit === "tsp" || unit === "teaspoon" || unit === "teaspoons") return q * 5;
    if (unit === "tbsp" || unit === "tablespoon" || unit === "tablespoons") return q * 15;
    if (unit === "each" || unit === "x" || unit === "") {
      if (/\beggs?\b/i.test(name)) return q * 56;
      return 0;
    }
    return q;
  }

  function parseRecipeText(text) {
    var raw = String(text || "").replace(/\r/g, "").trim();
    if (!raw) return [];
    var lines = raw.split("\n").map(function (l) { return l.trim(); }).filter(Boolean);

    if (lines.length === 1 && (raw.match(/\d+(?:\.\d+)?\s*(?:kg|g|ml)\b/gi) || []).length >= 2) {
      lines = raw.split(/[,;]+/).map(function (l) { return l.trim(); }).filter(Boolean);
    }

    var skip = /^(ingredients|method|directions|steps|you will need|for the (cake|sponge|icing|frosting|buttercream)|icing|frosting|buttercream)\s*:?\s*$/i;
    var out = [];

    lines.forEach(function (line) {
      if (skip.test(line)) return;
      line = line.replace(/^[-•*]\s*/, "").replace(/\s+/g, " ").trim();
      if (!line) return;

      var qty = "";
      var unit = "g";
      var name = line;

      var m = line.match(/^(\d+(?:\.\d+)?)\s*(kg|g|ml|l|ltr|litres?|tbsp|tsp|tablespoons?|teaspoons?)(?:\s+of)?\s+(.+)$/i);
      if (m) {
        qty = m[1];
        unit = m[2];
        name = m[3];
      } else {
        m = line.match(/^(.+?)\s+[–—-]?\s*(\d+(?:\.\d+)?)\s*(kg|g|ml|l|ltr|litres?|tbsp|tsp)?\s*$/i);
        if (m) {
          name = m[1];
          qty = m[2];
          unit = m[3] || "g";
        } else {
          m = line.match(/^(\d+(?:\.\d+)?)\s+(large |medium |small )?(eggs?)\b(.*)$/i);
          if (m) {
            qty = m[1];
            unit = "each";
            name = (m[2] || "") + m[3] + (m[4] || "");
          } else {
            m = line.match(/^(\d+(?:\.\d+)?)\s+(.+)$/);
            if (m && !/^\d/.test(m[2]) && m[2].length > 1) {
              qty = m[1];
              unit = "each";
              name = m[2];
            }
          }
        }
      }

      name = name.replace(/^(of|fresh|organic)\s+/i, "").replace(/[,.]$/, "").trim();
      if (!name) return;

      out.push({
        id: uid(),
        name: A.prettyName(name),
        grams: Math.round(toGrams(qty, unit, name) * 10) / 10 || parseNumber(qty),
      });
    });

    return out;
  }

  function loadStore() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { recipes: [] };
      var data = JSON.parse(raw);
      if (!data || !Array.isArray(data.recipes)) return { recipes: [] };
      return data;
    } catch (e) {
      return { recipes: [] };
    }
  }

  function saveStore(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function snapshot() {
    return {
      id: state.editingId || uid(),
      productName: els.productName.value.trim(),
      businessName: els.businessName.value.trim(),
      ingredients: state.ingredients.map(function (ing) {
        return { name: ing.name, grams: ing.grams };
      }),
      mayContain: els.mayContain.value.trim(),
      packDate: els.packDate.value,
      lifeType: els.lifeType.value,
      lifeDate: els.lifeDate.value,
      batch: els.batch.value.trim(),
      savedAt: new Date().toISOString(),
    };
  }

  function applySnapshot(rec) {
    state.editingId = rec.id;
    els.productName.value = rec.productName || "";
    els.businessName.value = rec.businessName || "";
    els.mayContain.value = rec.mayContain || "";
    els.packDate.value = rec.packDate || "";
    els.lifeType.value = rec.lifeType || "use-by";
    els.lifeDate.value = rec.lifeDate || "";
    els.batch.value = rec.batch || "";
    state.ingredients = (rec.ingredients || []).map(function (ing) {
      return { id: uid(), name: ing.name, grams: ing.grams };
    });
    if (!state.ingredients.length) state.ingredients = [blankIng()];
    state.confirmed = {};
    state.acknowledged = {};
    syncLifeLabel();
    renderIngredients();
    renderAll();
  }

  function blankIng() {
    return { id: uid(), name: "", grams: "" };
  }

  function collectFromRows() {
    var rows = els.ingTable.querySelectorAll(".ing-row");
    var next = [];
    rows.forEach(function (row) {
      next.push({
        id: row.getAttribute("data-id"),
        name: row.querySelector(".ing-name").value,
        grams: row.querySelector(".ing-grams").value,
      });
    });
    state.ingredients = next;
  }

  function analysed() {
    return state.ingredients
      .map(function (ing) {
        var grams = parseNumber(ing.grams);
        var a = A.analyseIngredient(ing.name);
        return {
          id: ing.id,
          name: ing.name,
          grams: grams,
          analysis: a,
        };
      })
      .filter(function (ing) {
        return String(ing.name || "").trim() !== "";
      });
  }

  function sortedIngredients() {
    return analysed().slice().sort(function (a, b) {
      if (b.grams !== a.grams) return b.grams - a.grams;
      return a.name.localeCompare(b.name, "en-GB");
    });
  }

  function uniqueAllergens(list) {
    var seen = {};
    var out = [];
    list.forEach(function (ing) {
      ing.analysis.allergens.forEach(function (al) {
        if (seen[al.id]) return;
        seen[al.id] = true;
        out.push(al);
      });
    });
    return out;
  }

  function uniqueFlags(list) {
    var compounds = [];
    var unknowns = [];
    var softs = [];
    list.forEach(function (ing) {
      ing.analysis.flags.forEach(function (flag, i) {
        var item = {
          key: ing.id + ":" + i,
          ingredient: ing.name,
          reason: flag.reason,
          unknown: !!flag.unknown,
          soft: !!flag.soft,
        };
        if (item.soft) softs.push(item);
        else if (item.unknown) unknowns.push(item);
        else compounds.push(item);
      });
    });
    return { compounds: compounds, unknowns: unknowns, softs: softs };
  }

  function labelModel() {
    var items = sortedIngredients();
    var allergens = uniqueAllergens(items);
    var confirmedAllergens = allergens.filter(function (al) {
      return !!state.confirmed[al.id];
    });

    var lines = items.map(function (ing) {
      var useEmphasis = ing.analysis.allergens.every(function (al) {
        return state.confirmed[al.id];
      }) && ing.analysis.allergens.length > 0;
      var html;
      if (useEmphasis) {
        html = ing.analysis.html;
      } else {
        html = A.escapeHtml(A.prettyName(ing.name));
      }
      return html;
    });

    return {
      product: els.productName.value.trim() || "Untitled product",
      business: els.businessName.value.trim(),
      ingredientsHtml: lines.join(", "),
      hasIngredients: items.length > 0,
      mayContain: els.mayContain.value.trim(),
      packDate: els.packDate.value,
      lifeType: els.lifeType.value,
      lifeDate: els.lifeDate.value,
      batch: els.batch.value.trim(),
      allergens: allergens,
      confirmedAllergens: confirmedAllergens,
      flagGroups: uniqueFlags(items),
      items: items,
    };
  }


  function htmlEmphasisToListingPlain(html) {
    return String(html || "")
      .replace(/<strong>(.*?)<\/strong>/gi, function (_, inner) {
        return String(inner).toUpperCase();
      })
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  }

  /** Plain ingredients line for distance-sale listings (allergens in CAPITALS). Uses detected allergens, not print-confirm state. */
  function listingIngredientsText() {
    var items = sortedIngredients();
    if (!items.length) return "";
    var lines = items.map(function (ing) {
      var html;
      if (ing.analysis && ing.analysis.allergens && ing.analysis.allergens.length) {
        html = ing.analysis.html;
      } else {
        html = A.escapeHtml(A.prettyName(ing.name));
      }
      return htmlEmphasisToListingPlain(html);
    });
    return "Ingredients: " + lines.join(", ") + ".";
  }

  function setListingCopyStatus(msg) {
    if (!els.listingCopyStatus) return;
    els.listingCopyStatus.textContent = msg || "";
  }

  function copyListingIngredients() {
    var text = listingIngredientsText();
    if (!text) {
      setListingCopyStatus("Add ingredients first.");
      return;
    }
    var btn = els.copyListingBtn;
    var done = function () {
      if (btn) {
        btn.textContent = "Copied";
        setTimeout(function () {
          btn.textContent = "Copy ingredients for listing";
        }, 2000);
      }
      setListingCopyStatus("Copied — paste into your listing.");
    };
    var fail = function () {
      setListingCopyStatus("Could not copy automatically. Select and copy from the label text.");
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () {
        // fallback
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        try {
          if (document.execCommand("copy")) done();
          else fail();
        } catch (e) {
          fail();
        }
        document.body.removeChild(ta);
      });
    } else {
      var ta2 = document.createElement("textarea");
      ta2.value = text;
      ta2.setAttribute("readonly", "");
      ta2.style.position = "fixed";
      ta2.style.left = "-9999px";
      document.body.appendChild(ta2);
      ta2.select();
      try {
        if (document.execCommand("copy")) done();
        else fail();
      } catch (e2) {
        fail();
      }
      document.body.removeChild(ta2);
    }
  }

  function labelInnerHtml(model, compact) {
    var parts = [];
    parts.push('<p class="label-kicker">Ingredients label</p>');
    parts.push('<p class="label-title">' + A.escapeHtml(model.product) + "</p>");
    if (model.business) {
      parts.push('<p class="label-biz">' + A.escapeHtml(model.business) + "</p>");
    }
    if (model.hasIngredients) {
      parts.push('<p class="label-ings"><span>Ingredients: </span>' + model.ingredientsHtml + "</p>");
      if (model.confirmedAllergens.length) {
        parts.push('<p class="label-advice">For allergens, see ingredients in bold.</p>');
      }
    } else {
      parts.push('<p class="label-ings">Add ingredients to build this label.</p>');
    }
    if (model.mayContain) {
      parts.push('<p class="label-pal">' + A.escapeHtml(model.mayContain) + "</p>");
    }
    var meta = [];
    if (model.packDate) meta.push("Packed: " + formatUKDate(model.packDate));
    if (model.lifeDate) {
      meta.push((model.lifeType === "best-before" ? "Best before: " : "Use by: ") + formatUKDate(model.lifeDate));
    }
    if (model.batch) meta.push("Batch: " + model.batch);
    if (meta.length) {
      parts.push('<p class="label-meta">' + A.escapeHtml(meta.join(" · ")) + "</p>");
    }
    var disc = compact
      ? "Producer confirms ingredients against supplier specs. Does not cover cross-contamination. Label14 is a formatter, not legal advice."
      : "The producer confirms these ingredients against supplier specifications. This label does not cover cross-contamination. Label14 is a formatter, not a laboratory and not legal advice.";
    parts.push('<p class="label-disclaimer">' + disc + "</p>");
    return parts.join("");
  }

  function canPrint(model) {
    if (!els.productName.value.trim()) return false;
    if (!model.hasIngredients) return false;
    var allAllergens = model.allergens.every(function (al) {
      return state.confirmed[al.id];
    });
    var g = model.flagGroups;
    var compoundsOk = g.compounds.every(function (f) {
      return state.acknowledged[f.key];
    });
    var unknownsOk = g.unknowns.length === 0 || state.acknowledged.unknowns;
    return allAllergens && compoundsOk && unknownsOk;
  }

  function renderIngredients() {
    if (!state.ingredients.length) state.ingredients = [blankIng()];
    els.ingTable.innerHTML = state.ingredients.map(function (ing) {
      var flagged = "";
      if (String(ing.name || "").trim()) {
        var a = A.analyseIngredient(ing.name);
        if (a.flags.length && !a.known) flagged = '<span class="flag-dot" title="Needs a check"></span>';
      }
      return (
        '<div class="ing-row" data-id="' + ing.id + '">' +
          '<span style="display:flex;align-items:center;gap:6px">' + flagged +
            '<input class="ing-name" type="text" maxlength="80" placeholder="Ingredient" value="' + A.escapeHtml(ing.name) + '">' +
          "</span>" +
          '<label class="grams"><input class="ing-grams" type="number" min="0" step="0.1" inputmode="decimal" placeholder="0" value="' + A.escapeHtml(ing.grams) + '"><span>g</span></label>' +
          '<button type="button" class="btn btn-ghost btn-tiny ing-remove" aria-label="Remove ingredient">×</button>' +
        "</div>"
      );
    }).join("");
  }

  function renderConfirm(model) {
    var html = "";
    if (!model.allergens.length && !model.flagGroups.compounds.length && !model.flagGroups.unknowns.length && model.hasIngredients) {
      html += '<label class="confirm-item ok-empty"><input type="checkbox" disabled checked> No names from the 14 major allergens were recognised. Still check every line against the spec — this tool does not test food.</label>';
    }
    model.allergens.forEach(function (al) {
      html +=
        '<label class="confirm-item">' +
          '<input type="checkbox" data-confirm="' + al.id + '"' + (state.confirmed[al.id] ? " checked" : "") + ">" +
          "<span>I confirm <b>" + A.escapeHtml(al.label) + "</b> is in this recipe, checked against the supplier specification. " +
          "<i>(" + A.escapeHtml(al.annex) + ")</i></span>" +
        "</label>";
    });
    model.flagGroups.softs.forEach(function (f) {
      html +=
        '<p class="confirm-intro" style="margin:8px 0 0"><b>' + A.escapeHtml(A.prettyName(f.ingredient)) + ":</b> " +
        A.escapeHtml(f.reason) + "</p>";
    });
    model.flagGroups.compounds.forEach(function (f) {
      html +=
        '<label class="confirm-item flag">' +
          '<input type="checkbox" data-ack="' + f.key + '"' + (state.acknowledged[f.key] ? " checked" : "") + ">" +
          "<span><b>" + A.escapeHtml(A.prettyName(f.ingredient)) + "</b> — " + A.escapeHtml(f.reason) +
          " I have checked this line against the spec.</span>" +
        "</label>";
    });
    if (model.flagGroups.unknowns.length) {
      var names = model.flagGroups.unknowns.map(function (f) {
        return A.escapeHtml(A.prettyName(f.ingredient));
      }).join(", ");
      html +=
        '<label class="confirm-item flag">' +
          '<input type="checkbox" data-ack="unknowns"' + (state.acknowledged.unknowns ? " checked" : "") + ">" +
          "<span>These lines were not recognised as one of the 14 major allergens: <b>" + names +
          "</b>. I have checked them against the supplier specification. If any hide an allergen or are a blend, I will name the parts instead of printing.</span>" +
        "</label>";
    }
    els.confirmList.innerHTML = html || '<p class="confirm-intro">Add ingredients to see detected allergens.</p>';
  }

  function renderSaved() {
    var store = loadStore();
    var n = store.recipes.length;
    var chips = store.recipes.map(function (r) {
      return (
        '<span class="chip">' +
          '<button type="button" class="load-rec" data-id="' + r.id + '">' + A.escapeHtml(r.productName || "Untitled") + "</button>" +
          '<button type="button" class="x del-rec" data-id="' + r.id + '" aria-label="Delete saved recipe">×</button>' +
        "</span>"
      );
    }).join("");
    var saveBtn = n >= FREE_LIMIT
      ? '<button type="button" class="btn btn-quiet btn-tiny" id="save-recipe">Replace a saved recipe…</button>'
      : '<button type="button" class="btn btn-quiet btn-tiny" id="save-recipe">Save in this browser</button>';
    els.savedSlot.innerHTML =
      '<div class="saved-box">' +
        "<p>Saved recipes " + n + "/" + FREE_LIMIT + "</p>" +
        '<div class="saved-list">' + chips + "</div>" +
        saveBtn +
        '<p class="paid-note">Free v1 keeps 3 recipes in this browser. A paid unlock is planned — there is no checkout here.</p>' +
      "</div>";
  }

  function renderPreview(model) {
    els.labelCard.setAttribute("data-layout", state.layout);
    els.labelFace.innerHTML = labelInnerHtml(model, state.layout === "avery");
    els.averyOptions.hidden = state.layout !== "avery";
    requestAnimationFrame(function () {
      var face = els.labelFace;
      var overflow = face.scrollHeight > face.clientHeight + 2;
      els.overflowNote.hidden = !overflow;
    });
  }

  function renderPrint(model) {
    var inner = labelInnerHtml(model, false);
    var compact = labelInnerHtml(model, true);
    els.printA6.innerHTML = inner;
    var start = Math.max(1, Math.min(21, parseInt(state.averyStart, 10) || 1));
    var cells = [];
    for (var i = 1; i <= 21; i++) {
      if (i < start) {
        cells.push('<div class="avery-cell is-empty"></div>');
      } else {
        cells.push('<div class="avery-cell">' + compact + "</div>");
      }
    }
    els.printAvery.innerHTML = cells.join("");
  }

  function renderAll() {
    var model = labelModel();
    renderPreview(model);
    renderConfirm(model);
    renderPrint(model);
    var ok = canPrint(model);
    els.printBtn.disabled = !ok;
    if (els.copyListingBtn) {
      els.copyListingBtn.disabled = !labelModel().hasIngredients;
    }
    els.printLock.hidden = ok;
    document.getElementById("layout-a6").classList.toggle("is-on", state.layout === "a6");
    document.getElementById("layout-avery").classList.toggle("is-on", state.layout === "avery");
  }

  function persistDraft() {
    try {
      sessionStorage.setItem("label14.draft.v1", JSON.stringify(snapshot()));
    } catch (e) {}
  }

  function restoreDraft() {
    try {
      var raw = sessionStorage.getItem("label14.draft.v1");
      if (!raw) return false;
      applySnapshot(JSON.parse(raw));
      return true;
    } catch (e) {
      return false;
    }
  }

  function saveRecipe() {
    collectFromRows();
    var rec = snapshot();
    if (!rec.productName) {
      els.productName.focus();
      return;
    }
    var store = loadStore();
    var idx = store.recipes.findIndex(function (r) { return r.id === rec.id; });
    if (idx >= 0) {
      store.recipes[idx] = rec;
    } else if (store.recipes.length < FREE_LIMIT) {
      store.recipes.push(rec);
      state.editingId = rec.id;
    } else {
      var names = store.recipes.map(function (r, i) {
        return i + 1 + ". " + (r.productName || "Untitled");
      }).join("\n");
      var pick = window.prompt("Free v1 saves 3 recipes. Enter 1, 2 or 3 to replace:\n" + names, "1");
      var n = parseInt(pick, 10);
      if (!n || n < 1 || n > store.recipes.length) return;
      rec.id = uid();
      store.recipes[n - 1] = rec;
      state.editingId = rec.id;
    }
    saveStore(store);
    renderSaved();
  }

  function syncLifeLabel() {
    els.lifeLabel.textContent = els.lifeType.value === "best-before" ? "Best before" : "Use by";
  }

  function loadSample() {
    applySnapshot({
      id: state.editingId || uid(),
      productName: "Carrot cake",
      businessName: "Market stall baker",
      ingredients: [
        { name: "Grated carrots", grams: 300 },
        { name: "Soft light brown sugar", grams: 200 },
        { name: "Sunflower oil", grams: 180 },
        { name: "Self-raising flour", grams: 200 },
        { name: "Eggs", grams: 168 },
        { name: "Walnuts", grams: 80 },
        { name: "Cream cheese", grams: 150 },
        { name: "Unsalted butter", grams: 80 },
        { name: "Icing sugar", grams: 200 },
        { name: "Mixed spice", grams: 8 },
        { name: "Bicarbonate of soda", grams: 5 },
      ],
      mayContain: "",
      packDate: todayISO(),
      lifeType: "best-before",
      lifeDate: "",
      batch: "",
    });
    els.pasteBox.value = [
      "300g grated carrots",
      "200g soft light brown sugar",
      "180g sunflower oil",
      "200g self-raising flour",
      "3 large eggs",
      "80g walnuts",
      "150g cream cheese",
      "80g unsalted butter",
      "200g icing sugar",
      "8g mixed spice",
      "5g bicarbonate of soda",
    ].join("\n");
  }

  function bind() {
    els.productName = $("product-name");
    els.businessName = $("business-name");
    els.pasteBox = $("paste-box");
    els.ingTable = $("ing-table");
    els.mayContain = $("may-contain");
    els.packDate = $("pack-date");
    els.lifeType = $("life-type");
    els.lifeDate = $("life-date");
    els.lifeLabel = $("life-label");
    els.batch = $("batch");
    els.labelCard = $("label-card");
    els.labelFace = $("label-face");
    els.overflowNote = $("overflow-note");
    els.averyOptions = $("avery-options");
    els.confirmList = $("confirm-list");
    els.printBtn = $("print-btn");
    els.copyListingBtn = $("copy-listing-btn");
    els.listingCopyStatus = $("listing-copy-status");
    els.printLock = $("print-lock");
    els.savedSlot = $("saved-slot");
    els.printA6 = $("print-a6");
    els.printAvery = $("print-avery");

    $("parse-paste").addEventListener("click", function () {
      var parsed = parseRecipeText(els.pasteBox.value);
      if (!parsed.length) {
        els.pasteBox.focus();
        return;
      }
      var existing = state.ingredients.filter(function (ing) {
        return String(ing.name || "").trim() !== "";
      });
      state.ingredients = existing.concat(parsed);
      state.confirmed = {};
      state.acknowledged = {};
      renderIngredients();
      renderAll();
    });

    $("load-sample").addEventListener("click", loadSample);

    if (els.copyListingBtn) {
      els.copyListingBtn.addEventListener("click", copyListingIngredients);
    }
    $("add-ing").addEventListener("click", function () {
      collectFromRows();
      state.ingredients.push(blankIng());
      renderIngredients();
      var names = els.ingTable.querySelectorAll(".ing-name");
      if (names.length) names[names.length - 1].focus();
    });

    els.ingTable.addEventListener("input", function () {
      collectFromRows();
      renderAll();
      persistDraft();
    });

    els.ingTable.addEventListener("click", function (e) {
      var btn = e.target.closest(".ing-remove");
      if (!btn) return;
      collectFromRows();
      var row = btn.closest(".ing-row");
      var id = row.getAttribute("data-id");
      state.ingredients = state.ingredients.filter(function (ing) { return ing.id !== id; });
      if (!state.ingredients.length) state.ingredients = [blankIng()];
      renderIngredients();
      renderAll();
    });

    ["product-name", "business-name", "may-contain", "pack-date", "life-date", "batch"].forEach(function (id) {
      $(id).addEventListener("input", function () {
        renderAll();
        persistDraft();
      });
    });

    els.lifeType.addEventListener("change", function () {
      syncLifeLabel();
      renderAll();
    });

    $("layout-a6").addEventListener("click", function () {
      state.layout = "a6";
      document.body.setAttribute("data-print", "a6");
      renderAll();
    });
    $("layout-avery").addEventListener("click", function () {
      state.layout = "avery";
      document.body.setAttribute("data-print", "avery");
      renderAll();
    });

    $("avery-start").addEventListener("input", function (e) {
      state.averyStart = e.target.value;
      renderAll();
    });

    els.confirmList.addEventListener("change", function (e) {
      var t = e.target;
      if (t.getAttribute("data-confirm")) {
        state.confirmed[t.getAttribute("data-confirm")] = t.checked;
      }
      if (t.getAttribute("data-ack")) {
        state.acknowledged[t.getAttribute("data-ack")] = t.checked;
      }
      renderAll();
    });

    els.printBtn.addEventListener("click", function () {
      var model = labelModel();
      if (!canPrint(model)) return;
      document.body.setAttribute("data-print", state.layout);
      window.print();
    });

    els.savedSlot.addEventListener("click", function (e) {
      if (e.target.id === "save-recipe") {
        collectFromRows();
        saveRecipe();
        return;
      }
      var load = e.target.closest(".load-rec");
      if (load) {
        var store = loadStore();
        var rec = store.recipes.filter(function (r) { return r.id === load.getAttribute("data-id"); })[0];
        if (rec) applySnapshot(rec);
        return;
      }
      var del = e.target.closest(".del-rec");
      if (del) {
        var data = loadStore();
        data.recipes = data.recipes.filter(function (r) { return r.id !== del.getAttribute("data-id"); });
        saveStore(data);
        if (state.editingId === del.getAttribute("data-id")) state.editingId = null;
        renderSaved();
      }
    });
  }

  function renderReference() {
    var ul = $("allergen-ref");
    ul.innerHTML = A.referenceList().map(function (item) {
      return "<li><strong>" + A.escapeHtml(item.name) + "</strong><span>" + A.escapeHtml(item.detail) + "</span></li>";
    }).join("");
  }

  function clearForDemo() {
    try { sessionStorage.removeItem("label14.draft.v1"); } catch (e) {}
    state.editingId = null;
    state.confirmed = {};
    state.acknowledged = {};
    state.ingredients = [blankIng(), blankIng(), blankIng()];
    els.productName.value = "";
    els.businessName.value = "";
    els.pasteBox.value = "";
    els.mayContain.value = "";
    els.packDate.value = todayISO();
    els.lifeType.value = "best-before";
    els.lifeDate.value = "";
    els.batch.value = "";
    syncLifeLabel();
    renderIngredients();
    renderSaved();
    renderAll();
    var recipe = $("composer") || $("product-name");
    if (recipe && recipe.scrollIntoView) recipe.scrollIntoView({ block: "center", behavior: "instant" });
  }

  function confirmAllForDemo() {
    var model = labelModel();
    (model.allergens || []).forEach(function (al) {
      state.confirmed[al.id] = true;
    });
    var g = model.flagGroups || { compounds: [], unknowns: [], softs: [] };
    (g.compounds || []).forEach(function (f) {
      state.acknowledged[f.key] = true;
    });
    if ((g.unknowns || []).length) state.acknowledged.unknowns = true;
    renderAll();
    els.confirmList.querySelectorAll("input[data-confirm]").forEach(function (el) {
      el.checked = true;
      state.confirmed[el.getAttribute("data-confirm")] = true;
    });
    els.confirmList.querySelectorAll("input[data-ack]").forEach(function (el) {
      el.checked = true;
      state.acknowledged[el.getAttribute("data-ack")] = true;
    });
    renderAll();
    var preview = $("composer") || $("label-card");
    if (preview && preview.scrollIntoView) preview.scrollIntoView({ block: "center", behavior: "instant" });
  }

  function runListingDemo() {
    clearForDemo();
    setTimeout(function () {
      loadSample();
      var preview = $("composer") || $("label-card");
      if (preview && preview.scrollIntoView) preview.scrollIntoView({ block: "center", behavior: "instant" });
    }, 1800);
    setTimeout(function () {
      confirmAllForDemo();
    }, 3800);
  }

  var VIDEO1_RECIPE = [
    "200g unsalted butter",
    "200g caster sugar",
    "3 large eggs",
    "200g self-raising flour",
    "1 lemon, zest and juice"
  ].join("\n");

  function applyVideo1Names() {
    els.productName.value = "Lemon drizzle loaf";
    els.businessName.value = "Northgate Bakery";
    els.lifeType.value = "use-by";
    els.mayContain.value = "";
    els.batch.value = "";
    syncLifeLabel();
  }

  function scrollComposer() {
    var recipe = $("composer") || $("product-name");
    if (recipe && recipe.scrollIntoView) recipe.scrollIntoView({ block: "start", behavior: "instant" });
  }

  function parsePasteClick() {
    var btn = $("parse-paste");
    if (btn) btn.click();
  }

  /** Local-only capture helper: ?demo=video1[&step=ready|paste|done|confirmed][&hl=1|confirms]
   *  step=ready      names filled, empty paste, empty ingredients
   *  step=paste      names + recipe in paste box (not yet added)
   *  step=done       after Add pasted lines (ingredients on label; confirms unchecked)
   *  step=confirmed  done + all allergen confirms / acks checked
   *  hl=1            soft amber rings on Add pasted lines + Label preview
   *  hl=confirms     soft amber rings on allergen / unknown confirm boxes (beat 6)
   *  no step         timed auto: clear → names → paste → Add pasted lines
   */
  function applyVideo1CaptureChrome() {
    document.documentElement.classList.add("video1-capture");
    var style = document.getElementById("video1-capture-style");
    if (!style) {
      style = document.createElement("style");
      style.id = "video1-capture-style";
      style.textContent = [
        "html.video1-capture .site-header,",
        "html.video1-capture .hero,",
        "html.video1-capture .disclaimer-band,",
        "html.video1-capture .info-grid,",
        "html.video1-capture .site-footer,",
        "html.video1-capture .skip { display:none !important; }",
        "html.video1-capture body { background:#F4EFE6; }",
        "html.video1-capture .workspace { padding-top:20px; padding-bottom:20px; }",
        "html.video1-capture .video1-hl {",
        "  outline: 3px solid rgba(196,146,74,.72);",
        "  outline-offset: 6px;",
        "  border-radius: 12px;",
        "  box-shadow: 0 0 0 10px rgba(244,231,196,.55), 0 8px 24px rgba(196,146,74,.18);",
        "  position: relative;",
        "  z-index: 2;",
        "}",
        "html.video1-capture #parse-paste.video1-hl {",
        "  outline-offset: 5px;",
        "  border-radius: 10px;",
        "  box-shadow: 0 0 0 8px rgba(244,231,196,.6), 0 4px 14px rgba(196,146,74,.2);",
        "}",
        "html.video1-capture #preview-stage.video1-hl {",
        "  outline: 3px solid rgba(196,146,74,.8);",
        "  outline-offset: 8px;",
        "  border-radius: 14px;",
        "  box-shadow: 0 0 0 12px rgba(244,231,196,.7), 0 10px 28px rgba(196,146,74,.22);",
        "  background: rgba(255,252,245,.35);",
        "}",
        "html.video1-capture .confirm-item.video1-hl {",
        "  outline: 3px solid rgba(196,146,74,.88);",
        "  outline-offset: 4px;",
        "  border-radius: 10px;",
        "  box-shadow: 0 0 0 8px rgba(244,231,196,.72), 0 8px 20px rgba(196,146,74,.22);",
        "  position: relative;",
        "  z-index: 2;",
        "}",
        "html.video1-capture.video1-full .wrap { width: calc(100% - 28px); }",
        "html.video1-capture.video1-full .workspace { padding: 10px 0 6px; gap: 14px; }",
        "html.video1-capture.video1-full .preview-col { position: static; top: auto; }",
        "html.video1-capture.video1-full .panel { padding: 12px 14px 12px; }",
        "html.video1-capture.video1-full .panel-head { margin-bottom: 8px; }",
        "html.video1-capture.video1-full .field { margin-bottom: 8px; }",
        "html.video1-capture.video1-full textarea { min-height: 74px; }",
        "html.video1-capture.video1-full .preview-stage { min-height: 188px; padding: 10px 10px 12px; }",
        "html.video1-capture.video1-full .label-card[data-layout=\"a6\"] { width: min(100%, 200px); }",
        "html.video1-capture.video1-full .confirm-block { margin-top: 10px; padding-top: 10px; }",
        "html.video1-capture.video1-full .confirm-item { padding: 6px 9px; margin: 8px 0; font-size: 13px; }",
        "html.video1-capture.video1-full .confirm-intro, html.video1-capture.video1-full .print-lock { font-size: 12.5px; margin: 6px 0 0; }",
        "html.video1-capture.video1-full .print-actions { margin-top: 8px; }",
        "html.video1-capture.video1-full .paid-note,",
        "html.video1-capture.video1-full .print-tip { display: none !important; }",
        "html.video1-capture.video1-full .ing-table { gap: 6px; margin-bottom: 6px; }"
      ].join("\n");
      document.head.appendChild(style);
    }
  }

  function applyVideo1Highlights(hl) {
    if (!hl) return;
    var mode = String(hl).toLowerCase();
    if (mode === "confirms" || mode === "confirm" || mode === "2") {
      document.documentElement.classList.add("video1-full");
      document.querySelectorAll("#confirm-list .confirm-item").forEach(function (el) {
        el.classList.add("video1-hl");
      });
      return;
    }
    var btn = $("parse-paste");
    var preview = $("preview-stage") || document.querySelector(".label-card") || document.querySelector(".preview-panel");
    if (btn) btn.classList.add("video1-hl");
    if (preview) preview.classList.add("video1-hl");
  }

  function runVideo1Demo(step, hl) {
    applyVideo1CaptureChrome();
    clearForDemo();
    applyVideo1Names();
    renderAll();
    scrollComposer();

    if (step === "ready") {
      els.pasteBox.value = "";
      els.pasteBox.setAttribute("placeholder", "");
      renderAll();
      applyVideo1Highlights(hl);
      return;
    }
    if (step === "paste") {
      els.pasteBox.value = VIDEO1_RECIPE;
      renderAll();
      if (els.pasteBox && els.pasteBox.scrollIntoView) els.pasteBox.scrollIntoView({ block: "center", behavior: "instant" });
      applyVideo1Highlights(hl);
      return;
    }
    if (step === "done") {
      els.pasteBox.value = VIDEO1_RECIPE;
      parsePasteClick();
      applyVideo1Names();
      renderAll();
      window.scrollTo(0, 0);
      scrollComposer();
      applyVideo1Highlights(hl);
      return;
    }
    if (step === "confirmed") {
      els.pasteBox.value = VIDEO1_RECIPE;
      parsePasteClick();
      confirmAllForDemo();
      var preview = document.querySelector(".preview-panel") || $("confirm-list");
      if (preview && preview.scrollIntoView) preview.scrollIntoView({ block: "start", behavior: "instant" });
      applyVideo1Highlights(hl);
      return;
    }

    // Timed auto sequence for short screen capture (~8s)
    setTimeout(function () {
      applyVideo1Names();
      renderAll();
      scrollComposer();
    }, 400);
    setTimeout(function () {
      els.pasteBox.value = VIDEO1_RECIPE;
      els.pasteBox.focus();
      scrollComposer();
    }, 1600);
    setTimeout(function () {
      parsePasteClick();
      scrollComposer();
      // show table in view via composer

    }, 3200);
  }


  /** Local-only capture helper: ?demo=video2[&step=base|typing|added|partial|confirmed][&hl=add|row|confirms|print]
   *  Continues lemon drizzle / Northgate Bakery from video1 (paste ingredients already on the form).
   *  Manual add: 10g icing sugar (no new major allergen — confirms stay Wheat/Milk/Eggs + Lemon ack).
   *  step=base      paste ingredients present; ready to add by hand
   *  step=typing    blank row opened; icing sugar / 10 partially filled
   *  step=added     icing sugar fully on the table + label
   *  step=partial   Wheat + Milk confirmed; Eggs + Lemon still open
   *  step=confirmed all confirms/acks checked; print unlocked
   *  hl=add         soft amber on Add ingredient button
   *  hl=row         soft amber on last ingredient row (+ Add button)
   *  hl=confirms    soft amber on unchecked confirm boxes (or all if none unchecked)
   *  hl=print       soft amber on enabled Print button; full compact framing
   */
  var VIDEO2_EXTRA = { name: "icing sugar", grams: "10" };

  function applyVideo2CaptureChrome() {
    applyVideo1CaptureChrome();
    document.documentElement.classList.add("video2-capture");
    var style = document.getElementById("video2-capture-style");
    if (!style) {
      style = document.createElement("style");
      style.id = "video2-capture-style";
      style.textContent = [
        "html.video2-capture.video1-full #paste-box,",
        "html.video2-capture.video1-full .field:has(#paste-box),",
        "html.video2-capture.video1-full #load-sample,",
        "html.video2-capture.video1-full #may-contain,",
        "html.video2-capture.video1-full .field:has(#may-contain),",
        "html.video2-capture.video1-full .grid-3,",
        "html.video2-capture.video1-full .field-narrow { display:none !important; }",
        "html.video2-capture.video1-full .ing-row { gap: 4px; }",
        "html.video2-capture.video1-full .ing-name { font-size: 13px; padding: 6px 8px; }",
        "html.video2-capture.video1-full .grams input { font-size: 13px; padding: 6px 6px; }",
        "html.video2-capture.video1-full #add-ing { margin-top: 4px; }",
        "html.video2-capture #add-ing.video1-hl,",
        "html.video2-capture .ing-row.video1-hl,",
        "html.video2-capture #print-btn.video1-hl {",
        "  outline: 3px solid rgba(196,146,74,.88);",
        "  outline-offset: 5px;",
        "  border-radius: 10px;",
        "  box-shadow: 0 0 0 8px rgba(244,231,196,.72), 0 8px 20px rgba(196,146,74,.22);",
        "  position: relative;",
        "  z-index: 2;",
        "}",
        "html.video2-capture #print-btn.video1-hl:not([disabled]) {",
        "  outline-color: rgba(196,146,74,.95);",
        "  box-shadow: 0 0 0 10px rgba(244,231,196,.78), 0 10px 28px rgba(196,146,74,.28);",
        "}"
      ].join("\n");
      document.head.appendChild(style);
    }
  }

  function loadVideo2BaseIngredients() {
    els.pasteBox.value = VIDEO1_RECIPE;
    parsePasteClick();
    applyVideo1Names();
  }

  function applyVideo2Highlights(hl) {
    if (!hl) return;
    var mode = String(hl).toLowerCase();
    document.documentElement.classList.add("video1-full");
    if (mode === "add") {
      var addBtn = $("add-ing");
      if (addBtn) addBtn.classList.add("video1-hl");
      return;
    }
    if (mode === "row") {
      var rows = els.ingTable.querySelectorAll(".ing-row");
      if (rows.length) rows[rows.length - 1].classList.add("video1-hl");
      var addBtn2 = $("add-ing");
      if (addBtn2) addBtn2.classList.add("video1-hl");
      return;
    }
    if (mode === "confirms" || mode === "confirm") {
      var unchecked = [];
      document.querySelectorAll("#confirm-list .confirm-item").forEach(function (el) {
        var input = el.querySelector("input");
        if (input && !input.disabled && !input.checked) unchecked.push(el);
      });
      var targets = unchecked.length ? unchecked : document.querySelectorAll("#confirm-list .confirm-item");
      targets.forEach(function (el) { el.classList.add("video1-hl"); });
      return;
    }
    if (mode === "print") {
      var printBtn = $("print-btn");
      if (printBtn) printBtn.classList.add("video1-hl");
      document.querySelectorAll("#confirm-list .confirm-item").forEach(function (el) {
        el.classList.add("video1-hl");
      });
      return;
    }
    applyVideo1Highlights(hl);
  }

  function setConfirmIds(ids) {
    state.confirmed = {};
    (ids || []).forEach(function (id) { state.confirmed[id] = true; });
  }

  function runVideo2Demo(step, hl) {
    applyVideo2CaptureChrome();
    clearForDemo();
    applyVideo1Names();
    loadVideo2BaseIngredients();
    renderAll();
    window.scrollTo(0, 0);
    scrollComposer();

    if (step === "base") {
      document.documentElement.classList.add("video1-full");
      renderAll();
      scrollComposer();
      applyVideo2Highlights(hl || "add");
      return;
    }

    if (step === "typing") {
      collectFromRows();
      state.ingredients.push({ id: uid(), name: "icing sugar", grams: "" });
      renderIngredients();
      document.documentElement.classList.add("video1-full");
      renderAll();
      scrollComposer();
      applyVideo2Highlights(hl || "row");
      return;
    }

    if (step === "added") {
      collectFromRows();
      state.ingredients.push({ id: uid(), name: VIDEO2_EXTRA.name, grams: VIDEO2_EXTRA.grams });
      state.confirmed = {};
      state.acknowledged = {};
      renderIngredients();
      document.documentElement.classList.add("video1-full");
      renderAll();
      scrollComposer();
      applyVideo2Highlights(hl || "row");
      return;
    }

    if (step === "partial") {
      collectFromRows();
      state.ingredients.push({ id: uid(), name: VIDEO2_EXTRA.name, grams: VIDEO2_EXTRA.grams });
      renderIngredients();
      setConfirmIds(["wheat", "milk"]);
      state.acknowledged = {};
      document.documentElement.classList.add("video1-full");
      renderAll();
      // Re-apply after confirm list rebuild
      setConfirmIds(["wheat", "milk"]);
      state.acknowledged = {};
      renderAll();
      window.scrollTo(0, 0);
      scrollComposer();
      applyVideo2Highlights(hl || "confirms");
      return;
    }

    if (step === "confirmed") {
      collectFromRows();
      state.ingredients.push({ id: uid(), name: VIDEO2_EXTRA.name, grams: VIDEO2_EXTRA.grams });
      renderIngredients();
      document.documentElement.classList.add("video1-full");
      renderAll();
      confirmAllForDemo();
      window.scrollTo(0, 0);
      scrollComposer();
      applyVideo2Highlights(hl || "print");
      return;
    }

    // default: added state
    collectFromRows();
    state.ingredients.push({ id: uid(), name: VIDEO2_EXTRA.name, grams: VIDEO2_EXTRA.grams });
    renderIngredients();
    document.documentElement.classList.add("video1-full");
    renderAll();
    applyVideo2Highlights(hl);
  }

  function init() {
    bind();
    renderReference();
    document.body.setAttribute("data-print", "a6");
    var params = new URLSearchParams(location.search);
    var demoParam = params.get("demo");
    if (demoParam === "video1" || demoParam === "video2") {
      try { sessionStorage.removeItem("label14.draft.v1"); } catch (e) {}
      state.ingredients = [blankIng(), blankIng(), blankIng()];
      els.packDate.value = todayISO();
      renderIngredients();
      renderSaved();
      renderAll();
      var stepNow = params.get("step") || "";
      var hlNow = params.get("hl") || "";
      if (demoParam === "video2") {
        if (stepNow) {
          runVideo2Demo(stepNow, hlNow);
        } else {
          setTimeout(function () { runVideo2Demo(stepNow, hlNow); }, 200);
        }
        return;
      }
      if (stepNow) {
        runVideo1Demo(stepNow, hlNow);
      } else {
        setTimeout(function () { runVideo1Demo(stepNow, hlNow); }, 200);
      }
      return;
    }
    var demo = /(?:\?|&)demo=1(?:&|$)/.test(location.search);
    if (demo) {
      try { sessionStorage.removeItem("label14.draft.v1"); } catch (e) {}
      state.ingredients = [blankIng(), blankIng(), blankIng()];
      els.packDate.value = todayISO();
      renderIngredients();
      renderSaved();
      renderAll();
      setTimeout(runListingDemo, 600);
      return;
    }
    if (!restoreDraft()) {
      state.ingredients = [blankIng(), blankIng(), blankIng()];
      els.packDate.value = todayISO();
      renderIngredients();
    }
    renderSaved();
    renderAll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
