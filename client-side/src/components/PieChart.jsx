import React, { useEffect, useRef }from 'react'
import Chart from 'chart.js/auto';

const PieChart = ({data}) => {

  const chartContainer = useRef(null)

  const computePercentages = () => {
    if (localStorage.getItem('projects')) {
        const project = JSON.parse(localStorage.getItem('projects'))

        const ongoing = project.filter((data) => data.status === 'ongoing')
        const completed = project.filter((data) => data.status === 'completed')

        const ongoingPercentage = (ongoing.length / project.length) * 100
        const completedPercentage = (completed.length / project.length) * 100

        return [ongoingPercentage, completedPercentage]
    }
}


  useEffect(() => {
    let chartInstance = null;
  
    if (chartContainer && chartContainer.current) {
      if (chartInstance) {
        chartInstance.destroy(); 
      }
  
      chartInstance = new Chart(chartContainer.current, {
        type: 'pie',
        data: {
          labels: ['ongoing', 'completed'],
          datasets: [{
            label: 'Procurement',
            data: computePercentages(),
            backgroundColor: [
              '#69ddff',
              '#004481',
            ],
          }],
        },
        options: {
       
        },
      });
    }
  
    return () => {
      if (chartInstance) {
        chartInstance.destroy(); // Cleanup on component unmount
      }
    };
  }, [data]);


  return (
    <canvas ref={chartContainer} />
  )
}

export default PieChart