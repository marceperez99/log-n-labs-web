# Log N Labs: website copy (v2)

Version 2.0 · 15 November 2026. The positioning comes from [ESTRATEGIA.md](ESTRATEGIA.md).

This file is the source of truth for the site copy. The home copy is already applied to `variations/v1-preciso/index.html`. The other variations still carry the v1 copy.

Text in `[brackets]` is a value the owners still have to provide. Don't invent it.

---

## 1. Writing rules

### 1.1 Voice

- **Neutral Spanish, addressed as tú.** "Registra", "necesitas", "tu negocio". No *voseo* ("querés", "escribinos") and no Spain-only forms ("vosotros", "ordenador").
- **Main angle: what escapes when nothing is tracked.** Lines like "que no se te escape ninguna venta" and "digitaliza tu negocio" always name the concrete loss right after: an unanswered message, an order on paper, ad spend nobody measured.
- **Neutral tone.** Describe the loss as a fact, not a threat. No exclamation marks, countdowns, fake scarcity or flattery.
- Plain words a shop owner uses: *venta, pedido, cobro, factura, anuncio, cliente*. Technical words only when the reader needs them: *SIFEN, QR, Meta*.

### 1.2 AI-slop patterns we avoid

Compiled from Wikipedia's "Signs of AI writing" guide (via [FlowingData](https://flowingdata.com/2025/10/20/signs-of-ai-writing-on-wikipedia/)), [Pangram](https://www.pangram.com/es/resources/most-common-ai-phrases) and [Infobae](https://www.infobae.com/tecno/2024/07/03/estas-son-las-palabras-que-revelan-que-un-texto-fue-escrito-con-inteligencia-artificial/), plus the generic agency copy seen in the local market.

| Pattern | Examples to avoid | Do this instead |
|---|---|---|
| Inflated verbs | potenciar, impulsar, transformar, revolucionar, llevar al siguiente nivel, maximizar | Say what changes: "registrar cada pedido", "medir el costo por venta" |
| Empty adjectives | innovador, integral, de vanguardia, robusto, disruptivo, dinámico, único, a medida de sus sueños | Name the feature, or cut the word |
| Agency jargon | soluciones integrales, ecosistema digital, sinergia, experiencias memorables, presencia digital 360 | Name the deliverable: logo, campaña, sitio, integración |
| Era openers | "En la era digital…", "En el mundo actual…", "Hoy más que nunca…" | Start with the fact |
| Negative parallelism | "No es solo X, es Y", "Más que una agencia, un socio" | Make the claim directly |
| Reflex triads | Groups of three adjectives or verbs in every sentence | Use the real number of items; vary sentence length |
| Hedging fillers | cabe destacar, es importante mencionar, en este sentido, por ende | Delete them |
| Vague quantities | diversos, numerosos, múltiples, miles de clientes | A real number, or nothing |
| Unverifiable claims | "+100 clientes felices", "resultados garantizados", "líderes del mercado" | Only publish figures with a source or client permission |
| Typography tells | em dashes (—) as commas, title-case headings, emoji, bold in every line | Commas and full stops; sentence case; bold only for scanning |
| Rhetorical questions in a row | "¿Querés vender más? ¿Cansado de…?" | At most one question, only where a form asks one |

### 1.3 Self-check before publishing

1. Could this sentence appear on any agency's site? If so, rewrite it with something only Log N Labs does.
2. Is there a number, a deadline or a concrete object in the paragraph?
3. Read it aloud: does it sound like someone explaining their work at a meeting?

---

## 2. Home (`/`)

**SEO**
- Title: `Log N Labs | Digitalización y marketing para pymes en Paraguay`
- Description: `Registra cada consulta, pedido y venta de tu negocio. Campañas, identidad visual y software para pymes de Paraguay que venden por WhatsApp, redes sociales y en su local.`
- Open Graph title: `Log N Labs | Que no se te escape ninguna venta`

### Hero

- Label: `marketing + software`
- H1: **Que no se te escape ninguna venta.**
- Lead: Mensajes que quedaron sin respuesta, pedidos anotados en un papel, anuncios que nadie sabe si funcionaron. Digitalizamos tu negocio para que cada consulta y cada venta quede registrada, y sepas cuánto te costó conseguirla.
- Alternative H1 for ads and social: "No dejes que tu negocio se te escape de las manos."
- Buttons: `Hablemos` · `Ver servicios`
- Nav: El problema · Servicios · Para quién · Equipo · Contacto

Rotator (cell 2):

| Name | Sentence | Chips |
|---|---|---|
| Marketing | Estrategia, identidad visual y campañas en Meta y Google, evaluadas por las ventas que generan. | Estrategia · Identidad visual · Anuncios |
| Software | Sitios, sistemas e integraciones con WhatsApp, pagos con QR y el proveedor de factura electrónica que ya usas. | Desarrollo · Integraciones · QA |
| Cuaderno | Cada pedido de WhatsApp queda registrado con el anuncio que lo originó, su cobro y su factura. En desarrollo. | Pedidos · Cobros · Reportes |

Small cells: `Hablemos.` + WhatsApp + correo · `cómo trabajamos`: 01 Diagnóstico · 02 Plan · 03 Puesta en marcha · 04 Medición · Asunción, Paraguay, GMT−3 · O(log n)

### El problema (`#enfoque`)

- Label: `el problema`
- Statement: Lo que no se registra se pierde. Si no sabes cuántas consultas recibiste esta semana ni cuántas terminaron en venta, el negocio se te está escapando de las manos.
- What escapes:
  - **Consultas sin respuesta.** Un mensaje que espera horas en WhatsApp puede terminar en una compra a otro negocio.
  - **Anuncios sin medir.** Se invierte cada mes sin saber qué campaña trajo ventas y cuál no trajo ninguna.
  - **Pedidos en papel.** Entre el cuaderno, la planilla y el sistema de facturación, los datos se repiten y algunos pedidos se pierden.
- Chart: y axis `trabajo` · x axis `clientes atendidos` · lines `sin registro` / `con registro digital`
  - Sin registro: cada cliente nuevo suma el mismo trabajo manual.
  - Con registro digital: los clientes aumentan y el trabajo crece mucho más despacio.
- The former principles move to the landings and FAQ: costo por venta en guaraníes, un solo registro, todo a nombre del cliente.
- Table caption (kept): Pasos para encontrar un dato entre n.

### Servicios (`#servicios`)

H2: **Qué hacemos.**

**01 · 1/2 · Marketing**. Estrategia · Identidad visual · Anuncios
Campañas que se evalúan por las ventas que generan. La inversión publicitaria la pagas directamente a Meta o Google, sin intermediarios.

| Item | Line |
|---|---|
| Estrategia de marketing | Público, oferta, canales y presupuesto, por escrito y con metas medibles. |
| Identidad visual | Logo, colores, tipografía y plantillas para redes, catálogo y local. |
| Campañas en Meta y Google | Configuración, piezas para los anuncios y ajustes cada semana. |
| Medición de ventas | Seguimiento de cada conversación de WhatsApp hasta la venta. |
| Reporte mensual | Inversión, conversaciones, ventas y costo por venta, en guaraníes. |

Link: `Ver Marketing`

**02 · 1/4 · Software**. Desarrollo · Integraciones · QA
Sitios web, sistemas a medida y conexiones entre WhatsApp, los pagos con QR y el proveedor de factura electrónica que ya usa tu empresa.
Link: `Ver Software`

**03 · 1/4 · Cuaderno**. Pedidos · Cobros · Reportes
Una herramienta para registrar los pedidos de WhatsApp con su anuncio de origen, su cobro y su factura. Está en desarrollo y buscamos comercios para la prueba piloto.
Link: `Sumarse al piloto` → contacto

### Para quién (`#para-quien`)

H2: **Para quién trabajamos.**
Note: Los casos se publicarán con cifras reales y con permiso de cada cliente.

| Situation | Sectors | Text |
|---|---|---|
| Tienda que vende por Instagram y WhatsApp | ropa · cosmética · accesorios | Los pedidos llegan por chat y se anotan a mano. Ordenamos el catálogo, medimos qué anuncio trae cada venta y conectamos el cobro con QR. |
| Servicio que trabaja con turnos | clínicas · talleres · estética | Los turnos se agendan por WhatsApp y algunos clientes no se presentan. Organizamos la agenda, los recordatorios y las campañas por zona. |
| Comercio con local y factura electrónica | ferretería · repuestos · alimentos | Ya emites factura electrónica, pero cargas los mismos datos dos veces. Conectamos ventas, stock y facturación para cargarlos una sola vez. |

Once there are case studies, this section becomes **Casos** (project, sector, a result in numbers).

### Cómo trabajamos (`#proceso`)

H2: **Cómo trabajamos.** Lead: Diagnóstico · Plan · Puesta en marcha · Medición

| Step | Text | Resultado |
|---|---|---|
| 01 Diagnóstico | Revisamos cómo te llegan hoy los clientes, cómo cobras y cómo facturas, y dónde se pierden ventas. Dura `[N]` días. | Un informe con lo que conviene cambiar y cuánto cuesta. |
| 02 Plan | Definimos alcance, plazos, precio y las métricas con las que se va a evaluar el trabajo. | Una propuesta por escrito para aprobar. |
| 03 Puesta en marcha | Diseñamos, programamos y configuramos. Cada entrega se prueba antes de publicarse. | Entregas probadas y documentadas. |
| 04 Medición | Cada mes revisamos los números contigo y ajustamos campañas y sistemas. | Un reporte mensual con el costo por venta. |

### Equipo (`#equipo`)

H2: **Quiénes hacen el trabajo.**
Note: Un mismo equipo atiende marketing y software, así no tienes que coordinar varios proveedores.

- **Entender · Análisis y procesos.** Relevamos cómo funciona tu negocio y dejamos por escrito qué se va a hacer antes de empezar.
- **Construir · Desarrollo.** Programamos sitios, sistemas e integraciones con las herramientas de pago y facturación que ya se usan en Paraguay.
- **Verificar · Calidad.** Probamos cada entrega antes de que llegue a tus clientes.
- **Marca y marketing.** Estrategia, diseño y campañas. Análisis define el objetivo, desarrollo instala la medición y calidad revisa cada pieza antes de publicarla.

### Contacto (`#contacto`)

- H2: **Hablemos.** Rows: `[NÚMERO WHATSAPP]` · `[CORREO]` · Asunción, Paraguay
- Fields:
  - **Nombre o empresa.** Error: "Escribe tu nombre o el de tu empresa."
  - **Correo o WhatsApp.** Error: "Deja un correo o un número para responderte."
  - **¿Qué necesitas?** Options: Marketing · Software · Prueba piloto de Cuaderno · Todavía no lo sé
  - **Más detalles (opcional).** Hint: "El mensaje se completa con los datos de arriba y se puede editar."
- Generated message: "Hola, soy [Nombre]. Quisiera consultar sobre marketing y software."
- Buttons: Enviar consulta · Enviar por WhatsApp · Enviar por correo · Copiar mensaje

### Footer

Tagline: Marketing y software para pymes de Paraguay. Que no se te escape ninguna venta.
Status line: Asunción, PY · GMT−3 · Recibimos proyectos nuevos · `--:--`

---

## 3. Marketing landing (`/marketing`)

**SEO**
- Title: `Marketing para pymes en Paraguay | Log N Labs`
- Description: `Estrategia, identidad visual y campañas en Meta y Google con reporte mensual de costo por venta.`

- **Hero H1:** Que tu inversión en anuncios no se pierda.
- **Lead:** Planificamos, diseñamos y administramos anuncios para pymes que venden por WhatsApp y redes sociales. Cada mes te informamos cuánto invertiste, cuántas conversaciones llegaron y cuántas terminaron en venta.
- **Halving square labels** (kept): Todo el mercado → Tu rubro → Tu zona → Buscan lo que vendes → Listos para comprar → Su cliente

**El problema**
Muchos servicios de redes sociales se cobran por cantidad de publicaciones. Al final del mes hay un informe de alcance y "me gusta", pero nadie sabe qué ventas trajo la inversión. Sin ese dato no se puede decidir si conviene invertir más, menos o en otro lugar.

**Servicios**

1. **Estrategia.** Público, oferta, canales, presupuesto y metas. Entregables: documento de estrategia · calendario de campañas · metas por mes
2. **Identidad visual.** Para negocios sin marca definida o con piezas que no se parecen entre sí. Entregables: logo y variantes · paleta y tipografía · plantillas para redes · guía de uso
3. **Campañas.** Meta (Facebook, Instagram, WhatsApp) y Google. Entregables: configuración de cuentas y medición · piezas para los anuncios · ajustes semanales · reporte mensual

**Ciclo mensual**: 01 Planificar · 02 Publicar · 03 Medir · 04 Ajustar

**Reporte mensual (example; values as "—")**: Inversión Gs. — · Conversaciones — · Ventas — · Costo por venta Gs. — · Campaña con mejor resultado —

**Planes** (prices pending):
- **Identidad**: proyecto único, `[desde Gs. —]`
- **Campañas**: mensual, `[desde Gs. —]`, inversión publicitaria aparte
- **Marketing y medición**: mensual, `[desde Gs. —]`, campañas + conexión con ventas y facturación

**Preguntas**
- *¿La inversión en anuncios está incluida?* No. La pagas directamente a Meta o Google con una tarjeta de tu empresa. Así ves exactamente cuánto invertiste.
- *¿De quién son las cuentas?* De tu empresa. Nosotros trabajamos con acceso de administrador, que se puede retirar en cualquier momento.
- *¿Cuánto tarda en verse un resultado?* El primer reporte con datos se entrega al cerrar el primer mes completo de campañas. `[confirmar plazo]`
- *¿Hay contrato de permanencia?* `[definir]`

**CTA band:** Pide un diagnóstico de tus campañas actuales y averigua dónde se pierden ventas. · `Hablemos`

---

## 4. Software landing (`/software`)

**SEO**
- Title: `Desarrollo de software para pymes en Paraguay | Log N Labs`
- Description: `Sitios web, sistemas a medida e integraciones con WhatsApp, pagos QR y factura electrónica.`

- **Hero H1:** Que ningún pedido se quede en un papel.
- **Lead:** Digitalizamos los pedidos, el stock y la facturación de tu negocio con sitios, sistemas e integraciones. Trabajamos con las herramientas que ya existen en Paraguay: WhatsApp Business, pagos con QR y los proveedores de factura electrónica habilitados por la DNIT.
- **Binary search animation** (kept as the brand device).

**Señales de que hace falta** (señales)
- Los pedidos se copian del chat a una planilla y de la planilla al sistema de facturación.
- Nadie sabe cuánto stock queda sin contar a mano.
- El sitio web no se puede actualizar sin llamar a alguien.
- La empresa fue designada para emitir factura electrónica y el sistema actual no se conecta con el proveedor.

**Qué construimos**
- 1/2 **Integraciones**: conexión entre WhatsApp, pagos con QR o link, planillas, sistemas existentes y el proveedor de factura electrónica.
- 1/4 **Sitios y catálogos**: sitio web, catálogo de productos y formularios que llegan a WhatsApp.
- 1/4 **Sistemas a medida**: pedidos, stock, turnos o cuentas de clientes, cuando una herramienta existente no alcanza.
- **Calidad (QA) y auditoría**: revisión de software existente antes de ampliarlo o reemplazarlo.

**Principios**
- No construimos lo que ya existe y funciona. Si una herramienta del mercado resuelve el problema, te la recomendamos.
- El código, los accesos y la documentación quedan a tu nombre. `[confirmar declaración de propiedad del código]`
- Cada entrega se prueba antes de publicarse.

**Proceso (5 pasos):** 01 Diagnóstico · 02 Alcance y precio cerrados · 03 Desarrollo en entregas de `[N]` semanas · 04 Pruebas · 05 Publicación y soporte

**Planes** (prices pending): Proyecto cerrado `[desde Gs. —]` · Mantenimiento mensual `[desde Gs. —]` · Horas de soporte `[desde Gs. —]`

**Preguntas**
- *¿Ustedes emiten la factura electrónica?* No. Conectamos tu sistema con un proveedor habilitado por la DNIT o con el que ya usas.
- *¿Qué pasa si el proyecto cambia a mitad de camino?* Los cambios se cotizan por separado antes de hacerlos.
- *¿Qué soporte hay después de publicar?* `[definir condiciones y tiempo de respuesta]`

**CTA band:** Cuéntanos qué tarea se repite todos los días en tu negocio. · `Hablemos`

---

## 5. Product page (`/cuaderno`, after the pilot starts)

**SEO**
- Title: `Cuaderno | Pedidos de WhatsApp con cobro y factura`
- Description: `Registro de pedidos de WhatsApp con su anuncio de origen, su cobro y su factura, en un solo lugar.`

- **H1:** Que ningún pedido de WhatsApp se te escape.
- **Lead:** Cada conversación de WhatsApp que termina en venta queda registrada con el anuncio que la originó, el cobro con QR o link y la factura emitida por tu proveedor. Al final de la semana se ve cuánto costó cada venta.
- **Estado:** En desarrollo. Prueba piloto gratuita para `[N]` comercios a partir de `[mes 2027]`.

**Cómo funciona**
1. Llega una conversación por WhatsApp.
2. Se registra el pedido con un toque, con el anuncio de origen.
3. Se envía el link de pago o el QR.
4. Al confirmarse el pago, se emite la factura con tu proveedor.
5. El reporte semanal muestra ventas y costo por venta por campaña.

**Qué no hace:** no reemplaza al sistema de facturación ni a la contabilidad. Se conecta con ellos.

**CTA:** Sumarse a la prueba piloto · form option "Prueba piloto de Cuaderno"

---

## 6. Still to confirm with the owners

WhatsApp number · email · social links · all prices · `[N]` días/semanas · support terms and response time · code ownership statement · minimum contract · product name check at DINAPI · pilot start month.
