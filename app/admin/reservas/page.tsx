'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardBody } from '@heroui/react';
import { groupReservationsByDate, ReservationSchema, ReservationsByDateSchema, ReservationStatus, updateReservationStatus } from '@/lib/api';
import { useAuth } from '@/features/admin/auth/auth-context';

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const WEEKDAYS = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];

function dateKey(date: Date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function calendarDays(month: Date) {
	const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
	const offset = (firstDay.getDay() + 6) % 7;
	const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
	return Array.from({ length: Math.ceil((offset + days) / 7) * 7 }, (_, index) => {
		const day = index - offset + 1;
		return day > 0 && day <= days ? new Date(month.getFullYear(), month.getMonth(), day) : null;
	});
}

function formatDateTime(value: string) {
	return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

const statusLabels: Record<ReservationStatus, string> = {
	solicitado: 'Solicitada',
	reservado: 'Confirmada',
	cancelado: 'Cancelada',
};

export default function ReservasPage() {
	const { token } = useAuth();
	const [month, setMonth] = useState(() => new Date());
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const [groups, setGroups] = useState<ReservationsByDateSchema[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [updatingReservationId, setUpdatingReservationId] = useState<number | null>(null);
	const [error, setError] = useState<string | null>(null);

	const loadReservations = async () => {
		if (!token) return;
		setIsLoading(true);
		setError(null);
		try {
			const data = await groupReservationsByDate(200, token);
			setGroups(data);
			setSelectedDate((current) => current ?? data[0]?.date ?? dateKey(new Date()));
		} catch {
			setError('No se pudieron cargar las reservas.');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadReservations();
	}, [token]);

	const reservationsByDate = useMemo(() => new Map(groups.map((group) => [group.date.slice(0, 10), group])), [groups]);
	const selectedGroup = selectedDate ? reservationsByDate.get(selectedDate) : undefined;
	const days = calendarDays(month);

	const changeMonth = (offset: number) => {
		setMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
		setSelectedDate(null);
	};

	const handleStatusChange = async (reservationId: number, status: ReservationStatus) => {
		if (!token) return;
		setUpdatingReservationId(reservationId);
		setError(null);
		try {
			await updateReservationStatus(reservationId, status, token);
			await loadReservations();
		} catch {
			setError('No se pudo actualizar el estado de la reserva.');
		} finally {
			setUpdatingReservationId(null);
		}
	};

	return (
		<div className="p-5 sm:p-8">
			<header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="font-body text-xs uppercase tracking-[0.22em]" style={{ color: 'var(--color-cream-muted)' }}>Agenda del restaurante</p>
					<h1 className="font-display text-5xl" style={{ color: 'var(--color-gold)' }}>Reservas</h1>
					<p className="font-body mt-2" style={{ color: 'var(--color-cream-muted)' }}>Consulta la actividad por día y revisa cada mesa.</p>
				</div>
				<div className="flex items-center gap-2">
					<button type="button" aria-label="Mes anterior" onClick={() => changeMonth(-1)} className="h-10 w-10 border font-body text-xl" style={{ borderColor: 'var(--admin-border)', color: 'var(--color-gold)' }}>‹</button>
					<button type="button" aria-label="Mes siguiente" onClick={() => changeMonth(1)} className="h-10 w-10 border font-body text-xl" style={{ borderColor: 'var(--admin-border)', color: 'var(--color-gold)' }}>›</button>
				</div>
			</header>

			{error && <div className="mb-6 border p-4 font-body" style={{ borderColor: 'var(--color-danger)', color: '#ff9999' }}>{error}</div>}

			<div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
				<Card className="border" style={{ backgroundColor: 'var(--admin-bg-card)', borderColor: 'var(--admin-border)' }}>
					<CardBody className="p-4 sm:p-6">
						<div className="mb-6 flex items-center justify-between">
							<h2 className="font-display text-3xl capitalize" style={{ color: 'var(--color-cream)' }}>{MONTHS[month.getMonth()]} {month.getFullYear()}</h2>
							<span className="font-body text-sm" style={{ color: 'var(--color-cream-muted)' }}>{groups.length} días con reservas</span>
						</div>
						<div className="grid grid-cols-7 gap-1 sm:gap-2">
							{WEEKDAYS.map((weekday) => <div key={weekday} className="pb-2 text-center font-body text-xs uppercase tracking-wider" style={{ color: 'var(--color-cream-muted)' }}>{weekday}</div>)}
							{days.map((date, index) => {
								const key = date ? dateKey(date) : `empty-${index}`;
								const group = date ? reservationsByDate.get(key) : undefined;
								const selected = key === selectedDate;
								return (
									<button key={key} type="button" disabled={!date} onClick={() => date && setSelectedDate(key)} className="relative min-h-16 border p-2 text-left transition-colors sm:min-h-20" style={{ borderColor: selected ? 'var(--color-gold)' : 'var(--admin-border)', backgroundColor: selected ? 'rgba(201,168,76,0.13)' : group ? 'rgba(201,168,76,0.05)' : 'transparent', color: date ? 'var(--color-cream)' : 'transparent', cursor: date ? 'pointer' : 'default' }}>
										{date && <><span className="font-body text-sm">{date.getDate()}</span>{group && <span className="absolute bottom-2 left-2 right-2 block truncate font-body text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-gold)' }}>{group.total_reservations} {group.total_reservations === 1 ? 'reserva' : 'reservas'}</span>}</>}
									</button>
								);
							})}
						</div>
						<div className="mt-5 flex items-center gap-2 font-body text-xs" style={{ color: 'var(--color-cream-muted)' }}><span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--color-gold)' }} /> Día con reservas</div>
					</CardBody>
				</Card>

				<Card className="border" style={{ backgroundColor: 'var(--admin-bg-card)', borderColor: 'var(--admin-border)' }}>
					<CardBody className="p-5 sm:p-6">
						<div className="mb-5 flex items-end justify-between border-b pb-4" style={{ borderColor: 'var(--admin-border)' }}>
							<div><p className="font-body text-xs uppercase tracking-wider" style={{ color: 'var(--color-cream-muted)' }}>Detalle del día</p><h2 className="font-display text-3xl" style={{ color: 'var(--color-gold)' }}>{selectedDate ? new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long' }).format(new Date(`${selectedDate}T12:00:00`)) : 'Selecciona un día'}</h2></div>
							{selectedGroup && <span className="font-body text-sm" style={{ color: 'var(--color-cream-muted)' }}>{selectedGroup.total_guests} comensales</span>}
						</div>
						{isLoading ? <p className="py-8 text-center font-body" style={{ color: 'var(--color-cream-muted)' }}>Cargando reservas...</p> : selectedGroup?.reservations.length ? <div className="space-y-3">{selectedGroup.reservations.map((reservation: ReservationSchema) => <ReservationRow key={reservation.id} reservation={reservation} isUpdating={updatingReservationId === reservation.id} onStatusChange={handleStatusChange} />)}</div> : <p className="py-8 text-center font-body" style={{ color: 'var(--color-cream-muted)' }}>No hay reservas para este día.</p>}
					</CardBody>
				</Card>
			</div>
		</div>
	);
}

function ReservationRow({ reservation, isUpdating, onStatusChange }: { reservation: ReservationSchema; isUpdating: boolean; onStatusChange: (reservationId: number, status: ReservationStatus) => void }) {
	return <article className="border p-4" style={{ borderColor: 'var(--admin-border)', backgroundColor: 'rgba(0,0,0,0.15)' }}><div className="flex items-start justify-between gap-3"><div><p className="font-display text-xl" style={{ color: 'var(--color-cream)' }}>{reservation.guest_name}</p><p className="font-body text-sm" style={{ color: 'var(--color-cream-muted)' }}>{formatDateTime(reservation.reservation_datetime)} · {reservation.party_size} comensales</p></div><select aria-label={`Estado de la reserva de ${reservation.guest_name}`} value={reservation.status} disabled={isUpdating} onChange={(event) => onStatusChange(reservation.id, event.target.value as ReservationStatus)} className="border px-2 py-1 font-body text-[10px] uppercase tracking-wider outline-none" style={{ borderColor: 'var(--admin-border)', backgroundColor: 'var(--admin-bg-dark)', color: reservation.status === 'cancelado' ? '#ff9999' : 'var(--color-gold)', cursor: isUpdating ? 'wait' : 'pointer' }}><option value="solicitado">Solicitada</option><option value="reservado">Confirmada</option><option value="cancelado">Cancelada</option></select></div><div className="mt-3 space-y-1 font-body text-xs" style={{ color: 'var(--color-cream-muted)' }}><p>{reservation.guest_phone}{reservation.guest_email ? ` · ${reservation.guest_email}` : ''}</p>{reservation.notes && <p style={{ color: 'var(--color-cream)' }}>{reservation.notes}</p>}</div>{isUpdating && <p className="mt-2 font-body text-xs" style={{ color: 'var(--color-gold)' }}>Guardando estado...</p>}</article>;
}
