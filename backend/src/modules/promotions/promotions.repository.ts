import { queryWithTimeout } from "../../config/db";
import { Promotion, CustomItemDiscount, ComboDiscount } from "../../types/promotions.types";

export const createPromotionRepo = async (data: Promotion) => {
  // For CUSTOM type, store custom_items and combos as JSON
  const customItemsJson = data.type === "CUSTOM" ? JSON.stringify({
    items: data.custom_items || [],
    combos: data.combos || []
  }) : null;

  const [result]: any = await queryWithTimeout(
    `INSERT INTO promotions 
    (promo_code, title, type, value, start_at, end_at, status, usage_limit, usage_count, custom_items)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?)`,
    [
      data.promo_code,
      data.title,
      data.type,
      data.type === "CUSTOM" ? 0 : data.value, // value is 0 for CUSTOM type
      data.start_at,
      data.end_at,
      data.status || "ACTIVE",
      data.usage_limit ?? null,
      customItemsJson,
    ]
  );

  return { id: result.insertId, ...data };
};

export const getPromotionByIdRepo = async (id: number) => {
  const [rows]: any = await queryWithTimeout(
    "SELECT * FROM promotions WHERE id = ?",
    [id]
  );
  const promo = rows[0];
  
  // Parse custom_items JSON for CUSTOM type promotions
  if (promo && promo.custom_items) {
    try {
      const parsed = JSON.parse(promo.custom_items);
      promo.custom_items = parsed.items || [];
      promo.combos = parsed.combos || [];
    } catch (e) {
      promo.custom_items = [];
      promo.combos = [];
    }
  }
  
  return promo;
};

export const getPromotionByCodeRepo = async (code: string) => {
  const [rows]: any = await queryWithTimeout(
    "SELECT * FROM promotions WHERE promo_code = ?",
    [code]
  );
  const promo = rows[0];
  
  // Parse custom_items JSON for CUSTOM type promotions
  if (promo && promo.custom_items) {
    try {
      const parsed = JSON.parse(promo.custom_items);
      promo.custom_items = parsed.items || [];
      promo.combos = parsed.combos || [];
    } catch (e) {
      promo.custom_items = [];
      promo.combos = [];
    }
  }
  
  return promo;
};

export const updatePromotionRepo = async (id: number, data: Partial<Promotion>) => {
  const fields: string[] = [];
  const values: any[] = [];

  if (data.promo_code !== undefined) { fields.push("promo_code = ?"); values.push(data.promo_code); }
  if (data.title !== undefined) { fields.push("title = ?"); values.push(data.title); }
  if (data.type !== undefined) { fields.push("type = ?"); values.push(data.type); }
  if (data.value !== undefined) { fields.push("value = ?"); values.push(data.value); }
  if (data.start_at !== undefined) { fields.push("start_at = ?"); values.push(data.start_at); }
  if (data.end_at !== undefined) { fields.push("end_at = ?"); values.push(data.end_at); }
  if (data.status !== undefined) { fields.push("status = ?"); values.push(data.status); }
  if (data.usage_limit !== undefined) { fields.push("usage_limit = ?"); values.push(data.usage_limit); }
  
  // Handle custom_items for CUSTOM type
  if (data.custom_items !== undefined || data.combos !== undefined) {
    const existing = await getPromotionByIdRepo(id);
    
    // Parse existing custom_items - it may be already parsed (array) or a JSON string
    let existingParsed = { items: [], combos: [] };
    if (existing?.custom_items) {
      if (typeof existing.custom_items === 'string') {
        try {
          existingParsed = existing.custom_items ? JSON.parse(existing.custom_items) : { items: [], combos: [] };
        } catch (e) {
          existingParsed = { items: [], combos: [] };
        }
      } else if (Array.isArray(existing.custom_items)) {
        // Already parsed - it's the items array
        existingParsed = { items: existing.custom_items, combos: existing.combos || [] };
      }
    }
    
    const customItemsJson = JSON.stringify({
      items: data.custom_items !== undefined ? data.custom_items : existingParsed.items,
      combos: data.combos !== undefined ? data.combos : existingParsed.combos
    });
    
    fields.push("custom_items = ?");
    values.push(customItemsJson);
  }

  if (fields.length === 0) {
    console.log("[REPO] No fields to update, returning existing data");
    return { id, ...data };
  }

  console.log("[REPO] Executing UPDATE:", `UPDATE promotions SET ${fields.join(", ")} WHERE id = ?`, [...values, id]);

  try {
    await queryWithTimeout(
      `UPDATE promotions SET ${fields.join(", ")} WHERE id = ?`,
      [...values, id]
    );
    console.log("[REPO] UPDATE executed successfully");
    
    const result = await getPromotionByIdRepo(id);
    console.log("[REPO] Fetched updated promotion:", result);
    return result;
  } catch (error) {
    console.error("[REPO] Error in updatePromotionRepo:", error);
    throw error;
  }
};

export const togglePromotionStatusRepo = async (id: number) => {
  const promo = await getPromotionByIdRepo(id);
  if (!promo) return null;

  const newStatus = promo.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
  await queryWithTimeout(
    "UPDATE promotions SET status = ? WHERE id = ?",
    [newStatus, id]
  );

  return getPromotionByIdRepo(id);
};

export const deletePromotionRepo = async (id: number) => {
  const [result]: any = await queryWithTimeout(
    "DELETE FROM promotions WHERE id = ?",
    [id]
  );
  return result.affectedRows > 0;
};

export const incrementUsageAtomicRepo = async (id: number) => {
  const [result]: any = await queryWithTimeout(
    `UPDATE promotions 
     SET usage_count = usage_count + 1 
     WHERE id = ? 
     AND (usage_limit IS NULL OR usage_count < usage_limit)`,
    [id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Usage limit exceeded");
  }
};

export const getPromotionsRepo = async (filter?: string) => {
  let query = "SELECT * FROM promotions";
  const now = new Date();

  if (filter === "active") {
    query += ` WHERE status='ACTIVE' 
               AND start_at <= NOW() 
               AND end_at >= NOW()`;
  } else if (filter === "upcoming") {
    query += ` WHERE start_at > NOW()`;
  } else if (filter === "expired") {
    query += ` WHERE end_at < NOW()`;
  }

  const [rows] = await queryWithTimeout(query);
  return rows;
};
