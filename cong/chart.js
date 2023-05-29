var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    
    data: {
        labels: ['Usa', 'Italy', 'Spain', 'France', 'England', 'Belgium', 'Iran', 'China', 'Germany', 'Netherlands'],
        datasets: [{
            label: '# of Votes',
            data: [40661, 23660, 20453, 19718, 16060, 5683,5118,4636,4586,3684],
            backgroundColor: [
                
                'rgba(255, 50, 50, 1)',
                'rgba(100, 50, 255, 1)',
                'rgba(255, 255, 0, 1)',
                'rgba(39, 43, 180, 1)',
                'rgba(153, 0, 153, 1)',
                'rgba(255, 192, 203, 1)',
                'rgba(0, 0, 0, 1)',
                'rgba(0, 255, 0, 1)',
                'rgba(255, 165, 0, 1)',
                'rgba(123, 159, 64, 1)'
              
            ],
            borderColor: [
                'rgba(255, 50, 50, 1)',
                'rgba(100, 50, 255, 1)',
                'rgba(255, 255, 0, 1)',
                'rgba(39, 43, 180, 1)',
                'rgba(153, 0, 153, 1)',
                'rgba(255, 192, 203, 1)',
                'rgba(0, 0, 0, 1)',
                'rgba(0, 255, 0, 1)',
                'rgba(255, 165, 0, 1)',
                'rgba(123, 159, 64, 1)'
              
                
            ],
           
            borderWidth: 1
        }]
    },
    options: {
       responsive: true,
    }
});
