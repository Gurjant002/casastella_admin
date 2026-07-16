'use client';

import {useEffect, useState} from 'react';
import {Button, Card, CardBody, Select, SelectItem, Input} from '@heroui/react';
import {setOpeningHours, type OpeningHoursSchema, type CategoryModel, type ProductSchema} from '@/lib/api';
import {ADMIN_WEEK_DAYS} from '@/features/admin/constants';
import {useAdminSession} from '@/features/admin/auth/use-admin-session';
import {AdminRouteShell} from '@/features/admin/ui/admin-route-shell';

type HorarioClientProps = {
  categories: CategoryModel[];
  products: ProductSchema[];
  openingHours: OpeningHoursSchema[];
};

export function HorarioClient({categories, products, openingHours}: HorarioClientProps) {
  const {token} = useAdminSession();
  const [message, setMessage] = useState('');
  const [selectedDay, setSelectedDay] = useState(ADMIN_WEEK_DAYS[0].value);
  const [scheduleForm, setScheduleForm] = useState({
    day_of_week: ADMIN_WEEK_DAYS[0].value,
    morning_open_time: '13:00',
    morning_close_time: '16:00',
    afternoon_open_time: '20:00',
    afternoon_close_time: '23:30',
    closed: false,
  });

  useEffect(() => {
    setScheduleForm((current) => ({...current, day_of_week: selectedDay}));
    const existingDay = openingHours.find((item) => item.day_of_week === selectedDay);
    if (!existingDay) {
      return;
    }

    setScheduleForm({
      day_of_week: existingDay.day_of_week,
      morning_open_time: existingDay.morning_open_time ?? '',
      morning_close_time: existingDay.morning_close_time ?? '',
      afternoon_open_time: existingDay.afternoon_open_time ?? '',
      afternoon_close_time: existingDay.afternoon_close_time ?? '',
      closed: existingDay.closed ?? false,
    });
  }, [openingHours, selectedDay]);

  async function handleSaveSchedule() {
    setMessage('');
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
      setMessage('Horario guardado correctamente.');
    } catch {
      setMessage('No se pudo guardar el horario.');
    }
  }

  return (
    <AdminRouteShell title="Edición de horario" description="Lógica específica de horario en su propia ruta.">
      <Card className="premium-card border border-[rgba(201,168,76,0.18)] bg-transparent">
        <CardBody className="gap-5 p-6 md:p-8">
          <div className="flex gap-3">
            <span className="premium-kicker">{categories.length} categorías</span>
            <span className="premium-kicker">{products.length} productos</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Select label="Día" labelPlacement="outside" selectedKeys={[scheduleForm.day_of_week]} onSelectionChange={(keys) => setSelectedDay(String(Array.from(keys)[0] ?? ADMIN_WEEK_DAYS[0].value))} classNames={{trigger: 'premium-input', label: 'text-[var(--cream-soft)]'}}>
              {ADMIN_WEEK_DAYS.map((day) => (
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
          <Button className="premium-button-primary w-fit" radius="sm" onPress={() => void handleSaveSchedule()}>
            Guardar horario
          </Button>
          {message ? <p className="text-sm leading-6 text-(--gold-hover)">{message}</p> : null}
        </CardBody>
      </Card>
    </AdminRouteShell>
  );
}