import { supabase } from './supabase'

/**
 * Fetch the full shopping list: unchecked items first, then checked,
 * both groups ordered by created_at ascending.
 * @returns {Promise<Array>}
 */
export async function getShoppingList() {
  const { data, error } = await supabase
    .from('shopping_list')
    .select('*')
    .order('checked', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) throw new Error(`Failed to fetch shopping list: ${error.message}`)
  return data
}

/**
 * Add a new item to the shopping list and return the inserted row.
 * @param {Object} item - Fields matching the shopping_list schema.
 * @returns {Promise<Object>}
 */
export async function addShoppingItem(item) {
  const { data, error } = await supabase
    .from('shopping_list')
    .insert(item)
    .select()
    .single()

  if (error) throw new Error(`Failed to add shopping item: ${error.message}`)
  return data
}

/**
 * Toggle the checked state of a shopping list item.
 * @param {string}  id      - UUID of the row to update.
 * @param {boolean} checked - New checked value.
 * @returns {Promise<void>}
 */
export async function toggleShoppingItem(id, checked) {
  const { error } = await supabase
    .from('shopping_list')
    .update({ checked })
    .eq('id', id)

  if (error) throw new Error(`Failed to toggle shopping item ${id}: ${error.message}`)
}

/**
 * Delete a single shopping list item by id.
 * @param {string} id - UUID of the row to delete.
 * @returns {Promise<void>}
 */
export async function deleteShoppingItem(id) {
  const { error } = await supabase
    .from('shopping_list')
    .delete()
    .eq('id', id)

  if (error) throw new Error(`Failed to delete shopping item ${id}: ${error.message}`)
}

/**
 * Delete all shopping list items where checked = true.
 * @returns {Promise<void>}
 */
export async function clearCheckedItems() {
  const { error } = await supabase
    .from('shopping_list')
    .delete()
    .eq('checked', true)

  if (error) throw new Error(`Failed to clear checked shopping items: ${error.message}`)
}
