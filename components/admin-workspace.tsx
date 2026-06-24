'use client';

import {useEffect, useMemo, useState} from 'react';
import {Button, Card, CardBody, CardHeader, Chip, Input, Select, SelectItem, Textarea} from '@heroui/react';
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

type AdminWorkspaceProps = {
  token: string;
  categories: CategoryModel[];
  products: ProductSchema[];
  openingHours: OpeningHoursSchema[];
};

type DayOption = {
  label: string;
  value: string;
};

const days: DayOption[] = [
  {label: 'Lunes', value: 'monday'},
  {label: 'Martes', value: 'tuesday'},
  {label: 'Miércoles', value: 'wednesday'},
  {label: 'Jueves', value: 'thursday'},
  {label: 'Viernes', value: 'friday'},
  {label: 'Sábado', value: 'saturday'},
  {label: 'Domingo', value: 'sunday'},
];

function firstCategoryId(categories: CategoryModel[]) {
  return String(categories.find((category) => typeof category.id === 'number')?.id ?? '');
}

function firstProductId(products: ProductSchema[]) {
  return String(products.find((product) => typeof product.id === 'number')?.id ?? '');
}

export function AdminWorkspace({token, categories, products, openingHours}: AdminWorkspaceProps) {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'ready'>('idle');

  const [selectedCategoryId, setSelectedCategoryId] = useState(firstCategoryId(categories));
  const [selectedProductId, setSelectedProductId] = useState(firstProductId(products));
  const [selectedDay, setSelectedDay] = useState(days[0].value);

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    common_name: '',
    language: 'es',
    description: '',
    available: true,
  });

  const [productForm, setProductForm] = useState({
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

  const [scheduleForm, setScheduleForm] = useState({
    day_of_week: days[0].value,
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

  async function handleCreateCategory() {
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

  async function handleUpdateCategory() {
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

  async function handleCreateProduct() {
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

  async function handleUpdateProduct() {
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

  async function handleSaveSchedule() {
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

  return (
    <section id="workspace" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Card className="premium-card border border-[rgba(201,168,76,0.18)] bg-transparent">
        <CardHeader className="px-6 pt-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="premium-kicker">Panel operativo</p>
              <h2 className="premium-title text-3xl text-(--cream) md:text-4xl">Carta, horario y categorías</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-(--muted) md:text-base">
                Edición real contra la API de Casa Stella. Aquí solo trabajas con operación: horarios, categorías y productos.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Chip className="premium-chip border-0 text-[0.72rem] uppercase tracking-[0.22em]" variant="flat">
                {status === 'saving' ? 'Sincronizando' : 'Sesión activa'}
              </Chip>
              <Chip className="premium-chip border-0 text-[0.72rem] uppercase tracking-[0.22em]" variant="flat">
                {categories.length} categorías
              </Chip>
              <Chip className="premium-chip border-0 text-[0.72rem] uppercase tracking-[0.22em]" variant="flat">
                {products.length} productos
              </Chip>
            </div>
          </div>
        </CardHeader>

        <CardBody className="gap-8 px-6 pb-6 pt-2">
          {message ? <p className="text-sm leading-6 text-(--gold-hover)">{message}</p> : null}

          <div className="grid gap-6 xl:grid-cols-1">
            <Card id="horario" className="premium-card-quiet border border-[rgba(201,168,76,0.12)] bg-transparent">
              <CardBody className="gap-4 p-5">
                <p className="premium-kicker">Horario de apertura</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <Select label="Día" labelPlacement="outside" selectedKeys={[scheduleForm.day_of_week]} onSelectionChange={(keys) => setScheduleForm((current) => ({...current, day_of_week: String(Array.from(keys)[0] ?? current.day_of_week)}))} classNames={{trigger: 'premium-input', label: 'text-[var(--cream-soft)]'}}>
                    {days.map((day) => (
                      <SelectItem key={day.value}>{day.label}</SelectItem>
                    ))}
                  </Select>
                  <Select label="Estado" labelPlacement="outside" selectedKeys={[scheduleForm.closed ? 'closed' : 'open']} onSelectionChange={(keys) => setScheduleForm((current) => ({...current, closed: String(Array.from(keys)[0] ?? 'open') === 'closed'}))} classNames={{trigger: 'premium-input', label: 'text-[var(--cream-soft)]'}}>
                    <SelectItem key="open">Abierto</SelectItem>
                    <SelectItem key="closed">Cerrado</SelectItem>
                  </Select>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Apertura mañana" labelPlacement="outside" value={scheduleForm.morning_open_time} onValueChange={(value) => setScheduleForm((current) => ({...current, morning_open_time: value}))} classNames={{inputWrapper: 'premium-input', label: 'text-[var(--cream-soft)]'}} />
                  <Input label="Cierre mañana" labelPlacement="outside" value={scheduleForm.morning_close_time} onValueChange={(value) => setScheduleForm((current) => ({...current, morning_close_time: value}))} classNames={{inputWrapper: 'premium-input', label: 'text-[var(--cream-soft)]'}} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Apertura tarde" labelPlacement="outside" value={scheduleForm.afternoon_open_time} onValueChange={(value) => setScheduleForm((current) => ({...current, afternoon_open_time: value}))} classNames={{inputWrapper: 'premium-input', label: 'text-[var(--cream-soft)]'}} />
                  <Input label="Cierre tarde" labelPlacement="outside" value={scheduleForm.afternoon_close_time} onValueChange={(value) => setScheduleForm((current) => ({...current, afternoon_close_time: value}))} classNames={{inputWrapper: 'premium-input', label: 'text-[var(--cream-soft)]'}} />
                </div>
                <Button className="premium-button-primary" radius="sm" onPress={() => void handleSaveSchedule()}>
                  Guardar horario
                </Button>
              </CardBody>
            </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
            <Card className="premium-card-quiet border border-[rgba(201,168,76,0.12)] bg-transparent">
              <CardHeader className="px-5 pt-5">
                <div>
                  <p className="premium-kicker">Categorías</p>
                  <h3 className="premium-title text-2xl text-(--cream)">Editar o crear</h3>
                </div>
              </CardHeader>
              <CardBody className="gap-4 px-5 pb-5 pt-2">
                <Select label="Categoría actual" labelPlacement="outside" selectedKeys={selectedCategoryId ? [selectedCategoryId] : []} onSelectionChange={(keys) => setSelectedCategoryId(String(Array.from(keys)[0] ?? ''))} classNames={{trigger: 'premium-input', label: 'text-[var(--cream-soft)]'}}>
                  {categories.map((category) => (
                    <SelectItem key={String(category.id ?? category.common_name)}>{category.common_name}</SelectItem>
                  ))}
                </Select>
                <Input label="Nombre interno" labelPlacement="outside" value={categoryForm.name} onValueChange={(value) => setCategoryForm((current) => ({...current, name: value}))} classNames={{inputWrapper: 'premium-input', label: 'text-[var(--cream-soft)]'}} />
                <Input label="Nombre común" labelPlacement="outside" value={categoryForm.common_name} onValueChange={(value) => setCategoryForm((current) => ({...current, common_name: value}))} classNames={{inputWrapper: 'premium-input', label: 'text-[var(--cream-soft)]'}} />
                <Textarea label="Descripción" labelPlacement="outside" value={categoryForm.description} onValueChange={(value) => setCategoryForm((current) => ({...current, description: value}))} minRows={3} classNames={{inputWrapper: 'premium-input', label: 'text-[var(--cream-soft)]', input: 'premium-textarea'}} />
                <div className="flex flex-wrap gap-3">
                  <Button className="premium-button-primary" radius="sm" onPress={() => void handleCreateCategory()}>
                    Crear categoría
                  </Button>
                  <Button className="premium-button-secondary" radius="sm" variant="bordered" onPress={() => void handleUpdateCategory()}>
                    Actualizar categoría
                  </Button>
                </div>
                <div className="space-y-3 pt-2">
                  {categories.slice(0, 4).map((category) => (
                    <button key={String(category.id ?? category.common_name)} type="button" onClick={() => setSelectedCategoryId(String(category.id ?? ''))} className="flex w-full items-center justify-between rounded-[0.9rem] border border-[rgba(201,168,76,0.12)] px-4 py-3 text-left transition hover:border-[rgba(240,208,128,0.3)]">
                      <span>
                        <span className="block premium-title text-lg text-(--cream)">{category.common_name}</span>
                        <span className="block text-xs uppercase tracking-[0.18em] text-(--cream-soft)">{category.language ?? 'es'}</span>
                      </span>
                      <Chip className="premium-chip border-0 text-[0.68rem] uppercase tracking-[0.2em]" variant="flat">
                        {category.available ? 'activa' : 'oculta'}
                      </Chip>
                    </button>
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card className="premium-card-quiet border border-[rgba(201,168,76,0.12)] bg-transparent">
              <CardHeader className="px-5 pt-5">
                <div>
                  <p className="premium-kicker">Carta</p>
                  <h3 className="premium-title text-2xl text-(--cream)">Crear o actualizar producto</h3>
                </div>
              </CardHeader>
              <CardBody className="gap-4 px-5 pb-5 pt-2">
                <Select label="Producto actual" labelPlacement="outside" selectedKeys={selectedProductId ? [selectedProductId] : []} onSelectionChange={(keys) => setSelectedProductId(String(Array.from(keys)[0] ?? ''))} classNames={{trigger: 'premium-input', label: 'text-[var(--cream-soft)]'}}>
                  {products.map((product) => (
                    <SelectItem key={String(product.id ?? product.number)}>{product.name}</SelectItem>
                  ))}
                </Select>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Número" labelPlacement="outside" value={productForm.number} onValueChange={(value) => setProductForm((current) => ({...current, number: value}))} classNames={{inputWrapper: 'premium-input', label: 'text-[var(--cream-soft)]'}} />
                  <Input label="Precio" labelPlacement="outside" value={productForm.price} onValueChange={(value) => setProductForm((current) => ({...current, price: value}))} classNames={{inputWrapper: 'premium-input', label: 'text-[var(--cream-soft)]'}} />
                </div>
                <Input label="Nombre" labelPlacement="outside" value={productForm.name} onValueChange={(value) => setProductForm((current) => ({...current, name: value}))} classNames={{inputWrapper: 'premium-input', label: 'text-[var(--cream-soft)]'}} />
                <Textarea label="Descripción" labelPlacement="outside" value={productForm.description} onValueChange={(value) => setProductForm((current) => ({...current, description: value}))} minRows={3} classNames={{inputWrapper: 'premium-input', label: 'text-[var(--cream-soft)]', input: 'premium-textarea'}} />
                <div className="grid gap-4 md:grid-cols-2">
                  <Select label="Categoría" labelPlacement="outside" selectedKeys={productForm.category_id ? [productForm.category_id] : []} onSelectionChange={(keys) => setProductForm((current) => ({...current, category_id: String(Array.from(keys)[0] ?? '')}))} classNames={{trigger: 'premium-input', label: 'text-[var(--cream-soft)]'}}>
                    {categories.map((category) => (
                      <SelectItem key={String(category.id ?? category.common_name)}>{category.common_name}</SelectItem>
                    ))}
                  </Select>
                  <Input label="Idioma" labelPlacement="outside" value={productForm.language} onValueChange={(value) => setProductForm((current) => ({...current, language: value}))} classNames={{inputWrapper: 'premium-input', label: 'text-[var(--cream-soft)]'}} />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <Input label="Disponible" labelPlacement="outside" value={productForm.available ? 'true' : 'false'} onValueChange={(value) => setProductForm((current) => ({...current, available: value !== 'false'}))} classNames={{inputWrapper: 'premium-input', label: 'text-[var(--cream-soft)]'}} />
                  <Input label="Picante" labelPlacement="outside" value={productForm.is_spicy ? 'true' : 'false'} onValueChange={(value) => setProductForm((current) => ({...current, is_spicy: value === 'true'}))} classNames={{inputWrapper: 'premium-input', label: 'text-[var(--cream-soft)]'}} />
                  <Input label="Solo adultos" labelPlacement="outside" value={productForm.is_adult_only ? 'true' : 'false'} onValueChange={(value) => setProductForm((current) => ({...current, is_adult_only: value === 'true'}))} classNames={{inputWrapper: 'premium-input', label: 'text-[var(--cream-soft)]'}} />
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button className="premium-button-primary" radius="sm" onPress={() => void handleCreateProduct()}>
                    Crear producto
                  </Button>
                  <Button className="premium-button-secondary" radius="sm" variant="bordered" onPress={() => void handleUpdateProduct()}>
                    Actualizar producto
                  </Button>
                </div>
                <div className="space-y-3 pt-2">
                  {products.slice(0, 4).map((product) => (
                    <button key={String(product.id ?? product.number)} type="button" onClick={() => setSelectedProductId(String(product.id ?? ''))} className="flex w-full items-center justify-between rounded-[0.9rem] border border-[rgba(201,168,76,0.12)] px-4 py-3 text-left transition hover:border-[rgba(240,208,128,0.3)]">
                      <span>
                        <span className="block premium-title text-lg text-(--cream)">{product.name}</span>
                        <span className="block text-xs uppercase tracking-[0.18em] text-(--cream-soft)">#{product.number} · {product.price}</span>
                      </span>
                      <Chip className="premium-chip border-0 text-[0.68rem] uppercase tracking-[0.2em]" variant="flat">
                        {product.available ? 'activo' : 'oculto'}
                      </Chip>
                    </button>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}