document.addEventListener("DOMContentLoaded", () => {
  const listaJugadoresDiv = document.querySelector("#lista-jugadores");
  const filtroEstado = document.getElementById("filtroEstado");
  const filtroOfensiva = document.getElementById("filtroOfensiva");
  const filtroDefensiva = document.getElementById("filtroDefensiva");
  const tablaComparacionDiv = document.querySelector("#tabla-comparacion");
  const toggleListaJugadoresBtn = document.getElementById("toggleListaJugadores"); // Asegurar referencia al botón


  let prospectos = [];
  let roster = [];

  // Cargar ambos archivos TSV
  Promise.all([
    fetch("jugadores.tsv")
      .then(response => {
        if (!response.ok) throw new Error("No se pudo cargar jugadores.tsv");
        return response.text();
      }),
    fetch("roster.tsv")
      .then(response => {
        if (!response.ok) throw new Error("No se pudo cargar roster.tsv");
        return response.text();
      })
  ])
    .then(([jugadoresData, rosterData]) => {
      prospectos = procesarTSV(jugadoresData);
      roster = procesarTSV(rosterData);
      mostrarJugadores(prospectos);
    })
    .catch(error => {
      console.error("Error al cargar los datos:", error);
    });

  // Procesar archivo TSV a formato JSON
  function procesarTSV(data) {
    const rows = data.split("\n").filter(Boolean);
    const headers = rows[0].split("\t").map(header => header.trim());
    return rows.slice(1).map(row => {
      const values = row.split("\t").map(value => value.trim());
      const jugador = {};
      headers.forEach((header, index) => {
        jugador[header] = values[index] || "N/A";
      });
      return jugador;
    });
  }

  if (toggleListaJugadoresBtn) {
    toggleListaJugadoresBtn.addEventListener("click", () => {
      if (listaJugadoresDiv.classList.contains("oculto")) {
        listaJugadoresDiv.classList.remove("oculto"); // Mostrar la lista
        toggleListaJugadoresBtn.textContent = "Ocultar Jugadores";
      } else {
        listaJugadoresDiv.classList.add("oculto"); // Ocultar la lista
        toggleListaJugadoresBtn.textContent = "Mostrar Jugadores";
      }
    });
  }

  // Mostrar jugadores en la lista
  function mostrarJugadores(jugadores) {
    listaJugadoresDiv.innerHTML = "";
    jugadores.forEach((jugador, index) => {
      const jugadorDiv = document.createElement("div");
      jugadorDiv.className = "jugador-item";

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "seleccion-prospecto";
      radio.dataset.index = index;

      const label = document.createElement("label");
      const apellidoPaterno = jugador["Apellido Paterno"] || ""; // Validar apellidos
      label.textContent = `${jugador["Nombre"]} ${apellidoPaterno}  - ${jugador["Estado"]}`;

      jugadorDiv.appendChild(radio);
      jugadorDiv.appendChild(label);
      listaJugadoresDiv.appendChild(jugadorDiv);
    });

    listaJugadoresDiv.addEventListener("change", () => {
      const seleccionado = document.querySelector("input[name='seleccion-prospecto']:checked");
      if (seleccionado) {
        const prospecto = jugadores[seleccionado.dataset.index];
        mostrarComparacion(prospecto, roster);
      }
    });
  }

  // Mostrar comparación con jugadores del roster
  function mostrarComparacion(prospecto, roster) {
    tablaComparacionDiv.innerHTML = "";

    const jugadoresMismaPosicion = roster.filter(jugador => jugador["Posición"] === prospecto["Posición principal"]);
    if (jugadoresMismaPosicion.length === 0) {
      tablaComparacionDiv.innerHTML = "<p>No hay jugadores del roster con la misma posición.</p>";
      return;
    }

    const tablaPosicion = generarTablaComparacion(prospecto, jugadoresMismaPosicion, "Comparación con Misma Posición");
    tablaComparacionDiv.appendChild(tablaPosicion);
  }

  // Generar tabla de comparación
  function generarTablaComparacion(prospecto, jugadores, titulo) {
    const contenedor = document.createElement("div");
    const encabezado = document.createElement("h3");
    encabezado.textContent = titulo;
    contenedor.appendChild(encabezado);

    jugadores.forEach(jugador => {
      const tabla = document.createElement("table");
      tabla.classList.add("tabla-comparacion");

      const apellidoPaternoProspecto = prospecto["Apellido Paterno"] || "";
      const apellidoPaternoJugador = jugador["Apellido Paterno"] || "";

      tabla.innerHTML = `
        <tr>
          <th>Campo</th>
          <th>Prospecto</th>
          <th>Jugador del Roster</th>
        </tr>
        <tr>
          <td>Nombre</td>
          <td>${prospecto["Nombre"]} ${apellidoPaternoProspecto}</td>
          <td>${jugador["Nombre"]} ${apellidoPaternoJugador}</td>
        </tr>
        <tr>
          <td>Altura</td>
          <td>${prospecto["Altura"] || "N/A"}</td>
          <td>${jugador["Altura"] || "N/A"}</td>
        </tr>
        <tr>
          <td>PPJ</td>
          <td>${prospecto["PPJ"] || "N/A"}</td>
          <td>${jugador["PPJ"] || "N/A"}</td>
        </tr>
        <tr>
          <td>RPJ</td>
          <td>${prospecto["RPJ"] || "N/A"}</td>
          <td>${jugador["RPJ"] || "N/A"}</td>
        </tr>
        <tr>
          <td>APJ</td>
          <td>${prospecto["APJ"] || "N/A"}</td>
          <td>${jugador["APJ"] || "N/A"}</td>
        </tr>
      `;

      contenedor.appendChild(tabla);
    });

    return contenedor;
  }

  // Filtrar jugadores según filtros seleccionados
  function filtrarJugadores() {
    const estadoSeleccionado = filtroEstado.value;
    const posicionOfensiva = filtroOfensiva.value;
    const posicionDefensiva = filtroDefensiva.value;

    const jugadoresFiltrados = prospectos.filter(jugador => {
      const coincideEstado = estadoSeleccionado === "Todos" || jugador["Estado"] === estadoSeleccionado;
      const coincidePosicionOFF = !posicionOfensiva || jugador["Posición Ofensiva"] === posicionOfensiva;
      const coincidePosicionDEF = !posicionDefensiva || jugador["Posición Defensiva"] === posicionDefensiva;
      return coincideEstado && coincidePosicionOFF && coincidePosicionDEF;
    });

    mostrarJugadores(jugadoresFiltrados);
  }

  // Escuchar cambios en los filtros
  filtroEstado.addEventListener("change", filtrarJugadores);
  filtroOfensiva.addEventListener("change", filtrarJugadores);
  filtroDefensiva.addEventListener("change", filtrarJugadores);
});





  
  
  
  
  
  