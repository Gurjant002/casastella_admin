'use client';

import {useEffect, useState} from 'react';
import {setOpeningHours, type OpeningHoursSchema, type CategoryModel, type ProductSchema} from '@/lib/api';
import {ADMIN_WEEK_DAYS} from '@/features/admin/constants';
import {useAdminSession} from '@/features/admin/auth/use-admin-session';
import {AdminRouteShell} from '@/features/admin/ui/admin-route-shell';
import {AdminMetricsStrip} from '@/features/admin/ui/admin-metrics-strip';

type AdminHorarioViewProps = {
  categories: CategoryModel[];
  products: ProductSchema[];
  openingHours: OpeningHoursSchema[];
};

export function AdminHorarioView({categories, products, openingHours}: AdminHorarioViewProps) {
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
      <section className="cs-panel cs-panel-strong p-6 md:p-8">
        <AdminMetricsStrip categories={categories.length} products={products.length} />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="floating-label" htmlFor="schedule-day">Día</label>
            <select id="schedule-day" className="input-luxury" value={scheduleForm.day_of_week} onChange={(event) => setSelectedDay(event.target.value)}>
              {ADMIN_WEEK_DAYS.map((day) => (
                <option key={day.value} value={day.value} className="bg-(--color-black) text-cs-cream">
                  {day.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="floating-label" htmlFor="schedule-status">Estado</label>
            <select id="schedule-status" className="input-luxury" value={scheduleForm.closed ? 'closed' : 'open'} onChange={(event) => setScheduleForm((current) => ({...current, closed: event.target.value === 'closed'}))}>
              <option value="open" className="bg-(--color-black) text-cs-cream">Abierto</option>
              <option value="closed" className="bg-(--color-black) text-cs-cream">Cerrado</option>
            </select>
          </div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="floating-label" htmlFor="morning-open">Apertura mañana</label>
            <input id="morning-open" className="input-luxury" value={scheduleForm.morning_open_time} onChange={(event) => setScheduleForm((current) => ({...current, morning_open_time: event.target.value}))} />
          </div>
          <div>
            <label className="floating-label" htmlFor="morning-close">Cierre mañana</label>
            <input id="morning-close" className="input-luxury" value={scheduleForm.morning_close_time} onChange={(event) => setScheduleForm((current) => ({...current, morning_close_time: event.target.value}))} />
          </div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="floating-label" htmlFor="afternoon-open">Apertura tarde</label>
            <input id="afternoon-open" className="input-luxury" value={scheduleForm.afternoon_open_time} onChange={(event) => setScheduleForm((current) => ({...current, afternoon_open_time: event.target.value}))} />
          </div>
          <div>
            <label className="floating-label" htmlFor="afternoon-close">Cierre tarde</label>
            <input id="afternoon-close" className="input-luxury" value={scheduleForm.afternoon_close_time} onChange={(event) => setScheduleForm((current) => ({...current, afternoon_close_time: event.target.value}))} />
          </div>
        </div>
        <button className="btn-primary mt-8 w-fit" type="button" onClick={() => void handleSaveSchedule()}>
          Guardar horario
        </button>
        {message ? <p className="mt-4 text-sm leading-6 text-cs-gold">{message}</p> : null}
      </section>
    </AdminRouteShell>
  );
}
