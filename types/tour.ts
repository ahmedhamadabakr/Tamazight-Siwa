export interface Tour {
  _id?: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  location: string;
  images: string[];
  category: string;
  featured: boolean;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTourData {
  title: string;
  description: string;
  duration: string;
  price: number;
  location: string;
  images?: string[];
  category: string;
  featured?: boolean;
  status?: 'active' | 'inactive';
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
