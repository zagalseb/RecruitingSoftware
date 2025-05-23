// Variables globales
let jugadores = [];

// Cargar datos del TSV
fetch("jugadores.tsv") // Asegúrate de que la ruta sea correcta
  .then(response => response.text())
  .then(data => {
    jugadores = procesarTSV(data);
    cargarPerfilJugador();
  })
  .catch(error => console.error("Error al cargar el TSV:", error));

// Procesar el TSV a JSON
function procesarTSV(data) {
  const rows = data.split("\n");
  const headers = rows[0].split("\t").map(header => header.trim());

  return rows.slice(1).map(row => {
    const values = row.split("\t").map(value => value.trim());
    const jugador = {};
    headers.forEach((header, index) => {
      jugador[header] = values[index];
    });
    return jugador;
  });
}








document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const nombre = params.get("nombre");
  const apellido = params.get("apellido");
  const username = localStorage.getItem("usuarioActual"); // Usuario actual

  if (!nombre || !apellido || !username) {
      console.error("Faltan parámetros en la URL o el usuario no ha iniciado sesión.");
      return;
  }

  const notaKey = `${username}_${nombre}_${apellido}`; // Clave para notas y calificaciones

  // Cargar nota y calificación
  cargarNota(notaKey);
  cargarCalificacion(notaKey);

  // Botones para guardar/eliminar notas
  const botonGuardar = document.getElementById("guardar-nota");
  const botonEliminar = document.getElementById("eliminar-nota");

  botonGuardar?.addEventListener("click", () => guardarNota(notaKey));
  botonEliminar?.addEventListener("click", () => eliminarNota(notaKey));

  // Estrellas de calificación
  const estrellas = document.querySelectorAll("#estrellas .estrella");
  let calificacionSeleccionada = obtenerCalificacion(notaKey);

  actualizarEstrellas(estrellas, calificacionSeleccionada);

  estrellas.forEach(estrella => {
      estrella.addEventListener("mouseover", () => {
          const valor = estrella.getAttribute("data-value");
          resaltarEstrellas(estrellas, valor);
      });

      estrella.addEventListener("mouseleave", () => {
          resaltarEstrellas(estrellas, calificacionSeleccionada);
      });

      estrella.addEventListener("click", () => {
          const valor = estrella.getAttribute("data-value");
          calificacionSeleccionada = valor;
          guardarCalificacion(notaKey, valor);
          actualizarEstrellas(estrellas, valor);
      });
  });
});

function cargarNota(notaKey) {
  const textarea = document.getElementById("nota-texto");
  const notaGuardada = localStorage.getItem(notaKey) || "";
  textarea.value = notaGuardada;
}

function guardarNota(notaKey) {
  const textarea = document.getElementById("nota-texto");
  const notaTexto = textarea.value.trim();

  if (notaTexto === "") {
    alert("La nota está vacía. Escribe algo para guardar.");
    return;
  }

  localStorage.setItem(notaKey, notaTexto);
  mostrarMensaje("¡Nota guardada exitosamente!", "success");
}

function eliminarNota(notaKey) {
  localStorage.removeItem(notaKey);
  document.getElementById("nota-texto").value = "";
  mostrarMensaje("Nota eliminada.", "error");
}


function cargarCalificacion(notaKey) {
  const estrellas = document.querySelectorAll("#estrellas .estrella");
  const calificacionGuardada = obtenerCalificacion(notaKey);
  actualizarEstrellas(estrellas, calificacionGuardada);
}

function guardarCalificacion(notaKey, calificacion) {
  const username = localStorage.getItem("usuarioActual");
  const calificacionesKey = `calificaciones_${username}`;
  let calificaciones = JSON.parse(localStorage.getItem(calificacionesKey)) || {};

  calificaciones[notaKey] = parseInt(calificacion);
  localStorage.setItem(calificacionesKey, JSON.stringify(calificaciones));
  alert(`¡Calificación de ${calificacion} estrellas guardada!`);
}

function obtenerCalificacion(notaKey) {
  const username = localStorage.getItem("usuarioActual");
  const calificacionesKey = `calificaciones_${username}`;
  const calificaciones = JSON.parse(localStorage.getItem(calificacionesKey)) || {};

  return calificaciones[notaKey] || 0;
}


function actualizarEstrellas(estrellas, calificacion) {
  estrellas.forEach(estrella => {
      const valor = estrella.getAttribute("data-value");
      estrella.style.color = valor <= calificacion ? "gold" : "#ccc";
  });
}

function resaltarEstrellas(estrellas, valor) {
  estrellas.forEach(estrella => {
      const valorEstrella = estrella.getAttribute("data-value");
      estrella.style.color = valorEstrella <= valor ? "gold" : "#ccc";
  });
}

function mostrarMensaje(mensaje, tipo) {
  const mensajeElemento = document.getElementById("nota-guardada");
  mensajeElemento.textContent = mensaje;
  mensajeElemento.style.color = tipo === "success" ? "green" : "red";
  mensajeElemento.style.display = "block";

  setTimeout(() => {
    mensajeElemento.style.display = "none";
  }, 2000);
}


// Función para cargar la nota desde localStorage
function cargarNota(notaKey) {
  const textarea = document.getElementById("nota-texto");
  const notaGuardada = localStorage.getItem(notaKey);

  if (notaGuardada) {
      textarea.value = notaGuardada; // Mostrar la nota guardada
  } else {
      textarea.value = ""; // Limpiar el textarea si no hay nota
  }
}

// Función para guardar la nota en localStorage
function guardarNota(notaKey) {
  const textarea = document.getElementById("nota-texto");
  const notaTexto = textarea.value;

  if (notaTexto.trim() === "") {
      alert("La nota está vacía. Escribe algo para guardar.");
      return;
  }

  localStorage.setItem(notaKey, notaTexto); // Guardar en localStorage
  mostrarMensaje("¡Nota guardada exitosamente!", "success");
}

// Función para eliminar la nota de localStorage
function eliminarNota(notaKey) {
  const textarea = document.getElementById("nota-texto");

  localStorage.removeItem(notaKey); // Eliminar de localStorage
  textarea.value = ""; // Limpiar el textarea
  mostrarMensaje("Nota eliminada.", "error");
}

// Función para mostrar mensajes temporales
function mostrarMensaje(mensaje, tipo) {
  const mensajeElemento = document.getElementById("nota-guardada");
  mensajeElemento.textContent = mensaje;

  if (tipo === "success") {
      mensajeElemento.style.color = "green"; // Mensaje en verde
  } else if (tipo === "error") {
      mensajeElemento.style.color = "red"; // Mensaje en rojo
  }

  mensajeElemento.style.display = "block";

  setTimeout(() => {
      mensajeElemento.style.display = "none";
  }, 2000); // Ocultar mensaje después de 2 segundos
}

function guardarCalificacion(notaKey, calificacion) {
  const username = localStorage.getItem("usuarioActual");
  const calificacionesKey = `calificaciones_${username}`;
  let calificaciones = JSON.parse(localStorage.getItem(calificacionesKey)) || {};

  // Usar notaKey como clave única para el jugador
  calificaciones[notaKey] = parseInt(calificacion);

  // Guardar en localStorage
  localStorage.setItem(calificacionesKey, JSON.stringify(calificaciones));
  alert(`¡Calificación de ${calificacion} estrellas guardada!`);
}

function obtenerCalificacion(notaKey) {
  const username = localStorage.getItem("usuarioActual");
  const calificacionesKey = `calificaciones_${username}`;
  const calificaciones = JSON.parse(localStorage.getItem(calificacionesKey)) || {};

  return calificaciones[notaKey] || 0; // Retorna 0 si no hay calificación
}


function cargarCalificacion(calificacionKey) {
  const estrellas = document.querySelectorAll("#estrellas .estrella");
  const calificacionGuardada = localStorage.getItem(calificacionKey) || 0;

  actualizarEstrellas(estrellas, calificacionGuardada);
}

function actualizarEstrellas(estrellas, calificacion) {
  estrellas.forEach(estrella => {
    const valor = estrella.getAttribute("data-value");
    estrella.classList.toggle("seleccionada", valor <= calificacion);
  });
}

function inicializarBotonFavoritos(nombre, apellido) {
  const equipoActual = localStorage.getItem("usuarioActual");
  const claveFavoritos = `favoritos_${equipoActual}`;
  const favoritos = JSON.parse(localStorage.getItem(claveFavoritos)) || [];
  const idJugador = `${nombre}_${apellido}`;

  const boton = document.getElementById("favoritos-btn");
  if (boton) {
    const esFavorito = favoritos.includes(idJugador);
    boton.textContent = esFavorito ? "Quitar de Favoritos" : "Agregar a Favoritos";
    boton.classList.toggle("activo", esFavorito);
  }
}

// Función para alternar el estado de favoritos
function toggleFavorito(nombre, apellido) {
  const equipoActual = localStorage.getItem("usuarioActual");
  const claveFavoritos = `favoritos_${equipoActual}`;
  let favoritos = JSON.parse(localStorage.getItem(claveFavoritos)) || [];
  const idJugador = `${nombre}_${apellido}`;

  const indice = favoritos.indexOf(idJugador);
  if (indice === -1) {
    favoritos.push(idJugador);
  } else {
    favoritos.splice(indice, 1);
  }

  localStorage.setItem(claveFavoritos, JSON.stringify(favoritos));
  inicializarBotonFavoritos(nombre, apellido); // Actualizar estado del botón
}

function sincronizarBotonFavoritos(boton, nombre, apellido) {
  const equipoActual = localStorage.getItem("usuarioActual");
  const claveFavoritos = `favoritos_${equipoActual}`;
  const favoritos = JSON.parse(localStorage.getItem(claveFavoritos)) || [];
  const idJugador = `${nombre}_${apellido}`;

  const esFavorito = favoritos.includes(idJugador);
  boton.textContent = esFavorito ? "Quitar de Favoritos" : "Agregar a Favoritos";
  boton.classList.toggle("activo", esFavorito);
}

// RAS //
function obtenerClaseColor(valor) {
  if (valor >= 8) return "valor-alto"; // Verde
  if (valor >= 4) return "valor-medio"; // Amarillo
  return "valor-bajo"; // Rojo
}
// Rango por defecto para normalización del RAS
// Definir rangos específicos por posición
const rangosPorPosicion = {
  QB: { altura: { min: 1.73, max: 1.91 }, peso: { min: 72, max: 90 }, "40 YD": { min: 5.2, max: 4.5 }, vertical: { min: 25, max: 40 }, broad: { min: 90, max: 130 }, shuttle: { min: 5.0, max: 4.0 }, "3 cone": { min: 8.0, max: 6.5 } },
  RB: { altura: { min: 1.70, max: 1.85 }, peso: { min: 80, max: 100 }, "40 YD": { min: 5.0, max: 4.3 }, vertical: { min: 30, max: 45 }, broad: { min: 100, max: 140 }, shuttle: { min: 4.5, max: 3.8 }, "3 cone": { min: 7.5, max: 6.5 } },
  WR: { altura: { min: 1.68, max: 1.85 }, peso: { min: 65, max: 85 }, "40 YD": { min: 5.0, max: 4.3 }, vertical: { min: 30, max: 40 }, broad: { min: 100, max: 140 }, shuttle: { min: 4.5, max: 3.8 }, "3 cone": { min: 7.5, max: 6.5 } },
  TE: { altura: { min: 1.85, max: 2.00 }, peso: { min: 100, max: 120 }, "40 YD": { min: 5.2, max: 4.6 }, vertical: { min: 28, max: 40 }, broad: { min: 95, max: 135 }, shuttle: { min: 5.0, max: 4.2 }, "3 cone": { min: 8.0, max: 6.8 } },
  OT: { altura: { min: 1.90, max: 2.05 }, peso: { min: 120, max: 150 }, "40 YD": { min: 6.0, max: 5.0 }, vertical: { min: 20, max: 35 }, broad: { min: 80, max: 120 }, shuttle: { min: 5.5, max: 4.5 }, "3 cone": { min: 8.5, max: 7.0 } },
  OG: { altura: { min: 1.85, max: 2.00 }, peso: { min: 110, max: 140 }, "40 YD": { min: 5.8, max: 5.0 }, vertical: { min: 22, max: 36 }, broad: { min: 85, max: 125 }, shuttle: { min: 5.3, max: 4.6 }, "3 cone": { min: 8.2, max: 7.2 } },
  C: { altura: { min: 1.85, max: 1.98 }, peso: { min: 100, max: 120 }, "40 YD": { min: 5.7, max: 5.0 }, vertical: { min: 24, max: 38 }, broad: { min: 90, max: 130 }, shuttle: { min: 5.5, max: 4.6 }, "3 cone": { min: 8.3, max: 7.2 } },
  NT: { altura: { min: 1.85, max: 2.00 }, peso: { min: 120, max: 150 }, "40 YD": { min: 6.0, max: 5.0 }, vertical: { min: 20, max: 35 }, broad: { min: 80, max: 120 }, shuttle: { min: 5.5, max: 4.5 }, "3 cone": { min: 8.5, max: 7.0 } },
  DL: { altura: { min: 1.85, max: 2.00 }, peso: { min: 110, max: 140 }, "40 YD": { min: 5.8, max: 5.0 }, vertical: { min: 22, max: 36 }, broad: { min: 85, max: 125 }, shuttle: { min: 5.3, max: 4.6 }, "3 cone": { min: 8.2, max: 7.2 } },
  LB: { altura: { min: 1.70, max: 1.85 }, peso: { min: 80, max: 105 }, "40 YD": { min: 5.0, max: 4.5 }, vertical: { min: 30, max: 45 }, broad: { min: 100, max: 140 }, shuttle: { min: 4.5, max: 3.8 }, "3 cone": { min: 7.5, max: 6.5 } },
  CB: { altura: { min: 1.70, max: 1.85 }, peso: { min: 80, max: 95 }, "40 YD": { min: 5.0, max: 4.3 }, vertical: { min: 30, max: 45 }, broad: { min: 100, max: 140 }, shuttle: { min: 4.5, max: 3.8 }, "3 cone": { min: 7.5, max: 6.5 } },
  S: { altura: { min: 1.75, max: 1.90 }, peso: { min: 85, max: 105 }, "40 YD": { min: 5.0, max: 4.4 }, vertical: { min: 30, max: 45 }, broad: { min: 100, max: 140 }, shuttle: { min: 4.5, max: 3.8 }, "3 cone": { min: 7.5, max: 6.5 } },
  default: { altura: { min: 1.70, max: 2.00 }, peso: { min: 70, max: 150 }, "40 YD": { min: 6.0, max: 4.0 }, vertical: { min: 20, max: 50 }, broad: { min: 70, max: 150 }, shuttle: { min: 6.0, max: 3.5 }, "3 cone": { min: 8.5, max: 6.0 } },
};


// Obtener rangos para una posición específica
function obtenerRangosPorPosicion(posicion) {
  return rangosPorPosicion[posicion] || rangosPorPosicion.default;
}


// Función para normalizar las métricas
function normalizar(valor, rango) {
  if (isNaN(valor) || valor === 0) return 0; // Si el valor es inválido, devuelve 0
  return Math.max(0, Math.min(10, ((valor - rango.min) / (rango.max - rango.min)) * 10));
}

// Función para calcular el RAS
function calcularRAS(jugador) {
  const rasMetrica = {
    Altura: normalizar(parseFloat(jugador["Altura"]), rangosRAS.altura),
    Peso: normalizar(parseFloat(jugador["Peso"]), rangosRAS.peso),
    "40 YD": normalizar(parseFloat(jugador["40 YD"]), rangosRAS["40 YD"]),
    Vertical: normalizar(parseFloat(jugador["Vertical"]), rangosRAS.vertical),
    Broad: normalizar(parseFloat(jugador["Broad"]), rangosRAS.broad),
    Shuttle: normalizar(parseFloat(jugador["Shuttle"]), rangosRAS.shuttle),
    "3 cone": normalizar(parseFloat(jugador["3 cone"]), rangosRAS["3 cone"]),
  };

  const rasTotal = Object.values(rasMetrica).reduce((sum, val) => sum + val, 0) / Object.keys(rasMetrica).length;

  return { rasTotal, rasMetrica };
}

// Función logística para suavizar la puntuación
function calcularLogistica(valor, rango, k = 10) {
  const xMid = (rango.max + rango.min) / 2; // Punto medio del rango
  const xNorm = (valor - rango.min) / (rango.max - rango.min); // Normalización
  if (isNaN(valor) || valor === 0) return 0; // Si el valor no es válido
  return 10 / (1 + Math.exp(-k * (xNorm - 0.5))); // Transformación logística
}

// Función cuadrática para suavizar la penalización
function calcularCuadratica(valor, rango) {
  const xMid = (rango.max + rango.min) / 2;
  const halfRange = (rango.max - rango.min) / 2;
  if (isNaN(valor) || valor === 0) return 0;
  const distancia = (valor - xMid) / halfRange;
  return Math.max(0, 10 * (1 - Math.pow(distancia, 2)));
}

// Función para calcular el RAS y los puntajes con un método seleccionado
function calcularRAS(jugador, metodo = "logistica") {
  // Determinar la posición válida
  const posicion =
    jugador["Posición Ofensiva"] !== "Ninguna"
      ? jugador["Posición Ofensiva"]
      : jugador["Posición Defensiva"] !== "Ninguna"
      ? jugador["Posición Defensiva"]
      : null;

  // Si no hay una posición válida, no calcular el RAS
  if (!posicion) {
    console.warn("Jugador sin posición válida para calcular el RAS.");
    return { rasTotal: 0, rasMetrica: {} };
  }

  // Obtener los rangos específicos para la posición
  const rangosRAS = obtenerRangosPorPosicion(posicion);

  // Calcular el RAS usando el método seleccionado
  const rasMetrica = {
    Altura: metodo === "logistica"
      ? calcularLogistica(parseFloat(jugador["Altura"]), rangosRAS.altura)
      : calcularCuadratica(parseFloat(jugador["Altura"]), rangosRAS.altura),
    Peso: metodo === "logistica"
      ? calcularLogistica(parseFloat(jugador["Peso"]), rangosRAS.peso)
      : calcularCuadratica(parseFloat(jugador["Peso"]), rangosRAS.peso),
    "40 YD": metodo === "logistica"
      ? calcularLogistica(parseFloat(jugador["40 YD"]), rangosRAS["40 YD"])
      : calcularCuadratica(parseFloat(jugador["40 YD"]), rangosRAS["40 YD"]),
    Vertical: metodo === "logistica"
      ? calcularLogistica(parseFloat(jugador["Vertical"]), rangosRAS.vertical)
      : calcularCuadratica(parseFloat(jugador["Vertical"]), rangosRAS.vertical),
    Broad: metodo === "logistica"
      ? calcularLogistica(parseFloat(jugador["Broad"]), rangosRAS.broad)
      : calcularCuadratica(parseFloat(jugador["Broad"]), rangosRAS.broad),
    Shuttle: metodo === "logistica"
      ? calcularLogistica(parseFloat(jugador["Shuttle"]), rangosRAS.shuttle)
      : calcularCuadratica(parseFloat(jugador["Shuttle"]), rangosRAS.shuttle),
    "3 cone": metodo === "logistica"
      ? calcularLogistica(parseFloat(jugador["3 cone"]), rangosRAS["3 cone"])
      : calcularCuadratica(parseFloat(jugador["3 cone"]), rangosRAS["3 cone"]),
  };

  // Calcular el RAS total
  const rasTotal =
    Object.values(rasMetrica).reduce((sum, val) => sum + val, 0) /
    Object.keys(rasMetrica).length;

  return { rasTotal, rasMetrica };
}


// Generar tabla de estadísticas atléticas
function generarTablaEstadisticas(jugador, metodo = "logistica") {
  const tabla = document.getElementById("tabla-estadisticas");
  tabla.innerHTML = ""; // Limpiar la tabla antes de generarla

  const { rasTotal, rasMetrica } = calcularRAS(jugador, metodo);

  // Encabezado de la tabla
  const encabezado = `
    <thead>
      <tr>
        <th>Estadística</th>
        <th>Valor</th>
        <th>Puntaje</th>
      </tr>
    </thead>`;
  tabla.innerHTML = encabezado;

  // Generar cuerpo de la tabla
  const cuerpo = document.createElement("tbody");
  Object.entries(rasMetrica).forEach(([metrica, puntaje]) => {
    const valor = jugador[metrica] || "N/A"; // Mostrar "N/A" si el valor no está disponible
    const claseColor = obtenerClaseColor(puntaje); // Obtener la clase según el puntaje

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${metrica}</td>
      <td>${valor}</td>
      <td><span class="${claseColor}">${puntaje.toFixed(2)}</span></td>
    `;
    cuerpo.appendChild(fila);
  });

  // Agregar fila para el RAS Total
  const claseColorTotal = obtenerClaseColor(rasTotal); // Clase según el puntaje total
  const filaRAS = document.createElement("tr");
  filaRAS.innerHTML = `
    <td colspan="2" style="text-align: right; font-weight: bold;">RAS Total</td>
    <td><span class="${claseColorTotal}" style="font-weight: bold;">${rasTotal.toFixed(2)}</span></td>
  `;
  cuerpo.appendChild(filaRAS);

  tabla.appendChild(cuerpo);
}

// Calcular promedios por posición
function calcularEstadisticasPorPosicion(jugadores, posicion) {
  const jugadoresFiltrados = jugadores.filter(jugador => 
    jugador["Posición Ofensiva"] === posicion || 
    (jugador["Posición Ofensiva"] === "Ninguna" && jugador["Posición Defensiva"] === posicion)
  );

  const estadisticas = {
    Altura: { suma: 0, valores: [] },
    Peso: { suma: 0, valores: [] },
    "40 YD": { suma: 0, valores: [] },
    Vertical: { suma: 0, valores: [] },
    Broad: { suma: 0, valores: [] },
    Shuttle: { suma: 0, valores: [] },
    "3 cone": { suma: 0, valores: [] },
  };

  jugadoresFiltrados.forEach(jugador => {
    Object.keys(estadisticas).forEach(key => {
      const valor = parseFloat(jugador[key] || 0);
      if (!isNaN(valor)) {
        estadisticas[key].suma += valor;
        estadisticas[key].valores.push(valor);
      }
    });
  });

  // Calcular promedio y desviación estándar
  const resultados = {};
  Object.keys(estadisticas).forEach(key => {
    const { suma, valores } = estadisticas[key];
    const promedio = valores.length > 0 ? suma / valores.length : 0;
    const desviacion =
      valores.length > 0
        ? Math.sqrt(valores.reduce((sum, val) => sum + Math.pow(val - promedio, 2), 0) / valores.length)
        : 0;
    resultados[key] = { promedio, desviacion };
  });

  return resultados;
}

// Calcular el RAS basado en promedio y desviación estándar
function calcularRASPorPromedio(jugador, estadisticas) {
  const rasMetrica = {};

  Object.keys(estadisticas).forEach(key => {
    const { promedio, desviacion } = estadisticas[key];
    const valorJugador = parseFloat(jugador[key] || 0);

    // Para métricas de tiempo, buscamos el valor más bajo
    let z;
    if (key === "40 YD" || key === "Shuttle" || key === "3 cone") {
      z = desviacion > 0 ? (promedio - valorJugador) / desviacion : 0; // Invertir cálculo
    } else {
      z = desviacion > 0 ? (valorJugador - promedio) / desviacion : 0; // Estándar
    }

    // Convertir Z-Score a puntaje en rango 1-10, con 5 en el promedio
    const puntaje = 5 + z * 2; // Ajusta el factor (2 en este caso)
    rasMetrica[key] = Math.max(1, Math.min(10, puntaje)); // Limitar entre 1 y 10
  });

  const rasTotal =
    Object.values(rasMetrica).reduce((sum, val) => sum + val, 0) / Object.keys(rasMetrica).length;

  return { rasTotal, rasMetrica };
}



// Generar tabla para el RAS basado en promedio sin mostrar desviación estándar
function generarTablaRASPromedio(jugador, jugadores) {
  const tabla = document.getElementById("tabla-ras-promedio");
  tabla.innerHTML = ""; // Limpiar la tabla

  const posicion = jugador["Posición Ofensiva"] !== "Ninguna" 
    ? jugador["Posición Ofensiva"] 
    : jugador["Posición Defensiva"];
  const estadisticas = calcularEstadisticasPorPosicion(jugadores, posicion);

  if (!estadisticas || Object.keys(estadisticas).length === 0) {
    tabla.innerHTML = `<p>No se encontraron estadísticas para la posición ${posicion}.</p>`;
    return;
  }

  const rasPromedio = calcularRASPorPromedio(jugador, estadisticas);

  // Encabezado
  const encabezado = `
    <thead>
      <tr>
        <th>Estadística</th>
        <th>Valor</th>
        <th>Promedio Clase</th>
        <th>Puntaje</th>
      </tr>
    </thead>`;
  tabla.innerHTML = encabezado;

  // Cuerpo
  const cuerpo = document.createElement("tbody");
  Object.keys(rasPromedio.rasMetrica).forEach(metrica => {
    const puntaje = rasPromedio.rasMetrica[metrica];
    const claseColor = asignarClasePorColor(puntaje);

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${metrica}</td>
      <td>${jugador[metrica] || "N/A"}</td>
      <td>${estadisticas[metrica]?.promedio?.toFixed(2) || "N/A"}</td>
      <td class="celda-puntaje">
        <div class="recuadro-color ${claseColor}">${puntaje?.toFixed(2) || "N/A"}</div>
      </td>
    `;
    cuerpo.appendChild(fila);
  });

  // Agregar fila para RAS Total
  const rasTotal = Object.values(rasPromedio.rasMetrica).reduce((acc, curr) => acc + curr, 0) / Object.keys(rasPromedio.rasMetrica).length;
  const filaTotal = document.createElement("tr");
  filaTotal.innerHTML = `
    <td colspan="3" style="text-align: right; font-weight: bold;">RAS Total</td>
    <td class="celda-puntaje">
      <div class="recuadro-color" style="background-color: #00e6e6; color: black;">${rasTotal.toFixed(2)}</div>
    </td>
  `;
  cuerpo.appendChild(filaTotal);

  tabla.appendChild(cuerpo);
}

// Nueva función para asignar clases por colores
function asignarClasePorColor(valor) {
  if (valor >= 6.5) return "valor-alto"; // Verde
  if (valor >= 4) return "valor-medio"; // Amarillo
  return "valor-bajo"; // Rojo
}
















// Función para calcular las estrellas según el rating
function calcularEstrellas(rating) {
  if (rating >= 70 && rating <= 89) return "★★★";
  if (rating >= 90 && rating <= 97) return "★★★★";
  if (rating >= 98 && rating <= 110) return "★★★★★";
  return "Sin clasificación";
}

// Cargar perfil del jugador
function cargarPerfilJugador() {
    // Obtener parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const nombre = params.get("nombre");
    const apellido = params.get("apellido");

  
    // Buscar al jugador en la lista
    const jugador = jugadores.find(jugador =>
      jugador["Nombre"] === nombre && jugador["Apellido Paterno"] === apellido
    );
  
    if (!jugador) {
      alert("Jugador no encontrado.");
      return;
    }
  
    // Actualizar información del perfil
    document.getElementById("nombre").textContent = `${jugador["Nombre"]} ${jugador["Apellido Paterno"]}`;
    document.getElementById("posicionOfensiva").textContent = jugador["Posición Ofensiva"] || "N/A";
    document.getElementById("posicionDefensiva").textContent = jugador["Posición Defensiva"] || "N/A";
    document.getElementById("altura").textContent = jugador["Altura"] || "N/A";
    document.getElementById("peso").textContent = jugador["Peso"] || "N/A";
    document.getElementById("clase").textContent = jugador["Clase (Año de graduación)"] || "N/A";
    document.getElementById("Fecha de Nacimiento").textContent = jugador["Fecha de Nacimiento"] || "N/A";
    document.getElementById("promedio").textContent = jugador["Promedio Acádemico"] || "N/A";
    document.getElementById("escuela").textContent = jugador["Nombre de tu escuela:"] || "N/A";
    document.getElementById("estudio actual").textContent = jugador["Nivel de estudio actual"] || "N/A";
    document.getElementById("club").textContent = jugador["Club o equipo actual"] || "N/A";
    document.getElementById("estado").textContent = jugador["Estado"] || "N/A";
    document.getElementById("dash").textContent = jugador["40 YD"] || "N/A";
    document.getElementById("bench").textContent = jugador["Vertical"] || "N/A";
    document.getElementById("squat").textContent = jugador["3 cone"] || "N/A";
    document.getElementById("3pt").textContent = jugador["Shuttle"] || "N/A";
    document.getElementById("Tl").textContent = jugador["Broad"] || "N/A";
    document.getElementById("logros").textContent = jugador["Logros"] || "N/A";
    document.getElementById("lesiones").textContent = jugador["Lesiones previas"] || "N/A";
    document.getElementById("benchMax").textContent = jugador["Bench Press Max 1 REP"] || "N/A";
    document.getElementById("squatMax").textContent = jugador["Squat max 1 rep"] || "N/A";

    // Mostrar estrellas y rating debajo del nombre
    const ratingDiv = document.getElementById("rating");
    const estrellas = calcularEstrellas(parseFloat(jugador["Rating"] || 0));
    const ratingTexto = jugador["Rating"] ? `${jugador["Rating"]}` : "N/A";

    
  
    // Cargar los datos de contacto
    cargarContacto(jugador);

    const botonFavoritos = document.getElementById("favoritos-btn");
  if (botonFavoritos) {
    sincronizarBotonFavoritos(botonFavoritos, nombre, apellido);
    botonFavoritos.addEventListener("click", () => toggleFavoritoHTML(botonFavoritos, nombre, apellido));
  }
  
    // Asignar funcionalidad a los botones de Highlights
    asignarBoton(document.getElementById("highlight1"), jugador["Link Highlights 1"]);
    asignarBoton(document.getElementById("highlight2"), jugador["Link Highlights 2"]);
    asignarBoton(document.getElementById("highlight3"), jugador["Link Highlights 3"]);

    generarTablaEstadisticas(jugador);
    generarTablaRASPromedio(jugador, jugadores);
  
    // Asignar la foto del jugador
    const fotoElemento = document.getElementById("Foto");
    let rutaFoto = jugador["Carpeta"]; // Usar la columna "Carpeta" del TSV
  
    if (rutaFoto && rutaFoto.trim() !== "") {
      fotoElemento.src = rutaFoto; // Intenta cargar la foto
      fotoElemento.onerror = () => {
        // Si falla, intenta con otra extensión
        fotoElemento.src = rutaFoto.replace(".jpg", ".JPG");
      };
    } else {
      fotoElemento.src = "imagenes/default.jpg"; // Imagen predeterminada si no hay foto
    } 

    // Sincronizar el estado del botón de favoritos
    actualizarBotonFavorito(jugador["Nombre"], jugador["Apellido Paterno"]);
  }
  
  
  
  
  
  
  // Función para cargar información de contacto
  function cargarContacto(jugador) {
    // Actualizar campos normales
    document.getElementById("telefono").textContent = jugador["Teléfono personal"] || "N/A";
    document.getElementById("email").textContent = jugador["Correo Electrónico"] || "N/A";
    document.getElementById("nombrePadre").textContent = jugador["Nombre del Padre o Tutor"] || "N/A";
    document.getElementById("telefonoPadre").textContent = jugador["Teléfono del Padre o Tutor"] || "N/A";
    document.getElementById("nombreCoach").textContent = jugador["Nombre del Head Coach"] || " ";
    document.getElementById("telefonoCoach").textContent = jugador["Teléfono del Head Coach"] || " ";
    document.getElementById("email").textContent = jugador["Email Address"] || "N/A";
  
    // Asignar hipervínculos a redes sociales
    asignarLink(document.getElementById("facebook"), jugador["URL Facebook"]);
    asignarLink(document.getElementById("instagram"), jugador["URL Instagram"]);
    asignarLink(document.getElementById("twitter"), jugador["URL X (Twitter)"]);
  }
  
  // Función auxiliar para asignar enlaces
  function asignarLink(elemento, url) {
    if (url && url.trim() !== "") {
      elemento.href = url;
      elemento.textContent = "Ver perfil";
      elemento.style.color = "#004992"; // Estilo del enlace
    } else {
      elemento.href = "#";
      elemento.textContent = " ";
      elemento.style.color = "gray"; // Enlace inactivo
    }
  }
  
  
  // Función auxiliar para asignar enlaces a botones
  function asignarBoton(button, link) {
    if (link && link.trim() !== "") {
      button.onclick = () => window.open(link, "_blank");
      button.disabled = false; // Asegúrate de que el botón esté habilitado
    } else {
      button.onclick = () => alert("No hay highlights disponibles");
      button.disabled = false; // Asegúrate de que el botón esté habilitado
    }
  }
  
  
  function toggleFavoritoHTML(boton, nombre, apellido) {
    const equipoActual = localStorage.getItem("usuarioActual");
    if (!equipoActual) {
      alert("Usuario no identificado. Inicia sesión para usar favoritos.");
      return;
    }
  
    const claveFavoritos = `favoritos_${equipoActual}`;
    let favoritos = JSON.parse(localStorage.getItem(claveFavoritos)) || [];
    const idJugador = `${nombre}_${apellido}`;
  
    // Alternar favorito
    const indice = favoritos.indexOf(idJugador);
    if (indice === -1) {
      favoritos.push(idJugador);
      boton.textContent = "Quitar de Favoritos";
      boton.classList.add("activo");
    } else {
      favoritos.splice(indice, 1);
      boton.textContent = "Agregar a Favoritos";
      boton.classList.remove("activo");
    }
  
    // Guardar favoritos en localStorage
    localStorage.setItem(claveFavoritos, JSON.stringify(favoritos));
  }
  



  
