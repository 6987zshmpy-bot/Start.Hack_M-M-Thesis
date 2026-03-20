import topics from "@/data/topics.json";
import companies from "@/data/companies.json";
import fields from "@/data/fields.json";
import supervisors from "@/data/supervisors.json";
import type { Topic, Company, Field, Supervisor } from "@/data/types";

const typedTopics = topics as Topic[];
const typedCompanies = companies as Company[];
const typedFields = fields as Field[];
const typedSupervisors = supervisors as Supervisor[];

export function getCompanyName(id: string | null) {
  if (!id) return null;
  return typedCompanies.find((c) => c.id === id)?.name ?? null;
}

export function getFieldName(id: string) {
  return typedFields.find((f) => f.id === id)?.name ?? id;
}

export function getSupervisor(id: string | null) {
  if (!id) return null;
  return typedSupervisors.find((s) => s.id === id) ?? null;
}

export function getMatchScore(topic: Topic): number {
  const studentFields = ["field-01", "field-03"]; // CS and Data Science
  const fieldMatch = topic.fieldIds.filter((f) => studentFields.includes(f)).length;
  const base = 30 + fieldMatch * 25;
  // Add some deterministic variation
  const hash = topic.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return Math.min(98, base + (hash % 20));
}

export function getTopicById(id: string) {
  return typedTopics.find((t) => t.id === id) ?? null;
}
