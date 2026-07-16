import {useEffect, useMemo, useState} from 'react';
import {
  ApiError,
  createCategory,
  createProduct,
  setOpeningHours,
  updateCategory,
  updateProduct,
  type CategoryModel,
  type OpeningHoursSchema,
  type ProductSchema,
} from '@/lib/api';
import {ADMIN_WEEK_DAYS} from '@/features/admin/constants';
import type {CategoryFormState, ProductFormState, ScheduleFormState} from '@/features/admin/types';

type UseAdminWorkspaceOptions = {
  token: string;
  categories: CategoryModel[];
  products: ProductSchema[];
  openingHours: OpeningHoursSchema[];
};

function firstCategoryId(categories: CategoryModel[]) {
  return String(categories.find((category) => typeof category.id === 'number')?.id ?? '');
}

function firstProductId(products: ProductSchema[]) {
  return String(products.find((product) => typeof product.id === 'number')?.id ?? '');
}

export function useAdminWorkspace({token, categories, products, openingHours}: UseAdminWorkspaceOptions) {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'ready'>('idle');

  const [selectedCategoryId, setSelectedCategoryId] = useState(firstCategoryId(categories));
  const [selectedProductId, setSelectedProductId] = useState(firstProductId(products));
  const [selectedDay, setSelectedDay] = useState(ADMIN_WEEK_DAYS[0].value);

  const [categoryForm, setCategoryForm] = useState<CategoryFormState>({
    name: '',
    common_name: '',
    language: 'es',
    description: '',
    available: true,
  });

  const [productForm, setProductForm] = useState<ProductFormState>({
    number: '',
    name: '',
    description: '',
    price: '',
    language: 'es',
    category_id: firstCategoryId(categories),
    available: true,
    is_spicy: false,
    is_adult_only: false,
  });

  const [scheduleForm, setScheduleForm] = useState<ScheduleFormState>({
    day_of_week: ADMIN_WEEK_DAYS[0].value,
    morning_open_time: '13:00',
    morning_close_time: '16:00',
    afternoon_open_time: '20:00',
    afternoon_close_time: '23:30',
    closed: false,
  });

  useEffect(() => {
    if (token) {
      setStatus('ready');
    }
  }, [token]);

  useEffect(() => {
    const selectedCategory = categories.find((category) => String(category.id) === selectedCategoryId);
    if (selectedCategory) {
      setCategoryForm({
        name: selectedCategory.name,
        common_name: selectedCategory.common_name,
        language: selectedCategory.language ?? 'es',
        description: selectedCategory.description ?? '',
        available: selectedCategory.available ?? true,
      });
    }
  }, [categories, selectedCategoryId]);

  useEffect(() => {
    const selectedProduct = products.find((product) => String(product.id) === selectedProductId);
    if (selectedProduct) {
      setProductForm({
        number: String(selectedProduct.number),
        name: selectedProduct.name,
        description: selectedProduct.description ?? '',
        price: String(selectedProduct.price),
        language: selectedProduct.language ?? 'es',
        category_id: String(selectedProduct.category_id),
        available: selectedProduct.available ?? true,
        is_spicy: selectedProduct.is_spicy ?? false,
        is_adult_only: selectedProduct.is_adult_only ?? false,
      });
    }
  }, [products, selectedProductId]);

  useEffect(() => {
    setScheduleForm((current) => ({...current, day_of_week: selectedDay}));
    const existingDay = openingHours.find((item) => item.day_of_week === selectedDay);

    if (existingDay) {
      setScheduleForm({
        day_of_week: existingDay.day_of_week,
        morning_open_time: existingDay.morning_open_time ?? '',
        morning_close_time: existingDay.morning_close_time ?? '',
        afternoon_open_time: existingDay.afternoon_open_time ?? '',
        afternoon_close_time: existingDay.afternoon_close_time ?? '',
        closed: existingDay.closed ?? false,
      });
    }
  }, [openingHours, selectedDay]);

  const selectedCategory = useMemo(
    () => categories.find((category) => String(category.id) === selectedCategoryId) ?? categories[0],
    [categories, selectedCategoryId],
  );

  const selectedProduct = useMemo(
    () => products.find((product) => String(product.id) === selectedProductId) ?? products[0],
    [products, selectedProductId],
  );

  function showApiError(error: unknown) {
    if (error instanceof ApiError) {
      setMessage(`API ${error.status}: ${error.message}`);
      return;
    }

    setMessage('No se pudo completar la operación.');
  }

  async function createCategoryAction() {
    setMessage('');
    setStatus('saving');

    try {
      const created = await createCategory(
        {
          ...categoryForm,
          description: categoryForm.description || null,
        },
        token,
      );
      setSelectedCategoryId(String(created.id ?? ''));
      setMessage('Categoría creada.');
      setStatus('ready');
    } catch (error) {
      setStatus('idle');
      showApiError(error);
    }
  }

  async function updateCategoryAction() {
    if (!selectedCategory?.id) {
      setMessage('Selecciona una categoría antes de guardar.');
      return;
    }

    setMessage('');
    setStatus('saving');

    try {
      await updateCategory(
        {
          id: selectedCategory.id,
          name: categoryForm.name,
          common_name: categoryForm.common_name,
          language: categoryForm.language,
          description: categoryForm.description || null,
          available: categoryForm.available,
          parent_id: selectedCategory.parent_id ?? null,
        },
        token,
      );
      setMessage('Categoría actualizada.');
      setStatus('ready');
    } catch (error) {
      setStatus('idle');
      showApiError(error);
    }
  }

  async function createProductAction() {
    setMessage('');
    setStatus('saving');

    try {
      await createProduct(
        {
          number: Number(productForm.number),
          name: productForm.name,
          description: productForm.description || null,
          price: Number(productForm.price),
          language: productForm.language,
          available: productForm.available,
          is_spicy: productForm.is_spicy,
          is_adult_only: productForm.is_adult_only,
          category_id: Number(productForm.category_id),
        },
        token,
      );
      setMessage('Producto creado.');
      setStatus('ready');
    } catch (error) {
      setStatus('idle');
      showApiError(error);
    }
  }

  async function updateProductAction() {
    if (!selectedProduct?.id) {
      setMessage('Selecciona un producto antes de guardar.');
      return;
    }

    setMessage('');
    setStatus('saving');

    try {
      await updateProduct(
        {
          id: selectedProduct.id,
          number: Number(productForm.number),
          name: productForm.name,
          description: productForm.description || null,
          price: Number(productForm.price),
          language: productForm.language,
          available: productForm.available,
          is_spicy: productForm.is_spicy,
          is_adult_only: productForm.is_adult_only,
          category_id: Number(productForm.category_id),
        },
        token,
      );
      setMessage('Producto actualizado.');
      setStatus('ready');
    } catch (error) {
      setStatus('idle');
      showApiError(error);
    }
  }

  async function saveScheduleAction() {
    setMessage('');
    setStatus('saving');

    try {
      await setOpeningHours(
        {
          day_of_week: scheduleForm.day_of_week,
          morning_open_time: scheduleForm.closed ? null : scheduleForm.morning_open_time,
          morning_close_time: scheduleForm.closed ? null : scheduleForm.morning_close_time,
          afternoon_open_time: scheduleForm.closed ? null : scheduleForm.afternoon_open_time,
          afternoon_close_time: scheduleForm.closed ? null : scheduleForm.afternoon_close_time,
          closed: scheduleForm.closed,
        },
        token,
      );
      setMessage('Horario guardado.');
      setStatus('ready');
    } catch (error) {
      setStatus('idle');
      showApiError(error);
    }
  }

  return {
    message,
    status,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedProductId,
    setSelectedProductId,
    selectedDay,
    setSelectedDay,
    categoryForm,
    setCategoryForm,
    productForm,
    setProductForm,
    scheduleForm,
    setScheduleForm,
    createCategoryAction,
    updateCategoryAction,
    createProductAction,
    updateProductAction,
    saveScheduleAction,
  };
}
