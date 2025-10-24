export interface Tour {
  _id?: string;
  id?: string; // Add id field for frontend compatibility
  title: string;
  slug?: string; // Add slug field
  description: string;
  duration: string;
  price: number;
  location: string;
  images: string[];
  category: string;
  featured: boolean;
  status: 'active' | 'inactive';
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTourData {
  title: string;
  slug?: string; // Add slug field
  description: string;
  duration: string;
  price: number;
  location: string;
  images?: string[];
  category: string;
  featured?: boolean;
  status?: 'active' | 'inactive';
  startDate: Date;
  endDate: Date;
}

export interface UpdateTourData extends Partial<CreateTourData> {
  status?: 'active' | 'inactive';
}

export interface ToursResponse {
  success: boolean;
  data?: Tour[];
  error?: string;
}

export interface TourResponse {
  success: boolean;
  data?: Tour;
  error?: string;
}

export interface DeleteResponse {
  success: boolean;
  message?: string;
  error?: string;
}
