import type {CategoryModel, OpeningHoursSchema, ProductSchema, ReservationSchema} from '@/lib/api';

export type AdminPortalProps = {
  categories: CategoryModel[];
  products: ProductSchema[];
  reservations: ReservationSchema[];
  openingHours: OpeningHoursSchema[];
};

export type DayOption = {
  label: string;
  value: string;
};

export type CategoryFormState = {
  name: string;
  common_name: string;
  language: string;
  description: string;
  available: boolean;
};

export type ProductFormState = {
  number: string;
  name: string;
  description: string;
  price: string;
  language: string;
  category_id: string;
  available: boolean;
  is_spicy: boolean;
  is_adult_only: boolean;
};

export type ScheduleFormState = {
  day_of_week: string;
  morning_open_time: string;
  morning_close_time: string;
  afternoon_open_time: string;
  afternoon_close_time: string;
  closed: boolean;
};
