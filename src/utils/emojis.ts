// Emojis del selector de iconos. Cada línea es "emoji palabras clave"; la búsqueda mira esas palabras
// (en español, sin tildes ni mayúsculas) y el nombre del grupo.
const raw: Record<string, string> = {
  Trabajo: `
📁 carpeta archivo
📂 carpeta abierta
💼 maletin trabajo cartera
📋 portapapeles lista
📌 chincheta fijar
📍 ubicacion marcador
📎 clip adjunto
🖇️ clips
📅 calendario fecha
📆 calendario fecha
🗓️ agenda calendario
📈 grafica subida crecimiento
📊 grafico barras estadisticas
📉 grafica bajada
🗂️ fichas organizar indices
🗃️ archivador cajon
🗄️ archivo armario
📇 tarjetero contactos
🧾 recibo factura ticket
✉️ carta sobre correo email
📨 correo recibido
📧 email correo
📞 telefono llamada
☎️ telefono fijo
📠 fax
🏢 oficina edificio empresa
🏦 banco
💰 dinero bolsa
💵 dinero billete dolar
💶 dinero euro billete
💳 tarjeta credito pago
🧮 abaco calculo cuentas
📦 paquete caja envio
🏷️ etiqueta precio
🔖 marcador
🖨️ impresora
📑 documentos pestañas
📄 documento hoja
📃 documento pagina
🗒️ bloc notas
🗞️ periodico noticias
📰 periodico noticias
🪪 identificacion carnet
🤝 acuerdo trato apreton
👔 corbata camisa formal
📢 megafono anuncio
`,
  Código: `
💻 portatil ordenador codigo
🖥️ ordenador escritorio pantalla
⌨️ teclado
🖱️ raton
🖲️ trackball
🧑‍💻 programador desarrollador
👨‍💻 programador desarrollador
👩‍💻 programadora desarrolladora
🐍 python serpiente
☕ cafe java
🦀 rust cangrejo
🐳 docker ballena contenedor
🐧 linux pinguino
🦊 firefox zorro
🐙 git pulpo github
🐘 php elefante postgres
🐹 go golang
💎 ruby gema
⚙️ ajustes engranaje configuracion
🛠️ herramientas
🔧 llave herramienta
🔩 tornillo
🔨 martillo
🧩 pieza puzzle plugin
🧪 prueba test experimento
🐛 bug error insecto
🪲 bug escarabajo
🔌 enchufe conexion api
💾 disco guardar
💿 cd disco
🌐 web internet mundo
📡 antena senal
🛰️ satelite
🔒 candado seguridad
🔓 abierto candado
🔑 llave clave contraseña
🛡️ escudo seguridad proteccion
🤖 robot ia bot
👾 alien videojuego
🕹️ joystick mando
🧬 adn genetica
📟 buscapersonas
🔍 lupa buscar
🔎 lupa buscar
🧱 ladrillo muro firewall
⚡ rayo electricidad rapido
🔗 enlace link cadena
`,
  Tareas: `
✅ hecho completado correcto
☑️ casilla marcada check
✔️ visto check
❌ cruz error cancelar
❎ cruz equis
⭕ circulo
🚫 prohibido
⛔ prohibido entrada
❓ pregunta duda
❗ exclamacion importante
‼️ importante
⚠️ aviso advertencia peligro
📝 nota apuntar escribir
✏️ lapiz escribir
🖊️ boligrafo escribir
🖋️ pluma escribir
🖌️ pincel pintar
🖍️ cera colorear
🎯 objetivo diana meta
🚀 cohete lanzamiento proyecto
🏁 meta final bandera
🚩 bandera marcador
⏰ despertador alarma hora
⏱️ cronometro tiempo
⏲️ temporizador
⏳ reloj arena tiempo espera
⌛ reloj arena tiempo
🕐 reloj hora
🔔 campana aviso notificacion
🔕 silencio sin notificaciones
🔥 fuego urgente popular
💡 idea bombilla
🧠 cerebro mente pensar
🏆 trofeo premio ganar
🥇 medalla oro primero
🥈 medalla plata segundo
🥉 medalla bronce tercero
🎖️ medalla
📣 megafono aviso
📬 buzon correo
🔄 actualizar repetir ciclo
🔁 repetir
🔂 repetir uno
➕ mas añadir
➖ menos quitar
🔜 pronto
🆕 nuevo
🆗 ok
🔝 arriba top
📥 bandeja entrada
📤 bandeja salida
`,
  Personas: `
😀 sonrisa feliz contento
😃 feliz sonrisa
😄 risa feliz alegre
😁 sonrisa dientes
😆 risa carcajada
😅 sudor risa nervioso
😂 risa lagrimas
🤣 risa suelo carcajada
🙂 sonrisa suave
🙃 al reves ironia
😉 guiño
😊 sonrojado feliz
😇 angel inocente
🥰 enamorado amor corazones
😍 ojos corazon amor
🤩 asombro estrellas
😘 beso
😋 rico delicioso
😛 lengua
😜 guiño lengua broma
🤪 loco
😎 gafas cool
🤓 empollon gafas listo
🧐 monoculo curioso
🤔 pensando duda
🤨 ceja sospecha
😐 neutral
😑 sin expresion
😶 sin boca silencio
🙄 ojos en blanco
😏 sonrisa picara
😴 dormir sueño
🥱 bostezo cansado
😌 aliviado tranquilo
😪 sueño
🤤 babeando
😷 mascarilla enfermo
🤒 fiebre enfermo
🤕 herido venda
🤢 nauseas asco
🤮 vomito
🥵 calor
🥶 frio
🥴 mareado
😵 mareado
🤯 mente explotando
🤠 vaquero
🥳 fiesta celebracion
😕 confuso
😟 preocupado
😮 sorpresa
😲 asombrado
😳 sonrojado vergüenza
🥺 suplicando ternura
😢 triste lagrima
😭 llorar
😱 miedo grito
😖 agobiado
😞 decepcionado
😓 sudor frio
😩 agotado
😤 enfadado resoplar
😡 enfadado rabia
😠 enfado
🤬 insultos
😈 diablillo
👿 diablo enfadado
💀 calavera muerte
☠️ calavera peligro
💩 caca
🤡 payaso
👻 fantasma
👽 alien extraterrestre
🙈 mono no ver
🙉 mono no oir
🙊 mono no hablar
👋 saludo mano hola
🤚 mano
✋ mano alto parar
👌 ok perfecto
✌️ victoria paz
🤞 dedos cruzados suerte
🤟 amor te quiero
🤘 rock
👍 pulgar arriba bien
👎 pulgar abajo mal
👊 puño golpe
✊ puño fuerza
👏 aplauso
🙌 celebracion manos arriba
🙏 gracias rezar por favor
💪 fuerza musculo biceps
🧑 persona adulto
👶 bebe
👦 niño
👧 niña
👨 hombre
👩 mujer
🧓 anciano
👮 policia
🧑‍🚀 astronauta
🧑‍🍳 cocinero chef
🧑‍🏫 profesor
🧑‍⚕️ medico doctor
🧑‍🎨 artista
🧑‍🔧 mecanico
🦸 superheroe
🧙 mago
🧛 vampiro
🧜 sirena
🧚 hada
🧘 yoga meditar
🏃 correr
🚶 caminar
💃 bailar
🕺 bailar
👪 familia
👀 ojos mirar
👁️ ojo
🧠 cerebro
🦷 diente
🦴 hueso
👅 lengua
👄 boca
`,
  Estudio: `
📚 libros estudiar biblioteca
📖 libro abierto leer
📕 libro rojo
📗 libro verde
📘 libro azul
📙 libro naranja
📓 cuaderno
📒 libreta
📔 cuaderno decorado
🎓 graduacion birrete universidad
🏫 escuela colegio
🔬 microscopio ciencia
🔭 telescopio
🧮 abaco matematicas
📐 escuadra geometria
📏 regla
✂️ tijeras
🧫 placa petri biologia
⚗️ alambique quimica
🧲 iman fisica
🌡️ termometro
💉 jeringuilla vacuna
💊 pastilla medicina
🩺 estetoscopio salud
🗺️ mapa
🌍 mundo tierra europa
🌎 mundo america
🌏 mundo asia
🧭 brujula
🏛️ edificio clasico historia
📜 pergamino historia
🔤 letras abc
🔢 numeros
🔡 minusculas
🔠 mayusculas
🅰️ a
🅱️ b
💬 mensaje chat conversacion
💭 pensamiento
🗣️ hablar
🈂️ idiomas
🏳️ bandera blanca
🏴 bandera negra
🇪🇸 españa bandera
🇬🇧 reino unido ingles bandera
🇺🇸 estados unidos bandera
🇫🇷 francia bandera
🇩🇪 alemania bandera
🇮🇹 italia bandera
🇵🇹 portugal bandera
🇯🇵 japon bandera
🇨🇳 china bandera
🇲🇽 mexico bandera
🇦🇷 argentina bandera
`,
  Casa: `
🏠 casa hogar
🏡 casa jardin
🏘️ casas barrio
🛋️ sofa salon
🛏️ cama dormitorio
🚿 ducha baño
🛁 bañera
🚽 inodoro baño
🧻 papel higienico
🧼 jabon limpiar
🧽 esponja limpiar
🧹 escoba barrer
🧺 cesta colada ropa
🪣 cubo
🧴 crema botella
🪥 cepillo dientes
🪒 maquinilla afeitar
🚪 puerta
🪟 ventana
🪑 silla
🛒 compra carro supermercado
🛍️ bolsas compras
🪴 planta maceta
🕯️ vela
💡 bombilla luz
🔦 linterna
🔋 pila bateria
🔌 enchufe
📺 television
📻 radio
📱 movil telefono
☎️ telefono
⌚ reloj pulsera
🖼️ cuadro marco
🧸 peluche osito
🎁 regalo
🎈 globo fiesta
🧯 extintor
🔥 fuego
🚗 coche
🚕 taxi
🚌 autobus
🚲 bicicleta
🛵 moto scooter
✈️ avion viaje
🚆 tren
🚢 barco
⛵ velero
🚁 helicoptero
🛴 patinete
🧳 maleta viaje
🏖️ playa vacaciones
🏕️ camping
⛺ tienda campaña
🗽 estatua libertad
🗼 torre
🏰 castillo
🌉 puente
`,
  Comida: `
🍎 manzana fruta
🍏 manzana verde
🍐 pera
🍊 naranja mandarina
🍋 limon
🍌 platano banana
🍉 sandia
🍇 uvas
🍓 fresa
🫐 arandanos
🍒 cerezas
🍑 melocoton
🥭 mango
🍍 piña
🥥 coco
🥝 kiwi
🍅 tomate
🥑 aguacate
🥦 brocoli
🥕 zanahoria
🌽 maiz
🌶️ picante guindilla
🥔 patata
🍠 batata
🧄 ajo
🧅 cebolla
🍄 champiñon seta
🥜 cacahuete
🍞 pan
🥐 croissant
🥖 baguette pan
🧀 queso
🥚 huevo
🍳 huevo frito cocinar sarten
🥓 bacon
🥩 carne filete
🍗 pollo muslo
🍖 carne hueso
🌭 perrito caliente
🍔 hamburguesa
🍟 patatas fritas
🍕 pizza
🥪 sandwich bocadillo
🌮 taco
🌯 burrito
🥗 ensalada
🍝 espaguetis pasta
🍜 fideos ramen
🍲 guiso olla
🍛 curry arroz
🍣 sushi
🍱 bento caja
🥟 empanadilla
🍤 gamba tempura
🍚 arroz
🍙 onigiri arroz
🍦 helado
🍨 helado
🍩 donut rosquilla
🍪 galleta
🎂 tarta cumpleaños
🍰 pastel tarta
🧁 magdalena cupcake
🍫 chocolate
🍬 caramelo
🍭 piruleta
🍿 palomitas
☕ cafe
🍵 te
🧋 te burbujas
🥤 refresco vaso
🧃 zumo
🥛 leche
🍺 cerveza
🍻 cervezas brindis
🍷 vino
🥂 brindis copas
🍸 coctel
🍹 coctel tropical
🍾 champan botella
🧊 hielo
🥄 cuchara
🍴 tenedor cuchillo cubiertos
🍽️ plato
🔪 cuchillo
`,
  Naturaleza: `
🐶 perro
🐱 gato
🐭 raton
🐹 hamster
🐰 conejo
🦊 zorro
🐻 oso
🐼 panda
🐨 koala
🐯 tigre
🦁 leon
🐮 vaca
🐷 cerdo
🐸 rana
🐵 mono
🐔 gallina pollo
🐧 pinguino
🐦 pajaro
🐤 pollito
🦅 aguila
🦉 buho
🦇 murcielago
🐺 lobo
🐴 caballo
🦄 unicornio
🐝 abeja
🐛 oruga
🦋 mariposa
🐌 caracol
🐞 mariquita
🐜 hormiga
🕷️ araña
🐢 tortuga
🐍 serpiente
🦎 lagarto
🐙 pulpo
🦑 calamar
🦀 cangrejo
🐠 pez
🐟 pez
🐬 delfin
🐳 ballena
🦈 tiburon
🐊 cocodrilo
🐘 elefante
🦒 jirafa
🦓 cebra
🦘 canguro
🐫 camello
🐑 oveja
🐐 cabra
🦔 erizo
🐿️ ardilla
🌱 brote planta
🌿 hierba hoja
☘️ trebol
🍀 trebol suerte
🍃 hojas viento
🍂 hojas otoño
🍁 hoja arce otoño
🌴 palmera
🌲 pino arbol
🌳 arbol
🌵 cactus
🌾 espiga trigo
🌷 tulipan flor
🌹 rosa flor
🌺 hibisco flor
🌸 cerezo flor
🌼 margarita flor
🌻 girasol
💐 ramo flores
🍄 seta
🌰 castaña
🌞 sol cara
☀️ sol
🌤️ sol nubes
⛅ nublado
☁️ nube
🌧️ lluvia
⛈️ tormenta
🌩️ rayo
❄️ nieve copo
☃️ muñeco nieve
🌈 arcoiris
💧 gota agua
🌊 ola mar
🔥 fuego
🌙 luna
🌕 luna llena
🌑 luna nueva
⭐ estrella
🌟 estrella brillante
✨ destellos brillo magia
💫 mareado estrella
🪐 planeta saturno
🌌 galaxia vía lactea
☄️ cometa
🌋 volcan
⛰️ montaña
🏔️ montaña nevada
🏝️ isla
🏜️ desierto
`,
  Actividades: `
⚽ futbol balon
🏀 baloncesto
🏈 futbol americano
⚾ beisbol
🎾 tenis
🏐 voleibol
🏉 rugby
🎱 billar
🏓 ping pong
🏸 badminton
🥊 boxeo
🥋 artes marciales
⛳ golf
🏹 arco tiro
🎣 pesca
🤿 buceo
🎿 esqui
🏂 snowboard
🛹 skate monopatin
🏋️ pesas gimnasio
🤸 gimnasia
🚴 ciclismo
🏊 natacion
🧗 escalada
🏇 equitacion
♟️ ajedrez
🎯 diana dardos
🎳 bolos
🎮 videojuegos mando
🕹️ arcade joystick
🎲 dado juego
🧩 puzzle
🃏 comodin cartas
🎰 tragaperras
🎬 cine claqueta
🎥 camara cine
📷 camara foto
📸 foto flash
📹 video camara
🎞️ pelicula
🎤 microfono cantar
🎧 auriculares musica
🎼 partitura
🎵 nota musical
🎶 notas musicales
🎹 piano teclado
🥁 bateria tambor
🎷 saxofon
🎺 trompeta
🎸 guitarra
🎻 violin
🪕 banjo
🎨 paleta pintura arte
🖼️ cuadro arte
🎭 teatro mascaras
🎪 circo
🎟️ entrada ticket
🎫 entrada
🎉 fiesta celebracion
🎊 confeti
🎄 navidad arbol
🎃 calabaza halloween
🎆 fuegos artificiales
🎇 bengala
🧨 petardo
🪁 cometa
🧶 lana ovillo
🧵 hilo costura
🪡 aguja
🧿 amuleto ojo
🔮 bola cristal
🪄 varita magia
`,
  Símbolos: `
⭐ estrella
🌟 estrella brillante
✨ destellos
❤️ corazon rojo amor
🧡 corazon naranja
💛 corazon amarillo
💚 corazon verde
💙 corazon azul
💜 corazon morado
🖤 corazon negro
🤍 corazon blanco
🤎 corazon marron
💔 corazon roto
❤️‍🔥 corazon fuego pasion
💖 corazon brillante
💗 corazon creciendo
💕 dos corazones
💞 corazones girando
💘 corazon flecha
💝 corazon lazo
🔴 circulo rojo
🟠 circulo naranja
🟡 circulo amarillo
🟢 circulo verde
🔵 circulo azul
🟣 circulo morado
🟤 circulo marron
⚫ circulo negro
⚪ circulo blanco
🟥 cuadrado rojo
🟧 cuadrado naranja
🟨 cuadrado amarillo
🟩 cuadrado verde
🟦 cuadrado azul
🟪 cuadrado morado
⬛ cuadrado negro
⬜ cuadrado blanco
🔶 rombo naranja
🔷 rombo azul
🔺 triangulo rojo
🔻 triangulo abajo
💠 rombo flor
🔘 boton radio
💎 diamante gema
🍀 trebol suerte
♾️ infinito
♻️ reciclaje
⚜️ flor de lis
🔱 tridente
☮️ paz
☯️ yin yang
✝️ cruz
☪️ luna creciente
🕉️ om
✡️ estrella david
♈ aries
♉ tauro
♊ geminis
♋ cancer
♌ leo
♍ virgo
♎ libra
♏ escorpio
♐ sagitario
♑ capricornio
♒ acuario
♓ piscis
➡️ flecha derecha
⬅️ flecha izquierda
⬆️ flecha arriba
⬇️ flecha abajo
↗️ flecha diagonal
🔀 aleatorio
💯 cien perfecto
💢 enfado
💥 explosion colision
💦 gotas sudor
💨 viento rapido
💤 dormir zzz
🕳️ agujero
💣 bomba
🔰 principiante
🆘 sos ayuda
🏴‍☠️ pirata bandera
`,
}

export interface EmojiItem {
  emoji: string
  // Palabras clave ya sin tildes ni mayúsculas
  keywords: string
}

export interface EmojiGroup {
  name: string
  items: EmojiItem[]
}

export const normalize = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

export const EMOJI_GROUPS: EmojiGroup[] = Object.entries(raw).map(([name, text]) => ({
  name,
  items: text
    .trim()
    .split('\n')
    .map((line) => {
      const space = line.indexOf(' ')
      return { emoji: line.slice(0, space), keywords: normalize(`${line.slice(space + 1)} ${name}`) }
    }),
}))

// Todos los emojis que coinciden con la búsqueda (todas las palabras deben aparecer), sin repetidos
export function searchEmojis(search: string): EmojiItem[] {
  const words = normalize(search).split(/\s+/).filter(Boolean)
  if (words.length === 0) return []
  const seen = new Set<string>()
  const found: EmojiItem[] = []
  for (const group of EMOJI_GROUPS) {
    for (const item of group.items) {
      if (seen.has(item.emoji) || !words.every((word) => item.keywords.includes(word))) continue
      seen.add(item.emoji)
      found.push(item)
    }
  }
  return found
}
