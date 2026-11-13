'use client';

import React, { useEffect, useState } from 'react';
import { Card, Label, Switch } from '@heroui/react';
import { Check } from 'lucide-react';
import { useAuth } from '@/features/admin/auth/auth-context';
import { getOpeningHours, setOpeningHours, OpeningHoursSchema } from '@/lib/api-client';
import { FormButton } from '@/features/admin/ui/button-components';

const DAYS: { label: string; key: string }[] = [
  { label: 'Lunes',     key: 'Monday' },
  { label: 'Martes',    key: 'Tuesday' },
  { label: 'Miércoles', key: 'Wednesday' },
  { label: 'Jueves',    key: 'Thursday' },
  { label: 'Viernes',   key: 'Friday' },
  { label: 'Sábado',    key: 'Saturday' },
  { label: 'Domingo',   key: 'Sunday' },
];

function timeInput(value: string, onChange: (v: string) => void, disabled?: boolean): React.ReactNode {
  return (
    <input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? 'var(--admin-bg-hover)' : 'var(--color-black)',
        color: disabled ? 'var(--admin-border)' : 'var(--color-cream)',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: 'var(--admin-border)',
        borderRadius: '0.5rem',
        padding: '0.5rem 0.75rem',
        fontFamily: 'var(--font-body)',
        fontSize: '0.9rem',
        outline: 'none',
        width: '100%',
        cursor: disabled ? 'not-allowed' : 'text',
      }}
      onFocus={(e) => { if (!disabled) { e.currentTarget.style.borderColor = 'var(--color-gold)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.1)'; } }}
      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--admin-border)'; e.currentTarget.style.boxShadow = 'none'; }}
    />
  );
}

export default function HorariosPage() {
  const { token } = useAuth();
  const [hours, setHours] = useState<Map<string, OpeningHoursSchema>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [applyClosed, setApplyClosed] = useState(false);
  const [applyMorningClosed, setApplyMorningClosed] = useState(false);
  const [applyMorningOpen, setApplyMorningOpen] = useState('');
  const [applyMorningClose, setApplyMorningClose] = useState('');
  const [applyAfternoonClosed, setApplyAfternoonClosed] = useState(false);
  const [applyAfternoonOpen, setApplyAfternoonOpen] = useState('');
  const [applyAfternoonClose, setApplyAfternoonClose] = useState('');

  useEffect(() => { loadHours(); }, [token]);

  const loadHours = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await getOpeningHours(token);
      const map = new Map<string, OpeningHoursSchema>();
      for (const h of data) {
        if (h.day_of_week) map.set(h.day_of_week, h);
      }
      setHours(map);
    } catch (err) {
      setError('Error al cargar horarios');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDay = (index: number) =>
    setSelectedDays((prev) => prev.includes(index) ? prev.filter((d) => d !== index) : [...prev, index]);

  const toggleAll = () =>
    setSelectedDays(selectedDays.length === 7 ? [] : [0, 1, 2, 3, 4, 5, 6]);

  const handleApply = async () => {
    if (!token || selectedDays.length === 0) {
      setError('Selecciona al menos un día');
      return;
    }
    /* if (!applyClosed && (!applyMorningOpen || !applyMorningClose)) {
      setError('Indica la hora de apertura y cierre de mañana (o marca como cerrado)');
      return;
    } */

    setIsSaving(true);
    setError(null);
    try {
      const updated = new Map(hours);
      await Promise.all(
        selectedDays.map(async (i) => {
          const key = DAYS[i].key;
          const existing = updated.get(key);
          const payload: OpeningHoursSchema = {
            ...existing,
            day_of_week: key,
            closed: applyClosed,
            is_morning_close: applyClosed || applyMorningClosed,
            morning_open_time: applyClosed || applyMorningClosed ? null : (applyMorningOpen || null),
            morning_close_time: applyClosed || applyMorningClosed ? null : (applyMorningClose || null),
            is_afternoon_close: applyClosed || applyAfternoonClosed,
            afternoon_open_time: applyClosed || applyAfternoonClosed ? null : (applyAfternoonOpen || null),
            afternoon_close_time: applyClosed || applyAfternoonClosed ? null : (applyAfternoonClose || null),
          };
          const saved = await setOpeningHours(token, payload);
          updated.set(key, saved);
        })
      );
      setHours(updated);
      setSelectedDays([]);
      setApplyMorningOpen('');
      setApplyMorningClose('');
      setApplyAfternoonOpen('');
      setApplyAfternoonClose('');
      setApplyMorningClosed(false);
      setApplyAfternoonClosed(false);
      setApplyClosed(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Error al guardar horarios');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const formatTime = (t?: string | null) => t || '—';

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl mb-2" style={{ color: 'var(--color-gold)' }}>Horarios</h1>
        <p className="font-body" style={{ color: 'var(--color-cream-muted)' }}>
          Selecciona uno o varios días y aplica el mismo horario a todos a la vez
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg p-4 border-2" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', borderColor: 'var(--color-danger)' }}>
          <p className="font-body font-semibold" style={{ color: '#ff9999' }}>⚠️ {error}</p>
        </div>
      )}
      {success && (
        <div className="mb-6 rounded-lg p-4 border-2" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', borderColor: 'var(--color-success)' }}>
          <p className="font-body font-semibold" style={{ color: '#86efac' }}>✓ Horarios guardados correctamente</p>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 mb-4" style={{ borderBottomColor: 'var(--color-gold)', borderWidth: '2px', borderTopColor: 'transparent', borderRightColor: 'transparent', borderLeftColor: 'transparent' }} />
          <p className="font-body" style={{ color: 'var(--color-cream-muted)' }}>Cargando horarios...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Lista de días */}
          <div className="lg:col-span-2">
            <Card className="border" style={{ backgroundColor: 'var(--admin-bg-card)', borderColor: 'var(--admin-border)' }}>
              <Card.Content className="p-0">
                {/* Cabecera */}
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--admin-border)' }}>
                  <span className="font-display text-lg" style={{ color: 'var(--color-gold)' }}>Días de la semana</span>
                  <button
                    type="button"
                    onClick={toggleAll}
                    className="flex items-center gap-2 font-body text-sm"
                    style={{ color: 'var(--color-cream-muted)' }}
                  >
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded border-2 transition-all" style={{ borderColor: selectedDays.length === 7 ? 'var(--color-gold)' : 'var(--admin-border)', backgroundColor: selectedDays.length === 7 ? 'var(--color-gold)' : 'transparent' }}>
                      {selectedDays.length === 7 && <span style={{ color: 'var(--color-black)', fontSize: '11px', fontWeight: 700 }}>✓</span>}
                    </span>
                    Seleccionar todos
                  </button>
                </div>

                {/* Cabecera de columnas */}
                <div className="grid grid-cols-12 gap-2 px-6 py-2 border-b" style={{ borderColor: 'var(--admin-border)' }}>
                  <div className="col-span-3" />
                  <div className="col-span-2 text-center">
                    <span className="font-body text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-cream-muted)' }}>Estado</span>
                  </div>
                  <div className="col-span-3 text-center">
                    <span className="font-body text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-cream-muted)' }}>Mañana</span>
                  </div>
                  <div className="col-span-4 text-center">
                    <span className="font-body text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-cream-muted)' }}>Tarde</span>
                  </div>
                </div>

                {DAYS.map((day, index) => {
                  const h = hours.get(day.key);
                  const selected = selectedDays.includes(index);
                  return (
                    <div
                      key={index}
                      onClick={() => toggleDay(index)}
                      className="grid grid-cols-12 gap-2 items-center px-6 py-4 cursor-pointer border-b last:border-b-0 transition-colors"
                      style={{
                        borderColor: 'var(--admin-border)',
                        backgroundColor: selected ? 'rgba(201, 168, 76, 0.08)' : 'transparent',
                      }}
                      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.backgroundColor = 'var(--admin-bg-hover)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = selected ? 'rgba(201, 168, 76, 0.08)' : 'transparent'; }}
                    >
                      {/* Checkbox + nombre */}
                      <div className="col-span-3 flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded border-2 flex-shrink-0 transition-all" style={{ borderColor: selected ? 'var(--color-gold)' : 'var(--admin-border)', backgroundColor: selected ? 'var(--color-gold)' : 'transparent' }}>
                          {selected && <span style={{ color: 'var(--color-black)', fontSize: '11px', fontWeight: 700 }}>✓</span>}
                        </span>
                        <span className="font-body font-semibold text-sm" style={{ color: selected ? 'var(--color-gold)' : 'var(--color-cream)' }}>
                          {day.label}
                        </span>
                      </div>

                      {/* Estado abierto/cerrado */}
                      <div className="col-span-2 flex justify-center">
                        {h?.closed ? (
                          <span className="font-body text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(220,38,38,0.15)', color: '#ff9999', border: '1px solid rgba(220,38,38,0.3)' }}>Cerrado</span>
                        ) : h ? (
                          <span className="font-body text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#86efac', border: '1px solid rgba(34,197,94,0.3)' }}>Abierto</span>
                        ) : (
                          <span className="font-body text-xs" style={{ color: 'var(--admin-border)' }}>—</span>
                        )}
                      </div>

                      {/* Horario mañana */}
                      <div className="col-span-3 text-center">
                        {h?.is_morning_close ? (
                          <span className="font-body text-xs" style={{ color: 'var(--color-cream-muted)' }}>Cerrado</span>
                        ) : !h?.closed && h?.morning_open_time ? (
                          <span className="font-display text-sm" style={{ color: 'var(--color-cream-muted)' }}>
                            {formatTime(h.morning_open_time)} – {formatTime(h.morning_close_time)}
                          </span>
                        ) : (
                          <span className="font-body text-xs" style={{ color: 'var(--admin-border)' }}>—</span>
                        )}
                      </div>

                      {/* Horario tarde */}
                      <div className="col-span-4 text-center">
                        {h?.is_afternoon_close ? (
                          <span className="font-body text-xs" style={{ color: 'var(--color-cream-muted)' }}>Cerrado</span>
                        ) : !h?.closed && h?.afternoon_open_time ? (
                          <span className="font-display text-sm" style={{ color: 'var(--color-cream-muted)' }}>
                            {formatTime(h.afternoon_open_time)} – {formatTime(h.afternoon_close_time)}
                          </span>
                        ) : (
                          <span className="font-body text-xs" style={{ color: 'var(--admin-border)' }}>—</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </Card.Content>
            </Card>
          </div>

          {/* Panel de edición */}
          <div className="lg:col-span-1">
            <Card className="border sticky top-8" style={{ backgroundColor: 'var(--admin-bg-card)', borderColor: selectedDays.length > 0 ? 'var(--color-gold)' : 'var(--admin-border)', transition: 'border-color 0.2s' }}>
              <Card.Content className="p-6 gap-5 flex flex-col">
                {/* Título */}
                <div>
                  <h3 className="font-display text-xl mb-1" style={{ color: 'var(--color-gold)' }}>Aplicar horario</h3>
                  <p className="font-body text-sm" style={{ color: 'var(--color-cream-muted)' }}>
                    {selectedDays.length === 0
                      ? 'Selecciona uno o más días'
                      : selectedDays.length === 1
                      ? `1 día: ${DAYS[selectedDays[0]].label}`
                      : `${selectedDays.length} días seleccionados`}
                  </p>
                </div>

                {/* Chips */}
                {selectedDays.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {[...selectedDays].sort().map((i) => (
                      <span key={i} className="font-body text-xs px-3 py-1 rounded-full font-semibold" style={{ backgroundColor: 'rgba(201,168,76,0.15)', color: 'var(--color-gold)', border: '1px solid rgba(201,168,76,0.3)' }}>
                        {DAYS[i].label}
                      </span>
                    ))}
                  </div>
                )}

                <div className="border-t" style={{ borderColor: 'var(--admin-border)' }} />

                {/* Toggle abierto / cerrado */}
                <div className="flex rounded-lg overflow-hidden border-2" style={{ borderColor: 'var(--admin-border)' }}>
                  <button
                    type="button"
                    onClick={() => setApplyClosed(false)}
                    className="flex-1 py-2 font-body font-semibold text-sm transition-all"
                    style={{
                      backgroundColor: !applyClosed ? 'rgba(34,197,94,0.15)' : 'transparent',
                      color: !applyClosed ? '#86efac' : 'var(--color-cream-muted)',
                      borderRight: '1px solid var(--admin-border)',
                    }}
                  >
                    ✓ Abierto
                  </button>
                  <button
                    type="button"
                    onClick={() => setApplyClosed(true)}
                    className="flex-1 py-2 font-body font-semibold text-sm transition-all"
                    style={{
                      backgroundColor: applyClosed ? 'rgba(220,38,38,0.15)' : 'transparent',
                      color: applyClosed ? '#ff9999' : 'var(--color-cream-muted)',
                    }}
                  >
                    ✗ Cerrado
                  </button>
                </div>

                {!applyClosed && (
                  <>
                    {/* Mañana */}
                    <div>
                      <p className="font-display text-sm mb-3" style={{ color: 'var(--color-gold)' }}>Mañana</p>
                      <Switch
                        isSelected={applyMorningClosed}
                        onChange={setApplyMorningClosed}
                        className="mb-3"
                      >
                        <Switch.Content>
                          <Switch.Control>
                            <Switch.Thumb>
                              <Switch.Icon><Check className="size-3" /></Switch.Icon>
                            </Switch.Thumb>
                          </Switch.Control>
                          <Label className="font-body text-sm" style={{ color: 'var(--color-cream-muted)' }}>Cerrado por la mañana</Label>
                        </Switch.Content>
                      </Switch>
                      {!applyMorningClosed && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="font-body text-xs block mb-1" style={{ color: 'var(--color-cream-muted)' }}>Apertura *</label>
                            {timeInput(applyMorningOpen, setApplyMorningOpen)}
                          </div>
                          <div>
                            <label className="font-body text-xs block mb-1" style={{ color: 'var(--color-cream-muted)' }}>Cierre *</label>
                            {timeInput(applyMorningClose, setApplyMorningClose)}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Tarde */}
                    <div>
                      <p className="font-display text-sm mb-3" style={{ color: 'var(--color-gold)' }}>
                        Tarde <span className="font-body text-xs font-normal" style={{ color: 'var(--color-cream-muted)' }}>(opcional)</span>
                      </p>
                      <Switch
                        isSelected={applyAfternoonClosed}
                        onChange={setApplyAfternoonClosed}
                        className="mb-3"
                      >
                        <Switch.Content>
                          <Switch.Control>
                            <Switch.Thumb>
                              <Switch.Icon><Check className="size-3" /></Switch.Icon>
                            </Switch.Thumb>
                          </Switch.Control>
                          <Label className="font-body text-sm" style={{ color: 'var(--color-cream-muted)' }}>Cerrado por la tarde</Label>
                        </Switch.Content>
                      </Switch>
                      {!applyAfternoonClosed && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="font-body text-xs block mb-1" style={{ color: 'var(--color-cream-muted)' }}>Apertura</label>
                            {timeInput(applyAfternoonOpen, setApplyAfternoonOpen)}
                          </div>
                          <div>
                            <label className="font-body text-xs block mb-1" style={{ color: 'var(--color-cream-muted)' }}>Cierre</label>
                            {timeInput(applyAfternoonClose, setApplyAfternoonClose)}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <FormButton
                  onClick={handleApply}
                  variant="primary"
                  size="lg"
                  isLoading={isSaving}
                  disabled={selectedDays.length === 0}
                  fullWidth
                >
                  Guardar cambios
                </FormButton>
              </Card.Content>
            </Card>
          </div>

        </div>
      )}
    </div>
  );
}
