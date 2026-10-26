import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)

// Busca um registro por nome em catálogos de nome único (skills, institutions, courses);
// cria se não existir.
export async function findOrCreateByName(table, name, extra = {}) {
  const clean = name.trim()
  const { data: found } = await supabase.from(table).select('*').ilike('name', clean).limit(1).maybeSingle()
  if (found) return found
  const { data, error } = await supabase.from(table).insert({ name: clean, ...extra }).select().single()
  if (error) {
    if (error.code === '23505') {
      const { data: again } = await supabase.from(table).select('*').eq('name', clean).single()
      return again
    }
    throw error
  }
  return data
}
