import { supabase } from "./supabaseClient";

async function findOrCreateByName(table, name) {
  const trimmed = name.trim();

  const { data: existing, error: selectError } = await supabase
    .from(table)
    .select("id")
    .ilike("name", trimmed)
    .maybeSingle();
  if (selectError) throw selectError;
  if (existing) return existing.id;

  const { data: created, error: insertError } = await supabase
    .from(table)
    .insert({ name: trimmed })
    .select("id")
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      const { data: retry } = await supabase
        .from(table)
        .select("id")
        .ilike("name", trimmed)
        .maybeSingle();
      if (retry) return retry.id;
    }
    throw insertError;
  }
  return created.id;
}

async function findOrCreateCurriculum(institutionId, courseId) {
  const { data: existing, error: selectError } = await supabase
    .from("curricula")
    .select("id")
    .eq("institution_id", institutionId)
    .eq("course_id", courseId)
    .maybeSingle();
  if (selectError) throw selectError;
  if (existing) return existing.id;

  const { data: created, error: insertError } = await supabase
    .from("curricula")
    .insert({ institution_id: institutionId, course_id: courseId })
    .select("id")
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      const { data: retry } = await supabase
        .from("curricula")
        .select("id")
        .eq("institution_id", institutionId)
        .eq("course_id", courseId)
        .maybeSingle();
      if (retry) return retry.id;
    }
    throw insertError;
  }
  return created.id;
}

async function ensureProfileRow(user) {
  const meta = user.user_metadata || {};
  const { data: existing, error: selectError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();
  if (selectError) throw selectError;
  if (existing) return;

  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    role: meta.role,
    full_name: meta.full_name || "",
    phone: meta.phone || null,
    city: meta.city || null,
    state: meta.state || null,
  });
  if (error) throw error;
}

async function ensureCandidateRow(user) {
  const { data: existing, error: selectError } = await supabase
    .from("candidates")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();
  if (selectError) throw selectError;
  if (existing) return;

  const meta = user.user_metadata || {};
  let curriculumId = null;
  if (meta.institution_name && meta.course_name) {
    const institutionId = await findOrCreateByName("institutions", meta.institution_name);
    const courseId = await findOrCreateByName("courses", meta.course_name);
    curriculumId = await findOrCreateCurriculum(institutionId, courseId);
  }

  const { error } = await supabase.from("candidates").insert({
    id: user.id,
    curriculum_id: curriculumId,
  });
  if (error) throw error;
}

async function ensureCompanyRow(user) {
  const { data: existing, error: selectError } = await supabase
    .from("companies")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();
  if (selectError) throw selectError;
  if (existing) return;

  const meta = user.user_metadata || {};
  const { error } = await supabase.from("companies").insert({
    id: user.id,
    company_name: meta.company_name || "",
    cnpj: meta.cnpj || null,
    website: meta.website || null,
    industry: meta.industry || null,
  });
  if (error) throw error;
}

// Garante que profiles + (candidates ou companies) existam para o usuário
// autenticado. Chamado após signUp (quando já há sessão) e após login,
// cobrindo o caso em que a confirmação de e-mail atrasou a criação no
// momento do cadastro.
export async function ensureUserRows(user) {
  if (!user) return;
  await ensureProfileRow(user);
  const role = user.user_metadata?.role;
  if (role === "candidate") await ensureCandidateRow(user);
  else if (role === "company") await ensureCompanyRow(user);
}

export async function signUpCandidate({
  fullName,
  email,
  password,
  phone,
  city,
  state,
  institutionName,
  courseName,
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: "candidate",
        full_name: fullName,
        phone: phone || null,
        city: city || null,
        state: state || null,
        institution_name: institutionName || null,
        course_name: courseName || null,
      },
    },
  });
  if (error) throw error;

  if (data.session) {
    await ensureUserRows(data.user);
  }
  return data;
}

export async function signUpCompany({
  contactName,
  email,
  password,
  companyName,
  cnpj,
  website,
  industry,
  phone,
  city,
  state,
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: "company",
        full_name: contactName,
        phone: phone || null,
        city: city || null,
        state: state || null,
        company_name: companyName,
        cnpj: cnpj || null,
        website: website || null,
        industry: industry || null,
      },
    },
  });
  if (error) throw error;

  if (data.session) {
    await ensureUserRows(data.user);
  }
  return data;
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  await ensureUserRows(data.user);
  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}
