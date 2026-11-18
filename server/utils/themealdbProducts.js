import axios from "axios";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";
const PLACEHOLDER_IMAGE =
	"https://via.placeholder.com/300x300?text=Holistic";

// Words that describe a holistic / clean / health-focused product.
const HOLISTIC_KEYWORDS = [
	"organic",
	"holistic",
	"clean",
	"healthy",
	"natural",
	"wholesome",
	"nourishing",
	"wellness",
	"whole food",
	"wholefood",
	"plant",
	"vegan",
	"vegetarian",
	"salad",
	"grain",
	"quinoa",
	"lentil",
	"bean",
	"chickpea",
	"tofu",
	"oat",
	"brown rice",
	"whole",
	"vegetable",
	"veggie",
	"herb",
	"smoothie",
	"fruit",
	"seed",
	"nut",
	"avocado",
	"kale",
	"spinach",
	"broccoli",
	"sweet potato",
	"mediterranean",
	"detox",
	"green",
	"fiber",
	"fresh",
];

// Generic search terms should never be used as a literal meal-name filter —
// meals are not named "healthy" or "organic", but their contents qualify.
const GENERIC_HOLISTIC_TERMS = [
	"organic",
	"holistic",
	"clean",
	"healthy",
	"natural",
	"wholesome",
	"wellness",
	"detox",
	"fresh",
	"whole",
];

const CATEGORIES = [
	"Vegetarian",
	"Vegan",
	"Side",
	"Seafood",
	"Starter",
	"Miscellaneous",
];

const CATEGORY_ALIASES = {
	vegetables: "Vegetarian",
	vegetable: "Vegetarian",
	vegan: "Vegan",
	vegetarian: "Vegetarian",
	seafood: "Seafood",
	salads: "Vegetarian",
	salad: "Vegetarian",
	grains: "Side",
	grain: "Side",
	fruit: "Miscellaneous",
	snacks: "Starter",
	dairy: "Miscellaneous",
};

const EXCLUDED_TERMS = [
	"beef",
	"pork",
	"bacon",
	"ham",
	"sausage",
	"lamb",
	"fried chicken",
	"burger",
	"pepperoni",
];

const norm = (value) => String(value || "").toLowerCase().trim();

function hashString(str) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (hash << 5) - hash + str.charCodeAt(i);
		hash |= 0;
	}
	return Math.abs(hash);
}

function extractIngredients(meal) {
	const ingredients = [];
	for (let i = 1; i <= 20; i++) {
		const name = norm(meal[`strIngredient${i}`]);
		const measure = norm(meal[`strMeasure${i}`]);
		if (!name) continue;
		ingredients.push(measure ? `${measure} ${name}`.trim() : name);
	}
	return ingredients;
}

function mealText(meal) {
	return [
		meal.strMeal,
		meal.strCategory,
		meal.strArea,
		meal.strTags,
		meal.strInstructions,
		...extractIngredients(meal).slice(0, 8),
	]
		.filter(Boolean)
		.join(" ")
		.toLowerCase();
}

function isGenericTerm(query) {
	const q = norm(query);
	if (!q) return true;
	return GENERIC_HOLISTIC_TERMS.some((term) => q === term || q.includes(term));
}

function isHolisticMeal(meal) {
	const text = mealText(meal);
	if (EXCLUDED_TERMS.some((term) => text.includes(term))) return false;
	return HOLISTIC_KEYWORDS.some((keyword) => text.includes(keyword));
}

function transformMeal(meal) {
	const ingredients = extractIngredients(meal);
	const seed = hashString(String(meal.idMeal || meal.strMeal || "meal"));
	const regularPrice = Number((10 + (seed % 1200) / 100).toFixed(2));
	const offerPrice = Number((regularPrice * 0.9).toFixed(2));
	const category = meal.strCategory || "Holistic";
	const tags = norm(meal.strTags)
		.split(",")
		.map((tag) => tag.trim())
		.filter(Boolean);

	return {
		productId: `mealdb-${meal.idMeal}`,
		externalId: `mealdb-${meal.idMeal}`,
		upc: `mealdb-${meal.idMeal}`,
		name: meal.strMeal || "Holistic meal",
		brand: "TheMealDB",
		description: ingredients.length
			? `Holistic, clean eating inspiration made with ${ingredients
					.slice(0, 8)
					.join(", ")}.`
			: norm(meal.strInstructions)
				? `${String(meal.strInstructions).slice(0, 140)}...`
				: "Holistic, clean eating inspiration.",
		regularPrice,
		offerPrice,
		price: { regular: regularPrice, sale: offerPrice },
		image: [meal.strMealThumb || PLACEHOLDER_IMAGE],
		category:
			category === "Vegetarian" ||
			category === "Vegan" ||
			category === "Side"
				? "Holistic Meals"
				: category,
		subCategory: meal.strArea || "Recipe",
		size: ingredients.length ? `${ingredients.length} ingredients` : "",
		source: "themealdb",
		isMealDbProduct: true,
		stock: 100,
		tags: [...tags, ...HOLISTIC_KEYWORDS.filter((k) => mealText(meal).includes(k)).slice(0, 4)],
		ingredients,
	};
}

async function fetchMeals(url) {
	const { data } = await axios.get(url, { timeout: 12000 });
	return Array.isArray(data?.meals) ? data.meals : [];
}

async function lookupMeals(ids) {
	const results = [];
	// Small batches keep TheMealDB happy while staying fast enough for a function.
	for (let i = 0; i < ids.length; i += 10) {
		const batch = ids.slice(i, i + 10);
		const meals = await Promise.all(
			batch.map(async (id) => {
				try {
					const found = await fetchMeals(`${BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`);
					return found[0] || null;
				} catch {
					return null;
				}
			}),
		);
		results.push(...meals.filter(Boolean));
	}
	return results;
}

/**
 * Returns ONLY holistic / clean / healthy meals sourced from TheMealDB.
 * TheMealDB keyword searches such as "healthy" return no results, so we work
 * from category listings, pre-filter by name, then verify full meal details.
 */
async function fetchHolisticMealProductsUncached({ query = "", category = "", limit = 12 } = {}) {
	try {
		const max = Math.max(1, Math.min(Number(limit) || 12, 48));
		const requestedCategory =
			CATEGORY_ALIASES[norm(category)] || (CATEGORIES.includes(category) ? category : "");
		const categories = requestedCategory ? [requestedCategory] : CATEGORIES;

		const listings = await Promise.all(
			categories.map(async (name) => {
				try {
					return await fetchMeals(
						`${BASE_URL}/filter.php?c=${encodeURIComponent(name)}`,
					);
				} catch {
					return [];
				}
			}),
		);

		const candidates = new Map();
		for (const meal of listings.flat()) {
			if (meal?.idMeal) candidates.set(meal.idMeal, meal);
		}

		const q = norm(query);
		const useLiteralQuery = q && !isGenericTerm(q);
		const scored = [];

		for (const meal of candidates.values()) {
			const name = norm(meal.strMeal);
			const queryHit = useLiteralQuery && name.includes(q);
			const keywordHit = HOLISTIC_KEYWORDS.some((keyword) => name.includes(keyword));
			if (queryHit || keywordHit || (!useLiteralQuery && !q)) {
				scored.push({ meal, score: queryHit ? 2 : keywordHit ? 1 : 0 });
			}
		}

		scored.sort((a, b) => b.score - a.score);
		const lookupLimit = Math.min(candidates.size, Math.max(max * 3, 60));
		const details = await lookupMeals(
			scored.slice(0, lookupLimit).map((entry) => entry.meal.idMeal),
		);

		const seen = new Set();
		const products = [];
		for (const meal of details) {
			if (seen.has(meal.idMeal)) continue;
			seen.add(meal.idMeal);
			if (!isHolisticMeal(meal)) continue;
			products.push(transformMeal(meal));
			if (products.length >= max) break;
		}

		return products;
	} catch (error) {
		console.error("TheMealDB fetch error:", error.message);
		return [];
	}
}

// TheMealDB is a free public API. Cache results and share in-flight requests
// so the several product calls made on page load don't get rate-limited.
const CACHE_TTL_MS = 30 * 60 * 1000;
const productCache = new Map();
const inFlight = new Map();

export async function fetchHolisticMealProducts(options = {}) {
	const key = [
		norm(options.query),
		norm(options.category),
		Math.max(1, Math.min(Number(options.limit) || 12, 48)),
	].join("|");

	const cached = productCache.get(key);
	if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
		return cached.products;
	}
	if (inFlight.has(key)) {
		return inFlight.get(key);
	}

	const request = fetchHolisticMealProductsUncached(options)
		.then((products) => {
			if (products.length) productCache.set(key, { at: Date.now(), products });
			return products;
		})
		.finally(() => inFlight.delete(key));

	inFlight.set(key, request);
	return request;
}

export function mealDbCategories() {
	return ["Holistic Meals", "Vegetarian", "Vegan", "Side", "Seafood", "Starter", "Miscellaneous"];
}
