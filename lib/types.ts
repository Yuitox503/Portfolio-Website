export type CategoryType = "hours" | "count";

export type Category = {
  id: string;
  name: string;
  type: CategoryType;
  weekly_target: number;
  sort_order: number;
  is_active: boolean;
};

export type TimeEntry = {
  id: string;
  category_id: string;
  started_at: string;
  ended_at: string | null;
  note: string | null;
};

export type CountLog = {
  id: string;
  category_id: string;
  logged_at: string;
  note: string | null;
};

export type WeeklyReview = {
  week_start: string;
  rating: number | null;
  went_well: string | null;
  to_improve: string | null;
  next_focus: string | null;
  updated_at: string;
};

/** date key → check key → done */
export type WeekChecks = Record<string, Record<string, boolean>>;
