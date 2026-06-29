// Utility functions for generating diverse and accurate food images

// Comprehensive image mapping based on food names and categories
const foodImageMappings = [
  // Vietnamese Pho
  {
    keywords: ["phở bò đặc biệt", "pho bo dac biet"],
    imageUrl:
      "https://images.unsplash.com/photo-1579866997815-ecbb27a4dd43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwcGhvJTIwYmVlZiUyMHNwZWNpYWx8ZW58MXx8fHwxNzU5NjcyOTIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    keywords: ["phở gà", "pho ga", "chicken pho"],
    imageUrl:
      "https://images.unsplash.com/photo-1636474498689-27e2d3ecf8d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwY2hpY2tlbiUyMHBobyUyMG5vb2RsZSUyMHNvdXB8ZW58MXx8fHwxNzU5NjgzODU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    keywords: ["phở tái", "pho tai"],
    imageUrl:
      "https://images.unsplash.com/photo-1597577652129-7ffad9d37ad4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwY2hpY2tlbiUyMHBob3xlbnwxfHx8fDE3NTk2NzI5MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    keywords: ["phở chín", "pho chin"],
    imageUrl:
      "https://images.unsplash.com/photo-1579866997815-ecbb27a4dd43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwcGhvJTIwYmVlZiUyMHNwZWNpYWx8ZW58MXx8fHwxNzU5NjcyOTIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },

  // Vietnamese Banh Mi
  {
    keywords: ["bánh mì thịt nướng", "banh mi thit nuong"],
    imageUrl:
      "https://images.unsplash.com/photo-1524062008239-962eb6d3383d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYmFuaCUyMG1pJTIwc2FuZHdpY2h8ZW58MXx8fHwxNzU5NjcyOTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    keywords: ["bánh mì pâté", "banh mi pate"],
    imageUrl:
      "https://images.unsplash.com/photo-1599461143300-67b5d7ffe42c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5oJTIwbWklMjBwYXRlfGVufDF8fHx8MTc1OTY4Mzg5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    keywords: ["bánh mì chả cá", "banh mi cha ca"],
    imageUrl:
      "https://images.unsplash.com/photo-1526551800-4c06b10ee6ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhiYW5oJTIwbWklMjBjaGElMjBjYXxlbnwxfHx8fDE3NTk2ODM4OTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },

  // Pizza
  {
    keywords: ["pizza margherita"],
    imageUrl:
      "https://images.unsplash.com/photo-1759283391598-83b0ceb0faef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJnaGVyaXRhJTIwcGl6emElMjBmcmVzaCUyMGJhc2lsfGVufDF8fHx8MTc1OTY1OTQ5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    keywords: ["pizza pepperoni"],
    imageUrl:
      "https://images.unsplash.com/photo-1754799565151-e24cd6ea61e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXBwZXJvbmklMjBwaXp6YSUyMGNoZWVzZSUyMG1lbHRlZHxlbnwxfHx8fDE3NTk2ODM4NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    keywords: ["pizza quattro stagioni", "pizza diavola"],
    imageUrl:
      "https://images.unsplash.com/photo-1758448500799-0162cffd85d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwaXp6YSUyMHJlc3RhdXJhbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk2NzI5MDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },

  // Pasta
  {
    keywords: ["pasta carbonara"],
    imageUrl:
      "https://images.unsplash.com/photo-1608756687911-aa1599ab8da9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGNhcmJvbmFyYXxlbnwxfHx8fDE3NTk2ODM5MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    keywords: ["pasta bolognese"],
    imageUrl:
      "https://images.unsplash.com/photo-1563379091339-03246963d96a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGJvbG9nbmVzZXxlbnwxfHx8fDE3NTk2ODM5MTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },

  // Japanese Sushi
  {
    keywords: ["sushi set a", "sushi set b", "sushi set c"],
    imageUrl:
      "https://images.unsplash.com/photo-1630748662890-11623a758d6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHN1c2hpJTIwc2V0JTIwcGxhdHRlcnxlbnwxfHx8fDE3NTk2NzI5MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    keywords: ["sushi omakase"],
    imageUrl:
      "https://images.unsplash.com/photo-1570197788417-0e82375c9371?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMG9tYWthc2V8ZW58MXx8fHwxNzU5NjgzOTE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    keywords: ["sashimi cá hồi", "salmon sashimi"],
    imageUrl:
      "https://images.unsplash.com/photo-1758384075930-6e3835d22b1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbG1vbiUyMHNhc2hpbWklMjBzbGljZXxlbnwxfHx8fDE3NTk2ODM4NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    keywords: ["sashimi tuna", "sashimi yellowtail"],
    imageUrl:
      "https://images.unsplash.com/photo-1646408814483-de1127ddc5a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxtb24lMjBzYXNoaW1pJTIwZnJlc2glMjBmaXNofGVufDF8fHx8MTc1OTY3MjkzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },

  // Burgers
  {
    keywords: ["classic beef burger"],
    imageUrl:
      "https://images.unsplash.com/photo-1591336277697-cdae7e42dead?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwYmVlZiUyMGJ1cmdlciUyMGZyaWVzfGVufDF8fHx8MTc1OTY4Mzg3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    keywords: ["bbq bacon burger"],
    imageUrl:
      "https://images.unsplash.com/photo-1679344600900-87a98b85c01f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWVyaWNhbiUyMGJ1cmdlciUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NjcyOTE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    keywords: ["chicken burger", "fish burger", "veggie burger"],
    imageUrl:
      "https://images.unsplash.com/photo-1586540480250-e3a0717298b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWVyaWNhbiUyMGNoZWVzZWJ1cmdlciUyMGZyaWVzfGVufDF8fHx8MTc1OTY3Mjk0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },

  // Thai Food
  {
    keywords: ["pad thai tôm", "pad thai shrimp"],
    imageUrl:
      "https://images.unsplash.com/photo-1559314809-0d155014e29e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwcGFkJTIwdGhhaSUyMG5vb2RsZXMlMjBzaHJpbXB8ZW58MXx8fHwxNzU5NjgzODc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    keywords: ["pad thai gà", "pad thai chicken", "pad thai chay"],
    imageUrl:
      "https://images.unsplash.com/photo-1757845301698-da07924946a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwcGFkJTIwdGhhaSUyMG5vb2RsZXN8ZW58MXx8fHwxNzU5NjcyOTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    keywords: ["tom yum goong", "tom yum gà"],
    imageUrl:
      "https://images.unsplash.com/photo-1571809839227-b2ac3d261257?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwdG9tJTIweXVtJTIwc291cCUyMHNwaWN5fGVufDF8fHx8MTc1OTY3Mjk1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    keywords: ["green curry", "red curry", "yellow curry"],
    imageUrl:
      "https://images.unsplash.com/photo-1675150303909-1bb94e33132f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwcmVzdGF1cmFudCUyMHBhZCUyMHRoYWl8ZW58MXx8fHwxNzU5NjcyOTE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },

  // Vietnamese Coffee
  {
    keywords: ["cà phê đen đá", "vietnamese iced coffee"],
    imageUrl:
      "https://images.unsplash.com/photo-1644204010193-a35de7b0d702?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwaWNlZCUyMGNvZmZlZSUyMGRyaXB8ZW58MXx8fHwxNzU5NjgzODg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    keywords: ["cà phê sữa đá", "vietnamese milk coffee"],
    imageUrl:
      "https://images.unsplash.com/photo-1569315095807-995e6e3ba320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwaWNlZCUyMGNvZmZlZXxlbnwxfHx8fDE3NTk2NzM1NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },

  // Bubble Tea & Smoothies
  {
    keywords: ["trà sữa trân châu", "bubble tea"],
    imageUrl:
      "https://images.unsplash.com/photo-1627781245399-a1fe415c0046?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWJibGUlMjB0ZWElMjBib2JhJTIwZHJpbmt8ZW58MXx8fHwxNzU5NjczOTgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    keywords: ["sinh tố", "smoothie", "smoothie bowl"],
    imageUrl:
      "https://images.unsplash.com/photo-1604298331663-de303fbc7059?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZydWl0JTIwc21vb3RoaWV8ZW58MXx8fHwxNzU5NjczNTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },

  // Korean BBQ
  {
    keywords: ["bulgogi beef", "galbi beef"],
    imageUrl:
      "https://images.unsplash.com/photo-1632558610168-8377309e34c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiYXJiZWN1ZSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NTg4MDAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    keywords: ["kimchi jjigae", "korean soup"],
    imageUrl:
      "https://images.unsplash.com/photo-1743419612786-19d116bb8c40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBraW1jaGklMjBzb3VwJTIwaG90fGVufDF8fHx8MTc1OTY3Mzk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },

  // Healthy Foods
  {
    keywords: ["buddha bowl", "salad", "rainbow salad"],
    imageUrl:
      "https://images.unsplash.com/photo-1555057949-7e4a30956f1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjByZXN0YXVyYW50fGVufDF8fHx8MTc1OTU4OTg0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },

  // Default fallback images for categories
  {
    keywords: ["bún", "noodle soup"],
    imageUrl:
      "https://images.unsplash.com/photo-1594020293008-5f99f60bd4d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwZnJlc2glMjBzcHJpbmclMjByb2xsc3xlbnwxfHx8fDE3NTk2NzM5NzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    keywords: ["mexican", "tacos", "quesadillas"],
    imageUrl:
      "https://images.unsplash.com/photo-1700625915228-f2b3d88c6676?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXhpY2FuJTIwdGFjbyUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NjczOTY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    keywords: ["dim sum", "har gow", "siu mai"],
    imageUrl:
      "https://images.unsplash.com/photo-1563538866332-01d4b73d13b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwcmVzdGF1cmFudCUyMGRpbSUyMHN1bXxlbnwxfHx8fDE3NTk2NzM5NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    keywords: ["curry", "indian"],
    imageUrl:
      "https://images.unsplash.com/photo-1690915475414-9aaecfd3ba74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjdXJyeSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NjYwNTg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

/**
 * Get optimized image URL for a menu item based on its name
 */
export function getOptimizedFoodImage(itemName, fallbackUrl) {
  const normalizedName = itemName.toLowerCase().trim();

  // Find exact or partial matches
  for (const mapping of foodImageMappings) {
    for (const keyword of mapping.keywords) {
      if (normalizedName.includes(keyword.toLowerCase())) {
        return mapping.imageUrl;
      }
    }
  }

  // Category-based fallback
  if (normalizedName.includes("phở") || normalizedName.includes("pho")) {
    return (
      foodImageMappings.find((m) => m.keywords.includes("phở bò đặc biệt"))
        ?.imageUrl ||
      fallbackUrl ||
      ""
    );
  }
  if (normalizedName.includes("pizza")) {
    return (
      foodImageMappings.find((m) => m.keywords.includes("pizza margherita"))
        ?.imageUrl ||
      fallbackUrl ||
      ""
    );
  }
  if (normalizedName.includes("sushi")) {
    return (
      foodImageMappings.find((m) => m.keywords.includes("sushi set a"))
        ?.imageUrl ||
      fallbackUrl ||
      ""
    );
  }
  if (normalizedName.includes("burger")) {
    return (
      foodImageMappings.find((m) => m.keywords.includes("classic beef burger"))
        ?.imageUrl ||
      fallbackUrl ||
      ""
    );
  }
  if (normalizedName.includes("curry")) {
    return (
      foodImageMappings.find((m) => m.keywords.includes("curry"))?.imageUrl ||
      fallbackUrl ||
      ""
    );
  }

  return (
    fallbackUrl ||
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NzIyNzJ8MHwxfHNlYXJjaHwxfHxmb29kfGVufDF8fHx8MTcwMDY0MDY4MXww&ixlib=rb-4.0.3&q=80&w=1080"
  );
}

/**
 * Generate diverse image variants for similar food items
 */
export function getVariantFoodImage(baseName, variant = 0) {
  const normalizedName = baseName.toLowerCase().trim();
  const matchingMappings = foodImageMappings.filter((mapping) =>
    mapping.keywords.some((keyword) =>
      normalizedName.includes(keyword.toLowerCase())
    )
  );

  if (matchingMappings.length > 0) {
    const selectedMapping = matchingMappings[variant % matchingMappings.length];
    return selectedMapping.imageUrl;
  }

  return getOptimizedFoodImage(baseName);
}

/**
 * Add image optimization parameters to any image URL
 */
export function optimizeImageUrl(
  imageUrl,
  width = 800,
  height = 600,
  quality = 80
) {
  if (!imageUrl) return "";

  // If it's an Unsplash URL, add optimization parameters
  if (imageUrl.includes("unsplash.com")) {
    const url = new URL(imageUrl);
    url.searchParams.set("w", width.toString());
    url.searchParams.set("h", height.toString());
    url.searchParams.set("q", quality.toString());
    url.searchParams.set("fit", "crop");
    url.searchParams.set("crop", "center");
    return url.toString();
  }

  return imageUrl;
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercentage(originalPrice, salePrice) {
  if (originalPrice <= 0 || salePrice <= 0 || salePrice >= originalPrice) {
    return 0;
  }

  const discount = ((originalPrice - salePrice) / originalPrice) * 100;
  return Math.round(discount);
}

/**
 * Check if an item has a discount
 */
export function hasDiscount(item) {
  return !!(item.originalPrice && item.originalPrice > item.price);
}
