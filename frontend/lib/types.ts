// ConstellAI — shared TypeScript interfaces
// Mirror the FastAPI Pydantic models exactly.

export interface Position {
  x: number;
  y: number;
}

export interface ConceptRef {
  id: string;
  title: string;
}

export interface NodeData {
  id: string;
  title: string;
  tags: string[];
  insight_ids: string[];
  concept_ids: string[];
  position: Position;
}

export interface EdgeData {
  source: string;
  target: string;
  insight_id: string;
}

export type InsightLetter = "R" | "V" | "D" | "S";

export interface InsightData {
  id: string;
  name: string;
  letter: InsightLetter;
  color: string;
  color_secondary: string;
  core_idea: string;
  body_md: string;
  paper_ids: string[];
  edges: EdgeData[];
}

export interface GraphResponse {
  nodes: NodeData[];
  insights: InsightData[];
}

export interface PaperDetail {
  id: string;
  title: string;
  tags: string[];
  status: string;
  summary_md: string;
  insight_ids: string[];
  concepts: ConceptRef[];
}

export interface ConceptDetail {
  id: string;
  title: string;
  tags: string[];
  status: string;
  body_md: string;
  related_paper_ids: string[];
  related_insight_ids: string[];
}
