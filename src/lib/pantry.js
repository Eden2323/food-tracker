import { supabase } from './supabase'

/**
 * Fetch all pantry items ordered by location then name.
 * @returns {Promise<Array>}
 */
export async function getPantryItems() {
  const { data, error } = await supabase
    .from('pantry_items')
    .select('*')
    .order('location', { ascending: true })
    .order('name', { ascending: true })

  if (error) throw new Error(`Failed to fetch pantry items: ${error.message}`)
  return data
}

/**
 * Insert a new pantry item and return the created row.
 * @param {Object} item - Fields matching the pantry_items schema.
 * @returns {Promise<Object>}
 */
export async function addPantryItem(item) {
  const { data, error } = await supabase
    .from('pantry_items')
    .insert(item)
    .select()
    .single()

  if (error) throw new Error(`Failed to add pantry item: ${error.message}`)
  return data
}

/**
 * Update a pantry item by id and return the updated row.
 * @param {string} id - UUID of the row to update.
 * @param {Object} updates - Partial fields to update.
 * @returns {Promise<Object>}
 */
export async function updatePantryItem(id, updates) {
  const { data, error } = await supabase
    .from('pantry_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`Failed to update pantry item ${id}: ${error.message}`)
  return data
}

/**
 * Delete a pantry item by id.
 * @param {string} id - UUID of the row to delete.
 * @returns {Promise<void>}
 */
export async function deletePantryItem(id) {
  const { error } = await supabase
    .from('pantry_items')
    .delete()
    .eq('id', id)

  if (error) throw new Error(`Failed to delete pantry item ${id}: ${error.message}`)
}

/**
 * Fetch a single pantry item by barcode. Returns null if not found.
 * @param {string} barcode
 * @returns {Promise<Object|null>}
 */
export async function getPantryItemByBarcode(barcode) {
  const { data, error } = await supabase
    .from('pantry_items')
    .select('*')
    .eq('barcode', barcode)
    .maybeSingle()

  if (error) throw new Error(`Failed to fetch pantry item by barcode: ${error.message}`)
  return data // null when not found
}
