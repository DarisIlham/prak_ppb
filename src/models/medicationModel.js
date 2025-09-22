import { supabase } from "../config/supabaseClient.js";
export const MedicationModel = {
  async getAll() {
    const { data, error } = await supabase
      .from("medications")
      .select("id, sku, name, description, price, quantity, category_id, supplier_id");
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("medications")
      .select(`
        id, sku, name, description, price, quantity,
        categories ( id, name ),
        suppliers ( id, name, email, phone )
      `)
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(payload) {
    const { data, error } = await supabase
      .from("medications")
      .insert([payload])
      .select();
    if (error) throw error;
    return data[0];
  },

  async update(id, payload) {
    const { data, error } = await supabase
      .from("medications")
      .update(payload)
      .eq("id", id)
      .select();
    if (error) throw error;
    return data[0];
  },

  async remove(id) {
    const { error } = await supabase.from("medications").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  },

  async search(keyword) {
    const { data, error } = await supabase
      .from("medications")
      .select("id, sku, name, description, price, quantity, category_id, supplier_id")
      .ilike("name", `%${keyword}%`);
    if (error) throw error;
    return data;
  },

  async getWithFilter({ name, page = 1, limit = 10 }) {
    let query = supabase
      .from("medications")
      .select("id, sku, name, description, price, quantity, category_id, supplier_id", 
        { count: "exact" }
      );

    if (name) {
      query = query.ilike("name", `%${name}%`);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    const totalPages = Math.ceil(count / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        totalPages,
      },
      totalCount: count,
    };
  },

  async getTotalCount() {
    const { count, error } = await supabase
      .from("medications")
      .select("*", { count: "exact" });

    if (error) throw error;
    return count;
  },
};