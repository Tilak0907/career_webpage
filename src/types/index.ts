export type WorkType = 'Full-time' | 'Part-time' | 'Internship' | 'Remote' | 'Contract';

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'pdf';
  url: string; // Data URL (base64) or remote storage URL
  sizeBytes?: number;
  uploadedAt: string;
}

export interface Role {
  id: string;
  companyId: string;
  title: string;
  department: string;
  location: string;
  type: WorkType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  isActive: boolean;
  applyUrl: string;
  descriptionHtml: string;
  attachments: Attachment[];
  applyCount: number;
  viewCount: number;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  logoUrl: string;
  industry: string;
  location: string;
  description: string;
  websiteUrl?: string;
  createdAt: string;
}

export interface SiteAnalytics {
  totalPageViews: number;
  uniqueVisitors: number;
  lastUpdated: string;
}
