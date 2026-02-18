import { pool } from "../../config/db";
import { Promotion } from "../../types/promotions.types";

export const createPromotionRepo = async (data: Promotion) => {
  // For CUSTOM_ITEMS type, store custom_items as JSON
  const customItemsJson = data.type === "CUSTOM_ITEMS" ? JSON.stringify({
    items: data.custom_items || [],
    combos: data.combos || []
  }) : null;

  const stmt = pool.prepare(`
    INSERT INTO promotions 
    (promo_code, title, type, value, start_at, end_at, status, usage_limit, usage_count, min_order_amount, max_discount_amount, custom_items, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    data.promo_code,
    data.title,
    data.type,
    data.type === "CUSTOM_ITEMS" ? 0 : data.value,
    data.start_at,
    data.end_at,
    data.status || "ACTIVE",
    data.usage_limit ?? null,
    data.min_order_amount || 0,
    data.max_discount_amount ?? null,
    customItemsJson,
    data.description || null
  );

  return { id: result.lastInsertRowid, ...data };
};

export const getPromotionByIdRepo = async (id: number) => {
  const stmt = pool.prepare("SELECT * FROM promotions WHERE id = ?");
  const promo = stmt.get(id) as any;
  
  // Parse custom_items JSON for CUSTOM_ITEMS type promotions
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
  const stmt = pool.prepare("SELECT * FROM promotions WHERE promo_code = ?");
  const promo = stmt.get(code) as any;
  
  // Parse custom_items JSON for CUSTOM_ITEMS type promotions
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
  if (data.min_order_amount !== undefined) { fields.push("min_order_amount = ?"); values.push(data.min_order_amount); }
  if (data.max_discount_amount !== undefined) { fields.push("max_discount_amount = ?"); values.push(data.max_discount_amount); }
  if (data.description !== undefined) { fields.push("description = ?"); values.push(data.description); }
  
  // Handle custom_items for CUSTOM_ITEMS type
  if (data.custom_items !== undefined || data.combos !== undefined) {
    const existing = await getPromotionByIdRepo(id);
    
    let existingParsed = { items: [], combos: [] };
    if (existing?.custom_items) {
      if (typeof existing.custom_items === 'string') {
        try {
          existingParsed = existing.custom_items ? JSON.parse(existing.custom_items) : { items: [], combos: [] };
        } catch (e) {
          existingParsed = { items: [], combos: [] };
        }
      } else if (Array.isArray(existing.custom_items)) {
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
    return { id, ...data };
  }

  fields.push("updated_at = CURRENT_TIMESTAMP");

  const sql = `UPDATE promotions SET ${fields.join(", ")} WHERE id = ?`;
  values.push(id);

  pool.prepare(sql).run(...values);
  
  return getPromotionByIdRepo(id);
};

export const togglePromotionStatusRepo = async (id: number) => {
  const promo = await getPromotionByIdRepo(id);
  if (!promo) return null;

  const newStatus = promo.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
  pool.prepare("UPDATE promotions SET status = ? WHERE id = ?").run(newStatus, id);

  return getPromotionByIdRepo(id);
};

export const deletePromotionRepo = async (id: number) => {
  const result = pool.prepare("DELETE FROM promotions WHERE id = ?").run(id);
  return result.changes > 0;
};

export const incrementUsageAtomicRepo = async (id: number) => {
  // SQLite doesn't support atomic check-and-update in one query like MySQL
  // So we do it in two steps
  const promo = await getPromotionByIdRepo(id);
  if (!promo) {
    throw new Error("Promotion not found");
  }
  
  if (promo.usage_limit !== null && promo.usage_count >= promo.usage_limit) {
    throw new Error("Usage limit exceeded");
  }
  
  pool.prepare("UPDATE promotions SET usage_count = usage_count + 1 WHERE id = ?").run(id);
  return true;
};

export const getPromotionsRepo = async (filter?: string) => {
  let query = "SELECT * FROM promotions";
  const now = new Date().toISOString();

  if (filter === "active") {
    query += ` WHERE status='ACTIVE' AND start_at <= '${now}' AND end_at >= '${now}'`;
  } else if (filter === "upcoming") {
    query += ` WHERE start_at > '${now}'`;
  } else if (filter === "expired") {
    query += ` WHERE end_at < '${now}'`;
  }

  query += " ORDER BY id DESC";
  
  const rows = pool.prepare(query).all() as any[];
  
  // Parse custom_items JSON for CUSTOM_ITEMS type promotions
  return rows.map((promo) => {
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
  });
};

