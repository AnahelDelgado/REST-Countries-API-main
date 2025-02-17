// Informes.jsx
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Bar, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function Informes() {
  const [difficulty, setDifficulty] = useState('');
  const [heroType, setHeroType] = useState('');
  const [champions, setChampions] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [heroTypes, setHeroTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para los datos de los gráficos
  const [roleData, setRoleData] = useState(null);
  const [positionData, setPositionData] = useState(null);

  useEffect(() => {
    Papa.parse('/200125_LoL_champion_data.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        try {
          console.log('Resultados del parseo:', results.data);
          setChampions(results.data);

          // Obtener dificultades y tipos únicos
          const diffs = [...new Set(results.data.map((champ) => champ.difficulty))];
          const types = [...new Set(results.data.map((champ) => champ.herotype))];

          setDifficulties(diffs.filter(Boolean));
          setHeroTypes(types.filter(Boolean));

          // Procesar datos para los gráficos

          // Gráfico de barras: cantidad de campeones por rol
          const roleCounts = {};
          results.data.forEach((champ) => {
            try {
              if (champ.role) {
                // Convertir el string a un array válido
                const roleString = champ.role
                  .replace(/'/g, '"')
                  .replace(/\{/g, '[')
                  .replace(/\}/g, ']');
                const roles = JSON.parse(roleString);
                roles.forEach((role) => {
                  roleCounts[role] = (roleCounts[role] || 0) + 1;
                });
              }
            } catch (error) {
              console.error('Error al procesar roles del campeón:', champ.apiname, error);
            }
          });

          // Ordenar roles por cantidad
          const sortedRoles = Object.entries(roleCounts).sort((a, b) => b[1] - a[1]);
          const roleLabels = sortedRoles.map((entry) => entry[0]);
          const roleValues = sortedRoles.map((entry) => entry[1]);

          setRoleData({
            labels: roleLabels,
            datasets: [
              {
                label: 'Cantidad de Campeones por Rol',
                data: roleValues,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
              },
            ],
          });

          // Gráfico circular: cantidad de campeones por posición
          const positionCounts = {};
          results.data.forEach((champ) => {
            try {
              if (champ.client_positions) {
                const positionString = champ.client_positions
                  .replace(/'/g, '"')
                  .replace(/\{/g, '[')
                  .replace(/\}/g, ']');
                const positions = JSON.parse(positionString);
                positions.forEach((position) => {
                  positionCounts[position] = (positionCounts[position] || 0) + 1;
                });
              }
            } catch (error) {
              console.error('Error al procesar posiciones del campeón:', champ.apiname, error);
            }
          });

          // Ordenar posiciones por cantidad
          const sortedPositions = Object.entries(positionCounts).sort((a, b) => b[1] - a[1]);
          const positionLabels = sortedPositions.map((entry) => entry[0]);
          const positionValues = sortedPositions.map((entry) => entry[1]);

          setPositionData({
            labels: positionLabels,
            datasets: [
              {
                label: 'Cantidad de Campeones por Posición',
                data: positionValues,
                backgroundColor: [
                  '#FF6384',
                  '#36A2EB',
                  '#FFCE56',
                  '#4BC0C0',
                  '#9966FF',
                  '#FF9F40',
                  '#C9CBCF',
                ],
                hoverBackgroundColor: [
                  '#FF6384CC',
                  '#36A2EBCC',
                  '#FFCE56CC',
                  '#4BC0C0CC',
                  '#9966FFCC',
                  '#FF9F40CC',
                  '#C9CBCFCC',
                ],
              },
            ],
          });

          setLoading(false);
        } catch (error) {
          console.error('Error en el procesamiento de datos:', error);
          setLoading(false);
        }
      },
      error: function (error) {
        console.error('Error al cargar el CSV:', error);
        setLoading(false);
      },
    });
  }, []);

  const handlePrint = () => {
    if (loading) {
      alert('Los datos aún se están cargando. Por favor, espera un momento.');
      return;
    }

    const filteredChampions = champions.filter((champ) => {
      const matchesDifficulty = difficulty ? champ.difficulty === difficulty : true;
      const matchesHeroType = heroType ? champ.herotype === heroType : true;
      return matchesDifficulty && matchesHeroType;
    });

    if (filteredChampions.length === 0) {
      alert('No se encontraron campeones con los filtros seleccionados.');
      return;
    }

    generatePDF(filteredChampions);
  };

  const generatePDF = (data) => {
    const doc = new jsPDF('l', 'pt', 'a4'); // 'l' para landscape, 'pt' para puntos, 'a4' tamaño de página
    const marginLeft = 40;
    const marginRight = 40;

    // Encabezado
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Informe de Campeones', doc.internal.pageSize.getWidth() / 2, 50, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const today = new Date();
    const date = today.toLocaleDateString();
    doc.text(`Fecha: ${date}`, marginLeft, 70);

    // Información de filtros aplicados
    doc.text(`Dificultad: ${difficulty || 'Todas'}`, marginLeft, 90);
    doc.text(`Tipo de Héroe: ${heroType || 'Todos'}`, marginLeft, 105);

    // Línea separadora
    doc.setLineWidth(0.5);
    doc.line(marginLeft, 115, doc.internal.pageSize.getWidth() - marginRight, 115);

    // Preparar las columnas y filas para la tabla
    const tableColumns = [
      { header: 'ID', dataKey: 'id' },
      { header: 'Nombre', dataKey: 'apiname' },
      { header: 'Nombre Completo', dataKey: 'fullname' },
      { header: 'Apodo', dataKey: 'nickname' },
      { header: 'Título', dataKey: 'title' },
      { header: 'Dificultad', dataKey: 'difficulty' },
      { header: 'Tipo de Héroe', dataKey: 'herotype' },
      { header: 'Rol', dataKey: 'role' },
      { header: 'Daño', dataKey: 'damage' },
      { header: 'Estilo', dataKey: 'style' },
      { header: 'Recurso', dataKey: 'resource' },
      { header: 'Rango', dataKey: 'rangetype' },
      { header: 'Fecha', dataKey: 'date' },
      { header: 'Versión', dataKey: 'patch' },
      { header: 'BE', dataKey: 'be' },
      { header: 'RP', dataKey: 'rp' },
    ];

    const tableRows = data.map((champ) => ({
      id: champ.id || 'N/A',
      apiname: champ.apiname || 'N/A',
      fullname: champ.fullname || 'N/A',
      nickname: champ.nickname || 'N/A',
      title: champ.title || 'N/A',
      difficulty: champ.difficulty || 'N/A',
      herotype: champ.herotype || 'N/A',
      role: champ.role || 'N/A',
      damage: champ.damage || 'N/A',
      style: champ.style || 'N/A',
      resource: champ.resource || 'N/A',
      rangetype: champ.rangetype || 'N/A',
      date: champ.date || 'N/A',
      patch: champ.patch || 'N/A',
      be: champ.be || 'N/A',
      rp: champ.rp || 'N/A',
    }));

    // Estilos de la tabla
    const tableStyles = {
      startY: 125,
      margin: { left: marginLeft, right: marginRight },
      styles: {
        fontSize: 8,
        cellPadding: 4,
        overflow: 'linebreak',
        halign: 'left',
        valign: 'middle',
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
        fontSize: 9,
      },
      bodyStyles: {
        fillColor: [236, 240, 241],
        textColor: [44, 62, 80],
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255],
      },
      columnStyles: {
        id: { cellWidth: 30 },
        apiname: { cellWidth: 60 },
        fullname: { cellWidth: 80 },
        nickname: { cellWidth: 70 },
        title: { cellWidth: 80 },
        difficulty: { cellWidth: 40, halign: 'center' },
        herotype: { cellWidth: 60, halign: 'center' },
        role: { cellWidth: 50, halign: 'center' },
        damage: { cellWidth: 40, halign: 'center' },
        style: { cellWidth: 40, halign: 'center' },
        resource: { cellWidth: 50, halign: 'center' },
        rangetype: { cellWidth: 50, halign: 'center' },
        date: { cellWidth: 50, halign: 'center' },
        patch: { cellWidth: 40, halign: 'center' },
        be: { cellWidth: 30, halign: 'right' },
        rp: { cellWidth: 30, halign: 'right' },
      },
    };

    // Añadir la tabla al documento PDF
    doc.autoTable({
      columns: tableColumns,
      body: tableRows,
      ...tableStyles,
    });

    // Añadir números de página
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.text(
        `Página ${i} de ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 20,
        { align: 'center' }
      );
    }

    // Descargar el PDF
    doc.save('informe_campeones.pdf');
  };

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Generar Informe</h1>
      <form>
        <label>
          Dificultad:
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="">Todas</option>
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>
                {diff}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Tipo de Héroe:
          <select value={heroType} onChange={(e) => setHeroType(e.target.value)}>
            <option value="">Todos</option>
            {heroTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="button" onClick={handlePrint}>
          Imprimir Informe
        </button>
      </form>

      {/* Añadimos los gráficos debajo del formulario */}
      <div style={{ maxWidth: '600px', margin: '40px auto' }}>
        <h2>Gráfico de Barras: Campeones por Rol</h2>
        {roleData ? (
          <div style={{ height: '250px' }}>
            <Bar
              data={roleData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return ` ${context.parsed.y} campeones`;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: { autoSkip: false },
                  },
                  y: {
                    beginAtZero: true,
                    precision: 0,
                  },
                },
              }}
            />
          </div>
        ) : (
          <p>No hay datos disponibles para el gráfico de roles.</p>
        )}

        <h2>Gráfico Circular: Campeones por Posición</h2>
        {positionData ? (
          <div style={{ height: '250px' }}>
            <Pie
              data={positionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        return ` ${label}: ${value} campeones`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        ) : (
          <p>No hay datos disponibles para el gráfico de posiciones.</p>
        )}
      </div>
    </div>
  );
}

export default Informes;
