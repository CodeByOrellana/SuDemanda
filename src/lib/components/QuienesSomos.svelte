<script lang="ts">
	let { id = 'quienes-somos' }: { id?: string } = $props();
</script>

<section id={id} aria-labelledby="quienes-somos-titulo">
	<div class="panel-gris">
		<div class="contenido">
		<h2 id="quienes-somos-titulo">Quiénes Somos</h2>
		<p class="lead">
			Sudemanda Abogados es un estudio jurídico que ofrece asesoría legal personalizada,
			integral y cercana, tanto en instancias judiciales como extrajudiciales.
		</p>

		<div class="bloques">
			<div>
				<h3>Fundación e Historia</h3>
				<p>
					Sudemanda Abogados surge el año 2008 tras la consolidación de la trayectoria de uno
					de sus socios fundadores, proveniente de destacados estudios jurídicos de Santiago,
					así como de organizaciones y empresas vinculadas a las áreas del Derecho Civil,
					Familia, Penal y Comercial.
				</p>
			</div>

			<div>
				<h3>Modelo de Asesoría Integral</h3>
				<p>
					El estudio ofrece una consultoría legal personalizada y orientada a las necesidades
					específicas de cada cliente, brindando acompañamiento continuo tanto en instancias
					judiciales (litigios) como extrajudiciales (negociaciones y acuerdos).
				</p>
			</div>

			<div>
				<h3>Enfoque Multidisciplinario</h3>
				<p>
					Aplica un abordaje holístico para la resolución de conflictos legales, combinando
					diversas especialidades del Derecho para proponer respuestas estratégicas e
					integrales a cada caso.
				</p>
			</div>

			<div>
				<h3>Desarrollo y Actualización Continua</h3>
				<p>
					A lo largo de su trayectoria, la firma ha incorporado nuevas prácticas y
					profesionales, fortaleciendo el desarrollo constante de sus miembros para
					responder con rigor técnico a la evolución jurisprudencial y legal del país.
				</p>
			</div>
		</div>
		</div>
	</div>
</section>

<style>
	.contenido {
		max-width: 52rem;
		margin: 0 auto;
	}

	section h3,
	.lead {
		color: var(--blue-dark);
	}

	#quienes-somos h2 {
		color: var(--blue-dark);
	}

	.lead {
		font-size: 1.375rem;
	}

	section p {
		color: var(--blue-dark);
	}

	.bloques {
		display: grid;
		gap: 0.5rem;
		margin-bottom: 2rem;
	}

	@media (min-width: 48rem) {
		.bloques {
			grid-template-columns: repeat(2, 1fr);
			gap: 1.5rem;
		}
	}
</style>