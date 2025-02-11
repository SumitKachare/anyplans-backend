export type Plan = {
  title: string;
  description: string;
  planDate: string;
  durationValue: number;
  durationUnit: "hours" | "days" | "weeks";
  meetupPointAddress: string;
  planCategoryId: number;
  capacity: number;
  imageUrl: string;
  meetupPointLink: string;
  amount: number;
  city: string;
  isFree: boolean;
};

export type PlanDeleted = {
  id: string;
  title: string;
  is_deleted?: string;
};
