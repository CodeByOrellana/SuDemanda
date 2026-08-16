export const site = {
	name: 'SuDemanda',
	dominio: 'sudemanda.cl',
	lema: 'Defensa y asesoría legal a tu alcance',
	email: 'leojuridico@gmail.com',
	telefono: '+56 9 44170661',
	direccion: '256 Sta. Lucía, 8320190 Santiago, Región Metropolitana'
};

export let servicios = $state([
	{
		slug: 'derecho-civil',
		titulo: 'Derecho Civil',
		descripcion: 'Contratos, responsabilidad civil, arrendamientos y cobranzas.'
	},
	{
		slug: 'derecho-de-familia',
		titulo: 'Derecho de Familia',
		descripcion: 'Divorcios, pensión de alimentos, tuición y regulación de visitas.'
	},
	{
		slug: 'derecho-laboral',
		titulo: 'Derecho Laboral',
		descripcion: 'Despidos injustificados, tutela de derechos y demandas laborales.'
	},
	{
		slug: 'derecho-penal',
		titulo: 'Derecho Penal',
		descripcion: 'Defensa penal en todas las etapas del procedimiento.'
	},
	{
		slug: 'derecho-comercial',
		titulo: 'Derecho Comercial',
		descripcion: 'Constitución de sociedades, contratos y asesoría a pymes.'
	},
	{
		slug: 'derecho-de-consumidor',
		titulo: 'Derecho del Consumidor',
		descripcion: 'Reclamos ante SERNAC y demandas por protección del consumidor.'
	}
]);

export let pasos = $state([
	{
		titulo: 'Cúentame tu caso',
		descripcion: 'Agenda una consulta y describe tu situación legal.'
	},
	{
		titulo: 'Evaluación',
		descripcion: 'Analizamos los antecedentes y definimos la mejor estrategia.'
	},
	{
		titulo: 'Plan de acción',
		descripcion: 'Te proponemos el camino más eficiente y el presupuesto.'
	},
	{
		titulo: 'Representación',
		descripcion: 'Te acompañamos en todo el proceso hasta su resolución.'
	}
]);

export let navItems = $state([
	{ href: '#inicio', label: 'Inicio' },
	{ href: '#servicios', label: 'Servicios' },
	{ href: '#proceso', label: 'Cómo trabajamos' },
	{ href: '#contacto', label: 'Contacto' }
]);
