export type ListingStatus =
  | "new_listing"
  | "marketing_prep"
  | "media_scheduled"
  | "ready_to_publish"
  | "live";

export type WorkflowStage = Exclude<ListingStatus, "live">;

export type TaskType = "team_notification" | "marketing_content" | "media_task" | "workflow_routing";
export type TaskPriority = "low" | "medium" | "high";

export interface Listing {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  description: string;
  agentName: string;
  agentEmail: string;
  status: ListingStatus;
  createdAt: string;
}

export interface GeneratedAssets {
  listingId: string;
  propertyDescription: string;
  instagramCaption: string;
  emailPromo: string;
}

export interface Task {
  id: string;
  listingId: string;
  title: string;
  type: TaskType;
  stage: WorkflowStage;
  priority: TaskPriority;
  completed: boolean;
  createdAt: string;
}

export type ActivityEventKind =
  | "listing_created"
  | "marketing_generated"
  | "tasks_routed"
  | "status_updated"
  | "user_action";

export interface ActivityEvent {
  id: string;
  listingId: string;
  message: string;
  at: string;
  kind?: ActivityEventKind;
}
