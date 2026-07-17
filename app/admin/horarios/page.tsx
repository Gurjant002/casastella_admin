'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react';
import { useAuth } from '@/features/admin/auth/auth-context';
import { getOpeningHours, setOpeningHours, OpeningHoursSchema } from '@/lib/api-client';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function HorariosPage() {
  const { token } = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [hours, setHours] = useState<OpeningHoursSchema[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingHours, setEditingHours] = useState<OpeningHoursSchema[]>([]);

  useEffect(() => {
    loadHours();
  }, [token]);

  const loadHours = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await getOpeningHours(token);
      setHours(data);
    } catch (err) {
      setError('Error al cargar horarios');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setEditingHours(JSON.parse(JSON.stringify(hours)));
    onOpen();
  };

  const handleSave = async () => {
    if (!token) return;
    setIsSaving(true);
    try {
      await setOpeningHours(token, editingHours);
      setHours(editingHours);
      onOpenChange();
      setError(null);
    } catch (err) {
      setError('Error al guardar horarios');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const updateHour = (index: number, field: 'start_time' | 'end_time', value: string) => {
    const updated = [...editingHours];
    updated[index] = { ...updated[index], [field]: value };
    setEditingHours(updated);
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="font-display text-4xl mb-2" style={{ color: 'var(--color-gold)' }}>Horarios</h1>
          <p className="font-body" style={{ color: 'var(--color-cream-muted)' }}>Configura los horarios de atención del restaurante</p>
        </div>
        <Button
          onPress={handleEdit}
          className="font-body font-semibold uppercase tracking-wider text-black"
          style={{ backgroundColor: 'var(--color-gold)' }}
        >
          ✏️ Editar Horarios
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border" style={{ backgroundColor: 'rgba(192, 57, 43, 0.1)', borderColor: 'var(--color-danger)' }}>
          <CardBody>
            <p className="font-body" style={{ color: '#ff9999' }}>{error}</p>
          </CardBody>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 mb-4" style={{ borderBottomColor: 'var(--color-gold)', borderWidth: '2px', borderTopColor: 'transparent', borderRightColor: 'transparent', borderLeftColor: 'transparent' }}></div>
          <p className="font-body" style={{ color: 'var(--color-cream-muted)' }}>Cargando horarios...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hours.map((hour, index) => (
            <Card key={index} className="border" style={{ backgroundColor: 'var(--admin-bg-card)', borderColor: 'var(--admin-border)' }}>
              <CardHeader className="flex flex-col gap-0 pb-2">
                <p className="font-display text-xl" style={{ color: 'var(--color-gold)' }}>{DAYS[index] || hour.day}</p>
              </CardHeader>
              <CardBody>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-body mb-1" style={{ color: 'var(--color-cream-muted)' }}>Apertura</p>
                    <p className="font-display text-lg" style={{ color: 'var(--color-cream)' }}>{hour.start_time}</p>
                  </div>
                  <p style={{ color: 'var(--color-cream-muted)' }}>→</p>
                  <div>
                    <p className="text-xs font-body mb-1" style={{ color: 'var(--color-cream-muted)' }}>Cierre</p>
                    <p className="font-display text-lg" style={{ color: 'var(--color-cream)' }}>{hour.end_time}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent style={{ backgroundColor: 'var(--admin-bg-card)' }}>
          <ModalHeader className="font-display text-2xl" style={{ color: 'var(--color-gold)' }}>Editar Horarios</ModalHeader>
          <ModalBody className="gap-6">
            {editingHours.map((hour, index) => (
              <div key={index} className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="font-body text-sm block mb-2" style={{ color: 'var(--color-cream-muted)' }}>
                    {DAYS[index] || hour.day}
                  </label>
                  <Input
                    type="time"
                    value={hour.start_time}
                    onChange={(e) => updateHour(index, 'start_time', e.target.value)}
                    classNames={{
                      input: 'font-body',
                    }}
                    style={{
                      '--input-bg': 'var(--color-black)',
                      '--input-text': 'var(--color-cream)',
                    } as React.CSSProperties}
                  />
                </div>
                <p style={{ color: 'var(--color-cream-muted)' }}>hasta</p>
                <div className="flex-1">
                  <Input
                    type="time"
                    value={hour.end_time}
                    onChange={(e) => updateHour(index, 'end_time', e.target.value)}
                    classNames={{
                      input: 'font-body',
                    }}
                    style={{
                      '--input-bg': 'var(--color-black)',
                      '--input-text': 'var(--color-cream)',
                    } as React.CSSProperties}
                  />
                </div>
              </div>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button
              onPress={() => onOpenChange()}
              className="font-body"
              style={{ backgroundColor: 'var(--admin-bg-hover)', color: 'var(--color-cream-muted)' }}
            >
              Cancelar
            </Button>
            <Button
              onPress={handleSave}
              isLoading={isSaving}
              className="font-body font-semibold uppercase tracking-wider text-black"
              style={{ backgroundColor: 'var(--color-gold)' }}
            >
              Guardar cambios
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
