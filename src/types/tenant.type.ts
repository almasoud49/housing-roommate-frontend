import type { PaymentStatus } from "./property.type";

export type MaintenanceStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "WAITING_PARTS"
  | "WAITING_VENDOR"
  | "RESOLVED"
  | "CLOSED"
  | "REJECTED";
export type MaintenancePriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface RoomRef {
  id: string;
  name: string;
  flat?: { flatNumber: string; building?: { name: string; property?: { id: string; title: string } } };
}

export interface PersonRef {
  id: string;
  name: string;
  email?: string;
  profile?: { phoneNumber?: string; avatarUrl?: string } | null;
}

export interface MaintenanceRequest {
  id: string;
  roomId?: string;
  title: string;
  description: string;
  category?: string;
  priority: MaintenancePriority | string;
  status: MaintenanceStatus | string;
  assignedTo?: string | null;
  estimatedCost?: number | null;
  actualCost?: number | null;
  scheduledAt?: string | null;
  completedAt?: string | null;
  images?: string[];
  createdAt: string;
  tenant?: PersonRef;
  room?: RoomRef;
}

export type ViewingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";

export interface ViewingRequest {
  id: string;
  roomId?: string;
  status: ViewingStatus | string;
  preferredDate?: string;
  preferredTime?: string;
  scheduledAt?: string;
  notes?: string | null;
  createdAt: string;
  property?: { id: string; title: string };
  tenant?: PersonRef;
  room?: RoomRef;
}

export interface NotificationItem {
  id: string;
  type?: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export type MatchStatus = "PENDING" | "INTERESTED" | "CONNECTED" | "REJECTED" | "EXPIRED";

export interface MatchItem {
  id: string;
  tenantId?: string;
  matchedWithId?: string;
  score?: number;
  status?: MatchStatus | string;
  matchedWith?: { id?: string; name?: string; email?: string };
  tenant?: { id?: string; name?: string };
  /** Present on freshly-computed matches returned by POST /roommate/matches */
  userId?: string;
  name?: string;
  createdAt?: string;
}

/** GET /roommate/matches — requests I sent (`seekerMatches`) and received (`potentialMatches`). */
export interface MyMatches {
  seekerMatches: MatchItem[];
  potentialMatches: MatchItem[];
}

export interface RoommatePreference {
  id?: string;
  budgetMin?: number | null;
  budgetMax?: number | null;
  preferredCities?: string[];
  preferredAreas?: string[];
  lifestyle?: string | null;
  cleanlinessLevel?: number | null;
  noiseTolerance?: number | null;
  smokingAllowed?: boolean;
  petsAllowed?: boolean;
  guestsFrequency?: "rare" | "occasional" | "frequent" | null;
  workSchedule?: "day" | "night" | "shift" | "remote" | null;
  moveInDate?: string | null;
  leaseDuration?: number | null;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "TENANT" | "LANDLORD" | "PROPERTY_MANAGER" | "ADMIN";
  status: "ACTIVE" | "BLOCKED";
  emailVerified?: boolean;
  isVerified?: boolean;
  authProvider?: string;
  createdAt: string;
  profile?: { phoneNumber?: string; bio?: string; avatarUrl?: string } | null;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType?: string;
  entityId?: string;
  oldData?: unknown;
  newData?: unknown;
  createdAt: string;
  user?: { name: string; email: string };
}

export interface Payment {
  id: string;
  applicationId: string;
  tenantId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  /** Raw SSLCommerz gateway session response (test mode). */
  sslCommerzCreateResponse?: {
    GatewayPageURL?: string;
    sessionkey?: string;
    tran_id?: string;
  } | null;
  /** SSLCommerz identifiers, set once the gateway session is created. */
  sslCommerzTranId?: string | null;
  sslCommerzValId?: string | null;
  createdAt: string;
  application?: { id: string; room?: RoomRef };
}

export interface Review {
  id: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  reviewer?: PersonRef;
  reviewee?: PersonRef;
}

export type UtilityType = "ELECTRICITY" | "WATER" | "GAS" | "INTERNET" | "TRASH" | "OTHER";
export type UtilityBillStatus = "PENDING" | "PAID" | "PARTIAL" | "OVERDUE";

export interface UtilityBillSplit {
  id: string;
  utilityBillId?: string;
  tenantId: string;
  amount: number;
  status: UtilityBillStatus;
  paidDate?: string | null;
  tenant?: PersonRef;
  utilityBill?: Pick<UtilityBill, "id" | "roomId" | "type" | "amount" | "currency" | "billingPeriod" | "dueDate" | "status">;
}

export interface UtilityBill {
  id: string;
  roomId: string;
  type: UtilityType;
  amount: number;
  currency: string;
  billingPeriod: string;
  dueDate: string;
  status: UtilityBillStatus;
  billUrl?: string | null;
  notes?: string | null;
  splits?: UtilityBillSplit[];
  room?: RoomRef;
}

export type DocumentType =
  | "LEASE_AGREEMENT"
  | "MOVE_IN_CHECKLIST"
  | "MOVE_OUT_CHECKLIST"
  | "ID_DOCUMENT"
  | "INCOME_PROOF"
  | "REFERENCE_LETTER"
  | "INSURANCE"
  | "OTHER";
export type DocumentStatus = "DRAFT" | "PENDING_SIGNATURE" | "SIGNED" | "EXPIRED" | "REVOKED";

export interface RentalDocument {
  id: string;
  applicationId: string;
  type: DocumentType;
  title: string;
  fileUrl: string;
  status: DocumentStatus;
  signedAt?: string | null;
  expiresAt?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

export interface VerificationStatus {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
  verificationDocs: string[];
  status: "ACTIVE" | "BLOCKED";
  createdAt: string;
}

export interface UploadSignature {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  publicId: string;
  resourceType: "image" | "video" | "raw" | "auto";
  uploadUrl: string;
  expiresAt: string;
  maxBytes: number;
}

export interface LandlordDashboard {
  totalProperties: number;
  totalBuildings: number;
  totalFlats: number;
  totalRooms: number;
  activeRooms: number;
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  totalRevenue: number;
  monthlyRevenue: number;
  occupancyRate: number;
  recentApplications: { id: string; roomName: string; tenantName: string; status: string; createdAt: string }[];
  upcomingRents: { id: string; tenantName: string; roomName: string; amount: number; dueDate: string; status: string }[];
  maintenanceRequests: { id: string; roomName: string; title: string; priority: string; status: string; createdAt: string }[];
}

export interface AdminStats {
  totalUsers: number;
  totalTenants: number;
  totalLandlords: number;
  totalAdmins: number;
  totalProperties: number;
  totalRooms: number;
  totalApplications: number;
  totalReviews: number;
  totalPayments: number;
  pendingApplications: number;
  completedPayments: number;
}

/** Message sent between users about an application or viewing */
export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  read: boolean;
}

/** A thread of messages related to an application or viewing */
export interface MessageThread {
  applicationId?: string;
  viewingId?: string;
  lastMessage: Message;
  unreadCount: number;
}
