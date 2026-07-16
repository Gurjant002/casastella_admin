import type {DayOption} from '@/features/admin/types';

export const ADMIN_TOKEN_STORAGE_KEY = 'casastella-admin-token';

export const ADMIN_WEEK_DAYS: DayOption[] = [
  {label: 'Lunes', value: 'monday'},
  {label: 'Martes', value: 'tuesday'},
  {label: 'Miércoles', value: 'wednesday'},
  {label: 'Jueves', value: 'thursday'},
  {label: 'Viernes', value: 'friday'},
  {label: 'Sábado', value: 'saturday'},
  {label: 'Domingo', value: 'sunday'},
];
